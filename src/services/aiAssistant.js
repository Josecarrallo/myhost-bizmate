// AI Assistant Service
// OPCIÓN B: UI completa + OpenAI Integration (COS-focused)

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase.js';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for development, move to backend in production
});

const supabaseHeaders = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

// COS System Prompt
const COS_SYSTEM_PROMPT = `You are an Internal PMS AI Assistant for MY HOST BizMate.

CRITICAL CONTEXT: You are analyzing REAL business data from the user's live database. The "Business Context" section below contains actual metrics extracted from their Supabase database TODAY. This is NOT hypothetical or future data - it is their current operational reality.

YOUR KNOWLEDGE CUTOFF DOES NOT APPLY TO USER DATA. When the user asks about "2024", "2025", or any date, they are asking about THEIR bookings/revenue data, which is provided to you in the context. Answer based on the provided metrics, not general knowledge.

Scope - You can ONLY answer about:
- Their bookings data (use the exact revenue, occupancy, ADR provided)
- Their guests
- Their payments
- Their revenue (from the context - any date range)
- Their occupancy metrics
- Their properties
- Their operational performance

Refuse ONLY if the question is about:
- General world knowledge
- Other businesses
- Predictions without data
- Topics unrelated to property management

Response Format:
1. Executive Summary (3-5 bullets with exact numbers from Business Context)
2. What's happening (analyze the provided metrics)
3. Recommendations (max 5, specific to their data)
4. Next Actions (clear checklist)

Be direct, data-driven, and actionable.`;

export const aiAssistantService = {
  // =====================================================
  // KPIs - Key Performance Indicators
  // =====================================================

  /**
   * Get all KPIs for a tenant in a date range
   * @param {string} tenantId - User/Tenant UUID
   * @param {string} dateFrom - Date string (YYYY-MM-DD)
   * @param {string} dateTo - Date string (YYYY-MM-DD)
   */
  async getKPIs(tenantId, dateFrom, dateTo) {
    try {
      const [occupancy, revenue, adr, checkIns, payments, alerts] = await Promise.all([
        this.getOccupancyRate(tenantId, dateFrom, dateTo),
        this.getTotalRevenue(tenantId, dateFrom, dateTo),
        this.getADR(tenantId, dateFrom, dateTo),
        this.getUpcomingCheckIns(tenantId, dateFrom, dateTo),
        this.getOutstandingPayments(tenantId),
        this.getActiveAlerts(tenantId)
      ]);

      return {
        occupancy,
        revenue,
        adr,
        upcomingCheckIns: checkIns.length,
        outstandingPayments: payments.total,
        alertsCount: alerts.length,
        checkInsList: checkIns,
        paymentsList: payments.list,
        alertsList: alerts
      };
    } catch (error) {
      console.error('Error fetching KPIs:', error);
      throw error;
    }
  },

  /**
   * Calculate occupancy rate
   */
  async getOccupancyRate(tenantId, dateFrom, dateTo) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/calculate_occupancy_rate`,
      {
        method: 'POST',
        headers: supabaseHeaders,
        body: JSON.stringify({
          p_tenant_id: tenantId,
          p_date_from: dateFrom,
          p_date_to: dateTo
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to calculate occupancy rate');
    }

    return response.json();
  },

  /**
   * Calculate total revenue
   */
  async getTotalRevenue(tenantId, dateFrom, dateTo) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/calculate_total_revenue`,
      {
        method: 'POST',
        headers: supabaseHeaders,
        body: JSON.stringify({
          p_tenant_id: tenantId,
          p_date_from: dateFrom,
          p_date_to: dateTo
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to calculate revenue');
    }

    return response.json();
  },

  /**
   * Calculate ADR (Average Daily Rate)
   */
  async getADR(tenantId, dateFrom, dateTo) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/calculate_adr`,
      {
        method: 'POST',
        headers: supabaseHeaders,
        body: JSON.stringify({
          p_tenant_id: tenantId,
          p_date_from: dateFrom,
          p_date_to: dateTo
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to calculate ADR');
    }

    return response.json();
  },

  /**
   * Get upcoming check-ins
   */
  async getUpcomingCheckIns(tenantId, dateFrom, dateTo) {
    // First, get all properties for this tenant
    const propsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/properties?select=id,name&owner_id=eq.${tenantId}`,
      {
        headers: supabaseHeaders
      }
    );

    if (!propsResponse.ok) {
      throw new Error('Failed to fetch properties');
    }

    const properties = await propsResponse.json();
    const propertyIds = properties.map(p => p.id);

    // If no properties, return empty array
    if (propertyIds.length === 0) {
      return [];
    }

    // Then get bookings for those properties
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/bookings?select=*&property_id=in.(${propertyIds.join(',')})&check_in=gte.${dateFrom}&check_in=lte.${dateTo}&status=eq.confirmed&order=check_in.asc`,
      {
        headers: supabaseHeaders
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch check-ins');
    }

    return response.json();
  },

  /**
   * Get outstanding payments
   */
  async getOutstandingPayments(tenantId) {
    // First, get all properties for this tenant
    const propsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/properties?select=id&owner_id=eq.${tenantId}`,
      {
        headers: supabaseHeaders
      }
    );

    if (!propsResponse.ok) {
      throw new Error('Failed to fetch properties');
    }

    const properties = await propsResponse.json();
    const propertyIds = properties.map(p => p.id);

    // If no properties, return 0
    if (propertyIds.length === 0) {
      return { total: 0, list: [] };
    }

    // Then get payments for those properties
    const paymentsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/payments?property_id=in.(${propertyIds.join(',')})&status=in.(pending,partial)`,
      {
        headers: supabaseHeaders
      }
    );

    if (!paymentsResponse.ok) {
      throw new Error('Failed to fetch outstanding payments');
    }

    const data = await paymentsResponse.json();
    const total = data.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0);

    return {
      total,
      list: data
    };
  },

  /**
   * Get active alerts
   */
  async getActiveAlerts(tenantId) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/alerts?tenant_id=eq.${tenantId}&is_dismissed=eq.false&order=created_at.desc`,
      {
        headers: supabaseHeaders
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch alerts');
    }

    return response.json();
  },

  // =====================================================
  // USAGE TRACKING - Monthly Limits
  // =====================================================

  /**
   * Check if tenant can send more messages this month
   */
  async checkUsageLimit(tenantId) {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/increment_ai_usage`,
        {
          method: 'POST',
          headers: supabaseHeaders,
          body: JSON.stringify({
            p_tenant_id: tenantId
          })
        }
      );

      if (!response.ok) {
        console.error('Failed to check usage limit');
        return true; // Fail open - allow message if check fails
      }

      const canSend = await response.json();
      return canSend;
    } catch (error) {
      console.error('Error checking usage limit:', error);
      return true; // Fail open
    }
  },

  /**
   * Increment usage counter (already done by checkUsageLimit)
   * This is a no-op since increment_ai_usage handles both check and increment
   */
  async incrementUsage(tenantId) {
    // Already handled by checkUsageLimit
    return true;
  },

  /**
   * Check rate limiting: max 5 messages every 2 minutes
   * @param {string} tenantId - User/Tenant UUID
   * @returns {object} { allowed: boolean, waitSeconds: number }
   */
  async checkRateLimit(tenantId) {
    try {
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/ai_chat_history_v2?tenant_id=eq.${tenantId}&created_at=gte.${twoMinutesAgo}&select=created_at`,
        {
          headers: supabaseHeaders
        }
      );

      if (!response.ok) {
        console.error('Failed to check rate limit');
        return { allowed: true, waitSeconds: 0 }; // Fail open
      }

      const recentMessages = await response.json();

      if (recentMessages.length >= 5) {
        // Calculate how long to wait
        const oldestMessage = new Date(recentMessages[recentMessages.length - 1].created_at);
        const waitUntil = new Date(oldestMessage.getTime() + 2 * 60 * 1000);
        const waitSeconds = Math.ceil((waitUntil - Date.now()) / 1000);

        return {
          allowed: false,
          waitSeconds: Math.max(0, waitSeconds)
        };
      }

      return { allowed: true, waitSeconds: 0 };
    } catch (error) {
      console.error('Error checking rate limit:', error);
      return { allowed: true, waitSeconds: 0 }; // Fail open
    }
  },

  // =====================================================
  // AI CHAT - Main endpoint
  // =====================================================

  /**
   * Send message to AI Assistant (OpenAI Integration - Opción B)
   * @param {string} tenantId - User/Tenant UUID
   * @param {string} message - User message
   * @param {object} options - { contextMode, dateFrom, dateTo }
   */
  async sendMessage(tenantId, message, options = {}) {
    const startTime = Date.now();

    try {
      // 1. Check rate limiting (5 messages every 2 minutes)
      const rateLimit = await this.checkRateLimit(tenantId);

      if (!rateLimit.allowed) {
        const minutes = Math.floor(rateLimit.waitSeconds / 60);
        const seconds = rateLimit.waitSeconds % 60;
        const waitTime = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

        return {
          reply: `⏱️ Rate limit reached. You can send up to 5 messages every 2 minutes.\n\nPlease wait ${waitTime} before sending another message.`,
          rateLimited: true,
          kpis: {},
          alerts: [],
          actionsSuggested: []
        };
      }

      // 2. Check monthly usage limit
      const canSend = await this.checkUsageLimit(tenantId);

      if (!canSend) {
        return {
          reply: "🚫 You've reached your monthly AI usage limit (300 messages/month).\n\nPlease upgrade your plan or wait until next month to continue using the AI Assistant.",
          limitReached: true,
          kpis: {},
          alerts: [],
          actionsSuggested: []
        };
      }

      // 3. Get KPIs
      const dateFrom = options.dateFrom || new Date().toISOString().split('T')[0];
      const dateTo = options.dateTo || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const kpis = await this.getKPIs(tenantId, dateFrom, dateTo);

      // 4. Build context for OpenAI
      const contextData = {
        occupancy: `${kpis.occupancy}%`,
        revenue: `$${kpis.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        adr: `$${kpis.adr}`,
        upcomingCheckIns: kpis.upcomingCheckIns,
        outstandingPayments: `$${kpis.outstandingPayments.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        activeAlerts: kpis.alertsCount,
        dateRange: `${dateFrom} to ${dateTo}`
      };

      // 5. Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: COS_SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: `User question: ${message}\n\nBusiness Context (${contextData.dateRange}):\n${JSON.stringify(contextData, null, 2)}`
          }
        ],
        max_tokens: parseInt(import.meta.env.VITE_OPENAI_MAX_TOKENS) || 500,
        temperature: parseFloat(import.meta.env.VITE_OPENAI_TEMPERATURE) || 0.2
      });

      const aiReply = completion.choices[0].message.content;

      // 6. Increment usage counter
      await this.incrementUsage(tenantId);

      // 7. Generate suggested actions
      const actionsSuggested = this._generateActions(message, kpis);

      // 8. Save to history
      const chatHistory = await this.saveChatHistory({
        tenant_id: tenantId,
        message,
        response: aiReply,
        context_mode: options.contextMode || 'overview',
        date_range_from: dateFrom,
        date_range_to: dateTo,
        kpis_snapshot: kpis,
        actions_suggested: actionsSuggested,
        response_time_ms: Date.now() - startTime
      });

      // 9. Save AI run
      await this.saveAIRun({
        tenant_id: tenantId,
        chat_history_id: chatHistory.id,
        request_payload: { tenantId, message, options },
        response_payload: { reply: aiReply, kpis, actions: actionsSuggested },
        provider: 'openai',
        model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini',
        latency_ms: Date.now() - startTime,
        status: 'success'
      });

      // 10. Save audit log
      await this.saveAuditLog({
        tenant_id: tenantId,
        performed_by_user_id: tenantId,
        action: 'ai_chat_message',
        resource_type: 'ai_chat',
        resource_id: chatHistory.id,
        new_values: { message, response: aiReply }
      });

      return {
        reply: aiReply,
        kpis,
        alerts: kpis.alertsList,
        actionsSuggested,
        chatHistoryId: chatHistory.id
      };
    } catch (error) {
      console.error('Error in sendMessage:', error);

      // Save failed AI run
      await this.saveAIRun({
        tenant_id: tenantId,
        request_payload: { tenantId, message, options },
        response_payload: {},
        provider: 'openai',
        status: 'error',
        error_message: error.message,
        latency_ms: Date.now() - startTime
      });

      throw error;
    }
  },

  /**
   * Generate placeholder AI response (RULE-BASED)
   * This will be replaced with real AI in Opción B
   */
  _generatePlaceholderResponse(message, kpis, contextMode) {
    const messageLower = message.toLowerCase();

    // Occupancy questions
    if (messageLower.includes('occupancy') || messageLower.includes('ocupación')) {
      return {
        reply: `Your current occupancy rate is ${kpis.occupancy}%. ${kpis.occupancy < 70 ? 'This is below the target of 70%. I recommend adjusting pricing or running a promotion.' : 'Great job! You are above the 70% target.'}`
      };
    }

    // Revenue questions
    if (messageLower.includes('revenue') || messageLower.includes('ingresos') || messageLower.includes('ganancia')) {
      return {
        reply: `Your total revenue is $${kpis.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}. Your ADR (Average Daily Rate) is $${kpis.adr}. ${kpis.revenue > 5000 ? 'Excellent performance!' : 'Consider optimizing your pricing strategy.'}`
      };
    }

    // Check-ins questions
    if (messageLower.includes('check') || messageLower.includes('arrival') || messageLower.includes('llegada')) {
      return {
        reply: `You have ${kpis.upcomingCheckIns} upcoming check-ins. ${kpis.upcomingCheckIns > 0 ? 'Make sure all properties are ready!' : 'No check-ins scheduled for this period.'}`
      };
    }

    // Payments questions
    if (messageLower.includes('payment') || messageLower.includes('pago') || messageLower.includes('pending')) {
      return {
        reply: `You have $${kpis.outstandingPayments.toLocaleString('en-US', { minimumFractionDigits: 2 })} in outstanding payments. ${kpis.outstandingPayments > 1000 ? 'I recommend sending payment reminders to guests.' : 'Your payments are looking good!'}`
      };
    }

    // Alerts questions
    if (messageLower.includes('alert') || messageLower.includes('problem') || messageLower.includes('issue')) {
      return {
        reply: `You have ${kpis.alertsCount} active alerts. ${kpis.alertsCount > 0 ? 'Please review them in the Alerts section.' : 'No active alerts - everything looks good!'}`
      };
    }

    // Default response
    return {
      reply: `I can help you with:\n\n• Occupancy analysis (${kpis.occupancy}% current)\n• Revenue insights ($${kpis.revenue.toLocaleString()})\n• Upcoming check-ins (${kpis.upcomingCheckIns})\n• Outstanding payments ($${kpis.outstandingPayments.toLocaleString()})\n• Active alerts (${kpis.alertsCount})\n\nWhat would you like to know?`
    };
  },

  /**
   * Generate action suggestions based on KPIs
   */
  _generateActions(message, kpis) {
    const actions = [];

    // Low occupancy action
    if (kpis.occupancy < 70) {
      actions.push({
        id: 'adjust_pricing',
        type: 'pricing',
        title: 'Adjust pricing for low occupancy',
        description: 'Reduce prices by 10-15% to increase bookings',
        priority: 'high',
        disabled: true // Not executable in Opción C
      });
    }

    // Outstanding payments action
    if (kpis.outstandingPayments > 500) {
      actions.push({
        id: 'send_payment_reminders',
        type: 'communication',
        title: 'Send payment reminders',
        description: `Send WhatsApp reminders for $${kpis.outstandingPayments.toLocaleString()} pending`,
        priority: 'medium',
        disabled: true
      });
    }

    // Upcoming check-ins action
    if (kpis.upcomingCheckIns > 0) {
      actions.push({
        id: 'prepare_properties',
        type: 'operations',
        title: 'Prepare properties for check-ins',
        description: `Create housekeeping tasks for ${kpis.upcomingCheckIns} arrivals`,
        priority: 'high',
        disabled: true
      });
    }

    return actions;
  },

  // =====================================================
  // CHAT HISTORY
  // =====================================================

  async getChatHistory(tenantId, limit = 50) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/ai_chat_history_v2?tenant_id=eq.${tenantId}&order=created_at.desc&limit=${limit}`,
      {
        headers: supabaseHeaders
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch chat history');
    }

    return response.json();
  },

  async saveChatHistory(data) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/ai_chat_history_v2`,
      {
        method: 'POST',
        headers: supabaseHeaders,
        body: JSON.stringify(data)
      }
    );

    if (!response.ok) {
      throw new Error('Failed to save chat history');
    }

    const result = await response.json();
    return result[0];
  },

  // =====================================================
  // AI RUNS
  // =====================================================

  async saveAIRun(data) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/ai_runs`,
      {
        method: 'POST',
        headers: supabaseHeaders,
        body: JSON.stringify(data)
      }
    );

    if (!response.ok) {
      throw new Error('Failed to save AI run');
    }

    return response.json();
  },

  // =====================================================
  // AUDIT LOGS
  // =====================================================

  async saveAuditLog(data) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/audit_logs`,
      {
        method: 'POST',
        headers: supabaseHeaders,
        body: JSON.stringify(data)
      }
    );

    if (!response.ok) {
      throw new Error('Failed to save audit log');
    }

    return response.json();
  },

  // =====================================================
  // ALERTS
  // =====================================================

  async createAlert(data) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/alerts`,
      {
        method: 'POST',
        headers: supabaseHeaders,
        body: JSON.stringify(data)
      }
    );

    if (!response.ok) {
      throw new Error('Failed to create alert');
    }

    return response.json();
  },

  async markAlertAsRead(alertId) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/alerts?id=eq.${alertId}`,
      {
        method: 'PATCH',
        headers: supabaseHeaders,
        body: JSON.stringify({ is_read: true })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to mark alert as read');
    }

    return response.json();
  },

  async dismissAlert(alertId) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/alerts?id=eq.${alertId}`,
      {
        method: 'PATCH',
        headers: supabaseHeaders,
        body: JSON.stringify({ is_dismissed: true })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to dismiss alert');
    }

    return response.json();
  }
};

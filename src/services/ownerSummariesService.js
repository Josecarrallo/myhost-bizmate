import { supabase } from '../lib/supabase';

/**
 * Owner Summaries Service
 * Handles queries for Daily/Weekly/Monthly owner summaries
 *
 * @see C:\myhost-bizmate\Claude AI and Code Update 20032026\MYHOST_OCS_ClaudeCode_Spec_20Mar2026.pdf
 */

/**
 * Get today's daily briefing
 * @param {string} tenantId - The owner's tenant ID
 * @returns {Promise<object|null>} Today's briefing or null
 */
export const getDailyBriefing = async (tenantId) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    console.log('🔄 getDailyBriefing called for:', { tenantId, today });

    const { data, error } = await supabase
      .from('owner_briefings')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('briefing_date', today)
      .order('generated_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('❌ Error fetching briefing:', error);
      throw error;
    }

    console.log('✅ Daily briefing:', data || 'No briefing for today');
    return data || null;
  } catch (error) {
    console.error('❌ getDailyBriefing exception:', error);
    return null;
  }
};

/**
 * Get pending owner decisions for today
 * @param {string} tenantId - The owner's tenant ID
 * @returns {Promise<Array>} Array of pending decisions
 */
export const getTodayPendingDecisions = async (tenantId) => {
  try {
    console.log('🔄 getTodayPendingDecisions called for:', tenantId);

    const { data, error } = await supabase
      .from('owner_decisions')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('status', 'pending')
      .order('priority', { ascending: true }) // urgent first
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching pending decisions:', error);
      throw error;
    }

    // Sort by priority: urgent > high > medium > low
    const PRIORITY_ORDER = { urgent: 1, high: 2, medium: 3, low: 4 };
    const sorted = (data || []).sort((a, b) =>
      PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    );

    console.log(`✅ Found ${sorted.length} pending decisions`);
    return sorted;
  } catch (error) {
    console.error('❌ getTodayPendingDecisions exception:', error);
    return [];
  }
};

/**
 * Get weekly summaries
 * @param {string} tenantId - The owner's tenant ID
 * @param {number} limit - Number of weeks to retrieve (default: 12)
 * @returns {Promise<Array>} Array of weekly summaries
 */
export const getWeeklySummaries = async (tenantId, limit = 12) => {
  try {
    console.log('🔄 getWeeklySummaries called for:', { tenantId, limit });

    const { data, error } = await supabase
      .from('owner_weekly_summaries')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('week_start', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ Error fetching weekly summaries:', error);
      throw error;
    }

    console.log(`✅ Found ${data?.length || 0} weekly summaries`);
    return data || [];
  } catch (error) {
    console.error('❌ getWeeklySummaries exception:', error);
    return [];
  }
};

/**
 * Get monthly summaries
 * @param {string} tenantId - The owner's tenant ID
 * @param {number} limit - Number of months to retrieve (default: 12)
 * @returns {Promise<Array>} Array of monthly summaries
 */
export const getMonthlySummaries = async (tenantId, limit = 12) => {
  try {
    console.log('🔄 getMonthlySummaries called for:', { tenantId, limit });

    const { data, error } = await supabase
      .from('owner_monthly_summaries')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('month_key', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ Error fetching monthly summaries:', error);
      throw error;
    }

    console.log(`✅ Found ${data?.length || 0} monthly summaries`);
    return data || [];
  } catch (error) {
    console.error('❌ getMonthlySummaries exception:', error);
    return [];
  }
};

// Export as named exports and as service object
export const ownerSummariesService = {
  getDailyBriefing,
  getTodayPendingDecisions,
  getWeeklySummaries,
  getMonthlySummaries
};

export default ownerSummariesService;

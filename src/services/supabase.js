// Supabase configuration and API service
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jjpscimtxrudtepzwhag.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0';

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const supabaseHeaders = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

export const supabaseService = {
  // Properties
  async createProperty(data) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/properties`, {
      method: 'POST',
      headers: supabaseHeaders,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create property');
    }

    return response.json();
  },

  async getProperties() {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/properties`, {
      headers: supabaseHeaders
    });

    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }

    return response.json();
  },

  // Booking Availability - CRITICAL FUNCTION
  async checkAvailability(propertyId, checkIn, checkOut) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/check_availability`,
      {
        method: 'POST',
        headers: supabaseHeaders,
        body: JSON.stringify({
          p_property_id: propertyId,
          p_check_in: checkIn,
          p_check_out: checkOut
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to check availability');
    }

    return response.json();
  },

  // Calculate Booking Price - CRITICAL FUNCTION
  async calculateBookingPrice(propertyId, checkIn, checkOut, guests) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/calculate_booking_price`,
      {
        method: 'POST',
        headers: supabaseHeaders,
        body: JSON.stringify({
          p_property_id: propertyId,
          p_check_in: checkIn,
          p_check_out: checkOut,
          p_guests: guests
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to calculate price');
    }

    return response.json();
  },

  // Create Booking
  async createBooking(bookingData) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
      method: 'POST',
      headers: supabaseHeaders,
      body: JSON.stringify(bookingData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create booking');
    }

    return response.json();
  },

  // =====================================================
  // PAYMENTS - CRUD Operations
  // =====================================================

  // Get all payments (with optional filters)
  async getPayments(filters = {}) {
    let url = `${SUPABASE_URL}/rest/v1/payments?select=*&order=transaction_date.desc`;

    // Apply filters
    if (filters.status) {
      url += `&status=eq.${filters.status}`;
    }
    if (filters.payment_method) {
      url += `&payment_method=eq.${filters.payment_method}`;
    }
    if (filters.property_id) {
      url += `&property_id=eq.${filters.property_id}`;
    }
    if (filters.booking_id) {
      url += `&booking_id=eq.${filters.booking_id}`;
    }

    const response = await fetch(url, {
      headers: supabaseHeaders
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payments');
    }

    return response.json();
  },

  // Get single payment by ID
  async getPayment(id) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/payments?id=eq.${id}`,
      {
        headers: supabaseHeaders
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch payment');
    }

    const data = await response.json();
    return data[0];
  },

  // Create new payment
  async createPayment(paymentData) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/payments`, {
      method: 'POST',
      headers: supabaseHeaders,
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create payment');
    }

    return response.json();
  },

  // Update payment
  async updatePayment(id, updates) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/payments?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: supabaseHeaders,
        body: JSON.stringify(updates)
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update payment');
    }

    return response.json();
  },

  // Delete payment
  async deletePayment(id) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/payments?id=eq.${id}`,
      {
        method: 'DELETE',
        headers: supabaseHeaders
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete payment');
    }

    return true;
  },

  // Get payment statistics
  async getPaymentStats(propertyId = null) {
    const filters = propertyId ? `?property_id=eq.${propertyId}` : '';

    const [totalRevenue, pendingPayments, completedPayments] = await Promise.all([
      fetch(
        `${SUPABASE_URL}/rest/v1/rpc/get_total_revenue${propertyId ? '' : ''}`,
        {
          method: 'POST',
          headers: supabaseHeaders,
          body: JSON.stringify(propertyId ? { p_property_id: propertyId } : {})
        }
      ).then(r => r.json()),

      fetch(
        `${SUPABASE_URL}/rest/v1/rpc/get_pending_payments_total${propertyId ? '' : ''}`,
        {
          method: 'POST',
          headers: supabaseHeaders,
          body: JSON.stringify(propertyId ? { p_property_id: propertyId } : {})
        }
      ).then(r => r.json()),

      fetch(
        `${SUPABASE_URL}/rest/v1/payments?select=count${filters}&status=eq.completed`,
        {
          headers: supabaseHeaders
        }
      ).then(r => r.json())
    ]);

    return {
      totalRevenue,
      pendingPayments,
      completedCount: completedPayments?.[0]?.count || 0
    };
  },

  // =====================================================
  // MESSAGES - CRUD Operations
  // =====================================================

  // Get all messages (with optional filters)
  async getMessages(filters = {}) {
    let url = `${SUPABASE_URL}/rest/v1/messages?select=*&order=sent_at.desc`;

    // Apply filters
    if (filters.status) {
      url += `&status=eq.${filters.status}`;
    }
    if (filters.ai_handled !== undefined) {
      url += `&ai_handled=eq.${filters.ai_handled}`;
    }
    if (filters.property_id) {
      url += `&property_id=eq.${filters.property_id}`;
    }
    if (filters.booking_id) {
      url += `&booking_id=eq.${filters.booking_id}`;
    }
    if (filters.conversation_id) {
      url += `&conversation_id=eq.${filters.conversation_id}`;
    }
    if (filters.platform) {
      url += `&platform=eq.${filters.platform}`;
    }

    const response = await fetch(url, {
      headers: supabaseHeaders
    });

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    return response.json();
  },

  // Get single message by ID
  async getMessage(id) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/messages?id=eq.${id}`,
      {
        headers: supabaseHeaders
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch message');
    }

    const data = await response.json();
    return data[0];
  },

  // Get conversation (all messages with same conversation_id)
  async getConversation(conversationId) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/messages?conversation_id=eq.${conversationId}&order=sent_at.asc`,
      {
        headers: supabaseHeaders
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch conversation');
    }

    return response.json();
  },

  // Create new message
  async createMessage(messageData) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
      method: 'POST',
      headers: supabaseHeaders,
      body: JSON.stringify(messageData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create message');
    }

    return response.json();
  },

  // Update message (e.g., mark as read)
  async updateMessage(id, updates) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/messages?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: supabaseHeaders,
        body: JSON.stringify(updates)
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update message');
    }

    return response.json();
  },

  // Mark message as read
  async markMessageAsRead(id) {
    return this.updateMessage(id, {
      status: 'read',
      read_at: new Date().toISOString()
    });
  },

  // Mark all messages as read for a conversation
  async markConversationAsRead(conversationId) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/messages?conversation_id=eq.${conversationId}`,
      {
        method: 'PATCH',
        headers: supabaseHeaders,
        body: JSON.stringify({
          status: 'read',
          read_at: new Date().toISOString()
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to mark conversation as read');
    }

    return response.json();
  },

  // Delete message
  async deleteMessage(id) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/messages?id=eq.${id}`,
      {
        method: 'DELETE',
        headers: supabaseHeaders
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete message');
    }

    return true;
  },

  // Get message statistics
  async getMessageStats(propertyId = null) {
    const [unreadCount, aiHandledCount] = await Promise.all([
      fetch(
        `${SUPABASE_URL}/rest/v1/rpc/get_unread_messages_count`,
        {
          method: 'POST',
          headers: supabaseHeaders,
          body: JSON.stringify(propertyId ? { p_property_id: propertyId } : {})
        }
      ).then(r => r.json()),

      fetch(
        `${SUPABASE_URL}/rest/v1/rpc/get_ai_handled_messages_count`,
        {
          method: 'POST',
          headers: supabaseHeaders,
          body: JSON.stringify(propertyId ? { p_property_id: propertyId } : {})
        }
      ).then(r => r.json())
    ]);

    return {
      unreadCount,
      aiHandledCount
    };
  },

  // Subscribe to new messages (Realtime)
  subscribeToMessages(callback, filters = {}) {
    // Note: This requires Supabase Realtime to be enabled
    // Returns an unsubscribe function
    const channel = `messages${filters.property_id ? `:property_id=eq.${filters.property_id}` : ''}`;

    // This is a placeholder - actual implementation would use Supabase Realtime client
    // For now, we'll use polling as a fallback
    console.log('Realtime subscriptions require Supabase Realtime client library');
    console.log('Channel:', channel);

    // Return a cleanup function
    return () => {
      console.log('Unsubscribed from messages');
    };
  }
};

export { SUPABASE_URL, SUPABASE_ANON_KEY };

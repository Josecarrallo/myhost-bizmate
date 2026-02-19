// Supabase service - Refactored to use singleton client with JWT authentication
// All queries now use the authenticated Supabase client for proper RLS support
import { supabase } from '../lib/supabase';

export const supabaseService = {
  // =====================================================
  // PROPERTIES - CRUD Operations
  // =====================================================

  async createProperty(data) {
    const { data: villa, error } = await supabase
      .from('villas')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message || 'Failed to create villa');
    return villa;
  },

  async getProperties(filters = {}) {
    let query = supabase.from('properties').select('*');

    if (filters.owner_id) {
      query = query.eq('owner_id', filters.owner_id);
    }
    if (filters.tenant_id) {
      query = query.eq('tenant_id', filters.tenant_id);
    }

    const { data, error } = await query;
    if (error) throw new Error('Failed to fetch properties');
    return data;
  },

  // =====================================================
  // BOOKING AVAILABILITY & PRICING
  // =====================================================

  async checkAvailability(propertyId, checkIn, checkOut) {
    const { data, error } = await supabase.rpc('check_availability', {
      p_property_id: propertyId,
      p_check_in: checkIn,
      p_check_out: checkOut
    });

    if (error) throw new Error(error.message || 'Failed to check availability');
    return data;
  },

  async calculateBookingPrice(propertyId, checkIn, checkOut, guests) {
    const { data, error } = await supabase.rpc('calculate_booking_price', {
      p_property_id: propertyId,
      p_check_in: checkIn,
      p_check_out: checkOut,
      p_guests: guests
    });

    if (error) throw new Error(error.message || 'Failed to calculate price');
    return data;
  },

  // =====================================================
  // BOOKINGS - CRUD Operations
  // =====================================================

  async getBookings(filters = {}) {
    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.payment_status) {
      query = query.eq('payment_status', filters.payment_status);
    }
    if (filters.property_id) {
      query = query.eq('property_id', filters.property_id);
    }
    if (filters.villa_id) {
      query = query.eq('villa_id', filters.villa_id);
    }
    if (filters.tenant_id) {
      query = query.eq('tenant_id', filters.tenant_id);
    }
    if (filters.guest_name) {
      query = query.ilike('guest_name', `%${filters.guest_name}%`);
    }
    if (filters.check_in_gte) {
      query = query.gte('check_in', filters.check_in_gte);
    }
    if (filters.check_in_lte) {
      query = query.lte('check_in', filters.check_in_lte);
    }

    const { data, error } = await query;
    if (error) throw new Error('Failed to fetch bookings');
    return data;
  },

  async getBooking(id) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error('Failed to fetch booking');
    return data;
  },

  async createBooking(bookingData) {
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();

    if (error) throw new Error(error.message || 'Failed to create booking');
    return data;
  },

  async updateBooking(id, updates) {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message || 'Failed to update booking');
    return data;
  },

  async deleteBooking(id) {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message || 'Failed to delete booking');
    return true;
  },

  // =====================================================
  // PAYMENTS - CRUD Operations
  // =====================================================

  async getPayments(filters = {}) {
    let query = supabase
      .from('payments')
      .select('*')
      .order('transaction_date', { ascending: false });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.payment_method) {
      query = query.eq('payment_method', filters.payment_method);
    }
    if (filters.property_id) {
      query = query.eq('property_id', filters.property_id);
    }
    if (filters.booking_id) {
      query = query.eq('booking_id', filters.booking_id);
    }
    if (filters.tenant_id) {
      query = query.eq('tenant_id', filters.tenant_id);
    }

    const { data, error } = await query;
    if (error) throw new Error('Failed to fetch payments');
    return data;
  },

  async getPayment(id) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error('Failed to fetch payment');
    return data;
  },

  async createPayment(paymentData) {
    const { data, error } = await supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single();

    if (error) throw new Error(error.message || 'Failed to create payment');
    return data;
  },

  async updatePayment(id, updates) {
    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message || 'Failed to update payment');
    return data;
  },

  async deletePayment(id) {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message || 'Failed to delete payment');
    return true;
  },

  async getPaymentStats(propertyId = null) {
    // Note: These RPC functions need to exist in Supabase
    // If they don't exist yet, this will fail gracefully
    try {
      const { data: totalRevenue, error: revenueError } = await supabase
        .rpc('get_total_revenue', propertyId ? { p_property_id: propertyId } : {});

      const { data: pendingPayments, error: pendingError } = await supabase
        .rpc('get_pending_payments_total', propertyId ? { p_property_id: propertyId } : {});

      let completedQuery = supabase
        .from('payments')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'completed');

      if (propertyId) {
        completedQuery = completedQuery.eq('property_id', propertyId);
      }

      const { count: completedCount, error: countError } = await completedQuery;

      return {
        totalRevenue: revenueError ? 0 : totalRevenue,
        pendingPayments: pendingError ? 0 : pendingPayments,
        completedCount: countError ? 0 : completedCount
      };
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      return {
        totalRevenue: 0,
        pendingPayments: 0,
        completedCount: 0
      };
    }
  },

  // =====================================================
  // MESSAGES - CRUD Operations
  // =====================================================

  async getMessages(filters = {}) {
    let query = supabase
      .from('messages')
      .select('*')
      .order('sent_at', { ascending: false });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.ai_handled !== undefined) {
      query = query.eq('ai_handled', filters.ai_handled);
    }
    if (filters.property_id) {
      query = query.eq('property_id', filters.property_id);
    }
    if (filters.booking_id) {
      query = query.eq('booking_id', filters.booking_id);
    }
    if (filters.conversation_id) {
      query = query.eq('conversation_id', filters.conversation_id);
    }
    if (filters.platform) {
      query = query.eq('platform', filters.platform);
    }
    if (filters.tenant_id) {
      query = query.eq('tenant_id', filters.tenant_id);
    }

    const { data, error } = await query;
    if (error) throw new Error('Failed to fetch messages');
    return data;
  },

  async getMessage(id) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error('Failed to fetch message');
    return data;
  },

  async getConversation(conversationId) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('sent_at', { ascending: true });

    if (error) throw new Error('Failed to fetch conversation');
    return data;
  },

  async createMessage(messageData) {
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();

    if (error) throw new Error(error.message || 'Failed to create message');
    return data;
  },

  async updateMessage(id, updates) {
    const { data, error } = await supabase
      .from('messages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message || 'Failed to update message');
    return data;
  },

  async markMessageAsRead(id) {
    return this.updateMessage(id, {
      status: 'read',
      read_at: new Date().toISOString()
    });
  },

  async markConversationAsRead(conversationId) {
    const { data, error } = await supabase
      .from('messages')
      .update({
        status: 'read',
        read_at: new Date().toISOString()
      })
      .eq('conversation_id', conversationId)
      .select();

    if (error) throw new Error(error.message || 'Failed to mark conversation as read');
    return data;
  },

  async deleteMessage(id) {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message || 'Failed to delete message');
    return true;
  },

  async getMessageStats(propertyId = null) {
    try {
      const { data: unreadCount, error: unreadError } = await supabase
        .rpc('get_unread_messages_count', propertyId ? { p_property_id: propertyId } : {});

      const { data: aiHandledCount, error: aiError } = await supabase
        .rpc('get_ai_handled_messages_count', propertyId ? { p_property_id: propertyId } : {});

      return {
        unreadCount: unreadError ? 0 : unreadCount,
        aiHandledCount: aiError ? 0 : aiHandledCount
      };
    } catch (error) {
      console.error('Error fetching message stats:', error);
      return {
        unreadCount: 0,
        aiHandledCount: 0
      };
    }
  },

  subscribeToMessages(callback, filters = {}) {
    // Subscribe to realtime changes on messages table
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: filters.property_id ? `property_id=eq.${filters.property_id}` : undefined
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  },

  // =====================================================
  // BUSINESS REPORTS - Get data for owner reports
  // =====================================================

  async getOwnerBusinessReportData(ownerId) {
    try {
      // Get properties for this owner
      const { data: properties, error: propError } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', ownerId);

      if (propError) throw new Error('Failed to fetch properties');

      if (!properties || properties.length === 0) {
        return {
          owner: { id: ownerId },
          properties: [],
          bookings: [],
          payments: [],
          leads: [],
          metrics: {
            totalRevenue: 0,
            totalBookings: 0,
            occupancyRate: 0,
            avgNightlyRate: 0,
            totalNights: 0
          }
        };
      }

      const propertyIds = properties.map(p => p.id);

      // Get all bookings for these properties
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .in('property_id', propertyIds);

      if (bookingsError) throw new Error('Failed to fetch bookings');

      // Get all payments for these properties
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .in('property_id', propertyIds);

      if (paymentsError) throw new Error('Failed to fetch payments');

      // Get all leads for these properties
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .in('property_id', propertyIds);

      // Calculate metrics
      const totalRevenue = (bookings || []).reduce((sum, b) => sum + (b.total_price || 0), 0);
      const totalBookings = (bookings || []).length;

      const totalNights = (bookings || []).reduce((sum, b) => {
        if (b.check_in && b.check_out) {
          const checkIn = new Date(b.check_in);
          const checkOut = new Date(b.check_out);
          const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
          return sum + (nights > 0 ? nights : 0);
        }
        return sum;
      }, 0);

      const daysInPeriod = 365;
      const totalPossibleNights = propertyIds.length * daysInPeriod;
      const occupancyRate = totalPossibleNights > 0 && totalNights > 0
        ? (totalNights / totalPossibleNights) * 100
        : 0;

      const avgNightlyRate = totalNights > 0 && totalRevenue > 0
        ? totalRevenue / totalNights
        : 0;

      return {
        owner: { id: ownerId },
        properties,
        bookings: bookings || [],
        payments: payments || [],
        leads: leadsError ? [] : (leads || []),
        metrics: {
          totalRevenue,
          totalBookings,
          occupancyRate: Math.round(occupancyRate * 10) / 10,
          avgNightlyRate: Math.round(avgNightlyRate * 100) / 100,
          totalNights
        }
      };
    } catch (error) {
      console.error('Error fetching business report data:', error);
      throw error;
    }
  },

  // =====================================================
  // LEADS - CRUD Operations
  // =====================================================

  async getLeads(filters = {}) {
    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.property_id) {
      query = query.eq('property_id', filters.property_id);
    }
    if (filters.tenant_id) {
      query = query.eq('tenant_id', filters.tenant_id);
    }

    const { data, error } = await query;
    if (error) throw new Error('Failed to fetch leads');
    return data;
  },

  async createLead(leadData) {
    const { data, error } = await supabase
      .from('leads')
      .insert(leadData)
      .select()
      .single();

    if (error) throw new Error(error.message || 'Failed to create lead');
    return data;
  },

  async updateLead(id, updates) {
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message || 'Failed to update lead');
    return data;
  },

  async deleteLead(id) {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message || 'Failed to delete lead');
    return { success: true };
  },

  // =====================================================
  // VILLAS - Read Operations
  // =====================================================

  async getVillas(filters = {}) {
    let query = supabase.from('villas').select('*');

    if (filters.tenant_id) {
      query = query.eq('tenant_id', filters.tenant_id);
    }

    const { data, error } = await query;
    if (error) throw new Error('Failed to fetch villas');
    return data;
  },

  async uploadVillaPhoto(file, villaId) {
    const ext = file.name.split('.').pop().toLowerCase();
    const fileName = `${villaId}/${Date.now()}.${ext}`;

    // Ensure bucket exists (creates if not)
    await supabase.storage.createBucket('villa-photos', { public: true }).catch(() => {});

    const { error: uploadError } = await supabase.storage
      .from('villa-photos')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage.from('villa-photos').getPublicUrl(fileName);
    return data.publicUrl;
  },

  async updateVilla(id, updates) {
    const { data, error} = await supabase
      .from('villas')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message || 'Failed to update villa');
    return data;
  },

  async deleteVilla(id) {
    const { error } = await supabase
      .from('villas')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message || 'Failed to delete villa');
    return true;
  },

  // =====================================================
  // GUESTS - Read Operations
  // =====================================================

  async getGuests(filters = {}) {
    let query = supabase.from('guests').select('*');

    if (filters.tenant_id) {
      query = query.eq('tenant_id', filters.tenant_id);
    }

    const { data, error } = await query;
    if (error) throw new Error('Failed to fetch guests');
    return data;
  },

  // =====================================================
  // TASKS (Autopilot Actions) - CRUD Operations
  // =====================================================

  async createTask(taskData) {
    const { data, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select()
      .single();

    if (error) throw new Error(error.message || 'Failed to create task');
    return data;
  },

  async getTasks(filters = {}) {
    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false});

    if (filters.tenant_id) {
      query = query.eq('tenant_id', filters.tenant_id);
    }
    if (filters.property_id) {
      query = query.eq('property_id', filters.property_id);
    }
    if (filters.villa_id) {
      query = query.eq('villa_id', filters.villa_id);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw new Error('Failed to fetch tasks');
    return data;
  },

  async updateTask(id, updates) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message || 'Failed to update task');
    return data;
  },

  async deleteTask(id) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message || 'Failed to delete task');
    return { success: true };
  }
};

// Export URLs for backwards compatibility (if needed)
export const SUPABASE_URL = 'https://jjpscimtxrudtepzwhag.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0';

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
      // NOTE: Removed .neq('status', 'cancelled') - "All Status" must show ALL bookings
      // Revenue calculations should exclude cancelled in frontend, not here
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
      // Search in both guest_name AND confirmation_code (e.g., NIS-2026-0003)
      query = query.or(`guest_name.ilike.%${filters.guest_name}%,confirmation_code.ilike.%${filters.guest_name}%`);
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
    // Delete all related records before deleting the booking (cascade delete)

    // 1. Delete tasks
    const { error: tasksError } = await supabase
      .from('tasks')
      .delete()
      .eq('booking_id', id);
    if (tasksError) console.warn('Warning deleting tasks:', tasksError.message);

    // 2. Delete service_requests (THIS WAS THE MISSING ONE!)
    const { error: serviceRequestsError } = await supabase
      .from('service_requests')
      .delete()
      .eq('booking_id', id);
    if (serviceRequestsError) console.warn('Warning deleting service_requests:', serviceRequestsError.message);

    // Finally delete the booking
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
  },

  // =====================================================
  // MAINTENANCE ISSUES (Guest Issues) - CRUD Operations
  // =====================================================

  async getMaintenanceIssues(filters = {}) {
    let query = supabase
      .from('maintenance_issues')
      .select(`
        *,
        villa:villas!villa_id(id, name),
        booking:bookings!booking_id(id, guest_name)
      `)
      .order('created_at', { ascending: false });

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
    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }

    const { data, error } = await query;
    if (error) throw new Error('Failed to fetch maintenance issues');
    return data;
  },

  async getMaintenanceIssue(id) {
    const { data, error } = await supabase
      .from('maintenance_issues')
      .select(`
        *,
        villa:villas!villa_id(id, name),
        booking:bookings!booking_id(id, guest_name, check_in, check_out)
      `)
      .eq('id', id)
      .single();

    if (error) throw new Error('Failed to fetch maintenance issue');
    return data;
  },

  async createMaintenanceIssue(issueData) {
    const { data, error } = await supabase
      .from('maintenance_issues')
      .insert(issueData)
      .select()
      .single();

    if (error) throw new Error(error.message || 'Failed to create maintenance issue');
    return data;
  },

  async updateMaintenanceIssue(id, updates) {
    // If status is changing to 'resolved', set resolved_at to NOW
    if (updates.status === 'resolved' && !updates.resolved_at) {
      updates.resolved_at = new Date().toISOString();
    }
    // If status is changing from 'resolved' to something else, clear resolved_at
    if (updates.status && updates.status !== 'resolved') {
      updates.resolved_at = null;
    }

    const { data, error } = await supabase
      .from('maintenance_issues')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message || 'Failed to update maintenance issue');
    return data;
  },

  async deleteMaintenanceIssue(id) {
    const { error } = await supabase
      .from('maintenance_issues')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message || 'Failed to delete maintenance issue');
    return { success: true };
  },

  // =====================================================
  // WHATSAPP MESSAGES V2 - Owner Messages (READ ONLY)
  // =====================================================

  async getWhatsAppMessages(filters = {}) {
    let query = supabase
      .from('whatsapp_messages_v2')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.channel) {
      query = query.eq('channel', filters.channel);
    }
    if (filters.phone_number) {
      query = query.eq('phone_number', filters.phone_number);
    }
    if (filters.direction) {
      query = query.eq('direction', filters.direction);
    }
    if (filters.from_date) {
      query = query.gte('created_at', filters.from_date);
    }
    if (filters.to_date) {
      query = query.lte('created_at', filters.to_date);
    }
    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw new Error('Failed to fetch WhatsApp messages');
    return data;
  },

  async getWhatsAppConversation(phoneNumber, channel = null, tenantId = null) {
    // Get ALL messages for this phone number (WhatsApp + KORA unified)
    // channel parameter kept for backwards compatibility but not used
    let query = supabase
      .from('whatsapp_messages_v2')
      .select('*')
      .eq('phone_number', phoneNumber)
      .order('created_at', { ascending: true });

    // IMPORTANT: Filter by tenant_id if provided
    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { data, error } = await query;

    if (error) throw new Error('Failed to fetch conversation');
    return data;
  },

  async getWhatsAppConversationsList(tenantId = null, dateFrom = null, dateTo = null) {
    // Get all messages grouped by phone_number to build conversation list
    // Filter by tenant_id for multi-tenant security
    let query = supabase
      .from('whatsapp_messages_v2')
      .select('*')
      .order('created_at', { ascending: false });

    // IMPORTANT: Filter by tenant_id if provided
    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    // Date range filters (only if provided)
    if (dateFrom) {
      query = query.gte('created_at', dateFrom);
    }
    if (dateTo) {
      query = query.lte('created_at', dateTo + 'T23:59:59');
    }

    const { data, error } = await query;

    console.log('[getWhatsAppConversationsList] tenantId:', tenantId, 'dateFrom:', dateFrom, 'dateTo:', dateTo, 'results:', data?.length || 0);

    if (error) throw new Error('Failed to fetch conversations');

    // Group by phone_number ONLY to unify WhatsApp + KORA in same conversation
    // (Changed from phone_number + channel per user request 27-Jul-2026)
    const conversationsMap = new Map();

    (data || []).forEach(msg => {
      const key = msg.phone_number;
      if (!conversationsMap.has(key)) {
        conversationsMap.set(key, {
          phone_number: msg.phone_number,
          // channels: array of unique channels in this conversation
          channels: [msg.channel],
          guest_name: msg.guest_name,
          language_detected: msg.language_detected,
          last_message: msg,
          messages: [msg],
          unread_count: 0
        });
      } else {
        const conv = conversationsMap.get(key);
        conv.messages.push(msg);
        // Track unique channels
        if (!conv.channels.includes(msg.channel)) {
          conv.channels.push(msg.channel);
        }
        // Update language if this message has one and current doesn't
        if (msg.language_detected && !conv.language_detected) {
          conv.language_detected = msg.language_detected;
        }
      }
    });

    // Convert to array and sort by last message date
    return Array.from(conversationsMap.values())
      .sort((a, b) => new Date(b.last_message.created_at) - new Date(a.last_message.created_at));
  },

  // Search conversations by phone number OR guest name (ignores date range)
  async searchWhatsAppConversations(tenantId, searchQuery) {
    const { data, error } = await supabase
      .from('whatsapp_messages_v2')
      .select('*')
      .eq('tenant_id', tenantId)
      .or(`phone_number.ilike.%${searchQuery}%,guest_name.ilike.%${searchQuery}%`)
      .order('created_at', { ascending: false })
      .limit(500);

    if (error) throw new Error('Failed to search conversations');

    // Group by phone_number (same logic as getWhatsAppConversationsList)
    const conversationsMap = new Map();

    (data || []).forEach(msg => {
      const key = msg.phone_number;
      if (!conversationsMap.has(key)) {
        conversationsMap.set(key, {
          phone_number: msg.phone_number,
          channels: [msg.channel],
          guest_name: msg.guest_name,
          language_detected: msg.language_detected,
          last_message: msg,
          messages: [msg],
          unread_count: 0
        });
      } else {
        const conv = conversationsMap.get(key);
        conv.messages.push(msg);
        if (!conv.channels.includes(msg.channel)) {
          conv.channels.push(msg.channel);
        }
        if (msg.language_detected && !conv.language_detected) {
          conv.language_detected = msg.language_detected;
        }
      }
    });

    return Array.from(conversationsMap.values())
      .sort((a, b) => new Date(b.last_message.created_at) - new Date(a.last_message.created_at));
  },

  // Delete a single WhatsApp message by ID
  async deleteWhatsAppMessage(messageId) {
    const { error } = await supabase
      .from('whatsapp_messages_v2')
      .delete()
      .eq('id', messageId);

    if (error) throw new Error(error.message || 'Failed to delete message');
    return true;
  },

  // Delete entire conversation (all messages for a phone number)
  async deleteWhatsAppConversation(phoneNumber, tenantId) {
    const { error } = await supabase
      .from('whatsapp_messages_v2')
      .delete()
      .eq('phone_number', phoneNumber)
      .eq('tenant_id', tenantId);

    if (error) throw new Error(error.message || 'Failed to delete conversation');
    return true;
  },

  // =====================================================
  // CONVERSATION READ STATE - Track read messages
  // =====================================================

  async getConversationReadState(channel, channelUserId) {
    const { data, error } = await supabase
      .from('conversation_read_state')
      .select('*')
      .eq('channel', channel)
      .eq('channel_user_id', channelUserId)
      .maybeSingle();

    if (error) throw new Error('Failed to fetch read state');
    return data;
  },

  async updateConversationReadState(channel, channelUserId, tenantId) {
    try {
      // First try to update existing record
      const { data: existing } = await supabase
        .from('conversation_read_state')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('channel', channel)
        .eq('channel_user_id', channelUserId)
        .maybeSingle();

      const now = new Date().toISOString();

      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from('conversation_read_state')
          .update({
            last_read_at: now,
            updated_at: now
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating read state:', error);
          return null;
        }
        return data;
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('conversation_read_state')
          .insert({
            tenant_id: tenantId,
            channel: channel,
            channel_user_id: channelUserId,
            user_id: tenantId,
            last_read_at: now,
            updated_at: now
          })
          .select()
          .single();

        if (error) {
          console.error('Error inserting read state:', error);
          return null;
        }
        return data;
      }
    } catch (err) {
      console.error('Error in updateConversationReadState:', err);
      return null;
    }
  },

  // Resolve guest names from bookings/guests by phone numbers
  // Returns a map: { phoneNumber: guestName }
  async resolveGuestNamesByPhone(phoneNumbers, tenantId = null) {
    if (!phoneNumbers || phoneNumbers.length === 0) return {};

    const result = {};

    // Normalize phone numbers (remove non-digits for matching)
    const normalizedPhones = phoneNumbers.map(p => (p || '').replace(/\D/g, ''));

    try {
      // First, try to get names from bookings (most reliable source)
      let bookingsQuery = supabase
        .from('bookings')
        .select('guest_phone, guest_name')
        .not('guest_phone', 'is', null)
        .not('guest_name', 'is', null);

      if (tenantId) {
        bookingsQuery = bookingsQuery.eq('tenant_id', tenantId);
      }

      const { data: bookings } = await bookingsQuery;

      if (bookings) {
        bookings.forEach(b => {
          if (b.guest_phone && b.guest_name && b.guest_name !== 'Guest') {
            const normalizedBookingPhone = (b.guest_phone || '').replace(/\D/g, '');
            // Match if phones are equal or one contains the other (for prefix variations)
            normalizedPhones.forEach((np, idx) => {
              if (normalizedBookingPhone === np ||
                  normalizedBookingPhone.endsWith(np) ||
                  np.endsWith(normalizedBookingPhone)) {
                result[phoneNumbers[idx]] = b.guest_name;
              }
            });
          }
        });
      }

      // For phones not found in bookings, try guests table
      const missingPhones = phoneNumbers.filter(p => !result[p]);
      if (missingPhones.length > 0) {
        let guestsQuery = supabase
          .from('guests')
          .select('phone, name, full_name')
          .not('phone', 'is', null);

        if (tenantId) {
          guestsQuery = guestsQuery.eq('tenant_id', tenantId);
        }

        const { data: guests } = await guestsQuery;

        if (guests) {
          guests.forEach(g => {
            if (g.phone) {
              const guestName = g.full_name || g.name;
              if (guestName && guestName !== 'Guest') {
                const normalizedGuestPhone = (g.phone || '').replace(/\D/g, '');
                missingPhones.forEach(mp => {
                  const normalizedMp = (mp || '').replace(/\D/g, '');
                  if (normalizedGuestPhone === normalizedMp ||
                      normalizedGuestPhone.endsWith(normalizedMp) ||
                      normalizedMp.endsWith(normalizedGuestPhone)) {
                    result[mp] = guestName;
                  }
                });
              }
            }
          });
        }
      }

      // Step 3: For phones STILL not found, try whatsapp_messages_v2.guest_name (WhatsApp profile name)
      const stillMissingPhones = phoneNumbers.filter(p => !result[p]);
      if (stillMissingPhones.length > 0) {
        let waQuery = supabase
          .from('whatsapp_messages_v2')
          .select('phone_number, guest_name')
          .not('guest_name', 'is', null);

        if (tenantId) {
          waQuery = waQuery.eq('tenant_id', tenantId);
        }

        const { data: waMessages } = await waQuery;

        if (waMessages) {
          waMessages.forEach(msg => {
            if (msg.phone_number && msg.guest_name && msg.guest_name !== 'Guest') {
              const normalizedWaPhone = (msg.phone_number || '').replace(/\D/g, '');
              stillMissingPhones.forEach(mp => {
                if (!result[mp]) {
                  const normalizedMp = (mp || '').replace(/\D/g, '');
                  if (normalizedWaPhone === normalizedMp ||
                      normalizedWaPhone.endsWith(normalizedMp) ||
                      normalizedMp.endsWith(normalizedWaPhone)) {
                    result[mp] = msg.guest_name;
                  }
                }
              });
            }
          });
        }
      }
    } catch (err) {
      console.error('Error resolving guest names:', err);
    }

    return result;
  },

  // =====================================================
  // CONVERSATION TAKEOVER - Owner intervention (V1.5)
  // =====================================================

  async getConversationTakeover(channel, channelUserId) {
    const { data, error } = await supabase
      .from('conversation_takeover')
      .select('*')
      .eq('channel', channel)
      .eq('channel_user_id', channelUserId)
      .eq('active', true)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (error) throw new Error('Failed to fetch takeover state');
    return data;
  },

  async createConversationTakeover(channel, channelUserId, tenantId) {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30); // 30 min TTL

    const { data, error } = await supabase
      .from('conversation_takeover')
      .insert({
        tenant_id: tenantId,
        channel: channel,
        channel_user_id: channelUserId,
        taken_by: tenantId,
        active: true,
        started_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (error) throw new Error(error.message || 'Failed to create takeover');
    return data;
  },

  async releaseConversationTakeover(takeoverId) {
    const { data, error } = await supabase
      .from('conversation_takeover')
      .update({
        active: false,
        released_at: new Date().toISOString()
      })
      .eq('id', takeoverId)
      .select()
      .single();

    if (error) throw new Error(error.message || 'Failed to release takeover');
    return data;
  },

  // =====================================================
  // CONVERSATION STATUS - Get booking/service_request status by phone
  // Used for status chips in OwnerMessages (Needs action / Booking / Inquiry)
  // =====================================================

  async getConversationStatusData(phoneNumbers, tenantId) {
    if (!phoneNumbers || phoneNumbers.length === 0) return {};

    const result = {};
    const today = new Date().toISOString().split('T')[0];

    // Normalize phone numbers for matching
    const normalizedPhones = phoneNumbers.map(p => (p || '').replace(/\D/g, ''));

    try {
      // 1. Get pending service_requests
      let srQuery = supabase
        .from('service_requests')
        .select('guest_phone, status')
        .eq('status', 'pending')
        .not('guest_phone', 'is', null);

      if (tenantId) {
        srQuery = srQuery.eq('tenant_id', tenantId);
      }

      const { data: serviceRequests } = await srQuery;

      // 2. Get active/future bookings (check_out >= today)
      let bookingsQuery = supabase
        .from('bookings')
        .select('guest_phone, check_in, check_out, status')
        .gte('check_out', today)
        .not('guest_phone', 'is', null)
        .neq('status', 'cancelled');

      if (tenantId) {
        bookingsQuery = bookingsQuery.eq('tenant_id', tenantId);
      }

      const { data: bookings } = await bookingsQuery;

      // Initialize all phones as "inquiry" (default)
      phoneNumbers.forEach(phone => {
        result[phone] = { hasBooking: false, hasPendingRequest: false };
      });

      // Match service requests by phone
      if (serviceRequests) {
        serviceRequests.forEach(sr => {
          const normalizedSrPhone = (sr.guest_phone || '').replace(/\D/g, '');
          normalizedPhones.forEach((np, idx) => {
            if (normalizedSrPhone === np ||
                normalizedSrPhone.endsWith(np) ||
                np.endsWith(normalizedSrPhone)) {
              result[phoneNumbers[idx]].hasPendingRequest = true;
            }
          });
        });
      }

      // Match bookings by phone
      if (bookings) {
        bookings.forEach(b => {
          const normalizedBookingPhone = (b.guest_phone || '').replace(/\D/g, '');
          normalizedPhones.forEach((np, idx) => {
            if (normalizedBookingPhone === np ||
                normalizedBookingPhone.endsWith(np) ||
                np.endsWith(normalizedBookingPhone)) {
              result[phoneNumbers[idx]].hasBooking = true;
            }
          });
        });
      }
    } catch (err) {
      console.error('Error fetching conversation status data:', err);
    }

    return result;
  },

  // =====================================================
  // BATCH READ STATE - Get read state for multiple conversations
  // Returns { phoneNumber: { lastReadAt, isUnread } }
  // =====================================================

  async getConversationReadStates(phoneNumbers, tenantId) {
    if (!phoneNumbers || phoneNumbers.length === 0) return {};

    const result = {};

    // Initialize all as "never read"
    phoneNumbers.forEach(phone => {
      result[phone] = { lastReadAt: null, isUnread: true };
    });

    try {
      // Get read states for this tenant/user
      const { data: readStates } = await supabase
        .from('conversation_read_state')
        .select('channel_user_id, last_read_at')
        .eq('tenant_id', tenantId)
        .eq('channel', 'whatsapp')
        .in('channel_user_id', phoneNumbers);

      if (readStates) {
        readStates.forEach(rs => {
          if (rs.channel_user_id && result[rs.channel_user_id]) {
            result[rs.channel_user_id].lastReadAt = rs.last_read_at;
          }
        });
      }
    } catch (err) {
      console.error('Error fetching read states:', err);
    }

    return result;
  },

  subscribeToWhatsAppMessages(callback, tenantId = null) {
    const channelConfig = {
      event: 'INSERT',
      schema: 'public',
      table: 'whatsapp_messages_v2'
    };

    // Add tenant filter if provided
    if (tenantId) {
      channelConfig.filter = `tenant_id=eq.${tenantId}`;
    }

    const channel = supabase
      .channel('whatsapp-messages-changes')
      .on('postgres_changes', channelConfig, (payload) => {
        callback(payload);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};

// Export URLs for backwards compatibility (if needed)
export const SUPABASE_URL = 'https://jjpscimtxrudtepzwhag.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0';

// Servicio para obtener datos reales de Supabase
import { supabase } from '../lib/supabase';
import { onBookingCreated } from './n8n';

export const dataService = {
  // Obtener todas las properties
  async getProperties() {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching properties:', error);
      return [];
    }

    return data;
  },

  // Obtener estadísticas del dashboard
  async getDashboardStats() {
    const { data, error } = await supabase
      .rpc('get_dashboard_stats');

    if (error) {
      console.error('Error fetching dashboard stats:', error);
      return null;
    }

    return data[0]; // Retorna el primer registro
  },

  // Check-ins de hoy
  async getTodayCheckIns() {
    const { data, error } = await supabase
      .rpc('get_today_checkins');

    if (error) {
      console.error('Error fetching check-ins:', error);
      return [];
    }

    return data;
  },

  // Check-outs de hoy
  async getTodayCheckOuts() {
    const { data, error } = await supabase
      .rpc('get_today_checkouts');

    if (error) {
      console.error('Error fetching check-outs:', error);
      return [];
    }

    return data;
  },

  // Alertas activas
  async getActiveAlerts() {
    const { data, error } = await supabase
      .rpc('get_active_alerts');

    if (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }

    return data;
  },

  // Obtener todos los bookings
  async getBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select('*');

    if (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }

    return data;
  },

  // Crear nuevo booking
  async createBooking(bookingData) {
    try {
      // 1. Insert booking into Supabase
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) {
        console.error('Error creating booking:', error);
        throw error;
      }

      console.log('✅ Booking created in Supabase:', data);

      // 2. Trigger n8n workflow (non-blocking)
      onBookingCreated(data)
        .then((result) => {
          console.log('✅ Booking workflow triggered:', result);
        })
        .catch((workflowError) => {
          console.error('⚠️ Workflow trigger failed:', workflowError);
          // Don't fail the booking creation if workflows fail
        });

      return { success: true, data };
    } catch (error) {
      console.error('Error in createBooking:', error);
      return { success: false, error: error.message };
    }
  },

  // ===== AI AGENTS STATS =====

  // LUMINA.AI Stats (Sales & Leads)
  async getLuminaStats(tenantId = 'c24393db-d318-4d75-8bbf-0fa240b9c1db') {
    const { data, error } = await supabase
      .rpc('get_lumina_stats', { p_tenant_id: tenantId });

    if (error) {
      console.error('Error fetching LUMINA stats:', error);
      return { new_leads: 0, in_pipeline: 0, pending_followups: 0 };
    }

    return data[0] || { new_leads: 0, in_pipeline: 0, pending_followups: 0 };
  },

  // BANYU.AI Stats (WhatsApp Concierge)
  async getBanyuStats(tenantId = 'c24393db-d318-4d75-8bbf-0fa240b9c1db') {
    const { data, error } = await supabase
      .rpc('get_banyu_stats', { p_tenant_id: tenantId });

    if (error) {
      console.error('Error fetching BANYU stats:', error);
      return { messages_today: 0, active_conversations: 0, avg_response_time_minutes: null };
    }

    return data[0] || { messages_today: 0, active_conversations: 0, avg_response_time_minutes: null };
  },

  // KORA.AI Stats (Voice Concierge)
  async getKoraStats(tenantId = 'c24393db-d318-4d75-8bbf-0fa240b9c1db') {
    const { data, error } = await supabase
      .rpc('get_kora_stats', { p_tenant_id: tenantId });

    if (error) {
      console.error('Error fetching KORA stats:', error);
      return { calls_today: 0, avg_duration_seconds: null, positive_sentiment_pct: null };
    }

    return data[0] || { calls_today: 0, avg_duration_seconds: null, positive_sentiment_pct: null };
  },

  // OSIRIS.AI Stats (Operations & Control)
  async getOsirisStats(tenantId = 'c24393db-d318-4d75-8bbf-0fa240b9c1db') {
    const { data, error } = await supabase
      .rpc('get_osiris_stats', { p_tenant_id: tenantId });

    if (error) {
      console.error('Error fetching OSIRIS stats:', error);
      return { active_workflows: 0, active_alerts: 0, system_health: 'unknown' };
    }

    return data[0] || { active_workflows: 0, active_alerts: 0, system_health: 'unknown' };
  },

  // Get all guest contacts
  async getGuests() {
    const { data, error } = await supabase
      .from('guest_contacts')
      .select('*')
      .order('last_stay_date', { ascending: false, nullsFirst: false });

    if (error) {
      console.error('Error fetching guests:', error);
      return [];
    }

    return data;
  },

  // Get all reviews
  async getReviews() {
    const { data, error } = await supabase
      .from('marketing_reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }

    return data;
  },

  // Get all marketing campaigns
  async getCampaigns() {
    const { data, error } = await supabase
      .from('marketing_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }

    return data;
  },

  // ===== REPORTS & ANALYTICS =====

  // Get monthly analytics (last 12 months)
  async getMonthlyAnalytics(tenantId = 'c24393db-d318-4d75-8bbf-0fa240b9c1db') {
    try {
      // Get all bookings from last 12 months
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('check_in, check_out, total_price, property_id, status')
        .gte('check_in', twelveMonthsAgo.toISOString())
        .eq('tenant_id', tenantId);

      if (error) {
        console.error('Error fetching monthly analytics:', error);
        return [];
      }

      // Get properties count for occupancy calculation
      const { data: properties } = await supabase
        .from('properties')
        .select('id')
        .eq('tenant_id', tenantId);

      const propertyCount = properties?.length || 1;

      // Group by month
      const monthlyStats = {};
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      bookings.forEach(booking => {
        const checkIn = new Date(booking.check_in);
        const checkOut = new Date(booking.check_out);
        const monthKey = `${monthNames[checkIn.getMonth()]} ${checkIn.getFullYear().toString().slice(-2)}`;

        if (!monthlyStats[monthKey]) {
          monthlyStats[monthKey] = {
            month: monthKey,
            revenue: 0,
            bookings: 0,
            totalNights: 0,
            date: checkIn
          };
        }

        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        monthlyStats[monthKey].revenue += parseFloat(booking.total_price) || 0;
        monthlyStats[monthKey].bookings += 1;
        monthlyStats[monthKey].totalNights += nights;
      });

      // Convert to array and calculate occupancy & ADR
      const monthlyData = Object.values(monthlyStats)
        .sort((a, b) => a.date - b.date)
        .map(month => {
          const daysInMonth = new Date(month.date.getFullYear(), month.date.getMonth() + 1, 0).getDate();
          const totalAvailableNights = propertyCount * daysInMonth;
          const occupancy = totalAvailableNights > 0
            ? Math.round((month.totalNights / totalAvailableNights) * 100)
            : 0;
          const adr = month.totalNights > 0
            ? Math.round(month.revenue / month.totalNights)
            : 0;

          return {
            month: month.month,
            revenue: Math.round(month.revenue),
            bookings: month.bookings,
            occupancy,
            adr
          };
        });

      return monthlyData;
    } catch (error) {
      console.error('Error in getMonthlyAnalytics:', error);
      return [];
    }
  },

  // Get recent clients (last bookings)
  async getRecentClients(tenantId = 'c24393db-d318-4d75-8bbf-0fa240b9c1db', limit = 4) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        guest_name,
        check_in,
        check_out,
        total_price,
        status,
        property_id,
        properties (name)
      `)
      .eq('tenant_id', tenantId)
      .in('status', ['confirmed', 'checked_in', 'completed'])
      .order('check_in', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent clients:', error);
      return [];
    }

    return data || [];
  },

  // Get top guests by total revenue
  async getTopGuests(tenantId = 'c24393db-d318-4d75-8bbf-0fa240b9c1db', limit = 4) {
    const { data, error } = await supabase
      .from('guest_contacts')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('total_revenue', { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching top guests:', error);
      return [];
    }

    return data || [];
  },

  // Get bookings distribution by property
  async getPropertyDistribution(tenantId = 'c24393db-d318-4d75-8bbf-0fa240b9c1db') {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('property_id')
        .eq('tenant_id', tenantId);

      if (error) {
        console.error('Error fetching property distribution:', error);
        return [];
      }

      const { data: properties } = await supabase
        .from('properties')
        .select('id, name')
        .eq('tenant_id', tenantId);

      // Count bookings per property
      const distribution = {};
      bookings.forEach(booking => {
        const propId = booking.property_id;
        distribution[propId] = (distribution[propId] || 0) + 1;
      });

      // Map to property names with colors
      const colors = ['#F97316', '#EC4899', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];
      const propertyDistribution = properties.map((prop, index) => ({
        name: prop.name,
        value: distribution[prop.id] || 0,
        color: colors[index % colors.length]
      })).filter(p => p.value > 0);

      return propertyDistribution;
    } catch (error) {
      console.error('Error in getPropertyDistribution:', error);
      return [];
    }
  }
};

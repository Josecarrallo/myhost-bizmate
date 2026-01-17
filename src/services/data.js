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
  }
};

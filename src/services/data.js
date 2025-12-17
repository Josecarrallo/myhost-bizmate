// Servicio para obtener datos reales de Supabase
import { supabase } from '../lib/supabase';
import { triggerBookingConfirmation, triggerStaffNotification } from './n8n';

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

      // 2. Trigger n8n workflows (non-blocking)
      // Run workflows in parallel without waiting
      Promise.all([
        triggerBookingConfirmation(data),
        triggerStaffNotification(data),
      ])
        .then(([confirmResult, staffResult]) => {
          console.log('✅ Workflows triggered:', { confirmResult, staffResult });
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
  }
};

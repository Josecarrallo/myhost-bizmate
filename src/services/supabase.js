// Supabase configuration and API service

const SUPABASE_URL = 'https://jjpscimtxrudtepzwhag.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0';

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
  }
};

export { SUPABASE_URL, SUPABASE_ANON_KEY };

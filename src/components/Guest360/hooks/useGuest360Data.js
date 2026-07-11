import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { getPhoneSuffix } from '../constants';

/**
 * Hook para obtener todos los datos de Guest 360
 *
 * @param {string} guestPhone - Teléfono del huésped (se usará sufijo 9 dígitos)
 * @param {string} tenantId - ID del tenant (userData.id)
 * @param {string} bookingId - ID de booking específico (opcional)
 */
const useGuest360Data = (guestPhone, tenantId, bookingId = null) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data states
  const [guest, setGuest] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);
  const [payments, setPayments] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [journeyEvents, setJourneyEvents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [digitalCheckin, setDigitalCheckin] = useState(null);
  const [lead, setLead] = useState(null);

  // Computed values
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    avgTicket: 0,
    avgRating: 0,
    pendingDecisions: 0,
    resolvedDecisions: 0,
  });

  const phoneSuffix = getPhoneSuffix(guestPhone);

  const fetchData = useCallback(async () => {
    console.log('🔍 [Guest360] fetchData called:', { guestPhone, phoneSuffix, tenantId });

    if (!phoneSuffix || !tenantId) {
      console.log('🔍 [Guest360] Missing data:', { phoneSuffix, tenantId });
      setError('Se requiere teléfono y tenant_id');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Fetch guest profile
      const { data: guestData, error: guestError } = await supabase
        .from('guests')
        .select('*')
        .like('phone', `%${phoneSuffix}`)
        .eq('tenant_id', tenantId)
        .maybeSingle();

      if (guestError && guestError.code !== 'PGRST116') {
        console.error('Error fetching guest:', guestError);
      }
      setGuest(guestData);

      // 2. Fetch all bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          villas:villa_id (id, name, bedrooms, max_guests)
        `)
        .like('guest_phone', `%${phoneSuffix}`)
        .eq('tenant_id', tenantId)
        .order('check_in', { ascending: false });

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
      }
      console.log('🔍 [Guest360] Bookings found:', bookingsData?.length, bookingsData);
      setBookings(bookingsData || []);

      // Find active booking
      const activeStatuses = ['confirmed', 'checked_in', 'pending_payment', 'partial_payment'];
      const active = (bookingsData || []).find(b => activeStatuses.includes(b.status));
      setActiveBooking(active || null);

      // Get booking IDs for related queries
      const bookingIds = (bookingsData || []).map(b => b.id);

      if (bookingIds.length > 0) {
        // 3. Fetch payments
        const { data: paymentsData } = await supabase
          .from('payments')
          .select('*')
          .in('booking_id', bookingIds)
          .order('transaction_date', { ascending: false });
        setPayments(paymentsData || []);

        // 4. Fetch service requests
        const { data: servicesData } = await supabase
          .from('service_requests')
          .select('*')
          .in('booking_id', bookingIds)
          .order('created_at', { ascending: false });
        setServiceRequests(servicesData || []);

        // 5. Fetch journey events
        const { data: journeyData } = await supabase
          .from('journey_events')
          .select('*')
          .in('booking_id', bookingIds)
          .order('created_at', { ascending: true });
        setJourneyEvents(journeyData || []);

        // 6. Fetch reviews
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*')
          .in('booking_id', bookingIds)
          .order('created_at', { ascending: false });
        setReviews(reviewsData || []);

        // 7. Fetch digital checkin for active booking
        if (active) {
          const { data: checkinData } = await supabase
            .from('digital_checkins')
            .select('*')
            .eq('booking_id', active.id)
            .maybeSingle();
          setDigitalCheckin(checkinData);
        }
      }

      // 8. Fetch WhatsApp conversations (por teléfono, NO booking_id)
      const { data: conversationsData } = await supabase
        .from('whatsapp_conversations')
        .select('*')
        .like('contact_phone', `%${phoneSuffix}`)
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(100);
      setConversations(conversationsData || []);

      // 9. Fetch owner decisions
      // Incluir por booking_id O por guest_phone
      let decisionsQuery = supabase
        .from('owner_decisions')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (bookingIds.length > 0) {
        decisionsQuery = decisionsQuery.or(
          `booking_id.in.(${bookingIds.join(',')}),guest_phone.like.%${phoneSuffix}`
        );
      } else {
        decisionsQuery = decisionsQuery.like('guest_phone', `%${phoneSuffix}`);
      }

      const { data: decisionsData } = await decisionsQuery;
      setDecisions(decisionsData || []);

      // 10. Fetch lead (pre-booking)
      const { data: leadData } = await supabase
        .from('leads')
        .select('*')
        .like('phone', `%${phoneSuffix}`)
        .eq('tenant_id', tenantId)
        .maybeSingle();
      setLead(leadData);

      // Calculate stats
      const totalSpent = (bookingsData || []).reduce((sum, b) => sum + (b.total_price || 0), 0);
      const totalBookings = (bookingsData || []).length;
      const pendingDecisions = (decisionsData || []).filter(
        d => d.status === 'pending' && d.approved_by !== 'autopilot'
      ).length;
      const resolvedDecisions = (decisionsData || []).filter(
        d => d.status !== 'pending'
      ).length;

      setStats({
        totalBookings,
        totalSpent,
        avgTicket: totalBookings > 0 ? totalSpent / totalBookings : 0,
        avgRating: guestData?.avg_rating || 0,
        pendingDecisions,
        resolvedDecisions,
      });

    } catch (err) {
      console.error('Error in useGuest360Data:', err);
      setError(err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, [phoneSuffix, tenantId, bookingId]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh function
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Update decision status (Aprobar/Rechazar)
  const updateDecisionStatus = useCallback(async (decisionId, newStatus, userId) => {
    try {
      const decision = decisions.find(d => d.id === decisionId);
      if (!decision) throw new Error('Decisión no encontrada');

      const oldStatus = decision.status;
      const now = new Date().toISOString();

      // 1. Update owner_decisions
      const updateData = {
        status: newStatus,
        approved_by: userId,
      };

      // Solo añadir approved_at si es aprobada (NO si es rechazada)
      if (newStatus === 'approved') {
        updateData.approved_at = now;
      }
      // Para rejected, NO ponemos approved_at (ni siquiera null)

      const { error: updateError } = await supabase
        .from('owner_decisions')
        .update(updateData)
        .eq('id', decisionId);

      if (updateError) throw updateError;

      // 2. Insert into owner_decision_history
      const { error: historyError } = await supabase
        .from('owner_decision_history')
        .insert({
          owner_decision_id: decisionId,
          old_status: oldStatus,
          new_status: newStatus,
          action_by: userId,
          created_at: now,
        });

      if (historyError) {
        console.error('Error creating history:', historyError);
        // No throw - history es secundario
      }

      // 3. Update local state optimistically
      setDecisions(prev =>
        prev.map(d =>
          d.id === decisionId
            ? { ...d, status: newStatus, approved_by: userId, ...(newStatus === 'approved' ? { approved_at: now } : {}) }
            : d
        )
      );

      // Update stats
      setStats(prev => ({
        ...prev,
        pendingDecisions: prev.pendingDecisions - 1,
        resolvedDecisions: prev.resolvedDecisions + 1,
      }));

      return { success: true };
    } catch (err) {
      console.error('Error updating decision:', err);
      return { success: false, error: err.message };
    }
  }, [decisions]);

  return {
    // Data
    guest,
    bookings,
    activeBooking,
    payments,
    serviceRequests,
    conversations,
    decisions,
    journeyEvents,
    reviews,
    digitalCheckin,
    lead,
    stats,

    // State
    loading,
    error,

    // Actions
    refresh,
    updateDecisionStatus,
  };
};

export default useGuest360Data;

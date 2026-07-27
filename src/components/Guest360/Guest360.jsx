import React, { useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

// Hooks
import useGuest360Data from './hooks/useGuest360Data';

// Shared components
import { LoadingSpinner, EmptyState } from './components/shared';

// Constants
import { GUEST_TABS, formatCurrency } from './constants';

// Sub-components - Phase 2
import GuestHeader from './components/GuestHeader';
import GuestKPIs from './components/GuestKPIs';
import ActiveStay from './components/ActiveStay';

// Guest selector for when no phone is provided
import GuestSelector from './components/GuestSelector';

// Sub-components (se crearán en fases siguientes)
// import OCSDecisions from './components/OCSDecisions';
// import GuestTabs from './components/GuestTabs';
// import DigitalCheckin from './components/sidebar/DigitalCheckin';
// import NusantaraContext from './components/sidebar/NusantaraContext';
// import GuestNotes from './components/sidebar/GuestNotes';
// import QuickActions from './components/sidebar/QuickActions';

/**
 * Guest 360 - Vista unificada de perfil de huésped
 *
 * @param {string} guestPhone - Teléfono del huésped (opcional - si no se provee, muestra selector)
 * @param {string} tenantId - ID del tenant (userData.id)
 * @param {string} bookingId - ID de booking específico (opcional)
 * @param {string} userRole - 'owner' | 'staff'
 * @param {function} onBack - Callback para volver
 */
const Guest360 = ({
  guestPhone: initialGuestPhone,
  tenantId,
  bookingId = null,
  userRole = 'owner',
  onBack,
}) => {
  // Internal guest phone state (allows selection from GuestSelector)
  const [selectedPhone, setSelectedPhone] = useState(initialGuestPhone);

  // Use selected phone or initial prop
  const guestPhone = selectedPhone || initialGuestPhone;

  // Tab state
  const [activeTab, setActiveTab] = useState('bookings');

  // Fetch all data - MUST be called before any conditional returns (Rules of Hooks)
  const {
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
    stats,
    currency,
    loading,
    error,
    refresh,
    updateDecisionStatus,
  } = useGuest360Data(guestPhone, tenantId, bookingId);

  // If no guest phone, show selector
  if (!guestPhone) {
    return (
      <GuestSelector
        tenantId={tenantId}
        onSelectGuest={(phone) => setSelectedPhone(phone)}
        onBack={onBack}
      />
    );
  }

  // Currency is now fetched from villas table by useGuest360Data hook
  // Default 'USD' is set in the hook, updated to owner's actual currency

  // Loading state
  if (loading) {
    return (
      <div className="w-full h-full bg-[#272e39] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading guest profile..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-full bg-[#272e39] p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#aab2bf] hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <EmptyState
          title="Error Loading"
          description={error}
          action={
            <button
              onClick={refresh}
              className="flex items-center gap-2 px-4 py-2 bg-[#f5791f] text-white rounded-lg hover:bg-[#e06a10] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          }
        />
      </div>
    );
  }

  // No guest found
  if (!guest && bookings.length === 0) {
    return (
      <div className="w-full h-full bg-[#272e39] p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#aab2bf] hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <EmptyState
          title="Guest Not Found"
          description="No information found for this phone number."
        />
      </div>
    );
  }

  // Guest name from guest profile or first booking
  const guestName = guest?.name || bookings[0]?.guest_name || 'Huésped';

  // Handle back navigation - go to selector if we selected a guest, otherwise go to menu
  const handleBack = () => {
    if (selectedPhone && !initialGuestPhone) {
      // We selected from GuestSelector, go back to selector
      setSelectedPhone(null);
    } else {
      // Go back to Autopilot menu
      onBack();
    }
  };

  return (
    <div className="w-full h-full bg-[#272e39] overflow-auto">
      {/* Main container */}
      <div className="w-full p-4 md:p-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#6d7683] mb-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 hover:text-[#aab2bf] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{selectedPhone && !initialGuestPhone ? 'OCS 360' : 'MY HOST BizMate'}</span>
          </button>
          <span>/</span>
          <span>Guests</span>
          <span>/</span>
          <span className="text-[#aab2bf]">{guestName}</span>
        </div>

        {/* Guest Header */}
        <div className="mb-5">
          <GuestHeader
            guest={guest}
            bookings={bookings}
            onMessageWhatsApp={() => {
              // TODO: Integrate with WhatsApp
              const phone = guest?.phone || guestPhone;
              if (phone) {
                window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank');
              }
            }}
            onNewBooking={() => {
              // TODO: Navigate to new booking form
              console.log('New booking for guest:', guestPhone);
            }}
            onMoreActions={() => {
              // TODO: Show more actions menu
              console.log('More actions for guest:', guestPhone);
            }}
          />
        </div>

        {/* Guest KPIs - Full width */}
        <div className="mb-5">
          <GuestKPIs
            stats={stats}
            guest={guest}
            currency={currency}
          />
        </div>

        {/* Two-column layout - starts after KPIs */}
        <div className="flex flex-wrap gap-5">

          {/* Main column */}
          <div className="flex-1 min-w-[320px] space-y-5">

            {/* All Bookings - Full cards sorted by check-in date */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                All Bookings ({bookings.length})
              </h3>
              {[...bookings]
                .sort((a, b) => new Date(a.check_in) - new Date(b.check_in))
                .map((booking) => (
                  <ActiveStay
                    key={booking.id}
                    booking={booking}
                    currency={currency}
                    serviceRequests={serviceRequests.filter(sr => sr.booking_id === booking.id)}
                    journeyEvents={journeyEvents.filter(je => je.booking_id === booking.id)}
                  />
                ))
              }
            </div>

            {/* Booking Summary */}
            <div className="bg-[#333b47] rounded-2xl border border-white/10 p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Booking Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#8a93a1] uppercase tracking-wider mb-1">Total Bookings</p>
                  <p className="text-base md:text-2xl font-bold text-white">{bookings.length}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8a93a1] uppercase tracking-wider mb-1">Total Revenue</p>
                  <p className="text-xs md:text-2xl font-bold text-[#f5791f] font-mono overflow-hidden text-ellipsis">
                    {formatCurrency(bookings.reduce((sum, b) => sum + (b.total_price || 0), 0), currency)}
                  </p>
                </div>
              </div>
            </div>

            {/* OCS Decisions - Only for this guest's bookings */}
            {(() => {
              // Get booking IDs for this guest
              const guestBookingIds = bookings.map(b => b.id);
              // Filter decisions that belong to this guest's bookings
              const guestDecisions = decisions.filter(d =>
                d.booking_id && guestBookingIds.includes(d.booking_id)
              );
              const pendingGuestDecisions = guestDecisions.filter(d => d.status === 'pending');
              const resolvedGuestDecisions = guestDecisions.filter(d => d.status !== 'pending');

              return (
                <div className="bg-[#333b47] rounded-2xl border border-white/10 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white">Owner Decisions</h3>
                    <span className="text-xs text-[#8a93a1]">
                      {pendingGuestDecisions.length} pending · {resolvedGuestDecisions.length} resolved
                    </span>
                  </div>
                  {pendingGuestDecisions.length > 0 ? (
                    <div className="space-y-3">
                      {pendingGuestDecisions
                        .slice(0, 5)
                        .map((decision) => {
                          // Find the booking for this decision
                          const decisionBooking = bookings.find(b => b.id === decision.booking_id);
                          return (
                            <div
                              key={decision.id}
                              className="p-3 bg-[#2c333e] rounded-xl border-l-4 border-[#e6b24d]"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-white text-sm font-medium truncate">
                                    {decision.title || decision.decision_type || 'Decision'}
                                  </p>
                                  {(decisionBooking?.confirmation_code || decisionBooking?.reservation_id) && (
                                    <p className="text-[#f5791f] text-xs font-mono mt-1">
                                      #{decisionBooking.confirmation_code || decisionBooking.reservation_id?.split('@')[0]?.slice(-12)}
                                    </p>
                                  )}
                                  {decision.description && (
                                    <p className="text-[#8a93a1] text-xs mt-1 line-clamp-2">
                                      {decision.description}
                                    </p>
                                  )}
                                  <p className="text-[#6d7683] text-xs mt-2">
                                    {decision.created_at && new Date(decision.created_at).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                                  decision.priority === 'urgent' || decision.priority === 'high'
                                    ? 'bg-red-500/20 text-red-400'
                                    : decision.priority === 'medium'
                                    ? 'bg-yellow-500/20 text-yellow-400'
                                    : 'bg-blue-500/20 text-blue-400'
                                }`}>
                                  {decision.priority || 'normal'}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      }
                      {pendingGuestDecisions.length > 5 && (
                        <p className="text-[#8a93a1] text-xs text-center">
                          +{pendingGuestDecisions.length - 5} more decisions
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-[#6d7683] text-sm">No pending decisions for this guest</p>
                  )}
                </div>
              );
            })()}

          </div>

          {/* Sidebar column */}
          <div className="w-full md:w-[340px] md:max-w-[380px] space-y-5">

            {/* Spacer to align with "All Bookings" title */}
            <div className="hidden md:block h-6" />

            {/* Guest Notes - from guest profile or bookings */}
            <div className="bg-[#333b47] rounded-2xl border border-white/10 p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Guest Notes</h3>
              {(() => {
                // Check guest notes first, then booking notes
                const guestNotes = guest?.notes || guest?.special_requests;
                const bookingNotes = bookings.find(b => b.notes || b.special_requests);
                const notes = guestNotes || bookingNotes?.notes || bookingNotes?.special_requests;

                return notes ? (
                  <p className="text-[#aab2bf] text-sm whitespace-pre-wrap">{notes}</p>
                ) : (
                  <p className="text-[#6d7683] text-sm">No notes</p>
                );
              })()}
            </div>

            {/* Quick Actions */}
            <div className="bg-[#333b47] rounded-2xl border border-white/10 p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {/* Send WhatsApp Message */}
                <button
                  onClick={() => {
                    const phone = guest?.phone || guestPhone;
                    if (phone) {
                      const cleanPhone = phone.replace(/\D/g, '');
                      window.open(`https://wa.me/${cleanPhone}`, '_blank');
                    }
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#2c333e] hover:bg-[#3a434f] text-[#aab2bf] hover:text-white transition-colors text-sm"
                >
                  <span>Send WhatsApp Message</span>
                  <span className="text-[#25D366]">→</span>
                </button>

                {/* Edit Booking - goes to active/latest booking */}
                <button
                  onClick={() => {
                    const bookingToEdit = activeBooking || bookings[0];
                    if (bookingToEdit) {
                      // Navigate to Bookings module with this booking selected
                      const code = bookingToEdit.confirmation_code || bookingToEdit.reservation_id?.split('@')[0]?.slice(-12);
                      console.log('Edit booking:', bookingToEdit.id, code);
                      alert(`Navigate to edit booking: ${code || bookingToEdit.id}`);
                    }
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#2c333e] hover:bg-[#3a434f] text-[#aab2bf] hover:text-white transition-colors text-sm"
                >
                  <span>Edit Booking</span>
                  <span className="text-[#f5791f]">→</span>
                </button>

                {/* View Service Requests */}
                <button
                  onClick={() => {
                    // Navigate to Service Requests view
                    console.log('View service requests for guest:', guestPhone);
                    alert(`View ${serviceRequests.length} service requests for this guest`);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#2c333e] hover:bg-[#3a434f] text-[#aab2bf] hover:text-white transition-colors text-sm"
                >
                  <span>Service Requests ({serviceRequests.length})</span>
                  <span className="text-[#f5791f]">→</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 py-4 border-t border-white/10 text-center">
          <p className="text-[10px] text-[#5f6874] uppercase tracking-wider">
            Guest 360 · MY HOST BizMate
          </p>
        </div>
      </div>
    </div>
  );
};

export default Guest360;

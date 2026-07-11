import React from 'react';
import {
  Calendar,
  Users,
  Moon,
  MapPin,
  Clock,
  CheckCircle2,
  Wrench,
} from 'lucide-react';
import { ProgressBar, Badge, EmptyState } from './shared';
import { calculateStayProgress, formatDate, formatCurrency } from '../constants';

/**
 * Active Stay - Hero section for current/active booking
 * @param {object} booking - Booking data
 * @param {string} currency - Currency code
 * @param {array} serviceRequests - Service requests for this booking
 * @param {array} journeyEvents - Journey events for this booking
 */
const ActiveStay = ({ booking, currency = 'USD', serviceRequests = [], journeyEvents = [] }) => {
  // No active booking
  if (!booking) {
    return (
      <div className="bg-[#333b47] rounded-2xl border border-white/10 p-5">
        <EmptyState
          size="sm"
          title="No Active Stay"
          description="This guest has no current stay"
        />
      </div>
    );
  }

  // Calculate progress
  const { progress, daysIn, daysLeft, totalNights, phase } = calculateStayProgress(
    booking.check_in,
    booking.check_out
  );

  // Villa info
  const villaName = booking.villas?.name || 'Villa';
  const bedrooms = booking.villas?.bedrooms;
  const maxGuests = booking.villas?.max_guests;
  const guestCount = booking.number_of_guests || 1;

  // Dates formatted
  const checkInDate = formatDate(booking.check_in, 'short');
  const checkOutDate = formatDate(booking.check_out, 'short');

  // Status badge config
  const statusConfig = {
    confirmed: { variant: 'success', label: 'Confirmed' },
    checked_in: { variant: 'success', label: 'Checked In' },
    pending_payment: { variant: 'warning', label: 'Payment Pending' },
    partial_payment: { variant: 'warning', label: 'Partial Payment' },
  };

  const statusInfo = statusConfig[booking.status] || { variant: 'neutral', label: booking.status };

  // Progress markers for timeline
  const markers = [
    { position: 0, label: 'Check-in' },
    { position: 100, label: 'Check-out' },
  ];

  return (
    <div className="bg-[#333b47] rounded-2xl border border-white/10 overflow-hidden">
      {/* Header with status indicator */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Pulse dot for active stays */}
          {phase === 'during' && (
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          )}
          <span
            className={`text-xs uppercase tracking-wider font-semibold ${
              phase === 'during' ? 'text-green-400' : 'text-[#8a93a1]'
            }`}
          >
            {phase === 'before'
              ? 'Upcoming Stay'
              : phase === 'during'
              ? 'Active Stay'
              : 'Completed Stay'}
          </span>
        </div>

        <Badge variant={statusInfo.variant} size="sm">
          {statusInfo.label}
        </Badge>
      </div>

      {/* Villa name + booking code */}
      <div className="px-5 pb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
          {villaName}
        </h2>
        {booking.booking_code && (
          <p className="text-xs text-[#6d7683] font-mono">
            #{booking.booking_code}
          </p>
        )}
      </div>

      {/* Info row */}
      <div className="px-5 pb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#aab2bf]">
        {/* Dates */}
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-[#6d7683]" />
          {checkInDate} → {checkOutDate}
        </span>

        {/* Nights */}
        <span className="flex items-center gap-1.5">
          <Moon className="w-4 h-4 text-[#6d7683]" />
          {totalNights} nights
        </span>

        {/* Guests */}
        <span className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-[#6d7683]" />
          {guestCount} guest{guestCount !== 1 ? 's' : ''}
        </span>

        {/* Bedrooms if available */}
        {bedrooms && (
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#6d7683]" />
            {bedrooms} bed
          </span>
        )}
      </div>

      {/* Progress bar section */}
      <div className="px-5 pb-5">
        <ProgressBar
          progress={progress}
          variant={phase === 'during' ? 'primary' : 'neutral'}
          showLabel
          markers={markers}
        />

        {/* Progress text */}
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-[#8a93a1]">
            {phase === 'before' && (
              <>
                <Clock className="w-3 h-3 inline mr-1" />
                Arrives in {Math.abs(daysIn)} days
              </>
            )}
            {phase === 'during' && (
              <>
                Day {daysIn + 1} of {totalNights}
              </>
            )}
            {phase === 'after' && (
              <>
                <CheckCircle2 className="w-3 h-3 inline mr-1 text-green-400" />
                Completed
              </>
            )}
          </span>

          {phase === 'during' && daysLeft > 0 && (
            <span className="text-[#f5791f] font-semibold">
              {daysLeft} night{daysLeft !== 1 ? 's' : ''} left
            </span>
          )}
        </div>
      </div>

      {/* Service Requests for this booking */}
      {serviceRequests.length > 0 && (
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-4 h-4 text-[#8a93a1]" />
            <span className="text-xs text-[#8a93a1] uppercase tracking-wider font-semibold">
              Services ({serviceRequests.length})
            </span>
          </div>
          <div className="space-y-2">
            {serviceRequests.map((service) => (
              <div
                key={service.id}
                className="p-3 bg-[#2c333e] rounded-lg"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white text-sm font-medium">
                    {service.service_type || service.title || 'Service'}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ml-2 whitespace-nowrap ${
                    service.status === 'completed' || service.status === 'done'
                      ? 'bg-green-500/20 text-green-400'
                      : service.status === 'in_progress' || service.status === 'assigned'
                      ? 'bg-blue-500/20 text-blue-400'
                      : service.status === 'cancelled'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {service.status || 'pending'}
                  </span>
                </div>
                {service.description && (
                  <p className="text-[#aab2bf] text-xs mt-1">
                    {service.description}
                  </p>
                )}
                {service.scheduled_date && (
                  <p className="text-[#6d7683] text-xs mt-1">
                    📅 {new Date(service.scheduled_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
                {service.notes && (
                  <p className="text-[#8a93a1] text-xs mt-1 italic">
                    {service.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mini Journey Timeline for this booking */}
      <div className="px-5 pb-4">
        <p className="text-xs text-[#8a93a1] uppercase tracking-wider font-semibold mb-3">
          Guest Journey
        </p>
        <div className="flex items-center justify-between gap-1">
          {[
            { id: 'confirmed', label: 'Confirmed', check: () => true },
            { id: 'pre_arrival', label: 'Pre-arrival', check: () => {
              const now = new Date();
              const checkIn = new Date(booking.check_in);
              const sevenDaysBefore = new Date(checkIn.getTime() - 7 * 24 * 60 * 60 * 1000);
              return now >= sevenDaysBefore;
            }},
            { id: 'checkin', label: 'Check-in', check: () => {
              const now = new Date();
              const checkIn = new Date(booking.check_in);
              return now >= checkIn || booking.status === 'checked_in';
            }},
            { id: 'in_stay', label: 'In Stay', check: () => {
              const now = new Date();
              const checkIn = new Date(booking.check_in);
              const checkOut = new Date(booking.check_out);
              return now > checkIn && now < checkOut;
            }},
            { id: 'checkout', label: 'Check-out', check: () => {
              const now = new Date();
              const checkOut = new Date(booking.check_out);
              return now >= checkOut;
            }},
          ].map((step, index, arr) => {
            const isCompleted = step.check();
            const isLast = index === arr.length - 1;
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    isCompleted ? 'bg-[#f5791f]' : 'bg-[#3a434f]'
                  }`} />
                  <span className={`text-[9px] mt-1 whitespace-nowrap ${
                    isCompleted ? 'text-[#f5791f]' : 'text-[#6d7683]'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {!isLast && (
                  <div className={`flex-1 h-0.5 mx-1 ${
                    isCompleted ? 'bg-[#f5791f]' : 'bg-[#3a434f]'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer with total price */}
      {booking.total_price && (
        <div className="px-5 py-3 bg-[#2c333e] border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-[#8a93a1] uppercase tracking-wider">
            Booking Total
          </span>
          <span className="text-lg font-mono font-bold text-white">
            {formatCurrency(booking.total_price, currency)}
          </span>
        </div>
      )}
    </div>
  );
};

export default ActiveStay;

import React from 'react';
import {
  Wrench,
  CheckCircle,
  Clock,
  User,
  XCircle,
  Calendar,
  Home,
  DollarSign,
} from 'lucide-react';
import { EmptyState } from '../shared';
import { formatDate } from '../../constants';

/**
 * ServicesTab - Lista de service requests del huésped
 *
 * Campos de service_requests:
 * - type (airport_transfer, spa, scooter_rental, floating_breakfast, etc.)
 * - title (nombre descriptivo)
 * - status (pending, confirmed, in_progress, completed, cancelled)
 * - scheduled_at (fecha/hora programada)
 * - duration_minutes (puede ser null)
 * - price (en IDR normalmente)
 * - special_requests (notas del huésped)
 * - details (JSONB con info adicional)
 */
const ServicesTab = ({ serviceRequests = [], bookings = [] }) => {
  if (serviceRequests.length === 0) {
    return (
      <div className="bg-[#333b47] rounded-2xl border border-white/10 p-5">
        <EmptyState
          icon={Wrench}
          title="No Service Requests"
          description="No service requests found for this guest"
        />
      </div>
    );
  }

  // Status config
  const statusConfig = {
    pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Pending' },
    confirmed: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20', label: 'Confirmed' },
    assigned: { icon: User, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Assigned' },
    in_progress: { icon: Wrench, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'In Progress' },
    completed: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20', label: 'Completed' },
    done: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20', label: 'Done' },
    cancelled: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Cancelled' },
  };

  // Service type labels for display
  const serviceTypeLabels = {
    airport_transfer: 'Airport Transfer',
    transfer: 'Airport Transfer',       // Catálogo unificado
    spa: 'Spa / Massage',
    scooter_rental: 'Scooter Rental',
    scooter: 'Scooter Rental',           // Catálogo unificado
    scooter_small: 'Scooter (Small)',    // Catálogo unificado
    floating_breakfast: 'Floating Breakfast',
    car_rental: 'Car Rental',
    car: 'Car Rental',                   // Catálogo unificado
    laundry: 'Laundry',                  // Catálogo unificado
    laundry_express: 'Express Laundry',  // Catálogo unificado
    late_checkout: 'Late Checkout',
    extra_guest: 'Extra Guest',
    decoration: 'Decoration',
    private_chef: 'Private Chef',
    photoshoot: 'Photoshoot',
  };

  // Service type emojis (mismo mapa que ServiceRequests.jsx)
  const serviceTypeEmojis = {
    airport_transfer: '✈️',
    transfer: '✈️',
    tour: '🏔️',
    spa: '💆',
    private_chef: '👨‍🍳',
    decoration: '🎂',
    scooter_rental: '🛵',
    scooter: '🛵',
    scooter_small: '🛵',
    car_rental: '🚗',
    car: '🚗',
    floating_breakfast: '🥞',
    laundry: '🧺',
    laundry_express: '🧺',
    late_checkout: '🕐',
    extra_guest: '👥',
    photoshoot: '📸',
    excursion: '🌴',
    other: '📋',
  };

  // Get booking info helper
  const getBookingInfo = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return null;
    return {
      villaName: booking.villas?.name || 'Villa',
      code: booking.confirmation_code || booking.reservation_id?.split('@')[0]?.slice(-12),
    };
  };

  // Format price (services are typically in IDR)
  const formatServicePrice = (price) => {
    if (!price) return null;
    // Format as IDR
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Group by status
  const confirmedServices = serviceRequests.filter(s =>
    ['confirmed', 'assigned', 'in_progress'].includes(s.status)
  );
  const pendingServices = serviceRequests.filter(s => s.status === 'pending');
  const completedServices = serviceRequests.filter(s =>
    ['completed', 'done'].includes(s.status)
  );

  // Total value of services
  const totalServiceValue = serviceRequests.reduce((sum, s) => sum + (s.price || 0), 0);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-[#333b47] rounded-xl border border-white/10 p-3 text-center">
          <p className="text-2xl font-bold text-white">{serviceRequests.length}</p>
          <p className="text-xs text-[#8a93a1] uppercase tracking-wider">Total</p>
        </div>
        <div className="bg-[#333b47] rounded-xl border border-white/10 p-3 text-center">
          <p className="text-2xl font-bold text-green-400">{confirmedServices.length}</p>
          <p className="text-xs text-[#8a93a1] uppercase tracking-wider">Confirmed</p>
        </div>
        <div className="bg-[#333b47] rounded-xl border border-white/10 p-3 text-center">
          <p className="text-2xl font-bold text-yellow-400">{pendingServices.length}</p>
          <p className="text-xs text-[#8a93a1] uppercase tracking-wider">Pending</p>
        </div>
        <div className="bg-[#333b47] rounded-xl border border-white/10 p-3 text-center">
          <p className="text-sm font-bold text-[#f5791f] font-mono">
            {formatServicePrice(totalServiceValue) || 'IDR 0'}
          </p>
          <p className="text-xs text-[#8a93a1] uppercase tracking-wider">Value</p>
        </div>
      </div>

      {/* Service requests list */}
      <div className="bg-[#333b47] rounded-2xl border border-white/10 overflow-hidden">
        <div className="px-5 py-3 border-b border-white/10">
          <h3 className="text-sm font-semibold text-white">
            All Services ({serviceRequests.length})
          </h3>
        </div>

        <div className="divide-y divide-white/5">
          {[...serviceRequests]
            .sort((a, b) => new Date(b.scheduled_at || b.created_at) - new Date(a.scheduled_at || a.created_at))
            .map((service) => {
              const status = statusConfig[service.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              const bookingInfo = getBookingInfo(service.booking_id);
              const typeLabel = serviceTypeLabels[service.type] || service.type || 'Service';
              const typeEmoji = serviceTypeEmojis[service.type] || '📋';

              return (
                <div key={service.id} className="px-5 py-4 hover:bg-[#3a434f]/30 transition-colors">
                  <div className="flex items-start gap-3">
                    {/* Status icon */}
                    <div className={`p-2 rounded-lg ${status.bg} flex-shrink-0`}>
                      <StatusIcon className={`w-4 h-4 ${status.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-medium">
                          <span className="mr-1.5">{typeEmoji}</span>
                          {service.title || typeLabel}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                      </div>

                      {/* Service details row */}
                      <div className="flex items-center gap-3 mt-2 text-sm text-[#aab2bf] flex-wrap">
                        {/* Scheduled date/time */}
                        {service.scheduled_at && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#6d7683]" />
                            {formatDate(service.scheduled_at, { includeTime: true })}
                          </span>
                        )}

                        {/* Duration (protect against null) */}
                        {service.duration_minutes && (
                          <span className="text-[#6d7683]">
                            {service.duration_minutes} min
                          </span>
                        )}

                        {/* Villa */}
                        {bookingInfo && (
                          <span className="flex items-center gap-1">
                            <Home className="w-3.5 h-3.5 text-[#f5791f]" />
                            {bookingInfo.villaName}
                          </span>
                        )}
                      </div>

                      {/* Special requests / notes */}
                      {service.special_requests && (
                        <p className="text-[#8a93a1] text-sm mt-2 line-clamp-2">
                          {service.special_requests}
                        </p>
                      )}

                      {/* Source/agent info */}
                      {(service.source || service.agent) && (
                        <p className="text-[#6d7683] text-xs mt-1">
                          via {service.source}{service.agent ? ` / ${service.agent}` : ''}
                        </p>
                      )}
                    </div>

                    {/* Price */}
                    {service.price && (
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold font-mono text-[#f5791f]">
                          {formatServicePrice(service.price)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ServicesTab;

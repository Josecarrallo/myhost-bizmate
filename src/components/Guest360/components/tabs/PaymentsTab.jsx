import React from 'react';
import {
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Home,
} from 'lucide-react';
import { EmptyState } from '../shared';
import { formatCurrency, formatDate } from '../../constants';

/**
 * PaymentsTab - Muestra estado de pagos de cada booking
 *
 * Los datos de pago están en la tabla bookings (payment_status, total_price)
 * No hay tabla payments separada
 */
const PaymentsTab = ({ bookings = [], currency = 'USD' }) => {
  if (bookings.length === 0) {
    return (
      <div className="bg-[#333b47] rounded-2xl border border-white/10 p-5">
        <EmptyState
          icon={CreditCard}
          title="No Bookings"
          description="No booking records found for this guest"
        />
      </div>
    );
  }

  // Status config for payment_status
  const statusConfig = {
    paid: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20', label: 'Paid' },
    partial: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Partial' },
    pending: { icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/20', label: 'Pending' },
    refunded: { icon: AlertCircle, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Refunded' },
    expired: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Expired' },
  };

  // Calculate totals
  const totalPaid = bookings
    .filter(b => b.payment_status === 'paid')
    .reduce((sum, b) => sum + (b.total_price || 0), 0);

  const totalPending = bookings
    .filter(b => b.payment_status === 'pending' || b.payment_status === 'partial')
    .reduce((sum, b) => sum + (b.total_price || 0), 0);

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0);

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#333b47] rounded-xl border border-white/10 p-4">
          <p className="text-xs text-[#8a93a1] uppercase tracking-wider mb-1">Total Paid</p>
          <p className="text-lg font-bold text-green-400 font-mono">
            {formatCurrency(totalPaid, currency)}
          </p>
        </div>
        <div className="bg-[#333b47] rounded-xl border border-white/10 p-4">
          <p className="text-xs text-[#8a93a1] uppercase tracking-wider mb-1">Pending/Partial</p>
          <p className="text-lg font-bold text-yellow-400 font-mono">
            {formatCurrency(totalPending, currency)}
          </p>
        </div>
        <div className="bg-[#333b47] rounded-xl border border-white/10 p-4">
          <p className="text-xs text-[#8a93a1] uppercase tracking-wider mb-1">Total Revenue</p>
          <p className="text-lg font-bold text-white font-mono">
            {formatCurrency(totalRevenue, currency)}
          </p>
        </div>
      </div>

      {/* Bookings payment list */}
      <div className="bg-[#333b47] rounded-2xl border border-white/10 overflow-hidden">
        <div className="px-5 py-3 border-b border-white/10">
          <h3 className="text-sm font-semibold text-white">
            Booking Payments ({bookings.length})
          </h3>
        </div>

        <div className="divide-y divide-white/5">
          {[...bookings]
            .sort((a, b) => new Date(b.check_in) - new Date(a.check_in))
            .map((booking) => {
              const status = statusConfig[booking.payment_status] || statusConfig.pending;
              const StatusIcon = status.icon;
              const villaName = booking.villas?.name || 'Villa';
              const code = booking.confirmation_code || booking.reservation_id?.split('@')[0]?.slice(-12);

              return (
                <div key={booking.id} className="px-5 py-4 hover:bg-[#3a434f]/30 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    {/* Left: Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-medium">
                          {code ? `#${code}` : 'Booking'}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mt-2 text-sm text-[#aab2bf]">
                        <span className="flex items-center gap-1">
                          <Home className="w-3.5 h-3.5 text-[#f5791f]" />
                          {villaName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#6d7683]" />
                          {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mt-1 text-xs text-[#6d7683]">
                        <span>{booking.nights || Math.ceil((new Date(booking.check_out) - new Date(booking.check_in)) / (1000 * 60 * 60 * 24))} nights</span>
                        <span>{booking.guests || booking.adults || 2} guests</span>
                        {booking.channel && (
                          <span className="capitalize">{booking.channel}</span>
                        )}
                      </div>
                    </div>

                    {/* Right: Amount */}
                    <div className="text-right">
                      <p className="text-lg font-bold font-mono text-white">
                        {formatCurrency(booking.total_price || 0, currency)}
                      </p>
                      {booking.payment_status === 'partial' && booking.amount_paid && (
                        <p className="text-xs text-green-400 mt-1">
                          Paid: {formatCurrency(booking.amount_paid, currency)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default PaymentsTab;

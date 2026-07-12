import React from 'react';
import { formatCurrency } from '../constants';

/**
 * Guest KPIs - 5 horizontal tiles with guest metrics
 */
const GuestKPIs = ({ stats, guest, currency = 'USD' }) => {
  const kpis = [
    {
      label: 'Bookings',
      value: stats?.totalBookings || 0,
      format: 'number',
    },
    {
      label: 'Total Spent',
      value: stats?.totalSpent || 0,
      format: 'currency',
    },
    {
      label: 'Avg Ticket',
      value: stats?.avgTicket || 0,
      format: 'currency',
    },
    {
      label: 'Rating',
      value: stats?.avgRating || 0,
      format: 'rating',
    },
    {
      label: 'Customer Since',
      value: guest?.created_at,
      format: 'date',
    },
  ];

  const formatValue = (value, format) => {
    switch (format) {
      case 'currency':
        return formatCurrency(value, currency);
      case 'rating':
        return value > 0 ? `${value.toFixed(1)} ★` : '—';
      case 'date':
        if (!value) return '—';
        return new Date(value).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        });
      case 'number':
      default:
        return value.toLocaleString();
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className="bg-[#333b47] rounded-xl border border-white/10 p-4 min-w-0"
        >
          {/* Label */}
          <p className="text-[10px] uppercase tracking-wider text-white font-semibold mb-2 whitespace-nowrap">
            {kpi.label}
          </p>

          {/* Value - single line, smaller on mobile for long currency values */}
          <p className="text-[10px] md:text-sm font-mono font-semibold text-[#f5791f] truncate">
            {formatValue(kpi.value, kpi.format)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default GuestKPIs;

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
    <div className="grid grid-cols-3 gap-3">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className="bg-[#333b47] rounded-xl border border-white/10 p-3 md:p-4 min-w-0"
        >
          {/* Label */}
          <p className="text-[10px] md:text-xs uppercase tracking-wider text-[#8a93a1] font-semibold mb-1.5 whitespace-nowrap">
            {kpi.label}
          </p>

          {/* Value */}
          <p className="text-sm md:text-lg font-bold text-[#f5791f] truncate">
            {formatValue(kpi.value, kpi.format)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default GuestKPIs;

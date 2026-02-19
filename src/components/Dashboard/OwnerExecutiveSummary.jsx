import React, { useState, useEffect } from 'react';
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Home,
  Filter,
  Printer
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { dataService } from '../../services/data';
import { useAuth } from '../../contexts/AuthContext';

const OwnerExecutiveSummary = ({ userName = 'Owner', onNavigate }) => {
  const { user } = useAuth();
  const tenantId = user?.id;

  // Date range state
  const [dateRange, setDateRange] = useState({
    start: '2026-01-01',
    end: '2026-12-31',
    label: '2026 (Full Year)'
  });

  // Custom date inputs
  const [customStart, setCustomStart] = useState('2026-01-01');
  const [customEnd, setCustomEnd] = useState('2026-12-31');

  // Data state
  const [stats, setStats] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(true);

  // Reset state when user changes
  useEffect(() => {
    if (!tenantId) {
      // User logged out or changed - reset all state
      setStats(null);
      setCurrency('USD');
      setLoading(true);
    }
  }, [tenantId]);

  useEffect(() => {
    if (tenantId) {
      loadOverviewData();
    }
  }, [tenantId, dateRange]);

  const loadOverviewData = async () => {
    setLoading(true);
    try {
      // Get property currency
      const properties = await dataService.getProperties();
      const userProperty = properties.find(p => p.owner_id === tenantId);
      if (userProperty?.currency) {
        setCurrency(userProperty.currency);
      }

      // Get overview stats
      const overviewData = await dataService.getOverviewStats(
        tenantId,
        dateRange.start,
        dateRange.end
      );

      setStats(overviewData);
    } catch (error) {
      console.error('Error loading overview:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0';

    switch (currency) {
      case 'IDR':
        return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
      case 'EUR':
        return `€${Math.round(amount).toLocaleString('de-DE')}`;
      case 'USD':
      default:
        return `$${Math.round(amount).toLocaleString('en-US')}`;
    }
  };

  const handleCustomDateChange = () => {
    if (customStart && customEnd) {
      setDateRange({
        start: customStart,
        end: customEnd,
        label: 'Custom Range'
      });
    }
  };

  const handlePrintSummary = () => {
    const printWindow = window.open('', '', 'width=1200,height=800');
    const today = new Date().toLocaleDateString();

    // Build monthly timeline table
    let timelineRows = '';
    if (stats?.timeline_data && stats.timeline_data.length > 0) {
      timelineRows = stats.timeline_data.map(month => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${month.month_name || 'N/A'}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatCurrency(month.revenue || 0)}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${month.bookings || 0}</td>
        </tr>
      `).join('');
    } else {
      timelineRows = '<tr><td colspan="3" style="padding: 8px; text-align: center; color: #999;">No monthly data available</td></tr>';
    }

    const content = `
      <html>
        <head>
          <title>Overview Summary - ${today}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }
            .container { max-width: 1100px; margin: 0 auto; background: white; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #d85a2a; text-align: center; margin-bottom: 10px; }
            h2 { color: #333; border-bottom: 2px solid #d85a2a; padding-bottom: 10px; margin-top: 30px; margin-bottom: 15px; }
            .summary-box { background: #f0f0f0; padding: 15px; margin: 10px 0; border-left: 4px solid #d85a2a; }
            .btn-print { background: #d85a2a; color: white; border: none; padding: 12px 24px; cursor: pointer; margin: 20px 0; font-size: 16px; border-radius: 5px; }
            .btn-print:hover { background: #c04a1a; }
            @media print { .btn-print { display: none; } }
            .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
            .stats-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
            .stat-card { background: #f9f9f9; padding: 20px; border-radius: 8px; border: 2px solid #d85a2a; }
            .stat-value { font-size: 24px; font-weight: bold; color: #d85a2a; }
            .stat-label { color: #666; margin-top: 5px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th { background: #d85a2a; color: white; padding: 10px; text-align: left; }
            td { padding: 8px; border: 1px solid #ddd; }
            tr:nth-child(even) { background: #f9f9f9; }
            .alert-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>MY HOST BizMate - Overview Summary</h1>
            <p style="text-align: center; color: #666;">Generated: ${today}</p>
            <p style="text-align: center; color: #666;">Owner: <strong>${userName || 'N/A'}</strong></p>
            <p style="text-align: center; color: #666;">Period: <strong>${dateRange.label}</strong> (${dateRange.start} to ${dateRange.end})</p>
            <button class="btn-print" onclick="window.print()">🖨️ Print Report</button>

            <h2>📊 Revenue & Performance Analytics</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">${formatCurrency(stats?.total_revenue || 0)}</div>
                <div class="stat-label">Total Revenue</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${formatCurrency(stats?.revenue_paid || 0)}</div>
                <div class="stat-label">Revenue Paid<br>${stats?.total_revenue > 0 ? ((stats?.revenue_paid / stats?.total_revenue) * 100).toFixed(1) : 0}% collected</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${formatCurrency(stats?.revenue_pending || 0)}</div>
                <div class="stat-label">Revenue Pending<br>${stats?.total_revenue > 0 ? ((stats?.revenue_pending / stats?.total_revenue) * 100).toFixed(1) : 0}% to collect</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${stats?.total_nights || 0}</div>
                <div class="stat-label">Total Nights<br>Booked nights</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${stats?.total_bookings || 0}</div>
                <div class="stat-label">Total Bookings<br>Confirmed reservations</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${stats?.occupancy_rate || 0}%</div>
                <div class="stat-label">Occupancy Rate<br>Average occupancy</div>
              </div>
            </div>

            <h2>📈 Monthly Performance Breakdown</h2>
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th style="text-align: right;">Revenue</th>
                  <th style="text-align: center;">Bookings</th>
                </tr>
              </thead>
              <tbody>
                ${timelineRows}
              </tbody>
            </table>

            <h2>💳 Payment Status</h2>
            <div class="stats-grid-2">
              <div class="stat-card">
                <div class="stat-value">${stats?.payment_status_data?.paid?.bookings || 0} bookings</div>
                <div class="stat-label">✅ Paid<br>${formatCurrency(stats?.payment_status_data?.paid?.revenue || 0)}</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${stats?.payment_status_data?.pending?.bookings || 0} bookings</div>
                <div class="stat-label">⏳ Pending<br>${formatCurrency(stats?.payment_status_data?.pending?.revenue || 0)}</div>
              </div>
            </div>

            ${stats?.payment_status_data?.pending?.bookings > 0 ? `
              <div class="alert-box">
                <p style="color: #856404; font-weight: bold; margin-bottom: 5px;">📌 Action Items:</p>
                <ul style="color: #856404; margin: 5px 0; padding-left: 20px;">
                  <li>${stats.payment_status_data.pending.bookings} bookings pending payment follow-up</li>
                  <li>Expected revenue to collect: ${formatCurrency(stats.payment_status_data.pending.revenue)}</li>
                </ul>
              </div>
            ` : ''}

            <div class="summary-box" style="margin-top: 30px;">
              <strong>Report Period:</strong> ${dateRange.start} to ${dateRange.end}<br>
              <strong>Report Type:</strong> ${dateRange.label}<br>
              <strong>Generated:</strong> ${today}<br>
              <strong>Owner:</strong> ${userName || 'N/A'}
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
  };


  if (loading) {
    return (
      <div className="flex-1 bg-[#2a2f3a] flex items-center justify-center">
        <div className="text-white text-xl font-semibold">Loading overview...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#2a2f3a] overflow-auto p-6 relative">
      {/* Animated background - mismo que Autopilot */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10">
      {/* Header with Date Range Selector - Mobile Optimized */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-black text-[#FF8C42]">Overview</h1>
            <p className="text-orange-400 font-bold text-lg md:text-xl mt-1">{userName}</p>
            <p className="text-gray-300 text-sm md:text-base mt-0.5">Revenue & Performance Analytics</p>
          </div>
          <Filter className="w-5 h-5 md:w-6 md:h-6 text-orange-400 flex-shrink-0 mt-1" />
        </div>

        {/* Date Range Selector */}
        <div className="mt-4 p-4 bg-[#1f2937]/95 backdrop-blur-sm rounded-lg border-2 border-[#d85a2a]/20">
          <p className="text-sm font-medium text-orange-400 mb-3">📅 Date Range</p>

          {/* Quick Filters */}
          <div className="flex gap-2 mb-3 flex-wrap">
            <button
              onClick={() => setDateRange({ start: '2025-01-01', end: '2025-12-31', label: '2025 (Full Year)' })}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                dateRange.label === '2025 (Full Year)'
                  ? 'bg-orange-500 text-white'
                  : 'bg-[#2a2f3a] text-gray-300 hover:bg-[#3a3f4a]'
              }`}
            >
              2025
            </button>
            <button
              onClick={() => setDateRange({ start: '2026-01-01', end: '2026-12-31', label: '2026 (Full Year)' })}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                dateRange.label === '2026 (Full Year)'
                  ? 'bg-orange-500 text-white'
                  : 'bg-[#2a2f3a] text-gray-300 hover:bg-[#3a3f4a]'
              }`}
            >
              2026
            </button>
            <button
              onClick={() => setDateRange({ start: '2025-01-01', end: '2026-12-31', label: '2025-2026 (Both Years)' })}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                dateRange.label === '2025-2026 (Both Years)'
                  ? 'bg-orange-500 text-white'
                  : 'bg-[#2a2f3a] text-gray-300 hover:bg-[#3a3f4a]'
              }`}
            >
              2025-2026
            </button>
          </div>

          <div className="flex gap-3 items-end flex-wrap">
            <div className="flex-1 min-w-[140px]">
              <label className="text-xs text-gray-300 mb-1 block">Start Date</label>
              <input
                id="overview-start-date"
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="w-full px-3 py-2 bg-[#2a2f3a] border border-orange-500/30 rounded-lg text-sm text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="text-xs text-gray-300 mb-1 block">End Date</label>
              <input
                id="overview-end-date"
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="w-full px-3 py-2 bg-[#2a2f3a] border border-orange-500/30 rounded-lg text-sm text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <button
              onClick={handleCustomDateChange}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold text-sm transition-all shadow-lg"
            >
              📅 Apply Custom
            </button>
            <button
              onClick={handlePrintSummary}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold text-sm transition-all shadow-lg flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Summary
            </button>
          </div>
        </div>
      </div>

      {/* 1. KPIs Header - 6 cards - Todas naranjas y más pequeñas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-3 border-2 border-orange-500/30">
          <div className="flex items-center justify-between mb-1">
            <DollarSign className="w-6 h-6 text-orange-400" />
          </div>
          <p className="text-xl font-black text-white mb-0.5">
            {formatCurrency(stats?.total_revenue || 0)}
          </p>
          <p className="text-orange-300 text-xs">Total Revenue</p>
          <p className="text-orange-200 text-xs mt-0.5">{dateRange.label}</p>
        </div>

        {/* Revenue Paid */}
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-3 border-2 border-orange-500/30">
          <div className="flex items-center justify-between mb-1">
            <DollarSign className="w-6 h-6 text-orange-400" />
          </div>
          <p className="text-xl font-black text-white mb-0.5">
            {formatCurrency(stats?.revenue_paid || 0)}
          </p>
          <p className="text-orange-300 text-xs">Revenue Paid</p>
          <p className="text-orange-200 text-xs mt-0.5">
            {stats?.total_revenue > 0
              ? `${((stats?.revenue_paid / stats?.total_revenue) * 100).toFixed(1)}% collected`
              : '0% collected'}
          </p>
        </div>

        {/* Revenue Pending */}
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-3 border-2 border-orange-500/30">
          <div className="flex items-center justify-between mb-1">
            <DollarSign className="w-6 h-6 text-orange-400" />
          </div>
          <p className="text-xl font-black text-white mb-0.5">
            {formatCurrency(stats?.revenue_pending || 0)}
          </p>
          <p className="text-orange-300 text-xs">Revenue Pending</p>
          <p className="text-orange-200 text-xs mt-0.5">
            {stats?.total_revenue > 0
              ? `${((stats?.revenue_pending / stats?.total_revenue) * 100).toFixed(1)}% to collect`
              : '0% to collect'}
          </p>
        </div>

        {/* Total Nights */}
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-3 border-2 border-orange-500/30">
          <div className="flex items-center justify-between mb-1">
            <Calendar className="w-6 h-6 text-orange-400" />
          </div>
          <p className="text-xl font-black text-white mb-0.5">{stats?.total_nights || 0}</p>
          <p className="text-orange-300 text-xs">Total Nights</p>
          <p className="text-orange-200 text-xs mt-0.5">Booked nights</p>
        </div>

        {/* Total Bookings */}
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-3 border-2 border-orange-500/30">
          <div className="flex items-center justify-between mb-1">
            <Home className="w-6 h-6 text-orange-400" />
          </div>
          <p className="text-xl font-black text-white mb-0.5">{stats?.total_bookings || 0}</p>
          <p className="text-orange-300 text-xs">Total Bookings</p>
          <p className="text-orange-200 text-xs mt-0.5">Confirmed reservations</p>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-3 border-2 border-orange-500/30">
          <div className="flex items-center justify-between mb-1">
            <TrendingUp className="w-6 h-6 text-orange-400" />
          </div>
          <p className="text-xl font-black text-white mb-0.5">{stats?.occupancy_rate || 0}%</p>
          <p className="text-orange-300 text-xs">Occupancy Rate</p>
          <div className="w-full bg-orange-900/20 rounded-full h-1.5 mt-1.5">
            <div
              className="bg-orange-500 h-1.5 rounded-full transition-all"
              style={{ width: `${Math.min(stats?.occupancy_rate || 0, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 2. Performance Chart - Combined Revenue & Bookings - Mobile Optimized */}
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-2xl border-2 border-[#d85a2a]/20 mb-6">
        <h2 className="text-xl md:text-2xl font-black text-[#FF8C42] mb-4 md:mb-6">📊 Performance Overview</h2>
        <ResponsiveContainer width="100%" height={250} className="md:!h-[400px]">
          <ComposedChart data={stats?.timeline_data || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month_name"
              tick={{ fill: '#666', fontSize: 12 }}
              tickFormatter={(value) => value?.trim().substring(0, 3) || ''}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: '#666', fontSize: 12 }}
              label={{ value: 'Revenue', angle: -90, position: 'insideLeft', offset: -5, style: { fill: '#666', textAnchor: 'middle' } }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#666', fontSize: 12 }}
              label={{ value: 'Bookings', angle: 90, position: 'insideRight', style: { fill: '#666' } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              formatter={(value, name) => {
                if (name === 'Revenue') {
                  return [formatCurrency(value), name];
                }
                return [value, name];
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar
              yAxisId="right"
              dataKey="bookings"
              fill="#f97316"
              name="Bookings"
              radius={[8, 8, 0, 0]}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#FF8C42"
              strokeWidth={3}
              name="Revenue"
              dot={{ fill: '#FF8C42', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* 3. Timeline Table - Mobile Optimized */}
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-2xl border-2 border-[#d85a2a]/20 mb-6">
        <h2 className="text-lg md:text-xl font-black text-[#FF8C42] mb-3 md:mb-4">Revenue & Occupancy Timeline</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-orange-400">Month</th>
                <th className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-orange-400">Bookings</th>
                <th className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-orange-400">Nights</th>
                <th className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-orange-400">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {stats?.timeline_data && stats.timeline_data.map((month) => (
                <tr key={month.month} className="border-b border-gray-700 hover:bg-[#2a2f3a]/50">
                  <td className="py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm text-white">{month.month_name?.trim()}</td>
                  <td className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm text-gray-300">{month.bookings}</td>
                  <td className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm text-gray-300">{month.nights}</td>
                  <td className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-white">
                    {formatCurrency(month.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Properties Breakdown - Mobile Optimized */}
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-2xl border-2 border-[#d85a2a]/20 mb-6">
        <h2 className="text-lg md:text-xl font-black text-[#FF8C42] mb-3 md:mb-4">Properties Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-orange-400">Property</th>
                <th className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-orange-400">Revenue</th>
                <th className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-orange-400">Nights</th>
                <th className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-orange-400">Occupancy</th>
              </tr>
            </thead>
            <tbody>
              {stats?.properties_data && stats.properties_data.map((prop, idx) => (
                <tr key={idx} className="border-b border-gray-700 hover:bg-[#2a2f3a]/50">
                  <td className="py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-white">{prop.property_name}</td>
                  <td className="text-right py-2 md:py-3 px-2 md:px-4 text-[10px] md:text-sm font-semibold text-white break-all">
                    {formatCurrency(prop.revenue)}
                  </td>
                  <td className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm text-gray-300">{prop.nights}</td>
                  <td className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm text-gray-300">{prop.occupancy_rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Booking Sources */}
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl border-2 border-[#d85a2a]/20 mb-6">
        <h2 className="text-xl font-black text-[#FF8C42] mb-4">Booking Sources</h2>
        <div className="space-y-4">
          {stats?.sources_data && stats.sources_data.map((source, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{source.source}</span>
                <span className="text-sm text-gray-300">
                  {source.bookings} bookings • {formatCurrency(source.revenue)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all"
                    style={{ width: `${source.percentage || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-white min-w-[50px] text-right">
                  {source.percentage || 0}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Payment Status - Mobile Optimized */}
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-2xl border-2 border-[#d85a2a]/20">
        <h2 className="text-lg md:text-xl font-black text-[#FF8C42] mb-3 md:mb-4">Payment Status</h2>
        <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4">
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-2 md:p-3 border-2 border-orange-500/30">
            <div className="flex items-center justify-between mb-1">
              <DollarSign className="w-4 h-4 md:w-6 md:h-6 text-orange-400" />
            </div>
            <p className="text-sm md:text-xl font-black text-white mb-0.5">
              {stats?.payment_status_data?.paid?.bookings || 0}<span className="text-xs md:text-base"> bookings</span>
            </p>
            <p className="text-orange-300 text-[10px] md:text-xs">✅ Paid</p>
            <p className="text-orange-200 text-[10px] md:text-xs mt-0.5 break-all">
              {formatCurrency(stats?.payment_status_data?.paid?.revenue || 0)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-2 md:p-3 border-2 border-orange-500/30">
            <div className="flex items-center justify-between mb-1">
              <DollarSign className="w-4 h-4 md:w-6 md:h-6 text-orange-400" />
            </div>
            <p className="text-sm md:text-xl font-black text-white mb-0.5">
              {stats?.payment_status_data?.pending?.bookings || 0}<span className="text-xs md:text-base"> bookings</span>
            </p>
            <p className="text-orange-300 text-[10px] md:text-xs">⏳ Pending</p>
            <p className="text-orange-200 text-[10px] md:text-xs mt-0.5 break-all">
              {formatCurrency(stats?.payment_status_data?.pending?.revenue || 0)}
            </p>
          </div>
        </div>

        {stats?.payment_status_data?.pending?.bookings > 0 && (
          <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded">
            <p className="text-orange-400 font-medium mb-1">📌 Action Items:</p>
            <ul className="text-white text-sm space-y-1">
              <li>• {stats.payment_status_data.pending.bookings} bookings pending payment follow-up</li>
              <li>• Expected revenue to collect: {formatCurrency(stats.payment_status_data.pending.revenue)}</li>
            </ul>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default OwnerExecutiveSummary;

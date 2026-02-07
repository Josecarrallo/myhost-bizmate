import React, { useState, useEffect } from 'react';
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Home,
  Filter
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
      {/* Header with Date Range Selector */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-black text-[#FF8C42]">Overview</h1>
            <p className="text-gray-300 mt-1">
              <span className="text-orange-400 font-semibold">{userName}</span> • Revenue & Performance Analytics
            </p>
          </div>
          <Filter className="w-6 h-6 text-orange-400" />
        </div>

        {/* Date Range Selector */}
        <div className="mt-4 p-4 bg-[#1f2937]/95 backdrop-blur-sm rounded-lg border-2 border-[#d85a2a]/20">
          <p className="text-sm font-medium text-orange-400 mb-3">📅 Custom Date Range</p>
          <div className="flex gap-3 items-end flex-wrap">
            <div className="flex-1 min-w-[140px]">
              <label className="text-xs text-gray-300 mb-1 block">Start Date</label>
              <input
                id="overview-start-date"
                type="date"
                defaultValue={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="w-full px-3 py-2 bg-[#2a2f3a] border border-orange-500/30 rounded-lg text-sm text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="text-xs text-gray-300 mb-1 block">End Date</label>
              <input
                id="overview-end-date"
                type="date"
                defaultValue={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="w-full px-3 py-2 bg-[#2a2f3a] border border-orange-500/30 rounded-lg text-sm text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <button
              onClick={handleCustomDateChange}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold text-sm transition-all shadow-lg"
            >
              📅 Custom Range
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

      {/* 2. Performance Chart - Combined Revenue & Bookings */}
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl border-2 border-[#d85a2a]/20 mb-6">
        <h2 className="text-2xl font-black text-[#FF8C42] mb-6">📊 Performance Overview</h2>
        <ResponsiveContainer width="100%" height={400}>
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

      {/* 3. Timeline Table */}
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl border-2 border-[#d85a2a]/20 mb-6">
        <h2 className="text-xl font-black text-[#FF8C42] mb-4">Revenue & Occupancy Timeline</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-orange-400">Month</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-orange-400">Bookings</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-orange-400">Nights</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-orange-400">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {stats?.timeline_data && stats.timeline_data.map((month) => (
                <tr key={month.month} className="border-b border-gray-700 hover:bg-[#2a2f3a]/50">
                  <td className="py-3 px-4 text-sm text-white">{month.month_name?.trim()}</td>
                  <td className="text-right py-3 px-4 text-sm text-gray-300">{month.bookings}</td>
                  <td className="text-right py-3 px-4 text-sm text-gray-300">{month.nights}</td>
                  <td className="text-right py-3 px-4 text-sm font-semibold text-white">
                    {formatCurrency(month.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Properties Breakdown */}
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl border-2 border-[#d85a2a]/20 mb-6">
        <h2 className="text-xl font-black text-[#FF8C42] mb-4">Properties Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-orange-400">Property</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-orange-400">Revenue</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-orange-400">Nights</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-orange-400">Occupancy</th>
              </tr>
            </thead>
            <tbody>
              {stats?.properties_data && stats.properties_data.map((prop, idx) => (
                <tr key={idx} className="border-b border-gray-700 hover:bg-[#2a2f3a]/50">
                  <td className="py-3 px-4 text-sm font-medium text-white">{prop.property_name}</td>
                  <td className="text-right py-3 px-4 text-sm font-semibold text-white">
                    {formatCurrency(prop.revenue)}
                  </td>
                  <td className="text-right py-3 px-4 text-sm text-gray-300">{prop.nights}</td>
                  <td className="text-right py-3 px-4 text-sm text-gray-300">{prop.occupancy_rate}%</td>
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

      {/* 6. Payment Status */}
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
        <h2 className="text-xl font-black text-[#FF8C42] mb-4">Payment Status</h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-3 border-2 border-orange-500/30">
            <div className="flex items-center justify-between mb-1">
              <DollarSign className="w-6 h-6 text-orange-400" />
            </div>
            <p className="text-xl font-black text-white mb-0.5">
              {stats?.payment_status_data?.paid?.bookings || 0} bookings
            </p>
            <p className="text-orange-300 text-xs">✅ Paid</p>
            <p className="text-orange-200 text-xs mt-0.5">
              {formatCurrency(stats?.payment_status_data?.paid?.revenue || 0)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-3 border-2 border-orange-500/30">
            <div className="flex items-center justify-between mb-1">
              <DollarSign className="w-6 h-6 text-orange-400" />
            </div>
            <p className="text-xl font-black text-white mb-0.5">
              {stats?.payment_status_data?.pending?.bookings || 0} bookings
            </p>
            <p className="text-orange-300 text-xs">⏳ Pending</p>
            <p className="text-orange-200 text-xs mt-0.5">
              {formatCurrency(stats?.payment_status_data?.pending?.revenue || 0)}
            </p>
          </div>
        </div>

        {stats?.payment_status_data?.pending?.bookings > 0 && (
          <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-yellow-400 font-medium mb-1">📌 Action Items:</p>
            <ul className="text-yellow-300 text-sm space-y-1">
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

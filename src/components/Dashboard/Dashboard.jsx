import React from 'react';
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  AlertCircle
} from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Dashboard = ({ onBack }) => {
  // KPIs Data
  const kpis = [
    {
      label: 'Occupancy',
      value: '76%',
      change: '+12%',
      subtext: 'For change',
      trend: 'up',
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Revenue (MTD)',
      value: '$52,200',
      change: '+6%',
      subtext: 'Direct',
      trend: 'up',
      color: 'from-green-500 to-green-600'
    },
    {
      label: 'Bookings',
      value: '64',
      change: '-9%',
      subtext: 'Codo',
      trend: 'down',
      color: 'from-purple-500 to-purple-600'
    },
    {
      label: 'ADR / RevPAR',
      value: '$220',
      subvalue: '$168',
      subtext: 'Blr 1011',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  // Revenue & Occupancy Chart Data
  const revenueOccupancyData = [
    { day: 'Mon', revenue: 45, occupancy: 65 },
    { day: 'Tue', revenue: 52, occupancy: 70 },
    { day: 'Wed', revenue: 48, occupancy: 68 },
    { day: 'Thur', revenue: 61, occupancy: 75 },
    { day: 'Fri', revenue: 55, occupancy: 72 },
    { day: 'Sat', revenue: 67, occupancy: 82 },
    { day: 'Sun', revenue: 58, occupancy: 76 }
  ];

  // Bookings by Channel Data
  const bookingsByChannel = [
    { name: 'Booking.com', value: 39, color: '#3b82f6' },
    { name: 'Airbnb', value: 28, color: '#f59e0b' },
    { name: 'Direct', value: 28, color: '#10b981' },
    { name: 'Expedia', value: 10, color: '#8b5cf6' }
  ];

  // Availability Snapshot - Days of the month
  const availabilityDays = [
    { day: 23, status: 'occupied' },
    { day: 24, status: 'occupied' },
    { day: 25, status: 'available' },
    { day: 26, status: 'available' },
    { day: 27, status: 'occupied' },
    { day: 28, status: 'available' },
    { day: 29, status: 'occupied' },
    { day: 30, status: 'available' },
    { day: 31, status: 'occupied' },
    { day: 32, status: 'available' },
    { day: 33, status: 'occupied' },
    { day: 34, status: 'available' },
    { day: 35, status: 'occupied' },
    { day: 36, status: 'available' },
    { day: 37, status: 'available' },
    { day: 38, status: 'occupied' },
    { day: 39, status: 'available' },
    { day: 40, status: 'occupied' },
    { day: 41, status: 'available' }
  ];

  const availableCount = availabilityDays.filter(d => d.status === 'available').length;

  // Alerts Data
  const alerts = [
    {
      label: '8 Arrivals today',
      time: 'Today',
      status: 'Pending',
      priority: 'medium'
    },
    {
      label: '$1,660 Pending payments',
      time: 'Today',
      status: 'Pending',
      priority: 'high'
    },
    {
      label: '3 Pending housekeeping tasks',
      time: 'Today',
      status: 'Needs Action',
      priority: 'high'
    }
  ];

  return (
    <div className="flex-1 h-screen bg-[#2a2f3a] p-4 pb-24 relative overflow-auto">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-[#d85a2a]/5 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="p-3 bg-[#1f2937] rounded-2xl hover:bg-[#374151] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-[#d85a2a]/20"
          >
            <ChevronLeft className="w-6 h-6 text-[#FF8C42]" />
          </button>

          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl">Dashboard</h2>
          </div>

          <div className="w-[52px]"></div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpis.map((kpi, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-[#1f2937] to-[#374151] rounded-2xl p-6 border border-[#d85a2a]/20 shadow-xl"
            >
              <p className="text-sm text-white/80 mb-2">{kpi.label}</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-white">{kpi.value}</span>
                {kpi.change && (
                  <div className="flex items-center gap-1">
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-[#10b981]" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-[#10b981]' : 'text-red-400'}`}>
                      {kpi.change}
                    </span>
                  </div>
                )}
              </div>
              {kpi.subvalue && (
                <p className="text-xl font-semibold text-white/90 mb-1">/ {kpi.subvalue}</p>
              )}
              {kpi.subtext && (
                <p className="text-xs text-white/70">{kpi.subtext}</p>
              )}
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue & Occupancy Chart */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border border-[#d85a2a]/20 shadow-2xl">
            <h3 className="text-xl font-black text-[#FF8C42] mb-4">Revenue & Occupancy</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueOccupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="day"
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Revenue (K)"
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="occupancy"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Occupancy (%)"
                  dot={{ fill: '#10b981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bookings by Channel Pie Chart */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border border-[#d85a2a]/20 shadow-2xl">
            <h3 className="text-xl font-black text-[#FF8C42] mb-4">Bookings by Channel</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={bookingsByChannel}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bookingsByChannel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row: Availability, Alerts, AI Recommendation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Availability Snapshot */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border border-[#d85a2a]/20 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-[#FF8C42]">Availability Snapshot</h3>
              <span className="text-sm font-medium text-[#FF8C42]">{availableCount} sid</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {availabilityDays.map((day, index) => (
                <div
                  key={index}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center text-sm font-medium
                    ${day.status === 'available'
                      ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30'
                      : 'bg-[#374151] text-white/60 border border-white/10'
                    }
                  `}
                >
                  {day.day}
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border border-[#d85a2a]/20 shadow-2xl">
            <h3 className="text-xl font-black text-[#FF8C42] mb-4">Alerts</h3>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-[#d85a2a]/10 rounded-lg border border-[#d85a2a]/20">
                  <AlertCircle className="w-5 h-5 text-[#FF8C42] flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm">{alert.label}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-white/60">{alert.time}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#d85a2a]/20 text-[#FF8C42]">
                        {alert.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border border-[#d85a2a]/20 shadow-2xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] rounded-lg">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-black text-[#FF8C42]">AI Recommendation</h3>
            </div>
            <p className="text-sm text-white/90 leading-relaxed mb-4">
              Consider offering a 5% discount for Airbnb bookings in the next 2 weeks to boost occupancy during the low season.
            </p>
            <button className="w-full px-4 py-2 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] hover:opacity-90 text-white rounded-lg font-medium text-sm transition-opacity">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

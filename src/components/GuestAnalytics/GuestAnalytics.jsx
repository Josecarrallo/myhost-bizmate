import React, { useState } from 'react';
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Users,
  Home,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Zap,
  Eye,
  MousePointer,
  Star,
  Clock
} from 'lucide-react';

const GuestAnalytics = ({ onBack }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d'); // 7d, 30d, 90d, 1y
  const [selectedProperty, setSelectedProperty] = useState('all');

  // Demo data for KPIs
  const kpis = {
    totalRevenue: 45780,
    revenueChange: 12.5,
    totalBookings: 156,
    bookingsChange: 8.3,
    occupancyRate: 78.5,
    occupancyChange: 5.2,
    adr: 185.50, // Average Daily Rate
    adrChange: -2.1,
    averageStay: 3.8,
    repeatGuestRate: 42,
    reviewScore: 4.7,
    responseRate: 98
  };

  // Demo data for property performance
  const propertyPerformance = [
    {
      id: 1,
      name: "Villa Sunset",
      revenue: 18500,
      bookings: 42,
      occupancy: 85,
      adr: 220,
      reviews: 4.8,
      trend: 'up'
    },
    {
      id: 2,
      name: "Beach House",
      revenue: 15200,
      bookings: 58,
      occupancy: 76,
      adr: 165,
      reviews: 4.6,
      trend: 'up'
    },
    {
      id: 3,
      name: "Villa Paradise",
      revenue: 12080,
      bookings: 56,
      occupancy: 74,
      adr: 175,
      reviews: 4.7,
      trend: 'down'
    }
  ];

  // Marketing metrics
  const marketingMetrics = {
    conversionRate: 3.8,
    costPerBooking: 45.50,
    roi: 340,
    adSpend: 3250,
    organicBookings: 65,
    paidBookings: 48,
    directBookings: 43
  };

  // Booking sources
  const bookingSources = [
    { source: 'Direct Website', bookings: 43, percentage: 27.6, color: 'bg-[#d85a2a]' },
    { source: 'Airbnb', bookings: 38, percentage: 24.4, color: 'bg-pink-500' },
    { source: 'Booking.com', bookings: 35, percentage: 22.4, color: 'bg-blue-500' },
    { source: 'Instagram Ads', bookings: 25, percentage: 16.0, color: 'bg-purple-500' },
    { source: 'Google Ads', bookings: 15, percentage: 9.6, color: 'bg-green-500' }
  ];

  // Guest segments
  const guestSegments = [
    { segment: 'VIP Guests', count: 12, revenue: 15600, color: 'bg-purple-500' },
    { segment: 'Repeat Guests', count: 45, revenue: 18900, color: 'bg-[#d85a2a]' },
    { segment: 'High Value', count: 28, revenue: 14200, color: 'bg-blue-500' },
    { segment: 'First Time', count: 71, revenue: 12080, color: 'bg-green-500' }
  ];

  const periods = [
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: '90d', label: '90 Days' },
    { id: '1y', label: '1 Year' }
  ];

  const properties = [
    { id: 'all', name: 'All Properties' },
    { id: 'villa-sunset', name: 'Villa Sunset' },
    { id: 'beach-house', name: 'Beach House' },
    { id: 'villa-paradise', name: 'Villa Paradise' }
  ];

  const StatCard = ({ icon: Icon, label, value, change, prefix = '', suffix = '' }) => {
    const isPositive = change >= 0;
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#d85a2a] to-[#FF8C42] rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(change)}%
          </div>
        </div>
        <div className="text-3xl font-black text-[#d85a2a] mb-1">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </div>
        <div className="text-sm font-semibold text-gray-600">{label}</div>
      </div>
    );
  };

  return (
    <div className="flex-1 h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50 p-4 relative overflow-auto">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 mb-6 border-2 border-orange-200 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#d85a2a] hover:text-[#FF8C42] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <div className="text-center flex-1">
            <h2 className="text-3xl font-black text-[#d85a2a] flex items-center justify-center gap-3">
              <BarChart3 className="w-8 h-8" />
              Guest Analytics & Insights
            </h2>
            <p className="text-sm text-gray-600 font-semibold">Performance metrics and business intelligence</p>
          </div>
          <div className="w-20"></div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="flex gap-2">
            {periods.map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  selectedPeriod === period.id
                    ? 'bg-gradient-to-r from-[#d85a2a] to-[#FF8C42] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-4 py-2 rounded-xl border-2 border-gray-200 font-bold text-gray-700 bg-white hover:border-orange-300 transition-colors"
          >
            {properties.map((property) => (
              <option key={property.id} value={property.id}>{property.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={kpis.totalRevenue}
          change={kpis.revenueChange}
          prefix="$"
        />
        <StatCard
          icon={Calendar}
          label="Total Bookings"
          value={kpis.totalBookings}
          change={kpis.bookingsChange}
        />
        <StatCard
          icon={Activity}
          label="Occupancy Rate"
          value={kpis.occupancyRate}
          change={kpis.occupancyChange}
          suffix="%"
        />
        <StatCard
          icon={TrendingUp}
          label="Average Daily Rate"
          value={kpis.adr}
          change={kpis.adrChange}
          prefix="$"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border-2 border-orange-200 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-[#d85a2a]" />
            <span className="text-sm font-bold text-gray-600">Avg Stay Duration</span>
          </div>
          <div className="text-2xl font-black text-[#d85a2a]">{kpis.averageStay} nights</div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border-2 border-orange-200 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-[#d85a2a]" />
            <span className="text-sm font-bold text-gray-600">Repeat Guest Rate</span>
          </div>
          <div className="text-2xl font-black text-[#d85a2a]">{kpis.repeatGuestRate}%</div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border-2 border-orange-200 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-[#d85a2a]" />
            <span className="text-sm font-bold text-gray-600">Avg Review Score</span>
          </div>
          <div className="text-2xl font-black text-[#d85a2a]">{kpis.reviewScore} ★</div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border-2 border-orange-200 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-[#d85a2a]" />
            <span className="text-sm font-bold text-gray-600">Response Rate</span>
          </div>
          <div className="text-2xl font-black text-[#d85a2a]">{kpis.responseRate}%</div>
        </div>
      </div>

      {/* Revenue Trend Chart (Placeholder) */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-6 border-2 border-orange-200 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-[#d85a2a]" />
            <h3 className="text-xl font-black text-gray-800">Revenue Trend (Last 30 Days)</h3>
          </div>
          <span className="text-sm font-semibold text-gray-500">Daily breakdown</span>
        </div>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl">
          <div className="text-center text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold">Interactive chart visualization</p>
            <p className="text-xs mt-1">Coming in Phase 2 with Recharts integration</p>
          </div>
        </div>
      </div>

      {/* Property Performance */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-6 border-2 border-orange-200 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Home className="w-6 h-6 text-[#d85a2a]" />
          <h3 className="text-xl font-black text-gray-800">Property Performance</h3>
        </div>
        <div className="space-y-3">
          {propertyPerformance.map((property) => (
            <div
              key={property.id}
              className="bg-orange-50 rounded-xl p-4 hover:bg-orange-100 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#d85a2a] to-[#FF8C42] rounded-lg flex items-center justify-center">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-800">{property.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{property.reviews}</span>
                    </div>
                  </div>
                </div>
                <div className={`flex items-center gap-1 font-bold ${property.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {property.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="text-sm">{property.trend === 'up' ? '+8%' : '-3%'}</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-gray-600 font-semibold mb-1">Revenue</div>
                  <div className="text-lg font-black text-[#d85a2a]">${(property.revenue / 1000).toFixed(1)}K</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 font-semibold mb-1">Bookings</div>
                  <div className="text-lg font-black text-[#d85a2a]">{property.bookings}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 font-semibold mb-1">Occupancy</div>
                  <div className="text-lg font-black text-[#d85a2a]">{property.occupancy}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 font-semibold mb-1">ADR</div>
                  <div className="text-lg font-black text-[#d85a2a]">${property.adr}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Booking Sources */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <PieChart className="w-6 h-6 text-[#d85a2a]" />
            <h3 className="text-xl font-black text-gray-800">Booking Sources</h3>
          </div>
          <div className="space-y-3">
            {bookingSources.map((source, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">{source.source}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-800">{source.bookings}</span>
                    <span className="text-xs text-gray-500">({source.percentage}%)</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${source.color} transition-all duration-500`}
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marketing Metrics */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-[#d85a2a]" />
            <h3 className="text-xl font-black text-gray-800">Marketing Performance</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MousePointer className="w-4 h-4 text-[#d85a2a]" />
                  <span className="text-xs font-bold text-gray-600">Conversion Rate</span>
                </div>
                <div className="text-2xl font-black text-[#d85a2a]">{marketingMetrics.conversionRate}%</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-[#d85a2a]" />
                  <span className="text-xs font-bold text-gray-600">Cost / Booking</span>
                </div>
                <div className="text-2xl font-black text-[#d85a2a]">${marketingMetrics.costPerBooking}</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#d85a2a] to-[#FF8C42] rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5" />
                <span className="text-sm font-bold opacity-90">Marketing ROI</span>
              </div>
              <div className="text-3xl font-black">{marketingMetrics.roi}%</div>
              <div className="text-xs opacity-80 mt-1">Total ad spend: ${marketingMetrics.adSpend.toLocaleString()}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <div className="text-lg font-black text-[#d85a2a]">{marketingMetrics.organicBookings}</div>
                <div className="text-xs text-gray-600 font-semibold">Organic</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <div className="text-lg font-black text-[#d85a2a]">{marketingMetrics.paidBookings}</div>
                <div className="text-xs text-gray-600 font-semibold">Paid Ads</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <div className="text-lg font-black text-[#d85a2a]">{marketingMetrics.directBookings}</div>
                <div className="text-xs text-gray-600 font-semibold">Direct</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Segments */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-[#d85a2a]" />
          <h3 className="text-xl font-black text-gray-800">Revenue by Guest Segment</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {guestSegments.map((segment, idx) => (
            <div key={idx} className="bg-orange-50 rounded-xl p-4 hover:bg-orange-100 transition-all">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-3 h-3 rounded-full ${segment.color}`}></div>
                <span className="text-sm font-bold text-gray-700">{segment.segment}</span>
              </div>
              <div className="text-2xl font-black text-[#d85a2a] mb-1">${(segment.revenue / 1000).toFixed(1)}K</div>
              <div className="text-xs text-gray-600 font-semibold">{segment.count} guests</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuestAnalytics;

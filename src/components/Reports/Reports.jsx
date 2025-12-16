import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  DollarSign,
  Calendar,
  Percent,
  TrendingUp,
  BarChart3,
  Users,
  Eye,
  MapPin,
  Star,
  Award,
  Crown,
  ThumbsUp,
  MessageSquare,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart as ReBarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const ReportsInsights = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const monthlyData = [
    { month: 'Nov 24', revenue: 38500, bookings: 24, occupancy: 78, adr: 385 },
    { month: 'Dec 24', revenue: 52000, bookings: 32, occupancy: 89, adr: 412 },
    { month: 'Jan 25', revenue: 45200, bookings: 28, occupancy: 87, adr: 398 },
    { month: 'Feb 25', revenue: 41800, bookings: 26, occupancy: 82, adr: 392 },
    { month: 'Mar 25', revenue: 48500, bookings: 31, occupancy: 88, adr: 405 },
    { month: 'Apr 25', revenue: 55200, bookings: 35, occupancy: 92, adr: 425 },
    { month: 'May 25', revenue: 51800, bookings: 33, occupancy: 90, adr: 415 },
    { month: 'Jun 25', revenue: 58900, bookings: 38, occupancy: 94, adr: 438 },
    { month: 'Jul 25', revenue: 62500, bookings: 42, occupancy: 96, adr: 445 },
    { month: 'Aug 25', revenue: 59800, bookings: 39, occupancy: 93, adr: 432 },
    { month: 'Sep 25', revenue: 53200, bookings: 34, occupancy: 89, adr: 418 },
    { month: 'Oct 25', revenue: 56700, bookings: 36, occupancy: 91, adr: 428 }
  ];

  const totalRevenue = monthlyData.reduce((sum, month) => sum + month.revenue, 0);
  const totalBookings = monthlyData.reduce((sum, month) => sum + month.bookings, 0);
  const avgOccupancy = (monthlyData.reduce((sum, month) => sum + month.occupancy, 0) / monthlyData.length).toFixed(1);
  const avgADR = (monthlyData.reduce((sum, month) => sum + month.adr, 0) / monthlyData.length).toFixed(0);

  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];

  const revenueChange = (((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100).toFixed(1);
  const bookingsChange = (((currentMonth.bookings - previousMonth.bookings) / previousMonth.bookings) * 100).toFixed(1);
  const occupancyChange = (currentMonth.occupancy - previousMonth.occupancy).toFixed(1);
  const adrChange = (((currentMonth.adr - previousMonth.adr) / previousMonth.adr) * 100).toFixed(1);

  const recentClients = [
    { id: 1, name: 'Sarah Johnson', property: 'Villa Sunset', checkIn: 'Oct 25', nights: 5, revenue: 2125, status: 'active', avatar: 'SJ', rating: 5 },
    { id: 2, name: 'Michael Chen', property: 'Beach House', checkIn: 'Oct 28', nights: 5, revenue: 2600, status: 'confirmed', avatar: 'MC', rating: 5 },
    { id: 3, name: 'Emma Wilson', property: 'City Loft', checkIn: 'Oct 24', nights: 3, revenue: 1140, status: 'active', avatar: 'EW', rating: 4 },
    { id: 4, name: 'David Park', property: 'Mountain Cabin', checkIn: 'Oct 22', nights: 3, revenue: 735, status: 'completed', avatar: 'DP', rating: 5 }
  ];

  const topGuests = [
    { id: 1, name: 'Jennifer Martinez', avatar: 'JM', bookings: 8, spent: 18500, lastVisit: 'Sep 25', favorite: 'Villa Sunset', rating: 5 },
    { id: 2, name: 'Robert Taylor', avatar: 'RT', bookings: 6, spent: 14200, lastVisit: 'Aug 25', favorite: 'Beach House', rating: 5 },
    { id: 3, name: 'Lisa Anderson', avatar: 'LA', bookings: 5, spent: 11800, lastVisit: 'Oct 25', favorite: 'City Loft', rating: 5 },
    { id: 4, name: 'James Wilson', avatar: 'JW', bookings: 5, spent: 10950, lastVisit: 'Jul 25', favorite: 'Mountain Cabin', rating: 4 }
  ];

  const topContent = [
    { id: 1, type: 'video', title: 'Villa Sunset Tour - Luxury Bali Experience', views: 45200, likes: 3840, comments: 286, shares: 892, platform: 'Instagram', thumbnail: '🏖️', engagement: 11.2 },
    { id: 2, type: 'post', title: 'Top 10 Activities Near Our Beach House', views: 38500, likes: 2950, comments: 184, shares: 645, platform: 'Facebook', thumbnail: '🌊', engagement: 9.8 },
    { id: 3, type: 'video', title: 'Mountain Cabin Sunrise Yoga Session', views: 32800, likes: 2680, comments: 156, shares: 478, platform: 'Instagram', thumbnail: '⛰️', engagement: 10.1 },
    { id: 4, type: 'post', title: 'City Loft: Perfect for Digital Nomads', views: 28900, likes: 2240, comments: 132, shares: 356, platform: 'LinkedIn', thumbnail: '🏢', engagement: 9.4 },
    { id: 5, type: 'video', title: 'Behind the Scenes: Villa Preparation', views: 24500, likes: 1920, comments: 98, shares: 287, platform: 'Instagram', thumbnail: '✨', engagement: 9.4 }
  ];

  const propertyDistribution = [
    { name: 'Villa Sunset', value: 142, color: '#F97316' },
    { name: 'Beach House', value: 128, color: '#EC4899' },
    { name: 'Mountain Cabin', value: 95, color: '#8B5CF6' },
    { name: 'City Loft', value: 89, color: '#3B82F6' }
  ];

  const COLORS = ['#F97316', '#EC4899', '#8B5CF6', '#3B82F6'];

  const KPICard = ({ icon: Icon, label, value, change, prefix = '', suffix = '', gradient }) => {
    const isPositive = parseFloat(change) >= 0;
    const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

    return (
      <div className={`bg-gradient-to-br ${gradient} text-white p-6 rounded-3xl transform transition-all hover:scale-105 hover:shadow-2xl`}>
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
            <Icon className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${isPositive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            <TrendIcon className="w-4 h-4" />
            <span className="text-sm font-bold">{Math.abs(change)}%</span>
          </div>
        </div>
        <p className="text-white/80 text-sm mb-2">{label}</p>
        <p className="text-4xl font-black">{prefix}{value}{suffix}</p>
      </div>
    );
  };

  const ClientCard = ({ client }) => {
    const statusColors = {
      active: 'bg-green-100 text-green-700',
      confirmed: 'bg-blue-100 text-blue-700',
      completed: 'bg-gray-100 text-gray-700'
    };

    return (
      <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 hover:border-orange-200 transition-all hover:shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {client.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-bold text-orange-600 text-lg mb-1">{client.name}</h4>
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {client.property}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[client.status]}`}>
                {client.status}
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t-2 border-gray-100">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div><span className="font-bold text-gray-900">{client.nights}</span> nights</div>
                <div><Calendar className="w-4 h-4 inline mr-1" />{client.checkIn}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(client.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-xl font-black text-orange-500">${client.revenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TopGuestCard = ({ guest, rank }) => {
    return (
      <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 hover:border-purple-200 transition-all hover:shadow-lg">
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl">
              {guest.avatar}
            </div>
            {rank <= 3 && (
              <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full ${rank === 1 ? 'bg-yellow-400' : rank === 2 ? 'bg-gray-300' : 'bg-orange-400'} border-2 border-white flex items-center justify-center`}>
                <Crown className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-gray-900 text-lg mb-1">{guest.name}</h4>
                <p className="text-gray-500 text-sm">Favorite: {guest.favorite}</p>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(guest.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">Bookings</p>
                <p className="text-lg font-black text-purple-600">{guest.bookings}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">Total Spent</p>
                <p className="text-lg font-black text-green-600">${(guest.spent / 1000).toFixed(1)}K</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">Last Visit</p>
                <p className="text-lg font-black text-blue-600">{guest.lastVisit}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ContentCard = ({ content }) => {
    const platformColors = {
      Instagram: 'text-pink-500',
      Facebook: 'text-blue-600',
      LinkedIn: 'text-blue-700',
      Twitter: 'text-blue-400'
    };

    return (
      <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 hover:border-blue-200 transition-all hover:shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-4xl flex-shrink-0">
            {content.thumbnail}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${content.type === 'video' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {content.type === 'video' ? '▶ Video' : '📝 Post'}
                  </span>
                  <span className={`text-sm font-bold ${platformColors[content.platform]}`}>
                    {content.platform}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">{content.title}</h4>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                  <Eye className="w-4 h-4" />
                </div>
                <p className="text-sm font-bold text-gray-900">{(content.views / 1000).toFixed(1)}K</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                  <ThumbsUp className="w-4 h-4" />
                </div>
                <p className="text-sm font-bold text-gray-900">{(content.likes / 1000).toFixed(1)}K</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <p className="text-sm font-bold text-gray-900">{content.comments}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                  <Activity className="w-4 h-4" />
                </div>
                <p className="text-sm font-bold text-orange-600">{content.engagement}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-2xl shadow-xl border-2 border-gray-100">
          <p className="font-bold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-bold">{entry.name}:</span> {entry.name === 'Revenue' ? `$${entry.value.toLocaleString()}` : entry.name === 'Occupancy' ? `${entry.value}%` : entry.name === 'ADR' ? `$${entry.value}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-4 pb-24 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-orange-200/30 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <ChevronLeft className="w-6 h-6 text-orange-600" />
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl">Reports</h2>
          </div>
          <div className="flex gap-2">
            <button className="px-6 py-3 bg-white/95 backdrop-blur-sm border-2 border-white/50 rounded-2xl font-bold hover:bg-white transition-all duration-300 shadow-lg text-orange-600">
              Last 12 Months
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard icon={DollarSign} label="Total Revenue (12M)" value={(totalRevenue / 1000).toFixed(1)} suffix="K" prefix="$" change={revenueChange} gradient="from-orange-500 to-orange-600" />
          <KPICard icon={Calendar} label="Total Bookings (12M)" value={totalBookings} change={bookingsChange} gradient="from-orange-500 to-orange-600" />
          <KPICard icon={Percent} label="Avg Occupancy Rate" value={avgOccupancy} suffix="%" change={occupancyChange} gradient="from-orange-500 to-orange-600" />
          <KPICard icon={TrendingUp} label="Average Daily Rate" value={avgADR} prefix="$" change={adrChange} gradient="from-orange-500 to-orange-600" />
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button onClick={() => setActiveTab('overview')} className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all shadow-lg ${activeTab === 'overview' ? 'bg-white text-orange-600' : 'bg-white/60 text-white hover:bg-white/80 border-2 border-white/50'}`}>
            <BarChart3 className="w-5 h-5 inline mr-2" />Overview
          </button>
          <button onClick={() => setActiveTab('clients')} className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all shadow-lg ${activeTab === 'clients' ? 'bg-white text-orange-600' : 'bg-white/60 text-white hover:bg-white/80 border-2 border-white/50'}`}>
            <Users className="w-5 h-5 inline mr-2" />Clients & Top Guests
          </button>
          <button onClick={() => setActiveTab('content')} className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all shadow-lg ${activeTab === 'content' ? 'bg-white text-orange-600' : 'bg-white/60 text-white hover:bg-white/80 border-2 border-white/50'}`}>
            <Eye className="w-5 h-5 inline mr-2" />Top Content
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-lg">
              <h3 className="text-2xl font-black text-orange-600 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-orange-500" />
                Monthly Revenue Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 600 }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 600 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-lg">
                <h3 className="text-xl font-black text-orange-600 mb-6 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-500" />
                  Bookings per Month
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <ReBarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '11px', fontWeight: 600 }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '11px', fontWeight: 600 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="bookings" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                  </ReBarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-lg">
                <h3 className="text-xl font-black text-orange-600 mb-6 flex items-center gap-2">
                  <Percent className="w-6 h-6 text-purple-500" />
                  Occupancy Rate %
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '11px', fontWeight: 600 }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '11px', fontWeight: 600 }} domain={[70, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="occupancy" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-lg">
              <h3 className="text-2xl font-black text-orange-600 mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-pink-500" />
                Bookings by Property (12M)
              </h3>
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
                    <Pie data={propertyDistribution} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                      {propertyDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {propertyDistribution.map((property, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-lg" style={{ backgroundColor: property.color }}></div>
                      <div>
                        <p className="font-bold text-gray-900">{property.name}</p>
                        <p className="text-sm text-gray-600">{property.value} bookings</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-500" />Recent Clients
              </h3>
              <div className="space-y-4">
                {recentClients.map(client => (<ClientCard key={client.id} client={client} />))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-500" />Top Guests (12M)
              </h3>
              <div className="space-y-4">
                {topGuests.map((guest, idx) => (<TopGuestCard key={guest.id} guest={guest} rank={idx + 1} />))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <Eye className="w-6 h-6 text-blue-500" />Most Viewed Content
              </h3>
              <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-xl border-2 border-gray-100 font-bold">
                Total Views: {(topContent.reduce((sum, c) => sum + c.views, 0) / 1000).toFixed(1)}K
              </div>
            </div>
            <div className="space-y-4">
              {topContent.map(content => (<ContentCard key={content.id} content={content} />))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsInsights;

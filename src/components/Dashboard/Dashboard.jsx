import React, { useState, useEffect } from 'react';
import { ChevronLeft, Bell, Settings, DollarSign, Calendar, Home, TrendingUp, Sparkles, AlertCircle, Lightbulb, DollarSignIcon, Globe, Plus, ClipboardList, Wrench, CreditCard, MessageSquare } from 'lucide-react';
import { StatCard, BookingCard, MessageCard } from '../common';
import { dataService } from '../../services/data';

const Dashboard = ({ onBack }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  // Mock AI Insights
  const aiInsights = [
    { id: 1, type: 'insight', icon: Lightbulb, title: 'Revenue Opportunity', message: 'Villa Sunset has 3 unbooked nights this week. Consider a 15% discount to fill gaps.', color: 'from-blue-500 to-cyan-600' },
    { id: 2, type: 'pricing', icon: DollarSignIcon, title: 'Smart Pricing Alert', message: 'Recommended price increase for Beach House this weekend: $320/night (+12%)' , color: 'from-green-500 to-emerald-600'},
    { id: 3, type: 'alert', icon: AlertCircle, title: 'Maintenance Alert', message: 'Pool cleaning scheduled for Villa Paradise tomorrow at 10 AM. Guest check-in at 3 PM.', color: 'from-orange-500 to-red-600' },
    { id: 4, type: 'cultural', icon: Globe, title: 'Cultural Event', message: 'Nyepi (Day of Silence) on March 22. Inform guests about restrictions and ceremonies.', color: 'from-purple-500 to-pink-600' },
    { id: 5, type: 'operation', icon: ClipboardList, title: 'Operational Tip', message: '3 check-outs tomorrow morning. Schedule housekeeping team for 11 AM start.', color: 'from-indigo-500 to-blue-600' },
  ];

  // Mock Quick Actions
  const quickActions = [
    { id: 1, icon: Plus, label: 'New Booking', color: 'from-blue-500 to-cyan-600' },
    { id: 2, icon: Calendar, label: 'Calendar', color: 'from-purple-500 to-pink-600' },
    { id: 3, icon: ClipboardList, label: 'Housekeeping', color: 'from-green-500 to-emerald-600' },
    { id: 4, icon: Wrench, label: 'Maintenance', color: 'from-orange-500 to-red-600' },
    { id: 5, icon: CreditCard, label: 'Payments', color: 'from-indigo-500 to-purple-600' },
    { id: 6, icon: Sparkles, label: 'AI Assistant', color: 'from-orange-500 to-pink-600' },
  ];

  // Cargar stats reales de Supabase
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await dataService.getDashboardStats();
      if (data && data.length > 0) {
        setStats(data[0]); // La función retorna un array con 1 objeto
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50"
          >
            <ChevronLeft className="w-6 h-6 text-orange-600" />
          </button>

          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl mb-1">MY HOST</h2>
            <p className="text-2xl md:text-3xl font-bold text-orange-100 drop-shadow-xl">BizMate</p>
          </div>

          <div className="flex gap-2">
            <button className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50 relative">
              <Bell className="w-6 h-6 text-orange-600" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-lg">3</div>
            </button>
            <button className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
              <Settings className="w-6 h-6 text-orange-600" />
            </button>
          </div>
        </div>

        {/* KPIs - Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          <StatCard icon={Home} label="Properties" value={stats ? stats.total_properties.toString() : "..."} gradient="from-orange-500 to-orange-600" />
          <StatCard icon={Calendar} label="Total Bookings" value={stats ? stats.total_bookings.toString() : "..."} gradient="from-orange-500 to-orange-600" />
          <StatCard icon={Calendar} label="Active Bookings" value={stats ? stats.active_bookings.toString() : "..."} gradient="from-orange-500 to-orange-600" />
          <StatCard icon={DollarSign} label="Revenue Today" value="$2.4K" trend="+12%" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={Calendar} label="Check-ins Today" value="5" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={Calendar} label="Check-outs Today" value="3" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={TrendingUp} label="Occupancy" value="87%" trend="+5%" gradient="from-orange-500 to-orange-600" />
        </div>

        {/* Quick Actions */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/50 mb-6">
          <h3 className="text-2xl font-black text-orange-600 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  className="group bg-white hover:bg-gradient-to-br hover:from-orange-50 hover:to-white border-2 border-gray-200 hover:border-orange-300 rounded-2xl p-4 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 mx-auto shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs font-bold text-orange-600 text-center">{action.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/50 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-black text-orange-600">AI Insights</h3>
            </div>
            <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">5 New</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {aiInsights.map((insight) => {
              const Icon = insight.icon;
              return (
                <div
                  key={insight.id}
                  className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-4 hover:border-orange-300 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${insight.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-black text-orange-600 mb-1">{insight.title}</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">{insight.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-orange-600">Recent Bookings</h3>
              <button className="text-orange-600 font-bold text-sm hover:text-orange-700 transition-colors px-4 py-2 rounded-full hover:bg-orange-50">
                View All →
              </button>
            </div>
            <div className="space-y-4">
              <BookingCard guest="Sarah Johnson" property="Villa Sunset" checkIn="Oct 25" checkOut="Oct 30" status="Confirmed" guests={4} revenue={1250} />
              <BookingCard guest="Michael Chen" property="Beach House" checkIn="Oct 28" checkOut="Nov 2" status="Pending" guests={6} revenue={1800} />
              <BookingCard guest="Emma Rodriguez" property="City Loft" checkIn="Nov 1" checkOut="Nov 5" status="Confirmed" guests={2} revenue={890} />
            </div>
          </div>

          {/* Recent Messages */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-orange-600">Recent Messages</h3>
              <button className="text-orange-600 font-bold text-sm hover:text-orange-700 transition-colors px-4 py-2 rounded-full hover:bg-orange-50">
                View All →
              </button>
            </div>
            <div className="space-y-4">
              <MessageCard name="Emma Wilson" property="City Loft" message="Hi! I'd like to know if early check-in is possible for my reservation next week?" time="5m ago" unread={true} avatar="EW" />
              <MessageCard name="David Park" property="Mountain Cabin" message="Thank you for the wonderful stay! Everything was perfect." time="2h ago" unread={false} avatar="DP" />
              <MessageCard name="Sofia Martinez" property="Villa Sunset" message="Can you recommend good restaurants nearby?" time="3h ago" unread={true} avatar="SM" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import { ChevronLeft, Bell, Settings, DollarSign, Calendar, Home, TrendingUp } from 'lucide-react';
import { StatCard, BookingCard, MessageCard } from '../common';

const Dashboard = ({ onBack }) => {
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={DollarSign} label="Monthly Revenue" value="$45.2K" trend="+12%" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={Calendar} label="Active Bookings" value="28" trend="+8%" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={Home} label="Properties" value="12" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={TrendingUp} label="Occupancy Rate" value="87%" trend="+5%" gradient="from-orange-500 to-orange-600" />
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

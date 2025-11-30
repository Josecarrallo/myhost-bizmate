import React from 'react';
import {
  ChevronLeft,
  Plus,
  Calendar,
  Users,
  TrendingUp,
  Filter
} from 'lucide-react';
import { StatCard, BookingCard } from '../common';

const Bookings = ({ onBack }) => {
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
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl mb-1">MY HOST</h2>
            <p className="text-2xl md:text-3xl font-bold text-orange-100 drop-shadow-xl">BizMate</p>
          </div>
          <button className="px-6 py-3 bg-white/95 backdrop-blur-sm text-orange-600 rounded-2xl font-bold hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <Plus className="w-5 h-5 inline mr-2" /> New Booking
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard icon={Calendar} label="Active Bookings" value="28" trend="+8%" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={Users} label="Total Guests" value="156" trend="+15%" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={TrendingUp} label="Check-ins Today" value="5" gradient="from-orange-500 to-orange-600" />
        </div>

        <div className="flex items-center gap-4 mb-6">
          <button className="px-6 py-3 bg-white/95 backdrop-blur-sm border-2 border-white/50 rounded-2xl font-bold hover:bg-white transition-all duration-300 shadow-lg flex items-center gap-2 text-orange-600">
            <Filter className="w-5 h-5" /> Filter
          </button>
          <button className="px-6 py-3 bg-white/95 backdrop-blur-sm border-2 border-white/50 rounded-2xl font-bold hover:bg-white transition-all duration-300 shadow-lg flex items-center gap-2 text-orange-600">
            <Calendar className="w-5 h-5" /> Calendar View
          </button>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/50">
          <div className="space-y-4">
            <BookingCard guest="Sarah Johnson" property="Villa Sunset" checkIn="Oct 25" checkOut="Oct 30" status="Confirmed" guests={4} revenue={1250} />
            <BookingCard guest="Michael Chen" property="Beach House" checkIn="Oct 28" checkOut="Nov 2" status="Pending" guests={6} revenue={1800} />
            <BookingCard guest="Emma Wilson" property="City Loft" checkIn="Oct 24" checkOut="Oct 27" status="In Progress" guests={2} revenue={950} />
            <BookingCard guest="David Park" property="Mountain Cabin" checkIn="Oct 22" checkOut="Oct 25" status="Confirmed" guests={5} revenue={720} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;

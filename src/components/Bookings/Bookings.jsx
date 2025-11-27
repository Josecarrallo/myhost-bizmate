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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h2 className="text-3xl font-black text-gray-900">Bookings</h2>
          <button className="px-6 py-3 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 transition-colors">
            <Plus className="w-5 h-5 inline mr-2" /> New Booking
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard icon={Calendar} label="Active Bookings" value="28" trend="+8%" gradient="from-blue-500 to-cyan-600" />
          <StatCard icon={Users} label="Total Guests" value="156" trend="+15%" gradient="from-purple-500 to-pink-600" />
          <StatCard icon={TrendingUp} label="Check-ins Today" value="5" gradient="from-orange-500 to-red-600" />
        </div>

        <div className="flex items-center gap-4 mb-6">
          <button className="px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Filter className="w-5 h-5" /> Filter
          </button>
          <button className="px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Calendar View
          </button>
        </div>

        <div className="space-y-4">
          <BookingCard guest="Sarah Johnson" property="Villa Sunset" checkIn="Oct 25" checkOut="Oct 30" status="Confirmed" guests={4} revenue={1250} />
          <BookingCard guest="Michael Chen" property="Beach House" checkIn="Oct 28" checkOut="Nov 2" status="Pending" guests={6} revenue={1800} />
          <BookingCard guest="Emma Wilson" property="City Loft" checkIn="Oct 24" checkOut="Oct 27" status="In Progress" guests={2} revenue={950} />
          <BookingCard guest="David Park" property="Mountain Cabin" checkIn="Oct 22" checkOut="Oct 25" status="Confirmed" guests={5} revenue={720} />
        </div>
      </div>
    </div>
  );
};

export default Bookings;

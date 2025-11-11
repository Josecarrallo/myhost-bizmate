import React from 'react';
import { ChevronLeft, Bell, Settings, DollarSign, Calendar, Home, TrendingUp } from 'lucide-react';
import { StatCard, BookingCard, MessageCard } from '../components/common/Cards';

const Dashboard = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h2 className="text-3xl font-black text-gray-900">Dashboard</h2>
          <div className="flex gap-2">
            <button className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200 relative">
              <Bell className="w-6 h-6 text-gray-900" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">3</div>
            </button>
            <button className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200">
              <Settings className="w-6 h-6 text-gray-900" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={DollarSign} label="Monthly Revenue" value="$45.2K" trend="+12%" gradient="from-green-500 to-emerald-600" />
          <StatCard icon={Calendar} label="Active Bookings" value="28" trend="+8%" gradient="from-blue-500 to-cyan-600" />
          <StatCard icon={Home} label="Properties" value="12" gradient="from-purple-500 to-pink-600" />
          <StatCard icon={TrendingUp} label="Occupancy Rate" value="87%" trend="+5%" gradient="from-orange-500 to-red-600" />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-black text-gray-900">Recent Bookings</h3>
              <button className="text-purple-500 font-bold text-sm hover:text-purple-600 transition-colors">View All →</button>
            </div>
            <div className="space-y-4">
              <BookingCard guest="Sarah Johnson" property="Villa Sunset" checkIn="Oct 25" checkOut="Oct 30" status="Confirmed" guests={4} revenue={1250} />
              <BookingCard guest="Michael Chen" property="Beach House" checkIn="Oct 28" checkOut="Nov 2" status="Pending" guests={6} revenue={1800} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-black text-gray-900">Recent Messages</h3>
              <button className="text-orange-500 font-bold text-sm hover:text-orange-600 transition-colors">View All →</button>
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

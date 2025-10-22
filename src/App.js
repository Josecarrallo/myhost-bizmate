import React, { useState } from 'react';
import { Building2, LayoutDashboard, CreditCard, Calendar, MessageSquare, Sparkles, Home, DollarSign, TrendingUp, Users, MapPin, Star, Send, Bot, ChevronLeft, Settings, Bell, Search, Plus, Filter, Download, Edit, Eye, ArrowRight, Megaphone, ThumbsUp, Share2, BarChart3, Instagram, Facebook, Twitter, Linkedin, X, Check, Workflow, Play, Pause, FileText, AlertCircle, CheckCircle, Clock, Zap, CalendarCheck, BellRing, Percent, BarChart, Map, Compass, Utensils, Car, Camera, Waves, Mountain, Leaf, Sun, Moon, Coffee, ChevronDown, ChevronUp, Award, Crown, ArrowUpRight, ArrowDownRight, PieChart, Activity } from 'lucide-react';
import { LineChart, Line, BarChart as ReBarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart as RePieChart, Pie, Cell } from 'recharts';

const ModuleCard = ({ icon: Icon, title, description, gradient, onClick }) => (
  <button onClick={onClick} className={`w-full p-6 rounded-3xl bg-gradient-to-br ${gradient} text-white text-left transform transition-all hover:scale-105 hover:shadow-2xl active:scale-95`}>
    <div className="flex items-start gap-4">
      <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
        <Icon className="w-8 h-8" strokeWidth={2.5} />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-white/90 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  </button>
);

const StatCard = ({ icon: Icon, label, value, trend, gradient }) => (
  <div className={`p-6 rounded-3xl bg-gradient-to-br ${gradient} text-white`}>
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
        <Icon className="w-6 h-6" strokeWidth={2.5} />
      </div>
      {trend && <span className="text-sm font-bold bg-white/20 px-3 py-1 rounded-full">{trend}</span>}
    </div>
    <p className="text-white/80 text-sm mb-1">{label}</p>
    <p className="text-3xl font-black">{value}</p>
  </div>
);

const PaymentCard = ({ guest, property, amount, status, date, method }) => (
  <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 hover:border-orange-200 transition-all hover:shadow-lg">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h4 className="font-bold text-gray-900 text-lg mb-1">{guest}</h4>
        <p className="text-gray-500 text-sm flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> {property}
        </p>
      </div>
      <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${status === 'Paid' ? 'bg-green-100 text-green-700' : status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
        {status}
      </span>
    </div>
    <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
      <div>
        <p className="text-2xl font-black text-orange-500">${amount}</p>
        <p className="text-xs text-gray-500 mt-1">{method} • {date}</p>
      </div>
      <button className="p-2.5 bg-orange-50 text-orange-500 rounded-xl hover:bg-orange-100 transition-colors">
        <Eye className="w-5 h-5" />
      </button>
    </div>
  </div>
);

const BookingCard = ({ guest, property, checkIn, checkOut, status, guests: guestCount, revenue }) => (
  <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 hover:border-purple-200 transition-all hover:shadow-lg">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h4 className="font-bold text-gray-900 text-lg mb-1">{guest}</h4>
        <p className="text-gray-500 text-sm flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> {property}
        </p>
      </div>
      <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${status === 'Confirmed' ? 'bg-green-100 text-green-700' : status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
        {status}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="bg-gray-50 rounded-xl p-3">
        <p className="text-xs text-gray-500 mb-1">Check-in</p>
        <p className="font-bold text-gray-900">{checkIn}</p>
      </div>
      <div className="bg-gray-50 rounded-xl p-3">
        <p className="text-xs text-gray-500 mb-1">Check-out</p>
        <p className="font-bold text-gray-900">{checkOut}</p>
      </div>
    </div>
    <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-gray-600">
          <Users className="w-4 h-4" />
          <span className="text-sm font-bold">{guestCount}</span>
        </div>
        <div className="text-xl font-black text-purple-500">${revenue}</div>
      </div>
      <button className="p-2.5 bg-purple-50 text-purple-500 rounded-xl hover:bg-purple-100 transition-colors">
        <Edit className="w-5 h-5" />
      </button>
    </div>
  </div>
);

const MessageCard = ({ name, property, message, time, unread, avatar }) => (
  <div className={`bg-white rounded-2xl p-5 border-2 ${unread ? 'border-orange-200 bg-orange-50/30' : 'border-gray-100'} hover:shadow-lg transition-all cursor-pointer`}>
    <div className="flex items-start gap-4">
      <div className="relative flex-shrink-0">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl">
          {avatar}
        </div>
        {unread && <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">3</div>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-lg mb-0.5">{name}</h4>
            <p className="text-gray-500 text-xs flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {property}
            </p>
          </div>
          <span className="text-xs text-gray-400 font-medium whitespace-nowrap ml-2">{time}</span>
        </div>
        <p className={`text-sm ${unread ? 'text-gray-900 font-semibold' : 'text-gray-600'} line-clamp-2`}>{message}</p>
      </div>
    </div>
  </div>
);

const PropertyCard = ({ name, location, type, beds, baths, occupancy, revenue, rating, image }) => (
  <div className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-orange-200 transition-all hover:shadow-xl">
    <div className="h-48 bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white text-6xl font-black">
      {image}
    </div>
    <div className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 text-lg mb-1">{name}</h4>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {location}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-bold text-gray-900">{rating}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b-2 border-gray-100">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Beds</p>
          <p className="font-bold text-gray-900">{beds}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Baths</p>
          <p className="font-bold text-gray-900">{baths}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Guests</p>
          <p className="font-bold text-gray-900">{occupancy}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1">Monthly Revenue</p>
          <p className="text-2xl font-black text-orange-500">${revenue}</p>
        </div>
        <button className="p-2.5 bg-orange-50 text-orange-500 rounded-xl hover:bg-orange-100 transition-colors">
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
);

const PricingCard = ({ property, basePrice, currentPrice, occupancy, trend, nextUpdate }) => {
  const change = ((currentPrice - basePrice) / basePrice * 100).toFixed(1);
  const isIncrease = currentPrice > basePrice;
  
  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-blue-200 transition-all hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 text-xl mb-2">{property}</h4>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Base Price</p>
              <p className="text-lg font-bold text-gray-400">${basePrice}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Current Price</p>
              <p className="text-2xl font-black text-blue-500">${currentPrice}</p>
            </div>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-bold ${isIncrease ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isIncrease ? '↑' : '↓'} {Math.abs(change)}%
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Occupancy</span>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${occupancy}%` }}></div>
            </div>
            <span className="text-sm font-bold text-gray-900">{occupancy}%</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t-2 border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Next update in {nextUpdate}</span>
          </div>
          <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors">
            Adjust
          </button>
        </div>
      </div>
    </div>
  );
};

const CampaignCard = ({ name, platform, status, reach, engagement, clicks, budget, startDate, endDate }) => (
  <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-purple-200 transition-all hover:shadow-lg">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h4 className="font-bold text-gray-900 text-xl mb-2">{name}</h4>
        <div className="flex items-center gap-2">
          {platform === 'Instagram' && <Instagram className="w-5 h-5 text-pink-500" />}
          {platform === 'Facebook' && <Facebook className="w-5 h-5 text-blue-600" />}
          {platform === 'Twitter' && <Twitter className="w-5 h-5 text-blue-400" />}
          {platform === 'LinkedIn' && <Linkedin className="w-5 h-5 text-blue-700" />}
          <span className="text-sm text-gray-600">{platform}</span>
        </div>
      </div>
      <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${status === 'Active' ? 'bg-green-100 text-green-700' : status === 'Scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    </div>
    
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="bg-purple-50 rounded-xl p-3">
        <p className="text-xs text-gray-600 mb-1">Reach</p>
        <p className="text-lg font-black text-purple-600">{reach}</p>
      </div>
      <div className="bg-pink-50 rounded-xl p-3">
        <p className="text-xs text-gray-600 mb-1">Engagement</p>
        <p className="text-lg font-black text-pink-600">{engagement}</p>
      </div>
      <div className="bg-blue-50 rounded-xl p-3">
        <p className="text-xs text-gray-600 mb-1">Clicks</p>
        <p className="text-lg font-black text-blue-600">{clicks}</p>
      </div>
    </div>
    
    <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
      <div>
        <p className="text-xs text-gray-500 mb-1">Budget</p>
        <p className="text-xl font-black text-gray-900">${budget}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-500 mb-1">Period</p>
        <p className="text-sm font-bold text-gray-700">{startDate} - {endDate}</p>
      </div>
    </div>
  </div>
);

const WorkflowCard = ({ name, trigger, actions, status, lastRun, runsToday, icon: Icon }) => (
  <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-indigo-200 transition-all hover:shadow-lg">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
          <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-lg mb-1">{name}</h4>
          <p className="text-sm text-gray-600">{trigger}</p>
        </div>
      </div>
      <button className={`p-3 rounded-xl transition-colors ${status === 'active' ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
        {status === 'active' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>
    </div>
    
    <div className="space-y-2 mb-4">
      {actions.map((action, idx) => (
        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
            {idx + 1}
          </div>
          <span className="text-sm text-gray-700">{action}</span>
        </div>
      ))}
    </div>
    
    <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Last Run</p>
          <p className="text-sm font-bold text-gray-900">{lastRun}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Runs Today</p>
          <p className="text-sm font-bold text-indigo-600">{runsToday}</p>
        </div>
      </div>
      <button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors">
        <Settings className="w-5 h-5" />
      </button>
    </div>
  </div>
);

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

const Payments = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h2 className="text-3xl font-black text-gray-900">Payments</h2>
          <button className="px-6 py-3 bg-green-500 text-white rounded-2xl font-bold hover:bg-green-600 transition-colors">
            <Plus className="w-5 h-5 inline mr-2" /> New Payment
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard icon={DollarSign} label="Total Revenue" value="$124.5K" trend="+18%" gradient="from-green-500 to-emerald-600" />
          <StatCard icon={CreditCard} label="Pending Payments" value="$8.2K" gradient="from-yellow-500 to-orange-500" />
          <StatCard icon={TrendingUp} label="This Month" value="$45.2K" trend="+12%" gradient="from-blue-500 to-cyan-600" />
        </div>

        <div className="flex items-center gap-4 mb-6">
          <button className="px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Filter className="w-5 h-5" /> Filter
          </button>
          <button className="px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="w-5 h-5" /> Export
          </button>
        </div>

        <div className="space-y-4">
          <PaymentCard guest="Sarah Johnson" property="Villa Sunset" amount="1,250" status="Paid" date="Oct 20, 2025" method="Credit Card" />
          <PaymentCard guest="Michael Chen" property="Beach House" amount="1,800" status="Pending" date="Oct 22, 2025" method="Bank Transfer" />
          <PaymentCard guest="Emma Wilson" property="City Loft" amount="950" status="Paid" date="Oct 18, 2025" method="Credit Card" />
          <PaymentCard guest="David Park" property="Mountain Cabin" amount="720" status="Paid" date="Oct 15, 2025" method="PayPal" />
        </div>
      </div>
    </div>
  );
};

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

const Messages = ({ onBack }) => {
  const [messageText, setMessageText] = useState('');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h2 className="text-3xl font-black text-gray-900">Messages</h2>
          <button className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200">
            <Search className="w-6 h-6 text-gray-900" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard icon={MessageSquare} label="Unread Messages" value="12" gradient="from-orange-500 to-red-600" />
          <StatCard icon={Bot} label="AI Auto-Replies" value="45" trend="+20%" gradient="from-purple-500 to-pink-600" />
          <StatCard icon={Clock} label="Avg Response Time" value="8m" trend="-15%" gradient="from-green-500 to-emerald-600" />
        </div>

        <div className="space-y-4 mb-6">
          <MessageCard name="Emma Wilson" property="City Loft" message="Hi! I'd like to know if early check-in is possible for my reservation next week?" time="5m ago" unread={true} avatar="EW" />
          <MessageCard name="David Park" property="Mountain Cabin" message="Thank you for the wonderful stay! Everything was perfect." time="2h ago" unread={false} avatar="DP" />
          <MessageCard name="Lisa Anderson" property="Beach House" message="Could you please send me the WiFi password? Thanks!" time="1d ago" unread={false} avatar="LA" />
          <MessageCard name="James Rodriguez" property="Villa Sunset" message="Is parking available at the property? We're arriving with 2 cars." time="2d ago" unread={false} avatar="JR" />
        </div>

        <div className="bg-white rounded-3xl p-6 border-2 border-gray-200">
          <div className="flex items-center gap-4">
            <input 
              type="text" 
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..." 
              className="flex-1 px-6 py-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none text-gray-900 font-medium"
            />
            <button className="p-4 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition-colors">
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AIAssistant = ({ onBack }) => {
  const [messages, setMessages] = useState([
    { type: 'ai', text: "Hello! I'm your AI Assistant. I can help you manage your properties, answer guest questions, optimize pricing, and much more. What would you like help with today?" }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      setMessages([...messages, { type: 'user', text: inputText }]);
      setInputText('');
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'ai', text: "I'm analyzing your request and will provide insights shortly. This is a demo response." }]);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h2 className="text-3xl font-black text-gray-900">AI Assistant</h2>
          <div className="w-14"></div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-orange-500 text-white p-8 rounded-3xl mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Sparkles className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-1">AI-Powered Insights</h3>
              <p className="text-white/90">Your intelligent property management companion</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 mb-6 border-2 border-gray-200 min-h-[400px] max-h-[500px] overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl ${msg.type === 'user' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border-2 border-gray-200">
          <div className="flex items-center gap-4">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about your properties..." 
              className="flex-1 px-6 py-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-gray-900 font-medium"
            />
            <button onClick={handleSend} className="p-4 bg-gradient-to-r from-purple-500 to-orange-500 text-white rounded-2xl hover:from-purple-600 hover:to-orange-600 transition-colors">
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Properties = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 p-4 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h2 className="text-3xl font-black text-gray-900">Properties</h2>
          <button className="px-6 py-3 bg-pink-500 text-white rounded-2xl font-bold hover:bg-pink-600 transition-colors">
            <Plus className="w-5 h-5 inline mr-2" /> Add Property
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard icon={Home} label="Total Properties" value="12" gradient="from-pink-500 to-rose-600" />
          <StatCard icon={Star} label="Avg Rating" value="4.8" gradient="from-yellow-500 to-orange-500" />
          <StatCard icon={DollarSign} label="Total Revenue" value="$124.5K" trend="+18%" gradient="from-green-500 to-emerald-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PropertyCard name="Villa Sunset" location="Bali, Indonesia" type="Villa" beds={4} baths={3} occupancy={8} revenue="12.5K" rating={4.9} image="🏖️" />
          <PropertyCard name="Beach House" location="Phuket, Thailand" type="House" beds={5} baths={4} occupancy={10} revenue="15.8K" rating={4.8} image="🏠" />
          <PropertyCard name="Mountain Cabin" location="Chiang Mai, Thailand" type="Cabin" beds={3} baths={2} occupancy={6} revenue="8.2K" rating={4.7} image="⛰️" />
          <PropertyCard name="City Loft" location="Jakarta, Indonesia" type="Apartment" beds={2} baths={2} occupancy={4} revenue="9.5K" rating={4.6} image="🏢" />
        </div>
      </div>
    </div>
  );
};

const MarketingSuite = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h2 className="text-3xl font-black text-gray-900">Marketing Suite</h2>
          <button className="px-6 py-3 bg-purple-500 text-white rounded-2xl font-bold hover:bg-purple-600 transition-colors">
            <Plus className="w-5 h-5 inline mr-2" /> New Campaign
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Megaphone} label="Active Campaigns" value="8" gradient="from-purple-500 to-pink-600" />
          <StatCard icon={Users} label="Total Reach" value="145K" trend="+24%" gradient="from-blue-500 to-cyan-600" />
          <StatCard icon={ThumbsUp} label="Engagement Rate" value="8.5%" trend="+12%" gradient="from-green-500 to-emerald-600" />
          <StatCard icon={DollarSign} label="Ad Spend" value="$5.2K" gradient="from-orange-500 to-red-600" />
        </div>

        <div className="space-y-4">
          <CampaignCard 
            name="Summer Villa Special" 
            platform="Instagram" 
            status="Active" 
            reach="45.2K" 
            engagement="3.8K" 
            clicks="892" 
            budget="1,500" 
            startDate="Oct 1" 
            endDate="Oct 31" 
          />
          <CampaignCard 
            name="Beach House Getaway" 
            platform="Facebook" 
            status="Active" 
            reach="38.5K" 
            engagement="2.9K" 
            clicks="756" 
            budget="1,200" 
            startDate="Oct 15" 
            endDate="Nov 15" 
          />
          <CampaignCard 
            name="Mountain Escape" 
            platform="LinkedIn" 
            status="Scheduled" 
            reach="0" 
            engagement="0" 
            clicks="0" 
            budget="800" 
            startDate="Nov 1" 
            endDate="Nov 30" 
          />
        </div>
      </div>
    </div>
  );
};

const SocialPublisher = ({ onBack }) => {
  const [posts] = useState([
    {
      id: 1,
      content: "✨ Discover paradise at Villa Sunset! Book now for an unforgettable Bali experience. #BaliVilla #LuxuryTravel",
      platforms: ['Instagram', 'Facebook', 'Twitter'],
      scheduled: "Oct 25, 10:00 AM",
      status: "Scheduled",
      image: "🏖️",
      metrics: { likes: 0, comments: 0, shares: 0 }
    },
    {
      id: 2,
      content: "🏠 Wake up to ocean views at our Beach House. Limited availability for November! #BeachLife #VacationRental",
      platforms: ['Instagram', 'Facebook'],
      scheduled: "Published",
      status: "Published",
      image: "🌊",
      metrics: { likes: 342, comments: 28, shares: 56 }
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h2 className="text-3xl font-black text-gray-900">Social Publisher</h2>
          <button className="px-6 py-3 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 transition-colors">
            <Plus className="w-5 h-5 inline mr-2" /> New Post
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Share2} label="Scheduled Posts" value="12" gradient="from-blue-500 to-cyan-600" />
          <StatCard icon={CheckCircle} label="Published Today" value="5" gradient="from-green-500 to-emerald-600" />
          <StatCard icon={BarChart3} label="Total Engagement" value="8.9K" trend="+18%" gradient="from-purple-500 to-pink-600" />
          <StatCard icon={Users} label="Total Followers" value="24.5K" trend="+12%" gradient="from-orange-500 to-red-600" />
        </div>

        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-blue-200 transition-all hover:shadow-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-4xl">
                  {post.image}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {post.platforms.map((platform, idx) => (
                        <div key={idx} className="p-2 bg-gray-100 rounded-lg">
                          {platform === 'Instagram' && <Instagram className="w-4 h-4 text-pink-500" />}
                          {platform === 'Facebook' && <Facebook className="w-4 h-4 text-blue-600" />}
                          {platform === 'Twitter' && <Twitter className="w-4 h-4 text-blue-400" />}
                        </div>
                      ))}
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${post.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {post.status}
                    </span>
                  </div>
                  <p className="text-gray-900 mb-3 leading-relaxed">{post.content}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 font-medium">
                      {post.status === 'Published' ? 'Published' : `Scheduled for ${post.scheduled}`}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm font-bold">{post.metrics.likes}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm font-bold">{post.metrics.comments}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm font-bold">{post.metrics.shares}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Pricing = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h2 className="text-3xl font-black text-gray-900">Smart Pricing</h2>
          <button className="p-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors">
            <Sparkles className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8 rounded-3xl mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <TrendingUp className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-white/80 text-sm mb-1">AI-Optimized Revenue</p>
              <p className="text-5xl font-black">+32%</p>
            </div>
          </div>
          <p className="text-white/90 leading-relaxed">Your properties are earning an average of 32% more compared to static pricing. Our AI analyzes 50+ factors in real-time to optimize your rates.</p>
        </div>

        <div className="space-y-4">
          <PricingCard property="Villa Sunset" basePrice="350" currentPrice="425" occupancy={92} trend="up" nextUpdate="2 hours" />
          <PricingCard property="Beach House" basePrice="450" currentPrice="520" occupancy={88} trend="up" nextUpdate="4 hours" />
          <PricingCard property="Mountain Cabin" basePrice="280" currentPrice="245" occupancy={65} trend="down" nextUpdate="1 hour" />
          <PricingCard property="City Loft" basePrice="320" currentPrice="380" occupancy={95} trend="up" nextUpdate="3 hours" />
        </div>
      </div>
    </div>
  );
};

const WorkflowsAutomations = ({ onBack, onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h2 className="text-3xl font-black text-gray-900">Workflows & Automations</h2>
          <button className="px-6 py-3 bg-indigo-500 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-colors">
            <Plus className="w-5 h-5 inline mr-2" /> New Workflow
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Workflow} label="Active Workflows" value="12" gradient="from-indigo-500 to-purple-600" />
          <StatCard icon={Zap} label="Tasks Automated" value="348" trend="+45%" gradient="from-green-500 to-emerald-600" />
          <StatCard icon={Clock} label="Time Saved" value="24h" trend="+18%" gradient="from-blue-500 to-cyan-600" />
          <StatCard icon={CheckCircle} label="Success Rate" value="98%" gradient="from-purple-500 to-pink-600" />
        </div>

        <div className="space-y-4">
          <WorkflowCard 
            name="New Booking Welcome"
            trigger="When new booking is confirmed"
            actions={[
              "Send welcome email with property details",
              "Share check-in instructions and house rules",
              "Add guest to property calendar"
            ]}
            status="active"
            lastRun="15 min ago"
            runsToday={8}
            icon={CalendarCheck}
          />
          
          <WorkflowCard 
            name="Guest Communication"
            trigger="24 hours before check-in"
            actions={[
              "Send reminder message to guest",
              "Verify arrival time",
              "Notify property manager"
            ]}
            status="active"
            lastRun="2 hours ago"
            runsToday={5}
            icon={BellRing}
          />
          
          <div 
            onClick={() => onNavigate('trip-planner')}
            className="cursor-pointer"
          >
            <WorkflowCard 
              name="AI Trip Planner"
              trigger="When guest requests local recommendations"
              actions={[
                "Analyze guest preferences and interests",
                "Generate personalized itinerary",
                "Share curated recommendations"
              ]}
              status="active"
              lastRun="45 min ago"
              runsToday={12}
              icon={Compass}
            />
          </div>
          
          <div 
            onClick={() => onNavigate('bookings-workflow')}
            className="cursor-pointer"
          >
            <WorkflowCard 
              name="Smart Booking Management"
              trigger="Continuous monitoring"
              actions={[
                "Track booking status changes",
                "Automate payment processing",
                "Sync calendar across platforms"
              ]}
              status="active"
              lastRun="5 min ago"
              runsToday={24}
              icon={Calendar}
            />
          </div>
          
          <WorkflowCard 
            name="Dynamic Pricing Updates"
            trigger="Every 4 hours"
            actions={[
              "Analyze market demand",
              "Adjust property rates",
              "Update listings on all platforms"
            ]}
            status="active"
            lastRun="3 hours ago"
            runsToday={6}
            icon={Percent}
          />
        </div>
      </div>
    </div>
  );
};

const AITripPlanner = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedDay, setExpandedDay] = useState(null);

  const categories = [
    { id: 'all', name: 'All', icon: Compass },
    { id: 'food', name: 'Food', icon: Utensils },
    { id: 'nature', name: 'Nature', icon: Leaf },
    { id: 'culture', name: 'Culture', icon: Camera },
    { id: 'adventure', name: 'Adventure', icon: Mountain },
    { id: 'beach', name: 'Beach', icon: Waves }
  ];

  const itinerary = [
    {
      day: 1,
      title: "Arrival & Beach Sunset",
      activities: [
        { time: "14:00", name: "Check-in at Villa Sunset", category: "lodging", icon: Home },
        { time: "16:00", name: "Seminyak Beach Walk", category: "beach", icon: Waves },
        { time: "18:00", name: "Sunset at La Plancha", category: "food", icon: Sun },
        { time: "20:00", name: "Dinner at Motel Mexicola", category: "food", icon: Utensils }
      ]
    },
    {
      day: 2,
      title: "Ubud Cultural Experience",
      activities: [
        { time: "08:00", name: "Breakfast at villa", category: "food", icon: Coffee },
        { time: "09:30", name: "Tegalalang Rice Terraces", category: "nature", icon: Leaf },
        { time: "12:00", name: "Lunch at Sari Organik", category: "food", icon: Utensils },
        { time: "14:00", name: "Sacred Monkey Forest", category: "nature", icon: Leaf },
        { time: "16:00", name: "Ubud Traditional Market", category: "culture", icon: Camera },
        { time: "19:00", name: "Dinner at Locavore", category: "food", icon: Utensils }
      ]
    },
    {
      day: 3,
      title: "Adventure Day",
      activities: [
        { time: "06:00", name: "Mount Batur Sunrise Trek", category: "adventure", icon: Mountain },
        { time: "12:00", name: "Coffee Plantation Tour", category: "culture", icon: Coffee },
        { time: "15:00", name: "Tirta Empul Holy Spring", category: "culture", icon: Waves },
        { time: "18:00", name: "Return to villa", category: "lodging", icon: Home },
        { time: "20:00", name: "Private villa dinner", category: "food", icon: Utensils }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h2 className="text-3xl font-black text-gray-900">AI Trip Planner</h2>
          <button className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-colors">
            <Sparkles className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-8 rounded-3xl mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Compass className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black mb-2">Your Personalized Bali Adventure</h3>
              <p className="text-white/90 mb-4">3-day curated itinerary based on your preferences</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-bold backdrop-blur-sm">🏖️ Beach Lover</span>
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-bold backdrop-blur-sm">🍜 Foodie</span>
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-bold backdrop-blur-sm">🏔️ Adventure Seeker</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <cat.icon className="w-5 h-5" />
              {cat.name}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {itinerary.map((day) => (
            <div key={day.day} className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-purple-200 transition-all">
              <button
                onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                    <span className="text-2xl font-black">D{day.day}</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-black text-gray-900 mb-1">{day.title}</h3>
                    <p className="text-sm text-gray-600">{day.activities.length} activities planned</p>
                  </div>
                </div>
                {expandedDay === day.day ? <ChevronUp className="w-6 h-6 text-gray-600" /> : <ChevronDown className="w-6 h-6 text-gray-600" />}
              </button>
              
              {expandedDay === day.day && (
                <div className="px-6 pb-6 space-y-3">
                  {day.activities.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex-shrink-0 w-20 text-center">
                        <div className="text-sm font-bold text-gray-900">{activity.time}</div>
                      </div>
                      <div className="flex-shrink-0 p-3 bg-white rounded-xl">
                        <activity.icon className="w-5 h-5 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1">{activity.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-bold">{activity.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6" />
            <h4 className="text-lg font-black">AI Recommendations</h4>
          </div>
          <ul className="space-y-2 text-sm text-white/90">
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>Book Mount Batur trek in advance - limited spots available</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>Bring reef-safe sunscreen for beach activities</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>Reserve dinner at Locavore at least 2 weeks ahead</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const BookingsReservationsWorkflow = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const bookingStages = [
    { stage: 'Inquiry', count: 15, color: 'from-blue-400 to-blue-600' },
    { stage: 'Confirmed', count: 28, color: 'from-green-400 to-green-600' },
    { stage: 'Check-in', count: 8, color: 'from-purple-400 to-purple-600' },
    { stage: 'Active', count: 12, color: 'from-orange-400 to-orange-600' },
    { stage: 'Check-out', count: 5, color: 'from-pink-400 to-pink-600' }
  ];

  const automations = [
    {
      trigger: 'New Inquiry Received',
      actions: ['Send instant response', 'Check availability', 'Provide quote'],
      status: 'active',
      icon: MessageSquare
    },
    {
      trigger: 'Booking Confirmed',
      actions: ['Send confirmation email', 'Create calendar event', 'Process payment'],
      status: 'active',
      icon: CheckCircle
    },
    {
      trigger: '48h Before Check-in',
      actions: ['Send reminder', 'Share access codes', 'Verify arrival time'],
      status: 'active',
      icon: Clock
    },
    {
      trigger: 'Check-in Day',
      actions: ['Welcome message', 'Activate smart home', 'Share WiFi details'],
      status: 'active',
      icon: Home
    },
    {
      trigger: 'During Stay',
      actions: ['Daily check-in message', 'Handle requests', 'Monitor feedback'],
      status: 'active',
      icon: MessageSquare
    },
    {
      trigger: 'Check-out Day',
      actions: ['Checkout reminder', 'Request review', 'Schedule cleaning'],
      status: 'active',
      icon: CalendarCheck
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h2 className="text-3xl font-black text-gray-900">Booking Workflow</h2>
          <button className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-600 transition-colors">
            <Settings className="w-6 h-6" />
          </button>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('automations')}
            className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'automations'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            Automations
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            Analytics
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 rounded-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Workflow className="w-8 h-8" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-1">Automated Booking Pipeline</h3>
                  <p className="text-white/90">68 active bookings across all stages</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {bookingStages.map((stage, idx) => (
                <div key={idx} className={`bg-gradient-to-br ${stage.color} text-white p-6 rounded-2xl`}>
                  <div className="text-center">
                    <p className="text-5xl font-black mb-2">{stage.count}</p>
                    <p className="text-white/90 font-bold">{stage.stage}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                Real-time Updates
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">New booking confirmed</p>
                    <p className="text-sm text-gray-600">Sarah Johnson - Villa Sunset - $1,250</p>
                  </div>
                  <span className="text-xs text-gray-500">2 min ago</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">Check-in reminder sent</p>
                    <p className="text-sm text-gray-600">Michael Chen - Beach House</p>
                  </div>
                  <span className="text-xs text-gray-500">15 min ago</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">Guest inquiry received</p>
                    <p className="text-sm text-gray-600">Emma Wilson - City Loft</p>
                  </div>
                  <span className="text-xs text-gray-500">28 min ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'automations' && (
          <div className="space-y-4">
            {automations.map((auto, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-indigo-200 transition-all hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
                    <auto.icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-1">{auto.trigger}</h4>
                        <p className="text-sm text-gray-600">{auto.actions.length} automated actions</p>
                      </div>
                      <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-green-100 text-green-700">
                        {auto.status === 'active' ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {auto.actions.map((action, actionIdx) => (
                        <div key={actionIdx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                            {actionIdx + 1}
                          </div>
                          <span className="text-sm text-gray-700">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard icon={Zap} label="Automations Run" value="1,248" trend="+32%" gradient="from-yellow-500 to-orange-500" />
              <StatCard icon={Clock} label="Time Saved" value="156h" trend="+28%" gradient="from-green-500 to-emerald-600" />
              <StatCard icon={CheckCircle} label="Success Rate" value="99.2%" gradient="from-blue-500 to-cyan-600" />
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-6">Automation Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">Inquiry Response</span>
                    <span className="text-sm font-bold text-indigo-600">98% success</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">Booking Confirmation</span>
                    <span className="text-sm font-bold text-green-600">100% success</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">Check-in Reminders</span>
                    <span className="text-sm font-bold text-blue-600">99% success</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: '99%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">Review Requests</span>
                    <span className="text-sm font-bold text-purple-600">95% success</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8" />
                <div>
                  <h4 className="text-xl font-black">Efficiency Gains</h4>
                  <p className="text-white/90 text-sm">Compared to manual processing</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-4xl font-black mb-1">73%</p>
                  <p className="text-white/90 text-sm">Faster Response</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black mb-1">156h</p>
                  <p className="text-white/90 text-sm">Time Saved</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black mb-1">$8.5K</p>
                  <p className="text-white/90 text-sm">Cost Savings</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Reports & Insights Module
const ReportsInsights = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data - Últimos 12 meses
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

  // Calcular totales y promedios
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

  // Mock data - Clientes recientes y top guests
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

  // Mock data - Contenido más visto
  const topContent = [
    { id: 1, type: 'video', title: 'Villa Sunset Tour - Luxury Bali Experience', views: 45200, likes: 3840, comments: 286, shares: 892, platform: 'Instagram', thumbnail: '🏖️', engagement: 11.2 },
    { id: 2, type: 'post', title: 'Top 10 Activities Near Our Beach House', views: 38500, likes: 2950, comments: 184, shares: 645, platform: 'Facebook', thumbnail: '🌊', engagement: 9.8 },
    { id: 3, type: 'video', title: 'Mountain Cabin Sunrise Yoga Session', views: 32800, likes: 2680, comments: 156, shares: 478, platform: 'Instagram', thumbnail: '⛰️', engagement: 10.1 },
    { id: 4, type: 'post', title: 'City Loft: Perfect for Digital Nomads', views: 28900, likes: 2240, comments: 132, shares: 356, platform: 'LinkedIn', thumbnail: '🏢', engagement: 9.4 },
    { id: 5, type: 'video', title: 'Behind the Scenes: Villa Preparation', views: 24500, likes: 1920, comments: 98, shares: 287, platform: 'Instagram', thumbnail: '✨', engagement: 9.4 }
  ];

  // Distribución de reservas por propiedad
  const propertyDistribution = [
    { name: 'Villa Sunset', value: 142, color: '#F97316' },
    { name: 'Beach House', value: 128, color: '#EC4899' },
    { name: 'Mountain Cabin', value: 95, color: '#8B5CF6' },
    { name: 'City Loft', value: 89, color: '#3B82F6' }
  ];

  const COLORS = ['#F97316', '#EC4899', '#8B5CF6', '#3B82F6'];

  // Componente KPI Card
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

  // Componente Client Card
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
                <h4 className="font-bold text-gray-900 text-lg mb-1">{client.name}</h4>
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

  // Componente Top Guest Card
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

  // Componente Content Card
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

  // Tooltip personalizado
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-4 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h2 className="text-3xl font-black text-gray-900">Reports & Insights</h2>
          <div className="flex gap-2">
            <button className="px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-colors">
              Last 12 Months
            </button>
          </div>
        </div>

        {/* KPIs principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard icon={DollarSign} label="Total Revenue (12M)" value={(totalRevenue / 1000).toFixed(1)} suffix="K" prefix="$" change={revenueChange} gradient="from-green-500 to-emerald-600" />
          <KPICard icon={Calendar} label="Total Bookings (12M)" value={totalBookings} change={bookingsChange} gradient="from-blue-500 to-cyan-600" />
          <KPICard icon={Percent} label="Avg Occupancy Rate" value={avgOccupancy} suffix="%" change={occupancyChange} gradient="from-purple-500 to-pink-600" />
          <KPICard icon={TrendingUp} label="Average Daily Rate" value={avgADR} prefix="$" change={adrChange} gradient="from-orange-500 to-red-600" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button onClick={() => setActiveTab('overview')} className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${activeTab === 'overview' ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'}`}>
            <BarChart3 className="w-5 h-5 inline mr-2" />Overview
          </button>
          <button onClick={() => setActiveTab('clients')} className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${activeTab === 'clients' ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'}`}>
            <Users className="w-5 h-5 inline mr-2" />Clients & Top Guests
          </button>
          <button onClick={() => setActiveTab('content')} className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${activeTab === 'content' ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'}`}>
            <Eye className="w-5 h-5 inline mr-2" />Top Content
          </button>
        </div>

        {/* Tab Content - Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Revenue Chart */}
            <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-lg">
              <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
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

            {/* Dual Chart - Bookings & Occupancy */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-lg">
                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
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
                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
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

            {/* Property Distribution Pie Chart */}
            <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-lg">
              <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <PieChart className="w-6 h-6 text-pink-500" />
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

        {/* Tab Content - Clients */}
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

        {/* Tab Content - Top Content */}
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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [currentModule, setCurrentModule] = useState(null);

  if (currentScreen === 'home') {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <div className="w-32 h-32 rounded-full mx-auto flex items-center justify-center mb-8 bg-orange-500 shadow-2xl">
            <Building2 className="w-16 h-16 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-7xl font-black mb-4 text-orange-500">MY HOST</h1>
          <p className="text-5xl font-bold mb-4 text-orange-500">BizMate</p>
          <p className="text-2xl text-black font-semibold mb-12">Effortlessly Manage Your Villas</p>
          <button onClick={() => setCurrentScreen('modules')} className="px-16 py-6 bg-orange-500 text-white rounded-3xl text-2xl font-bold hover:bg-orange-600 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95">
            Enter Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (currentModule === 'dashboard') {
    return <Dashboard onBack={() => setCurrentModule(null)} />;
  }
  
  if (currentModule === 'payments') {
    return <Payments onBack={() => setCurrentModule(null)} />;
  }
  
  if (currentModule === 'bookings') {
    return <Bookings onBack={() => setCurrentModule(null)} />;
  }
  
  if (currentModule === 'messages') {
    return <Messages onBack={() => setCurrentModule(null)} />;
  }
  
  if (currentModule === 'ai') {
    return <AIAssistant onBack={() => setCurrentModule(null)} />;
  }
  
  if (currentModule === 'properties') {
    return <Properties onBack={() => setCurrentModule(null)} />;
  }
  
  if (currentModule === 'pricing') {
    return <Pricing onBack={() => setCurrentModule(null)} />;
  }
  
  if (currentModule === 'marketing') {
    return <MarketingSuite onBack={() => setCurrentModule(null)} />;
  }
  
  if (currentModule === 'social') {
    return <SocialPublisher onBack={() => setCurrentModule(null)} />;
  }
  
  if (currentModule === 'trip-planner') {
    return <AITripPlanner onBack={() => setCurrentModule('workflows')} />;
  }
  
  if (currentModule === 'bookings-workflow') {
    return <BookingsReservationsWorkflow onBack={() => setCurrentModule('workflows')} />;
  }

  if (currentModule === 'workflows') {
    return <WorkflowsAutomations onBack={() => setCurrentModule(null)} onNavigate={setCurrentModule} />;
  }

  if (currentModule === 'reports') {
    return <ReportsInsights onBack={() => setCurrentModule(null)} />;
  }

  if (currentScreen === 'modules') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <button onClick={() => setCurrentScreen('home')} className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200">
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h2 className="text-4xl font-black text-gray-900">MY HOST BizMate</h2>
            <div className="w-14"></div>
          </div>

          <div className="space-y-4">
            <ModuleCard icon={LayoutDashboard} title="Dashboard" description="Overview of your properties, bookings, and revenue at a glance" gradient="from-purple-500 to-pink-600" onClick={() => setCurrentModule('dashboard')} />
            <ModuleCard icon={CreditCard} title="Payments" description="Track transactions, payouts, and financial reports" gradient="from-green-500 to-emerald-600" onClick={() => setCurrentModule('payments')} />
            <ModuleCard icon={Calendar} title="Bookings" description="Manage reservations, check-ins, and guest schedules" gradient="from-blue-500 to-cyan-600" onClick={() => setCurrentModule('bookings')} />
            <ModuleCard icon={MessageSquare} title="Messages" description="Communicate with guests and automate responses" gradient="from-orange-500 to-red-600" onClick={() => setCurrentModule('messages')} />
            <ModuleCard icon={Sparkles} title="AI Assistant" description="Get intelligent insights and automated management help" gradient="from-purple-500 to-orange-500" onClick={() => setCurrentModule('ai')} />
            <ModuleCard icon={Home} title="Properties" description="Manage your villa portfolio and property details" gradient="from-pink-500 to-rose-600" onClick={() => setCurrentModule('properties')} />
            <ModuleCard icon={DollarSign} title="Smart Pricing" description="AI-powered dynamic pricing to maximize revenue" gradient="from-blue-600 to-indigo-600" onClick={() => setCurrentModule('pricing')} />
            <ModuleCard icon={Megaphone} title="Marketing Suite" description="Track campaigns, engagement and social media performance" gradient="from-purple-600 to-pink-600" onClick={() => setCurrentModule('marketing')} />
            <ModuleCard icon={Share2} title="Social Publisher" description="Create, schedule and publish content across all platforms" gradient="from-blue-600 to-cyan-600" onClick={() => setCurrentModule('social')} />
            <ModuleCard icon={Workflow} title="Workflows & Automations" description="Monitor and manage automated business processes" gradient="from-indigo-600 to-purple-600" onClick={() => setCurrentModule('workflows')} />
            <ModuleCard icon={BarChart3} title="Reports & Insights" description="Analytics and reports with 12-month trends and top performers" gradient="from-orange-600 to-pink-600" onClick={() => setCurrentModule('reports')} />
          </div>
        </div>
      </div>
    );
  }
}
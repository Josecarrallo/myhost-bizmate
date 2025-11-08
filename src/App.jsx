import React, { useState } from 'react';
import { Building2, LayoutDashboard, CreditCard, Calendar, MessageSquare, Sparkles, Home, DollarSign, TrendingUp, Users, MapPin, Star, Send, Bot, ChevronLeft, ChevronRight, Settings, Bell, Search, Plus, Filter, Download, Edit, Eye, ArrowRight, Megaphone, ThumbsUp, Share2, BarChart3, Instagram, Facebook, Twitter, Linkedin, X, Check, Workflow, Play, Pause, FileText, AlertCircle, CheckCircle, Clock, Zap, CalendarCheck, BellRing, Percent, BarChart, Map, Compass, Utensils, Car, Camera, Waves, Mountain, Leaf, Sun, Moon, Coffee, ChevronDown, ChevronUp, Award, Crown, ArrowUpRight, ArrowDownRight, PieChart, Activity, Repeat, RefreshCw, XCircle, TrendingDown, Smartphone, Globe, Phone, ClipboardList, User, ThumbsDown } from 'lucide-react';
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

const ModuleGridCard = ({ icon: Icon, title, gradient, onClick }) => (
  <button 
    onClick={onClick} 
    className="group relative bg-white rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-gray-100 hover:border-transparent overflow-hidden"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
    <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${gradient} transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
      <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
    </div>
    <h3 className="relative text-sm font-bold text-gray-900 text-center leading-tight">{title}</h3>
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

        {/* FASE 3: PAYMENT OPTIONS SECTION */}
        <div className="mb-8">
          <div className="mb-6">
            <h3 className="text-2xl font-black text-gray-900 mb-2">Payment Options</h3>
            <p className="text-gray-600">Available payment methods for your guests</p>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Smartphone className="w-5 h-5 text-blue-500" />Local Payment Methods</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'QRIS', icon: '📱', status: 'Available', color: 'from-blue-500 to-cyan-500' },
                { name: 'GoPay', icon: '💚', status: 'Available', color: 'from-green-500 to-emerald-500' },
                { name: 'OVO', icon: '💜', status: 'Available', color: 'from-purple-500 to-pink-500' }
              ].map((method, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border-2 border-green-200 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-2xl`}>{method.icon}</div>
                      <div><h4 className="font-bold text-gray-900 text-lg">{method.name}</h4><div className="flex items-center gap-2 mt-1"><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-sm font-semibold text-green-600">{method.status}</span></div></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-purple-500" />International Payment Methods</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Credit/Debit Card', icon: '💳', status: 'Available', color: 'from-orange-500 to-red-500' },
                { name: 'Stripe', icon: '🟣', status: 'Available', color: 'from-indigo-500 to-purple-500' },
                { name: 'Wise', icon: '💚', status: 'Coming Soon', color: 'from-teal-500 to-green-500', comingSoon: true },
                { name: 'PayPal', icon: '💙', status: 'Available', color: 'from-blue-600 to-indigo-600' }
              ].map((method, idx) => (
                <div key={idx} className={`bg-white rounded-2xl p-6 border-2 ${method.comingSoon ? 'border-gray-200' : 'border-green-200'} hover:shadow-lg transition-all`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-2xl`}>{method.icon}</div>
                      <div><h4 className="font-bold text-gray-900 text-lg">{method.name}</h4><div className="flex items-center gap-2 mt-1">{method.comingSoon ? <><Clock className="w-4 h-4 text-orange-500" /><span className="text-sm font-semibold text-orange-600">{method.status}</span></> : <><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-sm font-semibold text-green-600">{method.status}</span></>}</div></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border-2 border-gray-200">
            <h4 className="text-xl font-black text-gray-900 mb-6">Payment Summary</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm text-green-700 font-semibold mb-1">Total Paid</p><p className="text-3xl font-black text-green-600">$89.7K</p></div>
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm text-orange-700 font-semibold mb-1">Pending</p><p className="text-3xl font-black text-orange-600">$12.3K</p></div>
                  <Clock className="w-10 h-10 text-orange-500" />
                </div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm text-purple-700 font-semibold mb-1">Top Method</p><p className="text-2xl font-black text-purple-600">Credit Card</p></div>
                  <TrendingUp className="w-10 h-10 text-purple-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-black text-gray-900 mb-6">Recent Payments</h3>
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
  const userQuery = `Hi, I would like to know which villas are available for rent in the area and at what price. Please also check the occupancy level and based on that give me a recommendation/action to rent my vacant villas and earn more money.`;

  const aiResponse = {
    summary: "I have analyzed your 8 active properties in Bali",
    properties: [
      { name: "Villa Sunset", occupancy: 30, status: "low", currentPrice: 150, recommendedPrice: 127, action: "Reduce price 15%", reason: "Low occupancy - competitive market" },
      { name: "Villa Paradise", occupancy: 85, status: "high", currentPrice: 200, recommendedPrice: 220, action: "Increase price 10%", reason: "High demand - optimize revenue" },
      { name: "Villa Ocean View", occupancy: 45, status: "medium", currentPrice: 180, recommendedPrice: 165, action: "Reduce price 8%", reason: "Medium occupancy - competitive adjustment" },
      { name: "Villa Harmony", occupancy: 25, status: "low", currentPrice: 175, recommendedPrice: 149, action: "Reduce price 15%", reason: "Very low occupancy - urgent adjustment" }
    ],
    insights: { lowOccupancy: 3, potentialRevenue: 2450, bestSeason: "November - December", topRecommendation: "Special promotion on villas with <40% occupancy" }
  };

  const getStatusColor = (status) => status === 'low' ? 'bg-red-100 text-red-700' : status === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700';
  const getStatusIcon = (status) => status === 'low' ? '🔴' : status === 'medium' ? '🟡' : '🟢';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200"><ChevronLeft className="w-6 h-6 text-gray-900" /></button>
          <h2 className="text-3xl font-black text-gray-900">AI Assistant</h2>
          <div className="w-14"></div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-orange-500 text-white p-8 rounded-3xl mb-8">
          <div className="flex items-center gap-4"><div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm"><Sparkles className="w-8 h-8" strokeWidth={2.5} /></div><div><h3 className="text-2xl font-black mb-1">AI-Powered Insights</h3><p className="text-white/90">Your intelligent property management companion</p></div></div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-l-4 border-blue-500">
          <div className="flex items-start gap-3"><div className="text-2xl">💬</div><div><p className="text-sm font-semibold text-gray-700 mb-2">Example query:</p><p className="text-gray-600 italic leading-relaxed">{userQuery}</p></div></div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl shadow-lg p-6 border border-orange-100">
          <div className="flex items-start gap-3 mb-6"><div className="text-2xl">🤖</div><div><p className="text-sm font-semibold text-orange-600 mb-1">AI Response:</p><p className="text-gray-800 font-medium">{aiResponse.summary}</p></div></div>
          <div className="mb-6"><h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">📊 OCCUPANCY ANALYSIS</h3><div className="grid gap-4">{aiResponse.properties.map((property, index) => (<div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"><div className="flex items-start justify-between mb-3"><div className="flex items-center gap-3"><span className="text-xl">🏠</span><div><h4 className="font-bold text-gray-800">{property.name}</h4><p className="text-sm text-gray-500">${property.currentPrice}/night</p></div></div><span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(property.status)}`}>{getStatusIcon(property.status)} {property.occupancy}%</span></div><div className="bg-orange-50 rounded-lg p-3 border-l-4 border-orange-500"><div className="flex items-start gap-2">{property.status === 'high' ? <TrendingUp className="text-orange-600 mt-0.5" size={18} /> : <TrendingDown className="text-orange-600 mt-0.5" size={18} />}<div><p className="font-semibold text-orange-800 text-sm">⚡ Action: {property.action}</p><p className="text-orange-700 text-sm">→ New price: ${property.recommendedPrice}/night</p><p className="text-xs text-orange-600 mt-1">{property.reason}</p></div></div></div></div>))}</div></div>
          <div className="bg-white rounded-lg p-5 border-2 border-orange-200"><h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">💡 KEY RECOMMENDATIONS</h3><div className="grid md:grid-cols-2 gap-4"><div className="flex items-start gap-3"><AlertCircle className="text-orange-500 mt-1" size={20} /><div><p className="text-sm font-semibold text-gray-700">Villas with low occupancy</p><p className="text-2xl font-bold text-orange-600">{aiResponse.insights.lowOccupancy}</p></div></div><div className="flex items-start gap-3"><TrendingUp className="text-green-500 mt-1" size={20} /><div><p className="text-sm font-semibold text-gray-700">Potential extra income</p><p className="text-2xl font-bold text-green-600">${aiResponse.insights.potentialRevenue}/month</p></div></div><div className="flex items-start gap-3 md:col-span-2"><Sparkles className="text-orange-500 mt-1" size={20} /><div><p className="text-sm font-semibold text-gray-700">Best season for promotion</p><p className="text-gray-800">{aiResponse.insights.bestSeason}</p></div></div><div className="md:col-span-2 bg-orange-50 rounded-lg p-3 border border-orange-200"><p className="text-sm font-semibold text-orange-800">🎯 {aiResponse.insights.topRecommendation}</p></div></div></div>
        </div>
      </div>
    </div>
  );
};

const MultichannelIntegration = ({ onBack }) => {
  const channels = [
    { name: 'Booking.com', logo: '🔵', gradient: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-700', connected: true, lastSync: '3h ago', stats: { listings: 6, pending: 3, revenue: '24.5K' } },
    { name: 'Airbnb', logo: '🔴', gradient: 'from-red-500 to-pink-600', bgColor: 'bg-red-50', textColor: 'text-red-700', connected: true, lastSync: '1h ago', stats: { listings: 8, pending: 5, revenue: '32.8K' } },
    { name: 'Agoda', logo: '🌈', gradient: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50', textColor: 'text-purple-700', connected: false, lastSync: 'Never', stats: { listings: 0, pending: 0, revenue: '0' } }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200"><ChevronLeft className="w-6 h-6 text-gray-900" /></button>
          <h2 className="text-3xl font-black text-gray-900">Multichannel Integration</h2>
          <div className="w-14"></div>
        </div>
        <div className="space-y-6">
          {channels.map((channel, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${channel.gradient} flex items-center justify-center text-3xl`}>{channel.logo}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-gray-900 mb-1">{channel.name}</h3>
                  <div className="flex items-center gap-2">{channel.connected ? <><CheckCircle className="w-5 h-5 text-green-500" /><span className="text-sm font-bold text-green-600">Connected</span></> : <><XCircle className="w-5 h-5 text-gray-400" /><span className="text-sm font-bold text-gray-500">Not Connected</span></>}</div>
                </div>
              </div>
              {channel.connected ? (
                <><div className={`${channel.bgColor} rounded-2xl p-6 mb-6`}><div className="grid grid-cols-3 gap-6"><div><p className={`text-sm ${channel.textColor} font-semibold mb-2`}>Listings</p><p className="text-4xl font-black text-gray-900">{channel.stats.listings}</p></div><div><p className={`text-sm ${channel.textColor} font-semibold mb-2`}>Pending</p><p className="text-4xl font-black text-gray-900">{channel.stats.pending}</p></div><div><p className={`text-sm ${channel.textColor} font-semibold mb-2`}>Revenue</p><p className="text-4xl font-black text-gray-900">${channel.stats.revenue}</p></div></div></div><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm text-gray-500"><Clock className="w-4 h-4" /><span>Sync: <span className="font-bold">{channel.lastSync}</span></span></div><button className={`px-6 py-3 bg-gradient-to-r ${channel.gradient} text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2`}><RefreshCw className="w-5 h-5" />Sync</button></div></>
              ) : (
                <><div className="bg-gray-50 rounded-2xl p-8 text-center mb-6"><p className="text-gray-600 font-semibold mb-4 text-lg">This platform is not connected yet</p><button className={`px-8 py-4 bg-gradient-to-r ${channel.gradient} text-white rounded-xl font-bold hover:shadow-lg transition-all text-lg`}>Connect {channel.name}</button></div><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm text-gray-400"><Clock className="w-4 h-4" /><span>Sync: <span className="font-bold">{channel.lastSync}</span></span></div><button disabled className="px-6 py-3 bg-gray-200 text-gray-400 rounded-xl font-bold flex items-center gap-2 cursor-not-allowed"><RefreshCw className="w-5 h-5" />Sync</button></div></>
              )}
            </div>
          ))}
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

// ==================== DIGITAL CHECK-IN MODULE ====================
const DigitalCheckIn = ({ onBack }) => {
  const [selectedGuest, setSelectedGuest] = useState(null);

  const upcomingArrivals = [
    { id: 1, name: "Sarah Johnson", property: "Villa Sunset", checkIn: "2025-11-08 14:00", status: "pending", phone: "+1-555-0101", email: "sarah@email.com" },
    { id: 2, name: "Marco Rossi", property: "Beach House", checkIn: "2025-11-09 15:00", status: "pending", phone: "+39-555-0202", email: "marco@email.com" },
    { id: 3, name: "Ana García", property: "Villa Paradise", checkIn: "2025-11-10 16:00", status: "completed", phone: "+34-555-0303", email: "ana@email.com" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col">
      <div className="bg-white border-b-2 border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-black hover:text-green-500 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
            📱 Digital Check-in
          </h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <div className="grid lg:grid-cols-2 gap-6">
            
            {/* Upcoming Arrivals */}
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-6">📅 Upcoming Arrivals</h2>
              <div className="space-y-4">
                {upcomingArrivals.map((guest) => (
                  <div key={guest.id} className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-black text-gray-900 mb-1">{guest.name}</h3>
                        <p className="text-sm text-gray-600 font-semibold">{guest.property}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-xl font-bold text-sm ${
                        guest.status === 'completed' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                      }`}>
                        {guest.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{guest.checkIn}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{guest.phone}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedGuest(guest)}
                      className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                    >
                      {guest.status === 'completed' ? 'View Details' : 'Send Check-in Link'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* QR Code & Instructions */}
            <div className="space-y-6">
              
              {/* QR Code */}
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 text-center">
                <h3 className="text-2xl font-black text-gray-900 mb-6">📱 QR Check-in Code</h3>
                <div className="w-64 h-64 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-6 border-4 border-green-500">
                  <div className="text-8xl">📲</div>
                </div>
                <p className="text-sm text-gray-600 mb-4">Scan to start digital check-in process</p>
                <button className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all">
                  Download QR Code
                </button>
              </div>

              {/* Access Instructions */}
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
                <h3 className="text-xl font-black text-gray-900 mb-4">🔑 Access Instructions</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">Complete Digital Form</div>
                      <div className="text-sm text-gray-600">Fill personal details and sign</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">Receive Door Code</div>
                      <div className="text-sm text-gray-600">Code sent via SMS/Email</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">Access Property</div>
                      <div className="text-sm text-gray-600">Enter code at smart lock</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Door Code */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white text-center">
                <div className="text-sm font-bold mb-2">🔐 Sample Access Code</div>
                <div className="text-5xl font-black mb-2">5847</div>
                <div className="text-xs opacity-90">Valid: Nov 8, 14:00 - Nov 13, 11:00</div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Guest Detail Modal */}
      {selectedGuest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900">Guest Details</h3>
              <button onClick={() => setSelectedGuest(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm font-bold text-gray-600 mb-1">Name</div>
                <div className="font-black text-lg text-gray-900">{selectedGuest.name}</div>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-600 mb-1">Property</div>
                <div className="font-bold text-gray-900">{selectedGuest.property}</div>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-600 mb-1">Check-in Time</div>
                <div className="font-bold text-gray-900">{selectedGuest.checkIn}</div>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-600 mb-1">Contact</div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-700">{selectedGuest.phone}</div>
                  <div className="text-sm text-gray-700">{selectedGuest.email}</div>
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-600 mb-1">Status</div>
                <span className={`inline-block px-4 py-2 rounded-xl font-bold ${
                  selectedGuest.status === 'completed' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                }`}>
                  {selectedGuest.status}
                </span>
              </div>

              <button className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all mt-6">
                Resend Check-in Link
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// ==================== RMS INTEGRATION MODULE ====================
const RMSIntegration = ({ onBack }) => {
  const [connectedChannels, setConnectedChannels] = useState([
    { id: 1, name: "Airbnb", logo: "🏠", status: "connected", bookings: 45, revenue: 67500, sync: "2 mins ago" },
    { id: 2, name: "Booking.com", logo: "🔵", status: "connected", bookings: 38, revenue: 57000, sync: "5 mins ago" },
    { id: 3, name: "Agoda", logo: "🟣", status: "connected", bookings: 22, revenue: 33000, sync: "1 min ago" }
  ]);

  const availableChannels = [
    { id: 4, name: "Expedia", logo: "✈️", status: "available" },
    { id: 5, name: "VRBO", logo: "🏖️", status: "available" },
    { id: 6, name: "TripAdvisor", logo: "🦉", status: "available" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col">
      <div className="bg-white border-b-2 border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-black hover:text-indigo-500 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
            🔗 RMS Integration
          </h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Connected Channels */}
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-6">✅ Connected Channels</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {connectedChannels.map((channel) => (
                <div key={channel.id} className="bg-white rounded-2xl p-6 border-2 border-green-200 shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{channel.logo}</div>
                      <div>
                        <h3 className="text-xl font-black text-gray-900">{channel.name}</h3>
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                          {channel.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Bookings</span>
                      <span className="text-xl font-black text-gray-900">{channel.bookings}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Revenue</span>
                      <span className="text-xl font-black text-green-600">${channel.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Last Sync</span>
                      <span className="font-bold text-gray-700">{channel.sync}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-600 transition-all text-sm">
                      Sync Now
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Channels */}
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-6">➕ Available Channels</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {availableChannels.map((channel) => (
                <div key={channel.id} className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all">
                  <div className="text-center">
                    <div className="text-5xl mb-4">{channel.logo}</div>
                    <h3 className="text-xl font-black text-gray-900 mb-4">{channel.name}</h3>
                    <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                      + Connect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sync Settings */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <h3 className="text-2xl font-black text-gray-900 mb-6">⚙️ Sync Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-bold text-gray-900">Auto-Sync</div>
                  <div className="text-sm text-gray-600">Automatically sync bookings every 5 minutes</div>
                </div>
                <div className="w-14 h-8 bg-green-500 rounded-full flex items-center px-1">
                  <div className="w-6 h-6 bg-white rounded-full ml-auto"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-bold text-gray-900">Price Sync</div>
                  <div className="text-sm text-gray-600">Sync pricing changes across all channels</div>
                </div>
                <div className="w-14 h-8 bg-green-500 rounded-full flex items-center px-1">
                  <div className="w-6 h-6 bg-white rounded-full ml-auto"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-bold text-gray-900">Availability Sync</div>
                  <div className="text-sm text-gray-600">Update availability in real-time</div>
                </div>
                <div className="w-14 h-8 bg-green-500 rounded-full flex items-center px-1">
                  <div className="w-6 h-6 bg-white rounded-full ml-auto"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// ==================== REVIEWS & REPUTATION MODULE ====================
const ReviewsReputation = ({ onBack }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const mockReviews = [
    { id: 1, guest: "Sarah Johnson", property: "Villa Sunset", platform: "Airbnb", rating: 5, date: "2025-11-05", comment: "Amazing stay! The villa was spotless and the host was incredibly responsive. Highly recommend!", status: "published" },
    { id: 2, guest: "Marco Rossi", property: "Beach House", platform: "Booking.com", rating: 4, date: "2025-11-04", comment: "Great location and amenities. Only minor issue was late check-in.", status: "published" },
    { id: 3, guest: "Ana García", property: "Villa Paradise", platform: "Airbnb", rating: 5, date: "2025-11-03", comment: "Perfect for our family vacation. Pool was amazing and the view was breathtaking!", status: "published" },
    { id: 4, guest: "David Chen", property: "Villa Sunset", platform: "Google", rating: 3, date: "2025-11-02", comment: "Good villa but WiFi was slow and AC in one room didn't work well.", status: "needs-response" }
  ];

  const stats = {
    overallRating: 4.6,
    totalReviews: 156,
    airbnb: 4.8,
    booking: 4.5,
    google: 4.4,
    responseRate: "98%",
    avgResponseTime: "2.5 hrs"
  };

  const platforms = [
    { id: 'all', name: 'All Platforms', icon: '🌐' },
    { id: 'airbnb', name: 'Airbnb', icon: '🏠' },
    { id: 'booking', name: 'Booking.com', icon: '🔵' },
    { id: 'google', name: 'Google', icon: '🔍' }
  ];

  const filteredReviews = selectedPlatform === 'all' 
    ? mockReviews 
    : mockReviews.filter(r => r.platform.toLowerCase() === selectedPlatform);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex flex-col">
      <div className="bg-white border-b-2 border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-black hover:text-orange-500 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
            ⭐ Reviews & Reputation
          </h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white">
              <div className="text-4xl font-black mb-1">{stats.overallRating}</div>
              <div className="text-sm font-semibold opacity-90">Overall Rating</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <div className="text-3xl font-black text-gray-900 mb-1">{stats.totalReviews}</div>
              <div className="text-xs font-semibold text-gray-600">Total Reviews</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border-2 border-pink-200">
              <div className="text-3xl font-black text-pink-600 mb-1">{stats.airbnb}</div>
              <div className="text-xs font-semibold text-gray-600">Airbnb Rating</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border-2 border-blue-200">
              <div className="text-3xl font-black text-blue-600 mb-1">{stats.booking}</div>
              <div className="text-xs font-semibold text-gray-600">Booking.com</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border-2 border-green-200">
              <div className="text-3xl font-black text-green-600 mb-1">{stats.responseRate}</div>
              <div className="text-xs font-semibold text-gray-600">Response Rate</div>
            </div>
          </div>

          {/* Platform Filter */}
          <div className="bg-white rounded-2xl p-4 border-2 border-gray-200">
            <div className="flex gap-2 overflow-x-auto">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                    selectedPlatform === platform.id
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-xl">{platform.icon}</span>
                  {platform.name}
                </button>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900">Recent Reviews</h2>
            
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-black text-gray-900">{review.guest}</h3>
                      <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-700">
                        {review.platform}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-semibold">{review.property}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-1 mb-1">{renderStars(review.rating)}</div>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{review.comment}</p>

                <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                  <span className={`px-4 py-2 rounded-xl font-bold text-sm ${
                    review.status === 'published' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {review.status === 'published' ? '✓ Published' : '⚠ Needs Response'}
                  </span>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all text-sm">
                      Reply
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all text-sm">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Response Templates */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <h3 className="text-xl font-black text-gray-900 mb-4">📝 Quick Response Templates</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <button className="p-4 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 transition-all text-left">
                <div className="flex items-center gap-2 mb-2">
                  <ThumbsUp className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-900">Positive Review</span>
                </div>
                <p className="text-xs text-gray-600">Thank you for your wonderful feedback...</p>
              </button>
              <button className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl hover:bg-yellow-100 transition-all text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <span className="font-bold text-yellow-900">Mixed Review</span>
                </div>
                <p className="text-xs text-gray-600">We appreciate your feedback and...</p>
              </button>
              <button className="p-4 bg-red-50 border-2 border-red-200 rounded-xl hover:bg-red-100 transition-all text-left">
                <div className="flex items-center gap-2 mb-2">
                  <ThumbsDown className="w-5 h-5 text-red-600" />
                  <span className="font-bold text-red-900">Negative Review</span>
                </div>
                <p className="text-xs text-gray-600">We sincerely apologize for your experience...</p>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// ==================== OPERATIONS HUB MODULE ====================
const OperationsHub = ({ onBack }) => {
  const [selectedTab, setSelectedTab] = useState('tasks');

  const mockTasks = [
    { id: 1, title: "Airport pickup for Sarah", property: "Villa Sunset", assignedTo: "Driver Team", priority: "high", status: "pending", dueDate: "2025-11-08 14:00" },
    { id: 2, title: "Pre-arrival grocery shopping", property: "Beach House", assignedTo: "Concierge", priority: "medium", status: "in-progress", dueDate: "2025-11-08 16:00" },
    { id: 3, title: "Pool cleaning", property: "Villa Paradise", assignedTo: "Maintenance", priority: "low", status: "pending", dueDate: "2025-11-09 10:00" }
  ];

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'bg-red-500';
    if (priority === 'medium') return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusColor = (status) => {
    if (status === 'completed') return 'bg-green-500';
    if (status === 'in-progress') return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex flex-col">
      <div className="bg-white border-b-2 border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-black hover:text-blue-500 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
            🏢 Operations Hub
          </h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black text-gray-900">📋 Active Tasks</h2>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:shadow-xl transition-all">
              + New Task
            </button>
          </div>

          <div className="space-y-4">
            {mockTasks.map((task) => (
              <div key={task.id} className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></span>
                      <h3 className="text-xl font-black text-gray-900">{task.title}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Home className="w-4 h-4" />
                        <span className="font-semibold">{task.property}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{task.assignedTo}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-xl text-white font-bold text-sm ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== VOICE AI AGENT MODULE ====================
const VoiceAIAgent = ({ onBack }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [callStatus, setCallStatus] = useState('idle'); // idle, connecting, active, ended
  const [currentCall, setCurrentCall] = useState(null);
  const [callHistory, setCallHistory] = useState([
    {
      id: 1,
      guestName: "Sarah Johnson",
      timestamp: "2025-11-07 14:30",
      duration: "3:45",
      topic: "Booking inquiry",
      status: "completed",
      summary: "Guest inquired about availability for Dec 15-20. AI confirmed availability and sent booking link.",
      actions: ["Sent booking link", "Updated calendar"]
    },
    {
      id: 2,
      guestName: "Marco Rossi",
      timestamp: "2025-11-07 10:15",
      duration: "2:20",
      topic: "Check-in question",
      status: "completed",
      summary: "Guest asked about early check-in. AI confirmed 2pm policy and offered luggage storage.",
      actions: ["Confirmed policy", "Sent directions"]
    },
    {
      id: 3,
      guestName: "Ana García",
      timestamp: "2025-11-06 16:45",
      duration: "5:10",
      topic: "Special requests",
      status: "completed",
      summary: "Anniversary celebration setup requested. AI arranged flowers and champagne.",
      actions: ["Created task", "Notified housekeeping"]
    }
  ]);

  const [voiceSettings, setVoiceSettings] = useState({
    language: 'en',
    voice: 'female',
    speed: 'normal',
    autoAnswer: false
  });

  const mockStats = {
    totalCalls: 156,
    avgDuration: "3:45",
    satisfactionRate: "94%",
    autoResolved: "87%",
    callsToday: 12,
    activeNow: 0
  };

  const startCall = () => {
    setCallStatus('connecting');
    setTimeout(() => {
      setCallStatus('active');
      setCurrentCall({
        guestName: "Demo Guest",
        startTime: new Date(),
        topic: "Live Demo Call"
      });
    }, 2000);
  };

  const endCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      setCallStatus('idle');
      setCurrentCall(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-black hover:text-purple-500 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            🎙️ Voice AI Agent
          </h1>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-2xl p-4 border-2 border-purple-200">
              <div className="text-3xl font-black text-purple-600">{mockStats.totalCalls}</div>
              <div className="text-xs font-semibold text-gray-600 mt-1">Total Calls</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border-2 border-blue-200">
              <div className="text-3xl font-black text-blue-600">{mockStats.avgDuration}</div>
              <div className="text-xs font-semibold text-gray-600 mt-1">Avg Duration</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border-2 border-green-200">
              <div className="text-3xl font-black text-green-600">{mockStats.satisfactionRate}</div>
              <div className="text-xs font-semibold text-gray-600 mt-1">Satisfaction</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border-2 border-orange-200">
              <div className="text-3xl font-black text-orange-600">{mockStats.autoResolved}</div>
              <div className="text-xs font-semibold text-gray-600 mt-1">Auto Resolved</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border-2 border-pink-200">
              <div className="text-3xl font-black text-pink-600">{mockStats.callsToday}</div>
              <div className="text-xs font-semibold text-gray-600 mt-1">Calls Today</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border-2 border-red-200">
              <div className="text-3xl font-black text-red-600">{mockStats.activeNow}</div>
              <div className="text-xs font-semibold text-gray-600 mt-1">Active Now</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            
            {/* Left Column - Voice Agent Control */}
            <div className="space-y-6">
              
              {/* Call Interface */}
              <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-xl">
                <h2 className="text-2xl font-black mb-6 text-gray-900">🎙️ Voice Agent Control</h2>
                
                {/* Call Status */}
                {callStatus === 'idle' && (
                  <div className="text-center py-12">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-2xl">
                      <MessageSquare className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Agent Ready</h3>
                    <p className="text-gray-600 mb-8">Start a demo call to test the AI voice agent</p>
                    <button
                      onClick={startCall}
                      className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-black text-lg hover:shadow-2xl transition-all"
                    >
                      📞 Start Demo Call
                    </button>
                  </div>
                )}

                {callStatus === 'connecting' && (
                  <div className="text-center py-12">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-2xl animate-pulse">
                      <Phone className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Connecting...</h3>
                    <p className="text-gray-600">Establishing connection with AI agent</p>
                  </div>
                )}

                {callStatus === 'active' && (
                  <div className="text-center py-12">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6 shadow-2xl relative">
                      <Phone className="w-16 h-16 text-white" />
                      <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping"></div>
                    </div>
                    <h3 className="text-2xl font-black text-green-600 mb-2">🟢 Call Active</h3>
                    <p className="text-gray-900 font-bold text-lg mb-2">{currentCall?.guestName}</p>
                    <p className="text-gray-600 mb-6">{currentCall?.topic}</p>
                    
                    {/* Waveform Animation */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 bg-green-500 rounded-full animate-pulse"
                          style={{
                            height: `${Math.random() * 40 + 20}px`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        ></div>
                      ))}
                    </div>

                    <button
                      onClick={endCall}
                      className="px-8 py-4 bg-red-500 text-white rounded-2xl font-black text-lg hover:bg-red-600 transition-all"
                    >
                      ⏹️ End Call
                    </button>
                  </div>
                )}

                {callStatus === 'ended' && (
                  <div className="text-center py-12">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center mb-6 shadow-2xl">
                      <CheckCircle className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Call Ended</h3>
                    <p className="text-gray-600">Saving call summary...</p>
                  </div>
                )}
              </div>

              {/* Voice Settings */}
              <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-xl">
                <h3 className="text-xl font-black mb-4 text-gray-900">⚙️ Voice Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Language</label>
                    <select
                      value={voiceSettings.language}
                      onChange={(e) => setVoiceSettings({...voiceSettings, language: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-semibold"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="it">Italiano</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Voice Type</label>
                    <select
                      value={voiceSettings.voice}
                      onChange={(e) => setVoiceSettings({...voiceSettings, voice: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-semibold"
                    >
                      <option value="female">Female - Professional</option>
                      <option value="male">Male - Professional</option>
                      <option value="neutral">Neutral - Friendly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Speaking Speed</label>
                    <select
                      value={voiceSettings.speed}
                      onChange={(e) => setVoiceSettings({...voiceSettings, speed: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-semibold"
                    >
                      <option value="slow">Slow</option>
                      <option value="normal">Normal</option>
                      <option value="fast">Fast</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-bold text-gray-900">Auto-answer Calls</div>
                      <div className="text-xs text-gray-600">Agent answers automatically</div>
                    </div>
                    <button
                      onClick={() => setVoiceSettings({...voiceSettings, autoAnswer: !voiceSettings.autoAnswer})}
                      className={`w-14 h-8 rounded-full transition-all ${
                        voiceSettings.autoAnswer ? 'bg-purple-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-6 h-6 bg-white rounded-full transition-all ${
                        voiceSettings.autoAnswer ? 'ml-7' : 'ml-1'
                      }`}></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Call History */}
            <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900">📞 Call History</h2>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm">
                  Export
                </button>
              </div>

              <div className="space-y-4 max-h-[800px] overflow-y-auto">
                {callHistory.map((call) => (
                  <div key={call.id} className="border-2 border-gray-200 rounded-2xl p-4 hover:border-purple-300 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-black text-lg text-gray-900">{call.guestName}</h4>
                        <p className="text-sm text-gray-600">{call.timestamp}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-bold text-sm text-gray-700">{call.duration}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold">
                        {call.topic}
                      </span>
                      <span className="inline-block ml-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                        {call.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{call.summary}</p>

                    <div className="border-t-2 border-gray-100 pt-3">
                      <p className="text-xs font-bold text-gray-600 mb-2">Actions Taken:</p>
                      <div className="flex flex-wrap gap-2">
                        {call.actions.map((action, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-semibold text-gray-700">
                            ✓ {action}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Info */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-200">
              <div className="text-4xl mb-3">🌍</div>
              <h3 className="font-black text-lg text-gray-900 mb-2">Multi-language</h3>
              <p className="text-sm text-gray-700">Supports 50+ languages with natural accent</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 border-2 border-pink-200">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="font-black text-lg text-gray-900 mb-2">24/7 Availability</h3>
              <p className="text-sm text-gray-700">Never miss a call, always available for guests</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-black text-lg text-gray-900 mb-2">Instant Actions</h3>
              <p className="text-sm text-gray-700">Creates bookings, sends info, updates calendar</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// ==================== BOOKING ENGINE WIDGET MODULE ====================
const BookingEngineWidget = ({ onBack }) => {
  const [step, setStep] = useState(1); // 1: dates, 2: property, 3: guests, 4: payment, 5: preview
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    property: '',
    guests: 2,
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    specialRequests: ''
  });

  const mockProperties = [
    { 
      id: 1, 
      name: "Villa Sunset", 
      price: 150, 
      image: "🏖️",
      description: "Beachfront villa with ocean views",
      amenities: ["Pool", "WiFi", "Kitchen", "AC"]
    },
    { 
      id: 2, 
      name: "Beach House", 
      price: 200, 
      image: "🏡",
      description: "Spacious house near the beach",
      amenities: ["Pool", "WiFi", "Kitchen", "AC", "BBQ"]
    },
    { 
      id: 3, 
      name: "Villa Paradise", 
      price: 250, 
      image: "🌴",
      description: "Luxury villa with private pool",
      amenities: ["Private Pool", "WiFi", "Kitchen", "AC", "Garden"]
    }
  ];

  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const start = new Date(bookingData.checkIn);
    const end = new Date(bookingData.checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const calculateTotal = () => {
    const selectedProperty = mockProperties.find(p => p.id === parseInt(bookingData.property));
    if (!selectedProperty) return 0;
    return selectedProperty.price * calculateNights();
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMinCheckoutDate = () => {
    if (!bookingData.checkIn) return getTodayDate();
    const checkIn = new Date(bookingData.checkIn);
    checkIn.setDate(checkIn.getDate() + 1);
    return checkIn.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-black hover:text-orange-500 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
            🎟️ Booking Engine
          </h1>
          <div className="w-20"></div>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mt-6">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Dates' },
              { num: 2, label: 'Property' },
              { num: 3, label: 'Details' },
              { num: 4, label: 'Payment' },
              { num: 5, label: 'Widget' }
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= s.num 
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {s.num}
                  </div>
                  <span className={`text-xs mt-2 font-semibold ${step >= s.num ? 'text-orange-500' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < 4 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${step > s.num ? 'bg-gradient-to-r from-orange-500 to-pink-500' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          
          {/* STEP 1: Dates */}
          {step === 1 && (
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-xl">
              <h2 className="text-3xl font-black mb-2 text-gray-900">📅 Select Your Dates</h2>
              <p className="text-gray-600 mb-8">Choose your check-in and check-out dates</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Check-in Date</label>
                  <input
                    type="date"
                    min={getTodayDate()}
                    value={bookingData.checkIn}
                    onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Check-out Date</label>
                  <input
                    type="date"
                    min={getMinCheckoutDate()}
                    value={bookingData.checkOut}
                    onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                    disabled={!bookingData.checkIn}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg font-semibold disabled:bg-gray-100"
                  />
                </div>

                {calculateNights() > 0 && (
                  <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-6">
                    <p className="text-center">
                      <span className="text-5xl font-black text-orange-500">{calculateNights()}</span>
                      <span className="text-xl font-bold text-gray-700 ml-3">
                        {calculateNights() === 1 ? 'Night' : 'Nights'}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!bookingData.checkIn || !bookingData.checkOut || calculateNights() === 0}
                className="w-full mt-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-black text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Properties →
              </button>
            </div>
          )}

          {/* STEP 2: Property Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-xl mb-6">
                <h2 className="text-3xl font-black mb-2 text-gray-900">🏠 Choose Your Property</h2>
                <p className="text-gray-600 mb-6">Select from our available properties</p>
              </div>

              <div className="grid gap-4">
                {mockProperties.map((property) => (
                  <button
                    key={property.id}
                    onClick={() => setBookingData({...bookingData, property: property.id.toString()})}
                    className={`bg-white rounded-2xl p-6 border-2 transition-all text-left ${
                      bookingData.property === property.id.toString()
                        ? 'border-orange-500 shadow-xl bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-6xl">{property.image}</div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-gray-900 mb-2">{property.name}</h3>
                        <p className="text-gray-600 mb-3">{property.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {property.amenities.map((amenity, idx) => (
                            <span key={idx} className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-semibold text-gray-700">
                              {amenity}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-3xl font-black text-orange-500">${property.price}</span>
                            <span className="text-gray-600 ml-2">/ night</span>
                          </div>
                          {bookingData.property === property.id.toString() && (
                            <div className="px-4 py-2 bg-orange-500 text-white rounded-xl font-bold">
                              Selected ✓
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 bg-gray-200 text-gray-800 rounded-2xl font-bold hover:bg-gray-300 transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!bookingData.property}
                  className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-black hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Details →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Guest Details */}
          {step === 3 && (
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-xl">
              <h2 className="text-3xl font-black mb-2 text-gray-900">👤 Guest Information</h2>
              <p className="text-gray-600 mb-8">Tell us about yourself</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Number of Guests</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={bookingData.guests}
                    onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={bookingData.guestName}
                    onChange={(e) => setBookingData({...bookingData, guestName: e.target.value})}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={bookingData.guestEmail}
                    onChange={(e) => setBookingData({...bookingData, guestEmail: e.target.value})}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    placeholder="+1 555-0000"
                    value={bookingData.guestPhone}
                    onChange={(e) => setBookingData({...bookingData, guestPhone: e.target.value})}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Special Requests</label>
                  <textarea
                    placeholder="Any special requirements..."
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                    rows="4"
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-4 bg-gray-200 text-gray-800 rounded-2xl font-bold hover:bg-gray-300 transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!bookingData.guestName || !bookingData.guestEmail || !bookingData.guestPhone}
                  className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-black hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Payment Summary */}
          {step === 4 && (
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-xl">
              <h2 className="text-3xl font-black mb-2 text-gray-900">💳 Booking Summary</h2>
              <p className="text-gray-600 mb-8">Review your booking details</p>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-gray-700">Property</span>
                    <span className="font-black text-lg text-gray-900">
                      {mockProperties.find(p => p.id === parseInt(bookingData.property))?.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-gray-700">Check-in</span>
                    <span className="font-black text-gray-900">{bookingData.checkIn}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-gray-700">Check-out</span>
                    <span className="font-black text-gray-900">{bookingData.checkOut}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-gray-700">Nights</span>
                    <span className="font-black text-gray-900">{calculateNights()}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-gray-700">Guests</span>
                    <span className="font-black text-gray-900">{bookingData.guests}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t-2 border-orange-200">
                    <span className="font-bold text-gray-700">Guest Name</span>
                    <span className="font-black text-gray-900">{bookingData.guestName}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-700">Total Amount</span>
                    <span className="text-5xl font-black text-green-600">${calculateTotal()}</span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
                  <p className="text-sm text-blue-900 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>In production, this would process payment via Stripe</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-4 bg-gray-200 text-gray-800 rounded-2xl font-bold hover:bg-gray-300 transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-black hover:shadow-2xl transition-all"
                >
                  View Widget Code →
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Widget Preview */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-xl">
                <h2 className="text-3xl font-black mb-2 text-gray-900">🎨 Embeddable Widget</h2>
                <p className="text-gray-600 mb-8">Copy this code to embed the booking widget on your website</p>
                
                <div className="bg-gray-900 rounded-2xl p-6 overflow-x-auto">
                  <code className="text-green-400 font-mono text-sm">
                    {`<iframe 
  src="https://yourdomain.com/booking-widget"
  width="100%"
  height="600"
  frameborder="0"
  style="border-radius: 16px;"
></iframe>`}
                  </code>
                </div>

                <button className="w-full mt-4 py-3 bg-gray-200 text-gray-800 rounded-xl font-bold hover:bg-gray-300 transition-all">
                  📋 Copy Code
                </button>
              </div>

              <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-xl">
                <h3 className="text-2xl font-black mb-6 text-gray-900">Widget Preview</h3>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-gray-300">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎟️</div>
                    <h4 className="text-2xl font-black text-gray-900 mb-2">Book Your Stay</h4>
                    <p className="text-gray-600 mb-6">Widget would appear here on your website</p>
                    <div className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-bold">
                      Start Booking
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setStep(1);
                  setBookingData({
                    checkIn: '',
                    checkOut: '',
                    property: '',
                    guests: 2,
                    guestName: '',
                    guestEmail: '',
                    guestPhone: '',
                    specialRequests: ''
                  });
                }}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-black hover:shadow-2xl transition-all"
              >
                🔄 Start New Booking
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// ==================== PMS CALENDAR MODULE ====================
const PMSCalendar = ({ onBack }) => {
  const [view, setView] = useState('week'); // day, week, month
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const mockCalendarBookings = [
    {
      id: 1,
      guestName: "Sarah Johnson",
      propertyName: "Villa Sunset",
      checkIn: "2025-11-08",
      checkOut: "2025-11-13",
      guests: 4,
      revenue: 750,
      status: "confirmed",
      phone: "+1-555-0101",
      email: "sarah.j@email.com"
    },
    {
      id: 2,
      guestName: "Michael Chen",
      propertyName: "Beach House",
      checkIn: "2025-11-07",
      checkOut: "2025-11-12",
      guests: 2,
      revenue: 1000,
      status: "checked-in",
      phone: "+1-555-0102",
      email: "mchen@email.com"
    },
    {
      id: 3,
      guestName: "Emma Williams",
      propertyName: "Villa Paradise",
      checkIn: "2025-11-10",
      checkOut: "2025-11-15",
      guests: 6,
      revenue: 1200,
      status: "confirmed",
      phone: "+1-555-0103",
      email: "emma.w@email.com"
    },
    {
      id: 4,
      guestName: "David Park",
      propertyName: "Villa Sunset",
      checkIn: "2025-11-14",
      checkOut: "2025-11-18",
      guests: 3,
      revenue: 800,
      status: "pending",
      phone: "+1-555-0104",
      email: "david.p@email.com"
    }
  ];

  const mockProperties = [
    { id: 1, name: "Villa Sunset", rooms: 3 },
    { id: 2, name: "Beach House", rooms: 4 },
    { id: 3, name: "Villa Paradise", rooms: 5 }
  ];

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  // Get bookings for date
  const getBookingsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockCalendarBookings.filter(booking => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      const current = new Date(dateStr);
      return current >= checkIn && current <= checkOut;
    });
  };

  // Status colors
  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-blue-500';
      case 'checked-in': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-black hover:text-orange-500 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            📅 PMS Calendar
          </h1>
          <div className="w-20"></div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* View Toggle */}
          <div className="flex gap-2">
            {['day', 'week', 'month'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  view === v
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>

          {/* Property Filter */}
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none font-semibold"
          >
            <option value="all">All Properties</option>
            {mockProperties.map(prop => (
              <option key={prop.id} value={prop.id}>{prop.name}</option>
            ))}
          </select>

          {/* Month Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setMonth(newDate.getMonth() - 1);
                setSelectedDate(newDate);
              }}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-bold min-w-[150px] text-center">
              {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </span>
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setMonth(newDate.getMonth() + 1);
                setSelectedDate(newDate);
              }}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-7xl mx-auto">
          {/* Month View */}
          {view === 'month' && (
            <div className="grid grid-cols-7 gap-2">
              {/* Day Headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-bold text-gray-600 p-2">
                  {day}
                </div>
              ))}
              
              {/* Calendar Days */}
              {generateCalendarDays().map((day, idx) => {
                const bookings = getBookingsForDate(day);
                const isToday = day.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={idx}
                    className={`min-h-[100px] border-2 rounded-xl p-2 transition-all ${
                      isToday ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className={`text-sm font-bold mb-1 ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>
                      {day.getDate()}
                    </div>
                    
                    {bookings.map((booking, bidx) => (
                      <button
                        key={bidx}
                        onClick={() => setSelectedBooking(booking)}
                        className={`w-full text-left text-xs p-1 rounded-lg mb-1 ${getStatusColor(booking.status)} text-white hover:opacity-80 transition-opacity`}
                      >
                        <div className="font-semibold truncate">{booking.guestName}</div>
                        <div className="truncate opacity-90">{booking.propertyName}</div>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* Week View */}
          {view === 'week' && (
            <div className="space-y-3">
              <h3 className="text-2xl font-black mb-6 text-gray-900">📆 This Week's Bookings</h3>
              {mockCalendarBookings.map((booking) => (
                <button
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  className="w-full p-5 bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-xl transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`w-3 h-3 rounded-full ${getStatusColor(booking.status)}`}></span>
                        <h4 className="font-black text-xl text-gray-900">{booking.guestName}</h4>
                        <span className={`px-3 py-1 rounded-xl text-xs font-bold ${getStatusColor(booking.status)} text-white`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4" />
                          <span className="font-semibold">{booking.propertyName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{booking.checkIn} → {booking.checkOut}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{booking.guests} guests</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-3xl font-black text-green-600">
                        ${booking.revenue}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Revenue</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Day View */}
          {view === 'day' && (
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
              <h3 className="text-2xl font-black mb-6 text-gray-900">
                📅 {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h3>
              <div className="space-y-3">
                {getBookingsForDate(selectedDate).length > 0 ? (
                  getBookingsForDate(selectedDate).map((booking) => (
                    <button
                      key={booking.id}
                      onClick={() => setSelectedBooking(booking)}
                      className="w-full p-5 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-black text-lg text-gray-900 mb-2">{booking.guestName}</h4>
                          <p className="text-sm text-gray-600">{booking.propertyName} • {booking.guests} guests</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-green-600">${booking.revenue}</div>
                          <span className={`inline-block mt-2 px-3 py-1 rounded-xl text-xs font-bold ${getStatusColor(booking.status)} text-white`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-semibold">No bookings for this day</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900">{selectedBooking.guestName}</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4">
                <div className="text-sm text-gray-600 mb-1">Property</div>
                <div className="font-black text-lg text-gray-900">{selectedBooking.propertyName}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="text-xs text-gray-500 mb-1">Check-in</div>
                  <div className="font-bold text-gray-900">{selectedBooking.checkIn}</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="text-xs text-gray-500 mb-1">Check-out</div>
                  <div className="font-bold text-gray-900">{selectedBooking.checkOut}</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="text-xs text-gray-500 mb-1">Guests</div>
                <div className="font-bold text-gray-900">{selectedBooking.guests} guests</div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="text-xs text-gray-500 mb-2">Contact</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="p-1.5 bg-white rounded-lg">
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="font-semibold">{selectedBooking.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="p-1.5 bg-white rounded-lg">
                      <Send className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="font-semibold">{selectedBooking.email}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4">
                <div className="text-xs text-gray-500 mb-1">Total Revenue</div>
                <div className="text-4xl font-black text-green-600">
                  ${selectedBooking.revenue}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-2">Status</div>
                <span className={`inline-block px-6 py-3 rounded-xl font-bold text-sm ${getStatusColor(selectedBooking.status)} text-white`}>
                  {selectedBooking.status.toUpperCase()}
                </span>
              </div>

              <div className="flex gap-3 pt-4">
                <button className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                  Check-in
                </button>
                <button className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-xl font-bold hover:bg-gray-200 transition-all">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats Bar */}
      <div className="bg-white border-t-2 border-gray-200 p-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <div className="text-3xl font-black text-blue-600">{mockCalendarBookings.length}</div>
            <div className="text-xs font-semibold text-blue-900 mt-1">Total Bookings</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <div className="text-3xl font-black text-green-600">
              {mockCalendarBookings.filter(b => b.status === 'checked-in').length}
            </div>
            <div className="text-xs font-semibold text-green-900 mt-1">Checked-in</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
            <div className="text-3xl font-black text-yellow-600">
              {mockCalendarBookings.filter(b => b.status === 'confirmed').length}
            </div>
            <div className="text-xs font-semibold text-yellow-900 mt-1">Upcoming</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <div className="text-3xl font-black text-purple-600">
              ${mockCalendarBookings.reduce((sum, b) => sum + b.revenue, 0)}
            </div>
            <div className="text-xs font-semibold text-purple-900 mt-1">Total Revenue</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN APP ====================
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
          <h1 className="text-9xl font-black mb-4 text-orange-500">MY HOST</h1>
          <p className="text-6xl font-bold mb-4 text-orange-500">BizMate</p>
          <p className="text-2xl text-black font-semibold mb-12">Perfect for Villas, Boutique Hotels & Guest Houses</p>
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
  
  if (currentModule === 'multichannel') {
    return <MultichannelIntegration onBack={() => setCurrentModule(null)} />;
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

  if (currentModule === 'pms-calendar') {
    return <PMSCalendar onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'booking-engine') {
    return <BookingEngineWidget onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'voice-ai') {
    return <VoiceAIAgent onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'operations') {
    return <OperationsHub onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'reviews') {
    return <ReviewsReputation onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'rms') {
    return <RMSIntegration onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'digital-checkin') {
    return <DigitalCheckIn onBack={() => setCurrentModule(null)} />;
  }

  if (currentScreen === 'modules') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setCurrentScreen('home')} className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors shadow-lg border-2 border-gray-100">
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h2 className="text-3xl font-black text-gray-900">MY HOST BizMate</h2>
            <div className="w-14"></div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {/* Row 1 */}
            <ModuleGridCard icon={LayoutDashboard} title="Dashboard" gradient="from-purple-500 to-pink-600" onClick={() => setCurrentModule('dashboard')} />
            <ModuleGridCard icon={Calendar} title="PMS Calendar" gradient="from-blue-500 to-purple-600" onClick={() => setCurrentModule('pms-calendar')} />
            <ModuleGridCard icon={Sparkles} title="Booking Engine" gradient="from-orange-500 to-pink-600" onClick={() => setCurrentModule('booking-engine')} />
            <ModuleGridCard icon={Phone} title="Voice AI Agent" gradient="from-purple-600 to-pink-600" onClick={() => setCurrentModule('voice-ai')} />
            
            {/* Row 2 */}
            <ModuleGridCard icon={ClipboardList} title="Operations Hub" gradient="from-blue-600 to-cyan-600" onClick={() => setCurrentModule('operations')} />
            <ModuleGridCard icon={Star} title="Reviews" gradient="from-yellow-500 to-orange-600" onClick={() => setCurrentModule('reviews')} />
            <ModuleGridCard icon={Repeat} title="RMS Integration" gradient="from-indigo-500 to-blue-600" onClick={() => setCurrentModule('rms')} />
            <ModuleGridCard icon={Smartphone} title="Digital Check-in" gradient="from-green-500 to-emerald-600" onClick={() => setCurrentModule('digital-checkin')} />
            
            {/* Row 3 */}
            <ModuleGridCard icon={CreditCard} title="Payments" gradient="from-green-500 to-emerald-600" onClick={() => setCurrentModule('payments')} />
            <ModuleGridCard icon={Calendar} title="Bookings" gradient="from-blue-500 to-cyan-600" onClick={() => setCurrentModule('bookings')} />
            <ModuleGridCard icon={MessageSquare} title="Messages" gradient="from-orange-500 to-red-600" onClick={() => setCurrentModule('messages')} />
            <ModuleGridCard icon={Sparkles} title="AI Assistant" gradient="from-purple-500 to-orange-500" onClick={() => setCurrentModule('ai')} />
            
            {/* Row 4 */}
            <ModuleGridCard icon={Repeat} title="Multichannel" gradient="from-indigo-500 to-blue-600" onClick={() => setCurrentModule('multichannel')} />
            <ModuleGridCard icon={Home} title="Properties" gradient="from-pink-500 to-rose-600" onClick={() => setCurrentModule('properties')} />
            <ModuleGridCard icon={DollarSign} title="Smart Pricing" gradient="from-blue-600 to-indigo-600" onClick={() => setCurrentModule('pricing')} />
            <ModuleGridCard icon={Megaphone} title="Marketing" gradient="from-purple-600 to-pink-600" onClick={() => setCurrentModule('marketing')} />
            
            {/* Row 5 */}
            <ModuleGridCard icon={Share2} title="Social Publisher" gradient="from-blue-600 to-cyan-600" onClick={() => setCurrentModule('social')} />
            <ModuleGridCard icon={Workflow} title="Workflows" gradient="from-indigo-600 to-purple-600" onClick={() => setCurrentModule('workflows')} />
            <ModuleGridCard icon={BarChart3} title="Reports" gradient="from-orange-600 to-pink-600" onClick={() => setCurrentModule('reports')} />
          </div>
        </div>
      </div>
    );
  }
}
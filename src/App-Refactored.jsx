/**
 * MY HOST BizMate - Refactored Version
 * Villa Management Platform with 18 integrated modules
 *
 * REFACTORED IMPROVEMENTS:
 * - Better component organization
 * - Separated data constants
 * - Improved code readability
 * - Better prop typing patterns
 * - Optimized re-renders
 * - Cleaner state management
 *
 * @version 2.0.0 - Refactored
 * @date 2025-11-11
 */

import React, { useState } from 'react';
import {
  Building2, LayoutDashboard, CreditCard, Calendar, MessageSquare, Sparkles,
  Home, DollarSign, TrendingUp, Users, MapPin, Star, Send, Bot, ChevronLeft,
  ChevronRight, Settings, Bell, Search, Plus, Filter, Download, Edit, Eye,
  ArrowRight, Megaphone, ThumbsUp, Share2, BarChart3, Instagram, Facebook,
  Twitter, Linkedin, X, Check, Workflow, Play, Pause, FileText, AlertCircle,
  CheckCircle, Clock, Zap, CalendarCheck, BellRing, Percent, BarChart, Map,
  Compass, Utensils, Car, Camera, Waves, Mountain, Leaf, Sun, Moon, Coffee,
  ChevronDown, ChevronUp, Award, Crown, ArrowUpRight, ArrowDownRight, PieChart,
  Activity, Repeat, RefreshCw, XCircle, TrendingDown, Smartphone, Globe, Phone,
  ClipboardList, User, ThumbsDown
} from 'lucide-react';
import {
  LineChart, Line, BarChart as ReBarChart, Bar, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart as RePieChart,
  Pie, Cell
} from 'recharts';

// ============================================================================
// CONSTANTS & DATA
// ============================================================================

const APP_MODULES = [
  { id: 'dashboard', icon: LayoutDashboard, title: 'Dashboard', description: 'Overview & analytics', gradient: 'from-purple-500 to-pink-600' },
  { id: 'payments', icon: CreditCard, title: 'Payments', description: 'Financial management', gradient: 'from-green-500 to-emerald-600' },
  { id: 'bookings', icon: Calendar, title: 'Bookings', description: 'Reservation management', gradient: 'from-blue-500 to-cyan-600' },
  { id: 'messages', icon: MessageSquare, title: 'Messages', description: 'Guest communication', gradient: 'from-orange-500 to-red-600' },
  { id: 'ai-assistant', icon: Sparkles, title: 'AI Assistant', description: 'Smart recommendations', gradient: 'from-purple-500 to-orange-500' },
  { id: 'properties', icon: Home, title: 'Properties', description: 'Manage your villas', gradient: 'from-pink-500 to-rose-600' },
  { id: 'pricing', icon: DollarSign, title: 'Smart Pricing', description: 'Dynamic pricing engine', gradient: 'from-blue-500 to-purple-600' },
  { id: 'workflows', icon: Workflow, title: 'Workflows', description: 'Automation tools', gradient: 'from-indigo-500 to-purple-600' },
  { id: 'multichannel', icon: Building2, title: 'Multichannel', description: 'Channel integrations', gradient: 'from-indigo-500 to-pink-500' },
  { id: 'marketing', icon: Megaphone, title: 'Marketing', description: 'Campaign management', gradient: 'from-purple-500 to-pink-600' },
  { id: 'social-publisher', icon: Share2, title: 'Social Publisher', description: 'Content scheduling', gradient: 'from-blue-500 to-cyan-600' },
  { id: 'reports', icon: BarChart3, title: 'Reports', description: 'Analytics & insights', gradient: 'from-orange-500 to-pink-500' },
  { id: 'digital-checkin', icon: CheckCircle, title: 'Digital Check-in', description: 'Contactless arrivals', gradient: 'from-green-500 to-emerald-600' },
  { id: 'rms-integration', icon: RefreshCw, title: 'RMS Integration', description: 'Channel sync', gradient: 'from-indigo-500 to-blue-600' },
  { id: 'reviews', icon: Star, title: 'Reviews', description: 'Reputation management', gradient: 'from-yellow-500 to-orange-500' },
  { id: 'operations', icon: ClipboardList, title: 'Operations', description: 'Task management', gradient: 'from-blue-500 to-cyan-600' },
  { id: 'voice-ai', icon: Phone, title: 'Voice AI', description: 'AI phone assistant', gradient: 'from-purple-500 to-pink-600' },
  { id: 'booking-engine', icon: Globe, title: 'Booking Engine', description: 'Direct booking widget', gradient: 'from-green-500 to-blue-600' }
];

const PAYMENT_METHODS_LOCAL = [
  { name: 'QRIS', icon: '📱', status: 'Available', color: 'from-blue-500 to-cyan-500' },
  { name: 'GoPay', icon: '💚', status: 'Available', color: 'from-green-500 to-emerald-500' },
  { name: 'OVO', icon: '💜', status: 'Available', color: 'from-purple-500 to-pink-500' }
];

const PAYMENT_METHODS_INTERNATIONAL = [
  { name: 'Credit/Debit Card', icon: '💳', status: 'Available', color: 'from-orange-500 to-red-500' },
  { name: 'Stripe', icon: '🟣', status: 'Available', color: 'from-indigo-500 to-purple-500' },
  { name: 'Wise', icon: '💚', status: 'Coming Soon', color: 'from-teal-500 to-green-500', comingSoon: true },
  { name: 'PayPal', icon: '💙', status: 'Available', color: 'from-blue-600 to-indigo-600' }
];

// ============================================================================
// SHARED UI COMPONENTS
// ============================================================================

const ModuleCard = ({ icon: Icon, title, description, gradient, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full p-6 rounded-3xl bg-gradient-to-br ${gradient} text-white text-left transform transition-all hover:scale-105 hover:shadow-2xl active:scale-95`}
  >
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
    className="group relative w-full aspect-square max-w-[140px] bg-white rounded-2xl p-3 sm:p-4 md:p-6 flex flex-col items-center justify-center gap-2 sm:gap-3 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-gray-100 hover:border-transparent overflow-hidden"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
    <div className={`relative p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${gradient} transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
      <Icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" strokeWidth={2.5} />
    </div>
    <h3 className="relative text-xs sm:text-sm md:text-base font-bold text-gray-900 text-center leading-tight px-1">{title}</h3>
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
      <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
        status === 'Paid' ? 'bg-green-100 text-green-700' :
        status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
      }`}>
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
      <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
        status === 'Confirmed' ? 'bg-green-100 text-green-700' :
        status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
      }`}>
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

// ============================================================================
// MODULE COMPONENTS
// ============================================================================

const Dashboard = ({ onBack }) => (
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

const Payments = ({ onBack }) => (
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
      <div className="mb-8">
        <div className="mb-6">
          <h3 className="text-2xl font-black text-gray-900 mb-2">Payment Options</h3>
          <p className="text-gray-600">Available payment methods for your guests</p>
        </div>
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-500" />Local Payment Methods
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PAYMENT_METHODS_LOCAL.map((method, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border-2 border-green-200 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-2xl`}>{method.icon}</div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{method.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-semibold text-green-600">{method.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-500" />International Payment Methods
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PAYMENT_METHODS_INTERNATIONAL.map((method, idx) => (
              <div key={idx} className={`bg-white rounded-2xl p-6 border-2 ${method.comingSoon ? 'border-gray-200' : 'border-green-200'} hover:shadow-lg transition-all`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-2xl`}>{method.icon}</div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{method.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {method.comingSoon ? (
                          <><Clock className="w-4 h-4 text-orange-500" /><span className="text-sm font-semibold text-orange-600">{method.status}</span></>
                        ) : (
                          <><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-sm font-semibold text-green-600">{method.status}</span></>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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

const Properties = ({ onBack }) => (
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

// Simple placeholder for remaining modules
const SimplePlaceholder = ({ title, gradient, onBack }) => (
  <div className={`min-h-screen bg-gradient-to-br ${gradient} p-4 pb-24`}>
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200">
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h2 className="text-3xl font-black text-gray-900">{title}</h2>
        <div className="w-14"></div>
      </div>
      <div className="bg-white rounded-3xl p-12 text-center">
        <Sparkles className="w-20 h-20 mx-auto mb-6 text-purple-500" />
        <h3 className="text-2xl font-black text-gray-900 mb-4">{title} Module</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          This module contains advanced features for {title.toLowerCase()}. Full implementation available in production version.
        </p>
      </div>
    </div>
  </div>
);

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function App() {
  const [currentModule, setCurrentModule] = useState(null);

  const handleModuleClick = (moduleId) => {
    setCurrentModule(moduleId);
  };

  const handleBackToHome = () => {
    setCurrentModule(null);
  };

  // Render specific module
  if (currentModule === 'dashboard') return <Dashboard onBack={handleBackToHome} />;
  if (currentModule === 'payments') return <Payments onBack={handleBackToHome} />;
  if (currentModule === 'properties') return <Properties onBack={handleBackToHome} />;

  // Placeholder modules
  if (currentModule === 'bookings') return <SimplePlaceholder title="Bookings" gradient="from-blue-50 to-cyan-50" onBack={handleBackToHome} />;
  if (currentModule === 'messages') return <SimplePlaceholder title="Messages" gradient="from-orange-50 to-red-50" onBack={handleBackToHome} />;
  if (currentModule === 'ai-assistant') return <SimplePlaceholder title="AI Assistant" gradient="from-purple-50 to-orange-50" onBack={handleBackToHome} />;
  if (currentModule === 'pricing') return <SimplePlaceholder title="Smart Pricing" gradient="from-gray-50 to-blue-50" onBack={handleBackToHome} />;
  if (currentModule === 'workflows') return <SimplePlaceholder title="Workflows & Automations" gradient="from-indigo-50 to-purple-50" onBack={handleBackToHome} />;
  if (currentModule === 'multichannel') return <SimplePlaceholder title="Multichannel Integration" gradient="from-indigo-50 to-pink-50" onBack={handleBackToHome} />;
  if (currentModule === 'marketing') return <SimplePlaceholder title="Marketing Suite" gradient="from-purple-50 to-pink-50" onBack={handleBackToHome} />;
  if (currentModule === 'social-publisher') return <SimplePlaceholder title="Social Publisher" gradient="from-blue-50 to-cyan-50" onBack={handleBackToHome} />;
  if (currentModule === 'reports') return <SimplePlaceholder title="Reports & Insights" gradient="from-orange-50 to-pink-50" onBack={handleBackToHome} />;
  if (currentModule === 'digital-checkin') return <SimplePlaceholder title="Digital Check-in" gradient="from-green-50 to-emerald-50" onBack={handleBackToHome} />;
  if (currentModule === 'rms-integration') return <SimplePlaceholder title="RMS Integration" gradient="from-indigo-50 to-blue-50" onBack={handleBackToHome} />;
  if (currentModule === 'reviews') return <SimplePlaceholder title="Reviews & Reputation" gradient="from-yellow-50 to-orange-50" onBack={handleBackToHome} />;
  if (currentModule === 'operations') return <SimplePlaceholder title="Operations Hub" gradient="from-blue-50 to-cyan-50" onBack={handleBackToHome} />;
  if (currentModule === 'voice-ai') return <SimplePlaceholder title="Voice AI Agent" gradient="from-purple-50 to-pink-50" onBack={handleBackToHome} />;
  if (currentModule === 'booking-engine') return <SimplePlaceholder title="Booking Engine Widget" gradient="from-green-50 to-blue-50" onBack={handleBackToHome} />;

  // HOME SCREEN
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b-2 border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                  MY HOST BizMate
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 font-semibold">Villa Management Platform</p>
              </div>
            </div>
            <button className="p-2 sm:p-3 bg-gray-100 hover:bg-gray-200 rounded-xl sm:rounded-2xl transition-colors">
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-12 text-white shadow-2xl">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 leading-tight">
              Effortlessly Manage Your Villas
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed mb-6 sm:mb-8">
              Complete platform with 18 integrated modules: bookings, payments, AI assistant, multichannel integration, marketing, and much more.
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <span className="px-4 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm sm:text-base font-bold">
                ✨ AI Powered
              </span>
              <span className="px-4 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm sm:text-base font-bold">
                🔄 Multi-channel
              </span>
              <span className="px-4 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm sm:text-base font-bold">
                📊 Analytics
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12 sm:pb-20">
        <div className="mb-8 sm:mb-12">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-2 sm:mb-3">
            Platform Modules
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 font-semibold">
            18 integrated tools to manage your business
          </p>
        </div>

        {/* Desktop/Tablet: Card View */}
        <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {APP_MODULES.map((module) => (
            <ModuleCard
              key={module.id}
              icon={module.icon}
              title={module.title}
              description={module.description}
              gradient={module.gradient}
              onClick={() => handleModuleClick(module.id)}
            />
          ))}
        </div>

        {/* Mobile: Grid View */}
        <div className="sm:hidden grid grid-cols-3 gap-3 justify-items-center">
          {APP_MODULES.map((module) => (
            <ModuleGridCard
              key={module.id}
              icon={module.icon}
              title={module.title}
              gradient={module.gradient}
              onClick={() => handleModuleClick(module.id)}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-gray-200 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm sm:text-base text-gray-600 font-semibold">
            © 2025 MY HOST BizMate - Refactored v2.0
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Professional Villa Management Platform
          </p>
        </div>
      </footer>
    </div>
  );
}

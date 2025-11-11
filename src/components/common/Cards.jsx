import React from 'react';
import { MapPin, Eye, Edit, Users, Star, ArrowRight, Clock, Instagram, Facebook, Twitter, Linkedin, Pause, Play, Settings } from 'lucide-react';

// ==================== MODULE CARDS ====================
export const ModuleCard = ({ icon: Icon, title, description, gradient, onClick }) => (
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

export const ModuleGridCard = ({ icon: Icon, title, gradient, onClick }) => (
  <button
    onClick={onClick}
    className="group relative w-full aspect-square max-w-[140px] bg-white rounded-2xl p-3 sm:p-4 md:p-6 flex flex-col items-center justify-center gap-2 sm:gap-3 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-gray-100 hover:border-transparent overflow-hidden"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
    <div className={`relative p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${gradient} transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
      <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" strokeWidth={2.5} />
    </div>
    <h3 className="relative text-xs sm:text-sm font-bold text-gray-900 text-center leading-tight px-1">{title}</h3>
  </button>
);

// ==================== STAT CARD ====================
export const StatCard = ({ icon: Icon, label, value, trend, gradient }) => (
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

// ==================== PAYMENT CARD ====================
export const PaymentCard = ({ guest, property, amount, status, date, method }) => (
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

// ==================== BOOKING CARD ====================
export const BookingCard = ({ guest, property, checkIn, checkOut, status, guests: guestCount, revenue }) => (
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

// ==================== MESSAGE CARD ====================
export const MessageCard = ({ name, property, message, time, unread, avatar }) => (
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

// ==================== PROPERTY CARD ====================
export const PropertyCard = ({ name, location, type, beds, baths, occupancy, revenue, rating, image }) => (
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

// ==================== PRICING CARD ====================
export const PricingCard = ({ property, basePrice, currentPrice, occupancy, trend, nextUpdate }) => {
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

// ==================== CAMPAIGN CARD ====================
export const CampaignCard = ({ name, platform, status, reach, engagement, clicks, budget, startDate, endDate }) => (
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
      <div className="bg-orange-50 rounded-xl p-3">
        <p className="text-xs text-gray-600 mb-1">Engagement</p>
        <p className="text-lg font-black text-orange-600">{engagement}</p>
      </div>
      <div className="bg-blue-50 rounded-xl p-3">
        <p className="text-xs text-gray-600 mb-1">Clicks</p>
        <p className="text-lg font-black text-blue-600">{clicks}</p>
      </div>
    </div>

    <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
      <div>
        <p className="text-xs text-gray-500 mb-1">Budget</p>
        <p className="text-lg font-bold text-gray-900">${budget}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-500 mb-1">Duration</p>
        <p className="text-sm font-bold text-gray-900">{startDate} - {endDate}</p>
      </div>
    </div>
  </div>
);

// ==================== WORKFLOW CARD ====================
export const WorkflowCard = ({ name, trigger, actions, status, lastRun, runsToday, icon: Icon }) => (
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

import React, { useState } from 'react';
import { LineChart, Line, BarChart as ReBarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart as RePieChart, Pie, Cell } from 'recharts';
import { Building2, LayoutDashboard, CreditCard, Calendar, MessageSquare, Sparkles, Home, DollarSign, TrendingUp, Users, MapPin, Star, Send, Bot, ChevronLeft, ChevronRight, Settings, Bell, Search, Plus, Filter, Download, Edit, Eye, ArrowRight, Megaphone, ThumbsUp, Share2, BarChart3, Instagram, Facebook, Twitter, Linkedin, X, Check, Workflow, Play, Pause, FileText, AlertCircle, CheckCircle, Clock, Zap, CalendarCheck, BellRing, Percent, BarChart, Map, Compass, Utensils, Car, Camera, Waves, Mountain, Leaf, Sun, Moon, Coffee, ChevronDown, ChevronUp, Award, Crown, ArrowUpRight, ArrowDownRight, PieChart, Activity, Repeat, RefreshCw, XCircle, TrendingDown, Smartphone, Globe, Phone, ClipboardList, User, ThumbsDown } from 'lucide-react';

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

export default MultichannelIntegration;

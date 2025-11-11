import React, { useState } from 'react';
import { LineChart, Line, BarChart as ReBarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart as RePieChart, Pie, Cell } from 'recharts';
import { Building2, LayoutDashboard, CreditCard, Calendar, MessageSquare, Sparkles, Home, DollarSign, TrendingUp, Users, MapPin, Star, Send, Bot, ChevronLeft, ChevronRight, Settings, Bell, Search, Plus, Filter, Download, Edit, Eye, ArrowRight, Megaphone, ThumbsUp, Share2, BarChart3, Instagram, Facebook, Twitter, Linkedin, X, Check, Workflow, Play, Pause, FileText, AlertCircle, CheckCircle, Clock, Zap, CalendarCheck, BellRing, Percent, BarChart, Map, Compass, Utensils, Car, Camera, Waves, Mountain, Leaf, Sun, Moon, Coffee, ChevronDown, ChevronUp, Award, Crown, ArrowUpRight, ArrowDownRight, PieChart, Activity, Repeat, RefreshCw, XCircle, TrendingDown, Smartphone, Globe, Phone, ClipboardList, User, ThumbsDown } from 'lucide-react';
import { StatCard, PropertyCard } from '../components/common/Cards';

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

export default Properties;

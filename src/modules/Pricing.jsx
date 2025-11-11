import React, { useState } from 'react';
import { LineChart, Line, BarChart as ReBarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart as RePieChart, Pie, Cell } from 'recharts';
import { Building2, LayoutDashboard, CreditCard, Calendar, MessageSquare, Sparkles, Home, DollarSign, TrendingUp, Users, MapPin, Star, Send, Bot, ChevronLeft, ChevronRight, Settings, Bell, Search, Plus, Filter, Download, Edit, Eye, ArrowRight, Megaphone, ThumbsUp, Share2, BarChart3, Instagram, Facebook, Twitter, Linkedin, X, Check, Workflow, Play, Pause, FileText, AlertCircle, CheckCircle, Clock, Zap, CalendarCheck, BellRing, Percent, BarChart, Map, Compass, Utensils, Car, Camera, Waves, Mountain, Leaf, Sun, Moon, Coffee, ChevronDown, ChevronUp, Award, Crown, ArrowUpRight, ArrowDownRight, PieChart, Activity, Repeat, RefreshCw, XCircle, TrendingDown, Smartphone, Globe, Phone, ClipboardList, User, ThumbsDown } from 'lucide-react';
import { PricingCard } from '../components/common/Cards';

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

export default Pricing;

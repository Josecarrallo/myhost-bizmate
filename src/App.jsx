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
    className="group relative w-full aspect-square max-w-[140px] bg-white rounded-2xl p-3 sm:p-4 md:p-6 flex flex-col items-center justify-center gap-2 sm:gap-3 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-gray-100 hover:border-transparent overflow-hidden"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
    <div className={`relative p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${gradient} transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
      <Icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" strokeWidth={2.5} />
    </div>
    <h3 className="relative text-xs sm:text-sm md:text-base font-bold text-gray-900 text-center leading-tight px-1">{title}</h3>
  </button>
);

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
          <h1 className="text-6xl font-black mb-2 text-orange-500">MY HOST</h1>
          <p className="text-4xl font-bold mb-4 text-orange-500">BizMate</p>
          <p className="text-xl text-black font-semibold mb-12">Smart management for modern hospitality.</p>
          <button onClick={() => setCurrentScreen('modules')} className="px-16 py-6 bg-orange-500 text-white rounded-3xl text-2xl font-bold hover:bg-orange-600 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95">
            Enter Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (currentScreen === 'modules') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentScreen('home')} className="p-2 bg-white rounded-xl hover:bg-gray-50 transition-colors shadow-lg border-2 border-gray-100">
              <ChevronLeft className="w-5 h-5 text-gray-900" />
            </button>
            <h2 className="text-xl font-black text-gray-900">MY HOST BizMate</h2>
            <div className="w-12"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
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

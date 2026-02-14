import React, { useState } from 'react';
import { 
  LayoutDashboard, Calendar, CalendarDays, Home, Settings, 
  ArrowLeftRight, CreditCard, BarChart3, DollarSign, Sparkles,
  Globe, Rocket, Smartphone, Users, Star, MessageSquare, 
  Megaphone, Share2, LogOut, ChevronLeft, Bell, Search
} from 'lucide-react';

const modules = {
  management: [
    { icon: LayoutDashboard, label: 'Dashboard', color: 'from-blue-500 to-blue-600' },
    { icon: Calendar, label: 'Bookings', color: 'from-emerald-500 to-teal-600' },
    { icon: CalendarDays, label: 'PMS Calendar', color: 'from-violet-500 to-purple-600' },
    { icon: Home, label: 'Properties', color: 'from-amber-500 to-orange-600' },
    { icon: Settings, label: 'Operations Hub', color: 'from-slate-500 to-slate-700' },
    { icon: ArrowLeftRight, label: 'Channel Manager', color: 'from-cyan-500 to-blue-600' },
    { icon: CreditCard, label: 'Payments', color: 'from-green-500 to-emerald-600' },
    { icon: BarChart3, label: 'Reports', color: 'from-rose-500 to-pink-600' },
    { icon: DollarSign, label: 'Smart Pricing', color: 'from-yellow-500 to-amber-600' },
    { icon: Sparkles, label: 'AI Assistant', color: 'from-fuchsia-500 to-purple-600' },
    { icon: Globe, label: 'Cultural Intelligence', color: 'from-indigo-500 to-blue-600' },
  ],
  experience: [
    { icon: Rocket, label: 'Booking Engine', color: 'from-teal-500 to-cyan-600' },
    { icon: Smartphone, label: 'Digital Check-in', color: 'from-sky-500 to-blue-600' },
    { icon: Users, label: 'Guest Portal', color: 'from-violet-500 to-indigo-600' },
    { icon: Star, label: 'Reviews', color: 'from-amber-400 to-yellow-500' },
    { icon: MessageSquare, label: 'WhatsApp IA', color: 'from-green-500 to-emerald-600' },
    { icon: Megaphone, label: 'Marketing', color: 'from-pink-500 to-rose-600' },
    { icon: Share2, label: 'Social Publisher', color: 'from-blue-500 to-indigo-600' },
  ]
};

const ModuleCard = ({ icon: Icon, label, color, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        animation: `fadeSlideUp 0.5s ease-out ${delay}ms both`,
      }}
    >
      <div className={`
        relative overflow-hidden rounded-2xl p-4
        bg-white/10 backdrop-blur-sm
        border border-white/20
        transition-all duration-300 ease-out
        ${isHovered ? 'bg-white/20 scale-105 shadow-2xl shadow-black/20' : ''}
      `}>
        {/* Gradient glow on hover */}
        <div className={`
          absolute inset-0 bg-gradient-to-br ${color} opacity-0
          transition-opacity duration-300
          ${isHovered ? 'opacity-20' : ''}
        `} />
        
        {/* Icon container */}
        <div className={`
          relative w-14 h-14 mx-auto mb-3 rounded-xl
          bg-gradient-to-br ${color}
          flex items-center justify-center
          shadow-lg
          transition-transform duration-300
          ${isHovered ? 'scale-110 rotate-3' : ''}
        `}>
          <Icon className="w-7 h-7 text-white" strokeWidth={1.8} />
        </div>
        
        {/* Label */}
        <p className={`
          relative text-center text-sm font-medium
          text-white/90 transition-colors duration-300
          ${isHovered ? 'text-white' : ''}
        `}>
          {label}
        </p>
      </div>
    </div>
  );
};

const SectionTitle = ({ children }) => (
  <div className="flex items-center gap-3 mb-6">
    <h2 className="text-lg font-semibold text-white tracking-wide">
      {children}
    </h2>
    <div className="flex-1 h-px bg-gradient-to-r from-white/30 to-transparent" />
  </div>
);

export default function MyHostBizmate() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-600 to-amber-700 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-orange-300/20 rounded-full blur-3xl" 
          style={{ animation: 'pulse 4s ease-in-out infinite alternate' }} />
        <div className="absolute -bottom-20 right-1/4 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl"
          style={{ animation: 'pulse 5s ease-in-out infinite alternate-reverse' }} />
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-lg mx-auto px-5 py-6">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <button className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-all duration-200">
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              MY HOST
            </h1>
            <p className="text-orange-100 text-sm font-medium -mt-0.5">
              BizMate
            </p>
          </div>
          
          <button className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-all duration-200">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {/* User info bar */}
        <div className="mb-8 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                J
              </div>
              <div>
                <p className="text-white font-medium text-sm">jose@myhost.com</p>
                <p className="text-orange-200 text-xs">Property Owner</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all">
                <Search className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-medium">3</span>
              </button>
            </div>
          </div>
        </div>

        {/* Property Management Section */}
        <section className="mb-8">
          <SectionTitle>Property Management System</SectionTitle>
          <div className="grid grid-cols-4 gap-3">
            {modules.management.map((module, index) => (
              <ModuleCard 
                key={module.label} 
                {...module} 
                delay={index * 50}
              />
            ))}
          </div>
        </section>

        {/* Guest Experience Section */}
        <section className="mb-8">
          <SectionTitle>Guest Experience & Marketing</SectionTitle>
          <div className="grid grid-cols-4 gap-3">
            {modules.experience.map((module, index) => (
              <ModuleCard 
                key={module.label} 
                {...module} 
                delay={300 + index * 50}
              />
            ))}
          </div>
        </section>

        {/* Quick Stats Footer */}
        <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">12</p>
              <p className="text-orange-200 text-xs">Active Bookings</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">3</p>
              <p className="text-orange-200 text-xs">Properties</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">94%</p>
              <p className="text-orange-200 text-xs">Occupancy</p>
            </div>
          </div>
        </div>

      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

import React, { useState } from 'react';
import { Building2, ChevronLeft, LayoutDashboard, Calendar, Home, CreditCard, MessageSquare, Sparkles, DollarSign, Megaphone, Share2, Workflow, BarChart3, Smartphone, Repeat, Star, Phone, Globe, ClipboardList, User, LogOut, Wifi, Shield, Zap, Bell, Search, CalendarDays, Settings, ArrowLeftRight, Rocket, Users } from 'lucide-react';
import ModuleGridCard from './components/common/ModuleGridCard';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/Auth/LoginPage';

// Import all module components
import Dashboard from './components/Dashboard/Dashboard';
import Payments from './components/Payments/Payments';
import Bookings from './components/Bookings/Bookings';
import Messages from './components/Messages/Messages';
import AIAssistant from './components/AIAssistant/AIAssistant';
import Multichannel from './components/Multichannel/Multichannel';
import Properties from './components/Properties/Properties';
import Marketing from './components/Marketing/Marketing';
import SocialPublisher from './components/SocialPublisher/SocialPublisher';
import SmartPricing from './components/SmartPricing/SmartPricing';
import Workflows from './components/Workflows/Workflows';
import AITripPlanner from './components/Workflows/AITripPlanner';
import BookingWorkflow from './components/Workflows/BookingWorkflow';
import Reports from './components/Reports/Reports';
import DigitalCheckIn from './components/DigitalCheckIn/DigitalCheckIn';
import RMSIntegration from './components/RMSIntegration/RMSIntegration';
import Reviews from './components/Reviews/Reviews';
import Operations from './components/Operations/Operations';
import VoiceAI from './components/VoiceAI/VoiceAI';
import BookingEngine from './components/BookingEngine/BookingEngine';
import PMSCalendar from './components/PMSCalendar/PMSCalendar';
import CulturalIntelligence from './components/CulturalIntelligence/CulturalIntelligence';
import GuestPortal from './components/GuestPortal/GuestPortal';

// ==================== FLOATING ICON COMPONENT ====================
const FloatingIcon = ({ icon: Icon, className, delay }) => (
  <div
    className={`absolute ${className}`}
    style={{
      animation: `float 6s ease-in-out infinite`,
      animationDelay: `${delay}s`
    }}
  >
    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
      <Icon className="w-6 h-6 text-white/60" />
    </div>
  </div>
);

// ==================== MODULE CARD COMPONENT ====================
const ModuleCard = ({ icon: Icon, label, color, delay, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
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

// ==================== SECTION TITLE COMPONENT ====================
const SectionTitle = ({ children }) => (
  <div className="flex items-center gap-3 mb-6">
    <h2 className="text-lg font-semibold text-white tracking-wide">
      {children}
    </h2>
    <div className="flex-1 h-px bg-gradient-to-r from-white/30 to-transparent" />
  </div>
);

// ==================== MODULE DEFINITIONS ====================
const modules = {
  management: [
    { icon: LayoutDashboard, label: 'Dashboard', color: 'from-blue-500 to-blue-600', module: 'dashboard' },
    { icon: Calendar, label: 'Bookings', color: 'from-emerald-500 to-teal-600', module: 'bookings' },
    { icon: CalendarDays, label: 'PMS Calendar', color: 'from-violet-500 to-purple-600', module: 'pms-calendar' },
    { icon: Home, label: 'Properties', color: 'from-amber-500 to-orange-600', module: 'properties' },
    { icon: Settings, label: 'Operations Hub', color: 'from-slate-500 to-slate-700', module: 'operations' },
    { icon: ArrowLeftRight, label: 'Channel Manager', color: 'from-cyan-500 to-blue-600', module: 'multichannel' },
    { icon: CreditCard, label: 'Payments', color: 'from-green-500 to-emerald-600', module: 'payments' },
    { icon: BarChart3, label: 'Reports', color: 'from-rose-500 to-pink-600', module: 'reports' },
    { icon: DollarSign, label: 'Smart Pricing', color: 'from-yellow-500 to-amber-600', module: 'pricing' },
    { icon: Sparkles, label: 'AI Assistant', color: 'from-fuchsia-500 to-purple-600', module: 'ai' },
    { icon: Globe, label: 'Cultural Intelligence', color: 'from-indigo-500 to-blue-600', module: 'cultural-intelligence' },
  ],
  experience: [
    { icon: Rocket, label: 'Booking Engine', color: 'from-teal-500 to-cyan-600', module: 'booking-engine' },
    { icon: Smartphone, label: 'Digital Check-in', color: 'from-sky-500 to-blue-600', module: 'digital-checkin' },
    { icon: Users, label: 'Guest Portal', color: 'from-violet-500 to-indigo-600', module: 'guest-portal' },
    { icon: Star, label: 'Reviews', color: 'from-amber-400 to-yellow-500', module: 'reviews' },
    { icon: MessageSquare, label: 'WhatsApp IA', color: 'from-green-500 to-emerald-600', module: 'messages' },
    { icon: Megaphone, label: 'Marketing', color: 'from-pink-500 to-rose-600', module: 'marketing' },
    { icon: Share2, label: 'Social Publisher', color: 'from-blue-500 to-indigo-600', module: 'social' },
  ]
};

// ==================== MAIN APP ====================
export default function App() {
  const { user, userData, loading, signOut } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('home');
  const [currentModule, setCurrentModule] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  React.useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return <LoginPage />;
  }

  // Home Screen
  if (currentScreen === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-600 to-amber-700 relative overflow-hidden flex flex-col items-center justify-center px-6">

        {/* Animated background layers */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-yellow-400/25 rounded-full blur-3xl"
            style={{ animation: 'pulse 8s ease-in-out infinite' }}
          />
          <div
            className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-orange-300/20 rounded-full blur-3xl"
            style={{ animation: 'pulse 10s ease-in-out infinite reverse' }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-400/15 rounded-full blur-3xl"
            style={{ animation: 'breathe 6s ease-in-out infinite' }}
          />

          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `
                radial-gradient(ellipse at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 80%, rgba(255,200,100,0.1) 0%, transparent 50%),
                radial-gradient(ellipse at 40% 60%, rgba(255,255,255,0.05) 0%, transparent 40%)
              `
            }}
          />
        </div>

        {/* Floating feature icons */}
        <FloatingIcon icon={Wifi} className="top-[15%] left-[10%]" delay={0} />
        <FloatingIcon icon={Shield} className="top-[20%] right-[12%]" delay={1.5} />
        <FloatingIcon icon={Zap} className="bottom-[25%] left-[8%]" delay={3} />
        <FloatingIcon icon={Sparkles} className="bottom-[20%] right-[10%]" delay={2} />

        {/* Main content */}
        <div className="relative z-10 text-center max-w-md">

          {/* Logo container - ORIGINAL Building2 icon */}
          <div
            className={`
              relative mx-auto mb-4 transition-all duration-1000
              ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}
            `}
          >
            {/* Outer glow ring */}
            <div
              className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-amber-400/30 to-orange-300/30 blur-2xl"
              style={{ animation: 'breathe 4s ease-in-out infinite' }}
            />

            {/* Pulsing ring */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border-2 border-white/20"
              style={{ animation: 'ringPulse 3s ease-in-out infinite' }}
            />

            {/* White circle with ORANGE Building2 icon */}
            <div className="relative w-32 h-32 mx-auto rounded-full bg-white shadow-2xl shadow-orange-900/30 flex items-center justify-center">
              <Building2
                className="w-16 h-16 text-orange-500"
                strokeWidth={1.5}
              />
            </div>

            {/* Orbiting dot */}
            <div
              className="absolute w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-lg shadow-amber-500/50"
              style={{
                top: '50%',
                left: '50%',
                animation: 'orbit 8s linear infinite',
                transformOrigin: '0 0'
              }}
            />
          </div>

          {/* Brand text - MOVED UP with more margin below */}
          <div
            className={`
              mb-20 transition-all duration-1000 delay-200
              ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            <h1 className="text-5xl font-black text-white tracking-tight mb-1 drop-shadow-lg">
              MY HOST
            </h1>
            <p className="text-4xl font-black text-white/90 tracking-tight drop-shadow-lg">
              BizMate
            </p>
          </div>

          {/* Tagline */}
          <div
            className={`
              mb-10 transition-all duration-1000 delay-400
              ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            <p className="text-lg font-medium text-white/90 mb-1">
              Smart Management for Modern Hospitality
            </p>
            <p className="text-lg font-medium text-white/90">
              Powered by Artificial Intelligence
            </p>
          </div>

          {/* CTA Button */}
          <div
            className={`
              transition-all duration-1000 delay-600
              ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            <button
              onClick={() => setCurrentScreen('modules')}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`
                relative group px-10 py-4 rounded-full
                bg-gradient-to-r from-orange-700 via-orange-800 to-amber-900
                font-semibold text-white
                shadow-xl shadow-orange-950/40
                border border-orange-600/50
                transition-all duration-300 ease-out
                ${isHovered ? 'scale-105 shadow-2xl shadow-orange-950/50' : ''}
              `}
            >
              <div
                className={`
                  absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent
                  transition-opacity duration-300
                  ${isHovered ? 'opacity-100' : 'opacity-0'}
                `}
              />

              <span className="relative flex items-center gap-3">
                Enter Dashboard
                <span
                  className={`
                    transition-transform duration-300
                    ${isHovered ? 'translate-x-1' : ''}
                  `}
                >
                  →
                </span>
              </span>
            </button>
          </div>

          {/* Version badge */}
          <div
            className={`
              mt-12 transition-all duration-1000 delay-700
              ${isLoaded ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs text-white/70">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              v2.0 · All systems operational
            </span>
          </div>

        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none">
          <svg
            viewBox="0 0 1440 120"
            className="absolute bottom-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z"
              fill="rgba(255,255,255,0.05)"
            />
          </svg>
        </div>

        {/* CSS Animations */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }

          @keyframes breathe {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.15); opacity: 0.8; }
          }

          @keyframes orbit {
            from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
            to { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.05); }
          }

          @keyframes ringPulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
            50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.1; }
          }
        `}</style>
      </div>
    );
  }

  // Module Routing
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
    return <Multichannel onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'properties') {
    return <Properties onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'pricing') {
    return <SmartPricing onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'marketing') {
    return <Marketing onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'social') {
    return <SocialPublisher onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'trip-planner') {
    return <AITripPlanner onBack={() => setCurrentModule('workflows')} />;
  }

  if (currentModule === 'bookings-workflow') {
    return <BookingWorkflow onBack={() => setCurrentModule('workflows')} />;
  }

  if (currentModule === 'workflows') {
    return <Workflows onBack={() => setCurrentModule(null)} onNavigate={setCurrentModule} />;
  }

  if (currentModule === 'reports') {
    return <Reports onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'pms-calendar') {
    return <PMSCalendar onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'booking-engine') {
    return <BookingEngine onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'voice-ai') {
    return <VoiceAI onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'operations') {
    return <Operations onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'reviews') {
    return <Reviews onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'guest-portal') {
    return <GuestPortal onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'rms') {
    return <RMSIntegration onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'digital-checkin') {
    return <DigitalCheckIn onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'cultural-intelligence') {
    return <CulturalIntelligence onBack={() => setCurrentModule(null)} />;
  }

  // Modules Grid Screen
  if (currentScreen === 'modules') {
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
            <button onClick={() => setCurrentScreen('home')} className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-all duration-200">
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

            <button onClick={signOut} className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-all duration-200">
              <LogOut className="w-5 h-5" />
            </button>
          </header>

          {/* User info bar */}
          <div className="mb-8 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                  {userData?.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{user.email}</p>
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
              {modules.management.map((mod, index) => (
                <ModuleCard
                  key={mod.label}
                  icon={mod.icon}
                  label={mod.label}
                  color={mod.color}
                  delay={index * 50}
                  onClick={() => setCurrentModule(mod.module)}
                />
              ))}
            </div>
          </section>

          {/* Guest Experience Section */}
          <section className="mb-8">
            <SectionTitle>Guest Experience & Marketing</SectionTitle>
            <div className="grid grid-cols-4 gap-3">
              {modules.experience.map((mod, index) => (
                <ModuleCard
                  key={mod.label}
                  icon={mod.icon}
                  label={mod.label}
                  color={mod.color}
                  delay={300 + index * 50}
                  onClick={() => setCurrentModule(mod.module)}
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
}
import React, { useState } from 'react';
import { Building2, ChevronLeft, LayoutDashboard, Calendar, Home, CreditCard, MessageSquare, Sparkles, DollarSign, Megaphone, Share2, Workflow, BarChart3, Smartphone, Repeat, Star, Phone, Globe, ClipboardList } from 'lucide-react';
import ModuleGridCard from './components/common/ModuleGridCard';

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

// ==================== MAIN APP ====================
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [currentModule, setCurrentModule] = useState(null);

  // Home Screen
  if (currentScreen === 'home') {
    return (
      <div className="h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex flex-col items-center justify-center p-8 pt-32 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl top-40 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute w-72 h-72 bg-orange-200/30 rounded-full blur-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>

        <div className="text-center relative z-10">
          {/* Logo con efecto de glow */}
          <div className="relative inline-block mb-8">
            <div className="w-40 h-40 rounded-full mx-auto flex items-center justify-center bg-white shadow-2xl relative overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-110 hover:rotate-6">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Building2 className="w-20 h-20 text-orange-500 group-hover:text-white relative z-10 transition-all duration-500 group-hover:scale-110" strokeWidth={2.5} />
            </div>
            <div className="absolute inset-0 rounded-full bg-white/40 blur-2xl animate-pulse"></div>
          </div>

          <h1 className="text-7xl md:text-8xl font-black mb-3 text-white drop-shadow-2xl">
            MY HOST
          </h1>
          <p className="text-5xl md:text-6xl font-bold mb-8 text-orange-100 drop-shadow-xl">
            BizMate
          </p>
          <p className="text-2xl md:text-3xl text-white font-bold mb-3 drop-shadow-lg max-w-3xl mx-auto">
            Smart Management for Modern Hospitality
          </p>
          <p className="text-xl md:text-2xl text-orange-100 font-semibold mb-12 drop-shadow-lg max-w-3xl mx-auto">
            Powered by Artificial Intelligence
          </p>

          <div className="relative">
            <button
              onClick={() => setCurrentScreen('modules')}
              className="group relative px-20 py-7 bg-white/95 backdrop-blur-sm text-orange-600 rounded-full text-2xl font-black shadow-2xl hover:shadow-white/30 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 active:scale-95 overflow-hidden border-2 border-white/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-full"></div>
              <span className="relative z-10 flex items-center gap-3 justify-center">
                <span className="text-orange-600 font-black">
                  Enter Dashboard
                </span>
                <span className="text-2xl text-orange-600 transform group-hover:translate-x-2 transition-transform duration-300">→</span>
              </span>
            </button>
            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full -z-10 group-hover:bg-white/40 transition-all duration-500"></div>
          </div>

          <p className="mt-16 text-orange-50/80 text-sm font-medium tracking-wider">
            AI-Powered Property Management System
          </p>
        </div>
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
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-3 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute w-72 h-72 bg-orange-200/30 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentScreen('home')} className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
              <ChevronLeft className="w-6 h-6 text-orange-600" />
            </button>
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-black text-white drop-shadow-2xl">MY HOST</h2>
              <p className="text-xl md:text-2xl font-bold text-orange-100 drop-shadow-xl">BizMate</p>
            </div>
            <div className="w-12"></div>
          </div>

          <div className="space-y-8">
            {/* 🏢 BLOQUE A - PROPERTY MANAGEMENT SYSTEM */}
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-black text-white px-1 drop-shadow-2xl">Property Management System</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                <ModuleGridCard icon={LayoutDashboard} title="Dashboard" gradient="from-purple-500 to-pink-600" onClick={() => setCurrentModule('dashboard')} />
                <ModuleGridCard icon={Calendar} title="Bookings" gradient="from-blue-500 to-cyan-600" onClick={() => setCurrentModule('bookings')} />
                <ModuleGridCard icon={Calendar} title="PMS Calendar" gradient="from-blue-500 to-purple-600" onClick={() => setCurrentModule('pms-calendar')} />
                <ModuleGridCard icon={Home} title="Properties" gradient="from-pink-500 to-rose-600" onClick={() => setCurrentModule('properties')} />
                <ModuleGridCard icon={ClipboardList} title="Operations Hub" gradient="from-blue-600 to-cyan-600" onClick={() => setCurrentModule('operations')} />
                <ModuleGridCard icon={Repeat} title="Channel Manager" gradient="from-indigo-500 to-blue-600" onClick={() => setCurrentModule('multichannel')} />
                <ModuleGridCard icon={CreditCard} title="Payments" gradient="from-green-500 to-emerald-600" onClick={() => setCurrentModule('payments')} />
                <ModuleGridCard icon={BarChart3} title="Reports" gradient="from-orange-600 to-pink-600" onClick={() => setCurrentModule('reports')} />
                <ModuleGridCard icon={DollarSign} title="Smart Pricing" gradient="from-blue-600 to-indigo-600" onClick={() => setCurrentModule('pricing')} />
                <ModuleGridCard icon={Sparkles} title="AI Assistant" gradient="from-purple-500 to-orange-500" onClick={() => setCurrentModule('ai')} />
                <ModuleGridCard icon={Globe} title="Cultural Intelligence" gradient="from-indigo-500 to-purple-600" onClick={() => setCurrentModule('cultural-intelligence')} />
              </div>
            </div>

            {/* 🌍 BLOQUE B - GUEST EXPERIENCE & MARKETING */}
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-black text-white px-1 drop-shadow-2xl">Guest Experience & Marketing</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                <ModuleGridCard icon={Sparkles} title="Booking Engine" gradient="from-orange-500 to-pink-600" onClick={() => setCurrentModule('booking-engine')} />
                <ModuleGridCard icon={Smartphone} title="Digital Check-in" gradient="from-green-500 to-emerald-600" onClick={() => setCurrentModule('digital-checkin')} />
                <ModuleGridCard icon={Star} title="Reviews" gradient="from-yellow-500 to-orange-600" onClick={() => setCurrentModule('reviews')} />
                <ModuleGridCard icon={MessageSquare} title="WhatsApp IA" gradient="from-orange-500 to-red-600" onClick={() => setCurrentModule('messages')} />
                <ModuleGridCard icon={Megaphone} title="Marketing" gradient="from-purple-600 to-pink-600" onClick={() => setCurrentModule('marketing')} />
                <ModuleGridCard icon={Share2} title="Social Publisher" gradient="from-blue-600 to-cyan-600" onClick={() => setCurrentModule('social')} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
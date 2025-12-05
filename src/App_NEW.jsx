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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentScreen('home')} className="p-2 bg-white rounded-xl hover:bg-gray-50 transition-colors shadow-lg border-2 border-gray-100">
              <ChevronLeft className="w-5 h-5 text-gray-900" />
            </button>
            <h2 className="text-xl font-black text-gray-900">MY HOST BizMate</h2>
            <div className="w-12"></div>
          </div>

          <div className="space-y-6">
            {/* 1️⃣ Operations & Guest Management */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3 px-1">Operations & Guest Management</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                <ModuleGridCard icon={LayoutDashboard} title="Dashboard" gradient="from-purple-500 to-pink-600" onClick={() => setCurrentModule('dashboard')} />
                <ModuleGridCard icon={Calendar} title="Bookings" gradient="from-blue-500 to-cyan-600" onClick={() => setCurrentModule('bookings')} />
                <ModuleGridCard icon={Calendar} title="PMS Calendar" gradient="from-blue-500 to-purple-600" onClick={() => setCurrentModule('pms-calendar')} />
                <ModuleGridCard icon={Home} title="Properties" gradient="from-pink-500 to-rose-600" onClick={() => setCurrentModule('properties')} />
                <ModuleGridCard icon={ClipboardList} title="Operations Hub" gradient="from-blue-600 to-cyan-600" onClick={() => setCurrentModule('operations')} />
                <ModuleGridCard icon={Smartphone} title="Digital Check-in" gradient="from-green-500 to-emerald-600" onClick={() => setCurrentModule('digital-checkin')} />
                <ModuleGridCard icon={MessageSquare} title="Messages" gradient="from-orange-500 to-red-600" onClick={() => setCurrentModule('messages')} />
              </div>
            </div>

            {/* 2️⃣ Revenue & Pricing */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3 px-1">Revenue & Pricing</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                <ModuleGridCard icon={Sparkles} title="Booking Engine" gradient="from-orange-500 to-pink-600" onClick={() => setCurrentModule('booking-engine')} />
                <ModuleGridCard icon={CreditCard} title="Payments" gradient="from-green-500 to-emerald-600" onClick={() => setCurrentModule('payments')} />
                <ModuleGridCard icon={DollarSign} title="Smart Pricing" gradient="from-blue-600 to-indigo-600" onClick={() => setCurrentModule('pricing')} />
                <ModuleGridCard icon={Repeat} title="RMS Integration" gradient="from-indigo-500 to-blue-600" onClick={() => setCurrentModule('rms')} />
                <ModuleGridCard icon={BarChart3} title="Reports" gradient="from-orange-600 to-pink-600" onClick={() => setCurrentModule('reports')} />
              </div>
            </div>

            {/* 3️⃣ AI Intelligence Layer */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3 px-1">AI Intelligence Layer</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                <ModuleGridCard icon={Sparkles} title="AI Assistant" gradient="from-purple-500 to-orange-500" onClick={() => setCurrentModule('ai')} />
                <ModuleGridCard icon={Phone} title="Voice AI Agent" gradient="from-purple-600 to-pink-600" onClick={() => setCurrentModule('voice-ai')} />
                <ModuleGridCard icon={Globe} title="Cultural Intelligence" gradient="from-indigo-500 to-purple-600" onClick={() => setCurrentModule('cultural-intelligence')} />
              </div>
            </div>

            {/* 4️⃣ Marketing & Growth */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3 px-1">Marketing & Growth</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                <ModuleGridCard icon={Repeat} title="Multichannel" gradient="from-indigo-500 to-blue-600" onClick={() => setCurrentModule('multichannel')} />
                <ModuleGridCard icon={Megaphone} title="Marketing" gradient="from-purple-600 to-pink-600" onClick={() => setCurrentModule('marketing')} />
                <ModuleGridCard icon={Share2} title="Social Publisher" gradient="from-blue-600 to-cyan-600" onClick={() => setCurrentModule('social')} />
                <ModuleGridCard icon={Star} title="Reviews" gradient="from-yellow-500 to-orange-600" onClick={() => setCurrentModule('reviews')} />
              </div>
            </div>

            {/* 5️⃣ Workflows & Automations */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3 px-1">Workflows & Automations</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                <ModuleGridCard icon={Workflow} title="Workflows" gradient="from-indigo-600 to-purple-600" onClick={() => setCurrentModule('workflows')} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
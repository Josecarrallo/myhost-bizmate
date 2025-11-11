import React, { useState } from 'react';
import {
  Building2, LayoutDashboard, CreditCard, Calendar, MessageSquare, Sparkles,
  Home, DollarSign, Megaphone, Share2, BarChart3, Workflow, Phone,
  ClipboardList, Star, Repeat, Smartphone, ChevronLeft
} from 'lucide-react';
import { ModuleGridCard } from './components/common/Cards';

// Import all modules
import Dashboard from './modules/Dashboard';
import Payments from './modules/Payments';
import Bookings from './modules/Bookings';
import Messages from './modules/Messages';
import AIAssistant from './modules/AIAssistant';
import MultichannelIntegration from './modules/MultichannelIntegration';
import Properties from './modules/Properties';
import Pricing from './modules/Pricing';
import MarketingSuite from './modules/MarketingSuite';
import SocialPublisher from './modules/SocialPublisher';
import WorkflowsAutomations from './modules/WorkflowsAutomations';
import AITripPlanner from './modules/AITripPlanner';
import BookingsReservationsWorkflow from './modules/BookingsReservationsWorkflow';
import ReportsInsights from './modules/ReportsInsights';
import PMSCalendar from './modules/PMSCalendar';
import BookingEngineWidget from './modules/BookingEngineWidget';
import VoiceAIAgent from './modules/VoiceAIAgent';
import OperationsHub from './modules/OperationsHub';
import ReviewsReputation from './modules/ReviewsReputation';
import RMSIntegration from './modules/RMSIntegration';
import DigitalCheckIn from './modules/DigitalCheckIn';

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
          <h1 className="text-9xl font-black mb-4 text-orange-500">MY HOST</h1>
          <p className="text-6xl font-bold mb-4 text-orange-500">BizMate</p>
          <p className="text-2xl text-black font-semibold mb-12">Perfect for Villas, Boutique Hotels & Guest Houses</p>
          <button
            onClick={() => setCurrentScreen('modules')}
            className="px-16 py-6 bg-orange-500 text-white rounded-3xl text-2xl font-bold hover:bg-orange-600 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95"
          >
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
    return <MultichannelIntegration onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'properties') {
    return <Properties onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'pricing') {
    return <Pricing onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'marketing') {
    return <MarketingSuite onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'social') {
    return <SocialPublisher onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'trip-planner') {
    return <AITripPlanner onBack={() => setCurrentModule('workflows')} />;
  }

  if (currentModule === 'bookings-workflow') {
    return <BookingsReservationsWorkflow onBack={() => setCurrentModule('workflows')} />;
  }

  if (currentModule === 'workflows') {
    return <WorkflowsAutomations onBack={() => setCurrentModule(null)} onNavigate={setCurrentModule} />;
  }

  if (currentModule === 'reports') {
    return <ReportsInsights onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'pms-calendar') {
    return <PMSCalendar onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'booking-engine') {
    return <BookingEngineWidget onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'voice-ai') {
    return <VoiceAIAgent onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'operations') {
    return <OperationsHub onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'reviews') {
    return <ReviewsReputation onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'rms') {
    return <RMSIntegration onBack={() => setCurrentModule(null)} />;
  }

  if (currentModule === 'digital-checkin') {
    return <DigitalCheckIn onBack={() => setCurrentModule(null)} />;
  }

  // Module Grid Screen
  if (currentScreen === 'modules') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setCurrentScreen('home')}
              className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors shadow-lg border-2 border-gray-100"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h2 className="text-3xl font-black text-gray-900">MY HOST BizMate</h2>
            <div className="w-14"></div>
          </div>

          <div className="grid grid-cols-4 gap-4">
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

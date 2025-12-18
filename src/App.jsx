import React, { useState } from 'react';
import { Building2, ChevronLeft, LayoutDashboard, Calendar, Home, CreditCard, MessageSquare, Sparkles, DollarSign, Megaphone, Share2, Workflow, BarChart3, Smartphone, Repeat, Star, Phone, Globe, ClipboardList, User, LogOut, Wifi, Shield, Zap, Bell, Search, CalendarDays, Settings, ArrowLeftRight, Rocket, Users } from 'lucide-react';
import ModuleGridCard from './components/common/ModuleGridCard';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/Auth/LoginPage';

// Import Layout components
import Sidebar from './components/Layout/Sidebar';
import OwnerExecutiveSummary from './components/Dashboard/OwnerExecutiveSummary';

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
import WorkflowTester from './components/Workflows/WorkflowTester';
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
import VoiceAssistant from './components/VoiceAssistant/VoiceAssistant';
import AIReceptionist from './components/AIReceptionist/AIReceptionist';

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
        relative overflow-hidden rounded-2xl p-3
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
          relative w-12 h-12 mx-auto mb-2 rounded-xl
          bg-gradient-to-br ${color}
          flex items-center justify-center
          shadow-lg
          transition-transform duration-300
          ${isHovered ? 'scale-110 rotate-3' : ''}
        `}>
          <Icon className="w-6 h-6 text-white" strokeWidth={1.8} />
        </div>

        {/* Label */}
        <p className={`
          relative text-center text-xs font-medium leading-tight
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
    { icon: CalendarDays, label: 'PMS', color: 'from-violet-500 to-purple-600', module: 'pms-calendar' },
    { icon: Home, label: 'Properties', color: 'from-amber-500 to-orange-600', module: 'properties' },
    { icon: Settings, label: 'Operations', color: 'from-slate-500 to-slate-700', module: 'operations' },
    { icon: ArrowLeftRight, label: 'Channel', color: 'from-cyan-500 to-blue-600', module: 'multichannel' },
    { icon: CreditCard, label: 'Payment', color: 'from-green-500 to-emerald-600', module: 'payments' },
    { icon: BarChart3, label: 'Reports', color: 'from-rose-500 to-pink-600', module: 'reports' },
    { icon: DollarSign, label: 'Pricing', color: 'from-yellow-500 to-amber-600', module: 'pricing' },
    { icon: Sparkles, label: 'Assistant', color: 'from-fuchsia-500 to-purple-600', module: 'ai' },
    { icon: Globe, label: 'Culture', color: 'from-indigo-500 to-blue-600', module: 'cultural-intelligence' },
  ],
  experience: [
    { icon: Rocket, label: 'Bookings', color: 'from-teal-500 to-cyan-600', module: 'booking-engine' },
    { icon: Smartphone, label: 'Check-in', color: 'from-sky-500 to-blue-600', module: 'digital-checkin' },
    { icon: Users, label: 'Guests', color: 'from-violet-500 to-indigo-600', module: 'guest-portal' },
    { icon: Star, label: 'Reviews', color: 'from-amber-400 to-yellow-500', module: 'reviews' },
    { icon: MessageSquare, label: 'WhatsApp', color: 'from-green-500 to-emerald-600', module: 'messages' },
    { icon: Megaphone, label: 'Campaigns', color: 'from-pink-500 to-rose-600', module: 'marketing' },
    { icon: Share2, label: 'Social', color: 'from-blue-500 to-indigo-600', module: 'social' },
  ]
};

// ==================== MAIN APP ====================
export default function App() {
  const { user, userData, loading, signOut } = useAuth();
  // Simplified state: just track current view
  const [currentView, setCurrentView] = useState('overview'); // 'overview' is the default after login

  React.useEffect(() => {
    // Reset to overview when user logs in
    if (user) {
      setCurrentView('overview');
    }
  }, [user]);

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

  // Helper function to render current view content
  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return <OwnerExecutiveSummary userName={userData?.full_name || user?.email?.split('@')[0] || 'José'} />;

      case 'dashboard':
        return <Dashboard onBack={() => setCurrentView('overview')} />;

      case 'properties':
        return <Properties key="properties" onBack={() => setCurrentView('overview')} />;

      case 'bookings':
        return <Bookings key="bookings" onBack={() => setCurrentView('overview')} />;

      case 'calendar':
        return <PMSCalendar onBack={() => setCurrentView('overview')} />;

      case 'guests':
        return <GuestPortal onBack={() => setCurrentView('overview')} />;

      case 'payments':
        return <Payments onBack={() => setCurrentView('overview')} />;

      case 'smartPricing':
        return <SmartPricing onBack={() => setCurrentView('overview')} />;

      case 'reports':
        return <Reports onBack={() => setCurrentView('overview')} />;

      case 'channelIntegration':
        return <Multichannel onBack={() => setCurrentView('overview')} />;

      case 'aiAssistant':
        return <AIAssistant onBack={() => setCurrentView('overview')} />;

      case 'ai-receptionist':
        return <AIReceptionist onBack={() => setCurrentView('overview')} />;

      case 'workflows':
        return <Workflows onBack={() => setCurrentView('overview')} onNavigate={setCurrentView} />;

      case 'trip-planner':
        return <AITripPlanner onBack={() => setCurrentView('workflows')} />;

      case 'bookings-workflow':
        return <BookingWorkflow onBack={() => setCurrentView('workflows')} />;

      case 'workflow-tester':
        return <WorkflowTester onBack={() => setCurrentView('workflows')} />;

      case 'settings':
        // Placeholder for settings
        return (
          <div className="flex-1 bg-gray-50 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600">Settings page coming soon...</p>
          </div>
        );

      default:
        return <OwnerExecutiveSummary userName={userData?.full_name || user?.email?.split('@')[0] || 'José'} />;
    }
  };

  // Main App Layout with Sidebar
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />

      {/* Content Area */}
      {renderContent()}

      {/* Voice Assistant - Botón flotante siempre visible */}
      <VoiceAssistant />
    </div>
  );
}

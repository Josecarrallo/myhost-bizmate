import React, { useState } from 'react';
import { Building2, ChevronLeft, LayoutDashboard, Calendar, Home, CreditCard, MessageSquare, Sparkles, DollarSign, Megaphone, Share2, Workflow, BarChart3, Smartphone, Repeat, Star, Phone, Globe, ClipboardList, User, LogOut, Wifi, Shield, Zap, Bell, Search, CalendarDays, Settings, ArrowLeftRight, Rocket, Users, Menu, X } from 'lucide-react';
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
import AIAgentsMonitor from './components/AIAgentsMonitor/AIAgentsMonitor';
import MySite from './components/MySite/MySite';
import Guests from './components/Guests/Guests';
import GuestSegmentation from './components/GuestSegmentation/GuestSegmentation';
import MetaAds from './components/MetaAds/MetaAds';
import GuestAnalytics from './components/GuestAnalytics/GuestAnalytics';
import AIOperatorDemo from './components/ai-operator/AIOperatorDemo';
import MarketingOverview from './components/Marketing/MarketingOverview';
import ContentPlanner from './components/Marketing/ContentPlanner';
import ReviewsManagement from './components/Reviews/ReviewsManagement';
import CreateMyWebsite from './components/MySite/CreateMyWebsite';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state for mobile

  // Only set initial view on mount, don't reset on every user change
  React.useEffect(() => {
    if (user && currentView === 'overview') {
      // User is logged in and we're at default view, stay there
      setCurrentView('overview');
    }
  }, []); // Empty deps - only run once on mount

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[#2a2f3a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#d85a2a]/30 border-t-[#d85a2a] rounded-full animate-spin mx-auto mb-4"></div>
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
        return <OwnerExecutiveSummary key="overview" userName={userData?.full_name || user?.email?.split('@')[0] || 'José'} />;

      case 'dashboard':
        return <Dashboard onBack={() => setCurrentView('overview')} />;

      case 'properties':
        return <Properties key="properties" onBack={() => setCurrentView('overview')} />;

      case 'bookings':
        return <Bookings key="bookings" onBack={() => setCurrentView('overview')} />;

      case 'calendar':
        return <PMSCalendar onBack={() => setCurrentView('overview')} />;

      case 'guests':
        return <Guests key="guests" onBack={() => setCurrentView('overview')} />;

      // Guest & Growth (External Agent)
      case 'crm':
        return <Guests key="crm" onBack={() => setCurrentView('overview')} />;

      case 'segmentation':
        return <GuestSegmentation key="segmentation" onBack={() => setCurrentView('overview')} />;

      case 'my-website':
        return <CreateMyWebsite key="my-website" onBack={() => setCurrentView('overview')} />;

      case 'payments':
        return <Payments onBack={() => setCurrentView('overview')} />;

      case 'smartPricing':
        return <SmartPricing onBack={() => setCurrentView('overview')} />;

      case 'reports':
        return <Reports onBack={() => setCurrentView('overview')} />;

      case 'channelIntegration':
        return <Multichannel onBack={() => setCurrentView('overview')} />;

      // PMS Core (Internal Agent)
      case 'ai-assistant':
        return <AIAssistant onBack={() => setCurrentView('overview')} />;

      case 'ai-operator-demo':
        return <AIOperatorDemo onBack={() => setCurrentView('overview')} />;

      case 'agents-monitor':
        return <AIAgentsMonitor onBack={() => setCurrentView('overview')} />;

      case 'my-site':
        return <MySite key="my-site" onBack={() => setCurrentView('overview')} />;

      // Guest Management (External Agent)
      case 'booking-engine':
        return <BookingEngine onBack={() => setCurrentView('overview')} />;

      case 'digital-checkin':
        return <DigitalCheckIn onBack={() => setCurrentView('overview')} />;

      // Marketing & Growth
      case 'marketing-overview':
        return <MarketingOverview key="marketing-overview" onBack={() => setCurrentView('overview')} />;

      case 'meta-ads':
        return <MetaAds key="meta-ads" onBack={() => setCurrentView('overview')} />;

      case 'content-planner':
        return <ContentPlanner key="content-planner" onBack={() => setCurrentView('overview')} />;

      case 'creative-studio':
        return (
          <div className="flex-1 bg-[#2a2f3a] p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Creative Studio (Coming Soon)</h2>
            <p className="text-white/80">AI-powered content creation coming soon...</p>
          </div>
        );

      case 'reviews':
        return <ReviewsManagement key="reviews" onBack={() => setCurrentView('overview')} />;

      case 'insights':
        return (
          <div className="flex-1 bg-[#2a2f3a] p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Marketing Insights (Coming Soon)</h2>
            <p className="text-white/80">Marketing analytics and insights coming soon...</p>
          </div>
        );

      // Guest & Growth (External Agent) - Legacy routes
      case 'campaigns':
        return <Marketing onBack={() => setCurrentView('overview')} />;

      case 'analytics':
        return <GuestAnalytics key="analytics" onBack={() => setCurrentView('overview')} />;

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
          <div className="flex-1 bg-[#2a2f3a] p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
            <p className="text-white/80">Settings page coming soon...</p>
          </div>
        );

      default:
        return <OwnerExecutiveSummary key="overview-default" userName={userData?.full_name || user?.email?.split('@')[0] || 'José'} />;
    }
  };

  // Main App Layout with Sidebar
  return (
    <div className="flex h-screen overflow-hidden bg-[#2a2f3a]">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header with Hamburger */}
        <div className="lg:hidden bg-[#1f2937] border-b border-[#d85a2a]/20 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-[#2a2f3a]"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#FF8C42]">MY HOST</h1>
            <span className="text-sm text-white/80">BizMate</span>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Content Area */}
        {renderContent()}
      </div>

      {/* Voice Assistant - Botón flotante siempre visible */}
      <VoiceAssistant />
    </div>
  );
}

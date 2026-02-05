import React, { useState } from 'react';
import { Building2, ChevronLeft, LayoutDashboard, Calendar, Home, CreditCard, MessageSquare, Sparkles, DollarSign, Megaphone, Share2, Workflow, BarChart3, Smartphone, Repeat, Star, Phone, Globe, ClipboardList, User, LogOut, Wifi, Shield, Zap, Bell, Search, CalendarDays, Settings, ArrowLeftRight, Rocket, Users, Menu, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import ModuleGridCard from './components/common/ModuleGridCard';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/Auth/LoginPage';

// Import Layout components
import Sidebar from './components/Layout/Sidebar';
import OwnerExecutiveSummary from './components/Dashboard/OwnerExecutiveSummary';
import AiAgentsWidget from './components/Layout/AiAgentsWidget';
import AgentCenterDrawer from './components/Layout/AgentCenterDrawer';

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
import AISystems from './components/AISystems/AISystems';
import GuestSegmentation from './components/GuestSegmentation/GuestSegmentation';
import MetaAds from './components/MetaAds/MetaAds';
import GuestAnalytics from './components/GuestAnalytics/GuestAnalytics';
import AIOperatorDemo from './components/ai-operator/AIOperatorDemo';
import MarketingOverview from './components/Marketing/MarketingOverview';
import ContentPlanner from './components/Marketing/ContentPlanner';
import WebsiteAds from './components/Marketing/WebsiteAds';
import ReviewsManagement from './components/Reviews/ReviewsManagement';
import CreateMyWebsite from './components/MySite/CreateMyWebsite';
import GuestCommunications from './components/GuestCommunications/GuestCommunications';
import LeadsInbox from './components/SalesLeads/LeadsInbox';
import LeadsPipeline from './components/SalesLeads/LeadsPipeline';
import AISalesAssistant from './components/SalesLeads/AISalesAssistant';
import LeadsFollowups from './components/SalesLeads/LeadsFollowups';
import LeadsConversations from './components/SalesLeads/LeadsConversations';
import LeadsTemplates from './components/SalesLeads/LeadsTemplates';
import CompetitorsSnapshot from './components/MarketIntelligence/CompetitorsSnapshot';
import BaliMarketTrends from './components/MarketIntelligence/BaliMarketTrends';
import IntelligenceAlerts from './components/MarketIntelligence/IntelligenceAlerts';
import AIRecommendations from './components/MarketIntelligence/AIRecommendations';
import KoraCallsInbox from './components/VoiceAI/KoraCallsInbox';
import KoraCallLogs from './components/VoiceAI/KoraCallLogs';
import KoraScripts from './components/VoiceAI/KoraScripts';
import KoraSettings from './components/VoiceAI/KoraSettings';
import KoraAnalytics from './components/VoiceAI/KoraAnalytics';
import BanyuGuestJourney from './components/BANYU/BanyuGuestJourney';
import BanyuTemplates from './components/BANYU/BanyuTemplates';
import BanyuLogs from './components/BANYU/BanyuLogs';
import ManualDataEntry from './components/ManualDataEntry/ManualDataEntry';
import Autopilot from './components/Autopilot/Autopilot';

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
  const [isAgentCenterOpen, setIsAgentCenterOpen] = useState(false); // Agent Center drawer state

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
        return <OwnerExecutiveSummary key="overview" userName={userData?.full_name || user?.email?.split('@')[0] || 'José'} onNavigate={setCurrentView} />;

      case 'dashboard':
        return <Dashboard onBack={() => setCurrentView('overview')} />;

      case 'properties':
        return <Properties key="properties" onBack={() => setCurrentView('overview')} />;

      case 'bookings':
        return <Bookings key="bookings" onBack={() => setCurrentView('overview')} />;

      case 'messages':
        return <Messages key="messages" onBack={() => setCurrentView('overview')} />;

      case 'calendar':
        return <PMSCalendar onBack={() => setCurrentView('overview')} />;

      case 'guests':
        return <Guests key="guests" onBack={() => setCurrentView('overview')} />;

      // OPERATIONS & GUESTS - New options
      case 'checkin-checkout':
        return (
          <div className="flex-1 h-screen bg-[#2a2f3a] p-4 relative overflow-auto">
            {/* Header */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl border border-white/10">
              <h2 className="text-2xl font-bold text-white">Check-in / Check-out Management</h2>
              <p className="text-sm text-orange-400">Today's arrivals and departures</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-white/60 text-sm mb-1">Today's Check-ins</div>
                <div className="text-3xl font-bold text-white">8</div>
                <div className="text-green-400 text-xs mt-1">6 completed</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-white/60 text-sm mb-1">Today's Check-outs</div>
                <div className="text-3xl font-bold text-white">5</div>
                <div className="text-blue-400 text-xs mt-1">3 completed</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-white/60 text-sm mb-1">Pending Actions</div>
                <div className="text-3xl font-bold text-white">4</div>
                <div className="text-orange-400 text-xs mt-1">Requires attention</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-white/60 text-sm mb-1">Late Arrivals</div>
                <div className="text-3xl font-bold text-white">2</div>
                <div className="text-red-400 text-xs mt-1">Follow-up needed</div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Today's Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b border-white/10">
                  <div className="w-16 text-white/60 text-sm">2:00 PM</div>
                  <div className="flex-1">
                    <div className="text-white font-medium">Check-in - Villa Sunset</div>
                    <div className="text-white/60 text-sm">Guest: Sarah Johnson • 3 nights</div>
                    <div className="mt-2">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Completed</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 pb-4 border-b border-white/10">
                  <div className="w-16 text-white/60 text-sm">3:30 PM</div>
                  <div className="flex-1">
                    <div className="text-white font-medium">Check-in - Villa Ocean</div>
                    <div className="text-white/60 text-sm">Guest: Michael Chen • 5 nights</div>
                    <div className="mt-2">
                      <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">Pending</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 pb-4 border-b border-white/10">
                  <div className="w-16 text-white/60 text-sm">11:00 AM</div>
                  <div className="flex-1">
                    <div className="text-white font-medium">Check-out - Villa Paradise</div>
                    <div className="text-white/60 text-sm">Guest: Emma Rodriguez • Departure</div>
                    <div className="mt-2">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Completed</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-16 text-white/60 text-sm">4:00 PM</div>
                  <div className="flex-1">
                    <div className="text-white font-medium">Check-in - Villa Bamboo</div>
                    <div className="text-white/60 text-sm">Guest: David Park • 7 nights</div>
                    <div className="mt-2">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">Scheduled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'daily-operations':
        return (
          <div className="flex-1 h-screen bg-[#2a2f3a] p-4 relative overflow-auto">
            {/* Header */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Daily Operations</h2>
                  <p className="text-sm text-orange-400">Track and manage daily tasks</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] text-white rounded-lg hover:shadow-lg transition-all">
                  + New Task
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10 flex gap-4 flex-wrap">
              <button className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg text-sm font-medium">
                All Tasks
              </button>
              <button className="px-4 py-2 bg-white/5 text-white/60 rounded-lg text-sm font-medium hover:bg-white/10">
                Housekeeping
              </button>
              <button className="px-4 py-2 bg-white/5 text-white/60 rounded-lg text-sm font-medium hover:bg-white/10">
                Maintenance
              </button>
              <button className="px-4 py-2 bg-white/5 text-white/60 rounded-lg text-sm font-medium hover:bg-white/10">
                Inventory
              </button>
              <button className="px-4 py-2 bg-white/5 text-white/60 rounded-lg text-sm font-medium hover:bg-white/10">
                Guest Services
              </button>
            </div>

            {/* Tasks List */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="space-y-3">
                {/* Task Item 1 */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-orange-400/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">Housekeeping - Villa Sunset</div>
                        <div className="text-white/60 text-sm">Room 101 • Deep cleaning completed</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Completed</span>
                      <span className="text-white/60 text-sm">9:30 AM</span>
                    </div>
                  </div>
                </div>

                {/* Task Item 2 */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-orange-400/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">Pool Maintenance - Main Pool</div>
                        <div className="text-white/60 text-sm">Weekly cleaning and chemical balance</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">In Progress</span>
                      <span className="text-white/60 text-sm">10:00 AM</span>
                    </div>
                  </div>
                </div>

                {/* Task Item 3 */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-orange-400/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">Inventory Check - Minibar Supplies</div>
                        <div className="text-white/60 text-sm">Villa Ocean, Bamboo, Paradise</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">Pending</span>
                      <span className="text-white/60 text-sm">11:00 AM</span>
                    </div>
                  </div>
                </div>

                {/* Task Item 4 */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-orange-400/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">Guest Welcome - New Arrivals</div>
                        <div className="text-white/60 text-sm">Prepare welcome packages for 3 guests</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">Scheduled</span>
                      <span className="text-white/60 text-sm">2:00 PM</span>
                    </div>
                  </div>
                </div>

                {/* Task Item 5 */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-orange-400/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">AC Repair - Villa Bamboo</div>
                        <div className="text-white/60 text-sm">Unit not cooling properly - Priority repair</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Urgent</span>
                      <span className="text-white/60 text-sm">ASAP</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'issues-tasks':
        return (
          <div className="flex-1 h-screen bg-[#2a2f3a] p-4 relative overflow-auto">
            {/* Header */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Issues & Tasks</h2>
                  <p className="text-sm text-orange-400">Track and resolve property issues</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] text-white rounded-lg hover:shadow-lg transition-all">
                  + New Issue
                </button>
              </div>
            </div>

            {/* Kanban Board - 3 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* TO DO Column */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    TO DO
                  </h3>
                  <span className="text-sm text-white/60">4 issues</span>
                </div>
                <div className="space-y-3">
                  {/* Issue Card 1 */}
                  <div className="bg-white/10 rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-all cursor-grab">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 font-medium">High Priority</span>
                      <Settings className="w-4 h-4 text-white/60" />
                    </div>
                    <h4 className="text-white font-medium mb-1">AC Unit Not Working</h4>
                    <p className="text-xs text-white/60 mb-2">Villa Sunset - Room 3</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-orange-400">Maintenance</span>
                      <span className="text-white/60">Due: Today</span>
                    </div>
                  </div>

                  {/* Issue Card 2 */}
                  <div className="bg-white/10 rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-all cursor-grab">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-400 font-medium">Medium</span>
                      <Bell className="w-4 h-4 text-white/60" />
                    </div>
                    <h4 className="text-white font-medium mb-1">Pool Cleaning Needed</h4>
                    <p className="text-xs text-white/60 mb-2">Villa Ocean Breeze</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-blue-400">Housekeeping</span>
                      <span className="text-white/60">Due: Tomorrow</span>
                    </div>
                  </div>

                  {/* Issue Card 3 */}
                  <div className="bg-white/10 rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-all cursor-grab">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 font-medium">High Priority</span>
                      <User className="w-4 h-4 text-white/60" />
                    </div>
                    <h4 className="text-white font-medium mb-1">Guest Complaint - Noise</h4>
                    <p className="text-xs text-white/60 mb-2">Villa Tropical - Guest 1245</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-purple-400">Guest Issue</span>
                      <span className="text-white/60">Urgent</span>
                    </div>
                  </div>

                  {/* Issue Card 4 */}
                  <div className="bg-white/10 rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-all cursor-grab">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs px-2 py-1 rounded bg-gray-500/20 text-gray-400 font-medium">Low</span>
                      <Zap className="w-4 h-4 text-white/60" />
                    </div>
                    <h4 className="text-white font-medium mb-1">Replace Light Bulbs</h4>
                    <p className="text-xs text-white/60 mb-2">Villa Jungle - Living Room</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-orange-400">Maintenance</span>
                      <span className="text-white/60">Due: Jan 20</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* IN PROGRESS Column */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    IN PROGRESS
                  </h3>
                  <span className="text-sm text-white/60">2 issues</span>
                </div>
                <div className="space-y-3">
                  {/* Issue Card 1 */}
                  <div className="bg-white/10 rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-all cursor-grab">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-400 font-medium">Medium</span>
                      <Wifi className="w-4 h-4 text-white/60" />
                    </div>
                    <h4 className="text-white font-medium mb-1">WiFi Router Replacement</h4>
                    <p className="text-xs text-white/60 mb-2">Villa Sunset - Main Building</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-orange-400">Maintenance</span>
                      <span className="text-green-400">In progress...</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
                      <User className="w-3 h-3" />
                      <span>Assigned to: Tech Team</span>
                    </div>
                  </div>

                  {/* Issue Card 2 */}
                  <div className="bg-white/10 rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-all cursor-grab">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 font-medium">High Priority</span>
                      <Shield className="w-4 h-4 text-white/60" />
                    </div>
                    <h4 className="text-white font-medium mb-1">Security Camera Issue</h4>
                    <p className="text-xs text-white/60 mb-2">Villa Ocean - Front Gate</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-red-400">Security</span>
                      <span className="text-green-400">Technician on-site</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
                      <User className="w-3 h-3" />
                      <span>Assigned to: Security</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* DONE Column */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    DONE
                  </h3>
                  <span className="text-sm text-white/60">3 issues</span>
                </div>
                <div className="space-y-3">
                  {/* Issue Card 1 */}
                  <div className="bg-white/10 rounded-lg p-3 border border-green-500/20 hover:bg-white/15 transition-all cursor-grab opacity-80">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 font-medium">✓ Completed</span>
                      <Bell className="w-4 h-4 text-white/60" />
                    </div>
                    <h4 className="text-white font-medium mb-1">Deep Clean Before Check-in</h4>
                    <p className="text-xs text-white/60 mb-2">Villa Tropical - All Areas</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-blue-400">Housekeeping</span>
                      <span className="text-white/60">Today 10:30 AM</span>
                    </div>
                  </div>

                  {/* Issue Card 2 */}
                  <div className="bg-white/10 rounded-lg p-3 border border-green-500/20 hover:bg-white/15 transition-all cursor-grab opacity-80">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 font-medium">✓ Completed</span>
                      <Settings className="w-4 h-4 text-white/60" />
                    </div>
                    <h4 className="text-white font-medium mb-1">Fix Leaking Faucet</h4>
                    <p className="text-xs text-white/60 mb-2">Villa Jungle - Bathroom 2</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-orange-400">Maintenance</span>
                      <span className="text-white/60">Today 9:15 AM</span>
                    </div>
                  </div>

                  {/* Issue Card 3 */}
                  <div className="bg-white/10 rounded-lg p-3 border border-green-500/20 hover:bg-white/15 transition-all cursor-grab opacity-80">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 font-medium">✓ Completed</span>
                      <User className="w-4 h-4 text-white/60" />
                    </div>
                    <h4 className="text-white font-medium mb-1">Guest Request - Extra Towels</h4>
                    <p className="text-xs text-white/60 mb-2">Villa Ocean - Room 1</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-purple-400">Guest Service</span>
                      <span className="text-white/60">Yesterday 8:45 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // Guest & Growth (External Agent)
      case 'crm':
        return <Guests key="crm" onBack={() => setCurrentView('overview')} />;

      case 'guest-communications':
        return <GuestCommunications key="guest-communications" onBack={() => setCurrentView('overview')} />;

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

      // Sales & Leads
      case 'leads-inbox':
        return <LeadsInbox key="leads-inbox" onBack={() => setCurrentView('overview')} />;

      case 'leads-pipeline':
        return <LeadsPipeline key="leads-pipeline" onBack={() => setCurrentView('overview')} />;

      case 'leads-ai-assistant':
        return <AISalesAssistant key="leads-ai-assistant" onBack={() => setCurrentView('overview')} />;

      case 'leads-followups':
        return <LeadsFollowups key="leads-followups" onBack={() => setCurrentView('overview')} />;

      case 'leads-conversations':
        return <LeadsConversations key="leads-conversations" onBack={() => setCurrentView('overview')} />;

      case 'leads-templates':
        return <LeadsTemplates key="leads-templates" onBack={() => setCurrentView('overview')} />;

      // Market Intelligence
      case 'competitors-snapshot':
        return <CompetitorsSnapshot key="competitors-snapshot" onBack={() => setCurrentView('overview')} />;

      case 'bali-market-trends':
        return <BaliMarketTrends key="bali-market-trends" onBack={() => setCurrentView('overview')} />;

      case 'intelligence-alerts':
        return <IntelligenceAlerts key="intelligence-alerts" onBack={() => setCurrentView('overview')} />;

      case 'ai-recommendations':
        return <AIRecommendations key="ai-recommendations" onBack={() => setCurrentView('overview')} />;

      // BANYU.AI (WhatsApp Hub)
      case 'banyu-inbox':
        return <GuestCommunications key="banyu-inbox" onBack={() => setCurrentView('overview')} />;

      case 'banyu-guest-journey':
        return <BanyuGuestJourney key="banyu-guest-journey" onBack={() => setCurrentView('overview')} />;

      case 'banyu-templates':
        return <BanyuTemplates key="banyu-templates" onBack={() => setCurrentView('overview')} />;

      case 'banyu-logs':
        return <BanyuLogs key="banyu-logs" onBack={() => setCurrentView('overview')} />;

      // KORA.AI (Voice Concierge)
      case 'kora-calls-inbox':
        return <KoraCallsInbox key="kora-calls-inbox" onBack={() => setCurrentView('overview')} />;

      case 'kora-call-logs':
        return <KoraCallLogs key="kora-call-logs" onBack={() => setCurrentView('overview')} />;

      case 'kora-scripts':
        return <KoraScripts key="kora-scripts" onBack={() => setCurrentView('overview')} />;

      // CUSTOMER COMMUNICATIONS - Instagram / Social DM (placeholders)
      case 'social-inbox':
        return (
          <div className="flex-1 h-screen bg-[#2a2f3a] p-4 relative overflow-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl border border-white/10">
              <h2 className="text-2xl font-bold text-white">Social DM Inbox (Coming Soon)</h2>
              <p className="text-sm text-orange-400">Instagram & Social Media DMs</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <p className="text-white/80">Unified social media inbox coming soon...</p>
            </div>
          </div>
        );

      case 'social-templates':
        return (
          <div className="flex-1 h-screen bg-[#2a2f3a] p-4 relative overflow-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl border border-white/10">
              <h2 className="text-2xl font-bold text-white">Social DM Templates (Coming Soon)</h2>
              <p className="text-sm text-orange-400">Message templates for social media</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <p className="text-white/80">Social media message templates coming soon...</p>
            </div>
          </div>
        );

      // CUSTOMER COMMUNICATIONS - Web / Chat / Email (placeholders)
      case 'web-inbox':
        return (
          <div className="flex-1 h-screen bg-[#2a2f3a] p-4 relative overflow-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl border border-white/10">
              <h2 className="text-2xl font-bold text-white">Web/Email Inbox (Coming Soon)</h2>
              <p className="text-sm text-orange-400">Chat and email management</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <p className="text-white/80">Web chat and email inbox coming soon...</p>
            </div>
          </div>
        );

      case 'web-automations':
        return (
          <div className="flex-1 h-screen bg-[#2a2f3a] p-4 relative overflow-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl border border-white/10">
              <h2 className="text-2xl font-bold text-white">Web Automations (Coming Soon)</h2>
              <p className="text-sm text-orange-400">Automated web and email flows</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <p className="text-white/80">Email and chat automation workflows coming soon...</p>
            </div>
          </div>
        );

      case 'web-logs':
        return (
          <div className="flex-1 h-screen bg-[#2a2f3a] p-4 relative overflow-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl border border-white/10">
              <h2 className="text-2xl font-bold text-white">Web/Email Logs (Coming Soon)</h2>
              <p className="text-sm text-orange-400">Activity logs and history</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <p className="text-white/80">Web and email communication logs coming soon...</p>
            </div>
          </div>
        );

      // BIZMATE AI (Global chat with all agents)
      case 'bizmate-ai':
        return <AISystems onBack={() => setCurrentView('overview')} />;

      // OSIRIS.AI (Operations & Control)
      case 'ai-monitor':
        return <AIAgentsMonitor onBack={() => setCurrentView('overview')} />;

      case 'osiris-alerts':
        return (
          <div className="flex-1 h-screen bg-[#2a2f3a] p-4 relative overflow-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl border border-white/10">
              <h2 className="text-2xl font-bold text-white">Alerts / Exceptions (Coming Soon)</h2>
              <p className="text-sm text-orange-400">Powered by OSIRIS.AI</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <p className="text-white/80">System alerts and exception monitoring coming soon...</p>
            </div>
          </div>
        );

      case 'workflows':
        return <Workflows onBack={() => setCurrentView('overview')} onNavigate={setCurrentView} />;

      case 'osiris-audit-log':
        return (
          <div className="flex-1 h-screen bg-[#2a2f3a] p-4 relative overflow-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl border border-white/10">
              <h2 className="text-2xl font-bold text-white">Logs / Audit (Coming Soon)</h2>
              <p className="text-sm text-orange-400">Powered by OSIRIS.AI</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <p className="text-white/80">Complete audit log and system logs coming soon...</p>
            </div>
          </div>
        );

      // Legacy routes
      case 'ai-assistant':
        return <AIAssistant onBack={() => setCurrentView('overview')} />;

      case 'ai-operator-demo':
        return <AIOperatorDemo onBack={() => setCurrentView('overview')} />;

      case 'my-site':
        return <MySite key="my-site" onBack={() => setCurrentView('overview')} />;

      // Guest Management (External Agent)
      case 'booking-engine':
        return <BookingEngine onBack={() => setCurrentView('overview')} />;

      case 'digital-checkin':
        return <DigitalCheckIn onBack={() => setCurrentView('overview')} />;

      // Marketing & Growth
      case 'marketing-overview':
        return <MarketingOverview key="marketing-overview" onBack={() => setCurrentView('overview')} onNavigate={setCurrentView} />;

      case 'website-ads':
        return <WebsiteAds key="website-ads" onBack={() => setCurrentView('overview')} />;

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

      // AUTOPILOT MODULE
      case 'manual-entry':
        return <ManualDataEntry key="manual-entry" onBack={() => setCurrentView('overview')} />;

      case 'autopilot':
        return <Autopilot key="autopilot" onBack={() => setCurrentView('overview')} />;

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

      {/* Voice Assistant - Solo visible en Overview */}
      {currentView === 'overview' && <VoiceAssistant />}

      {/* AI Agents Widget (top-right) - Solo visible en Overview */}
      {currentView === 'overview' && (
        <AiAgentsWidget onOpenAgentCenter={() => setIsAgentCenterOpen(true)} />
      )}

      {/* Agent Center Drawer */}
      <AgentCenterDrawer
        isOpen={isAgentCenterOpen}
        onClose={() => setIsAgentCenterOpen(false)}
      />
    </div>
  );
}

import React, { useState } from 'react';
import {
  Home,
  LayoutDashboard,
  Building2,
  Calendar,
  Users,
  CreditCard,
  DollarSign,
  BarChart3,
  Repeat,
  Sparkles,
  Settings,
  ChevronDown,
  ChevronRight,
  Workflow,
  Bot,
  Activity,
  Globe,
  CheckCircle,
  Star,
  Megaphone,
  Monitor,
  LogOut,
  Target,
  TrendingUp,
  CalendarCheck,
  Palette,
  PieChart,
  MessageSquare,
  Inbox,
  Clock,
  FileText,
  Brain,
  Bell,
  Lightbulb,
  Phone,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ currentView, onNavigate, isOpen, onClose }) => {
  const { signOut } = useAuth();
  const [expandedSections, setExpandedSections] = useState({
    'overview': true,
    'operations': false,
    'revenue': false,
    'lumina-ai': false,
    'kora-ai': false,
    'market-intelligence': false,
    'marketing-growth': false,
    'osiris-ai': false,
    'banyu-ai': false,
    'settings': false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleNavigate = (id) => {
    onNavigate(id);
    // Close sidebar on mobile after navigation
    if (onClose) {
      onClose();
    }
  };

  const menuItems = [
    {
      sectionId: 'overview',
      sectionLabel: 'OVERVIEW',
      sectionIcon: Home,
      collapsible: false,
      isDirectLink: true,
      items: []
    },
    {
      sectionId: 'operations',
      sectionLabel: 'OPERATIONS & GUESTS',
      sectionIcon: LayoutDashboard,
      collapsible: true,
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'properties', label: 'Properties', icon: Building2 },
        { id: 'bookings', label: 'Bookings', icon: Calendar },
        { id: 'calendar', label: 'Calendar', icon: Calendar },
        { id: 'guests', label: 'Guests', icon: Users }
      ]
    },
    {
      sectionId: 'osiris-ai',
      sectionLabel: '👁️ OSIRIS.AI (Operations & Control)',
      sectionIcon: Bot,
      collapsible: true,
      items: [
        { id: 'osiris-ai-assistant', label: 'AI Assistant', icon: Sparkles },
        { id: 'agents-monitor', label: 'AI Agents Monitor', icon: Activity },
        { id: 'osiris-alerts', label: 'Alerts / Exceptions', icon: Bell },
        { id: 'workflows', label: 'Workflows & Automations', icon: Workflow },
        { id: 'osiris-audit-log', label: 'Logs / Audit', icon: FileText }
      ]
    },
    {
      sectionId: 'banyu-ai',
      sectionLabel: '💧 BANYU.AI (WhatsApp Hub)',
      sectionIcon: MessageSquare,
      collapsible: true,
      items: [
        { id: 'banyu-inbox', label: 'Live Inbox', icon: Inbox },
        { id: 'banyu-guest-journey', label: 'Guest Journey', icon: CalendarCheck },
        { id: 'banyu-templates', label: 'Templates', icon: FileText },
        { id: 'banyu-logs', label: 'Logs', icon: Activity }
      ]
    },
    {
      sectionId: 'kora-ai',
      sectionLabel: '📞 KORA.AI (Voice Concierge)',
      sectionIcon: PhoneCall,
      collapsible: true,
      items: [
        { id: 'kora-calls-inbox', label: 'Calls Inbox', icon: Inbox },
        { id: 'kora-call-logs', label: 'Call Logs', icon: Phone },
        { id: 'kora-scripts', label: 'Scripts', icon: FileText }
      ]
    },
    {
      sectionId: 'lumina-ai',
      sectionLabel: '🌟 LUMINA.AI (Sales & Leads)',
      sectionIcon: Target,
      collapsible: true,
      items: [
        { id: 'leads-inbox', label: 'Inbox (New Leads)', icon: Inbox },
        { id: 'leads-pipeline', label: 'Pipeline', icon: TrendingUp },
        { id: 'leads-ai-assistant', label: 'AI Sales Assistant', icon: Sparkles },
        { id: 'leads-followups', label: 'Follow-ups', icon: Clock },
        { id: 'leads-conversations', label: 'Conversations', icon: MessageSquare },
        { id: 'leads-templates', label: 'Templates', icon: FileText }
      ]
    },
    {
      sectionId: 'revenue',
      sectionLabel: 'REVENUE & PRICING',
      sectionIcon: DollarSign,
      collapsible: true,
      items: [
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'smartPricing', label: 'Smart Pricing', icon: DollarSign },
        { id: 'reports', label: 'Reports', icon: BarChart3 },
        { id: 'channelIntegration', label: 'Channel Integration', icon: Repeat }
      ]
    },
    {
      sectionId: 'marketing-growth',
      sectionLabel: 'MARKETING & GROWTH',
      sectionIcon: Megaphone,
      collapsible: true,
      items: [
        { id: 'marketing-overview', label: 'Overview', icon: PieChart },
        { id: 'my-site', label: 'My Site (Website Builder)', icon: Globe },
        { id: 'meta-ads', label: 'Meta Ads', icon: TrendingUp },
        { id: 'content-planner', label: 'Content Planner', icon: CalendarCheck },
        { id: 'creative-studio', label: 'Creative Studio (Soon)', icon: Palette },
        { id: 'reviews', label: 'Reviews Management', icon: Star },
        { id: 'insights', label: 'Insights', icon: BarChart3 },
        { id: 'crm', label: 'Guest Database / CRM', icon: Users },
        { id: 'segmentation', label: 'Guest Segmentation', icon: Target },
        { id: 'booking-engine', label: 'Booking Engine Config', icon: Calendar },
        { id: 'digital-checkin', label: 'Digital Check-in Setup', icon: CheckCircle },
        { id: 'campaigns', label: 'Marketing Campaigns', icon: Megaphone },
        { id: 'analytics', label: 'Guest Analytics', icon: BarChart3 }
      ]
    },
    {
      sectionId: 'market-intelligence',
      sectionLabel: 'MARKET INTELLIGENCE',
      sectionIcon: Brain,
      collapsible: true,
      items: [
        { id: 'competitors-snapshot', label: 'Competitors Snapshot', icon: Target },
        { id: 'bali-market-trends', label: 'Bali Market Trends', icon: TrendingUp },
        { id: 'intelligence-alerts', label: 'Alerts', icon: Bell },
        { id: 'ai-recommendations', label: 'AI Recommendations', icon: Lightbulb }
      ]
    },
    {
      sectionId: 'settings',
      sectionLabel: 'SETTINGS',
      sectionIcon: Settings,
      collapsible: false,
      isDirectLink: true,
      items: []
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-[#2a2f3a] h-screen flex flex-col border-r border-white/10
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#d85a2a] to-[#f5a524] p-6">
          <h1 className="text-white text-xl font-bold">MY HOST</h1>
          <p className="text-white text-sm font-medium">BizMate</p>
        </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        {menuItems.map((section) => {
          const SectionIcon = section.sectionIcon;
          const isExpanded = expandedSections[section.sectionId];

          return (
            <div key={section.sectionId} className="mb-2">
              {/* Section Header (Collapsible or Direct Link) */}
              {section.collapsible ? (
                <button
                  onClick={() => toggleSection(section.sectionId)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-white hover:bg-white/5 transition-colors uppercase tracking-wider"
                >
                  <SectionIcon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{section.sectionLabel}</span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              ) : section.isDirectLink ? (
                <button
                  onClick={() => handleNavigate(section.sectionId)}
                  className={`
                    w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors
                    ${currentView === section.sectionId
                      ? 'bg-[#d85a2a]/20 text-[#FF8C42]'
                      : 'text-white hover:bg-white/5'
                    }
                  `}
                >
                  <SectionIcon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{section.sectionLabel}</span>
                </button>
              ) : (
                <div className="px-3 py-2">
                  <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                    <SectionIcon className="w-4 h-4" />
                    {section.sectionLabel}
                  </h3>
                </div>
              )}

              {/* Menu Items */}
              {(!section.collapsible || isExpanded) && section.items.length > 0 && (
                <div className="space-y-1 mt-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigate(item.id)}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                          transition-colors ml-2
                          ${isActive
                            ? 'bg-[#d85a2a]/20 text-[#FF8C42] border-l-2 border-[#FF8C42]'
                            : 'text-white/90 hover:bg-white/5 hover:text-white'
                          }
                        `}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1 text-left">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Logout Button */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">Logout</span>
          </button>
        </div>
      </nav>
      </div>
    </>
  );
};

export default Sidebar;

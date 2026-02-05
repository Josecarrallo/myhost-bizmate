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
  PhoneCall,
  AlertCircle,
  Instagram,
  Mail,
  Zap,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ currentView, onNavigate, isOpen, onClose }) => {
  const { signOut } = useAuth();
  const [expandedSections, setExpandedSections] = useState({
    'overview': true,
    'operations': false,
    'sales-leads': false,
    'customer-communications': false,
    'marketing-growth': false,
    'bizmate-ai': false,
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
    // 1. OVERVIEW
    {
      sectionId: 'overview',
      sectionLabel: 'OVERVIEW',
      sectionIcon: Home,
      collapsible: false,
      isDirectLink: true,
      items: []
    },
    // 2. OPERATIONS
    {
      sectionId: 'operations',
      sectionLabel: 'OPERATIONS',
      sectionIcon: LayoutDashboard,
      collapsible: true,
      items: [
        // Autopilot sub-section
        { id: 'autopilot-header', label: 'Autopilot', isSubHeader: true, icon: Zap },
        { id: 'autopilot', label: 'Dashboard', icon: Zap, indent: true },

        // Guest & Properties sub-section
        { id: 'guest-properties-header', label: 'Guest & Properties', isSubHeader: true, icon: Building2 },
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, indent: true },
        { id: 'properties', label: 'Properties', icon: Building2, indent: true },
        { id: 'bookings', label: 'Bookings', icon: Calendar, indent: true },
        { id: 'calendar', label: 'Calendar', icon: Calendar, indent: true },
        { id: 'guests', label: 'Guests', icon: Users, indent: true },
        { id: 'checkin-checkout', label: 'Check-in / Check-out', icon: CheckCircle, indent: true },
        { id: 'daily-operations', label: 'Daily Operations', icon: Clock, indent: true },
        { id: 'issues-tasks', label: 'Issues & Tasks', icon: AlertCircle, indent: true },
        { id: 'messages', label: 'Messages', icon: MessageSquare, indent: true },

        // Revenue & Pricing sub-section (MOVED from main menu)
        { id: 'revenue-pricing-header', label: 'Revenue & Pricing', isSubHeader: true, icon: DollarSign },
        { id: 'payments', label: 'Payments', icon: CreditCard, indent: true },
        { id: 'smartPricing', label: 'Smart Pricing', icon: DollarSign, indent: true },
        { id: 'reports', label: 'Reports', icon: BarChart3, indent: true },
        { id: 'channelIntegration', label: 'Channel Integration', icon: Repeat, indent: true }
      ]
    },
    // 3. SALES AND LEADS
    {
      sectionId: 'sales-leads',
      sectionLabel: 'SALES AND LEADS',
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
    // 4. CUSTOMER COMMUNICATIONS
    {
      sectionId: 'customer-communications',
      sectionLabel: 'CUSTOMER COMMUNICATIONS',
      sectionIcon: MessageSquare,
      collapsible: true,
      items: [
        { id: 'whatsapp-header', label: 'BANYU (WhatsApp Agent)', isSubHeader: true, icon: MessageSquare },
        { id: 'banyu-guest-journey', label: 'Guest Journey', icon: CalendarCheck, indent: true },
        { id: 'banyu-templates', label: 'Templates', icon: FileText, indent: true },
        { id: 'banyu-logs', label: 'Logs', icon: Activity, indent: true },

        { id: 'voice-header', label: 'KORA (Voice AI)', isSubHeader: true, icon: PhoneCall },
        { id: 'kora-calls-inbox', label: 'Calls Inbox', icon: Inbox, indent: true },
        { id: 'kora-call-logs', label: 'Call Logs', icon: Phone, indent: true },
        { id: 'kora-scripts', label: 'Scripts', icon: FileText, indent: true },
        { id: 'kora-analytics', label: 'Analytics', icon: BarChart3, indent: true },
        { id: 'kora-settings', label: 'Settings', icon: Settings, indent: true }
      ]
    },
    // 5. MARKETING & GROWTH
    {
      sectionId: 'marketing-growth',
      sectionLabel: 'MARKETING & GROWTH',
      sectionIcon: Megaphone,
      collapsible: true,
      items: [
        // Marketing Campaigns sub-section
        { id: 'marketing-campaigns-header', label: 'Marketing Campaigns', isSubHeader: true, icon: Megaphone },
        { id: 'marketing-overview', label: 'Overview', icon: PieChart, indent: true },
        { id: 'content-planner', label: 'Content Planner', icon: CalendarCheck, indent: true },
        { id: 'social-publisher', label: 'Social Publisher', icon: Instagram, indent: true },
        { id: 'meta-ads', label: 'Meta Ads', icon: Target, indent: true },
        { id: 'website-ads', label: 'Website Ads', icon: TrendingUp, indent: true },

        // Market Intelligence sub-section (MOVED from main menu)
        { id: 'market-intelligence-header', label: 'Market Intelligence', isSubHeader: true, icon: Brain },
        { id: 'competitors-snapshot', label: 'Competitors Snapshot', icon: Target, indent: true },
        { id: 'bali-market-trends', label: 'Bali Market Trends', icon: TrendingUp, indent: true },
        { id: 'intelligence-alerts', label: 'Alerts', icon: Bell, indent: true },
        { id: 'ai-recommendations', label: 'AI Recommendations', icon: Lightbulb, indent: true },

        // Guest Analytics sub-section
        { id: 'guest-analytics-header', label: 'Guest Analytics', isSubHeader: true, icon: Users },
        { id: 'segmentation', label: 'Guest Segmentation', icon: Target, indent: true },
        { id: 'guest-analytics', label: 'Guest Analytics', icon: BarChart3, indent: true }
      ]
    },
    // 6. BIZMATE AI
    {
      sectionId: 'bizmate-ai',
      sectionLabel: 'BIZMATE AI',
      sectionIcon: Sparkles,
      collapsible: false,
      isDirectLink: true,
      items: []
    },
    // 7. SETTINGS
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
          w-80 bg-[#2a2f3a] h-screen flex flex-col border-r border-white/10
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#d85a2a] to-[#f5a524] p-6">
          <h1 className="text-white text-2xl font-bold">MY HOST</h1>
          <p className="text-white text-base font-medium">BizMate</p>
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
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold text-white hover:bg-white/5 transition-colors uppercase tracking-wider"
                >
                  <SectionIcon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">{section.sectionLabel}</span>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </button>
              ) : section.isDirectLink ? (
                <button
                  onClick={() => handleNavigate(section.sectionId)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors
                    ${currentView === section.sectionId
                      ? 'bg-[#d85a2a]/20 text-[#FF8C42]'
                      : 'text-white hover:bg-white/5'
                    }
                  `}
                >
                  <SectionIcon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">{section.sectionLabel}</span>
                </button>
              ) : (
                <div className="px-4 py-2.5">
                  <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider flex items-center gap-3">
                    <SectionIcon className="w-5 h-5" />
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

                    // Render sub-header
                    if (item.isSubHeader) {
                      return (
                        <div
                          key={item.id}
                          className="px-4 py-2 mt-3 first:mt-1"
                        >
                          <h4 className="text-sm font-bold text-white/70 uppercase tracking-wider flex items-center gap-2">
                            <Icon className="w-5 h-5" />
                            {item.label}
                          </h4>
                        </div>
                      );
                    }

                    // Render regular item
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigate(item.id)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium
                          transition-colors
                          ${item.indent ? 'ml-6' : 'ml-2'}
                          ${isActive
                            ? 'bg-[#d85a2a]/20 text-[#FF8C42] border-l-2 border-[#FF8C42]'
                            : 'text-white/90 hover:bg-white/5 hover:text-white'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
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
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1 text-left">Logout</span>
          </button>
        </div>
      </nav>
      </div>
    </>
  );
};

export default Sidebar;

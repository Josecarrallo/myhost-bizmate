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
  Bot
} from 'lucide-react';

const Sidebar = ({ currentView, onNavigate, isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({
    properties: false,
    smartPricing: false
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
      section: 'overview',
      items: [
        { id: 'overview', label: 'Overview', icon: Home }
      ]
    },
    {
      section: 'Operations & Guests',
      items: [
        { id: 'dashboard', label: 'Dashboard / Overview', icon: LayoutDashboard },
        {
          id: 'properties',
          label: 'Properties',
          icon: Building2
        },
        { id: 'bookings', label: 'Bookings', icon: Calendar },
        { id: 'calendar', label: 'Calendar', icon: Calendar },
        { id: 'guests', label: 'Guests', icon: Users }
      ]
    },
    {
      section: 'Revenue & Pricing',
      items: [
        { id: 'payments', label: 'Payments', icon: CreditCard },
        {
          id: 'smartPricing',
          label: 'Smart Pricing',
          icon: DollarSign
        },
        { id: 'reports', label: 'Reports', icon: BarChart3 },
        { id: 'channelIntegration', label: 'Channel Integration', icon: Repeat }
      ]
    },
    {
      section: 'AI Intelligence',
      items: [
        { id: 'aiAssistant', label: 'PMS Core', icon: Sparkles },
        { id: 'ai-receptionist', label: 'Guest Experience', icon: Bot },
        { id: 'workflows', label: 'Workflows & Automations', icon: Workflow }
      ]
    },
    {
      section: 'settings',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
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
          w-64 bg-white h-screen flex flex-col border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="bg-orange-500 p-6">
          <h1 className="text-white text-xl font-bold">MY HOST</h1>
          <p className="text-white text-sm font-medium">BizMate</p>
        </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        {menuItems.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            {/* Section Header */}
            {group.section !== 'overview' && group.section !== 'settings' && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                {group.section}
              </h3>
            )}

            {/* Menu Items */}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <div key={item.id}>
                    <button
                      onClick={() => {
                        if (item.expandable) {
                          toggleSection(item.id);
                        } else {
                          handleNavigate(item.id);
                        }
                      }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                        transition-colors
                        ${isActive
                          ? 'bg-orange-50 text-orange-600'
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.expandable && (
                        item.expanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )
                      )}
                    </button>

                    {/* Expanded subitems (placeholder for future) */}
                    {item.expandable && item.expanded && (
                      <div className="ml-11 mt-1 space-y-1">
                        {/* Future: Add subitems here */}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      </div>
    </>
  );
};

export default Sidebar;

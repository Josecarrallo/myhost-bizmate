import React, { useState } from 'react';
import {
  Home,
  Calendar,
  Users,
  Settings as SettingsIcon,
  Wrench,
  Briefcase,
  DollarSign,
  TrendingUp,
  BarChart3,
  Sparkles,
  CheckCircle,
  Link2,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const SidebarV2 = ({ currentView, onNavigate, isOpen, onClose, userData, collapsed, onToggleCollapse }) => {
  const { signOut } = useAuth();
  const [selectedProperty, setSelectedProperty] = useState('Izumi Hotel & Villas');

  const handleNavigate = (id) => {
    onNavigate(id);
    if (onClose) {
      onClose();
    }
  };

  // Main navigation items matching the V2 design
  const mainNavItems = [
    { id: 'ai-home', label: 'Home', icon: Home },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'guests', label: 'Guests', icon: Users },
    { id: 'operations', label: 'Operations', icon: Wrench },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'money', label: 'Money', icon: DollarSign },
    { id: 'commercial', label: 'Commercial', icon: TrendingUp },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
  ];

  // Secondary navigation items
  const secondaryNavItems = [
    { id: 'ai-team', label: 'AI Team', icon: Sparkles },
    { id: 'approvals', label: 'Approvals', icon: CheckCircle, badge: 2 },
    { id: 'connected-apps', label: 'Connected Apps', icon: Link2 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const NavButton = ({ item, isActive }) => {
    const Icon = item.icon;
    return (
      <button
        onClick={() => handleNavigate(item.id)}
        className={`
          w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
          transition-all duration-200
          ${isActive
            ? 'bg-gradient-to-r from-[#B98A3D]/20 to-[#D7B46A]/10 text-[#D7B46A] border border-[#B98A3D]/30'
            : 'text-white/70 hover:bg-white/5 hover:text-white'
          }
        `}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'text-[#D7B46A]' : 'text-white/50'}`} />
        <span className="flex-1 text-left">{item.label}</span>
        {item.badge && (
          <span className="px-2 py-0.5 bg-[#B98A3D] text-white text-xs font-bold rounded-full">
            {item.badge}
          </span>
        )}
      </button>
    );
  };

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
          inset-y-0 left-0 z-50
          w-60 bg-[#171816] h-screen flex flex-col
          transform transition-all duration-300 ease-in-out
          fixed
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${collapsed
            ? 'lg:-translate-x-full'
            : 'lg:translate-x-0 lg:static lg:flex-shrink-0'}
        `}
      >
        {/* Logo */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <img
              src="/images/bizmate-logo.png"
              alt="Bizmate"
              className="w-8 h-8 object-contain"
            />
            <div>
              <h1 className="text-white text-xl font-bold tracking-wide">MY HOST</h1>
              <p className="text-[#D7B46A] text-xs font-medium tracking-[0.2em]">BIZMATE</p>
            </div>
          </div>
        </div>

        {/* Property Selector */}
        <div className="px-4 pb-4">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#20211F] hover:bg-[#2a2b29] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#B98A3D] to-[#D7B46A] flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white text-sm font-medium">{selectedProperty}</p>
              <p className="text-white/50 text-xs">Bali, Indonesia</p>
            </div>
            <ChevronDown className="w-4 h-4 text-white/50" />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {mainNavItems.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              isActive={currentView === item.id || (item.id === 'ai-home' && currentView === 'overview')}
            />
          ))}

          {/* Divider */}
          <div className="my-4 border-t border-white/10" />

          {/* Secondary Navigation */}
          {secondaryNavItems.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              isActive={currentView === item.id}
            />
          ))}
        </nav>

        {/* Need Help Button */}
        <div className="px-4 pb-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#B98A3D]/10 to-[#D7B46A]/5 border border-[#B98A3D]/20 hover:border-[#B98A3D]/40 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B98A3D] to-[#D7B46A] flex items-center justify-center">
              <span className="text-white text-sm">?</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-white text-sm font-medium">Need help?</p>
              <p className="text-white/50 text-xs">Ask Bizmate anything</p>
            </div>
          </button>
        </div>

        {/* User & Logout */}
        <div className="px-4 pb-4 border-t border-white/10 pt-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[#20211F] flex items-center justify-center text-white text-sm font-medium">
              {userData?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{userData?.full_name || 'User'}</p>
              <p className="text-white/50 text-xs">Owner</p>
            </div>
            <button
              onClick={signOut}
              className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarV2;

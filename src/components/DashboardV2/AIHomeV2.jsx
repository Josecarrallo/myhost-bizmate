import React, { useState } from 'react';
import {
  Search,
  Mic,
  ArrowRight,
  Users,
  Wrench,
  Calendar,
  DollarSign,
  TrendingUp,
  Brain,
  Sun,
  MapPin,
  Clock,
  ChevronRight,
  FileText,
  Car,
  CheckCircle,
  Bell
} from 'lucide-react';

// Bizmate Orchestrator Map Component - Compact layout matching design
const BizmateOrchestrator = () => {
  const domains = [
    { id: 'guest', label: 'Guest Experience', agents: 'Banyu · Kora', status: 'Active', icon: Users },
    { id: 'operations', label: 'Operations', agents: 'Housekeeping · Maintenance', status: 'Active', icon: Wrench },
    { id: 'reservations', label: 'Reservations', agents: 'Bookings · Payments', status: 'Active', icon: Calendar },
    { id: 'revenue', label: 'Revenue', agents: 'Pricing · Demand', status: 'Active', icon: DollarSign },
    { id: 'commercial', label: 'Commercial', agents: 'Sales · Marketing', status: 'Working', icon: TrendingUp },
    { id: 'management', label: 'Management', agents: 'OSIRIS · Autopilot', status: 'Active', icon: Brain },
  ];

  return (
    <div className="flex items-center justify-center py-6">
      {/* Left column - 2 domains */}
      <div className="flex flex-col gap-4 mr-6">
        <DomainCard domain={domains[0]} />
        <DomainCard domain={domains[2]} />
        <DomainCard domain={domains[4]} />
      </div>

      {/* Center - Bizmate with connection lines */}
      <div className="relative mx-8">
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ width: '120px', height: '200px', left: '-10px', top: '-40px' }}>
          {/* Lines to left */}
          <line x1="60" y1="100" x2="0" y2="30" stroke="#D7B46A" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="60" y1="100" x2="0" y2="100" stroke="#D7B46A" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="60" y1="100" x2="0" y2="170" stroke="#D7B46A" strokeWidth="1" strokeOpacity="0.4" />
          {/* Lines to right */}
          <line x1="60" y1="100" x2="120" y2="30" stroke="#D7B46A" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="60" y1="100" x2="120" y2="100" stroke="#D7B46A" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="60" y1="100" x2="120" y2="170" stroke="#D7B46A" strokeWidth="1" strokeOpacity="0.4" />
        </svg>

        {/* Central Node */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F4E9D2] to-[#D7B46A] flex items-center justify-center shadow-lg shadow-[#B98A3D]/20 p-3">
            <img
              src="/images/bizmate-logo.png"
              alt="Bizmate"
              className="w-10 h-10 object-contain"
            />
          </div>
          <div className="mt-2 text-center">
            <p className="text-[#172033] font-bold text-xs">BIZMATE</p>
            <p className="text-[#667085] text-[10px]">AI ORCHESTRATOR</p>
          </div>
        </div>
      </div>

      {/* Right column - 2 domains */}
      <div className="flex flex-col gap-4 ml-6">
        <DomainCard domain={domains[1]} />
        <DomainCard domain={domains[3]} />
        <DomainCard domain={domains[5]} />
      </div>
    </div>
  );
};

const DomainCard = ({ domain }) => {
  const Icon = domain.icon;
  const isWorking = domain.status === 'Working';

  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-[#E7E3DA] min-w-[140px]">
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isWorking ? 'bg-amber-100' : 'bg-[#F4E9D2]'}`}>
          <Icon className={`w-3.5 h-3.5 ${isWorking ? 'text-amber-600' : 'text-[#B98A3D]'}`} />
        </div>
        <span className="text-xs font-semibold text-[#172033]">{domain.label}</span>
      </div>
      <p className="text-xs text-[#667085] mb-1">{domain.agents}</p>
      <div className="flex items-center gap-1">
        <div className={`w-1.5 h-1.5 rounded-full ${isWorking ? 'bg-amber-500' : 'bg-green-500'}`} />
        <span className={`text-xs ${isWorking ? 'text-amber-600' : 'text-green-600'}`}>{domain.status}</span>
      </div>
    </div>
  );
};

// Attention Card Component
const AttentionCard = ({ title, subtitle, category, categoryColor, onAction }) => (
  <div className="bg-white rounded-xl p-4 border border-[#E7E3DA] hover:border-[#D7B46A]/50 transition-colors">
    <div className="flex items-start justify-between mb-2">
      <div className="flex-1">
        <h4 className="text-[#172033] font-semibold text-sm">{title}</h4>
        <p className="text-[#667085] text-xs mt-0.5">{subtitle}</p>
      </div>
    </div>
    <div className="flex items-center justify-between mt-3">
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColor}`}>
        {category}
      </span>
      <button
        onClick={onAction}
        className="text-[#B98A3D] text-xs font-medium flex items-center gap-1 hover:text-[#8B6914] transition-colors"
      >
        Review <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  </div>
);

// Activity Item Component
const ActivityItem = ({ icon: Icon, title, category, time, iconBg }) => (
  <div className="flex items-center gap-3 py-2">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
      <Icon className="w-4 h-4 text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[#172033] text-sm font-medium truncate">{title}</p>
      <p className="text-[#667085] text-xs">{category}</p>
    </div>
    <span className="text-[#98A2B3] text-xs whitespace-nowrap">{time}</span>
  </div>
);

// Right Panel Component
const RightPanel = () => (
  <div className="w-72 bg-[#F7F5F0] border-l border-[#E7E3DA] p-5 overflow-y-auto">
    {/* Header with date/time and user */}
    <div className="flex items-center justify-between mb-6">
      <div className="text-right">
        <p className="text-[#172033] text-sm font-medium">Thu, 24 Jan 2026</p>
        <p className="text-[#667085] text-xs">11:58 AM</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B98A3D] to-[#D7B46A] flex items-center justify-center text-white font-medium">
        S
      </div>
    </div>

    {/* Property Info */}
    <div className="bg-white rounded-xl p-4 border border-[#E7E3DA] mb-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
          <MapPin className="w-6 h-6 text-[#B98A3D]" />
        </div>
        <div>
          <p className="text-[#172033] font-semibold text-sm">Izumi Hotel & Villas</p>
          <p className="text-[#667085] text-xs">Bali, Indonesia</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[#667085]">
        <Sun className="w-4 h-4" />
        <span className="text-sm">28°C</span>
        <span className="text-xs">Sunny</span>
      </div>
    </div>

    {/* Today at a glance */}
    <div className="mb-6">
      <h3 className="text-[#172033] font-semibold text-sm mb-4">Today at a glance</h3>
      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="Occupancy" value="82%" change="+6%" positive />
        <MetricCard label="Arrivals" value="18" />
        <MetricCard label="Departures" value="14" />
        <MetricCard label="Revenue" value="IDR 124M" change="+12%" positive />
      </div>
    </div>

    {/* Quick actions */}
    <div>
      <h3 className="text-[#172033] font-semibold text-sm mb-3">Quick actions</h3>
      <div className="space-y-2">
        <QuickAction label="Generate daily report" />
        <QuickAction label="Check all arrivals" />
        <QuickAction label="Review open tasks" />
        <QuickAction label="Show revenue forecast" />
      </div>
    </div>
  </div>
);

const MetricCard = ({ label, value, change, positive }) => (
  <div className="bg-white rounded-xl p-3 border border-[#E7E3DA]">
    <p className="text-[#667085] text-xs mb-1">{label}</p>
    <p className="text-[#172033] font-bold text-lg">{value}</p>
    {change && (
      <p className={`text-xs font-medium ${positive ? 'text-green-600' : 'text-red-500'}`}>
        {change}
      </p>
    )}
  </div>
);

const QuickAction = ({ label }) => (
  <button className="w-full text-left px-3 py-2 rounded-lg bg-white border border-[#E7E3DA] text-[#172033] text-sm hover:border-[#D7B46A] hover:bg-[#F4E9D2]/20 transition-colors flex items-center justify-between group">
    {label}
    <ChevronRight className="w-4 h-4 text-[#98A2B3] group-hover:text-[#B98A3D] transition-colors" />
  </button>
);

// Main AI Home Component
const AIHomeV2 = ({ userName = 'Sergio', onNavigate }) => {
  const [command, setCommand] = useState('');

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (command.trim()) {
      console.log('Command submitted:', command);
      setCommand('');
    }
  };

  return (
    <div className="flex-1 flex h-screen overflow-hidden bg-[#F7F5F0]">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[#172033] text-2xl font-semibold">
                Good morning, {userName}.
              </h1>
              <p className="text-[#667085] text-base mt-1">
                Everything is <span className="text-[#B98A3D] font-medium">under control</span>.
              </p>
              <p className="text-[#98A2B3] text-xs mt-1">
                4 agents active · All systems operational today
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-[#E7E3DA] text-[#172033] text-sm font-medium hover:border-[#D7B46A] transition-colors">
              <Search className="w-4 h-4 text-[#667085]" />
              Ask Bizmate
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-4">
          {/* Bizmate Orchestrator */}
          <div className="bg-white rounded-2xl border border-[#E7E3DA] p-4 mb-6">
            <BizmateOrchestrator />
          </div>

          {/* Bottom Sections */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Needs your attention */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#172033] font-semibold text-base">Needs your attention</h3>
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">2</span>
              </div>
              <div className="space-y-3">
                <AttentionCard
                  title="Late checkout request"
                  subtitle="Emma Thompson · Room 204 · 1 night"
                  category="Guest Experience"
                  categoryColor="bg-[#F4E9D2] text-[#8B6914]"
                />
                <AttentionCard
                  title="Outstanding payment"
                  subtitle="Daniel Kim · IDR 12,400,000"
                  category="Reservations"
                  categoryColor="bg-[#F4E9D2] text-[#8B6914]"
                />
              </div>
              <button className="mt-4 text-[#B98A3D] text-sm font-medium flex items-center gap-1 hover:text-[#8B6914] transition-colors">
                View all <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Recent activity */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#172033] font-semibold text-base">Recent activity</h3>
                <button className="text-[#B98A3D] text-sm font-medium flex items-center gap-1 hover:text-[#8B6914] transition-colors">
                  View all <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-white rounded-xl border border-[#E7E3DA] p-4">
                <ActivityItem
                  icon={CheckCircle}
                  title="Room 105 cleaned"
                  category="Operations"
                  time="10:42 AM"
                  iconBg="bg-[#B98A3D]"
                />
                <ActivityItem
                  icon={Car}
                  title="Airport transfer arranged"
                  category="Guest Experience"
                  time="10:31 AM"
                  iconBg="bg-[#D7B46A]"
                />
                <ActivityItem
                  icon={Calendar}
                  title="New booking received"
                  category="Reservations"
                  time="09:24 AM"
                  iconBg="bg-[#B98A3D]"
                />
                <ActivityItem
                  icon={DollarSign}
                  title="Rate updated for Nov"
                  category="Revenue"
                  time="08:11 AM"
                  iconBg="bg-[#D7B46A]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bizmate Command Bar - Fixed at bottom */}
        <div className="px-8 py-4 bg-[#F7F5F0] border-t border-[#E7E3DA]">
          <div className="bg-white rounded-2xl border border-[#E7E3DA] p-2 shadow-sm">
            <div className="flex items-center gap-3 px-4 py-2">
              <img
                src="/images/bizmate-logo.png"
                alt="Bizmate"
                className="w-6 h-6 object-contain"
              />
              <div className="flex-1 text-[#667085] text-sm">
                <span className="font-medium text-[#172033]">Bizmate is ready.</span>
                {' '}Ask a question, request a task or get a full update on your hotel operations.
              </div>
            </div>
            <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="Ask or delegate anything to Bizmate..."
                className="flex-1 px-4 py-3 bg-[#F7F5F0] rounded-xl text-[#172033] text-sm placeholder-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#D7B46A]/30"
              />
              <button
                type="button"
                className="p-3 rounded-xl bg-[#F7F5F0] text-[#667085] hover:text-[#172033] transition-colors"
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                type="submit"
                className="p-3 rounded-xl bg-gradient-to-r from-[#B98A3D] to-[#D7B46A] text-white hover:shadow-lg transition-all"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <RightPanel />
    </div>
  );
};

export default AIHomeV2;

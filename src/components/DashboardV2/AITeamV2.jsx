import React, { useState } from 'react';
import {
  Sparkles,
  MessageSquare,
  Wrench,
  Calendar,
  DollarSign,
  TrendingUp,
  BarChart3,
  ChevronDown
} from 'lucide-react';

const AITeamV2 = ({ onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'guest-experience', label: 'Guest Experience', count: 5 },
    { id: 'operations', label: 'Operations', count: 5 },
    { id: 'commercial', label: 'Commercial', count: 4 },
    { id: 'marketing', label: 'Marketing', count: 4 },
    { id: 'revenue', label: 'Revenue', count: 3 },
    { id: 'management', label: 'Management', count: 2 },
  ];

  const allAgents = [
    {
      name: 'BANYU',
      role: 'WhatsApp Agent',
      description: 'Handles guest conversations, reservations, services and follow-up through WhatsApp.',
      status: 'Active',
      metric: '5 specialists',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
      category: 'guest-experience'
    },
    {
      name: 'KORA',
      role: 'Voice Agent',
      description: 'Answers calls, handles enquiries, checks availability and creates bookings.',
      status: 'Active',
      metric: '2 specialists',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
      category: 'guest-experience'
    },
    {
      name: 'OSIRIS',
      role: 'Operations Agent',
      description: 'Manages operations, housekeeping, maintenance and owner decisions.',
      status: 'Active',
      metric: '3 specialists',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
      category: 'operations'
    },
    {
      name: 'NUSANTARA',
      role: 'Cultural Agent',
      description: 'Provides cultural experiences, local recommendations and activities.',
      status: 'Active',
      metric: '4 specialists',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
      category: 'guest-experience'
    },
    {
      name: 'LUMINA',
      role: 'Sales Agent',
      description: 'Finds and converts leads, follow-ups, quotes and upsell opportunities.',
      status: 'Active',
      metric: '5 specialists',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face',
      category: 'commercial'
    },
    {
      name: 'IRIS',
      role: 'Marketing Agent',
      description: 'Creates content, manages campaigns, handles social media and reputation.',
      status: 'Active',
      metric: '2 specialists',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face',
      category: 'marketing'
    },
    {
      name: 'AURA',
      role: 'Insights Agent',
      description: 'Analyzes performance, predicts demand and provides recommendations.',
      status: 'Active',
      metric: '3 specialists',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
      category: 'management'
    },
    {
      name: 'Housekeeping Specialist',
      role: 'From readiness & cleaning',
      description: 'Coordinates cleaning, inspections and room preparation.',
      status: 'Active',
      metric: '2 specialists',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face',
      category: 'operations'
    },
    {
      name: 'Maintenance Specialist',
      role: 'Maintenance & repairs',
      description: 'Manages maintenance requests, technician assignment and follow-up.',
      status: 'Active',
      metric: '2 specialists',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face',
      category: 'operations'
    },
  ];

  const filteredAgents = activeFilter === 'all'
    ? allAgents
    : allAgents.filter(a => a.category === activeFilter);

  return (
    <div className="flex-1 bg-[#F7F5F0] h-screen overflow-auto">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-[#E7E3DA]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-semibold text-[#172033]">Your AI Team</h1>
            <p className="text-[11px] text-[#667085]">One AI. An entire team behind it. Working together across every part of your property.</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#B98A3D] to-[#D7B46A] text-white rounded-full text-[11px] font-medium shadow-sm">
            <Sparkles className="w-3 h-3" />
            Ask Bizmate
          </button>
        </div>
      </div>

      {/* Orchestrator Map */}
      <div className="px-6 py-6">
        <div className="bg-white rounded-2xl border border-[#E7E3DA] p-6">
          {/* Top Row: Guest Experience + Operations */}
          <div className="flex justify-center gap-6 mb-4">
            {/* Guest Experience AI */}
            <div className="w-56 p-3 rounded-xl border border-[#E7E3DA] bg-white hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-medium bg-green-100 text-green-700">Active</span>
              </div>
              <h3 className="text-[11px] font-semibold text-[#172033] mb-0.5">Guest Experience AI</h3>
              <p className="text-[9px] text-[#B98A3D] mb-1">BANYU · KORA · NUSANTARA</p>
              <p className="text-[8px] text-[#667085] mb-2 leading-relaxed">Guest conversations, reservations, services and cultural experiences.</p>
              <p className="text-[9px] text-[#172033] font-medium">37 conversations</p>
            </div>

            {/* Operations AI */}
            <div className="w-56 p-3 rounded-xl border border-[#E7E3DA] bg-white hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-white" />
                </div>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-medium bg-green-100 text-green-700">Active</span>
              </div>
              <h3 className="text-[11px] font-semibold text-[#172033] mb-0.5">Operations AI</h3>
              <p className="text-[9px] text-[#B98A3D] mb-1">OSIRIS · Housekeeping · Maintenance</p>
              <p className="text-[8px] text-[#667085] mb-2 leading-relaxed">Task Coordinator · Active Readiness</p>
              <p className="text-[9px] text-[#172033] font-medium">28 actions today</p>
            </div>
          </div>

          {/* Middle Row: Reservations + ORCHESTRATOR + Revenue */}
          <div className="flex justify-center items-center gap-4 mb-4">
            {/* Reservations AI */}
            <div className="w-48 p-3 rounded-xl border border-[#E7E3DA] bg-white hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-medium bg-green-100 text-green-700">Active</span>
              </div>
              <h3 className="text-[10px] font-semibold text-[#172033] mb-0.5">Reservations AI</h3>
              <p className="text-[8px] text-[#667085] mb-1.5 leading-relaxed">Bookings · Availability · Payments · Guest Support</p>
              <p className="text-[9px] text-[#172033] font-medium">12 bookings today</p>
            </div>

            {/* Central BIZMATE Orchestrator */}
            <div className="relative mx-6">
              <div className="w-36 h-36 rounded-full bg-gradient-to-br from-[#1a1b19] to-[#2d2e2c] flex flex-col items-center justify-center shadow-xl border-4 border-[#3a3b39]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B98A3D] to-[#D7B46A] flex items-center justify-center mb-1">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <p className="text-white text-[13px] font-bold tracking-wide">BIZMATE</p>
                <p className="text-[#D7B46A] text-[8px] font-medium tracking-wider">AI ORCHESTRATOR</p>
              </div>
              <p className="text-center text-[8px] text-[#667085] mt-2 max-w-[140px] mx-auto leading-relaxed">
                Coordinates all agents to run your property autonomously
              </p>
            </div>

            {/* Revenue AI */}
            <div className="w-48 p-3 rounded-xl border border-[#E7E3DA] bg-white hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center">
                  <DollarSign className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-medium bg-green-100 text-green-700">Active</span>
              </div>
              <h3 className="text-[10px] font-semibold text-[#172033] mb-0.5">Revenue AI</h3>
              <p className="text-[8px] text-[#667085] mb-1.5 leading-relaxed">Pricing · Demand · Occupancy · Channel Performance · Forecasting</p>
              <p className="text-[9px] text-[#172033] font-medium">3 opportunities detected</p>
            </div>
          </div>

          {/* Bottom Row: Commercial + Marketing + Insights */}
          <div className="flex justify-center gap-4">
            {/* Commercial AI */}
            <div className="w-48 p-3 rounded-xl border border-[#E7E3DA] bg-white hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-medium bg-amber-100 text-amber-700">Warning</span>
              </div>
              <h3 className="text-[10px] font-semibold text-[#172033] mb-0.5">Commercial AI</h3>
              <p className="text-[9px] text-[#B98A3D] mb-0.5">LUMINA</p>
              <p className="text-[8px] text-[#667085] mb-1.5 leading-relaxed">Leads · Follow-ups · Conversion · Upsell · Quotes</p>
              <p className="text-[9px] text-amber-600 font-medium">8 opportunities</p>
            </div>

            {/* Marketing AI */}
            <div className="w-48 p-3 rounded-xl border border-[#E7E3DA] bg-white hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-medium bg-green-100 text-green-700">Active</span>
              </div>
              <h3 className="text-[10px] font-semibold text-[#172033] mb-0.5">Marketing AI</h3>
              <p className="text-[9px] text-[#B98A3D] mb-0.5">IRIS</p>
              <p className="text-[8px] text-[#667085] mb-1.5 leading-relaxed">Content Studio · Campaigns · Social · Reputation · Website</p>
              <p className="text-[9px] text-[#172033] font-medium">5 campaigns active</p>
            </div>

            {/* Insights & Management AI */}
            <div className="w-48 p-3 rounded-xl border border-[#E7E3DA] bg-white hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-500 flex items-center justify-center">
                  <BarChart3 className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-medium bg-green-100 text-green-700">Active</span>
              </div>
              <h3 className="text-[10px] font-semibold text-[#172033] mb-0.5">Insights & Management AI</h3>
              <p className="text-[9px] text-[#B98A3D] mb-0.5">AURA</p>
              <p className="text-[8px] text-[#667085] mb-1.5 leading-relaxed">Performance · Predictions · Market Trends · Owner Intelligence</p>
              <p className="text-[9px] text-[#172033] font-medium">New insights available</p>
            </div>
          </div>
        </div>
      </div>

      {/* All Agents & Specialists */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-2xl border border-[#E7E3DA] p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-semibold text-[#172033]">All Agents & Specialists</h2>
            <button className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] text-[#667085] border border-[#E7E3DA] rounded-lg bg-white">
              All Status
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1.5 mb-4">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-[#172033] text-white'
                    : 'bg-[#F7F5F0] text-[#667085] hover:bg-[#EDE8DC]'
                }`}
              >
                {filter.label}
                {filter.count && (
                  <span className="ml-1 opacity-70">{filter.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-3 gap-3">
            {filteredAgents.map((agent, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-[#E7E3DA] bg-[#FAFAF8] hover:bg-white hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-[11px] font-semibold text-[#172033]">{agent.name}</h3>
                      <span className={`px-1.5 py-0.5 rounded text-[7px] font-medium ${
                        agent.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {agent.status}
                      </span>
                    </div>
                    <p className="text-[9px] text-[#B98A3D] mb-1">{agent.role}</p>
                    <p className="text-[8px] text-[#667085] mb-1 line-clamp-2 leading-relaxed">{agent.description}</p>
                    <p className="text-[9px] text-[#172033] font-medium">{agent.metric}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITeamV2;

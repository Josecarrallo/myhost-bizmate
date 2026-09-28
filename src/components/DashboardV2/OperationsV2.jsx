import React, { useState } from 'react';
import {
  Calendar,
  Home,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Users,
  Plane,
  BedDouble,
  CheckCircle2,
  Clock,
  Wrench
} from 'lucide-react';

const OperationsV2 = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('today');

  const tabs = [
    { id: 'today', label: 'Today' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'housekeeping', label: 'Housekeeping' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'maintenance', label: 'Maintenance' },
  ];

  const todayEvents = [
    {
      time: '08:30',
      villa: 'River Villa',
      task: 'Guest checkout completed',
      subtext: 'Cleaning automatically assigned',
      status: 'Completed',
      statusColor: 'bg-green-500',
      assignee: 'Maria',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face'
    },
    {
      time: '09:15',
      villa: 'Tropical Room',
      task: 'Housekeeping in progress',
      subtext: 'Expected ready 11:30',
      status: 'In progress',
      statusColor: 'bg-amber-500',
      assignee: 'Putu',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
    },
    {
      time: '10:20',
      villa: 'Room 8 – Cave Room',
      task: 'AC not cooling properly',
      subtext: 'Maintenance assigned · ETA 11:00\nGuest arrival 15:00',
      status: 'High',
      statusColor: 'bg-red-500',
      assignee: 'Wayan',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'
    },
    {
      time: '12:00',
      villa: 'Garden Villa',
      task: 'Early check-in requested',
      subtext: 'Awaiting room readiness',
      status: 'Pending',
      statusColor: 'bg-yellow-400',
      assignee: 'Ketut',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face'
    },
    {
      time: '15:00',
      villa: 'Multiple Arrivals',
      task: '6 guest arrivals',
      subtext: '5 rooms ready · 1 being prepared',
      status: 'Upcoming',
      statusColor: 'bg-gray-400',
      assignee: null,
      avatar: null
    },
  ];

  const operationalStatus = [
    { label: 'Rooms ready', value: 12, dot: 'bg-green-500' },
    { label: 'Cleaning in progress', value: 3, dot: 'bg-amber-500' },
    { label: 'Rooms dirty', value: 2, dot: 'bg-red-500' },
    { label: 'Inspection', value: 1, dot: 'bg-blue-500' },
    { label: 'Maintenance open', value: 1, dot: 'bg-orange-500' },
    { label: 'Open tasks', value: 4, dot: 'bg-purple-500' },
  ];

  const pendingArrivals = [
    { name: 'Sarah Thompson', villa: 'River Villa', nights: 4, time: '16:00', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=face', vip: true },
    { name: 'Daniel Kim', villa: 'Garden Villa', nights: 3, time: '16:20', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face' },
    { name: 'Emma Wilson', villa: 'Blossom Villa', nights: 2, time: '17:10', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face' },
  ];

  const pendingDepartures = [
    { name: 'Lucas Martin', villa: 'Sky Room', nights: 3, time: '10:00', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' },
    { name: 'Sophie Clarke', villa: 'Lotus Suite', nights: 2, time: '10:30', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&crop=face' },
    { name: 'James Carter', villa: 'Oasis Suite', nights: 4, time: '11:00', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face' },
  ];

  return (
    <div className="flex-1 bg-[#F7F5F0] h-screen overflow-auto">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-[#E7E3DA]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-semibold text-[#172033]">Operations</h1>
            <p className="text-[11px] text-[#667085]">Everything happening across your property, right now.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[11px] text-[#667085]">Sat, 27 Sep 2026</p>
              <p className="text-[11px] text-[#172033] font-medium">11:58 AM</p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#B98A3D] to-[#D7B46A] text-white rounded-full text-[11px] font-medium shadow-sm">
              <Sparkles className="w-3 h-3" />
              Ask Bizmate
            </button>
          </div>
        </div>
      </div>

      {/* Tabs & Filter */}
      <div className="px-6 py-2.5 bg-white border-b border-[#E7E3DA]">
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#172033] text-white'
                    : 'text-[#667085] hover:bg-[#F7F5F0]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-[#667085] border border-[#E7E3DA] rounded-lg bg-white">
            All Villas
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-4 gap-3">
          {/* Arrivals */}
          <div className="bg-white rounded-xl border border-[#E7E3DA] p-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <Plane className="w-5 h-5 text-green-600 rotate-45" />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#172033]">18</span>
                  <span className="text-[10px] text-green-600 font-medium">↑ +15%</span>
                </div>
                <p className="text-[10px] text-[#667085]">Arrivals Today</p>
              </div>
            </div>
          </div>

          {/* Departures */}
          <div className="bg-white rounded-xl border border-[#E7E3DA] p-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Plane className="w-5 h-5 text-blue-600 -rotate-45" />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#172033]">14</span>
                  <span className="text-[10px] text-green-600 font-medium">↑ +9%</span>
                </div>
                <p className="text-[10px] text-[#667085]">Departures Today</p>
              </div>
            </div>
          </div>

          {/* Rooms to prepare */}
          <div className="bg-white rounded-xl border border-[#E7E3DA] p-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <BedDouble className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#172033]">6</span>
                </div>
                <p className="text-[10px] text-[#667085]">Rooms to prepare</p>
                <p className="text-[9px] text-amber-600">3 in progress</p>
              </div>
            </div>
          </div>

          {/* Open Issues */}
          <div className="bg-white rounded-xl border border-[#E7E3DA] p-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#172033]">2</span>
                </div>
                <p className="text-[10px] text-[#667085]">Open Issues</p>
                <p className="text-[9px] text-red-600">1 high priority</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-6 pb-4">
        <div className="flex gap-4">
          {/* Left: Today Timeline */}
          <div className="flex-1 bg-white rounded-xl border border-[#E7E3DA] p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[13px] font-semibold text-[#172033]">Today · 27 September 2026</h2>
              <button className="text-[10px] text-[#B98A3D] font-medium hover:underline">View full day →</button>
            </div>

            {/* Legend */}
            <div className="flex gap-4 mb-4 pb-3 border-b border-[#F0EDE6]">
              <span className="flex items-center gap-1.5 text-[10px] text-[#667085]">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Arrivals 18
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-[#667085]">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Departures 14
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-[#667085]">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Housekeeping 6
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-[#667085]">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span> Maintenance 2
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-[#667085]">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> Issues 2
              </span>
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              {todayEvents.map((event, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-10 text-[10px] text-[#667085] pt-2 flex-shrink-0">{event.time}</div>
                  <div className="flex-1 flex items-start gap-3 bg-[#FAFAF8] rounded-xl p-2.5 border border-[#F0EDE6]">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center flex-shrink-0">
                      <Home className="w-4 h-4 text-[#B98A3D]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-[#172033]">{event.villa}</p>
                      <p className="text-[10px] text-[#667085]">{event.task}</p>
                      <p className="text-[9px] text-[#9CA3AF] whitespace-pre-line">{event.subtext}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium text-white ${event.statusColor}`}>
                        {event.status}
                      </span>
                      {event.avatar && (
                        <div className="flex items-center gap-1.5">
                          <img src={event.avatar} alt={event.assignee} className="w-6 h-6 rounded-full object-cover border border-white shadow-sm" />
                          <span className="text-[10px] text-[#667085]">{event.assignee}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="w-72 space-y-4 flex-shrink-0">
            {/* Operational Status */}
            <div className="bg-white rounded-xl border border-[#E7E3DA] p-4">
              <h3 className="text-[13px] font-semibold text-[#172033] mb-3">Operational Status</h3>
              <div className="flex items-center gap-4 mb-4">
                {/* Donut Chart */}
                <div className="relative w-20 h-20 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#F0EDE6" strokeWidth="3" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#B98A3D" strokeWidth="3"
                      strokeDasharray="68.6 100" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-[#172033]">78%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xl font-bold text-[#172033]">14 of 18</p>
                  <p className="text-[10px] text-[#667085]">Rooms occupied</p>
                </div>
              </div>
              <div className="space-y-2">
                {operationalStatus.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.dot}`}></span>
                      <span className="text-[10px] text-[#667085]">{item.label}</span>
                    </div>
                    <span className="text-[11px] font-medium text-[#172033]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bizmate Today */}
            <div className="bg-gradient-to-br from-[#F8F5EF] to-[#F0EBE0] rounded-xl border border-[#E7E3DA] p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#B98A3D] to-[#D7B46A] flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <h3 className="text-[12px] font-semibold text-[#172033]">Bizmate Today</h3>
              </div>
              <p className="text-[10px] text-[#667085] mb-3">Bizmate handled <span className="font-medium text-[#172033]">28 actions</span> today.</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[10px]">
                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                  <span className="text-[#172033]">Created 5 housekeeping tasks</span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <Wrench className="w-3 h-3 text-blue-600" />
                  <span className="text-[#172033]">Assigned 2 maintenance tasks</span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <Users className="w-3 h-3 text-purple-600" />
                  <span className="text-[#172033]">Processed 4 service requests</span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span className="text-[#172033]">Sent 5 guest notifications</span>
                </div>
              </div>
              <p className="text-[10px] text-[#B98A3D] font-medium mt-3 cursor-pointer hover:underline">1 item needs your attention →</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Arrivals & Departures */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Pending Arrivals */}
          <div className="bg-white rounded-xl border border-[#E7E3DA] p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-semibold text-[#172033]">Pending Arrivals (8)</h3>
              <button className="text-[10px] text-[#B98A3D] font-medium hover:underline">View all →</button>
            </div>
            <div className="space-y-2">
              {pendingArrivals.map((guest, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 bg-[#FAFAF8] rounded-lg border border-[#F0EDE6]">
                  <div className="relative">
                    <img src={guest.avatar} alt={guest.name} className="w-9 h-9 rounded-full object-cover" />
                    {guest.vip && (
                      <span className="absolute -top-1 -right-1 px-1 py-0.5 bg-amber-400 text-white text-[7px] font-bold rounded">VIP</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-[#172033] truncate">{guest.name}</p>
                    <p className="text-[9px] text-[#667085]">{guest.villa} · {guest.nights} nights</p>
                  </div>
                  <span className="text-[10px] text-[#667085] flex-shrink-0">{guest.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Departures */}
          <div className="bg-white rounded-xl border border-[#E7E3DA] p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-semibold text-[#172033]">Pending Departures (6)</h3>
              <button className="text-[10px] text-[#B98A3D] font-medium hover:underline">View all →</button>
            </div>
            <div className="space-y-2">
              {pendingDepartures.map((guest, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 bg-[#FAFAF8] rounded-lg border border-[#F0EDE6]">
                  <img src={guest.avatar} alt={guest.name} className="w-9 h-9 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-[#172033] truncate">{guest.name}</p>
                    <p className="text-[9px] text-[#667085]">{guest.villa} · {guest.nights} nights</p>
                  </div>
                  <span className="text-[10px] text-[#667085] flex-shrink-0">{guest.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="px-6 pb-4">
        <div className="bg-white rounded-xl border border-[#E7E3DA] p-3">
          <div className="flex items-center gap-3">
            <div className="flex gap-2 flex-1">
              <button className="px-3 py-1.5 text-[10px] text-[#667085] bg-[#F7F5F0] hover:bg-[#EDE8DC] rounded-lg transition-colors">
                Are all rooms ready for arrivals?
              </button>
              <button className="px-3 py-1.5 text-[10px] text-[#667085] bg-[#F7F5F0] hover:bg-[#EDE8DC] rounded-lg transition-colors">
                What needs my attention?
              </button>
              <button className="px-3 py-1.5 text-[10px] text-[#667085] bg-[#F7F5F0] hover:bg-[#EDE8DC] rounded-lg transition-colors">
                Show overdue tasks
              </button>
              <button className="px-3 py-1.5 text-[10px] text-[#667085] bg-[#F7F5F0] hover:bg-[#EDE8DC] rounded-lg transition-colors">
                Any maintenance issues?
              </button>
              <button className="px-3 py-1.5 text-[10px] text-[#667085] bg-[#F7F5F0] hover:bg-[#EDE8DC] rounded-lg transition-colors">
                Who is checking out late?
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask Bizmate about today's operations..."
                  className="w-64 pl-3 pr-8 py-2 text-[11px] border border-[#E7E3DA] rounded-full bg-[#FAFAF8] focus:outline-none focus:ring-1 focus:ring-[#B98A3D] focus:border-[#B98A3D]"
                />
                <button className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-r from-[#B98A3D] to-[#D7B46A] text-white rounded-full flex items-center justify-center">
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationsV2;

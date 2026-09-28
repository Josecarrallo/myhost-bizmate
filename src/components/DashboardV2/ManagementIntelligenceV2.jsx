import React, { useState } from 'react';
import {
  Sparkles,
  Star,
  ArrowRight,
  Mic,
  FileText,
  CheckCircle,
  ListTodo,
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  DollarSign
} from 'lucide-react';

const ManagementIntelligenceV2 = ({ onNavigate, userData }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [inputMessage, setInputMessage] = useState('');

  const tabs = [
    { id: 'chat', label: 'Chat' },
    { id: 'reports', label: 'Reports' },
    { id: 'insights', label: 'Insights' },
    { id: 'automation', label: 'Automation' }
  ];

  const quickActions = [
    { icon: FileText, label: 'Generate daily report' },
    { icon: CheckCircle, label: 'Check all arrivals' },
    { icon: ListTodo, label: 'Review open tasks' },
    { icon: TrendingUp, label: 'Show revenue forecast' }
  ];

  // Current date/time
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex-1 h-screen bg-[#F7F5F0] overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#F7F5F0] border-b border-[#E8E4DC] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-[#B98A3D]" />
            <div>
              <h1 className="text-2xl font-semibold text-[#1a1a1a]">Bizmate</h1>
              <p className="text-sm text-gray-500">Management Intelligence</p>
            </div>
            <span className="ml-2 px-2 py-0.5 bg-[#F4E9D2] text-[#8B6914] text-xs font-medium rounded-full">
              Powered by OSIRIS
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Tabs */}
            <div className="flex items-center bg-white rounded-lg border border-[#E8E4DC] p-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#1a1a1a] text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-[#E8E4DC]">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{currentDate}</span>
              <span className="text-sm text-gray-400">{currentTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Chat & Alerts */}
          <div className="col-span-8 space-y-4">
            {/* Chat Messages */}
            <div className="bg-white rounded-xl border border-[#E8E4DC] p-6">
              {/* User Message */}
              <div className="flex justify-end mb-4">
                <div className="bg-[#F4E9D2] rounded-2xl rounded-tr-md px-4 py-2.5 max-w-md">
                  <p className="text-sm text-[#1a1a1a]">What should I know about today?</p>
                  <p className="text-[10px] text-[#8B6914] mt-1 text-right">11:58 AM</p>
                </div>
              </div>

              {/* Bizmate Response */}
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B98A3D] to-[#D7B46A] flex items-center justify-center flex-shrink-0">
                  <img src="/images/bizmate-logo.png" alt="Bizmate" className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="bg-[#FAFAF8] rounded-2xl rounded-tl-md px-4 py-3 max-w-lg">
                    <p className="text-sm text-[#1a1a1a]">
                      {getGreeting()}, {userData?.full_name?.split(' ')[0] || 'there'}! I've reviewed your entire operation.
                      Here are the key updates and actions for today.
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">11:59 AM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alert Cards Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Attention Needed */}
              <div className="bg-white rounded-xl border border-[#E8E4DC] p-4 hover:border-[#B98A3D] transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FEF3C7] flex items-center justify-center">
                    <Star className="w-5 h-5 text-[#F59E0B]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-2xl font-semibold text-[#1a1a1a]">2</p>
                    <p className="text-sm text-gray-600">Things need your attention</p>
                  </div>
                </div>
              </div>

              {/* All Good */}
              <div className="bg-white rounded-xl border border-[#E8E4DC] p-4 hover:border-[#10B981] transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D1FAE5] flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1a1a1a]">Everything else</p>
                    <p className="text-sm text-[#10B981]">is running normally</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detail Cards Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* AC Issue */}
              <div className="bg-white rounded-xl border border-[#E8E4DC] p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FEE2E2] flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-[#EF4444]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1a1a1a]">AC issue in Room 8</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Maintenance is handling it.<br />
                      Arrived at 15:00. No action needed for now.
                    </p>
                    <button className="mt-3 flex items-center gap-1 text-xs font-medium text-[#B98A3D] hover:text-[#8B6914]">
                      View details <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Outstanding Payment */}
              <div className="bg-white rounded-xl border border-[#E8E4DC] p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FEF3C7] flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-[#F59E0B]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1a1a1a]">Outstanding payment</p>
                    <p className="text-xs text-gray-500 mt-1">
                      IDR 12,400,000 for Daniel Kim.<br />
                      Arrival tomorrow.
                    </p>
                    <button className="mt-3 flex items-center gap-1 text-xs font-medium text-[#B98A3D] hover:text-[#8B6914]">
                      Send reminder <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="bg-white rounded-xl border border-[#E8E4DC] p-3">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Ask Bizmate anything..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                />
                <button className="p-2 rounded-lg hover:bg-[#F4E9D2] transition-colors">
                  <Mic className="w-5 h-5 text-gray-400" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B98A3D] to-[#D7B46A] flex items-center justify-center hover:opacity-90 transition-opacity">
                  <ArrowRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Property & Metrics */}
          <div className="col-span-4 space-y-4">
            {/* Property Card */}
            <div className="bg-white rounded-xl border border-[#E8E4DC] overflow-hidden">
              <div className="h-32 relative">
                <img
                  src="/images/villa1.jpg"
                  alt="Property"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=200&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="font-medium">Izumi Hotel & Villas</p>
                  <p className="text-xs text-white/80">Bali, Indonesia</p>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-white rounded-xl border border-[#E8E4DC] p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-[#1a1a1a]">Key metrics</h3>
                <button className="text-xs text-gray-500 hover:text-[#B98A3D]">Today</button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-semibold text-[#1a1a1a]">82%</p>
                  <p className="text-xs text-gray-500">Occupancy <span className="text-green-500">+6%</span></p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[#1a1a1a]">18</p>
                  <p className="text-xs text-gray-500">Arrivals</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[#1a1a1a]">14</p>
                  <p className="text-xs text-gray-500">Departures</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[#B98A3D]">IDR 124M</p>
                  <p className="text-xs text-gray-500">Revenue <span className="text-green-500">+1</span></p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-[#E8E4DC] p-4">
              <h3 className="text-sm font-medium text-[#1a1a1a] mb-3">Quick actions</h3>

              <div className="space-y-2">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#FAFAF8] transition-colors text-left"
                  >
                    <action.icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{action.label}</span>
                    <ArrowRight className="w-4 h-4 text-gray-300 ml-auto" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementIntelligenceV2;

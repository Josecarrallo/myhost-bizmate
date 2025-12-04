import React, { useState } from 'react';
import {
  ChevronLeft,
  Settings,
  Workflow,
  Zap,
  Clock,
  CheckCircle,
  MessageSquare,
  Home,
  CalendarCheck,
  TrendingUp
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, trend, prefix = '', suffix = '', gradient }) => {
  return (
    <div className={`bg-gradient-to-br ${gradient} text-white p-6 rounded-3xl transform transition-all hover:scale-105 hover:shadow-2xl`}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
          <Icon className="w-6 h-6" strokeWidth={2.5} />
        </div>
        {trend && (
          <div className="px-3 py-1.5 rounded-full bg-green-500/20">
            <span className="text-sm font-bold">{trend}</span>
          </div>
        )}
      </div>
      <p className="text-white/80 text-sm mb-2">{label}</p>
      <p className="text-4xl font-black">{prefix}{value}{suffix}</p>
    </div>
  );
};

const BookingsReservationsWorkflow = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const bookingStages = [
    { stage: 'Inquiry', count: 15, color: 'from-blue-400 to-blue-600' },
    { stage: 'Confirmed', count: 28, color: 'from-green-400 to-green-600' },
    { stage: 'Check-in', count: 8, color: 'from-purple-400 to-purple-600' },
    { stage: 'Active', count: 12, color: 'from-orange-400 to-orange-600' },
    { stage: 'Check-out', count: 5, color: 'from-pink-400 to-pink-600' }
  ];

  const automations = [
    {
      trigger: 'New Inquiry Received',
      actions: ['Send instant response', 'Check availability', 'Provide quote'],
      status: 'active',
      icon: MessageSquare
    },
    {
      trigger: 'Booking Confirmed',
      actions: ['Send confirmation email', 'Create calendar event', 'Process payment'],
      status: 'active',
      icon: CheckCircle
    },
    {
      trigger: '48h Before Check-in',
      actions: ['Send reminder', 'Share access codes', 'Verify arrival time'],
      status: 'active',
      icon: Clock
    },
    {
      trigger: 'Check-in Day',
      actions: ['Welcome message', 'Activate smart home', 'Share WiFi details'],
      status: 'active',
      icon: Home
    },
    {
      trigger: 'During Stay',
      actions: ['Daily check-in message', 'Handle requests', 'Monitor feedback'],
      status: 'active',
      icon: MessageSquare
    },
    {
      trigger: 'Check-out Day',
      actions: ['Checkout reminder', 'Request review', 'Schedule cleaning'],
      status: 'active',
      icon: CalendarCheck
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h2 className="text-3xl font-black text-gray-900">Booking Workflow</h2>
          <button className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-600 transition-colors">
            <Settings className="w-6 h-6" />
          </button>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('automations')}
            className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'automations'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            Automations
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            Analytics
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 rounded-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Workflow className="w-8 h-8" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-1">Automated Booking Pipeline</h3>
                  <p className="text-white/90">68 active bookings across all stages</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {bookingStages.map((stage, idx) => (
                <div key={idx} className={`bg-gradient-to-br ${stage.color} text-white p-6 rounded-2xl`}>
                  <div className="text-center">
                    <p className="text-5xl font-black mb-2">{stage.count}</p>
                    <p className="text-white/90 font-bold">{stage.stage}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                Real-time Updates
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">New booking confirmed</p>
                    <p className="text-sm text-gray-600">Sarah Johnson - Villa Sunset - $1,250</p>
                  </div>
                  <span className="text-xs text-gray-500">2 min ago</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">Check-in reminder sent</p>
                    <p className="text-sm text-gray-600">Michael Chen - Beach House</p>
                  </div>
                  <span className="text-xs text-gray-500">15 min ago</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">Guest inquiry received</p>
                    <p className="text-sm text-gray-600">Emma Wilson - City Loft</p>
                  </div>
                  <span className="text-xs text-gray-500">28 min ago</span>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl">
                <CalendarCheck className="w-6 h-6 text-orange-600" />
                <div className="flex-1">
                  <p className="font-bold text-gray-900">Review request sent</p>
                  <p className="text-sm text-gray-600">David Park - Villa Sunset</p>
                </div>
                <span className="text-xs text-gray-500">35 min ago</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-pink-50 rounded-xl">
                <CheckCircle className="w-6 h-6 text-pink-600" />
                <div className="flex-1">
                  <p className="font-bold text-gray-900">Cleaning scheduled</p>
                  <p className="text-sm text-gray-600">Beach House - Dec 5 at 11:00 AM</p>
                </div>
                <span className="text-xs text-gray-500">42 min ago</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'automations' && (
          <div className="space-y-4">
            {automations.map((auto, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-indigo-200 transition-all hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
                    <auto.icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-1">{auto.trigger}</h4>
                        <p className="text-sm text-gray-600">{auto.actions.length} automated actions</p>
                      </div>
                      <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-green-100 text-green-700">
                        {auto.status === 'active' ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {auto.actions.map((action, actionIdx) => (
                        <div key={actionIdx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                            {actionIdx + 1}
                          </div>
                          <span className="text-sm text-gray-700">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard icon={Zap} label="Automations Run" value="1,248" trend="+32%" gradient="from-yellow-500 to-orange-500" />
              <StatCard icon={Clock} label="Time Saved" value="156h" trend="+28%" gradient="from-green-500 to-emerald-600" />
              <StatCard icon={CheckCircle} label="Success Rate" value="99.2%" gradient="from-blue-500 to-cyan-600" />
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-6">Automation Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">Inquiry Response</span>
                    <span className="text-sm font-bold text-indigo-600">98% success</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">Booking Confirmation</span>
                    <span className="text-sm font-bold text-green-600">100% success</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">Check-in Reminders</span>
                    <span className="text-sm font-bold text-blue-600">99% success</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: '99%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">Review Requests</span>
                    <span className="text-sm font-bold text-purple-600">95% success</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8" />
                <div>
                  <h4 className="text-xl font-black">Efficiency Gains</h4>
                  <p className="text-white/90 text-sm">Compared to manual processing</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-4xl font-black mb-1">73%</p>
                  <p className="text-white/90 text-sm">Faster Response</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black mb-1">156h</p>
                  <p className="text-white/90 text-sm">Time Saved</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black mb-1">$8.5K</p>
                  <p className="text-white/90 text-sm">Cost Savings</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsReservationsWorkflow;

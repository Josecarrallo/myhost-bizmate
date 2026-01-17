import React from 'react';
import { X, Bot, Target, MessageSquare, Phone, Activity, Sparkles, Clock, CheckCircle, AlertCircle, TrendingUp, Zap } from 'lucide-react';

const AgentCenterDrawer = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const mainAgents = [
    {
      id: 'osiris',
      name: 'OSIRIS',
      fullName: 'Operations & Control',
      icon: Bot,
      status: 'Active',
      color: 'blue',
      stats: {
        tasksToday: 127,
        automationsRun: 89,
        alerts: 3
      },
      recentActivity: [
        { time: '2 min ago', action: 'Automated check-in process for Guest #1245' },
        { time: '15 min ago', action: 'Generated daily operations report' },
        { time: '1 hour ago', action: 'Triggered maintenance alert for Villa Sunset' }
      ]
    },
    {
      id: 'lumina',
      name: 'LUMINA',
      fullName: 'Sales & Leads',
      icon: Target,
      status: 'Active',
      color: 'purple',
      stats: {
        leadsToday: 24,
        conversions: 8,
        followUps: 12
      },
      recentActivity: [
        { time: '5 min ago', action: 'Sent follow-up to lead from Booking.com' },
        { time: '20 min ago', action: 'Qualified 3 new leads from Instagram' },
        { time: '45 min ago', action: 'Converted lead to booking - Villa Ocean' }
      ]
    },
    {
      id: 'banyu',
      name: 'BANYU',
      fullName: 'WhatsApp Assistant',
      icon: MessageSquare,
      status: 'Active',
      color: 'green',
      stats: {
        messagesHandled: 156,
        activeChats: 8,
        avgResponse: '< 1 min'
      },
      recentActivity: [
        { time: '1 min ago', action: 'Responded to guest inquiry about check-in time' },
        { time: '10 min ago', action: 'Sent booking confirmation to new guest' },
        { time: '30 min ago', action: 'Handled amenities request for Guest #1289' }
      ]
    },
    {
      id: 'kora',
      name: 'KORA',
      fullName: 'Voice Assistant',
      icon: Phone,
      status: 'Active',
      color: 'orange',
      stats: {
        callsToday: 34,
        avgDuration: '2.5 min',
        satisfaction: '94%'
      },
      recentActivity: [
        { time: '8 min ago', action: 'Completed booking inquiry call (3 min)' },
        { time: '25 min ago', action: 'Handled property information request' },
        { time: '1 hour ago', action: 'Assisted with booking modification' }
      ]
    },
    {
      id: 'iris',
      name: 'IRIS',
      fullName: 'Marketing & Content',
      icon: Sparkles,
      status: 'Active',
      color: 'pink',
      stats: {
        contentCreated: 18,
        postsScheduled: 12,
        engagement: '+24%'
      },
      recentActivity: [
        { time: '12 min ago', action: 'Generated Instagram post for Villa Tropical' },
        { time: '35 min ago', action: 'Created email campaign for last-minute bookings' },
        { time: '2 hours ago', action: 'Optimized website copy for SEO' }
      ]
    },
    {
      id: 'aura',
      name: 'AURA',
      fullName: 'Proactive Context',
      icon: Zap,
      status: 'Active',
      color: 'purple',
      stats: {
        signalsMonitored: 247,
        actionsTriggered: 12,
        contextAgents: 4
      },
      recentActivity: [
        { time: '10 min ago', action: 'Weather monitoring - Clear conditions detected' },
        { time: '1 hour ago', action: 'Local event detected - Beach festival, pricing adjusted' },
        { time: '2 hours ago', action: 'Traffic monitoring - Normal flow, no delays' }
      ],
      subAgents: [
        {
          id: 'weather',
          name: 'Weather Context',
          description: 'Monitors weather impact on operations',
          status: 'Monitoring',
          signals: 'Clear skies, No alerts',
          lastAction: '30 min ago - No action required'
        },
        {
          id: 'traffic',
          name: 'Traffic & Access',
          description: 'Tracks access routes and delays',
          status: 'Monitoring',
          signals: 'Normal traffic flow',
          lastAction: '15 min ago - No disruptions detected'
        },
        {
          id: 'events',
          name: 'Local Events & Demand',
          description: 'Detects events affecting demand',
          status: 'Monitoring',
          signals: 'Beach festival this weekend',
          lastAction: '1 hour ago - Pricing suggestion sent to LUMINA'
        },
        {
          id: 'disruption',
          name: 'Disruption & Risk',
          description: 'Monitors critical disruptions',
          status: 'Monitoring',
          signals: 'All systems normal',
          lastAction: '45 min ago - No risks detected'
        }
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400',
      purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400',
      green: 'from-green-500/20 to-green-600/20 border-green-500/30 text-green-400',
      orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-400',
      pink: 'from-pink-500/20 to-pink-600/20 border-pink-500/30 text-pink-400'
    };
    return colors[color] || colors.blue;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-screen w-full md:w-[600px] lg:w-[700px] bg-[#1f2329] border-l border-white/10 z-50 animate-slideInRight overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#2a2f3a] to-[#1f2329] border-b border-white/10 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Bot className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Agent Center</h2>
                <p className="text-sm text-white/60">Monitor all AI agents in real-time</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white/80" />
            </button>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="text-white/60 text-xs mb-1">Total Agents</div>
              <div className="text-white font-bold text-xl">6</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="text-white/60 text-xs mb-1">All Active</div>
              <div className="text-orange-400 font-bold text-xl">6</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="text-white/60 text-xs mb-1">Efficiency</div>
              <div className="text-green-400 font-bold text-xl">96%</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="text-white/60 text-xs mb-1">Uptime</div>
              <div className="text-blue-400 font-bold text-xl">99.8%</div>
            </div>
          </div>
        </div>

        {/* AI Agents Section */}
        <div className="p-6 space-y-6">
          <h3 className="text-orange-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Agents
          </h3>
          {mainAgents.map((agent) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.id}
                className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:bg-white/8 transition-all"
              >
                {/* Agent Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${getColorClasses(agent.color)} border`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{agent.name}.AI</h3>
                      <p className="text-white/60 text-sm">{agent.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">{agent.status}</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {Object.entries(agent.stats).map(([key, value]) => (
                    <div key={key} className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="text-white/60 text-xs mb-1 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-white font-bold">{value}</div>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-white/60" />
                    <h4 className="text-white/80 text-sm font-medium">Recent Activity</h4>
                  </div>
                  <div className="space-y-2">
                    {agent.recentActivity.map((activity, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <Clock className="w-3 h-3 text-white/40 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-white/60">{activity.time}</span>
                          <span className="text-white/40"> - </span>
                          <span className="text-white/80">{activity.action}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AURA Sub-Agents (Context Agents) */}
                {agent.subAgents && (
                  <div className="mt-4 pt-4 border-t border-purple-500/20">
                    <h4 className="text-purple-400 font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Activity className="w-3 h-3" />
                      Context Sub-Agents
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {agent.subAgents.map((subAgent) => (
                        <div
                          key={subAgent.id}
                          className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-white font-medium text-xs">{subAgent.name}</h5>
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></div>
                              <span className="text-purple-400 text-xs">{subAgent.status}</span>
                            </div>
                          </div>
                          <p className="text-white/60 text-xs mb-2">{subAgent.description}</p>
                          <div className="bg-purple-500/10 rounded p-2 mb-2">
                            <div className="text-white/40 text-xs mb-1">Signals:</div>
                            <div className="text-white text-xs">{subAgent.signals}</div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-white/60">
                            <Clock className="w-3 h-3" />
                            <span>{subAgent.lastAction}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-all">
                    View Details
                  </button>
                  <button className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-all">
                    Configure
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-[#2a2f3a] to-[#1f2329] border-t border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>Last updated: Just now</span>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium">
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgentCenterDrawer;

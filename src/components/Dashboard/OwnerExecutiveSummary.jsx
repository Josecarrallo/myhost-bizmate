import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  TrendingUp,
  Home,
  Calendar,
  DollarSign,
  AlertCircle,
  CreditCard,
  Package,
  Users,
  Target,
  MessageSquare,
  PhoneCall,
  Eye,
  ArrowRight,
  Inbox,
  Phone,
  Clock
} from 'lucide-react';
import { dataService } from '../../services/data';

const OwnerExecutiveSummary = ({ userName = 'José', onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
  const [checkOuts, setCheckOuts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [aiStats, setAiStats] = useState({
    lumina: null,
    banyu: null,
    kora: null,
    osiris: null
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, checkInsData, checkOutsData, alertsData, luminaData, banyuData, koraData, osirisData] = await Promise.all([
        dataService.getDashboardStats(),
        dataService.getTodayCheckIns(),
        dataService.getTodayCheckOuts(),
        dataService.getActiveAlerts(),
        dataService.getLuminaStats(),
        dataService.getBanyuStats(),
        dataService.getKoraStats(),
        dataService.getOsirisStats()
      ]);

      setStats(statsData);
      setCheckIns(checkInsData);
      setCheckOuts(checkOutsData);
      setAlerts(alertsData);
      setAiStats({
        lumina: luminaData,
        banyu: banyuData,
        kora: koraData,
        osiris: osirisData
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="flex-1 bg-[#2a2f3a] flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Loading dashboard...</div>
      </div>
    );
  }

  // KPIs from real data
  const kpis = [
    {
      label: 'Total Revenue',
      value: `$${stats?.total_revenue?.toLocaleString() || '0'}`,
      change: '+12%',
      subtext: 'All time',
      trend: 'up',
      icon: DollarSign,
      color: 'from-[#1f2937] to-[#374151]'
    },
    {
      label: 'Occupancy Rate',
      value: `${stats?.occupancy_rate || 0}%`,
      change: '+5%',
      subtext: 'Active bookings',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-[#1f2937] to-[#374151]'
    },
    {
      label: 'Active Bookings',
      value: stats?.active_bookings || 0,
      change: '+3',
      subtext: 'Confirmed',
      trend: 'up',
      icon: Calendar,
      color: 'from-[#1f2937] to-[#374151]'
    },
    {
      label: 'Properties',
      value: stats?.total_properties || 0,
      change: '',
      subtext: 'Active listings',
      trend: 'up',
      icon: Home,
      color: 'from-[#1f2937] to-[#374151]'
    }
  ];

  // Action Queue from real data
  const actionQueue = [
    ...(checkOuts.length > 0
      ? [
          {
            icon: Package,
            label: `${checkOuts.length} Check-out${checkOuts.length > 1 ? 's' : ''} today`,
            time: 'Today',
            status: 'Pending',
            statusColor: 'orange',
            details: checkOuts.map((c) => c.guest_name).join(', ')
          }
        ]
      : []),
    ...alerts.map((alert) => ({
      icon: alert.severity === 'warning' ? AlertCircle : CreditCard,
      label: alert.message,
      time: new Date(alert.created_at).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: alert.severity === 'warning' ? 'Needs Action' : 'Info',
      statusColor: alert.severity === 'warning' ? 'orange' : 'blue',
      alert: alert.severity === 'warning'
    }))
  ];

  return (
    <div className="flex-1 bg-gray-900 overflow-auto relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-[#d85a2a]/5 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Content wrapper with relative z-index */}
      <div className="relative z-10">
        {/* Main Content */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Greeting */}
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">
            {getGreeting()}, {userName}
          </h2>
          <p className="text-lg sm:text-xl text-white/90 font-semibold mb-6 sm:mb-8">
            Owner Executive Summary - {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>

          {/* AI Snapshot Card */}
          <div className="bg-[#1f2937] border border-[#d85a2a]/20 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex items-start gap-3 sm:gap-4 flex-1 w-full">
                <div className="p-2 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] rounded-lg flex-shrink-0">
                  <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                    MyHost AI - Today's Snapshot
                  </h3>
                  <p className="text-white/90 text-base leading-relaxed mb-1">
                    You have {stats?.active_bookings || 0} active booking{stats?.active_bookings !== 1 ? 's' : ''} with an occupancy rate of {stats?.occupancy_rate || 0}%.
                    {checkIns.length > 0 && ` ${checkIns.length} guest${checkIns.length > 1 ? 's are' : ' is'} checking in today.`}
                  </p>
                  <p className="text-white/90 text-base leading-relaxed">
                    Total revenue: ${stats?.total_revenue?.toLocaleString() || '0'}. Average nightly rate: ${stats?.avg_nightly_rate?.toFixed(0) || '0'}.
                  </p>
                </div>
              </div>
              <button className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] hover:opacity-90 text-white rounded-lg font-medium text-sm whitespace-nowrap transition-colors flex-shrink-0">
                Ask MyHost AI
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {kpis.map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <div key={index} className={`bg-gradient-to-br ${kpi.color} rounded-xl p-3 sm:p-4 border border-[#d85a2a]/20 shadow-xl`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs sm:text-sm text-white/80 font-medium">{kpi.label}</p>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 flex-shrink-0" />
                  </div>
                  <div className="mb-1">
                    <span className="text-xl sm:text-2xl font-bold text-white block">{kpi.value}</span>
                    {kpi.change && (
                      <span className="text-xs sm:text-sm font-medium text-[#10b981] inline-block mt-1">
                        {kpi.change}
                      </span>
                    )}
                  </div>
                  {kpi.subtext && (
                    <p className="text-xs sm:text-sm text-white/70">{kpi.subtext}</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* 4 AI Agents Section */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-[#FF8C42]" />
              Your AI Team (4 Agents)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* LUMINA.AI */}
              <button
                onClick={() => onNavigate?.('leads-inbox')}
                className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-5 hover:scale-105 transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Target className="w-6 h-6 text-purple-300" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
                </div>
                <h4 className="text-lg font-bold text-white mb-1">🌟 LUMINA.AI</h4>
                <p className="text-sm text-white/80 mb-3">Sales & Leads</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">New Leads</span>
                    <span className="text-purple-300 font-bold">{aiStats.lumina?.new_leads || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">In Pipeline</span>
                    <span className="text-purple-300 font-bold">{aiStats.lumina?.in_pipeline || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Follow-ups</span>
                    <span className="text-orange-300 font-bold">{aiStats.lumina?.pending_followups || 0}</span>
                  </div>
                </div>
              </button>

              {/* BANYU.AI */}
              <button
                onClick={() => onNavigate?.('guest-communications')}
                className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-5 hover:scale-105 transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-green-300" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
                </div>
                <h4 className="text-lg font-bold text-white mb-1">💧 BANYU.AI</h4>
                <p className="text-sm text-white/80 mb-3">WhatsApp Concierge</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Messages Today</span>
                    <span className="text-green-300 font-bold">{aiStats.banyu?.messages_today || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Active Conversations</span>
                    <span className="text-green-300 font-bold">{aiStats.banyu?.active_conversations || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Response Time</span>
                    <span className="text-blue-300 font-bold">
                      {aiStats.banyu?.avg_response_time_minutes ? `${aiStats.banyu.avg_response_time_minutes.toFixed(1)}min` : 'N/A'}
                    </span>
                  </div>
                </div>
              </button>

              {/* KORA.AI */}
              <button
                onClick={() => onNavigate?.('kora-call-logs')}
                className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-xl p-5 hover:scale-105 transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <PhoneCall className="w-6 h-6 text-blue-300" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
                </div>
                <h4 className="text-lg font-bold text-white mb-1">📞 KORA.AI</h4>
                <p className="text-sm text-white/80 mb-3">Voice Concierge</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Calls Today</span>
                    <span className="text-blue-300 font-bold">{aiStats.kora?.calls_today || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Avg Duration</span>
                    <span className="text-blue-300 font-bold">
                      {aiStats.kora?.avg_duration_seconds ? `${Math.floor(aiStats.kora.avg_duration_seconds / 60)}:${String(aiStats.kora.avg_duration_seconds % 60).padStart(2, '0')}` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Sentiment</span>
                    <span className="text-green-300 font-bold">
                      {aiStats.kora?.positive_sentiment_pct ? `😊 ${aiStats.kora.positive_sentiment_pct}%` : 'N/A'}
                    </span>
                  </div>
                </div>
              </button>

              {/* OSIRIS.AI */}
              <button
                onClick={() => onNavigate?.('agents-monitor')}
                className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-5 hover:scale-105 transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Eye className="w-6 h-6 text-orange-300" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
                </div>
                <h4 className="text-lg font-bold text-white mb-1">👁️ OSIRIS.AI</h4>
                <p className="text-sm text-white/80 mb-3">Operations & Control</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Active Workflows</span>
                    <span className="text-orange-300 font-bold">{aiStats.osiris?.active_workflows || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Alerts</span>
                    <span className="text-red-300 font-bold">{aiStats.osiris?.active_alerts || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">System Health</span>
                    <span className={`font-bold ${
                      aiStats.osiris?.system_health === 'good' ? 'text-green-300' :
                      aiStats.osiris?.system_health === 'warning' ? 'text-orange-300' :
                      'text-red-300'
                    }`}>
                      {aiStats.osiris?.system_health === 'good' ? '✓ Good' :
                       aiStats.osiris?.system_health === 'warning' ? '⚠ Warning' :
                       aiStats.osiris?.system_health === 'error' ? '✗ Error' : 'Unknown'}
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">Recent Activity</h3>
            <div className="bg-[#1f2937] rounded-xl border border-[#d85a2a]/20 overflow-hidden">
              <div className="divide-y divide-[#d85a2a]/10">
                {/* Activity 1 */}
                <div className="p-4 hover:bg-[#d85a2a]/5 transition-colors flex items-start gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg flex-shrink-0">
                    <Inbox className="w-5 h-5 text-purple-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">New lead from Instagram</p>
                    <p className="text-white/60 text-sm">Sarah Johnson inquiring about honeymoon package → added to LUMINA Inbox</p>
                    <p className="text-white/40 text-xs mt-1">2 minutes ago</p>
                  </div>
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs font-medium">New</span>
                </div>

                {/* Activity 2 */}
                <div className="p-4 hover:bg-[#d85a2a]/5 transition-colors flex items-start gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                    <Phone className="w-5 h-5 text-blue-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">KORA call summary created</p>
                    <p className="text-white/60 text-sm">Michael Chen called about villa availability → lead qualified and sent to LUMINA</p>
                    <p className="text-white/40 text-xs mt-1">15 minutes ago</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-medium">Qualified</span>
                </div>

                {/* Activity 3 */}
                <div className="p-4 hover:bg-[#d85a2a]/5 transition-colors flex items-start gap-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg flex-shrink-0">
                    <Clock className="w-5 h-5 text-orange-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Follow-up message scheduled</p>
                    <p className="text-white/60 text-sm">LUMINA scheduled WhatsApp follow-up for Emma Watson tomorrow at 10 AM</p>
                    <p className="text-white/40 text-xs mt-1">1 hour ago</p>
                  </div>
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs font-medium">Scheduled</span>
                </div>

                {/* Activity 4 */}
                <div className="p-4 hover:bg-[#d85a2a]/5 transition-colors flex items-start gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-green-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Guest Journey message sent</p>
                    <p className="text-white/60 text-sm">BANYU sent pre-arrival info to David Miller (check-in tomorrow)</p>
                    <p className="text-white/40 text-xs mt-1">2 hours ago</p>
                  </div>
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs font-medium">Sent</span>
                </div>

                {/* Activity 5 */}
                <div className="p-4 hover:bg-[#d85a2a]/5 transition-colors flex items-start gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Owner alert generated</p>
                    <p className="text-white/60 text-sm">OSIRIS detected payment pending for booking #1234 → requires attention</p>
                    <p className="text-white/40 text-xs mt-1">3 hours ago</p>
                  </div>
                  <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs font-medium">Alert</span>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Activity */}
          {checkIns.length > 0 && (
            <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-xl p-6 mb-6 border border-[#d85a2a]/20 shadow-xl">
              <h3 className="text-xl font-bold text-[#FF8C42] mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                Check-ins Today ({checkIns.length})
              </h3>
              <div className="space-y-3">
                {checkIns.map((checkin) => (
                  <div key={checkin.booking_id} className="bg-[#2a2f3a] rounded-lg p-4 border border-[#d85a2a]/20">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-[#FF8C42]">{checkin.guest_name}</p>
                        <p className="text-sm text-white/80">{checkin.property_name}</p>
                        <p className="text-xs text-white/60 mt-1">
                          {checkin.guests} guest{checkin.guests > 1 ? 's' : ''} • {checkin.nights} night{checkin.nights > 1 ? 's' : ''}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-[#10b981]/20 text-[#10b981] rounded-full text-xs font-bold">
                        Today
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Queue */}
          {actionQueue.length > 0 && (
            <div className="bg-[#1f2937] rounded-xl border border-[#d85a2a]/20 shadow-xl">
              <div className="px-6 py-4 border-b border-[#d85a2a]/10 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Action Queue</h3>
                <button
                  onClick={loadDashboardData}
                  className="text-sm text-[#FF8C42] hover:text-[#f5a524] font-medium"
                >
                  Refresh ↻
                </button>
              </div>
              <div className="divide-y divide-[#d85a2a]/10">
                {actionQueue.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-[#d85a2a]/5 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`p-2 rounded-lg ${action.alert ? 'bg-[#d85a2a]/20' : 'bg-[#3b82f6]/20'}`}>
                          <Icon className={`w-5 h-5 ${action.alert ? 'text-[#FF8C42]' : 'text-[#3b82f6]'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white">{action.label}</p>
                          <p className="text-sm text-white/60">{action.time}</p>
                          {action.details && (
                            <p className="text-xs text-white/50 mt-1">{action.details}</p>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        action.statusColor === 'orange'
                          ? 'bg-[#d85a2a]/20 text-[#FF8C42]'
                          : 'bg-[#3b82f6]/20 text-[#3b82f6]'
                      }`}>
                        {action.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-xl p-4 border border-[#d85a2a]/20 text-center shadow-lg">
              <div className="text-[#FF8C42] mb-2"><Users className="w-6 h-6 mx-auto" /></div>
              <p className="text-2xl font-bold text-[#FF8C42]">{stats?.guests_this_month || 0}</p>
              <p className="text-xs text-white/80 font-medium">Guests (this month)</p>
            </div>
            <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-xl p-4 border border-[#d85a2a]/20 text-center shadow-lg">
              <div className="text-[#10b981] mb-2"><Calendar className="w-6 h-6 mx-auto" /></div>
              <p className="text-2xl font-bold text-[#10b981]">{stats?.confirmed_bookings || 0}</p>
              <p className="text-xs text-white/80 font-medium">Confirmed</p>
            </div>
            <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-xl p-4 border border-[#d85a2a]/20 text-center shadow-lg">
              <div className="text-[#FF8C42] mb-2"><AlertCircle className="w-6 h-6 mx-auto" /></div>
              <p className="text-2xl font-bold text-[#FF8C42]">{stats?.pending_bookings || 0}</p>
              <p className="text-xs text-white/80 font-medium">Pending</p>
            </div>
            <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-xl p-4 border border-[#d85a2a]/20 text-center shadow-lg">
              <div className="text-[#3b82f6] mb-2"><DollarSign className="w-6 h-6 mx-auto" /></div>
              <p className="text-2xl font-bold text-[#3b82f6]">${stats?.avg_nightly_rate?.toFixed(0) || 0}</p>
              <p className="text-xs text-white/80 font-medium">Avg/Night</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerExecutiveSummary;



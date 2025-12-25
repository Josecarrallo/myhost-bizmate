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
  Users
} from 'lucide-react';
import { dataService } from '../../services/data';

const OwnerExecutiveSummary = ({ userName = 'José' }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
  const [checkOuts, setCheckOuts] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, checkInsData, checkOutsData, alertsData] = await Promise.all([
        dataService.getDashboardStats(),
        dataService.getTodayCheckIns(),
        dataService.getTodayCheckOuts(),
        dataService.getActiveAlerts()
      ]);

      setStats(statsData);
      setCheckIns(checkInsData);
      setCheckOuts(checkOutsData);
      setAlerts(alertsData);
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
    <div className="flex-1 bg-[#2a2f3a] overflow-auto relative">
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
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">
            {getGreeting()}, {userName}
          </h2>
          <p className="text-base sm:text-lg text-white/90 font-semibold mb-6 sm:mb-8">
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
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                    MyHost AI - Today's Snapshot
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed mb-1">
                    You have {stats?.active_bookings || 0} active booking{stats?.active_bookings !== 1 ? 's' : ''} with an occupancy rate of {stats?.occupancy_rate || 0}%.
                    {checkIns.length > 0 && ` ${checkIns.length} guest${checkIns.length > 1 ? 's are' : ' is'} checking in today.`}
                  </p>
                  <p className="text-white/90 text-sm leading-relaxed">
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
                <div key={index} className={`bg-gradient-to-br ${kpi.color} rounded-xl p-4 sm:p-6 border border-[#d85a2a]/20 shadow-xl`}>
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-xs sm:text-sm text-white/80 font-medium">{kpi.label}</p>
                    <Icon className="w-5 h-5 text-white/80" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl sm:text-3xl font-bold text-white">{kpi.value}</span>
                    {kpi.change && (
                      <span className="text-sm font-medium text-[#10b981]">
                        {kpi.change}
                      </span>
                    )}
                  </div>
                  {kpi.subtext && (
                    <p className="text-sm text-white/70">{kpi.subtext}</p>
                  )}
                </div>
              );
            })}
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
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
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


import React, { useState, useEffect } from 'react';
import {
  Zap,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  DollarSign,
  MessageSquare,
  Bell,
  ThumbsUp,
  ThumbsDown,
  Eye,
  X
} from 'lucide-react';

const Autopilot = ({ onBack }) => {
  const [activeView, setActiveView] = useState('daily'); // 'daily', 'weekly', 'monthly'
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [lastSummaryGenerated, setLastSummaryGenerated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Real data from Supabase
  const [todayMetrics, setTodayMetrics] = useState({
    newInquiries: 0,
    pendingPayments: 0,
    confirmedBookings: 0,
    checkInsToday: 0,
    expiredHolds: 0
  });

  const [alerts, setAlerts] = useState([]);
  const [actionsNeedingApproval, setActionsNeedingApproval] = useState([]);

  const SUPABASE_URL = 'https://jjpscimtxrudtepzwhag.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0';
  const TENANT_ID = 'c24393db-d318-4d75-8bbf-0fa240b9c1db';

  // Load data on mount
  useEffect(() => {
    fetchTodayMetrics();
    fetchAlerts();
    fetchActions();
  }, []);

  // Helper: Format time ago
  const formatTimeAgo = (timestamp) => {
    const minutes = Math.floor((new Date() - new Date(timestamp)) / 60000);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  // Fetch today's metrics from Supabase
  const fetchTodayMetrics = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_daily_summary`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ p_tenant_id: TENANT_ID })
      });

      if (response.ok) {
        const data = await response.json();
        setTodayMetrics({
          newInquiries: data.new_inquiries || 0,
          pendingPayments: data.pending_payments || 0,
          confirmedBookings: data.confirmed_bookings || 0,
          checkInsToday: data.checkins_today || 0,
          expiredHolds: data.expired_holds || 0
        });
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch alerts from Supabase
  const fetchAlerts = async () => {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/autopilot_alerts?tenant_id=eq.${TENANT_ID}&status=eq.active&order=created_at.desc&limit=10`,
        {
          headers: { 'apikey': SUPABASE_KEY }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAlerts(data.map(alert => ({
          id: alert.id,
          type: alert.alert_type,
          message: alert.message,
          time: formatTimeAgo(alert.created_at)
        })));
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  // Fetch actions needing approval from Supabase
  const fetchActions = async () => {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/autopilot_actions?tenant_id=eq.${TENANT_ID}&status=eq.pending&order=priority.desc,created_at.desc`,
        {
          headers: { 'apikey': SUPABASE_KEY }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setActionsNeedingApproval(data.map(action => ({
          id: action.id,
          type: action.action_type,
          guest: action.details?.guest_name || 'Unknown',
          booking: action.details?.booking_reference || 'N/A',
          action: action.description,
          status: action.status
        })));
      }
    } catch (error) {
      console.error('Error fetching actions:', error);
    }
  };

  // Handle action approval
  const handleApprove = async (actionId) => {
    try {
      const response = await fetch('https://n8n-production-bb2d.up.railway.app/webhook/autopilot/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          action_id: actionId,
          user_id: TENANT_ID
        })
      });

      if (response.ok) {
        alert('Action approved successfully!');
        fetchActions(); // Refresh actions list
      } else {
        alert('Error approving action. Please try again.');
      }
    } catch (error) {
      console.error('Error approving action:', error);
      alert('Error connecting to server. Please try again.');
    }
  };

  const handleReject = async (actionId) => {
    try {
      const response = await fetch('https://n8n-production-bb2d.up.railway.app/webhook/autopilot/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          action_id: actionId,
          user_id: TENANT_ID
        })
      });

      if (response.ok) {
        alert('Action rejected successfully!');
        fetchActions(); // Refresh actions list
      } else {
        alert('Error rejecting action. Please try again.');
      }
    } catch (error) {
      console.error('Error rejecting action:', error);
      alert('Error connecting to server. Please try again.');
    }
  };

  // Generate Daily Summary - Calls WF-D3 workflow
  const handleGenerateDailySummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const response = await fetch('https://n8n-production-bb2d.up.railway.app/webhook/autopilot/daily-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: TENANT_ID,
          property_id: '18711359-1378-4d12-9ea6-fb31c0b1bac2',
          date: new Date().toISOString().split('T')[0]
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTodayMetrics({
          newInquiries: data.new_inquiries || 0,
          pendingPayments: data.pending_payments || 0,
          confirmedBookings: data.confirmed_today || 0,
          checkInsToday: data.checkins || 0,
          expiredHolds: data.expired || 0
        });
        setLastSummaryGenerated(new Date().toLocaleTimeString());
        alert('Daily Summary generated successfully!');
      } else {
        alert('Failed to generate Daily Summary. Using cached data.');
      }
    } catch (error) {
      console.error('Error generating Daily Summary:', error);
      alert('Error connecting to workflow. Using cached data.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  return (
    <div className="flex-1 h-screen bg-[#2a2f3a] p-4 pb-24 relative overflow-auto">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-[#d85a2a]/5 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl hover:bg-[#1f2937] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#d85a2a]/20">
            <X className="w-6 h-6 text-[#FF8C42]" />
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl">Autopilot</h2>
          </div>
          <div className="w-16"></div>
        </div>

        {/* View Selector */}
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-3 shadow-lg border-2 border-[#d85a2a]/20 mb-6">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveView('daily')}
              className={`
                flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all
                ${activeView === 'daily'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-[#FF8C42] border-2 border-gray-200 hover:border-orange-300'
                }
              `}
            >
              <Calendar className="w-5 h-5" />
              Daily
            </button>
            <button
              onClick={() => setActiveView('weekly')}
              className={`
                flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all
                ${activeView === 'weekly'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-[#FF8C42] border-2 border-gray-200 hover:border-orange-300'
                }
              `}
            >
              <TrendingUp className="w-5 h-5" />
              Weekly
            </button>
            <button
              onClick={() => setActiveView('monthly')}
              className={`
                flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all
                ${activeView === 'monthly'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-[#FF8C42] border-2 border-gray-200 hover:border-orange-300'
                }
              `}
            >
              <Calendar className="w-5 h-5" />
              Monthly
            </button>
          </div>
        </div>

      {/* DAILY VIEW */}
      {activeView === 'daily' && (
        <div className="space-y-6">
          {/* A) TODAY AT A GLANCE - KPI Cards */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-black text-[#FF8C42]">Today at a Glance</h3>
              <button
                onClick={handleGenerateDailySummary}
                disabled={isGeneratingSummary}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg font-medium transition-all flex items-center gap-2"
              >
                {isGeneratingSummary ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Generate Summary
                  </>
                )}
              </button>
            </div>
            {lastSummaryGenerated && (
              <p className="text-orange-100 text-sm mb-3">Last updated: {lastSummaryGenerated}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* New Inquiries */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <MessageSquare className="w-6 h-6 text-orange-600" />
                  <span className="text-3xl font-bold text-gray-900">{todayMetrics.newInquiries}</span>
                </div>
                <p className="text-gray-700 text-sm">New Inquiries</p>
              </div>

              {/* Pending Payments */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-6 h-6 text-yellow-600" />
                  <span className="text-3xl font-bold text-gray-900">{todayMetrics.pendingPayments}</span>
                </div>
                <p className="text-gray-700 text-sm">Pending Payments</p>
              </div>

              {/* Confirmed Bookings */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-3xl font-bold text-gray-900">{todayMetrics.confirmedBookings}</span>
                </div>
                <p className="text-gray-700 text-sm">Confirmed Today</p>
              </div>

              {/* Check-ins Today */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-6 h-6 text-purple-600" />
                  <span className="text-3xl font-bold text-gray-900">{todayMetrics.checkInsToday}</span>
                </div>
                <p className="text-gray-700 text-sm">Check-ins Today</p>
              </div>

              {/* Expired Holds */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <span className="text-3xl font-bold text-gray-900">{todayMetrics.expiredHolds}</span>
                </div>
                <p className="text-gray-700 text-sm">Expired Holds</p>
              </div>
            </div>
          </div>

          {/* B) ALERTS */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
            <h3 className="text-2xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
              <Bell className="w-6 h-6 text-[#FF8C42]" />
              Alerts
            </h3>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`
                    rounded-lg p-4 border flex items-start gap-4
                    ${alert.type === 'urgent' ? 'border-red-300 bg-red-50' : ''}
                    ${alert.type === 'warning' ? 'border-yellow-300 bg-yellow-50' : ''}
                    ${alert.type === 'info' ? 'border-blue-300 bg-blue-50' : ''}
                  `}
                >
                  <AlertCircle
                    className={`
                      w-5 h-5 flex-shrink-0 mt-1
                      ${alert.type === 'urgent' ? 'text-red-600' : ''}
                      ${alert.type === 'warning' ? 'text-yellow-600' : ''}
                      ${alert.type === 'info' ? 'text-blue-600' : ''}
                    `}
                  />
                  <div className="flex-1">
                    <p className="text-[#FF8C42] font-medium">{alert.message}</p>
                    <p className="text-gray-400 text-sm mt-1">{alert.time}</p>
                  </div>
                  <button className="p-2 bg-[#2a2f3a] hover:bg-[#374151] rounded-lg transition-all">
                    <Eye className="w-5 h-5 text-[#FF8C42]" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* C) ACTIONS (Needs Approval) */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
            <h3 className="text-2xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-[#FF8C42]" />
              Actions Needing Approval
            </h3>
            <div className="space-y-4">
              {actionsNeedingApproval.map((action) => (
                <div
                  key={action.id}
                  className="bg-[#2a2f3a] rounded-lg p-4 border-2 border-gray-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`
                            px-3 py-1 rounded-full text-xs font-medium
                            ${action.type === 'payment_expired' ? 'bg-red-100 text-red-700' : ''}
                            ${action.type === 'special_request' ? 'bg-orange-100 text-orange-700' : ''}
                            ${action.type === 'pricing' ? 'bg-yellow-100 text-yellow-700' : ''}
                          `}
                        >
                          {action.type.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[#FF8C42] font-medium text-lg">{action.guest}</p>
                      <p className="text-gray-400 text-sm">{action.booking}</p>
                      <p className="text-gray-300 mt-2">{action.action}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-3 border-t-2 border-gray-200">
                    <button
                      onClick={() => handleApprove(action.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all"
                    >
                      <ThumbsUp className="w-5 h-5" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(action.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all"
                    >
                      <ThumbsDown className="w-5 h-5" />
                      Reject
                    </button>
                    <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* D) QUICK BUTTONS */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
            <h3 className="text-2xl font-black text-[#FF8C42] mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="bg-[#2a2f3a] hover:bg-[#374151] rounded-xl p-4 transition-all border-2 border-gray-200 hover:border-orange-300">
                <MessageSquare className="w-6 h-6 text-[#FF8C42] mb-2" />
                <p className="text-[#FF8C42] font-medium text-sm">View All Inquiries</p>
              </button>
              <button className="bg-[#2a2f3a] hover:bg-[#374151] rounded-xl p-4 transition-all border-2 border-gray-200 hover:border-orange-300">
                <DollarSign className="w-6 h-6 text-[#FF8C42] mb-2" />
                <p className="text-[#FF8C42] font-medium text-sm">Payment Follow-ups</p>
              </button>
              <button className="bg-[#2a2f3a] hover:bg-[#374151] rounded-xl p-4 transition-all border-2 border-gray-200 hover:border-orange-300">
                <Calendar className="w-6 h-6 text-[#FF8C42] mb-2" />
                <p className="text-[#FF8C42] font-medium text-sm">Today's Schedule</p>
              </button>
              <button className="bg-[#2a2f3a] hover:bg-[#374151] rounded-xl p-4 transition-all border-2 border-gray-200 hover:border-orange-300">
                <Bell className="w-6 h-6 text-[#FF8C42] mb-2" />
                <p className="text-[#FF8C42] font-medium text-sm">View All Alerts</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WEEKLY VIEW (Placeholder) */}
      {activeView === 'weekly' && (
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
          <h3 className="text-2xl font-black text-[#FF8C42] mb-4">Weekly Summary</h3>
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-[#FF8C42] text-lg">Weekly Autopilot features coming soon...</p>
            <p className="text-gray-400 text-sm mt-2">
              This will include weekly performance metrics, trends, and automated insights.
            </p>
          </div>
        </div>
      )}

      {/* MONTHLY VIEW (Placeholder) */}
      {activeView === 'monthly' && (
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
          <h3 className="text-2xl font-black text-[#FF8C42] mb-4">Monthly Summary</h3>
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-[#FF8C42] text-lg">Monthly Autopilot features coming soon...</p>
            <p className="text-gray-400 text-sm mt-2">
              This will include monthly revenue reports, occupancy analysis, and strategic recommendations.
            </p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Autopilot;

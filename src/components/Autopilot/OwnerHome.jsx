import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Home,
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  Bell,
  ThumbsUp,
  ThumbsDown,
  Eye,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

const OwnerHome = ({ onBack, propertyId: propPropertyId, tenantId: propTenantId }) => {
  // State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // Silent refresh without full loading screen
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [propertyId, setPropertyId] = useState(propPropertyId);
  const [tenantId, setTenantId] = useState(propTenantId);
  const [expandedSections, setExpandedSections] = useState({
    arrivals: false,
    departures: false,
    autoResolved: false
  });
  const [actionLoading, setActionLoading] = useState({});

  // Load data from aggregator
  const loadData = async (silent = false, explicitPropertyId = null, explicitTenantId = null) => {
    // Use explicit IDs if provided, otherwise use state
    const usePropertyId = explicitPropertyId || propertyId;
    const useTenantId = explicitTenantId || tenantId;

    if (!usePropertyId || !useTenantId) {
      console.error('❌ [OWNER HOME] Cannot load - missing IDs:', { usePropertyId, useTenantId });
      return;
    }

    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    console.log('🔍 [OWNER HOME] Loading data with:', { property_id: usePropertyId, tenant_id: useTenantId, silent });

    try {
      const response = await fetch('https://n8n-production-bb2d.up.railway.app/webhook/owner-home-v1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_id: usePropertyId,
          tenant_id: useTenantId
        })
      });

      console.log('🔍 [OWNER HOME] Response status:', response.status);
      console.log('🔍 [OWNER HOME] Response headers:', response.headers.get('content-type'));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON response, got: ${contentType || 'no content-type'}`);
      }

      const text = await response.text();
      console.log('🔍 [OWNER HOME] Raw response:', text.substring(0, 200));

      if (!text || text.trim() === '') {
        throw new Error('Empty response from aggregator');
      }

      const result = JSON.parse(text);
      console.log('✅ Owner Home data loaded:', result);
      setData(result);
    } catch (err) {
      console.error('❌ Error loading Owner Home data:', err);
      if (!silent) {
        setError(err.message || 'Failed to load data');
      }
    } finally {
      if (silent) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Handle approve/reject actions
  const handleDecisionAction = async (decisionId, action) => {
    console.log(`🔄 [DECISION ACTION] ========== CALLED ==========`);
    console.log(`🔄 [DECISION ACTION] Starting ${action} for decision:`, decisionId);
    console.log(`🔄 [DECISION ACTION] Current actionLoading state:`, actionLoading);

    // GUARD: Prevent multiple clicks on same item
    if (actionLoading[decisionId]) {
      console.warn(`⚠️ [DECISION ACTION] Already processing ${decisionId}, ignoring duplicate call`);
      return;
    }

    setActionLoading(prev => ({ ...prev, [decisionId]: action }));

    try {
      const payload = {
        action: action, // 'approve' or 'reject'
        decision_id: decisionId,
        action_by: 'owner'
      };
      console.log('📤 [DECISION ACTION] Sending payload:', payload);

      const response = await fetch('https://n8n-production-bb2d.up.railway.app/webhook/autopilot/decision-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('📥 [DECISION ACTION] Response status:', response.status);
      console.log('📥 [DECISION ACTION] Response headers:', response.headers.get('content-type'));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [DECISION ACTION] Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Try to parse response
      const responseText = await response.text();
      console.log('📥 [DECISION ACTION] Response body:', responseText);

      if (responseText) {
        try {
          const responseData = JSON.parse(responseText);
          console.log('✅ [DECISION ACTION] Parsed response:', responseData);
        } catch (e) {
          console.log('⚠️ [DECISION ACTION] Response is not JSON:', responseText);
        }
      }

      console.log(`✅ Decision ${action}ed successfully:`, decisionId);

      // ✅ UPDATE LOCAL STATE: Change status to 'approved' or 'rejected' instead of removing
      setData(prevData => {
        if (!prevData) return prevData;

        const updateItemStatus = (items) => {
          if (!items) return items;
          return items.map(item =>
            item.id === decisionId
              ? { ...item, status: action === 'approve' ? 'approved' : 'rejected' }
              : item
          );
        };

        return {
          ...prevData,
          critical_now: updateItemStatus(prevData.critical_now),
          needs_your_decision: updateItemStatus(prevData.needs_your_decision),
          revenue_opportunities: updateItemStatus(prevData.revenue_opportunities)
        };
      });

      console.log(`✅ [DECISION ACTION] Local state updated - item ${decisionId} status changed to ${action === 'approve' ? 'approved' : 'rejected'}`);
    } catch (err) {
      console.error(`❌ [DECISION ACTION] Error:`, err);
      alert(`Error: ${err.message || 'Failed to ' + action + ' decision'}`);
    } finally {
      setActionLoading(prev => ({ ...prev, [decisionId]: null }));
    }
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Format currency
  const formatIDR = (amount) => {
    if (!amount) return 'Rp 0';
    const millions = (amount / 1000000).toFixed(1);
    return `Rp ${millions}M`;
  };

  // Format time ago
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const past = new Date(timestamp);
    const diffHours = Math.floor((now - past) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Less than 1 hour ago';
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'high':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      case 'low':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/40';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/40';
    }
  };

  // Initialize IDs and load data
  useEffect(() => {
    let cancelled = false; // Prevent race conditions

    const init = async () => {
      if (cancelled) return;
      try {
        let finalPropertyId = propPropertyId;
        let finalTenantId = propTenantId;

        // Only fetch IDs if not provided
        if (!finalPropertyId || !finalTenantId) {
          console.log('🔍 [OWNER HOME] IDs not provided, fetching from Supabase...');

          const { data: { user } } = await supabase.auth.getUser();

          if (!user) {
            console.error('❌ [OWNER HOME] No user logged in');
            if (!cancelled) {
              setError('No user logged in');
              setLoading(false);
            }
            return;
          }

          finalTenantId = finalTenantId || user.id;
          console.log('✅ [OWNER HOME] Using tenant_id:', finalTenantId);

          if (!finalPropertyId) {
            const { data: userProperty, error: propError } = await supabase
              .from('properties')
              .select('id, name')
              .eq('owner_id', finalTenantId)
              .single();

            if (propError || !userProperty) {
              console.error('❌ [OWNER HOME] Error fetching property:', propError);
              if (!cancelled) {
                setError('Could not load property. Please try again.');
                setLoading(false);
              }
              return;
            }

            finalPropertyId = userProperty.id;
            console.log('✅ [OWNER HOME] Found property:', userProperty.name, finalPropertyId);
          }
        }

        // Set state if not cancelled
        if (!cancelled) {
          setPropertyId(finalPropertyId);
          setTenantId(finalTenantId);
        }

        // Load data with the IDs we just got
        console.log('🔄 [OWNER HOME] Loading data with IDs:', { finalPropertyId, finalTenantId });

        // Call loadData with explicit IDs
        try {
          const response = await fetch('https://n8n-production-bb2d.up.railway.app/webhook/owner-home-v1', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              property_id: finalPropertyId,
              tenant_id: finalTenantId
            })
          });

          console.log('📥 [OWNER HOME] Response status:', response.status);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const text = await response.text();

          if (!text || text.trim() === '') {
            console.error('❌ [OWNER HOME] Empty response from aggregator');
            throw new Error('Empty response from aggregator');
          }

          console.log('📥 [OWNER HOME] Response received, length:', text.length, 'first 100 chars:', text.substring(0, 100));

          const result = JSON.parse(text);
          console.log('✅ [OWNER HOME] Data loaded successfully, sections:', Object.keys(result));

          if (!cancelled) {
            setData(result);
            setLoading(false);
          }
        } catch (err) {
          if (!cancelled) {
            console.error('❌ [OWNER HOME] Error loading data:', err);
            setError('Failed to load dashboard data. Please try again.');
            setLoading(false);
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error('❌ [OWNER HOME] Initialization error:', err);
          setError('Failed to initialize. Please refresh the page.');
          setLoading(false);
        }
      }
    };

    init();

    // Cleanup function to prevent race conditions
    return () => {
      cancelled = true;
    };
  }, []); // Only run once on mount

  // Calculate total items requiring attention (only pending items)
  const getTotalAttentionItems = () => {
    if (!data) return 0;
    const countPending = (items) => items?.filter(item => item.status === 'pending').length || 0;
    return countPending(data.critical_now) + countPending(data.needs_your_decision);
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Your Dashboard</h2>
          <p className="text-gray-400">Aggregating data from all sources...</p>
          <p className="text-gray-500 text-sm mt-2">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  // OLD SKELETON CODE REMOVED
  if (false) {
    return (
      <div className="p-6 space-y-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-700 rounded-xl animate-pulse"></div>
            <div>
              <div className="w-48 h-6 bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="w-32 h-4 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="w-24 h-10 bg-gray-700 rounded-xl animate-pulse"></div>
        </div>

        {/* Quick Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-[#1f2937] rounded-2xl p-6 border border-gray-700/50 animate-pulse">
              <div className="w-full h-20"></div>
            </div>
          ))}
        </div>

        {/* Priority Stack Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#1f2937] rounded-2xl p-6 border border-gray-700/50 animate-pulse">
              <div className="w-full h-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-white">Owner Home</h2>
        </div>

        <div className="bg-red-500/20 border border-red-500/40 rounded-2xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-300 font-semibold mb-2">Error loading data</p>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                window.location.reload();
              }}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY STATE
  if (!data || (
    (!data.critical_now || data.critical_now.length === 0) &&
    (!data.needs_your_decision || data.needs_your_decision.length === 0) &&
    (!data.today_operations || (
      data.today_operations.arrivals === 0 &&
      data.today_operations.departures === 0 &&
      data.today_operations.overdue_tasks === 0 &&
      data.today_operations.pending_messages === 0
    ))
  )) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-white">Owner Home</h2>
        </div>

        <div className="bg-green-500/20 border border-green-500/40 rounded-2xl p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <p className="text-green-300 font-semibold text-xl mb-2">Everything is in order today</p>
          <p className="text-gray-400">No items require your attention at this time.</p>
        </div>
      </div>
    );
  }

  const totalAttention = getTotalAttentionItems();

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 bg-gray-900 min-h-screen">
      {/* ========== 1. HEADER ========== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">Owner Home</h2>
              <p className="text-gray-400 text-xs md:text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <button
            onClick={() => loadData(false)}
            disabled={loading || refreshing}
            className="p-2 md:p-3 bg-[#1f2937] hover:bg-orange-500 text-gray-300 hover:text-white rounded-xl transition-colors disabled:opacity-50"
            title={refreshing ? 'Updating...' : 'Refresh data'}
          >
            <RefreshCw className={`w-4 h-4 md:w-5 md:h-5 ${(loading || refreshing) ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {totalAttention > 0 && (
          <div className="px-3 py-2 bg-orange-500/20 text-orange-300 rounded-xl font-bold border border-orange-500/40 text-center text-sm">
            {totalAttention} {totalAttention === 1 ? 'item' : 'items'} require attention
          </div>
        )}

        {refreshing && (
          <div className="px-3 py-2 bg-blue-500/20 text-blue-300 rounded-xl text-sm font-medium border border-blue-500/40 flex items-center justify-center gap-2">
            <div className="w-3 h-3 border-2 border-blue-300/40 border-t-blue-300 rounded-full animate-spin" />
            Updating...
          </div>
        )}
      </div>

      {/* ========== 2. QUICK STATS ========== */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#1f2937] rounded-xl p-3 border border-blue-500/40">
          <p className="text-gray-400 text-xs mb-1">Villas Occupied</p>
          <p className="text-xl font-bold text-blue-400">{data.quick_stats?.guests_in_house || 0}/3</p>
        </div>

        <div className="bg-[#1f2937] rounded-xl p-3 border border-yellow-500/40">
          <p className="text-gray-400 text-xs mb-1">Revenue</p>
          <p className="text-xl font-bold text-yellow-400">{formatIDR(data.quick_stats?.revenue_inhouse_idr || 0)}</p>
        </div>

        <div className="bg-[#1f2937] rounded-xl p-3 border border-orange-500/40">
          <p className="text-gray-400 text-xs mb-1">Overdue Tasks</p>
          <p className="text-xl font-bold text-orange-400">{data.today_operations?.overdue_tasks || 0}</p>
        </div>

        <div className="bg-[#1f2937] rounded-xl p-3 border border-green-500/40">
          <p className="text-gray-400 text-xs mb-1">Active Guests</p>
          <p className="text-xl font-bold text-green-400">{data.quick_stats?.guests_in_house || 0}</p>
        </div>
      </div>

      {/* ========== 3. PRIORITY STACK ========== */}

      {/* Critical Now */}
      {data.critical_now && data.critical_now.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-red-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Critical Now
          </h3>
          {data.critical_now.slice(0, 5).map(item => (
            <PriorityCard
              key={item.id}
              item={item}
              onApprove={() => handleDecisionAction(item.id, 'approve')}
              onReject={() => handleDecisionAction(item.id, 'reject')}
              actionLoading={actionLoading[item.id]}
              formatTimeAgo={formatTimeAgo}
              getPriorityColor={getPriorityColor}
            />
          ))}
        </div>
      )}

      {/* Needs Your Decision */}
      {data.needs_your_decision && data.needs_your_decision.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-orange-400 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Needs Your Decision
          </h3>
          {data.needs_your_decision.slice(0, 5).map(item => (
            <PriorityCard
              key={item.id}
              item={item}
              onApprove={() => handleDecisionAction(item.id, 'approve')}
              onReject={() => handleDecisionAction(item.id, 'reject')}
              actionLoading={actionLoading[item.id]}
              formatTimeAgo={formatTimeAgo}
              getPriorityColor={getPriorityColor}
            />
          ))}
        </div>
      )}

      {/* Revenue Opportunities - Always show with graceful empty state */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-green-400 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Revenue Opportunities
          {data.revenue_opportunities && data.revenue_opportunities.length > 0 && (
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
              {data.revenue_opportunities.length}
            </span>
          )}
        </h3>
        {data.revenue_opportunities && data.revenue_opportunities.length > 0 ? (
          data.revenue_opportunities.map((opp, idx) => (
            <PriorityCard
              key={idx}
              item={opp}
              priorityColor="green"
              onApprove={() => handleDecisionAction(opp.id, 'approve')}
              onReject={() => handleDecisionAction(opp.id, 'reject')}
              actionLoading={actionLoading[opp.id]}
            />
          ))
        ) : (
          <div className="bg-[#1f2937] rounded-2xl p-6 border border-green-500/20 text-center">
            <TrendingUp className="w-12 h-12 text-green-500/40 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No opportunities detected</p>
            <p className="text-gray-500 text-sm mt-1">The system constantly monitors for new revenue opportunities</p>
          </div>
        )}
      </div>

      {/* ========== 4. TODAY OPERATIONS ========== */}
      <div className="bg-[#1f2937] rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Home className="w-5 h-5" />
          Today Operations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Arrivals */}
          <div className="bg-[#2a2f3a] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-white font-semibold">Arrivals</span>
                <span className="text-green-400 font-bold">{data.today_operations?.arrivals || 0}</span>
              </div>
              {data.today_operations?.arrivals_detail?.length > 0 && (
                <button onClick={() => toggleSection('arrivals')} className="text-gray-400 hover:text-white">
                  {expandedSections.arrivals ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              )}
            </div>
            {expandedSections.arrivals && data.today_operations?.arrivals_detail?.length > 0 && (
              <div className="space-y-2 mt-3 pl-7">
                {data.today_operations.arrivals_detail.map((arrival, idx) => (
                  <div key={idx} className="text-sm text-gray-400">
                    • {arrival.guest_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Departures */}
          <div className="bg-[#2a2f3a] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5 text-purple-400" />
                <span className="text-white font-semibold">Departures</span>
                <span className="text-purple-400 font-bold">{data.today_operations?.departures || 0}</span>
              </div>
              {data.today_operations?.departures_detail?.length > 0 && (
                <button onClick={() => toggleSection('departures')} className="text-gray-400 hover:text-white">
                  {expandedSections.departures ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              )}
            </div>
            {expandedSections.departures && data.today_operations?.departures_detail?.length > 0 && (
              <div className="space-y-2 mt-3 pl-7">
                {data.today_operations.departures_detail.map((departure, idx) => (
                  <div key={idx} className="text-sm text-gray-400">
                    • {departure.guest_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Overdue Tasks */}
          <div className="bg-[#2a2f3a] rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-400" />
              <span className="text-white font-semibold">Overdue Tasks</span>
              <span className="text-red-400 font-bold">{data.today_operations?.overdue_tasks || 0}</span>
            </div>
          </div>

          {/* Pending Messages */}
          <div className="bg-[#2a2f3a] rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold">Pending Messages</span>
              <span className="text-yellow-400 font-bold">{data.today_operations?.pending_messages || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========== 5. SYSTEM ACTIVITY ========== */}
      <div className="bg-[#1f2937] rounded-2xl p-6 border border-green-500/40">
        <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          System Activity
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Auto-resolved */}
          <div className="bg-[#2a2f3a] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white font-semibold">Auto-resolved Today</span>
                <span className="text-green-400 font-bold">{data.system_activity?.auto_resolved_today || 0}</span>
              </div>
              {data.system_activity?.auto_resolved_items?.length > 0 && (
                <button onClick={() => toggleSection('autoResolved')} className="text-gray-400 hover:text-white">
                  {expandedSections.autoResolved ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              )}
            </div>
            {expandedSections.autoResolved && data.system_activity?.auto_resolved_items?.length > 0 && (
              <div className="space-y-2 mt-3 pl-7">
                {data.system_activity.auto_resolved_items.map((item, idx) => (
                  <div key={idx} className="text-sm text-gray-400">
                    • {item.type}: {item.guest} - {item.resolution}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Follow-ups sent */}
          <div className="bg-[#2a2f3a] rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-400" />
              <span className="text-white font-semibold">Follow-ups Sent</span>
              <span className="text-blue-400 font-bold">{data.system_activity?.followups_sent_today || 0}</span>
            </div>
          </div>

          {/* Alerts sent */}
          <div className="bg-[#2a2f3a] rounded-xl p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-400" />
              <span className="text-white font-semibold">Alerts Sent</span>
              <span className="text-orange-400 font-bold">{data.system_activity?.alerts_sent_today || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Priority Card Component
const PriorityCard = ({ item, onApprove, onReject, actionLoading, formatTimeAgo, getPriorityColor }) => {
  const isDecision = item.type === 'decision';
  const isPending = item.status === 'pending';

  return (
    <div className="bg-[#1f2937] rounded-2xl p-4 border border-gray-700/50 hover:border-orange-500/40 transition-colors">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${getPriorityColor(item.priority)}`}>
              {item.priority?.toUpperCase()}
            </span>
            <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40">
              {item.type === 'decision' ? 'Decision' : 'Task'}
            </span>
            {/* Status Badge - Show APPROVED or REJECTED */}
            {item.status === 'approved' && (
              <span className="px-2 py-1 rounded-lg text-xs font-bold bg-green-500/20 text-green-300 border border-green-500/40">
                APPROVED
              </span>
            )}
            {item.status === 'rejected' && (
              <span className="px-2 py-1 rounded-lg text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                REJECTED
              </span>
            )}
          </div>

          <h4 className="text-white font-bold text-base md:text-lg mb-2 break-words">{item.title}</h4>
          <p className="text-gray-400 text-sm mb-3 break-words">{item.summary}</p>

          {item.guest_name && (
            <div className="text-sm text-gray-400 mb-2">
              <span className="text-gray-500">Guest:</span> <span className="text-white">{item.guest_name}</span>
            </div>
          )}

          <div className="text-xs text-gray-500">
            {formatTimeAgo(item.created_at)}
          </div>

          {item.recommended_action && (
            <div className="mt-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl">
              <p className="text-orange-300 text-sm">
                <span className="font-semibold">Recommendation:</span> {item.recommended_action}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons - Only for pending decisions */}
        {isDecision && isPending && (
          <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
            <button
              onClick={onApprove}
              disabled={!!actionLoading}
              className="flex-1 md:flex-none px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {actionLoading === 'approve' ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <ThumbsUp className="w-4 h-4" />
              )}
              Approve
            </button>
            <button
              onClick={onReject}
              disabled={!!actionLoading}
              className="flex-1 md:flex-none px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {actionLoading === 'reject' ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <ThumbsDown className="w-4 h-4" />
              )}
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerHome;

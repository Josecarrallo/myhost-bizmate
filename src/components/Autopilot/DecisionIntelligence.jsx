import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star,
  DollarSign,
  User,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  MapPin,
  TrendingUp
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const DecisionIntelligence = ({ onBack, tenantId }) => {
  const [loading, setLoading] = useState(true);
  const [decisions, setDecisions] = useState([]);
  const [decisionContexts, setDecisionContexts] = useState({});
  const [autoResolvedExpanded, setAutoResolvedExpanded] = useState(true);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [guestStats, setGuestStats] = useState({});

  useEffect(() => {
    if (tenantId) {
      fetchDecisions();
      const interval = setInterval(fetchDecisions, 60000);
      return () => clearInterval(interval);
    }
  }, [tenantId]);

  const fetchDecisions = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 [Decision Intelligence] Fetching decisions for tenant:', tenantId);

      // Fetch all decisions
      const { data, error: fetchError } = await supabase
        .from('owner_decisions')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      console.log('✅ [Decision Intelligence] Fetched decisions:', data?.length || 0);
      setDecisions(data || []);

      // Fetch guest stats for all unique phones
      if (data && data.length > 0) {
        const uniquePhones = [...new Set(data.filter(d => d.guest_phone).map(d => d.guest_phone))];
        await fetchGuestStatsForPhones(uniquePhones);

        // Fetch context for each pending decision using get_decision_context RPC
        const pendingDecisions = data.filter(d => d.status === 'pending');
        await fetchDecisionContexts(pendingDecisions);
      }
    } catch (err) {
      console.error('❌ [Decision Intelligence] Error fetching decisions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDecisionContexts = async (pendingDecisions) => {
    const contexts = {};
    for (const decision of pendingDecisions) {
      try {
        const { data, error } = await supabase.rpc('get_decision_context', {
          p_decision_id: decision.id
        });
        if (!error && data) {
          contexts[decision.id] = data;
          console.log(`✅ [Decision Context] Loaded for ${decision.id}:`, data);
        }
      } catch (err) {
        console.warn(`⚠️ Could not fetch context for ${decision.id}:`, err);
      }
    }
    setDecisionContexts(contexts);
  };

  const fetchGuestStatsForPhones = async (phones) => {
    const statsMap = {};
    for (const phone of phones) {
      try {
        const { data, error } = await supabase.rpc('get_repeat_guest_stats', {
          p_tenant_id: tenantId,
          p_guest_phone: phone
        });
        if (!error && data) {
          statsMap[phone] = data;
        }
      } catch (err) {
        console.warn(`⚠️ Could not fetch stats for ${phone}:`, err);
      }
    }
    setGuestStats(statsMap);
  };

  const handleDecisionAction = async (decisionId, action) => {
    try {
      setActionInProgress(true);

      const { error } = await supabase
        .from('owner_decisions')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          approved_at: new Date().toISOString(),
          approved_by: tenantId,
          outcome_notes: `${action === 'approve' ? 'Approved' : 'Rejected'} by owner`
        })
        .eq('id', decisionId);

      if (error) throw error;

      await fetchDecisions();
    } catch (err) {
      console.error(`❌ Error ${action}ing decision:`, err);
      alert(`Error ${action}ing decision: ${err.message}`);
    } finally {
      setActionInProgress(false);
    }
  };

  const formatIDR = (amount) => {
    if (!amount) return 'IDR 0';
    return `IDR ${amount.toLocaleString('id-ID')}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Less than 1 hour ago';
  };

  const getCountdown = (dueDate) => {
    if (!dueDate) return null;
    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = due - now;

    if (diffMs < 0) {
      // Overdue
      const absMs = Math.abs(diffMs);
      const hours = Math.floor(absMs / (1000 * 60 * 60));
      const minutes = Math.floor((absMs % (1000 * 60 * 60)) / (1000 * 60));
      return { overdue: true, hours, minutes };
    } else {
      // Still time
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return { overdue: false, hours, minutes };
    }
  };

  const RecommendationBadge = ({ recommendedAction }) => {
    if (!recommendedAction) return null;
    const isApprove = recommendedAction.toUpperCase().startsWith('AUTO_APPROVE');
    const isEscalate = recommendedAction.toUpperCase().startsWith('ESCALATE');
    if (!isApprove && !isEscalate) return null;

    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
        isApprove ? 'bg-orange-100 text-orange-700 border border-orange-300' : 'bg-orange-100 text-orange-700 border border-orange-300'
      }`}>
        <Sparkles className="w-3 h-3" />
        System: {isApprove ? 'APPROVE' : 'ESCALATE'}
      </div>
    );
  };

  const GuestProfileStrip = ({ guestPhone, guestName }) => {
    const stats = guestStats[guestPhone];
    if (!stats) {
      // First-time guest
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-300">
          <User className="w-3 h-3" />
          {guestName || 'Guest'} · 1st visit
        </div>
      );
    }

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
        stats.is_vip
          ? 'bg-orange-100 text-orange-800 border border-orange-300'
          : stats.is_repeat
          ? 'bg-gray-100 text-gray-700 border border-gray-300'
          : 'bg-gray-100 text-gray-800 border border-gray-300'
      }`}>
        {stats.is_vip && <Star className="w-3 h-3" />}
        {stats.is_vip ? (
          <>⭐ VIP · {stats.total_stays} stays · {formatIDR(stats.total_spent)}</>
        ) : stats.is_repeat ? (
          <>Repeat guest · {stats.total_stays} stays</>
        ) : (
          <>1st visit</>
        )}
      </div>
    );
  };

  const CountdownTimer = ({ dueDate }) => {
    if (!dueDate) return null;

    const countdown = getCountdown(dueDate);
    if (!countdown) return null;

    const { overdue, hours, minutes } = countdown;

    let colorClass = 'text-gray-700 bg-gray-100 border-gray-300';
    if (overdue) {
      colorClass = 'text-red-700 bg-red-100 border-red-300';
    } else if (hours < 1) {
      colorClass = 'text-orange-700 bg-orange-100 border-orange-300';
    }

    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold border-2 ${colorClass}`}>
        <Clock className="w-4 h-4" />
        {overdue ? 'OVERDUE' : 'Decision needed in'}: {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
      </div>
    );
  };

  const AIRecommendation = ({ recommendedAction, confidence = 87 }) => {
    if (!recommendedAction) return null;

    const isApprove = recommendedAction.toUpperCase().includes('APPROVE');
    const action = isApprove ? 'APPROVE' : 'REJECT';
    const reason = recommendedAction.replace(/AUTO_APPROVE_|ESCALATE_TO_OWNER_/g, '').replace(/_/g, ' ');

    return (
      <div className={`p-4 rounded-xl border-2 ${
        isApprove ? 'bg-white border-orange-300' : 'bg-orange-50 border-orange-300'
      }`}>
        <div className="flex items-start gap-3">
          <Sparkles className={`w-5 h-5 mt-0.5 flex-shrink-0 text-orange-600`} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-orange-800">
                🤖 AI Recommendation: {action}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-200 text-orange-800">
                {confidence}% confidence
              </span>
            </div>
            {reason && (
              <p className="text-sm text-orange-700">
                Reason: {reason}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const BookingContext = ({ context }) => {
    if (!context || !context.active_booking) return null;

    const booking = context.active_booking;
    return (
      <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
        <div>
          <div className="text-xs text-gray-600 font-semibold mb-1">Booking Value</div>
          <div className="text-sm font-bold text-gray-900">{formatIDR(booking.booking_value)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-600 font-semibold mb-1">Check-out</div>
          <div className="text-sm font-bold text-gray-900">
            {formatDate(booking.check_out_date)} {formatTime(booking.check_out_date)}
          </div>
        </div>
        {booking.villa_name && (
          <div className="col-span-2">
            <div className="text-xs text-gray-600 font-semibold mb-1">Villa</div>
            <div className="text-sm font-bold text-gray-900 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {booking.villa_name}
            </div>
          </div>
        )}
        {booking.nights_remaining !== null && booking.nights_remaining !== undefined && (
          <div className="col-span-2">
            <div className="text-xs text-gray-600 font-semibold mb-1">Nights Remaining</div>
            <div className="text-sm font-bold text-gray-900">{booking.nights_remaining} nights</div>
          </div>
        )}
      </div>
    );
  };

  const pendingDecisions = decisions.filter(d => d.status === 'pending');
  const autoResolvedToday = decisions.filter(d =>
    d.approved_by === 'autopilot' &&
    new Date(d.approved_at).toDateString() === new Date().toDateString()
  );

  const AutoResolvedSection = () => {
    if (autoResolvedToday.length === 0) return null;

    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 border-orange-200">
        <button
          onClick={() => setAutoResolvedExpanded(!autoResolvedExpanded)}
          className="w-full flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              Auto-resolved today ({autoResolvedToday.length})
            </h3>
          </div>
          {autoResolvedExpanded ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
        </button>

        {autoResolvedExpanded && (
          <div className="space-y-3">
            {autoResolvedToday.map(decision => {
              const approvedTime = formatTime(decision.approved_at);
              return (
                <div key={decision.id} className="flex items-center gap-4 p-3 bg-orange-50 rounded-xl border border-orange-200">
                  <CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800 truncate">
                      {decision.decision_type?.replace('_', ' ').toUpperCase()} · {decision.guest_name || 'Guest'}
                    </div>
                    <div className="text-xs text-gray-600">
                      {decision.summary || 'Approved by autopilot'} · {approvedTime}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const DecisionCard = ({ decision }) => {
    const context = decisionContexts[decision.id];

    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 border-gray-200 hover:border-orange-500 transition-all">
        {/* Priority and Type Badges */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
            decision.priority === 'urgent' ? 'bg-red-600 text-white' :
            decision.priority === 'high' ? 'bg-orange-500 text-white' :
            decision.priority === 'medium' ? 'bg-gray-400 text-white' :
            'bg-gray-300 text-gray-700'
          }`}>
            {decision.priority === 'urgent' ? '🔴 ' : ''}{decision.priority || 'LOW'}
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {decision.decision_type?.replace('_', ' ')}
          </div>
          <RecommendationBadge recommendedAction={decision.recommended_action} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {decision.title || decision.decision_type?.replace('_', ' ')}
        </h3>

        {/* Guest Profile */}
        <div className="mb-3">
          <GuestProfileStrip guestPhone={decision.guest_phone} guestName={decision.guest_name} />
        </div>

        {/* Booking Context */}
        {context && (
          <div className="mb-4">
            <BookingContext context={context} />
          </div>
        )}

        {/* Summary */}
        <p className="text-sm text-gray-600 mb-4">
          {decision.summary || decision.description}
        </p>

        {/* Countdown Timer */}
        {decision.due_date && (
          <div className="mb-4">
            <CountdownTimer dueDate={decision.due_date} />
          </div>
        )}

        {/* AI Recommendation */}
        {decision.recommended_action && (
          <div className="mb-4">
            <AIRecommendation
              recommendedAction={decision.recommended_action}
              confidence={decision.confidence_score || 87}
            />
          </div>
        )}

        {/* Financial Impact */}
        {decision.financial_impact_estimate && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-800">
                Financial Impact: {decision.financial_impact_estimate}
              </span>
            </div>
          </div>
        )}

        {/* Tags */}
        {decision.tags && decision.tags.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {decision.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">
                {tag.replace('_', ' ')}
              </span>
            ))}
          </div>
        )}

        {/* Created Time */}
        <div className="text-xs text-gray-500 mb-4">
          Created {formatRelativeTime(decision.created_at)}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => handleDecisionAction(decision.id, 'approve')}
            disabled={actionInProgress}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white rounded-xl font-semibold transition-all"
          >
            <ThumbsUp className="w-4 h-4" />
            Approve
          </button>
          <button
            onClick={() => handleDecisionAction(decision.id, 'reject')}
            disabled={actionInProgress}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-xl font-semibold transition-all"
          >
            <ThumbsDown className="w-4 h-4" />
            Reject
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 relative overflow-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-3 bg-gray-800 hover:bg-gray-700 rounded-2xl transition-all"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-white">Decision Intelligence</h2>
          <p className="text-gray-400 text-sm">AI-powered decision context and insights</p>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
          <p className="text-white mt-4">Loading decisions...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-2 border-red-300 rounded-3xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-red-800">Error loading decisions</h3>
          </div>
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={fetchDecisions}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-6">
          <AutoResolvedSection />

          {pendingDecisions.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 text-center shadow-lg border-2 border-gray-200">
              <CheckCircle2 className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No priority items right now</h3>
              <p className="text-gray-600">All decisions have been handled. Great work!</p>
            </div>
          ) : (
            <>
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4">
                <h3 className="text-white font-bold text-lg">
                  Pending Decisions ({pendingDecisions.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {pendingDecisions.map(decision => (
                  <DecisionCard key={decision.id} decision={decision} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DecisionIntelligence;

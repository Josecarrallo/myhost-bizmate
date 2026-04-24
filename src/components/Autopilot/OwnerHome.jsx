import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  ArrowLeft,
  AlertTriangle,
  Clock,
  CheckCircle2,
  DollarSign,
  ThumbsUp,
  ThumbsDown,
  Edit3,
  Star,
  User,
  MapPin,
  Sparkles,
  TrendingUp,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const OwnerHome = ({ onBack, tenantId: propTenantId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [decisions, setDecisions] = useState([]);
  const [decisionContexts, setDecisionContexts] = useState({});
  const [guestStats, setGuestStats] = useState({});
  const [tenantId, setTenantId] = useState(propTenantId);
  const [actionInProgress, setActionInProgress] = useState(null);
  const [showAutoResolved, setShowAutoResolved] = useState(false);
  const [rejectModal, setRejectModal] = useState(null);
  const [modifyModal, setModifyModal] = useState(null);
  const [rejectNotes, setRejectNotes] = useState('');
  const [modifyNotes, setModifyNotes] = useState('');
  const [toast, setToast] = useState(null);

  // Helper function to extract refund % from description and append to title
  const getRefundTitle = (decision) => {
    if (decision.decision_type !== 'refund_request') return decision.title;
    const match = (decision.description || '').match(/(\d+)\s*%/);
    return match ? `${decision.title} ${match[1]}%` : decision.title;
  };

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Optimistic strip update helper
  const updateStripOptimistic = (decision, action) => {
    setAnalytics(prev => {
      if (!prev) return prev;

      const isPending = decision.status === 'pending' || decision.status === 'modified';
      const isUrgent = decision.priority === 'urgent';
      const revenue = decision.estimated_revenue_uplift || 0;

      // Solo restar del strip si es approve o reject
      // Modify NO resta porque la decisión sigue pending
      const shouldDeduct = action === 'approve' || action === 'reject';

      return {
        ...prev,
        pending_count: (isPending && shouldDeduct) ? Math.max(0, prev.pending_count - 1) : prev.pending_count,
        urgent_count: (isPending && isUrgent && shouldDeduct) ? Math.max(0, prev.urgent_count - 1) : prev.urgent_count,
        total_financial_impact: (isPending && shouldDeduct) ? Math.max(0, prev.total_financial_impact - revenue) : prev.total_financial_impact,
        auto_approved_today: action === 'approve' ? prev.auto_approved_today + 1 : prev.auto_approved_today
      };
    });
  };

  useEffect(() => {
    const init = async () => {
      try {
        let finalTenantId = propTenantId;

        if (!finalTenantId) {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            setError('No user logged in');
            setLoading(false);
            return;
          }
          finalTenantId = user.id;
        }

        setTenantId(finalTenantId);
        await fetchAllData(finalTenantId);
      } catch (err) {
        console.error('❌ [OWNER HOME] Initialization error:', err);
        setError('Failed to initialize');
        setLoading(false);
      }
    };

    init();
  }, [propTenantId]);

  const fetchAllData = async (tid) => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch all decisions
      const { data: decisionsData, error: decisionsError } = await supabase
        .from('owner_decisions')
        .select('*')
        .eq('tenant_id', tid)
        .order('created_at', { ascending: false });

      if (decisionsError) throw decisionsError;

      // Sort by priority: urgent > high > medium > low
      // Within same priority, sort by overdue time (most overdue first)
      const priorityOrder = { urgent: 1, high: 2, medium: 3, low: 4 };
      const sortedDecisions = (decisionsData || []).sort((a, b) => {
        const priorityA = priorityOrder[a.priority] || 999;
        const priorityB = priorityOrder[b.priority] || 999;

        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }

        // Same priority - sort by most overdue first
        const now = new Date();
        const dueA = a.due_date ? new Date(a.due_date) : new Date(9999, 0);
        const dueB = b.due_date ? new Date(b.due_date) : new Date(9999, 0);
        const overdueA = now - dueA; // positive = overdue
        const overdueB = now - dueB;

        return overdueB - overdueA; // most overdue first
      });

      setDecisions(sortedDecisions);

      // 2. Calculate analytics from decisions data
      // Pending incluye tanto 'pending' como 'modified' (aún no resueltas definitivamente)
      const pending = (decisionsData || []).filter(d => d.status === 'pending' || d.status === 'modified');
      const approved = (decisionsData || []).filter(d => d.status === 'approved');
      const autoApproved = approved.filter(d => !d.approved_by);
      const urgentPending = pending.filter(d => d.priority === 'urgent');

      const totalFinancialImpact = pending.reduce((sum, d) => sum + (d.estimated_revenue_uplift || 0), 0);

      // Calculate avg response time for approved decisions
      let avgResponseHours = 0;
      if (approved.length > 0) {
        const responseTimes = approved
          .filter(d => d.approved_at && d.created_at)
          .map(d => {
            const created = new Date(d.created_at);
            const approved = new Date(d.approved_at);
            return (approved - created) / (1000 * 60 * 60); // hours
          });
        avgResponseHours = responseTimes.length > 0
          ? responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length
          : 0;
      }

      // Set calculated analytics
      setAnalytics({
        total_decisions: decisionsData?.length || 0,
        pending_count: pending.length,
        urgent_count: urgentPending.length,
        total_financial_impact: totalFinancialImpact,
        auto_approved_today: autoApproved.length,
        avg_response_time_hours: avgResponseHours
      });

      // 3. Fetch contexts for pending decisions
      await fetchDecisionContexts(tid, pending);

      // 4. Fetch guest stats
      if (decisionsData && decisionsData.length > 0) {
        const uniquePhones = [...new Set(decisionsData.filter(d => d.guest_phone).map(d => d.guest_phone))];
        await fetchGuestStatsForPhones(tid, uniquePhones);
      }
    } catch (err) {
      console.error('❌ [OWNER HOME] Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDecisionContexts = async (tid, pendingDecisions) => {
    // Cargar todos los contexts EN PARALELO con Promise.all
    const contextPromises = pendingDecisions.map(decision =>
      supabase.rpc('get_decision_context', { p_decision_id: decision.id })
        .then(({ data, error }) => ({ id: decision.id, data, error }))
        .catch(err => ({ id: decision.id, error: err }))
    );

    const results = await Promise.all(contextPromises);

    const contexts = {};
    results.forEach(({ id, data, error }) => {
      if (!error && data) {
        contexts[id] = data;
      }
    });

    // Ahora obtener los bookings con confirmation_code para las decisiones que tienen booking_id
    const bookingIds = pendingDecisions
      .filter(d => d.booking_id)
      .map(d => d.booking_id);

    if (bookingIds.length > 0) {
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, confirmation_code')
        .in('id', bookingIds);

      if (!bookingsError && bookingsData) {
        // Agregar el booking al context correspondiente
        pendingDecisions.forEach(decision => {
          if (decision.booking_id && contexts[decision.id]) {
            const booking = bookingsData.find(b => b.id === decision.booking_id);
            if (booking) {
              contexts[decision.id].active_booking = booking;
            }
          }
        });
      }
    }

    setDecisionContexts(contexts);
  };

  const fetchGuestStatsForPhones = async (tid, phones) => {
    // Cargar todos los stats EN PARALELO con Promise.all
    const statsPromises = phones.map(phone =>
      supabase.rpc('get_repeat_guest_stats', { p_tenant_id: tid, p_guest_phone: phone })
        .then(({ data, error }) => ({ phone, data, error }))
        .catch(err => ({ phone, error: err }))
    );

    const results = await Promise.all(statsPromises);

    const statsMap = {};
    results.forEach(({ phone, data, error }) => {
      if (!error && data) {
        statsMap[phone] = data;
      }
    });

    setGuestStats(statsMap);
  };

  const handleApprove = async (decision) => {
    // 1. OPTIMISTIC UPDATE - actualizar status, NO eliminar
    setDecisions(prev => prev.map(d =>
      d.id === decision.id
        ? { ...d, status: 'approved', approved_at: new Date().toISOString(), approved_by: tenantId }
        : d
    ));
    updateStripOptimistic(decision, 'approve');
    showToast('✅ Decision approved', 'success');

    // 2. Llamar backend en paralelo (no bloquear UI)
    try {
      setActionInProgress(decision.id);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('https://n8n-production-bb2d.up.railway.app/webhook/autopilot/decision-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision_id: decision.id,
          action: 'approve',
          action_by: 'owner',
          notes: ''
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const result = await response.json();

      // 3. Solo si falla → revertir status
      if (!result.success) {
        setDecisions(prev => prev.map(d =>
          d.id === decision.id ? { ...decision, status: 'pending' } : d
        ));
        updateStripOptimistic({ ...decision, status: 'pending' }, 'revert');
        showToast('⚠️ Error — decision restored', 'error');
      }
    } catch (err) {
      // Revertir en caso de error
      setDecisions(prev => prev.map(d =>
        d.id === decision.id ? { ...decision, status: 'pending' } : d
      ));
      updateStripOptimistic({ ...decision, status: 'pending' }, 'revert');
      showToast('⚠️ Connection error', 'error');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (decisionId) => {
    if (!rejectNotes.trim()) {
      showToast('Please provide a reason for rejection', 'error');
      return;
    }

    // Encontrar la decision completa
    const decision = decisions.find(d => d.id === decisionId);
    if (!decision) return;

    // 1. OPTIMISTIC UPDATE - actualizar status, NO eliminar
    setDecisions(prev => prev.map(d =>
      d.id === decisionId
        ? { ...d, status: 'rejected', rejected_at: new Date().toISOString(), outcome_notes: rejectNotes }
        : d
    ));
    updateStripOptimistic(decision, 'reject');
    setRejectModal(null);
    setRejectNotes('');
    showToast('❌ Decision rejected', 'success');

    // 2. Llamar backend en paralelo
    try {
      setActionInProgress(decisionId);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('https://n8n-production-bb2d.up.railway.app/webhook/autopilot/decision-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision_id: decisionId,
          action: 'reject',
          action_by: 'owner',
          notes: rejectNotes
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const result = await response.json();

      // 3. Solo si falla → revertir status
      if (!result.success) {
        setDecisions(prev => prev.map(d =>
          d.id === decisionId ? { ...decision, status: 'pending' } : d
        ));
        updateStripOptimistic({ ...decision, status: 'pending' }, 'revert');
        showToast('⚠️ Error — decision restored', 'error');
      }
    } catch (err) {
      // Revertir en caso de error
      setDecisions(prev => prev.map(d =>
        d.id === decisionId ? { ...decision, status: 'pending' } : d
      ));
      updateStripOptimistic({ ...decision, status: 'pending' }, 'revert');
      showToast('⚠️ Connection error', 'error');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleModify = async (decisionId) => {
    if (!modifyNotes.trim()) {
      showToast('Please describe the modification', 'error');
      return;
    }

    // Encontrar la decision completa
    const decision = decisions.find(d => d.id === decisionId);
    if (!decision) return;

    const notes = modifyNotes;

    // 1. OPTIMISTIC UPDATE - NO eliminar la card, cambiar a "modified"
    setDecisions(prev => prev.map(d =>
      d.id === decisionId
        ? { ...d, status: 'modified', modification_notes: notes, modified_at: new Date().toISOString() }
        : d
    ));
    updateStripOptimistic(decision, 'modify');
    setModifyModal(null);
    setModifyNotes('');
    showToast('✏️ Decision modified', 'success');

    // 2. Llamar backend en paralelo
    try {
      setActionInProgress(decisionId);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('https://n8n-production-bb2d.up.railway.app/webhook/autopilot/decision-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision_id: decisionId,
          action: 'modify',
          action_by: 'owner',
          notes: notes
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const result = await response.json();

      // 3. Solo si falla → revertir
      if (!result.success) {
        setDecisions(prev => prev.map(d =>
          d.id === decisionId ? decision : d  // restaurar estado original
        ));
        updateStripOptimistic({ ...decision, status: 'pending' }, 'revert');
        showToast('⚠️ Error — decision restored', 'error');
      }
    } catch (err) {
      // Revertir en caso de error
      setDecisions(prev => prev.map(d =>
        d.id === decisionId ? decision : d
      ));
      updateStripOptimistic({ ...decision, status: 'pending' }, 'revert');
      showToast('⚠️ Connection error', 'error');
    } finally {
      setActionInProgress(null);
    }
  };

  const formatIDR = (amount) => {
    if (!amount || amount === 0) return '—';
    // Indonesian format: Rp 1.000.000 (dots as thousands separator)
    return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
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

  const getCountdown = (dueDate, createdAt) => {
    if (!dueDate) return null;
    const now = new Date();
    const due = new Date(dueDate);
    const created = new Date(createdAt);
    const totalMs = due - created;
    const remainingMs = due - now;

    if (remainingMs < 0) {
      const absMs = Math.abs(remainingMs);
      const hours = Math.floor(absMs / (1000 * 60 * 60));
      const minutes = Math.floor((absMs % (1000 * 60 * 60)) / (1000 * 60));
      return { overdue: true, hours, minutes, percentRemaining: 0 };
    } else {
      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      const percentRemaining = (remainingMs / totalMs) * 100;
      return { overdue: false, hours, minutes, percentRemaining };
    }
  };

  const formatHours = (hours) => {
    if (!hours || hours === 0) return '0h';
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes}min`;
    }
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="flex-1 h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Owner Decision Center</h2>
          <p className="text-gray-400 text-sm">Preparing your control tower...</p>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div className="flex-1 h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-3xl font-bold text-white">Owner Decision Center</h2>
        </div>

        <div className="bg-red-900/20 border-2 border-red-500 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-red-400">Error loading data</h3>
          </div>
          <p className="text-red-300 text-sm mb-4">{error}</p>
          <button
            onClick={() => fetchAllData(tenantId)}
            className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const total = analytics?.total_decisions || 0;
  const urgent = analytics?.urgent_count || 0;
  const pending = analytics?.pending_count || 0;
  const revenueAtStake = analytics?.total_financial_impact || 0;
  const overdue = analytics?.overdue_count || 0;
  const autoApproved = analytics?.auto_approved_today || 0;
  const avgResponseTime = analytics?.avg_response_time_hours || 0;

  // Incluir tanto pending como modified (el owner ya actuó en modified pero sigue visible)
  const pendingDecisions = decisions.filter(d => d.status === 'pending' || d.status === 'modified');

  // Dynamic header color and message
  const headerColor = urgent > 0 ? '#DC2626' : pending > 0 ? '#EA580C' : '#16A34A';
  const headerMsg = urgent > 0
    ? `🚨 URGENT ACTION REQUIRED · ${urgent} ${urgent === 1 ? 'decision needs' : 'decisions need'} immediate attention`
    : pending > 0
    ? `⚡ ${pending} ${pending === 1 ? 'decision' : 'decisions'} waiting for your review`
    : '✅ All clear — system handled everything today';

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-y-auto">
      <div className="p-4 md:p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h2 className="text-3xl font-bold text-white">
          Owner Decision Center
          <span className="text-gray-400 ml-3">
            Today · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </h2>
      </div>

      {/* ========== COMMAND CENTER HEADER ========== */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-6 border-2 border-gray-200">
        {/* Top Bar - Dynamic Color */}
        <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: headerColor }}>
          <h3 className="text-white font-bold text-lg">{headerMsg}</h3>
          <div className="text-white text-sm opacity-90">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Metrics Grid - NÚMEROS GRANDES */}
        {pending > 0 || urgent > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-[0.8fr_0.8fr_0.8fr_2fr] divide-x divide-gray-200 border-b-2 border-gray-200">
              {/* TOTAL */}
              <div className="p-3 md:p-5 bg-white">
                <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Total</div>
                <div className="text-4xl md:text-5xl font-black text-gray-900 mb-1">{total}</div>
                <div className="text-gray-600 text-xs">decisions</div>
              </div>

              {/* URGENT */}
              <div className="p-3 md:p-5 bg-white">
                <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Urgent</div>
                <div className={`text-4xl md:text-5xl font-black mb-1 flex items-center gap-1 ${urgent > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                  {urgent > 0 && <span className="text-2xl">🔴</span>}
                  {urgent}
                </div>
                <div className="text-gray-600 text-xs">need now</div>
              </div>

              {/* PENDING */}
              <div className="p-3 md:p-5 bg-white">
                <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Pending</div>
                <div className={`text-4xl md:text-5xl font-black mb-1 flex items-center gap-1 ${pending > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                  {pending > 0 && <Clock className="w-6 h-6 md:w-8 md:h-8" />}
                  {pending}
                </div>
                <div className="text-gray-600 text-xs">waiting</div>
              </div>

              {/* REVENUE AT STAKE */}
              <div className="p-3 md:p-5 bg-white">
                <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Revenue at Stake</div>
                <div className={`text-3xl md:text-4xl font-black mb-1 ${revenueAtStake > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                  {revenueAtStake > 0 ? formatIDR(revenueAtStake) : '—'}
                </div>
                <div className="text-gray-600 text-xs">
                  {revenueAtStake > 0 ? 'across decisions' : 'No risk'}
                </div>
              </div>
            </div>

            {/* Alert Strips */}
            <div className="p-4 space-y-2 bg-gray-50">
              {/* Overdue Alert */}
              {overdue > 0 && (
                <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border-l-4 border-red-600 rounded">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="text-red-900 font-bold text-sm">
                    ⚠️ {overdue} {overdue === 1 ? 'decision has' : 'decisions have'} been pending for more than 24 hours
                  </span>
                </div>
              )}

              {/* Auto-Resolved */}
              {autoApproved > 0 && (
                <div className="flex items-center justify-between px-4 py-3 bg-green-50 border-l-4 border-green-600 rounded">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-green-900 font-bold text-sm">
                      ✅ System auto-resolved {autoApproved} {autoApproved === 1 ? 'decision' : 'decisions'} today
                    </span>
                  </div>
                  {avgResponseTime > 0 && (
                    <span className="text-green-700 text-sm font-semibold">
                      Avg: {formatHours(avgResponseTime)}
                    </span>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          /* ALL CLEAR STATE */
          <div className="p-8 bg-green-50">
            <div className="text-center">
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-900 mb-2">All clear for today</h3>
              <p className="text-green-700 mb-4">
                {autoApproved > 0 && `System auto-resolved ${autoApproved} ${autoApproved === 1 ? 'decision' : 'decisions'}`}
                {autoApproved > 0 && avgResponseTime > 0 && ' · '}
                {avgResponseTime > 0 && `Avg response: ${formatHours(avgResponseTime)}`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ========== DECISION CARDS ========== */}
      {pendingDecisions.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-lg border-2 border-gray-200">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No priority items right now</h3>
          <p className="text-gray-600">All decisions have been handled. Great work!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingDecisions.map(decision => {
            const context = decisionContexts[decision.id];
            const stats = guestStats[decision.guest_phone];
            const countdown = getCountdown(decision.due_date, decision.created_at);
            const booking = context?.active_booking;

            // Debug: Log booking data for first decision
            if (decision.id && !window.loggedBooking) {
              console.log('🔍 [OWNER HOME] Decision:', decision.id);
              console.log('🔍 [OWNER HOME] Context FULL:', JSON.stringify(context, null, 2));
              console.log('🔍 [OWNER HOME] Context keys:', context ? Object.keys(context) : 'null');
              console.log('🔍 [OWNER HOME] Booking:', booking);
              console.log('🔍 [OWNER HOME] Confirmation code:', booking?.confirmation_code);
              window.loggedBooking = true;
            }

            // Priority colors
            const priorityColors = {
              urgent: { bg: '#FEF2F2', text: '#DC2626', border: '#DC2626' },
              high: { bg: '#FFF7ED', text: '#EA580C', border: '#EA580C' },
              medium: { bg: '#F3F4F6', text: '#6B7280', border: '#6B7280' },
              low: { bg: '#F9FAFB', text: '#9CA3AF', border: '#9CA3AF' }
            };
            const colors = priorityColors[decision.priority] || priorityColors.low;

            // Financial impact color
            const impact = decision.financial_impact_estimate || '';
            const impactColor = impact.toLowerCase().includes('risk') ||
                               impact.toLowerCase().includes('refund') ||
                               impact.toLowerCase().includes('loss')
              ? '#DC2626'
              : impact.toLowerCase().includes('discount') ||
                impact.toLowerCase().includes('reduction')
              ? '#EA580C'
              : '#16A34A';

            return (
              <div
                key={decision.id}
                className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200 hover:border-orange-500 transition-all"
                style={{ borderLeft: `4px solid ${colors.border}` }}
              >
                {/* Booking Code - FIRST LINE */}
                {booking?.confirmation_code && (
                  <div className="mb-3 p-2 bg-orange-500 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs font-semibold">Code:</span>
                      <span className="text-white text-sm font-bold">{booking.confirmation_code}</span>
                    </div>
                  </div>
                )}

                {/* Priority Badge + Title (Una sola línea) */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-lg font-bold uppercase" style={{ backgroundColor: colors.bg, color: colors.text }}>
                    {decision.priority === 'urgent' ? '🔴 ' : ''}{decision.priority || 'LOW'}
                  </span>
                  <span className="font-bold" style={{ color: colors.text }}>
                    {getRefundTitle(decision) || decision.decision_type?.replace('_', ' ')}
                  </span>
                </div>

                {/* Guest Info with VIP Badge */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-gray-700 flex-wrap">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold">{decision.guest_name || 'System Alert'}</span>
                    {stats?.is_vip && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold" style={{ backgroundColor: '#FFF7ED', color: '#EA580C' }}>
                        ⭐ VIP
                      </span>
                    )}
                    {!stats?.is_vip && stats?.is_repeat && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-700">
                        🔄 Repeat guest
                      </span>
                    )}
                  </div>
                  {/* Created Date */}
                  <div className="text-xs text-gray-500 mt-1 ml-6">
                    {new Date(decision.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })} · {new Date(decision.created_at).toLocaleTimeString('en-US', {
                      hour: '2-digit', minute: '2-digit', hour12: false
                    })}
                  </div>
                  {stats && (stats.is_vip || stats.is_repeat) && (
                    <div className="text-xs text-gray-500 mt-1 ml-6">
                      {formatIDR(stats.total_spent)} total · {stats.total_stays} stays
                    </div>
                  )}
                </div>

                {/* Booking Context */}
                {booking && (
                  <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4 flex-wrap">
                      {decision.villa_name && (
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-gray-600 font-semibold">Villa</div>
                          <div className="text-sm font-bold text-gray-900 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {decision.villa_name}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-600 font-semibold">Booking Value</div>
                        <div className="text-sm font-bold text-gray-900">{formatIDR(booking.total_price)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-600 font-semibold">Checkout</div>
                        <div className="text-sm font-bold text-gray-900">
                          {formatDate(booking.check_out)} {formatTime(booking.check_out)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timer */}
                {countdown && (
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${
                        countdown.overdue
                          ? 'bg-red-100 text-red-800 border-2 border-red-600 animate-pulse'
                          : countdown.percentRemaining < 25
                          ? 'bg-orange-100 text-orange-800 border-2 border-orange-600'
                          : 'bg-gray-100 text-gray-700 border-2 border-gray-300'
                      }`}
                    >
                      <Clock className="w-5 h-5" />
                      <span>
                        {countdown.overdue ? '🔴 OVERDUE' : '⏱ Decision needed in'}: {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                )}

                {/* System Recommendation */}
                {decision.recommended_action && (() => {
                  const raw = decision.recommended_action;
                  const isApprove = raw.startsWith('AUTO_APPROVE');
                  const isEscalate = raw.startsWith('ESCALATE');

                  // Limpiar el prefijo para mostrar solo la razón
                  const reason = raw
                    .replace(/^(AUTO_APPROVE|ESCALATE)\s*[-–]\s*/i, '')
                    .replace(/AUTO_APPROVE_|ESCALATE_TO_OWNER_/g, '')
                    .replace(/_/g, ' ')
                    .trim();
                  const displayReason = reason.length > 90 ? reason.slice(0, 90) + '...' : reason;

                  // Determinar estilos
                  const bgColor = isApprove ? '#FFFFFF' : isEscalate ? '#FFF7ED' : '#F1F5F9';
                  const textColor = isApprove ? '#EA580C' : isEscalate ? '#EA580C' : '#475569';
                  const icon = isApprove ? '✅' : isEscalate ? '⚡' : 'ℹ️';
                  const action = isApprove ? 'AUTO-APPROVE' : isEscalate ? 'ESCALATE' : 'REVIEW';

                  return (
                    <div
                      className="p-3 rounded-lg mb-4 border"
                      style={{ backgroundColor: bgColor, borderColor: textColor }}
                    >
                      <div className="text-sm font-bold" style={{ color: textColor }}>
                        {icon} {action} — {displayReason}
                      </div>
                    </div>
                  );
                })()}

                {/* Financial Impact */}
                {decision.financial_impact_estimate && (
                  <div
                    className="p-3 rounded-lg mb-4 border-2"
                    style={{
                      backgroundColor: impactColor === '#DC2626' ? '#FEF2F2' : '#FFF7ED',
                      borderColor: impactColor === '#DC2626' ? '#DC2626' : '#EA580C'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" style={{ color: impactColor === '#DC2626' ? '#DC2626' : '#EA580C' }} />
                      <span className="text-sm font-bold" style={{ color: impactColor === '#DC2626' ? '#DC2626' : '#EA580C' }}>
                        {decision.financial_impact_estimate}
                      </span>
                    </div>
                  </div>
                )}

                {/* Modified Badge (if modified) */}
                {decision.status === 'modified' && (
                  <div className="p-4 rounded-lg bg-orange-50 border-2 border-orange-500 mb-4">
                    <div className="flex items-start gap-3">
                      <Edit3 className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-bold text-orange-900 mb-1">✏️ MODIFIED</div>
                        <p className="text-sm text-orange-800 mb-2">
                          {decision.modification_notes || 'Owner requested modifications'}
                        </p>
                        <div className="text-xs text-orange-700">
                          Modified: {new Date(decision.modified_at || decision.created_at).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })} · {new Date(decision.modified_at || decision.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit', minute: '2-digit', hour12: false
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons (always visible) */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(decision)}
                    disabled={actionInProgress === decision.id}
                    className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white rounded-xl font-black text-lg transition-all shadow-lg"
                  >
                    <ThumbsUp className="w-6 h-6" />
                    {actionInProgress === decision.id ? 'PROCESSING...' : 'APPROVE'}
                  </button>
                  <button
                    onClick={() => setRejectModal(decision.id)}
                    disabled={actionInProgress === decision.id}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-xl font-bold transition-all"
                  >
                    <ThumbsDown className="w-5 h-5" />
                    REJECT
                  </button>
                  <button
                    onClick={() => setModifyModal(decision.id)}
                    disabled={actionInProgress === decision.id}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-4 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-xl font-bold transition-all"
                  >
                    <Edit3 className="w-5 h-5" />
                    MODIFY
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========== TODAY'S ACTIVITY SECTION ========== */}
      {(() => {
        // Get today's start timestamp
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        console.log('🕐 [Today\'s Activity] Filtering for created today (after):', todayStart.toISOString());
        console.log('📋 [Today\'s Activity] ALL decisions in array:', decisions.length);

        // Filter: ALL decisions CREATED TODAY (pending + approved + rejected)
        const todayDecisions = decisions.filter(d => {
          if (!d.created_at) return false;

          const createdAt = new Date(d.created_at);
          const isToday = createdAt >= todayStart;

          if (isToday) {
            console.log('✅ [Today\'s Activity] Including:', d.guest_name, d.decision_type, d.status, 'created:', createdAt.toISOString());
          }

          return isToday;
        });

        // Sort by created_at (most recent first)
        todayDecisions.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        console.log('📊 [Today\'s Activity] Total created today:', todayDecisions.length);

        if (todayDecisions.length === 0) {
          return (
            <div className="mt-6 bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 text-center">
              <div className="text-gray-400 mb-2">
                <Clock className="w-12 h-12 mx-auto opacity-50" />
              </div>
              <h3 className="text-lg font-bold text-gray-600 mb-1">No activity today yet</h3>
              <p className="text-sm text-gray-500">All decisions created today will appear here</p>
            </div>
          );
        }

        return (
          <div className="mt-6 bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
            <button
              onClick={() => setShowAutoResolved(!showAutoResolved)}
              className="w-full px-6 py-4 flex items-center justify-between bg-orange-50 hover:bg-orange-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-bold text-orange-900">
                  Today's Activity ({todayDecisions.length})
                </h3>
              </div>
              {showAutoResolved ? (
                <ChevronUp className="w-5 h-5 text-orange-700" />
              ) : (
                <ChevronDown className="w-5 h-5 text-orange-700" />
              )}
            </button>

            {showAutoResolved && (
              <div className="p-4 space-y-2">
                {todayDecisions.map(decision => {
                  // Determine badge based on status + approved_by
                  let badge = { text: '—', color: 'text-gray-500' };

                  if (decision.status === 'rejected') {
                    badge = { text: '❌ REJECTED', color: 'text-red-600' };
                  } else if (decision.status === 'approved' && decision.approved_by === 'autopilot') {
                    badge = { text: '🤖 AUTO-APPROVED', color: 'text-green-600' };
                  } else if (decision.status === 'approved' && decision.approved_by === 'owner') {
                    badge = { text: '✅ APPROVED by owner', color: 'text-green-600' };
                  } else if (decision.status === 'approved') {
                    // Fallback for approved_by = null
                    badge = { text: '✅ APPROVED', color: 'text-green-600' };
                  } else if (decision.status === 'pending' || decision.status === 'modified') {
                    badge = { text: '⏳ PENDING', color: 'text-orange-600' };
                  }

                  // Get context for this decision if available
                  const context = decisionContexts[decision.id];
                  const booking = context?.active_booking;

                  return (
                    <div
                      key={decision.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      {/* Booking Code */}
                      {booking?.confirmation_code && (
                        <div className="mb-2 px-2 py-1 bg-orange-500 rounded inline-flex items-center gap-1">
                          <span className="text-white text-[10px] font-semibold">Code:</span>
                          <span className="text-white text-xs font-bold">{booking.confirmation_code}</span>
                        </div>
                      )}

                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900">
                              {decision.guest_name || 'System Alert'}
                            </span>
                            <span className="text-gray-500">·</span>
                            <span className="text-sm text-gray-600">
                              {decision.decision_type?.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{decision.summary || decision.title}</p>
                          {decision.financial_impact_estimate && (
                            <p className="text-xs text-orange-700 mt-1">
                              💰 {decision.financial_impact_estimate}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className={`text-xs font-semibold ${badge.color}`}>{badge.text}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(decision.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* REJECT MODAL */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Decision</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for rejecting this request:</p>
            <textarea
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              placeholder="Reason for rejection (required)"
              className="w-full p-3 border-2 border-gray-300 rounded-lg mb-4 min-h-[100px] focus:border-red-500 focus:outline-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => handleReject(rejectModal)}
                disabled={!rejectNotes.trim() || actionInProgress === rejectModal}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-bold transition-colors"
              >
                {actionInProgress === rejectModal ? 'PROCESSING...' : 'CONFIRM REJECT'}
              </button>
              <button
                onClick={() => { setRejectModal(null); setRejectNotes(''); }}
                disabled={actionInProgress === rejectModal}
                className="flex-1 px-4 py-3 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 rounded-lg font-bold transition-colors"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODIFY MODAL */}
      {modifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Modify Decision</h3>
            <p className="text-gray-600 mb-4">Describe the modification or counter-offer:</p>
            <textarea
              value={modifyNotes}
              onChange={(e) => setModifyNotes(e.target.value)}
              placeholder="Modification details (required)"
              className="w-full p-3 border-2 border-gray-300 rounded-lg mb-4 min-h-[100px] focus:border-orange-500 focus:outline-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => handleModify(modifyModal)}
                disabled={!modifyNotes.trim() || actionInProgress === modifyModal}
                className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white rounded-lg font-bold transition-colors"
              >
                {actionInProgress === modifyModal ? 'PROCESSING...' : 'CONFIRM MODIFY'}
              </button>
              <button
                onClick={() => { setModifyModal(null); setModifyNotes(''); }}
                disabled={actionInProgress === modifyModal}
                className="flex-1 px-4 py-3 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 rounded-lg font-bold transition-colors"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed top-4 right-4 z-[100] animate-slideIn">
          <div className={`px-6 py-4 rounded-xl shadow-2xl border-2 flex items-center gap-3 min-w-[300px] ${
            toast.type === 'success'
              ? 'bg-green-50 border-green-500 text-green-900'
              : 'bg-red-50 border-red-500 text-red-900'
          }`}>
            <div className="text-2xl">
              {toast.type === 'success' ? '✅' : '⚠️'}
            </div>
            <div className="flex-1 font-bold">{toast.message}</div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
      </div>
    </div>
  );
};

export default OwnerHome;

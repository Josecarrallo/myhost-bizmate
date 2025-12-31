import React, { useState } from 'react';
import PageShell from '../Layout/PageShell';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Zap,
  Shield,
  Activity,
  TrendingUp,
  Users,
  DollarSign,
  Plus
} from 'lucide-react';

/**
 * AI Operator Demo Page
 *
 * Demonstrates the standard PageShell layout with:
 * - AI helper text
 * - KPI cards
 * - Action Queue (right panel)
 * - Audit Log (table)
 * - Safety Controls
 */
const AIOperatorDemo = ({ onBack }) => {
  const [requireApproval, setRequireApproval] = useState(true);
  const [riskLevel, setRiskLevel] = useState('medium');

  // Mock KPIs
  const kpis = [
    {
      label: 'Actions Today',
      value: '12',
      icon: Zap,
      color: 'orange',
      trend: { direction: 'up', value: '+3' }
    },
    {
      label: 'Success Rate',
      value: '98%',
      icon: CheckCircle,
      color: 'green',
      trend: { direction: 'up', value: '+2%' }
    },
    {
      label: 'Time Saved',
      value: '4.2h',
      icon: Clock,
      color: 'blue',
      trend: { direction: 'up', value: '+1.1h' }
    },
    {
      label: 'Pending Approvals',
      value: '3',
      icon: AlertTriangle,
      color: 'purple'
    }
  ];

  // Mock action queue
  const actionQueue = [
    {
      id: 1,
      action: 'Send check-in reminder',
      guest: 'John Smith',
      status: 'proposed',
      risk: 'low',
      timestamp: '2 min ago'
    },
    {
      id: 2,
      action: 'Adjust pricing for Villa #3',
      property: 'Tropical Room',
      status: 'approved',
      risk: 'medium',
      timestamp: '15 min ago'
    },
    {
      id: 3,
      action: 'Request late checkout',
      guest: 'Maria Garcia',
      status: 'executed',
      risk: 'low',
      timestamp: '1 hour ago'
    }
  ];

  // Mock audit log
  const auditLog = [
    {
      id: 1,
      timestamp: '2024-12-29 10:30',
      action: 'Sent booking confirmation',
      target: 'Booking #1234',
      result: 'Success',
      user: 'AI Operator'
    },
    {
      id: 2,
      timestamp: '2024-12-29 10:15',
      action: 'Updated room price',
      target: 'River Villa',
      result: 'Success',
      user: 'AI Operator'
    },
    {
      id: 3,
      timestamp: '2024-12-29 09:45',
      action: 'Created guest profile',
      target: 'Guest #5678',
      result: 'Success',
      user: 'AI Operator'
    },
    {
      id: 4,
      timestamp: '2024-12-29 09:30',
      action: 'Sent payment reminder',
      target: 'Booking #1233',
      result: 'Failed',
      user: 'AI Operator'
    }
  ];

  return (
    <PageShell
      title="AI Assistant"
      subtitle="Your AI-powered operations assistant"
      aiHelperText="Monitors bookings 24/7, proposes intelligent actions, executes approved workflows, and learns from your preferences to optimize property management."
      kpis={kpis}
      onBack={onBack}
      headerActions={
        <button className="px-4 py-2 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Action
        </button>
      }
    >
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {/* Safety Controls */}
          <div className="bg-[#1a1f2e] rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-[#FF8C42]" />
              <h3 className="text-lg font-semibold text-white">Safety Controls</h3>
            </div>

            <div className="space-y-4">
              {/* Toggle: Require approval */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Require approval before execution</p>
                  <p className="text-xs text-white/50 mt-1">All actions will wait for manual approval</p>
                </div>
                <button
                  onClick={() => setRequireApproval(!requireApproval)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    requireApproval ? 'bg-[#d85a2a]' : 'bg-white/20'
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    requireApproval ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Risk level dropdown */}
              <div>
                <label className="text-sm font-medium text-white block mb-2">Risk level threshold</label>
                <select
                  value={riskLevel}
                  onChange={(e) => setRiskLevel(e.target.value)}
                  className="w-full bg-[#2a2f3a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#d85a2a]/50"
                >
                  <option value="low">Low - Auto-approve minor actions</option>
                  <option value="medium">Medium - Approve standard operations</option>
                  <option value="high">High - Approve all actions</option>
                </select>
              </div>

              {/* View logs button */}
              <button className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
                View execution logs
              </button>
            </div>
          </div>

          {/* Audit Log Table */}
          <div className="bg-[#1a1f2e] rounded-xl border border-white/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-[#FF8C42]" />
                <h3 className="text-lg font-semibold text-white">Audit Log</h3>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#2a2f3a]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                      Target
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                      Result
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                      User
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {auditLog.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                        {log.timestamp}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {log.action}
                      </td>
                      <td className="px-6 py-4 text-sm text-white/70">
                        {log.target}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          log.result === 'Success'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {log.result}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/70">
                        {log.user}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Action Queue (Right Panel) */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-[#1a1f2e] rounded-xl border border-white/10 p-4 sticky top-6">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FF8C42]" />
              Action Queue
            </h3>
            <div className="space-y-3">
              {actionQueue.map((item) => (
                <ActionQueueItem key={item.id} {...item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

/**
 * Action Queue Item Component
 */
const ActionQueueItem = ({ action, guest, property, status, risk, timestamp }) => {
  const statusColors = {
    proposed: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    approved: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    executed: 'bg-green-500/20 text-green-400 border-green-500/30'
  };

  const riskColors = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-red-400'
  };

  return (
    <div className="bg-[#2a2f3a] rounded-lg p-3 border border-white/10 hover:border-[#d85a2a]/30 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{action}</p>
          {guest && <p className="text-xs text-white/50 mt-1">Guest: {guest}</p>}
          {property && <p className="text-xs text-white/50 mt-1">Property: {property}</p>}
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[status]}`}>
          {status}
        </span>
        <span className={`text-xs ${riskColors[risk]}`}>
          {risk} risk
        </span>
      </div>
      <p className="text-xs text-white/40 mt-2">{timestamp}</p>
    </div>
  );
};

export default AIOperatorDemo;

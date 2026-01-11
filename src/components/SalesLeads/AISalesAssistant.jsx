import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Send, CheckCircle, Clock, AlertTriangle, Shield, Activity, Play, Pause, Settings } from 'lucide-react';

const AISalesAssistant = ({ onBack }) => {
  const [message, setMessage] = useState('');
  const [requireApproval, setRequireApproval] = useState(true);
  const [riskLevel, setRiskLevel] = useState('medium');

  // Mock conversation history
  const conversation = [
    {
      role: 'system',
      content: 'AI Sales Assistant activated. Ready to help with lead qualification and follow-ups.',
      timestamp: '10:00 AM'
    },
    {
      role: 'user',
      content: 'Check lead Sarah Johnson from Instagram and suggest next action',
      timestamp: '10:01 AM'
    },
    {
      role: 'assistant',
      content: 'Analyzed lead Sarah Johnson:\n\n✓ Source: Instagram DM\n✓ Intent: Booking inquiry (Feb 14-18, honeymoon package)\n✓ Score: 85/100 (High priority)\n✓ Last contact: 2 hours ago\n\nSuggested action: Send personalized honeymoon package proposal with villa photos and romantic add-ons.',
      timestamp: '10:01 AM',
      actions: [
        {
          id: 1,
          type: 'proposed',
          action: 'Send WhatsApp message with honeymoon package details',
          status: 'pending_approval',
          risk: 'low'
        }
      ]
    }
  ];

  // Mock action queue
  const actionQueue = [
    {
      id: 1,
      lead: 'Sarah Johnson',
      action: 'Send honeymoon package proposal via WhatsApp',
      status: 'proposed',
      risk: 'low',
      timestamp: '2 mins ago'
    },
    {
      id: 2,
      lead: 'Michael Chen',
      action: 'Schedule follow-up call for tomorrow 10am',
      status: 'approved',
      risk: 'low',
      timestamp: '5 mins ago'
    },
    {
      id: 3,
      lead: 'Emma Watson',
      action: 'Send availability check email',
      status: 'executed',
      risk: 'low',
      timestamp: '15 mins ago',
      result: 'Email sent successfully'
    },
    {
      id: 4,
      lead: 'David Miller',
      action: 'Move to "Pending Decision" stage',
      status: 'executed',
      risk: 'low',
      timestamp: '1 hour ago',
      result: 'Pipeline updated'
    }
  ];

  // Mock audit log
  const auditLog = [
    {
      id: 1,
      timestamp: '2026-01-11 14:15:32',
      user: 'AI Assistant',
      action: 'Sent WhatsApp message',
      lead: 'Michael Chen',
      details: 'Follow-up message with availability options',
      status: 'success'
    },
    {
      id: 2,
      timestamp: '2026-01-11 13:45:18',
      user: 'Jose (Owner)',
      action: 'Approved action',
      lead: 'Sarah Johnson',
      details: 'Approved sending honeymoon package proposal',
      status: 'approved'
    },
    {
      id: 3,
      timestamp: '2026-01-11 13:30:05',
      user: 'AI Assistant',
      action: 'Lead qualification',
      lead: 'Emma Watson',
      details: 'Scored lead 75/100, moved to Qualified stage',
      status: 'success'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'proposed': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'approved': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'executed': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'low': return <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">Low Risk</span>;
      case 'medium': return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded">Medium Risk</span>;
      case 'high': return <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded">High Risk</span>;
      default: return null;
    }
  };

  const handleApprove = (actionId) => {
    alert(`Action ${actionId} approved! (Mock)`);
  };

  const handleReject = (actionId) => {
    alert(`Action ${actionId} rejected! (Mock)`);
  };

  return (
    <div className="flex-1 h-screen bg-[#2a2f3a] overflow-hidden flex">
      {/* Left Panel: Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#d85a2a]/20 rounded-xl">
                <Sparkles className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  AI Sales Assistant
                </h1>
                <p className="text-sm text-orange-400">Powered by LUMINA.AI</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Active
            </span>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {conversation.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-2xl ${
                msg.role === 'system'
                  ? 'w-full bg-white/5 border border-white/10 rounded-xl p-3 text-center'
                  : msg.role === 'user'
                  ? 'bg-[#d85a2a]/20 border border-[#d85a2a]/30 rounded-2xl rounded-tr-none p-4'
                  : 'bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl rounded-tl-none p-4'
              }`}>
                <div className="flex items-start gap-3">
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 bg-[#d85a2a]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-orange-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-white whitespace-pre-line">{msg.content}</p>
                    {msg.actions && (
                      <div className="mt-3 space-y-2">
                        {msg.actions.map((action) => (
                          <div key={action.id} className="bg-black/20 rounded-lg p-3 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-white">Proposed Action</span>
                              {getRiskBadge(action.risk)}
                            </div>
                            <p className="text-sm text-white/80 mb-3">{action.action}</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(action.id)}
                                className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-300 text-sm font-medium transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(action.id)}
                                className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 text-sm font-medium transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-white/40 mt-2">{msg.timestamp}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-white/5 backdrop-blur-sm border-t border-white/10 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask AI to analyze a lead, suggest actions, or schedule follow-ups..."
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#d85a2a]/50"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] hover:from-[#c74f24] hover:to-[#e09620] rounded-xl text-white font-medium transition-all flex items-center gap-2">
              <Send className="w-5 h-5" />
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Action Queue & Controls */}
      <div className="w-96 bg-[#1f2937] backdrop-blur-sm border-l border-white/10 flex flex-col overflow-hidden">
        {/* Safety Controls */}
        <div className="bg-white/5 border-b border-white/10 p-4">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-400" />
            Safety Controls
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/80">Require Approval</span>
              <button
                onClick={() => setRequireApproval(!requireApproval)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  requireApproval ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  requireApproval ? 'translate-x-6' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
            <div>
              <label className="text-sm text-white/80 block mb-2">Risk Level Threshold</label>
              <select
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <button className="w-full px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm transition-colors flex items-center justify-center gap-2">
              <Activity className="w-4 h-4" />
              View Execution Logs
            </button>
          </div>
        </div>

        {/* Action Queue */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-white font-semibold mb-3">Action Queue</h3>
          <div className="space-y-2">
            {actionQueue.map((action) => (
              <div key={action.id} className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(action.status)}`}>
                    {action.status === 'proposed' && <Clock className="w-3 h-3 inline mr-1" />}
                    {action.status === 'approved' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                    {action.status === 'executed' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                    {action.status.replace('_', ' ')}
                  </span>
                  {getRiskBadge(action.risk)}
                </div>
                <p className="text-sm font-medium text-white mb-1">{action.lead}</p>
                <p className="text-xs text-white/60 mb-2">{action.action}</p>
                {action.result && (
                  <p className="text-xs text-green-300 mb-2">✓ {action.result}</p>
                )}
                <p className="text-xs text-white/40">{action.timestamp}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log Preview */}
        <div className="bg-black/20 border-t border-white/10 p-4 max-h-64 overflow-y-auto">
          <h3 className="text-white font-semibold mb-3 text-sm">Recent Audit Log</h3>
          <div className="space-y-2">
            {auditLog.slice(0, 3).map((log) => (
              <div key={log.id} className="text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/60">{log.timestamp}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    log.status === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {log.status}
                  </span>
                </div>
                <p className="text-white/80">{log.action} - {log.lead}</p>
                <p className="text-white/50">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISalesAssistant;

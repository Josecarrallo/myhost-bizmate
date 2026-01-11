import React, { useState } from 'react';
import { ArrowLeft, Activity, Search, Filter, Download, CheckCircle, Clock, AlertTriangle, MessageSquare, User } from 'lucide-react';

const BanyuLogs = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock conversation logs
  const conversationLogs = [
    {
      id: '1',
      guest_name: 'Sarah Johnson',
      phone_number: '+61 412 345 678',
      timestamp: '2026-01-11T14:30:00Z',
      message_type: 'automated',
      trigger: 'Pre-arrival (2 days)',
      messages_exchanged: 5,
      ai_handled: true,
      sentiment: 'positive',
      status: 'completed',
      summary: 'Pre-arrival information sent. Guest asked about airport transfer, BANYU provided details and confirmed pickup time.'
    },
    {
      id: '2',
      guest_name: 'Michael Chen',
      phone_number: '+65 9123 4567',
      timestamp: '2026-01-11T13:15:00Z',
      message_type: 'inbound',
      trigger: 'Guest-initiated',
      messages_exchanged: 8,
      ai_handled: true,
      sentiment: 'neutral',
      status: 'completed',
      summary: 'Guest inquired about villa availability for March. BANYU checked calendar, provided options and pricing. Waiting for guest decision.'
    },
    {
      id: '3',
      guest_name: 'Emma Watson',
      phone_number: '+44 7911 123456',
      timestamp: '2026-01-11T12:00:00Z',
      message_type: 'automated',
      trigger: 'Booking confirmation',
      messages_exchanged: 2,
      ai_handled: true,
      sentiment: 'positive',
      status: 'completed',
      summary: 'Booking confirmation sent. Guest acknowledged receipt.'
    },
    {
      id: '4',
      guest_name: 'David Miller',
      phone_number: '+1 555 987 6543',
      timestamp: '2026-01-11T10:45:00Z',
      message_type: 'inbound',
      trigger: 'FAQ inquiry',
      messages_exchanged: 12,
      ai_handled: false,
      sentiment: 'negative',
      status: 'escalated',
      summary: 'Guest complaint about pool maintenance. BANYU escalated to staff after 3 messages. Staff intervened and resolved issue.'
    },
    {
      id: '5',
      guest_name: 'Ana Rodriguez',
      phone_number: '+34 612 345 678',
      timestamp: '2026-01-11T09:20:00Z',
      message_type: 'automated',
      trigger: 'Check-in day',
      messages_exchanged: 4,
      ai_handled: true,
      sentiment: 'positive',
      status: 'completed',
      summary: 'Check-in instructions sent. Guest confirmed arrival time. BANYU provided directions and wifi password.'
    }
  ];

  const stats = {
    total: conversationLogs.length,
    automated: conversationLogs.filter(l => l.message_type === 'automated').length,
    inbound: conversationLogs.filter(l => l.message_type === 'inbound').length,
    ai_handled: conversationLogs.filter(l => l.ai_handled).length,
    escalated: conversationLogs.filter(l => l.status === 'escalated').length
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'automated': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'inbound': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'neutral': return '😐';
      case 'negative': return '😟';
      default: return '😐';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-300';
      case 'escalated': return 'bg-red-500/20 text-red-300';
      case 'ongoing': return 'bg-yellow-500/20 text-yellow-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex-1 h-screen bg-[#2a2f3a] p-4 relative overflow-auto">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Activity className="w-6 h-6" />
                Conversation Logs
              </h1>
              <p className="text-sm text-orange-400">Powered by BANYU.AI</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] hover:from-[#c74f24] hover:to-[#e09620] rounded-xl text-white font-medium transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#d85a2a]/20 rounded-xl">
              <Activity className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Total Logs</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Clock className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Automated</p>
              <p className="text-2xl font-bold text-white">{stats.automated}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-xl">
              <MessageSquare className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Inbound</p>
              <p className="text-2xl font-bold text-white">{stats.inbound}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-300" />
            </div>
            <div>
              <p className="text-white/60 text-sm">AI Handled</p>
              <p className="text-2xl font-bold text-white">{stats.ai_handled}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-300" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Escalated</p>
              <p className="text-2xl font-bold text-white">{stats.escalated}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by guest name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#d85a2a]/50"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#d85a2a]/50"
          >
            <option value="all">All Types</option>
            <option value="automated">Automated</option>
            <option value="inbound">Inbound</option>
          </select>
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-4">
        {conversationLogs.map((log) => (
          <div
            key={log.id}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#d85a2a]/20 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{log.guest_name}</h3>
                  <p className="text-white/60 text-sm">{log.phone_number}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(log.message_type)}`}>
                  {log.message_type}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                  {log.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/40" />
                <span className="text-white/80 text-sm">{formatTime(log.timestamp)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-white/40" />
                <span className="text-white/80 text-sm">{log.messages_exchanged} messages</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getSentimentEmoji(log.sentiment)}</span>
                <span className="text-white/80 text-sm capitalize">{log.sentiment}</span>
              </div>
              <div className="flex items-center gap-2">
                {log.ai_handled ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-300" />
                    <span className="text-green-300 text-sm">AI Handled</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-300" />
                    <span className="text-red-300 text-sm">Staff Required</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-black/20 rounded-lg p-3 mb-3">
              <p className="text-white/60 text-xs mb-1">Trigger: {log.trigger}</p>
              <p className="text-white/80 text-sm">{log.summary}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-white/60 text-xs">
                ID: {log.id} • {formatTime(log.timestamp)}
              </div>
              <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-white text-xs transition-colors">
                View Full Conversation →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          <Activity className="w-5 h-5 text-orange-400" />
          About Conversation Logs
        </h3>
        <p className="text-white/80 text-sm mb-3">
          All WhatsApp conversations handled by BANYU.AI are automatically logged for quality assurance and analytics.
        </p>
        <ul className="text-white/70 text-sm space-y-1 list-disc list-inside">
          <li>Every message sent and received is timestamped and categorized</li>
          <li>AI-handled vs staff-handled conversations are clearly marked</li>
          <li>Sentiment analysis helps identify guest satisfaction levels</li>
          <li>Escalated conversations are flagged for staff review</li>
        </ul>
      </div>
    </div>
  );
};

export default BanyuLogs;

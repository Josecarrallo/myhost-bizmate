import React, { useState } from 'react';
import { ArrowLeft, Phone, Clock, Calendar, User, MapPin, FileText, Download, Filter, Search, ExternalLink } from 'lucide-react';

const KoraCallLogs = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('7days');

  // Demo data - will be replaced with real data from Supabase
  const callLogs = [
    {
      id: '1',
      call_id: 'call_abc123',
      phone_number: '+62 812 3456 7890',
      caller_name: 'Sarah Johnson',
      duration: 180, // seconds
      status: 'completed',
      intent: 'booking_inquiry',
      sentiment: 'positive',
      created_at: '2026-01-11T10:30:00Z',
      summary: 'Guest inquiring about availability for 2 villas from Feb 14-18. Interested in honeymoon package.',
      location: 'Australia',
      follow_up_required: true
    },
    {
      id: '2',
      call_id: 'call_def456',
      phone_number: '+1 555 123 4567',
      caller_name: 'Michael Chen',
      duration: 245,
      status: 'completed',
      intent: 'general_inquiry',
      sentiment: 'neutral',
      created_at: '2026-01-11T09:15:00Z',
      summary: 'Questions about amenities, pool hours, and nearby attractions.',
      location: 'USA',
      follow_up_required: false
    },
    {
      id: '3',
      call_id: 'call_ghi789',
      phone_number: '+44 20 7946 0958',
      caller_name: 'Emma Watson',
      duration: 95,
      status: 'missed',
      intent: 'unknown',
      sentiment: 'neutral',
      created_at: '2026-01-11T08:45:00Z',
      summary: 'Call not answered - outside reception hours',
      location: 'UK',
      follow_up_required: true
    },
    {
      id: '4',
      call_id: 'call_jkl012',
      phone_number: '+62 813 9876 5432',
      caller_name: 'Budi Santoso',
      duration: 320,
      status: 'completed',
      intent: 'complaint',
      sentiment: 'negative',
      created_at: '2026-01-10T16:20:00Z',
      summary: 'Issue with AC in villa 3. Requested immediate assistance.',
      location: 'Indonesia',
      follow_up_required: true
    },
    {
      id: '5',
      call_id: 'call_mno345',
      phone_number: '+61 2 9876 5432',
      caller_name: 'David Miller',
      duration: 150,
      status: 'completed',
      intent: 'booking_confirmation',
      sentiment: 'positive',
      created_at: '2026-01-10T14:10:00Z',
      summary: 'Confirmed reservation for March 5-10. Asked about airport transfer.',
      location: 'Australia',
      follow_up_required: false
    }
  ];

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'missed': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getIntentColor = (intent) => {
    switch (intent) {
      case 'booking_inquiry': return 'bg-purple-500/20 text-purple-300';
      case 'booking_confirmation': return 'bg-green-500/20 text-green-300';
      case 'complaint': return 'bg-red-500/20 text-red-300';
      case 'general_inquiry': return 'bg-blue-500/20 text-blue-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'neutral': return '😐';
      case 'negative': return '😟';
      default: return '🤔';
    }
  };

  const filteredCalls = callLogs.filter(call => {
    const matchesSearch = call.caller_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         call.phone_number.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || call.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: callLogs.length,
    completed: callLogs.filter(c => c.status === 'completed').length,
    missed: callLogs.filter(c => c.status === 'missed').length,
    avgDuration: Math.round(callLogs.reduce((sum, c) => sum + c.duration, 0) / callLogs.length),
    followUpRequired: callLogs.filter(c => c.follow_up_required).length
  };

  return (
    <div className="flex-1 h-screen bg-[#2a2f3a] p-4 relative overflow-auto">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Phone className="w-6 h-6" />
              Call Logs
            </h1>
            <p className="text-sm text-orange-400">Powered by KORA.AI</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] hover:from-[#c74f24] hover:to-[#e09620] rounded-xl text-white font-medium transition-all flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#d85a2a]/20 rounded-xl">
              <Phone className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Total Calls</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-xl">
              <Phone className="w-5 h-5 text-green-300" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Completed</p>
              <p className="text-2xl font-bold text-white">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-xl">
              <Phone className="w-5 h-5 text-red-300" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Missed</p>
              <p className="text-2xl font-bold text-white">{stats.missed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#d85a2a]/20 rounded-xl">
              <Clock className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Avg Duration</p>
              <p className="text-2xl font-bold text-white">{formatDuration(stats.avgDuration)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#d85a2a]/20 rounded-xl">
              <FileText className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Follow-ups</p>
              <p className="text-2xl font-bold text-white">{stats.followUpRequired}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#d85a2a]/50"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="missed">Missed</option>
            <option value="in_progress">In Progress</option>
          </select>
          <select
            value={filterDateRange}
            onChange={(e) => setFilterDateRange(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      {/* Call Logs List */}
      <div className="space-y-4">
        {filteredCalls.map((call) => (
          <div
            key={call.id}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#d85a2a]/20 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{call.caller_name}</h3>
                  <p className="text-white/60 text-sm">{call.phone_number}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(call.status)}`}>
                  {call.status.replace('_', ' ')}
                </span>
                {call.follow_up_required && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    Follow-up needed
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-white/40" />
                <span className="text-white/80 text-sm">{formatDate(call.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/40" />
                <span className="text-white/80 text-sm">{formatDuration(call.duration)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white/40" />
                <span className="text-white/80 text-sm">{call.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getSentimentEmoji(call.sentiment)}</span>
                <span className="text-white/80 text-sm capitalize">{call.sentiment}</span>
              </div>
            </div>

            <div className="mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getIntentColor(call.intent)}`}>
                {call.intent.replace('_', ' ')}
              </span>
            </div>

            <div className="bg-white/5 rounded-xl p-3 mb-4">
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-white/60 mt-1" />
                <p className="text-white/80 text-sm">{call.summary}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white text-sm font-medium transition-colors flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                View Full Transcript
              </button>
              <button className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl text-purple-300 text-sm font-medium transition-colors">
                Create Follow-up
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCalls.length === 0 && (
        <div className="text-center py-12">
          <Phone className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/60 text-lg">No calls found</p>
          <p className="text-white/40 text-sm mt-2">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default KoraCallLogs;

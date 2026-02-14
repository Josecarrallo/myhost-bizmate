import React, { useState } from 'react';
import { ArrowLeft, Phone, CheckCircle, X, Tag, Send, ArrowRight, Inbox } from 'lucide-react';

const KoraCallsInbox = ({ onBack }) => {
  // Mock calls inbox (missed/inbound needing action)
  const callsInbox = [
    {
      id: '1',
      caller_name: 'Emma Watson',
      phone_number: '+44 20 7946 0958',
      call_type: 'missed',
      timestamp: '2026-01-11T08:45:00Z',
      duration: 0,
      summary: 'Call not answered - outside reception hours',
      intent: 'unknown',
      qualified: null,
      location: 'UK'
    },
    {
      id: '2',
      caller_name: 'Marcus Lee',
      phone_number: '+65 9876 5432',
      call_type: 'inbound',
      timestamp: '2026-01-11T07:30:00Z',
      duration: 125,
      summary: 'Asking about villa availability for March 10-15. Family of 4. Budget conscious.',
      intent: 'booking_inquiry',
      qualified: null,
      location: 'Singapore'
    },
    {
      id: '3',
      caller_name: 'Ana Rodriguez',
      phone_number: '+34 612 345 678',
      call_type: 'inbound',
      timestamp: '2026-01-11T06:15:00Z',
      duration: 95,
      summary: 'General questions about amenities, pool, and nearby restaurants.',
      intent: 'general_inquiry',
      qualified: null,
      location: 'Spain'
    },
    {
      id: '4',
      caller_name: 'Unknown Caller',
      phone_number: '+1 555 987 6543',
      call_type: 'missed',
      timestamp: '2026-01-10T22:30:00Z',
      duration: 0,
      summary: 'Missed call - no voicemail left',
      intent: 'unknown',
      qualified: null,
      location: 'USA'
    }
  ];

  const [calls, setCalls] = useState(callsInbox);

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60); // minutes

    if (diff < 60) return `${diff}min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const handleQualify = (callId, isQualified) => {
    setCalls(calls.map(call =>
      call.id === callId
        ? { ...call, qualified: isQualified }
        : call
    ));

    if (isQualified) {
      alert(`Call ${callId} marked as QUALIFIED and sent to LUMINA Inbox! (Mock)`);
    } else {
      alert(`Call ${callId} marked as NOT QUALIFIED (Mock)`);
    }
  };

  const handleSendToLumina = (call) => {
    alert(`Sending ${call.caller_name} to LUMINA.AI Inbox as new lead! (Mock)`);
  };

  const getCallTypeColor = (type) => {
    switch (type) {
      case 'missed': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'inbound': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getIntentColor = (intent) => {
    switch (intent) {
      case 'booking_inquiry': return 'bg-purple-500/20 text-purple-300';
      case 'general_inquiry': return 'bg-blue-500/20 text-blue-300';
      case 'complaint': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const pendingCalls = calls.filter(c => c.qualified === null);
  const qualifiedCalls = calls.filter(c => c.qualified === true);
  const notQualifiedCalls = calls.filter(c => c.qualified === false);

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
                <Inbox className="w-6 h-6" />
                Calls Inbox
              </h1>
              <p className="text-sm text-orange-400">Powered by KORA.AI</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/20">
              <span className="text-white/60 text-sm">Pending: </span>
              <span className="text-orange-400 font-bold">{pendingCalls.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Pending Review</p>
              <p className="text-3xl font-bold text-white">{pendingCalls.length}</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <Phone className="w-6 h-6 text-yellow-300" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Qualified</p>
              <p className="text-3xl font-bold text-white">{qualifiedCalls.length}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-300" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Not Qualified</p>
              <p className="text-3xl font-bold text-white">{notQualifiedCalls.length}</p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-xl">
              <X className="w-6 h-6 text-red-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Calls List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Calls Needing Action</h2>

        {pendingCalls.length === 0 && (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-12 border border-white/10 text-center">
            <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">All caught up!</h3>
            <p className="text-white/60">No calls pending review at the moment</p>
          </div>
        )}

        {pendingCalls.map((call) => (
          <div
            key={call.id}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#d85a2a]/20 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{call.caller_name}</h3>
                  <p className="text-white/60 text-sm">{call.phone_number}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCallTypeColor(call.call_type)}`}>
                  {call.call_type}
                </span>
                <span className="text-white/60 text-sm">{formatTime(call.timestamp)}</span>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-2 mb-3">
                <Tag className="w-4 h-4 text-white/60 mt-1" />
                <div className="flex-1">
                  <p className="text-white/80 text-sm mb-2">{call.summary}</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getIntentColor(call.intent)}`}>
                      {call.intent.replace('_', ' ')}
                    </span>
                    <span className="text-white/40 text-xs">• {call.location}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQualify(call.id, true)}
                className="flex-1 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl text-green-300 font-semibold transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Qualified
              </button>
              <button
                onClick={() => handleQualify(call.id, false)}
                className="flex-1 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-300 font-semibold transition-all flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Not Qualified
              </button>
            </div>
          </div>
        ))}

        {/* Qualified Calls */}
        {qualifiedCalls.length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-white mt-8">Recently Qualified</h2>
            {qualifiedCalls.map((call) => (
              <div
                key={call.id}
                className="bg-green-500/10 backdrop-blur-md rounded-2xl p-6 border border-green-500/20"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{call.caller_name}</h4>
                      <p className="text-white/60 text-sm">{call.summary}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSendToLumina(call)}
                    className="px-4 py-2 bg-[#d85a2a]/20 hover:bg-[#d85a2a]/30 border border-[#d85a2a]/30 rounded-lg text-orange-400 text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap"
                  >
                    Send to LUMINA
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default KoraCallsInbox;

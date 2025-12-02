import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  MessageSquare,
  Phone,
  CheckCircle,
  Clock
} from 'lucide-react';

const VoiceAIAgent = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [callStatus, setCallStatus] = useState('idle');
  const [currentCall, setCurrentCall] = useState(null);
  const [callHistory] = useState([
    {
      id: 1,
      guestName: "Sarah Johnson",
      timestamp: "2025-11-07 14:30",
      duration: "3:45",
      topic: "Booking inquiry",
      status: "completed",
      summary: "Guest inquired about availability for Dec 15-20. AI confirmed availability and sent booking link.",
      actions: ["Sent booking link", "Updated calendar"]
    },
    {
      id: 2,
      guestName: "Marco Rossi",
      timestamp: "2025-11-07 10:15",
      duration: "2:20",
      topic: "Check-in question",
      status: "completed",
      summary: "Guest asked about early check-in. AI confirmed 2pm policy and offered luggage storage.",
      actions: ["Confirmed policy", "Sent directions"]
    },
    {
      id: 3,
      guestName: "Ana García",
      timestamp: "2025-11-06 16:45",
      duration: "5:10",
      topic: "Special requests",
      status: "completed",
      summary: "Anniversary celebration setup requested. AI arranged flowers and champagne.",
      actions: ["Created task", "Notified housekeeping"]
    }
  ]);

  const [voiceSettings, setVoiceSettings] = useState({
    language: 'en',
    voice: 'female',
    speed: 'normal',
    autoAnswer: false
  });

  const mockStats = {
    totalCalls: 156,
    avgDuration: "3:45",
    satisfactionRate: "94%",
    autoResolved: "87%",
    callsToday: 12,
    activeNow: 0
  };

  const startCall = () => {
    setCallStatus('connecting');
    setTimeout(() => {
      setCallStatus('active');
      setCurrentCall({
        guestName: "Demo Guest",
        startTime: new Date(),
        topic: "Live Demo Call"
      });
    }, 2000);
  };

  const endCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      setCallStatus('idle');
      setCurrentCall(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-orange-200/30 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="bg-white/95 backdrop-blur-sm border-b-2 border-white/50 p-4 relative z-10 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-orange-600 hover:text-orange-500 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-black text-orange-600 mb-1">MY HOST</h2>
            <p className="text-xl md:text-2xl font-bold text-orange-500">BizMate</p>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 relative z-10">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/50 shadow-lg">
              <div className="text-3xl font-black text-purple-600">{mockStats.totalCalls}</div>
              <div className="text-xs font-semibold text-gray-600 mt-1">Total Calls</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/50 shadow-lg">
              <div className="text-3xl font-black text-blue-600">{mockStats.avgDuration}</div>
              <div className="text-xs font-semibold text-gray-600 mt-1">Avg Duration</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/50 shadow-lg">
              <div className="text-3xl font-black text-green-600">{mockStats.satisfactionRate}</div>
              <div className="text-xs font-semibold text-gray-600 mt-1">Satisfaction</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/50 shadow-lg">
              <div className="text-3xl font-black text-orange-600">{mockStats.autoResolved}</div>
              <div className="text-xs font-semibold text-gray-600 mt-1">Auto Resolved</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/50 shadow-lg">
              <div className="text-3xl font-black text-pink-600">{mockStats.callsToday}</div>
              <div className="text-xs font-semibold text-gray-600 mt-1">Calls Today</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/50 shadow-lg">
              <div className="text-3xl font-black text-red-600">{mockStats.activeNow}</div>
              <div className="text-xs font-semibold text-gray-600 mt-1">Active Now</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border-2 border-white/50 shadow-2xl">
                <h2 className="text-2xl font-black mb-6 text-orange-600">Voice Agent Control</h2>

                {callStatus === 'idle' && (
                  <div className="text-center py-12">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-6 shadow-2xl">
                      <MessageSquare className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-orange-600 mb-2">Agent Ready</h3>
                    <p className="text-gray-600 mb-8">Start a demo call to test the AI voice agent</p>
                    <button
                      onClick={startCall}
                      className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-black text-lg hover:shadow-2xl transition-all"
                    >
                      Start Demo Call
                    </button>
                  </div>
                )}

                {callStatus === 'connecting' && (
                  <div className="text-center py-12">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-2xl animate-pulse">
                      <Phone className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-orange-600 mb-2">Connecting...</h3>
                    <p className="text-gray-600">Establishing connection with AI agent</p>
                  </div>
                )}

                {callStatus === 'active' && (
                  <div className="text-center py-12">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6 shadow-2xl relative">
                      <Phone className="w-16 h-16 text-white" />
                      <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping"></div>
                    </div>
                    <h3 className="text-2xl font-black text-green-600 mb-2">Call Active</h3>
                    <p className="text-orange-600 font-bold text-lg mb-2">{currentCall?.guestName}</p>
                    <p className="text-gray-600 mb-6">{currentCall?.topic}</p>

                    <div className="flex items-center justify-center gap-2 mb-8">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 bg-green-500 rounded-full animate-pulse"
                          style={{
                            height: `${Math.random() * 40 + 20}px`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        ></div>
                      ))}
                    </div>

                    <button
                      onClick={endCall}
                      className="px-8 py-4 bg-red-500 text-white rounded-2xl font-black text-lg hover:bg-red-600 transition-all"
                    >
                      End Call
                    </button>
                  </div>
                )}

                {callStatus === 'ended' && (
                  <div className="text-center py-12">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center mb-6 shadow-2xl">
                      <CheckCircle className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-orange-600 mb-2">Call Ended</h3>
                    <p className="text-gray-600">Saving call summary...</p>
                  </div>
                )}
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/50 shadow-2xl">
                <h3 className="text-xl font-black mb-4 text-orange-600">Voice Settings</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-orange-600 mb-2">Language</label>
                    <select
                      value={voiceSettings.language}
                      onChange={(e) => setVoiceSettings({...voiceSettings, language: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none font-semibold text-orange-600"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="it">Italiano</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-orange-600 mb-2">Voice Type</label>
                    <select
                      value={voiceSettings.voice}
                      onChange={(e) => setVoiceSettings({...voiceSettings, voice: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none font-semibold text-orange-600"
                    >
                      <option value="female">Female - Professional</option>
                      <option value="male">Male - Professional</option>
                      <option value="neutral">Neutral - Friendly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-orange-600 mb-2">Speaking Speed</label>
                    <select
                      value={voiceSettings.speed}
                      onChange={(e) => setVoiceSettings({...voiceSettings, speed: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none font-semibold text-orange-600"
                    >
                      <option value="slow">Slow</option>
                      <option value="normal">Normal</option>
                      <option value="fast">Fast</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-bold text-orange-600">Auto-answer Calls</div>
                      <div className="text-xs text-gray-600">Agent answers automatically</div>
                    </div>
                    <button
                      onClick={() => setVoiceSettings({...voiceSettings, autoAnswer: !voiceSettings.autoAnswer})}
                      className={`w-14 h-8 rounded-full transition-all ${
                        voiceSettings.autoAnswer ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-6 h-6 bg-white rounded-full transition-all ${
                        voiceSettings.autoAnswer ? 'ml-7' : 'ml-1'
                      }`}></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/50 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-orange-600">Call History</h2>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm">
                  Export
                </button>
              </div>

              <div className="space-y-4 max-h-[800px] overflow-y-auto">
                {callHistory.map((call) => (
                  <div key={call.id} className="border-2 border-gray-200 rounded-2xl p-4 hover:border-orange-300 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-black text-lg text-orange-600">{call.guestName}</h4>
                        <p className="text-sm text-gray-600">{call.timestamp}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-bold text-sm text-orange-600">{call.duration}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold">
                        {call.topic}
                      </span>
                      <span className="inline-block ml-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                        {call.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{call.summary}</p>

                    <div className="border-t-2 border-gray-100 pt-3">
                      <p className="text-xs font-bold text-gray-600 mb-2">Actions Taken:</p>
                      <div className="flex flex-wrap gap-2">
                        {call.actions.map((action, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-semibold text-gray-700">
                            ✓ {action}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-200">
              <div className="text-4xl mb-3">🌍</div>
              <h3 className="font-black text-lg text-orange-600 mb-2">Multi-language</h3>
              <p className="text-sm text-gray-700">Supports 50+ languages with natural accent</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 border-2 border-pink-200">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="font-black text-lg text-orange-600 mb-2">24/7 Availability</h3>
              <p className="text-sm text-gray-700">Never miss a call, always available for guests</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-black text-lg text-orange-600 mb-2">Instant Actions</h3>
              <p className="text-sm text-gray-700">Creates bookings, sends info, updates calendar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAIAgent;

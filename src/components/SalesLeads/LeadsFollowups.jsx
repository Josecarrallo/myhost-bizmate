import React from 'react';
import { ArrowLeft, Clock, Zap, Target, Calendar, RefreshCw, Gift, TrendingUp } from 'lucide-react';

const LeadsFollowups = ({ onBack }) => {
  return (
    <div className="flex-1 h-screen bg-[#2a2f3a] p-4 relative overflow-auto">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl border border-white/10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Automated Follow-ups
            </h1>
            <p className="text-sm text-orange-400">BANYU.AI Follow-Up Engine</p>
          </div>
        </div>
      </div>

      {/* BLOCK 1 — Conversion Follow-Ups (Short-Term) */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10 mb-6">
        <div className="text-center mb-6">
          <Zap className="w-16 h-16 mx-auto mb-4 text-orange-400" />
          <h3 className="text-2xl font-bold text-white mb-2">BLOCK 1 — Conversion Follow-Ups</h3>
          <p className="text-sm text-orange-400 font-semibold mb-2">Short-term conversion (first 72 hours)</p>
          <p className="text-gray-300">BANYU.AI automatically follows up with leads at the perfect time</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white">
            <Clock className="w-10 h-10 mb-3" />
            <h4 className="font-bold mb-2">24h Follow-Up</h4>
            <p className="text-sm opacity-90">Gentle reminder: "Still interested in Villa Sunset?"</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl p-6 text-white">
            <Target className="w-10 h-10 mb-3" />
            <h4 className="font-bold mb-2">48h Value Push</h4>
            <p className="text-sm opacity-90">Highlight benefits: "Last 3 nights available this month!"</p>
          </div>
          <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-xl p-6 text-white">
            <Zap className="w-10 h-10 mb-3" />
            <h4 className="font-bold mb-2">72h Final Call</h4>
            <p className="text-sm opacity-90">Last chance: "Special discount ends today"</p>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-6 border border-white/20">
          <p className="text-sm text-white font-semibold mb-3">How BANYU.AI Follow-Up Engine works:</p>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>✅ Listens to events: <code className="bg-white/20 px-2 py-1 rounded text-orange-400">lead_created</code>, <code className="bg-white/20 px-2 py-1 rounded text-orange-400">ai_hot_lead_detected</code>, <code className="bg-white/20 px-2 py-1 rounded text-orange-400">no_response_24h</code></li>
            <li>✅ Personalizes messages with guest name, dates consulted, property type</li>
            <li>✅ Updates lead state: FOLLOWING_UP → COLD → WON → LOST</li>
            <li>✅ Notifies owner if lead is HOT or high-value</li>
            <li>✅ Works via WhatsApp and Email</li>
          </ul>
        </div>
      </div>

      {/* Explanation Box Between Blocks */}
      <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-500/30 mb-6">
        <div className="flex items-start gap-4">
          <TrendingUp className="w-8 h-8 text-purple-300 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-lg font-bold text-white mb-3">Follow-ups in LUMINA.AI work in two layers:</h4>
            <div className="space-y-2 text-sm text-gray-200">
              <p className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">•</span>
                <span><strong className="text-white">Conversion Follow-Ups</strong> close hot leads in the first 72 hours.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">•</span>
                <span><strong className="text-white">Time-Based Follow-Ups</strong> automatically re-engage cold leads over time until they are ready to book.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BLOCK 2 — Time-Based Follow-Ups (Long-Term) */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10 mb-6">
        <div className="text-center mb-6">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-purple-400" />
          <h3 className="text-2xl font-bold text-white mb-2">BLOCK 2 — Time-Based Follow-Ups</h3>
          <p className="text-sm text-purple-400 font-semibold mb-2">Long-term re-engagement (7+ days)</p>
          <p className="text-gray-300">Automatically nurture cold leads until they convert</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* 7 Days */}
          <div className="bg-white/10 rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <RefreshCw className="w-8 h-8 text-green-400" />
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">
                ON
              </span>
            </div>
            <h4 className="font-bold text-white mb-2">7 Days – Soft Re-engagement</h4>
            <p className="text-sm text-gray-300 mb-3">"Hey, we noticed you were interested in our villas..."</p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="px-2 py-1 bg-white/5 rounded">WhatsApp</span>
              <span className="px-2 py-1 bg-white/5 rounded">Email</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Last run: 2 hours ago</p>
          </div>

          {/* 14 Days */}
          <div className="bg-white/10 rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-yellow-400" />
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full border border-yellow-500/30">
                ON
              </span>
            </div>
            <h4 className="font-bold text-white mb-2">14 Days – Reminder + Value</h4>
            <p className="text-sm text-gray-300 mb-3">"New availability for your dates! Plus 10% early bird discount."</p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="px-2 py-1 bg-white/5 rounded">WhatsApp</span>
              <span className="px-2 py-1 bg-white/5 rounded">Email</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Last run: 5 hours ago</p>
          </div>

          {/* 30 Days */}
          <div className="bg-white/10 rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <Gift className="w-8 h-8 text-orange-400" />
              <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs font-bold rounded-full border border-orange-500/30">
                ON
              </span>
            </div>
            <h4 className="font-bold text-white mb-2">30 Days – Re-activation / New Offer</h4>
            <p className="text-sm text-gray-300 mb-3">"Exclusive offer just for you: 15% off your next stay!"</p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="px-2 py-1 bg-white/5 rounded">WhatsApp</span>
              <span className="px-2 py-1 bg-white/5 rounded">Email</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Last run: 1 day ago</p>
          </div>

          {/* Campaign / Seasonal - OPTIONAL */}
          <div className="bg-white/10 rounded-xl p-6 border border-pink-500/30">
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-8 h-8 text-pink-400" />
              <span className="px-3 py-1 bg-gray-500/20 text-gray-400 text-xs font-bold rounded-full border border-gray-500/30">
                OFF
              </span>
            </div>
            <h4 className="font-bold text-white mb-2">Campaign / Seasonal</h4>
            <p className="text-sm text-gray-300 mb-3">"Summer season starts soon! Book now and save 20%"</p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="px-2 py-1 bg-white/5 rounded">WhatsApp</span>
              <span className="px-2 py-1 bg-white/5 rounded">Email</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Manual trigger only</p>
            <div className="mt-3 p-2 bg-pink-500/10 rounded border border-pink-500/20">
              <p className="text-xs text-pink-300 font-semibold">💡 Send to entire database</p>
              <p className="text-xs text-gray-400 mt-1">Perfect for seasonal campaigns, special events, or new offers</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-6 border border-white/20">
          <p className="text-sm text-white font-semibold mb-3">How Time-Based Follow-Ups work:</p>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>✅ Triggered automatically by n8n workflows based on lead age</li>
            <li>✅ Only sent to leads in COLD or LOST state (not actively converting)</li>
            <li>✅ Personalized with latest availability and seasonal offers</li>
            <li>✅ Stop automatically if lead converts or unsubscribes</li>
            <li>✅ Works via WhatsApp and Email across all channels</li>
          </ul>
          <p className="text-xs text-purple-400 mt-4 italic">Powered by existing and future n8n workflows (WF-SP-03 extended)</p>
        </div>
      </div>

      {/* Key Rule - Updated */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl border border-orange-400/30">
        <p className="text-sm font-bold text-white mb-2">Key Rule:</p>
        <p className="text-sm text-white/90">
          Follow-ups do NOT capture leads and do NOT respond in real time.
          They only act on leads already created by <strong>WF-SP-01</strong> and processed by <strong>WF-SP-03</strong>.
        </p>
      </div>
    </div>
  );
};

export default LeadsFollowups;

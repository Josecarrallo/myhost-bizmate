import React from 'react';
import { ArrowLeft, Clock, Zap, Target } from 'lucide-react';

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

      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
        <div className="text-center mb-6">
          <Zap className="w-16 h-16 mx-auto mb-4 text-orange-400" />
          <h3 className="text-2xl font-bold text-white mb-2">The Conversion Engine</h3>
          <p className="text-gray-300 mb-4">BANYU.AI automatically follows up with leads at the perfect time</p>
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
          <div className="mt-4 p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg text-white">
            <p className="text-sm font-bold">Key Rule:</p>
            <p className="text-xs">This flow DOES NOT capture leads (WF-SP-01) or respond in real-time (WF-SP-02). This flow CLOSES THE SALE.</p>
          </div>
          <p className="text-xs text-orange-400 mt-4 italic">Coming soon - View scheduled follow-ups and conversion metrics</p>
        </div>
      </div>
    </div>
  );
};

export default LeadsFollowups;

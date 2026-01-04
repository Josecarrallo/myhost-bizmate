import React from 'react';
import { ArrowLeft, TrendingUp, Circle } from 'lucide-react';

const LeadsPipeline = ({ onBack }) => {
  const stages = [
    { name: 'NEW LEAD', count: 12, color: 'from-blue-400 to-blue-600', description: 'Fresh inquiries from all channels' },
    { name: 'ENGAGED', count: 8, color: 'from-yellow-400 to-yellow-600', description: 'AI is actively conversing' },
    { name: 'HOT', count: 5, color: 'from-orange-400 to-orange-600', description: 'High interest - ready to book' },
    { name: 'WON', count: 3, color: 'from-green-400 to-green-600', description: 'Booking confirmed!' },
    { name: 'LOST', count: 2, color: 'from-gray-400 to-gray-600', description: 'Did not convert' }
  ];

  return (
    <div className="flex-1 h-screen bg-[#2a2f3a] p-4 relative overflow-auto">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl border border-white/10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Sales Pipeline
            </h1>
            <p className="text-sm text-orange-400">Powered by BANYU.AI</p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Visual Lead Pipeline</h3>
          <p className="text-gray-300 mb-4">Track every lead from first contact to booking</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {stages.map((stage, index) => (
            <div key={stage.name} className="relative">
              <div className={`bg-gradient-to-br ${stage.color} rounded-xl p-6 text-white shadow-lg`}>
                <div className="text-center">
                  <Circle className="w-8 h-8 mx-auto mb-2" />
                  <h4 className="font-bold text-sm mb-1">{stage.name}</h4>
                  <div className="text-3xl font-black mb-2">{stage.count}</div>
                  <p className="text-xs opacity-90">{stage.description}</p>
                </div>
              </div>
              {index < stages.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-orange-400 text-2xl font-bold">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white/10 rounded-xl p-6 border border-white/20">
          <p className="text-sm text-white font-semibold mb-3">How the pipeline works:</p>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>✅ <strong>NEW LEAD:</strong> Every contact automatically enters here (WhatsApp, Email, IG, Web)</li>
            <li>✅ <strong>ENGAGED:</strong> BANYU.AI detects interest and starts conversation</li>
            <li>✅ <strong>HOT:</strong> High intent detected (asking prices, dates, availability)</li>
            <li>✅ <strong>WON:</strong> Booking confirmed and payment received</li>
            <li>✅ <strong>LOST:</strong> No response after 72h or explicitly declined</li>
          </ul>
          <p className="text-xs text-orange-400 mt-4 italic">Coming soon - Kanban-style drag & drop interface</p>
        </div>
      </div>
    </div>
  );
};

export default LeadsPipeline;

import React, { useState } from 'react';
import { Bot, ChevronRight, Activity, Sparkles, Zap } from 'lucide-react';

const AiAgentsWidget = ({ onOpenAgentCenter }) => {
  const [isHovered, setIsHovered] = useState(false);

  // All AI Agents (6 total)
  const agents = [
    { id: 'osiris', name: 'OSIRIS', operation: 'Operations', status: 'Active' },
    { id: 'lumina', name: 'LUMINA', operation: 'Sales', status: 'Active' },
    { id: 'banyu', name: 'BANYU', operation: 'WhatsApp Assistant', status: 'Active' },
    { id: 'kora', name: 'KORA', operation: 'Voice Assistant', status: 'Active' },
    { id: 'iris', name: 'IRIS', operation: 'Marketing', status: 'Active' },
    { id: 'aura', name: 'AURA', operation: 'Proactive Context', status: 'Active' }
  ];

  const activeCount = agents.filter(a => a.status === 'Active').length;
  const totalAgents = agents.length;

  return (
    <div
      className="fixed top-4 right-4 z-30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Widget Button - Ultra llamativo con animación */}
      <button
        onClick={onOpenAgentCenter}
        className={`
          flex items-center gap-3 px-5 py-4
          bg-gradient-to-r from-[#FF8C42] via-[#d85a2a] to-[#FF8C42]
          border-2 border-white shadow-2xl rounded-2xl
          transition-all duration-300
          animate-pulse-glow
          ${isHovered ? 'scale-110 shadow-orange-500/50 border-white' : 'shadow-orange-500/30'}
        `}
      >
        {/* Agent Icon with strong pulse animation */}
        <div className="relative">
          <Bot className="w-6 h-6 text-white animate-bounce-subtle" />
          <div className="absolute -top-2 -right-2">
            <span className="flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-white border-2 border-orange-500"></span>
            </span>
          </div>
          {/* Lightning bolt indicator */}
          <Zap className="absolute -bottom-1 -right-1 w-3 h-3 text-yellow-300 animate-pulse" />
        </div>

        {/* Text Content */}
        <div className="flex flex-col items-start">
          <span className="text-white font-bold text-base tracking-wide drop-shadow-lg">AI AGENTS</span>
          <span className="text-white/90 text-xs font-bold drop-shadow">
            {totalAgents} AGENTS • {activeCount} ACTIVE
          </span>
        </div>

        {/* Expand Arrow con animación */}
        <ChevronRight className={`w-5 h-5 text-white transition-transform ${isHovered ? 'translate-x-2' : 'translate-x-0'} animate-pulse`} />
      </button>

      {/* Hover Preview - 6 agentes con AURA agrupando contexto */}
      {isHovered && (
        <div className="absolute top-full right-0 mt-3 w-80 bg-gradient-to-br from-[#2a2f3a] to-[#1f2329] border-2 border-orange-500/30 rounded-2xl shadow-2xl p-4 animate-fadeIn">
          {/* All AI Agents */}
          <div className="mb-4">
            <div className="text-xs text-orange-400 font-bold mb-3 flex items-center gap-2 uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              <span>AI Agents Active</span>
            </div>
            <div className="space-y-2">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between bg-white/5 rounded-lg p-2 border border-white/10">
                  <div className="flex flex-col">
                    <span className="text-white text-sm font-bold">{agent.name}</span>
                    <span className="text-orange-300 text-xs">
                      {agent.operation}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-xs font-medium px-2 py-1 bg-orange-500/20 rounded">{agent.status}</span>
                    <div className="w-2 h-2 rounded-full animate-pulse shadow-lg bg-white shadow-white/50"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10">
            <button className="w-full text-sm text-white font-bold hover:text-orange-300 transition-colors flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 py-2 rounded-lg border border-orange-500/30">
              <Sparkles className="w-4 h-4" />
              <span>OPEN AGENT CENTER</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiAgentsWidget;

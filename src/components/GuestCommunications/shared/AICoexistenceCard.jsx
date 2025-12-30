import React from 'react';
import { Check, X } from 'lucide-react';

/**
 * AICoexistenceCard
 * Card explaining one AI coexistence mode (Auto/Assist/Human)
 */
const AICoexistenceCard = ({ mode, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(mode.id)}
      className={`bg-[#1a1f2e] rounded-xl p-5 border-2 cursor-pointer transition-all ${
        isSelected
          ? 'border-[#d85a2a] shadow-lg shadow-[#d85a2a]/20'
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{mode.icon}</span>
        <div className="flex-1">
          <h4 className="text-white font-semibold text-lg">{mode.name}</h4>
          <p className="text-white/60 text-sm">{mode.description}</p>
        </div>
        {isSelected && (
          <div className="w-6 h-6 rounded-full bg-[#d85a2a] flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Features */}
      <div className="space-y-2 mb-3">
        <p className="text-white/80 text-xs font-medium uppercase tracking-wide">Features:</p>
        {mode.features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span className="text-white/70">{feature}</span>
          </div>
        ))}
      </div>

      {/* Limitations */}
      {mode.limitations && mode.limitations.length > 0 && (
        <div className="space-y-2 mb-3">
          <p className="text-white/80 text-xs font-medium uppercase tracking-wide">Limitations:</p>
          {mode.limitations.map((limitation, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-white/60">{limitation}</span>
            </div>
          ))}
        </div>
      )}

      {/* Recommended for */}
      {mode.recommended_for && (
        <div className="pt-3 border-t border-white/10">
          <p className="text-white/50 text-xs">
            <span className="font-medium">Recommended for:</span> {mode.recommended_for}
          </p>
        </div>
      )}
    </div>
  );
};

export default AICoexistenceCard;

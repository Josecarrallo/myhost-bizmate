import React from 'react';

/**
 * Progress Bar component with optional markers
 *
 * @param {number} value - Progress value (0-100)
 * @param {string} label - Optional label above the bar
 * @param {boolean} showPercentage - Show percentage text
 * @param {Array} markers - Array of { position: number (0-100), label: string, highlight?: boolean }
 * @param {string} variant - 'accent' | 'success' | 'warning' | 'danger'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {string} className - Additional classes
 */
const ProgressBar = ({
  value = 0,
  label,
  showPercentage = false,
  markers = [],
  variant = 'accent',
  size = 'md',
  className = '',
}) => {
  // Clamp value between 0 and 100
  const progress = Math.min(100, Math.max(0, value));

  // Variant gradients
  const variants = {
    accent: 'bg-gradient-to-r from-[#f5791f] to-[#f2b04a]',
    success: 'bg-gradient-to-r from-[#2ea36a] to-[#4cd08f]',
    warning: 'bg-gradient-to-r from-[#e0a83b] to-[#e6b24d]',
    danger: 'bg-gradient-to-r from-[#ef6b57] to-[#f0806e]',
  };

  // Size styles
  const sizes = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const barGradient = variants[variant] || variants.accent;
  const barHeight = sizes[size] || sizes.md;

  return (
    <div className={`w-full ${className}`}>
      {/* Label and percentage */}
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-xs font-medium text-[#8a93a1] uppercase tracking-wider">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-xs font-mono font-semibold text-[#aab2bf]">
              {progress}%
            </span>
          )}
        </div>
      )}

      {/* Progress track */}
      <div className="relative">
        <div
          className={`
            w-full rounded-full overflow-hidden
            bg-white/10
            ${barHeight}
          `}
        >
          {/* Progress fill */}
          <div
            className={`
              h-full rounded-full transition-all duration-500 ease-out
              ${barGradient}
            `}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Markers */}
        {markers.length > 0 && (
          <div className="relative mt-2">
            {markers.map((marker, index) => (
              <div
                key={index}
                className="absolute transform -translate-x-1/2"
                style={{ left: `${marker.position}%` }}
              >
                {/* Marker dot */}
                <div
                  className={`
                    w-1.5 h-1.5 rounded-full mx-auto mb-1
                    ${marker.highlight
                      ? 'bg-[#f5791f]'
                      : 'bg-white/30'
                    }
                  `}
                />
                {/* Marker label */}
                <span
                  className={`
                    text-[10px] whitespace-nowrap
                    ${marker.highlight
                      ? 'text-white font-semibold'
                      : 'text-[#8a93a1] font-medium'
                    }
                  `}
                >
                  {marker.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;

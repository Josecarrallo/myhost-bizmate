import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Loading Spinner component
 *
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {string} text - Optional loading text
 * @param {boolean} fullScreen - Center in full screen
 * @param {string} className - Additional classes
 */
const LoadingSpinner = ({
  size = 'md',
  text,
  fullScreen = false,
  className = '',
}) => {
  // Size configurations
  const sizes = {
    sm: {
      icon: 'w-4 h-4',
      text: 'text-xs',
      gap: 'gap-2',
    },
    md: {
      icon: 'w-6 h-6',
      text: 'text-sm',
      gap: 'gap-3',
    },
    lg: {
      icon: 'w-10 h-10',
      text: 'text-base',
      gap: 'gap-4',
    },
  };

  const sizeConfig = sizes[size] || sizes.md;

  const content = (
    <div
      className={`
        flex flex-col items-center justify-center
        ${sizeConfig.gap}
        ${className}
      `}
    >
      <Loader2
        className={`
          ${sizeConfig.icon}
          text-[#f5791f] animate-spin
        `}
      />
      {text && (
        <p className={`${sizeConfig.text} text-[#aab2bf] font-medium`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#272e39]/80 z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;

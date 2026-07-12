import React from 'react';

/**
 * Badge/Pill component for status indicators, tags, etc.
 *
 * @param {string} variant - 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} dot - Show status dot before text
 * @param {boolean} outline - Use outline style instead of filled
 * @param {string} className - Additional classes
 * @param {React.ReactNode} children - Badge content
 */
const Badge = ({
  variant = 'neutral',
  size = 'md',
  dot = false,
  outline = false,
  className = '',
  children,
}) => {
  // Variant styles
  const variants = {
    success: {
      filled: 'bg-green-500/20 text-green-400',
      outline: 'border border-green-500/50 text-green-400',
      dot: 'bg-green-400',
    },
    warning: {
      filled: 'bg-yellow-500/20 text-yellow-400',
      outline: 'border border-yellow-500/50 text-yellow-400',
      dot: 'bg-yellow-400',
    },
    danger: {
      filled: 'bg-red-500/20 text-red-400',
      outline: 'border border-red-500/50 text-red-400',
      dot: 'bg-red-400',
    },
    info: {
      filled: 'bg-blue-500/20 text-blue-400',
      outline: 'border border-blue-500/50 text-blue-400',
      dot: 'bg-blue-400',
    },
    neutral: {
      filled: 'bg-[#3a434f] text-[#aab2bf]',
      outline: 'border border-white/30 text-[#aab2bf]',
      dot: 'bg-[#aab2bf]',
    },
    accent: {
      filled: 'bg-[#f5791f]/20 text-[#f5791f]',
      outline: 'border border-[#f5791f]/50 text-[#f5791f]',
      dot: 'bg-[#f5791f]',
    },
  };

  // Size styles
  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] font-semibold',
    md: 'px-3 py-1 text-xs font-semibold',
    lg: 'px-4 py-1.5 text-sm font-bold',
  };

  const variantStyle = variants[variant] || variants.neutral;
  const sizeStyle = sizes[size] || sizes.md;
  const fillStyle = outline ? variantStyle.outline : variantStyle.filled;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full
        ${fillStyle}
        ${sizeStyle}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${variantStyle.dot}`} />
      )}
      {children}
    </span>
  );
};

export default Badge;

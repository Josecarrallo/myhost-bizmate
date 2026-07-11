import React from 'react';
import { Inbox } from 'lucide-react';

/**
 * Empty State component for when there's no data to display
 *
 * @param {React.ComponentType} icon - Lucide icon component
 * @param {string} title - Main message
 * @param {string} description - Secondary description
 * @param {React.ReactNode} action - Optional action button/link
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {string} className - Additional classes
 */
const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No hay datos',
  description,
  action,
  size = 'md',
  className = '',
}) => {
  // Size configurations
  const sizes = {
    sm: {
      container: 'py-6',
      icon: 'w-8 h-8',
      title: 'text-sm',
      description: 'text-xs',
    },
    md: {
      container: 'py-10',
      icon: 'w-12 h-12',
      title: 'text-base',
      description: 'text-sm',
    },
    lg: {
      container: 'py-16',
      icon: 'w-16 h-16',
      title: 'text-lg',
      description: 'text-base',
    },
  };

  const sizeConfig = sizes[size] || sizes.md;

  return (
    <div
      className={`
        flex flex-col items-center justify-center text-center
        ${sizeConfig.container}
        ${className}
      `}
    >
      {/* Icon container */}
      <div className="mb-4 p-4 rounded-full bg-[#3a434f]/50">
        <Icon
          className={`${sizeConfig.icon} text-[#6d7683]`}
          strokeWidth={1.5}
        />
      </div>

      {/* Title */}
      <h3
        className={`
          font-semibold text-[#aab2bf] mb-1
          ${sizeConfig.title}
        `}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p
          className={`
            text-[#6d7683] max-w-xs
            ${sizeConfig.description}
          `}
        >
          {description}
        </p>
      )}

      {/* Action */}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;

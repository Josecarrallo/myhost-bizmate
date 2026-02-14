import React from 'react';

/**
 * FeatureCard
 * Large card for the 3 main blocks in Overview
 */
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  features,
  primaryButton,
  secondaryButton,
  iconColor = '#d85a2a',
  children
}) => {
  return (
    <div className="bg-[#252b3b] rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 rounded-xl bg-white/5">
          <Icon className="w-8 h-8" style={{ color: iconColor }} />
        </div>
        <div className="flex-1">
          <h3 className="text-white text-xl font-semibold mb-1">{title}</h3>
          {description && (
            <p className="text-white/60 text-sm">{description}</p>
          )}
        </div>
      </div>

      {/* Features list */}
      {features && features.length > 0 && (
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-white/80 text-sm">
              <span className="text-[#d85a2a] mt-0.5">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Custom children content */}
      {children && (
        <div className="mb-6">
          {children}
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-wrap gap-3">
        {primaryButton && (
          <button
            onClick={primaryButton.onClick}
            className="bg-[#d85a2a] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#c14d1f] transition-colors flex items-center gap-2"
          >
            {primaryButton.icon && <primaryButton.icon className="w-5 h-5" />}
            {primaryButton.label}
          </button>
        )}
        {secondaryButton && (
          <button
            onClick={secondaryButton.onClick}
            className="bg-white/5 text-white/80 px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors flex items-center gap-2 border border-white/10"
          >
            {secondaryButton.icon && <secondaryButton.icon className="w-5 h-5" />}
            {secondaryButton.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default FeatureCard;

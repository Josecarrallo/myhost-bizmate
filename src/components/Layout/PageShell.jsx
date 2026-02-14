import React from 'react';
import { ArrowLeft, Info } from 'lucide-react';

/**
 * PageShell - Standard layout for all AI Operator pages
 *
 * Provides consistent structure:
 * - Header with title, subtitle, and back button
 * - "What the AI does here" helper card
 * - KPI cards row (4 metrics)
 * - Main content area
 */
const PageShell = ({
  title,
  subtitle,
  aiHelperText,
  kpis = [],
  onBack,
  children,
  headerActions
}) => {
  return (
    <div className="flex-1 h-screen bg-[#1a1f2e] overflow-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2a2f3a] to-[#1a1f2e] border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5 text-white/70" />
                </button>
              )}
              <div className="min-w-0 flex-1">
                <h1 className="text-lg md:text-2xl font-bold text-white truncate">{title}</h1>
                {subtitle && (
                  <p className="text-xs md:text-sm text-white/60 mt-1 truncate">{subtitle}</p>
                )}
              </div>
            </div>
            {headerActions && (
              <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                {headerActions}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">
        {/* AI Helper Card */}
        {aiHelperText && (
          <div className="bg-gradient-to-r from-[#d85a2a]/10 to-[#f5a524]/10 border border-[#d85a2a]/20 rounded-xl p-3 md:p-4">
            <div className="flex items-start gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-[#d85a2a]/20 rounded-lg flex-shrink-0">
                <Info className="w-4 h-4 md:w-5 md:h-5 text-[#FF8C42]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs md:text-sm font-semibold text-white mb-1">
                  What the AI does here
                </h3>
                <p className="text-xs md:text-sm text-white/70 leading-relaxed">
                  {aiHelperText}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        {kpis.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {kpis.map((kpi, index) => (
              <KPICard key={index} {...kpi} />
            ))}
          </div>
        )}

        {/* Main Content Area */}
        <div className="bg-[#2a2f3a] rounded-xl border border-white/10 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * KPICard - Metric display card
 */
const KPICard = ({ label, value, trend, icon: Icon, color = 'orange' }) => {
  const colorClasses = {
    orange: 'from-[#d85a2a] to-[#f5a524]',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
    red: 'from-red-500 to-rose-500'
  };

  const bgColorClasses = {
    orange: 'bg-[#d85a2a]/10',
    blue: 'bg-blue-500/10',
    green: 'bg-green-500/10',
    purple: 'bg-purple-500/10',
    red: 'bg-red-500/10'
  };

  return (
    <div className="bg-[#2a2f3a] border border-white/10 rounded-xl p-3 md:p-4 hover:border-[#d85a2a]/30 transition-colors">
      <div className="flex items-start justify-between mb-2 md:mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-1 truncate">
            {label}
          </p>
          <p className="text-xl md:text-2xl font-bold text-white truncate">
            {value}
          </p>
        </div>
        {Icon && (
          <div className={`p-1.5 md:p-2 ${bgColorClasses[color]} rounded-lg flex-shrink-0`}>
            <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
        )}
      </div>
      {trend && (
        <div className="flex items-center gap-1">
          <span className={`text-xs font-medium ${
            trend.direction === 'up' ? 'text-green-400' :
            trend.direction === 'down' ? 'text-red-400' :
            'text-white/50'
          }`}>
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {trend.value}
          </span>
          <span className="text-xs text-white/40 hidden md:inline">vs last period</span>
        </div>
      )}
    </div>
  );
};

export default PageShell;

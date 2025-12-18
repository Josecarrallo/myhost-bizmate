import React from 'react';
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CreditCard,
  Package
} from 'lucide-react';

const OwnerExecutiveSummary = ({ userName = 'José' }) => {
  // Mock data for KPIs
  const kpis = [
    {
      label: 'Guests in-house',
      value: '10',
      change: '+2%',
      subtext: '+2% vs last year',
      trend: 'up'
    },
    {
      label: 'Arrivals today',
      value: '8',
      change: '-1%',
      subtext: 'Today',
      trend: 'down'
    },
    {
      label: 'Revenue (MTD)',
      value: '$32,400',
      change: '+4%',
      subtext: '',
      trend: 'up'
    },
    {
      label: 'Occupancy',
      value: '68%',
      change: '+2%',
      subtext: '+6%  $210',
      trend: 'up'
    }
  ];

  // Mock data for Action Queue
  const actionQueue = [
    {
      icon: Package,
      label: '5 Check-outs today',
      time: 'Today',
      status: 'Pending',
      statusColor: 'orange'
    },
    {
      icon: CreditCard,
      label: '$1,280 Pending payments',
      time: 'Today',
      status: 'Pending',
      statusColor: 'orange'
    },
    {
      icon: AlertCircle,
      label: '3 Low supplies alerts',
      time: 'Today',
      status: 'Needs Action',
      statusColor: 'orange',
      alert: true
    }
  ];

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 overflow-auto relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-orange-200/30 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Content wrapper with relative z-index */}
      <div className="relative z-10">
      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Greeting */}
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">
          {getGreeting()}, {userName}
        </h2>
        <p className="text-base sm:text-lg text-white/90 font-semibold mb-6 sm:mb-8">Owner Executive Summary</p>

        {/* AI Snapshot Card */}
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-start gap-3 sm:gap-4 flex-1 w-full">
              <div className="p-2 bg-orange-500 rounded-lg flex-shrink-0">
                <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  MyHost AI - Today's Snapshot
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-1">
                  Occupancy is slightly lower compared to last year, but bookings for November in Bali are
                  picking up compared to last week.{' '}
                  <span className="text-gray-500 text-xs">lit 5m 1r atee 4t 5m 1 rates</span>
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Recommendation: Offer early booking discounts or adjust pricing for next weekend.
                </p>
              </div>
            </div>
            <button className="w-full sm:w-auto px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-sm whitespace-nowrap transition-colors flex-shrink-0">
              Ask MyHost AI
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {kpis.map((kpi, index) => (
            <div key={index} className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 sm:p-6 border-2 border-white/50 shadow-xl">
              <p className="text-xs sm:text-sm text-white/80 mb-1 sm:mb-2">{kpi.label}</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl sm:text-3xl font-bold text-white">{kpi.value}</span>
                <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-green-200' : 'text-red-200'}`}>
                  {kpi.change}
                </span>
              </div>
              {kpi.subtext && (
                <p className="text-sm text-white/70">{kpi.subtext}</p>
              )}
            </div>
          ))}
        </div>

        {/* Action Queue */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Action Queue</h3>
            <button className="text-sm text-gray-500 hover:text-gray-700 font-medium">
              View All →
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {actionQueue.map((action, index) => {
              const Icon = action.icon;
              return (
                <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-2 rounded-lg ${action.alert ? 'bg-orange-100' : 'bg-gray-100'}`}>
                      <Icon className={`w-5 h-5 ${action.alert ? 'text-orange-600' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{action.label}</p>
                      <p className="text-sm text-gray-500">{action.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      action.statusColor === 'orange'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {action.status}
                    </span>
                    {action.alert && (
                      <div className="flex items-center gap-2 text-orange-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">3 Low supplies alerts</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default OwnerExecutiveSummary;

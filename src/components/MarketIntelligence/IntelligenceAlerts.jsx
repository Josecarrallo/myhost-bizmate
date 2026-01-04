import React from 'react';
import { ArrowLeft, Bell, AlertTriangle, Info, CheckCircle, TrendingDown } from 'lucide-react';

const IntelligenceAlerts = ({ onBack }) => {
  const alerts = [
    {
      type: 'warning',
      title: 'Competitor Price Drop',
      message: 'Villa Harmony Bali dropped prices by 18% for Feb 15-28',
      time: '2 hours ago',
      icon: AlertTriangle,
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      type: 'info',
      title: 'High Demand Period Detected',
      message: 'Search volume for "Bali villas March" up 45% this week',
      time: '5 hours ago',
      icon: Info,
      color: 'from-blue-400 to-blue-600'
    },
    {
      type: 'success',
      title: 'Revenue Opportunity',
      message: 'You can increase rates by $25/night for upcoming weekend',
      time: '1 day ago',
      icon: CheckCircle,
      color: 'from-green-400 to-green-600'
    },
    {
      type: 'critical',
      title: 'Occupancy Gap Alert',
      message: 'March 10-15 still empty while competitors are 80% booked',
      time: '1 day ago',
      icon: TrendingDown,
      color: 'from-red-400 to-red-600'
    }
  ];

  return (
    <div className="flex-1 h-screen bg-[#2a2f3a] p-4 relative overflow-auto">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl border border-white/10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Bell className="w-6 h-6" />
              Intelligence Alerts
            </h1>
            <p className="text-sm text-orange-400">Powered by OSIRIS.AI</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
        <div className="text-center mb-6">
          <Bell className="w-16 h-16 mx-auto mb-4 text-orange-400" />
          <h3 className="text-2xl font-bold text-white mb-2">AI-Powered Alert System</h3>
          <p className="text-gray-300 mb-4">OSIRIS.AI monitors the market 24/7 and notifies you of critical changes</p>
        </div>

        <div className="space-y-4 mb-6">
          {alerts.map((alert, index) => {
            const Icon = alert.icon;
            return (
              <div key={index} className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`bg-gradient-to-br ${alert.color} rounded-lg p-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white mb-1">{alert.title}</h4>
                    <p className="text-sm text-gray-300 mb-2">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white/10 rounded-xl p-6 border border-white/20">
          <p className="text-sm text-white font-semibold mb-3">What triggers OSIRIS.AI alerts:</p>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>🔔 <strong>Competitor Changes:</strong> Price drops, new listings, occupancy spikes</li>
            <li>📊 <strong>Market Shifts:</strong> Sudden demand changes, seasonal anomalies</li>
            <li>💰 <strong>Revenue Opportunities:</strong> Pricing gaps, high-demand windows</li>
            <li>⚠️ <strong>Business Risks:</strong> Low occupancy, missed revenue, booking gaps</li>
            <li>🌟 <strong>Review Alerts:</strong> Negative reviews from you or competitors</li>
            <li>🚨 <strong>Critical Events:</strong> Cancellations, payment issues, guest complaints</li>
          </ul>
          <div className="mt-4 p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg text-white">
            <p className="text-sm font-bold mb-1">Smart Filtering:</p>
            <p className="text-xs">OSIRIS.AI only sends HIGH-PRIORITY alerts. No spam, no noise.</p>
          </div>
          <p className="text-xs text-orange-400 mt-4 italic">Coming soon - Custom alert rules and notification preferences</p>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceAlerts;

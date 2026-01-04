import React from 'react';
import { ArrowLeft, TrendingUp, Calendar, DollarSign, Users } from 'lucide-react';

const BaliMarketTrends = ({ onBack }) => {
  const trends = [
    { metric: 'Average Daily Rate', value: '$215', change: '+12%', period: 'vs last month', color: 'from-green-400 to-green-600' },
    { metric: 'Occupancy Rate', value: '76%', change: '+8%', period: 'vs last month', color: 'from-blue-400 to-blue-600' },
    { metric: 'Booking Lead Time', value: '18 days', change: '-3 days', period: 'vs last month', color: 'from-yellow-400 to-yellow-600' },
    { metric: 'Length of Stay', value: '4.2 nights', change: '+0.5', period: 'vs last month', color: 'from-purple-400 to-purple-600' }
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
              <TrendingUp className="w-6 h-6" />
              Bali Market Trends
            </h1>
            <p className="text-sm text-orange-400">Powered by OSIRIS.AI</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
        <div className="text-center mb-6">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-orange-400" />
          <h3 className="text-2xl font-bold text-white mb-2">Market Intelligence Dashboard</h3>
          <p className="text-gray-300 mb-4">Real-time insights from the Bali vacation rental market</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {trends.map((trend) => (
            <div key={trend.metric} className={`bg-gradient-to-br ${trend.color} rounded-xl p-6 text-white`}>
              <p className="text-sm opacity-90 mb-1">{trend.metric}</p>
              <p className="text-3xl font-bold mb-1">{trend.value}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold">{trend.change}</span>
                <span className="opacity-75">{trend.period}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/10 rounded-xl p-6 border border-white/20 mb-6">
          <h4 className="text-sm text-white font-bold mb-3">📊 Key Market Insights (January 2026)</h4>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>🔥 <strong>High Season Alert:</strong> Bali is entering peak season (Jan-Mar)</li>
            <li>📈 <strong>Price Opportunity:</strong> Properties in Seminyak charging 15% more than Canggu</li>
            <li>🌍 <strong>Traveler Mix:</strong> 65% International, 35% Domestic (Indonesia/Australia)</li>
            <li>⏱️ <strong>Last-Minute Bookings:</strong> 28% of bookings made &lt;7 days before check-in</li>
            <li>🏡 <strong>Property Type:</strong> Private villas outperforming shared properties by 22%</li>
          </ul>
        </div>

        <div className="bg-white/10 rounded-xl p-6 border border-white/20">
          <p className="text-sm text-white font-semibold mb-3">How OSIRIS.AI gathers this data:</p>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>✅ <strong>Web Scraping:</strong> Daily scans of Airbnb, Booking.com, Agoda</li>
            <li>✅ <strong>Public APIs:</strong> Official tourism statistics from Bali Government</li>
            <li>✅ <strong>Social Media:</strong> Sentiment analysis from Instagram, TikTok travel content</li>
            <li>✅ <strong>Flight Data:</strong> Inbound tourist volume via airport APIs</li>
            <li>✅ <strong>Weather Patterns:</strong> Seasonal predictions affecting demand</li>
          </ul>
          <p className="text-xs text-orange-400 mt-4 italic">Coming soon - Predictive AI models for demand forecasting</p>
        </div>
      </div>
    </div>
  );
};

export default BaliMarketTrends;

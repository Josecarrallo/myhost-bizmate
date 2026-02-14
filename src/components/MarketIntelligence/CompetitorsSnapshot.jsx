import React from 'react';
import { ArrowLeft, Target, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';

const CompetitorsSnapshot = ({ onBack }) => {
  const competitors = [
    { name: 'Villa Harmony Bali', occupancy: 78, avgPrice: 195, trend: 'up', distance: '2.5 km' },
    { name: 'Ocean View Resort', occupancy: 82, avgPrice: 220, trend: 'up', distance: '3.1 km' },
    { name: 'Sunset Paradise Villas', occupancy: 65, avgPrice: 175, trend: 'down', distance: '1.8 km' },
    { name: 'Tropical Dreams', occupancy: 71, avgPrice: 188, trend: 'up', distance: '4.2 km' }
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
              <Target className="w-6 h-6" />
              Competitors Snapshot
            </h1>
            <p className="text-sm text-orange-400">Powered by OSIRIS.AI</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
        <div className="text-center mb-6">
          <Target className="w-16 h-16 mx-auto mb-4 text-orange-400" />
          <h3 className="text-2xl font-bold text-white mb-2">Competitive Intelligence</h3>
          <p className="text-gray-300 mb-4">Track nearby properties and market positioning</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {competitors.map((comp) => (
            <div key={comp.name} className="bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-sm font-bold text-white">{comp.name}</h4>
                  <p className="text-xs text-gray-400">{comp.distance} away</p>
                </div>
                {comp.trend === 'up' ? (
                  <TrendingUp className="w-5 h-5 text-green-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400">Occupancy</p>
                  <p className="text-lg font-bold text-white">{comp.occupancy}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Avg Price</p>
                  <p className="text-lg font-bold text-orange-400">${comp.avgPrice}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/10 rounded-xl p-6 border border-white/20">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm text-white font-semibold mb-2">What OSIRIS.AI tracks:</p>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>✅ <strong>Price Comparison:</strong> Your rates vs nearby properties</li>
                <li>✅ <strong>Occupancy Trends:</strong> Who's filling faster than you</li>
                <li>✅ <strong>Seasonal Patterns:</strong> High/low season competitor behavior</li>
                <li>✅ <strong>New Listings:</strong> Alert when new competitors enter your area</li>
                <li>✅ <strong>Review Monitoring:</strong> Track competitor ratings and sentiment</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-orange-400 mt-4 italic">Coming soon - Real-time scraping from Airbnb, Booking.com, Agoda</p>
        </div>
      </div>
    </div>
  );
};

export default CompetitorsSnapshot;

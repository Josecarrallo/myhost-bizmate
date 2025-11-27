import React from 'react';
import { Clock } from 'lucide-react';

const PricingCard = ({ property, basePrice, currentPrice, occupancy, trend, nextUpdate }) => {
  const change = ((currentPrice - basePrice) / basePrice * 100).toFixed(1);
  const isIncrease = currentPrice > basePrice;

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-blue-200 transition-all hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 text-xl mb-2">{property}</h4>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Base Price</p>
              <p className="text-lg font-bold text-gray-400">${basePrice}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Current Price</p>
              <p className="text-2xl font-black text-blue-500">${currentPrice}</p>
            </div>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-bold ${isIncrease ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isIncrease ? '↑' : '↓'} {Math.abs(change)}%
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Occupancy</span>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${occupancy}%` }}></div>
            </div>
            <span className="text-sm font-bold text-gray-900">{occupancy}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t-2 border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Next update in {nextUpdate}</span>
          </div>
          <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors">
            Adjust
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;

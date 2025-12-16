import React, { useState } from 'react';
import {
  ChevronLeft,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Settings,
  Target,
  BarChart3,
  Percent,
  Users,
  Sun,
  Moon,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const Pricing = ({ onBack }) => {
  const [selectedProperty, setSelectedProperty] = useState(null);

  const properties = [
    {
      id: 1,
      name: 'Villa Sunset Paradise',
      basePrice: 350,
      currentPrice: 425,
      occupancy: 92,
      trend: 'up',
      nextUpdate: '2 hours',
      factors: [
        { name: 'High Demand', impact: '+15%', positive: true },
        { name: 'Peak Season', impact: '+10%', positive: true },
        { name: 'Competitor Rates', impact: '+8%', positive: true },
        { name: 'Recent Reviews', impact: '+5%', positive: true }
      ],
      priceHistory: [
        { date: 'Oct 20', price: 380 },
        { date: 'Oct 21', price: 395 },
        { date: 'Oct 22', price: 410 },
        { date: 'Oct 23', price: 420 },
        { date: 'Oct 24', price: 425 }
      ],
      rules: [
        { name: 'Weekend Premium', value: '+15%', active: true },
        { name: 'Last-Minute Discount', value: '-10%', active: true },
        { name: 'Long-Stay Discount (7+ nights)', value: '-12%', active: true },
        { name: 'Peak Season Adjustment', value: '+20%', active: true }
      ]
    },
    {
      id: 2,
      name: 'Beach House Deluxe',
      basePrice: 450,
      currentPrice: 520,
      occupancy: 88,
      trend: 'up',
      nextUpdate: '4 hours',
      factors: [
        { name: 'High Demand', impact: '+12%', positive: true },
        { name: 'Peak Season', impact: '+8%', positive: true },
        { name: 'Premium Location', impact: '+6%', positive: true },
        { name: 'Excellent Rating', impact: '+4%', positive: true }
      ],
      priceHistory: [
        { date: 'Oct 20', price: 470 },
        { date: 'Oct 21', price: 485 },
        { date: 'Oct 22', price: 500 },
        { date: 'Oct 23', price: 510 },
        { date: 'Oct 24', price: 520 }
      ],
      rules: [
        { name: 'Weekend Premium', value: '+15%', active: true },
        { name: 'Last-Minute Discount', value: '-8%', active: true },
        { name: 'Long-Stay Discount (7+ nights)', value: '-10%', active: true },
        { name: 'Peak Season Adjustment', value: '+18%', active: true }
      ]
    },
    {
      id: 3,
      name: 'Mountain Cabin Retreat',
      basePrice: 280,
      currentPrice: 245,
      occupancy: 65,
      trend: 'down',
      nextUpdate: '1 hour',
      factors: [
        { name: 'Low Demand', impact: '-8%', positive: false },
        { name: 'Off-Season', impact: '-5%', positive: false },
        { name: 'Competitor Pricing', impact: '-4%', positive: false },
        { name: 'Gap Filling', impact: '-3%', positive: false }
      ],
      priceHistory: [
        { date: 'Oct 20', price: 275 },
        { date: 'Oct 21', price: 265 },
        { date: 'Oct 22', price: 255 },
        { date: 'Oct 23', price: 250 },
        { date: 'Oct 24', price: 245 }
      ],
      rules: [
        { name: 'Weekend Premium', value: '+10%', active: true },
        { name: 'Last-Minute Discount', value: '-15%', active: true },
        { name: 'Long-Stay Discount (7+ nights)', value: '-18%', active: true },
        { name: 'Off-Season Adjustment', value: '-12%', active: true }
      ]
    },
    {
      id: 4,
      name: 'City Loft Premium',
      basePrice: 320,
      currentPrice: 380,
      occupancy: 95,
      trend: 'up',
      nextUpdate: '3 hours',
      factors: [
        { name: 'Very High Demand', impact: '+18%', positive: true },
        { name: 'Limited Availability', impact: '+12%', positive: true },
        { name: 'Event in Area', impact: '+8%', positive: true },
        { name: 'Perfect Rating', impact: '+6%', positive: true }
      ],
      priceHistory: [
        { date: 'Oct 20', price: 340 },
        { date: 'Oct 21', price: 355 },
        { date: 'Oct 22', price: 365 },
        { date: 'Oct 23', price: 375 },
        { date: 'Oct 24', price: 380 }
      ],
      rules: [
        { name: 'Weekend Premium', value: '+20%', active: true },
        { name: 'Last-Minute Discount', value: '-5%', active: false },
        { name: 'Long-Stay Discount (7+ nights)', value: '-8%', active: true },
        { name: 'Event-Based Surge', value: '+25%', active: true }
      ]
    }
  ];

  const getOccupancyColor = (occupancy) => {
    if (occupancy >= 85) return 'from-green-500 to-emerald-600';
    if (occupancy >= 70) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-4 pb-24 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-orange-200/30 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <ChevronLeft className="w-6 h-6 text-orange-600" />
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl">Smart Pricing</h2>
          </div>
          <button className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <Settings className="w-6 h-6 text-orange-600" />
          </button>
        </div>

        {/* AI Revenue Banner */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 rounded-3xl mb-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Sparkles className="w-8 h-8" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">AI-Optimized Revenue Increase</p>
                <p className="text-5xl font-black">+32%</p>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-white/80 text-sm mb-1">Analyzing</p>
              <p className="text-2xl font-black">50+ Factors</p>
            </div>
          </div>
          <p className="text-white/90 leading-relaxed mt-4">Your properties are earning an average of 32% more compared to static pricing. Our AI analyzes market demand, competitor rates, seasonality, events, and guest behavior in real-time.</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border-2 border-white/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <Target className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-600">Avg Occupancy</p>
            </div>
            <p className="text-3xl font-black text-orange-600">85%</p>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border-2 border-white/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-600">Avg Daily Rate</p>
            </div>
            <p className="text-3xl font-black text-orange-600">$392</p>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border-2 border-white/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-600">RevPAR</p>
            </div>
            <p className="text-3xl font-black text-orange-600">$333</p>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border-2 border-white/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-600">Revenue Growth</p>
            </div>
            <p className="text-3xl font-black text-green-600">+32%</p>
          </div>
        </div>

        {/* Properties Pricing Cards */}
        <div className="space-y-4">
          {properties.map((property) => {
            const TrendIcon = getTrendIcon(property.trend);
            const priceChange = property.currentPrice - property.basePrice;
            const priceChangePercent = ((priceChange / property.basePrice) * 100).toFixed(0);

            return (
              <div key={property.id} className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 overflow-hidden hover:shadow-3xl transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-orange-600 mb-2">{property.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span className="font-semibold">Next update in {property.nextUpdate}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedProperty(property)}
                      className="px-6 py-3 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-colors shadow-lg"
                    >
                      View Details
                    </button>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Base Price */}
                    <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1">Base Price</p>
                      <p className="text-2xl font-black text-gray-700">${property.basePrice}</p>
                    </div>

                    {/* Current Price */}
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 text-white">
                      <p className="text-sm text-orange-100 font-semibold mb-1">Current Price</p>
                      <p className="text-2xl font-black">${property.currentPrice}</p>
                    </div>

                    {/* Price Change */}
                    <div className={`${property.trend === 'up' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} rounded-2xl p-4 border-2`}>
                      <p className="text-sm text-gray-500 font-semibold mb-1">Change</p>
                      <div className="flex items-center gap-2">
                        <TrendIcon className={property.trend === 'up' ? 'text-green-600' : 'text-red-600'} strokeWidth={3} />
                        <p className={`text-2xl font-black ${property.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {property.trend === 'up' ? '+' : ''}{priceChangePercent}%
                        </p>
                      </div>
                    </div>

                    {/* Occupancy */}
                    <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1">Occupancy</p>
                      <div className="flex items-center gap-2">
                        <Percent className="text-orange-600" size={20} />
                        <p className="text-2xl font-black text-gray-700">{property.occupancy}%</p>
                      </div>
                    </div>

                    {/* RevPAR */}
                    <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1">RevPAR</p>
                      <p className="text-2xl font-black text-orange-600">${Math.round(property.currentPrice * (property.occupancy / 100))}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedProperty(null)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6 flex items-center justify-between sticky top-0 z-10">
              <div>
                <h3 className="text-3xl font-black text-white mb-1">{selectedProperty.name}</h3>
                <p className="text-orange-100 font-semibold">Dynamic Pricing Analysis</p>
              </div>
              <button onClick={() => setSelectedProperty(null)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Current Pricing */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-semibold mb-1">Current Price</p>
                    <p className="text-5xl font-black">${selectedProperty.currentPrice}</p>
                    <p className="text-orange-100 text-sm font-semibold mt-2">Base: ${selectedProperty.basePrice} • Occupancy: {selectedProperty.occupancy}%</p>
                  </div>
                  <div className={`px-6 py-3 rounded-2xl text-lg font-black ${getTrendColor(selectedProperty.trend)}`}>
                    {selectedProperty.trend === 'up' ? '+' : ''}{((selectedProperty.currentPrice - selectedProperty.basePrice) / selectedProperty.basePrice * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* AI Factors */}
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                <h4 className="text-xl font-black text-orange-600 mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6" /> AI Pricing Factors
                </h4>
                <div className="space-y-3">
                  {selectedProperty.factors.map((factor, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border-2 border-gray-100">
                      <div className="flex items-center gap-3">
                        {factor.positive ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                        <span className="font-bold text-gray-900">{factor.name}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${factor.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {factor.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Rules */}
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                <h4 className="text-xl font-black text-orange-600 mb-4 flex items-center gap-2">
                  <Settings className="w-6 h-6" /> Active Pricing Rules
                </h4>
                <div className="space-y-3">
                  {selectedProperty.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border-2 border-gray-100">
                      <div className="flex items-center gap-3">
                        {rule.active ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-gray-400" />
                        )}
                        <span className={`font-bold ${rule.active ? 'text-gray-900' : 'text-gray-400'}`}>{rule.name}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${rule.active ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-400'}`}>
                        {rule.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price History */}
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                <h4 className="text-xl font-black text-orange-600 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" /> 5-Day Price History
                </h4>
                <div className="flex items-end justify-between gap-2 h-40">
                  {selectedProperty.priceHistory.map((day, idx) => {
                    const maxPrice = Math.max(...selectedProperty.priceHistory.map(d => d.price));
                    const height = (day.price / maxPrice) * 100;

                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div className="text-xs font-bold text-orange-600">${day.price}</div>
                        <div
                          className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg transition-all hover:from-orange-600 hover:to-orange-500"
                          style={{ height: `${height}%` }}
                        ></div>
                        <div className="text-xs font-bold text-gray-600">{day.date}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;

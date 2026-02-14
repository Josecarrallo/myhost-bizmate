import React, { useState, useEffect } from 'react';
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
  CheckCircle,
  Loader2
} from 'lucide-react';
import { dataService } from '../../services/data';

const Pricing = ({ onBack }) => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState({
    avgOccupancy: 0,
    avgDailyRate: 0,
    revPAR: 0,
    revenueGrowth: 0
  });
  const [priceHistory, setPriceHistory] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch pricing data on component mount
  useEffect(() => {
    const fetchPricingData = async () => {
      setIsLoading(true);
      try {
        // Fetch pricing data and stats in parallel
        const [pricingData, pricingStats] = await Promise.all([
          dataService.getPricingData(),
          dataService.getPricingStats()
        ]);

        setProperties(pricingData);
        setStats(pricingStats);

        // Generate price history for each property
        const historyPromises = pricingData.map(async (property) => {
          const history = await dataService.getPriceHistory(property.id);
          return { id: property.id, history };
        });

        const historyResults = await Promise.all(historyPromises);
        const historyMap = {};
        historyResults.forEach(result => {
          historyMap[result.id] = result.history;
        });
        setPriceHistory(historyMap);

        console.log('✅ Pricing data loaded:', pricingData.length, 'properties');
      } catch (error) {
        console.error('Error loading pricing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPricingData();
  }, []);

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

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#2a2f3a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-xl text-white font-semibold">Loading pricing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2a2f3a] p-4 pb-24 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-[#d85a2a]/5 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-3 bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl hover:bg-[#1f2937] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#d85a2a]/20">
            <ChevronLeft className="w-6 h-6 text-[#FF8C42]" />
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl">Smart Pricing</h2>
          </div>
          <button className="p-3 bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl hover:bg-[#1f2937] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#d85a2a]/20">
            <Settings className="w-6 h-6 text-[#FF8C42]" />
          </button>
        </div>

        {/* AI Revenue Banner */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 rounded-3xl mb-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-[#d85a2a]/10 rounded-2xl backdrop-blur-sm">
                <Sparkles className="w-8 h-8" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">AI-Optimized Revenue Increase</p>
                <p className="text-5xl font-black">+{stats.revenueGrowth}%</p>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-white/80 text-sm mb-1">Analyzing</p>
              <p className="text-2xl font-black">50+ Factors</p>
            </div>
          </div>
          <p className="text-white/90 leading-relaxed mt-4">
            Your properties are earning an average of {stats.revenueGrowth}% more compared to static pricing.
            Our AI analyzes market demand, competitor rates, seasonality, events, and guest behavior in real-time.
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border-2 border-[#d85a2a]/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <Target className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-600">Avg Occupancy</p>
            </div>
            <p className="text-3xl font-black text-[#FF8C42]">{stats.avgOccupancy}%</p>
          </div>
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border-2 border-[#d85a2a]/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-600">Avg Daily Rate</p>
            </div>
            <p className="text-3xl font-black text-[#FF8C42]">${stats.avgDailyRate}</p>
          </div>
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border-2 border-[#d85a2a]/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-600">RevPAR</p>
            </div>
            <p className="text-3xl font-black text-[#FF8C42]">${stats.revPAR}</p>
          </div>
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border-2 border-[#d85a2a]/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-600">Revenue Growth</p>
            </div>
            <p className="text-3xl font-black text-green-600">+{stats.revenueGrowth}%</p>
          </div>
        </div>

        {/* Properties Pricing Cards */}
        <div className="space-y-4">
          {properties.map((property) => {
            const TrendIcon = getTrendIcon(property.trend);
            const priceChange = property.currentPrice - property.basePrice;
            const priceChangePercent = ((priceChange / property.basePrice) * 100).toFixed(0);

            return (
              <div key={property.id} className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-[#d85a2a]/20 overflow-hidden hover:shadow-3xl transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-[#FF8C42] mb-2">{property.name}</h3>
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
                        <Percent className="text-[#FF8C42]" size={20} />
                        <p className="text-2xl font-black text-gray-700">{property.occupancy}%</p>
                      </div>
                    </div>

                    {/* RevPAR */}
                    <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1">RevPAR</p>
                      <p className="text-2xl font-black text-[#FF8C42]">${Math.round(property.currentPrice * (property.occupancy / 100))}</p>
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
          <div className="bg-[#1f2937] rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6 flex items-center justify-between sticky top-0 z-10">
              <div>
                <h3 className="text-3xl font-black text-white mb-1">{selectedProperty.name}</h3>
                <p className="text-orange-100 font-semibold">Dynamic Pricing Analysis</p>
              </div>
              <button onClick={() => setSelectedProperty(null)} className="p-2 hover:bg-[#d85a2a]/10 rounded-xl transition-colors">
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
                <h4 className="text-xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
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
                <h4 className="text-xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
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
                <h4 className="text-xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" /> 5-Day Price History
                </h4>
                <div className="flex items-end justify-between gap-2 h-40">
                  {priceHistory[selectedProperty.id] && priceHistory[selectedProperty.id].map((day, idx) => {
                    const maxPrice = Math.max(...priceHistory[selectedProperty.id].map(d => d.price));
                    const height = (day.price / maxPrice) * 100;

                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div className="text-xs font-bold text-[#FF8C42]">${day.price}</div>
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

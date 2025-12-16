import React, { useEffect } from 'react';
import {
  ChevronLeft,
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from 'lucide-react';

const AIAssistant = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const userQuery = `Hi, I would like to know which villas are available for rent in the area and at what price. Please also check the occupancy level and based on that give me a recommendation/action to rent my vacant villas and earn more money.`;

  const aiResponse = {
    summary: "I have analyzed your 8 active properties in Bali",
    properties: [
      { name: "Villa Sunset", occupancy: 30, status: "low", currentPrice: 150, recommendedPrice: 127, action: "Reduce price 15%", reason: "Low occupancy - competitive market" },
      { name: "Villa Paradise", occupancy: 85, status: "high", currentPrice: 200, recommendedPrice: 220, action: "Increase price 10%", reason: "High demand - optimize revenue" },
      { name: "Villa Ocean View", occupancy: 45, status: "medium", currentPrice: 180, recommendedPrice: 165, action: "Reduce price 8%", reason: "Medium occupancy - competitive adjustment" },
      { name: "Villa Harmony", occupancy: 25, status: "low", currentPrice: 175, recommendedPrice: 149, action: "Reduce price 15%", reason: "Very low occupancy - urgent adjustment" }
    ],
    insights: { lowOccupancy: 3, potentialRevenue: 2450, bestSeason: "November - December", topRecommendation: "Special promotion on villas with <40% occupancy" }
  };

  const getStatusColor = (status) => status === 'low' ? 'bg-red-100 text-red-700' : status === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700';
  const getStatusIcon = (status) => status === 'low' ? '🔴' : status === 'medium' ? '🟡' : '🟢';

  return (
    <div className="flex-1 h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-4 pb-24 relative overflow-auto">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-orange-200/30 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <ChevronLeft className="w-6 h-6 text-orange-600" />
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl mb-1">MY HOST</h2>
            <p className="text-2xl md:text-3xl font-bold text-orange-100 drop-shadow-xl">BizMate</p>
          </div>
          <div className="w-14"></div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 rounded-3xl mb-8 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Sparkles className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-1">AI-Powered Insights</h3>
              <p className="text-white/90">Your intelligent property management companion</p>
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-6 border-2 border-white/50 border-l-4 border-l-blue-500">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💬</div>
            <div>
              <p className="text-sm font-semibold text-orange-600 mb-2">Example query:</p>
              <p className="text-gray-600 italic leading-relaxed">{userQuery}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border-2 border-white/50">
          <div className="flex items-start gap-3 mb-6">
            <div className="text-2xl">🤖</div>
            <div>
              <p className="text-sm font-semibold text-orange-600 mb-1">AI Response:</p>
              <p className="text-orange-600 font-medium">{aiResponse.summary}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold text-orange-600 mb-4 flex items-center gap-2">📊 OCCUPANCY ANALYSIS</h3>
            <div className="grid gap-4">
              {aiResponse.properties.map((property, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🏠</span>
                      <div>
                        <h4 className="font-bold text-orange-600">{property.name}</h4>
                        <p className="text-sm text-gray-500">${property.currentPrice}/night</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(property.status)}`}>
                      {getStatusIcon(property.status)} {property.occupancy}%
                    </span>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 border-l-4 border-orange-500">
                    <div className="flex items-start gap-2">
                      {property.status === 'high' ?
                        <TrendingUp className="text-orange-600 mt-0.5" size={18} /> :
                        <TrendingDown className="text-orange-600 mt-0.5" size={18} />
                      }
                      <div>
                        <p className="font-semibold text-orange-800 text-sm">⚡ Action: {property.action}</p>
                        <p className="text-orange-700 text-sm">→ New price: ${property.recommendedPrice}/night</p>
                        <p className="text-xs text-orange-600 mt-1">{property.reason}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border-2 border-orange-200">
            <h3 className="text-lg font-bold text-orange-600 mb-4 flex items-center gap-2">💡 KEY RECOMMENDATIONS</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-orange-500 mt-1" size={20} />
                <div>
                  <p className="text-sm font-semibold text-orange-600">Villas with low occupancy</p>
                  <p className="text-2xl font-bold text-orange-600">{aiResponse.insights.lowOccupancy}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="text-green-500 mt-1" size={20} />
                <div>
                  <p className="text-sm font-semibold text-orange-600">Potential extra income</p>
                  <p className="text-2xl font-bold text-green-600">${aiResponse.insights.potentialRevenue}/month</p>
                </div>
              </div>
              <div className="flex items-start gap-3 md:col-span-2">
                <Sparkles className="text-orange-500 mt-1" size={20} />
                <div>
                  <p className="text-sm font-semibold text-orange-600">Best season for promotion</p>
                  <p className="text-orange-600">{aiResponse.insights.bestSeason}</p>
                </div>
              </div>
              <div className="md:col-span-2 bg-orange-50 rounded-lg p-3 border border-orange-200">
                <p className="text-sm font-semibold text-orange-800">🎯 {aiResponse.insights.topRecommendation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;

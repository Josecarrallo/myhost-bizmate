import React from 'react';
import { ArrowLeft, Lightbulb, DollarSign, Calendar, Zap, Target } from 'lucide-react';

const AIRecommendations = ({ onBack }) => {
  const recommendations = [
    {
      category: 'Pricing',
      icon: DollarSign,
      color: 'from-green-400 to-green-600',
      priority: 'High',
      title: 'Increase weekend rates by $30',
      reason: 'Competitors are 92% booked for Feb weekends, you have availability',
      impact: '+$420 estimated revenue',
      action: 'Apply suggested pricing'
    },
    {
      category: 'Marketing',
      icon: Target,
      color: 'from-blue-400 to-blue-600',
      priority: 'Medium',
      title: 'Run Instagram campaign targeting Australian travelers',
      reason: 'Aussie travelers booking 3 weeks ahead, your Feb is 40% empty',
      impact: '+15% booking probability',
      action: 'Launch campaign'
    },
    {
      category: 'Operations',
      icon: Calendar,
      color: 'from-yellow-400 to-yellow-600',
      priority: 'High',
      title: 'Open March 15-20 booking window',
      reason: 'Competitors filling this gap fast, you have it blocked',
      impact: '+$875 potential revenue',
      action: 'Unblock dates'
    },
    {
      category: 'Guest Experience',
      icon: Zap,
      color: 'from-purple-400 to-purple-600',
      priority: 'Low',
      title: 'Add "airport transfer" as upsell option',
      reason: '68% of guests ask about transport in WhatsApp conversations',
      impact: '+$25/booking average',
      action: 'Configure service'
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
              <Lightbulb className="w-6 h-6" />
              AI Recommendations
            </h1>
            <p className="text-sm text-orange-400">Powered by OSIRIS.AI</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
        <div className="text-center mb-6">
          <Lightbulb className="w-16 h-16 mx-auto mb-4 text-orange-400" />
          <h3 className="text-2xl font-bold text-white mb-2">Intelligent Business Recommendations</h3>
          <p className="text-gray-300 mb-4">OSIRIS.AI analyzes your business and market to suggest actionable improvements</p>
        </div>

        <div className="space-y-4 mb-6">
          {recommendations.map((rec, index) => {
            const Icon = rec.icon;
            return (
              <div key={index} className="bg-white/10 rounded-xl p-5 border border-white/20">
                <div className="flex items-start gap-4 mb-3">
                  <div className={`bg-gradient-to-br ${rec.color} rounded-lg p-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-400 uppercase">{rec.category}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        rec.priority === 'High' ? 'bg-red-500/20 text-red-300' :
                        rec.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {rec.priority} Priority
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-2">{rec.title}</h4>
                    <p className="text-sm text-gray-300 mb-2">{rec.reason}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-orange-400">{rec.impact}</p>
                      <button className="px-4 py-2 bg-gradient-to-br from-orange-500 to-orange-600 text-white text-sm rounded-lg hover:shadow-lg transition-all">
                        {rec.action}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white/10 rounded-xl p-6 border border-white/20">
          <p className="text-sm text-white font-semibold mb-3">How OSIRIS.AI generates recommendations:</p>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>🧠 <strong>Pattern Recognition:</strong> Analyzes 1000+ data points daily (bookings, prices, reviews, market)</li>
            <li>📈 <strong>Predictive Models:</strong> ML algorithms forecast demand, occupancy, revenue</li>
            <li>🎯 <strong>Competitor Benchmarking:</strong> Compares your performance vs similar properties</li>
            <li>💡 <strong>Opportunity Detection:</strong> Identifies gaps in pricing, marketing, operations</li>
            <li>⚡ <strong>Impact Scoring:</strong> Ranks recommendations by potential revenue/time investment</li>
            <li>🔄 <strong>Continuous Learning:</strong> Improves suggestions based on your actions and results</li>
          </ul>
          <div className="mt-4 p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg text-white">
            <p className="text-sm font-bold mb-1">One-Click Actions:</p>
            <p className="text-xs">Most recommendations can be applied instantly. OSIRIS.AI handles the implementation.</p>
          </div>
          <p className="text-xs text-orange-400 mt-4 italic">Coming soon - Weekly AI Strategy Reports with 10+ recommendations</p>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;

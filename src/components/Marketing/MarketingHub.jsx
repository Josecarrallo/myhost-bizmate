import React, { useState } from 'react';
import {
  ChevronLeft,
  Megaphone,
  Share2,
  Video,
  TrendingUp,
  Globe,
  Target,
  Facebook,
  Calendar,
  Image,
  Film,
  Settings,
  BarChart3,
  Search,
  DollarSign,
  Layout,
  LineChart
} from 'lucide-react';

const MarketingHub = ({ onBack, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    {
      id: 'campaigns',
      name: 'Campaigns & Ads',
      icon: Target,
      color: 'from-orange-500 to-orange-600',
      items: [
        { id: 'dashboard', name: 'Campaign Dashboard', icon: BarChart3, status: 'active' },
        { id: 'meta', name: 'Meta Ads Manager', icon: Facebook, status: 'active' },
        { id: 'google', name: 'Google Ads Manager', icon: Search, status: 'coming' },
        { id: 'analytics', name: 'Performance Analytics', icon: LineChart, status: 'coming' }
      ]
    },
    {
      id: 'social',
      name: 'Social Media',
      icon: Share2,
      color: 'from-pink-500 to-pink-600',
      items: [
        { id: 'publisher', name: 'Social Publisher', icon: Share2, status: 'active' },
        { id: 'calendar', name: 'Content Calendar', icon: Calendar, status: 'coming' },
        { id: 'scheduler', name: 'Post Scheduler', icon: Calendar, status: 'coming' },
        { id: 'engagement', name: 'Engagement Monitor', icon: TrendingUp, status: 'coming' }
      ]
    },
    {
      id: 'content',
      name: 'Content Studio',
      icon: Video,
      color: 'from-purple-500 to-purple-600',
      badge: 'NEW',
      items: [
        { id: 'upload', name: 'Photo Upload', icon: Image, status: 'coming' },
        { id: 'generator', name: 'AI Video Generator', icon: Film, status: 'active' },
        { id: 'library', name: 'Video Library', icon: Video, status: 'coming' },
        { id: 'settings', name: 'Brand Settings', icon: Settings, status: 'coming' }
      ]
    },
    {
      id: 'intelligence',
      name: 'Market Intelligence',
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      items: [
        { id: 'competitor', name: 'Competitor Analysis', icon: Search, status: 'coming' },
        { id: 'trends', name: 'Bali Market Trends', icon: TrendingUp, status: 'coming' },
        { id: 'benchmark', name: 'Price Benchmarking', icon: DollarSign, status: 'coming' },
        { id: 'insights', name: 'AI Insights & Alerts', icon: BarChart3, status: 'coming' }
      ]
    },
    {
      id: 'website',
      name: 'Website & SEO',
      icon: Globe,
      color: 'from-green-500 to-green-600',
      items: [
        { id: 'booking', name: 'Direct Booking Site', icon: Globe, status: 'active' },
        { id: 'seo', name: 'SEO Optimizer', icon: Search, status: 'coming' },
        { id: 'landing', name: 'Landing Pages', icon: Layout, status: 'coming' },
        { id: 'conversion', name: 'Conversion Tracking', icon: Target, status: 'coming' }
      ]
    }
  ];

  return (
    <div className="flex-1 h-screen bg-[#2a2f3a] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-[#d85a2a]/20 p-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#FF8C42] hover:text-[#d85a2a] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white">Marketing & Growth</h2>
            <p className="text-sm text-[#FF8C42] mt-1">Choose a category to get started</p>
          </div>
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.id}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border-2 border-white/10 hover:border-[#d85a2a] transition-all shadow-lg hover:shadow-xl group overflow-hidden"
                >
                  {/* Category Header */}
                  <div className={`bg-gradient-to-r ${category.color} p-6 text-white relative`}>
                    <div className="flex items-center justify-between mb-2">
                      <IconComponent className="w-8 h-8" />
                      {category.badge && (
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold">
                          {category.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                  </div>

                  {/* Category Items */}
                  <div className="p-4 space-y-2">
                    {category.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <button
                          key={item.id}
                          disabled={item.status === 'coming'}
                          onClick={() => {
                            if (item.status === 'active' && item.id === 'generator') {
                              onNavigate('content-studio');
                            }
                          }}
                          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                            item.status === 'active'
                              ? 'bg-white/10 hover:bg-[#d85a2a]/20 border-2 border-white/20 hover:border-[#FF8C42] cursor-pointer'
                              : 'bg-white/5 border-2 border-white/10 cursor-not-allowed opacity-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <ItemIcon className={`w-5 h-5 ${item.status === 'active' ? 'text-[#FF8C42]' : 'text-white/40'}`} />
                            <span className={`font-semibold ${item.status === 'active' ? 'text-white' : 'text-white/40'}`}>
                              {item.name}
                            </span>
                          </div>
                          {item.status === 'coming' && (
                            <span className="text-xs px-2 py-1 bg-white/10 text-white/60 rounded-full font-bold">
                              Coming Soon
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats Footer */}
          <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/10 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-black text-[#FF8C42] mb-1">6</div>
                <div className="text-sm text-white/80 font-semibold">Active Tools</div>
              </div>
              <div>
                <div className="text-3xl font-black text-blue-400 mb-1">14</div>
                <div className="text-sm text-white/80 font-semibold">Coming Soon</div>
              </div>
              <div>
                <div className="text-3xl font-black text-purple-400 mb-1">NEW</div>
                <div className="text-sm text-white/80 font-semibold">Content Studio</div>
              </div>
              <div>
                <div className="text-3xl font-black text-green-400 mb-1">$0.36</div>
                <div className="text-sm text-white/80 font-semibold">Cost per AI Video</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingHub;

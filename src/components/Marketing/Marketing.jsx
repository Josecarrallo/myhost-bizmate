import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Plus,
  Megaphone,
  Users,
  ThumbsUp,
  DollarSign,
  Search,
  TrendingUp,
  Eye,
  MousePointer,
  X
} from 'lucide-react';
import { dataService } from '../../services/data';

const MarketingSuite = ({ onBack }) => {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, scheduled, completed
  const [searchQuery, setSearchQuery] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);

      const campaignsData = await dataService.getCampaigns();

      console.log('[Marketing] Loaded from Supabase:', campaignsData?.length || 0);

      if (campaignsData && campaignsData.length > 0) {
        const mappedCampaigns = campaignsData.map(campaign => ({
          id: campaign.id,
          name: campaign.name,
          platform: getPlatformName(campaign.platform),
          platformIcon: getPlatformIcon(campaign.platform),
          status: capitalizeFirst(campaign.status),
          reach: formatNumber(campaign.impressions || 0),
          engagement: formatNumber(campaign.leads_count || 0),
          clicks: formatNumber(campaign.clicks || 0),
          conversions: campaign.leads_count || 0,
          budget: formatCurrency(campaign.daily_budget ? campaign.daily_budget * 30 : 0),
          spent: formatCurrency(campaign.total_spend_mtd || 0),
          startDate: campaign.created_at ? new Date(campaign.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A',
          endDate: 'N/A', // Not in schema
          ctr: campaign.ctr ? `${(campaign.ctr * 100).toFixed(2)}%` : '0%',
          cpc: formatCurrency(campaign.clicks ? (campaign.total_spend_mtd / campaign.clicks) : 0)
        }));
        setCampaigns(mappedCampaigns);
      }
    } catch (error) {
      console.error('[Marketing] Error loading:', error);
    } finally {
      setLoading(false);
    }
  };

  const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const getPlatformName = (platform) => {
    const platforms = {
      'meta': 'Facebook',
      'google': 'Google Ads',
      'tiktok': 'TikTok'
    };
    return platforms[platform] || platform;
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      'meta': '📘',
      'google': '🔍',
      'tiktok': '🎵'
    };
    return icons[platform] || '📱';
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatCurrency = (amount) => {
    if (amount === 0) return '$0';
    return `$${Math.round(amount).toLocaleString()}`;
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesFilter = filter === 'all' || campaign.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = searchQuery === '' ||
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.platform.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const stats = {
    active: campaigns.filter(c => c.status === 'Active').length,
    totalReach: campaigns.reduce((sum, c) => sum + parseFloat(c.reach.replace('K', '') || 0), 0).toFixed(1) + 'K',
    totalEngagement: campaigns.reduce((sum, c) => sum + parseFloat(c.engagement.replace('K', '') || 0), 0).toFixed(1) + 'K',
    totalSpent: campaigns.reduce((sum, c) => sum + parseFloat(c.spent.replace(',', '') || 0), 0).toLocaleString()
  };

  return (
    <div className="min-h-screen bg-[#2a2f3a] flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-[#d85a2a]/5 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Header */}
      <div className="bg-[#1f2937]/95 backdrop-blur-sm border-b-2 border-[#d85a2a]/20 p-4 relative z-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-[#FF8C42] hover:text-orange-500 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-black text-[#FF8C42] mb-1">Marketing</h2>
            <p className="text-sm md:text-base font-semibold text-orange-500">Campaign Management</p>
          </div>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 border-2 border-[#d85a2a]/20 shadow-lg text-white">
              <div className="flex items-center gap-3 mb-2">
                <Megaphone className="w-6 h-6" />
                <span className="text-sm font-bold opacity-90">Active Campaigns</span>
              </div>
              <div className="text-3xl font-black">{stats.active}</div>
            </div>
            <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#d85a2a]/20 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-[#FF8C42]" />
                <span className="text-sm font-bold text-gray-600">Total Reach</span>
              </div>
              <div className="text-3xl font-black text-[#FF8C42]">{stats.totalReach}</div>
              <div className="text-xs text-green-600 font-bold mt-1">+24% growth</div>
            </div>
            <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#d85a2a]/20 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <ThumbsUp className="w-6 h-6 text-[#FF8C42]" />
                <span className="text-sm font-bold text-gray-600">Engagement</span>
              </div>
              <div className="text-3xl font-black text-[#FF8C42]">{stats.totalEngagement}</div>
              <div className="text-xs text-green-600 font-bold mt-1">+12% increase</div>
            </div>
            <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#d85a2a]/20 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-6 h-6 text-[#FF8C42]" />
                <span className="text-sm font-bold text-gray-600">Total Spent</span>
              </div>
              <div className="text-3xl font-black text-[#FF8C42]">${stats.totalSpent}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-4 border-2 border-[#d85a2a]/20 shadow-lg">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none font-semibold text-gray-700"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-3 rounded-xl font-bold transition-all ${
                    filter === 'all'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({campaigns.length})
                </button>
                <button
                  onClick={() => setFilter('active')}
                  className={`px-4 py-3 rounded-xl font-bold transition-all ${
                    filter === 'active'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Active ({campaigns.filter(c => c.status === 'Active').length})
                </button>
                <button
                  onClick={() => setFilter('scheduled')}
                  className={`px-4 py-3 rounded-xl font-bold transition-all ${
                    filter === 'scheduled'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Scheduled ({campaigns.filter(c => c.status === 'Scheduled').length})
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-4 py-3 rounded-xl font-bold transition-all ${
                    filter === 'completed'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Completed ({campaigns.filter(c => c.status === 'Completed').length})
                </button>
              </div>
            </div>
          </div>

          {/* Campaigns */}
          <div className="space-y-4">
            {filteredCampaigns.map(campaign => (
              <div
                key={campaign.id}
                onClick={() => setSelectedCampaign(campaign)}
                className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-[#d85a2a]/20 hover:shadow-2xl transition-all cursor-pointer shadow-xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{campaign.platformIcon}</div>
                    <div>
                      <h3 className="text-xl font-black text-[#FF8C42]">{campaign.name}</h3>
                      <p className="text-sm font-semibold text-gray-600">{campaign.platform}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    campaign.status === 'Active' ? 'bg-green-100 text-green-700' :
                    campaign.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {campaign.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-orange-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Eye className="w-4 h-4 text-[#FF8C42]" />
                      <span className="text-xs font-bold text-gray-600">Reach</span>
                    </div>
                    <p className="text-xl font-black text-[#FF8C42]">{campaign.reach}</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <ThumbsUp className="w-4 h-4 text-[#FF8C42]" />
                      <span className="text-xs font-bold text-gray-600">Engagement</span>
                    </div>
                    <p className="text-xl font-black text-[#FF8C42]">{campaign.engagement}</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <MousePointer className="w-4 h-4 text-[#FF8C42]" />
                      <span className="text-xs font-bold text-gray-600">Clicks</span>
                    </div>
                    <p className="text-xl font-black text-[#FF8C42]">{campaign.clicks}</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-[#FF8C42]" />
                      <span className="text-xs font-bold text-gray-600">Budget</span>
                    </div>
                    <p className="text-xl font-black text-[#FF8C42]">${campaign.budget}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-semibold">
                    {campaign.startDate} - {campaign.endDate}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">
                      Spent: <span className="font-bold text-[#FF8C42]">${campaign.spent}</span>
                    </span>
                    <span className="text-gray-600">
                      CTR: <span className="font-bold text-[#FF8C42]">{campaign.ctr}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign Details Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1f2937] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{selectedCampaign.platformIcon}</div>
                  <div>
                    <h3 className="text-2xl font-black text-white">{selectedCampaign.name}</h3>
                    <p className="text-sm text-white/80 font-semibold">{selectedCampaign.platform}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="w-10 h-10 bg-[#d85a2a]/10 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Performance Metrics */}
              <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-200">
                <h4 className="text-lg font-black text-[#FF8C42] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Performance Metrics
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">Total Reach</p>
                    <p className="text-2xl font-black text-[#FF8C42]">{selectedCampaign.reach}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">Engagement</p>
                    <p className="text-2xl font-black text-[#FF8C42]">{selectedCampaign.engagement}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">Total Clicks</p>
                    <p className="text-2xl font-black text-[#FF8C42]">{selectedCampaign.clicks}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">Conversions</p>
                    <p className="text-2xl font-black text-[#FF8C42]">{selectedCampaign.conversions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">CTR</p>
                    <p className="text-2xl font-black text-[#FF8C42]">{selectedCampaign.ctr}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">CPC</p>
                    <p className="text-2xl font-black text-[#FF8C42]">{selectedCampaign.cpc}</p>
                  </div>
                </div>
              </div>

              {/* Budget Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                  <p className="text-xs text-gray-600 font-semibold mb-2">Budget</p>
                  <p className="text-3xl font-black text-[#FF8C42]">${selectedCampaign.budget}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                  <p className="text-xs text-gray-600 font-semibold mb-2">Spent</p>
                  <p className="text-3xl font-black text-[#FF8C42]">${selectedCampaign.spent}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((parseFloat(selectedCampaign.spent.replace(',', '')) / parseFloat(selectedCampaign.budget.replace(',', ''))) * 100).toFixed(0)}% used
                  </p>
                </div>
              </div>

              {/* Campaign Period */}
              <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                <p className="text-xs text-gray-600 font-semibold mb-2">Campaign Period</p>
                <p className="text-lg font-black text-gray-700">
                  {selectedCampaign.startDate} - {selectedCampaign.endDate}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                  Edit Campaign
                </button>
                <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all">
                  Pause
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingSuite;

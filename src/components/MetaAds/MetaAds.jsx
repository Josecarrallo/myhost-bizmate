import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Plus,
  Instagram,
  Facebook,
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  DollarSign,
  Target,
  Calendar,
  X,
  CheckCircle,
  Clock,
  Pause,
  Play
} from 'lucide-react';
import { guestSegmentationService } from '../../services/guestSegmentationService';

const MetaAds = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('all'); // all, instagram, facebook
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [segments, setSegments] = useState([]);
  const [filter, setFilter] = useState('all'); // all, active, scheduled, completed

  useEffect(() => {
    loadSegments();
  }, []);

  const loadSegments = async () => {
    try {
      const tenantId = localStorage.getItem('user_id') || 'demo-tenant';
      const segs = await guestSegmentationService.getSegments(tenantId);
      setSegments(segs);
    } catch (error) {
      console.error('Error loading segments:', error);
    }
  };

  // Demo campaigns data
  const campaigns = [
    {
      id: 1,
      name: "Luxury Villa Summer Special",
      platform: "instagram",
      objective: "bookings",
      status: "active",
      budget: 1500,
      spent: 1245,
      reach: 45200,
      impressions: 128500,
      clicks: 892,
      conversions: 24,
      ctr: 1.97,
      cpc: 1.40,
      startDate: "2025-12-01",
      endDate: "2025-12-31",
      audience: "High Value Guests",
      creative: "Villa pool sunset photo"
    },
    {
      id: 2,
      name: "Bali Getaway - New Year",
      platform: "facebook",
      objective: "awareness",
      status: "active",
      budget: 2000,
      spent: 1780,
      reach: 52300,
      impressions: 145000,
      clicks: 1245,
      conversions: 32,
      ctr: 2.38,
      cpc: 1.43,
      startDate: "2025-12-15",
      endDate: "2026-01-15",
      audience: "VIP Guests",
      creative: "Bali beach lifestyle video"
    },
    {
      id: 3,
      name: "Last Minute Deals",
      platform: "instagram",
      objective: "bookings",
      status: "scheduled",
      budget: 800,
      spent: 0,
      reach: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      ctr: 0,
      cpc: 0,
      startDate: "2026-01-05",
      endDate: "2026-01-20",
      audience: "Repeat Guests",
      creative: "Discount banner"
    },
    {
      id: 4,
      name: "Review Request Campaign",
      platform: "facebook",
      objective: "reviews",
      status: "completed",
      budget: 500,
      spent: 500,
      reach: 28700,
      impressions: 75000,
      clicks: 512,
      conversions: 14,
      ctr: 1.78,
      cpc: 0.98,
      startDate: "2025-11-01",
      endDate: "2025-11-30",
      audience: "Recent Guests",
      creative: "Guest testimonials"
    },
    {
      id: 5,
      name: "Christmas Special Offer",
      platform: "instagram",
      objective: "bookings",
      status: "scheduled",
      budget: 2500,
      spent: 0,
      reach: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      ctr: 0,
      cpc: 0,
      startDate: "2025-12-20",
      endDate: "2025-12-26",
      audience: "Loyal Guests",
      creative: "Christmas decorated villa"
    }
  ];

  const filteredCampaigns = campaigns.filter(c => {
    const matchesPlatform = activeTab === 'all' || c.platform === activeTab;
    const matchesStatus = filter === 'all' || c.status === filter;
    return matchesPlatform && matchesStatus;
  });

  const stats = {
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    totalBudget: campaigns.reduce((sum, c) => sum + c.budget, 0),
    totalSpent: campaigns.reduce((sum, c) => sum + c.spent, 0),
    totalReach: campaigns.reduce((sum, c) => sum + c.reach, 0)
  };

  const objectiveColors = {
    awareness: 'bg-orange-100 text-orange-700 border-orange-300',
    bookings: 'bg-green-100 text-green-700 border-green-300',
    reviews: 'bg-purple-100 text-purple-700 border-purple-300'
  };

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    scheduled: 'bg-orange-100 text-orange-700',
    completed: 'bg-gray-100 text-gray-700',
    paused: 'bg-yellow-100 text-yellow-700'
  };

  return (
    <div className="flex-1 h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50 p-4 relative overflow-auto">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 mb-6 border-2 border-orange-200 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#d85a2a] hover:text-[#FF8C42] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <div className="text-center flex-1">
            <h2 className="text-3xl font-black text-[#d85a2a] flex items-center justify-center gap-3">
              <Instagram className="w-8 h-8" />
              Meta Ads Manager
              <Facebook className="w-8 h-8" />
            </h2>
            <p className="text-sm text-gray-600 font-semibold">Instagram & Facebook Advertising</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#d85a2a] to-[#FF8C42] text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-[#d85a2a] to-[#FF8C42] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Campaigns ({campaigns.length})
          </button>
          <button
            onClick={() => setActiveTab('instagram')}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'instagram'
                ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Instagram className="w-4 h-4" />
            Instagram ({campaigns.filter(c => c.platform === 'instagram').length})
          </button>
          <button
            onClick={() => setActiveTab('facebook')}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'facebook'
                ? 'bg-gradient-to-r from-[#d85a2a] to-[#FF8C42] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Facebook className="w-4 h-4" />
            Facebook ({campaigns.filter(c => c.platform === 'facebook').length})
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-[#d85a2a] to-[#FF8C42] rounded-2xl p-6 border-2 border-orange-200 shadow-lg text-white">
          <div className="flex items-center gap-3 mb-2">
            <Play className="w-6 h-6" />
            <span className="text-sm font-bold opacity-90">Active Campaigns</span>
          </div>
          <div className="text-3xl font-black">{stats.activeCampaigns}</div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-6 h-6 text-[#d85a2a]" />
            <span className="text-sm font-bold text-gray-600">Total Reach</span>
          </div>
          <div className="text-3xl font-black text-[#d85a2a]">{(stats.totalReach / 1000).toFixed(1)}K</div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-6 h-6 text-[#d85a2a]" />
            <span className="text-sm font-bold text-gray-600">Total Budget</span>
          </div>
          <div className="text-3xl font-black text-[#d85a2a]">${stats.totalBudget.toLocaleString()}</div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-[#d85a2a]" />
            <span className="text-sm font-bold text-gray-600">Spent</span>
          </div>
          <div className="text-3xl font-black text-[#d85a2a]">${stats.totalSpent.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">
            {((stats.totalSpent / stats.totalBudget) * 100).toFixed(0)}% of budget
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 mb-6 border-2 border-orange-200 shadow-lg">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              filter === 'all'
                ? 'bg-[#d85a2a] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              filter === 'active'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('scheduled')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              filter === 'scheduled'
                ? 'bg-[#d85a2a] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Scheduled
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              filter === 'completed'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Campaigns */}
      <div className="space-y-4">
        {filteredCampaigns.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 border-2 border-orange-200 text-center">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-semibold">No campaigns found</p>
            <p className="text-sm text-gray-400 mt-2">Create your first campaign to start advertising</p>
          </div>
        ) : (
          filteredCampaigns.map(campaign => (
            <div
              key={campaign.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {campaign.platform === 'instagram' ? (
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <Instagram className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-[#d85a2a] rounded-xl flex items-center justify-center">
                      <Facebook className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-black text-gray-800">{campaign.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${objectiveColors[campaign.objective]}`}>
                        {campaign.objective.charAt(0).toUpperCase() + campaign.objective.slice(1)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[campaign.status]}`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Budget</p>
                  <p className="text-2xl font-black text-[#d85a2a]">${campaign.budget.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Spent: ${campaign.spent.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div className="bg-orange-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="w-4 h-4 text-[#d85a2a]" />
                    <span className="text-xs font-bold text-gray-600">Reach</span>
                  </div>
                  <p className="text-xl font-black text-[#d85a2a]">{(campaign.reach / 1000).toFixed(1)}K</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <MousePointer className="w-4 h-4 text-[#d85a2a]" />
                    <span className="text-xs font-bold text-gray-600">Clicks</span>
                  </div>
                  <p className="text-xl font-black text-[#d85a2a]">{campaign.clicks.toLocaleString()}</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-[#d85a2a]" />
                    <span className="text-xs font-bold text-gray-600">Conversions</span>
                  </div>
                  <p className="text-xl font-black text-[#d85a2a]">{campaign.conversions}</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-[#d85a2a]" />
                    <span className="text-xs font-bold text-gray-600">CTR</span>
                  </div>
                  <p className="text-xl font-black text-[#d85a2a]">{campaign.ctr.toFixed(2)}%</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-[#d85a2a]" />
                    <span className="text-xs font-bold text-gray-600">CPC</span>
                  </div>
                  <p className="text-xl font-black text-[#d85a2a]">${campaign.cpc.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">
                    <Users className="w-4 h-4 inline mr-1" />
                    {campaign.audience}
                  </span>
                  <span className="text-gray-600">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {campaign.startDate} - {campaign.endDate}
                  </span>
                </div>
                <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-bold hover:bg-orange-200 transition-all">
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Campaign Modal (Placeholder) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-[#d85a2a] to-[#FF8C42] p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-white">Create Meta Ad Campaign</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200 mb-4">
                <p className="text-sm text-orange-800 font-semibold">
                  📱 <strong>Phase 1:</strong> Campaign creation UI ready. Full Meta API integration coming in Phase 2.
                </p>
              </div>

              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-[#d85a2a] mx-auto mb-4" />
                <p className="text-xl font-bold text-gray-800 mb-2">Campaign Creation UI</p>
                <p className="text-gray-600">
                  Platform selection, objectives, audience targeting,<br/>
                  budget planning - all ready for Phase 2 activation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetaAds;

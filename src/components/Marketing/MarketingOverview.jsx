import React, { useState, useEffect } from 'react';
import PageShell from '../Layout/PageShell';
import {
  TrendingUp,
  DollarSign,
  Eye,
  MessageSquare,
  Star,
  Calendar,
  Instagram,
  Facebook,
  Globe,
  ThumbsUp,
  Users,
  Target,
  Zap
} from 'lucide-react';
import marketingService from '../../services/marketingService';

/**
 * Marketing Overview - Main dashboard for Marketing & Growth module
 * Shows KPIs, recent campaigns, posts, and reviews
 */
const MarketingOverview = ({ onBack }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load all data in parallel
      const [campaignStats, reviewStats, campaigns, posts, reviews] = await Promise.all([
        marketingService.getCampaignStats(),
        marketingService.getReviewStats(),
        marketingService.getCampaigns({ status: 'active' }),
        marketingService.getPosts({ status: 'scheduled' }),
        marketingService.getReviews()
      ]);

      // Combine stats
      setStats({
        campaigns: campaignStats,
        reviews: reviewStats
      });

      setRecentCampaigns(campaigns.slice(0, 3));
      setRecentPosts(posts.slice(0, 3));
      setRecentReviews(reviews.slice(0, 5));

    } catch (error) {
      console.error('Error loading dashboard:', error);
      // Use fallback data
      setStats({
        campaigns: {
          activeCampaigns: 2,
          totalSpend: 630,
          totalLeads: 35,
          totalImpressions: 25700
        },
        reviews: {
          averageRating: 4.6,
          totalReviews: 5,
          bySentiment: {
            positive: 4,
            neutral: 1,
            negative: 0
          }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // KPIs for PageShell
  const kpis = stats ? [
    {
      label: 'Active Campaigns',
      value: stats.campaigns.activeCampaigns.toString(),
      icon: Zap,
      color: 'orange',
      trend: { direction: 'up', value: '+2' }
    },
    {
      label: 'Total Spend (MTD)',
      value: `$${stats.campaigns.totalSpend.toLocaleString()}`,
      icon: DollarSign,
      color: 'green',
      trend: { direction: 'up', value: '+$180' }
    },
    {
      label: 'Total Leads',
      value: stats.campaigns.totalLeads.toString(),
      icon: Users,
      color: 'blue',
      trend: { direction: 'up', value: '+12' }
    },
    {
      label: 'Avg. Rating',
      value: stats.reviews.averageRating.toFixed(1),
      icon: Star,
      color: 'purple',
      trend: { direction: 'up', value: '+0.2' }
    }
  ] : [];

  if (loading) {
    return (
      <div className="flex-1 h-screen bg-[#1a1f2e] overflow-auto flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#d85a2a]/30 border-t-[#d85a2a] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl font-bold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <PageShell
      title="Marketing & Growth"
      subtitle="Campaigns, Content & Reviews Overview"
      aiHelperText="Monitors all marketing campaigns across Meta, Google, and TikTok. Tracks social media content performance, manages reviews from multiple platforms, and provides AI-powered insights to optimize your marketing ROI."
      kpis={kpis}
      onBack={onBack}
    >
      <div className="p-6 space-y-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Impressions */}
          <div className="bg-[#1a1f2e] rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Eye className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider">Total Impressions</p>
                <p className="text-2xl font-bold text-white">{stats.campaigns.totalImpressions.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Positive Reviews */}
          <div className="bg-[#1a1f2e] rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <ThumbsUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider">Positive Reviews</p>
                <p className="text-2xl font-bold text-white">
                  {stats.reviews.bySentiment.positive} / {stats.reviews.totalReviews}
                </p>
              </div>
            </div>
          </div>

          {/* Scheduled Posts */}
          <div className="bg-[#1a1f2e] rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider">Scheduled Posts</p>
                <p className="text-2xl font-bold text-white">{recentPosts.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Campaigns */}
          <div className="bg-[#1a1f2e] rounded-xl border border-white/10 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-[#FF8C42]" />
                Active Campaigns
              </h3>
              <button className="text-xs text-[#FF8C42] hover:text-[#d85a2a] font-medium">
                View All →
              </button>
            </div>

            {recentCampaigns.length === 0 ? (
              <p className="text-white/50 text-sm text-center py-8">No active campaigns</p>
            ) : (
              <div className="space-y-3">
                {recentCampaigns.map((campaign) => (
                  <div key={campaign.id} className="bg-[#2a2f3a] rounded-lg p-3 hover:bg-[#2a2f3a]/80 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-white">{campaign.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                            {campaign.status}
                          </span>
                          <span className="text-xs text-white/50">
                            {campaign.platform === 'meta' ? '📱 Meta' : campaign.platform}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#FF8C42]">
                          ${parseFloat(campaign.total_spend_mtd || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-white/50">spent</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                      <div>
                        <p className="text-white/50">Leads</p>
                        <p className="text-white font-medium">{campaign.leads_count || 0}</p>
                      </div>
                      <div>
                        <p className="text-white/50">Clicks</p>
                        <p className="text-white font-medium">{campaign.clicks || 0}</p>
                      </div>
                      <div>
                        <p className="text-white/50">CTR</p>
                        <p className="text-white font-medium">{parseFloat(campaign.ctr || 0).toFixed(2)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Reviews */}
          <div className="bg-[#1a1f2e] rounded-xl border border-white/10 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-[#FF8C42]" />
                Recent Reviews
              </h3>
              <button className="text-xs text-[#FF8C42] hover:text-[#d85a2a] font-medium">
                View All →
              </button>
            </div>

            {recentReviews.length === 0 ? (
              <p className="text-white/50 text-sm text-center py-8">No reviews yet</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentReviews.map((review) => (
                  <div key={review.id} className="bg-[#2a2f3a] rounded-lg p-3 hover:bg-[#2a2f3a]/80 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-white">{review.guest_name}</p>
                          <div className="flex">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-white/70 line-clamp-2">{review.review_text}</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full ml-2">
                        {review.source}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        review.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                        review.sentiment === 'neutral' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {review.sentiment}
                      </span>
                      {review.response_text ? (
                        <span className="text-xs text-green-400">✓ Responded</span>
                      ) : (
                        <button className="text-xs text-[#FF8C42] hover:text-[#d85a2a] font-medium">
                          Respond
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Posts */}
        <div className="bg-[#1a1f2e] rounded-xl border border-white/10 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#FF8C42]" />
              Scheduled Posts
            </h3>
            <button className="text-xs text-[#FF8C42] hover:text-[#d85a2a] font-medium">
              View Calendar →
            </button>
          </div>

          {recentPosts.length === 0 ? (
            <p className="text-white/50 text-sm text-center py-8">No scheduled posts</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="bg-[#2a2f3a] rounded-lg p-3 hover:bg-[#2a2f3a]/80 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    {post.platform === 'instagram' && <Instagram className="w-4 h-4 text-pink-400" />}
                    {post.platform === 'facebook' && <Facebook className="w-4 h-4 text-blue-400" />}
                    {post.platform === 'tiktok' && <Globe className="w-4 h-4 text-white" />}
                    <span className="text-xs font-medium text-white/70 uppercase">{post.platform}</span>
                  </div>
                  <p className="text-sm text-white line-clamp-2 mb-2">{post.caption}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/50">
                      {post.scheduled_at ? new Date(post.scheduled_at).toLocaleDateString() : 'Draft'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      post.status === 'scheduled' ? 'bg-orange-500/20 text-orange-400' :
                      post.status === 'published' ? 'bg-green-500/20 text-green-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
};

export default MarketingOverview;

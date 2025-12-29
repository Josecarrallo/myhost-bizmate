import React, { useState, useEffect } from 'react';
import PageShell from '../layout/PageShell';
import {
  Calendar as CalendarIcon,
  Plus,
  Instagram,
  Facebook,
  Globe,
  Image,
  Video,
  Clock,
  CheckCircle,
  X,
  Hash,
  Type
} from 'lucide-react';
import marketingService from '../../services/marketingService';

/**
 * Content Planner - Social media content calendar
 * Schedule posts for Instagram, Facebook, TikTok
 */
const ContentPlanner = ({ onBack }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, scheduled, published, draft
  const [platformFilter, setPlatformFilter] = useState('all'); // all, instagram, facebook, tiktok
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await marketingService.getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesStatus = filter === 'all' || post.status === filter;
    const matchesPlatform = platformFilter === 'all' || post.platform === platformFilter;
    return matchesStatus && matchesPlatform;
  });

  // Calculate stats
  const stats = {
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
    totalEngagement: posts.reduce((sum, p) => {
      const engagement = p.engagement_stats || {};
      return sum + (engagement.likes || 0) + (engagement.comments || 0) + (engagement.shares || 0);
    }, 0)
  };

  const kpis = [
    {
      label: 'Scheduled Posts',
      value: stats.scheduled.toString(),
      icon: Clock,
      color: 'orange',
      trend: { direction: 'up', value: '+2' }
    },
    {
      label: 'Published This Month',
      value: stats.published.toString(),
      icon: CheckCircle,
      color: 'green'
    },
    {
      label: 'Draft Posts',
      value: stats.draft.toString(),
      icon: Type,
      color: 'blue'
    },
    {
      label: 'Total Engagement',
      value: stats.totalEngagement.toString(),
      icon: Instagram,
      color: 'purple',
      trend: { direction: 'up', value: '+15%' }
    }
  ];

  const platformIcons = {
    instagram: { icon: Instagram, color: 'from-pink-500 to-orange-500', textColor: 'text-pink-400' },
    facebook: { icon: Facebook, color: 'from-blue-500 to-blue-600', textColor: 'text-blue-400' },
    tiktok: { icon: Globe, color: 'from-gray-700 to-gray-900', textColor: 'text-white' },
    all: { icon: Globe, color: 'from-[#d85a2a] to-[#FF8C42]', textColor: 'text-[#FF8C42]' }
  };

  const statusColors = {
    draft: 'bg-gray-500/20 text-gray-400',
    scheduled: 'bg-orange-500/20 text-orange-400',
    published: 'bg-green-500/20 text-green-400',
    failed: 'bg-red-500/20 text-red-400'
  };

  if (loading) {
    return (
      <div className="flex-1 h-screen bg-[#1a1f2e] overflow-auto flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#d85a2a]/30 border-t-[#d85a2a] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl font-bold">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <PageShell
      title="Content Planner"
      subtitle="Schedule and manage social media posts"
      aiHelperText="Schedule posts across Instagram, Facebook, and TikTok. AI suggests optimal posting times, generates captions, and recommends hashtags to maximize engagement."
      kpis={kpis}
      onBack={onBack}
      headerActions={
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3 md:px-4 py-2 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] text-white rounded-lg text-sm md:text-base font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Create Post</span>
          <span className="sm:hidden">New</span>
        </button>
      }
    >
      <div className="p-3 md:p-6 space-y-4 md:space-y-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          {/* Platform Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {['all', 'instagram', 'facebook', 'tiktok'].map(platform => {
              const config = platformIcons[platform];
              const Icon = config.icon;
              return (
                <button
                  key={platform}
                  onClick={() => setPlatformFilter(platform)}
                  className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                    platformFilter === platform
                      ? `bg-gradient-to-r ${config.color} text-white`
                      : 'bg-[#1a1f2e] text-white/70 hover:bg-[#2a2f3a] border border-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                </button>
              );
            })}
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 md:ml-auto">
            {['all', 'draft', 'scheduled', 'published'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-all whitespace-nowrap ${
                  filter === status
                    ? 'bg-[#d85a2a] text-white'
                    : 'bg-[#1a1f2e] text-white/70 hover:bg-[#2a2f3a] border border-white/10'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="bg-[#1a1f2e] rounded-xl border border-white/10 p-12 text-center">
            <CalendarIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 font-semibold mb-2">No posts found</p>
            <p className="text-sm text-white/40">Create your first post to start scheduling content</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosts.map(post => {
              const platformConfig = platformIcons[post.platform] || platformIcons.all;
              const PlatformIcon = platformConfig.icon;

              return (
                <div
                  key={post.id}
                  className="bg-[#1a1f2e] rounded-xl border border-white/10 overflow-hidden hover:border-[#d85a2a]/30 transition-all group"
                >
                  {/* Platform Header */}
                  <div className={`bg-gradient-to-r ${platformConfig.color} p-3`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PlatformIcon className="w-4 h-4 text-white" />
                        <span className="text-sm font-medium text-white uppercase">
                          {post.platform}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[post.status]} border border-white/10`}>
                        {post.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Media Preview */}
                    {post.media_urls && post.media_urls.length > 0 ? (
                      <div className="bg-[#2a2f3a] rounded-lg h-40 mb-3 flex items-center justify-center">
                        <Image className="w-8 h-8 text-white/30" />
                      </div>
                    ) : (
                      <div className="bg-[#2a2f3a] rounded-lg h-40 mb-3 flex items-center justify-center border-2 border-dashed border-white/10">
                        <div className="text-center">
                          <Image className="w-8 h-8 text-white/20 mx-auto mb-2" />
                          <p className="text-xs text-white/40">No media</p>
                        </div>
                      </div>
                    )}

                    {/* Caption */}
                    <p className="text-sm text-white/90 line-clamp-3 mb-3">
                      {post.caption || 'No caption'}
                    </p>

                    {/* Hashtags */}
                    {post.hashtags && post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.hashtags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="text-xs px-2 py-1 bg-[#d85a2a]/10 text-[#FF8C42] rounded">
                            #{tag}
                          </span>
                        ))}
                        {post.hashtags.length > 3 && (
                          <span className="text-xs px-2 py-1 text-white/50">
                            +{post.hashtags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Schedule Info */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        <Clock className="w-3 h-3" />
                        {post.scheduled_at ? (
                          <span>{new Date(post.scheduled_at).toLocaleString()}</span>
                        ) : (
                          <span>No schedule</span>
                        )}
                      </div>
                    </div>

                    {/* Engagement Stats (if published) */}
                    {post.status === 'published' && post.engagement_stats && (
                      <div className="flex gap-4 mt-3 pt-3 border-t border-white/10 text-xs">
                        <div>
                          <p className="text-white/50">Likes</p>
                          <p className="text-white font-medium">{post.engagement_stats.likes || 0}</p>
                        </div>
                        <div>
                          <p className="text-white/50">Comments</p>
                          <p className="text-white font-medium">{post.engagement_stats.comments || 0}</p>
                        </div>
                        <div>
                          <p className="text-white/50">Shares</p>
                          <p className="text-white font-medium">{post.engagement_stats.shares || 0}</p>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 px-3 py-2 bg-[#2a2f3a] hover:bg-[#d85a2a]/20 text-white/70 hover:text-[#FF8C42] rounded-lg text-xs font-medium transition-colors">
                        Edit
                      </button>
                      <button className="flex-1 px-3 py-2 bg-[#2a2f3a] hover:bg-red-500/20 text-white/70 hover:text-red-400 rounded-lg text-xs font-medium transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#2a2f3a] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl border border-white/10">
            <div className="sticky top-0 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Create Social Post</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-[#d85a2a]/10 rounded-xl p-4 border border-[#d85a2a]/20 mb-4">
                <p className="text-sm text-[#FF8C42] font-semibold">
                  📅 <strong>Phase 1:</strong> Content planner UI ready. Full social media API integration coming in Phase 2.
                </p>
              </div>

              <div className="text-center py-12">
                <CalendarIcon className="w-16 h-16 text-[#FF8C42] mx-auto mb-4" />
                <p className="text-xl font-bold text-white mb-2">Post Creation UI</p>
                <p className="text-white/70">
                  Platform selection, media upload, caption editor,<br/>
                  hashtag suggestions, and scheduling - ready for Phase 2.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
};

export default ContentPlanner;

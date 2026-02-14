import React, { useState, useEffect } from 'react';
import PageShell from '../Layout/PageShell';
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
  Type,
  Sparkles,
  TrendingUp,
  BarChart3,
  Zap,
  Eye
} from 'lucide-react';
import marketingService from '../../services/marketingService';

/**
 * Content Planner (AI) - Social media content calendar with AI generation
 * 3 Tabs: Calendar, Create Content (AI), Library/Performance
 */
const ContentPlanner = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('calendar'); // calendar, create, library
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, scheduled, published, draft
  const [platformFilter, setPlatformFilter] = useState('all'); // all, instagram, facebook, tiktok

  // AI Content Creator state
  const [aiForm, setAiForm] = useState({
    property: '',
    objective: 'awareness',
    channel: 'instagram',
    tone: 'luxury',
    cta: 'whatsapp',
    language: 'en'
  });
  const [generatedContent, setGeneratedContent] = useState(null);
  const [generating, setGenerating] = useState(false);

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

  // AI Content Generation
  const handleGenerateContent = async () => {
    setGenerating(true);

    // Simulate AI generation (replace with actual API call)
    setTimeout(() => {
      const contentId = `CNT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      const utmCampaign = `${aiForm.property}_${aiForm.objective}_${new Date().toISOString().slice(0, 7)}`.toLowerCase().replace(/\s+/g, '_');

      const generated = {
        content_id: contentId,
        channel: aiForm.channel,
        cta: aiForm.cta,
        utm_campaign: utmCampaign,
        linked_flow: aiForm.cta === 'whatsapp' ? 'BANYU' : 'WEBSITE',
        status: 'draft',
        hook: aiForm.objective === 'awareness'
          ? `✨ Discover ${aiForm.property} - Your Perfect Getaway Awaits`
          : aiForm.objective === 'leads'
          ? `🌴 Limited Time: Exclusive ${aiForm.property} Offer`
          : `📅 Book ${aiForm.property} Now - Special Rates Available`,
        caption: `Experience the ultimate ${aiForm.tone === 'luxury' ? 'luxury' : 'comfort'} at ${aiForm.property}. \n\n${
          aiForm.objective === 'awareness'
            ? 'Immerse yourself in breathtaking views, world-class amenities, and unforgettable memories.'
            : aiForm.objective === 'leads'
            ? 'Ready to escape? Message us for exclusive rates and personalized recommendations.'
            : 'Book your dream vacation today and enjoy our best rates of the season.'
        }\n\n${aiForm.tone === 'luxury' ? 'Indulge in sophistication.' : 'Your perfect retreat awaits.'} ${
          aiForm.cta === 'whatsapp' ? '💬 WhatsApp us now!' : '🌐 Book on our website!'
        }`,
        hashtags: aiForm.channel === 'instagram'
          ? ['luxurytravel', 'vacationrental', 'balivillas', 'tropicalgetaway', 'travelgoals']
          : ['vacation', 'travel', 'getaway'],
        cta_copy: aiForm.cta === 'whatsapp'
          ? '💬 Message us on WhatsApp for instant booking assistance!'
          : '🌐 Visit our website and book directly for the best rates!',
        tracking_id: `TRK-${contentId}`,
        created_at: new Date().toISOString()
      };

      setGeneratedContent(generated);
      setGenerating(false);
    }, 2000);
  };

  const handleSaveToDraft = () => {
    alert(`Content ${generatedContent.content_id} saved to drafts! It will be visible in the Calendar tab.`);
    setGeneratedContent(null);
    setActiveTab('calendar'); // Switch back to calendar
  };

  const tabs = [
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'create', label: 'Create Content (AI)', icon: Sparkles },
    { id: 'library', label: 'Library / Performance', icon: BarChart3 }
  ];

  return (
    <PageShell
      title="Content Planner (AI)"
      subtitle="Create, schedule, and analyze social media content"
      aiHelperText="AI-powered content creation for Instagram, Facebook, and TikTok. Generate professional captions, hashtags, and CTAs. Track leads from content back to bookings."
      kpis={kpis}
      onBack={onBack}
      headerActions={
        activeTab === 'calendar' && (
          <button
            onClick={() => setActiveTab('create')}
            className="px-3 md:px-4 py-2 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] text-white rounded-lg text-sm md:text-base font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Create with AI</span>
            <span className="sm:hidden">Create</span>
          </button>
        )
      }
    >
      {/* Tabs - Fixed position, no jumping */}
      <div className="sticky top-0 z-20 bg-[#1a1f2e] border-b border-white/10">
        <div className="flex gap-1 p-2 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#d85a2a] to-[#f5a524] text-white'
                    : 'text-white/70 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm md:text-base">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content - Minimum height to prevent jumping */}
      <div className="min-h-[600px]">
        {/* TAB 1: CALENDAR */}
        {activeTab === 'calendar' && (
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
                          : 'bg-[#2a2f3a] text-white/70 hover:bg-[#3a3f4a] border border-white/10'
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
                        : 'bg-[#2a2f3a] text-white/70 hover:bg-[#3a3f4a] border border-white/10'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-16 h-16 border-4 border-[#d85a2a]/30 border-t-[#d85a2a] rounded-full animate-spin"></div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="bg-[#2a2f3a] rounded-xl border border-white/10 p-12 text-center">
                <CalendarIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/50 font-semibold mb-2">No posts found</p>
                <p className="text-sm text-white/40 mb-4">Create your first post to start scheduling content</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-6 py-3 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Create with AI →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPosts.map(post => {
                  const platformConfig = platformIcons[post.platform] || platformIcons.all;
                  const PlatformIcon = platformConfig.icon;

                  return (
                    <div
                      key={post.id}
                      className="bg-[#2a2f3a] rounded-xl border border-white/10 overflow-hidden hover:border-[#d85a2a]/30 transition-all group"
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
                          <div className="bg-[#1a1f2e] rounded-lg h-40 mb-3 flex items-center justify-center">
                            <Image className="w-8 h-8 text-white/30" />
                          </div>
                        ) : (
                          <div className="bg-[#1a1f2e] rounded-lg h-40 mb-3 flex items-center justify-center border-2 border-dashed border-white/10">
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

                        {/* Actions */}
                        <div className="flex gap-2 mt-4">
                          <button className="flex-1 px-3 py-2 bg-[#1a1f2e] hover:bg-[#d85a2a]/20 text-white/70 hover:text-[#FF8C42] rounded-lg text-xs font-medium transition-colors">
                            Edit
                          </button>
                          <button className="flex-1 px-3 py-2 bg-[#1a1f2e] hover:bg-red-500/20 text-white/70 hover:text-red-400 rounded-lg text-xs font-medium transition-colors">
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
        )}

        {/* TAB 2: CREATE CONTENT (AI) */}
        {activeTab === 'create' && (
          <div className="p-3 md:p-6 space-y-4 md:space-y-6">
            {/* Info Banner */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">AI Content Creator</h3>
                  <p className="text-white/70 text-sm">
                    Generate professional social media content with AI. Each post gets a unique content_id for tracking leads back to this content.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* LEFT: AI Form */}
              <div className="bg-[#2a2f3a] rounded-xl border border-white/10 p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#FF8C42]" />
                  Content Settings
                </h3>

                <div className="space-y-4">
                  {/* Property */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Property / Brand</label>
                    <input
                      type="text"
                      value={aiForm.property}
                      onChange={(e) => setAiForm({...aiForm, property: e.target.value})}
                      placeholder="e.g., Izumi Hotel Bali"
                      className="w-full px-4 py-3 bg-[#1a1f2e] border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-[#d85a2a] focus:outline-none"
                    />
                  </div>

                  {/* Objective */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Objective</label>
                    <select
                      value={aiForm.objective}
                      onChange={(e) => setAiForm({...aiForm, objective: e.target.value})}
                      className="w-full px-4 py-3 bg-[#1a1f2e] border border-white/10 rounded-lg text-white focus:border-[#d85a2a] focus:outline-none"
                    >
                      <option value="awareness">Awareness</option>
                      <option value="leads">Leads</option>
                      <option value="bookings">Bookings</option>
                    </select>
                  </div>

                  {/* Channel */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Channel</label>
                    <select
                      value={aiForm.channel}
                      onChange={(e) => setAiForm({...aiForm, channel: e.target.value})}
                      className="w-full px-4 py-3 bg-[#1a1f2e] border border-white/10 rounded-lg text-white focus:border-[#d85a2a] focus:outline-none"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="tiktok">TikTok</option>
                    </select>
                  </div>

                  {/* Tone */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Tone</label>
                    <select
                      value={aiForm.tone}
                      onChange={(e) => setAiForm({...aiForm, tone: e.target.value})}
                      className="w-full px-4 py-3 bg-[#1a1f2e] border border-white/10 rounded-lg text-white focus:border-[#d85a2a] focus:outline-none"
                    >
                      <option value="luxury">Luxury</option>
                      <option value="friendly">Friendly</option>
                      <option value="direct">Direct</option>
                    </select>
                  </div>

                  {/* CTA */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Call to Action</label>
                    <select
                      value={aiForm.cta}
                      onChange={(e) => setAiForm({...aiForm, cta: e.target.value})}
                      className="w-full px-4 py-3 bg-[#1a1f2e] border border-white/10 rounded-lg text-white focus:border-[#d85a2a] focus:outline-none"
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="dm">DM</option>
                      <option value="website">Website</option>
                    </select>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Language</label>
                    <select
                      value={aiForm.language}
                      onChange={(e) => setAiForm({...aiForm, language: e.target.value})}
                      className="w-full px-4 py-3 bg-[#1a1f2e] border border-white/10 rounded-lg text-white focus:border-[#d85a2a] focus:outline-none"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="id">Indonesian</option>
                    </select>
                  </div>

                  <button
                    onClick={handleGenerateContent}
                    disabled={!aiForm.property || generating}
                    className="w-full px-6 py-4 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] text-white rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {generating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Content with AI
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* RIGHT: Generated Content Preview */}
              <div className="bg-[#2a2f3a] rounded-xl border border-white/10 p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[#FF8C42]" />
                  Content Preview
                </h3>

                {!generatedContent ? (
                  <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                      <Sparkles className="w-16 h-16 text-white/20 mx-auto mb-4" />
                      <p className="text-white/50 font-semibold mb-2">No content generated yet</p>
                      <p className="text-sm text-white/40">Fill the form and click Generate</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Content ID Badge */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-mono">
                        {generatedContent.content_id}
                      </span>
                      <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs">
                        {generatedContent.status}
                      </span>
                    </div>

                    {/* Hook */}
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-2 uppercase">Hook</label>
                      <p className="text-white font-bold text-base md:text-lg">{generatedContent.hook}</p>
                    </div>

                    {/* Caption */}
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-2 uppercase">Caption</label>
                      <p className="text-white/90 text-sm whitespace-pre-line">{generatedContent.caption}</p>
                    </div>

                    {/* Hashtags */}
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-2 uppercase">Hashtags</label>
                      <div className="flex flex-wrap gap-2">
                        {generatedContent.hashtags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-[#d85a2a]/10 text-[#FF8C42] rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-2 uppercase">Call to Action</label>
                      <p className="text-white/90 text-sm">{generatedContent.cta_copy}</p>
                    </div>

                    {/* Tracking Info */}
                    <div className="bg-[#1a1f2e] rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-xs flex-wrap gap-2">
                        <span className="text-white/50">UTM Campaign:</span>
                        <span className="text-white font-mono break-all">{generatedContent.utm_campaign}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white/50">Linked Flow:</span>
                        <span className="text-white font-medium">{generatedContent.linked_flow}</span>
                      </div>
                      <div className="flex justify-between text-xs flex-wrap gap-2">
                        <span className="text-white/50">Tracking ID:</span>
                        <span className="text-white font-mono">{generatedContent.tracking_id}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveToDraft}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                      >
                        Save to Draft
                      </button>
                      <button
                        onClick={() => setGeneratedContent(null)}
                        className="px-4 py-3 bg-[#1a1f2e] hover:bg-red-500/20 text-white/70 hover:text-red-400 rounded-lg font-medium transition-colors"
                      >
                        Discard
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Connection Flow Info */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                Content → Leads Flow
              </h4>
              <p className="text-white/70 text-sm mb-3">
                When users interact with this content, the lead is automatically tracked:
              </p>
              <div className="flex items-center gap-2 text-xs text-white/60 flex-wrap">
                <span className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded">Content</span>
                <span>→</span>
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">WhatsApp/IG</span>
                <span>→</span>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded">BANYU</span>
                <span>→</span>
                <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded">Master Johnson</span>
                <span>→</span>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">WF-SP-01</span>
                <span>→</span>
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded font-bold">Lead Created</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LIBRARY / PERFORMANCE */}
        {activeTab === 'library' && (
          <div className="p-3 md:p-6 space-y-6">
            <div className="bg-[#2a2f3a] rounded-xl border border-white/10 p-12 text-center">
              <BarChart3 className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/50 font-semibold mb-2">Performance Analytics Coming Soon</p>
              <p className="text-sm text-white/40">
                Track engagement, reach, and conversion metrics for all your content
              </p>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default ContentPlanner;

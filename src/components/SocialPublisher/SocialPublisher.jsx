import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Plus,
  Share2,
  CheckCircle,
  BarChart3,
  Users,
  Instagram,
  Facebook,
  Twitter,
  ThumbsUp,
  MessageSquare,
  Search,
  Calendar,
  X,
  Eye
} from 'lucide-react';

const SocialPublisher = ({ onBack }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [filter, setFilter] = useState('all'); // all, published, scheduled
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const posts = [
    {
      id: 1,
      content: "✨ Discover paradise at Villa Sunset! Book now for an unforgettable Bali experience. #BaliVilla #LuxuryTravel",
      platforms: ['Instagram', 'Facebook', 'Twitter'],
      scheduled: "Oct 25, 10:00 AM",
      status: "Scheduled",
      image: "🏖️",
      metrics: { likes: 0, comments: 0, shares: 0, reach: 0 }
    },
    {
      id: 2,
      content: "🏠 Wake up to ocean views at our Beach House. Limited availability for November! #BeachLife #VacationRental",
      platforms: ['Instagram', 'Facebook'],
      scheduled: "Oct 20, 3:00 PM",
      status: "Published",
      image: "🌊",
      metrics: { likes: 342, comments: 28, shares: 56, reach: "12.5K" }
    },
    {
      id: 3,
      content: "🌄 Escape to our Mountain Cabin this winter. Perfect for families and groups! Book your dates now. #MountainRetreat",
      platforms: ['Instagram', 'Twitter'],
      scheduled: "Oct 22, 9:00 AM",
      status: "Published",
      image: "⛰️",
      metrics: { likes: 278, comments: 19, shares: 34, reach: "9.8K" }
    },
    {
      id: 4,
      content: "🎄 Christmas Special: Book 5 nights and get 1 night FREE! Limited time offer. #HolidayDeals #BaliVillas",
      platforms: ['Instagram', 'Facebook', 'Twitter'],
      scheduled: "Nov 1, 8:00 AM",
      status: "Scheduled",
      image: "🎅",
      metrics: { likes: 0, comments: 0, shares: 0, reach: 0 }
    },
    {
      id: 5,
      content: "✨ New Year, New Adventures! Start 2026 in our luxury villas. Early bird discounts available! #NewYear2026 #TravelBali",
      platforms: ['Instagram', 'Facebook'],
      scheduled: "Nov 15, 11:00 AM",
      status: "Scheduled",
      image: "🎆",
      metrics: { likes: 0, comments: 0, shares: 0, reach: 0 }
    },
    {
      id: 6,
      content: "🌅 Golden hour at Villa Paradise. Where every sunset is a masterpiece. #BaliSunset #VillaLife",
      platforms: ['Instagram'],
      scheduled: "Oct 18, 6:00 PM",
      status: "Published",
      image: "🌇",
      metrics: { likes: 521, comments: 42, shares: 89, reach: "18.3K" }
    },
    {
      id: 7,
      content: "🏊‍♂️ Dive into luxury! Our infinity pools offer the perfect blend of relaxation and stunning views. #InfinityPool #LuxuryLiving",
      platforms: ['Instagram', 'Facebook', 'Twitter'],
      scheduled: "Oct 19, 2:00 PM",
      status: "Published",
      image: "🏊",
      metrics: { likes: 412, comments: 31, shares: 67, reach: "15.2K" }
    },
    {
      id: 8,
      content: "🍹 Tropical vibes only! Experience the ultimate Bali getaway in our beachfront properties. Limited slots for December! #TropicalParadise",
      platforms: ['Instagram', 'Facebook'],
      scheduled: "Oct 17, 10:30 AM",
      status: "Published",
      image: "🌴",
      metrics: { likes: 389, comments: 24, shares: 51, reach: "13.7K" }
    }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesFilter = filter === 'all' ||
      post.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = searchQuery === '' ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const stats = {
    scheduled: posts.filter(p => p.status === 'Scheduled').length,
    published: posts.filter(p => p.status === 'Published').length,
    totalEngagement: posts.reduce((sum, p) => sum + p.metrics.likes + p.metrics.comments + p.metrics.shares, 0),
    totalFollowers: "24.5K"
  };

  const getPlatformIcon = (platform) => {
    switch(platform) {
      case 'Instagram': return <Instagram className="w-4 h-4 text-pink-500" />;
      case 'Facebook': return <Facebook className="w-4 h-4 text-blue-600" />;
      case 'Twitter': return <Twitter className="w-4 h-4 text-blue-400" />;
      default: return null;
    }
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
            <h2 className="text-3xl md:text-4xl font-black text-[#FF8C42] mb-1">Social Publisher</h2>
            <p className="text-sm md:text-base font-semibold text-orange-500">Content Scheduling</p>
          </div>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Post
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
                <Share2 className="w-6 h-6" />
                <span className="text-sm font-bold opacity-90">Scheduled Posts</span>
              </div>
              <div className="text-3xl font-black">{stats.scheduled}</div>
            </div>
            <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#d85a2a]/20 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-[#FF8C42]" />
                <span className="text-sm font-bold text-gray-600">Published</span>
              </div>
              <div className="text-3xl font-black text-[#FF8C42]">{stats.published}</div>
            </div>
            <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#d85a2a]/20 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-6 h-6 text-[#FF8C42]" />
                <span className="text-sm font-bold text-gray-600">Total Engagement</span>
              </div>
              <div className="text-3xl font-black text-[#FF8C42]">{stats.totalEngagement.toLocaleString()}</div>
              <div className="text-xs text-green-600 font-bold mt-1">+18% growth</div>
            </div>
            <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#d85a2a]/20 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-[#FF8C42]" />
                <span className="text-sm font-bold text-gray-600">Total Followers</span>
              </div>
              <div className="text-3xl font-black text-[#FF8C42]">{stats.totalFollowers}</div>
              <div className="text-xs text-green-600 font-bold mt-1">+12% increase</div>
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
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none font-semibold text-gray-700"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-3 rounded-xl font-bold transition-all ${
                    filter === 'all'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({posts.length})
                </button>
                <button
                  onClick={() => setFilter('published')}
                  className={`px-4 py-3 rounded-xl font-bold transition-all ${
                    filter === 'published'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Published ({stats.published})
                </button>
                <button
                  onClick={() => setFilter('scheduled')}
                  className={`px-4 py-3 rounded-xl font-bold transition-all ${
                    filter === 'scheduled'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Scheduled ({stats.scheduled})
                </button>
              </div>
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {filteredPosts.map(post => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-[#d85a2a]/20 hover:shadow-2xl transition-all cursor-pointer shadow-xl"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-4xl shadow-lg flex-shrink-0">
                    {post.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {post.platforms.map((platform, idx) => (
                          <div key={idx} className="p-2 bg-gray-100 rounded-lg">
                            {getPlatformIcon(platform)}
                          </div>
                        ))}
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap ${
                        post.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                    <p className="text-[#FF8C42] mb-3 leading-relaxed font-medium line-clamp-2">{post.content}</p>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-500 font-medium">
                          {post.status === 'Published' ? 'Published' : `Scheduled: ${post.scheduled}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        {post.status === 'Published' && (
                          <>
                            <div className="flex items-center gap-1.5 text-gray-600">
                              <Eye className="w-4 h-4" />
                              <span className="text-sm font-bold text-[#FF8C42]">{post.metrics.reach || '0'}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-600">
                              <ThumbsUp className="w-4 h-4" />
                              <span className="text-sm font-bold text-[#FF8C42]">{post.metrics.likes}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-600">
                              <MessageSquare className="w-4 h-4" />
                              <span className="text-sm font-bold text-[#FF8C42]">{post.metrics.comments}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-600">
                              <Share2 className="w-4 h-4" />
                              <span className="text-sm font-bold text-[#FF8C42]">{post.metrics.shares}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Post Details Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1f2937] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{selectedPost.image}</div>
                  <div>
                    <h3 className="text-xl font-black text-white">Post Details</h3>
                    <p className="text-sm text-white/80 font-semibold">{selectedPost.status}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="w-10 h-10 bg-[#d85a2a]/10 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Content */}
              <div>
                <label className="text-sm font-bold text-[#FF8C42] mb-2 block">Post Content</label>
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{selectedPost.content}</p>
                </div>
              </div>

              {/* Platforms */}
              <div>
                <label className="text-sm font-bold text-[#FF8C42] mb-2 block">Publishing Platforms</label>
                <div className="flex gap-3">
                  {selectedPost.platforms.map((platform, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
                      {getPlatformIcon(platform)}
                      <span className="text-sm font-bold text-gray-700">{platform}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div>
                <label className="text-sm font-bold text-[#FF8C42] mb-2 block">Schedule</label>
                <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#FF8C42]" />
                    <span className="font-bold text-gray-700">{selectedPost.scheduled}</span>
                  </div>
                </div>
              </div>

              {/* Metrics (only for published posts) */}
              {selectedPost.status === 'Published' && (
                <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-200">
                  <h4 className="text-lg font-black text-[#FF8C42] mb-4">Performance Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">Reach</p>
                      <p className="text-2xl font-black text-[#FF8C42]">{selectedPost.metrics.reach}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">Likes</p>
                      <p className="text-2xl font-black text-[#FF8C42]">{selectedPost.metrics.likes}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">Comments</p>
                      <p className="text-2xl font-black text-[#FF8C42]">{selectedPost.metrics.comments}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">Shares</p>
                      <p className="text-2xl font-black text-[#FF8C42]">{selectedPost.metrics.shares}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                  Edit Post
                </button>
                <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all">
                  {selectedPost.status === 'Scheduled' ? 'Cancel' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialPublisher;

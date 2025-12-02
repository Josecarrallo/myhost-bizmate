import React, { useState } from 'react';
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
  MessageSquare
} from 'lucide-react';
import { StatCard } from '../common';

const SocialPublisher = ({ onBack }) => {
  const [posts] = useState([
    {
      id: 1,
      content: "✨ Discover paradise at Villa Sunset! Book now for an unforgettable Bali experience. #BaliVilla #LuxuryTravel",
      platforms: ['Instagram', 'Facebook', 'Twitter'],
      scheduled: "Oct 25, 10:00 AM",
      status: "Scheduled",
      image: "🏖️",
      metrics: { likes: 0, comments: 0, shares: 0 }
    },
    {
      id: 2,
      content: "🏠 Wake up to ocean views at our Beach House. Limited availability for November! #BeachLife #VacationRental",
      platforms: ['Instagram', 'Facebook'],
      scheduled: "Published",
      status: "Published",
      image: "🌊",
      metrics: { likes: 342, comments: 28, shares: 56 }
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-4 pb-24 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-orange-200/30 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <ChevronLeft className="w-6 h-6 text-orange-600" />
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl mb-1">MY HOST</h2>
            <p className="text-2xl md:text-3xl font-bold text-orange-100 drop-shadow-xl">BizMate</p>
          </div>
          <button className="px-6 py-3 bg-white/95 backdrop-blur-sm text-orange-600 rounded-2xl font-bold hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <Plus className="w-5 h-5 inline mr-2" /> New Post
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Share2} label="Scheduled Posts" value="12" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={CheckCircle} label="Published Today" value="5" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={BarChart3} label="Total Engagement" value="8.9K" trend="+18%" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={Users} label="Total Followers" value="24.5K" trend="+12%" gradient="from-orange-500 to-orange-600" />
        </div>

        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/50 hover:border-orange-200 transition-all hover:shadow-2xl shadow-xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-4xl shadow-lg">
                  {post.image}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {post.platforms.map((platform, idx) => (
                        <div key={idx} className="p-2 bg-gray-100 rounded-lg">
                          {platform === 'Instagram' && <Instagram className="w-4 h-4 text-pink-500" />}
                          {platform === 'Facebook' && <Facebook className="w-4 h-4 text-blue-600" />}
                          {platform === 'Twitter' && <Twitter className="w-4 h-4 text-blue-400" />}
                        </div>
                      ))}
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${post.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {post.status}
                    </span>
                  </div>
                  <p className="text-orange-600 mb-3 leading-relaxed font-medium">{post.content}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 font-medium">
                      {post.status === 'Published' ? 'Published' : `Scheduled for ${post.scheduled}`}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm font-bold text-orange-600">{post.metrics.likes}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm font-bold text-orange-600">{post.metrics.comments}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm font-bold text-orange-600">{post.metrics.shares}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialPublisher;

import React, { useState, useEffect } from 'react';
import PageShell from '../Layout/PageShell';
import {
  Star,
  ThumbsUp,
  MessageSquare,
  TrendingUp,
  Send,
  Sparkles,
  X,
  Globe,
  Building2,
  Clock,
  Filter
} from 'lucide-react';
import marketingService from '../../services/marketingService';

/**
 * Reviews Management - Manage reviews from all platforms
 * Connected to Supabase marketing_reviews table
 */
const ReviewsManagement = ({ onBack }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState('all');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await marketingService.getReviews();
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const stats = reviews.length > 0 ? {
    averageRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
    totalReviews: reviews.length,
    positive: reviews.filter(r => r.sentiment === 'positive').length,
    neutral: reviews.filter(r => r.sentiment === 'neutral').length,
    negative: reviews.filter(r => r.sentiment === 'negative').length,
    responseRate: ((reviews.filter(r => r.response_text).length / reviews.length) * 100).toFixed(0)
  } : {
    averageRating: 0,
    totalReviews: 0,
    positive: 0,
    neutral: 0,
    negative: 0,
    responseRate: 0
  };

  const kpis = [
    {
      label: 'Average Rating',
      value: stats.averageRating,
      icon: Star,
      color: 'orange',
      trend: { direction: 'up', value: '+0.2' }
    },
    {
      label: 'Total Reviews',
      value: stats.totalReviews.toString(),
      icon: MessageSquare,
      color: 'blue'
    },
    {
      label: 'Positive',
      value: stats.positive.toString(),
      icon: ThumbsUp,
      color: 'green',
      trend: { direction: 'up', value: '+5' }
    },
    {
      label: 'Response Rate',
      value: `${stats.responseRate}%`,
      icon: TrendingUp,
      color: 'purple',
      trend: { direction: 'up', value: '+3%' }
    }
  ];

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSource = sourceFilter === 'all' || review.source === sourceFilter;
    const matchesSentiment = sentimentFilter === 'all' || review.sentiment === sentimentFilter;
    return matchesSource && matchesSentiment;
  });

  const sourceIcons = {
    airbnb: { emoji: '🏠', color: 'from-pink-500 to-rose-500' },
    booking: { emoji: '🔵', color: 'from-blue-500 to-blue-600' },
    google: { emoji: '🔍', color: 'from-green-500 to-emerald-500' },
    tripadvisor: { emoji: '🦉', color: 'from-emerald-500 to-teal-500' },
    manual: { emoji: '✍️', color: 'from-gray-500 to-gray-600' }
  };

  const sentimentColors = {
    positive: 'bg-green-500/20 text-green-400 border-green-500/30',
    neutral: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    negative: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const generateAIResponse = async (review) => {
    setIsGeneratingAI(true);
    setResponseText('');

    // AI response templates based on sentiment
    const templates = {
      positive: `Dear ${review.guest_name},\n\nThank you so much for your wonderful ${review.rating}-star review! We're thrilled that you enjoyed your stay.\n\nYour positive feedback means the world to us and motivates our team to continue providing excellent service.\n\nWe look forward to welcoming you back soon!\n\nBest regards,\nThe MY HOST Team`,

      neutral: `Dear ${review.guest_name},\n\nThank you for taking the time to share your feedback. We're glad you chose to stay with us.\n\nWe appreciate your honest review and are always looking for ways to improve our guests' experience.\n\nWe hope to have another opportunity to host you in the future.\n\nBest regards,\nThe MY HOST Team`,

      negative: `Dear ${review.guest_name},\n\nWe sincerely apologize for your experience. Your feedback is very important to us.\n\nWe take your concerns seriously and have already taken steps to address the issues you mentioned. This is not the standard we set for ourselves.\n\nWe would appreciate the opportunity to make this right. Please contact us directly so we can discuss how we can improve your experience.\n\nSincerely,\nThe MY HOST Team`
    };

    const template = templates[review.sentiment] || templates.neutral;

    // Typing effect
    for (let i = 0; i <= template.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 15));
      setResponseText(template.substring(0, i));
    }

    setIsGeneratingAI(false);
  };

  const handleSendResponse = async () => {
    if (!selectedReview || !responseText.trim()) return;

    try {
      await marketingService.updateReview(selectedReview.id, {
        response_text: responseText,
        response_date: new Date().toISOString()
      });

      // Reload reviews
      await loadReviews();
      setSelectedReview(null);
      setResponseText('');
    } catch (error) {
      console.error('Error sending response:', error);
      alert('Failed to send response');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 h-screen bg-[#1a1f2e] overflow-auto flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#d85a2a]/30 border-t-[#d85a2a] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl font-bold">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <PageShell
      title="Reviews Management"
      subtitle="Manage reviews from all platforms"
      aiHelperText="Aggregates reviews from Airbnb, Booking.com, Google, TripAdvisor, and more. AI analyzes sentiment, suggests responses, and helps maintain high ratings across all platforms."
      kpis={kpis}
      onBack={onBack}
    >
      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Source Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSourceFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                sourceFilter === 'all'
                  ? 'bg-gradient-to-r from-[#d85a2a] to-[#f5a524] text-white'
                  : 'bg-[#1a1f2e] text-white/70 hover:bg-[#2a2f3a] border border-white/10'
              }`}
            >
              All Sources
            </button>
            {['airbnb', 'booking', 'google', 'tripadvisor'].map(source => {
              const config = sourceIcons[source];
              return (
                <button
                  key={source}
                  onClick={() => setSourceFilter(source)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    sourceFilter === source
                      ? `bg-gradient-to-r ${config.color} text-white`
                      : 'bg-[#1a1f2e] text-white/70 hover:bg-[#2a2f3a] border border-white/10'
                  }`}
                >
                  <span>{config.emoji}</span>
                  {source.charAt(0).toUpperCase() + source.slice(1)}
                </button>
              );
            })}
          </div>

          {/* Sentiment Filter */}
          <div className="flex gap-2 ml-auto">
            {['all', 'positive', 'neutral', 'negative'].map(sentiment => (
              <button
                key={sentiment}
                onClick={() => setSentimentFilter(sentiment)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  sentimentFilter === sentiment
                    ? 'bg-[#d85a2a] text-white'
                    : 'bg-[#1a1f2e] text-white/70 hover:bg-[#2a2f3a] border border-white/10'
                }`}
              >
                {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <div className="bg-[#1a1f2e] rounded-xl border border-white/10 p-12 text-center">
            <Star className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 font-semibold mb-2">No reviews found</p>
            <p className="text-sm text-white/40">Reviews will appear here once guests leave feedback</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map(review => {
              const sourceConfig = sourceIcons[review.source] || sourceIcons.manual;

              return (
                <div
                  key={review.id}
                  className="bg-[#1a1f2e] rounded-xl border border-white/10 p-6 hover:border-[#d85a2a]/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{sourceConfig.emoji}</span>
                        <div>
                          <p className="text-lg font-bold text-white">{review.guest_name}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-white/50">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-white/80 mb-3">{review.review_text}</p>

                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-3 py-1 rounded-full border ${sentimentColors[review.sentiment]}`}>
                          {review.sentiment}
                        </span>
                        <span className="text-xs px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                          {review.source}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {review.response_text ? (
                        <button
                          className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium flex items-center gap-2 border border-green-500/30"
                          onClick={() => {
                            setSelectedReview(review);
                            setResponseText(review.response_text);
                          }}
                        >
                          <MessageSquare className="w-4 h-4" />
                          Responded
                        </button>
                      ) : (
                        <button
                          className="px-4 py-2 bg-[#d85a2a] hover:bg-[#f5a524] text-white rounded-lg text-sm font-medium transition-colors"
                          onClick={() => {
                            setSelectedReview(review);
                            setResponseText('');
                          }}
                        >
                          Respond
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Show response if exists */}
                  {review.response_text && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-[#FF8C42] mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-white/50 mb-1">Your Response:</p>
                          <p className="text-sm text-white/80">{review.response_text}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Response Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#2a2f3a] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl border border-white/10">
            <div className="sticky top-0 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Respond to Review</h3>
                <button
                  onClick={() => {
                    setSelectedReview(null);
                    setResponseText('');
                  }}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Review */}
              <div className="bg-[#1a1f2e] rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-bold text-white">{selectedReview.guest_name}</p>
                  <div className="flex">
                    {[...Array(selectedReview.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-white/80">{selectedReview.review_text}</p>
              </div>

              {/* AI Generate Button */}
              <button
                onClick={() => generateAIResponse(selectedReview)}
                disabled={isGeneratingAI}
                className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {isGeneratingAI ? 'Generating AI Response...' : 'Generate AI Response'}
              </button>

              {/* Response Textarea */}
              <div>
                <label className="text-sm font-medium text-white block mb-2">Your Response</label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={8}
                  className="w-full bg-[#1a1f2e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#d85a2a]/50 resize-none"
                  placeholder="Write your response here..."
                />
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendResponse}
                disabled={!responseText.trim()}
                className="w-full px-4 py-3 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                Send Response
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
};

export default ReviewsManagement;

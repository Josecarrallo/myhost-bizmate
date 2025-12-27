import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Star,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Search,
  X,
  Send,
  TrendingUp,
  Sparkles,
  Mail,
  Settings,
  BarChart3,
  Award,
  Clock,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';

const Reviews = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('reviews'); // reviews, automation, analytics, settings
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [autoResponseEnabled, setAutoResponseEnabled] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const mockReviews = [
    { id: 1, guest: "Sarah Johnson", property: "Villa Sunset", platform: "Airbnb", rating: 5, date: "2025-12-20", comment: "Amazing stay! The villa was spotless and the host was incredibly responsive. Highly recommend!", status: "published", sentiment: "positive", response: "Thank you so much for your wonderful review! We're thrilled you enjoyed your stay.", keywords: ["spotless", "responsive", "recommend"] },
    { id: 2, guest: "Marco Rossi", property: "Beach House", platform: "Booking.com", rating: 4, date: "2025-12-18", comment: "Great location and amenities. Only minor issue was late check-in.", status: "published", sentiment: "positive", response: "Thank you for your feedback! We apologize for the check-in delay and have improved our process.", keywords: ["location", "amenities", "check-in"] },
    { id: 3, guest: "Ana García", property: "Villa Paradise", platform: "Airbnb", rating: 5, date: "2025-12-15", comment: "Perfect for our family vacation. Pool was amazing and the view was breathtaking!", status: "published", sentiment: "positive", response: "We're so happy your family had a wonderful time! Thank you for staying with us.", keywords: ["family", "pool", "view"] },
    { id: 4, guest: "David Chen", property: "Villa Sunset", platform: "Google", rating: 3, date: "2025-12-12", comment: "Good villa but WiFi was slow and AC in one room didn't work well.", status: "needs-response", sentiment: "mixed", response: null, keywords: ["wifi", "ac", "issue"] },
    { id: 5, guest: "Emma Wilson", property: "Beach House", platform: "TripAdvisor", rating: 5, date: "2025-12-10", comment: "Absolutely incredible! Best vacation rental we've ever stayed at. Everything was perfect.", status: "published", sentiment: "positive", response: "Thank you for your amazing review! We'd love to host you again.", keywords: ["incredible", "best", "perfect"] },
    { id: 6, guest: "Luca Bianchi", property: "Villa Paradise", platform: "Booking.com", rating: 4, date: "2025-12-08", comment: "Very nice villa with great amenities. Location is excellent, close to everything.", status: "published", sentiment: "positive", response: "Thanks for your feedback! We're glad you enjoyed the location and amenities.", keywords: ["amenities", "location", "close"] },
    { id: 7, guest: "Sophie Martin", property: "Villa Sunset", platform: "Expedia", rating: 5, date: "2025-12-05", comment: "Stunning villa! The sunset views are absolutely magical. Will definitely return!", status: "published", sentiment: "positive", response: "Thank you! We can't wait to welcome you back for another magical sunset.", keywords: ["stunning", "sunset", "magical"] },
    { id: 8, guest: "James Anderson", property: "Beach House", platform: "Airbnb", rating: 3, date: "2025-12-03", comment: "Decent place but could be cleaner. Pool maintenance needed attention.", status: "needs-response", sentiment: "mixed", response: null, keywords: ["cleaner", "pool", "maintenance"] },
    { id: 9, guest: "Yuki Tanaka", property: "Villa Paradise", platform: "Booking.com", rating: 5, date: "2025-12-01", comment: "Perfect stay! Very clean, beautiful design, and excellent service. Highly recommended.", status: "published", sentiment: "positive", response: "Arigatou gozaimasu! We're delighted you had such a wonderful experience.", keywords: ["clean", "design", "service"] },
    { id: 10, guest: "Isabella Costa", property: "Villa Sunset", platform: "Google", rating: 4, date: "2025-11-28", comment: "Great villa with amazing ocean views. Only complaint is the kitchen could use more equipment.", status: "needs-response", sentiment: "positive", response: null, keywords: ["ocean", "views", "kitchen"] }
  ];

  const stats = {
    overallRating: 4.6,
    totalReviews: 156,
    airbnb: 4.8,
    booking: 4.5,
    google: 4.4,
    tripadvisor: 4.7,
    expedia: 4.6,
    responseRate: "98%",
    avgResponseTime: "2.5 hrs",
    positiveSentiment: 82,
    mixedSentiment: 15,
    negativeSentiment: 3,
    reviewRequestsSent: 45,
    reviewsReceived: 12,
    conversionRate: "26.7%"
  };

  const platforms = [
    { id: 'all', name: 'All Platforms', icon: '🌐', color: 'gray' },
    { id: 'airbnb', name: 'Airbnb', icon: '🏠', color: 'pink' },
    { id: 'booking', name: 'Booking.com', icon: '🔵', color: 'blue' },
    { id: 'google', name: 'Google', icon: '🔍', color: 'green' },
    { id: 'tripadvisor', name: 'TripAdvisor', icon: '🦉', color: 'emerald' },
    { id: 'expedia', name: 'Expedia', icon: '✈️', color: 'yellow' }
  ];

  const properties = [
    { id: 'all', name: 'All Properties' },
    { id: 'Villa Sunset', name: 'Villa Sunset' },
    { id: 'Beach House', name: 'Beach House' },
    { id: 'Villa Paradise', name: 'Villa Paradise' }
  ];

  const ratings = [
    { id: 'all', name: 'All Ratings' },
    { id: '5', name: '5 Stars' },
    { id: '4', name: '4 Stars' },
    { id: '3', name: '3 Stars' }
  ];

  // Top keywords from reviews
  const topKeywords = [
    { word: "clean", count: 45, sentiment: "positive" },
    { word: "location", count: 38, sentiment: "positive" },
    { word: "view", count: 32, sentiment: "positive" },
    { word: "pool", count: 28, sentiment: "positive" },
    { word: "responsive", count: 25, sentiment: "positive" },
    { word: "wifi", count: 12, sentiment: "mixed" },
    { word: "check-in", count: 8, sentiment: "mixed" }
  ];

  // Competitive comparison (demo data)
  const competitorData = [
    { name: "Your Properties", rating: 4.6, reviews: 156, responseRate: 98 },
    { name: "Competitor A", rating: 4.3, reviews: 203, responseRate: 75 },
    { name: "Competitor B", rating: 4.5, reviews: 189, responseRate: 82 },
    { name: "Market Average", rating: 4.2, reviews: 180, responseRate: 70 }
  ];

  // Filter logic
  const filteredReviews = mockReviews.filter(review => {
    const platformMatch = selectedPlatform === 'all' || review.platform.toLowerCase().includes(selectedPlatform);
    const ratingMatch = selectedRating === 'all' || review.rating === parseInt(selectedRating);
    const propertyMatch = selectedProperty === 'all' || review.property === selectedProperty;
    const searchMatch = searchQuery === '' ||
      review.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase());

    return platformMatch && ratingMatch && propertyMatch && searchMatch;
  });

  const handleSendResponse = () => {
    if (responseText.trim() && selectedReview) {
      alert(`Response sent to ${selectedReview.guest}:\n\n${responseText}`);
      setSelectedReview(null);
      setResponseText('');
    }
  };

  const getTemplateResponse = (type) => {
    const templates = {
      positive: `Thank you so much for your wonderful review! We're thrilled that you enjoyed your stay at ${selectedReview?.property}. We look forward to welcoming you back soon!`,
      mixed: `Thank you for your feedback about your stay at ${selectedReview?.property}. We appreciate you bringing this to our attention and we're already working on improvements. We hope to have the opportunity to provide you with an even better experience next time.`,
      negative: `We sincerely apologize for your experience at ${selectedReview?.property}. This is not the standard we set for ourselves. We've taken immediate action to address the issues you mentioned and would love the opportunity to make it right. Please contact us directly so we can discuss how we can improve your experience.`
    };
    setResponseText(templates[type]);
  };

  const generateAIResponse = async () => {
    if (!selectedReview) return;

    setIsGeneratingAI(true);
    setResponseText('');

    // Simulate AI generation with typing effect
    const aiResponses = {
      positive: `Dear ${selectedReview.guest},\n\nThank you so much for taking the time to share your wonderful experience at ${selectedReview.property}! We're absolutely delighted to hear that you enjoyed your stay.\n\nYour kind words about ${selectedReview.keywords?.slice(0, 2).join(' and ')} mean the world to us. We work hard to ensure every guest has a memorable experience, and it's incredibly rewarding to know we succeeded with you.\n\nWe would be honored to welcome you back for your next visit. Please don't hesitate to reach out if you need anything in the future.\n\nWarm regards,\nThe MY HOST Team`,

      mixed: `Dear ${selectedReview.guest},\n\nThank you for sharing your honest feedback about your recent stay at ${selectedReview.property}. We truly appreciate you taking the time to let us know about both the positives and areas for improvement.\n\nWe're glad you enjoyed ${selectedReview.keywords?.filter(k => !['wifi', 'ac', 'issue', 'check-in', 'maintenance'].includes(k))[0] || 'your overall experience'}. Regarding ${selectedReview.keywords?.find(k => ['wifi', 'ac', 'issue', 'check-in', 'maintenance'].includes(k)) || 'the issues you mentioned'}, we've already taken steps to address this and ensure it doesn't happen again.\n\nYour feedback helps us improve our service for all guests. We hope you'll give us another opportunity to provide you with the 5-star experience you deserve.\n\nBest regards,\nThe MY HOST Team`,

      negative: `Dear ${selectedReview.guest},\n\nI want to personally apologize for the experience you had at ${selectedReview.property}. Reading your review, I can understand your frustration, and I'm truly sorry we fell short of the high standards we set for ourselves.\n\nThe issues you mentioned regarding ${selectedReview.keywords?.slice(0, 2).join(' and ')} are unacceptable, and we've immediately taken action to address them. We've also conducted a full review of our processes to prevent similar situations in the future.\n\nI would appreciate the opportunity to speak with you directly to make this right. Please contact me at manager@myhost.com or call +62 xxx-xxxx at your convenience.\n\nAgain, my sincerest apologies. We hope to have the chance to restore your faith in our service.\n\nSincerely,\nJosé Carrallo\nProperty Manager, MY HOST BizMate`
    };

    const responseType = selectedReview.rating >= 4 ? 'positive' : selectedReview.rating === 3 ? 'mixed' : 'negative';
    const fullResponse = aiResponses[responseType];

    // Typing effect
    for (let i = 0; i <= fullResponse.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 10));
      setResponseText(fullResponse.substring(0, i));
    }

    setIsGeneratingAI(false);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  const renderReviewsTab = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-4 border-2 border-[#d85a2a]/20 shadow-lg">
        <div className="grid md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-700 bg-[#2a2f3a] text-white focus:border-[#FF8C42] focus:outline-none font-semibold"
            />
          </div>

          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-gray-700 bg-[#2a2f3a] text-white focus:border-[#FF8C42] focus:outline-none font-bold"
          >
            {ratings.map((rating) => (
              <option key={rating.id} value={rating.id}>{rating.name}</option>
            ))}
          </select>

          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-gray-700 bg-[#2a2f3a] text-white focus:border-[#FF8C42] focus:outline-none font-bold"
          >
            {properties.map((property) => (
              <option key={property.id} value={property.id}>{property.name}</option>
            ))}
          </select>

          {(searchQuery || selectedRating !== 'all' || selectedProperty !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRating('all');
                setSelectedProperty('all');
              }}
              className="px-4 py-3 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Platform Tabs */}
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-4 border-2 border-[#d85a2a]/20 shadow-lg">
        <div className="flex gap-2 overflow-x-auto">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => setSelectedPlatform(platform.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                selectedPlatform === platform.id
                  ? 'bg-gradient-to-r from-[#d85a2a] to-[#FF8C42] text-white shadow-lg'
                  : 'bg-[#2a2f3a] text-gray-300 hover:bg-[#323844]'
              }`}
            >
              <span className="text-xl">{platform.icon}</span>
              {platform.name}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white drop-shadow-lg">
            {filteredReviews.length} Review{filteredReviews.length !== 1 ? 's' : ''}
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Avg response: {stats.avgResponseTime}</span>
          </div>
        </div>

        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-[#d85a2a]/20 hover:shadow-2xl transition-all shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-black text-[#FF8C42]">{review.guest}</h3>
                  <span className="px-3 py-1 bg-[#2a2f3a] rounded-lg text-xs font-bold text-gray-300">
                    {review.platform}
                  </span>
                </div>
                <p className="text-sm text-gray-400 font-semibold">{review.property}</p>
              </div>
              <div className="text-right">
                <div className="flex gap-1 mb-1">{renderStars(review.rating)}</div>
                <p className="text-xs text-gray-500">{review.date}</p>
              </div>
            </div>

            <p className="text-gray-300 mb-4">{review.comment}</p>

            {/* Keywords */}
            {review.keywords && review.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {review.keywords.map((keyword, idx) => (
                  <span key={idx} className="px-2 py-1 bg-[#2a2f3a] text-xs font-semibold text-gray-400 rounded-lg">
                    #{keyword}
                  </span>
                ))}
              </div>
            )}

            {review.response && (
              <div className="mt-4 pt-4 border-t-2 border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-[#FF8C42] rounded-full"></div>
                  <span className="text-sm font-bold text-[#FF8C42]">Your Response</span>
                </div>
                <p className="text-gray-400 text-sm bg-[#2a2f3a] rounded-xl p-3">{review.response}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t-2 border-gray-700 mt-4">
              <span className={`px-4 py-2 rounded-xl font-bold text-sm ${
                review.status === 'published'
                  ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                  : 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30'
              }`}>
                {review.status === 'published' ? '✓ Published' : '⚠ Needs Response'}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedReview(review)}
                  className="px-4 py-2 bg-[#d85a2a] text-white rounded-xl font-bold hover:bg-[#FF8C42] transition-all text-sm flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  {review.response ? 'Edit Reply' : 'Reply'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAutomationTab = () => (
    <div className="space-y-6">
      {/* Auto-Response Settings */}
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-[#d85a2a]/20 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-[#FF8C42]" />
            <h3 className="text-xl font-black text-white">Auto-Response with AI</h3>
          </div>
          <button
            onClick={() => setAutoResponseEnabled(!autoResponseEnabled)}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              autoResponseEnabled
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            {autoResponseEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
        <p className="text-gray-400 mb-4">
          Automatically generate and send AI-powered responses to 5-star reviews within 24 hours.
          All responses are personalized using Claude AI and match your brand voice.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-[#2a2f3a] rounded-xl p-4 border border-gray-700">
            <div className="text-2xl font-black text-green-400 mb-1">98%</div>
            <div className="text-xs text-gray-400">Response Rate</div>
          </div>
          <div className="bg-[#2a2f3a] rounded-xl p-4 border border-gray-700">
            <div className="text-2xl font-black text-blue-400 mb-1">1.2 hrs</div>
            <div className="text-xs text-gray-400">Avg Response Time</div>
          </div>
          <div className="bg-[#2a2f3a] rounded-xl p-4 border border-gray-700">
            <div className="text-2xl font-black text-purple-400 mb-1">156</div>
            <div className="text-xs text-gray-400">AI Responses Sent</div>
          </div>
        </div>
      </div>

      {/* Review Request Campaigns */}
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-[#d85a2a]/20 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-[#FF8C42]" />
            <h3 className="text-xl font-black text-white">Review Request Automation</h3>
          </div>
          <button className="px-4 py-2 bg-[#d85a2a] text-white rounded-xl font-bold hover:bg-[#FF8C42] transition-all">
            Create Campaign
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#2a2f3a] rounded-xl p-4 border border-gray-700">
            <div className="text-2xl font-black text-[#FF8C42] mb-1">{stats.reviewRequestsSent}</div>
            <div className="text-xs text-gray-400">Requests Sent</div>
          </div>
          <div className="bg-[#2a2f3a] rounded-xl p-4 border border-gray-700">
            <div className="text-2xl font-black text-green-400 mb-1">{stats.reviewsReceived}</div>
            <div className="text-xs text-gray-400">Reviews Received</div>
          </div>
          <div className="bg-[#2a2f3a] rounded-xl p-4 border border-gray-700">
            <div className="text-2xl font-black text-blue-400 mb-1">{stats.conversionRate}</div>
            <div className="text-xs text-gray-400">Conversion Rate</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-[#2a2f3a] rounded-xl p-4 border border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <div className="font-bold text-white">Post-Checkout Review Request</div>
                <div className="text-xs text-gray-400">Sent 24 hours after checkout • 28% conversion</div>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-lg text-xs font-bold">Active</span>
          </div>

          <div className="bg-[#2a2f3a] rounded-xl p-4 border border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <div className="font-bold text-white">Follow-up for 5-Star Guests</div>
                <div className="text-xs text-gray-400">Sent 7 days after checkout • 35% conversion</div>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-lg text-xs font-bold">Active</span>
          </div>

          <div className="bg-[#2a2f3a] rounded-xl p-4 border border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AlertCircle className="w-5 h-5 text-gray-500" />
              <div>
                <div className="font-bold text-gray-400">Win-Back Campaign</div>
                <div className="text-xs text-gray-500">For guests who stayed 6+ months ago</div>
              </div>
            </div>
            <span className="px-3 py-1 bg-gray-800 text-gray-500 rounded-lg text-xs font-bold">Paused</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Keyword Analysis */}
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-[#d85a2a]/20 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-[#FF8C42]" />
          <h3 className="text-xl font-black text-white">Top Keywords from Reviews</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {topKeywords.map((keyword, idx) => (
            <div key={idx} className="bg-[#2a2f3a] rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-white">#{keyword.word}</span>
                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                  keyword.sentiment === 'positive'
                    ? 'bg-green-900/30 text-green-400'
                    : 'bg-yellow-900/30 text-yellow-400'
                }`}>
                  {keyword.sentiment}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-[#FF8C42] h-2 rounded-full"
                    style={{ width: `${(keyword.count / 50) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-400">{keyword.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Competitive Analysis */}
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-[#d85a2a]/20 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-6 h-6 text-[#FF8C42]" />
          <h3 className="text-xl font-black text-white">Competitive Analysis</h3>
        </div>
        <div className="space-y-4">
          {competitorData.map((comp, idx) => (
            <div key={idx} className={`rounded-xl p-4 border-2 ${
              idx === 0
                ? 'bg-[#d85a2a]/10 border-[#FF8C42]'
                : 'bg-[#2a2f3a] border-gray-700'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {idx === 0 && <Award className="w-5 h-5 text-[#FF8C42]" />}
                  <span className={`font-bold ${idx === 0 ? 'text-[#FF8C42]' : 'text-white'}`}>
                    {comp.name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-white">{comp.rating}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Total Reviews</div>
                  <div className="text-lg font-bold text-white">{comp.reviews}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Response Rate</div>
                  <div className="text-lg font-bold text-white">{comp.responseRate}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rating Trend (placeholder) */}
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-[#d85a2a]/20 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-[#FF8C42]" />
          <h3 className="text-xl font-black text-white">Rating Trend (Last 6 Months)</h3>
        </div>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-xl">
          <div className="text-center text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Chart visualization coming in Phase 2</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-[#d85a2a]/20 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-[#FF8C42]" />
          <h3 className="text-xl font-black text-white">Review Management Settings</h3>
        </div>

        <div className="space-y-6">
          {/* Response Templates */}
          <div>
            <h4 className="text-lg font-bold text-white mb-3">Response Templates</h4>
            <div className="space-y-2">
              <div className="bg-[#2a2f3a] rounded-xl p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">Positive Review Template</span>
                  <button className="text-[#FF8C42] hover:text-orange-400 text-sm font-semibold">
                    Edit
                  </button>
                </div>
                <p className="text-sm text-gray-400">
                  Thank you so much for your wonderful review! We're thrilled...
                </p>
              </div>
              <div className="bg-[#2a2f3a] rounded-xl p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">Mixed Review Template</span>
                  <button className="text-[#FF8C42] hover:text-orange-400 text-sm font-semibold">
                    Edit
                  </button>
                </div>
                <p className="text-sm text-gray-400">
                  Thank you for your feedback. We appreciate you bringing...
                </p>
              </div>
              <div className="bg-[#2a2f3a] rounded-xl p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">Negative Review Template</span>
                  <button className="text-[#FF8C42] hover:text-orange-400 text-sm font-semibold">
                    Edit
                  </button>
                </div>
                <p className="text-sm text-gray-400">
                  We sincerely apologize for your experience. This is not...
                </p>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h4 className="text-lg font-bold text-white mb-3">Notifications</h4>
            <div className="space-y-2">
              <label className="flex items-center justify-between bg-[#2a2f3a] rounded-xl p-4 border border-gray-700 cursor-pointer">
                <span className="text-white font-semibold">Email me when new review is received</span>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </label>
              <label className="flex items-center justify-between bg-[#2a2f3a] rounded-xl p-4 border border-gray-700 cursor-pointer">
                <span className="text-white font-semibold">Alert for reviews below 4 stars</span>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </label>
              <label className="flex items-center justify-between bg-[#2a2f3a] rounded-xl p-4 border border-gray-700 cursor-pointer">
                <span className="text-white font-semibold">Daily digest of all reviews</span>
                <input type="checkbox" className="w-5 h-5" />
              </label>
            </div>
          </div>

          {/* Platform Connections */}
          <div>
            <h4 className="text-lg font-bold text-white mb-3">Platform Connections</h4>
            <div className="grid md:grid-cols-2 gap-3">
              {platforms.filter(p => p.id !== 'all').map((platform) => (
                <div key={platform.id} className="bg-[#2a2f3a] rounded-xl p-4 border border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{platform.icon}</span>
                    <span className="font-bold text-white">{platform.name}</span>
                  </div>
                  <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-lg text-xs font-bold">
                    Connected
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
            <h2 className="text-4xl md:text-5xl font-black text-[#FF8C42]">Reviews & Reputation</h2>
            <p className="text-sm text-gray-400 mt-1">Manage your online reputation across all platforms</p>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-gradient-to-br from-[#d85a2a] to-[#FF8C42] rounded-2xl p-6 text-white shadow-xl">
              <div className="text-4xl font-black mb-1">{stats.overallRating}</div>
              <div className="text-sm font-semibold opacity-90">Overall Rating</div>
            </div>
            <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#d85a2a]/20 shadow-lg">
              <div className="text-3xl font-black text-[#FF8C42] mb-1">{stats.totalReviews}</div>
              <div className="text-xs font-semibold text-gray-400">Total Reviews</div>
            </div>
            <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#d85a2a]/20 shadow-lg">
              <div className="text-3xl font-black text-pink-500 mb-1">{stats.airbnb}</div>
              <div className="text-xs font-semibold text-gray-400">Airbnb</div>
            </div>
            <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#d85a2a]/20 shadow-lg">
              <div className="text-3xl font-black text-blue-500 mb-1">{stats.booking}</div>
              <div className="text-xs font-semibold text-gray-400">Booking.com</div>
            </div>
            <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#d85a2a]/20 shadow-lg">
              <div className="text-3xl font-black text-emerald-500 mb-1">{stats.tripadvisor}</div>
              <div className="text-xs font-semibold text-gray-400">TripAdvisor</div>
            </div>
            <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#d85a2a]/20 shadow-lg">
              <div className="text-3xl font-black text-green-500 mb-1">{stats.responseRate}</div>
              <div className="text-xs font-semibold text-gray-400">Response Rate</div>
            </div>
          </div>

          {/* Sentiment Analytics */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#d85a2a]/20 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-[#FF8C42]" />
              <h3 className="text-xl font-black text-white">Sentiment Analytics</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-900/20 rounded-xl p-4 border-2 border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <ThumbsUp className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-bold text-green-400">Positive</span>
                </div>
                <div className="text-3xl font-black text-green-400">{stats.positiveSentiment}%</div>
              </div>
              <div className="bg-yellow-900/20 rounded-xl p-4 border-2 border-yellow-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-bold text-yellow-400">Mixed</span>
                </div>
                <div className="text-3xl font-black text-yellow-400">{stats.mixedSentiment}%</div>
              </div>
              <div className="bg-red-900/20 rounded-xl p-4 border-2 border-red-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <ThumbsDown className="w-5 h-5 text-red-400" />
                  <span className="text-sm font-bold text-red-400">Negative</span>
                </div>
                <div className="text-3xl font-black text-red-400">{stats.negativeSentiment}%</div>
              </div>
            </div>
          </div>

          {/* Main Tabs */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-4 border-2 border-[#d85a2a]/20 shadow-lg">
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                  activeTab === 'reviews'
                    ? 'bg-gradient-to-r from-[#d85a2a] to-[#FF8C42] text-white shadow-lg'
                    : 'bg-[#2a2f3a] text-gray-300 hover:bg-[#323844]'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                Reviews
              </button>
              <button
                onClick={() => setActiveTab('automation')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                  activeTab === 'automation'
                    ? 'bg-gradient-to-r from-[#d85a2a] to-[#FF8C42] text-white shadow-lg'
                    : 'bg-[#2a2f3a] text-gray-300 hover:bg-[#323844]'
                }`}
              >
                <Zap className="w-5 h-5" />
                Automation
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'bg-gradient-to-r from-[#d85a2a] to-[#FF8C42] text-white shadow-lg'
                    : 'bg-[#2a2f3a] text-gray-300 hover:bg-[#323844]'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'bg-gradient-to-r from-[#d85a2a] to-[#FF8C42] text-white shadow-lg'
                    : 'bg-[#2a2f3a] text-gray-300 hover:bg-[#323844]'
                }`}
              >
                <Settings className="w-5 h-5" />
                Settings
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'reviews' && renderReviewsTab()}
          {activeTab === 'automation' && renderAutomationTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </div>
      </div>

      {/* Response Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1f2937] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl border-2 border-[#d85a2a]/20">
            <div className="sticky top-0 bg-gradient-to-r from-[#d85a2a] to-[#FF8C42] p-6 rounded-t-3xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-black text-white">Reply to Review</h3>
                <button
                  onClick={() => {
                    setSelectedReview(null);
                    setResponseText('');
                  }}
                  className="w-10 h-10 bg-white/10 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
              <div className="text-white/90">
                <p className="font-semibold">{selectedReview.guest} • {selectedReview.property}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-1">
                    {renderStars(selectedReview.rating)}
                  </div>
                  <span className="text-sm">{selectedReview.date}</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Original Review */}
              <div>
                <label className="text-sm font-bold text-[#FF8C42] mb-2 block">Original Review</label>
                <div className="bg-[#2a2f3a] rounded-xl p-4 border border-gray-700">
                  <p className="text-gray-300">{selectedReview.comment}</p>
                </div>
              </div>

              {/* AI Generation Button */}
              <div>
                <button
                  onClick={generateAIResponse}
                  disabled={isGeneratingAI}
                  className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    isGeneratingAI
                      ? 'bg-purple-900/30 text-purple-400 border-2 border-purple-500/30 cursor-wait'
                      : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-lg'
                  }`}
                >
                  <Sparkles className={`w-5 h-5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                  {isGeneratingAI ? 'Generating AI Response...' : 'Generate AI Response'}
                </button>
              </div>

              {/* Quick Templates */}
              <div>
                <label className="text-sm font-bold text-[#FF8C42] mb-2 block">Quick Templates</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => getTemplateResponse('positive')}
                    className="p-3 bg-green-900/20 border-2 border-green-500/30 rounded-xl hover:bg-green-900/30 transition-all text-center"
                  >
                    <ThumbsUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
                    <span className="text-xs font-bold text-green-400">Positive</span>
                  </button>
                  <button
                    onClick={() => getTemplateResponse('mixed')}
                    className="p-3 bg-yellow-900/20 border-2 border-yellow-500/30 rounded-xl hover:bg-yellow-900/30 transition-all text-center"
                  >
                    <Star className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                    <span className="text-xs font-bold text-yellow-400">Mixed</span>
                  </button>
                  <button
                    onClick={() => getTemplateResponse('negative')}
                    className="p-3 bg-red-900/20 border-2 border-red-500/30 rounded-xl hover:bg-red-900/30 transition-all text-center"
                  >
                    <ThumbsDown className="w-5 h-5 text-red-400 mx-auto mb-1" />
                    <span className="text-xs font-bold text-red-400">Negative</span>
                  </button>
                </div>
              </div>

              {/* Response Textarea */}
              <div>
                <label className="text-sm font-bold text-[#FF8C42] mb-2 block">Your Response</label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Write your response here..."
                  rows="8"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-700 bg-[#2a2f3a] text-white focus:border-[#FF8C42] focus:outline-none font-semibold resize-none"
                ></textarea>
                <p className="text-xs text-gray-500 mt-2">{responseText.length} characters</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSendResponse}
                  disabled={!responseText.trim()}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    responseText.trim()
                      ? 'bg-gradient-to-r from-[#d85a2a] to-[#FF8C42] text-white hover:shadow-lg'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  Send Response
                </button>
                <button
                  onClick={() => {
                    setSelectedReview(null);
                    setResponseText('');
                  }}
                  className="px-6 py-3 bg-gray-700 text-gray-300 rounded-xl font-bold hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;

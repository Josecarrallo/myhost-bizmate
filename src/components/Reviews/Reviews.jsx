import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, ThumbsUp, ThumbsDown, Filter, Search, X, Send, TrendingUp } from 'lucide-react';

const ReviewsReputation = ({ onBack }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const mockReviews = [
    { id: 1, guest: "Sarah Johnson", property: "Villa Sunset", platform: "Airbnb", rating: 5, date: "2025-11-05", comment: "Amazing stay! The villa was spotless and the host was incredibly responsive. Highly recommend!", status: "published", sentiment: "positive", response: "Thank you so much for your wonderful review! We're thrilled you enjoyed your stay." },
    { id: 2, guest: "Marco Rossi", property: "Beach House", platform: "Booking.com", rating: 4, date: "2025-11-04", comment: "Great location and amenities. Only minor issue was late check-in.", status: "published", sentiment: "positive", response: "Thank you for your feedback! We apologize for the check-in delay and have improved our process." },
    { id: 3, guest: "Ana García", property: "Villa Paradise", platform: "Airbnb", rating: 5, date: "2025-11-03", comment: "Perfect for our family vacation. Pool was amazing and the view was breathtaking!", status: "published", sentiment: "positive", response: "We're so happy your family had a wonderful time! Thank you for staying with us." },
    { id: 4, guest: "David Chen", property: "Villa Sunset", platform: "Google", rating: 3, date: "2025-11-02", comment: "Good villa but WiFi was slow and AC in one room didn't work well.", status: "needs-response", sentiment: "mixed", response: null },
    { id: 5, guest: "Emma Wilson", property: "Beach House", platform: "Airbnb", rating: 5, date: "2025-11-01", comment: "Absolutely incredible! Best vacation rental we've ever stayed at. Everything was perfect.", status: "published", sentiment: "positive", response: "Thank you for your amazing review! We'd love to host you again." },
    { id: 6, guest: "Luca Bianchi", property: "Villa Paradise", platform: "Booking.com", rating: 4, date: "2025-10-30", comment: "Very nice villa with great amenities. Location is excellent, close to everything.", status: "published", sentiment: "positive", response: "Thanks for your feedback! We're glad you enjoyed the location and amenities." },
    { id: 7, guest: "Sophie Martin", property: "Villa Sunset", platform: "Google", rating: 5, date: "2025-10-28", comment: "Stunning villa! The sunset views are absolutely magical. Will definitely return!", status: "published", sentiment: "positive", response: "Thank you! We can't wait to welcome you back for another magical sunset." },
    { id: 8, guest: "James Anderson", property: "Beach House", platform: "Airbnb", rating: 3, date: "2025-10-26", comment: "Decent place but could be cleaner. Pool maintenance needed attention.", status: "needs-response", sentiment: "mixed", response: null },
    { id: 9, guest: "Yuki Tanaka", property: "Villa Paradise", platform: "Booking.com", rating: 5, date: "2025-10-24", comment: "Perfect stay! Very clean, beautiful design, and excellent service. Highly recommended.", status: "published", sentiment: "positive", response: "Arigatou gozaimasu! We're delighted you had such a wonderful experience." },
    { id: 10, guest: "Isabella Costa", property: "Villa Sunset", platform: "Google", rating: 4, date: "2025-10-22", comment: "Great villa with amazing ocean views. Only complaint is the kitchen could use more equipment.", status: "needs-response", sentiment: "positive", response: null }
  ];

  const stats = {
    overallRating: 4.6,
    totalReviews: 156,
    airbnb: 4.8,
    booking: 4.5,
    google: 4.4,
    responseRate: "98%",
    avgResponseTime: "2.5 hrs",
    positiveSentiment: 82,
    mixedSentiment: 15,
    negativeSentiment: 3
  };

  const platforms = [
    { id: 'all', name: 'All Platforms', icon: '🌐' },
    { id: 'airbnb', name: 'Airbnb', icon: '🏠' },
    { id: 'booking', name: 'Booking.com', icon: '🔵' },
    { id: 'google', name: 'Google', icon: '🔍' }
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

  // Filter logic
  const filteredReviews = mockReviews.filter(review => {
    const platformMatch = selectedPlatform === 'all' || review.platform.toLowerCase() === selectedPlatform;
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

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className="min-h-screen bg-[#2a2f3a] flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-[#d85a2a]/5 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="bg-[#1f2937]/95 backdrop-blur-sm border-b-2 border-[#d85a2a]/20 p-4 relative z-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-[#FF8C42] hover:text-orange-500 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-[#FF8C42]">Reviews</h2>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="text-4xl font-black mb-1">{stats.overallRating}</div>
              <div className="text-sm font-semibold opacity-90">Overall Rating</div>
            </div>
            <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#d85a2a]/20 shadow-lg">
              <div className="text-3xl font-black text-[#FF8C42] mb-1">{stats.totalReviews}</div>
              <div className="text-xs font-semibold text-gray-600">Total Reviews</div>
            </div>
            <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#d85a2a]/20 shadow-lg">
              <div className="text-3xl font-black text-pink-600 mb-1">{stats.airbnb}</div>
              <div className="text-xs font-semibold text-gray-600">Airbnb Rating</div>
            </div>
            <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#d85a2a]/20 shadow-lg">
              <div className="text-3xl font-black text-blue-600 mb-1">{stats.booking}</div>
              <div className="text-xs font-semibold text-gray-600">Booking.com</div>
            </div>
            <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#d85a2a]/20 shadow-lg">
              <div className="text-3xl font-black text-green-600 mb-1">{stats.responseRate}</div>
              <div className="text-xs font-semibold text-gray-600">Response Rate</div>
            </div>
          </div>

          {/* Sentiment Analytics */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#d85a2a]/20 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-[#FF8C42]" />
              <h3 className="text-xl font-black text-[#FF8C42]">Sentiment Analytics</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <ThumbsUp className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-bold text-green-900">Positive</span>
                </div>
                <div className="text-3xl font-black text-green-600">{stats.positiveSentiment}%</div>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-bold text-yellow-900">Mixed</span>
                </div>
                <div className="text-3xl font-black text-yellow-600">{stats.mixedSentiment}%</div>
              </div>
              <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <ThumbsDown className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-bold text-red-900">Negative</span>
                </div>
                <div className="text-3xl font-black text-red-600">{stats.negativeSentiment}%</div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-4 border-2 border-[#d85a2a]/20 shadow-lg">
            <div className="grid md:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none font-semibold text-gray-700"
                />
              </div>

              {/* Rating Filter */}
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none font-bold text-gray-700 bg-white"
              >
                {ratings.map((rating) => (
                  <option key={rating.id} value={rating.id}>{rating.name}</option>
                ))}
              </select>

              {/* Property Filter */}
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none font-bold text-gray-700 bg-white"
              >
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>{property.name}</option>
                ))}
              </select>

              {/* Clear Filters */}
              {(searchQuery || selectedRating !== 'all' || selectedProperty !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRating('all');
                    setSelectedProperty('all');
                  }}
                  className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-4 border-2 border-[#d85a2a]/20 shadow-lg">
            <div className="flex gap-2 overflow-x-auto">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                    selectedPlatform === platform.id
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-xl">{platform.icon}</span>
                  {platform.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white drop-shadow-lg">Recent Reviews</h2>

            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-[#d85a2a]/20 hover:shadow-2xl transition-all shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-black text-[#FF8C42]">{review.guest}</h3>
                      <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-700">
                        {review.platform}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-semibold">{review.property}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-1 mb-1">{renderStars(review.rating)}</div>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{review.comment}</p>

                {/* Response if published */}
                {review.response && (
                  <div className="mt-4 pt-4 border-t-2 border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      <span className="text-sm font-bold text-[#FF8C42]">Your Response</span>
                    </div>
                    <p className="text-gray-600 text-sm bg-orange-50 rounded-xl p-3">{review.response}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100 mt-4">
                  <span className={`px-4 py-2 rounded-xl font-bold text-sm ${
                    review.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {review.status === 'published' ? '✓ Published' : '⚠ Needs Response'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedReview(review)}
                      className="px-4 py-2 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all text-sm"
                    >
                      {review.response ? 'Edit Reply' : 'Reply'}
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all text-sm">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-[#d85a2a]/20 shadow-xl">
            <h3 className="text-xl font-black text-[#FF8C42] mb-4">Quick Response Templates</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <button className="p-4 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 transition-all text-left">
                <div className="flex items-center gap-2 mb-2">
                  <ThumbsUp className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-900">Positive Review</span>
                </div>
                <p className="text-xs text-gray-600">Thank you for your wonderful feedback...</p>
              </button>
              <button className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl hover:bg-yellow-100 transition-all text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <span className="font-bold text-yellow-900">Mixed Review</span>
                </div>
                <p className="text-xs text-gray-600">We appreciate your feedback and...</p>
              </button>
              <button className="p-4 bg-red-50 border-2 border-red-200 rounded-xl hover:bg-red-100 transition-all text-left">
                <div className="flex items-center gap-2 mb-2">
                  <ThumbsDown className="w-5 h-5 text-red-600" />
                  <span className="font-bold text-red-900">Negative Review</span>
                </div>
                <p className="text-xs text-gray-600">We sincerely apologize for your experience...</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Response Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1f2937] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-black text-white">Reply to Review</h3>
                <button
                  onClick={() => {
                    setSelectedReview(null);
                    setResponseText('');
                  }}
                  className="w-10 h-10 bg-[#d85a2a]/10 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
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
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700">{selectedReview.comment}</p>
                </div>
              </div>

              {/* Quick Templates */}
              <div>
                <label className="text-sm font-bold text-[#FF8C42] mb-2 block">Quick Templates</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => getTemplateResponse('positive')}
                    className="p-3 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 transition-all text-center"
                  >
                    <ThumbsUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <span className="text-xs font-bold text-green-900">Positive</span>
                  </button>
                  <button
                    onClick={() => getTemplateResponse('mixed')}
                    className="p-3 bg-yellow-50 border-2 border-yellow-200 rounded-xl hover:bg-yellow-100 transition-all text-center"
                  >
                    <Star className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                    <span className="text-xs font-bold text-yellow-900">Mixed</span>
                  </button>
                  <button
                    onClick={() => getTemplateResponse('negative')}
                    className="p-3 bg-red-50 border-2 border-red-200 rounded-xl hover:bg-red-100 transition-all text-center"
                  >
                    <ThumbsDown className="w-5 h-5 text-red-600 mx-auto mb-1" />
                    <span className="text-xs font-bold text-red-900">Negative</span>
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
                  rows="6"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none font-semibold text-gray-700 resize-none"
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
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
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
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
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

export default ReviewsReputation;

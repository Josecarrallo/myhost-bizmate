import React, { useState } from 'react';
import { ChevronLeft, Star, ThumbsUp, ThumbsDown } from 'lucide-react';

const ReviewsReputation = ({ onBack }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const mockReviews = [
    { id: 1, guest: "Sarah Johnson", property: "Villa Sunset", platform: "Airbnb", rating: 5, date: "2025-11-05", comment: "Amazing stay! The villa was spotless and the host was incredibly responsive. Highly recommend!", status: "published" },
    { id: 2, guest: "Marco Rossi", property: "Beach House", platform: "Booking.com", rating: 4, date: "2025-11-04", comment: "Great location and amenities. Only minor issue was late check-in.", status: "published" },
    { id: 3, guest: "Ana García", property: "Villa Paradise", platform: "Airbnb", rating: 5, date: "2025-11-03", comment: "Perfect for our family vacation. Pool was amazing and the view was breathtaking!", status: "published" },
    { id: 4, guest: "David Chen", property: "Villa Sunset", platform: "Google", rating: 3, date: "2025-11-02", comment: "Good villa but WiFi was slow and AC in one room didn't work well.", status: "needs-response" }
  ];

  const stats = {
    overallRating: 4.6,
    totalReviews: 156,
    airbnb: 4.8,
    booking: 4.5,
    google: 4.4,
    responseRate: "98%",
    avgResponseTime: "2.5 hrs"
  };

  const platforms = [
    { id: 'all', name: 'All Platforms', icon: '🌐' },
    { id: 'airbnb', name: 'Airbnb', icon: '🏠' },
    { id: 'booking', name: 'Booking.com', icon: '🔵' },
    { id: 'google', name: 'Google', icon: '🔍' }
  ];

  const filteredReviews = selectedPlatform === 'all'
    ? mockReviews
    : mockReviews.filter(r => r.platform.toLowerCase() === selectedPlatform);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-orange-200/30 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="bg-white/95 backdrop-blur-sm border-b-2 border-white/50 p-4 relative z-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-orange-600 hover:text-orange-500 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white drop-shadow-2xl mb-1">MY HOST</h2>
            <p className="text-xl md:text-2xl font-bold text-orange-100 drop-shadow-xl">BizMate</p>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="text-4xl font-black mb-1">{stats.overallRating}</div>
              <div className="text-sm font-semibold opacity-90">Overall Rating</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/50 shadow-lg">
              <div className="text-3xl font-black text-orange-600 mb-1">{stats.totalReviews}</div>
              <div className="text-xs font-semibold text-gray-600">Total Reviews</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/50 shadow-lg">
              <div className="text-3xl font-black text-pink-600 mb-1">{stats.airbnb}</div>
              <div className="text-xs font-semibold text-gray-600">Airbnb Rating</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/50 shadow-lg">
              <div className="text-3xl font-black text-blue-600 mb-1">{stats.booking}</div>
              <div className="text-xs font-semibold text-gray-600">Booking.com</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/50 shadow-lg">
              <div className="text-3xl font-black text-green-600 mb-1">{stats.responseRate}</div>
              <div className="text-xs font-semibold text-gray-600">Response Rate</div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/50 shadow-lg">
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
              <div key={review.id} className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/50 hover:shadow-2xl transition-all shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-black text-orange-600">{review.guest}</h3>
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

                <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                  <span className={`px-4 py-2 rounded-xl font-bold text-sm ${
                    review.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {review.status === 'published' ? '✓ Published' : '⚠ Needs Response'}
                  </span>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all text-sm">
                      Reply
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all text-sm">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/50 shadow-xl">
            <h3 className="text-xl font-black text-orange-600 mb-4">Quick Response Templates</h3>
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
    </div>
  );
};

export default ReviewsReputation;

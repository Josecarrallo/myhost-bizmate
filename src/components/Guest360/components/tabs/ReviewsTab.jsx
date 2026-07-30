import React from 'react';
import {
  Star,
  MessageSquare,
  Calendar,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { EmptyState } from '../shared';
import { formatDate } from '../../constants';

/**
 * ReviewsTab - Reviews del huésped
 */
const ReviewsTab = ({ reviews = [], bookings = [] }) => {
  if (reviews.length === 0) {
    return (
      <div className="bg-[#333b47] rounded-2xl border border-white/10 p-5">
        <EmptyState
          icon={Star}
          title="No Reviews"
          description="This guest hasn't left any reviews yet"
        />
      </div>
    );
  }

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
    : 0;

  // Get booking info helper
  const getBookingInfo = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return null;
    return {
      villaName: booking.villas?.name || 'Villa',
      checkIn: booking.check_in,
    };
  };

  // Render stars
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-[#f2b04a] fill-[#f2b04a]'
                : 'text-[#3a434f]'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-[#333b47] rounded-2xl border border-white/10 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[#8a93a1] uppercase tracking-wider mb-1">Average Rating</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-white">{avgRating.toFixed(1)}</span>
              {renderStars(Math.round(avgRating))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#8a93a1] uppercase tracking-wider mb-1">Total Reviews</p>
            <span className="text-3xl font-bold text-[#f5791f]">{reviews.length}</span>
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="bg-[#333b47] rounded-2xl border border-white/10 overflow-hidden">
        <div className="px-5 py-3 border-b border-white/10">
          <h3 className="text-sm font-semibold text-white">
            All Reviews
          </h3>
        </div>

        <div className="divide-y divide-white/5">
          {reviews.map((review) => {
            const bookingInfo = getBookingInfo(review.booking_id);

            return (
              <div key={review.id} className="px-5 py-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    {renderStars(review.rating)}
                    <div className="flex items-center gap-2 mt-1 text-xs text-[#6d7683]">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(review.created_at)}</span>
                      {bookingInfo && (
                        <>
                          <span>·</span>
                          <span className="text-[#f5791f]">{bookingInfo.villaName}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Sentiment indicator */}
                  {review.rating >= 4 ? (
                    <div className="flex items-center gap-1 text-green-400">
                      <ThumbsUp className="w-4 h-4" />
                    </div>
                  ) : review.rating <= 2 ? (
                    <div className="flex items-center gap-1 text-red-400">
                      <ThumbsDown className="w-4 h-4" />
                    </div>
                  ) : null}
                </div>

                {/* Review content */}
                {review.comment && (
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-[#6d7683] flex-shrink-0 mt-0.5" />
                    <p className="text-[#aab2bf] text-sm whitespace-pre-wrap">
                      {review.comment}
                    </p>
                  </div>
                )}

                {/* Categories if available */}
                {review.categories && Object.keys(review.categories).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.entries(review.categories).map(([key, value]) => (
                      <span
                        key={key}
                        className="text-xs px-2 py-1 bg-[#3a434f] text-[#aab2bf] rounded-lg"
                      >
                        {key}: {value}/5
                      </span>
                    ))}
                  </div>
                )}

                {/* Owner response if any */}
                {review.response && (
                  <div className="mt-3 p-3 bg-[#2c333e] rounded-lg border-l-2 border-[#f5791f]">
                    <p className="text-xs text-[#f5791f] font-medium mb-1">Owner Response</p>
                    <p className="text-[#aab2bf] text-sm">{review.response}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReviewsTab;

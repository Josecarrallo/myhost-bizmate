import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const TimelineView = ({
  currentDate,
  setCurrentDate,
  selectedProperty,
  selectedStatus,
  selectedChannel,
  appliedStartDate,
  appliedEndDate,
  properties,
  user
}) => {
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Data
  const [villas, setVillas] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data when filters or month changes
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, currentDate, selectedProperty, selectedStatus, selectedChannel, appliedStartDate, appliedEndDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Use properties as "villas" since units table doesn't exist
      setVillas(properties.map(p => ({
        id: p.id,
        name: p.name,
        property_id: p.id,
        properties: { name: p.name }
      })));

      // Get first and last day of current month
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      // Helper function to format date as YYYY-MM-DD without timezone issues
      const formatDateLocal = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      };

      // Use applied dates if available, otherwise use current month range
      const startRange = appliedStartDate || formatDateLocal(firstDay);
      const endRange = appliedEndDate || formatDateLocal(lastDay);

      // Build bookings query
      let bookingsQuery = supabase
        .from('bookings')
        .select('*')
        .lte('check_in', endRange)
        .gte('check_out', startRange);

      if (selectedProperty !== 'all') {
        bookingsQuery = bookingsQuery.eq('property_id', selectedProperty);
      }

      if (selectedStatus !== 'all') {
        console.log('🔍 [TIMELINE] Filtering by status:', selectedStatus);
        bookingsQuery = bookingsQuery.ilike('status', selectedStatus);
      }

      if (selectedChannel !== 'all') {
        console.log('🔍 [TIMELINE] Filtering by source:', selectedChannel);
        // Handle Airbnb with space: "Air BnB" or "airbnb"
        if (selectedChannel === 'airbnb') {
          bookingsQuery = bookingsQuery.or('source.ilike.airbnb,source.ilike.Air BnB,source.ilike.air bnb');
        } else {
          bookingsQuery = bookingsQuery.ilike('source', selectedChannel);
        }
      }

      console.log('📍 [TIMELINE] Fetching bookings...', { startRange, endRange });
      const { data: bookingsData, error: bookingsError } = await bookingsQuery.order('check_in');

      if (bookingsError) throw bookingsError;
      console.log('✅ [TIMELINE] Bookings loaded:', bookingsData?.length || 0);
      setBookings(bookingsData || []);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get months to display based on applied date range
  const getMonthsToDisplay = () => {
    if (!appliedStartDate || !appliedEndDate) {
      // No date filter applied, show current month only
      return [currentDate];
    }

    // Calculate months between start and end date
    const [startYear, startMonth] = appliedStartDate.split('-').map(Number);
    const [endYear, endMonth] = appliedEndDate.split('-').map(Number);

    const startDate = new Date(startYear, startMonth - 1, 1);
    const endDate = new Date(endYear, endMonth - 1, 1);

    const months = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }

    return months;
  };

  // Generate days for a specific month
  const getDaysInMonth = (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  // Navigation (uses parent's setCurrentDate)
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get channel color (using source field)
  const getChannelColor = (source) => {
    const src = (source || '').toLowerCase().trim();
    if (src === 'airbnb' || src === 'air bnb') {
      return 'bg-[#d85a2a] border-[#d85a2a]';
    } else if (src === 'booking.com') {
      return 'bg-[#f5a524] border-[#f5a524]';
    } else if (src === 'gita') {
      return 'bg-white border-white text-gray-800';
    } else if (src === 'agoda') {
      return 'bg-[#d85a2a]/80 border-[#d85a2a]/80';
    } else {
      return 'bg-gray-400 border-gray-400';
    }
  };

  // Helper to parse date string without timezone issues
  const parseDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Calculate booking position and width for a specific month
  const getBookingStyle = (booking, monthDate, daysInMonth) => {
    const checkIn = parseDate(booking.check_in);
    const checkOut = parseDate(booking.check_out);
    const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

    // Clamp dates to current month view
    const startDate = checkIn < monthStart ? monthStart : checkIn;
    const endDate = checkOut > monthEnd ? monthEnd : checkOut;

    // Calculate position (which day column to start)
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();

    // Calculate width (number of days INCLUSIVE from check-in to check-out)
    // For booking 4 July - 9 July, we want days 4,5,6,7,8,9 = 6 days
    const daysToShow = (endDay - startDay) + 1;

    return {
      left: `${((startDay - 1) / daysInMonth) * 100}%`,
      width: `${(daysToShow / daysInMonth) * 100}%`,
      minWidth: '40px'
    };
  };

  // Get bookings for a specific villa and month
  const getVillaBookings = (villa, monthDate) => {
    const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

    return bookings.filter(b => {
      if (b.property_id !== villa.property_id) return false;

      const checkIn = parseDate(b.check_in);
      const checkOut = parseDate(b.check_out);

      // Include booking if it overlaps with this month
      return checkIn <= monthEnd && checkOut >= monthStart;
    });
  };

  // Format date range
  const formatDateRange = (checkIn, checkOut) => {
    const start = parseDate(checkIn);
    const end = parseDate(checkOut);
    return `${start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
  };

  // Calculate nights
  const calculateNights = (checkIn, checkOut) => {
    const start = parseDate(checkIn);
    const end = parseDate(checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#2a2f3a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d85a2a] mx-auto mb-4"></div>
          <p className="text-white">Loading timeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#2a2f3a] overflow-hidden">
      {/* Header with navigation - Only show when NO date filter is applied */}
      {!appliedStartDate && !appliedEndDate && (
        <div className="bg-[#1f2937]/30 border-b border-white/10 px-6 py-3 flex items-center justify-between">
          <button onClick={goToPreviousMonth} className="p-2 hover:bg-white/10 rounded-lg">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={goToToday}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
            >
              Today
            </button>
          </div>

          <button onClick={goToNextMonth} className="p-2 hover:bg-white/10 rounded-lg">
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

      {/* Timeline Grid - Multiple months when date filter applied */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-6">
          {getMonthsToDisplay().map((monthDate, monthIdx) => {
            const days = getDaysInMonth(monthDate);
            const monthName = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

            return (
              <div key={monthIdx} className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                {/* Month header */}
                <div className="bg-[#1f2937] border-b border-white/10 px-6 py-3 text-center">
                  <h3 className="text-white font-bold text-lg">{monthName}</h3>
                </div>

                <div className="min-w-max">
                  {/* Days Header */}
                  <div className="sticky top-0 z-10 bg-[#1f2937] flex">
                    {/* Villa column header */}
                    <div className="w-48 flex-shrink-0 border-r border-gray-600 p-3">
                      <div className="text-white font-semibold text-sm">Property / Villa</div>
                    </div>

                    {/* Day columns */}
                    <div className="flex-1 flex">
                      {days.map((day, idx) => {
                        const showToday = isToday(day) && !appliedStartDate && !appliedEndDate;
                        return (
                          <div
                            key={idx}
                            className={`flex-1 min-w-[40px] border-r border-gray-600 p-2 text-center ${
                              showToday ? 'bg-[#d85a2a]/20' : ''
                            }`}
                          >
                            <div className="text-white text-xs font-semibold">
                              {day.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div className={`text-white text-sm ${showToday ? 'font-bold' : ''}`}>
                              {day.getDate()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Villas Rows */}
                  {villas.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      No villas found. Make sure you have properties configured.
                    </div>
                  ) : (
                    villas.map((villa, villaIdx) => {
                      const villaBookings = getVillaBookings(villa, monthDate);

              return (
                <div key={villa.id} className="flex border-b border-gray-700 hover:bg-gray-800/30 transition-colors">
                  {/* Villa name */}
                  <div className="w-48 flex-shrink-0 border-r border-gray-600 p-3 flex items-center overflow-hidden">
                    <div className="w-full overflow-hidden">
                      <div className="text-white font-semibold text-xs truncate max-w-full uppercase">
                        {villa.name}
                      </div>
                      {villa.properties && villa.properties.name !== villa.name && (
                        <div className="text-gray-400 text-[10px] truncate max-w-full">
                          {villa.properties.name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex-1 relative h-20 p-2">
                    {/* Day grid lines */}
                    <div className="absolute inset-0 flex">
                      {days.map((day, idx) => (
                        <div
                          key={idx}
                          className={`flex-1 min-w-[40px] border-r border-gray-700/50 ${
                            isToday(day) ? 'bg-[#d85a2a]/10' : ''
                          }`}
                        />
                      ))}
                    </div>

                    {/* Bookings */}
                    {villaBookings.map((booking, bookingIdx) => {
                      const style = getBookingStyle(booking, monthDate, days.length);
                      const channelColor = getChannelColor(booking.source);

                      return (
                        <div
                          key={booking.id}
                          className={`absolute top-2 h-16 ${channelColor} rounded-lg border-2 cursor-pointer hover:shadow-lg hover:scale-105 transition-all z-20 overflow-hidden`}
                          style={style}
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <div className="p-2 h-full flex flex-col justify-center">
                            <div className={`text-xs font-bold truncate ${(booking.source || '').toLowerCase().trim() === 'gita' ? 'text-gray-800' : 'text-white'}`}>
                              {booking.guest_name}
                            </div>
                            <div className={`text-[10px] uppercase truncate opacity-90 ${(booking.source || '').toLowerCase().trim() === 'gita' ? 'text-gray-700' : 'text-white'}`}>
                              {booking.source || 'N/A'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1f2937] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Booking Details</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all"
              >
                <X className="text-white" size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Guest Info */}
              <div>
                <h4 className="text-white font-semibold mb-2">Guest Information</h4>
                <div className="bg-[#2a2f3a] p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white font-medium">{selectedBooking.guest_name}</span>
                  </div>
                  {selectedBooking.guest_email && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white">{selectedBooking.guest_email}</span>
                    </div>
                  )}
                  {selectedBooking.guest_phone && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Phone:</span>
                      <span className="text-white">{selectedBooking.guest_phone}</span>
                    </div>
                  )}
                  {selectedBooking.guests && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Guests:</span>
                      <span className="text-white">{selectedBooking.guests}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Info */}
              <div>
                <h4 className="text-white font-semibold mb-2">Booking Information</h4>
                <div className="bg-[#2a2f3a] p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Dates:</span>
                    <span className="text-white font-medium">
                      {formatDateRange(selectedBooking.check_in, selectedBooking.check_out)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Nights:</span>
                    <span className="text-white">
                      {calculateNights(selectedBooking.check_in, selectedBooking.check_out)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Channel:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getChannelColor(selectedBooking.source)}`}>
                      {selectedBooking.source || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-white capitalize">{selectedBooking.status}</span>
                  </div>
                  {selectedBooking.total_amount && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total:</span>
                      <span className="text-white font-bold">${selectedBooking.total_amount}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div>
                  <h4 className="text-white font-semibold mb-2">Notes</h4>
                  <div className="bg-[#2a2f3a] p-4 rounded-lg">
                    <p className="text-gray-300 text-sm">{selectedBooking.notes}</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full py-3 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineView;

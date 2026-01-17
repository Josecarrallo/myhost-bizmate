import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Calendar,
  Users,
  DollarSign,
  Plus,
  X,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { dataService } from '../../services/data';

const PMSCalendar = ({ onBack }) => {
  const [view, setView] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date()); // Current month
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [properties, setProperties] = useState([]);
  const [calendarBookings, setCalendarBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load real data from Supabase
  useEffect(() => {
    loadCalendarData();
  }, []);

  const loadCalendarData = async () => {
    try {
      setLoading(true);

      // Load properties and bookings in parallel
      const [propertiesData, bookingsData] = await Promise.all([
        dataService.getProperties(),
        dataService.getBookings()
      ]);

      console.log('[PMSCalendar] Loaded properties:', propertiesData?.length || 0);
      console.log('[PMSCalendar] Loaded bookings:', bookingsData?.length || 0);

      // Map properties to calendar format
      if (propertiesData && propertiesData.length > 0) {
        const mappedProperties = propertiesData.map((prop, index) => ({
          id: prop.id,
          name: prop.name,
          color: getPropertyColor(index) // Assign colors cyclically
        }));
        setProperties(mappedProperties);
      }

      // Map bookings to calendar format
      if (bookingsData && bookingsData.length > 0) {
        const mappedBookings = bookingsData.map(booking => ({
          id: booking.id,
          guestName: booking.guest_name,
          email: booking.guest_email || 'N/A',
          phone: booking.guest_phone || 'N/A',
          propertyId: booking.property_id,
          checkIn: booking.check_in,
          checkOut: booking.check_out,
          guests: booking.guests || 0,
          revenue: parseFloat(booking.total_price) || 0,
          status: booking.status ? booking.status.toLowerCase() : 'pending'
        }));
        setCalendarBookings(mappedBookings);
      }
    } catch (error) {
      console.error('[PMSCalendar] Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPropertyColor = (index) => {
    const colors = [
      "from-purple-500 to-pink-600",
      "from-blue-500 to-cyan-600",
      "from-green-500 to-emerald-600",
      "from-orange-500 to-red-600",
      "from-indigo-500 to-purple-600",
      "from-yellow-500 to-orange-600",
      "from-teal-500 to-green-600",
      "from-red-500 to-pink-600"
    ];
    return colors[index % colors.length];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500 hover:bg-green-600';
      case 'in-progress':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'cancelled':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-600 border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const getDaysInMonth = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const getWeekDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const currentWeek = Math.ceil(firstDay.getDate() / 7);
    const weekStart = (currentWeek - 1) * 7 + 1;
    return Array.from({ length: 7 }, (_, i) => weekStart + i).filter(day => day <= new Date(year, month + 1, 0).getDate());
  };

  const isDateInBooking = (day, booking) => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    // Create date at midnight for comparison
    const currentDate = new Date(year, month, day);
    const checkIn = new Date(booking.checkIn + 'T00:00:00');
    const checkOut = new Date(booking.checkOut + 'T00:00:00');

    // Check if current date is within the booking range (inclusive of check-in, exclusive of check-out)
    return currentDate.getTime() >= checkIn.getTime() && currentDate.getTime() < checkOut.getTime();
  };

  const getBookingForPropertyOnDay = (propertyId, day) => {
    return calendarBookings.find(booking =>
      booking.propertyId === propertyId && isDateInBooking(day, booking)
    );
  };

  const getBookingStartDay = (booking) => {
    const checkIn = new Date(booking.checkIn + 'T00:00:00');
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    if (checkIn.getFullYear() === year && checkIn.getMonth() === month) {
      return checkIn.getDate();
    }
    return 1;
  };

  const getBookingDuration = (booking) => {
    const checkIn = new Date(booking.checkIn + 'T00:00:00');
    const checkOut = new Date(booking.checkOut + 'T00:00:00');
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    let start = checkIn < monthStart ? monthStart : checkIn;
    let end = checkOut > monthEnd ? monthEnd : checkOut;

    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const getPropertyName = (propertyId) => {
    return properties.find(p => p.id === propertyId)?.name || "Unknown Property";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2a2f3a] p-4 pb-24 relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mb-4"></div>
          <p className="text-white text-xl font-bold">Loading Calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2a2f3a] p-4 pb-24 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-[#d85a2a]/5 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="p-3 bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl hover:bg-[#1f2937] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#d85a2a]/20"
          >
            <ChevronLeft className="w-6 h-6 text-[#FF8C42]" />
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl">PMS Calendar</h2>
          </div>
          <button className="px-6 py-3 bg-[#1f2937]/95 backdrop-blur-sm text-[#FF8C42] rounded-2xl font-bold hover:bg-[#1f2937] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#d85a2a]/20">
            <Plus className="w-5 h-5 inline mr-2" /> New Booking
          </button>
        </div>

        {/* Controls */}
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* View Selector */}
            <div className="flex gap-2">
              <button
                onClick={() => setView('month')}
                className={`px-6 py-3 rounded-2xl font-bold transition-all shadow-md ${
                  view === 'month'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                    : 'bg-white text-[#FF8C42] border-2 border-gray-200 hover:border-orange-300'
                }`}
              >
                Month View
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-6 py-3 rounded-2xl font-bold transition-all shadow-md ${
                  view === 'week'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                    : 'bg-white text-[#FF8C42] border-2 border-gray-200 hover:border-orange-300'
                }`}
              >
                Week View
              </button>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setSelectedDate(newDate);
                }}
                className="p-2 bg-[#2a2f3a] border-2 border-[#d85a2a]/30-200 hover:border-orange-300 rounded-xl transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-[#FF8C42]" />
              </button>
              <span className="font-black text-xl text-[#FF8C42] min-w-[180px] text-center">
                {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </span>
              <button
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setSelectedDate(newDate);
                }}
                className="p-2 bg-[#2a2f3a] border-2 border-[#d85a2a]/30-200 hover:border-orange-300 rounded-xl transition-all"
              >
                <ChevronRight className="w-5 h-5 text-[#FF8C42]" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Views */}
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-[#d85a2a]/20 overflow-hidden">
          {/* MONTH VIEW - Gantt Style */}
          {view === 'month' && (
            <div className="overflow-x-auto">
              <div className="p-6">
                <h3 className="text-2xl font-black text-[#FF8C42] mb-6">Property Availability - Gantt View</h3>
              </div>

              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-50 to-white">
                    <th className="px-4 py-3 text-left text-xs font-black text-[#FF8C42] uppercase border-r-2 border-gray-200 sticky left-0 bg-orange-50 z-10 min-w-[180px]">
                      Property
                    </th>
                    {getDaysInMonth().map(day => (
                      <th key={day} className="px-2 py-3 text-center text-xs font-bold text-[#FF8C42] border-l border-gray-200 min-w-[60px]">
                        <div>{day}</div>
                        <div className="text-[10px] text-gray-500 font-normal">
                          {new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {properties.map(property => (
                    <tr key={property.id} className="border-t-2 border-gray-200 hover:bg-orange-50/30 transition-colors">
                      <td className="px-4 py-4 font-bold text-[#FF8C42] border-r-2 border-gray-200 sticky left-0 bg-white z-10">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {property.name}
                        </div>
                      </td>
                      {getDaysInMonth().map(day => {
                        const booking = getBookingForPropertyOnDay(property.id, day);
                        const isStart = booking && getBookingStartDay(booking) === day;

                        return (
                          <td key={day} className="relative border-l border-gray-200 h-16 p-1">
                            {isStart && booking ? (
                              <button
                                onClick={() => setSelectedBooking(booking)}
                                className={`absolute left-0 top-1 h-14 rounded-lg ${getStatusColor(booking.status)} text-white text-xs font-bold px-2 py-1 shadow-md transition-all z-20 flex items-center justify-center cursor-pointer`}
                                style={{
                                  width: `${getBookingDuration(booking) * 60}px`,
                                  minWidth: '60px'
                                }}
                                title={`${booking.guestName} - ${booking.guests} guests - $${booking.revenue}`}
                              >
                                <div className="truncate text-left w-full">
                                  <div className="font-black">{booking.guestName}</div>
                                  <div className="text-[10px] opacity-90">{booking.guests} guests • ${booking.revenue}</div>
                                </div>
                              </button>
                            ) : (
                              <div className="h-full"></div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* WEEK VIEW - Compact */}
          {view === 'week' && (
            <div className="p-6">
              <h3 className="text-2xl font-black text-[#FF8C42] mb-6">Weekly Overview</h3>
              <div className="space-y-4">
                {calendarBookings
                  .filter(booking => {
                    const checkIn = new Date(booking.checkIn);
                    const checkOut = new Date(booking.checkOut);
                    const weekStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), getWeekDays()[0]);
                    const weekEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), getWeekDays()[getWeekDays().length - 1]);
                    return (checkIn <= weekEnd && checkOut >= weekStart);
                  })
                  .map(booking => (
                    <button
                      key={booking.id}
                      onClick={() => setSelectedBooking(booking)}
                      className="w-full bg-[#2a2f3a] border-2 border-[#d85a2a]/30-200 rounded-2xl p-5 hover:border-orange-300 hover:shadow-xl transition-all text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`px-4 py-1 rounded-full text-xs font-bold border-2 ${getStatusBadgeColor(booking.status)}`}>
                              {booking.status.toUpperCase()}
                            </span>
                            <h4 className="font-black text-xl text-[#FF8C42]">{booking.guestName}</h4>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-[#FF8C42] font-medium">
                              <Home className="w-4 h-4" />
                              {getPropertyName(booking.propertyId)}
                            </div>
                            <div className="flex items-center gap-2 text-[#FF8C42] font-medium">
                              <Calendar className="w-4 h-4" />
                              {booking.checkIn} → {booking.checkOut}
                            </div>
                            <div className="flex items-center gap-2 text-[#FF8C42] font-medium">
                              <Users className="w-4 h-4" />
                              {booking.guests} guests
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-6">
                          <div className="flex items-center gap-1 text-3xl font-black text-[#FF8C42]">
                            <DollarSign className="w-6 h-6" />
                            {booking.revenue}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 font-bold">Total Revenue</div>
                        </div>
                      </div>
                    </button>
                  ))}

                {calendarBookings.filter(booking => {
                  const checkIn = new Date(booking.checkIn);
                  const checkOut = new Date(booking.checkOut);
                  const weekStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), getWeekDays()[0]);
                  const weekEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), getWeekDays()[getWeekDays().length - 1]);
                  return (checkIn <= weekEnd && checkOut >= weekStart);
                }).length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-[#FF8C42] font-bold text-lg">No bookings this week</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20">
          <h4 className="text-lg font-black text-[#FF8C42] mb-4">Status Legend</h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-green-500"></div>
              <span className="text-[#FF8C42] font-medium">Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-500"></div>
              <span className="text-[#FF8C42] font-medium">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-yellow-500"></div>
              <span className="text-[#FF8C42] font-medium">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-red-500"></div>
              <span className="text-[#FF8C42] font-medium">Cancelled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedBooking(null)}>
          <div className="bg-[#1f2937] rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-black text-white mb-1">Booking Details</h3>
                  <p className="text-orange-100 font-medium">ID: #{selectedBooking.id}</p>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 bg-[#d85a2a]/10 hover:bg-white/30 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Guest Info */}
              <div className="border-2 border-gray-200 rounded-2xl p-4">
                <h4 className="text-xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Guest Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">Guest Name</p>
                    <p className="text-[#FF8C42] font-bold text-lg">{selectedBooking.guestName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">Number of Guests</p>
                    <p className="text-[#FF8C42] font-bold text-lg">{selectedBooking.guests} people</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">Email</p>
                    <p className="text-[#FF8C42] font-medium flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {selectedBooking.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">Phone</p>
                    <p className="text-[#FF8C42] font-medium flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {selectedBooking.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="border-2 border-gray-200 rounded-2xl p-4">
                <h4 className="text-xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Booking Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">Property</p>
                    <p className="text-[#FF8C42] font-bold">{getPropertyName(selectedBooking.propertyId)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">Status</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusBadgeColor(selectedBooking.status)}`}>
                      {selectedBooking.status.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">Check-in</p>
                    <p className="text-[#FF8C42] font-bold">{selectedBooking.checkIn}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">Check-out</p>
                    <p className="text-[#FF8C42] font-bold">{selectedBooking.checkOut}</p>
                  </div>
                </div>
              </div>

              {/* Revenue */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl p-6">
                <p className="text-xs font-bold text-[#FF8C42] mb-2">Total Revenue</p>
                <p className="text-5xl font-black text-[#FF8C42] flex items-center gap-2">
                  <DollarSign className="w-8 h-8" />
                  {selectedBooking.revenue}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t-2 border-gray-200 flex gap-3">
              <button className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-colors shadow-md">
                Edit Booking
              </button>
              <button className="flex-1 px-6 py-3 bg-gray-200 text-[#FF8C42] rounded-2xl font-bold hover:bg-gray-300 transition-colors">
                Contact Guest
              </button>
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-6 py-3 bg-[#2a2f3a] border-2 border-[#d85a2a]/30-300 text-[#FF8C42] rounded-2xl font-bold hover:border-orange-300 transition-colors"
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

export default PMSCalendar;

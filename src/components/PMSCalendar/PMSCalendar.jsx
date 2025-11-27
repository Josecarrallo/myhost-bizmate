import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Calendar,
  Users,
  MessageSquare,
  Send,
  X
} from 'lucide-react';

const PMSCalendar = ({ onBack }) => {
  const [view, setView] = useState('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const mockCalendarBookings = [
    {
      id: 1,
      guestName: "Sarah Johnson",
      propertyName: "Villa Sunset",
      checkIn: "2025-11-08",
      checkOut: "2025-11-13",
      guests: 4,
      revenue: 750,
      status: "confirmed",
      phone: "+1-555-0101",
      email: "sarah.j@email.com"
    },
    {
      id: 2,
      guestName: "Michael Chen",
      propertyName: "Beach House",
      checkIn: "2025-11-07",
      checkOut: "2025-11-12",
      guests: 2,
      revenue: 1000,
      status: "checked-in",
      phone: "+1-555-0102",
      email: "mchen@email.com"
    },
    {
      id: 3,
      guestName: "Emma Williams",
      propertyName: "Villa Paradise",
      checkIn: "2025-11-10",
      checkOut: "2025-11-15",
      guests: 6,
      revenue: 1200,
      status: "confirmed",
      phone: "+1-555-0103",
      email: "emma.w@email.com"
    },
    {
      id: 4,
      guestName: "David Park",
      propertyName: "Villa Sunset",
      checkIn: "2025-11-14",
      checkOut: "2025-11-18",
      guests: 3,
      revenue: 800,
      status: "pending",
      phone: "+1-555-0104",
      email: "david.p@email.com"
    }
  ];

  const mockProperties = [
    { id: 1, name: "Villa Sunset", rooms: 3 },
    { id: 2, name: "Beach House", rooms: 4 },
    { id: 3, name: "Villa Paradise", rooms: 5 }
  ];

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getBookingsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockCalendarBookings.filter(booking => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      const current = new Date(dateStr);
      return current >= checkIn && current <= checkOut;
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-blue-500';
      case 'checked-in': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <div className="bg-white border-b-2 border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-black hover:text-orange-500 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            PMS Calendar
          </h1>
          <div className="w-20"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-2">
            {['day', 'week', 'month'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  view === v
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>

          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none font-semibold"
          >
            <option value="all">All Properties</option>
            {mockProperties.map(prop => (
              <option key={prop.id} value={prop.id}>{prop.name}</option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setMonth(newDate.getMonth() - 1);
                setSelectedDate(newDate);
              }}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-bold min-w-[150px] text-center">
              {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </span>
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setMonth(newDate.getMonth() + 1);
                setSelectedDate(newDate);
              }}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-7xl mx-auto">
          {view === 'month' && (
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-bold text-gray-600 p-2">
                  {day}
                </div>
              ))}

              {generateCalendarDays().map((day, idx) => {
                const bookings = getBookingsForDate(day);
                const isToday = day.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={idx}
                    className={`min-h-[100px] border-2 rounded-xl p-2 transition-all ${
                      isToday ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className={`text-sm font-bold mb-1 ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>
                      {day.getDate()}
                    </div>

                    {bookings.map((booking, bidx) => (
                      <button
                        key={bidx}
                        onClick={() => setSelectedBooking(booking)}
                        className={`w-full text-left text-xs p-1 rounded-lg mb-1 ${getStatusColor(booking.status)} text-white hover:opacity-80 transition-opacity`}
                      >
                        <div className="font-semibold truncate">{booking.guestName}</div>
                        <div className="truncate opacity-90">{booking.propertyName}</div>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {view === 'week' && (
            <div className="space-y-3">
              <h3 className="text-2xl font-black mb-6 text-gray-900">This Week's Bookings</h3>
              {mockCalendarBookings.map((booking) => (
                <button
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  className="w-full p-5 bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-xl transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`w-3 h-3 rounded-full ${getStatusColor(booking.status)}`}></span>
                        <h4 className="font-black text-xl text-gray-900">{booking.guestName}</h4>
                        <span className={`px-3 py-1 rounded-xl text-xs font-bold ${getStatusColor(booking.status)} text-white`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4" />
                          <span className="font-semibold">{booking.propertyName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{booking.checkIn} → {booking.checkOut}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{booking.guests} guests</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-3xl font-black text-green-600">
                        ${booking.revenue}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Revenue</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {view === 'day' && (
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
              <h3 className="text-2xl font-black mb-6 text-gray-900">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h3>
              <div className="space-y-3">
                {getBookingsForDate(selectedDate).length > 0 ? (
                  getBookingsForDate(selectedDate).map((booking) => (
                    <button
                      key={booking.id}
                      onClick={() => setSelectedBooking(booking)}
                      className="w-full p-5 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-black text-lg text-gray-900 mb-2">{booking.guestName}</h4>
                          <p className="text-sm text-gray-600">{booking.propertyName} • {booking.guests} guests</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-green-600">${booking.revenue}</div>
                          <span className={`inline-block mt-2 px-3 py-1 rounded-xl text-xs font-bold ${getStatusColor(booking.status)} text-white`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-semibold">No bookings for this day</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900">{selectedBooking.guestName}</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4">
                <div className="text-sm text-gray-600 mb-1">Property</div>
                <div className="font-black text-lg text-gray-900">{selectedBooking.propertyName}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="text-xs text-gray-500 mb-1">Check-in</div>
                  <div className="font-bold text-gray-900">{selectedBooking.checkIn}</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="text-xs text-gray-500 mb-1">Check-out</div>
                  <div className="font-bold text-gray-900">{selectedBooking.checkOut}</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="text-xs text-gray-500 mb-1">Guests</div>
                <div className="font-bold text-gray-900">{selectedBooking.guests} guests</div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="text-xs text-gray-500 mb-2">Contact</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="p-1.5 bg-white rounded-lg">
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="font-semibold">{selectedBooking.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="p-1.5 bg-white rounded-lg">
                      <Send className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="font-semibold">{selectedBooking.email}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4">
                <div className="text-xs text-gray-500 mb-1">Total Revenue</div>
                <div className="text-4xl font-black text-green-600">
                  ${selectedBooking.revenue}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-2">Status</div>
                <span className={`inline-block px-6 py-3 rounded-xl font-bold text-sm ${getStatusColor(selectedBooking.status)} text-white`}>
                  {selectedBooking.status.toUpperCase()}
                </span>
              </div>

              <div className="flex gap-3 pt-4">
                <button className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                  Check-in
                </button>
                <button className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-xl font-bold hover:bg-gray-200 transition-all">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border-t-2 border-gray-200 p-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <div className="text-3xl font-black text-blue-600">{mockCalendarBookings.length}</div>
            <div className="text-xs font-semibold text-blue-900 mt-1">Total Bookings</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <div className="text-3xl font-black text-green-600">
              {mockCalendarBookings.filter(b => b.status === 'checked-in').length}
            </div>
            <div className="text-xs font-semibold text-green-900 mt-1">Checked-in</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
            <div className="text-3xl font-black text-yellow-600">
              {mockCalendarBookings.filter(b => b.status === 'confirmed').length}
            </div>
            <div className="text-xs font-semibold text-yellow-900 mt-1">Upcoming</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <div className="text-3xl font-black text-purple-600">
              ${mockCalendarBookings.reduce((sum, b) => sum + b.revenue, 0)}
            </div>
            <div className="text-xs font-semibold text-purple-900 mt-1">Total Revenue</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PMSCalendar;

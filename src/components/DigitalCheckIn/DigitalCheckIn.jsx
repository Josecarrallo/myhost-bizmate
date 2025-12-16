import React, { useState } from 'react';
import {
  ChevronLeft,
  Clock,
  Phone,
  X,
  Mail,
  MapPin,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  Send,
  Download,
  Key,
  FileText,
  CheckSquare
} from 'lucide-react';

const DigitalCheckIn = ({ onBack }) => {
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [activeTab, setActiveTab] = useState('arrivals');

  const upcomingArrivals = [
    {
      id: 1,
      name: "Sarah Johnson",
      property: "Villa Sunset Paradise",
      checkIn: "2025-11-08 14:00",
      checkOut: "2025-11-13 11:00",
      status: "pending",
      phone: "+1-555-0101",
      email: "sarah.j@email.com",
      guests: 4,
      nights: 5,
      formStatus: "not_sent",
      accessCode: null,
      country: "USA"
    },
    {
      id: 2,
      name: "Marco Rossi",
      property: "Beach House Deluxe",
      checkIn: "2025-11-09 15:00",
      checkOut: "2025-11-16 11:00",
      status: "form_sent",
      phone: "+39-555-0202",
      email: "marco.r@email.com",
      guests: 2,
      nights: 7,
      formStatus: "sent",
      accessCode: null,
      country: "Italy"
    },
    {
      id: 3,
      name: "Ana García",
      property: "City Loft Premium",
      checkIn: "2025-11-10 16:00",
      checkOut: "2025-11-14 11:00",
      status: "completed",
      phone: "+34-555-0303",
      email: "ana.g@email.com",
      guests: 3,
      nights: 4,
      formStatus: "completed",
      accessCode: "7392",
      country: "Spain"
    },
    {
      id: 4,
      name: "Yuki Tanaka",
      property: "Mountain Cabin Retreat",
      checkIn: "2025-11-11 14:00",
      checkOut: "2025-11-18 11:00",
      status: "pending",
      phone: "+81-555-0404",
      email: "yuki.t@email.com",
      guests: 2,
      nights: 7,
      formStatus: "not_sent",
      accessCode: null,
      country: "Japan"
    },
    {
      id: 5,
      name: "Emma Wilson",
      property: "Villa Sunset Paradise",
      checkIn: "2025-11-12 15:00",
      checkOut: "2025-11-15 11:00",
      status: "form_sent",
      phone: "+44-555-0505",
      email: "emma.w@email.com",
      guests: 2,
      nights: 3,
      formStatus: "sent",
      accessCode: null,
      country: "UK"
    },
    {
      id: 6,
      name: "Ahmed Al-Rashid",
      property: "Beach House Deluxe",
      checkIn: "2025-11-13 14:00",
      checkOut: "2025-11-20 11:00",
      status: "completed",
      phone: "+971-555-0606",
      email: "ahmed.a@email.com",
      guests: 5,
      nights: 7,
      formStatus: "completed",
      accessCode: "4821",
      country: "UAE"
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'form_sent': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'form_sent': return <Send className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'completed': return 'Completed';
      case 'form_sent': return 'Form Sent';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  const completedCount = upcomingArrivals.filter(g => g.status === 'completed').length;
  const formSentCount = upcomingArrivals.filter(g => g.status === 'form_sent').length;
  const pendingCount = upcomingArrivals.filter(g => g.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-4 pb-24 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-orange-200/30 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <ChevronLeft className="w-6 h-6 text-orange-600" />
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl">Digital Check-In</h2>
          </div>
          <button className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <Download className="w-6 h-6 text-orange-600" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border-2 border-white/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <Users className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-600">Total Arrivals</p>
            </div>
            <p className="text-3xl font-black text-orange-600">{upcomingArrivals.length}</p>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border-2 border-white/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-600">Completed</p>
            </div>
            <p className="text-3xl font-black text-green-600">{completedCount}</p>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border-2 border-white/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <Send className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-600">Form Sent</p>
            </div>
            <p className="text-3xl font-black text-blue-600">{formSentCount}</p>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border-2 border-white/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-600">Pending</p>
            </div>
            <p className="text-3xl font-black text-yellow-600">{pendingCount}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Arrivals List */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/50">
              <h3 className="text-2xl font-black text-orange-600 mb-6">Upcoming Arrivals (Next 7 Days)</h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {upcomingArrivals.map((guest) => (
                  <div key={guest.id} className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-black text-orange-600 mb-1">{guest.name}</h4>
                        <p className="text-sm text-gray-600 font-semibold">{guest.property}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-xl font-bold text-xs border-2 flex items-center gap-1 ${getStatusColor(guest.status)}`}>
                        {getStatusIcon(guest.status)}
                        {getStatusLabel(guest.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 font-semibold">{guest.nights} nights</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 font-semibold">{guest.guests} guests</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 font-semibold">{guest.checkIn.split(' ')[1]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 font-semibold">{guest.country}</span>
                      </div>
                    </div>

                    {guest.accessCode && (
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-3 mb-3 text-white text-center">
                        <p className="text-xs font-bold mb-1">Access Code</p>
                        <p className="text-2xl font-black">{guest.accessCode}</p>
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedGuest(guest)}
                      className="w-full py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg transition-all text-sm"
                    >
                      {guest.status === 'completed' ? 'View Details' : guest.status === 'form_sent' ? 'Resend Link' : 'Send Check-in Form'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* QR Code */}
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/50 text-center">
                <h3 className="text-xl font-black text-orange-600 mb-4">QR Check-in Code</h3>
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-4 border-4 border-orange-500">
                  <div className="text-6xl">📲</div>
                </div>
                <p className="text-sm text-gray-600 mb-4 font-semibold">Guests scan to start digital check-in</p>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Download QR Code
                </button>
              </div>

              {/* Access Instructions */}
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/50">
                <h3 className="text-xl font-black text-orange-600 mb-4 flex items-center gap-2">
                  <CheckSquare className="w-6 h-6" /> Check-in Process
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl border-2 border-orange-100">
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div className="flex-1">
                      <div className="font-bold text-orange-600">Complete Digital Form</div>
                      <div className="text-sm text-gray-600">Fill personal details and sign electronically</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl border-2 border-orange-100">
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div className="flex-1">
                      <div className="font-bold text-orange-600">Receive Access Code</div>
                      <div className="text-sm text-gray-600">Code sent via SMS and Email instantly</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl border-2 border-orange-100">
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div className="flex-1">
                      <div className="font-bold text-orange-600">Self Check-in</div>
                      <div className="text-sm text-gray-600">Enter code at smart lock, no contact needed</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Code */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 shadow-2xl text-white border-2 border-white/30">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Key className="w-6 h-6" />
                  <h4 className="text-lg font-black">Sample Access Code</h4>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-black mb-3 tracking-wider">5 8 4 7</div>
                  <div className="text-sm opacity-90 font-semibold">
                    <p>Valid: Nov 8, 2025 14:00</p>
                    <p>Until: Nov 13, 2025 11:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedGuest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedGuest(null)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6 flex items-center justify-between sticky top-0 z-10">
              <div>
                <h3 className="text-3xl font-black text-white mb-1">{selectedGuest.name}</h3>
                <p className="text-orange-100 font-semibold">{selectedGuest.country}</p>
              </div>
              <button onClick={() => setSelectedGuest(null)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Status Badge */}
              <div className={`rounded-2xl p-4 border-2 flex items-center justify-between ${getStatusColor(selectedGuest.status)}`}>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedGuest.status)}
                  <span className="font-black text-lg">{getStatusLabel(selectedGuest.status)}</span>
                </div>
                {selectedGuest.accessCode && (
                  <div className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    <span className="font-black text-2xl">{selectedGuest.accessCode}</span>
                  </div>
                )}
              </div>

              {/* Property & Booking Info */}
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                <h4 className="text-xl font-black text-orange-600 mb-4 flex items-center gap-2">
                  <MapPin className="w-6 h-6" /> Booking Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">Property</p>
                    <p className="font-bold text-gray-900">{selectedGuest.property}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">Guests</p>
                    <p className="font-bold text-gray-900">{selectedGuest.guests} guests</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">Check-in</p>
                    <p className="font-bold text-gray-900">{selectedGuest.checkIn}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">Check-out</p>
                    <p className="font-bold text-gray-900">{selectedGuest.checkOut}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500 font-semibold mb-1">Duration</p>
                    <p className="font-bold text-orange-600 text-lg">{selectedGuest.nights} nights</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                <h4 className="text-xl font-black text-orange-600 mb-4 flex items-center gap-2">
                  <Mail className="w-6 h-6" /> Contact Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-gray-100">
                    <Mail className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Email</p>
                      <p className="font-bold text-gray-900">{selectedGuest.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-gray-100">
                    <Phone className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Phone</p>
                      <p className="font-bold text-gray-900">{selectedGuest.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Access Code Section */}
              {selectedGuest.accessCode && (
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white border-4 border-orange-300">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Key className="w-7 h-7" />
                    <h4 className="text-2xl font-black">Access Code</h4>
                  </div>
                  <div className="text-center">
                    <div className="text-6xl font-black mb-3 tracking-widest">{selectedGuest.accessCode}</div>
                    <div className="text-sm opacity-90 font-semibold bg-white/20 rounded-xl p-3">
                      <p className="mb-1">Valid from: {selectedGuest.checkIn}</p>
                      <p>Valid until: {selectedGuest.checkOut}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  {selectedGuest.status === 'completed' ? 'Resend Access Code' : selectedGuest.status === 'form_sent' ? 'Resend Check-in Link' : 'Send Check-in Form'}
                </button>
                <button className="w-full py-3 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5" />
                  View Check-in Form
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalCheckIn;

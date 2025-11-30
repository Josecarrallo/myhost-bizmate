import React, { useState } from 'react';
import { ChevronLeft, Clock, Phone, X } from 'lucide-react';

const DigitalCheckIn = ({ onBack }) => {
  const [selectedGuest, setSelectedGuest] = useState(null);

  const upcomingArrivals = [
    { id: 1, name: "Sarah Johnson", property: "Villa Sunset", checkIn: "2025-11-08 14:00", status: "pending", phone: "+1-555-0101", email: "sarah@email.com" },
    { id: 2, name: "Marco Rossi", property: "Beach House", checkIn: "2025-11-09 15:00", status: "pending", phone: "+39-555-0202", email: "marco@email.com" },
    { id: 3, name: "Ana García", property: "Villa Paradise", checkIn: "2025-11-10 16:00", status: "completed", phone: "+34-555-0303", email: "ana@email.com" }
  ];

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
          <div className="w-12"></div>
        </div>

        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/50">
              <h3 className="text-2xl font-black text-orange-600 mb-6">Upcoming Arrivals</h3>
              <div className="space-y-4">
                {upcomingArrivals.map((guest) => (
                  <div key={guest.id} className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-black text-orange-600 mb-1">{guest.name}</h3>
                        <p className="text-sm text-gray-600 font-semibold">{guest.property}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-xl font-bold text-sm ${
                        guest.status === 'completed' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                      }`}>
                        {guest.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{guest.checkIn}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{guest.phone}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedGuest(guest)}
                      className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                    >
                      {guest.status === 'completed' ? 'View Details' : 'Send Check-in Link'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-white/50 text-center">
                <h3 className="text-2xl font-black text-orange-600 mb-6">QR Check-in Code</h3>
                <div className="w-64 h-64 mx-auto bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-6 border-4 border-orange-500">
                  <div className="text-8xl">📲</div>
                </div>
                <p className="text-sm text-gray-600 mb-4">Scan to start digital check-in process</p>
                <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                  Download QR Code
                </button>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/50">
                <h3 className="text-xl font-black text-orange-600 mb-4">Access Instructions</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div className="flex-1">
                      <div className="font-bold text-orange-600">Complete Digital Form</div>
                      <div className="text-sm text-gray-600">Fill personal details and sign</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div className="flex-1">
                      <div className="font-bold text-orange-600">Receive Door Code</div>
                      <div className="text-sm text-gray-600">Code sent via SMS/Email</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div className="flex-1">
                      <div className="font-bold text-orange-600">Access Property</div>
                      <div className="text-sm text-gray-600">Enter code at smart lock</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 shadow-2xl text-white text-center border-2 border-white/30">
                <div className="text-sm font-bold mb-2">Sample Access Code</div>
                <div className="text-5xl font-black mb-2">5847</div>
                <div className="text-xs opacity-90">Valid: Nov 8, 14:00 - Nov 13, 11:00</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedGuest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900">Guest Details</h3>
              <button onClick={() => setSelectedGuest(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm font-bold text-gray-600 mb-1">Name</div>
                <div className="font-black text-lg text-gray-900">{selectedGuest.name}</div>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-600 mb-1">Property</div>
                <div className="font-bold text-gray-900">{selectedGuest.property}</div>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-600 mb-1">Check-in Time</div>
                <div className="font-bold text-gray-900">{selectedGuest.checkIn}</div>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-600 mb-1">Contact</div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-700">{selectedGuest.phone}</div>
                  <div className="text-sm text-gray-700">{selectedGuest.email}</div>
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-600 mb-1">Status</div>
                <span className={`inline-block px-4 py-2 rounded-xl font-bold ${
                  selectedGuest.status === 'completed' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                }`}>
                  {selectedGuest.status}
                </span>
              </div>

              <button className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all mt-6">
                Resend Check-in Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalCheckIn;

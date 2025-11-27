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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col">
      <div className="bg-white border-b-2 border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-black hover:text-green-500 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
            Digital Check-in
          </h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-6">Upcoming Arrivals</h2>
              <div className="space-y-4">
                {upcomingArrivals.map((guest) => (
                  <div key={guest.id} className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-black text-gray-900 mb-1">{guest.name}</h3>
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
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 text-center">
                <h3 className="text-2xl font-black text-gray-900 mb-6">QR Check-in Code</h3>
                <div className="w-64 h-64 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-6 border-4 border-green-500">
                  <div className="text-8xl">📲</div>
                </div>
                <p className="text-sm text-gray-600 mb-4">Scan to start digital check-in process</p>
                <button className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all">
                  Download QR Code
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
                <h3 className="text-xl font-black text-gray-900 mb-4">Access Instructions</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">Complete Digital Form</div>
                      <div className="text-sm text-gray-600">Fill personal details and sign</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">Receive Door Code</div>
                      <div className="text-sm text-gray-600">Code sent via SMS/Email</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">Access Property</div>
                      <div className="text-sm text-gray-600">Enter code at smart lock</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white text-center">
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

import React, { useState } from 'react';
import { ChevronLeft, Settings } from 'lucide-react';

const RMSIntegration = ({ onBack }) => {
  const [connectedChannels] = useState([
    { id: 1, name: "Airbnb", logo: "🏠", status: "connected", bookings: 45, revenue: 67500, sync: "2 mins ago" },
    { id: 2, name: "Booking.com", logo: "🔵", status: "connected", bookings: 38, revenue: 57000, sync: "5 mins ago" },
    { id: 3, name: "Agoda", logo: "🟣", status: "connected", bookings: 22, revenue: 33000, sync: "1 min ago" }
  ]);

  const availableChannels = [
    { id: 4, name: "Expedia", logo: "✈️", status: "available" },
    { id: 5, name: "VRBO", logo: "🏖️", status: "available" },
    { id: 6, name: "TripAdvisor", logo: "🦉", status: "available" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex flex-col">
      <div className="bg-white border-b-2 border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-orange-600 hover:text-orange-500 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-black text-orange-600 mb-1">MY HOST</h2>
            <p className="text-xl md:text-2xl font-bold text-orange-500">BizMate</p>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h2 className="text-3xl font-black text-orange-600 mb-6">Connected Channels</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {connectedChannels.map((channel) => (
                <div key={channel.id} className="bg-white rounded-2xl p-6 border-2 border-green-200 shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{channel.logo}</div>
                      <div>
                        <h3 className="text-xl font-black text-orange-600">{channel.name}</h3>
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                          {channel.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Bookings</span>
                      <span className="text-xl font-black text-orange-600">{channel.bookings}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Revenue</span>
                      <span className="text-xl font-black text-green-600">${channel.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Last Sync</span>
                      <span className="font-bold text-gray-700">{channel.sync}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all text-sm">
                      Sync Now
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-black text-orange-600 mb-6">Available Channels</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {availableChannels.map((channel) => (
                <div key={channel.id} className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all">
                  <div className="text-center">
                    <div className="text-5xl mb-4">{channel.logo}</div>
                    <h3 className="text-xl font-black text-orange-600 mb-4">{channel.name}</h3>
                    <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                      + Connect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <h3 className="text-2xl font-black text-orange-600 mb-6">Sync Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-bold text-orange-600">Auto-Sync</div>
                  <div className="text-sm text-gray-600">Automatically sync bookings every 5 minutes</div>
                </div>
                <div className="w-14 h-8 bg-green-500 rounded-full flex items-center px-1">
                  <div className="w-6 h-6 bg-white rounded-full ml-auto"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-bold text-orange-600">Price Sync</div>
                  <div className="text-sm text-gray-600">Sync pricing changes across all channels</div>
                </div>
                <div className="w-14 h-8 bg-green-500 rounded-full flex items-center px-1">
                  <div className="w-6 h-6 bg-white rounded-full ml-auto"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-bold text-orange-600">Availability Sync</div>
                  <div className="text-sm text-gray-600">Update availability in real-time</div>
                </div>
                <div className="w-14 h-8 bg-green-500 rounded-full flex items-center px-1">
                  <div className="w-6 h-6 bg-white rounded-full ml-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RMSIntegration;

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  Calendar
} from 'lucide-react';

const MultichannelIntegration = ({ onBack }) => {
  const [selectedChannel, setSelectedChannel] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const channels = [
    {
      name: 'Booking.com',
      logo: '🔵',
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      connected: true,
      lastSync: '3h ago',
      stats: { listings: 6, pending: 3, revenue: '24.5K', bookings: 45, avgRating: 8.9 },
      syncHistory: [
        { date: '2025-12-04 09:00', status: 'success', items: 6 },
        { date: '2025-12-04 06:00', status: 'success', items: 6 },
        { date: '2025-12-03 21:00', status: 'success', items: 6 }
      ]
    },
    {
      name: 'Airbnb',
      logo: '🔴',
      gradient: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      connected: true,
      lastSync: '1h ago',
      stats: { listings: 8, pending: 5, revenue: '32.8K', bookings: 62, avgRating: 4.8 },
      syncHistory: [
        { date: '2025-12-04 11:00', status: 'success', items: 8 },
        { date: '2025-12-04 08:00', status: 'success', items: 8 },
        { date: '2025-12-04 05:00', status: 'warning', items: 7 }
      ]
    },
    {
      name: 'Agoda',
      logo: '🌈',
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      connected: false,
      lastSync: 'Never',
      stats: { listings: 0, pending: 0, revenue: '0', bookings: 0, avgRating: 0 },
      syncHistory: []
    },
    {
      name: 'Expedia',
      logo: '🟡',
      gradient: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      connected: true,
      lastSync: '5h ago',
      stats: { listings: 6, pending: 2, revenue: '18.3K', bookings: 34, avgRating: 4.6 },
      syncHistory: [
        { date: '2025-12-04 07:00', status: 'success', items: 6 },
        { date: '2025-12-04 04:00', status: 'success', items: 6 },
        { date: '2025-12-03 22:00', status: 'error', items: 0 }
      ]
    },
    {
      name: 'VRBO',
      logo: '🟠',
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      connected: true,
      lastSync: '2h ago',
      stats: { listings: 5, pending: 1, revenue: '15.7K', bookings: 28, avgRating: 4.7 },
      syncHistory: [
        { date: '2025-12-04 10:00', status: 'success', items: 5 },
        { date: '2025-12-04 07:00', status: 'success', items: 5 },
        { date: '2025-12-04 04:00', status: 'success', items: 5 }
      ]
    }
  ];

  const totalStats = {
    connectedChannels: channels.filter(c => c.connected).length,
    totalListings: channels.reduce((sum, c) => sum + c.stats.listings, 0),
    totalRevenue: channels.reduce((sum, c) => sum + parseFloat(c.stats.revenue.replace('K', '')), 0).toFixed(1) + 'K',
    totalBookings: channels.reduce((sum, c) => sum + c.stats.bookings, 0)
  };

  return (
    <div className="flex-1 h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex flex-col relative overflow-auto">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-orange-200/30 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b-2 border-white/50 p-4 relative z-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-orange-600 hover:text-orange-500 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-black text-orange-600 mb-1">Multichannel</h2>
            <p className="text-sm md:text-base font-semibold text-orange-500">Channel Management</p>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Global Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/50 shadow-lg">
              <div className="text-3xl font-black text-orange-600 mb-1">{totalStats.connectedChannels}/{channels.length}</div>
              <div className="text-xs font-semibold text-gray-600">Connected Channels</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 border-2 border-white/50 shadow-lg text-white">
              <div className="text-3xl font-black mb-1">{totalStats.totalListings}</div>
              <div className="text-xs font-semibold opacity-90">Total Listings</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/50 shadow-lg">
              <div className="text-3xl font-black text-orange-600 mb-1">${totalStats.totalRevenue}</div>
              <div className="text-xs font-semibold text-gray-600">Total Revenue</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/50 shadow-lg">
              <div className="text-3xl font-black text-orange-600 mb-1">{totalStats.totalBookings}</div>
              <div className="text-xs font-semibold text-gray-600">Total Bookings</div>
            </div>
          </div>

          {/* Channels */}
          <div className="space-y-4">
            {channels.map((channel, idx) => (
              <div key={idx} className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/50 shadow-xl hover:shadow-2xl transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${channel.gradient} flex items-center justify-center text-3xl shadow-lg`}>
                    {channel.logo}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-orange-600 mb-1">{channel.name}</h3>
                    <div className="flex items-center gap-2">
                      {channel.connected ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-sm font-bold text-green-600">Connected</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-gray-400" />
                          <span className="text-sm font-bold text-gray-500">Not Connected</span>
                        </>
                      )}
                    </div>
                  </div>
                  {channel.connected && (
                    <button
                      onClick={() => setSelectedChannel(channel)}
                      className="px-4 py-2 bg-orange-100 text-orange-600 rounded-xl font-bold hover:bg-orange-200 transition-all"
                    >
                      View Details
                    </button>
                  )}
                </div>

                {channel.connected ? (
                  <>
                    <div className={`${channel.bgColor} rounded-2xl p-6 mb-6`}>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <p className={`text-xs ${channel.textColor} font-semibold mb-2`}>Listings</p>
                          <p className="text-3xl font-black text-orange-600">{channel.stats.listings}</p>
                        </div>
                        <div>
                          <p className={`text-xs ${channel.textColor} font-semibold mb-2`}>Pending</p>
                          <p className="text-3xl font-black text-orange-600">{channel.stats.pending}</p>
                        </div>
                        <div>
                          <p className={`text-xs ${channel.textColor} font-semibold mb-2`}>Revenue</p>
                          <p className="text-3xl font-black text-orange-600">${channel.stats.revenue}</p>
                        </div>
                        <div>
                          <p className={`text-xs ${channel.textColor} font-semibold mb-2`}>Bookings</p>
                          <p className="text-3xl font-black text-orange-600">{channel.stats.bookings}</p>
                        </div>
                        <div>
                          <p className={`text-xs ${channel.textColor} font-semibold mb-2`}>Avg Rating</p>
                          <p className="text-3xl font-black text-orange-600">{channel.stats.avgRating}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>Last sync: <span className="font-bold text-gray-700">{channel.lastSync}</span></span>
                      </div>
                      <button className={`px-6 py-3 bg-gradient-to-r ${channel.gradient} text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2`}>
                        <RefreshCw className="w-5 h-5" />
                        Sync Now
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-50 rounded-2xl p-8 text-center mb-6">
                      <p className="text-gray-600 font-semibold mb-4 text-lg">This channel is not connected yet</p>
                      <button className={`px-8 py-4 bg-gradient-to-r ${channel.gradient} text-white rounded-xl font-bold hover:shadow-lg transition-all text-lg`}>
                        Connect {channel.name}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>Last sync: <span className="font-bold">{channel.lastSync}</span></span>
                      </div>
                      <button disabled className="px-6 py-3 bg-gray-200 text-gray-400 rounded-xl font-bold flex items-center gap-2 cursor-not-allowed">
                        <RefreshCw className="w-5 h-5" />
                        Sync Now
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Channel Details Modal */}
      {selectedChannel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-auto shadow-2xl">
            <div className={`sticky top-0 bg-gradient-to-r ${selectedChannel.gradient} p-6 rounded-t-3xl`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{selectedChannel.logo}</div>
                  <div>
                    <h3 className="text-2xl font-black text-white">{selectedChannel.name}</h3>
                    <p className="text-sm text-white/80 font-semibold">Channel Details & Sync History</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedChannel(null)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Stats Summary */}
              <div className={`${selectedChannel.bgColor} rounded-2xl p-6 border-2 ${selectedChannel.bgColor.replace('bg-', 'border-').replace('-50', '-200')}`}>
                <h4 className="text-lg font-black text-orange-600 mb-4">Performance Summary</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">Total Revenue</p>
                    <p className="text-2xl font-black text-orange-600">${selectedChannel.stats.revenue}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">Total Bookings</p>
                    <p className="text-2xl font-black text-orange-600">{selectedChannel.stats.bookings}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">Avg Rating</p>
                    <p className="text-2xl font-black text-orange-600">{selectedChannel.stats.avgRating} ⭐</p>
                  </div>
                </div>
              </div>

              {/* Sync History */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <h4 className="text-lg font-black text-orange-600">Recent Sync History</h4>
                </div>
                <div className="space-y-3">
                  {selectedChannel.syncHistory.map((sync, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {sync.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                          {sync.status === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                          {sync.status === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                          <div>
                            <p className="text-sm font-bold text-gray-700">{sync.date}</p>
                            <p className="text-xs text-gray-500">Synced {sync.items} listings</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          sync.status === 'success' ? 'bg-green-100 text-green-700' :
                          sync.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {sync.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className={`flex-1 py-3 bg-gradient-to-r ${selectedChannel.gradient} text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2`}>
                  <RefreshCw className="w-5 h-5" />
                  Force Sync
                </button>
                <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all">
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultichannelIntegration;

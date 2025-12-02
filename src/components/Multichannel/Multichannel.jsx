import React from 'react';
import {
  ChevronLeft,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw
} from 'lucide-react';

const MultichannelIntegration = ({ onBack }) => {
  const channels = [
    { name: 'Booking.com', logo: '🔵', gradient: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-700', connected: true, lastSync: '3h ago', stats: { listings: 6, pending: 3, revenue: '24.5K' } },
    { name: 'Airbnb', logo: '🔴', gradient: 'from-red-500 to-pink-600', bgColor: 'bg-red-50', textColor: 'text-red-700', connected: true, lastSync: '1h ago', stats: { listings: 8, pending: 5, revenue: '32.8K' } },
    { name: 'Agoda', logo: '🌈', gradient: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50', textColor: 'text-purple-700', connected: false, lastSync: 'Never', stats: { listings: 0, pending: 0, revenue: '0' } }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-4 pb-24 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-orange-200/30 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <ChevronLeft className="w-6 h-6 text-orange-600" />
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl mb-1">MY HOST</h2>
            <p className="text-2xl md:text-3xl font-bold text-orange-100 drop-shadow-xl">BizMate</p>
          </div>
          <div className="w-14"></div>
        </div>

        <div className="space-y-6">
          {channels.map((channel, idx) => (
            <div key={idx} className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border-2 border-white/50 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${channel.gradient} flex items-center justify-center text-3xl shadow-lg`}>{channel.logo}</div>
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
              </div>

              {channel.connected ? (
                <>
                  <div className={`${channel.bgColor} rounded-2xl p-6 mb-6`}>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className={`text-sm ${channel.textColor} font-semibold mb-2`}>Listings</p>
                        <p className="text-4xl font-black text-orange-600">{channel.stats.listings}</p>
                      </div>
                      <div>
                        <p className={`text-sm ${channel.textColor} font-semibold mb-2`}>Pending</p>
                        <p className="text-4xl font-black text-orange-600">{channel.stats.pending}</p>
                      </div>
                      <div>
                        <p className={`text-sm ${channel.textColor} font-semibold mb-2`}>Revenue</p>
                        <p className="text-4xl font-black text-orange-600">${channel.stats.revenue}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Sync: <span className="font-bold">{channel.lastSync}</span></span>
                    </div>
                    <button className={`px-6 py-3 bg-gradient-to-r ${channel.gradient} text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2`}>
                      <RefreshCw className="w-5 h-5" />Sync
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-gray-50 rounded-2xl p-8 text-center mb-6">
                    <p className="text-gray-600 font-semibold mb-4 text-lg">This platform is not connected yet</p>
                    <button className={`px-8 py-4 bg-gradient-to-r ${channel.gradient} text-white rounded-xl font-bold hover:shadow-lg transition-all text-lg`}>
                      Connect {channel.name}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>Sync: <span className="font-bold">{channel.lastSync}</span></span>
                    </div>
                    <button disabled className="px-6 py-3 bg-gray-200 text-gray-400 rounded-xl font-bold flex items-center gap-2 cursor-not-allowed">
                      <RefreshCw className="w-5 h-5" />Sync
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultichannelIntegration;

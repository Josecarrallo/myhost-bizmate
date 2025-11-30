import React, { useState } from 'react';
import {
  ChevronLeft,
  Search,
  MessageSquare,
  Bot,
  Clock,
  Send
} from 'lucide-react';
import { StatCard, MessageCard } from '../common';

const Messages = ({ onBack }) => {
  const [messageText, setMessageText] = useState('');

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
          <button className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <Search className="w-6 h-6 text-orange-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard icon={MessageSquare} label="Unread Messages" value="12" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={Bot} label="AI Auto-Replies" value="45" trend="+20%" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={Clock} label="Avg Response Time" value="8m" trend="-15%" gradient="from-orange-500 to-orange-600" />
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/50 mb-6">
          <div className="space-y-4">
            <MessageCard name="Emma Wilson" property="City Loft" message="Hi! I'd like to know if early check-in is possible for my reservation next week?" time="5m ago" unread={true} avatar="EW" />
            <MessageCard name="David Park" property="Mountain Cabin" message="Thank you for the wonderful stay! Everything was perfect." time="2h ago" unread={false} avatar="DP" />
            <MessageCard name="Lisa Anderson" property="Beach House" message="Could you please send me the WiFi password? Thanks!" time="1d ago" unread={false} avatar="LA" />
            <MessageCard name="James Rodriguez" property="Villa Sunset" message="Is parking available at the property? We're arriving with 2 cars." time="2d ago" unread={false} avatar="JR" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/50">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-6 py-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none text-gray-900 font-medium"
            />
            <button className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:shadow-lg transition-all">
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;

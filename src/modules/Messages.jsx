import React, { useState } from 'react';
import { ChevronLeft, Search, MessageSquare, Bot, Clock, Send } from 'lucide-react';
import { StatCard, MessageCard } from '../components/common/Cards';

const Messages = ({ onBack }) => {
  const [messageText, setMessageText] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h2 className="text-3xl font-black text-gray-900">Messages</h2>
          <button className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200">
            <Search className="w-6 h-6 text-gray-900" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard icon={MessageSquare} label="Unread Messages" value="12" gradient="from-orange-500 to-red-600" />
          <StatCard icon={Bot} label="AI Auto-Replies" value="45" trend="+20%" gradient="from-purple-500 to-pink-600" />
          <StatCard icon={Clock} label="Avg Response Time" value="8m" trend="-15%" gradient="from-green-500 to-emerald-600" />
        </div>

        <div className="space-y-4 mb-6">
          <MessageCard name="Emma Wilson" property="City Loft" message="Hi! I'd like to know if early check-in is possible for my reservation next week?" time="5m ago" unread={true} avatar="EW" />
          <MessageCard name="David Park" property="Mountain Cabin" message="Thank you for the wonderful stay! Everything was perfect." time="2h ago" unread={false} avatar="DP" />
          <MessageCard name="Lisa Anderson" property="Beach House" message="Could you please send me the WiFi password? Thanks!" time="1d ago" unread={false} avatar="LA" />
          <MessageCard name="James Rodriguez" property="Villa Sunset" message="Is parking available at the property? We're arriving with 2 cars." time="2d ago" unread={false} avatar="JR" />
        </div>

        <div className="bg-white rounded-3xl p-6 border-2 border-gray-200">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-6 py-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none text-gray-900 font-medium"
            />
            <button className="p-4 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition-colors">
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;

import React from 'react';
import { MapPin } from 'lucide-react';

const MessageCard = ({ name, property, message, time, unread, avatar }) => (
  <div className={`bg-white rounded-2xl p-5 border-2 ${unread ? 'border-orange-200 bg-orange-50/30' : 'border-gray-100'} hover:shadow-lg transition-all cursor-pointer`}>
    <div className="flex items-start gap-4">
      <div className="relative flex-shrink-0">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl">
          {avatar}
        </div>
        {unread && <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">3</div>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-lg mb-0.5">{name}</h4>
            <p className="text-gray-500 text-xs flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {property}
            </p>
          </div>
          <span className="text-xs text-gray-400 font-medium whitespace-nowrap ml-2">{time}</span>
        </div>
        <p className={`text-sm ${unread ? 'text-gray-900 font-semibold' : 'text-gray-600'} line-clamp-2`}>{message}</p>
      </div>
    </div>
  </div>
);

export default MessageCard;

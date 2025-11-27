import React from 'react';
import { Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';

const CampaignCard = ({ name, platform, status, reach, engagement, clicks, budget, startDate, endDate }) => (
  <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-purple-200 transition-all hover:shadow-lg">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h4 className="font-bold text-gray-900 text-xl mb-2">{name}</h4>
        <div className="flex items-center gap-2">
          {platform === 'Instagram' && <Instagram className="w-5 h-5 text-pink-500" />}
          {platform === 'Facebook' && <Facebook className="w-5 h-5 text-blue-600" />}
          {platform === 'Twitter' && <Twitter className="w-5 h-5 text-blue-400" />}
          {platform === 'LinkedIn' && <Linkedin className="w-5 h-5 text-blue-700" />}
          <span className="text-sm text-gray-600">{platform}</span>
        </div>
      </div>
      <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${status === 'Active' ? 'bg-green-100 text-green-700' : status === 'Scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    </div>

    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="bg-purple-50 rounded-xl p-3">
        <p className="text-xs text-gray-600 mb-1">Reach</p>
        <p className="text-lg font-black text-purple-600">{reach}</p>
      </div>
      <div className="bg-pink-50 rounded-xl p-3">
        <p className="text-xs text-gray-600 mb-1">Engagement</p>
        <p className="text-lg font-black text-pink-600">{engagement}</p>
      </div>
      <div className="bg-blue-50 rounded-xl p-3">
        <p className="text-xs text-gray-600 mb-1">Clicks</p>
        <p className="text-lg font-black text-blue-600">{clicks}</p>
      </div>
    </div>

    <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
      <div>
        <p className="text-xs text-gray-500 mb-1">Budget</p>
        <p className="text-xl font-black text-gray-900">${budget}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-500 mb-1">Period</p>
        <p className="text-sm font-bold text-gray-700">{startDate} - {endDate}</p>
      </div>
    </div>
  </div>
);

export default CampaignCard;

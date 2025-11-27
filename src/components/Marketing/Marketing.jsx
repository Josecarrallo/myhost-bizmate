import React from 'react';
import {
  ChevronLeft,
  Plus,
  Megaphone,
  Users,
  ThumbsUp,
  DollarSign
} from 'lucide-react';
import { StatCard, CampaignCard } from '../common';

const MarketingSuite = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors border-2 border-gray-200">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h2 className="text-3xl font-black text-gray-900">Marketing Suite</h2>
          <button className="px-6 py-3 bg-purple-500 text-white rounded-2xl font-bold hover:bg-purple-600 transition-colors">
            <Plus className="w-5 h-5 inline mr-2" /> New Campaign
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Megaphone} label="Active Campaigns" value="8" gradient="from-purple-500 to-pink-600" />
          <StatCard icon={Users} label="Total Reach" value="145K" trend="+24%" gradient="from-blue-500 to-cyan-600" />
          <StatCard icon={ThumbsUp} label="Engagement Rate" value="8.5%" trend="+12%" gradient="from-green-500 to-emerald-600" />
          <StatCard icon={DollarSign} label="Ad Spend" value="$5.2K" gradient="from-orange-500 to-red-600" />
        </div>

        <div className="space-y-4">
          <CampaignCard
            name="Summer Villa Special"
            platform="Instagram"
            status="Active"
            reach="45.2K"
            engagement="3.8K"
            clicks="892"
            budget="1,500"
            startDate="Oct 1"
            endDate="Oct 31"
          />
          <CampaignCard
            name="Beach House Getaway"
            platform="Facebook"
            status="Active"
            reach="38.5K"
            engagement="2.9K"
            clicks="756"
            budget="1,200"
            startDate="Oct 15"
            endDate="Nov 15"
          />
          <CampaignCard
            name="Mountain Escape"
            platform="LinkedIn"
            status="Scheduled"
            reach="0"
            engagement="0"
            clicks="0"
            budget="800"
            startDate="Nov 1"
            endDate="Nov 30"
          />
        </div>
      </div>
    </div>
  );
};

export default MarketingSuite;

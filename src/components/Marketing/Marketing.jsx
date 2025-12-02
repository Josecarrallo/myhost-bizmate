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
          <button className="px-6 py-3 bg-white/95 backdrop-blur-sm text-orange-600 rounded-2xl font-bold hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <Plus className="w-5 h-5 inline mr-2" /> New Campaign
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Megaphone} label="Active Campaigns" value="8" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={Users} label="Total Reach" value="145K" trend="+24%" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={ThumbsUp} label="Engagement Rate" value="8.5%" trend="+12%" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={DollarSign} label="Ad Spend" value="$5.2K" gradient="from-orange-500 to-orange-600" />
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

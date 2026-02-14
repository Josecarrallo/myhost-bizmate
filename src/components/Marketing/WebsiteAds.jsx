import React, { useState } from 'react';
import PageShell from '../Layout/PageShell';
import MySite from '../MySite/MySite';
import MetaAds from '../MetaAds/MetaAds';
import Marketing from './Marketing'; // Legacy Marketing Campaigns
import {
  Globe,
  TrendingUp,
  Megaphone,
  DollarSign,
  Eye,
  MousePointer,
  Users
} from 'lucide-react';

/**
 * Website & Ads - Hub for digital marketing channels
 * Groups: My Site (Website Builder), Meta Ads, Marketing Campaigns
 */
const WebsiteAds = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, mysite, metaads, campaigns
  const [stats] = useState({
    websiteVisits: 2450,
    adSpend: 630,
    activeCampaigns: 2,
    totalLeads: 35
  });

  // If a sub-component is active, render it directly
  if (activeTab === 'mysite') {
    return <MySite onBack={() => setActiveTab('overview')} />;
  }

  if (activeTab === 'metaads') {
    return <MetaAds onBack={() => setActiveTab('overview')} />;
  }

  if (activeTab === 'campaigns') {
    return <Marketing onBack={() => setActiveTab('overview')} />;
  }

  // Overview - Hub with cards for each channel
  const kpis = [
    {
      label: 'Website Visits (MTD)',
      value: stats.websiteVisits.toLocaleString(),
      icon: Eye,
      color: 'blue',
      trend: { direction: 'up', value: '+18%' }
    },
    {
      label: 'Ad Spend (MTD)',
      value: `$${stats.adSpend}`,
      icon: DollarSign,
      color: 'green',
      trend: { direction: 'up', value: '+$180' }
    },
    {
      label: 'Active Campaigns',
      value: stats.activeCampaigns.toString(),
      icon: Megaphone,
      color: 'orange'
    },
    {
      label: 'Total Leads',
      value: stats.totalLeads.toString(),
      icon: Users,
      color: 'purple',
      trend: { direction: 'up', value: '+12' }
    }
  ];

  const channels = [
    {
      id: 'mysite',
      title: 'My Site',
      description: 'Build and manage your direct booking website',
      icon: Globe,
      gradient: 'from-blue-500 to-cyan-500',
      stats: [
        { label: 'Visits', value: '2,450' },
        { label: 'Bookings', value: '8' },
        { label: 'Conversion', value: '3.2%' }
      ]
    },
    {
      id: 'metaads',
      title: 'Meta Ads',
      description: 'Manage Facebook & Instagram ad campaigns',
      icon: TrendingUp,
      gradient: 'from-pink-500 to-purple-500',
      stats: [
        { label: 'Spend', value: '$450' },
        { label: 'Leads', value: '18' },
        { label: 'CPC', value: '$1.25' }
      ]
    },
    {
      id: 'campaigns',
      title: 'Marketing Campaigns',
      description: 'Manage all marketing campaigns across channels',
      icon: Megaphone,
      gradient: 'from-orange-500 to-red-500',
      stats: [
        { label: 'Active', value: '2' },
        { label: 'Reach', value: '83.7K' },
        { label: 'Engagement', value: '6.7K' }
      ]
    }
  ];

  return (
    <PageShell
      title="Website & Ads"
      subtitle="Manage your digital marketing channels"
      aiHelperText="Centralized hub for managing your website, Meta advertising, and marketing campaigns. Drive bookings through direct and paid channels."
      kpis={kpis}
      onBack={onBack}
    >
      <div className="p-6 space-y-6">
        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
              <Megaphone className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Marketing Hub</h3>
              <p className="text-white/70 text-sm">
                Manage your website, Meta ads, and multi-channel campaigns from one place.
                All leads automatically flow to LUMINA.AI for qualification and follow-up.
              </p>
            </div>
          </div>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {channels.map((channel) => {
            const Icon = channel.icon;
            return (
              <div
                key={channel.id}
                className="bg-[#1a1f2e] rounded-xl border border-white/10 overflow-hidden hover:border-[#d85a2a]/30 transition-all group cursor-pointer"
                onClick={() => setActiveTab(channel.id)}
              >
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${channel.gradient} p-6`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{channel.title}</h3>
                  </div>
                  <p className="text-white/90 text-sm">{channel.description}</p>
                </div>

                {/* Stats */}
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {channel.stats.map((stat, index) => (
                      <div key={index}>
                        <p className="text-xs text-white/50 mb-1">{stat.label}</p>
                        <p className="text-lg font-bold text-white">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <button className="w-full px-4 py-3 bg-[#2a2f3a] hover:bg-gradient-to-r hover:from-[#d85a2a] hover:to-[#f5a524] text-white/70 hover:text-white rounded-lg font-medium transition-all group-hover:bg-gradient-to-r group-hover:from-[#d85a2a] group-hover:to-[#f5a524] group-hover:text-white">
                    Open {channel.title} →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-[#1a1f2e] rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <MousePointer className="w-5 h-5 text-[#FF8C42]" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setActiveTab('mysite')}
              className="px-4 py-3 bg-[#2a2f3a] hover:bg-blue-500/20 text-white/70 hover:text-blue-400 rounded-lg font-medium transition-colors text-left"
            >
              <span className="block text-sm font-bold mb-1">Edit Website</span>
              <span className="text-xs opacity-70">Update your direct booking site</span>
            </button>
            <button
              onClick={() => setActiveTab('metaads')}
              className="px-4 py-3 bg-[#2a2f3a] hover:bg-pink-500/20 text-white/70 hover:text-pink-400 rounded-lg font-medium transition-colors text-left"
            >
              <span className="block text-sm font-bold mb-1">Create Meta Ad</span>
              <span className="text-xs opacity-70">Launch new Facebook/IG campaign</span>
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className="px-4 py-3 bg-[#2a2f3a] hover:bg-orange-500/20 text-white/70 hover:text-orange-400 rounded-lg font-medium transition-colors text-left"
            >
              <span className="block text-sm font-bold mb-1">View All Campaigns</span>
              <span className="text-xs opacity-70">Manage multi-channel campaigns</span>
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default WebsiteAds;

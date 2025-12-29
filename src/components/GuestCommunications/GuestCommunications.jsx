import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, Mail, Users, Send } from 'lucide-react';
import WhatsAppCoexistence from './WhatsAppCoexistence';
import EmailCommunication from './EmailCommunication';

const GuestCommunications = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('whatsapp');

  // Mock KPIs
  const kpis = {
    totalGuests: 1247,
    reachableEmail: 1180,
    reachableWhatsApp: 856,
    messagesDrafted: 342
  };

  return (
    <div className="flex-1 h-screen bg-[#1a1f2e] overflow-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#d85a2a] to-[#f5a524] p-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Guest Communications</h1>
            <p className="text-white/90 text-sm">Manage how you talk to your guests</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-white/80" />
              <div>
                <p className="text-white/70 text-xs">Total Guests</p>
                <p className="text-white text-2xl font-bold">{kpis.totalGuests.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <Mail className="w-8 h-8 text-white/80" />
              <div>
                <p className="text-white/70 text-xs">Reachable by Email</p>
                <p className="text-white text-2xl font-bold">{kpis.reachableEmail.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-white/80" />
              <div>
                <p className="text-white/70 text-xs">Reachable by WhatsApp</p>
                <p className="text-white text-2xl font-bold">{kpis.reachableWhatsApp.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <Send className="w-8 h-8 text-white/80" />
              <div>
                <p className="text-white/70 text-xs">Messages Drafted</p>
                <p className="text-white text-2xl font-bold">{kpis.messagesDrafted.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#252b3b] border-b border-white/10">
        <div className="flex gap-1 p-2">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'whatsapp'
                ? 'bg-[#d85a2a] text-white shadow-lg'
                : 'text-white/60 hover:text-white/90 hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            WhatsApp Coexistence (Human + AI)
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'email'
                ? 'bg-[#d85a2a] text-white shadow-lg'
                : 'text-white/60 hover:text-white/90 hover:bg-white/5'
            }`}
          >
            <Mail className="w-5 h-5" />
            Email Communication
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'whatsapp' ? <WhatsAppCoexistence /> : <EmailCommunication />}
      </div>
    </div>
  );
};

export default GuestCommunications;

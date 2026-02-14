import React from 'react';
import { ArrowLeft, Inbox, Mail, MessageSquare, Instagram, Globe } from 'lucide-react';

const LeadsInbox = ({ onBack }) => {
  return (
    <div className="flex-1 h-screen bg-[#2a2f3a] p-4 relative overflow-auto">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Inbox className="w-6 h-6" />
                Inbox (New Leads)
              </h1>
              <p className="text-sm text-orange-400">Powered by BANYU.AI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
        <div className="text-center">
          <Inbox className="w-16 h-16 mx-auto mb-4 text-orange-400" />
          <h3 className="text-2xl font-bold text-white mb-2">Unified Inbox for New Leads</h3>
          <p className="text-gray-300 mb-6">All incoming contacts from every channel in one place</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-6">
            <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-4 text-left text-white">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-5 h-5" />
                <h4 className="font-bold">WhatsApp</h4>
              </div>
              <p className="text-sm opacity-90">Capture WhatsApp inquiries automatically</p>
            </div>
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-4 text-left text-white">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-5 h-5" />
                <h4 className="font-bold">Email</h4>
              </div>
              <p className="text-sm opacity-90">Track email leads with smart routing</p>
            </div>
            <div className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl p-4 text-left text-white">
              <div className="flex items-center gap-3 mb-2">
                <Instagram className="w-5 h-5" />
                <h4 className="font-bold">Instagram DMs</h4>
              </div>
              <p className="text-sm opacity-90">Capture Instagram Direct Messages</p>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl p-4 text-left text-white">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="w-5 h-5" />
                <h4 className="font-bold">Website Forms</h4>
              </div>
              <p className="text-sm opacity-90">Web contact forms & booking inquiries</p>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-6 max-w-2xl mx-auto border border-white/20">
            <p className="text-sm text-white font-semibold mb-3">What this module will do:</p>
            <ul className="text-sm text-gray-300 space-y-2 text-left max-w-xl mx-auto">
              <li>✅ Unified view of all new contacts (WhatsApp, Email, IG, Web)</li>
              <li>✅ Lead states: NEW → ENGAGED → HOT → WON/LOST</li>
              <li>✅ Duplicate detection (same guest = update, not create)</li>
              <li>✅ Intent classification (info / price / availability / booking)</li>
              <li>✅ Lead scoring powered by AI</li>
            </ul>
            <p className="text-xs text-orange-400 mt-4 italic">Coming soon - Database schema in progress</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsInbox;

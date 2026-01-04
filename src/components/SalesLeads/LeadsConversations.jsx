import React from 'react';
import { ArrowLeft, MessageSquare, Mail, Instagram, Globe, Brain } from 'lucide-react';

const LeadsConversations = ({ onBack }) => {
  return (
    <div className="flex-1 h-screen bg-[#2a2f3a] p-4 relative overflow-auto">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl border border-white/10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-6 h-6" />
              Conversations
            </h1>
            <p className="text-sm text-orange-400">WhatsApp · Email · Instagram · Web</p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
        <div className="text-center mb-6">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-orange-400" />
          <h3 className="text-2xl font-bold text-white mb-2">Unified Conversations Hub</h3>
          <p className="text-gray-300 mb-4">All guest conversations in one intelligent inbox</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-6 text-white">
            <MessageSquare className="w-10 h-10 mb-3" />
            <h4 className="font-bold mb-2">WhatsApp Conversations</h4>
            <p className="text-sm opacity-90">Real-time conversations with AI sentiment analysis</p>
            <div className="mt-3 text-xs bg-white/20 rounded px-2 py-1 inline-block">Most Active Channel</div>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white">
            <Mail className="w-10 h-10 mb-3" />
            <h4 className="font-bold mb-2">Email Threads</h4>
            <p className="text-sm opacity-90">Track email conversations with full history</p>
          </div>
          <div className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl p-6 text-white">
            <Instagram className="w-10 h-10 mb-3" />
            <h4 className="font-bold mb-2">Instagram DMs</h4>
            <p className="text-sm opacity-90">Social media inquiries in one place</p>
          </div>
          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl p-6 text-white">
            <Globe className="w-10 h-10 mb-3" />
            <h4 className="font-bold mb-2">Website Forms</h4>
            <p className="text-sm opacity-90">Contact form submissions tracked</p>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-6 border border-white/20">
          <div className="flex items-start gap-3 mb-4">
            <Brain className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm text-white font-semibold mb-2">AI-Powered Conversation Intelligence:</p>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>✅ <strong>Sentiment Analysis:</strong> Detect if guest is happy, frustrated, or confused</li>
                <li>✅ <strong>Intent Detection:</strong> Classify messages (info request / pricing / complaint / booking)</li>
                <li>✅ <strong>Suggested Responses:</strong> AI suggests best reply based on context</li>
                <li>✅ <strong>Auto-Translation:</strong> Conversations in any language</li>
                <li>✅ <strong>Conversation History:</strong> Full timeline with BANYU.AI and human responses</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-orange-400 mt-4 italic">Coming soon - Unified inbox with AI-suggested responses</p>
        </div>
      </div>
    </div>
  );
};

export default LeadsConversations;

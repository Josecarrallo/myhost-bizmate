import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Search,
  MessageSquare,
  Bot,
  Clock,
  Send,
  Filter,
  X,
  CheckCheck,
  Sparkles,
  User,
  Calendar,
  Mic,
  Image as ImageIcon,
  Play,
  Pause,
  Volume2
} from 'lucide-react';
import { supabaseService } from '../../services/supabase';

const Messages = ({ onBack }) => {
  const [messageText, setMessageText] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unread, ai-handled
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    unread: 0,
    aiHandled: 0,
    voiceMessages: 0,
    photoMessages: 0,
    avgResponseTime: '8m'
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const messages = await supabaseService.getMessages();

      // Transform messages to conversation format
      const transformedConversations = messages.map((msg, index) => {
        const initials = msg.guest_name
          ? msg.guest_name.split(' ').map(n => n[0]).join('').toUpperCase()
          : 'GU';

        // Calculate relative time
        const sentDate = new Date(msg.sent_at);
        const now = new Date();
        const diffMs = now - sentDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        let timeAgo;
        if (diffMins < 60) timeAgo = `${diffMins}m ago`;
        else if (diffHours < 24) timeAgo = `${diffHours}h ago`;
        else if (diffDays === 1) timeAgo = '1d ago';
        else if (diffDays < 7) timeAgo = `${diffDays}d ago`;
        else timeAgo = `${Math.floor(diffDays / 7)}w ago`;

        return {
          id: index + 1,
          name: msg.guest_name || 'Guest',
          property: 'Property',
          message: msg.message_type === 'voice' ? `🎤 Voice message: ${msg.message_text || 'Voice message'}` :
                   msg.message_type === 'photo' ? `📷 Photo: ${msg.message_text || 'Photo message'}` :
                   msg.message_text,
          time: timeAgo,
          unread: msg.status === 'unread',
          avatar: initials,
          aiHandled: msg.ai_handled || false,
          checkIn: '-',
          status: msg.status === 'unread' ? 'pending' : 'confirmed',
          messageType: msg.message_type,
          voiceDuration: msg.message_type === 'voice' ? '0:15' : undefined,
          photoUrl: msg.media_url
        };
      });

      setConversations(transformedConversations);

      // Calculate stats
      const unreadCount = transformedConversations.filter(c => c.unread).length;
      const aiHandledCount = transformedConversations.filter(c => c.aiHandled).length;
      const voiceCount = transformedConversations.filter(c => c.messageType === 'voice').length;
      const photoCount = transformedConversations.filter(c => c.messageType === 'photo').length;

      setStats({
        unread: unreadCount,
        aiHandled: aiHandledCount,
        voiceMessages: voiceCount,
        photoMessages: photoCount,
        avgResponseTime: '8m'
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading messages:', error);
      setLoading(false);
    }
  };

  const aiTemplates = [
    { id: 1, name: "Check-in Info", icon: "🏠", template: "Hi! Your check-in is confirmed for [DATE] at 2:00 PM. Your access code is [CODE]. The property address is [ADDRESS]. Let us know if you need anything!" },
    { id: 2, name: "WiFi Password", icon: "📶", template: "Hi! Here's the WiFi information:\nNetwork: [PROPERTY_WIFI]\nPassword: [PASSWORD]\n\nLet us know if you need any help!" },
    { id: 3, name: "Late Check-out", icon: "🕐", template: "Hi! We can accommodate a late check-out until [TIME] for an additional fee of $[AMOUNT]. Would you like to proceed?" },
    { id: 4, name: "Parking Info", icon: "🚗", template: "Hi! Yes, we have [NUMBER] parking spaces available at the property. Parking is complimentary for all guests." },
    { id: 5, name: "Pet Policy", icon: "🐕", template: "Hi! Unfortunately, pets are not allowed at this property due to allergies of other guests. We apologize for the inconvenience." },
    { id: 6, name: "Airport Transfer", icon: "✈️", template: "Hi! Airport transfer is available for $[PRICE] one way. It includes a private driver and takes approximately [TIME] minutes. Would you like to book it?" },
    { id: 7, name: "Voice Response", icon: "🎤", template: "Thanks for your voice message! I understood: '[TRANSCRIBED_TEXT]'. [AI_RESPONSE]" },
    { id: 8, name: "Photo Response", icon: "📷", template: "Thanks for sending the photo! I can see [AI_PHOTO_DESCRIPTION]. [AI_RESPONSE_TO_PHOTO]" }
  ];

  const fullConversation = [
    { sender: "guest", text: "Hi! I'd like to know if early check-in is possible for my reservation next week?", time: "10:30 AM", type: "text" },
    { sender: "ai", text: "Hi Emma! Let me check the availability for early check-in. One moment please.", time: "10:32 AM", type: "text" },
    { sender: "ai", text: "Good news! We can accommodate early check-in at 11:00 AM on Dec 10th. There's no additional charge. Does that work for you?", time: "10:35 AM", type: "text" },
    { sender: "guest", text: "🎤 Voice message (0:08)", time: "10:36 AM", type: "voice", voiceText: "Perfect! Thank you so much!" },
    { sender: "ai", text: "Thanks for your voice message! I heard: 'Perfect! Thank you so much!'\n\nYou're welcome! See you soon! 🏠", time: "10:37 AM", type: "text", isVoiceResponse: true }
  ];

  const filteredConversations = conversations.filter(conv => {
    const matchesFilter = filter === 'all' ||
      (filter === 'unread' && conv.unread) ||
      (filter === 'ai-handled' && conv.aiHandled);

    const matchesSearch = searchQuery === '' ||
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleTemplateClick = (template) => {
    setMessageText(template.template);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2a2f3a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl font-bold">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2a2f3a] flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-[#d85a2a]/5 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Header */}
      <div className="bg-[#1f2937]/95 backdrop-blur-sm border-b-2 border-[#d85a2a]/20 p-4 relative z-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-[#FF8C42] hover:text-orange-500 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-black text-[#FF8C42] mb-1">WhatsApp IA</h2>
            <p className="text-sm md:text-base font-semibold text-orange-500">AI-Powered Messaging</p>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#d85a2a]/20 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-6 h-6 text-[#FF8C42]" />
                <span className="text-sm font-bold text-gray-600">Unread Messages</span>
              </div>
              <div className="text-3xl font-black text-[#FF8C42]">{stats.unread}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 border-2 border-[#d85a2a]/20 shadow-lg text-white">
              <div className="flex items-center gap-3 mb-2">
                <Bot className="w-6 h-6" />
                <span className="text-sm font-bold opacity-90">AI Auto-Replies</span>
              </div>
              <div className="text-3xl font-black">{stats.aiHandled}</div>
              <div className="text-xs opacity-75 mt-1">+20% this week</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 border-2 border-[#d85a2a]/20 shadow-lg text-white">
              <div className="flex items-center gap-3 mb-2">
                <Mic className="w-6 h-6" />
                <span className="text-sm font-bold opacity-90">Voice Messages</span>
              </div>
              <div className="text-3xl font-black">{stats.voiceMessages}</div>
              <div className="text-xs opacity-75 mt-1">AI transcribed</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 border-2 border-[#d85a2a]/20 shadow-lg text-white">
              <div className="flex items-center gap-3 mb-2">
                <ImageIcon className="w-6 h-6" />
                <span className="text-sm font-bold opacity-90">Photo Messages</span>
              </div>
              <div className="text-3xl font-black">{stats.photoMessages}</div>
              <div className="text-xs opacity-75 mt-1">AI analyzed</div>
            </div>
            <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#d85a2a]/20 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-[#FF8C42]" />
                <span className="text-sm font-bold text-gray-600">Avg Response Time</span>
              </div>
              <div className="text-3xl font-black text-[#FF8C42]">{stats.avgResponseTime}</div>
              <div className="text-xs text-green-600 font-bold mt-1">-15% improvement</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-4 border-2 border-[#d85a2a]/20 shadow-lg">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none font-semibold text-gray-700"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-3 rounded-xl font-bold transition-all ${
                    filter === 'all'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({conversations.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-4 py-3 rounded-xl font-bold transition-all ${
                    filter === 'unread'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Unread ({stats.unread})
                </button>
                <button
                  onClick={() => setFilter('ai-handled')}
                  className={`px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                    filter === 'ai-handled'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  AI ({stats.aiHandled})
                </button>
              </div>
            </div>
          </div>

          {/* Conversations */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-[#d85a2a]/20 shadow-xl">
            <h3 className="text-xl font-black text-[#FF8C42] mb-4">Conversations</h3>
            <div className="space-y-3">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    conv.unread
                      ? 'bg-orange-50 border-orange-200 hover:bg-orange-100'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-black text-sm">
                      {conv.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h4 className="text-base font-black text-[#FF8C42]">{conv.name}</h4>
                          <p className="text-xs font-semibold text-gray-500">{conv.property}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {conv.messageType === 'voice' && (
                            <div className="px-2 py-1 bg-purple-100 rounded-lg flex items-center gap-1">
                              <Mic className="w-3 h-3 text-purple-600" />
                              <span className="text-xs font-bold text-purple-600">{conv.voiceDuration}</span>
                            </div>
                          )}
                          {conv.messageType === 'photo' && (
                            <div className="px-2 py-1 bg-blue-100 rounded-lg flex items-center gap-1">
                              <ImageIcon className="w-3 h-3 text-blue-600" />
                              <span className="text-xs font-bold text-blue-600">Photo</span>
                            </div>
                          )}
                          {conv.aiHandled && (
                            <div className="px-2 py-1 bg-orange-100 rounded-lg flex items-center gap-1">
                              <Bot className="w-3 h-3 text-[#FF8C42]" />
                              <span className="text-xs font-bold text-[#FF8C42]">AI</span>
                            </div>
                          )}
                          <span className="text-xs font-semibold text-gray-500">{conv.time}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 truncate">{conv.message}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span className="font-semibold">{conv.checkIn}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          conv.status === 'checked-in' ? 'bg-green-100 text-green-700' :
                          conv.status === 'checked-out' ? 'bg-gray-100 text-gray-700' :
                          conv.status === 'pending-extension' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {conv.status}
                        </span>
                      </div>
                    </div>
                    {conv.unread && (
                      <div className="flex-shrink-0 w-3 h-3 bg-orange-600 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Templates */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-[#d85a2a]/20 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-[#FF8C42]" />
              <h3 className="text-xl font-black text-[#FF8C42]">AI Quick Response Templates</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {aiTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  className={`p-4 border-2 rounded-xl transition-all text-left ${
                    template.id === 7
                      ? 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200'
                      : template.id === 8
                      ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200'
                      : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:from-orange-100 hover:to-orange-200'
                  }`}
                >
                  <div className="text-2xl mb-2">{template.icon}</div>
                  <div className={`text-sm font-bold ${
                    template.id === 7 ? 'text-purple-600' :
                    template.id === 8 ? 'text-blue-600' :
                    'text-[#FF8C42]'
                  }`}>{template.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-[#d85a2a]/20 shadow-xl">
            <div className="flex flex-col gap-3">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message or select an AI template..."
                rows="3"
                className="w-full px-4 py-3 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none text-gray-900 font-medium resize-none"
              ></textarea>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setMessageText('')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                >
                  Clear
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-bold">
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conversation Modal */}
      {selectedConversation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1f2937] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#d85a2a]/10 rounded-full flex items-center justify-center text-white font-black">
                    {selectedConversation.avatar}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">{selectedConversation.name}</h3>
                    <p className="text-sm text-white/80 font-semibold">{selectedConversation.property}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="w-10 h-10 bg-[#d85a2a]/10 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Guest Info */}
              <div className="bg-orange-50 rounded-2xl p-4 border-2 border-orange-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-bold text-[#FF8C42]">Check-in</span>
                    <p className="text-sm font-black text-gray-700">{selectedConversation.checkIn}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#FF8C42]">Status</span>
                    <p className="text-sm font-black text-gray-700">{selectedConversation.status}</p>
                  </div>
                </div>
              </div>

              {/* Full Conversation */}
              <div className="space-y-3">
                {fullConversation.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'ai' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        msg.sender === 'ai'
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                          : msg.type === 'voice'
                          ? 'bg-purple-100 text-purple-900 border-2 border-purple-300'
                          : msg.type === 'photo'
                          ? 'bg-blue-100 text-blue-900 border-2 border-blue-300'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {msg.type === 'voice' && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                            <Mic className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 h-1 bg-purple-300 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                        </div>
                      )}
                      {msg.voiceText && (
                        <p className="text-xs italic mb-1 opacity-75">Transcribed: "{msg.voiceText}"</p>
                      )}
                      <p className="text-sm font-medium whitespace-pre-line">{msg.text}</p>
                      <div className={`flex items-center gap-1 mt-1 text-xs ${
                        msg.sender === 'ai' ? 'text-white/70' :
                        msg.type === 'voice' ? 'text-purple-600' :
                        msg.type === 'photo' ? 'text-blue-600' :
                        'text-gray-500'
                      }`}>
                        <span>{msg.time}</span>
                        {msg.sender === 'ai' && (
                          <>
                            <Bot className="w-3 h-3 ml-1" />
                            <CheckCheck className="w-3 h-3" />
                          </>
                        )}
                        {msg.isVoiceResponse && (
                          <span className="ml-1 text-xs">• AI Voice Response</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Reply */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a reply..."
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none font-medium"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-bold">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;

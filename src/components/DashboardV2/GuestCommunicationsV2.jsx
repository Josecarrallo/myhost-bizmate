import React, { useState } from 'react';
import {
  Search,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  Calendar,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Instagram,
  Facebook,
  Globe,
  CheckCheck
} from 'lucide-react';

// WhatsApp icon component
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const GuestCommunicationsV2 = ({ onNavigate }) => {
  const [activeChannel, setActiveChannel] = useState('all');
  const [selectedConversation, setSelectedConversation] = useState(0);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const channels = [
    { id: 'all', label: 'All', count: 24 },
    { id: 'whatsapp', label: 'WhatsApp', icon: WhatsAppIcon, count: 12 },
    { id: 'instagram', label: 'Instagram', icon: Instagram, count: 5 },
    { id: 'facebook', label: 'Facebook', icon: Facebook, count: 3 },
    { id: 'email', label: 'Email', icon: Mail, count: 2 },
    { id: 'sms', label: 'SMS', icon: MessageSquare, count: 1 },
    { id: 'webchat', label: 'Web Chat', icon: Globe, count: 1 }
  ];

  const conversations = [
    {
      id: 1,
      name: 'Sarah Thompson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Hi! Can we stay until 2pm tomorrow?',
      time: '11:42 AM',
      channel: 'whatsapp',
      unread: 2,
      villa: 'Ocean Villa',
      checkIn: '24 Sep 2026',
      checkOut: '28 Sep 2026',
      email: 'sarah.thompson@email.com',
      phone: '+1 555 123 4567',
      status: 'checked-in'
    },
    {
      id: 2,
      name: 'Daniel Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Thank you for the recommendation!',
      time: '10:30 AM',
      channel: 'whatsapp',
      unread: 0,
      villa: 'Garden Suite',
      checkIn: '25 Sep 2026',
      checkOut: '30 Sep 2026',
      email: 'daniel.kim@email.com',
      phone: '+82 10 1234 5678',
      status: 'arriving'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Is breakfast included?',
      time: '9:15 AM',
      channel: 'instagram',
      unread: 1,
      villa: 'Pool Villa',
      checkIn: '26 Sep 2026',
      checkOut: '29 Sep 2026',
      email: 'emma.wilson@email.com',
      phone: '+44 7700 900123',
      status: 'confirmed'
    },
    {
      id: 4,
      name: 'James Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Perfect, see you tomorrow!',
      time: 'Yesterday',
      channel: 'whatsapp',
      unread: 0,
      villa: 'Sunset Villa',
      checkIn: '27 Sep 2026',
      checkOut: '01 Oct 2026',
      email: 'james.chen@email.com',
      phone: '+86 138 0013 8000',
      status: 'confirmed'
    },
    {
      id: 5,
      name: 'Sophie Clarke',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Can you arrange airport transfer?',
      time: 'Yesterday',
      channel: 'email',
      unread: 0,
      villa: 'Beach House',
      checkIn: '28 Sep 2026',
      checkOut: '02 Oct 2026',
      email: 'sophie.clarke@email.com',
      phone: '+61 412 345 678',
      status: 'confirmed'
    },
    {
      id: 6,
      name: 'Michael Brown',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Thanks for the quick response',
      time: '2 days ago',
      channel: 'facebook',
      unread: 0,
      villa: 'Mountain View',
      checkIn: '29 Sep 2026',
      checkOut: '03 Oct 2026',
      email: 'michael.brown@email.com',
      phone: '+1 555 987 6543',
      status: 'confirmed'
    },
    {
      id: 7,
      name: 'Olivia Bennett',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Looking forward to our stay!',
      time: '3 days ago',
      channel: 'whatsapp',
      unread: 0,
      villa: 'Tropical Suite',
      checkIn: '30 Sep 2026',
      checkOut: '05 Oct 2026',
      email: 'olivia.bennett@email.com',
      phone: '+1 555 246 8135',
      status: 'confirmed'
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'guest',
      text: 'Hi! Can we stay until 2pm tomorrow? Our flight is in the late afternoon.',
      time: '11:42 AM',
      status: 'read'
    },
    {
      id: 2,
      sender: 'system',
      text: 'Late checkout request detected',
      time: '11:42 AM',
      type: 'notification'
    },
    {
      id: 3,
      sender: 'ai',
      text: 'Absolutely! We can arrange a late checkout until 2pm for you. There\'s no additional charge for this. Is there anything else you need before your departure?',
      time: '11:43 AM',
      status: 'sent',
      aiGenerated: true
    },
    {
      id: 4,
      sender: 'system',
      text: 'Recommendation: Approve until 14:00',
      time: '11:43 AM',
      type: 'recommendation'
    },
    {
      id: 5,
      sender: 'guest',
      text: 'That\'s perfect! Thank you so much!',
      time: '11:45 AM',
      status: 'read'
    },
    {
      id: 6,
      sender: 'guest',
      text: 'Can you also help arrange a car to the airport at 5pm?',
      time: '11:46 AM',
      status: 'read'
    }
  ];

  const selectedGuest = conversations[selectedConversation];

  // Current date/time
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'whatsapp':
        return <WhatsAppIcon className="w-3.5 h-3.5 text-green-500" />;
      case 'instagram':
        return <Instagram className="w-3.5 h-3.5 text-pink-500" />;
      case 'facebook':
        return <Facebook className="w-3.5 h-3.5 text-blue-500" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-gray-500" />;
      case 'sms':
        return <MessageSquare className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return <Globe className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  const getInitials = (name) => {
    const parts = name.split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'checked-in':
        return 'bg-green-100 text-green-700';
      case 'arriving':
        return 'bg-blue-100 text-blue-700';
      case 'confirmed':
        return 'bg-[#F4E9D2] text-[#8B6914]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex-1 h-screen bg-[#F7F5F0] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-[#F7F5F0] border-b border-[#E8E4DC] px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[#1a1a1a]">Guest Communications</h1>
            <p className="text-xs text-gray-500">Every guest. Every channel. One conversation.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-48 bg-white border border-[#E8E4DC] rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#B98A3D]"
              />
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white rounded-lg border border-[#E8E4DC]">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-600">{currentDate}</span>
              <span className="text-xs text-gray-400">{currentTime}</span>
            </div>
          </div>
        </div>

        {/* Channel Tabs */}
        <div className="flex items-center gap-1.5 mt-3">
          {channels.map(channel => (
            <button
              key={channel.id}
              onClick={() => setActiveChannel(channel.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeChannel === channel.id
                  ? 'bg-[#1a1a1a] text-white'
                  : 'bg-white border border-[#E8E4DC] text-gray-600 hover:border-[#B98A3D]'
              }`}
            >
              {channel.icon && <channel.icon className="w-3.5 h-3.5" />}
              <span>{channel.label}</span>
              {channel.count > 0 && (
                <span className={`px-1 py-0.5 rounded-full text-[10px] ${
                  activeChannel === channel.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {channel.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - 3 Panels */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Conversation List */}
        <div className="w-72 bg-white border-r border-[#E8E4DC] flex flex-col">
          {/* Search */}
          <div className="p-2 border-b border-[#E8E4DC]">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search guests, messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#F7F5F0] border border-[#E8E4DC] rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#B98A3D]"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv, idx) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(idx)}
                className={`w-full flex items-start gap-2.5 p-2.5 border-b border-[#E8E4DC] transition-colors text-left ${
                  selectedConversation === idx
                    ? 'bg-[#F4E9D2]/30'
                    : 'hover:bg-[#FAFAF8]'
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {conv.avatar ? (
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B98A3D] to-[#D7B46A] flex items-center justify-center text-white text-xs font-medium">
                      {getInitials(conv.name)}
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 p-0.5 bg-white rounded-full">
                    {getChannelIcon(conv.channel)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#1a1a1a] truncate">{conv.name}</span>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">{conv.time}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">{conv.lastMessage}</p>
                </div>

                {/* Unread Badge */}
                {conv.unread > 0 && (
                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[#B98A3D] text-white text-[10px] flex items-center justify-center">
                    {conv.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Center Panel - Chat */}
        <div className="flex-1 flex flex-col bg-[#F7F5F0]">
          {/* Chat Header */}
          <div className="bg-white border-b border-[#E8E4DC] px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {selectedGuest.avatar ? (
                <img
                  src={selectedGuest.avatar}
                  alt={selectedGuest.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B98A3D] to-[#D7B46A] flex items-center justify-center text-white text-xs font-medium">
                  {getInitials(selectedGuest.name)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-[#1a1a1a]">{selectedGuest.name}</span>
                  {getChannelIcon(selectedGuest.channel)}
                </div>
                <p className="text-[10px] text-gray-500">{selectedGuest.villa} • {selectedGuest.status}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <Phone className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <Video className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map(msg => (
              <div key={msg.id}>
                {msg.type === 'notification' ? (
                  <div className="flex justify-center">
                    <span className="px-2.5 py-0.5 bg-[#FEF3C7] text-[#92400E] text-[10px] rounded-full">
                      {msg.text}
                    </span>
                  </div>
                ) : msg.type === 'recommendation' ? (
                  <div className="flex justify-center">
                    <span className="px-2.5 py-0.5 bg-[#D1FAE5] text-[#065F46] text-[10px] rounded-full">
                      {msg.text}
                    </span>
                  </div>
                ) : msg.sender === 'guest' ? (
                  <div className="flex justify-start">
                    <div className="max-w-sm">
                      <div className="bg-white rounded-2xl rounded-tl-md px-3 py-2 shadow-sm">
                        <p className="text-xs text-[#1a1a1a]">{msg.text}</p>
                      </div>
                      <p className="text-[9px] text-gray-400 mt-0.5 ml-2">{msg.time}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <div className="max-w-sm">
                      <div className={`rounded-2xl rounded-tr-md px-3 py-2 ${
                        msg.aiGenerated
                          ? 'bg-gradient-to-r from-[#B98A3D] to-[#D7B46A] text-white'
                          : 'bg-[#DCF8C6]'
                      }`}>
                        {msg.aiGenerated && (
                          <div className="flex items-center gap-1 mb-0.5">
                            <span className="text-[9px] text-white/80">AI Generated</span>
                          </div>
                        )}
                        <p className={`text-xs ${msg.aiGenerated ? 'text-white' : 'text-[#1a1a1a]'}`}>
                          {msg.text}
                        </p>
                      </div>
                      <div className="flex items-center justify-end gap-1 mt-0.5 mr-2">
                        <p className="text-[9px] text-gray-400">{msg.time}</p>
                        <CheckCheck className="w-2.5 h-2.5 text-blue-500" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-[#E8E4DC] p-2">
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <Paperclip className="w-4 h-4 text-gray-400" />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 bg-[#F7F5F0] border border-[#E8E4DC] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#B98A3D]"
              />
              <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <Smile className="w-4 h-4 text-gray-400" />
              </button>
              <button className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B98A3D] to-[#D7B46A] flex items-center justify-center hover:opacity-90 transition-opacity">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Guest Profile */}
        <div className="w-72 bg-white border-l border-[#E8E4DC] flex flex-col overflow-y-auto">
          {/* Guest Header */}
          <div className="p-3 border-b border-[#E8E4DC] text-center">
            {selectedGuest.avatar ? (
              <img
                src={selectedGuest.avatar}
                alt={selectedGuest.name}
                className="w-16 h-16 mx-auto rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#B98A3D] to-[#D7B46A] flex items-center justify-center text-white text-xl font-medium">
                {getInitials(selectedGuest.name)}
              </div>
            )}
            <h3 className="mt-2 text-sm font-semibold text-[#1a1a1a]">{selectedGuest.name}</h3>
            <span className={`inline-flex mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(selectedGuest.status)}`}>
              {selectedGuest.status.replace('-', ' ')}
            </span>
          </div>

          {/* Contact Info */}
          <div className="p-3 border-b border-[#E8E4DC] space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-600 truncate">{selectedGuest.email}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-600">{selectedGuest.phone}</span>
            </div>
          </div>

          {/* Current Stay */}
          <div className="p-3 border-b border-[#E8E4DC]">
            <h4 className="text-xs font-medium text-[#1a1a1a] mb-2">Current Villa</h4>
            <div className="bg-[#F7F5F0] rounded-lg p-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B98A3D]/20 to-[#D7B46A]/20 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#B98A3D]" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#1a1a1a]">{selectedGuest.villa}</p>
                  <p className="text-[10px] text-gray-500">Izumi Hotel & Villas</p>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                <div className="bg-white rounded-md p-1.5">
                  <p className="text-[9px] text-gray-400 uppercase">Check-in</p>
                  <p className="text-[11px] font-medium text-[#1a1a1a]">{selectedGuest.checkIn}</p>
                </div>
                <div className="bg-white rounded-md p-1.5">
                  <p className="text-[9px] text-gray-400 uppercase">Check-out</p>
                  <p className="text-[11px] font-medium text-[#1a1a1a]">{selectedGuest.checkOut}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-3">
            <h4 className="text-xs font-medium text-[#1a1a1a] mb-2">Recent Activity</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-[#F4E9D2] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-3 h-3 text-[#B98A3D]" />
                </div>
                <div>
                  <p className="text-[11px] text-[#1a1a1a]">Requested late checkout</p>
                  <p className="text-[10px] text-gray-400">Today, 11:42 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-[#D1FAE5] flex items-center justify-center flex-shrink-0">
                  <CheckCheck className="w-3 h-3 text-green-600" />
                </div>
                <div>
                  <p className="text-[11px] text-[#1a1a1a]">Checked in successfully</p>
                  <p className="text-[10px] text-gray-400">Sep 24, 2:30 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-[#F4E9D2] flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-3 h-3 text-[#B98A3D]" />
                </div>
                <div>
                  <p className="text-[11px] text-[#1a1a1a]">First message received</p>
                  <p className="text-[10px] text-gray-400">Sep 20, 10:15 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestCommunicationsV2;

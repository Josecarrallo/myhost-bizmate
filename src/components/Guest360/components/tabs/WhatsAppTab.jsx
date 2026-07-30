import React from 'react';
import {
  MessageCircle,
  Bot,
  User,
  Phone,
  ExternalLink,
} from 'lucide-react';
import { EmptyState } from '../shared';

/**
 * WhatsAppTab - Historial de conversaciones WhatsApp del huésped
 */
const WhatsAppTab = ({ conversations = [], guestPhone }) => {
  if (conversations.length === 0) {
    return (
      <div className="bg-[#333b47] rounded-2xl border border-white/10 p-5">
        <EmptyState
          icon={MessageCircle}
          title="No Conversations"
          description="No WhatsApp conversations found for this guest"
        />
        {guestPhone && (
          <div className="mt-4 text-center">
            <a
              href={`https://wa.me/${guestPhone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-xl hover:bg-[#20BD5A] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Start Conversation
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    );
  }

  // Format time
  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Group messages by date
  const groupedByDate = conversations.reduce((groups, msg) => {
    const date = formatDate(msg.created_at || msg.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(msg);
    return groups;
  }, {});

  return (
    <div className="space-y-4">
      {/* Header with action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#25D366]/20 rounded-lg">
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
          </div>
          <div>
            <p className="text-white font-medium">WhatsApp History</p>
            <p className="text-xs text-[#8a93a1]">{conversations.length} messages</p>
          </div>
        </div>

        {guestPhone && (
          <a
            href={`https://wa.me/${guestPhone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-white text-sm rounded-lg hover:bg-[#20BD5A] transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            Open Chat
          </a>
        )}
      </div>

      {/* Messages grouped by date */}
      <div className="bg-[#333b47] rounded-2xl border border-white/10 overflow-hidden">
        {Object.entries(groupedByDate).map(([date, messages]) => (
          <div key={date}>
            {/* Date header */}
            <div className="px-5 py-2 bg-[#2c333e] border-b border-white/5">
              <p className="text-xs text-[#8a93a1] text-center">{date}</p>
            </div>

            {/* Messages */}
            <div className="p-4 space-y-3">
              {messages.map((msg, idx) => {
                const isInbound = msg.direction === 'inbound' || msg.from_guest;
                const isBot = msg.from_bot || msg.is_ai_response;

                return (
                  <div
                    key={msg.id || idx}
                    className={`flex ${isInbound ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`
                        max-w-[80%] rounded-2xl px-4 py-2
                        ${isInbound
                          ? 'bg-[#3a434f] text-white rounded-bl-md'
                          : isBot
                            ? 'bg-[#f5791f]/20 text-[#f5791f] rounded-br-md'
                            : 'bg-[#25D366]/20 text-[#25D366] rounded-br-md'
                        }
                      `}
                    >
                      {/* Sender indicator */}
                      <div className="flex items-center gap-1 mb-1">
                        {isInbound ? (
                          <User className="w-3 h-3 text-[#8a93a1]" />
                        ) : isBot ? (
                          <Bot className="w-3 h-3 text-[#f5791f]" />
                        ) : (
                          <User className="w-3 h-3 text-[#25D366]" />
                        )}
                        <span className="text-[10px] text-[#8a93a1]">
                          {isInbound ? 'Guest' : isBot ? 'BANYU' : 'Owner'}
                        </span>
                      </div>

                      {/* Message content */}
                      <p className="text-sm whitespace-pre-wrap">
                        {msg.content || msg.message || msg.body}
                      </p>

                      {/* Time */}
                      <p className="text-[10px] text-[#6d7683] mt-1 text-right">
                        {formatTime(msg.created_at || msg.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatsAppTab;

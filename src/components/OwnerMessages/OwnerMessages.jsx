import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Search,
  MessageSquare,
  Phone,
  Mic,
  MicOff,
  Bot,
  User,
  Calendar,
  X,
  RefreshCw,
  Globe,
  Clock,
  CheckCheck,
  AlertCircle,
  Instagram,
  Facebook,
  Monitor,
  Bell,
  Menu,
  PanelLeftOpen,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { supabaseService } from '../../services/supabase';

// Real brand SVG logos
const WhatsAppLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const InstagramLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

/**
 * OwnerMessages V1 - Read-only view of WhatsApp conversations
 *
 * Features:
 * - List of conversations grouped by phone/guest
 * - Search by guest name, phone, or booking code
 * - Filters: date range, channel, status
 * - Conversation thread with bubbles
 * - KORA calls and voice notes support
 * - Real-time updates via Supabase realtime
 */
const OwnerMessages = ({ onBack, userData, setSidebarCollapsed, sidebarCollapsed }) => {
  // Auto-collapse sidebar on mount for full-screen view
  useEffect(() => {
    if (setSidebarCollapsed) {
      setSidebarCollapsed(true);
    }
    // Restore sidebar when leaving this view
    return () => {
      if (setSidebarCollapsed) {
        setSidebarCollapsed(false);
      }
    };
  }, [setSidebarCollapsed]);

  // State
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationThread, setConversationThread] = useState([]);
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [error, setError] = useState(null);

  // New messages notification (instead of auto-reload)
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [newMessagesByChannel, setNewMessagesByChannel] = useState({ whatsapp: 0, voice: 0 });
  const [showNewMessagesDropdown, setShowNewMessagesDropdown] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('all'); // all, whatsapp, voice

  // Date range - PRIMARY filter, defaults to last 30 days
  const getDefaultDateFrom = () => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  };
  const getDefaultDateTo = () => {
    return new Date().toISOString().split('T')[0];
  };
  const [dateFrom, setDateFrom] = useState(getDefaultDateFrom);
  const [dateTo, setDateTo] = useState(getDefaultDateTo);
  const [isSearchMode, setIsSearchMode] = useState(false); // When searching, ignore date range

  // Admin-only tenant filter (users.id IS tenant_id in this project)
  const isAdmin = userData?.is_admin === true;
  const TENANTS = [
    { id: 'c24393db-d318-4d75-8bbf-0fa240b9c1db', name: 'Izumi Hotel' },
    { id: '77982108-408a-433c-9b56-7fb89088bc8e', name: 'Zentara Living' },
    { id: '1f32d384-4018-46a9-a6f9-058217e6924a', name: 'Nismara Uma Villa' }
  ];
  const [selectedTenant, setSelectedTenant] = useState(TENANTS[0].id); // Default to Izumi for admin

  // Refs
  const threadEndRef = useRef(null);
  const newMessagesDropdownRef = useRef(null);

  // Load conversations on mount and when tenant changes
  useEffect(() => {
    loadConversations();
  }, [selectedTenant, isAdmin, userData?.id]);

  // Subscribe to realtime updates
  useEffect(() => {
    const tenantId = isAdmin ? selectedTenant : userData?.id;
    const unsubscribe = supabaseService.subscribeToWhatsAppMessages((payload) => {
      const newMsg = payload.new;
      const channel = newMsg?.channel || 'whatsapp';

      // Update conversation list - move this conversation to top and update last message
      setConversations(prevConversations => {
        const phoneNumber = newMsg?.phone_number;
        if (!phoneNumber) return prevConversations;

        const existingIndex = prevConversations.findIndex(c => c.phone_number === phoneNumber);

        if (existingIndex >= 0) {
          const updatedConversations = [...prevConversations];
          const conv = { ...updatedConversations[existingIndex] };
          conv.last_message = newMsg;
          conv.messages = [...(conv.messages || []), newMsg];
          if (!conv.channels?.includes(channel)) {
            conv.channels = [...(conv.channels || []), channel];
          }
          updatedConversations.splice(existingIndex, 1);
          return [conv, ...updatedConversations];
        } else {
          const newConv = {
            phone_number: phoneNumber,
            channels: [channel],
            guest_name: newMsg.guest_name || 'Guest',
            last_message: newMsg,
            messages: [newMsg],
            language_detected: newMsg.language_detected
          };
          return [newConv, ...prevConversations];
        }
      });

      // Increment new messages counter for notification badge
      setNewMessagesCount(prev => prev + 1);
      setNewMessagesByChannel(prev => ({
        ...prev,
        [channel]: (prev[channel] || 0) + 1
      }));

      // If viewing this conversation, add message to thread directly
      if (selectedConversation && newMsg?.phone_number === selectedConversation.phone_number) {
        setConversationThread(prev => [...prev, newMsg]);
      }
    }, tenantId);

    return () => {
      unsubscribe();
    };
  }, [selectedConversation, selectedTenant, isAdmin, userData?.id]);

  // Scroll to bottom when thread changes
  useEffect(() => {
    if (threadEndRef.current) {
      threadEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationThread]);

  const loadConversations = async (searchMode = false) => {
    try {
      setLoading(true);
      setError(null);
      // Admin uses selected tenant, non-admin uses their own user.id (which IS tenant_id)
      const tenantId = isAdmin ? selectedTenant : userData?.id;

      let data;
      if (searchMode && searchQuery.trim()) {
        // Search mode: search ALL history, ignore date range
        data = await supabaseService.searchWhatsAppConversations(tenantId, searchQuery.trim());
        setIsSearchMode(true);
      } else {
        // Normal mode: filter by date range
        data = await supabaseService.getWhatsAppConversationsList(tenantId, dateFrom, dateTo);
        setIsSearchMode(false);
      }

      // Resolve real guest names from bookings/guests by phone number
      // In search mode, only resolve names for results that DON'T match the search query
      // (so if user searches "Guest", they see "Guest" not the resolved name)
      if (data && data.length > 0) {
        const phoneNumbers = data.map(c => c.phone_number).filter(Boolean);
        const guestNames = await supabaseService.resolveGuestNamesByPhone(phoneNumbers, tenantId);

        // Enrich conversations with real names
        const searchLower = searchMode ? searchQuery.trim().toLowerCase() : '';
        data.forEach(conv => {
          if (conv.phone_number && guestNames[conv.phone_number]) {
            // In search mode, check if original guest_name matched the search
            // If so, keep original to show what was found
            const originalName = conv.guest_name || '';
            const matchedByName = searchMode && originalName.toLowerCase().includes(searchLower);

            if (!matchedByName) {
              // Safe to replace with resolved name
              conv.guest_name = guestNames[conv.phone_number];
            }
            // Store resolved name separately for display in thread header
            conv.resolved_guest_name = guestNames[conv.phone_number];
          }
        });
      }
      setConversations(data || []);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  // Load new messages and clear counter
  const handleLoadNewMessages = () => {
    loadConversations();
    setNewMessagesCount(0);
    setNewMessagesByChannel({ whatsapp: 0, voice: 0 });
    setShowNewMessagesDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (newMessagesDropdownRef.current && !newMessagesDropdownRef.current.contains(event.target)) {
        setShowNewMessagesDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadConversationThread = async (phoneNumber, channel = null) => {
    try {
      setThreadLoading(true);
      // Admin uses selected tenant, non-admin uses their own user.id (which IS tenant_id)
      const tenantId = isAdmin ? selectedTenant : userData?.id;
      // Load all messages for this phone (WhatsApp + KORA unified)
      const data = await supabaseService.getWhatsAppConversation(phoneNumber, channel, tenantId);
      setConversationThread(data || []);

      // Mark as read - use 'whatsapp' as default channel for read state
      if (userData?.id) {
        await supabaseService.updateConversationReadState('whatsapp', phoneNumber, userData.id);
      }
    } catch (err) {
      console.error('Error loading thread:', err);
    } finally {
      setThreadLoading(false);
    }
  };

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    // No channel filter - load all messages (WhatsApp + KORA unified)
    loadConversationThread(conv.phone_number, null);
  };

  // Delete entire conversation
  const handleDeleteConversation = async (conv, e) => {
    e.stopPropagation(); // Don't select the conversation
    const guestDisplay = conv.guest_name || conv.phone_number;
    const confirmDelete = window.confirm(
      `Delete conversation with ${guestDisplay}?\n\nThis will remove all messages from your records. The guest will still have the messages on their phone.`
    );
    if (!confirmDelete) return;

    try {
      const tenantId = isAdmin ? selectedTenant : userData?.id;
      console.log('Deleting conversation:', { phone: conv.phone_number, tenantId });

      const result = await supabaseService.deleteWhatsAppConversation(conv.phone_number, tenantId);
      console.log('Delete result:', result);

      // Remove from local state
      setConversations(prev => prev.filter(c => c.phone_number !== conv.phone_number));

      // Clear selection if this was the selected conversation
      if (selectedConversation?.phone_number === conv.phone_number) {
        setSelectedConversation(null);
        setConversationThread([]);
      }
    } catch (err) {
      console.error('Error deleting conversation:', err);
      // Show the actual error message
      const errorMsg = err?.message || 'Unknown error';
      alert(`Error deleting conversation:\n${errorMsg}`);
    }
  };

  // Delete single message
  const handleDeleteMessage = async (msg) => {
    const confirmDelete = window.confirm(
      'Delete this message?\n\nThe guest will still have this message on their phone.'
    );
    if (!confirmDelete) return;

    try {
      console.log('Deleting message:', msg.id);
      await supabaseService.deleteWhatsAppMessage(msg.id);

      // Remove from thread
      setConversationThread(prev => prev.filter(m => m.id !== msg.id));

      // Update conversation list (update last_message if needed)
      setConversations(prev => prev.map(conv => {
        if (conv.phone_number === selectedConversation?.phone_number) {
          const updatedMessages = conv.messages.filter(m => m.id !== msg.id);
          return {
            ...conv,
            messages: updatedMessages,
            last_message: updatedMessages[0] || null
          };
        }
        return conv;
      }));
    } catch (err) {
      console.error('Error deleting message:', err);
      const errorMsg = err?.message || 'Unknown error';
      alert(`Error deleting message:\n${errorMsg}`);
    }
  };

  // Filter conversations
  // Channel filter now checks if conversation CONTAINS messages of selected channel type
  // (not filtering whole conversations, just showing those with at least one matching message)
  const filteredConversations = conversations.filter(conv => {
    // Channel filter - show conversation if it contains ANY message of selected channel
    if (channelFilter !== 'all') {
      // BANYU = WhatsApp messages (channel === 'whatsapp' and NOT voice_call type)
      if (channelFilter === 'whatsapp') {
        const hasWhatsAppMessages = conv.messages?.some(m =>
          m.channel === 'whatsapp' && m.message_type !== 'voice_call'
        );
        if (!hasWhatsAppMessages) return false;
      }
      // KORA = Voice calls (channel === 'voice' OR message_type === 'voice_call')
      if (channelFilter === 'voice') {
        const hasKoraContent = conv.messages?.some(m =>
          m.channel === 'voice' || m.message_type === 'voice_call'
        );
        if (!hasKoraContent) return false;
      }
    }

    // In search mode, data already filtered by Supabase - no additional filtering needed
    // Search mode ignores date range (searches all history)
    if (isSearchMode) {
      return true;
    }

    // Date filters (only in normal mode, not search mode)
    if (dateFrom) {
      const msgDate = new Date(conv.last_message?.created_at);
      const fromDate = new Date(dateFrom);
      if (msgDate < fromDate) return false;
    }
    if (dateTo) {
      const msgDate = new Date(conv.last_message?.created_at);
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      if (msgDate > toDate) return false;
    }

    return true;
  });

  // Format relative time
  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format phone number for display
  const formatPhone = (phone) => {
    if (!phone) return '';
    // Add + prefix if not present
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length > 10) {
      return `+${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 5)} ${cleanPhone.slice(5, 8)} ${cleanPhone.slice(8)}`;
    }
    return phone;
  };

  // Format snippet for conversation list (fixes bug b + c from spec 6.3)
  const formatSnippet = (msg) => {
    if (!msg) return 'No messages';

    // Bug c: KORA calls show "KORA call · language" not the summary
    if (msg.message_type === 'voice_call') {
      const lang = msg.language_detected || 'EN';
      return `KORA call · ${lang.toUpperCase()}`;
    }

    // System messages (catalog cards, etc.)
    if (msg.message_text?.startsWith('[CATALOG_CARD]')) {
      const villaCount = msg.message_text.match(/\d+/)?.[0] || '?';
      return `Catalog card sent · ${villaCount} villas`;
    }
    if (msg.message_text?.startsWith('[')) {
      return 'System message';
    }

    // Bug b: Outbound messages need author prefix
    if (msg.direction === 'outbound') {
      const text = msg.message_text || '';
      const truncated = text.length > 50 ? text.slice(0, 50) + '...' : text;

      switch (msg.sent_by_agent) {
        case 'banyu':
          return `BANYU: ${truncated}`;
        case 'kora':
          return `KORA: ${truncated}`;
        case 'owner':
          return `Tú: ${truncated}`;
        default:
          return truncated;
      }
    }

    // Inbound messages (from guest) - no prefix
    return msg.message_text || 'No messages';
  };

  // Get channel icon
  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'whatsapp':
        return <MessageSquare className="w-3 h-3 text-[#25A56A]" />;
      case 'voice':
        return <Phone className="w-3 h-3 text-[#0EA5A5]" />;
      default:
        return <MessageSquare className="w-3 h-3 text-gray-400" />;
    }
  };

  // Render message bubble
  const renderMessageBubble = (msg, index) => {
    const isInbound = msg.direction === 'inbound';
    const isVoiceCall = msg.message_type === 'voice_call';
    const isAudio = msg.message_type === 'audio';
    const isCatalogCard = msg.message_text?.startsWith('[CATALOG_CARD]');
    const isAudioFailed = msg.message_text === '[AUDIO_FAILED]';

    // System pills (KORA calls, catalog cards)
    if (isVoiceCall) {
      return (
        <div key={msg.id || index} className="flex justify-center my-4">
          <div className="bg-[#0EA5A5]/20 border border-[#0EA5A5]/30 rounded-xl px-4 py-3 max-w-md">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4 text-[#0EA5A5]" />
              <span className="text-xs font-semibold text-[#0EA5A5]">
                KORA call · {msg.language_detected || 'English'}
              </span>
            </div>
            {msg.message_text && (
              <p className="text-sm text-[#EAF0F7]">{msg.message_text}</p>
            )}
            <p className="text-[10px] text-[#93A4B8] mt-2">
              {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      );
    }

    // Catalog card pill
    if (isCatalogCard) {
      const villaCount = msg.message_text.match(/\d+/)?.[0] || '?';
      return (
        <div key={msg.id || index} className="flex justify-center my-3">
          <div className="bg-[#212E40] border border-[#93A4B8]/20 rounded-full px-4 py-2 flex items-center gap-2">
            <Bot className="w-3 h-3 text-[#F7B678]" />
            <span className="text-xs text-[#93A4B8]">Catalog card sent · {villaCount} villas</span>
          </div>
        </div>
      );
    }

    // Regular message bubbles
    return (
      <div
        key={msg.id || index}
        className={`group flex ${isInbound ? 'justify-start' : 'justify-end'} mb-3`}
      >
        {/* Delete button (left side for outbound) */}
        {!isInbound && (
          <button
            onClick={() => handleDeleteMessage(msg)}
            className="self-center mr-2 p-1.5 text-[#93A4B8] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            title="Eliminar mensaje"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
        <div
          className={`max-w-[65%] rounded-2xl px-4 py-3 ${
            isInbound
              ? 'bg-[#26344A] text-[#EAF0F7]'
              : 'bg-[#5A3A1B] text-[#EAF0F7]'
          }`}
        >
          {/* Voice note marker */}
          {isAudio && !isAudioFailed && (
            <div className="flex items-center gap-1 mb-2">
              <Mic className="w-3 h-3 text-[#93A4B8]" />
              <span className="text-[11px] text-[#93A4B8]">Voice note · transcribed</span>
            </div>
          )}

          {/* Audio failed marker */}
          {isAudioFailed && (
            <div className="flex items-center gap-1">
              <MicOff className="w-3 h-3 text-[#93A4B8]" />
              <span className="text-sm italic text-[#93A4B8]">Voice note, no transcription</span>
            </div>
          )}

          {/* Message text */}
          {!isAudioFailed && msg.message_text && !msg.message_text.startsWith('[') && (
            <p className="text-sm whitespace-pre-wrap">{msg.message_text}</p>
          )}

          {/* Footer with time and author */}
          <div className={`flex items-center gap-2 mt-2 text-[10px] ${
            isInbound ? 'text-[#93A4B8]' : 'text-[#93A4B8]'
          }`}>
            <span>
              {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
            {!isInbound && (
              <>
                {msg.sent_by_agent === 'banyu' && (
                  <span className="text-[#F7B678] font-medium">BANYU</span>
                )}
                {msg.sent_by_agent === 'kora' && (
                  <span className="text-[#0EA5A5] font-medium">KORA</span>
                )}
                {msg.sent_by_agent === 'owner' && (
                  <span className="text-[#8FC8F6] font-medium">Owner</span>
                )}
                <CheckCheck className="w-3 h-3" />
              </>
            )}
          </div>
        </div>
        {/* Delete button (right side for inbound) */}
        {isInbound && (
          <button
            onClick={() => handleDeleteMessage(msg)}
            className="self-center ml-2 p-1.5 text-[#93A4B8] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            title="Eliminar mensaje"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex-1 h-screen bg-[#0E1621] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-[#F26F21] animate-spin mx-auto mb-4" />
          <p className="text-[#EAF0F7] font-medium">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen bg-[#0E1621] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-[#172234] border-b border-[#212E40] px-4 py-3">
        {/* Top row - Back button, title, and actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Sidebar toggle button (desktop only) */}
            {setSidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex p-2 hover:bg-[#212E40] rounded-lg transition-colors"
                title={sidebarCollapsed ? 'Show menu' : 'Hide menu'}
              >
                {sidebarCollapsed ? (
                  <Menu className="w-5 h-5 text-[#F26F21]" />
                ) : (
                  <PanelLeftOpen className="w-5 h-5 text-[#93A4B8]" />
                )}
              </button>
            )}
            <button
              onClick={onBack}
              className="p-2 hover:bg-[#212E40] rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#93A4B8]" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-[#F26F21]">Messages</h1>
          </div>

          {/* Right side - Tenant filter (admin only) + New messages notification */}
          <div className="flex items-center gap-3">
            {/* Admin-only tenant selector */}
            {isAdmin && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#93A4B8]">Tenant:</span>
                <select
                  value={selectedTenant}
                  onChange={(e) => {
                    setSelectedTenant(e.target.value);
                    setSelectedConversation(null); // Clear selected conversation on tenant change
                    setConversationThread([]); // Clear thread
                  }}
                  className="px-3 py-1.5 bg-[#212E40] border border-[#93A4B8]/30 rounded-lg text-sm text-[#EAF0F7] focus:outline-none focus:border-[#F26F21] cursor-pointer"
                >
                  {TENANTS.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* New messages dropdown */}
            {newMessagesCount > 0 && (
              <div ref={newMessagesDropdownRef} className="relative">
                <button
                  onClick={() => setShowNewMessagesDropdown(!showNewMessagesDropdown)}
                  className="flex items-center gap-2 px-3 py-2 bg-[#F26F21] hover:bg-[#E15E12] rounded-lg transition-colors"
                >
                  <Bell className="w-4 h-4 text-[#0E1621]" />
                  <span className="text-sm font-bold text-[#0E1621]">{newMessagesCount} new</span>
                </button>

                {/* Dropdown */}
                {showNewMessagesDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-[#212E40] border border-[#93A4B8]/20 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-[#93A4B8]/10">
                      <p className="text-xs font-semibold text-[#EAF0F7]">New messages received</p>
                    </div>
                    <div className="p-2 space-y-1">
                      {newMessagesByChannel.whatsapp > 0 && (
                        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#25A56A]/10">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-[#25A56A]" />
                            <span className="text-sm text-[#EAF0F7]">WhatsApp</span>
                          </div>
                          <span className="text-sm font-bold text-[#25A56A]">{newMessagesByChannel.whatsapp}</span>
                        </div>
                      )}
                      {newMessagesByChannel.voice > 0 && (
                        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#0EA5A5]/10">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-[#0EA5A5]" />
                            <span className="text-sm text-[#EAF0F7]">KORA</span>
                          </div>
                          <span className="text-sm font-bold text-[#0EA5A5]">{newMessagesByChannel.voice}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-2 border-t border-[#93A4B8]/10">
                      <button
                        onClick={handleLoadNewMessages}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#F26F21] hover:bg-[#E15E12] rounded-lg transition-colors"
                      >
                        <RefreshCw className="w-4 h-4 text-[#0E1621]" />
                        <span className="text-sm font-bold text-[#0E1621]">Load messages</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Manual refresh button (when no new messages) */}
            {newMessagesCount === 0 && (
              <button
                onClick={loadConversations}
                className="p-2 hover:bg-[#212E40] rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5 text-[#93A4B8]" />
              </button>
            )}
          </div>
        </div>

        {/* Channel badges - scrollable on mobile */}
        <div className="overflow-x-auto mt-3 pb-1 -mx-4 px-4">
          <div className="flex items-center gap-2 min-w-max">
            {/* Active channels */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#25D366]/20 border border-[#25D366]/40 rounded-lg">
              <WhatsAppLogo className="w-4 h-4 text-[#25D366]" />
              <span className="text-xs font-bold text-[#25D366]">WhatsApp</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#0EA5A5]/20 border border-[#0EA5A5]/40 rounded-lg">
              <Phone className="w-4 h-4 text-[#0EA5A5]" />
              <span className="text-xs font-bold text-[#0EA5A5]">KORA</span>
            </div>
            {/* Coming soon channels */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-[#833AB4]/10 via-[#E1306C]/10 to-[#F77737]/10 border border-[#E1306C]/30 rounded-lg opacity-60">
              <InstagramLogo className="w-4 h-4 text-[#E1306C]" />
              <span className="text-xs font-medium text-[#E1306C]">Instagram</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1877F2]/10 border border-[#1877F2]/30 rounded-lg opacity-60">
              <FacebookLogo className="w-4 h-4 text-[#1877F2]" />
              <span className="text-xs font-medium text-[#1877F2]">Facebook</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#5A6BF0]/10 border border-[#5A6BF0]/30 rounded-lg opacity-60">
              <Globe className="w-4 h-4 text-[#5A6BF0]" />
              <span className="text-xs font-medium text-[#5A6BF0]">Web</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content - Two panels */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel - Conversation list */}
        <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-[380px] md:min-w-[380px] border-r border-[#212E40] bg-[#0E1621]`}>
          {/* Date range selector - PRIMARY control */}
          <div className="p-3 border-b border-[#212E40]">
            {/* Date range - always visible */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1">
                <label className="block text-[10px] text-[#93A4B8] mb-1">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 bg-[#212E40] border border-[#212E40] rounded-lg text-xs text-[#EAF0F7] focus:outline-none focus:border-[#F26F21]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] text-[#93A4B8] mb-1">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 bg-[#212E40] border border-[#212E40] rounded-lg text-xs text-[#EAF0F7] focus:outline-none focus:border-[#F26F21]"
                />
              </div>
              <button
                onClick={() => {
                  setIsSearchMode(false);
                  setSearchQuery('');
                  loadConversations(false);
                }}
                className="mt-4 px-4 py-2 bg-[#F26F21] text-white text-xs font-medium rounded-lg hover:bg-[#E15E12] transition-colors"
              >
                Apply
              </button>
            </div>

            {/* Date shortcuts */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              <button
                onClick={() => {
                  const now = new Date();
                  const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
                  const to = now.toISOString().split('T')[0];
                  setDateFrom(from);
                  setDateTo(to);
                  setIsSearchMode(false);
                  setSearchQuery('');
                  // Auto-apply for shortcuts
                  loadConversations(false);
                }}
                className="px-2 py-1 text-[10px] bg-[#212E40] text-[#93A4B8] hover:text-[#EAF0F7] rounded transition-colors"
              >
                This month
              </button>
              <button
                onClick={() => {
                  const now = new Date();
                  const threeMonthsAgo = new Date(now);
                  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                  const from = threeMonthsAgo.toISOString().split('T')[0];
                  const to = now.toISOString().split('T')[0];
                  setDateFrom(from);
                  setDateTo(to);
                  setIsSearchMode(false);
                  setSearchQuery('');
                  loadConversations(false);
                }}
                className="px-2 py-1 text-[10px] bg-[#212E40] text-[#93A4B8] hover:text-[#EAF0F7] rounded transition-colors"
              >
                Last 3 months
              </button>
              <button
                onClick={() => {
                  const now = new Date();
                  const from = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
                  const to = now.toISOString().split('T')[0];
                  setDateFrom(from);
                  setDateTo(to);
                  setIsSearchMode(false);
                  setSearchQuery('');
                  loadConversations(false);
                }}
                className="px-2 py-1 text-[10px] bg-[#212E40] text-[#93A4B8] hover:text-[#EAF0F7] rounded transition-colors"
              >
                This year
              </button>
            </div>

            {/* Search bar - searches ALL history */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#93A4B8]" />
              <input
                type="text"
                placeholder="Search all history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    loadConversations(true); // Search mode
                  }
                }}
                className="w-full pl-10 pr-20 py-2.5 bg-[#212E40] border border-[#212E40] rounded-xl text-sm text-[#EAF0F7] placeholder-[#93A4B8] focus:outline-none focus:border-[#F26F21]"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchMode(false);
                    loadConversations(false);
                  }}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-[#93A4B8] hover:text-[#EAF0F7]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => searchQuery.trim() && loadConversations(true)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F26F21] hover:text-[#E15E12]"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Search mode indicator */}
            {isSearchMode && (
              <div className="flex items-center justify-between px-2 py-1.5 bg-[#F26F21]/10 border border-[#F26F21]/30 rounded-lg mb-3">
                <span className="text-[10px] text-[#F26F21]">
                  Searching all history for "{searchQuery}"
                </span>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchMode(false);
                    loadConversations(false);
                  }}
                  className="text-[#F26F21] hover:text-[#E15E12]"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Channel tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setChannelFilter('all')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                  channelFilter === 'all'
                    ? 'bg-[#F26F21] text-[#0E1621]'
                    : 'bg-[#212E40] text-[#93A4B8] hover:text-[#EAF0F7]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setChannelFilter('whatsapp')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                  channelFilter === 'whatsapp'
                    ? 'bg-[#25A56A] text-white'
                    : 'bg-[#212E40] text-[#93A4B8] hover:text-[#EAF0F7]'
                }`}
              >
                <MessageSquare className="w-3 h-3" />
                BANYU
              </button>
              <button
                onClick={() => setChannelFilter('voice')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                  channelFilter === 'voice'
                    ? 'bg-[#0EA5A5] text-white'
                    : 'bg-[#212E40] text-[#93A4B8] hover:text-[#EAF0F7]'
                }`}
              >
                <Phone className="w-3 h-3" />
                KORA
              </button>
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {error ? (
              <div className="p-4 text-center">
                <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="text-sm text-red-400">{error}</p>
                <button
                  onClick={loadConversations}
                  className="mt-2 text-xs text-[#F26F21] hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-[#212E40] mx-auto mb-3" />
                <p className="text-sm text-[#93A4B8]">No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((conv, index) => {
                const isSelected = selectedConversation?.phone_number === conv.phone_number;
                const hasKoraCall = conv.messages?.some(m => m.message_type === 'voice_call' || m.channel === 'voice');
                const hasBanyuMsg = conv.messages?.some(m => m.sent_by_agent === 'banyu' || (m.channel === 'whatsapp' && m.direction === 'outbound'));
                const hasMultipleChannels = conv.channels?.length > 1;

                return (
                  <div
                    key={conv.phone_number || index}
                    onClick={() => handleSelectConversation(conv)}
                    className={`group px-4 py-3 border-b border-[#212E40] cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#212E40]' : 'hover:bg-[#172234]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F26F21] to-[#E15E12] flex items-center justify-center text-[#0E1621] font-bold text-sm">
                          {conv.guest_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'GU'}
                        </div>
                        {/* Channel badge - shows channel of LAST message */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#0E1621] flex items-center justify-center">
                          {getChannelIcon(conv.last_message?.channel || 'whatsapp')}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-[#EAF0F7] truncate">
                            {conv.guest_name || 'Guest'}
                          </h3>
                          <span className="text-[10px] text-[#93A4B8] flex-shrink-0 ml-2">
                            {formatRelativeTime(conv.last_message?.created_at)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#93A4B8] mb-1.5">
                          <span>{formatPhone(conv.phone_number)}</span>
                          <span className="text-[#212E40]">•</span>
                          <span className="text-[#93A4B8]">
                            {conv.last_message?.created_at
                              ? new Date(conv.last_message.created_at).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })
                              : ''}
                          </span>
                        </div>

                        <p className="text-xs text-[#93A4B8] truncate">
                          {formatSnippet(conv.last_message)}
                        </p>

                        {/* Badges */}
                        <div className="flex items-center gap-2 mt-2">
                          {conv.language_detected && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-[#212E40] text-[#93A4B8] rounded">
                              {conv.language_detected.toUpperCase()}
                            </span>
                          )}
                          {hasBanyuMsg && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-[#F7B678]/20 text-[#F7B678] rounded flex items-center gap-1">
                              <Bot className="w-2.5 h-2.5" />
                              BANYU
                            </span>
                          )}
                          {hasKoraCall && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-[#0EA5A5]/20 text-[#0EA5A5] rounded flex items-center gap-1">
                              <Phone className="w-2.5 h-2.5" />
                              KORA
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Delete conversation button */}
                      <button
                        onClick={(e) => handleDeleteConversation(conv, e)}
                        className="flex-shrink-0 p-2 text-[#93A4B8] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Eliminar conversación"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right panel - Conversation thread */}
        <div className={`${selectedConversation ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-[#161F2C]`}>
          {selectedConversation ? (
            <>
              {/* Thread header */}
              <div className="bg-[#172234] border-b border-[#212E40] px-4 py-3">
                <div className="flex items-center gap-3">
                  {/* Back button (mobile) */}
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden p-2 hover:bg-[#212E40] rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#93A4B8]" />
                  </button>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F26F21] to-[#E15E12] flex items-center justify-center text-[#0E1621] font-bold text-sm">
                    {selectedConversation.guest_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'GU'}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h2 className="font-semibold text-[#EAF0F7]">
                      {selectedConversation.guest_name || 'Guest'}
                    </h2>
                    <p className="text-xs text-[#93A4B8] flex items-center gap-2">
                      {formatPhone(selectedConversation.phone_number)}
                      {selectedConversation.language_detected && (
                        <>
                          <span>·</span>
                          <Globe className="w-3 h-3" />
                          <span>{selectedConversation.language_detected}</span>
                        </>
                      )}
                      <span>·</span>
                      <Bot className="w-3 h-3 text-[#F7B678]" />
                      <span className="text-[#F7B678]">BANYU</span>
                    </p>
                  </div>

                  {/* Delete conversation button */}
                  <button
                    onClick={(e) => handleDeleteConversation(selectedConversation, e)}
                    className="p-2 text-[#93A4B8] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Eliminar conversación"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Thread messages */}
              <div className="flex-1 overflow-y-auto p-4">
                {threadLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <RefreshCw className="w-6 h-6 text-[#F26F21] animate-spin" />
                  </div>
                ) : conversationThread.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-[#93A4B8]">No messages in this conversation</p>
                  </div>
                ) : (
                  <>
                    {/* Date separator for first message */}
                    <div className="flex justify-center mb-4">
                      <span className="text-[10px] text-[#93A4B8] bg-[#212E40] px-3 py-1 rounded-full">
                        {new Date(conversationThread[0]?.created_at).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    {conversationThread.map((msg, index) => renderMessageBubble(msg, index))}
                    <div ref={threadEndRef} />
                  </>
                )}
              </div>

              {/* V1 Footer - Read only notice */}
              <div className="bg-[#172234] border-t border-[#212E40] px-4 py-3 text-center">
                <p className="text-xs text-[#93A4B8]">
                  Read-only view — BANYU replies to guests automatically, and you get owner alerts on your WhatsApp
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-[#212E40] mx-auto mb-4" />
                <p className="text-[#93A4B8]">Select a conversation to view messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerMessages;

import React, { useState, useEffect, useRef } from 'react'; // V2 Design
import {
  ChevronLeft,
  ChevronRight,
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
  Monitor,
  Bell,
  Menu,
  PanelLeftOpen,
  Trash2,
  MoreVertical,
  AlertTriangle,
  Send,
  Hand,
  ArrowLeftRight,
  Users,
  Home,
  CreditCard,
  Headphones,
  ExternalLink
} from 'lucide-react';
import { supabaseService } from '../../services/supabase';
import { supabase } from '../../lib/supabase';

// V2 Design - Official channel logos as local SVG components
// Instagram: official camera icon, Facebook: official F logo
import { WhatsAppLogo, InstagramLogo, FacebookLogo } from './icons';

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
  const [conversationStatus, setConversationStatus] = useState({}); // { phoneNumber: { hasBooking, hasPendingRequest } }
  const [readStates, setReadStates] = useState({}); // { phoneNumber: { lastReadAt } }
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: null, // 'conversation' or 'message'
    target: null, // the conversation or message to delete
    loading: false
  });
  const [conversationThread, setConversationThread] = useState([]);
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [error, setError] = useState(null);

  // New messages notification (instead of auto-reload)
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [newMessagesByChannel, setNewMessagesByChannel] = useState({ whatsapp: 0, voice: 0 });
  const [showNewMessagesDropdown, setShowNewMessagesDropdown] = useState(false);

  // V1.5 - Owner intervention state
  const [activeTakeover, setActiveTakeover] = useState(null); // Current takeover for selected conversation
  const [messageText, setMessageText] = useState(''); // Composer input
  const [sendingMessage, setSendingMessage] = useState(false);
  const [takeoverLoading, setTakeoverLoading] = useState(false);
  const [takeoverError, setTakeoverError] = useState(null);
  const [countdownSeconds, setCountdownSeconds] = useState(0); // Seconds until takeover expires

  // V2 Design - Guest context panel (right column)
  const [guestContext, setGuestContext] = useState({
    booking: null,
    serviceRequests: [],
    channelsUsed: [],
    loading: false
  });
  const [showGuestPanel, setShowGuestPanel] = useState(false); // Panel colapsado por defecto - más espacio para conversación

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

        // Fetch guest names, conversation status, and read states in parallel
        const [guestNames, statusData, readStateData] = await Promise.all([
          supabaseService.resolveGuestNamesByPhone(phoneNumbers, tenantId),
          supabaseService.getConversationStatusData(phoneNumbers, tenantId),
          supabaseService.getConversationReadStates(phoneNumbers, tenantId)
        ]);

        // Store status data for chips
        setConversationStatus(statusData);
        setReadStates(readStateData);

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
        const tenantForRead = isAdmin ? selectedTenant : userData.id;
        await supabaseService.updateConversationReadState('whatsapp', phoneNumber, tenantForRead);
        // Update local state to remove "New" badge immediately
        setReadStates(prev => ({
          ...prev,
          [phoneNumber]: { lastReadAt: new Date().toISOString() }
        }));
      }
    } catch (err) {
      console.error('Error loading thread:', err);
    } finally {
      setThreadLoading(false);
    }
  };

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    // Reset V1.5 state IMMEDIATELY - critical to prevent showing previous conversation's takeover state
    setActiveTakeover(null);
    setCountdownSeconds(0);
    setMessageText('');
    setTakeoverError(null);
    // No channel filter - load all messages (WhatsApp + KORA unified)
    loadConversationThread(conv.phone_number, null);
    // Check for active takeover (V1.5) - this is async, so we reset state first
    checkTakeover(conv.phone_number);
    // V2 Design - Load guest context for right panel
    loadGuestContext(conv.phone_number, conv.guest_name);
  };

  // Open delete modal for conversation
  const handleDeleteConversation = (conv, e) => {
    e.stopPropagation(); // Don't select the conversation
    setDeleteModal({
      isOpen: true,
      type: 'conversation',
      target: conv,
      loading: false
    });
  };

  // Open delete modal for message
  const handleDeleteMessage = (msg) => {
    setDeleteModal({
      isOpen: true,
      type: 'message',
      target: msg,
      loading: false
    });
  };

  // Execute the delete action
  const executeDelete = async () => {
    setDeleteModal(prev => ({ ...prev, loading: true }));

    try {
      if (deleteModal.type === 'conversation') {
        const conv = deleteModal.target;
        const tenantId = isAdmin ? selectedTenant : userData?.id;

        await supabaseService.deleteWhatsAppConversation(conv.phone_number, tenantId);

        // Remove from local state
        setConversations(prev => prev.filter(c => c.phone_number !== conv.phone_number));

        // Clear selection if this was the selected conversation
        if (selectedConversation?.phone_number === conv.phone_number) {
          setSelectedConversation(null);
          setConversationThread([]);
        }
      } else if (deleteModal.type === 'message') {
        const msg = deleteModal.target;

        await supabaseService.deleteWhatsAppMessage(msg.id);

        // Remove from thread
        setConversationThread(prev => prev.filter(m => m.id !== msg.id));

        // Update conversation list
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
      }

      // Close modal on success
      setDeleteModal({ isOpen: false, type: null, target: null, loading: false });
    } catch (err) {
      console.error('Error deleting:', err);
      setDeleteModal(prev => ({ ...prev, loading: false }));
      // Keep modal open to show error - user can try again or cancel
    }
  };

  // Close delete modal
  const closeDeleteModal = () => {
    if (!deleteModal.loading) {
      setDeleteModal({ isOpen: false, type: null, target: null, loading: false });
    }
  };

  // =====================================================
  // V1.5 - OWNER INTERVENTION FUNCTIONS
  // =====================================================

  // Check for active takeover when selecting a conversation
  const checkTakeover = async (phoneNumber) => {
    try {
      const takeover = await supabaseService.getConversationTakeover('whatsapp', phoneNumber);

      // Only set active takeover if it exists AND has not expired
      if (takeover?.expires_at) {
        const expiresDate = new Date(takeover.expires_at);
        const now = new Date();

        if (expiresDate > now) {
          // Takeover is still valid
          setActiveTakeover(takeover);
          updateCountdown(takeover.expires_at);
        } else {
          // Takeover has expired - don't activate owner control
          setActiveTakeover(null);
          setCountdownSeconds(0);
        }
      } else {
        // No takeover found
        setActiveTakeover(null);
        setCountdownSeconds(0);
      }
    } catch (err) {
      console.error('Error checking takeover:', err);
      setActiveTakeover(null);
      setCountdownSeconds(0);
    }
  };

  // V2 Design - Load guest context for right panel
  const loadGuestContext = async (phoneNumber, guestName) => {
    setGuestContext(prev => ({ ...prev, loading: true }));

    try {
      const tenantId = isAdmin ? selectedTenant : userData?.id;

      // 1. Find booking by guest phone (with + prefix handling)
      // Create unique variants (deduplicated)
      const rawVariants = [phoneNumber, phoneNumber.replace(/^\+/, ''), `+${phoneNumber.replace(/^\+/, '')}`];
      const phoneVariants = [...new Set(rawVariants.filter(p => p && p.length > 5))];

      let booking = null;
      for (const phone of phoneVariants) {
        const { data: bookings } = await supabase
          .from('bookings')
          .select('*, villas(name, currency, property_id, properties(currency))')
          .eq('tenant_id', tenantId)
          .or(`guest_phone.eq.${phone},guest_name.ilike.%${guestName || ''}%`)
          .order('check_in', { ascending: false })
          .limit(1);

        if (bookings && bookings.length > 0) {
          booking = bookings[0];
          break;
        }
      }

      // 2. Get service requests for this booking or guest
      let serviceRequests = [];
      if (booking?.id) {
        const { data: requests } = await supabase
          .from('service_requests')
          .select('*')
          .eq('booking_id', booking.id)
          .order('created_at', { ascending: false });

        serviceRequests = requests || [];
      }

      // 3. Get channels used by this guest (from their messages)
      // Filter out empty variants and use .or() instead of .in() for better compatibility
      const validPhones = phoneVariants.filter(p => p && p.length > 5);
      let channelData = [];
      if (validPhones.length > 0) {
        const orFilter = validPhones.map(p => `channel_user_id.eq.${p}`).join(',');
        const { data } = await supabase
          .from('whatsapp_messages_v2')
          .select('channel, created_at')
          .eq('tenant_id', tenantId)
          .or(orFilter)
          .order('created_at', { ascending: false });
        channelData = data || [];
      }

      // Group by channel with last used time
      const channelMap = {};
      (channelData || []).forEach(msg => {
        if (!channelMap[msg.channel]) {
          channelMap[msg.channel] = msg.created_at;
        }
      });

      const channelsUsed = Object.entries(channelMap).map(([channel, lastUsed]) => ({
        channel,
        lastUsed
      }));

      // Debug: log booking data to see currency fields
      console.log('Guest context booking data:', {
        booking_currency: booking?.currency,
        villa_currency: booking?.villas?.currency,
        property_currency: booking?.villas?.properties?.currency,
        total_price: booking?.total_price,
        booking_code: booking?.booking_code,
        full_booking: booking
      });

      setGuestContext({
        booking,
        serviceRequests,
        channelsUsed,
        loading: false
      });
    } catch (err) {
      console.error('Error loading guest context:', err);
      setGuestContext({
        booking: null,
        serviceRequests: [],
        channelsUsed: [],
        loading: false
      });
    }
  };

  // Update countdown timer
  const updateCountdown = (expiresAt) => {
    const expiresDate = new Date(expiresAt);
    const now = new Date();
    const diffMs = expiresDate - now;
    const diffSeconds = Math.max(0, Math.floor(diffMs / 1000));
    setCountdownSeconds(diffSeconds);
  };

  // Countdown timer effect
  useEffect(() => {
    if (!activeTakeover || countdownSeconds <= 0) return;

    const timer = setInterval(() => {
      setCountdownSeconds(prev => {
        if (prev <= 1) {
          // Takeover expired - release it
          handleReleaseTakeover(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTakeover, countdownSeconds]);

  // Format countdown as MM:SS
  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start intervention (create takeover)
  const handleIntervene = async () => {
    if (!selectedConversation) return;

    setTakeoverLoading(true);
    setTakeoverError(null);

    try {
      const tenantId = isAdmin ? selectedTenant : userData?.id;
      const phoneNumber = selectedConversation.phone_number;

      const takeover = await supabaseService.createConversationTakeover('whatsapp', phoneNumber, tenantId);
      setActiveTakeover(takeover);

      if (takeover?.expires_at) {
        updateCountdown(takeover.expires_at);
      }
    } catch (err) {
      console.error('Error creating takeover:', err);
      setTakeoverError(err.message || 'Failed to take over conversation');
    } finally {
      setTakeoverLoading(false);
    }
  };

  // Release takeover (return to BANYU)
  const handleReleaseTakeover = async (isExpired = false) => {
    if (!activeTakeover) return;

    try {
      await supabaseService.releaseConversationTakeover(activeTakeover.id);
      setActiveTakeover(null);
      setCountdownSeconds(0);
      setMessageText('');
    } catch (err) {
      console.error('Error releasing takeover:', err);
      if (!isExpired) {
        setTakeoverError(err.message || 'Failed to release takeover');
      }
    }
  };

  // Send message via OWNER-SEND workflow
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || sendingMessage) return;

    setSendingMessage(true);
    setTakeoverError(null);

    try {
      // Get access token from Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Session expired - please login again');
      }

      const response = await fetch('https://n8n-production-bb2d.up.railway.app/webhook/owner-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: session.access_token,
          guest_phone: selectedConversation.phone_number,
          text: messageText.trim()
        })
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        // Handle specific errors
        if (result.error === 'window_closed_24h') {
          throw new Error("This guest hasn't written in the last 24h — free text can't be delivered");
        }
        throw new Error(result.error || 'Failed to send message');
      }

      // Success - clear input and update countdown
      setMessageText('');

      // Refresh the thread to show the new message
      loadConversationThread(selectedConversation.phone_number, null);

      // Update countdown from response
      if (result.expires_at) {
        updateCountdown(result.expires_at);
        setActiveTakeover(prev => prev ? { ...prev, expires_at: result.expires_at } : prev);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setTakeoverError(err.message || 'Failed to send message');
    } finally {
      setSendingMessage(false);
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

  // V2 Design - Format time ago for channels used
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // V2 Design - Get channel icon component (logos have built-in colors)
  const getChannelIcon = (channel) => {
    switch (channel?.toLowerCase()) {
      case 'whatsapp':
        return <WhatsAppLogo className="w-6 h-6" />;
      case 'instagram':
        return <InstagramLogo className="w-6 h-6" />;
      case 'facebook':
        return <FacebookLogo className="w-6 h-6" />;
      case 'voice':
      case 'kora':
        return <Headphones className="w-6 h-6 text-[#2dd4bf]" />;
      case 'web':
        return <Monitor className="w-6 h-6 text-[#8b9bf5]" />;
      default:
        return <MessageSquare className="w-4 h-4 text-[#93A4B8]" />;
    }
  };

  // V2 Design - Format price with correct currency
  const formatPrice = (amount, booking) => {
    if (amount === null || amount === undefined) return '—';
    if (amount === 0) return 'No cost';

    // Get currency from villa > property > booking (villa/property are more reliable)
    const currency = booking?.villas?.currency || booking?.villas?.properties?.currency || booking?.currency || 'USD';

    // Format based on currency
    if (currency === 'IDR') {
      // Indonesian Rupiah - format as "Rp 7,650,000" or "7.65M IDR" for large amounts
      if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}M IDR`;
      }
      return `Rp ${amount.toLocaleString('id-ID')}`;
    } else {
      // USD and other currencies
      return `$${amount.toLocaleString()}`;
    }
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

  // Skeleton loading component for conversations list
  const ConversationSkeleton = () => (
    <div className="animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 border-b border-[#212E40]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#212E40]" />
            <div className="flex-1">
              <div className="h-4 bg-[#212E40] rounded w-32 mb-2" />
              <div className="h-3 bg-[#212E40] rounded w-48" />
            </div>
            <div className="h-3 bg-[#212E40] rounded w-12" />
          </div>
        </div>
      ))}
    </div>
  );

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
            {loading && <RefreshCw className="w-4 h-4 text-[#F26F21] animate-spin ml-2" />}
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
            <div className="flex items-center gap-2 px-3 py-2 bg-[#25D366]/20 border border-[#25D366]/50 rounded-lg">
              <WhatsAppLogo className="w-6 h-6" />
              <span className="text-sm font-extrabold text-white tracking-wide">BANYU</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#0EA5A5]/20 border border-[#0EA5A5]/50 rounded-lg">
              <Phone className="w-6 h-6 text-[#0EA5A5]" />
              <span className="text-sm font-extrabold text-white tracking-wide">KORA</span>
            </div>
            {/* Coming soon channels */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#833AB4]/15 via-[#E1306C]/15 to-[#F77737]/15 border border-[#E1306C]/40 rounded-lg opacity-70">
              <InstagramLogo className="w-6 h-6" />
              <span className="text-sm font-bold text-white/90 tracking-wide">Instagram</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#1877F2]/15 border border-[#1877F2]/40 rounded-lg opacity-70">
              <FacebookLogo className="w-6 h-6" />
              <span className="text-sm font-bold text-white/90 tracking-wide">Facebook</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#5A6BF0]/15 border border-[#5A6BF0]/40 rounded-lg opacity-70">
              <Globe className="w-6 h-6 text-[#5A6BF0]" />
              <span className="text-sm font-bold text-white/90 tracking-wide">Web</span>
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
            {loading ? (
              <ConversationSkeleton />
            ) : error ? (
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
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {/* Unread badge - show if last_message is newer than lastReadAt */}
                          {(() => {
                            const readState = readStates[conv.phone_number];
                            const lastMsgTime = conv.last_message?.created_at;
                            const lastReadTime = readState?.lastReadAt;
                            // Show "New" if never read OR last message is newer than last read
                            const isUnread = lastMsgTime && (!lastReadTime || new Date(lastMsgTime) > new Date(lastReadTime));
                            if (isUnread) {
                              return (
                                <span className="text-[10px] px-1.5 py-0.5 bg-[#F26F21] text-white rounded font-bold animate-pulse">
                                  New
                                </span>
                              );
                            }
                            return null;
                          })()}
                          {/* Status chip - Priority: Needs action > Booking > Inquiry */}
                          {(() => {
                            const status = conversationStatus[conv.phone_number];
                            if (status?.hasPendingRequest) {
                              return (
                                <span className="text-[10px] px-1.5 py-0.5 bg-[#3E3115] text-[#F0C674] rounded font-medium">
                                  Needs action
                                </span>
                              );
                            } else if (status?.hasBooking) {
                              return (
                                <span className="text-[10px] px-1.5 py-0.5 bg-[#1E3A2A] text-[#6FCF97] rounded font-medium">
                                  Booking
                                </span>
                              );
                            } else {
                              return (
                                <span className="text-[10px] px-1.5 py-0.5 bg-[#212E40] text-[#93A4B8] rounded">
                                  Inquiry
                                </span>
                              );
                            }
                          })()}
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

              {/* V1.5 Footer - Intervention controls */}
              <div className="bg-[#172234] border-t border-[#212E40]">
                {/* Error message */}
                {takeoverError && (
                  <div className="px-4 py-2 bg-red-500/20 border-b border-red-500/30">
                    <p className="text-xs text-red-400 text-center">{takeoverError}</p>
                  </div>
                )}

                {activeTakeover ? (
                  /* Owner has control - Show banner + composer */
                  <>
                    {/* Amber countdown banner */}
                    <div className="px-4 py-2.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-amber-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Hand className="w-4 h-4 text-amber-400" />
                        <span className="text-sm text-amber-200">
                          You're handling this · BANYU paused
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono font-bold text-amber-300">
                          {formatCountdown(countdownSeconds)}
                        </span>
                        <button
                          onClick={() => handleReleaseTakeover(false)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#212E40] hover:bg-[#26344A] text-[#93A4B8] hover:text-[#EAF0F7] text-xs font-medium rounded-lg transition-colors"
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5" />
                          Return to BANYU
                        </button>
                      </div>
                    </div>

                    {/* Composer */}
                    <div className="px-4 py-3 flex items-end gap-3">
                      <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type a message as owner..."
                        rows={1}
                        className="flex-1 px-4 py-3 bg-[#212E40] border border-[#93A4B8]/20 rounded-xl text-sm text-[#EAF0F7] placeholder-[#93A4B8] focus:outline-none focus:border-[#F26F21] resize-none"
                        style={{ minHeight: '44px', maxHeight: '120px' }}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim() || sendingMessage}
                        className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-[#F26F21] hover:bg-[#E15E12] disabled:bg-[#212E40] disabled:cursor-not-allowed rounded-xl transition-colors"
                      >
                        {sendingMessage ? (
                          <RefreshCw className="w-5 h-5 text-white animate-spin" />
                        ) : (
                          <Send className="w-5 h-5 text-white" />
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  /* BANYU has control - Show intervene button */
                  <div className="px-4 py-3 flex items-center justify-between">
                    <p className="text-xs text-[#93A4B8]">
                      BANYU replies automatically · You get alerts on WhatsApp
                    </p>
                    <button
                      onClick={handleIntervene}
                      disabled={takeoverLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-[#212E40] hover:bg-[#26344A] text-[#EAF0F7] text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      {takeoverLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Hand className="w-4 h-4" />
                      )}
                      Intervene
                    </button>
                  </div>
                )}
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

        {/* Toggle button for Guest Panel - Always visible when conversation selected */}
        {selectedConversation && (
          <button
            onClick={() => setShowGuestPanel(!showGuestPanel)}
            className="hidden md:flex items-center justify-center w-6 bg-[#1a2332] hover:bg-[#212E40] border-l border-[#212E40] transition-colors"
            title={showGuestPanel ? 'Hide guest info' : 'Show guest info'}
          >
            <ChevronRight className={`w-4 h-4 text-[#93A4B8] transition-transform ${showGuestPanel ? 'rotate-180' : ''}`} />
          </button>
        )}

        {/* V2 Design - Right panel - Guest context (316px, collapsible) */}
        {selectedConversation && showGuestPanel && (
          <div className="hidden md:flex flex-col w-[316px] min-w-[316px] border-l border-[#212E40] bg-[#0E1621] overflow-y-auto">
            {guestContext.loading ? (
              <div className="flex items-center justify-center h-32">
                <RefreshCw className="w-5 h-5 text-[#F26F21] animate-spin" />
              </div>
            ) : (
              <>
                {/* GUEST Section */}
                <div className="p-4 border-b border-[#1e2a44]">
                  <p className="text-[10px] font-medium text-[#93A4B8] uppercase tracking-wider mb-3">Guest</p>
                  <div className="flex items-center gap-3 mb-3">
                    {/* Avatar naranja con iniciales blancas */}
                    <div className="w-12 h-12 rounded-full bg-[#F26F21] flex items-center justify-center text-white font-bold text-base">
                      {selectedConversation.guest_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'GU'}
                    </div>
                    <div>
                      <p className="font-semibold text-[#EAF0F7]">{selectedConversation.guest_name || 'Guest'}</p>
                      <p className="text-xs text-[#93A4B8] font-mono">{formatPhone(selectedConversation.phone_number)}</p>
                    </div>
                  </div>
                  {/* Mini tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {selectedConversation.language_detected && (
                      <span className="px-2 py-0.5 bg-[#212E40] rounded text-[10px] font-medium text-[#93A4B8]">
                        {selectedConversation.language_detected.toUpperCase()}
                      </span>
                    )}
                    <span className="px-2 py-1 bg-[#1c3129] text-[#7FBE9E] rounded text-xs font-medium flex items-center gap-1.5">
                      <WhatsAppLogo className="w-5 h-5" />
                      WhatsApp
                    </span>
                    {conversationStatus[selectedConversation.phone_number]?.hasBooking ? (
                      <span className="px-2 py-0.5 bg-[#1c3129] text-[#7FBE9E] rounded text-[10px] font-medium">Booking</span>
                    ) : conversationStatus[selectedConversation.phone_number]?.hasPendingRequest ? (
                      <span className="px-2 py-0.5 bg-[#3E3115] text-[#F0C674] rounded text-[10px] font-medium">Needs action</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-[#212E40] text-[#93A4B8] rounded text-[10px] font-medium">Inquiry</span>
                    )}
                  </div>
                </div>

                {/* CURRENT RESERVATION Section */}
                <div className="p-4 border-b border-[#1e2a44]">
                  <p className="text-[10px] font-medium text-[#93A4B8] uppercase tracking-wider mb-3">
                    {guestContext.booking ? 'Current Reservation' : 'No Reservation Yet'}
                  </p>
                  {guestContext.booking ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-[#93A4B8]">Booking</span>
                        <span className="text-xs font-mono text-[#7FBE9E] font-medium">{guestContext.booking.booking_code || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-[#93A4B8]">Villa</span>
                        <span className="text-xs font-mono text-[#EAF0F7]">{guestContext.booking.villas?.name || guestContext.booking.villa_name || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-[#93A4B8]">Dates</span>
                        <span className="text-xs font-mono text-[#EAF0F7]">
                          {guestContext.booking.check_in ? new Date(guestContext.booking.check_in).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                          {' - '}
                          {guestContext.booking.check_out ? new Date(guestContext.booking.check_out).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-[#93A4B8]">Guests</span>
                        <span className="text-xs font-mono text-[#EAF0F7]">{guestContext.booking.guests || guestContext.booking.num_guests || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-[#93A4B8]">Total</span>
                        <span className="text-xs font-mono text-[#EAF0F7]">
                          {formatPrice(guestContext.booking.total_price, guestContext.booking)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-[#93A4B8]">Status</span>
                        <span className={`text-xs font-medium ${
                          guestContext.booking.status === 'confirmed' ? 'text-[#7FBE9E]' :
                          guestContext.booking.status === 'pending' ? 'text-[#F0C674]' :
                          'text-[#93A4B8]'
                        }`}>
                          {guestContext.booking.status ? guestContext.booking.status.charAt(0).toUpperCase() + guestContext.booking.status.slice(1) : '—'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-[#6d7c96]">
                      <p className="mb-1">Source: {selectedConversation.channel || 'WhatsApp'}</p>
                      <p>Status: Inquiry</p>
                    </div>
                  )}
                </div>

                {/* CHANNELS USED BY GUEST Section */}
                <div className="p-4 border-b border-[#1e2a44]">
                  <p className="text-[10px] font-medium text-[#93A4B8] uppercase tracking-wider mb-3">Channels Used by Guest</p>
                  {guestContext.channelsUsed.length > 0 ? (
                    <div className="space-y-2">
                      {guestContext.channelsUsed.map((ch, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getChannelIcon(ch.channel)}
                            <span className="text-xs text-[#EAF0F7] capitalize">{ch.channel}</span>
                          </div>
                          <span className="text-[10px] text-[#6d7c96] font-mono">{formatTimeAgo(ch.lastUsed)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <WhatsAppLogo className="w-6 h-6" />
                      <span className="text-sm text-[#EAF0F7]">WhatsApp</span>
                      <span className="text-xs text-[#6d7c96] font-mono ml-auto">Active</span>
                    </div>
                  )}
                </div>

                {/* SERVICE REQUESTS Section */}
                <div className="p-4">
                  <p className="text-[10px] font-medium text-[#93A4B8] uppercase tracking-wider mb-3">Service Requests</p>
                  {guestContext.serviceRequests.length > 0 ? (
                    <div className="space-y-2">
                      {guestContext.serviceRequests.map((req, idx) => (
                        <div key={idx} className="p-3 bg-[#172234] rounded-lg border border-[#26314b]">
                          <div className="flex items-start justify-between mb-1">
                            <span className="text-xs font-medium text-[#EAF0F7]">{req.service_type || req.title || 'Service'}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${
                              req.status === 'pending' ? 'bg-[#3E3115] text-[#F0C674]' :
                              req.status === 'completed' ? 'bg-[#1c3129] text-[#7FBE9E]' :
                              'bg-[#212E40] text-[#93A4B8]'
                            }`}>
                              {req.status?.toUpperCase() || 'INFO'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-[#6d7c96]">
                            <span>{req.created_at ? new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</span>
                            <span className="font-mono">
                              {formatPrice(req.price, guestContext.booking)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 border border-dashed border-[#26314b] rounded-lg text-center">
                      <p className="text-xs text-[#6d7c96]">No service requests for this guest</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeDeleteModal}
          />

          {/* Modal */}
          <div className="relative bg-[#172234] border border-[#212E40] rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 p-5 border-b border-[#212E40]">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#EAF0F7]">
                  {deleteModal.type === 'conversation' ? 'Delete Conversation' : 'Delete Message'}
                </h3>
                <p className="text-xs text-[#93A4B8]">This action cannot be undone</p>
              </div>
            </div>

            {/* Body */}
            <div className="p-5">
              {deleteModal.type === 'conversation' ? (
                <p className="text-sm text-[#93A4B8]">
                  Are you sure you want to delete the entire conversation with{' '}
                  <span className="text-[#EAF0F7] font-medium">
                    {deleteModal.target?.guest_name || deleteModal.target?.phone_number}
                  </span>
                  ? All messages will be removed from your records. The guest will still have the messages on their phone.
                </p>
              ) : (
                <p className="text-sm text-[#93A4B8]">
                  Are you sure you want to delete this message? The guest will still have this message on their phone.
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-[#212E40] bg-[#0E1621]">
              <button
                onClick={closeDeleteModal}
                disabled={deleteModal.loading}
                className="px-4 py-2 text-sm font-medium text-[#93A4B8] hover:text-[#EAF0F7] hover:bg-[#212E40] rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                disabled={deleteModal.loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deleteModal.loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerMessages;

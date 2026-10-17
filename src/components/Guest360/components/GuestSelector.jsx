import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Phone,
  Calendar,
  ChevronRight,
  ArrowLeft,
  RefreshCw,
  Users,
  Menu,
  PanelLeftOpen,
  History,
  UserCheck,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { LoadingSpinner, EmptyState } from './shared';

/**
 * GuestSelector - List of recent guests/bookings to select from
 * Shows when Guest360 is accessed without a specific guestPhone
 */
const GuestSelector = ({ tenantId, onSelectGuest, onBack, setSidebarCollapsed, sidebarCollapsed }) => {
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  // Filter states
  const [villas, setVillas] = useState([]);
  const [filterVilla, setFilterVilla] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // View mode: 'active' (default) or 'all' (history)
  const [viewMode, setViewMode] = useState('active');

  useEffect(() => {
    fetchRecentGuests();
    fetchVillas();
  }, [tenantId]);

  // Fetch villas for filter dropdown (via property_ids from bookings)
  const fetchVillas = async () => {
    if (!tenantId) return;

    try {
      // 1. Get property_ids from bookings for this tenant
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('property_id')
        .eq('tenant_id', tenantId);

      if (bookingsError) {
        console.error('Error fetching bookings for villas:', bookingsError);
        return;
      }

      if (!bookings || bookings.length === 0) {
        console.log('No bookings found for tenant');
        return;
      }

      // Get unique property_ids
      const propertyIds = [...new Set(bookings.map(b => b.property_id).filter(Boolean))];

      if (propertyIds.length === 0) {
        console.log('No property_ids found');
        return;
      }

      // 2. Get villas for those property_ids
      const { data: villasData, error: villasError } = await supabase
        .from('villas')
        .select('id, name')
        .in('property_id', propertyIds)
        .eq('status', 'active')
        .order('name');

      if (villasError) {
        console.error('Error fetching villas:', villasError);
        return;
      }

      console.log(`[GuestSelector] Loaded ${villasData?.length || 0} villas`);
      setVillas(villasData || []);
    } catch (err) {
      console.error('Error fetching villas:', err);
    }
  };

  const fetchRecentGuests = async () => {
    if (!tenantId) {
      setError('No tenant ID provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch ALL bookings with guest info (no limit to get all unique guests)
      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select(`
          id,
          guest_name,
          guest_phone,
          guest_email,
          check_in,
          check_out,
          status,
          villa_id,
          confirmation_code,
          notes,
          source,
          channel,
          villas:villa_id (name)
        `)
        .eq('tenant_id', tenantId)
        .order('check_in', { ascending: false });

      if (fetchError) throw fetchError;

      // Generic names that should NOT be grouped (each booking = separate guest)
      const genericNames = ['ota guest', 'guest', 'airbnb guest', 'booking.com guest', 'unknown', 'n/a', 'na', 'tba', 'tbd'];

      // Helper: Normalize phone to digits only (e.g., '+34 619 79 46 04' → '34619794604')
      const normalizePhone = (phone) => {
        if (!phone) return null;
        return phone.replace(/\D/g, '');
      };

      // Helper: Format phone for display (add + prefix if not present)
      const formatPhoneDisplay = (phone) => {
        if (!phone) return null;
        const cleaned = phone.replace(/\D/g, '');
        return phone.startsWith('+') ? phone : `+${cleaned}`;
      };

      // Group by NORMALIZED guest_phone OR guest_name (for guests without phone)
      // Exception: generic names are NOT grouped - each booking is a separate entry
      const guestMap = new Map();
      (data || []).forEach(booking => {
        const nameNormalized = (booking.guest_name || '').toLowerCase().trim();
        const isGenericName = genericNames.includes(nameNormalized);
        const phoneNormalized = normalizePhone(booking.guest_phone);

        // Use NORMALIZED phone as primary key, fall back to name if no phone
        // For generic names without phone, use booking ID to keep them separate
        let key;
        if (phoneNormalized) {
          key = phoneNormalized; // Use digits-only phone as key
        } else if (isGenericName) {
          // Each booking with generic name is a separate "guest"
          key = `booking:${booking.id}`;
        } else {
          key = `name:${booking.guest_name}`;
        }

        if (!key || key === 'name:' || key === 'name:null') return;

        if (!guestMap.has(key)) {
          guestMap.set(key, {
            phone: formatPhoneDisplay(booking.guest_phone) || null, // Store formatted phone for display
            phoneNormalized: phoneNormalized, // Store normalized phone for lookup
            name: booking.guest_name,
            email: booking.guest_email,
            bookings: [],
            lastBooking: booking,
            isGenericName: isGenericName,
          });
        } else {
          // Update name to most recent non-generic, non-TEST name
          const existing = guestMap.get(key);
          const currentName = (existing.name || '').toLowerCase();
          const newName = (booking.guest_name || '').toLowerCase();
          const isCurrentGeneric = genericNames.includes(currentName) || currentName.includes('test');
          const isNewGeneric = genericNames.includes(newName) || newName.includes('test');

          // Prefer non-generic, non-TEST name
          if (isCurrentGeneric && !isNewGeneric) {
            existing.name = booking.guest_name;
          }
          // Update phone display if current is missing or new one has + prefix
          if (!existing.phone && booking.guest_phone) {
            existing.phone = formatPhoneDisplay(booking.guest_phone);
          }
        }
        guestMap.get(key).bookings.push(booking);
      });

      // Convert to array and sort by most recent booking
      const uniqueGuests = Array.from(guestMap.values()).sort((a, b) => {
        return new Date(b.lastBooking.check_in) - new Date(a.lastBooking.check_in);
      });

      setGuests(uniqueGuests);
    } catch (err) {
      console.error('Error fetching guests:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate cutoff date for "active" guests (today - 6 months)
  const activeCutoffDate = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  // Pre-filter guests based on view mode (active vs all)
  const viewFilteredGuests = useMemo(() => {
    return guests.filter(guest => {
      // 1. Always hide guests whose ALL bookings are cancelled
      const hasNonCancelledBooking = guest.bookings.some(b => b.status !== 'cancelled');
      if (!hasNonCancelledBooking) return false;

      // 2. In "active" mode, apply additional filters
      if (viewMode === 'active') {
        // Hide OTA Guest entries (generic names from iCal with no phone)
        if (guest.isGenericName && !guest.phone) return false;

        // Only show guests with at least one non-cancelled booking with check_out >= cutoff (today - 30 days)
        const hasRecentOrFutureBooking = guest.bookings.some(b => {
          if (b.status === 'cancelled') return false;
          const checkOut = new Date(b.check_out);
          return checkOut >= activeCutoffDate;
        });
        if (!hasRecentOrFutureBooking) return false;
      }

      return true;
    });
  }, [guests, viewMode, activeCutoffDate]);

  // Filter guests by user-specified criteria (search, villa, status, dates)
  const filteredGuests = viewFilteredGuests.filter(guest => {
    // Search term filter - search by name, phone, email, confirmation_code, or notes (DATE CONFLICT)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      // Check guest-level fields
      const matchesGuestFields = (
        guest.name?.toLowerCase().includes(term) ||
        guest.phone?.includes(term) ||
        guest.email?.toLowerCase().includes(term)
      );
      // Check booking-level fields (confirmation_code, notes with DATE CONFLICT)
      const matchesBookingFields = guest.bookings?.some(b =>
        b.confirmation_code?.toLowerCase().includes(term) ||
        b.notes?.toLowerCase().includes(term)
      );
      if (!matchesGuestFields && !matchesBookingFields) return false;
    }

    // Villa filter - check if any booking matches
    if (filterVilla) {
      const hasVilla = guest.bookings.some(b => b.villa_id === filterVilla);
      if (!hasVilla) return false;
    }

    // Status filter - check if any booking matches
    if (filterStatus) {
      const hasStatus = guest.bookings.some(b => b.status === filterStatus);
      if (!hasStatus) return false;
    }

    // Date range filter - guest must have at least one booking with check_in in range
    if (dateFrom || dateTo) {
      const hasBookingInRange = guest.bookings.some(b => {
        const checkInDate = new Date(b.check_in);
        checkInDate.setHours(0, 0, 0, 0);

        if (dateFrom && dateTo) {
          const from = new Date(dateFrom);
          from.setHours(0, 0, 0, 0);
          const to = new Date(dateTo);
          to.setHours(23, 59, 59, 999);
          return checkInDate >= from && checkInDate <= to;
        } else if (dateFrom) {
          const from = new Date(dateFrom);
          from.setHours(0, 0, 0, 0);
          return checkInDate >= from;
        } else if (dateTo) {
          const to = new Date(dateTo);
          to.setHours(23, 59, 59, 999);
          return checkInDate <= to;
        }
        return true;
      });
      if (!hasBookingInRange) return false;
    }

    return true;
  });

  // Check if any filters are active
  const hasActiveFilters = filterVilla || filterStatus || dateFrom || dateTo || searchTerm;

  // Count total guests in each view for badges
  const activeGuestsCount = useMemo(() => {
    return guests.filter(guest => {
      const hasNonCancelledBooking = guest.bookings.some(b => b.status !== 'cancelled');
      if (!hasNonCancelledBooking) return false;
      if (guest.isGenericName && !guest.phone) return false;
      const hasRecentOrFutureBooking = guest.bookings.some(b => {
        if (b.status === 'cancelled') return false;
        const checkOut = new Date(b.check_out);
        return checkOut >= activeCutoffDate;
      });
      return hasRecentOrFutureBooking;
    }).length;
  }, [guests, activeCutoffDate]);

  const allGuestsCount = useMemo(() => {
    return guests.filter(guest => {
      return guest.bookings.some(b => b.status !== 'cancelled');
    }).length;
  }, [guests]);

  // Clear all filters
  const clearFilters = () => {
    setFilterVilla('');
    setFilterStatus('');
    setDateFrom('');
    setDateTo('');
    setSearchTerm('');
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Get initials
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-[#272e39] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading guests..." />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#272e39] overflow-auto">
      <div className="w-full p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* Sidebar toggle button (desktop only) */}
            {setSidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex p-2 rounded-lg bg-[#333b47] hover:bg-[#3a434f] transition-colors"
                title={sidebarCollapsed ? 'Show menu' : 'Hide menu'}
              >
                {sidebarCollapsed ? (
                  <Menu className="w-5 h-5 text-[#FF8C42]" />
                ) : (
                  <PanelLeftOpen className="w-5 h-5 text-[#93A4B8]" />
                )}
              </button>
            )}
            <button
              onClick={onBack}
              className="p-2 rounded-lg bg-[#333b47] hover:bg-[#3a434f] text-[#aab2bf] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">
                OCS 360
              </h1>
              <p className="text-sm text-[#8a93a1]">
                Select a guest to view their profile
              </p>
            </div>
          </div>

          <button
            onClick={fetchRecentGuests}
            className="p-2 rounded-lg bg-[#333b47] hover:bg-[#3a434f] text-[#aab2bf] hover:text-white transition-colors"
            title="Refresh list"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode Toggle: Active vs All (History) */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setViewMode('active')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              viewMode === 'active'
                ? 'bg-[#f5791f] text-white'
                : 'bg-[#333b47] text-[#8a93a1] hover:bg-[#3a434f] hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Active Guests
            <span className={`ml-1 px-1.5 py-0.5 rounded text-xs ${
              viewMode === 'active' ? 'bg-white/20' : 'bg-[#f5791f]/20 text-[#f5791f]'
            }`}>
              {activeGuestsCount}
            </span>
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              viewMode === 'all'
                ? 'bg-[#f5791f] text-white'
                : 'bg-[#333b47] text-[#8a93a1] hover:bg-[#3a434f] hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            All Guests (History)
            <span className={`ml-1 px-1.5 py-0.5 rounded text-xs ${
              viewMode === 'all' ? 'bg-white/20' : 'bg-gray-500/20 text-gray-400'
            }`}>
              {allGuestsCount}
            </span>
          </button>
        </div>

        {/* Villa/Room Type Filter - Prominent first filter */}
        <div className="mb-4">
          <label className="text-xs text-[#8a93a1] uppercase tracking-wider mb-2 block font-semibold">
            Select Villa / Room Type
          </label>
          <select
            value={filterVilla}
            onChange={(e) => setFilterVilla(e.target.value)}
            className="w-full md:w-auto md:min-w-[300px] px-4 py-3 bg-[#333b47] border-2 border-[#f5791f]/30 rounded-xl text-white text-base font-medium focus:outline-none focus:border-[#f5791f] transition-colors"
          >
            <option value="">All Villas / All Room Types</option>
            {villas.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        {/* Filters - Row 1: Status + Search */}
        <div className="flex flex-wrap gap-3 mb-3 items-center">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-[#333b47] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#f5791f]/50"
          >
            <option value="">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending_payment">Pending Payment</option>
            <option value="checked_in">Checked In</option>
            <option value="checked_out">Checked Out</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Search Guest */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7683]" />
            <input
              type="text"
              placeholder="Search by guest, booking code (NIS-...), or 'conflict'..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#333b47] border border-white/10 rounded-xl text-white text-sm placeholder-[#6d7683] focus:outline-none focus:border-[#f5791f]/50"
            />
          </div>
        </div>

        {/* Filters - Row 2: Date Range + Clear */}
        <div className="flex flex-wrap gap-3 mb-4 items-center">
          {/* Date From */}
          <div className="flex items-center gap-2">
            <span className="text-[#8a93a1] text-sm w-[36px]">From</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 bg-[#333b47] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#f5791f]/50"
            />
          </div>

          {/* Date To */}
          <div className="flex items-center gap-2">
            <span className="text-[#8a93a1] text-sm w-[36px]">To</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 bg-[#333b47] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#f5791f]/50"
            />
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="px-4 py-2.5 bg-[#f5791f] hover:bg-[#e06a10] text-white rounded-xl font-medium text-sm transition-colors"
          >
            Clear Filters
          </button>
        </div>

        {/* Results count */}
        <p className="text-[#8a93a1] text-sm mb-4">
          {filteredGuests.length} guest{filteredGuests.length !== 1 ? 's' : ''} found
          {viewMode === 'active' && ' (recent/upcoming stays)'}
          {viewMode === 'all' && ' (full history)'}
          {hasActiveFilters && ' · filtered'}
        </p>

        {/* Error state */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Guest list */}
        {filteredGuests.length === 0 ? (
          <EmptyState
            icon={Users}
            title={hasActiveFilters ? 'No results' : 'No guests'}
            description={
              hasActiveFilters
                ? 'No guests found matching your filters. Try adjusting or clearing the filters.'
                : 'No guests with recent bookings'
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredGuests.map((guest) => {
              // Determine the key for selecting this guest
              // Use normalized phone (digits only) for lookup consistency
              const selectKey = guest.phoneNormalized
                ? guest.phoneNormalized
                : guest.isGenericName
                  ? `booking:${guest.lastBooking.id}`
                  : `name:${guest.name}`;

              return (
              <button
                key={selectKey}
                onClick={() => onSelectGuest(selectKey)}
                className="w-full flex items-center gap-4 p-4 bg-[#333b47] hover:bg-[#3a434f] border border-white/10 hover:border-white/20 rounded-xl transition-all text-left group"
              >
                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                  style={{
                    background: 'linear-gradient(140deg, #f5791f 0%, #f2b04a 100%)',
                  }}
                >
                  {getInitials(guest.name)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold truncate">
                      {guest.isGenericName
                        ? `${guest.name} - ${guest.lastBooking.villas?.name || 'Villa'}`
                        : (guest.name || 'Guest without name')
                      }
                    </p>
                    {guest.isGenericName && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">
                        OTA
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-1 text-sm text-[#8a93a1]">
                    {guest.phone ? (
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3" />
                        {guest.phone}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[#6d7683] italic">
                        <Phone className="w-3 h-3" />
                        No phone
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {guest.bookings.length} booking{guest.bookings.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Channel badges - show unique channels from all bookings */}
                  {(() => {
                    // Use channel field (airbnb, direct, booking) NOT source (beds24_api, ical_sync)
                    const channels = [...new Set(guest.bookings.map(b => b.channel).filter(Boolean))];
                    if (channels.length === 0) return null;

                    const channelColors = {
                      'airbnb': 'bg-[#FF5A5F]/20 text-[#FF5A5F]',
                      'booking': 'bg-[#003580]/20 text-[#4A90D9]',
                      'booking.com': 'bg-[#003580]/20 text-[#4A90D9]',
                      'direct': 'bg-green-500/20 text-green-400',
                      'banyu': 'bg-purple-500/20 text-purple-400',
                      'kora': 'bg-orange-500/20 text-orange-400',
                      'voice_ai': 'bg-orange-500/20 text-orange-400',
                      'whatsapp': 'bg-emerald-500/20 text-emerald-400',
                    };

                    const channelLabels = {
                      'airbnb': 'Airbnb',
                      'booking': 'Booking.com',
                      'booking.com': 'Booking.com',
                      'direct': 'Direct',
                      'banyu': 'Banyu',
                      'kora': 'Kora',
                      'voice_ai': 'Kora',
                      'whatsapp': 'WhatsApp',
                    };

                    return (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {channels.map(channel => {
                          const channelLower = channel.toLowerCase();
                          const colorClass = channelColors[channelLower] || 'bg-gray-500/20 text-gray-400';
                          const label = channelLabels[channelLower] || channel.charAt(0).toUpperCase() + channel.slice(1);
                          return (
                            <span
                              key={channel}
                              className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${colorClass}`}
                            >
                              {label}
                            </span>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Booking info */}
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-[#6d7683]">
                    <span>
                      {guest.isGenericName ? '' : 'Last: '}{formatDate(guest.lastBooking.check_in)}
                      {guest.isGenericName && ` → ${formatDate(guest.lastBooking.check_out)}`}
                    </span>
                    {!guest.isGenericName && guest.lastBooking.villas?.name && (
                      <>
                        <span>·</span>
                        <span className="text-[#aab2bf]">
                          {guest.lastBooking.villas.name}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 text-[#6d7683] group-hover:text-[#f5791f] transition-colors flex-shrink-0" />
              </button>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 py-4 border-t border-white/10 text-center">
          <p className="text-[10px] text-[#5f6874] uppercase tracking-wider">
            {filteredGuests.length} guests · OCS 360 · MY HOST BizMate
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuestSelector;

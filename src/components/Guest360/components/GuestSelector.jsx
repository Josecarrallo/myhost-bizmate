import React, { useState, useEffect } from 'react';
import {
  Search,
  Phone,
  Calendar,
  ChevronRight,
  ArrowLeft,
  RefreshCw,
  Users,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { LoadingSpinner, EmptyState } from './shared';

/**
 * GuestSelector - List of recent guests/bookings to select from
 * Shows when Guest360 is accessed without a specific guestPhone
 */
const GuestSelector = ({ tenantId, onSelectGuest, onBack }) => {
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
          villas:villa_id (name)
        `)
        .eq('tenant_id', tenantId)
        .order('check_in', { ascending: false });

      if (fetchError) throw fetchError;

      // Generic names that should NOT be grouped (each booking = separate guest)
      const genericNames = ['ota guest', 'guest', 'airbnb guest', 'booking.com guest', 'unknown', 'n/a', 'na', 'tba', 'tbd'];

      // Group by guest_phone OR guest_name (for guests without phone)
      // Exception: generic names are NOT grouped - each booking is a separate entry
      const guestMap = new Map();
      (data || []).forEach(booking => {
        const nameNormalized = (booking.guest_name || '').toLowerCase().trim();
        const isGenericName = genericNames.includes(nameNormalized);

        // Use phone as primary key, fall back to name if no phone
        // For generic names without phone, use booking ID to keep them separate
        let key;
        if (booking.guest_phone) {
          key = booking.guest_phone;
        } else if (isGenericName) {
          // Each booking with generic name is a separate "guest"
          key = `booking:${booking.id}`;
        } else {
          key = `name:${booking.guest_name}`;
        }

        if (!key || key === 'name:' || key === 'name:null') return;

        if (!guestMap.has(key)) {
          guestMap.set(key, {
            phone: booking.guest_phone || null,
            name: booking.guest_name,
            email: booking.guest_email,
            bookings: [],
            lastBooking: booking,
            isGenericName: isGenericName,
          });
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

  // Filter guests by all criteria
  const filteredGuests = guests.filter(guest => {
    // Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesSearch = (
        guest.name?.toLowerCase().includes(term) ||
        guest.phone?.includes(term) ||
        guest.email?.toLowerCase().includes(term)
      );
      if (!matchesSearch) return false;
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
      <div className="flex-1 h-screen bg-[#272e39] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading guests..." />
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen bg-[#272e39] overflow-auto">
      <div className="max-w-[800px] mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
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

        {/* Filters - Row 1: Villa, Status, Search */}
        <div className="flex flex-wrap gap-3 mb-3 items-center">
          {/* Villa Filter */}
          <select
            value={filterVilla}
            onChange={(e) => setFilterVilla(e.target.value)}
            className="px-4 py-2.5 bg-[#333b47] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#f5791f]/50"
          >
            <option value="">All Villas</option>
            {villas.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>

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
              placeholder="Search guest..."
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
          {hasActiveFilters && ' (filtered)'}
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
              const selectKey = guest.phone
                ? guest.phone
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

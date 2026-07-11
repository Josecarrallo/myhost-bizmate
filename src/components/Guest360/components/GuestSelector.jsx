import React, { useState, useEffect } from 'react';
import {
  Search,
  User,
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

  useEffect(() => {
    fetchRecentGuests();
  }, [tenantId]);

  const fetchRecentGuests = async () => {
    if (!tenantId) {
      setError('No tenant ID provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch recent bookings with guest info
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
          villas:villa_id (name)
        `)
        .eq('tenant_id', tenantId)
        .order('check_in', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;

      // Group by guest_phone to get unique guests
      const guestMap = new Map();
      (data || []).forEach(booking => {
        const phone = booking.guest_phone;
        if (!phone) return;

        if (!guestMap.has(phone)) {
          guestMap.set(phone, {
            phone,
            name: booking.guest_name,
            email: booking.guest_email,
            bookings: [],
            lastBooking: booking,
          });
        }
        guestMap.get(phone).bookings.push(booking);
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

  // Filter guests by search term
  const filteredGuests = guests.filter(guest => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      guest.name?.toLowerCase().includes(term) ||
      guest.phone?.includes(term) ||
      guest.email?.toLowerCase().includes(term)
    );
  });

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
      case 'checked_in':
        return 'text-green-400';
      case 'pending_payment':
      case 'partial_payment':
        return 'text-yellow-400';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-[#8a93a1]';
    }
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

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6d7683]" />
          <input
            type="text"
            placeholder="Search by name, phone or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#333b47] border border-white/10 rounded-xl text-white placeholder-[#6d7683] focus:outline-none focus:border-[#f5791f]/50 transition-colors"
          />
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Guest list */}
        {filteredGuests.length === 0 ? (
          <EmptyState
            icon={Users}
            title={searchTerm ? 'No results' : 'No guests'}
            description={
              searchTerm
                ? 'No guests found matching your search'
                : 'No guests with recent bookings'
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredGuests.map((guest) => (
              <button
                key={guest.phone}
                onClick={() => onSelectGuest(guest.phone)}
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
                  <p className="text-white font-semibold truncate">
                    {guest.name || 'Guest without name'}
                  </p>

                  <div className="flex items-center gap-3 mt-1 text-sm text-[#8a93a1]">
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3" />
                      {guest.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {guest.bookings.length} booking{guest.bookings.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Last booking info */}
                  <div className="flex items-center gap-2 mt-1.5 text-xs">
                    <span className="text-[#6d7683]">
                      Last: {formatDate(guest.lastBooking.check_in)}
                    </span>
                    {guest.lastBooking.villas?.name && (
                      <>
                        <span className="text-[#6d7683]">·</span>
                        <span className="text-[#aab2bf]">
                          {guest.lastBooking.villas.name}
                        </span>
                      </>
                    )}
                    <span className={`ml-auto ${getStatusColor(guest.lastBooking.status)}`}>
                      {guest.lastBooking.status}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 text-[#6d7683] group-hover:text-[#f5791f] transition-colors flex-shrink-0" />
              </button>
            ))}
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

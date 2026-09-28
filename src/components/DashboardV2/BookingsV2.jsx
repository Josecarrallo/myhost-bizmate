import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Calendar,
  Sparkles
} from 'lucide-react';

const BookingsV2 = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [villaFilter, setVillaFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Demo data for presentation
  const demoVillas = [
    { id: 'v1', name: 'Tropical Cascade' },
    { id: 'v2', name: 'Garden Villa' },
    { id: 'v3', name: 'Ocean View' },
    { id: 'v4', name: 'River Villa' },
    { id: 'v5', name: 'Jungle Villa' },
    { id: 'v6', name: 'Sunset Suite' }
  ];

  const demoBookings = [
    {
      id: 1,
      confirmation_code: 'IZU-0366',
      guest_name: 'Test Cacade',
      villa_id: 'v1',
      villas: { name: 'Tropical Cascade' },
      check_in: '2026-10-20',
      check_out: '2026-10-23',
      status: 'cancelled',
      channel: 'Direct',
      total_price: 23700000
    },
    {
      id: 2,
      confirmation_code: 'IZU-0365',
      guest_name: 'Emma Thompson',
      villa_id: 'v2',
      villas: { name: 'Garden Villa' },
      check_in: '2026-10-18',
      check_out: '2026-10-21',
      status: 'confirmed',
      channel: 'Booking.com',
      total_price: 15800000
    },
    {
      id: 3,
      confirmation_code: 'IZU-0364',
      guest_name: 'Daniel Kim',
      villa_id: 'v3',
      villas: { name: 'Ocean View' },
      check_in: '2026-10-15',
      check_out: '2026-10-20',
      status: 'partial_payment',
      channel: 'Airbnb',
      total_price: 18200000
    },
    {
      id: 4,
      confirmation_code: 'IZU-0363',
      guest_name: 'Sophie Martin',
      villa_id: 'v1',
      villas: { name: 'Tropical Cascade' },
      check_in: '2026-10-12',
      check_out: '2026-10-15',
      status: 'pending',
      channel: 'Direct',
      total_price: 12400000
    },
    {
      id: 5,
      confirmation_code: 'IZU-0362',
      guest_name: 'James Wilson',
      villa_id: 'v4',
      villas: { name: 'River Villa' },
      check_in: '2026-10-10',
      check_out: '2026-10-14',
      status: 'confirmed',
      channel: 'Agoda',
      total_price: 22100000
    },
    {
      id: 6,
      confirmation_code: 'IZU-0361',
      guest_name: 'Olivia Chen',
      villa_id: 'v5',
      villas: { name: 'Jungle Villa' },
      check_in: '2026-10-08',
      check_out: '2026-10-12',
      status: 'confirmed',
      channel: 'Direct',
      total_price: 16800000
    },
    {
      id: 7,
      confirmation_code: 'IZU-0360',
      guest_name: 'Lucas Anderson',
      villa_id: 'v1',
      villas: { name: 'Tropical Cascade' },
      check_in: '2026-10-05',
      check_out: '2026-10-08',
      status: 'checked_in',
      channel: 'Booking.com',
      total_price: 17900000
    },
    {
      id: 8,
      confirmation_code: 'IZU-0359',
      guest_name: 'Amelia Rodriguez',
      villa_id: 'v2',
      villas: { name: 'Garden Villa' },
      check_in: '2026-10-06',
      check_out: '2026-10-10',
      status: 'checked_out',
      channel: 'Airbnb',
      total_price: 17900000
    },
    {
      id: 9,
      confirmation_code: 'IZU-0358',
      guest_name: 'William Brown',
      villa_id: 'v3',
      villas: { name: 'Ocean View' },
      check_in: '2026-10-01',
      check_out: '2026-10-05',
      status: 'confirmed',
      channel: 'Direct',
      total_price: 14500000
    },
    {
      id: 10,
      confirmation_code: 'IZU-0357',
      guest_name: 'Isabella Garcia',
      villa_id: 'v6',
      villas: { name: 'Sunset Suite' },
      check_in: '2026-09-28',
      check_out: '2026-10-02',
      status: 'checked_out',
      channel: 'Agoda',
      total_price: 19200000
    },
    {
      id: 11,
      confirmation_code: 'IZU-0356',
      guest_name: 'Alexander Lee',
      villa_id: 'v4',
      villas: { name: 'River Villa' },
      check_in: '2026-09-25',
      check_out: '2026-09-30',
      status: 'checked_out',
      channel: 'Booking.com',
      total_price: 21300000
    },
    {
      id: 12,
      confirmation_code: 'IZU-0355',
      guest_name: 'Mia Johnson',
      villa_id: 'v5',
      villas: { name: 'Jungle Villa' },
      check_in: '2026-09-22',
      check_out: '2026-09-27',
      status: 'confirmed',
      channel: 'Airbnb',
      total_price: 16100000
    }
  ];

  const villas = demoVillas;
  const bookings = demoBookings;

  // Generate booking code
  const getBookingCode = (booking) => {
    if (booking.confirmation_code) return booking.confirmation_code;
    const prefix = 'IZU';
    const num = String(booking.id || Math.random() * 10000).slice(-4).padStart(4, '0');
    return `${prefix}-${num}`;
  };

  // Calculate nights
  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '-';
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : '-';
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Format price
  const formatPrice = (amount) => {
    if (!amount) return '-';
    return `IDR ${Number(amount).toLocaleString('id-ID')}`;
  };

  // Get status style
  const getStatusStyle = (status) => {
    const statusLower = (status || '').toLowerCase();
    switch (statusLower) {
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'partial_payment':
      case 'partial payment':
        return 'bg-orange-100 text-orange-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'checked_in':
      case 'checked-in':
        return 'bg-emerald-100 text-emerald-700';
      case 'checked_out':
      case 'checked-out':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Format status label
  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get source/channel display
  const getSourceDisplay = (booking) => {
    const channel = booking.channel || booking.source || 'Direct';
    const channelLower = channel.toLowerCase();

    if (channelLower.includes('airbnb')) return 'Airbnb';
    if (channelLower.includes('booking')) return 'Booking.com';
    if (channelLower.includes('agoda')) return 'Agoda';
    if (channelLower.includes('expedia')) return 'Expedia';
    if (channelLower.includes('direct') || channelLower.includes('manual')) return 'Direct';

    return 'Direct';
  };

  // Get guest initials
  const getGuestInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const guestName = (booking.guest_name || '').toLowerCase();
      const code = getBookingCode(booking).toLowerCase();
      const villaName = (booking.villas?.name || '').toLowerCase();
      if (!guestName.includes(search) && !code.includes(search) && !villaName.includes(search)) {
        return false;
      }
    }

    // Status filter
    if (statusFilter !== 'all') {
      const bookingStatus = (booking.status || '').toLowerCase().replace(/[_-]/g, '');
      const filterStatus = statusFilter.toLowerCase().replace(/[_-]/g, '');
      if (bookingStatus !== filterStatus) return false;
    }

    // Channel filter
    if (channelFilter !== 'all') {
      const source = getSourceDisplay(booking).toLowerCase();
      if (source !== channelFilter.toLowerCase()) return false;
    }

    // Villa filter
    if (villaFilter !== 'all') {
      if (booking.villa_id !== villaFilter) return false;
    }

    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Current date display
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

  return (
    <div className="flex-1 h-screen bg-[#F7F5F0] overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#F7F5F0] border-b border-[#E8E4DC] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#1a1a1a]">Bookings</h1>
            <p className="text-sm text-gray-500">{filteredBookings.length} reservations</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Ask Bizmate */}
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8E4DC] rounded-lg hover:border-[#B98A3D] transition-colors">
              <Sparkles className="w-4 h-4 text-[#B98A3D]" />
              <span className="text-sm text-gray-700">Ask Bizmate</span>
            </button>

            {/* Add Booking */}
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Booking</span>
            </button>

            {/* Date & Time */}
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-[#E8E4DC]">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{currentDate}</span>
              <span className="text-sm text-gray-400">{currentTime}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mt-4">
          {/* Villa Filter */}
          <div className="relative">
            <select
              value={villaFilter}
              onChange={(e) => setVillaFilter(e.target.value)}
              className="appearance-none bg-white border border-[#E8E4DC] rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:border-[#B98A3D]"
            >
              <option value="all">All Villas</option>
              {villas.map(villa => (
                <option key={villa.id} value={villa.id}>{villa.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-[#E8E4DC] rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:border-[#B98A3D]"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="checked_in">Checked-in</option>
              <option value="checked_out">Checked-out</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Channel Filter */}
          <div className="relative">
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="appearance-none bg-white border border-[#E8E4DC] rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:border-[#B98A3D]"
            >
              <option value="all">All Channels</option>
              <option value="direct">Direct</option>
              <option value="airbnb">Airbnb</option>
              <option value="booking.com">Booking.com</option>
              <option value="agoda">Agoda</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Date Range */}
          <button className="flex items-center gap-2 bg-white border border-[#E8E4DC] rounded-lg px-4 py-2 text-sm text-gray-700 hover:border-[#B98A3D] transition-colors">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>01 Oct 2026 – 31 Oct 2026</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search guest, code, email or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[#E8E4DC] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#B98A3D]"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-xl border border-[#E8E4DC] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#FAFAF8] border-b border-[#E8E4DC]">
                <th className="text-left px-3 py-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="text-left px-3 py-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                <th className="text-left px-3 py-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider">Villa / Room</th>
                <th className="text-left px-3 py-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                <th className="text-left px-3 py-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
                <th className="text-left px-3 py-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider">Nights</th>
                <th className="text-left px-3 py-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-3 py-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="text-left px-3 py-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-3 py-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DC]">
              {paginatedBookings.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                paginatedBookings.map((booking, idx) => (
                  <tr key={booking.id || idx} className="hover:bg-[#FAFAF8] transition-colors">
                    {/* Code */}
                    <td className="px-3 py-2">
                      <span className="text-xs font-medium text-[#B98A3D]">
                        {getBookingCode(booking)}
                      </span>
                    </td>

                    {/* Guest */}
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#B98A3D] to-[#D7B46A] flex items-center justify-center text-white text-[10px] font-medium">
                          {getGuestInitials(booking.guest_name)}
                        </div>
                        <span className="text-xs text-gray-900">{booking.guest_name || 'Unknown Guest'}</span>
                      </div>
                    </td>

                    {/* Villa */}
                    <td className="px-3 py-2">
                      <span className="text-xs text-gray-700">{booking.villas?.name || 'Unknown'}</span>
                    </td>

                    {/* Check-in */}
                    <td className="px-3 py-2">
                      <span className="text-xs text-gray-700">{formatDate(booking.check_in)}</span>
                    </td>

                    {/* Check-out */}
                    <td className="px-3 py-2">
                      <span className="text-xs text-gray-700">{formatDate(booking.check_out)}</span>
                    </td>

                    {/* Nights */}
                    <td className="px-3 py-2">
                      <span className="text-xs text-gray-700">{calculateNights(booking.check_in, booking.check_out)}</span>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-2">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusStyle(booking.status)}`}>
                        {formatStatus(booking.status)}
                      </span>
                    </td>

                    {/* Source */}
                    <td className="px-3 py-2">
                      <span className="text-xs text-gray-700">{getSourceDisplay(booking)}</span>
                    </td>

                    {/* Price */}
                    <td className="px-3 py-2">
                      <span className="text-xs font-medium text-gray-900">{formatPrice(booking.total_price)}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-2">
                      <button className="p-0.5 hover:bg-gray-100 rounded transition-colors">
                        <MoreHorizontal className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} reservations
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-[#E8E4DC] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-[#B98A3D] text-white'
                        : 'hover:bg-white text-gray-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="px-1 text-gray-400">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-8 h-8 rounded-lg text-sm font-medium hover:bg-white text-gray-600"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-[#E8E4DC] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsV2;

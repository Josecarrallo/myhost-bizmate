import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Plus,
  Calendar,
  Users,
  TrendingUp,
  Filter,
  Search,
  X,
  MapPin,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Mail,
  Phone,
  ClipboardList,
  CreditCard,
  Zap
} from 'lucide-react';
import { StatCard } from '../common';
import { dataService } from '../../services/data';
import { supabaseService } from '../../services/supabase';
import n8nService from '../../services/n8n';

const Bookings = ({ onBack }) => {
  // State for bookings data
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock bookings data (fallback)
  const mockBookings = [
    { id: 1, guest: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1 555-0101', property: 'Villa Sunset Paradise', checkIn: '2025-01-15', checkOut: '2025-01-20', status: 'Confirmed', guests: 4, revenue: 1250, channel: 'Airbnb', nights: 5, notes: 'Early check-in requested', paymentStatus: 'Paid', tasks: ['Housekeeping scheduled', 'Pool cleaning'] },
    { id: 2, guest: 'Michael Chen', email: 'mchen@email.com', phone: '+1 555-0102', property: 'Beach House', checkIn: '2025-01-18', checkOut: '2025-01-23', status: 'Pending', guests: 6, revenue: 1800, channel: 'Booking.com', nights: 5, notes: 'Awaiting payment confirmation', paymentStatus: 'Pending', tasks: [] },
    { id: 3, guest: 'Emma Wilson', email: 'ewilson@email.com', phone: '+1 555-0103', property: 'City Loft', checkIn: '2025-01-12', checkOut: '2025-01-15', status: 'In Progress', guests: 2, revenue: 950, channel: 'Direct', nights: 3, notes: 'Guest currently checked in', paymentStatus: 'Paid', tasks: ['Daily cleaning'] },
    { id: 4, guest: 'David Park', email: 'dpark@email.com', phone: '+1 555-0104', property: 'Mountain Cabin', checkIn: '2025-01-10', checkOut: '2025-01-13', status: 'Completed', guests: 5, revenue: 720, channel: 'Airbnb', nights: 3, notes: 'Excellent stay, left review', paymentStatus: 'Paid', tasks: ['Checkout completed', 'Final cleaning done'] },
    { id: 5, guest: 'Sofia Martinez', email: 'sofia.m@email.com', phone: '+1 555-0105', property: 'Villa Sunset Paradise', checkIn: '2025-01-22', checkOut: '2025-01-28', status: 'Confirmed', guests: 3, revenue: 1680, channel: 'Direct', nights: 6, notes: 'Honeymoon guests - special amenities', paymentStatus: 'Paid', tasks: ['Welcome basket prepared', 'Romantic setup'] },
    { id: 6, guest: 'James Anderson', email: 'j.anderson@email.com', phone: '+1 555-0106', property: 'Beach House', checkIn: '2025-01-25', checkOut: '2025-01-30', status: 'Confirmed', guests: 4, revenue: 1600, channel: 'Agoda', nights: 5, notes: '', paymentStatus: 'Paid', tasks: [] },
    { id: 7, guest: 'Lisa Thompson', email: 'lisa.t@email.com', phone: '+1 555-0107', property: 'City Loft', checkIn: '2025-02-01', checkOut: '2025-02-05', status: 'Pending', guests: 2, revenue: 1200, channel: 'Booking.com', nights: 4, notes: 'Payment link sent', paymentStatus: 'Pending', tasks: [] },
    { id: 8, guest: 'Robert Kim', email: 'rkim@email.com', phone: '+1 555-0108', property: 'Mountain Cabin', checkIn: '2025-01-28', checkOut: '2025-02-02', status: 'Confirmed', guests: 6, revenue: 1440, channel: 'Airbnb', nights: 5, notes: 'Group booking - corporate retreat', paymentStatus: 'Paid', tasks: ['Extra bedding requested'] },
    { id: 9, guest: 'Maria Garcia', email: 'mgarcia@email.com', phone: '+1 555-0109', property: 'Villa Sunset Paradise', checkIn: '2025-01-08', checkOut: '2025-01-11', status: 'Cancelled', guests: 2, revenue: 0, channel: 'Direct', nights: 3, notes: 'Cancelled due to emergency', paymentStatus: 'Refunded', tasks: ['Refund processed'] },
    { id: 10, guest: 'John Smith', email: 'jsmith@email.com', phone: '+1 555-0110', property: 'Beach House', checkIn: '2025-02-05', checkOut: '2025-02-12', status: 'Confirmed', guests: 5, revenue: 2520, channel: 'Direct', nights: 7, notes: 'Long stay guest - weekly discount applied', paymentStatus: 'Paid', tasks: [] },
  ];

  // Load bookings from Supabase
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await dataService.getBookings();
      console.log('[Bookings] Loaded from Supabase:', data);

      if (data && data.length > 0) {
        // Map Supabase data to component format
        const mappedBookings = data.map(booking => ({
          id: booking.id,
          guest: booking.guest_name,
          email: booking.guest_email || 'N/A',
          phone: booking.guest_phone || 'N/A',
          property: `Property ${booking.property_id?.substring(0, 8)}`,
          checkIn: booking.check_in,
          checkOut: booking.check_out,
          status: capitalizeFirst(booking.status),
          guests: booking.guests || 0,
          revenue: parseFloat(booking.total_price) || 0,
          channel: capitalizeFirst(booking.source || 'direct'),
          nights: booking.nights || 0,
          notes: booking.notes || '',
          paymentStatus: capitalizeFirst(booking.payment_status),
          tasks: []
        }));
        setAllBookings(mappedBookings);
        console.log('[Bookings] Using real bookings:', mappedBookings.length);
      } else {
        // Use mock data if no real data
        setAllBookings(mockBookings);
        console.log('[Bookings] No real bookings, using mock:', mockBookings.length);
      }
    } catch (error) {
      console.error('[Bookings] Error loading:', error);
      setAllBookings(mockBookings);
      console.log('[Bookings] Fallback to mock bookings:', mockBookings.length);
    } finally {
      setLoading(false);
    }
  };

  const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterProperty, setFilterProperty] = useState('All');
  const [filterChannel, setFilterChannel] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [testingWorkflow, setTestingWorkflow] = useState(false);

  // Test workflow function
  const handleTestWorkflow = async () => {
    setTestingWorkflow(true);

    try {
      console.log('[Bookings] 🧪 Testing n8n workflow...');

      // Get first property from Supabase
      const properties = await supabaseService.getProperties();
      const firstProperty = properties && properties.length > 0 ? properties[0] : null;

      // Create test booking data
      const testBooking = {
        property_id: firstProperty?.id || '18711359-1378-4d12-9ea6-fb31c0b1bac2',
        guest_name: 'Test User - n8n Integration',
        guest_email: 'josecarrallodelafuente@gmail.com',
        guest_phone: '34619794604',
        check_in: '2026-01-20',
        check_out: '2026-01-25',
        guests: 2,
        total_price: 500,
        status: 'confirmed',
        channel: 'direct',
        notes: '🧪 TEST BOOKING - n8n workflow integration test',
        payment_status: 'paid',
        nights: 5,
        currency: 'USD'
      };

      console.log('[Bookings] 📤 Creating test booking in Supabase:', testBooking);

      // Create booking in Supabase
      const createdBooking = await supabaseService.createBooking(testBooking);
      console.log('[Bookings] ✅ Booking created:', createdBooking);

      // Trigger n8n workflow
      console.log('[Bookings] 🔄 Triggering n8n workflow...');
      const workflowResult = await n8nService.onBookingCreated(createdBooking);
      console.log('[Bookings] ✅ n8n workflow result:', workflowResult);

      alert(`✅ Test booking created!\n\n📧 Check email: ${testBooking.guest_email}\n📱 Check WhatsApp: ${testBooking.guest_phone}\n\nWorkflow triggered successfully! Check console for details.`);

      // Reload bookings to show the new test booking
      await loadBookings();
    } catch (error) {
      console.error('[Bookings] ❌ Test failed:', error);
      alert(`❌ Test failed: ${error.message}`);
    } finally {
      setTestingWorkflow(false);
    }
  };

  // Get unique properties and channels
  const properties = ['All', ...new Set(allBookings.map(b => b.property))];
  const channels = ['All', ...new Set(allBookings.map(b => b.channel))];
  const statuses = ['All', 'Confirmed', 'Pending', 'In Progress', 'Completed', 'Cancelled'];

  // Filter bookings
  const filteredBookings = allBookings.filter(booking => {
    const matchesSearch = booking.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || booking.status === filterStatus;
    const matchesProperty = filterProperty === 'All' || booking.property === filterProperty;
    const matchesChannel = filterChannel === 'All' || booking.channel === filterChannel;

    return matchesSearch && matchesStatus && matchesProperty && matchesChannel;
  });

  // Status badge styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Completed':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-600 border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      case 'In Progress':
        return <Users className="w-4 h-4" />;
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Stats
  const stats = {
    active: allBookings.filter(b => b.status === 'Confirmed' || b.status === 'In Progress').length,
    totalGuests: allBookings.filter(b => b.status !== 'Cancelled').reduce((sum, b) => sum + b.guests, 0),
    checkinsToday: 3
  };

  return (
    <div className="flex-1 h-screen bg-[#2a2f3a] p-4 pb-24 relative overflow-auto">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-[#d85a2a]/5 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl hover:bg-[#1f2937] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#d85a2a]/20">
            <ChevronLeft className="w-6 h-6 text-[#FF8C42]" />
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl">Bookings</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleTestWorkflow}
              disabled={testingWorkflow}
              className="px-4 py-3 bg-purple-500/95 backdrop-blur-sm text-white rounded-2xl font-bold hover:bg-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#d85a2a]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-5 h-5 inline mr-2" />
              {testingWorkflow ? 'Testing...' : 'Test n8n'}
            </button>
            <button className="px-6 py-3 bg-[#1f2937]/95 backdrop-blur-sm text-[#FF8C42] rounded-2xl font-bold hover:bg-[#1f2937] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#d85a2a]/20">
              <Plus className="w-5 h-5 inline mr-2" /> New Booking
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard icon={Calendar} label="Active Bookings" value={stats.active.toString()} trend="+8%" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={Users} label="Total Guests" value={stats.totalGuests.toString()} trend="+15%" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={TrendingUp} label="Check-ins Today" value={stats.checkinsToday.toString()} gradient="from-orange-500 to-orange-600" />
        </div>

        {/* Search and Filters */}
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400" />
              <input
                type="text"
                placeholder="Search by guest name, property, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#2a2f3a] border-2 border-[#d85a2a]/30-200 rounded-2xl text-[#FF8C42] placeholder:text-gray-400 focus:outline-none focus:border-orange-300 font-medium"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-[#2a2f3a] border-2 border-[#d85a2a]/30-200 rounded-2xl font-bold hover:border-orange-300 transition-all duration-300 shadow-md flex items-center gap-2 text-[#FF8C42] justify-center"
            >
              <Filter className="w-5 h-5" /> Filters {showFilters && <span className="text-xs">(Active)</span>}
            </button>
          </div>

          {/* Filter Dropdowns */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t-2 border-gray-200">
              <div>
                <label className="text-xs font-bold text-[#FF8C42] mb-2 block">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-[#2a2f3a] border-2 border-[#d85a2a]/30-200 rounded-xl text-[#FF8C42] focus:outline-none focus:border-orange-300 font-medium"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#FF8C42] mb-2 block">Property</label>
                <select
                  value={filterProperty}
                  onChange={(e) => setFilterProperty(e.target.value)}
                  className="w-full px-4 py-2 bg-[#2a2f3a] border-2 border-[#d85a2a]/30-200 rounded-xl text-[#FF8C42] focus:outline-none focus:border-orange-300 font-medium"
                >
                  {properties.map(property => (
                    <option key={property} value={property}>{property}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#FF8C42] mb-2 block">Channel</label>
                <select
                  value={filterChannel}
                  onChange={(e) => setFilterChannel(e.target.value)}
                  className="w-full px-4 py-2 bg-[#2a2f3a] border-2 border-[#d85a2a]/30-200 rounded-xl text-[#FF8C42] focus:outline-none focus:border-orange-300 font-medium"
                >
                  {channels.map(channel => (
                    <option key={channel} value={channel}>{channel}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Bookings Table */}
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-[#d85a2a]/20 overflow-hidden">
          <div className="p-6 border-b-2 border-gray-200">
            <h3 className="text-2xl font-black text-[#FF8C42]">
              All Bookings ({filteredBookings.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-orange-50 to-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-[#FF8C42] uppercase tracking-wider">Guest</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-[#FF8C42] uppercase tracking-wider">Property</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-[#FF8C42] uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-[#FF8C42] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-[#FF8C42] uppercase tracking-wider">Guests</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-[#FF8C42] uppercase tracking-wider">Channel</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-[#FF8C42] uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-[#FF8C42] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-[#d85a2a]/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#FF8C42]">{booking.guest}</div>
                      <div className="text-xs text-gray-500">{booking.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-400" />
                        <span className="text-[#FF8C42] font-medium">{booking.property}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[#FF8C42] font-medium">{booking.checkIn}</div>
                      <div className="text-xs text-gray-500">{booking.checkOut}</div>
                      <div className="text-xs text-gray-500">{booking.nights} nights</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusStyle(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-[#FF8C42] font-bold">
                        <Users className="w-4 h-4" />
                        {booking.guests}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[#FF8C42] font-medium">{booking.channel}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-[#FF8C42] font-black">
                        <DollarSign className="w-4 h-4" />
                        {booking.revenue.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(booking);
                        }}
                        className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors shadow-md"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-[#FF8C42] font-bold">No bookings found matching your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedBooking(null)}>
          <div className="bg-[#1f2937] rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-black text-white mb-1">Booking Details</h3>
                  <p className="text-orange-100 font-medium">Booking ID: #{selectedBooking.id}</p>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 bg-[#d85a2a]/10 hover:bg-white/30 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Guest Information */}
              <div className="border-2 border-gray-200 rounded-2xl p-4">
                <h4 className="text-xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Guest Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">Name</p>
                    <p className="text-[#FF8C42] font-bold">{selectedBooking.guest}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">Guests</p>
                    <p className="text-[#FF8C42] font-bold">{selectedBooking.guests} people</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">Email</p>
                    <p className="text-[#FF8C42] font-medium flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {selectedBooking.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">Phone</p>
                    <p className="text-[#FF8C42] font-medium flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {selectedBooking.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="border-2 border-gray-200 rounded-2xl p-4">
                <h4 className="text-xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Booking Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">Property</p>
                    <p className="text-[#FF8C42] font-bold">{selectedBooking.property}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">Channel</p>
                    <p className="text-[#FF8C42] font-bold">{selectedBooking.channel}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">Check-in</p>
                    <p className="text-[#FF8C42] font-bold">{selectedBooking.checkIn}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">Check-out</p>
                    <p className="text-[#FF8C42] font-bold">{selectedBooking.checkOut}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">Nights</p>
                    <p className="text-[#FF8C42] font-bold">{selectedBooking.nights} nights</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">Status</p>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusStyle(selectedBooking.status)}`}>
                      {getStatusIcon(selectedBooking.status)}
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="border-2 border-gray-200 rounded-2xl p-4">
                <h4 className="text-xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">Total Revenue</p>
                    <p className="text-[#FF8C42] font-black text-2xl">${selectedBooking.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">Payment Status</p>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border-2 ${
                      selectedBooking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-600 border-green-200' :
                      selectedBooking.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-600 border-yellow-200' :
                      'bg-red-100 text-red-600 border-red-200'
                    }`}>
                      {selectedBooking.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="border-2 border-gray-200 rounded-2xl p-4">
                <h4 className="text-xl font-black text-[#FF8C42] mb-4">Internal Notes</h4>
                <p className="text-gray-600 font-medium">{selectedBooking.notes || 'No notes available.'}</p>
              </div>

              {/* Associated Tasks */}
              <div className="border-2 border-gray-200 rounded-2xl p-4">
                <h4 className="text-xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" />
                  Associated Tasks
                </h4>
                {selectedBooking.tasks.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedBooking.tasks.map((task, index) => (
                      <li key={index} className="flex items-center gap-2 text-[#FF8C42] font-medium">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {task}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 font-medium">No tasks assigned yet.</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t-2 border-gray-200 flex gap-3">
              <button className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-colors shadow-md">
                Edit Booking
              </button>
              <button className="flex-1 px-6 py-3 bg-gray-200 text-[#FF8C42] rounded-2xl font-bold hover:bg-gray-300 transition-colors">
                Send Message
              </button>
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-6 py-3 bg-[#2a2f3a] border-2 border-[#d85a2a]/30-300 text-[#FF8C42] rounded-2xl font-bold hover:border-orange-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;

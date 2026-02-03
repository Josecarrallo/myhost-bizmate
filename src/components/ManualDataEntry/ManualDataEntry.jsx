import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  UserPlus,
  Calendar,
  DollarSign,
  CheckCircle,
  X,
  Save,
  Phone,
  Mail,
  MessageSquare,
  Users,
  Home,
  CreditCard,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabaseService } from '../../services/supabase';

const ManualDataEntry = ({ onBack }) => {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState('view-bookings'); // Start with view mode

  // UI states for loading and messages
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Data from Supabase
  const [properties, setProperties] = useState([]);
  const [villas, setVillas] = useState([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);

  // Bookings table data
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [filterProperty, setFilterProperty] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchGuest, setSearchGuest] = useState('');
  const [searchInput, setSearchInput] = useState(''); // Separate input value from filter

  // Edit/Delete modals
  const [editingBooking, setEditingBooking] = useState(null);
  const [deletingBooking, setDeletingBooking] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    checkIn: '',
    checkOut: '',
    guests: '2',
    totalAmount: '',
    status: 'hold'
  });

  // Form states
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    checkIn: '',
    checkOut: '',
    guests: '2',
    source: 'manual'
  });

  const [bookingForm, setBookingForm] = useState({
    leadId: '',
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    propertyId: '',
    villaId: '',
    checkIn: '',
    checkOut: '',
    guests: '2',
    totalAmount: '',
    status: 'hold'
  });

  const [paymentForm, setPaymentForm] = useState({
    bookingId: '',
    amount: '',
    paymentMethod: 'bank_transfer',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [taskForm, setTaskForm] = useState({
    title: '',
    category: 'housekeeping',
    priority: 'medium',
    assignedTo: '',
    dueDate: '',
    description: ''
  });

  // Load properties and villas when component mounts
  useEffect(() => {
    const loadPropertiesAndVillas = async () => {
      if (!userData?.id) return;

      try {
        setIsLoadingProperties(true);

        // Fetch properties for this owner
        const allProperties = await supabaseService.getProperties();
        const ownerProperties = allProperties.filter(p => p.owner_id === userData.id);
        setProperties(ownerProperties);

        // If there's only one property, auto-select it and load its villas
        if (ownerProperties.length === 1) {
          const propertyId = ownerProperties[0].id;
          setBookingForm(prev => ({ ...prev, propertyId }));
          await loadVillasForProperty(propertyId);
        }
      } catch (error) {
        console.error('Error loading properties:', error);
        setErrorMessage('Failed to load properties');
      } finally {
        setIsLoadingProperties(false);
      }
    };

    loadPropertiesAndVillas();
  }, [userData]);

  // Load villas when property is selected
  const loadVillasForProperty = async (propertyId) => {
    try {
      // Fetch villas from Supabase
      const response = await fetch(
        `${supabaseService.SUPABASE_URL || 'https://jjpscimtxrudtepzwhag.supabase.co'}/rest/v1/villas?property_id=eq.${propertyId}&status=eq.active&select=*`,
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0'
          }
        }
      );

      if (response.ok) {
        const villasData = await response.json();
        setVillas(villasData);

        // Auto-select first villa if there's only one
        if (villasData.length === 1) {
          setBookingForm(prev => ({ ...prev, villaId: villasData[0].id }));
        }
      }
    } catch (error) {
      console.error('Error loading villas:', error);
    }
  };

  // Handle property selection change
  const handlePropertyChange = (propertyId) => {
    setBookingForm(prev => ({ ...prev, propertyId, villaId: '', totalAmount: '' }));
    if (propertyId) {
      loadVillasForProperty(propertyId);
    } else {
      setVillas([]);
    }
  };

  // Calculate total amount automatically
  const calculateTotalAmount = () => {
    const { checkIn, checkOut, villaId } = bookingForm;

    if (!checkIn || !checkOut || !villaId) {
      return;
    }

    // Calculate nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return;
    }

    // Find selected villa
    const selectedVilla = villas.find(v => v.id === villaId);
    if (!selectedVilla || !selectedVilla.base_price) {
      return;
    }

    // Calculate total
    const totalAmount = selectedVilla.base_price * nights;
    setBookingForm(prev => ({ ...prev, totalAmount: totalAmount.toString() }));
  };

  // Auto-calculate when villa, check-in, or check-out changes
  useEffect(() => {
    calculateTotalAmount();
  }, [bookingForm.villaId, bookingForm.checkIn, bookingForm.checkOut, villas]);

  // Load bookings for the owner
  const loadBookings = async () => {
    if (!userData?.id) {
      console.warn('❌ No userData.id - cannot load bookings');
      return;
    }

    try {
      setIsLoadingBookings(true);

      // Build filters
      const filters = {
        tenant_id: userData.id // CRITICAL: Multi-tenant filtering
      };

      if (filterProperty) {
        filters.property_id = filterProperty;
      }

      if (filterStatus) {
        filters.status = filterStatus;
      }

      if (searchGuest) {
        filters.guest_name = searchGuest;
      }

      console.log('🔍 Loading bookings with filters:', filters);

      // Fetch bookings
      const bookingsData = await supabaseService.getBookings(filters);

      console.log(`✅ Loaded ${bookingsData.length} bookings:`, bookingsData.map(b => ({
        guest: b.guest_name,
        checkIn: b.check_in,
        tenant: b.tenant_id
      })));

      setBookings(bookingsData);

    } catch (error) {
      console.error('❌ Error loading bookings:', error);
      const errorMsg = error.message || 'Failed to load bookings. Please try again.';
      setErrorMessage(errorMsg);

      // Auto-clear error after 5 seconds
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  // Load bookings when tab changes to view-bookings or filters change
  useEffect(() => {
    if (activeTab === 'view-bookings') {
      loadBookings();
    }
  }, [activeTab, filterProperty, filterStatus, searchGuest, userData]);

  // Manual search trigger (not automatic)
  const handleSearch = () => {
    setSearchGuest(searchInput);
  };

  // Handle delete booking
  const handleDeleteBooking = async () => {
    if (!deletingBooking) return;

    try {
      setIsDeleting(true);
      await supabaseService.deleteBooking(deletingBooking.id);

      // Success - reload bookings
      setSuccessMessage(`Booking for ${deletingBooking.guest_name} deleted successfully`);
      setDeletingBooking(null);
      loadBookings();

      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error deleting booking:', error);
      setErrorMessage('Failed to delete booking');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle edit booking (open modal with pre-filled form)
  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setEditForm({
      guestName: booking.guest_name || '',
      guestPhone: booking.guest_phone || '',
      guestEmail: booking.guest_email || '',
      checkIn: booking.check_in || '',
      checkOut: booking.check_out || '',
      guests: booking.guests?.toString() || '2',
      totalAmount: booking.total_price?.toString() || '',
      status: booking.status || 'hold'
    });
  };

  // Handle form submissions
  const handleSubmitLead = (e) => {
    e.preventDefault();
    console.log('Submitting lead:', leadForm);
    // TODO: Call webhook /webhook/inbound-lead-v3
    alert('Lead submitted successfully! (Demo mode)');
    // Reset form
    setLeadForm({
      name: '',
      phone: '',
      email: '',
      message: '',
      checkIn: '',
      checkOut: '',
      guests: '2',
      source: 'manual'
    });
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setSuccessMessage('');
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // Validate user is logged in
      if (!userData || !userData.id) {
        throw new Error('You must be logged in to create a booking');
      }

      // Calculate number of nights
      const checkInDate = new Date(bookingForm.checkIn);
      const checkOutDate = new Date(bookingForm.checkOut);
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

      if (nights <= 0) {
        throw new Error('Check-out date must be after check-in date');
      }

      // Get property currency
      const selectedProperty = properties.find(p => p.id === bookingForm.propertyId);
      const currency = selectedProperty?.currency || 'USD';

      // Prepare booking data for Supabase
      const bookingData = {
        tenant_id: userData.id, // Owner ID (multi-tenant isolation)
        property_id: bookingForm.propertyId,
        villa_id: bookingForm.villaId || null,
        guest_name: bookingForm.guestName,
        guest_email: bookingForm.guestEmail,
        guest_phone: bookingForm.guestPhone,
        check_in: bookingForm.checkIn,
        check_out: bookingForm.checkOut,
        guests: parseInt(bookingForm.guests),
        nights: nights,
        total_price: parseFloat(bookingForm.totalAmount),
        currency: currency,
        status: bookingForm.status === 'hold' ? 'pending_payment' : 'confirmed',
        payment_status: bookingForm.status === 'confirmed' ? 'paid' : 'pending',
        channel: 'direct', // Manual entries are considered direct bookings
        source: 'autopilot',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Call Supabase service
      const result = await supabaseService.createBooking(bookingData);

      // Success!
      setSuccessMessage(`Booking created successfully! Guest: ${bookingForm.guestName}, ${nights} nights`);

      // Reload bookings if we're on view-bookings tab
      if (activeTab === 'view-bookings' || activeTab === 'booking') {
        loadBookings();
      }

      // Reset form (keep propertyId if only one property)
      setBookingForm({
        leadId: '',
        guestName: '',
        guestPhone: '',
        guestEmail: '',
        propertyId: properties.length === 1 ? properties[0].id : '',
        villaId: '',
        checkIn: '',
        checkOut: '',
        guests: '2',
        totalAmount: '',
        status: 'hold'
      });

      // Auto-switch to View/Edit Bookings tab to see the new booking
      setTimeout(() => {
        setActiveTab('view-bookings');
      }, 1500);

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (error) {
      console.error('Error creating booking:', error);
      setErrorMessage(error.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle update booking
  const handleUpdateBooking = async (e) => {
    e.preventDefault();

    if (!editingBooking) return;

    // Clear previous messages
    setSuccessMessage('');
    setErrorMessage('');
    setIsSavingEdit(true);

    try {
      // Calculate number of nights
      const checkInDate = new Date(editForm.checkIn);
      const checkOutDate = new Date(editForm.checkOut);
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

      if (nights <= 0) {
        throw new Error('Check-out date must be after check-in date');
      }

      // Prepare updated booking data
      const updatedData = {
        guest_name: editForm.guestName,
        guest_email: editForm.guestEmail,
        guest_phone: editForm.guestPhone,
        check_in: editForm.checkIn,
        check_out: editForm.checkOut,
        guests: parseInt(editForm.guests),
        nights: nights,
        total_price: parseFloat(editForm.totalAmount),
        status: editForm.status === 'hold' ? 'pending_payment' : 'confirmed',
        payment_status: editForm.status === 'confirmed' ? 'paid' : (editForm.status === 'partial' ? 'partial' : 'pending'),
        updated_at: new Date().toISOString()
      };

      console.log('🔄 Updating booking:', editingBooking.id, updatedData);

      // Call Supabase service
      await supabaseService.updateBooking(editingBooking.id, updatedData);

      // Success!
      setSuccessMessage(`Booking updated successfully! Guest: ${editForm.guestName}`);

      // Close modal
      setEditingBooking(null);

      // Clear search filter before reloading to avoid CORS errors
      setSearchQuery('');

      // Reload bookings without search filter
      loadBookings();

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (error) {
      console.error('Error updating booking:', error);
      setErrorMessage(error.message || 'Failed to update booking. Please try again.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    console.log('Submitting payment:', paymentForm);
    // TODO: Update booking payment in Supabase
    alert('Payment updated successfully! (Demo mode)');
  };

  const handleSubmitTask = (e) => {
    e.preventDefault();
    console.log('Submitting task:', taskForm);
    // TODO: Insert into Supabase autopilot_actions table
    alert('Task created successfully! (Demo mode)');
  };

  const tabs = [
    { id: 'view-bookings', label: 'View/Edit Bookings', icon: ClipboardList },
    { id: 'booking', label: 'Add Booking', icon: Calendar },
    { id: 'lead', label: 'Add Lead', icon: UserPlus },
    { id: 'payment', label: 'Update Payment', icon: DollarSign },
    { id: 'task', label: 'Add Task', icon: CheckCircle }
  ];

  return (
    <div className="w-full h-full bg-[#2a2f3a] p-4 relative overflow-auto">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-[#d85a2a]/5 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="w-full h-full relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="p-2 bg-[#1f2937]/95 backdrop-blur-sm rounded-xl hover:bg-orange-500 transition-all border border-[#d85a2a]/20">
            <ArrowLeft className="w-5 h-5 text-[#FF8C42]" />
          </button>
          <div className="text-center">
            <h2 className="text-3xl font-black text-white drop-shadow-2xl">AUTOPILOT - Manual Data Entry</h2>
          </div>
          <div className="w-12"></div>
        </div>

        {/* Global Success/Error Messages */}
        {successMessage && (
          <div className="bg-green-500/20 border-2 border-green-500 rounded-xl p-3 flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <p className="text-green-100 font-medium">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-100 font-medium flex-1">{errorMessage}</p>
              <button
                onClick={() => {
                  setErrorMessage('');
                  loadBookings();
                }}
                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-2 shadow-lg border-2 border-[#d85a2a]/20 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all
                    ${activeTab === tab.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-[#FF8C42] border-2 border-gray-200 hover:border-orange-300'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden md:inline">{tab.label}</span>
                  <span className="md:hidden">{tab.label.split(' ')[1]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border-2 border-[#d85a2a]/20">

          {/* TAB: View/Edit Bookings */}
          {activeTab === 'view-bookings' && (
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
                <ClipboardList className="w-6 h-6 text-[#FF8C42]" />
                View/Edit Bookings
              </h3>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
                {/* Property Filter */}
                <select
                  value={filterProperty}
                  onChange={(e) => setFilterProperty(e.target.value)}
                  className="px-4 py-2 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-white focus:outline-none focus:border-orange-300"
                >
                  <option value="">All Properties</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-white focus:outline-none focus:border-orange-300"
                >
                  <option value="">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending_payment">Pending Payment</option>
                  <option value="checked_in">Checked In</option>
                  <option value="checked_out">Checked Out</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {/* Search Guest (no auto-search to avoid CORS errors) */}
                <div className="md:col-span-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Search guest name (press Enter)..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1 px-4 py-2 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-300"
                  />
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setFilterProperty('');
                    setFilterStatus('');
                    setSearchGuest('');
                    setSearchInput('');
                    loadBookings();
                  }}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all"
                >
                  Clear Filters
                </button>
              </div>

              {/* Loading State */}
              {isLoadingBookings && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                  <p className="text-white mt-4">Loading bookings...</p>
                </div>
              )}

              {/* Bookings Table */}
              {!isLoadingBookings && (
                <>
                  <div className="bg-[#2a2f3a] rounded-xl overflow-hidden border-2 border-gray-200">
                    <div className="overflow-x-auto">
                      <table className="w-full table-fixed">
                        <thead className="bg-orange-500">
                          <tr>
                            <th className="w-[18%] px-4 py-3 text-left text-white font-bold">Guest</th>
                            <th className="w-[15%] px-4 py-3 text-left text-white font-bold">Property</th>
                            <th className="w-[11%] px-4 py-3 text-left text-white font-bold">Check-in</th>
                            <th className="w-[11%] px-4 py-3 text-left text-white font-bold">Check-out</th>
                            <th className="w-[7%] px-4 py-3 text-center text-white font-bold">Nights</th>
                            <th className="w-[12%] px-4 py-3 text-left text-white font-bold">Status</th>
                            <th className="w-[12%] px-4 py-3 text-right text-white font-bold">Price</th>
                            <th className="w-[14%] px-4 py-3 text-center text-white font-bold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.length === 0 ? (
                            <tr>
                              <td colSpan="8" className="px-4 py-8 text-center text-gray-400">
                                No bookings found
                              </td>
                            </tr>
                          ) : (
                            bookings.map((booking, index) => (
                              <tr
                                key={booking.id}
                                className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-[#2a2f3a]' : 'bg-[#1f2937]'} hover:bg-[#374151] transition-colors`}
                              >
                                <td className="px-4 py-3 text-white font-medium truncate">{booking.guest_name}</td>
                                <td className="px-4 py-3 text-gray-300 text-sm truncate">
                                  {properties.find(p => p.id === booking.property_id)?.name || 'N/A'}
                                </td>
                                <td className="px-4 py-3 text-gray-300 text-sm">{booking.check_in}</td>
                                <td className="px-4 py-3 text-gray-300 text-sm">{booking.check_out}</td>
                                <td className="px-4 py-3 text-white font-bold text-center">{booking.nights}</td>
                                <td className="px-4 py-3">
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                                    booking.status === 'confirmed' ? 'bg-green-500 text-white' :
                                    booking.status === 'pending_payment' ? 'bg-yellow-500 text-black' :
                                    booking.status === 'cancelled' ? 'bg-red-500 text-white' :
                                    'bg-gray-500 text-white'
                                  }`}>
                                    {booking.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-white font-bold text-right">
                                  {booking.currency} {booking.total_price?.toLocaleString()}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex gap-2 justify-center">
                                    <button
                                      onClick={() => handleEditBooking(booking)}
                                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => setDeletingBooking(booking)}
                                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="flex justify-between items-center text-sm text-gray-300 mt-4">
                    <div>
                      Showing <span className="text-orange-400 font-bold">{bookings.length}</span> bookings
                    </div>
                    <div>
                      Total Revenue: <span className="text-green-400 font-bold">
                        {bookings.reduce((sum, b) => sum + (b.total_price || 0), 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB A: Add Lead / Inquiry */}
          {activeTab === 'lead' && (
            <form onSubmit={handleSubmitLead} className="space-y-4">
              <h3 className="text-2xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-[#FF8C42]" />
                Add New Lead / Inquiry
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-[#FF8C42] font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({...leadForm, name: e.target.value})}
                    className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                    placeholder="e.g. Sarah Johnson"
                  />
                </div>

              {/* Phone */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Phone (WhatsApp) *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({...leadForm, phone: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                    placeholder="+62 813 1234 5678"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                    placeholder="sarah@example.com"
                  />
                </div>
              </div>

              {/* Source */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Source</label>
                <select
                  value={leadForm.source}
                  onChange={(e) => setLeadForm({...leadForm, source: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="manual">Manual Entry</option>
                  <option value="web">Website</option>
                  <option value="instagram">Instagram</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="tiktok">TikTok</option>
                  <option value="referral">Referral</option>
                </select>
              </div>

              {/* Check-in Date */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Check-in Date</label>
                <input
                  type="date"
                  value={leadForm.checkIn}
                  onChange={(e) => setLeadForm({...leadForm, checkIn: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>

              {/* Check-out Date */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Check-out Date</label>
                <input
                  type="date"
                  value={leadForm.checkOut}
                  onChange={(e) => setLeadForm({...leadForm, checkOut: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>

              {/* Number of Guests */}
              <div className="md:col-span-2">
                <label className="block text-[#FF8C42] font-medium mb-2">Number of Guests</label>
                <select
                  value={leadForm.guests}
                  onChange={(e) => setLeadForm({...leadForm, guests: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="md:col-span-2">
                <label className="block text-[#FF8C42] font-medium mb-2">Message / Notes</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={leadForm.message}
                    onChange={(e) => setLeadForm({...leadForm, message: e.target.value})}
                    rows={3}
                    className="w-full pl-12 pr-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                    placeholder="Enter inquiry details or special requests..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setLeadForm({
                  name: '', phone: '', email: '', message: '', checkIn: '', checkOut: '', guests: '2', source: 'manual'
                })}
                className="px-6 py-3 bg-[#2a2f3a] hover:bg-[#374151] text-[#FF8C42] rounded-xl font-medium transition-all border-2 border-gray-200"
              >
                Clear
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Lead
              </button>
            </div>
          </form>
        )}

        {/* TAB B: Add Booking / Hold */}
        {activeTab === 'booking' && (
          <form onSubmit={handleSubmitBooking} className="space-y-4">
            <h3 className="text-2xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[#FF8C42]" />
              Add Booking / Hold
            </h3>

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-500/20 border-2 border-green-500 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <p className="text-green-100 font-medium">{successMessage}</p>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <p className="text-red-100 font-medium">{errorMessage}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Guest Name */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Guest Name *</label>
                <input
                  type="text"
                  required
                  value={bookingForm.guestName}
                  onChange={(e) => setBookingForm({...bookingForm, guestName: e.target.value})}
                  className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                  placeholder="Guest full name"
                />
              </div>

              {/* Guest Phone */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Guest Phone *</label>
                <input
                  type="tel"
                  required
                  value={bookingForm.guestPhone}
                  onChange={(e) => setBookingForm({...bookingForm, guestPhone: e.target.value})}
                  className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                  placeholder="+62 813 1234 5678"
                />
              </div>

              {/* Guest Email */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Guest Email *</label>
                <input
                  type="email"
                  required
                  value={bookingForm.guestEmail}
                  onChange={(e) => setBookingForm({...bookingForm, guestEmail: e.target.value})}
                  className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                  placeholder="guest@example.com"
                />
              </div>

              {/* Property */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Property *</label>
                <select
                  required
                  value={bookingForm.propertyId}
                  onChange={(e) => handlePropertyChange(e.target.value)}
                  disabled={isLoadingProperties}
                  className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] focus:outline-none focus:border-orange-300 disabled:opacity-50 [&>option]:bg-[#1f2937] [&>option]:text-white"
                >
                  <option value="" className="bg-[#1f2937] text-gray-400">
                    {isLoadingProperties ? 'Loading properties...' : 'Select a property'}
                  </option>
                  {properties.map(property => (
                    <option key={property.id} value={property.id} className="bg-[#1f2937] text-white">
                      {property.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Villa */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Villa / Unit *</label>
                <select
                  required
                  value={bookingForm.villaId}
                  onChange={(e) => setBookingForm({...bookingForm, villaId: e.target.value})}
                  disabled={!bookingForm.propertyId || villas.length === 0}
                  className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] focus:outline-none focus:border-orange-300 disabled:opacity-50 [&>option]:bg-[#1f2937] [&>option]:text-white"
                >
                  <option value="" className="bg-[#1f2937] text-gray-400">
                    {!bookingForm.propertyId ? 'Select property first' : villas.length === 0 ? 'Loading villas...' : 'Select a villa'}
                  </option>
                  {villas.map(villa => (
                    <option key={villa.id} value={villa.id} className="bg-[#1f2937] text-white">
                      {villa.name} - {villa.currency} {villa.base_price?.toLocaleString()}/night
                    </option>
                  ))}
                </select>
              </div>

              {/* Check-in */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Check-in Date *</label>
                <input
                  type="date"
                  required
                  value={bookingForm.checkIn}
                  onChange={(e) => setBookingForm({...bookingForm, checkIn: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>

              {/* Check-out */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Check-out Date *</label>
                <input
                  type="date"
                  required
                  value={bookingForm.checkOut}
                  onChange={(e) => setBookingForm({...bookingForm, checkOut: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>

              {/* Guests */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Number of Guests *</label>
                <select
                  required
                  value={bookingForm.guests}
                  onChange={(e) => setBookingForm({...bookingForm, guests: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              {/* Total Amount */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Total Amount (USD) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={bookingForm.totalAmount}
                    onChange={(e) => setBookingForm({...bookingForm, totalAmount: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Payment Status */}
              <div className="md:col-span-2">
                <label className="block text-[#FF8C42] font-medium mb-2">Payment Status *</label>
                <select
                  required
                  value={bookingForm.status}
                  onChange={(e) => setBookingForm({...bookingForm, status: e.target.value})}
                  className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] focus:outline-none focus:border-orange-300 [&>option]:bg-[#1f2937] [&>option]:text-white"
                >
                  <option value="hold">Hold - Pending Payment</option>
                  <option value="confirmed">Confirmed - Fully Paid</option>
                  <option value="partial">Partial - Deposit Received</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setBookingForm({
                  leadId: '', guestName: '', guestPhone: '', guestEmail: '',
                  propertyId: properties.length === 1 ? properties[0].id : '',
                  villaId: '',
                  checkIn: '', checkOut: '', guests: '2', totalAmount: '', status: 'hold'
                })}
                className="px-6 py-3 bg-[#2a2f3a] hover:bg-[#374151] text-[#FF8C42] rounded-xl font-medium transition-all border-2 border-gray-200"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all flex items-center gap-2 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Save className="w-5 h-5" />
                {isSubmitting ? 'Creating...' : 'Create Booking'}
              </button>
            </div>
          </form>
        )}

        {/* TAB C: Update Payment */}
        {activeTab === 'payment' && (
          <form onSubmit={handleSubmitPayment} className="space-y-4">
            <h3 className="text-2xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-[#FF8C42]" />
              Update Payment
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Booking ID */}
              <div className="md:col-span-2">
                <label className="block text-[#FF8C42] font-medium mb-2">Booking ID / Reference *</label>
                <input
                  type="text"
                  required
                  value={paymentForm.bookingId}
                  onChange={(e) => setPaymentForm({...paymentForm, bookingId: e.target.value})}
                  className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                  placeholder="e.g. BK-2026-001"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Payment Amount (USD) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Payment Method *</label>
                <select
                  required
                  value={paymentForm.paymentMethod}
                  onChange={(e) => setPaymentForm({...paymentForm, paymentMethod: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="cash">Cash</option>
                  <option value="paypal">PayPal</option>
                  <option value="wise">Wise</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Payment Date */}
              <div className="md:col-span-2">
                <label className="block text-[#FF8C42] font-medium mb-2">Payment Date *</label>
                <input
                  type="date"
                  required
                  value={paymentForm.paymentDate}
                  onChange={(e) => setPaymentForm({...paymentForm, paymentDate: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-[#FF8C42] font-medium mb-2">Notes</label>
                <textarea
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                  placeholder="Payment confirmation number, transaction reference, etc."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setPaymentForm({
                  bookingId: '', amount: '', paymentMethod: 'bank_transfer',
                  paymentDate: new Date().toISOString().split('T')[0], notes: ''
                })}
                className="px-6 py-3 bg-[#2a2f3a] hover:bg-[#374151] text-[#FF8C42] rounded-xl font-medium transition-all border-2 border-gray-200"
              >
                Clear
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Update Payment
              </button>
            </div>
          </form>
        )}

        {/* TAB D: Add Task (Ops) */}
        {activeTab === 'task' && (
          <form onSubmit={handleSubmitTask} className="space-y-4">
            <h3 className="text-2xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-[#FF8C42]" />
              Add Operational Task
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Task Title */}
              <div className="md:col-span-2">
                <label className="block text-[#FF8C42] font-medium mb-2">Task Title *</label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                  placeholder="e.g. Deep clean Villa Sunset"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Category *</label>
                <select
                  required
                  value={taskForm.category}
                  onChange={(e) => setTaskForm({...taskForm, category: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="housekeeping">Housekeeping</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inventory">Inventory</option>
                  <option value="guest_service">Guest Service</option>
                  <option value="security">Security</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Priority *</label>
                <select
                  required
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Assigned To */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Assigned To</label>
                <input
                  type="text"
                  value={taskForm.assignedTo}
                  onChange={(e) => setTaskForm({...taskForm, assignedTo: e.target.value})}
                  className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                  placeholder="Staff name or team"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Due Date</label>
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-[#FF8C42] font-medium mb-2">Description</label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                  placeholder="Detailed task description, special instructions, etc."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setTaskForm({
                  title: '', category: 'housekeeping', priority: 'medium',
                  assignedTo: '', dueDate: '', description: ''
                })}
                className="px-6 py-3 bg-[#2a2f3a] hover:bg-[#374151] text-[#FF8C42] rounded-xl font-medium transition-all border-2 border-gray-200"
              >
                Clear
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Create Task
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Edit Booking Modal */}
      {editingBooking && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#1f2937] rounded-2xl p-6 max-w-2xl w-full border-2 border-orange-500 my-8">
            <h3 className="text-2xl font-bold text-orange-400 mb-6">Editar Booking</h3>

            <form onSubmit={handleUpdateBooking} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Guest Name */}
                <div className="md:col-span-2">
                  <label className="block text-[#FF8C42] font-medium mb-2">Nombre del Huésped *</label>
                  <input
                    type="text"
                    required
                    value={editForm.guestName}
                    onChange={(e) => setEditForm({...editForm, guestName: e.target.value})}
                    className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                    placeholder="ej. John Smith"
                  />
                </div>

                {/* Guest Phone */}
                <div>
                  <label className="block text-[#FF8C42] font-medium mb-2">Teléfono *</label>
                  <input
                    type="tel"
                    required
                    value={editForm.guestPhone}
                    onChange={(e) => setEditForm({...editForm, guestPhone: e.target.value})}
                    className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                    placeholder="+62 812 3456 7890"
                  />
                </div>

                {/* Guest Email */}
                <div>
                  <label className="block text-[#FF8C42] font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={editForm.guestEmail}
                    onChange={(e) => setEditForm({...editForm, guestEmail: e.target.value})}
                    className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                    placeholder="guest@email.com"
                  />
                </div>

                {/* Check-in */}
                <div>
                  <label className="block text-[#FF8C42] font-medium mb-2">Check-in *</label>
                  <input
                    type="date"
                    required
                    value={editForm.checkIn}
                    onChange={(e) => setEditForm({...editForm, checkIn: e.target.value})}
                    className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] focus:outline-none focus:border-orange-300"
                  />
                </div>

                {/* Check-out */}
                <div>
                  <label className="block text-[#FF8C42] font-medium mb-2">Check-out *</label>
                  <input
                    type="date"
                    required
                    value={editForm.checkOut}
                    onChange={(e) => setEditForm({...editForm, checkOut: e.target.value})}
                    className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] focus:outline-none focus:border-orange-300"
                  />
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-[#FF8C42] font-medium mb-2">Huéspedes *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="20"
                    value={editForm.guests}
                    onChange={(e) => setEditForm({...editForm, guests: e.target.value})}
                    className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] focus:outline-none focus:border-orange-300"
                  />
                </div>

                {/* Total Amount */}
                <div>
                  <label className="block text-[#FF8C42] font-medium mb-2">Precio Total *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={editForm.totalAmount}
                    onChange={(e) => setEditForm({...editForm, totalAmount: e.target.value})}
                    className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] focus:outline-none focus:border-orange-300"
                  />
                </div>

                {/* Payment Status */}
                <div className="md:col-span-2">
                  <label className="block text-[#FF8C42] font-medium mb-2">Estado de Pago *</label>
                  <select
                    required
                    value={editForm.status}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                    className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] focus:outline-none focus:border-orange-300 [&>option]:bg-[#1f2937] [&>option]:text-white"
                  >
                    <option value="hold">Hold - Pending Payment</option>
                    <option value="confirmed">Confirmed - Fully Paid</option>
                    <option value="partial">Partial - Deposit Received</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  disabled={isSavingEdit}
                  className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className={`flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all ${
                    isSavingEdit ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSavingEdit ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingBooking && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1f2937] rounded-2xl p-6 max-w-md w-full border-2 border-red-500">
            <h3 className="text-2xl font-bold text-red-400 mb-4">Confirm Delete</h3>
            <p className="text-white mb-2">Are you sure you want to delete this booking?</p>
            <div className="bg-[#2a2f3a] p-4 rounded-xl mb-6 space-y-2">
              <p className="text-white"><span className="font-bold">Guest:</span> {deletingBooking.guest_name}</p>
              <p className="text-gray-300"><span className="font-bold">Check-in:</span> {deletingBooking.check_in}</p>
              <p className="text-gray-300"><span className="font-bold">Check-out:</span> {deletingBooking.check_out}</p>
              <p className="text-green-400"><span className="font-bold">Price:</span> {deletingBooking.currency} {deletingBooking.total_price?.toLocaleString()}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingBooking(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBooking}
                disabled={isDeleting}
                className={`flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all ${
                  isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default ManualDataEntry;

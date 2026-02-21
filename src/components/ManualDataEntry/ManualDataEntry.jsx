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
import { supabase } from '../../lib/supabase';

const ManualDataEntry = ({ onBack }) => {
  const { user, userData } = useAuth();
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

  // Leads/Customers table data
  const [leads, setLeads] = useState([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);

  // Mobile pagination to prevent freeze
  const [mobileBookingsPage, setMobileBookingsPage] = useState(1);
  const [mobileLeadsPage, setMobileLeadsPage] = useState(1);
  const MOBILE_PAGE_SIZE = 10; // Show 10 records at a time on mobile

  // Edit/Delete modals
  const [editingBooking, setEditingBooking] = useState(null);
  const [deletingBooking, setDeletingBooking] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Edit/Delete leads modals
  const [editingLead, setEditingLead] = useState(null);
  const [deletingLead, setDeletingLead] = useState(null);
  const [isDeletingLead, setIsDeletingLead] = useState(false);
  const [isSavingLeadEdit, setIsSavingLeadEdit] = useState(false);

  // Add Payment modal
  const [addingPaymentFor, setAddingPaymentFor] = useState(null); // booking selected for payment
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]); // Previous payments for current booking
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

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

  // Edit lead form state
  const [editLeadForm, setEditLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    country: '',
    type: 'lead',
    source: 'manual',
    message: ''
  });

  // Form states
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    country: '',
    message: '',
    type: 'lead', // 'lead' or 'customer'
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
    description: ''
  });

  // Tasks table data
  const [tasks, setTasks] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [filterTaskStatus, setFilterTaskStatus] = useState('');
  const [filterTaskProperty, setFilterTaskProperty] = useState('');
  const [mobileTasksPage, setMobileTasksPage] = useState(1);
  const [deletingTask, setDeletingTask] = useState(null);
  const [isDeletingTask, setIsDeletingTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editTaskForm, setEditTaskForm] = useState({});
  const [isSavingTaskEdit, setIsSavingTaskEdit] = useState(false);

  // Load villas with multi-tenant filtering
  useEffect(() => {
    const loadVillasForUser = async () => {
      if (!userData?.id) {
        console.log('Waiting for userData to load...');
        return;
      }

      try {
        setIsLoadingProperties(true);
        const tenantId = user?.id || userData?.id;
        console.log('[ManualDataEntry] Loading villas for tenant:', tenantId);

        // 1. Get user's property_ids from bookings table
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('property_id')
          .eq('tenant_id', tenantId);

        if (bookingsError) {
          console.error('[ManualDataEntry] Error loading bookings:', bookingsError);
          setErrorMessage('Failed to load properties');
          setIsLoadingProperties(false);
          return;
        }

        if (!bookings || bookings.length === 0) {
          console.log('[ManualDataEntry] No bookings found for tenant');
          setIsLoadingProperties(false);
          return;
        }

        // Get unique property_ids
        const propertyIds = [...new Set(bookings.map(b => b.property_id))];
        console.log(`[ManualDataEntry] User has ${propertyIds.length} property_id(s):`, propertyIds);

        // Create dummy property entries for the form
        const propertiesData = propertyIds.map((id, index) => ({
          id: id,
          name: `Property ${index + 1}`,
          owner_id: tenantId
        }));
        setProperties(propertiesData);

        // 2. Get villas for ALL user's property_ids
        const { data: villasData, error: villasError } = await supabase
          .from('villas')
          .select('*')
          .in('property_id', propertyIds)
          .eq('status', 'active');

        if (villasError) {
          console.error('[ManualDataEntry] Error loading villas:', villasError);
          setErrorMessage('Failed to load villas');
          setIsLoadingProperties(false);
          return;
        }

        console.log(`[ManualDataEntry] ✅ Loaded ${villasData?.length || 0} villas:`, villasData);

        setVillas(villasData || []);

        // Auto-select first property_id in form
        if (propertyIds.length > 0) {
          setBookingForm(prev => ({
            ...prev,
            propertyId: propertyIds[0]
          }));
          console.log(`[ManualDataEntry] ✅ Property auto-selected: ${propertyIds[0]}`);
        }

        // Auto-select first villa if there's only one
        if (villasData && villasData.length === 1) {
          setBookingForm(prev => ({ ...prev, villaId: villasData[0].id }));
          console.log(`[ManualDataEntry] ✅ Auto-selected villa: ${villasData[0].name}`);
        }

        console.log(`[ManualDataEntry] ✅ ${villasData?.length || 0} villas available for selection`);
      } catch (error) {
        console.error('[ManualDataEntry] Error loading villas:', error);
        setErrorMessage('Failed to load villas');
      } finally {
        setIsLoadingProperties(false);
      }
    };

    loadVillasForUser();
  }, [userData, user]);

  // Load villas when property is selected
  const loadVillasForProperty = async (propertyId) => {
    try {
      // Fetch villas from Supabase WITHOUT hardcoded currency filter
      const { data: villasData, error } = await supabase
        .from('villas')
        .select('*')
        .eq('property_id', propertyId)
        .eq('status', 'active');

      if (error) {
        console.error('[ManualDataEntry] Error loading villas:', error);
        return;
      }

      console.log(`[ManualDataEntry] Loaded ${villasData?.length || 0} villas for property ${propertyId}:`, villasData);

      setVillas(villasData || []);

      // Auto-select first villa if there's only one
      if (villasData && villasData.length === 1) {
        setBookingForm(prev => ({ ...prev, villaId: villasData[0].id }));
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

  // Auto-calculate total amount when villa, check-in, or check-out changes
  useEffect(() => {
    const { checkIn, checkOut, villaId } = bookingForm;

    console.log('[AutoCalculate] Triggered:', { checkIn, checkOut, villaId, villasCount: villas.length });

    if (!checkIn || !checkOut || !villaId) {
      console.log('[AutoCalculate] Missing required fields');
      return;
    }

    // Calculate nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      console.log('[AutoCalculate] Invalid dates - nights:', nights);
      return;
    }

    // Find selected villa
    const selectedVilla = villas.find(v => v.id === villaId);

    if (!selectedVilla || !selectedVilla.base_price) {
      console.log('[AutoCalculate] Villa not found or no base_price:', selectedVilla);
      return;
    }

    // Calculate total
    const totalAmount = selectedVilla.base_price * nights;
    console.log(`[AutoCalculate] ✅ Calculated: ${nights} nights × IDR ${selectedVilla.base_price} = IDR ${totalAmount}`);

    setBookingForm(prev => ({ ...prev, totalAmount: totalAmount.toString() }));
  }, [bookingForm.villaId, bookingForm.checkIn, bookingForm.checkOut, villas]);

  // Load bookings for the owner
  const loadBookings = async (customVillaFilter = null, customStatusFilter = null) => {
    const tenantId = user?.id || userData?.id;
    if (!tenantId) {
      console.warn('❌ No user.id or userData.id - cannot load bookings');
      return;
    }

    try {
      setIsLoadingBookings(true);

      // Build filters
      const filters = {
        tenant_id: tenantId // CRITICAL: Multi-tenant filtering
      };

      const villaFilter = customVillaFilter !== null ? customVillaFilter : filterProperty;
      console.log('[DEBUG] villaFilter:', villaFilter, 'customVillaFilter:', customVillaFilter, 'filterProperty:', filterProperty);

      if (villaFilter) {
        filters.villa_id = villaFilter;
        console.log('[DEBUG] Added villa_id filter:', villaFilter);
      }

      // Apply status filter - use customStatusFilter if provided (avoids async state issue)
      const statusFilter = customStatusFilter !== null ? customStatusFilter : filterStatus;
      if (statusFilter) {
        if (activeTab === 'payment') {
          // In payment tab, filter by payment_status
          filters.payment_status = statusFilter;
        } else {
          // In view-bookings tab, filter by booking status
          filters.status = statusFilter;
        }
      }

      if (searchGuest) {
        filters.guest_name = searchGuest;
      }

      console.log('🔍 Loading bookings with filters:', JSON.stringify(filters, null, 2));

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

  // Load leads/customers
  const loadLeads = async () => {
    const tenantId = user?.id || userData?.id;
    if (!tenantId) {
      console.warn('❌ No user.id or userData.id - cannot load leads');
      return;
    }

    try {
      setIsLoadingLeads(true);

      const filters = {
        tenant_id: tenantId // CRITICAL: Multi-tenant filtering
      };

      console.log('🔍 Loading leads with filters:', filters);

      // Fetch leads
      const leadsData = await supabaseService.getLeads(filters);

      console.log(`✅ Loaded ${leadsData.length} leads/customers:`, leadsData.map(l => ({
        name: l.name,
        phone: l.phone,
        state: l.state,
        tenant: l.tenant_id
      })));

      // Get bookings data and match with leads
      const bookingsData = await supabaseService.getBookings({ tenant_id: tenantId });

      const leadsWithBookingData = leadsData.map(lead => {
        // Match booking by name
        const booking = bookingsData.find(b => b.guest_name === lead.name);

        return {
          ...lead,
          // Add booking fields
          booking_check_in: booking?.check_in || null,
          booking_total: booking?.total_price || 0,
          booking_payment_status: booking?.payment_status || '-',
          booking_journey_state: booking?.journey_state || '-'
        };
      });

      // Sort by date (check_in from lead table if exists, otherwise created_at) - most recent first
      leadsWithBookingData.sort((a, b) => {
        // Use check_in from lead table (not booking_check_in which comes from bookings)
        const dateStrA = (a.check_in || a.created_at);
        const dateStrB = (b.check_in || b.created_at);

        if (!dateStrA && !dateStrB) return 0;
        if (!dateStrA) return 1;
        if (!dateStrB) return -1;

        // Convert to Date objects for proper comparison
        const dateA = new Date(dateStrA);
        const dateB = new Date(dateStrB);

        // Most recent first (descending order) - INVERTED: dateA - dateB
        return dateA.getTime() - dateB.getTime();
      });

      setLeads(leadsWithBookingData);

    } catch (error) {
      console.error('❌ Error loading leads:', error);
      const errorMsg = error.message || 'Failed to load leads. Please try again.';
      setErrorMessage(errorMsg);

      // Auto-clear error after 5 seconds
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  // Load bookings when tab changes to view-bookings or payment or filters change
  useEffect(() => {
    if (activeTab === 'view-bookings' || activeTab === 'payment') {
      loadBookings();
    }
    if (activeTab === 'task') {
      loadTasks();
    }
  }, [activeTab, filterProperty, filterStatus, searchGuest, filterTaskProperty, filterTaskStatus, userData]);

  // Load leads when tab changes to lead
  useEffect(() => {
    if (activeTab === 'lead' && userData?.id) {
      loadLeads();
    }
  }, [activeTab, userData]);

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

  // Calculate price based on dates and villa
  const recalculateEditPrice = async (checkIn, checkOut, villaId) => {
    if (!checkIn || !checkOut || !villaId) return null;

    try {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

      if (nights <= 0) return null;

      // Get villa price from villas array
      const villa = villas.find(v => v.id === villaId);
      if (!villa || !villa.base_price) {
        console.error('[recalculateEditPrice] Villa not found or no base_price:', villaId);
        return null;
      }

      const totalPrice = villa.base_price * nights;
      console.log(`[recalculateEditPrice] ${nights} nights × ${villa.base_price} = ${totalPrice}`);
      return totalPrice;
    } catch (error) {
      console.error('[recalculateEditPrice] Error:', error);
      return null;
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

  // Handle edit lead
  const handleEditLead = (lead) => {
    setEditingLead(lead);
    // Extract message from message_history if exists
    const lastMessage = Array.isArray(lead.message_history) && lead.message_history.length > 0
      ? lead.message_history[lead.message_history.length - 1].text
      : '';

    setEditLeadForm({
      name: lead.name || '',
      phone: lead.phone || '',
      email: lead.email || '',
      country: lead.country || '',
      type: lead.state === 'CUSTOMER' ? 'customer' : 'lead',
      source: lead.source || 'manual',
      message: lastMessage
    });
  };

  // Handle delete lead
  const handleDeleteLead = async () => {
    if (!deletingLead) return;

    try {
      setIsDeletingLead(true);

      // Use Supabase service to delete (hard delete)
      await supabaseService.deleteLead(deletingLead.id);

      // Success - reload leads
      setSuccessMessage(`${deletingLead.current_phase === 'CUSTOMER' ? 'Customer' : 'Lead'} ${deletingLead.name} deleted successfully`);
      setDeletingLead(null);
      loadLeads();

      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error deleting lead:', error);
      setErrorMessage(`Failed to delete lead: ${error.message}`);
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsDeletingLead(false);
    }
  };

  // Handle update lead
  const handleUpdateLead = async (e) => {
    e.preventDefault();

    if (!editingLead) return;

    // Clear previous messages
    setSuccessMessage('');
    setErrorMessage('');
    setIsSavingLeadEdit(true);

    try {
      // Prepare updated lead data
      const updatedData = {
        name: editLeadForm.name,
        phone: editLeadForm.phone,
        email: editLeadForm.email || null,
        country: editLeadForm.country || null,
        source: editLeadForm.source,
        state: editLeadForm.type === 'customer' ? 'CUSTOMER' : 'NEW',
        // Update message_history if there's a new message
        message_history: editLeadForm.message ? [
          ...(Array.isArray(editingLead.message_history) ? editingLead.message_history : []),
          {
            text: editLeadForm.message,
            timestamp: new Date().toISOString(),
            type: 'note'
          }
        ] : editingLead.message_history,
        updated_at: new Date().toISOString()
      };

      console.log('🔄 Updating lead:', editingLead.id, updatedData);

      // Call Supabase service
      await supabaseService.updateLead(editingLead.id, updatedData);

      // Success!
      const typeLabel = editLeadForm.type === 'customer' ? 'Customer' : 'Lead';
      setSuccessMessage(`${typeLabel} updated successfully! Name: ${editLeadForm.name}`);

      // Close modal
      setEditingLead(null);

      // Reload leads
      loadLeads();

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (error) {
      console.error('Error updating lead:', error);
      setErrorMessage(error.message || 'Failed to update lead. Please try again.');
    } finally {
      setIsSavingLeadEdit(false);
    }
  };

  // Handle form submissions
  const handleSubmitLead = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setSuccessMessage('');
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // Validate user is logged in
      if (!userData || !userData.id) {
        throw new Error('You must be logged in to create a lead');
      }

      // Prepare lead data for Supabase (aligned with actual schema)
      const leadData = {
        tenant_id: userData.id,
        name: leadForm.name,
        phone: leadForm.phone || null,
        email: leadForm.email || null,
        country: leadForm.country || null,
        source: leadForm.source || 'manual',
        // Use state instead of status (NEW = new lead, CUSTOMER = converted customer)
        state: leadForm.type === 'customer' ? 'CUSTOMER' : 'NEW',
        intent: 'info',
        // Store message in message_history as array
        message_history: leadForm.message ? [{
          text: leadForm.message,
          timestamp: new Date().toISOString(),
          type: 'note'
        }] : []
        // created_at will be auto-generated by Supabase with default now()
      };

      console.log('📋 Creating lead/customer:', leadData);

      // Call Supabase service
      const result = await supabaseService.createLead(leadData);

      // Success!
      const typeLabel = leadForm.type === 'customer' ? 'Customer' : 'Lead';
      setSuccessMessage(`${typeLabel} created successfully! Contact: ${leadForm.name}`);

      // Reload leads list
      await loadLeads();

      // Reset form
      setLeadForm({
        name: '',
        phone: '',
        email: '',
        country: '',
        message: '',
        type: 'lead',
        source: 'manual'
      });

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (error) {
      console.error('Error creating lead:', error);
      setErrorMessage(error.message || 'Failed to create lead. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
        total_price: parseFloat(bookingForm.totalAmount) || 0,
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
      setSearchGuest('');
      setSearchInput('');

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

  // Handle Add Payment button click
  const handleAddPaymentClick = async (booking) => {
    setAddingPaymentFor(booking);
    setIsLoadingHistory(true);

    // Reset payment form with booking ID
    setPaymentForm({
      bookingId: booking.id,
      amount: '',
      paymentMethod: 'bank_transfer',
      paymentDate: new Date().toISOString().split('T')[0],
      notes: ''
    });

    // Fetch payment history for this booking
    try {
      console.log('📜 Fetching payment history for booking:', booking.id);
      const { data: payments, error } = await supabase
        .from('payments')
        .select('*')
        .eq('booking_id', booking.id)
        .order('transaction_date', { ascending: true });

      if (error) {
        console.error('❌ Error fetching payment history:', error);
        setPaymentHistory([]);
      } else {
        console.log('✅ Payment history loaded:', payments.length, 'payments');
        setPaymentHistory(payments || []);
      }
    } catch (error) {
      console.error('❌ Error fetching payment history:', error);
      setPaymentHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    console.log('🚀 handleSubmitPayment called');
    console.log('📋 Payment form data:', paymentForm);
    console.log('👤 User:', user);
    console.log('👤 User Data:', userData);

    // Clear previous messages
    setSuccessMessage('');
    setErrorMessage('');
    setIsAddingPayment(true);

    try {
      // Validate user is logged in - use user.id (always available) instead of userData.id
      const tenantId = user?.id || userData?.id;
      if (!tenantId) {
        console.error('❌ No user.id or userData.id found');
        console.error('❌ user:', user);
        console.error('❌ userData:', userData);
        throw new Error('You must be logged in to record a payment');
      }
      console.log('✅ User validated with tenant_id:', tenantId);

      // Validate required fields
      if (!paymentForm.bookingId) {
        throw new Error('Please select a booking');
      }
      if (!paymentForm.amount || parseFloat(paymentForm.amount) <= 0) {
        throw new Error('Please enter a valid payment amount');
      }

      // Get booking details to populate payment record
      const booking = addingPaymentFor;
      if (!booking) {
        throw new Error('Booking information not found');
      }

      // Prepare payment data for Supabase (matches payments table schema)
      const paymentData = {
        booking_id: paymentForm.bookingId,
        property_id: booking.property_id,
        guest_name: booking.guest_name,
        guest_email: booking.guest_email || 'noemail@example.com', // Required field
        amount: parseFloat(paymentForm.amount),
        currency: 'IDR', // Default currency
        payment_method: paymentForm.paymentMethod,
        transaction_date: paymentForm.paymentDate,
        status: 'completed',
        notes: paymentForm.notes || ''
      };

      console.log('💳 Recording payment:', paymentData);

      // Call Supabase service
      console.log('📤 Saving to Supabase payments table...');
      const result = await supabaseService.createPayment(paymentData);
      console.log('✅ Payment saved to payments table:', result);

      // Calculate total payments for this booking
      console.log('📊 Calculating total payments for booking...');
      const { data: allPayments, error: paymentsError } = await supabase
        .from('payments')
        .select('amount')
        .eq('booking_id', paymentForm.bookingId);

      if (paymentsError) {
        console.error('❌ Error fetching payments:', paymentsError);
        throw new Error('Could not verify total payments');
      }

      const totalPaid = allPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const totalPrice = parseFloat(booking.total_price);
      const remaining = totalPrice - totalPaid;

      console.log('💰 Payment Summary:');
      console.log('   Total Price: IDR', totalPrice.toLocaleString());
      console.log('   Total Paid: IDR', totalPaid.toLocaleString());
      console.log('   Remaining: IDR', remaining.toLocaleString());

      // Update booking payment status based on total payments
      let newStatus = 'pending';
      let statusMessage = '';

      if (totalPaid >= totalPrice) {
        newStatus = 'paid';
        statusMessage = 'Booking FULLY PAID ✅';
        console.log('✅ Booking is now FULLY PAID');
      } else {
        newStatus = 'pending';
        statusMessage = `Partial payment recorded. Remaining: IDR ${remaining.toLocaleString()}`;
        console.log('⚠️ Booking still PENDING - partial payment');
      }

      console.log('📤 Updating booking payment_status to:', newStatus);
      await supabaseService.updateBooking(paymentForm.bookingId, {
        payment_status: newStatus,
        updated_at: new Date().toISOString()
      });
      console.log('✅ Booking payment_status updated to:', newStatus);

      // Success message with details
      setSuccessMessage(`✅ Payment recorded! IDR ${parseFloat(paymentForm.amount).toLocaleString()} - ${statusMessage}`);

      // Reload payment history to show the new payment
      console.log('🔄 Reloading payment history...');
      const { data: updatedPayments, error: historyError } = await supabase
        .from('payments')
        .select('*')
        .eq('booking_id', paymentForm.bookingId)
        .order('transaction_date', { ascending: true });

      if (!historyError && updatedPayments) {
        setPaymentHistory(updatedPayments);
        console.log('✅ Payment history reloaded:', updatedPayments.length, 'payments');
      }

      // Reset form but keep modal open so user can see updated history
      setPaymentForm({
        bookingId: booking.id,
        amount: '',
        paymentMethod: 'bank_transfer',
        paymentDate: new Date().toISOString().split('T')[0],
        notes: ''
      });

      // Reload bookings to show updated payment status
      await loadBookings();

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (error) {
      console.error('❌ Error recording payment:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        paymentForm: paymentForm,
        booking: addingPaymentFor
      });
      setErrorMessage(`❌ Failed to record payment: ${error.message || 'Unknown error'}. Check console for details.`);

      // Clear error message after 10 seconds
      setTimeout(() => setErrorMessage(''), 10000);
    } finally {
      setIsAddingPayment(false);
    }
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setSuccessMessage('');
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // Validate user is logged in
      if (!userData || !userData.id) {
        throw new Error('You must be logged in to create a task');
      }

      // Validate required fields
      if (!taskForm.title) {
        throw new Error('Please enter a task title');
      }
      if (!taskForm.category) {
        throw new Error('Please select a task category');
      }

      // Get first property if not specified
      const propertyId = properties.length > 0 ? properties[0].id : null;
      if (!propertyId) {
        throw new Error('No property found. Please create a property first.');
      }

      // Prepare task data for Supabase (tasks table)
      const taskData = {
        tenant_id: userData.id,
        property_id: propertyId,
        task_type: taskForm.category,
        title: taskForm.title,
        description: taskForm.description || null,
        priority: taskForm.priority || 'medium',
        status: 'pending'
      };

      console.log('✅ Creating task:', taskData);

      // Call Supabase service
      const result = await supabaseService.createTask(taskData);

      // Success!
      setSuccessMessage(`Task created successfully! Title: ${taskForm.title}`);

      // Reset form
      setTaskForm({
        title: '',
        category: 'housekeeping',
        priority: 'medium',
        assignedTo: '',
        description: ''
      });

      // Reload tasks list
      await loadTasks();

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (error) {
      console.error('Error creating task:', error);
      setErrorMessage(error.message || 'Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load tasks
  const loadTasks = async (customPropertyFilter = null) => {
    const tenantId = user?.id || userData?.id;
    if (!tenantId) {
      console.warn('❌ No user.id or userData.id - cannot load tasks');
      return;
    }

    try {
      setIsLoadingTasks(true);

      const filters = {
        tenant_id: tenantId
      };

      const villaFilter = customPropertyFilter !== null ? customPropertyFilter : filterTaskProperty;
      console.log('🔧 Villa filter value:', villaFilter);
      console.log('🔧 filterTaskProperty state:', filterTaskProperty);
      console.log('🔧 customPropertyFilter param:', customPropertyFilter);

      if (villaFilter && villaFilter !== '') {
        filters.villa_id = villaFilter;
      }

      if (filterTaskStatus && filterTaskStatus !== '') {
        filters.status = filterTaskStatus;
      }

      console.log('🔍 Loading tasks with filters:', JSON.stringify(filters, null, 2));

      const tasksData = await supabaseService.getTasks(filters);
      setTasks(tasksData);
      console.log(`✅ Loaded ${tasksData.length} tasks`);
    } catch (error) {
      console.error('❌ Error loading tasks:', error);
      setErrorMessage('Failed to load tasks');
    } finally {
      setIsLoadingTasks(false);
    }
  };

  // Handle delete task
  const handleDeleteTask = async () => {
    if (!deletingTask) return;

    try {
      setIsDeletingTask(true);
      await supabaseService.deleteTask(deletingTask.id);

      setSuccessMessage(`Task "${deletingTask.title}" deleted successfully`);
      setDeletingTask(null);
      loadTasks();

      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error deleting task:', error);
      setErrorMessage(`Failed to delete task: ${error.message}`);
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsDeletingTask(false);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setEditTaskForm({
      title: task.title || '',
      task_type: task.task_type || 'housekeeping',
      priority: task.priority || 'medium',
      status: task.status || 'pending',
      description: task.description || ''
    });
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!editingTask) return;
    try {
      setIsSavingTaskEdit(true);
      await supabaseService.updateTask(editingTask.id, {
        title: editTaskForm.title,
        task_type: editTaskForm.task_type,
        priority: editTaskForm.priority,
        status: editTaskForm.status,
        description: editTaskForm.description || null
      });
      setSuccessMessage(`Task "${editTaskForm.title}" updated successfully`);
      setEditingTask(null);
      loadTasks();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error updating task:', error);
      setErrorMessage(`Failed to update task: ${error.message}`);
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsSavingTaskEdit(false);
    }
  };

  const tabs = [
    { id: 'view-bookings', label: 'View/Edit Bookings', icon: ClipboardList },
    { id: 'booking', label: 'Add Booking', icon: Calendar },
    { id: 'lead', label: 'Add Customer & Lead', icon: UserPlus },
    { id: 'payment', label: 'View/Edit Payments', icon: DollarSign },
    { id: 'task', label: 'View/Edit Tasks', icon: CheckCircle }
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
                  {tab.id === 'lead' ? (
                    <div className="hidden md:flex flex-col leading-tight text-center">
                      <div>Add</div>
                      <div className="whitespace-nowrap">Customer & Lead</div>
                    </div>
                  ) : tab.id === 'payment' ? (
                    <div className="hidden md:flex flex-col leading-tight text-center">
                      <div>View/Edit</div>
                      <div>Payments</div>
                    </div>
                  ) : (
                    <span className="hidden md:inline">{tab.label}</span>
                  )}
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
                {/* Villa Filter */}
                <select
                  value={filterProperty}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setFilterProperty(newValue);
                    loadBookings(newValue);
                  }}
                  className="px-4 py-2 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-white focus:outline-none focus:border-orange-300"
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
                  <p className="text-gray-300 text-sm mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Click on any row to edit • Click trash icon to delete
                  </p>
                  {/* MOBILE VERSION: Cards (< 768px) */}
                  <div className="block md:hidden space-y-4">
                    {bookings.length === 0 ? (
                      <div className="bg-[#2a2f3a] rounded-xl p-8 text-center text-gray-400 border-2 border-gray-200">
                        No bookings found
                      </div>
                    ) : (
                      <>
                      {bookings.slice(0, mobileBookingsPage * MOBILE_PAGE_SIZE).map((booking) => (
                        <div
                          key={booking.id}
                          className="bg-[#2a2f3a] rounded-xl p-4 border-l-4 border-orange-500 shadow-lg hover:bg-[#374151] transition-colors"
                          onClick={() => handleEditBooking(booking)}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="text-white font-bold text-lg">{booking.guest_name}</h3>
                              <p className="text-gray-400 text-sm mt-1">
                                {villas.find(v => v.id === booking.villa_id)?.name || properties.find(p => p.id === booking.property_id)?.name || 'N/A'}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                              booking.status === 'confirmed' ? 'bg-green-500 text-white' :
                              booking.status === 'pending_payment' ? 'bg-yellow-500 text-black' :
                              booking.status === 'cancelled' ? 'bg-red-500 text-white' :
                              'bg-gray-500 text-white'
                            }`}>
                              {booking.status === 'pending_payment' ? 'pending' : booking.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                              <p className="text-gray-500 text-xs">Check-in</p>
                              <p className="text-white text-sm font-medium">{booking.check_in}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Check-out</p>
                              <p className="text-white text-sm font-medium">{booking.check_out}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Nights</p>
                              <p className="text-white text-sm font-medium">{booking.nights} nights</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Total Price</p>
                              <p className="text-green-400 text-sm font-bold">
                                IDR {booking.total_price?.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4 pt-3 border-t border-gray-700">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditBooking(booking);
                              }}
                              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors"
                            >
                              Edit Booking
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletingBooking(booking);
                              }}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg transition-colors"
                              title="Delete booking"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                      {/* Load More Button */}
                      {bookings.length > mobileBookingsPage * MOBILE_PAGE_SIZE && (
                        <button
                          onClick={() => setMobileBookingsPage(prev => prev + 1)}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          Load More ({bookings.length - (mobileBookingsPage * MOBILE_PAGE_SIZE)} remaining)
                        </button>
                      )}
                      </>
                    )}
                  </div>

                  {/* DESKTOP VERSION: Table (>= 768px) */}
                  <div className="hidden md:block bg-[#2a2f3a] rounded-xl overflow-hidden border-2 border-gray-200">
                    <div className="overflow-x-auto">
                      <table className="w-full table-fixed">
                        <thead className="bg-orange-500">
                          <tr>
                            <th className="w-[18%] px-4 py-3 text-left text-white font-bold">Guest</th>
                            <th className="w-[23%] px-4 py-3 text-left text-white font-bold">Property</th>
                            <th className="w-[11%] px-4 py-3 text-left text-white font-bold">Check-in</th>
                            <th className="w-[11%] px-4 py-3 text-left text-white font-bold">Check-out</th>
                            <th className="w-[7%] px-4 py-3 text-center text-white font-bold">Nights</th>
                            <th className="w-[11%] px-2 py-3 text-left text-white font-bold">Status</th>
                            <th className="w-[14%] px-4 py-3 text-right text-white font-bold">Price</th>
                            <th className="w-[5%] px-2 py-3 text-center text-white font-bold"></th>
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
                                className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-[#2a2f3a]' : 'bg-[#1f2937]'} hover:bg-[#374151] transition-colors cursor-pointer`}
                                onClick={() => handleEditBooking(booking)}
                                title="Click to edit this booking"
                              >
                                <td className="px-4 py-3 text-gray-300 text-sm overflow-hidden">
                                  <div className="truncate">{booking.guest_name}</div>
                                </td>
                                <td className="px-4 py-3 text-gray-300 text-sm overflow-hidden">
                                  <div className="truncate">{villas.find(v => v.id === booking.villa_id)?.name || properties.find(p => p.id === booking.property_id)?.name || 'N/A'}</div>
                                </td>
                                <td className="px-4 py-3 text-gray-300 text-sm whitespace-nowrap">{booking.check_in}</td>
                                <td className="px-4 py-3 text-gray-300 text-sm whitespace-nowrap">{booking.check_out}</td>
                                <td className="px-4 py-3 text-white text-sm text-center whitespace-nowrap">{booking.nights}</td>
                                <td className="px-2 py-3">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block whitespace-nowrap ${
                                    booking.status === 'confirmed' ? 'bg-green-500 text-white' :
                                    booking.status === 'pending_payment' ? 'bg-yellow-500 text-black' :
                                    booking.status === 'cancelled' ? 'bg-red-500 text-white' :
                                    'bg-gray-500 text-white'
                                  }`}>
                                    {booking.status === 'pending_payment' ? 'pending' : booking.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-white text-sm text-right whitespace-nowrap">
                                  IDR {booking.total_price?.toLocaleString()}
                                </td>
                                <td className="px-2 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={() => setDeletingBooking(booking)}
                                    className="p-1 hover:bg-red-500/20 rounded transition-colors"
                                    title="Delete booking"
                                  >
                                    <svg className="w-4 h-4 text-red-400 hover:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
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

          {/* TAB A: Add Customer & Lead */}
          {activeTab === 'lead' && (
            <>
            <form onSubmit={handleSubmitLead} className="space-y-4">
              <h3 className="text-2xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-[#FF8C42]" />
                <div>
                  <div>Add</div>
                  <div>Customer & Lead</div>
                </div>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Type Selector */}
                <div className="md:col-span-2">
                  <label className="block text-[#FF8C42] font-medium mb-2">Type *</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value="lead"
                        checked={leadForm.type === 'lead'}
                        onChange={(e) => setLeadForm({...leadForm, type: e.target.value})}
                        className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="text-[#FF8C42] font-medium">Lead</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value="customer"
                        checked={leadForm.type === 'customer'}
                        onChange={(e) => setLeadForm({...leadForm, type: e.target.value})}
                        className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="text-[#FF8C42] font-medium">Customer</span>
                    </label>
                  </div>
                </div>

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
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({...leadForm, phone: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                    placeholder="+62 813 1234 5678"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                    placeholder="sarah@example.com"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Country</label>
                <input
                  type="text"
                  value={leadForm.country}
                  onChange={(e) => setLeadForm({...leadForm, country: e.target.value})}
                  className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                  placeholder="e.g. Indonesia, India, China"
                />
              </div>

              {/* Source */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Source</label>
                <select
                  value={leadForm.source}
                  onChange={(e) => setLeadForm({...leadForm, source: e.target.value})}
                  className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] focus:outline-none focus:border-orange-300"
                >
                  <option value="manual" className="bg-gray-800 text-white">Manual Entry</option>
                  <option value="web" className="bg-gray-800 text-white">Website</option>
                  <option value="instagram" className="bg-gray-800 text-white">Instagram</option>
                  <option value="whatsapp" className="bg-gray-800 text-white">WhatsApp</option>
                  <option value="tiktok" className="bg-gray-800 text-white">TikTok</option>
                  <option value="referral" className="bg-gray-800 text-white">Referral</option>
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
                  name: '', phone: '', email: '', message: '', type: 'lead', source: 'manual'
                })}
                className="px-6 py-3 bg-[#2a2f3a] hover:bg-[#374151] text-[#FF8C42] rounded-xl font-medium transition-all border-2 border-gray-200"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {isSubmitting ? 'Saving...' : `Save ${leadForm.type === 'customer' ? 'Customer' : 'Lead'}`}
              </button>
            </div>
          </form>

          {/* Leads/Customers Table */}
          <div className="mt-8">
            <h4 className="text-xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#FF8C42]" />
              All Customers & Leads
            </h4>

            {isLoadingLeads ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            ) : (
              <>
                {/* MOBILE VERSION: Cards (< 768px) */}
                <div className="block md:hidden space-y-4">
                  {leads.length === 0 ? (
                    <div className="bg-[#2a2f3a] rounded-xl p-8 text-center text-gray-400 border-2 border-gray-200">
                      No customers or leads yet
                    </div>
                  ) : (
                    <>
                    {leads.slice(0, mobileLeadsPage * MOBILE_PAGE_SIZE).map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-[#2a2f3a] rounded-xl p-4 border-l-4 border-orange-500 shadow-lg hover:bg-[#374151] transition-colors"
                        onClick={() => handleEditLead(lead)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="text-white font-bold text-lg">{lead.name}</h3>
                            <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                              <span>{lead.country || '-'}</span>
                              {lead.current_phase && (
                                <>
                                  <span>•</span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                    lead.current_phase === 'CUSTOMER' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                                  }`}>
                                    {lead.current_phase}
                                  </span>
                                </>
                              )}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingLead(lead);
                            }}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <p className="text-gray-500 text-xs">Source</p>
                            <p className="text-white text-sm font-medium capitalize">{lead.source || 'manual'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Check-in</p>
                            <p className="text-white text-sm font-medium">
                              {lead.check_in ? new Date(lead.check_in).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : (lead.created_at ? new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-')}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Total (Rp)</p>
                            <p className={`text-sm font-bold ${
                              lead.booking_total > 0 ? 'text-green-400' : 'text-gray-400'
                            }`}>
                              {lead.booking_total > 0 ? lead.booking_total.toLocaleString() : '0'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Payment</p>
                            <p className="text-white text-sm font-medium capitalize">{lead.booking_payment_status || '-'}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-gray-500 text-xs">Journey State</p>
                            <p className="text-white text-sm font-medium">{lead.booking_journey_state || '-'}</p>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-gray-700">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditLead(lead);
                            }}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors"
                          >
                            Edit Customer
                          </button>
                        </div>
                      </div>
                    ))}
                    {/* Load More Button */}
                    {leads.length > mobileLeadsPage * MOBILE_PAGE_SIZE && (
                      <button
                        onClick={() => setMobileLeadsPage(prev => prev + 1)}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        Load More ({leads.length - (mobileLeadsPage * MOBILE_PAGE_SIZE)} remaining)
                      </button>
                    )}
                    </>
                  )}
                </div>

                {/* DESKTOP VERSION: Table (>= 768px) */}
                <div className="hidden md:block bg-[#2a2f3a] rounded-xl overflow-hidden border-2 border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="w-full table-fixed text-xs">
                      <thead className="bg-orange-500">
                        <tr>
                          <th className="w-[16%] px-2 py-2 text-left text-white font-bold">Name</th>
                          <th className="w-[10%] px-2 py-2 text-left text-white font-bold">Country</th>
                          <th className="w-[10%] px-2 py-2 text-left text-white font-bold">Phase</th>
                          <th className="w-[9%] px-2 py-2 text-left text-white font-bold">Source</th>
                          <th className="w-[9%] px-2 py-2 text-left text-white font-bold">Check-in</th>
                          <th className="w-[13%] px-2 py-2 text-right text-white font-bold">Total (Rp)</th>
                          <th className="w-[10%] px-2 py-2 text-left text-white font-bold">Payment</th>
                          <th className="w-[18%] px-2 py-2 text-left text-white font-bold">Journey State</th>
                          <th className="w-[5%] px-1 py-2 text-center text-white font-bold"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.length === 0 ? (
                          <tr>
                            <td colSpan="9" className="px-4 py-8 text-center text-gray-400">
                              No customers or leads yet
                            </td>
                          </tr>
                        ) : (
                          leads.map((lead, index) => (
                            <tr
                              key={lead.id}
                              className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-[#2a2f3a]' : 'bg-[#1f2937]'} hover:bg-[#374151] transition-colors cursor-pointer`}
                              onClick={() => handleEditLead(lead)}
                              title="Click to edit"
                            >
                              <td className="px-2 py-2 text-gray-300 overflow-hidden">
                                <div className="truncate font-medium">{lead.name}</div>
                              </td>
                              <td className="px-2 py-2 text-gray-300 overflow-hidden">
                                <div className="truncate">{lead.country || '-'}</div>
                              </td>
                              <td className="px-2 py-2 text-gray-300 overflow-hidden">
                                <div className="truncate">{lead.current_phase || '-'}</div>
                              </td>
                              <td className="px-2 py-2 text-gray-300 capitalize overflow-hidden">
                                <div className="truncate">{lead.source || 'manual'}</div>
                              </td>
                              <td className="px-2 py-2 text-gray-300 whitespace-nowrap">
                                {lead.check_in ? new Date(lead.check_in).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, '-') : (lead.created_at ? new Date(lead.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, '-') : '-')}
                              </td>
                              <td className="px-2 py-2 text-right">
                                <span className={`font-bold ${
                                  lead.booking_total > 0 ? 'text-green-400' : 'text-gray-400'
                                }`}>
                                  {lead.booking_total > 0 ? lead.booking_total.toLocaleString() : '0'}
                                </span>
                              </td>
                              <td className="px-2 py-2 text-gray-300 capitalize overflow-hidden">
                                <div className="truncate">{lead.booking_payment_status}</div>
                              </td>
                              <td className="px-2 py-2 text-gray-300 overflow-hidden">
                                <div className="truncate">{lead.booking_journey_state}</div>
                              </td>
                              <td className="px-1 py-2 text-center">
                                <button
                                  onClick={(e) => {
                                    console.log('[DELETE BUTTON] Clicked for lead:', lead.name);
                                    e.stopPropagation();
                                    e.preventDefault();
                                    console.log('[DELETE BUTTON] Setting deletingLead to:', lead);
                                    setDeletingLead(lead);
                                  }}
                                  className="p-1 hover:bg-red-500/20 rounded transition-colors"
                                  title="Delete"
                                  type="button"
                                >
                                  <svg className="w-3 h-3 text-red-400 hover:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
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
                    Showing <span className="text-orange-400 font-bold">{leads.length}</span> customers & leads
                  </div>
                  <div>
                    Customers: <span className="text-green-400 font-bold">
                      {leads.filter(l => l.current_phase === 'CUSTOMER').length}
                    </span> | Leads: <span className="text-blue-400 font-bold">
                      {leads.filter(l => l.current_phase !== 'CUSTOMER').length}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
          </>
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
                      {villa.name}{villa.base_price ? ` - IDR ${villa.base_price.toLocaleString()}/night` : ''}
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

              {/* Date Validation Error Message */}
              {bookingForm.checkIn && bookingForm.checkOut && new Date(bookingForm.checkOut) <= new Date(bookingForm.checkIn) && (
                <div className="col-span-1 md:col-span-2 bg-red-500/20 border-2 border-red-500 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <h4 className="text-red-500 font-bold text-lg mb-1">Invalid Dates</h4>
                      <p className="text-white text-sm">
                        Check-out date must be AFTER check-in date. Please correct the dates to continue.
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
                    <option key={num} value={num} className="bg-gray-800 text-white">{num}</option>
                  ))}
                </select>
              </div>

              {/* Total Amount */}
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Total Amount (IDR) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400 font-semibold">Rp</span>
                  <input
                    type="number"
                    required
                    step="1"
                    value={bookingForm.totalAmount}
                    onChange={(e) => setBookingForm({...bookingForm, totalAmount: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                    placeholder="0"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Auto-calculated from villa rate × nights (editable)</p>
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

        {/* TAB C: View/Edit Payments */}
        {activeTab === 'payment' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-[#FF8C42]" />
              View/Edit Payments
            </h3>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
              {/* Villa Filter */}
              <select
                value={filterProperty}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setFilterProperty(newValue);
                  loadBookings(newValue);
                }}
                className="px-4 py-2 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-white focus:outline-none focus:border-orange-300"
              >
                <option value="">All Villas</option>
                {villas.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>

              {/* Payment Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  setFilterStatus(newStatus);
                  loadBookings(null, newStatus);
                }}
                className="px-4 py-2 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-white focus:outline-none focus:border-orange-300"
              >
                <option value="">All Payment Status</option>
                <option value="paid">Done</option>
                <option value="pending">On Scheduled</option>
                <option value="expired">Expired</option>
              </select>

              {/* Search Guest */}
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
                  loadBookings('', '');
                }}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all"
              >
                Clear Filters
              </button>
            </div>

            {isLoadingBookings ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            ) : (
              <>
                <p className="text-gray-300 text-sm mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Click "Add Payment" button to record a payment
                </p>

                {/* MOBILE VERSION: Cards (< 768px) */}
                <div className="block md:hidden space-y-4">
                  {bookings.length === 0 ? (
                    <div className="bg-[#2a2f3a] rounded-xl p-8 text-center text-gray-400 border-2 border-gray-200">
                      No bookings found
                    </div>
                  ) : (
                    <>
                    {bookings.slice(0, mobileBookingsPage * MOBILE_PAGE_SIZE).map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-[#2a2f3a] rounded-xl p-4 border-l-4 border-orange-500 shadow-lg"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="text-white font-bold text-lg">{booking.guest_name}</h3>
                            <p className="text-gray-400 text-sm mt-1">
                              {villas.find(v => v.id === booking.villa_id)?.name || properties.find(p => p.id === booking.property_id)?.name || 'N/A'}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                            booking.payment_status === 'paid' ? 'bg-green-500 text-white' :
                            booking.payment_status === 'pending' ? 'bg-yellow-500 text-black' :
                            'bg-gray-500 text-white'
                          }`}>
                            {booking.payment_status || 'pending'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <p className="text-gray-500 text-xs">Check-in</p>
                            <p className="text-white text-sm font-medium">{booking.check_in}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Check-out</p>
                            <p className="text-white text-sm font-medium">{booking.check_out}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-gray-500 text-xs">Total Price</p>
                            <p className="text-green-400 text-lg font-bold">
                              IDR {booking.total_price?.toLocaleString()}
                            </p>
                            {booking.payment_status !== 'paid' && (
                              <p className="text-gray-400 text-xs mt-1">
                                Due: IDR {booking.total_price?.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddPaymentClick(booking)}
                            disabled={booking.payment_status === 'paid'}
                            className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                          >
                            <DollarSign className="w-5 h-5" />
                            {booking.payment_status === 'paid' ? 'Paid' : 'Add Payment'}
                          </button>
                          <button
                            onClick={() => setDeletingBooking(booking)}
                            className="p-2.5 bg-red-500/20 hover:bg-red-500/40 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                    {/* Load More Button */}
                    {bookings.length > mobileBookingsPage * MOBILE_PAGE_SIZE && (
                      <button
                        onClick={() => setMobileBookingsPage(prev => prev + 1)}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        Load More ({bookings.length - (mobileBookingsPage * MOBILE_PAGE_SIZE)} remaining)
                      </button>
                    )}
                    </>
                  )}
                </div>

                {/* DESKTOP VERSION: Table (>= 768px) */}
                <div className="hidden md:block bg-[#2a2f3a] rounded-xl overflow-hidden border-2 border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="w-full table-fixed">
                      <thead className="bg-orange-500">
                        <tr>
                          <th className="w-[18%] px-4 py-3 text-left text-white font-bold">Guest</th>
                          <th className="w-[18%] px-4 py-3 text-left text-white font-bold">Property</th>
                          <th className="w-[11%] px-4 py-3 text-left text-white font-bold">Check-in</th>
                          <th className="w-[11%] px-4 py-3 text-left text-white font-bold">Check-out</th>
                          <th className="w-[12%] px-4 py-3 text-right text-white font-bold">Price (IDR)</th>
                          <th className="w-[15%] px-2 py-3 text-left text-white font-bold">Payment Status</th>
                          <th className="w-[15%] px-2 py-3 text-center text-white font-bold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                              No bookings found
                            </td>
                          </tr>
                        ) : (
                          bookings.map((booking, index) => (
                            <tr
                              key={booking.id}
                              className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-[#2a2f3a]' : 'bg-[#1f2937]'}`}
                            >
                              <td className="px-4 py-3 text-gray-300 text-sm overflow-hidden">
                                <div className="truncate">{booking.guest_name}</div>
                              </td>
                              <td className="px-4 py-3 text-gray-300 text-sm overflow-hidden">
                                <div className="truncate">{villas.find(v => v.id === booking.villa_id)?.name || properties.find(p => p.id === booking.property_id)?.name || 'N/A'}</div>
                              </td>
                              <td className="px-4 py-3 text-gray-300 text-sm whitespace-nowrap">{booking.check_in}</td>
                              <td className="px-4 py-3 text-gray-300 text-sm whitespace-nowrap">{booking.check_out}</td>
                              <td className="px-4 py-3 text-white text-sm text-right whitespace-nowrap">
                                {booking.total_price?.toLocaleString()}
                              </td>
                              <td className="px-2 py-3">
                                <div className="flex flex-col gap-0.5">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block whitespace-nowrap ${
                                    booking.payment_status === 'paid' ? 'bg-green-500 text-white' :
                                    booking.payment_status === 'pending' ? 'bg-yellow-500 text-black' :
                                    'bg-gray-500 text-white'
                                  }`}>
                                    {booking.payment_status || 'pending'}
                                  </span>
                                  {booking.payment_status !== 'paid' && (
                                    <span className="text-[10px] text-gray-400">
                                      Due: {booking.total_price?.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-2 py-3 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => handleAddPaymentClick(booking)}
                                    disabled={booking.payment_status === 'paid'}
                                    className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                  >
                                    <DollarSign className="w-3 h-3" />
                                    Add Payment
                                  </button>
                                  <button
                                    onClick={() => setDeletingBooking(booking)}
                                    className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                                    title="Delete"
                                  >
                                    <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
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
                  <div className="flex gap-4">
                    <span>
                      Paid: <span className="text-green-400 font-bold">
                        {bookings.filter(b => b.payment_status === 'paid').length}
                      </span>
                    </span>
                    <span>
                      Pending: <span className="text-yellow-400 font-bold">
                        {bookings.filter(b => b.payment_status !== 'paid').length}
                      </span>
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB D: View/Edit Tasks */}
        {activeTab === 'task' && (
          <div className="space-y-6">
            {/* Quick Add Task Form */}
            <div className="bg-[#1f2937] rounded-xl p-4 border-2 border-orange-500">
              <h4 className="text-lg font-bold text-[#FF8C42] mb-3 flex items-center gap-2">
                <Save className="w-5 h-5" />
                Quick Add Task
              </h4>
              <form onSubmit={handleSubmitTask} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Task Title *"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                    className="px-3 py-2 bg-[#2a2f3a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-300 text-sm"
                  />
                  <select
                    required
                    value={taskForm.category}
                    onChange={(e) => setTaskForm({...taskForm, category: e.target.value})}
                    className="px-3 py-2 bg-[#2a2f3a] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-300 text-sm"
                  >
                    <option value="housekeeping">Housekeeping</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inventory">Inventory</option>
                    <option value="guest_service">Guest Service</option>
                    <option value="security">Security</option>
                    <option value="other">Other</option>
                  </select>
                  <select
                    required
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                    className="px-3 py-2 bg-[#2a2f3a] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-300 text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <textarea
                  placeholder="Description (optional)"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#2a2f3a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-300 text-sm"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setTaskForm({ title: '', category: 'housekeeping', priority: 'medium', assignedTo: '', description: '' })}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all text-sm"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all flex items-center gap-2 text-sm disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isSubmitting ? 'Creating...' : 'Create Task'}
                  </button>
                </div>
              </form>
            </div>

            {/* Tasks List */}
            <div>
              <h3 className="text-2xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-[#FF8C42]" />
                All Tasks
              </h3>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <select
                  value={filterTaskProperty}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setFilterTaskProperty(newValue);
                    loadTasks(newValue);
                  }}
                  className="px-4 py-2 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-white focus:outline-none focus:border-orange-300"
                >
                  <option value="">Todas las villas</option>
                  {villas.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>

                <select
                  value={filterTaskStatus}
                  onChange={(e) => {
                    setFilterTaskStatus(e.target.value);
                    loadTasks();
                  }}
                  className="px-4 py-2 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-white focus:outline-none focus:border-orange-300"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>

                <button
                  onClick={() => {
                    setFilterTaskProperty('');
                    setFilterTaskStatus('');
                    loadTasks();
                  }}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all md:col-span-2"
                >
                  Clear Filters
                </button>
              </div>

              {isLoadingTasks ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
              ) : tasks.length === 0 ? (
                <div className="bg-[#2a2f3a] rounded-xl p-8 text-center text-gray-400 border-2 border-gray-200">
                  No tasks found. Create your first task above!
                </div>
              ) : (
                <>
                  {/* MOBILE VERSION: Cards (< 768px) */}
                  <div className="block md:hidden space-y-4">
                    {tasks.slice(0, mobileTasksPage * MOBILE_PAGE_SIZE).map((task) => (
                      <div
                        key={task.id}
                        className="bg-[#2a2f3a] rounded-xl p-4 border-l-4 border-orange-500 shadow-lg hover:bg-[#374151] transition-colors"
                        onClick={() => handleEditTask(task)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold text-base truncate">{task.title}</h3>
                            <p className="text-gray-400 text-xs mt-1 capitalize">{task.task_type || 'general'}</p>
                          </div>
                          <span className={`ml-2 shrink-0 px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap ${
                            task.status === 'completed' ? 'bg-green-500 text-white' :
                            task.status === 'in_progress' ? 'bg-blue-500 text-white' :
                            'bg-yellow-500 text-black'
                          }`}>
                            {task.status || 'pending'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div>
                            <p className="text-gray-500 text-xs">Priority</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold inline-block whitespace-nowrap ${
                              task.priority === 'urgent' ? 'bg-red-500 text-white' :
                              task.priority === 'high' ? 'bg-orange-500 text-white' :
                              task.priority === 'medium' ? 'bg-yellow-500 text-black' :
                              'bg-green-500 text-white'
                            }`}>
                              {task.priority || 'medium'}
                            </span>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Created</p>
                            <p className="text-white text-sm">{new Date(task.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {task.description && (
                          <p className="text-gray-400 text-xs mb-3 line-clamp-2">{task.description}</p>
                        )}

                        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-700" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEditTask(task); }}
                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors text-sm"
                          >
                            Edit Task
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeletingTask(task); }}
                            className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-3 py-2.5 rounded-lg transition-colors"
                            title="Delete task"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                    {tasks.length > mobileTasksPage * MOBILE_PAGE_SIZE && (
                      <button
                        onClick={() => setMobileTasksPage(prev => prev + 1)}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        Load More ({tasks.length - (mobileTasksPage * MOBILE_PAGE_SIZE)} remaining)
                      </button>
                    )}
                  </div>

                  {/* DESKTOP VERSION: Table (>= 768px) */}
                  <div className="hidden md:block bg-[#2a2f3a] rounded-xl overflow-hidden border-2 border-gray-200">
                    <div className="overflow-x-auto">
                      <table className="w-full table-fixed">
                        <thead className="bg-orange-500">
                          <tr>
                            <th className="w-[22%] px-4 py-3 text-left text-white font-bold">Title</th>
                            <th className="w-[13%] px-4 py-3 text-left text-white font-bold">Category</th>
                            <th className="w-[11%] px-4 py-3 text-left text-white font-bold">Priority</th>
                            <th className="w-[11%] px-4 py-3 text-left text-white font-bold">Status</th>
                            <th className="w-[11%] px-4 py-3 text-left text-white font-bold">Created</th>
                            <th className="w-[17%] px-4 py-3 text-left text-white font-bold">Description</th>
                            <th className="w-[15%] px-2 py-3 text-center text-white font-bold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tasks.map((task, index) => (
                            <tr
                              key={task.id}
                              className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-[#2a2f3a]' : 'bg-[#1f2937]'} hover:bg-[#374151] transition-colors cursor-pointer`}
                              onClick={() => handleEditTask(task)}
                              title="Click to edit"
                            >
                              <td className="px-4 py-3 text-white font-medium overflow-hidden">
                                <div className="truncate">{task.title}</div>
                              </td>
                              <td className="px-4 py-3 text-gray-300 capitalize overflow-hidden">
                                <div className="truncate">{task.task_type || 'general'}</div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold inline-block whitespace-nowrap ${
                                  task.priority === 'urgent' ? 'bg-red-500 text-white' :
                                  task.priority === 'high' ? 'bg-orange-500 text-white' :
                                  task.priority === 'medium' ? 'bg-yellow-500 text-black' :
                                  'bg-green-500 text-white'
                                }`}>
                                  {task.priority || 'medium'}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold inline-block whitespace-nowrap ${
                                  task.status === 'completed' ? 'bg-green-500 text-white' :
                                  task.status === 'in_progress' ? 'bg-blue-500 text-white' :
                                  'bg-yellow-500 text-black'
                                }`}>
                                  {task.status || 'pending'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-300 text-sm whitespace-nowrap">
                                {new Date(task.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 text-gray-300 overflow-hidden">
                                <div className="truncate">{task.description || '-'}</div>
                              </td>
                              <td className="px-2 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => handleEditTask(task)}
                                    className="px-2 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded-lg font-medium transition-all"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => setDeletingTask(task)}
                                    className="p-1 hover:bg-red-500/20 rounded transition-colors"
                                    title="Delete"
                                  >
                                    <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* Summary */}
              {tasks.length > 0 && (
                <div className="flex justify-between items-center text-sm text-gray-300 mt-4">
                  <div>
                    Showing <span className="text-orange-400 font-bold">{tasks.length}</span> tasks
                  </div>
                  <div className="flex gap-4">
                    <span>Pending: <span className="text-yellow-400 font-bold">{tasks.filter(t => t.status === 'pending' || !t.status).length}</span></span>
                    <span>In Progress: <span className="text-blue-400 font-bold">{tasks.filter(t => t.status === 'in_progress').length}</span></span>
                    <span>Completed: <span className="text-green-400 font-bold">{tasks.filter(t => t.status === 'completed').length}</span></span>
                  </div>
                </div>
              )}
            </div>
          </div>
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
                    onChange={async (e) => {
                      const newCheckIn = e.target.value;
                      setEditForm({...editForm, checkIn: newCheckIn});

                      // Recalculate price if we have check-out and villa_id
                      if (editForm.checkOut && editingBooking?.villa_id) {
                        const newPrice = await recalculateEditPrice(newCheckIn, editForm.checkOut, editingBooking.villa_id);
                        if (newPrice) {
                          setEditForm(prev => ({...prev, checkIn: newCheckIn, totalAmount: newPrice.toString()}));
                        }
                      }
                    }}
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
                    onChange={async (e) => {
                      const newCheckOut = e.target.value;
                      setEditForm({...editForm, checkOut: newCheckOut});

                      // Recalculate price if we have check-in and villa_id
                      if (editForm.checkIn && editingBooking?.villa_id) {
                        const newPrice = await recalculateEditPrice(editForm.checkIn, newCheckOut, editingBooking.villa_id);
                        if (newPrice) {
                          setEditForm(prev => ({...prev, checkOut: newCheckOut, totalAmount: newPrice.toString()}));
                        }
                      }
                    }}
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

      {/* Add Payment Modal */}
      {addingPaymentFor && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto pl-64">
          <div className="bg-[#1f2937] rounded-xl max-w-2xl w-full border-2 border-orange-500 my-8 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-5 py-3 border-b border-gray-700 flex-shrink-0">
              <h3 className="text-xl font-bold text-orange-400 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Add Payment
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {addingPaymentFor.guest_name} • IDR {addingPaymentFor.total_price?.toLocaleString()}
              </p>
            </div>

            {/* Scrollable Content Area */}
            <div className="overflow-y-auto flex-1">
              {/* Success Message (inside modal) */}
              {successMessage && (
                <div className={`mx-5 mt-4 rounded-xl p-4 flex items-center gap-3 ${
                  successMessage.includes('FULLY PAID')
                    ? 'bg-green-500 border-2 border-green-300 animate-pulse'
                    : 'bg-green-500/20 border-2 border-green-500'
                }`}>
                  <CheckCircle className={`flex-shrink-0 ${
                    successMessage.includes('FULLY PAID')
                      ? 'w-7 h-7 text-white'
                      : 'w-5 h-5 text-green-400'
                  }`} />
                  <p className={`font-bold ${
                    successMessage.includes('FULLY PAID')
                      ? 'text-white text-base'
                      : 'text-green-100 text-sm'
                  }`}>{successMessage}</p>
                </div>
              )}

              {/* Payment History Section */}
              {isLoadingHistory ? (
                <div className="px-5 py-4 border-b border-gray-700">
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                    <span className="text-sm">Loading payment history...</span>
                  </div>
                </div>
              ) : paymentHistory.length > 0 ? (
                <div className="px-5 py-4 border-b border-gray-700 bg-[#2a2f3a]/50">
                  <h4 className="text-sm font-bold text-orange-400 mb-3 flex items-center gap-2">
                    <ClipboardList className="w-4 h-4" />
                    Payment History ({paymentHistory.length} payment{paymentHistory.length !== 1 ? 's' : ''})
                  </h4>

                  {/* Payment History Table */}
                  <div className="space-y-2">
                    {paymentHistory.map((payment, index) => (
                      <div key={payment.id} className="bg-[#1f2937] border border-gray-600 rounded-lg p-3">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-400">Date:</span>
                            <span className="text-white ml-2">{payment.transaction_date}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Amount:</span>
                            <span className="text-green-400 font-bold ml-2">IDR {parseFloat(payment.amount).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Method:</span>
                            <span className="text-white ml-2 capitalize">{payment.payment_method.replace('_', ' ')}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Status:</span>
                            <span className="text-green-400 ml-2">{payment.status}</span>
                          </div>
                          {payment.notes && (
                            <div className="col-span-2 mt-1">
                              <span className="text-gray-400 text-xs">Owner Notes:</span>
                              <p className="text-white mt-1 text-xs italic bg-gray-700/30 p-2 rounded">"{payment.notes}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payment Summary */}
                  <div className={`mt-4 p-3 rounded-lg ${
                    paymentHistory.reduce((sum, p) => sum + parseFloat(p.amount), 0) >= addingPaymentFor.total_price
                      ? 'bg-green-500/20 border-2 border-green-500'
                      : 'bg-[#1f2937] border-2 border-orange-500/50'
                  }`}>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase">Total Price</p>
                        <p className="text-white font-bold text-sm">IDR {addingPaymentFor.total_price?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase">Paid</p>
                        <p className="text-green-400 font-bold text-sm">
                          IDR {paymentHistory.reduce((sum, p) => sum + parseFloat(p.amount), 0).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase">Remaining</p>
                        <p className={`font-bold text-sm ${
                          (addingPaymentFor.total_price - paymentHistory.reduce((sum, p) => sum + parseFloat(p.amount), 0)) <= 0
                            ? 'text-green-400'
                            : 'text-yellow-400'
                        }`}>
                          IDR {Math.max(0, addingPaymentFor.total_price - paymentHistory.reduce((sum, p) => sum + parseFloat(p.amount), 0)).toLocaleString()}
                          {(addingPaymentFor.total_price - paymentHistory.reduce((sum, p) => sum + parseFloat(p.amount), 0)) <= 0 && ' ✅'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-5 py-4 border-b border-gray-700 bg-[#2a2f3a]/30">
                  <p className="text-sm text-gray-400 italic">No previous payments recorded for this booking.</p>
                </div>
              )}

              {/* Form Content */}
              <form id="payment-form" onSubmit={handleSubmitPayment}>
                <div className="p-5 space-y-3">
                  <h4 className="text-sm font-bold text-orange-400 mb-3">Add New Payment</h4>
                {/* Amount */}
                <div>
                  <label className="block text-orange-400 font-medium mb-1.5 text-sm">Amount (IDR) *</label>
                  <input
                    type="number"
                    required
                    step="1"
                    min="0"
                    max={addingPaymentFor.total_price}
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                    className="w-full px-3 py-2 bg-[#2a2f3a] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-400"
                    placeholder="Enter amount"
                  />
                </div>

                {/* Payment Method & Date in one row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-orange-400 font-medium mb-1.5 text-sm">Method *</label>
                    <select
                      required
                      value={paymentForm.paymentMethod}
                      onChange={(e) => setPaymentForm({...paymentForm, paymentMethod: e.target.value})}
                      className="w-full px-3 py-2 bg-[#2a2f3a] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-400"
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="cash">Cash</option>
                      <option value="paypal">PayPal</option>
                      <option value="wise">Wise</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-orange-400 font-medium mb-1.5 text-sm">Date *</label>
                    <input
                      type="date"
                      required
                      value={paymentForm.paymentDate}
                      onChange={(e) => setPaymentForm({...paymentForm, paymentDate: e.target.value})}
                      className="w-full px-3 py-2 bg-[#2a2f3a] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-400"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-orange-400 font-medium mb-1.5 text-sm">Notes</label>
                  <textarea
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 bg-[#2a2f3a] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 resize-none"
                    placeholder="Payment reference, confirmation number..."
                  />
                </div>
              </div>
              </form>
            </div>

            {/* Fixed Footer with Buttons */}
            <div className="px-5 py-3 border-t border-gray-700 flex justify-between items-center bg-[#1f2937] flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setAddingPaymentFor(null);
                  setSuccessMessage('');
                }}
                className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                form="payment-form"
                disabled={isAddingPayment}
                className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isAddingPayment ? 'Saving...' : 'Save Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {editingLead && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#1f2937] rounded-2xl p-6 max-w-2xl w-full border-2 border-orange-500 my-8 max-h-[90vh] flex flex-col">
            <h3 className="text-2xl font-bold text-orange-400 mb-6">Edit {editLeadForm.type === 'customer' ? 'Customer' : 'Lead'}</h3>

            <form onSubmit={handleUpdateLead} className="space-y-4 overflow-y-auto pr-2 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Type Selector */}
                <div className="md:col-span-2">
                  <label className="block text-[#FF8C42] font-medium mb-2">Type *</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="editType"
                        value="lead"
                        checked={editLeadForm.type === 'lead'}
                        onChange={(e) => setEditLeadForm({...editLeadForm, type: e.target.value})}
                        className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="text-[#FF8C42] font-medium">Lead</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="editType"
                        value="customer"
                        checked={editLeadForm.type === 'customer'}
                        onChange={(e) => setEditLeadForm({...editLeadForm, type: e.target.value})}
                        className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="text-[#FF8C42] font-medium">Customer</span>
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div className="md:col-span-2">
                  <label className="block text-[#FF8C42] font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editLeadForm.name}
                    onChange={(e) => setEditLeadForm({...editLeadForm, name: e.target.value})}
                    className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] focus:outline-none focus:border-orange-300"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[#FF8C42] font-medium mb-2">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={editLeadForm.phone}
                    onChange={(e) => setEditLeadForm({...editLeadForm, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] focus:outline-none focus:border-orange-300"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[#FF8C42] font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={editLeadForm.email}
                    onChange={(e) => setEditLeadForm({...editLeadForm, email: e.target.value})}
                    className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] focus:outline-none focus:border-orange-300"
                  />
                </div>

                {/* Country */}
                <div className="md:col-span-2">
                  <label className="block text-[#FF8C42] font-medium mb-2">Country</label>
                  <input
                    type="text"
                    value={editLeadForm.country}
                    onChange={(e) => setEditLeadForm({...editLeadForm, country: e.target.value})}
                    className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                    placeholder="e.g. Indonesia, India, China"
                  />
                </div>

                {/* Source */}
                <div className="md:col-span-2">
                  <label className="block text-[#FF8C42] font-medium mb-2">Source</label>
                  <select
                    value={editLeadForm.source}
                    onChange={(e) => setEditLeadForm({...editLeadForm, source: e.target.value})}
                    className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] focus:outline-none focus:border-orange-300 [&>option]:bg-[#1f2937] [&>option]:text-white"
                  >
                    <option value="manual">Manual Entry</option>
                    <option value="web">Website</option>
                    <option value="instagram">Instagram</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="tiktok">TikTok</option>
                    <option value="referral">Referral</option>
                  </select>
                </div>

                {/* Message */}
                <div className="md:col-span-2">
                  <label className="block text-[#FF8C42] font-medium mb-2">Add Note</label>
                  <textarea
                    value={editLeadForm.message}
                    onChange={(e) => setEditLeadForm({...editLeadForm, message: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] focus:outline-none focus:border-orange-300"
                    placeholder="Add a new note (optional)"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  disabled={isSavingLeadEdit}
                  className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingLeadEdit}
                  className={`flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all ${
                    isSavingLeadEdit ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSavingLeadEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Lead Confirmation Modal */}
      {deletingLead && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1f2937] rounded-2xl p-6 max-w-md w-full border-2 border-red-500">
            <h3 className="text-2xl font-bold text-red-400 mb-4">Confirm Delete</h3>
            <p className="text-white mb-2">Are you sure you want to delete this {deletingLead.current_phase === 'CUSTOMER' ? 'customer' : 'lead'}?</p>
            <div className="bg-[#2a2f3a] p-4 rounded-xl mb-6 space-y-2">
              <p className="text-white"><span className="font-bold">Name:</span> {deletingLead.name}</p>
              <p className="text-gray-300"><span className="font-bold">Phone:</span> {deletingLead.phone}</p>
              <p className="text-gray-300"><span className="font-bold">Email:</span> {deletingLead.email || '-'}</p>
              <p className={`font-bold ${deletingLead.current_phase === 'CUSTOMER' ? 'text-green-400' : 'text-blue-400'}`}>
                Type: {deletingLead.current_phase === 'CUSTOMER' ? 'Customer' : 'Lead'}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingLead(null)}
                disabled={isDeletingLead}
                className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteLead}
                disabled={isDeletingLead}
                className={`flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all ${
                  isDeletingLead ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isDeletingLead ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Task Confirmation Modal */}
      {deletingTask && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1f2937] rounded-2xl p-6 max-w-md w-full border-2 border-red-500">
            <h3 className="text-2xl font-bold text-red-400 mb-4">Confirm Delete</h3>
            <p className="text-white mb-2">Are you sure you want to delete this task?</p>
            <div className="bg-[#2a2f3a] p-4 rounded-xl mb-6 space-y-2">
              <p className="text-white"><span className="font-bold">Title:</span> {deletingTask.title}</p>
              <p className="text-gray-300"><span className="font-bold">Category:</span> {deletingTask.action_type || 'general'}</p>
              <p className="text-gray-300">
                <span className="font-bold">Priority:</span>{' '}
                <span className={`font-bold ${
                  deletingTask.priority === 'urgent' ? 'text-red-400' :
                  deletingTask.priority === 'high' ? 'text-orange-400' :
                  deletingTask.priority === 'medium' ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  {deletingTask.priority || 'medium'}
                </span>
              </p>
              <p className="text-gray-300">
                <span className="font-bold">Status:</span>{' '}
                <span className={`font-bold ${
                  deletingTask.status === 'completed' ? 'text-green-400' :
                  deletingTask.status === 'in_progress' ? 'text-blue-400' :
                  'text-yellow-400'
                }`}>
                  {deletingTask.status || 'pending'}
                </span>
              </p>
              {deletingTask.description && (
                <p className="text-gray-300"><span className="font-bold">Description:</span> {deletingTask.description}</p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingTask(null)}
                disabled={isDeletingTask}
                className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                disabled={isDeletingTask}
                className={`flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all ${
                  isDeletingTask ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isDeletingTask ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#1f2937] rounded-2xl p-6 max-w-lg w-full border-2 border-orange-500 my-8">
            <h3 className="text-2xl font-bold text-orange-400 mb-6">Edit Task</h3>
            <form onSubmit={handleUpdateTask} className="space-y-4">
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={editTaskForm.title}
                  onChange={(e) => setEditTaskForm({...editTaskForm, title: e.target.value})}
                  className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-white focus:outline-none focus:border-orange-300"
                />
              </div>
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Category</label>
                <select
                  value={editTaskForm.task_type}
                  onChange={(e) => setEditTaskForm({...editTaskForm, task_type: e.target.value})}
                  className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-white focus:outline-none focus:border-orange-300 [&>option]:bg-[#1f2937]"
                >
                  <option value="housekeeping">Housekeeping</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inventory">Inventory</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#FF8C42] font-medium mb-2">Priority</label>
                  <select
                    value={editTaskForm.priority}
                    onChange={(e) => setEditTaskForm({...editTaskForm, priority: e.target.value})}
                    className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-white focus:outline-none focus:border-orange-300 [&>option]:bg-[#1f2937]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#FF8C42] font-medium mb-2">Status</label>
                  <select
                    value={editTaskForm.status}
                    onChange={(e) => setEditTaskForm({...editTaskForm, status: e.target.value})}
                    className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-white focus:outline-none focus:border-orange-300 [&>option]:bg-[#1f2937]"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[#FF8C42] font-medium mb-2">Description</label>
                <textarea
                  value={editTaskForm.description}
                  onChange={(e) => setEditTaskForm({...editTaskForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-white focus:outline-none focus:border-orange-300"
                  placeholder="Optional..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  disabled={isSavingTaskEdit}
                  className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingTaskEdit}
                  className={`flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all ${isSavingTaskEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSavingTaskEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default ManualDataEntry;

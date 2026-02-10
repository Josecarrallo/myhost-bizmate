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

  // Leads/Customers table data
  const [leads, setLeads] = useState([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);

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
    dueDate: '',
    description: ''
  });

  // Load properties and villas when component mounts
  useEffect(() => {
    const loadPropertiesAndVillas = async () => {
      if (!userData?.id) {
        console.log('Waiting for userData to load...');
        return;
      }

      try {
        setIsLoadingProperties(true);
        console.log('Loading properties for user:', userData.id);

        // Fetch properties for this owner
        const allProperties = await supabaseService.getProperties();
        console.log('All properties:', allProperties);

        const ownerProperties = allProperties.filter(p => p.owner_id === userData.id);
        console.log('Owner properties:', ownerProperties);

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
        `${supabaseService.SUPABASE_URL || 'https://jjpscimtxrudtepzwhag.supabase.co'}/rest/v1/villas?property_id=eq.${propertyId}&select=*`,
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0'
          }
        }
      );

      if (response.ok) {
        const villasData = await response.json();

        // Filter active villas
        const activeVillas = villasData.filter(v => v.status === 'active');
        setVillas(activeVillas);

        // Auto-select first villa if there's only one
        if (activeVillas.length === 1) {
          setBookingForm(prev => ({ ...prev, villaId: activeVillas[0].id }));
        }
      } else {
        console.error('Failed to load villas, status:', response.status);
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
      // Invalid dates - check-out is before or same as check-in
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

  // Load leads/customers
  const loadLeads = async () => {
    if (!userData?.id) {
      console.warn('❌ No userData.id - cannot load leads');
      return;
    }

    try {
      setIsLoadingLeads(true);

      const filters = {
        tenant_id: userData.id // CRITICAL: Multi-tenant filtering
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
      const bookingsData = await supabaseService.getBookings({ tenant_id: userData.id });

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

      // Sort by check-in date
      leadsWithBookingData.sort((a, b) => {
        if (!a.booking_check_in) return 1;
        if (!b.booking_check_in) return -1;
        return new Date(a.booking_check_in) - new Date(b.booking_check_in);
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
  }, [activeTab, filterProperty, filterStatus, searchGuest, userData]);

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

      // Use Supabase service to delete
      const { error } = await supabaseService.updateLead(deletingLead.id, {
        // Soft delete or hard delete - for now we'll use hard delete
        deleted_at: new Date().toISOString()
      });

      if (error) throw error;

      // Success - reload leads
      setSuccessMessage(`${deletingLead.state === 'CUSTOMER' ? 'Customer' : 'Lead'} ${deletingLead.name} deleted successfully`);
      setDeletingLead(null);
      loadLeads();

      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error deleting lead:', error);
      setErrorMessage('Failed to delete lead');
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
        phone: leadForm.phone,
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
  const handleAddPaymentClick = (booking) => {
    setAddingPaymentFor(booking);
    // Reset payment form with booking ID
    setPaymentForm({
      bookingId: booking.id,
      amount: '',
      paymentMethod: 'bank_transfer',
      paymentDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setSuccessMessage('');
    setErrorMessage('');
    setIsAddingPayment(true);

    try {
      // Validate user is logged in
      if (!userData || !userData.id) {
        throw new Error('You must be logged in to record a payment');
      }

      // Validate required fields
      if (!paymentForm.bookingId) {
        throw new Error('Please select a booking');
      }
      if (!paymentForm.amount || parseFloat(paymentForm.amount) <= 0) {
        throw new Error('Please enter a valid payment amount');
      }

      // Prepare payment data for Supabase
      const paymentData = {
        tenant_id: userData.id,
        booking_id: paymentForm.bookingId,
        amount: parseFloat(paymentForm.amount),
        payment_method: paymentForm.paymentMethod,
        transaction_date: paymentForm.paymentDate,
        status: 'completed',
        notes: paymentForm.notes || '',
        created_at: new Date().toISOString()
      };

      console.log('💳 Recording payment:', paymentData);

      // Call Supabase service
      const result = await supabaseService.createPayment(paymentData);

      // Optionally update booking payment status
      // Get booking to check if fully paid
      const booking = bookings.find(b => b.id === paymentForm.bookingId);
      if (booking && parseFloat(paymentForm.amount) >= booking.total_price) {
        await supabaseService.updateBooking(paymentForm.bookingId, {
          payment_status: 'paid',
          updated_at: new Date().toISOString()
        });
      }

      // Success!
      setSuccessMessage(`Payment recorded successfully! Amount: IDR ${parseFloat(paymentForm.amount).toLocaleString()}`);

      // Close modal
      setAddingPaymentFor(null);

      // Reset form
      setPaymentForm({
        bookingId: '',
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
      console.error('Error recording payment:', error);
      setErrorMessage(error.message || 'Failed to record payment. Please try again.');
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

      // Prepare task data for Supabase (autopilot_actions table)
      const taskData = {
        tenant_id: userData.id,              // REQUIRED
        property_id: propertyId,             // REQUIRED
        action_type: taskForm.category,      // REQUIRED (housekeeping, maintenance, inventory)
        title: taskForm.title,               // REQUIRED
        description: taskForm.description || null,
        priority: taskForm.priority || 'medium',
        due_date: taskForm.dueDate || null
        // assigned_to NO EXISTE en la tabla
        // status: 'pending' (auto-default)
        // created_at, updated_at (auto-generated)
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
        dueDate: '',
        description: ''
      });

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (error) {
      console.error('Error creating task:', error);
      setErrorMessage(error.message || 'Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'view-bookings', label: 'View/Edit Bookings', icon: ClipboardList },
    { id: 'booking', label: 'Add Booking', icon: Calendar },
    { id: 'lead', label: 'Add Customer & Lead', icon: UserPlus },
    { id: 'payment', label: 'Add Payment', icon: DollarSign },
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
                  {tab.id === 'lead' ? (
                    <div className="hidden md:flex flex-col leading-tight text-center">
                      <div>Add</div>
                      <div className="whitespace-nowrap">Customer & Lead</div>
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
                  <p className="text-gray-300 text-sm mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Click on any row to edit • Click trash icon to delete
                  </p>
                  <div className="bg-[#2a2f3a] rounded-xl overflow-hidden border-2 border-gray-200">
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
                                  <div className="truncate">{properties.find(p => p.id === booking.property_id)?.name || 'N/A'}</div>
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
                <div className="bg-[#2a2f3a] rounded-xl overflow-hidden border-2 border-gray-200">
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
                              <td className="px-2 py-2 text-gray-300">
                                {lead.booking_check_in ? new Date(lead.booking_check_in).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}
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
                              <td className="px-1 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => setDeletingLead(lead)}
                                  className="p-1 hover:bg-red-500/20 rounded transition-colors"
                                  title="Delete"
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

        {/* TAB C: Add Payment */}
        {activeTab === 'payment' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-[#FF8C42] mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-[#FF8C42]" />
              Add Payment
            </h3>

            {isLoadingBookings ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            ) : (
              <>
                <div className="bg-[#2a2f3a] rounded-xl overflow-hidden border-2 border-gray-200">
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
                                <div className="truncate">{properties.find(p => p.id === booking.property_id)?.name || 'N/A'}</div>
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
                                <button
                                  onClick={() => handleAddPaymentClick(booking)}
                                  disabled={booking.payment_status === 'paid'}
                                  className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 mx-auto"
                                >
                                  <DollarSign className="w-3 h-3" />
                                  Add Payment
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
                  className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] focus:outline-none focus:border-orange-300 [&>option]:bg-[#1f2937] [&>option]:text-white"
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
                  className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] focus:outline-none focus:border-orange-300 [&>option]:bg-[#1f2937] [&>option]:text-white"
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

      {/* Add Payment Modal */}
      {addingPaymentFor && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#1f2937] rounded-2xl p-6 max-w-2xl w-full border-2 border-orange-500 my-8">
            <h3 className="text-2xl font-bold text-orange-400 mb-6 flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              Add Payment
            </h3>

            {/* Booking Information (Readonly) */}
            <div className="bg-[#2a2f3a] rounded-xl p-4 mb-6 border-2 border-gray-600">
              <h4 className="text-sm font-bold text-gray-400 mb-3">Booking Details</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-400">Guest:</span>
                  <span className="text-white font-medium ml-2">{addingPaymentFor.guest_name}</span>
                </div>
                <div>
                  <span className="text-gray-400">Property:</span>
                  <span className="text-white font-medium ml-2">
                    {properties.find(p => p.id === addingPaymentFor.property_id)?.name || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Check-in:</span>
                  <span className="text-white font-medium ml-2">{addingPaymentFor.check_in}</span>
                </div>
                <div>
                  <span className="text-gray-400">Check-out:</span>
                  <span className="text-white font-medium ml-2">{addingPaymentFor.check_out}</span>
                </div>
                <div className="col-span-2 border-t border-gray-600 pt-2 mt-1">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Price:</span>
                    <span className="text-green-400 font-bold text-lg">
                      IDR {addingPaymentFor.total_price?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-400">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      addingPaymentFor.payment_status === 'paid' ? 'bg-green-500 text-white' :
                      addingPaymentFor.payment_status === 'pending' ? 'bg-yellow-500 text-black' :
                      'bg-gray-500 text-white'
                    }`}>
                      {addingPaymentFor.payment_status || 'pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Amount to Pay */}
                <div className="md:col-span-2">
                  <label className="block text-[#FF8C42] font-medium mb-2">Payment Amount (IDR) *</label>
                  <input
                    type="number"
                    required
                    step="1"
                    min="0"
                    max={addingPaymentFor.total_price}
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                    className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] placeholder-gray-400 focus:outline-none focus:border-orange-300"
                    placeholder="Enter amount"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Maximum: IDR {addingPaymentFor.total_price?.toLocaleString()}
                  </p>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-[#FF8C42] font-medium mb-2">Payment Method *</label>
                  <select
                    required
                    value={paymentForm.paymentMethod}
                    onChange={(e) => setPaymentForm({...paymentForm, paymentMethod: e.target.value})}
                    className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] focus:outline-none focus:border-orange-300 [&>option]:bg-[#1f2937] [&>option]:text-white"
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
                <div>
                  <label className="block text-[#FF8C42] font-medium mb-2">Payment Date *</label>
                  <input
                    type="date"
                    required
                    value={paymentForm.paymentDate}
                    onChange={(e) => setPaymentForm({...paymentForm, paymentDate: e.target.value})}
                    className="w-full px-4 py-3 bg-[#2a2f3a] border-2 border-gray-200 rounded-xl text-[#FF8C42] focus:outline-none focus:border-orange-300"
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

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setAddingPaymentFor(null)}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingPayment}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {isAddingPayment ? 'Saving...' : 'Save Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {editingLead && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#1f2937] rounded-2xl p-6 max-w-2xl w-full border-2 border-orange-500 my-8">
            <h3 className="text-2xl font-bold text-orange-400 mb-6">Edit {editLeadForm.type === 'customer' ? 'Customer' : 'Lead'}</h3>

            <form onSubmit={handleUpdateLead} className="space-y-4">
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
            <p className="text-white mb-2">Are you sure you want to delete this {deletingLead.state === 'CUSTOMER' ? 'customer' : 'lead'}?</p>
            <div className="bg-[#2a2f3a] p-4 rounded-xl mb-6 space-y-2">
              <p className="text-white"><span className="font-bold">Name:</span> {deletingLead.name}</p>
              <p className="text-gray-300"><span className="font-bold">Phone:</span> {deletingLead.phone}</p>
              <p className="text-gray-300"><span className="font-bold">Email:</span> {deletingLead.email || '-'}</p>
              <p className={`font-bold ${deletingLead.state === 'CUSTOMER' ? 'text-green-400' : 'text-blue-400'}`}>
                Type: {deletingLead.state === 'CUSTOMER' ? 'Customer' : 'Lead'}
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
    </div>
  </div>
  );
};

export default ManualDataEntry;

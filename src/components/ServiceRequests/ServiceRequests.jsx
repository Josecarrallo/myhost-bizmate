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
  Edit,
  Save,
  AlertCircle,
  Plane,
  Mountain,
  Sparkles,
  ChefHat,
  Cake,
  Bike,
  Car,
  Coffee,
  Palmtree,
  FileText,
  Trash2
} from 'lucide-react';
import { StatCard } from '../common';
import { dataService } from '../../services/data';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const ServiceRequests = ({ onBack }) => {
  const { user, userData } = useAuth();

  // State for service requests data
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterVilla, setFilterVilla] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(false);

  // Villas data (for filters)
  const [villas, setVillas] = useState([]);

  // Form data for creating new request
  const [formData, setFormData] = useState({
    villa_id: '',
    type: '',
    title: '',
    guest_name: '',
    guest_phone: '',
    guest_email: '',
    scheduled_date: '',
    scheduled_time: '',
    price: '',
    currency: 'USD',
    special_requests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState('');

  // State for editing request in detail panel
  const [editedRequest, setEditedRequest] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  /* MOCK DATA REMOVED - Now using real Supabase data
  const mockRequests = [
    {
      id: '1',
      villa_id: null, // Will be set dynamically from villas
      type: 'airport_transfer',
      title: 'Airport Pickup - Ngurah Rai',
      status: 'confirmed',
      scheduled_at: '2026-03-08T14:30:00Z',
      duration_minutes: 60,
      guest_name: 'Sarah Johnson',
      guest_phone: '+1 555-0101',
      guest_email: 'sarah.j@email.com',
      price: 25,
      currency: 'USD',
      details: {
        flight_number: 'GA 123',
        passengers: 2,
        pickup_location: 'Ngurah Rai Airport',
        dropoff_location: 'Villa Sunset Paradise',
        luggage: 3,
        transfer_type: 'pickup',
        vehicle_type: 'sedan'
      },
      assigned_to: '',
      assigned_phone: '',
      special_requests: 'Need child seat',
      internal_notes: '',
      source: 'whatsapp',
      source_agent: 'banyu',
      created_at: '2026-03-06T10:00:00Z',
      booking_id: null
    },
    {
      id: '2',
      type: 'tour',
      title: 'Mount Batur Sunrise Trek',
      status: 'pending_confirmation',
      scheduled_at: '2026-03-10T03:00:00Z',
      duration_minutes: 360,
      guest_name: 'Michael Chen',
      guest_phone: '+1 555-0102',
      guest_email: 'mchen@email.com',
      price: 650000,
      currency: 'IDR',
      details: {
        tour_name: 'Mount Batur Sunrise Trek',
        group_size: 4,
        guide_needed: true,
        pickup_time: '03:00'
      },
      assigned_to: 'Made Wijaya',
      assigned_phone: '+62 812 3456 7890',
      special_requests: '',
      internal_notes: 'Guide confirmed availability',
      source: 'whatsapp',
      source_agent: 'banyu',
      created_at: '2026-03-05T15:30:00Z',
      booking_id: null
    },
    {
      id: '3',
      type: 'spa',
      title: 'Couples Massage',
      status: 'assigned',
      scheduled_at: '2026-03-09T16:00:00Z',
      duration_minutes: 90,
      guest_name: 'Emma Wilson',
      guest_phone: '+1 555-0103',
      guest_email: 'ewilson@email.com',
      price: 1200000,
      currency: 'IDR',
      details: {
        treatment_type: 'Balinese Massage',
        duration: 90,
        therapist_preference: 'female'
      },
      assigned_to: 'Sari Dewi',
      assigned_phone: '+62 813 9876 5432',
      special_requests: 'Lavender aromatherapy preferred',
      internal_notes: 'Therapist confirmed for 4pm',
      source: 'dashboard',
      source_agent: 'manual',
      created_at: '2026-03-04T09:15:00Z',
      booking_id: null
    },
    {
      id: '4',
      type: 'private_chef',
      title: 'Private Dinner',
      status: 'in_progress',
      scheduled_at: '2026-03-07T19:00:00Z',
      duration_minutes: 180,
      guest_name: 'David Park',
      guest_phone: '+1 555-0104',
      guest_email: 'dpark@email.com',
      price: 150,
      currency: 'USD',
      details: {
        cuisine: 'Indonesian',
        guests_count: 6,
        dietary_restrictions: 'No shellfish, vegetarian option for 1 guest'
      },
      assigned_to: 'Chef Wayan',
      assigned_phone: '+62 821 5555 1234',
      special_requests: 'Traditional Balinese menu',
      internal_notes: 'Shopping list sent to chef',
      source: 'whatsapp',
      source_agent: 'banyu',
      created_at: '2026-03-03T11:45:00Z',
      booking_id: null
    },
    {
      id: '5',
      type: 'scooter_rental',
      title: 'Scooter Rental',
      status: 'completed',
      scheduled_at: '2026-03-06T09:00:00Z',
      duration_minutes: null,
      guest_name: 'Sofia Martinez',
      guest_phone: '+1 555-0105',
      guest_email: 'sofia.m@email.com',
      price: 70000,
      currency: 'IDR',
      details: {
        vehicle_type: 'Honda Scoopy',
        duration_days: 3,
        pickup_location: 'Villa Sunset Paradise'
      },
      assigned_to: 'Bali Scooter Rental',
      assigned_phone: '+62 361 1234567',
      special_requests: '',
      internal_notes: 'Delivered and paid',
      source: 'phone',
      source_agent: 'manual',
      created_at: '2026-03-02T14:20:00Z',
      completed_at: '2026-03-06T09:30:00Z',
      booking_id: null
    },
    {
      id: '6',
      type: 'floating_breakfast',
      title: 'Floating Breakfast',
      status: 'confirmed',
      scheduled_at: '2026-03-09T08:00:00Z',
      duration_minutes: 60,
      guest_name: 'James Anderson',
      guest_phone: '+1 555-0106',
      guest_email: 'j.anderson@email.com',
      price: 450000,
      currency: 'IDR',
      details: {
        guests_count: 2,
        dietary_restrictions: 'Gluten-free bread'
      },
      assigned_to: 'Villa Staff',
      assigned_phone: '',
      special_requests: 'Instagram-worthy presentation',
      internal_notes: 'Flowers and fruits ordered',
      source: 'whatsapp',
      source_agent: 'banyu',
      created_at: '2026-03-05T16:00:00Z',
      booking_id: null
    }
  ];
  */

  // Load villas and service requests when userData is available
  useEffect(() => {
    if (userData?.id) {
      loadVillas();
      loadServiceRequests();
    }
  }, [userData?.id]);

  const loadServiceRequests = async () => {
    try {
      setLoading(true);

      if (!userData?.id) {
        console.log('[ServiceRequests] No user data available');
        setLoading(false);
        return;
      }

      // Get user's properties
      const { data: properties, error: propsError } = await supabase
        .from('properties')
        .select('id')
        .eq('owner_id', userData.id);

      if (propsError) {
        console.error('[ServiceRequests] Error loading properties:', propsError);
        setAllRequests([]);
        setLoading(false);
        return;
      }

      if (!properties || properties.length === 0) {
        console.log('[ServiceRequests] No properties found');
        setAllRequests([]);
        setLoading(false);
        return;
      }

      const propertyIds = properties.map(p => p.id);
      console.log('[ServiceRequests] Loading requests for properties:', propertyIds);

      // Load service requests for user's properties
      const { data: requests, error } = await supabase
        .from('service_requests')
        .select('*')
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[ServiceRequests] Error loading requests:', error);
        setAllRequests([]);
        setLoading(false);
        return;
      }

      console.log('[ServiceRequests] Loaded requests:', requests?.length || 0);
      setAllRequests(requests || []);
      setLoading(false);
    } catch (error) {
      console.error('[ServiceRequests] Error loading:', error);
      setAllRequests([]);
      setLoading(false);
    }
  };

  const loadVillas = async () => {
    try {
      if (!userData?.id) {
        console.log('[ServiceRequests] No user data yet');
        return;
      }

      console.log('[ServiceRequests] Loading villas for user:', userData.id);

      // First get properties for this user (owner_id)
      const { data: properties, error: propsError } = await supabase
        .from('properties')
        .select('id')
        .eq('owner_id', userData.id);

      if (propsError) {
        console.error('[ServiceRequests] Error loading properties:', propsError);
        return;
      }

      if (!properties || properties.length === 0) {
        console.log('[ServiceRequests] No properties found for user');
        setVillas([]);
        return;
      }

      const propertyIds = properties.map(p => p.id);
      console.log('[ServiceRequests] Found properties:', propertyIds);

      // Now get villas for these properties
      const { data: villasData, error } = await supabase
        .from('villas')
        .select('id, name, property_id')
        .in('property_id', propertyIds)
        .order('name', { ascending: true });

      if (error) {
        console.error('[ServiceRequests] Error loading villas:', error);
        return;
      }

      console.log('[ServiceRequests] Loaded villas:', villasData?.length || 0);
      setVillas(villasData || []);
    } catch (error) {
      console.error('[ServiceRequests] Error loading villas:', error);
    }
  };

  const handleCreateRequest = async () => {
    try {
      console.log('[CREATE] Starting creation with formData:', formData);
      setIsSubmitting(true);
      setCreateError('');

      // Validation
      if (!formData.villa_id || !formData.type || !formData.title || !formData.guest_name || !formData.guest_phone) {
        console.log('[CREATE] Validation failed: missing required fields');
        console.log('Villa:', formData.villa_id, 'Type:', formData.type, 'Title:', formData.title, 'Guest:', formData.guest_name, 'Phone:', formData.guest_phone);
        setCreateError('Please fill in all required fields (Villa, Type, Title, Guest Name, Phone)');
        setIsSubmitting(false);
        return;
      }

      if (!formData.scheduled_date || !formData.scheduled_time) {
        console.log('[CREATE] Validation failed: missing date/time');
        console.log('Date:', formData.scheduled_date, 'Time:', formData.scheduled_time);
        setCreateError('Please select scheduled date and time');
        setIsSubmitting(false);
        return;
      }

      if (!formData.price || isNaN(parseFloat(formData.price))) {
        console.log('[CREATE] Validation failed: invalid price');
        console.log('Price:', formData.price);
        setCreateError('Please enter a valid price');
        setIsSubmitting(false);
        return;
      }

      // Find the selected villa to get property_id
      console.log('[CREATE] Looking for villa:', formData.villa_id, 'in villas:', villas);
      const selectedVilla = villas.find(v => v.id === formData.villa_id);
      if (!selectedVilla) {
        console.log('[CREATE] Validation failed: villa not found');
        setCreateError('Villa not found');
        setIsSubmitting(false);
        return;
      }
      console.log('[CREATE] Found villa:', selectedVilla);

      // Combine date and time
      const scheduledDateTime = new Date(`${formData.scheduled_date}T${formData.scheduled_time}:00`).toISOString();

      // Get type-specific details based on type
      const getDetailsForType = (type) => {
        const baseDetails = { villa_name: selectedVilla.name };

        switch (type) {
          case 'airport_transfer':
            return { ...baseDetails, transfer_type: 'pickup', vehicle_type: 'sedan', passengers: 2 };
          case 'tour':
            return { ...baseDetails, group_size: 2, guide_needed: true };
          case 'spa':
            return { ...baseDetails, duration: 90, treatment_type: 'Massage' };
          case 'private_chef':
            return { ...baseDetails, cuisine: 'Indonesian', guests_count: 2 };
          case 'scooter_rental':
            return { ...baseDetails, vehicle_type: 'Honda Scoopy', duration_days: 1 };
          case 'car_rental':
            return { ...baseDetails, vehicle_type: 'Toyota Avanza', duration_days: 1 };
          case 'floating_breakfast':
            return { ...baseDetails, guests_count: 2 };
          case 'decoration':
            return { ...baseDetails, occasion: 'Special Event', style: 'Romantic' };
          case 'excursion':
            return { ...baseDetails, group_size: 2, guide_needed: true };
          default:
            return baseDetails;
        }
      };

      // Create the request object
      const newRequest = {
        tenant_id: userData.id,
        property_id: selectedVilla.property_id,
        type: formData.type,
        title: formData.title,
        status: 'pending_confirmation',
        scheduled_at: scheduledDateTime,
        guest_name: formData.guest_name,
        guest_phone: formData.guest_phone,
        guest_email: formData.guest_email || null,
        price: parseFloat(formData.price),
        currency: formData.currency,
        details: getDetailsForType(formData.type),
        special_requests: formData.special_requests || null,
        source: 'dashboard',
        source_agent: 'manual',
        created_at: new Date().toISOString()
      };

      console.log('[ServiceRequests] Creating new request:', newRequest);

      // Insert into Supabase
      const { data, error } = await supabase
        .from('service_requests')
        .insert([newRequest])
        .select();

      if (error) {
        console.error('[ServiceRequests] Error creating request:', error);
        setIsSubmitting(false);
        return;
      }

      console.log('[ServiceRequests] Request created successfully:', data);

      // Reset form
      setFormData({
        villa_id: '',
        type: '',
        title: '',
        guest_name: '',
        guest_phone: '',
        guest_email: '',
        scheduled_date: '',
        scheduled_time: '',
        price: '',
        currency: 'USD',
        special_requests: ''
      });

      // Close modal
      setShowCreateForm(false);
      setIsSubmitting(false);

      // Reload requests
      await loadServiceRequests();
    } catch (error) {
      console.error('[ServiceRequests] Error:', error);
      setIsSubmitting(false);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    try {
      const { error } = await supabase
        .from('service_requests')
        .delete()
        .eq('id', requestId);

      if (error) {
        console.error('[ServiceRequests] Error deleting:', error);
        return;
      }

      // Reload requests
      loadServiceRequests();
    } catch (error) {
      console.error('[ServiceRequests] Error deleting:', error);
    }
  };

  const handleOpenDetail = (request) => {
    setSelectedRequest(request);
    setEditedRequest({...request});
  };

  const handleUpdateRequest = async () => {
    try {
      setIsSavingEdit(true);

      const { error } = await supabase
        .from('service_requests')
        .update({
          title: editedRequest.title,
          status: editedRequest.status,
          guest_name: editedRequest.guest_name,
          guest_phone: editedRequest.guest_phone,
          guest_email: editedRequest.guest_email,
          price: editedRequest.price,
          currency: editedRequest.currency,
          assigned_to: editedRequest.assigned_to,
          assigned_phone: editedRequest.assigned_phone,
          special_requests: editedRequest.special_requests,
          internal_notes: editedRequest.internal_notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', editedRequest.id);

      if (error) {
        console.error('[ServiceRequests] Error updating:', error);
        setIsSavingEdit(false);
        return;
      }

      // Close panel and reload
      setSelectedRequest(null);
      setEditedRequest(null);
      setIsSavingEdit(false);
      loadServiceRequests();
    } catch (error) {
      console.error('[ServiceRequests] Error updating:', error);
      setIsSavingEdit(false);
    }
  };

  // Type icon map
  const getTypeIcon = (type) => {
    const icons = {
      airport_transfer: Plane,
      tour: Mountain,
      spa: Sparkles,
      private_chef: ChefHat,
      decoration: Cake,
      scooter_rental: Bike,
      car_rental: Car,
      floating_breakfast: Coffee,
      excursion: Palmtree,
      other: FileText
    };
    return icons[type] || FileText;
  };

  // Type emoji map
  const getTypeEmoji = (type) => {
    const emojis = {
      airport_transfer: '✈️',
      tour: '🏔️',
      spa: '💆',
      private_chef: '👨‍🍳',
      decoration: '🎂',
      scooter_rental: '🛵',
      car_rental: '🚗',
      floating_breakfast: '🥞',
      excursion: '🌴',
      other: '📋'
    };
    return emojis[type] || '📋';
  };

  // Status badge color
  const getStatusColor = (status) => {
    const colors = {
      pending_confirmation: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-700 border-blue-300',
      assigned: 'bg-purple-100 text-purple-700 border-purple-300',
      in_progress: 'bg-orange-100 text-orange-700 border-orange-300',
      completed: 'bg-green-100 text-green-700 border-green-300',
      cancelled: 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  // Format status label
  const formatStatus = (status) => {
    if (status === 'pending_confirmation') return 'Unconfirmed';
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Format type label
  const formatType = (type) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Format date/time in Bali timezone (WITA, UTC+8)
  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Makassar', // WITA timezone
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  // Format relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDateTime(dateString);
  };

  // Format price
  const formatPrice = (price, currency) => {
    if (currency === 'IDR') {
      return `IDR ${price.toLocaleString('id-ID')}`;
    }
    return `${currency} ${price}`;
  };

  // Filter and search logic
  const filteredRequests = allRequests
    .filter(request => {
      const matchesSearch = request.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || request.status === filterStatus;
      const matchesType = filterType === 'All' || request.type === filterType;

      // Match by villa name in title or details
      let matchesVilla = filterVilla === 'all';
      if (!matchesVilla && filterVilla !== 'all') {
        const selectedVilla = villas.find(v => v.id === filterVilla);
        if (selectedVilla) {
          matchesVilla = request.title?.includes(selectedVilla.name) ||
                        request.details?.villa_name === selectedVilla.name;
        }
      }

      // Date filtering
      let matchesDate = true;
      if (filterDate !== 'all' && request.scheduled_at) {
        const requestDate = new Date(request.scheduled_at);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (filterDate) {
          case 'today':
            const todayEnd = new Date(today);
            todayEnd.setHours(23, 59, 59, 999);
            matchesDate = requestDate >= today && requestDate <= todayEnd;
            break;
          case 'tomorrow':
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowEnd = new Date(tomorrow);
            tomorrowEnd.setHours(23, 59, 59, 999);
            matchesDate = requestDate >= tomorrow && requestDate <= tomorrowEnd;
            break;
          case 'week':
            const weekEnd = new Date(today);
            weekEnd.setDate(weekEnd.getDate() + 7);
            matchesDate = requestDate >= today && requestDate <= weekEnd;
            break;
          case 'month':
            const monthEnd = new Date(today);
            monthEnd.setMonth(monthEnd.getMonth() + 1);
            matchesDate = requestDate >= today && requestDate <= monthEnd;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesType && matchesVilla && matchesDate;
    })
    .sort((a, b) => {
      // Sort by scheduled_at date (ascending - soonest first)
      const dateA = a.scheduled_at ? new Date(a.scheduled_at).getTime() : Infinity;
      const dateB = b.scheduled_at ? new Date(b.scheduled_at).getTime() : Infinity;
      return dateA - dateB;
    });

  // Calculate KPIs
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const kpis = {
    totalMonth: allRequests.filter(r => {
      const created = new Date(r.created_at);
      return created.getMonth() === currentMonth && created.getFullYear() === currentYear;
    }).length,
    pendingAction: allRequests.filter(r => r.status === 'confirmed').length,
    inProgress: allRequests.filter(r => ['assigned', 'in_progress'].includes(r.status)).length,
    completedMonth: allRequests.filter(r => {
      if (!r.completed_at) return false;
      const completed = new Date(r.completed_at);
      return completed.getMonth() === currentMonth && completed.getFullYear() === currentYear && r.status === 'completed';
    }).length
  };

  // Get unique types and statuses for filters
  const uniqueTypes = [...new Set(allRequests.map(r => r.type))];
  const uniqueStatuses = ['pending_confirmation', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'];

  return (
    <div className="w-full h-full bg-[#2a2f3a] p-4 relative overflow-auto">
      {/* Animated background blobs */}
      <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute w-72 h-72 bg-[#d85a2a]/5 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>

      {/* Content wrapper */}
      <div className="relative z-10 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 bg-[#1f2937]/95 backdrop-blur-sm rounded-xl hover:bg-orange-500 transition-all border border-[#d85a2a]/20"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Service Requests</h1>
            <p className="text-gray-400 mt-1">Manage guest service requests and assignments</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#d85a2a] hover:bg-[#c14e1f] text-white rounded-xl font-semibold transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Create Request
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* Unconfirmed */}
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl p-3 text-white shadow-lg">
          <div className="flex flex-col items-center justify-center mb-2">
            <div className="p-2 bg-white/20 rounded-lg mb-1">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold">
              {allRequests.filter(r => r.status === 'pending_confirmation').length}
            </div>
          </div>
          <h3 className="text-xs font-medium opacity-90 text-center">Unconfirmed</h3>
        </div>

        {/* Confirmed */}
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-3 text-white shadow-lg">
          <div className="flex flex-col items-center justify-center mb-2">
            <div className="p-2 bg-white/20 rounded-lg mb-1">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold">
              {allRequests.filter(r => r.status === 'confirmed').length}
            </div>
          </div>
          <h3 className="text-xs font-medium opacity-90 text-center">Confirmed</h3>
        </div>

        {/* In Progress */}
        <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl p-3 text-white shadow-lg">
          <div className="flex flex-col items-center justify-center mb-2">
            <div className="p-2 bg-white/20 rounded-lg mb-1">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold">
              {allRequests.filter(r => r.status === 'in_progress' || r.status === 'assigned').length}
            </div>
          </div>
          <h3 className="text-xs font-medium opacity-90 text-center">In Progress</h3>
        </div>

        {/* Completed */}
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-3 text-white shadow-lg">
          <div className="flex flex-col items-center justify-center mb-2">
            <div className="p-2 bg-white/20 rounded-lg mb-1">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold">
              {allRequests.filter(r => r.status === 'completed').length}
            </div>
          </div>
          <h3 className="text-xs font-medium opacity-90 text-center">Completed</h3>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-xl p-6 mb-6 border border-[#d85a2a]/20">
        {/* Top Row: Villa, Date, Status, Type + Search */}
        <div className="grid grid-cols-1 md:grid-cols-[180px_160px_160px_180px_1fr] gap-3">
          {/* Villa Filter */}
          <select
            value={filterVilla}
            onChange={(e) => setFilterVilla(e.target.value)}
            className="px-3 py-2.5 bg-[#2a2f3a] text-white rounded-xl text-sm border border-[#d85a2a]/30 focus:border-[#d85a2a] outline-none"
          >
            <option value="all">All Villas</option>
            {villas.map(villa => (
              <option key={villa.id} value={villa.id}>{villa.name}</option>
            ))}
          </select>

          {/* Date Filter */}
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2.5 bg-[#2a2f3a] text-white rounded-xl text-sm border border-[#d85a2a]/30 focus:border-[#d85a2a] outline-none"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="custom">Custom Range</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 bg-[#2a2f3a] text-white rounded-xl text-sm border border-[#d85a2a]/30 focus:border-[#d85a2a] outline-none"
          >
            <option value="All">All Status</option>
            <option value="pending_confirmation">Unconfirmed</option>
            <option value="confirmed">Confirmed</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2.5 bg-[#2a2f3a] text-white rounded-xl text-sm border border-[#d85a2a]/30 focus:border-[#d85a2a] outline-none"
          >
            <option value="All">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>
                {formatType(type)}
              </option>
            ))}
          </select>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by guest name or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-[#2a2f3a] border border-[#d85a2a]/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d85a2a]/50 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Service Requests Table */}
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-xl p-6 overflow-hidden border border-[#d85a2a]/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#d85a2a]/20">
                <th className="text-left py-3 px-3 text-gray-300 font-semibold text-xs min-w-[110px]">Status</th>
                <th className="text-left py-3 px-3 text-gray-300 font-semibold text-xs">Type</th>
                <th className="text-left py-3 px-3 text-gray-300 font-semibold text-xs">Title</th>
                <th className="text-left py-3 px-3 text-gray-300 font-semibold text-xs">Guest</th>
                <th className="text-left py-3 px-3 text-gray-300 font-semibold text-xs">Scheduled</th>
                <th className="text-left py-3 px-3 text-gray-300 font-semibold text-xs">Price</th>
                <th className="text-left py-3 px-3 text-gray-300 font-semibold text-xs">Assigned To</th>
                <th className="text-left py-3 px-3 text-gray-300 font-semibold text-xs">Created</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-gray-400">
                    Loading service requests...
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-gray-400">
                    No service requests found
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => {
                  const TypeIcon = getTypeIcon(request.type);
                  return (
                    <tr
                      key={request.id}
                      onClick={() => handleOpenDetail(request)}
                      className="border-b border-[#d85a2a]/10 hover:bg-[#d85a2a]/5 cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(request.status)}`}>
                          {formatStatus(request.status)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5 text-white">
                          <span className="text-base">{getTypeEmoji(request.type)}</span>
                          <span className="text-xs">{formatType(request.type)}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-white font-medium text-xs">{request.title}</td>
                      <td className="py-2.5 px-3">
                        <div className="text-white text-xs">{request.guest_name}</div>
                        <div className="text-white/60 text-[10px]">{request.guest_phone}</div>
                      </td>
                      <td className="py-2.5 px-3 text-white text-xs">{formatDateTime(request.scheduled_at)}</td>
                      <td className="py-2.5 px-3 text-white font-medium text-xs">{formatPrice(request.price, request.currency)}</td>
                      <td className="py-2.5 px-3">
                        {request.assigned_to ? (
                          <div className="text-white text-xs">{request.assigned_to}</div>
                        ) : (
                          <button className="px-2 py-0.5 bg-[#d85a2a]/20 hover:bg-[#d85a2a]/30 rounded-lg text-[#d85a2a] text-[10px] font-medium border border-[#d85a2a]/30 transition-colors">
                            Assign
                          </button>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-gray-400 text-[10px]">{formatRelativeTime(request.created_at)}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this service request?')) {
                              handleDeleteRequest(request.id);
                            }
                          }}
                          className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      </div>

      {/* Create Request Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => {setShowCreateForm(false); setCreateError('');}}>
          <div
            className="w-full max-w-2xl bg-[#2a2f3a] rounded-2xl overflow-hidden border border-[#d85a2a]/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#1f2937] p-6 border-b border-[#d85a2a]/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Create Service Request</h2>
                <button
                  onClick={() => {setShowCreateForm(false); setCreateError('');}}
                  className="p-2 bg-[#2a2f3a] hover:bg-[#d85a2a] rounded-xl transition-colors border border-[#d85a2a]/30"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Error Message */}
            {createError && (
              <div className="mx-6 mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                <p className="text-red-300 text-sm">{createError}</p>
              </div>
            )}

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                {/* Villa Selection */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Villa *</label>
                  <select
                    value={formData.villa_id}
                    onChange={(e) => setFormData({...formData, villa_id: e.target.value})}
                    className="w-full px-4 py-2.5 bg-[#1f2937] border border-[#d85a2a]/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#d85a2a]/50"
                  >
                    <option value="">Select a villa</option>
                    {villas.map(villa => (
                      <option key={villa.id} value={villa.id}>{villa.name}</option>
                    ))}
                  </select>
                </div>

                {/* Request Type */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Service Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2.5 bg-[#1f2937] border border-[#d85a2a]/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#d85a2a]/50"
                  >
                    <option value="">Select service type</option>
                    <option value="airport_transfer">✈️ Airport Transfer</option>
                    <option value="tour">🏔️ Tour</option>
                    <option value="spa">💆 Spa</option>
                    <option value="private_chef">👨‍🍳 Private Chef</option>
                    <option value="decoration">🎂 Decoration</option>
                    <option value="scooter_rental">🛵 Scooter Rental</option>
                    <option value="car_rental">🚗 Car Rental</option>
                    <option value="floating_breakfast">🥞 Floating Breakfast</option>
                    <option value="excursion">🌴 Excursion</option>
                    <option value="other">📋 Other</option>
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Airport Pickup - Ngurah Rai"
                    className="w-full px-4 py-2.5 bg-[#1f2937] border border-[#d85a2a]/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d85a2a]/50"
                  />
                </div>

                {/* Guest Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Guest Name *</label>
                    <input
                      type="text"
                      value={formData.guest_name}
                      onChange={(e) => setFormData({...formData, guest_name: e.target.value})}
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 bg-[#1f2937] border border-[#d85a2a]/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d85a2a]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Guest Phone *</label>
                    <input
                      type="tel"
                      value={formData.guest_phone}
                      onChange={(e) => setFormData({...formData, guest_phone: e.target.value})}
                      placeholder="+1 555-0101"
                      className="w-full px-4 py-2.5 bg-[#1f2937] border border-[#d85a2a]/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d85a2a]/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Guest Email</label>
                  <input
                    type="email"
                    value={formData.guest_email}
                    onChange={(e) => setFormData({...formData, guest_email: e.target.value})}
                    placeholder="guest@example.com"
                    className="w-full px-4 py-2.5 bg-[#1f2937] border border-[#d85a2a]/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d85a2a]/50"
                  />
                </div>

                {/* Schedule */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Scheduled Date *</label>
                    <input
                      type="date"
                      value={formData.scheduled_date}
                      onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})}
                      className="w-full px-4 py-2.5 bg-[#1f2937] border border-[#d85a2a]/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#d85a2a]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Scheduled Time *</label>
                    <input
                      type="time"
                      value={formData.scheduled_time}
                      onChange={(e) => setFormData({...formData, scheduled_time: e.target.value})}
                      className="w-full px-4 py-2.5 bg-[#1f2937] border border-[#d85a2a]/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#d85a2a]/50"
                    />
                  </div>
                </div>

                {/* Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Price *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="100"
                      className="w-full px-4 py-2.5 bg-[#1f2937] border border-[#d85a2a]/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d85a2a]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Currency *</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({...formData, currency: e.target.value})}
                      className="w-full px-4 py-2.5 bg-[#1f2937] border border-[#d85a2a]/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#d85a2a]/50"
                    >
                      <option value="USD">USD</option>
                      <option value="IDR">IDR</option>
                    </select>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Special Requests</label>
                  <textarea
                    value={formData.special_requests}
                    onChange={(e) => setFormData({...formData, special_requests: e.target.value})}
                    placeholder="Any special requests or notes..."
                    rows="3"
                    className="w-full px-4 py-2.5 bg-[#1f2937] border border-[#d85a2a]/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d85a2a]/50 resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="bg-[#1f2937] p-6 border-t border-[#d85a2a]/20 flex gap-3">
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setCreateError('');
                  setFormData({
                    villa_id: '',
                    type: '',
                    title: '',
                    guest_name: '',
                    guest_phone: '',
                    guest_email: '',
                    scheduled_date: '',
                    scheduled_time: '',
                    price: '',
                    currency: 'USD',
                    special_requests: ''
                  });
                }}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-[#2a2f3a] hover:bg-[#2a2f3a]/80 text-white rounded-xl font-semibold transition-all border border-[#d85a2a]/30 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRequest}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-[#d85a2a] hover:bg-[#c14e1f] text-white rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Panel - Right-aligned Modal */}
      {selectedRequest && editedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => {setSelectedRequest(null); setEditedRequest(null);}}>
          <div
            className="bg-[#2a2f3a] rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            style={{ marginLeft: '145px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#d85a2a] to-[#f5a524] p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Edit Service Request</h2>
                  <p className="text-white/90 mt-1">{getTypeEmoji(selectedRequest.type)} {formatType(selectedRequest.type)}</p>
                </div>
                <button
                  onClick={() => {setSelectedRequest(null); setEditedRequest(null);}}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-white mb-2">Title</label>
                  <input
                    type="text"
                    value={editedRequest.title}
                    onChange={(e) => setEditedRequest({...editedRequest, title: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1f2937] border border-[#d85a2a]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#d85a2a] focus:ring-2 focus:ring-[#d85a2a]/20"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Status</label>
                  <select
                    value={editedRequest.status}
                    onChange={(e) => setEditedRequest({...editedRequest, status: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1f2937] border border-[#d85a2a]/30 rounded-xl text-white focus:outline-none focus:border-[#d85a2a] focus:ring-2 focus:ring-[#d85a2a]/20"
                  >
                    <option value="pending_confirmation">Unconfirmed</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="assigned">Assigned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Service Type</label>
                  <input
                    type="text"
                    value={formatType(editedRequest.type)}
                    disabled
                    className="w-full px-4 py-3 bg-[#1f2937]/50 border border-[#d85a2a]/20 rounded-xl text-gray-400 cursor-not-allowed"
                  />
                </div>

                {/* Guest Name */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Guest Name</label>
                  <input
                    type="text"
                    value={editedRequest.guest_name}
                    onChange={(e) => setEditedRequest({...editedRequest, guest_name: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1f2937] border border-[#d85a2a]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#d85a2a] focus:ring-2 focus:ring-[#d85a2a]/20"
                  />
                </div>

                {/* Guest Phone */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Phone</label>
                  <input
                    type="text"
                    value={editedRequest.guest_phone}
                    onChange={(e) => setEditedRequest({...editedRequest, guest_phone: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1f2937] border border-[#d85a2a]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#d85a2a] focus:ring-2 focus:ring-[#d85a2a]/20"
                  />
                </div>

                {/* Guest Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-white mb-2">Email</label>
                  <input
                    type="email"
                    value={editedRequest.guest_email || ''}
                    onChange={(e) => setEditedRequest({...editedRequest, guest_email: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1f2937] border border-[#d85a2a]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#d85a2a] focus:ring-2 focus:ring-[#d85a2a]/20"
                  />
                </div>

                {/* Scheduled Date */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Scheduled Date</label>
                  <input
                    type="datetime-local"
                    value={editedRequest.scheduled_at ? new Date(editedRequest.scheduled_at).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setEditedRequest({...editedRequest, scheduled_at: e.target.value ? new Date(e.target.value).toISOString() : null})}
                    className="w-full px-4 py-3 bg-[#1f2937] border border-[#d85a2a]/30 rounded-xl text-white focus:outline-none focus:border-[#d85a2a] focus:ring-2 focus:ring-[#d85a2a]/20"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={editedRequest.duration_minutes || ''}
                    onChange={(e) => setEditedRequest({...editedRequest, duration_minutes: parseInt(e.target.value) || null})}
                    className="w-full px-4 py-3 bg-[#1f2937] border border-[#d85a2a]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#d85a2a] focus:ring-2 focus:ring-[#d85a2a]/20"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editedRequest.price || ''}
                    onChange={(e) => setEditedRequest({...editedRequest, price: parseFloat(e.target.value) || null})}
                    className="w-full px-4 py-3 bg-[#1f2937] border border-[#d85a2a]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#d85a2a] focus:ring-2 focus:ring-[#d85a2a]/20"
                  />
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Currency</label>
                  <select
                    value={editedRequest.currency}
                    onChange={(e) => setEditedRequest({...editedRequest, currency: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1f2937] border border-[#d85a2a]/30 rounded-xl text-white focus:outline-none focus:border-[#d85a2a] focus:ring-2 focus:ring-[#d85a2a]/20"
                  >
                    <option value="USD">USD</option>
                    <option value="IDR">IDR</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>

                {/* Assigned To */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Assigned To</label>
                  <input
                    type="text"
                    value={editedRequest.assigned_to || ''}
                    onChange={(e) => setEditedRequest({...editedRequest, assigned_to: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1f2937] border border-[#d85a2a]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#d85a2a] focus:ring-2 focus:ring-[#d85a2a]/20"
                    placeholder="Provider name"
                  />
                </div>

                {/* Assigned Phone */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Provider Phone</label>
                  <input
                    type="text"
                    value={editedRequest.assigned_phone || ''}
                    onChange={(e) => setEditedRequest({...editedRequest, assigned_phone: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1f2937] border border-[#d85a2a]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#d85a2a] focus:ring-2 focus:ring-[#d85a2a]/20"
                  />
                </div>

                {/* Special Requests */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-white mb-2">Special Requests</label>
                  <textarea
                    value={editedRequest.special_requests || ''}
                    onChange={(e) => setEditedRequest({...editedRequest, special_requests: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 bg-[#1f2937] border border-[#d85a2a]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#d85a2a] focus:ring-2 focus:ring-[#d85a2a]/20 resize-none"
                  />
                </div>

                {/* Internal Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-white mb-2">Internal Notes</label>
                  <textarea
                    value={editedRequest.internal_notes || ''}
                    onChange={(e) => setEditedRequest({...editedRequest, internal_notes: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 bg-[#1f2937] border border-[#d85a2a]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#d85a2a] focus:ring-2 focus:ring-[#d85a2a]/20 resize-none"
                  />
                </div>

              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-[#1f2937] p-6 border-t border-[#d85a2a]/20 flex gap-3 rounded-b-3xl">
              <button
                onClick={() => {setSelectedRequest(null); setEditedRequest(null);}}
                disabled={isSavingEdit}
                className="flex-1 px-6 py-3 bg-[#2a2f3a] hover:bg-[#2a2f3a]/80 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRequest}
                disabled={isSavingEdit}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] hover:from-[#c14e1f] hover:to-[#e09419] text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSavingEdit ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  'Confirm'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRequests;

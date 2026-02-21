import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Plus,
  Home,
  Star,
  DollarSign,
  X,
  LayoutGrid,
  List,
  MapPin,
  Bed,
  Bath,
  Users,
  TrendingUp,
  Image as ImageIcon,
  FileText,
  Shield,
  Wifi,
  Edit,
  Eye,
  CheckCircle,
  Clock,
  Camera,
  Upload,
  Save,
  Trash2
} from 'lucide-react';
import { StatCard } from '../common';
import { dataService } from '../../services/data';
import { supabaseService } from '../../services/supabase';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import n8nService from '../../services/n8n';

const Properties = ({ onBack }) => {
  const { user } = useAuth();
  const tenantId = user?.id;

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedTab, setSelectedTab] = useState('general');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDemoMessage, setShowDemoMessage] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, villaId: null, villaName: '' });
  const [successMessage, setSuccessMessage] = useState({ show: false, message: '' });
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: 'villa',
    bedrooms: '',
    price: '',
    photo: null
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
    location: '',
    bedrooms: '',
    baths: '',
    maxGuests: '',
    basePrice: '',
    photo: null
  });

  // Stats calculation state
  const [stats, setStats] = useState({
    totalRevenue: 0,
    avgOccupancy: 0,
    loading: true
  });
  const [dateRangePreset, setDateRangePreset] = useState('2026'); // '2025', '2026', '2025-2026', 'custom'
  const [dateRange, setDateRange] = useState({
    start: '2026-01-01',
    end: '2026-12-31'
  });
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  });

  // Mock Properties Data (expanded)
  const mockProperties = [
    {
      id: 1,
      name: "Nismara 2BR Villa",
      location: "Ubud, Bali",
      type: "Villa",
      beds: 2,
      baths: 2,
      maxGuests: 4,
      basePrice: 1300000,
      currency: "IDR",
      rating: 4.9,
      reviews: 87,
      status: "active",
      revenue: "12.5K",
      occupancy: 85,
      description: "Beautiful 2-bedroom villa in the heart of Ubud. Perfect for couples or small families seeking tranquility and authentic Balinese experience.",
      amenities: ["WiFi", "Pool", "Air Conditioning", "Kitchen", "Parking", "Garden", "Rice Field Views"],
      photos: ["/images/properties/nismara-2br.jpg", "/images/properties/nismara-2br.jpg", "/images/properties/nismara-2br.jpg", "/images/properties/nismara-2br.jpg"],
      checkInTime: "2:00 PM",
      checkOutTime: "12:00 PM",
      rules: ["No smoking", "No pets", "No parties", "Respect quiet hours 10 PM - 7 AM"],
      pricing: {
        lowSeason: 120,
        midSeason: 150,
        highSeason: 200,
        weeklyDiscount: 10,
        monthlyDiscount: 25
      }
    },
    {
      id: 2,
      name: "Graha Uma 1BR Villa",
      location: "Ubud, Bali",
      type: "Villa",
      beds: 1,
      baths: 1,
      maxGuests: 2,
      basePrice: 1800000,
      currency: "IDR",
      rating: 4.8,
      reviews: 64,
      status: "active",
      revenue: "8.2K",
      occupancy: 78,
      description: "Cozy 1-bedroom villa perfect for couples. Intimate and peaceful with traditional Balinese design and modern amenities.",
      amenities: ["WiFi", "Pool", "Air Conditioning", "Kitchen", "Parking", "Garden"],
      photos: ["/images/properties/graha-uma-1br.jpg", "/images/properties/graha-uma-1br.jpg", "/images/properties/graha-uma-1br.jpg", "/images/properties/graha-uma-1br.jpg"],
      checkInTime: "2:00 PM",
      checkOutTime: "12:00 PM",
      rules: ["No smoking", "No pets", "No parties", "Maximum 2 guests"],
      pricing: {
        lowSeason: 80,
        midSeason: 100,
        highSeason: 140,
        weeklyDiscount: 10,
        monthlyDiscount: 25
      }
    },
    {
      id: 3,
      name: "Nismara 1BR Villa Monthly",
      location: "Ubud, Bali",
      type: "Villa",
      beds: 1,
      baths: 1,
      maxGuests: 2,
      basePrice: 600000,
      currency: "IDR",
      rating: 4.9,
      reviews: 52,
      status: "active",
      revenue: "6.8K",
      occupancy: 92,
      description: "Charming 1-bedroom villa ideal for monthly stays. Perfect for digital nomads and long-term visitors seeking comfort and tranquility.",
      amenities: ["WiFi", "Air Conditioning", "Kitchen", "Parking", "Garden", "Workspace", "Laundry"],
      photos: ["/images/properties/nismara-1br-monthly.jpg", "/images/properties/nismara-1br-monthly.jpg", "/images/properties/nismara-1br-monthly.jpg", "/images/properties/nismara-1br-monthly.jpg"],
      checkInTime: "2:00 PM",
      checkOutTime: "12:00 PM",
      rules: ["No smoking", "No pets", "Monthly bookings preferred", "Respect local community"],
      pricing: {
        lowSeason: 75,
        midSeason: 90,
        highSeason: 120,
        weeklyDiscount: 15,
        monthlyDiscount: 30
      }
    }
  ];

  // Cargar properties reales de Supabase
  useEffect(() => {
    loadProperties();
    calculateStats();
  }, []);

  // Update dateRange when preset changes
  useEffect(() => {
    if (dateRangePreset === '2025') {
      setDateRange({ start: '2025-01-01', end: '2025-12-31' });
    } else if (dateRangePreset === '2026') {
      setDateRange({ start: '2026-01-01', end: '2026-12-31' });
    } else if (dateRangePreset === '2025-2026') {
      setDateRange({ start: '2025-01-01', end: '2026-12-31' });
    }
  }, [dateRangePreset]);

  // Recalcular stats cuando cambie el rango de fechas
  useEffect(() => {
    if (properties.length > 0) {
      calculateStats();
    }
  }, [dateRange, properties]);

  const calculateStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));

      // Obtener bookings en el rango de fechas (solo del usuario actual)
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('tenant_id', tenantId)
        .gte('check_in', dateRange.start)
        .lte('check_in', dateRange.end)
        .in('status', ['confirmed', 'checked_in', 'checked_out']);

      if (error) throw error;

      // Calcular total revenue (sumar total_price de todos los bookings confirmados)
      const totalRevenue = bookings.reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0);

      // Calcular occupancy promedio
      // Fórmula de Gita: días ocupados / (meses con bookings × 31 × villas con bookings)
      const monthsWithBookings = new Set();
      const villasWithBookings = new Set();
      let occupiedDays = 0;

      bookings.forEach(booking => {
        const checkIn = new Date(booking.check_in);
        const checkOut = new Date(booking.check_out);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        occupiedDays += nights;

        // Identificar mes único (YYYY-M)
        const monthYear = `${checkIn.getFullYear()}-${checkIn.getMonth()}`;
        monthsWithBookings.add(monthYear);

        // Identificar villa única
        if (booking.villa_id) {
          villasWithBookings.add(booking.villa_id);
        }
      });

      // Días disponibles = meses × 31 días × villas
      const numberOfMonths = monthsWithBookings.size;
      const numberOfVillas = villasWithBookings.size || 1;
      const totalAvailableDays = numberOfMonths * 31 * numberOfVillas;

      const avgOccupancy = totalAvailableDays > 0 ? (occupiedDays / totalAvailableDays) * 100 : 0;

      // DEBUG: Log cálculo de occupancy
      console.log('📊 OCCUPANCY CALCULATION DEBUG:');
      console.log('  Date Range:', dateRange.start, 'to', dateRange.end);
      console.log('  Total Bookings:', bookings.length);
      console.log('  Occupied Days:', occupiedDays);
      console.log('  Months with Bookings:', numberOfMonths, Array.from(monthsWithBookings));
      console.log('  Villas with Bookings:', numberOfVillas, Array.from(villasWithBookings));
      console.log('  Total Available Days:', totalAvailableDays, '=', numberOfMonths, '× 31 ×', numberOfVillas);
      console.log('  Occupancy:', avgOccupancy.toFixed(2) + '%');
      console.log('  Formula:', occupiedDays, '/', totalAvailableDays, '* 100');

      setStats({
        totalRevenue,
        avgOccupancy: Math.round(avgOccupancy),
        loading: false
      });

    } catch (error) {
      console.error('[Properties] Error calculating stats:', error);
      setStats({ totalRevenue: 0, avgOccupancy: 0, loading: false });
    }
  };

  const loadProperties = async () => {
    try {
      setLoading(true);
      const realVillas = await dataService.getVillas(tenantId);
      console.log('[Properties] Loaded villas from Supabase:', realVillas);

      // Si hay villas reales, usarlas. Si no, usar mock
      if (realVillas && realVillas.length > 0) {
        // Mapear datos de Supabase al formato del componente
        const mapped = realVillas.map(villa => ({
          id: villa.id,
          name: villa.name,
          location: 'Ubud, Bali, Indonesia',
          type: 'Villa',
          beds: villa.bedrooms || 0,
          baths: villa.bathrooms || 0,
          maxGuests: villa.max_guests || 0,
          basePrice: parseFloat(villa.base_price) || 0,
          currency: villa.currency || 'IDR',
          rating: 4.5,
          reviews: 0,
          status: villa.status || 'active',
          revenue: "0",
          occupancy: 0,
          description: villa.description || '',
          amenities: Array.isArray(villa.amenities) ? villa.amenities : [],
          photos: Array.isArray(villa.photos) && villa.photos.length > 0
            ? villa.photos
            : ["/images/properties/villa1.jpg"],
          checkInTime: "3:00 PM",
          checkOutTime: "11:00 AM",
          rules: ["No smoking", "Respect quiet hours"],
          pricing: {
            lowSeason: parseFloat(villa.base_price) || 0,
            midSeason: parseFloat(villa.base_price) || 0,
            highSeason: (parseFloat(villa.base_price) || 0) * 1.2,
            weeklyDiscount: 10,
            monthlyDiscount: 25
          }
        }));
        setProperties(mapped);
        console.log('[Properties] Using real villas:', mapped.length);
      } else {
        setProperties(mockProperties);
        console.log('[Properties] No real villas, using mock:', mockProperties.length);
      }
    } catch (error) {
      console.error('[Properties] Error loading:', error);
      setProperties(mockProperties); // Fallback a mock si falla
      console.log('[Properties] Fallback to mock properties:', mockProperties.length);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();

    try {
      // Upload photo first if exists
      let photoUrl = null;
      if (formData.photo) {
        setUploading(true);
        try {
          const fileExt = formData.photo.name.split('.').pop();
          const fileName = `new-${Date.now()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('villa-photos')
            .upload(filePath, formData.photo);

          if (uploadError) throw uploadError;

          const { data } = supabase.storage
            .from('villa-photos')
            .getPublicUrl(filePath);

          photoUrl = data.publicUrl;
        } catch (uploadError) {
          console.error('Error uploading photo:', uploadError);
          alert('Error uploading photo: ' + uploadError.message);
          setUploading(false);
          return;
        }
        setUploading(false);
      }

      // Get property_id from user's existing villas
      const userVillas = await dataService.getVillas(tenantId);
      let propertyId;

      if (userVillas && userVillas.length > 0) {
        // User has existing villas, use the same property_id
        propertyId = userVillas[0].property_id;
        console.log('[Properties] Using existing property_id:', propertyId);
      } else {
        // First villa for this user, use user_id as property_id
        propertyId = tenantId;
        console.log('[Properties] Creating first villa, using user_id as property_id:', propertyId);
      }

      setShowDemoMessage(true);

      // Create villa in Supabase villas table
      const newVilla = {
        property_id: propertyId,
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        description: `Beautiful ${formData.type} in ${formData.location}`,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: Math.max(1, Math.floor(parseInt(formData.bedrooms) / 2)),
        max_guests: parseInt(formData.bedrooms) * 2,
        base_price: parseFloat(formData.price),
        currency: 'IDR',
        status: 'active',
        amenities: [],
        photos: photoUrl ? [photoUrl] : []
      };

      console.log('[Properties] Creating villa:', newVilla);
      const createdVilla = await supabaseService.createProperty(newVilla);
      console.log('[Properties] Villa created:', createdVilla);

      // Trigger n8n workflow for new property
      console.log('[Properties] Triggering n8n workflow...');
      const workflowResult = await n8nService.onPropertyCreated(createdVilla);
      console.log('[Properties] n8n workflow result:', workflowResult);

      // Reload properties to show the new one
      await loadProperties();

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowDemoMessage(false);
        setShowAddModal(false);
        setFormData({
          name: '',
          location: '',
          type: 'villa',
          bedrooms: '',
          price: '',
          photo: null
        });
      }, 2000);
    } catch (error) {
      console.error('[Properties] Error creating property:', error);
      alert('Failed to create property. Check console for details.');
      setShowDemoMessage(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditClick = () => {
    if (selectedProperty) {
      setEditFormData({
        villaId: selectedProperty.id,
        name: selectedProperty.name || '',
        location: selectedProperty.location || '',
        bedrooms: selectedProperty.beds || '',
        baths: selectedProperty.baths || '',
        maxGuests: selectedProperty.maxGuests || '',
        basePrice: selectedProperty.basePrice || '',
        photo: null
      });
    }
    setSelectedProperty(null); // Close detail modal
    setShowEditModal(true); // Open edit modal
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${selectedProperty.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('villa-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('villa-photos')
        .getPublicUrl(filePath);

      // Update property with new photo
      const updatedPhotos = [data.publicUrl, ...(selectedProperty.photos || [])];

      // Update in Supabase
      await supabaseService.updateVilla(selectedProperty.id, {
        photos: updatedPhotos
      });

      // Update local state
      const updatedProperty = {
        ...selectedProperty,
        photos: updatedPhotos
      };
      setSelectedProperty(updatedProperty);

      // Update properties list
      setProperties(prev => prev.map(p =>
        p.id === selectedProperty.id ? updatedProperty : p
      ));
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error uploading photo: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async () => {
    try {
      // Update in Supabase (solo campos básicos por ahora)
      const villaId = editFormData.villaId || selectedProperty?.id;
      if (villaId) {
        await supabaseService.updateVilla(villaId, {
          name: editFormData.name,
          bedrooms: parseInt(editFormData.bedrooms),
          bathrooms: parseInt(editFormData.baths),
          max_guests: parseInt(editFormData.maxGuests),
          base_price: parseFloat(editFormData.basePrice)
        });
      }

      // Reload properties
      await loadProperties();

      setShowEditModal(false);
      setEditFormData({
        name: '',
        location: '',
        bedrooms: '',
        baths: '',
        maxGuests: '',
        basePrice: '',
        photo: null
      });
    } catch (error) {
      console.error('Error saving property:', error);
      alert('Error saving property: ' + error.message);
    }
  };

  const handleDeleteVilla = (villaId, villaName) => {
    setDeleteConfirm({ show: true, villaId, villaName });
  };

  const confirmDelete = async () => {
    try {
      await supabaseService.deleteVilla(deleteConfirm.villaId);
      await loadProperties();
      setDeleteConfirm({ show: false, villaId: null, villaName: '' });
      setSuccessMessage({ show: true, message: 'Villa deleted successfully!' });
      setTimeout(() => setSuccessMessage({ show: false, message: '' }), 3000);
    } catch (error) {
      console.error('Error deleting villa:', error);
      setDeleteConfirm({ show: false, villaId: null, villaName: '' });
      setSuccessMessage({ show: true, message: 'Error deleting villa: ' + error.message });
      setTimeout(() => setSuccessMessage({ show: false, message: '' }), 3000);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, villaId: null, villaName: '' });
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const formatPrice = (price, currency = 'IDR') => {
    if (currency === 'IDR') {
      return `Rp ${parseFloat(price).toLocaleString('id-ID')}`;
    } else {
      return `$${parseFloat(price).toLocaleString('en-US')}`;
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Home },
    { id: 'pricing', label: 'Tarifas', icon: DollarSign },
    { id: 'photos', label: 'Fotos', icon: ImageIcon },
    { id: 'rules', label: 'Reglas', icon: Shield },
    { id: 'amenities', label: 'Amenities', icon: Wifi }
  ];

  return (
    <div className="flex-1 h-screen bg-[#2a2f3a] p-4 sm:p-6 lg:p-8 pb-24 relative overflow-auto">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-[#d85a2a]/5 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <button onClick={onBack} className="lg:hidden self-start p-2 sm:p-3 bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl hover:bg-[#1f2937] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#d85a2a]/20">
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF8C42]" />
          </button>
          <div className="text-center flex-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-2xl">Properties</h2>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-[#1f2937]/95 backdrop-blur-sm text-[#FF8C42] rounded-2xl font-bold hover:bg-[#1f2937] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#d85a2a]/20"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" /> Add Property
          </button>
        </div>

        {/* 📅 Date Range Selector */}
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-[#d85a2a]/20 mb-4">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-[#FF8C42]">📅 Date Range</h3>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setDateRangePreset('2025')}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  dateRangePreset === '2025'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-[#FF8C42] border-2 border-gray-200 hover:border-orange-300'
                }`}
              >
                2025
              </button>
              <button
                onClick={() => setDateRangePreset('2026')}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  dateRangePreset === '2026'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-[#FF8C42] border-2 border-gray-200 hover:border-orange-300'
                }`}
              >
                2026
              </button>
              <button
                onClick={() => setDateRangePreset('2025-2026')}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  dateRangePreset === '2025-2026'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-[#FF8C42] border-2 border-gray-200 hover:border-orange-300'
                }`}
              >
                2025-2026
              </button>
            </div>

            {dateRangePreset === 'custom' && (
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={customDateRange.start}
                    onChange={(e) => {
                      setCustomDateRange(prev => ({ ...prev, start: e.target.value }));
                      setDateRange(prev => ({ ...prev, start: e.target.value }));
                    }}
                    className="w-full px-3 py-2 bg-[#2a2f3a] text-white border-2 border-[#d85a2a]/30 rounded-xl text-sm focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">End Date</label>
                  <input
                    type="date"
                    value={customDateRange.end}
                    onChange={(e) => {
                      setCustomDateRange(prev => ({ ...prev, end: e.target.value }));
                      setDateRange(prev => ({ ...prev, end: e.target.value }));
                    }}
                    className="w-full px-3 py-2 bg-[#2a2f3a] text-white border-2 border-[#d85a2a]/30 rounded-xl text-sm focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => {
                    if (customDateRange.start && customDateRange.end) {
                      setDateRange(customDateRange);
                    }
                  }}
                  className="self-end px-4 py-2 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all"
                >
                  📅 Apply Custom
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <StatCard icon={Home} label="Total Properties" value={properties.length.toString()} gradient="from-orange-500 to-orange-600" />
          <StatCard icon={Star} label="Avg Rating" value="4.8" gradient="from-orange-500 to-orange-600" />
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={stats.loading ? '...' : `Rp ${(stats.totalRevenue / 1000000).toFixed(1)}M`}
            gradient="from-orange-500 to-orange-600"
          />
          <StatCard
            icon={TrendingUp}
            label="Avg Occupancy"
            value={stats.loading ? '...' : `${stats.avgOccupancy}%`}
            gradient="from-orange-500 to-orange-600"
          />
        </div>

        {/* View Toggle */}
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-3 sm:p-4 shadow-lg border-2 border-[#d85a2a]/20 mb-3 sm:mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
            <h3 className="text-lg sm:text-xl font-black text-[#FF8C42]">My Properties</h3>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-[#FF8C42] border-2 border-gray-200 hover:border-orange-300'
                }`}
              >
                <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base font-bold transition-all ${
                  viewMode === 'table'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-[#FF8C42] border-2 border-gray-200 hover:border-orange-300'
                }`}
              >
                <List className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-white mt-4">Loading properties...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && properties.length === 0 && (
          <div className="text-center py-12 bg-[#d85a2a]/10 rounded-2xl">
            <p className="text-white text-lg">No properties found</p>
          </div>
        )}

        {/* Grid View */}
        {!loading && viewMode === 'grid' && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {properties.map(property => (
              <div
                key={property.id}
                className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border-2 border-[#d85a2a]/20 hover:shadow-orange-200 transition-all cursor-pointer"
                onClick={() => setSelectedProperty(property)}
              >
                {/* Property Image */}
                <div className="h-48 bg-gradient-to-br from-[#1f2937] to-[#374151] overflow-hidden">
                  <img
                    src={property.photos[0]}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Property Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-xl font-black text-[#FF8C42] mb-1">{property.name}</h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {property.location}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusBadge(property.status)}`}>
                      {property.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                    <div className="flex items-center gap-1 text-[#FF8C42] font-medium">
                      <Bed className="w-4 h-4" />
                      {property.beds} beds
                    </div>
                    <div className="flex items-center gap-1 text-[#FF8C42] font-medium">
                      <Bath className="w-4 h-4" />
                      {property.baths} baths
                    </div>
                    <div className="flex items-center gap-1 text-[#FF8C42] font-medium">
                      <Users className="w-4 h-4" />
                      {property.maxGuests} guests
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Base Price</p>
                      <p className="text-lg font-black text-[#FF8C42] whitespace-nowrap">{formatPrice(property.basePrice, property.currency)}<span className="text-xs font-medium">/night</span></p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-[#FF8C42] font-bold mb-1">
                        <Star className="w-4 h-4 fill-orange-500" />
                        {property.rating}
                      </div>
                      <p className="text-xs text-gray-500">{property.reviews} reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table View */}
        {!loading && viewMode === 'table' && properties.length > 0 && (
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-[#d85a2a]/20 overflow-hidden">
            {/* MOBILE VERSION: Cards (< 768px) */}
            <div className="block md:hidden p-4 space-y-4">
              {properties.map(property => (
                <div
                  key={property.id}
                  className="bg-[#2a2f3a] rounded-xl p-4 border-l-4 border-orange-500 shadow-lg"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg">{property.name}</h3>
                      <p className="text-orange-400 text-sm mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {property.location}
                      </p>
                    </div>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusBadge(property.status)}`}>
                      {property.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-gray-500 text-xs">Type</p>
                      <p className="text-white text-sm font-medium">{property.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Price</p>
                      <p className="text-green-400 text-sm font-bold">${property.basePrice}/night</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Capacity</p>
                      <p className="text-white text-sm font-medium">{property.beds} beds · {property.baths} baths</p>
                      <p className="text-gray-400 text-xs">Max {property.maxGuests} guests</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Rating</p>
                      <p className="text-orange-400 text-sm font-medium flex items-center gap-1">
                        <Star className="w-3 h-3 fill-orange-500" />
                        {property.rating}
                      </p>
                      <p className="text-gray-400 text-xs">{property.reviews} reviews</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProperty(property)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              ))}
            </div>

            {/* DESKTOP VERSION: Table (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full table-fixed">
                <thead className="bg-gradient-to-r from-[#1f2937] to-[#374151]">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-black text-[#FF8C42] uppercase w-[20%]">Property</th>
                    <th className="px-3 py-3 text-left text-xs font-black text-[#FF8C42] uppercase w-[18%]">Location</th>
                    <th className="px-3 py-3 text-left text-xs font-black text-[#FF8C42] uppercase w-[15%]">Capacity</th>
                    <th className="px-3 py-3 text-left text-xs font-black text-[#FF8C42] uppercase w-[17%]">Price</th>
                    <th className="px-3 py-3 text-left text-xs font-black text-[#FF8C42] uppercase w-[12%]">Status</th>
                    <th className="px-3 py-3 text-left text-xs font-black text-[#FF8C42] uppercase w-[18%]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-gray-200">
                  {properties.map(property => (
                    <tr key={property.id} className="hover:bg-[#d85a2a]/5 transition-colors">
                      <td className="px-3 py-3">
                        <div className="font-bold text-[#FF8C42] truncate">{property.name}</div>
                        <div className="text-xs text-gray-500">{property.type}</div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1 text-[#FF8C42] font-medium text-sm">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">Ubud, Bali</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-sm text-[#FF8C42] font-medium">
                          <div>{property.beds}BR · {property.baths}BA</div>
                          <div className="text-xs text-gray-500">{property.maxGuests} guests</div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-bold text-[#FF8C42] text-sm whitespace-nowrap">{formatPrice(property.basePrice, property.currency)}</div>
                        <div className="text-xs text-gray-500">/night</div>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold border-2 ${getStatusBadge(property.status)}`}>
                          {property.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedProperty(property)}
                            className="flex-1 px-2 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors shadow-md"
                          >
                            <Eye className="w-4 h-4 inline mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteVilla(property.id, property.name)}
                            className="px-2 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-colors shadow-md"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setSelectedProperty(null)}>
          <div className="bg-[#1f2937] rounded-3xl shadow-2xl max-w-4xl w-full my-8" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 sm:p-6 rounded-t-3xl">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-1">{selectedProperty.name}</h3>
                  <p className="text-sm sm:text-base text-orange-100 font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    {selectedProperty.location}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="p-2 bg-[#d85a2a]/10 hover:bg-white/30 rounded-xl transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b-2 border-gray-200 px-4 sm:px-6">
              <div className="flex gap-1 sm:gap-2 overflow-x-auto">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-bold transition-all flex items-center gap-1 sm:gap-2 border-b-4 whitespace-nowrap ${
                        selectedTab === tab.id
                          ? 'text-[#FF8C42] border-orange-500'
                          : 'text-gray-400 border-transparent hover:text-[#FF8C42]'
                      }`}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
              {/* GENERAL TAB */}
              {selectedTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-black text-[#FF8C42] mb-3">Description</h4>
                    <p className="text-gray-600 leading-relaxed">{selectedProperty.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border-2 border-gray-200 rounded-2xl p-4">
                      <p className="text-xs font-bold text-gray-500 mb-1">Property Type</p>
                      <p className="text-[#FF8C42] font-bold text-lg">{selectedProperty.type}</p>
                    </div>
                    <div className="border-2 border-gray-200 rounded-2xl p-4">
                      <p className="text-xs font-bold text-gray-500 mb-1">Status</p>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusBadge(selectedProperty.status)}`}>
                        {selectedProperty.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="border-2 border-gray-200 rounded-2xl p-4 text-center">
                      <Bed className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <p className="text-2xl font-black text-[#FF8C42]">{selectedProperty.beds}</p>
                      <p className="text-xs text-gray-500">Bedrooms</p>
                    </div>
                    <div className="border-2 border-gray-200 rounded-2xl p-4 text-center">
                      <Bath className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <p className="text-2xl font-black text-[#FF8C42]">{selectedProperty.baths}</p>
                      <p className="text-xs text-gray-500">Bathrooms</p>
                    </div>
                    <div className="border-2 border-gray-200 rounded-2xl p-4 text-center">
                      <Users className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <p className="text-2xl font-black text-[#FF8C42]">{selectedProperty.maxGuests}</p>
                      <p className="text-xs text-gray-500">Max Guests</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="border-2 border-gray-200 rounded-2xl p-4">
                      <p className="text-xs font-bold text-gray-500 mb-1">Rating</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-orange-500 text-orange-500" />
                        <span className="text-2xl font-black text-[#FF8C42]">{selectedProperty.rating}</span>
                        <span className="text-sm text-gray-500">({selectedProperty.reviews})</span>
                      </div>
                    </div>
                    <div className="border-2 border-gray-200 rounded-2xl p-4">
                      <p className="text-xs font-bold text-gray-500 mb-1">Revenue (MTD)</p>
                      <p className="text-2xl font-black text-[#FF8C42]">${selectedProperty.revenue}</p>
                    </div>
                    <div className="border-2 border-gray-200 rounded-2xl p-4">
                      <p className="text-xs font-bold text-gray-500 mb-1">Occupancy</p>
                      <p className="text-2xl font-black text-[#FF8C42]">{selectedProperty.occupancy}%</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PRICING TAB */}
              {selectedTab === 'pricing' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-black text-[#FF8C42] mb-4">Seasonal Pricing</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="border-2 border-gray-200 rounded-2xl p-4">
                        <p className="text-xs font-bold text-gray-500 mb-2">Low Season</p>
                        <p className="text-3xl font-black text-[#FF8C42]">${selectedProperty.pricing.lowSeason}</p>
                        <p className="text-xs text-gray-500 mt-1">per night</p>
                      </div>
                      <div className="border-2 border-[#d85a2a]/30 bg-[#1f2937] rounded-2xl p-4">
                        <p className="text-xs font-bold text-[#FF8C42] mb-2">Mid Season (Current)</p>
                        <p className="text-3xl font-black text-[#FF8C42]">${selectedProperty.pricing.midSeason}</p>
                        <p className="text-xs text-gray-500 mt-1">per night</p>
                      </div>
                      <div className="border-2 border-gray-200 rounded-2xl p-4">
                        <p className="text-xs font-bold text-gray-500 mb-2">High Season</p>
                        <p className="text-3xl font-black text-[#FF8C42]">${selectedProperty.pricing.highSeason}</p>
                        <p className="text-xs text-gray-500 mt-1">per night</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-[#FF8C42] mb-4">Discounts</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="border-2 border-gray-200 rounded-2xl p-4">
                        <p className="text-sm font-bold text-gray-500 mb-2">Weekly Discount</p>
                        <p className="text-3xl font-black text-green-600">{selectedProperty.pricing.weeklyDiscount}%</p>
                        <p className="text-xs text-gray-500 mt-1">7+ nights</p>
                      </div>
                      <div className="border-2 border-gray-200 rounded-2xl p-4">
                        <p className="text-sm font-bold text-gray-500 mb-2">Monthly Discount</p>
                        <p className="text-3xl font-black text-green-600">{selectedProperty.pricing.monthlyDiscount}%</p>
                        <p className="text-xs text-gray-500 mt-1">30+ nights</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                    <p className="text-sm font-bold text-blue-600 mb-2">💡 Pricing Tip</p>
                    <p className="text-sm text-gray-600">Consider adjusting prices during local holidays and events for optimal revenue.</p>
                  </div>
                </div>
              )}

              {/* PHOTOS TAB */}
              {selectedTab === 'photos' && (
                <div className="space-y-6">
                  <h4 className="text-xl font-black text-[#FF8C42]">Photo Gallery</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedProperty.photos.map((photo, index) => (
                      <div
                        key={index}
                        className="aspect-video bg-gradient-to-br from-[#1f2937] to-[#374151] rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-orange-300 transition-all cursor-pointer"
                      >
                        <img
                          src={photo}
                          alt={`${selectedProperty.name} - Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <label className="w-full py-4 bg-[#2a2f3a] border-2 border-[#d85a2a]/30-300 rounded-2xl font-bold text-[#FF8C42] hover:border-orange-300 transition-all flex items-center justify-center gap-2 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      disabled={uploading}
                    />
                    {uploading ? (
                      <>
                        <Upload className="w-5 h-5 animate-bounce" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5" />
                        Upload New Photo
                      </>
                    )}
                  </label>
                </div>
              )}

              {/* RULES TAB */}
              {selectedTab === 'rules' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-black text-[#FF8C42] mb-4">Check-in / Check-out</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="border-2 border-gray-200 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <p className="font-bold text-gray-700">Check-in Time</p>
                        </div>
                        <p className="text-2xl font-black text-[#FF8C42]">{selectedProperty.checkInTime}</p>
                      </div>
                      <div className="border-2 border-gray-200 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-orange-500" />
                          <p className="font-bold text-gray-700">Check-out Time</p>
                        </div>
                        <p className="text-2xl font-black text-[#FF8C42]">{selectedProperty.checkOutTime}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-[#FF8C42] mb-4">House Rules</h4>
                    <div className="space-y-3">
                      {selectedProperty.rules.map((rule, index) => (
                        <div key={index} className="flex items-start gap-3 bg-gray-50 border-2 border-gray-200 rounded-2xl p-4">
                          <Shield className="w-5 h-5 text-orange-500 mt-0.5" />
                          <p className="text-gray-700 font-medium">{rule}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* AMENITIES TAB */}
              {selectedTab === 'amenities' && (
                <div className="space-y-6">
                  <h4 className="text-xl font-black text-[#FF8C42]">Amenities & Services</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedProperty.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-gradient-to-br from-[#1f2937] to-[#374151] border-2 border-gray-200 rounded-2xl p-4 hover:border-orange-300 transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-[#FF8C42]">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t-2 border-gray-200 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleEditClick}
                className="flex-1 px-4 sm:px-6 py-3 bg-orange-500 text-white rounded-2xl text-sm sm:text-base font-bold hover:bg-orange-600 transition-colors shadow-md"
              >
                <Edit className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                Edit Property
              </button>
              <button
                onClick={() => setSelectedProperty(null)}
                className="px-4 sm:px-6 py-3 bg-[#2a2f3a] border-2 border-[#d85a2a]/30-300 text-[#FF8C42] rounded-2xl text-sm sm:text-base font-bold hover:border-orange-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Property Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setShowAddModal(false)}>
          <div className="bg-[#1f2937] rounded-3xl shadow-2xl max-w-2xl w-full my-8" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-white">Add New Property</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 bg-[#d85a2a]/10 hover:bg-white/30 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleAddProperty} className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                {/* Property Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Property Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Villa Sunset Paradise"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none font-medium"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Seminyak, Bali"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none font-medium"
                  />
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Property Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none font-medium"
                  >
                    <option value="villa">Villa</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="cabin">Cabin</option>
                    <option value="bungalow">Bungalow</option>
                  </select>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Number of Bedrooms *
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    required
                    min="1"
                    placeholder="e.g., 4"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none font-medium"
                  />
                </div>

                {/* Base Price */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Base Price per Night (IDR) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="1"
                    placeholder="e.g., 1200000"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none font-medium"
                  />
                </div>

                {/* Villa Photo */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Villa Photo (Optional)
                  </label>
                  <label className="w-full py-4 bg-gray-50 border-2 border-gray-300 rounded-2xl font-bold text-gray-700 hover:border-orange-500 transition-all flex items-center justify-center gap-2 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData(prev => ({
                            ...prev,
                            photo: file
                          }));
                        }
                      }}
                      className="hidden"
                      disabled={uploading}
                    />
                    {uploading ? (
                      <>
                        <Upload className="w-5 h-5 animate-bounce" />
                        Uploading...
                      </>
                    ) : formData.photo ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        {formData.photo.name}
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5" />
                        Choose Photo
                      </>
                    )}
                  </label>
                </div>

                {/* Success Message */}
                {showDemoMessage && (
                  <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 animate-fade-in">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-green-800 mb-1">Property Created!</p>
                        <p className="text-sm text-green-700">
                          Your property has been successfully added and is now active.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-colors shadow-md"
                  disabled={showDemoMessage}
                >
                  <Plus className="w-5 h-5 inline mr-2" />
                  {showDemoMessage ? 'Property Added!' : 'Add Property'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 bg-[#2a2f3a] border-2 border-[#d85a2a]/30-300 text-[#FF8C42] rounded-2xl font-bold hover:border-orange-300 transition-colors"
                  disabled={showDemoMessage}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Property Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setShowEditModal(false)}>
          <div className="bg-[#1f2937] rounded-3xl shadow-2xl max-w-4xl w-full my-8" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-white">Edit Property</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 bg-[#d85a2a]/10 hover:bg-white/30 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Property Name */}
                <div>
                  <label className="block text-sm font-bold text-[#FF8C42] mb-2">
                    Property Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditFormChange}
                    className="w-full px-4 py-3 bg-[#2a2f3a] text-white border-2 border-[#d85a2a]/30 rounded-xl focus:border-orange-500 focus:outline-none font-medium"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-bold text-[#FF8C42] mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={editFormData.location}
                    onChange={handleEditFormChange}
                    className="w-full px-4 py-3 bg-[#2a2f3a] text-white border-2 border-[#d85a2a]/30 rounded-xl focus:border-orange-500 focus:outline-none font-medium"
                  />
                </div>

                {/* Property Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#FF8C42] mb-2">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={editFormData.bedrooms}
                      onChange={handleEditFormChange}
                      min="1"
                      className="w-full px-4 py-3 bg-[#2a2f3a] text-white border-2 border-[#d85a2a]/30 rounded-xl focus:border-orange-500 focus:outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#FF8C42] mb-2">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      name="baths"
                      value={editFormData.baths}
                      onChange={handleEditFormChange}
                      min="1"
                      className="w-full px-4 py-3 bg-[#2a2f3a] text-white border-2 border-[#d85a2a]/30 rounded-xl focus:border-orange-500 focus:outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#FF8C42] mb-2">
                      Max Guests
                    </label>
                    <input
                      type="number"
                      name="maxGuests"
                      value={editFormData.maxGuests}
                      onChange={handleEditFormChange}
                      min="1"
                      className="w-full px-4 py-3 bg-[#2a2f3a] text-white border-2 border-[#d85a2a]/30 rounded-xl focus:border-orange-500 focus:outline-none font-medium"
                    />
                  </div>
                </div>

                {/* Base Price */}
                <div>
                  <label className="block text-sm font-bold text-[#FF8C42] mb-2">
                    Base Price per Night (IDR)
                  </label>
                  <input
                    type="number"
                    name="basePrice"
                    value={editFormData.basePrice}
                    onChange={handleEditFormChange}
                    min="1"
                    className="w-full px-4 py-3 bg-[#2a2f3a] text-white border-2 border-[#d85a2a]/30 rounded-xl focus:border-orange-500 focus:outline-none font-medium"
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-bold text-[#FF8C42] mb-2">
                    Villa Photo
                  </label>
                  <label className="w-full py-4 bg-[#2a2f3a] border-2 border-[#d85a2a]/30 rounded-2xl font-bold text-[#FF8C42] hover:border-orange-300 transition-all flex items-center justify-center gap-2 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        setUploading(true);
                        try {
                          const fileExt = file.name.split('.').pop();
                          const fileName = `${editFormData.villaId}-${Date.now()}.${fileExt}`;
                          const filePath = `${fileName}`;

                          const { error: uploadError } = await supabase.storage
                            .from('villa-photos')
                            .upload(filePath, file);

                          if (uploadError) throw uploadError;

                          const { data } = supabase.storage
                            .from('villa-photos')
                            .getPublicUrl(filePath);

                          // Update form data with new photo URL
                          setEditFormData(prev => ({
                            ...prev,
                            photo: data.publicUrl
                          }));
                        } catch (error) {
                          console.error('Error uploading photo:', error);
                          alert('Error uploading photo: ' + error.message);
                        } finally {
                          setUploading(false);
                        }
                      }}
                      className="hidden"
                      disabled={uploading}
                    />
                    {uploading ? (
                      <>
                        <Upload className="w-5 h-5 animate-bounce" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5" />
                        {editFormData.photo ? 'Change Photo' : 'Upload Photo'}
                      </>
                    )}
                  </label>
                  {editFormData.photo && (
                    <div className="mt-3">
                      <img src={editFormData.photo} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t-2 border-gray-200 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-colors shadow-md"
                disabled={uploading}
              >
                <Save className="w-5 h-5 inline mr-2" />
                Save Changes
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-3 bg-[#2a2f3a] border-2 border-[#d85a2a]/30 text-[#FF8C42] rounded-2xl font-bold hover:border-orange-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={cancelDelete}>
          <div className="bg-[#1f2937] rounded-3xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-white text-center mb-2">Delete Villa</h3>
              <p className="text-gray-300 text-center mb-6">
                Are you sure you want to delete <span className="font-bold text-orange-400">"{deleteConfirm.villaName}"</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-6 py-3 bg-[#2a2f3a] border-2 border-gray-600 text-gray-300 rounded-2xl font-bold hover:border-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-colors shadow-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message Modal */}
      {successMessage.show && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
          <div className="bg-[#1f2937] border-2 border-orange-500 rounded-3xl shadow-2xl max-w-md w-full pointer-events-auto animate-bounce">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-orange-500/20 rounded-full">
                <CheckCircle className="w-8 h-8 text-orange-500" />
              </div>
              <p className="text-white text-center text-lg font-bold">
                {successMessage.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;

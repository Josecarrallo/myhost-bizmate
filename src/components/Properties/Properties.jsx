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
  Trash2
} from 'lucide-react';
import { StatCard } from '../common';
import { dataService } from '../../services/data';
import { supabaseService } from '../../services/supabase';
import n8nService from '../../services/n8n';

const Properties = ({ onBack }) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedTab, setSelectedTab] = useState('general');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDemoMessage, setShowDemoMessage] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingVillaId, setEditingVillaId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [villaToDelete, setVillaToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: 'villa',
    bedrooms: '',
    price: '',
    photo: null
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
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const realVillas = await dataService.getVillas();
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
      if (editMode) {
        // UPDATE existing villa
        let photoUrl = null;
        if (formData.photo) {
          setUploading(true);
          photoUrl = await supabaseService.uploadVillaPhoto(formData.photo, editingVillaId);
          setUploading(false);
        }

        const updates = {
          name: formData.name,
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: Math.max(1, Math.floor(parseInt(formData.bedrooms) / 2)),
          max_guests: parseInt(formData.bedrooms) * 2,
          base_price: parseFloat(formData.price),
          ...(photoUrl && { photos: [photoUrl] })
        };

        console.log('[Properties] Updating villa:', editingVillaId, updates);
        await supabaseService.updateVilla(editingVillaId, updates);
        console.log('[Properties] Villa updated successfully');

        // Reload properties
        await loadProperties();

        // Close modal and reset
        setShowAddModal(false);
        setEditMode(false);
        setEditingVillaId(null);
        setFormData({
          name: '',
          location: '',
          type: 'villa',
          bedrooms: '',
          price: '',
          photo: null
        });

      } else {
        // CREATE new villa
        const baseSlug = formData.name.toLowerCase().replace(/\s+/g, '-');
        const timestamp = Date.now();
        const uniqueSlug = `${baseSlug}-${timestamp}`;

        let newPhotoUrl = null;
        if (formData.photo) {
          setUploading(true);
          newPhotoUrl = await supabaseService.uploadVillaPhoto(formData.photo, uniqueSlug);
          setUploading(false);
        }

        const newVilla = {
          name: formData.name,
          slug: uniqueSlug,
          description: `Beautiful ${formData.type} in ${formData.location}`,
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: Math.max(1, Math.floor(parseInt(formData.bedrooms) / 2)),
          max_guests: parseInt(formData.bedrooms) * 2,
          base_price: parseFloat(formData.price),
          currency: 'IDR',
          status: 'active',
          amenities: [],
          photos: newPhotoUrl ? [newPhotoUrl] : [],
          property_id: '18711359-1378-4d12-9ea6-fb31c0b1bac2'
        };

        console.log('[Properties] Creating villa:', newVilla);
        const createdVilla = await supabaseService.createProperty(newVilla);
        console.log('[Properties] Villa created:', createdVilla);

        // Reload properties to show the new one
        await loadProperties();

        // Close modal and reset
        setShowAddModal(false);
        setFormData({
          name: '',
          location: '',
          type: 'villa',
          bedrooms: '',
          price: '',
          photo: null
        });
      }
    } catch (error) {
      console.error('[Properties] Error:', error);
      setUploading(false);
      alert(`Failed to ${editMode ? 'update' : 'create'} property: ${error.message}`);
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
            onClick={() => {
              setFormData({
                name: '',
                location: '',
                type: 'villa',
                bedrooms: '',
                price: ''
              });
              setEditMode(false);
              setEditingVillaId(null);
              setShowAddModal(true);
            }}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-[#1f2937]/95 backdrop-blur-sm text-[#FF8C42] rounded-2xl font-bold hover:bg-[#1f2937] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#d85a2a]/20"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" /> Add Property
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <StatCard icon={Home} label="Total Properties" value={properties.length.toString()} gradient="from-orange-500 to-orange-600" />
          <StatCard icon={Star} label="Avg Rating" value="4.8" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={DollarSign} label="Total Revenue" value="$71.7K" trend="+18%" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={TrendingUp} label="Avg Occupancy" value="85%" trend="+5%" gradient="from-orange-500 to-orange-600" />
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
                      <p className="text-xl font-black text-[#FF8C42]">{formatPrice(property.basePrice, property.currency)}<span className="text-xs font-medium">/night</span></p>
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
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#1f2937] to-[#374151]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black text-[#FF8C42] uppercase">Property</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-[#FF8C42] uppercase">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-[#FF8C42] uppercase">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-[#FF8C42] uppercase">Capacity</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-[#FF8C42] uppercase">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-[#FF8C42] uppercase">Rating</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-[#FF8C42] uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-[#FF8C42] uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-gray-200">
                  {properties.map(property => (
                    <tr key={property.id} className="hover:bg-[#d85a2a]/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#FF8C42]">{property.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-[#FF8C42] font-medium">
                          <MapPin className="w-4 h-4" />
                          {property.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[#FF8C42] font-medium">{property.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#FF8C42] font-medium">
                          <div>{property.beds} beds · {property.baths} baths</div>
                          <div className="text-xs text-gray-500">Max {property.maxGuests} guests</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-black text-[#FF8C42]">{formatPrice(property.basePrice, property.currency)}/night</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-[#FF8C42] font-bold">
                          <Star className="w-4 h-4 fill-orange-500" />
                          {property.rating}
                        </div>
                        <div className="text-xs text-gray-500">{property.reviews} reviews</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusBadge(property.status)}`}>
                          {property.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedProperty(property)}
                            className="px-3 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors shadow-md"
                          >
                            <Eye className="w-4 h-4 inline mr-1" />
                            View
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
                  <button className="w-full py-4 bg-[#2a2f3a] border-2 border-[#d85a2a]/30-300 rounded-2xl font-bold text-[#FF8C42] hover:border-orange-300 transition-all flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add More Photos
                  </button>
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
                onClick={() => {
                  setEditMode(true);
                  setEditingVillaId(selectedProperty.id);
                  setFormData({
                    name: selectedProperty.name,
                    location: selectedProperty.location,
                    type: selectedProperty.type,
                    bedrooms: selectedProperty.beds.toString(),
                    price: selectedProperty.basePrice.toString(),
                    photo: null,
                    currentPhotoUrl: selectedProperty.photos?.[0] || null
                  });
                  setSelectedProperty(null);
                  setShowAddModal(true);
                }}
                className="flex-1 px-4 sm:px-6 py-3 bg-orange-500 text-white rounded-2xl text-sm sm:text-base font-bold hover:bg-orange-600 transition-colors shadow-md">
                <Edit className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                Edit Property
              </button>
              <button
                onClick={() => {
                  setVillaToDelete(selectedProperty);
                  setShowDeleteConfirm(true);
                }}
                className="px-4 sm:px-6 py-3 bg-red-500 text-white rounded-2xl text-sm sm:text-base font-bold hover:bg-red-600 transition-colors shadow-md">
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                Delete
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
          <div className="bg-[#1f2937] rounded-3xl shadow-2xl max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-white">{editMode ? 'Edit Property' : 'Add New Property'}</h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditMode(false);
                    setEditingVillaId(null);
                  }}
                  className="p-2 bg-[#d85a2a]/10 hover:bg-white/30 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleAddProperty} className="p-6">
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
                    Base Price per Night (USD) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="1"
                    placeholder="e.g., 280"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none font-medium"
                  />
                </div>

                {/* Property Photo */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Property Photo
                  </label>
                  {formData.currentPhotoUrl && !formData.photo && (
                    <div className="mb-2">
                      <img
                        src={formData.currentPhotoUrl}
                        alt="Current photo"
                        className="w-full h-32 object-cover rounded-xl border-2 border-orange-200"
                      />
                      <p className="text-xs text-gray-500 mt-1">Current photo — select a new one to replace it</p>
                    </div>
                  )}
                  {formData.photo && (
                    <div className="mb-2">
                      <img
                        src={URL.createObjectURL(formData.photo)}
                        alt="New photo preview"
                        className="w-full h-32 object-cover rounded-xl border-2 border-orange-400"
                      />
                      <p className="text-xs text-orange-600 mt-1 font-medium">New photo selected — will be uploaded on save</p>
                    </div>
                  )}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) setFormData(prev => ({ ...prev, photo: file }));
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none font-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 disabled:opacity-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG (max 5MB)</p>
                </div>

                {/* Demo Message */}
                {showDemoMessage && (
                  <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 animate-fade-in">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-blue-800 mb-1">Demo Mode</p>
                        <p className="text-sm text-blue-700">
                          This would create a new property in the production version. Form data has been validated successfully.
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
                  className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-colors shadow-md disabled:opacity-60"
                  disabled={showDemoMessage || uploading}
                >
                  {uploading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 align-middle" />
                      Uploading photo...
                    </>
                  ) : editMode ? (
                    <>
                      <Edit className="w-5 h-5 inline mr-2" />
                      Update Property
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 inline mr-2" />
                      {showDemoMessage ? 'Property Added!' : 'Add Property'}
                    </>
                  )}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && villaToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">Delete Property</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <span className="font-bold">"{villaToDelete.name}"</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={async () => {
                  try {
                    await supabaseService.deleteVilla(villaToDelete.id);
                    await loadProperties();
                    setSelectedProperty(null);
                    setShowDeleteConfirm(false);
                    setVillaToDelete(null);
                  } catch (error) {
                    alert(`Failed to delete: ${error.message}`);
                  }
                }}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-colors">
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setVillaToDelete(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-2xl font-bold hover:bg-gray-300 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;

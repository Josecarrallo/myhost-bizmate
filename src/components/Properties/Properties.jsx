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
  Clock
} from 'lucide-react';
import { StatCard } from '../common';
import { dataService } from '../../services/data';

const Properties = ({ onBack }) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedTab, setSelectedTab] = useState('general');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDemoMessage, setShowDemoMessage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: 'villa',
    bedrooms: '',
    price: ''
  });

  // Mock Properties Data (expanded)
  const mockProperties = [
    {
      id: 1,
      name: "Villa Sunset Paradise",
      location: "Seminyak, Bali",
      type: "Villa",
      beds: 4,
      baths: 3,
      maxGuests: 8,
      basePrice: 280,
      rating: 4.9,
      reviews: 124,
      status: "active",
      revenue: "12.5K",
      occupancy: 87,
      description: "Luxury beachfront villa with stunning sunset views. Features modern Balinese architecture, private pool, and direct beach access.",
      amenities: ["WiFi", "Pool", "Beach Access", "Air Conditioning", "Kitchen", "Parking", "Security", "Garden"],
      photos: ["🏖️", "🌅", "🏊", "🛏️"],
      checkInTime: "3:00 PM",
      checkOutTime: "11:00 AM",
      rules: ["No smoking", "No pets", "No parties", "Respect quiet hours 10 PM - 7 AM"],
      pricing: {
        lowSeason: 250,
        midSeason: 280,
        highSeason: 350,
        weeklyDiscount: 10,
        monthlyDiscount: 25
      }
    },
    {
      id: 2,
      name: "Beach House Deluxe",
      location: "Canggu, Bali",
      type: "House",
      beds: 5,
      baths: 4,
      maxGuests: 10,
      basePrice: 320,
      rating: 4.8,
      reviews: 98,
      status: "active",
      revenue: "15.8K",
      occupancy: 92,
      description: "Spacious beach house perfect for large groups. Modern amenities with traditional Balinese charm.",
      amenities: ["WiFi", "Pool", "Beach Access", "Air Conditioning", "Kitchen", "BBQ", "Parking", "Gym"],
      photos: ["🏠", "🌊", "🏊", "🍽️"],
      checkInTime: "2:00 PM",
      checkOutTime: "12:00 PM",
      rules: ["No smoking indoors", "Pets allowed with deposit", "No parties", "Maximum 10 guests"],
      pricing: {
        lowSeason: 280,
        midSeason: 320,
        highSeason: 420,
        weeklyDiscount: 12,
        monthlyDiscount: 30
      }
    },
    {
      id: 3,
      name: "Mountain View Cabin",
      location: "Ubud, Bali",
      type: "Cabin",
      beds: 3,
      baths: 2,
      maxGuests: 6,
      basePrice: 180,
      rating: 4.7,
      reviews: 76,
      status: "active",
      revenue: "8.2K",
      occupancy: 78,
      description: "Peaceful mountain retreat surrounded by rice terraces. Perfect for nature lovers seeking tranquility.",
      amenities: ["WiFi", "Air Conditioning", "Kitchen", "Parking", "Garden", "Yoga Space", "Hiking Trails"],
      photos: ["⛰️", "🌾", "🧘", "☕"],
      checkInTime: "3:00 PM",
      checkOutTime: "11:00 AM",
      rules: ["No smoking", "No pets", "Eco-friendly practices encouraged", "Respect nature"],
      pricing: {
        lowSeason: 150,
        midSeason: 180,
        highSeason: 230,
        weeklyDiscount: 15,
        monthlyDiscount: 28
      }
    },
    {
      id: 4,
      name: "City Loft Modern",
      location: "Sanur, Bali",
      type: "Apartment",
      beds: 2,
      baths: 2,
      maxGuests: 4,
      basePrice: 150,
      rating: 4.6,
      reviews: 89,
      status: "active",
      revenue: "9.5K",
      occupancy: 85,
      description: "Contemporary loft apartment in the heart of Sanur. Walking distance to beach and restaurants.",
      amenities: ["WiFi", "Air Conditioning", "Kitchen", "Balcony", "Parking", "Laundry", "Smart TV"],
      photos: ["🏢", "🛋️", "🍳", "🌇"],
      checkInTime: "2:00 PM",
      checkOutTime: "12:00 PM",
      rules: ["No smoking", "No pets", "Keep noise levels reasonable", "Maximum 4 guests"],
      pricing: {
        lowSeason: 120,
        midSeason: 150,
        highSeason: 200,
        weeklyDiscount: 8,
        monthlyDiscount: 20
      }
    },
    {
      id: 5,
      name: "Ocean Front Villa",
      location: "Nusa Dua, Bali",
      type: "Villa",
      beds: 6,
      baths: 5,
      maxGuests: 12,
      basePrice: 450,
      rating: 4.9,
      reviews: 145,
      status: "active",
      revenue: "18.9K",
      occupancy: 94,
      description: "Exclusive oceanfront villa with infinity pool. Premium amenities and butler service available.",
      amenities: ["WiFi", "Infinity Pool", "Beach Access", "Air Conditioning", "Gourmet Kitchen", "Butler Service", "Spa Room", "Gym", "Parking"],
      photos: ["🏝️", "♾️", "🍾", "💆"],
      checkInTime: "3:00 PM",
      checkOutTime: "12:00 PM",
      rules: ["No smoking indoors", "No pets", "Events allowed with permission", "Respect staff"],
      pricing: {
        lowSeason: 400,
        midSeason: 450,
        highSeason: 600,
        weeklyDiscount: 10,
        monthlyDiscount: 25
      }
    },
    {
      id: 6,
      name: "Jungle Hideaway",
      location: "Tegallalang, Bali",
      type: "Villa",
      beds: 3,
      baths: 2,
      maxGuests: 6,
      basePrice: 220,
      rating: 4.8,
      reviews: 67,
      status: "maintenance",
      revenue: "6.8K",
      occupancy: 72,
      description: "Unique treehouse-style villa nestled in the jungle. Eco-friendly design with natural materials.",
      amenities: ["WiFi", "Air Conditioning", "Kitchen", "Outdoor Shower", "Garden", "Swing", "Parking"],
      photos: ["🌳", "🏡", "🦜", "🌺"],
      checkInTime: "3:00 PM",
      checkOutTime: "11:00 AM",
      rules: ["No smoking", "No pets", "Eco-conscious living", "Wildlife friendly"],
      pricing: {
        lowSeason: 180,
        midSeason: 220,
        highSeason: 280,
        weeklyDiscount: 12,
        monthlyDiscount: 22
      }
    }
  ];

  // Cargar properties reales de Supabase
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);

    // Usar mock properties siempre (fix temporal para ver UI)
    setTimeout(() => {
      setProperties(mockProperties);
      console.log('Using mock properties:', mockProperties.length);
      setLoading(false);
    }, 500);

    /* // Versión con Supabase (comentada temporalmente)
    try {
      setLoading(true);
      const realProperties = await dataService.getProperties();
      console.log('Properties loaded from Supabase:', realProperties);

      // Si hay properties reales, usarlas. Si no, usar mock
      if (realProperties && realProperties.length > 0) {
        // Mapear datos de Supabase al formato del componente
        const mapped = realProperties.map(prop => ({
          id: prop.id,
          name: prop.name,
          location: `${prop.city}, ${prop.country}`,
          type: "Property",
          beds: prop.bedrooms,
          baths: prop.bathrooms,
          maxGuests: prop.max_guests,
          basePrice: parseFloat(prop.base_price),
          rating: 4.5,
          reviews: 0,
          status: prop.status,
          revenue: "0",
          occupancy: 0,
          description: prop.description,
          amenities: prop.amenities || [],
          photos: ["🏠"],
          checkInTime: "3:00 PM",
          checkOutTime: "11:00 AM",
          rules: [],
          pricing: {
            lowSeason: parseFloat(prop.base_price),
            midSeason: parseFloat(prop.base_price),
            highSeason: parseFloat(prop.base_price) * 1.2,
            weeklyDiscount: 10,
            monthlyDiscount: 25
          }
        }));
        setProperties(mapped);
        console.log('Using real properties:', mapped.length);
      } else {
        setProperties(mockProperties);
        console.log('Using mock properties:', mockProperties.length);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      setProperties(mockProperties); // Fallback a mock si falla
      console.log('Fallback to mock properties:', mockProperties.length);
    } finally {
      setLoading(false);
    }
    */
  };

  const handleAddProperty = (e) => {
    e.preventDefault();
    setShowDemoMessage(true);
    setTimeout(() => {
      setShowDemoMessage(false);
      setShowAddModal(false);
      setFormData({
        name: '',
        location: '',
        type: 'villa',
        bedrooms: '',
        price: ''
      });
    }, 3000);
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

  const tabs = [
    { id: 'general', label: 'General', icon: Home },
    { id: 'pricing', label: 'Tarifas', icon: DollarSign },
    { id: 'photos', label: 'Fotos', icon: ImageIcon },
    { id: 'rules', label: 'Reglas', icon: Shield },
    { id: 'amenities', label: 'Amenities', icon: Wifi }
  ];

  return (
    <div className="flex-1 h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-4 sm:p-6 lg:p-8 pb-24 relative overflow-auto">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-orange-200/30 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <button onClick={onBack} className="lg:hidden self-start p-2 sm:p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
          </button>
          <div className="text-center flex-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-2xl">Properties</h2>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-white/95 backdrop-blur-sm text-orange-600 rounded-2xl font-bold hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50"
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
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 sm:p-4 shadow-lg border-2 border-white/50 mb-3 sm:mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
            <h3 className="text-lg sm:text-xl font-black text-orange-600">My Properties</h3>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-orange-600 border-2 border-gray-200 hover:border-orange-300'
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
                    : 'bg-white text-orange-600 border-2 border-gray-200 hover:border-orange-300'
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
          <div className="text-center py-12 bg-white/20 rounded-2xl">
            <p className="text-white text-lg">No properties found</p>
          </div>
        )}

        {/* Grid View */}
        {!loading && viewMode === 'grid' && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {properties.map(property => (
              <div
                key={property.id}
                className="bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border-2 border-white/50 hover:shadow-orange-200 transition-all cursor-pointer"
                onClick={() => setSelectedProperty(property)}
              >
                {/* Property Image */}
                <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-6xl">
                  {property.photos[0]}
                </div>

                {/* Property Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-xl font-black text-orange-600 mb-1">{property.name}</h4>
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
                    <div className="flex items-center gap-1 text-orange-600 font-medium">
                      <Bed className="w-4 h-4" />
                      {property.beds} beds
                    </div>
                    <div className="flex items-center gap-1 text-orange-600 font-medium">
                      <Bath className="w-4 h-4" />
                      {property.baths} baths
                    </div>
                    <div className="flex items-center gap-1 text-orange-600 font-medium">
                      <Users className="w-4 h-4" />
                      {property.maxGuests} guests
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Base Price</p>
                      <p className="text-2xl font-black text-orange-600">${property.basePrice}<span className="text-sm font-medium">/night</span></p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-orange-600 font-bold mb-1">
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
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-orange-50 to-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black text-orange-600 uppercase">Property</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-orange-600 uppercase">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-orange-600 uppercase">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-orange-600 uppercase">Capacity</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-orange-600 uppercase">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-orange-600 uppercase">Rating</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-orange-600 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-orange-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-gray-200">
                  {properties.map(property => (
                    <tr key={property.id} className="hover:bg-orange-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-orange-600">{property.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-orange-600 font-medium">
                          <MapPin className="w-4 h-4" />
                          {property.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-orange-600 font-medium">{property.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-orange-600 font-medium">
                          <div>{property.beds} beds · {property.baths} baths</div>
                          <div className="text-xs text-gray-500">Max {property.maxGuests} guests</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-black text-orange-600">${property.basePrice}/night</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-orange-600 font-bold">
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
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full my-8" onClick={(e) => e.stopPropagation()}>
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
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors flex-shrink-0"
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
                          ? 'text-orange-600 border-orange-500'
                          : 'text-gray-400 border-transparent hover:text-orange-600'
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
                    <h4 className="text-xl font-black text-orange-600 mb-3">Description</h4>
                    <p className="text-gray-600 leading-relaxed">{selectedProperty.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border-2 border-gray-200 rounded-2xl p-4">
                      <p className="text-xs font-bold text-gray-500 mb-1">Property Type</p>
                      <p className="text-orange-600 font-bold text-lg">{selectedProperty.type}</p>
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
                      <p className="text-2xl font-black text-orange-600">{selectedProperty.beds}</p>
                      <p className="text-xs text-gray-500">Bedrooms</p>
                    </div>
                    <div className="border-2 border-gray-200 rounded-2xl p-4 text-center">
                      <Bath className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <p className="text-2xl font-black text-orange-600">{selectedProperty.baths}</p>
                      <p className="text-xs text-gray-500">Bathrooms</p>
                    </div>
                    <div className="border-2 border-gray-200 rounded-2xl p-4 text-center">
                      <Users className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <p className="text-2xl font-black text-orange-600">{selectedProperty.maxGuests}</p>
                      <p className="text-xs text-gray-500">Max Guests</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="border-2 border-gray-200 rounded-2xl p-4">
                      <p className="text-xs font-bold text-gray-500 mb-1">Rating</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-orange-500 text-orange-500" />
                        <span className="text-2xl font-black text-orange-600">{selectedProperty.rating}</span>
                        <span className="text-sm text-gray-500">({selectedProperty.reviews})</span>
                      </div>
                    </div>
                    <div className="border-2 border-gray-200 rounded-2xl p-4">
                      <p className="text-xs font-bold text-gray-500 mb-1">Revenue (MTD)</p>
                      <p className="text-2xl font-black text-orange-600">${selectedProperty.revenue}</p>
                    </div>
                    <div className="border-2 border-gray-200 rounded-2xl p-4">
                      <p className="text-xs font-bold text-gray-500 mb-1">Occupancy</p>
                      <p className="text-2xl font-black text-orange-600">{selectedProperty.occupancy}%</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PRICING TAB */}
              {selectedTab === 'pricing' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-black text-orange-600 mb-4">Seasonal Pricing</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="border-2 border-gray-200 rounded-2xl p-4">
                        <p className="text-xs font-bold text-gray-500 mb-2">Low Season</p>
                        <p className="text-3xl font-black text-orange-600">${selectedProperty.pricing.lowSeason}</p>
                        <p className="text-xs text-gray-500 mt-1">per night</p>
                      </div>
                      <div className="border-2 border-orange-300 bg-orange-50 rounded-2xl p-4">
                        <p className="text-xs font-bold text-orange-600 mb-2">Mid Season (Current)</p>
                        <p className="text-3xl font-black text-orange-600">${selectedProperty.pricing.midSeason}</p>
                        <p className="text-xs text-gray-500 mt-1">per night</p>
                      </div>
                      <div className="border-2 border-gray-200 rounded-2xl p-4">
                        <p className="text-xs font-bold text-gray-500 mb-2">High Season</p>
                        <p className="text-3xl font-black text-orange-600">${selectedProperty.pricing.highSeason}</p>
                        <p className="text-xs text-gray-500 mt-1">per night</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-orange-600 mb-4">Discounts</h4>
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
                  <h4 className="text-xl font-black text-orange-600">Photo Gallery</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedProperty.photos.map((photo, index) => (
                      <div
                        key={index}
                        className="aspect-video bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center text-8xl border-2 border-gray-200 hover:border-orange-300 transition-all cursor-pointer"
                      >
                        {photo}
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-4 bg-white border-2 border-gray-300 rounded-2xl font-bold text-orange-600 hover:border-orange-300 transition-all flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add More Photos
                  </button>
                </div>
              )}

              {/* RULES TAB */}
              {selectedTab === 'rules' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-black text-orange-600 mb-4">Check-in / Check-out</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="border-2 border-gray-200 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <p className="font-bold text-gray-700">Check-in Time</p>
                        </div>
                        <p className="text-2xl font-black text-orange-600">{selectedProperty.checkInTime}</p>
                      </div>
                      <div className="border-2 border-gray-200 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-orange-500" />
                          <p className="font-bold text-gray-700">Check-out Time</p>
                        </div>
                        <p className="text-2xl font-black text-orange-600">{selectedProperty.checkOutTime}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-orange-600 mb-4">House Rules</h4>
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
                  <h4 className="text-xl font-black text-orange-600">Amenities & Services</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedProperty.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-gradient-to-br from-orange-50 to-white border-2 border-gray-200 rounded-2xl p-4 hover:border-orange-300 transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-orange-600">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t-2 border-gray-200 flex flex-col sm:flex-row gap-3">
              <button className="flex-1 px-4 sm:px-6 py-3 bg-orange-500 text-white rounded-2xl text-sm sm:text-base font-bold hover:bg-orange-600 transition-colors shadow-md">
                <Edit className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                Edit Property
              </button>
              <button
                onClick={() => setSelectedProperty(null)}
                className="px-4 sm:px-6 py-3 bg-white border-2 border-gray-300 text-orange-600 rounded-2xl text-sm sm:text-base font-bold hover:border-orange-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Property Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-white">Add New Property</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
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
                  className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-colors shadow-md"
                  disabled={showDemoMessage}
                >
                  <Plus className="w-5 h-5 inline mr-2" />
                  {showDemoMessage ? 'Property Added!' : 'Add Property'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 bg-white border-2 border-gray-300 text-orange-600 rounded-2xl font-bold hover:border-orange-300 transition-colors"
                  disabled={showDemoMessage}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;

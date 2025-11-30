import React, { useState } from 'react';
import {
  ChevronLeft,
  Plus,
  Home,
  Star,
  DollarSign,
  X
} from 'lucide-react';
import { StatCard, PropertyCard } from '../common';

const Properties = ({ onBack }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: '',
    location: '',
    type: 'villa',
    description: '',
    beds: 1,
    baths: 1,
    max_guests: 2,
    base_price: 0,
    currency: 'USD'
  });

  const handleAddProperty = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/properties', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0',
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(newProperty)
      });

      if (response.ok) {
        alert('✅ Propiedad añadida correctamente!');
        setShowAddForm(false);
        setNewProperty({ name: '', location: '', type: 'villa', description: '', beds: 1, baths: 1, max_guests: 2, base_price: 0, currency: 'USD' });
      } else {
        const error = await response.json();
        alert('❌ Error: ' + (error.message || 'No se pudo añadir'));
      }
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-4 pb-24 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-orange-200/30 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <ChevronLeft className="w-6 h-6 text-orange-600" />
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl mb-1">MY HOST</h2>
            <p className="text-2xl md:text-3xl font-bold text-orange-100 drop-shadow-xl">BizMate</p>
          </div>
          <button onClick={() => setShowAddForm(true)} className="px-6 py-3 bg-white/95 backdrop-blur-sm text-orange-600 rounded-2xl font-bold hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <Plus className="w-5 h-5 inline mr-2" /> Add Property
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard icon={Home} label="Total Properties" value="12" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={Star} label="Avg Rating" value="4.8" gradient="from-orange-500 to-orange-600" />
          <StatCard icon={DollarSign} label="Total Revenue" value="$124.5K" trend="+18%" gradient="from-orange-500 to-orange-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PropertyCard name="Villa Sunset" location="Bali, Indonesia" type="Villa" beds={4} baths={3} occupancy={8} revenue="12.5K" rating={4.9} image="🏖️" />
          <PropertyCard name="Beach House" location="Phuket, Thailand" type="House" beds={5} baths={4} occupancy={10} revenue="15.8K" rating={4.8} image="🏠" />
          <PropertyCard name="Mountain Cabin" location="Chiang Mai, Thailand" type="Cabin" beds={3} baths={2} occupancy={6} revenue="8.2K" rating={4.7} image="⛰️" />
          <PropertyCard name="City Loft" location="Jakarta, Indonesia" type="Apartment" beds={2} baths={2} occupancy={4} revenue="9.5K" rating={4.6} image="🏢" />
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Add Property</h3>
              <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProperty} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={newProperty.name}
                  onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                  placeholder="Villa Sunset"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={newProperty.location}
                  onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                  placeholder="Bali, Indonesia"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                <select
                  value={newProperty.type}
                  onChange={(e) => setNewProperty({ ...newProperty, type: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                >
                  <option value="villa">Villa</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Beds</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newProperty.beds}
                    onChange={(e) => setNewProperty({ ...newProperty, beds: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Baths</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newProperty.baths}
                    onChange={(e) => setNewProperty({ ...newProperty, baths: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Guests</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newProperty.max_guests}
                    onChange={(e) => setNewProperty({ ...newProperty, max_guests: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Base Price ($)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newProperty.base_price}
                  onChange={(e) => setNewProperty({ ...newProperty, base_price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                  placeholder="150"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600"
                >
                  Add Property
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

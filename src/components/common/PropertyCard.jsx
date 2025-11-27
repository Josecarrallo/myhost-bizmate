import React from 'react';
import { MapPin, Star, ArrowRight } from 'lucide-react';

const PropertyCard = ({ name, location, type, beds, baths, occupancy, revenue, rating, image }) => (
  <div className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-orange-200 transition-all hover:shadow-xl">
    <div className="h-48 bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white text-6xl font-black">
      {image}
    </div>
    <div className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 text-lg mb-1">{name}</h4>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {location}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-bold text-gray-900">{rating}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b-2 border-gray-100">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Beds</p>
          <p className="font-bold text-gray-900">{beds}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Baths</p>
          <p className="font-bold text-gray-900">{baths}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Guests</p>
          <p className="font-bold text-gray-900">{occupancy}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1">Monthly Revenue</p>
          <p className="text-2xl font-black text-orange-500">${revenue}</p>
        </div>
        <button className="p-2.5 bg-orange-50 text-orange-500 rounded-xl hover:bg-orange-100 transition-colors">
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
);

export default PropertyCard;

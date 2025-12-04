import React from 'react';
import { MapPin, Users, Edit } from 'lucide-react';

const BookingCard = ({ guest, property, checkIn, checkOut, status, guests: guestCount, revenue }) => (
  <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 hover:border-orange-200 transition-all hover:shadow-lg">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h4 className="font-bold text-orange-600 text-lg mb-1">{guest}</h4>
        <p className="text-gray-500 text-sm flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> {property}
        </p>
      </div>
      <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${status === 'Confirmed' ? 'bg-green-100 text-green-700' : status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
        {status}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="bg-gray-50 rounded-xl p-3">
        <p className="text-xs text-gray-500 mb-1">Check-in</p>
        <p className="font-bold text-orange-600">{checkIn}</p>
      </div>
      <div className="bg-gray-50 rounded-xl p-3">
        <p className="text-xs text-gray-500 mb-1">Check-out</p>
        <p className="font-bold text-orange-600">{checkOut}</p>
      </div>
    </div>
    <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-gray-600">
          <Users className="w-4 h-4" />
          <span className="text-sm font-bold">{guestCount}</span>
        </div>
        <div className="text-xl font-black text-orange-600">${revenue}</div>
      </div>
      <button className="p-2.5 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-colors">
        <Edit className="w-5 h-5" />
      </button>
    </div>
  </div>
);

export default BookingCard;

import React from 'react';
import { MapPin, Eye } from 'lucide-react';

const PaymentCard = ({ guest, property, amount, status, date, method }) => (
  <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 hover:border-orange-200 transition-all hover:shadow-lg">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h4 className="font-bold text-orange-600 text-lg mb-1">{guest}</h4>
        <p className="text-gray-500 text-sm flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> {property}
        </p>
      </div>
      <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${status === 'Paid' ? 'bg-green-100 text-green-700' : status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
        {status}
      </span>
    </div>
    <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
      <div>
        <p className="text-2xl font-black text-orange-600">${amount}</p>
        <p className="text-xs text-gray-500 mt-1">{method} • {date}</p>
      </div>
      <button className="p-2.5 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-colors">
        <Eye className="w-5 h-5" />
      </button>
    </div>
  </div>
);

export default PaymentCard;

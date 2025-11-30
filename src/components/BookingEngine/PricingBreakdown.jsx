import React from 'react';

const PricingBreakdown = ({ pricing, loading }) => {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-orange-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-orange-100 rounded"></div>
          <div className="h-4 bg-orange-100 rounded"></div>
          <div className="h-4 bg-orange-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!pricing) return null;

  return (
    <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-6 border-2 border-orange-200">
      <h3 className="text-xl font-black text-orange-600 mb-4">Desglose de Precio</h3>

      <div className="space-y-3">
        {/* Base Price */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-orange-600 font-semibold">
              ${pricing.price_per_night} × {pricing.nights} {pricing.nights === 1 ? 'noche' : 'noches'}
            </span>
            {pricing.is_high_season && (
              <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-lg">
                ⭐ Temporada Alta
              </span>
            )}
          </div>
          <span className="text-orange-600 font-bold">${pricing.base_price.toFixed(2)}</span>
        </div>

        {/* Guest Surcharge */}
        {pricing.guest_surcharge > 0 && (
          <div className="flex justify-between items-center text-gray-600">
            <span className="font-semibold">Huéspedes extras</span>
            <span className="font-bold">${pricing.guest_surcharge.toFixed(2)}</span>
          </div>
        )}

        {/* Cleaning Fee */}
        <div className="flex justify-between items-center text-gray-600">
          <span className="font-semibold">Limpieza</span>
          <span className="font-bold">${pricing.cleaning_fee.toFixed(2)}</span>
        </div>

        {/* Service Fee */}
        <div className="flex justify-between items-center text-gray-600">
          <span className="font-semibold">Service fee (15%)</span>
          <span className="font-bold">${pricing.service_fee.toFixed(2)}</span>
        </div>

        {/* Total */}
        <div className="border-t-2 border-orange-300 pt-3 mt-3">
          <div className="flex justify-between items-center">
            <span className="text-xl font-black text-orange-600">Total</span>
            <span className="text-3xl font-black text-orange-600">
              ${pricing.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingBreakdown;

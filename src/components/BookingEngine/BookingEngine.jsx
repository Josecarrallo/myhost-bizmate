import React, { useState, useEffect } from 'react';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import { supabaseService } from '../../services/supabase';
import PricingBreakdown from './PricingBreakdown';

const BookingEngineWidget = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    property: '',
    guests: 2,
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    specialRequests: ''
  });

  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [pricing, setPricing] = useState(null);
  const [loadingPricing, setLoadingPricing] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState(null);

  // Load properties from Supabase
  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await supabaseService.getProperties();
        setProperties(data);
      } catch (err) {
        console.error('Error loading properties:', err);
        setError('Failed to load properties');
      } finally {
        setLoadingProperties(false);
      }
    };
    loadProperties();
  }, []);

  // Check availability when dates and property are selected
  useEffect(() => {
    const checkAvailability = async () => {
      if (!bookingData.property || !bookingData.checkIn || !bookingData.checkOut) {
        setAvailabilityChecked(false);
        setIsAvailable(false);
        return;
      }

      try {
        const available = await supabaseService.checkAvailability(
          bookingData.property,
          bookingData.checkIn,
          bookingData.checkOut
        );
        setIsAvailable(available);
        setAvailabilityChecked(true);
      } catch (err) {
        console.error('Error checking availability:', err);
        setError('Failed to check availability');
        setIsAvailable(false);
      }
    };
    checkAvailability();
  }, [bookingData.property, bookingData.checkIn, bookingData.checkOut]);

  // Calculate pricing when property, dates, or guests change
  useEffect(() => {
    const calculatePrice = async () => {
      if (!bookingData.property || !bookingData.checkIn || !bookingData.checkOut || !isAvailable) {
        setPricing(null);
        return;
      }

      setLoadingPricing(true);
      try {
        const priceData = await supabaseService.calculateBookingPrice(
          bookingData.property,
          bookingData.checkIn,
          bookingData.checkOut,
          bookingData.guests
        );
        setPricing(priceData);
      } catch (err) {
        console.error('Error calculating price:', err);
        setError('Failed to calculate price');
      } finally {
        setLoadingPricing(false);
      }
    };
    calculatePrice();
  }, [bookingData.property, bookingData.checkIn, bookingData.checkOut, bookingData.guests, isAvailable]);

  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const start = new Date(bookingData.checkIn);
    const end = new Date(bookingData.checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMinCheckoutDate = () => {
    if (!bookingData.checkIn) return getTodayDate();
    const checkIn = new Date(bookingData.checkIn);
    checkIn.setDate(checkIn.getDate() + 1);
    return checkIn.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex flex-col">
      <div className="bg-white border-b-2 border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-500 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
            Booking Engine
          </h1>
          <div className="w-20"></div>
        </div>

        <div className="max-w-4xl mx-auto mt-6">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Dates' },
              { num: 2, label: 'Property' },
              { num: 3, label: 'Details' },
              { num: 4, label: 'Payment' },
              { num: 5, label: 'Widget' }
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= s.num
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {s.num}
                  </div>
                  <span className={`text-xs mt-2 font-semibold ${step >= s.num ? 'text-orange-500' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < 4 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${step > s.num ? 'bg-gradient-to-r from-orange-500 to-pink-500' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          {step === 1 && (
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-xl">
              <h2 className="text-3xl font-black mb-2 text-orange-600">Select Your Dates</h2>
              <p className="text-gray-600 mb-8">Choose your check-in and check-out dates</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-orange-600 mb-2">Check-in Date</label>
                  <input
                    type="date"
                    min={getTodayDate()}
                    value={bookingData.checkIn}
                    onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg font-semibold text-orange-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-orange-600 mb-2">Check-out Date</label>
                  <input
                    type="date"
                    min={getMinCheckoutDate()}
                    value={bookingData.checkOut}
                    onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                    disabled={!bookingData.checkIn}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg font-semibold text-orange-600 disabled:bg-gray-100"
                  />
                </div>

                {calculateNights() > 0 && (
                  <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-6">
                    <p className="text-center">
                      <span className="text-5xl font-black text-orange-500">{calculateNights()}</span>
                      <span className="text-xl font-bold text-orange-600 ml-3">
                        {calculateNights() === 1 ? 'Night' : 'Nights'}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!bookingData.checkIn || !bookingData.checkOut || calculateNights() === 0}
                className="w-full mt-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-black text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Properties →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-xl mb-6">
                <h2 className="text-3xl font-black mb-2 text-orange-600">Choose Your Property</h2>
                <p className="text-gray-600 mb-6">Select from our available properties</p>
              </div>

              {loadingProperties ? (
                <div className="bg-white rounded-2xl p-8 text-center">
                  <div className="animate-pulse">Loading properties...</div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {properties.map((property) => {
                    const propertyIsSelected = bookingData.property === property.id;
                    const showAvailability = propertyIsSelected && availabilityChecked;

                    return (
                      <button
                        key={property.id}
                        onClick={() => setBookingData({...bookingData, property: property.id})}
                        className={`bg-white rounded-2xl p-6 border-2 transition-all text-left ${
                          propertyIsSelected
                            ? 'border-orange-500 shadow-xl bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300 hover:shadow-lg'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-6xl">🏖️</div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-black text-orange-600 mb-2">{property.name}</h3>
                            <p className="text-gray-600 mb-3">{property.description || 'Beautiful property in Bali'}</p>

                            {showAvailability && (
                              <div className={`mb-3 px-3 py-2 rounded-lg inline-block ${
                                isAvailable
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {isAvailable ? '✓ Available' : '✗ Not Available'}
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-3xl font-black text-orange-500">${property.base_price}</span>
                                <span className="text-gray-600 ml-2">/ night</span>
                              </div>
                              {propertyIsSelected && (
                                <div className="px-4 py-2 bg-orange-500 text-white rounded-xl font-bold">
                                  Selected ✓
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {availabilityChecked && !isAvailable && bookingData.property && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
                  <p className="text-red-800 font-semibold flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    This property is not available for the selected dates. Please choose different dates.
                  </p>
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 bg-gray-200 text-orange-600 rounded-2xl font-bold hover:bg-gray-300 transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!bookingData.property || !isAvailable}
                  className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-black hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Details →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-xl">
              <h2 className="text-3xl font-black mb-2 text-orange-600">Guest Information</h2>
              <p className="text-gray-600 mb-8">Tell us about yourself</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-orange-600 mb-2">Number of Guests</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={bookingData.guests}
                    onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg font-semibold text-orange-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-orange-600 mb-2">Full Name *</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={bookingData.guestName}
                    onChange={(e) => setBookingData({...bookingData, guestName: e.target.value})}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg text-orange-600 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-orange-600 mb-2">Email *</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={bookingData.guestEmail}
                    onChange={(e) => setBookingData({...bookingData, guestEmail: e.target.value})}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg text-orange-600 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-orange-600 mb-2">Phone *</label>
                  <input
                    type="tel"
                    placeholder="+1 555-0000"
                    value={bookingData.guestPhone}
                    onChange={(e) => setBookingData({...bookingData, guestPhone: e.target.value})}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg text-orange-600 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-orange-600 mb-2">Special Requests</label>
                  <textarea
                    placeholder="Any special requirements..."
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                    rows="4"
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg resize-none text-orange-600 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-4 bg-gray-200 text-orange-600 rounded-2xl font-bold hover:bg-gray-300 transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!bookingData.guestName || !bookingData.guestEmail || !bookingData.guestPhone}
                  className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-black hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-xl">
                <h2 className="text-3xl font-black mb-2 text-orange-600">Booking Summary</h2>
                <p className="text-gray-600 mb-8">Review your booking details</p>

                <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-orange-600">Property</span>
                    <span className="font-black text-lg text-orange-600">
                      {properties.find(p => p.id === bookingData.property)?.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-orange-600">Check-in</span>
                    <span className="font-black text-orange-600">{bookingData.checkIn}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-orange-600">Check-out</span>
                    <span className="font-black text-orange-600">{bookingData.checkOut}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-orange-600">Nights</span>
                    <span className="font-black text-orange-600">{calculateNights()}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-orange-600">Guests</span>
                    <span className="font-black text-orange-600">{bookingData.guests}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t-2 border-orange-200">
                    <span className="font-bold text-orange-600">Guest Name</span>
                    <span className="font-black text-orange-600">{bookingData.guestName}</span>
                  </div>
                </div>
              </div>

              <PricingBreakdown pricing={pricing} loading={loadingPricing} />

              <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-xl">
                <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
                  <p className="text-sm text-blue-900 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>Payment integration will be implemented in next phase</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-4 bg-gray-200 text-orange-600 rounded-2xl font-bold hover:bg-gray-300 transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-black hover:shadow-2xl transition-all"
                >
                  View Widget Code →
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-xl">
                <h2 className="text-3xl font-black mb-2 text-orange-600">Embeddable Widget</h2>
                <p className="text-gray-600 mb-8">Copy this code to embed the booking widget on your website</p>

                <div className="bg-gray-900 rounded-2xl p-6 overflow-x-auto">
                  <code className="text-green-400 font-mono text-sm">
                    {`<iframe
  src="https://yourdomain.com/booking-widget"
  width="100%"
  height="600"
  frameborder="0"
  style="border-radius: 16px;"
></iframe>`}
                  </code>
                </div>

                <button className="w-full mt-4 py-3 bg-gray-200 text-orange-600 rounded-xl font-bold hover:bg-gray-300 transition-all">
                  Copy Code
                </button>
              </div>

              <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-xl">
                <h3 className="text-2xl font-black mb-6 text-orange-600">Widget Preview</h3>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-gray-300">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎟️</div>
                    <h4 className="text-2xl font-black text-orange-600 mb-2">Book Your Stay</h4>
                    <p className="text-gray-600 mb-6">Widget would appear here on your website</p>
                    <div className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-bold">
                      Start Booking
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setStep(1);
                  setBookingData({
                    checkIn: '',
                    checkOut: '',
                    property: '',
                    guests: 2,
                    guestName: '',
                    guestEmail: '',
                    guestPhone: '',
                    specialRequests: ''
                  });
                }}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-black hover:shadow-2xl transition-all"
              >
                Start New Booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingEngineWidget;

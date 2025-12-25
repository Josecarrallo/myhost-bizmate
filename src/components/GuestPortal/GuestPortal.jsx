import React, { useState, useEffect } from 'react';
import { ChevronLeft, Home, Calendar, Clock, MapPin, ShoppingBag, Headphones, Star, Wifi, Coffee, Waves, User, Phone, Mail, MessageCircle } from 'lucide-react';

const GuestPortal = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('villa-info');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock booking data
  const bookingData = {
    propertyName: 'Villa Sunset Paradise',
    propertyImage: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800',
    bookingId: 'BK-2025-0428',
    guestName: 'Sarah Johnson',
    checkIn: '2025-12-15',
    checkOut: '2025-12-20',
    nights: 5,
    guests: 4,
    accessCode: '7392',
    totalPrice: '$2,850',
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    area: '180 m²',
    location: 'Seminyak, Bali',
    description: 'Luxurious 3-bedroom villa with private pool, stunning sunset views, and modern Balinese architecture. Perfect for families and groups.',

    amenities: [
      { name: 'Private Pool', icon: Waves },
      { name: 'High-Speed WiFi', icon: Wifi },
      { name: 'Fully Equipped Kitchen', icon: Coffee },
      { name: 'Air Conditioning', icon: Home },
      { name: '24/7 Security', icon: User },
      { name: 'Free Parking', icon: MapPin }
    ],

    houseRules: [
      'Check-in: 2:00 PM',
      'Check-out: 12:00 PM',
      'No smoking inside the villa',
      'No parties or events',
      'Pets not allowed',
      'Respect quiet hours: 10 PM - 8 AM'
    ],

    checkInInstructions: [
      'Arrive at the villa between 2:00 PM - 8:00 PM',
      'Our staff will greet you at the entrance',
      'Please have your booking confirmation ready',
      'Access code will be provided upon arrival: 7392',
      'Villa orientation tour included'
    ],

    checkOutInstructions: [
      'Check-out time is 12:00 PM (noon)',
      'Late check-out available upon request (subject to availability)',
      'Please leave keys in the lockbox',
      'Ensure all windows and doors are locked',
      'Turn off all lights and AC units'
    ],

    recommendations: [
      {
        category: 'Restaurants',
        items: [
          { name: 'Motel Mexicola', type: 'Mexican', distance: '5 min', rating: 4.8, price: '$$' },
          { name: 'Merah Putih', type: 'Indonesian', distance: '10 min', rating: 4.7, price: '$$$' },
          { name: 'La Lucciola', type: 'Italian', distance: '8 min', rating: 4.6, price: '$$' },
          { name: 'Sarong', type: 'Asian Fusion', distance: '7 min', rating: 4.9, price: '$$$' }
        ]
      },
      {
        category: 'Activities',
        items: [
          { name: 'Seminyak Beach', type: 'Beach', distance: '3 min', rating: 4.5, price: 'Free' },
          { name: 'Potato Head Beach Club', type: 'Beach Club', distance: '10 min', rating: 4.7, price: '$$$' },
          { name: 'Waterbom Bali', type: 'Water Park', distance: '25 min', rating: 4.8, price: '$$' },
          { name: 'Tanah Lot Temple', type: 'Temple', distance: '30 min', rating: 4.6, price: '$' }
        ]
      },
      {
        category: 'Shopping',
        items: [
          { name: 'Seminyak Square', type: 'Shopping Mall', distance: '5 min', rating: 4.3, price: '$$' },
          { name: 'Seminyak Village', type: 'Shopping Center', distance: '7 min', rating: 4.5, price: '$$$' },
          { name: 'Jalan Raya Seminyak', type: 'Street Shopping', distance: '2 min', rating: 4.4, price: '$-$$' }
        ]
      }
    ],

    addOns: [
      {
        name: 'Airport Transfer (Private)',
        description: 'Private car with English-speaking driver from/to Ngurah Rai Airport',
        price: '$35',
        duration: 'One way',
        available: true
      },
      {
        name: 'Daily Housekeeping',
        description: 'Professional cleaning service during your stay',
        price: '$25',
        duration: 'Per day',
        available: true
      },
      {
        name: 'Private Chef',
        description: 'Personal chef for breakfast, lunch, or dinner (ingredients not included)',
        price: '$80',
        duration: 'Per meal',
        available: true
      },
      {
        name: 'Spa & Massage',
        description: 'Traditional Balinese massage in the comfort of your villa',
        price: '$50',
        duration: '90 minutes',
        available: true
      },
      {
        name: 'Bike Rental',
        description: 'Mountain bikes for exploring the area',
        price: '$10',
        duration: 'Per day',
        available: true
      },
      {
        name: 'Surfing Lessons',
        description: 'Professional instructor and equipment included',
        price: '$60',
        duration: '2 hours',
        available: false
      }
    ],

    emergencyContacts: [
      { name: 'Property Manager', contact: '+62 812 3456 7890', available: '24/7', icon: User },
      { name: 'WhatsApp Support', contact: '+62 812 3456 7890', available: '24/7', icon: MessageCircle },
      { name: 'Emergency Phone', contact: '+62 811 9876 5432', available: '24/7', icon: Phone },
      { name: 'Email Support', contact: 'support@myhostbizmate.com', available: 'Within 2 hours', icon: Mail }
    ]
  };

  const tabs = [
    { id: 'villa-info', name: 'Villa Info', icon: Home },
    { id: 'booking', name: 'Booking', icon: Calendar },
    { id: 'check-in-out', name: 'Check-in/Out', icon: Clock },
    { id: 'recommendations', name: 'Local Guide', icon: MapPin },
    { id: 'add-ons', name: 'Services', icon: ShoppingBag },
    { id: 'support', name: 'Support', icon: Headphones }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className="h-screen bg-[#2a2f3a] flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-[#d85a2a]/5 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Header */}
      <div className="bg-[#1f2937]/95 backdrop-blur-sm border-b-2 border-[#d85a2a]/20 p-4 relative z-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-[#FF8C42] hover:text-orange-500 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-[#FF8C42]">Guest Portal</h2>
            <p className="text-sm md:text-base font-semibold text-orange-500">{bookingData.propertyName}</p>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#1f2937]/95 backdrop-blur-sm border-b-2 border-[#d85a2a]/20 relative z-10 shadow-lg overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 md:p-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Villa Info Tab */}
          {activeTab === 'villa-info' && (
            <div className="space-y-6">
              {/* Property Image */}
              <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl overflow-hidden border-2 border-[#d85a2a]/20 shadow-xl">
                <img src={bookingData.propertyImage} alt={bookingData.propertyName} className="w-full h-64 md:h-96 object-cover" />
              </div>

              {/* Property Details */}
              <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-[#d85a2a]/20 shadow-xl">
                <h3 className="text-2xl font-black text-[#FF8C42] mb-4">{bookingData.propertyName}</h3>
                <p className="text-gray-700 mb-6">{bookingData.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-orange-50 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-black text-[#FF8C42]">{bookingData.bedrooms}</div>
                    <div className="text-xs font-semibold text-gray-600">Bedrooms</div>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-black text-[#FF8C42]">{bookingData.bathrooms}</div>
                    <div className="text-xs font-semibold text-gray-600">Bathrooms</div>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-black text-[#FF8C42]">{bookingData.maxGuests}</div>
                    <div className="text-xs font-semibold text-gray-600">Max Guests</div>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-black text-[#FF8C42]">{bookingData.area}</div>
                    <div className="text-xs font-semibold text-gray-600">Area</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[#FF8C42] mb-6">
                  <MapPin className="w-5 h-5" />
                  <span className="font-semibold">{bookingData.location}</span>
                </div>

                <h4 className="text-xl font-black text-[#FF8C42] mb-4">Amenities</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {bookingData.amenities.map((amenity, idx) => {
                    const Icon = amenity.icon;
                    return (
                      <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <Icon className="w-5 h-5 text-[#FF8C42]" />
                        <span className="text-sm font-semibold text-gray-700">{amenity.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* House Rules */}
              <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-[#d85a2a]/20 shadow-xl">
                <h4 className="text-xl font-black text-[#FF8C42] mb-4">House Rules</h4>
                <div className="space-y-2">
                  {bookingData.houseRules.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Booking Details Tab */}
          {activeTab === 'booking' && (
            <div className="space-y-6">
              <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-[#d85a2a]/20 shadow-xl">
                <h3 className="text-2xl font-black text-[#FF8C42] mb-6">Your Booking Details</h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold text-[#FF8C42] mb-2 block">Booking ID</label>
                    <div className="bg-gray-50 rounded-xl p-4 font-mono text-lg font-black text-[#FF8C42]">
                      {bookingData.bookingId}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-[#FF8C42] mb-2 block">Guest Name</label>
                    <div className="bg-gray-50 rounded-xl p-4 text-lg font-semibold text-gray-700">
                      {bookingData.guestName}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-[#FF8C42] mb-2 block">Check-in Date</label>
                    <div className="bg-orange-50 rounded-xl p-4 text-lg font-black text-[#FF8C42]">
                      {new Date(bookingData.checkIn).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-[#FF8C42] mb-2 block">Check-out Date</label>
                    <div className="bg-orange-50 rounded-xl p-4 text-lg font-black text-[#FF8C42]">
                      {new Date(bookingData.checkOut).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-[#FF8C42] mb-2 block">Number of Nights</label>
                    <div className="bg-gray-50 rounded-xl p-4 text-lg font-black text-[#FF8C42]">
                      {bookingData.nights} nights
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-[#FF8C42] mb-2 block">Number of Guests</label>
                    <div className="bg-gray-50 rounded-xl p-4 text-lg font-black text-[#FF8C42]">
                      {bookingData.guests} guests
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t-2 border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-700">Total Amount</span>
                    <span className="text-3xl font-black text-[#FF8C42]">{bookingData.totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 border-2 border-[#d85a2a]/20 shadow-xl text-white">
                <h4 className="text-xl font-black mb-4">Access Code</h4>
                <p className="text-sm opacity-90 mb-4">Use this code to access the villa:</p>
                <div className="bg-[#d85a2a]/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <div className="text-5xl font-black tracking-wider">{bookingData.accessCode}</div>
                </div>
                <p className="text-xs opacity-75 mt-4 text-center">Keep this code safe and don't share it with anyone</p>
              </div>
            </div>
          )}

          {/* Check-in/Out Tab */}
          {activeTab === 'check-in-out' && (
            <div className="space-y-6">
              <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-[#d85a2a]/20 shadow-xl">
                <h3 className="text-2xl font-black text-[#FF8C42] mb-6">Check-in Instructions</h3>
                <div className="space-y-4">
                  {bookingData.checkInInstructions.map((instruction, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-black">
                        {idx + 1}
                      </div>
                      <p className="text-gray-700 pt-1">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-[#d85a2a]/20 shadow-xl">
                <h3 className="text-2xl font-black text-[#FF8C42] mb-6">Check-out Instructions</h3>
                <div className="space-y-4">
                  {bookingData.checkOutInstructions.map((instruction, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-black">
                        {idx + 1}
                      </div>
                      <p className="text-gray-700 pt-1">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-orange-50 rounded-3xl p-6 border-2 border-orange-200 shadow-lg">
                  <Clock className="w-10 h-10 text-[#FF8C42] mb-3" />
                  <h4 className="text-xl font-black text-[#FF8C42] mb-2">Check-in Time</h4>
                  <p className="text-3xl font-black text-[#FF8C42]">2:00 PM</p>
                </div>
                <div className="bg-orange-50 rounded-3xl p-6 border-2 border-orange-200 shadow-lg">
                  <Clock className="w-10 h-10 text-[#FF8C42] mb-3" />
                  <h4 className="text-xl font-black text-[#FF8C42] mb-2">Check-out Time</h4>
                  <p className="text-3xl font-black text-[#FF8C42]">12:00 PM</p>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              {bookingData.recommendations.map((category, catIdx) => (
                <div key={catIdx} className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-[#d85a2a]/20 shadow-xl">
                  <h3 className="text-2xl font-black text-[#FF8C42] mb-6">{category.category}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {category.items.map((item, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-2xl p-4 hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="text-lg font-black text-[#FF8C42] mb-1">{item.name}</h4>
                            <p className="text-sm text-gray-600 font-semibold">{item.type}</p>
                          </div>
                          <div className="flex gap-1">
                            {renderStars(item.rating)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-[#FF8C42]">{item.distance}</span>
                          <span className="text-sm font-bold text-gray-700">{item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 border-2 border-[#d85a2a]/20 shadow-xl text-white">
                <h4 className="text-xl font-black mb-3">Need More Recommendations?</h4>
                <p className="text-sm opacity-90 mb-4">Contact our concierge service for personalized recommendations and reservations.</p>
                <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all">
                  Contact Concierge
                </button>
              </div>
            </div>
          )}

          {/* Add-ons Tab */}
          {activeTab === 'add-ons' && (
            <div className="space-y-6">
              <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-[#d85a2a]/20 shadow-xl">
                <h3 className="text-2xl font-black text-[#FF8C42] mb-6">Extra Services & Add-ons</h3>
                <div className="space-y-4">
                  {bookingData.addOns.map((addon, idx) => (
                    <div key={idx} className={`bg-gray-50 rounded-2xl p-6 border-2 ${addon.available ? 'border-gray-200 hover:shadow-lg transition-all' : 'border-gray-100 opacity-60'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-lg font-black text-[#FF8C42] mb-2">{addon.name}</h4>
                          <p className="text-sm text-gray-600 mb-3">{addon.description}</p>
                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-black text-[#FF8C42]">{addon.price}</span>
                            <span className="text-sm font-semibold text-gray-500">{addon.duration}</span>
                          </div>
                        </div>
                        <div>
                          {addon.available ? (
                            <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                              Book Now
                            </button>
                          ) : (
                            <span className="bg-gray-200 text-gray-500 px-6 py-3 rounded-xl font-bold">
                              Unavailable
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-6 border-2 border-[#d85a2a]/20 shadow-xl text-white">
                <h4 className="text-xl font-black mb-3">Special Requests?</h4>
                <p className="text-sm opacity-90 mb-4">Have a special request or need a custom service? Let us know and we'll do our best to accommodate!</p>
                <button className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-all">
                  Send Request
                </button>
              </div>
            </div>
          )}

          {/* Support Tab */}
          {activeTab === 'support' && (
            <div className="space-y-6">
              <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-[#d85a2a]/20 shadow-xl">
                <h3 className="text-2xl font-black text-[#FF8C42] mb-6">Contact & Support</h3>
                <p className="text-gray-700 mb-6">We're here to help! Reach out to us anytime through any of these channels:</p>

                <div className="grid md:grid-cols-2 gap-4">
                  {bookingData.emergencyContacts.map((contact, idx) => {
                    const Icon = contact.icon;
                    return (
                      <div key={idx} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-[#FF8C42]">{contact.name}</h4>
                            <p className="text-xs text-gray-500 font-semibold">{contact.available}</p>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-gray-700 bg-white rounded-xl p-3">
                          {contact.contact}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-6 border-2 border-[#d85a2a]/20 shadow-xl text-white">
                <h4 className="text-xl font-black mb-3 flex items-center gap-2">
                  <Phone className="w-6 h-6" />
                  Emergency Hotline
                </h4>
                <p className="text-sm opacity-90 mb-4">For urgent matters only (medical, security, property damage):</p>
                <div className="bg-[#d85a2a]/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-3xl font-black">+62 811 9876 5432</div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <button className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#d85a2a]/20 shadow-xl hover:shadow-2xl transition-all">
                  <MessageCircle className="w-10 h-10 text-green-600 mb-3 mx-auto" />
                  <h4 className="text-lg font-black text-[#FF8C42] mb-2">WhatsApp</h4>
                  <p className="text-sm text-gray-600">Instant messaging support</p>
                </button>
                <button className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#d85a2a]/20 shadow-xl hover:shadow-2xl transition-all">
                  <Mail className="w-10 h-10 text-blue-600 mb-3 mx-auto" />
                  <h4 className="text-lg font-black text-[#FF8C42] mb-2">Email</h4>
                  <p className="text-sm text-gray-600">Response within 2 hours</p>
                </button>
                <button className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#d85a2a]/20 shadow-xl hover:shadow-2xl transition-all">
                  <Phone className="w-10 h-10 text-[#FF8C42] mb-3 mx-auto" />
                  <h4 className="text-lg font-black text-[#FF8C42] mb-2">Call</h4>
                  <p className="text-sm text-gray-600">Speak directly with us</p>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default GuestPortal;

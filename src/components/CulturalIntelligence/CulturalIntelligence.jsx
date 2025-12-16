import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Globe,
  Users,
  MapPin,
  MessageCircle,
  Heart,
  Info,
  Calendar,
  Clock,
  Coffee,
  Utensils,
  Sun,
  Moon,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Languages,
  Gift
} from 'lucide-react';

const CulturalIntelligence = ({ onBack }) => {
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const guestProfiles = [
    {
      id: 1,
      name: 'Yuki Tanaka',
      country: 'Japan',
      flag: '🇯🇵',
      checkIn: '2025-11-05',
      checkOut: '2025-11-12',
      nights: 7,
      property: 'Villa Sunset Paradise',
      culturalProfile: {
        communication: 'Indirect and polite. Prefer written communication over phone. Use formal greetings.',
        preferences: ['Quiet hours after 9 PM', 'Prefer rice-based breakfast', 'Appreciate minimalist decor', 'Value privacy highly'],
        customs: ['Remove shoes indoors', 'Bow as greeting', 'Gift-giving culture', 'Punctuality very important'],
        dietary: ['Prefer seafood and rice', 'Avoid spicy food', 'Vegetarian options appreciated', 'Green tea available'],
        language: 'Japanese (English: Basic)',
        recommendations: [
          'Provide slippers at entrance',
          'Stock green tea and rice',
          'Avoid direct confrontation if issues arise',
          'Provide written house rules in Japanese'
        ]
      }
    },
    {
      id: 2,
      name: 'Ahmed Al-Rashid',
      country: 'Saudi Arabia',
      flag: '🇸🇦',
      checkIn: '2025-11-08',
      checkOut: '2025-11-15',
      nights: 7,
      property: 'Beach House Deluxe',
      culturalProfile: {
        communication: 'Direct but respectful. Prefer phone calls. Hospitality is very important.',
        preferences: ['Prayer room/direction to Mecca', 'Halal food only', 'Gender-separated spaces', 'Late dinner times (8-9 PM)'],
        customs: ['Remove shoes before prayer', 'Modesty in dress', 'Right hand for eating', 'Generous hospitality'],
        dietary: ['Halal meat only', 'No alcohol', 'No pork products', 'Dates and Arabic coffee'],
        language: 'Arabic (English: Fluent)',
        recommendations: [
          'Provide Qibla direction marker',
          'Stock halal-certified food',
          'Respect prayer times (5x daily)',
          'Provide privacy screens if needed'
        ]
      }
    },
    {
      id: 3,
      name: 'Maria Rodriguez',
      country: 'Spain',
      flag: '🇪🇸',
      checkIn: '2025-11-10',
      checkOut: '2025-11-17',
      nights: 7,
      property: 'City Loft Premium',
      culturalProfile: {
        communication: 'Warm and expressive. Comfortable with close proximity. Enjoy social interaction.',
        preferences: ['Late meal times', 'Social spaces', 'Wine with dinner', 'Siesta time (2-5 PM)'],
        customs: ['Two kisses greeting', 'Loud and animated conversation', 'Family-oriented', 'Late night culture'],
        dietary: ['Mediterranean diet', 'Olive oil', 'Fresh seafood', 'Wine and tapas'],
        language: 'Spanish (English: Good)',
        recommendations: [
          'Stock Spanish wine and olive oil',
          'Provide late check-out option',
          'Recommend local tapas bars',
          'Flexible quiet hours'
        ]
      }
    },
    {
      id: 4,
      name: 'Emma Thompson',
      country: 'United Kingdom',
      flag: '🇬🇧',
      checkIn: '2025-11-12',
      checkOut: '2025-11-19',
      nights: 7,
      property: 'Mountain Cabin Retreat',
      culturalProfile: {
        communication: 'Polite and reserved. Appreciate personal space. Indirect communication.',
        preferences: ['Tea facilities', 'Queue etiquette', 'Punctuality', 'Privacy important'],
        customs: ['Queuing culture', 'Apologize frequently', 'Reserved demeanor', 'Appreciate irony/humor'],
        dietary: ['Full English breakfast', 'Tea with milk', 'Fish and chips', 'Sunday roast'],
        language: 'English (Native)',
        recommendations: [
          'Stock quality tea and biscuits',
          'Provide milk for tea',
          'Respect reserved nature',
          'Clear house rules appreciated'
        ]
      }
    }
  ];

  const culturalInsights = [
    { icon: '🌏', title: 'Asian Guests', percent: 35, color: 'from-blue-500 to-cyan-500', insights: ['Prefer indirect communication', 'Value cleanliness highly', 'Early risers', 'Respect for elders'] },
    { icon: '🌍', title: 'Middle Eastern', percent: 25, color: 'from-purple-500 to-pink-500', insights: ['Halal requirements common', 'Family-oriented', 'Generous tipping', 'Prayer facilities needed'] },
    { icon: '🌎', title: 'European Guests', percent: 30, color: 'from-orange-500 to-red-500', insights: ['Flexible schedules', 'Social gatherings', 'Wine culture', 'Late dining'] },
    { icon: '🌏', title: 'American Guests', percent: 10, color: 'from-green-500 to-emerald-500', insights: ['Direct communication', 'Tipping expected', 'Large portions', 'Ice in drinks'] }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-4 pb-24 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-72 h-72 bg-orange-200/30 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <ChevronLeft className="w-6 h-6 text-orange-600" />
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl">Cultural Intelligence</h2>
          </div>
          <button className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <Sparkles className="w-6 h-6 text-orange-600" />
          </button>
        </div>

        {/* AI Cultural Banner */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 rounded-3xl mb-6 shadow-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Globe className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-3xl font-black mb-1">Cultural Intelligence AI</h3>
              <p className="text-orange-100 font-semibold">Personalized guest experiences based on cultural insights</p>
            </div>
          </div>
          <p className="text-white/90 leading-relaxed">Understanding your guests' cultural backgrounds helps create exceptional, personalized experiences. Our AI analyzes cultural preferences, customs, and communication styles to help you provide culturally-aware hospitality.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border-2 border-white/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-600">Countries</p>
            </div>
            <p className="text-3xl font-black text-orange-600">42</p>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border-2 border-white/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <Languages className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-600">Languages</p>
            </div>
            <p className="text-3xl font-black text-orange-600">18</p>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border-2 border-white/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-600">Satisfaction</p>
            </div>
            <p className="text-3xl font-black text-green-600">4.9/5</p>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border-2 border-white/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <Users className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-600">Upcoming</p>
            </div>
            <p className="text-3xl font-black text-orange-600">{guestProfiles.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all shadow-lg ${
              activeTab === 'overview' ? 'bg-white text-orange-600' : 'bg-white/60 text-white hover:bg-white/80 border-2 border-white/50'
            }`}
          >
            <Globe className="w-5 h-5 inline mr-2" />Cultural Overview
          </button>
          <button
            onClick={() => setActiveTab('guests')}
            className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all shadow-lg ${
              activeTab === 'guests' ? 'bg-white text-orange-600' : 'bg-white/60 text-white hover:bg-white/80 border-2 border-white/50'
            }`}
          >
            <Users className="w-5 h-5 inline mr-2" />Guest Profiles
          </button>
        </div>

        {/* Cultural Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {culturalInsights.map((insight, idx) => (
                <div key={idx} className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${insight.color} flex items-center justify-center text-3xl`}>
                        {insight.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-orange-600">{insight.title}</h3>
                        <p className="text-sm text-gray-500 font-semibold">{insight.percent}% of guests</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {insight.insights.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700 font-semibold">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Guest Profiles Tab */}
        {activeTab === 'guests' && (
          <div className="space-y-4">
            {guestProfiles.map((guest) => (
              <div key={guest.id} className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">{guest.flag}</div>
                      <div>
                        <h3 className="text-2xl font-black text-orange-600 mb-1">{guest.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span className="font-semibold">{guest.country}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span className="font-semibold">{guest.nights} nights</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedGuest(guest)}
                      className="px-6 py-3 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-colors shadow-lg"
                    >
                      View Full Profile
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-2 flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-orange-600" /> Communication Style
                      </p>
                      <p className="text-sm text-gray-700 font-semibold line-clamp-2">{guest.culturalProfile.communication}</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-2 flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-orange-600" /> Dietary Needs
                      </p>
                      <p className="text-sm text-gray-700 font-semibold">{guest.culturalProfile.dietary[0]}</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-2 flex items-center gap-2">
                        <Languages className="w-4 h-4 text-orange-600" /> Language
                      </p>
                      <p className="text-sm text-gray-700 font-semibold">{guest.culturalProfile.language}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Guest Detail Modal */}
      {selectedGuest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedGuest(null)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{selectedGuest.flag}</div>
                <div>
                  <h3 className="text-3xl font-black text-white mb-1">{selectedGuest.name}</h3>
                  <p className="text-orange-100 font-semibold">{selectedGuest.country} • {selectedGuest.property}</p>
                </div>
              </div>
              <button onClick={() => setSelectedGuest(null)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Stay Details */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                <h4 className="text-xl font-black mb-3">Stay Details</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-orange-100 text-sm font-semibold mb-1">Check-in</p>
                    <p className="text-lg font-bold">{selectedGuest.checkIn}</p>
                  </div>
                  <div>
                    <p className="text-orange-100 text-sm font-semibold mb-1">Check-out</p>
                    <p className="text-lg font-bold">{selectedGuest.checkOut}</p>
                  </div>
                  <div>
                    <p className="text-orange-100 text-sm font-semibold mb-1">Duration</p>
                    <p className="text-lg font-bold">{selectedGuest.nights} nights</p>
                  </div>
                </div>
              </div>

              {/* Communication Style */}
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                <h4 className="text-xl font-black text-orange-600 mb-4 flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" /> Communication Style
                </h4>
                <p className="text-gray-700 font-semibold leading-relaxed">{selectedGuest.culturalProfile.communication}</p>
              </div>

              {/* Cultural Preferences */}
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                <h4 className="text-xl font-black text-orange-600 mb-4 flex items-center gap-2">
                  <Heart className="w-6 h-6" /> Cultural Preferences
                </h4>
                <div className="space-y-2">
                  {selectedGuest.culturalProfile.preferences.map((pref, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 font-semibold">{pref}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Customs */}
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                <h4 className="text-xl font-black text-orange-600 mb-4 flex items-center gap-2">
                  <Gift className="w-6 h-6" /> Important Customs
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedGuest.culturalProfile.customs.map((custom, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 bg-white rounded-xl border-2 border-gray-100">
                      <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 font-semibold text-sm">{custom}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dietary Requirements */}
              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                <h4 className="text-xl font-black text-orange-600 mb-4 flex items-center gap-2">
                  <Utensils className="w-6 h-6" /> Dietary Requirements
                </h4>
                <div className="space-y-2">
                  {selectedGuest.culturalProfile.dietary.map((diet, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Coffee className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 font-semibold">{diet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-200">
                <h4 className="text-xl font-black text-orange-600 mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6" /> AI Recommendations
                </h4>
                <div className="space-y-3">
                  {selectedGuest.culturalProfile.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-xl border-2 border-orange-100">
                      <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-900 font-bold text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CulturalIntelligence;

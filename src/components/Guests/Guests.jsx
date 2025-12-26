import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  Eye
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import GuestProfile from './GuestProfile';

const Guests = ({ onBack }) => {
  const { user } = useAuth();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadGuests();
    }
  }, [user]);

  const loadGuests = async () => {
    // For now, using mock data
    // TODO: Fetch from Supabase
    setGuests([
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+62 813 1234 5678',
        lastBooking: '2025-12-15',
        totalBookings: 3,
        status: 'active'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '+62 813 8765 4321',
        lastBooking: '2025-11-20',
        totalBookings: 1,
        status: 'active'
      }
    ]);
    setLoading(false);
  };

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedGuest) {
    return (
      <GuestProfile
        guest={selectedGuest}
        onBack={() => setSelectedGuest(null)}
      />
    );
  }

  return (
    <div className="flex-1 h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4 relative overflow-auto">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 shadow-lg"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white drop-shadow-2xl">
              Guest Database
            </h2>
          </div>
          <div className="w-14"></div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              type="text"
              placeholder="Search guests by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-all"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/20">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-white" />
              <div>
                <p className="text-white/70 text-sm">Total Guests</p>
                <p className="text-2xl font-bold text-white">{guests.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/20">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-white" />
              <div>
                <p className="text-white/70 text-sm">Active This Month</p>
                <p className="text-2xl font-bold text-white">{guests.filter(g => g.status === 'active').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/20">
            <div className="flex items-center gap-3">
              <Mail className="w-8 h-8 text-white" />
              <div>
                <p className="text-white/70 text-sm">Emails Sent</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Guests List */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/20 p-6">
          <h3 className="text-xl font-bold text-white mb-4">All Guests</h3>

          {loading ? (
            <div className="text-center py-8 text-white">Loading guests...</div>
          ) : filteredGuests.length === 0 ? (
            <div className="text-center py-8 text-white/70">No guests found</div>
          ) : (
            <div className="space-y-3">
              {filteredGuests.map((guest) => (
                <div
                  key={guest.id}
                  className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer border border-white/10"
                  onClick={() => setSelectedGuest(guest)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-1">{guest.name}</h4>
                      <div className="flex flex-wrap gap-4 text-sm text-white/70">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          <span>{guest.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          <span>{guest.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{guest.totalBookings} bookings</span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all flex items-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGuest(guest);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Guests;

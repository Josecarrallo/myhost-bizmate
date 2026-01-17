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
import { dataService } from '../../services/data';

const Guests = ({ onBack }) => {
  const { user } = useAuth();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [emailsSent, setEmailsSent] = useState(0);

  useEffect(() => {
    if (user?.id) {
      loadGuests();
      loadEmailStats();
    }
  }, [user]);

  const loadEmailStats = async () => {
    try {
      const SUPABASE_URL = 'https://jjpscimtxrudtepzwhag.supabase.co';
      const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwODczOTcsImV4cCI6MjA0ODY2MzM5N30.2DxnLWdw6oGhNMKQM4THnpQD23vhxFGhz6rBXbdZPc0';

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/communications_log?select=id&channel=eq.email`,
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'count=exact'
          }
        }
      );

      if (response.ok) {
        const count = response.headers.get('content-range');
        if (count) {
          const totalCount = parseInt(count.split('/')[1]);
          setEmailsSent(totalCount);
        }
      }
    } catch (error) {
      console.error('Error loading email stats:', error);
    }
  };

  const loadGuests = async () => {
    try {
      setLoading(true);

      // Load real guests from Supabase
      const guestsData = await dataService.getGuests();

      console.log('[Guests] Loaded from Supabase:', guestsData?.length || 0);

      if (guestsData && guestsData.length > 0) {
        // Map Supabase data to component format
        const mappedGuests = guestsData.map(guest => ({
          id: guest.id,
          name: guest.full_name,
          email: guest.email || 'N/A',
          phone: guest.phone || guest.whatsapp || 'N/A',
          lastBooking: guest.last_stay_date
            ? new Date(guest.last_stay_date).toLocaleDateString()
            : 'Never',
          totalBookings: guest.total_stays || 0,
          status: guest.total_stays > 0 ? 'active' : 'prospect',
          nationality: 'Unknown', // Not in guest_contacts table
          totalRevenue: guest.total_revenue || 0,
          segment: guest.segment || []
        }));

        setGuests(mappedGuests);
      } else {
        setGuests([]);
      }
    } catch (error) {
      console.error('[Guests] Error loading:', error);
      setGuests([]);
    } finally {
      setLoading(false);
    }
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
    <div className="flex-1 h-screen bg-gray-900 p-4 relative overflow-auto">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="p-3 bg-[#1f2937] border border-[#d85a2a]/20 rounded-2xl hover:bg-[#374151] transition-all duration-300 shadow-lg"
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
              className="w-full pl-12 pr-4 py-3 bg-[#1f2937] border border-[#d85a2a]/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-[#d85a2a]/40 transition-all"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-[#1f2937] to-[#374151] rounded-xl p-4 border border-[#d85a2a]/20 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">Total Guests</p>
                <p className="text-2xl font-bold text-white">{guests.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#1f2937] to-[#374151] rounded-xl p-4 border border-[#d85a2a]/20 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">Active This Month</p>
                <p className="text-2xl font-bold text-white">{guests.filter(g => g.status === 'active').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#1f2937] to-[#374151] rounded-xl p-4 border border-[#d85a2a]/20 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] rounded-lg">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">Emails Sent</p>
                <p className="text-2xl font-bold text-white">{emailsSent}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Guests List */}
        <div className="bg-[#1f2937] border border-[#d85a2a]/20 rounded-xl p-6 shadow-xl">
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
                  className="bg-gradient-to-br from-[#1f2937] to-[#374151] rounded-xl p-4 hover:border-[#d85a2a]/40 transition-all cursor-pointer border border-[#d85a2a]/20"
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
                      className="px-4 py-2 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] hover:opacity-90 text-white rounded-xl transition-all flex items-center gap-2"
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

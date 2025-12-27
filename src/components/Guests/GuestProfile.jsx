import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Send
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { communicationsService } from '../../services/communicationsService';
import SendCommunicationModal from './SendCommunicationModal';

const GuestProfile = ({ guest, onBack }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('communication');
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendChannel, setSendChannel] = useState('email'); // 'email' or 'whatsapp'

  useEffect(() => {
    if (activeTab === 'communication') {
      loadCommunications();
    }
  }, [activeTab]);

  const loadCommunications = async () => {
    if (!user?.id || !guest?.id) return;

    setLoading(true);
    try {
      const comms = await communicationsService.getGuestCommunications(user.id, guest.id);
      setCommunications(comms);
    } catch (error) {
      console.error('Error loading communications:', error);
      setCommunications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendClick = (channel) => {
    setSendChannel(channel);
    setShowSendModal(true);
  };

  const handleSendSuccess = () => {
    setShowSendModal(false);
    loadCommunications(); // Reload communications
  };

  const tabs = [
    { id: 'info', label: 'Basic Info' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'communication', label: 'Communication' }
  ];

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
              {guest.name}
            </h2>
          </div>
          <div className="w-14"></div>
        </div>

        {/* Guest Info Card */}
        <div className="bg-[#1f2937] border border-[#d85a2a]/20 rounded-xl shadow-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-white" />
              <div>
                <p className="text-white/70 text-sm">Email</p>
                <p className="text-white font-medium">{guest.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-6 h-6 text-white" />
              <div>
                <p className="text-white/70 text-sm">Phone</p>
                <p className="text-white font-medium">{guest.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-white" />
              <div>
                <p className="text-white/70 text-sm">Total Bookings</p>
                <p className="text-white font-medium">{guest.totalBookings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-orange-600'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-[#1f2937] border border-[#d85a2a]/20 rounded-xl shadow-xl p-6">
          {activeTab === 'info' && (
            <div className="text-white">
              <h3 className="text-xl font-bold mb-4">Basic Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-white/70 text-sm">Full Name</p>
                  <p className="text-white font-medium">{guest.name}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Email</p>
                  <p className="text-white font-medium">{guest.email}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Phone</p>
                  <p className="text-white font-medium">{guest.phone}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Last Booking</p>
                  <p className="text-white font-medium">{guest.lastBooking}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="text-white">
              <h3 className="text-xl font-bold mb-4">Booking History</h3>
              <p className="text-white/70">No bookings found for this guest.</p>
            </div>
          )}

          {activeTab === 'communication' && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Communication</h3>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => handleSendClick('email')}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-2xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
                >
                  <Mail className="w-5 h-5" />
                  Send Email
                </button>
                <button
                  onClick={() => handleSendClick('whatsapp')}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-2xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageSquare className="w-5 h-5" />
                  Send WhatsApp
                </button>
              </div>

              {/* Communications History */}
              <div>
                <h4 className="text-lg font-bold text-white mb-3">Recent Communications</h4>
                {loading ? (
                  <p className="text-white/70">Loading...</p>
                ) : communications.length === 0 ? (
                  <div className="bg-gradient-to-br from-[#1f2937] to-[#374151] border border-[#d85a2a]/20 rounded-xl p-6 text-center">
                    <MessageSquare className="w-12 h-12 text-white/30 mx-auto mb-3" />
                    <p className="text-white/70">No communications sent yet</p>
                    <p className="text-white/50 text-sm mt-1">Start by sending an email or WhatsApp message</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {communications.map((comm) => (
                      <div
                        key={comm.id}
                        className="bg-gradient-to-br from-[#1f2937] to-[#374151] rounded-xl p-4 border border-[#d85a2a]/20"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {comm.channel === 'email' ? (
                              <Mail className="w-4 h-4 text-white" />
                            ) : (
                              <MessageSquare className="w-4 h-4 text-white" />
                            )}
                            <span className="text-white font-medium capitalize">{comm.channel}</span>
                            {comm.template_key && (
                              <span className="px-2 py-1 bg-[#d85a2a]/20 text-[#f5a524] rounded text-xs font-medium">
                                {comm.template_key.replace('_', ' ')}
                              </span>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            comm.status === 'sent'
                              ? 'bg-green-500/20 text-green-300'
                              : comm.status === 'failed'
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {comm.status}
                          </span>
                        </div>
                        {comm.subject && (
                          <p className="text-white font-medium mb-1">{comm.subject}</p>
                        )}
                        <p className="text-white/70 text-sm line-clamp-2">{comm.message_body}</p>
                        <p className="text-white/50 text-xs mt-2">
                          {new Date(comm.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Send Communication Modal */}
      {showSendModal && (
        <SendCommunicationModal
          guest={guest}
          channel={sendChannel}
          onClose={() => setShowSendModal(false)}
          onSuccess={handleSendSuccess}
        />
      )}
    </div>
  );
};

export default GuestProfile;

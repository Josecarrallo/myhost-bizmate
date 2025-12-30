import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Users, TrendingUp, Zap, Eye, ArrowRight, Lock } from 'lucide-react';
import { ConnectionStatusBox, FeatureCard } from './shared';
import guestCommunicationsService from '../../services/guestCommunicationsService';

/**
 * Overview - Main Guest Communications screen
 * Shows connection status, KPIs, and 3 main feature blocks
 */
const Overview = ({ onNavigate }) => {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [kpis, setKpis] = useState({
    totalGuests: 0,
    reachableEmail: 0,
    reachableWhatsApp: 0,
    aiConversations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load connection status
      const statusResult = await guestCommunicationsService.getConnectionStatus();
      if (statusResult.success) {
        setConnectionStatus({
          whatsapp: {
            connected: statusResult.data.whatsapp_connected,
            status: statusResult.data.whatsapp_status
          },
          email: {
            connected: statusResult.data.email_connected,
            status: statusResult.data.email_status
          }
        });
      }

      // Load KPIs (reusing existing service method)
      const statsResult = await guestCommunicationsService.getGuestStats();
      setKpis({
        totalGuests: statsResult.totalGuests,
        reachableEmail: statsResult.reachableEmail,
        reachableWhatsApp: statsResult.reachableWhatsApp,
        aiConversations: 42 // Mock for now
      });
    } catch (error) {
      console.error('Error loading overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with connection status */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-white text-3xl font-bold mb-2">Guest / Customer Communication</h2>
          <p className="text-white/70 text-lg">Manage how you talk to your guests via WhatsApp and Email</p>
        </div>
        {connectionStatus && (
          <ConnectionStatusBox
            whatsappStatus={connectionStatus.whatsapp}
            emailStatus={connectionStatus.email}
          />
        )}
      </div>

      {/* KPIs Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Guests */}
        <div className="bg-[#252b3b] rounded-xl p-5 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-white/60 text-xs uppercase tracking-wide">Guests in database</p>
              <p className="text-white text-2xl font-bold">{kpis.totalGuests.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Reachable via Email */}
        <div className="bg-[#252b3b] rounded-xl p-5 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Mail className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-white/60 text-xs uppercase tracking-wide">Reachable via Email</p>
              <p className="text-white text-2xl font-bold">{kpis.reachableEmail.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Reachable via WhatsApp */}
        <div className="bg-[#252b3b] rounded-xl p-5 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-500/20">
              <MessageSquare className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-white/60 text-xs uppercase tracking-wide">Reachable via WhatsApp</p>
              <p className="text-white text-2xl font-bold">{kpis.reachableWhatsApp.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* AI-assisted conversations */}
        <div className="bg-[#252b3b] rounded-xl p-5 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
            <div className="flex-1">
              <p className="text-white/60 text-xs uppercase tracking-wide">AI-assisted this month</p>
              <p className="text-white text-2xl font-bold">{kpis.aiConversations.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards - 3 Main Blocks */}
      <div className="space-y-6">
        {/* 1. WhatsApp Coexistence */}
        <FeatureCard
          icon={MessageSquare}
          title="WhatsApp Coexistence (Human + AI)"
          description="Use your existing WhatsApp Business number with automation and AI assistance"
          iconColor="#25D366"
          features={[
            'Send welcome messages before arrival.',
            'Offer airport pickup and drivers.',
            'Answer common questions with AI help.',
            'Send reminders during the stay and thank-you messages after check-out.'
          ]}
          primaryButton={{
            label: 'Setup WhatsApp Coexistence',
            icon: MessageSquare,
            onClick: () => onNavigate('whatsapp-setup')
          }}
          secondaryButton={{
            label: 'View WhatsApp message examples',
            icon: Eye,
            onClick: () => onNavigate('whatsapp-examples')
          }}
        />

        {/* 2. Email Communication & Campaigns */}
        <FeatureCard
          icon={Mail}
          title="Email Communication & Campaigns"
          description="Send confirmations, seasonal campaigns and follow-up emails from your hotel address"
          iconColor="#0078D4"
          features={[
            'Send booking confirmations with all details.',
            'Run seasonal and promotion campaigns.',
            'Fill low-occupancy dates with targeted emails.',
            'Send post-stay emails to ask for reviews and invite guests back.'
          ]}
          primaryButton={{
            label: 'Setup Email Communication',
            icon: Mail,
            onClick: () => onNavigate('email-setup')
          }}
          secondaryButton={{
            label: 'View email campaign examples',
            icon: Eye,
            onClick: () => onNavigate('email-examples')
          }}
        />

        {/* 3. Guest Journey Automations */}
        <FeatureCard
          icon={Zap}
          title="Guest Journey Automations (WhatsApp + Email)"
          description="Automate messages throughout the guest journey from booking to post-stay"
          iconColor="#d85a2a"
          features={null}
          primaryButton={{
            label: 'Configure full guest journey',
            icon: ArrowRight,
            onClick: () => onNavigate('journey')
          }}
          secondaryButton={null}
        >
          {/* Mini timeline inside the card */}
          <div className="bg-[#1a1f2e] rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#d85a2a] rounded-full mt-1.5"></div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">Booking</p>
                <p className="text-white/60 text-xs">Send booking confirmation (email)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#d85a2a] rounded-full mt-1.5"></div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">7 days before arrival</p>
                <p className="text-white/60 text-xs">Share Bali tips & how to get here (email)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#d85a2a] rounded-full mt-1.5"></div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">48 hours before</p>
                <p className="text-white/60 text-xs">Offer airport pickup (WhatsApp)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#d85a2a] rounded-full mt-1.5"></div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">Check-in day</p>
                <p className="text-white/60 text-xs">Send welcome message + Wi-Fi & breakfast times (WhatsApp)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-white/20 rounded-full mt-1.5"></div>
              <div className="flex-1">
                <p className="text-white/60 text-sm font-medium">During stay</p>
                <p className="text-white/40 text-xs">Promote spa / tours / late check-out (WhatsApp)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#d85a2a] rounded-full mt-1.5"></div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">After check-out</p>
                <p className="text-white/60 text-xs">Thank you & review request (email/WhatsApp)</p>
              </div>
            </div>
          </div>
        </FeatureCard>

        {/* BYOK Information Banner */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6 mt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-500/20 flex-shrink-0">
              <Lock className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-2">BYOK - Bring Your Own Key</h3>
              <p className="text-white/80 leading-relaxed">
                You use your own WhatsApp Business number and your own hotel email. We help you connect everything with Meta and Amazon step by step, and we only provide the tool so you can manage your messages and automations in one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;

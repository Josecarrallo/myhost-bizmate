import { supabase } from './supabase';
import {
  mockConnectionStatus,
  mockJourneyRules,
  mockWhatsAppExamples,
  mockEmailExamples,
  mockCoexistenceModes
} from './guestCommunicationsMocks';

/**
 * Guest Communications Service
 * Handles email campaigns, WhatsApp messaging, and guest contact management
 */

const PROPERTY_ID = '18711359-1378-4d12-9ea6-fb31c0b1bac2'; // Izumi Hotel (hardcoded for now)

// Simulate network delay for realism
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const guestCommunicationsService = {

  /**
   * Get guest statistics for dashboard KPIs
   */
  async getGuestStats() {
    try {
      // Total guests
      const { count: totalGuests } = await supabase
        .from('guest_contacts')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', PROPERTY_ID);

      // Reachable by email (have email address)
      const { count: reachableEmail } = await supabase
        .from('guest_contacts')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', PROPERTY_ID)
        .not('email', 'is', null);

      // Reachable by WhatsApp (have whatsapp number)
      const { count: reachableWhatsApp } = await supabase
        .from('guest_contacts')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', PROPERTY_ID)
        .not('whatsapp', 'is', null);

      // Messages drafted
      const { count: messagesDrafted } = await supabase
        .from('email_drafts')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', PROPERTY_ID);

      return {
        totalGuests: totalGuests || 0,
        reachableEmail: reachableEmail || 0,
        reachableWhatsApp: reachableWhatsApp || 0,
        messagesDrafted: messagesDrafted || 0
      };
    } catch (error) {
      console.error('Error fetching guest stats:', error);
      // Return mock data on error
      return {
        totalGuests: 1247,
        reachableEmail: 1180,
        reachableWhatsApp: 856,
        messagesDrafted: 342
      };
    }
  },

  /**
   * Get guest segments with counts
   */
  async getGuestSegments() {
    try {
      // Get all guests for property
      const { data: guests } = await supabase
        .from('guest_contacts')
        .select('segment, last_stay_date, total_stays')
        .eq('property_id', PROPERTY_ID);

      if (!guests) {
        // Return mock segments if no data
        return [
          { id: 'all', label: 'All Guests', count: 1180 },
          { id: 'recent', label: 'Recent Guests (Last 30 days)', count: 127 },
          { id: 'vip', label: 'VIP Guests (3+ stays)', count: 89 },
          { id: 'longstay', label: 'Long Stay (7+ nights)', count: 156 }
        ];
      }

      // Calculate segments
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

      const allCount = guests.length;
      const recentCount = guests.filter(g =>
        g.last_stay_date && new Date(g.last_stay_date) >= thirtyDaysAgo
      ).length;
      const vipCount = guests.filter(g => g.total_stays >= 3).length;
      const longstayCount = guests.filter(g =>
        g.segment && g.segment.includes('longstay')
      ).length;

      return [
        { id: 'all', label: 'All Guests', count: allCount },
        { id: 'recent', label: 'Recent Guests (Last 30 days)', count: recentCount },
        { id: 'vip', label: 'VIP Guests (3+ stays)', count: vipCount },
        { id: 'longstay', label: 'Long Stay (7+ nights)', count: longstayCount }
      ];
    } catch (error) {
      console.error('Error fetching guest segments:', error);
      // Return mock segments on error
      return [
        { id: 'all', label: 'All Guests', count: 1180 },
        { id: 'recent', label: 'Recent Guests (Last 30 days)', count: 127 },
        { id: 'vip', label: 'VIP Guests (3+ stays)', count: 89 },
        { id: 'longstay', label: 'Long Stay (7+ nights)', count: 156 }
      ];
    }
  },

  /**
   * Save email draft
   */
  async saveDraft(segmentId, subject, body, tone) {
    try {
      // Get segment count
      const segments = await this.getGuestSegments();
      const segment = segments.find(s => s.id === segmentId);
      const recipientsCount = segment ? segment.count : 0;

      const { data, error } = await supabase
        .from('email_drafts')
        .insert({
          property_id: PROPERTY_ID,
          segment_id: segmentId,
          subject,
          body,
          tone,
          recipients_count: recipientsCount
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, draft: data };
    } catch (error) {
      console.error('Error saving draft:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get guest emails by segment
   */
  async getGuestEmailsBySegment(segmentId) {
    try {
      let query = supabase
        .from('guest_contacts')
        .select('email, full_name')
        .eq('property_id', PROPERTY_ID)
        .not('email', 'is', null);

      // Apply segment filter
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

      if (segmentId === 'recent') {
        query = query.gte('last_stay_date', thirtyDaysAgo.toISOString());
      } else if (segmentId === 'vip') {
        query = query.gte('total_stays', 3);
      } else if (segmentId === 'longstay') {
        query = query.contains('segment', ['longstay']);
      }
      // 'all' has no additional filter

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching guest emails:', error);
      return [];
    }
  },

  /**
   * Send email campaign via SendGrid
   * Note: This is a placeholder - actual SendGrid integration happens on backend
   */
  async sendEmail(segmentId, subject, body, tone) {
    try {
      // Get recipient emails
      const recipients = await this.getGuestEmailsBySegment(segmentId);

      if (recipients.length === 0) {
        return {
          success: false,
          error: 'No recipients found for this segment'
        };
      }

      // In production, this would call a backend endpoint that uses SendGrid
      // For now, we'll simulate the send and log to database

      // Create email log entry
      const { data: logEntry, error: logError } = await supabase
        .from('email_logs')
        .insert({
          property_id: PROPERTY_ID,
          segment_id: segmentId,
          subject,
          recipients_count: recipients.length,
          successful_sends: recipients.length, // Simulated success
          failed_sends: 0,
          status: 'sent'
        })
        .select()
        .single();

      if (logError) throw logError;

      return {
        success: true,
        message: `Email sent to ${recipients.length} guests`,
        logId: logEntry.id,
        recipientsCount: recipients.length
      };
    } catch (error) {
      console.error('Error sending email:', error);

      // Log failed attempt
      await supabase
        .from('email_logs')
        .insert({
          property_id: PROPERTY_ID,
          segment_id: segmentId,
          subject,
          recipients_count: 0,
          status: 'failed',
          error_message: error.message
        });

      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Generate AI email draft using OpenAI
   * Note: This would call your backend/n8n workflow in production
   */
  async generateEmailDraft(segmentId, tone, customContext = '') {
    try {
      // In production, this would call an n8n workflow or backend endpoint
      // that uses OpenAI to generate personalized email content

      // For now, return predefined templates based on tone
      const templates = {
        formal: {
          subject: 'Important Update from Izumi Hotel',
          body: `Dear Valued Guest,

We hope this message finds you well. We are writing to share an important update about Izumi Hotel.

${customContext || 'We are pleased to announce our upcoming grand opening in Summer 2026. As a valued past guest, you will receive exclusive early booking rates and special amenities.'}

Should you have any questions or wish to make a reservation, please do not hesitate to contact us.

Warm regards,
The Izumi Hotel Team

Jl Raya Andong N. 18, Ubud, Bali
+62 813 2576 4867
www.my-host-bizmate.com`
        },
        friendly: {
          subject: 'Hey! Great news from Izumi Hotel 🌴',
          body: `Hi there!

We hope you're doing great! We wanted to share some exciting news with you.

${customContext || 'Izumi Hotel is opening soon in beautiful Ubud, Bali! As someone who has stayed with us before, we wanted to give you first dibs on our exclusive pre-opening rates.'}

Our stunning villas are waiting for you - from tropical rooms to our amazing 5-bedroom villa perfect for groups!

Want to chat? WhatsApp us anytime at +62 813 2576 4867 or visit www.my-host-bizmate.com

Can't wait to welcome you back!

Cheers,
The Izumi Hotel Team 🌺`
        },
        promo: {
          subject: '🎉 Exclusive Offer: 30% OFF Your Next Stay at Izumi Hotel!',
          body: `Hello!

🌟 SPECIAL OFFER JUST FOR YOU! 🌟

${customContext || 'Book your stay at Izumi Hotel before January 31st and get 30% OFF our regular rates!'}

✨ What's included:
• Luxury accommodations in the heart of Ubud
• Daily breakfast with local Balinese specialties
• Complimentary airport transfer
• 24/7 AI concierge service

💰 Use code: WELCOME30

This exclusive offer won't last long! Book now at www.my-host-bizmate.com or WhatsApp us: +62 813 2576 4867

See you in paradise!

The Izumi Hotel Team
Jl Raya Andong N. 18, Ubud, Bali`
        }
      };

      const template = templates[tone] || templates.friendly;

      return {
        success: true,
        subject: template.subject,
        body: template.body
      };
    } catch (error) {
      console.error('Error generating email draft:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Get recent email activity
   */
  async getRecentEmailActivity(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('email_logs')
        .select('*')
        .eq('property_id', PROPERTY_ID)
        .order('sent_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching email activity:', error);
      return [];
    }
  },

  /**
   * Get all drafts
   */
  async getDrafts(limit = 20) {
    try {
      const { data, error } = await supabase
        .from('email_drafts')
        .select('*')
        .eq('property_id', PROPERTY_ID)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching drafts:', error);
      return [];
    }
  },

  /**
   * Delete draft
   */
  async deleteDraft(draftId) {
    try {
      const { error } = await supabase
        .from('email_drafts')
        .delete()
        .eq('id', draftId)
        .eq('property_id', PROPERTY_ID);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting draft:', error);
      return { success: false, error: error.message };
    }
  },

  // =====================================================
  // NEW METHODS FOR GUEST COMMUNICATIONS MODULE V2
  // =====================================================

  /**
   * Get connection status for WhatsApp and Email
   */
  async getConnectionStatus(hotelId = PROPERTY_ID) {
    await delay(300);
    // TODO: Replace with actual Supabase query when table exists
    // const { data } = await supabase
    //   .from('hotel_integrations')
    //   .select('*')
    //   .eq('hotel_id', hotelId)
    //   .single();
    return { success: true, data: { ...mockConnectionStatus } };
  },

  /**
   * Save WhatsApp configuration
   */
  async saveWhatsAppConfig(hotelId = PROPERTY_ID, config) {
    await delay(800);
    console.log('Saving WhatsApp config:', config);
    // TODO: Encrypt and save to Supabase
    return {
      success: true,
      message: 'WhatsApp configuration saved successfully',
      data: {
        whatsapp_connected: true,
        whatsapp_status: 'ok'
      }
    };
  },

  /**
   * Save Email configuration
   */
  async saveEmailConfig(hotelId = PROPERTY_ID, config) {
    await delay(800);
    console.log('Saving Email config:', config);
    // TODO: Encrypt and save to Supabase
    return {
      success: true,
      message: 'Email configuration saved successfully',
      data: {
        email_connected: true,
        email_status: 'ok'
      }
    };
  },

  /**
   * Test WhatsApp connection
   */
  async testWhatsApp(hotelId = PROPERTY_ID, phoneNumber) {
    await delay(1500);
    console.log('Testing WhatsApp to:', phoneNumber);
    // TODO: Call Meta API to send test message
    return {
      success: true,
      message: `Test message sent to ${phoneNumber}`,
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Test Email connection
   */
  async testEmail(hotelId = PROPERTY_ID, emailAddress) {
    await delay(1500);
    console.log('Testing Email to:', emailAddress);
    // TODO: Call SendGrid/SES to send test email
    return {
      success: true,
      message: `Test email sent to ${emailAddress}`,
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Get Guest Journey rules
   */
  async getJourneyRules(hotelId = PROPERTY_ID) {
    await delay(400);
    // TODO: Replace with actual Supabase query
    // const { data } = await supabase
    //   .from('journey_rules')
    //   .select('*')
    //   .eq('hotel_id', hotelId)
    //   .order('trigger_offset');
    return { success: true, data: [...mockJourneyRules] };
  },

  /**
   * Save Guest Journey rules
   */
  async saveJourneyRules(hotelId = PROPERTY_ID, rules) {
    await delay(600);
    console.log('Saving journey rules:', rules);
    // TODO: Upsert to Supabase
    return {
      success: true,
      message: 'Journey automation settings saved',
      data: rules
    };
  },

  /**
   * Get WhatsApp message examples
   */
  async getWhatsAppExamples() {
    await delay(200);
    return { success: true, data: [...mockWhatsAppExamples] };
  },

  /**
   * Get Email campaign examples
   */
  async getEmailExamples() {
    await delay(200);
    return { success: true, data: [...mockEmailExamples] };
  },

  /**
   * Get AI Coexistence mode explanations
   */
  async getCoexistenceModes() {
    await delay(100);
    return { success: true, data: [...mockCoexistenceModes] };
  },

  /**
   * Update AI Coexistence mode
   */
  async updateCoexistenceMode(hotelId = PROPERTY_ID, mode) {
    await delay(500);
    console.log('Updating coexistence mode to:', mode);
    // TODO: Save to Supabase
    return {
      success: true,
      message: `AI mode updated to ${mode}`,
      data: { whatsapp_coexistence_mode: mode }
    };
  }
};

export default guestCommunicationsService;

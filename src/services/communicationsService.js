// Communications Service
// Handles email and WhatsApp communications to guests

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase.js';

const supabaseHeaders = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

// Message templates
const MESSAGE_TEMPLATES = {
  welcome: {
    subject: 'Welcome to {propertyName}!',
    body: `Dear {guestName},

Welcome to {propertyName}! We're thrilled to have you stay with us.

If you have any questions before your arrival, please don't hesitate to reach out.

Best regards,
{propertyName} Team`
  },
  pre_checkin: {
    subject: 'Your check-in is coming up!',
    body: `Hi {guestName},

We're excited to host you on {checkinDate}!

Check-in time: 2:00 PM
Check-out time: 11:00 AM

Please let us know if you need any special arrangements.

Best regards,
{propertyName} Team`
  },
  checkin_day: {
    subject: 'Welcome! Check-in instructions',
    body: `Hi {guestName},

Today is your check-in day! Here are your check-in instructions:

Address: {propertyAddress}
Check-in time: 2:00 PM
WiFi: (Will be provided upon arrival)

We look forward to welcoming you!

Best regards,
{propertyName} Team`
  },
  payment_reminder: {
    subject: 'Payment reminder for booking #{bookingId}',
    body: `Hi {guestName},

This is a friendly reminder about the pending payment for your upcoming stay:

Booking ID: #{bookingId}
Check-in: {checkinDate}
Amount due: {amountDue}

Please complete the payment at your earliest convenience.

Best regards,
{propertyName} Team`
  },
  review_request: {
    subject: 'How was your stay at {propertyName}?',
    body: `Hi {guestName},

Thank you for staying with us! We hope you had a wonderful experience.

We'd love to hear about your stay. Your feedback helps us improve and helps future guests make informed decisions.

Please take a moment to share your review.

Best regards,
{propertyName} Team`
  }
};

export const communicationsService = {
  /**
   * Get template content
   * @param {string} templateKey - Template identifier
   * @param {object} variables - Variables to replace in template
   * @returns {object} { subject, body }
   */
  getTemplate(templateKey, variables = {}) {
    const template = MESSAGE_TEMPLATES[templateKey];
    if (!template) {
      return { subject: '', body: '' };
    }

    let subject = template.subject;
    let body = template.body;

    // Replace variables
    Object.keys(variables).forEach(key => {
      const placeholder = `{${key}}`;
      subject = subject.replace(new RegExp(placeholder, 'g'), variables[key] || '');
      body = body.replace(new RegExp(placeholder, 'g'), variables[key] || '');
    });

    return { subject, body };
  },

  /**
   * Get all available templates
   * @returns {array} Array of template objects
   */
  getAvailableTemplates() {
    return [
      { key: 'welcome', label: 'Welcome Message' },
      { key: 'pre_checkin', label: 'Pre Check-in' },
      { key: 'checkin_day', label: 'Check-in Day Instructions' },
      { key: 'payment_reminder', label: 'Payment Reminder' },
      { key: 'review_request', label: 'Review Request' }
    ];
  },

  /**
   * Send communication (Email or WhatsApp)
   * @param {object} params - Communication parameters
   * @returns {object} Communication record
   */
  async sendCommunication(params) {
    const {
      tenantId,
      propertyId,
      guestId,
      bookingId,
      channel, // 'email' or 'whatsapp'
      templateKey,
      subject,
      message,
      recipientEmail,
      recipientPhone
    } = params;

    try {
      // 1. Save to communications_log
      const communicationData = {
        tenant_id: tenantId,
        property_id: propertyId,
        guest_id: guestId,
        booking_id: bookingId,
        channel,
        template_key: templateKey || null,
        recipient_email: recipientEmail,
        recipient_phone: recipientPhone,
        subject: channel === 'email' ? subject : null,
        message_body: message,
        status: 'queued',
        sent_by_user_id: tenantId,
        created_at: new Date().toISOString()
      };

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/communications_log`,
        {
          method: 'POST',
          headers: supabaseHeaders,
          body: JSON.stringify(communicationData)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save communication');
      }

      const savedComm = await response.json();
      const communicationId = savedComm[0].id;

      // 2. Trigger n8n webhook
      await this.triggerN8NWebhook({
        communicationId,
        tenantId,
        propertyId,
        guestId,
        bookingId,
        channel,
        templateKey,
        subject,
        message,
        recipient: channel === 'email' ? recipientEmail : recipientPhone
      });

      // 3. Update status to 'sent' (optimistic)
      await this.updateCommunicationStatus(communicationId, 'sent');

      return {
        success: true,
        communicationId,
        status: 'sent'
      };
    } catch (error) {
      console.error('Error sending communication:', error);
      throw error;
    }
  },

  /**
   * Trigger n8n webhook for communication
   * @param {object} payload - Webhook payload
   */
  async triggerN8NWebhook(payload) {
    const N8N_WEBHOOK_URL = `${import.meta.env.VITE_N8N_BASE_URL}/webhook/send-communication`;

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_N8N_API_KEY
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.warn('n8n webhook failed, but communication was logged');
      }

      return await response.json();
    } catch (error) {
      console.error('Error triggering n8n webhook:', error);
      // Don't throw - communication is saved even if webhook fails
    }
  },

  /**
   * Update communication status
   * @param {string} communicationId - Communication ID
   * @param {string} status - New status
   */
  async updateCommunicationStatus(communicationId, status) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/communications_log?id=eq.${communicationId}`,
      {
        method: 'PATCH',
        headers: supabaseHeaders,
        body: JSON.stringify({
          status,
          sent_at: status === 'sent' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update communication status');
    }

    return response.json();
  },

  /**
   * Get communications history for a guest
   * @param {string} tenantId - Tenant ID
   * @param {string} guestId - Guest ID
   * @param {number} limit - Number of records to fetch
   * @returns {array} Communications array
   */
  async getGuestCommunications(tenantId, guestId, limit = 50) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/communications_log?tenant_id=eq.${tenantId}&guest_id=eq.${guestId}&order=created_at.desc&limit=${limit}`,
      {
        headers: supabaseHeaders
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch communications');
    }

    return response.json();
  },

  /**
   * Get all communications for tenant
   * @param {string} tenantId - Tenant ID
   * @param {number} limit - Number of records to fetch
   * @returns {array} Communications array
   */
  async getAllCommunications(tenantId, limit = 100) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/communications_log?tenant_id=eq.${tenantId}&order=created_at.desc&limit=${limit}`,
      {
        headers: supabaseHeaders
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch communications');
    }

    return response.json();
  }
};

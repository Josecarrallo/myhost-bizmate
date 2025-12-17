/**
 * n8n Webhook Service
 *
 * Handles all integrations with n8n workflows on Railway
 * Base URL: https://n8n-production-bb2d.up.railway.app
 */

const N8N_BASE_URL = import.meta.env.VITE_N8N_BASE_URL;
const WEBHOOKS = {
  bookingConfirmation: import.meta.env.VITE_N8N_WEBHOOK_BOOKING_CONFIRMATION,
  staffNotification: import.meta.env.VITE_N8N_WEBHOOK_STAFF_NOTIFICATION,
  whatsappChatbot: import.meta.env.VITE_N8N_WEBHOOK_WHATSAPP_CHATBOT,
};

/**
 * Log workflow execution to console and Supabase
 */
const logWorkflow = async (workflowName, status, data, error = null) => {
  const log = {
    workflow: workflowName,
    status,
    timestamp: new Date().toISOString(),
    data: data ? JSON.stringify(data, null, 2) : null,
    error: error ? error.message : null,
  };

  console.log(`[n8n Workflow] ${workflowName}:`, log);

  // Save to Supabase workflow_logs table
  try {
    // Dynamic import to avoid circular dependencies
    const { supabase } = await import('../lib/supabase');

    const { error: dbError } = await supabase
      .from('workflow_logs')
      .insert([{
        workflow_name: workflowName,
        status: status,
        payload: data?.payload || null,
        response: data?.result || null,
        error_message: error ? error.message : null,
      }]);

    if (dbError) {
      console.error('[n8n] Failed to save log to Supabase:', dbError);
    }
  } catch (dbError) {
    console.error('[n8n] Error saving log:', dbError);
  }

  return log;
};

/**
 * Trigger n8n webhook
 */
const triggerWebhook = async (webhookPath, payload, workflowName) => {
  const url = `${N8N_BASE_URL}${webhookPath}`;

  try {
    console.log(`[n8n] Triggering ${workflowName}...`, { url, payload });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json().catch(() => ({ success: true }));

    await logWorkflow(workflowName, 'success', { payload, result });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error(`[n8n] Error in ${workflowName}:`, error);
    await logWorkflow(workflowName, 'error', { payload }, error);

    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Trigger Booking Confirmation Workflow
 *
 * Sends booking confirmation via:
 * - Email (SendGrid)
 * - WhatsApp to guest
 * - WhatsApp to property owner
 *
 * @param {Object} booking - Booking data
 * @param {string} booking.property_id - Property UUID
 * @param {string} booking.guest_email - Guest email
 * @param {string} booking.guest_name - Guest name
 * @param {string} booking.guest_phone - Guest phone (with country code, no +)
 * @param {string} booking.check_in - Check-in date (YYYY-MM-DD)
 * @param {string} booking.check_out - Check-out date (YYYY-MM-DD)
 * @param {number} booking.guests_count - Number of guests
 * @param {number} booking.total_amount - Total booking amount
 */
export const triggerBookingConfirmation = async (booking) => {
  const payload = {
    property_id: booking.property_id,
    guest_email: booking.guest_email,
    guest_name: booking.guest_name,
    guest_phone: booking.guest_phone.replace(/[^0-9]/g, ''), // Remove all non-digits
    check_in: booking.check_in,
    check_out: booking.check_out,
    guests_count: booking.guests_count || booking.guests,
    total_amount: booking.total_amount || booking.total_price,
  };

  return triggerWebhook(
    WEBHOOKS.bookingConfirmation,
    payload,
    'Booking Confirmation'
  );
};

/**
 * Trigger Staff Notification Workflow
 *
 * Notifies staff of new booking via:
 * - WhatsApp to staff
 * - WhatsApp confirmation to guest
 *
 * @param {Object} booking - Full booking record from Supabase
 */
export const triggerStaffNotification = async (booking) => {
  const payload = {
    body: {
      record: {
        id: booking.id,
        guest_name: booking.guest_name,
        guest_email: booking.guest_email,
        guest_phone: booking.guest_phone.replace(/[^0-9]/g, ''),
        check_in: booking.check_in,
        check_out: booking.check_out,
        guests: booking.guests_count || booking.guests,
        total_price: booking.total_amount || booking.total_price,
        status: booking.status || 'confirmed',
        channel: booking.channel || 'direct',
        created_at: booking.created_at || new Date().toISOString(),
        property_id: booking.property_id,
      },
    },
  };

  return triggerWebhook(
    WEBHOOKS.staffNotification,
    payload,
    'Staff Notification'
  );
};

/**
 * Trigger WhatsApp Chatbot Workflow
 *
 * Sends message to WhatsApp AI chatbot
 *
 * @param {Object} message - WhatsApp message data
 */
export const triggerWhatsAppChatbot = async (message) => {
  return triggerWebhook(
    WEBHOOKS.whatsappChatbot,
    message,
    'WhatsApp Chatbot'
  );
};

/**
 * Check if n8n is configured
 */
export const isN8nConfigured = () => {
  return !!(N8N_BASE_URL && WEBHOOKS.bookingConfirmation);
};

/**
 * Get n8n configuration info
 */
export const getN8nInfo = () => {
  return {
    baseUrl: N8N_BASE_URL,
    webhooks: WEBHOOKS,
    configured: isN8nConfigured(),
  };
};

export default {
  triggerBookingConfirmation,
  triggerStaffNotification,
  triggerWhatsAppChatbot,
  isN8nConfigured,
  getN8nInfo,
};

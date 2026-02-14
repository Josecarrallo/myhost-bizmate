/**
 * n8n Workflow Service
 *
 * Handles all integrations with n8n workflows on Railway
 * Base URL: https://n8n-production-bb2d.up.railway.app
 * Uses n8n REST API for workflow execution
 */

const N8N_URL = 'https://n8n-production-bb2d.up.railway.app';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMmNkZWVjOC0xM2U0LTQzYTQtODAzYS0zOTU2NmIzYzRiNDAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY2MjA5ODE0LCJleHAiOjE3Njg3OTg4MDB9.tEOyZs1H0W4hw9jTiCuE5uAhmcDgn3fZKfSZZOITPlM';

// Workflow IDs from n8n instance
export const WORKFLOWS = {
  NEW_PROPERTY: '6eqkTXvYQLdsazdC',
  BOOKING_CONFIRMATION: 'OxNTDO0yitqV6MAL',
  BOOKING_CONFIRMATION_2: 'F8YPuLhcNe6wGcCv',
  WHATSAPP_AI_AGENT: 'ln2myAS3406D6F8W',
  VAPI_VOICE_ASSISTANT: '3sU4RgV892az8nLZ',
  CHANNEL_MANAGER: 'hvXxsxJhU1cuq6q3',
  RECOMENDACIONES_AI: '8xWqs3rlUZmSf8gc'
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
 * Webhook paths for each workflow
 */
const WEBHOOK_PATHS = {
  [WORKFLOWS.NEW_PROPERTY]: 'new_property',
  [WORKFLOWS.BOOKING_CONFIRMATION]: 'booking-created',
  [WORKFLOWS.BOOKING_CONFIRMATION_2]: 'booking-created-2',
  [WORKFLOWS.WHATSAPP_AI_AGENT]: 'whatsapp-webhook',
};

/**
 * Execute n8n workflow via Webhook
 */
const executeWorkflow = async (workflowId, payload, workflowName) => {
  // Get webhook path or use workflow ID as fallback
  const webhookPath = WEBHOOK_PATHS[workflowId] || workflowId;
  const url = `${N8N_URL}/webhook/${webhookPath}`;

  try {
    console.log(`[n8n] Executing ${workflowName} via webhook: ${url}`, { payload });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Workflow execution failed: ${response.status} ${response.statusText}`);
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

// =====================================================
// PROPERTY WORKFLOWS
// =====================================================

/**
 * Trigger New Property Workflow
 * Executes when a new property is created
 *
 * @param {Object} property - Property data from Supabase
 */
export const onPropertyCreated = async (property) => {
  const payload = {
    property_id: property.id,
    property_name: property.name,
    description: property.description,
    location: `${property.city}, ${property.country}`,
    address: property.address,
    city: property.city,
    country: property.country,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    max_guests: property.max_guests,
    base_price: property.base_price,
    currency: property.currency,
    status: property.status,
    created_at: property.created_at || new Date().toISOString()
  };

  return executeWorkflow(
    WORKFLOWS.NEW_PROPERTY,
    payload,
    'New Property Created'
  );
};

/**
 * Trigger Property Update Workflow (Channel Manager)
 * Syncs property updates to all channels
 *
 * @param {Object} property - Updated property data
 */
export const onPropertyUpdated = async (property) => {
  const payload = {
    event: 'property.updated',
    property: {
      id: property.id,
      name: property.name,
      description: property.description,
      base_price: property.base_price,
      status: property.status,
      updated_at: property.updated_at || new Date().toISOString()
    }
  };

  return executeWorkflow(
    WORKFLOWS.CHANNEL_MANAGER,
    payload,
    'Property Updated - Channel Sync'
  );
};

/**
 * Trigger Property Deletion Workflow (Channel Manager)
 * Removes property from all channels
 *
 * @param {Object} property - Property data being deleted
 */
export const onPropertyDeleted = async (property) => {
  const payload = {
    event: 'property.deleted',
    property: {
      id: property.id,
      name: property.name,
      deleted_at: new Date().toISOString()
    }
  };

  return executeWorkflow(
    WORKFLOWS.CHANNEL_MANAGER,
    payload,
    'Property Deleted - Channel Sync'
  );
};

// =====================================================
// BOOKING WORKFLOWS
// =====================================================

/**
 * Trigger Booking Confirmation Workflow
 *
 * Sends booking confirmation via:
 * - Email (SendGrid)
 * - WhatsApp to guest
 * - WhatsApp to property owner
 *
 * @param {Object} booking - Booking data
 */
export const onBookingCreated = async (booking) => {
  const payload = {
    event: 'booking.created',
    booking: {
      id: booking.id,
      property_id: booking.property_id,
      guest_email: booking.guest_email,
      guest_name: booking.guest_name,
      guest_phone: booking.guest_phone?.replace(/[^0-9]/g, ''),
      check_in: booking.check_in,
      check_out: booking.check_out,
      number_of_guests: booking.number_of_guests || booking.guests_count || booking.guests,
      total_price: booking.total_price || booking.total_amount,
      status: booking.status,
      created_at: booking.created_at || new Date().toISOString()
    }
  };

  return executeWorkflow(
    WORKFLOWS.BOOKING_CONFIRMATION,
    payload,
    'Booking Confirmation'
  );
};

/**
 * Trigger Booking Update Workflow
 * Notifies guest and staff of booking changes
 *
 * @param {Object} booking - Updated booking data
 */
export const onBookingUpdated = async (booking) => {
  const payload = {
    event: 'booking.updated',
    booking: {
      id: booking.id,
      property_id: booking.property_id,
      guest_email: booking.guest_email,
      guest_name: booking.guest_name,
      guest_phone: booking.guest_phone?.replace(/[^0-9]/g, ''),
      check_in: booking.check_in,
      check_out: booking.check_out,
      status: booking.status,
      updated_at: booking.updated_at || new Date().toISOString()
    }
  };

  return executeWorkflow(
    WORKFLOWS.BOOKING_CONFIRMATION_2,
    payload,
    'Booking Updated'
  );
};

/**
 * Trigger Booking Cancellation Workflow
 * Handles booking cancellations and refunds
 *
 * @param {Object} booking - Booking data being cancelled
 */
export const onBookingCancelled = async (booking) => {
  const payload = {
    event: 'booking.cancelled',
    booking: {
      id: booking.id,
      property_id: booking.property_id,
      guest_email: booking.guest_email,
      guest_name: booking.guest_name,
      guest_phone: booking.guest_phone?.replace(/[^0-9]/g, ''),
      check_in: booking.check_in,
      check_out: booking.check_out,
      total_price: booking.total_price || booking.total_amount,
      cancelled_at: new Date().toISOString(),
      cancellation_reason: booking.cancellation_reason || 'Guest request'
    }
  };

  return executeWorkflow(
    WORKFLOWS.BOOKING_CONFIRMATION_2,
    payload,
    'Booking Cancelled'
  );
};

// =====================================================
// MESSAGING WORKFLOWS
// =====================================================

/**
 * Trigger WhatsApp AI Agent Workflow
 * Sends message to WhatsApp AI Agent for processing
 *
 * @param {Object} message - WhatsApp message data
 */
export const onWhatsAppMessage = async (message) => {
  const payload = {
    event: 'whatsapp.message',
    message: {
      from: message.from,
      to: message.to,
      text: message.text,
      timestamp: message.timestamp || new Date().toISOString(),
      conversation_id: message.conversation_id,
      guest_name: message.guest_name,
      property_id: message.property_id
    }
  };

  return executeWorkflow(
    WORKFLOWS.WHATSAPP_AI_AGENT,
    payload,
    'WhatsApp AI Message'
  );
};

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Check if n8n is configured
 */
export const isN8nConfigured = () => {
  return !!(N8N_URL && N8N_API_KEY);
};

/**
 * Get n8n configuration info
 */
export const getN8nInfo = () => {
  return {
    baseUrl: N8N_URL,
    apiKey: N8N_API_KEY ? '***configured***' : null,
    workflows: WORKFLOWS,
    configured: isN8nConfigured(),
  };
};

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  // Property workflows
  onPropertyCreated,
  onPropertyUpdated,
  onPropertyDeleted,

  // Booking workflows
  onBookingCreated,
  onBookingUpdated,
  onBookingCancelled,

  // Messaging workflows
  onWhatsAppMessage,

  // Utilities
  isN8nConfigured,
  getN8nInfo,
  WORKFLOWS,
};

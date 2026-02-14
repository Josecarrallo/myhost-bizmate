/**
 * Mock data for Workflows & Automations module
 * Used for UI development before backend integration
 */

export const PROPERTY_ID = '18711359-1378-4d12-9ea6-fb31c0b1bac2'; // Izumi Hotel

// Statistics mock data
export const mockStats = {
  activeWorkflows: 3,
  totalExecutions: 348,
  timeSaved: "24h",
  successRate: 98
};

// Recent activity feed
export const mockRecentActivity = [
  {
    id: 1,
    workflow: "Booking Confirmation",
    workflow_key: "booking_confirmation",
    status: "success",
    time: "2 min ago",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    details: "Email sent to john@email.com",
    icon: "CheckCircle"
  },
  {
    id: 2,
    workflow: "WhatsApp Concierge",
    workflow_key: "whatsapp_concierge",
    status: "success",
    time: "5 min ago",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    details: "Replied to +1234567890",
    icon: "MessageSquare"
  },
  {
    id: 3,
    workflow: "Voice AI",
    workflow_key: "voice_receptionist",
    status: "success",
    time: "1 hour ago",
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    details: "Call handled - New booking inquiry",
    icon: "Phone"
  },
  {
    id: 4,
    workflow: "Sync Availability",
    workflow_key: "sync_availability",
    status: "error",
    time: "2 hours ago",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    details: "Channel manager timeout",
    icon: "RefreshCw"
  },
  {
    id: 5,
    workflow: "Booking Confirmation",
    workflow_key: "booking_confirmation",
    status: "success",
    time: "3 hours ago",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    details: "WhatsApp sent to +62812345678",
    icon: "CheckCircle"
  },
  {
    id: 6,
    workflow: "WhatsApp Concierge",
    workflow_key: "whatsapp_concierge",
    status: "success",
    time: "4 hours ago",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    details: "Answered pool hours question",
    icon: "MessageSquare"
  },
  {
    id: 7,
    workflow: "Voice AI",
    workflow_key: "voice_receptionist",
    status: "success",
    time: "5 hours ago",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    details: "Transferred call to manager",
    icon: "Phone"
  },
  {
    id: 8,
    workflow: "Booking Confirmation",
    workflow_key: "booking_confirmation",
    status: "success",
    time: "6 hours ago",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    details: "Email sent to sarah@email.com",
    icon: "CheckCircle"
  }
];

// Workflow settings initial state
export const mockWorkflowSettings = [
  {
    id: '1',
    property_id: PROPERTY_ID,
    workflow_key: 'whatsapp_concierge',
    is_active: true,
    last_executed_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    execution_count: 145,
    settings: {},
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    property_id: PROPERTY_ID,
    workflow_key: 'voice_receptionist',
    is_active: true,
    last_executed_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    execution_count: 89,
    settings: {},
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    property_id: PROPERTY_ID,
    workflow_key: 'booking_confirmation',
    is_active: true,
    last_executed_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    execution_count: 114,
    settings: {},
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    property_id: PROPERTY_ID,
    workflow_key: 'daily_recommendations',
    is_active: false,
    last_executed_at: null,
    execution_count: 0,
    settings: {},
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export default {
  mockStats,
  mockRecentActivity,
  mockWorkflowSettings,
  PROPERTY_ID
};

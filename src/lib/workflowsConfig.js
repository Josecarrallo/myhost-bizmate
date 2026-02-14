/**
 * Workflows & Automations Configuration
 * Defines all available workflows, quick actions, and scheduled tasks
 */

// Automated Workflows - Can be toggled ON/OFF
export const automatedWorkflows = [
  {
    key: "whatsapp_concierge",
    name: "WhatsApp AI Concierge",
    description: "AI assistant responds to WhatsApp messages 24/7",
    icon: "MessageSquare",
    color: "green",
    defaultActive: true,
  },
  {
    key: "voice_receptionist",
    name: "Voice AI Receptionist",
    description: "AI handles phone calls and takes reservations",
    icon: "Phone",
    color: "blue",
    defaultActive: true,
  },
  {
    key: "booking_confirmation",
    name: "Booking Confirmation",
    description: "Automatically sends email & WhatsApp when booking is created",
    icon: "CheckCircle",
    color: "emerald",
    defaultActive: true,
  },
  {
    key: "daily_recommendations",
    name: "Daily Guest Recommendations",
    description: "Sends personalized recommendations to in-house guests every morning",
    icon: "Sparkles",
    color: "purple",
    defaultActive: false,
  }
];

// Quick Actions - Manual execution
export const quickActions = [
  {
    key: "whatsapp_ai_agent",
    name: "WhatsApp AI Agent",
    description: "Test WhatsApp AI from your mobile phone",
    icon: "MessageSquare",
    color: "green",
    webhook: "whatsapp-ai-agent",
    requiresInput: false,
  },
  {
    key: "voice_ai_agent",
    name: "Voice AI Agent",
    description: "Test Talk to Ayu",
    icon: "Phone",
    color: "blue",
    webhook: "voice-ai-agent",
    requiresInput: false,
  },
  {
    key: "send_welcome_email",
    name: "Send Welcome Email",
    description: "Send welcome email to a specific guest",
    icon: "Mail",
    color: "orange",
    webhook: "send-welcome-email",
    requiresInput: true,
    inputFields: [
      { name: "booking_id", label: "Select Booking", type: "booking_select" }
    ],
  },
  {
    key: "generate_occupancy_report",
    name: "Generate Occupancy Report",
    description: "Generate PDF report of occupancy for selected dates",
    icon: "BarChart3",
    color: "blue",
    webhook: "generate-occupancy-report",
    requiresInput: true,
    inputFields: [
      { name: "start_date", label: "Start Date", type: "date" },
      { name: "end_date", label: "End Date", type: "date" }
    ],
  },
  {
    key: "sync_availability",
    name: "Sync Availability",
    description: "Manually sync room availability across all channels",
    icon: "RefreshCw",
    color: "teal",
    webhook: "sync-availability",
    requiresInput: false,
  },
  {
    key: "send_promo_campaign",
    name: "Send Promo Campaign",
    description: "Send promotional offer to past guests",
    icon: "Megaphone",
    color: "pink",
    webhook: "send-promo-campaign",
    requiresInput: true,
    inputFields: [
      {
        name: "campaign_type",
        label: "Campaign Type",
        type: "select",
        options: ["Last 30 days guests", "Last 90 days guests", "VIP guests"]
      },
      { name: "discount_percent", label: "Discount %", type: "number" }
    ],
  }
];

// Scheduled Tasks - Display only
export const scheduledTasks = [
  {
    key: "weekly_revenue_report",
    name: "Weekly Revenue Report",
    description: "Sends revenue summary every Monday at 9:00 AM",
    icon: "Calendar",
    color: "indigo",
    schedule: "Every Monday, 9:00 AM",
    nextRun: "2025-01-06 09:00",
  },
  {
    key: "social_media_post",
    name: "Social Media Auto-Post",
    description: "Publishes scheduled content to Instagram/Facebook",
    icon: "Share2",
    color: "rose",
    schedule: "Daily, 10:00 AM",
    nextRun: "2025-12-31 10:00",
  }
];

// Color mappings for workflow types
export const workflowColors = {
  green: "bg-green-500/10 text-green-500 border-green-500/20",
  blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  pink: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  teal: "bg-teal-500/10 text-teal-500 border-teal-500/20",
  indigo: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  rose: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

export default {
  automatedWorkflows,
  quickActions,
  scheduledTasks,
  workflowColors
};

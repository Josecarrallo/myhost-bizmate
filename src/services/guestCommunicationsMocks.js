/**
 * Mock data for Guest Communications module
 * Used for UI development before backend integration
 */

const PROPERTY_ID = '18711359-1378-4d12-9ea6-fb31c0b1bac2'; // Izumi Hotel

// Connection status mock
export const mockConnectionStatus = {
  whatsapp_connected: false,
  whatsapp_waba_id: null,
  whatsapp_phone_number_id: null,
  whatsapp_access_token: null,
  whatsapp_coexistence_mode: 'assist', // 'auto' | 'assist' | 'human'
  whatsapp_status: 'unknown', // 'unknown' | 'ok' | 'warning' | 'error'

  email_connected: true,
  email_provider: 'ses', // 'sendgrid' | 'ses'
  email_sender: 'noreply@izumihotel.com',
  email_domain: 'izumihotel.com',
  email_region: 'ap-southeast-1', // Singapore region (closest to Bali)
  email_access_key_id: 'AKIA**********************',
  email_secret_access_key: '****************************************',
  email_status: 'ok'
};

// Guest Journey rules mock
export const mockJourneyRules = [
  {
    id: '1',
    stage: 'booking',
    enabled: true,
    channels: ['email'],
    description: 'Send booking confirmation with all details',
    template_name: 'Booking Confirmation',
    trigger_offset: 0,
    trigger_unit: 'immediate'
  },
  {
    id: '2',
    stage: 'seven_days_before',
    enabled: true,
    channels: ['email'],
    description: 'Share Bali tips & how to get here',
    template_name: 'Pre-Arrival Tips',
    trigger_offset: -7,
    trigger_unit: 'days'
  },
  {
    id: '3',
    stage: 'forty_eight_hours_before',
    enabled: true,
    channels: ['whatsapp'],
    description: 'Offer airport pickup and confirm arrival time',
    template_name: 'Airport Pickup Offer',
    trigger_offset: -48,
    trigger_unit: 'hours'
  },
  {
    id: '4',
    stage: 'check_in_day',
    enabled: true,
    channels: ['whatsapp'],
    description: 'Welcome message + Wi-Fi + breakfast times',
    template_name: 'Welcome Message',
    trigger_offset: 0,
    trigger_unit: 'check_in'
  },
  {
    id: '5',
    stage: 'during_stay',
    enabled: false,
    channels: ['whatsapp'],
    description: 'Promote spa, tours, and late check-out',
    template_name: 'During Stay Promotions',
    trigger_offset: 1,
    trigger_unit: 'days_after_checkin'
  },
  {
    id: '6',
    stage: 'check_out',
    enabled: true,
    channels: ['whatsapp'],
    description: 'Check-out reminder and thanks for staying',
    template_name: 'Check-out Thanks',
    trigger_offset: 0,
    trigger_unit: 'check_out'
  },
  {
    id: '7',
    stage: 'three_days_after',
    enabled: true,
    channels: ['email'],
    description: 'Thank you + ask for review on Google/TripAdvisor',
    template_name: 'Review Request',
    trigger_offset: 3,
    trigger_unit: 'days_after_checkout'
  },
  {
    id: '8',
    stage: 'thirty_days_after',
    enabled: false,
    channels: ['email'],
    description: 'Invite to come back with a special offer',
    template_name: 'Come Back Offer',
    trigger_offset: 30,
    trigger_unit: 'days_after_checkout'
  }
];

// WhatsApp message examples
export const mockWhatsAppExamples = [
  {
    id: '1',
    title: 'Welcome Message (Pre-Arrival)',
    use_case: 'Sent 48 hours before arrival',
    message: `Hi John! 👋

We're excited to welcome you to Izumi Hotel in 2 days!

🛬 Airport pickup available for $25 USD
🕐 Check-in: 2:00 PM onwards
📍 Location: Jl Raya Andong N. 18, Ubud

Need help with anything before arrival?

The Izumi Team 🌺`,
    channel: 'whatsapp',
    stage: 'pre_arrival'
  },
  {
    id: '2',
    title: 'Check-In Day Info',
    use_case: 'Sent on check-in morning',
    message: `Good morning John! ☀️

Welcome day is here! Quick info:

📶 WiFi: IzumiGuest / Password: Bali2025
🍳 Breakfast: 7:00 AM - 11:00 AM
🏊 Pool: Open 24/7
🔑 Your room will be ready at 2:00 PM

See you soon! 🌴`,
    channel: 'whatsapp',
    stage: 'check_in'
  },
  {
    id: '3',
    title: 'During Stay - Spa Promotion',
    use_case: 'Optional promo during stay',
    message: `Hi John! 🧘

Enjoying your stay?

💆 Special offer for guests:
Traditional Balinese Massage - 20% OFF
Valid until tomorrow

Book at reception or reply here!

Izumi Spa Team`,
    channel: 'whatsapp',
    stage: 'during_stay'
  },
  {
    id: '4',
    title: 'Check-Out Reminder',
    use_case: 'Sent on check-out morning',
    message: `Good morning John!

Check-out is at 12:00 PM today.

Need late check-out? (+$15/hour)
Need airport transfer? ($25)

Just reply to this message!

Thank you for staying with us 🙏`,
    channel: 'whatsapp',
    stage: 'check_out'
  },
  {
    id: '5',
    title: 'FAQ - Wi-Fi Password',
    use_case: 'Auto-response to common question',
    message: `🤖 AI Assistant

WiFi Network: IzumiGuest
Password: Bali2025

Having connection issues? Our team can help!`,
    channel: 'whatsapp',
    stage: 'faq_auto'
  },
  {
    id: '6',
    title: 'FAQ - Directions',
    use_case: 'Auto-response with location',
    message: `🤖 AI Assistant

📍 Izumi Hotel Location:
Jl Raya Andong N. 18, Ubud, Bali

Google Maps: [Link]

From airport: ~1.5 hours
We offer pickup service for $25 USD

Need a driver? Let me know!`,
    channel: 'whatsapp',
    stage: 'faq_auto'
  }
];

// Email examples
export const mockEmailExamples = [
  {
    id: '1',
    title: 'Booking Confirmation',
    use_case: 'Sent immediately after booking',
    subject: 'Your Izumi Hotel Booking is Confirmed! 🌴',
    preview: 'Thank you for choosing Izumi Hotel! Here are your booking details...',
    type: 'transactional',
    body: `Dear John Smith,

Thank you for booking with Izumi Hotel!

BOOKING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Confirmation #: IZU-2025-1234
Check-in: March 15, 2025 (2:00 PM)
Check-out: March 20, 2025 (12:00 PM)
Room: Tropical Garden Room
Guests: 2 Adults
Total: $450.00 USD

WHAT'S INCLUDED
✓ Daily breakfast for 2
✓ Free WiFi
✓ Pool access
✓ Airport pickup available ($25)

See you soon in paradise!

The Izumi Hotel Team
Jl Raya Andong N. 18, Ubud, Bali
+62 813 2576 4867`
  },
  {
    id: '2',
    title: 'Pre-Arrival Tips',
    use_case: 'Sent 7 days before arrival',
    subject: 'Getting Ready for Bali - Izumi Hotel Tips 🌺',
    preview: 'Your Bali adventure starts in 7 days! Here\'s everything you need to know...',
    type: 'transactional',
    body: `Hi John!

Your Bali getaway is just 7 days away! Here are some tips:

BEFORE YOU FLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✈️ Visa on Arrival: $35 USD (30 days)
💵 Currency: Indonesian Rupiah (IDR)
🔌 Plugs: Type C/F (European, 220V)

WEATHER & PACKING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌤️ March: 28-32°C, occasional rain
👗 Light clothing, sunscreen, hat
🏊 Don't forget swimwear!

GETTING TO IZUMI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛬 Ngurah Rai Airport → Ubud (1.5 hrs)
🚗 Airport pickup: $25 USD (book in advance)

Questions? Just reply to this email!

See you soon,
The Izumi Team`
  },
  {
    id: '3',
    title: 'Post-Stay Review Request',
    use_case: 'Sent 3 days after checkout',
    subject: 'How was your stay at Izumi Hotel? 🌟',
    preview: 'We hope you enjoyed your time in Bali! Your feedback means the world to us...',
    type: 'transactional',
    body: `Dear John,

Thank you for staying with us at Izumi Hotel!

We hope you had an amazing time in Bali. Your feedback helps us improve and helps other travelers discover Izumi.

Would you mind sharing your experience?

[Review us on Google] [Review on TripAdvisor]

As a thank you, here's 15% OFF your next booking!
Code: WELCOME_BACK_2025
Valid until: December 31, 2025

We'd love to see you again!

Warm regards,
The Izumi Hotel Team`
  },
  {
    id: '4',
    title: 'Seasonal Campaign - Low Season Offer',
    use_case: 'Campaign to fill low-occupancy dates',
    subject: '🎉 Flash Sale: 40% OFF April Stays at Izumi Hotel',
    preview: 'Escape to Bali this April! Limited-time offer for our valued guests...',
    type: 'campaign',
    body: `FLASH SALE - 48 HOURS ONLY! ⚡

40% OFF April Stays
At Izumi Hotel, Ubud

Why April in Bali?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌤️ Perfect weather (less rain!)
🎭 Balinese New Year celebrations
🏖️ Fewer tourists = better experience
💰 Best prices of the year

OFFER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ 40% OFF all room types
✓ Free daily breakfast
✓ Free airport pickup
✓ Late checkout (subject to availability)

Use code: APRIL40
Valid for stays: April 1-30, 2025
Book by: March 5, 2025

[BOOK NOW] [View Availability]

Limited rooms available!

The Izumi Hotel Team
Ubud's Hidden Paradise 🌴`
  },
  {
    id: '5',
    title: 'Come Back Offer - 30 Days After',
    use_case: 'Re-engagement campaign',
    subject: 'We miss you, John! Special offer inside 💙',
    preview: 'It\'s been a month since your visit. Ready for another Bali escape?',
    type: 'campaign',
    body: `Hi John! 👋

Missing Bali yet?

We certainly miss having you at Izumi Hotel!

YOUR EXCLUSIVE OFFER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
25% OFF your next stay
+ Free room upgrade (subject to availability)
+ Complimentary spa session

Use code: JOHN_WELCOMEBACK
Valid for 60 days

[Book Your Return] [Check Availability]

Can't travel soon? Forward this to a friend!
They'll get 20% OFF their first booking.

Hope to see you again soon!

The Izumi Family 🌺`
  },
  {
    id: '6',
    title: 'Birthday Campaign',
    use_case: 'Personalized birthday offer',
    subject: '🎂 Happy Birthday, John! Gift from Izumi Hotel',
    preview: 'Celebrate your special day in Bali! We have a birthday surprise for you...',
    type: 'campaign',
    body: `HAPPY BIRTHDAY, JOHN! 🎉🎂

From all of us at Izumi Hotel!

YOUR BIRTHDAY GIFT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎁 Free night when you book 3+ nights
🎁 Complimentary birthday cake
🎁 Bottle of wine in your room
🎁 Late checkout (4:00 PM)

Valid for 30 days from your birthday!
Use code: BDAY_JOHN

[Celebrate in Bali] [View Rooms]

Make your birthday unforgettable in paradise!

With love,
The Izumi Hotel Team 💙`
  }
];

// AI Coexistence modes
export const mockCoexistenceModes = [
  {
    id: 'auto',
    name: 'Auto Mode',
    icon: '🤖',
    description: 'AI responds automatically to common questions',
    features: [
      'Answers FAQs instantly (WiFi, hours, location)',
      'Sends automated journey messages',
      'Escalates complex questions to humans',
      'Works 24/7, even when you sleep'
    ],
    limitations: [
      'Only handles pre-approved question types',
      'Cannot make booking changes',
      'Cannot process payments'
    ],
    recommended_for: 'Hotels with high message volume and simple inquiries'
  },
  {
    id: 'assist',
    name: 'Assist Mode',
    icon: '🤝',
    description: 'AI suggests responses, human approves and sends',
    features: [
      'AI drafts responses in real-time',
      'Human can edit before sending',
      'Learns from your edits',
      'Best of both worlds'
    ],
    limitations: [
      'Requires human to be available',
      'Slightly slower response time'
    ],
    recommended_for: 'Hotels new to AI or with complex guest needs'
  },
  {
    id: 'human',
    name: 'Human Only',
    icon: '👤',
    description: 'Only humans respond, AI just listens and learns',
    features: [
      'Full human control',
      'AI analyzes conversations for insights',
      'Helps train AI for future',
      'No auto-responses'
    ],
    limitations: [
      'No 24/7 coverage',
      'Higher workload for staff'
    ],
    recommended_for: 'Luxury hotels or those testing the system'
  }
];

export default {
  mockConnectionStatus,
  mockJourneyRules,
  mockWhatsAppExamples,
  mockEmailExamples,
  mockCoexistenceModes,
  PROPERTY_ID
};

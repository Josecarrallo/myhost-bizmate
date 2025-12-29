# Guest Communications Module - Technical Specification
## MY HOST BizMate - December 29, 2025

---

## 📋 OVERVIEW

**Module Name:** Guest Communications
**Location:** GUEST & GROWTH (EXTERNAL AGENT) section
**Route:** `/guest-communications`
**Commit:** `823504c`
**Status:** ✅ Fully implemented with mock data

---

## 🎯 PURPOSE

Enable property managers to communicate with their guest database via:
1. **WhatsApp** - Using WhatsApp Business API in Coexistence mode
2. **Email** - Using SendGrid for bulk email campaigns

---

## 📁 FILE STRUCTURE

```
src/components/GuestCommunications/
├── GuestCommunications.jsx          # Main container with tabs + KPIs
├── WhatsAppCoexistence.jsx          # WhatsApp setup guide + explanation
└── EmailCommunication.jsx           # AI-powered email composer
```

---

## 🔧 COMPONENT DETAILS

### 1. GuestCommunications.jsx (Main Container)

**Purpose:** Orchestrates the entire Guest Communications experience

**Features:**
- Tab switching between WhatsApp and Email
- 4 KPI cards displayed at top
- Gradient header with back button
- Dark theme with orange accents

**KPI Cards:**
```javascript
const kpis = {
  totalGuests: 1247,
  reachableEmail: 1180,
  reachableWhatsApp: 856,
  messagesDrafted: 342
};
```

**State Management:**
```javascript
const [activeTab, setActiveTab] = useState('whatsapp');
```

**Props:**
- `onBack` (function): Navigate back to overview

**Component Hierarchy:**
```
GuestCommunications
├── Header (gradient with title)
├── KPI Cards (4 cards in grid)
├── Tabs (WhatsApp | Email)
└── Content Area
    ├── WhatsAppCoexistence (if activeTab === 'whatsapp')
    └── EmailCommunication (if activeTab === 'email')
```

**Styling:**
- Background: `bg-[#1a1f2e]`
- Header gradient: `from-[#d85a2a] to-[#f5a524]`
- Tab active: `bg-[#d85a2a]`
- Tab inactive: `text-white/60 hover:text-white/90`

---

### 2. WhatsAppCoexistence.jsx (WhatsApp Setup)

**Purpose:** Educate users on WhatsApp Business API Coexistence mode

**Features:**
- Info banner explaining coexistence requirement
- "Setup WhatsApp Coexistence" CTA button
- Modal with 5-step setup guide
- "What AI Will Do" section (4 items)
- "What AI Won't Do" section (3 items)
- Billing responsibility warning

**State Management:**
```javascript
const [showSetupGuide, setShowSetupGuide] = useState(false);
```

**Modal Content (5 Steps):**
1. **Create WhatsApp Business Account**
   - Link to Meta Business Suite
   - Requires dedicated phone number

2. **Enable Coexistence Mode**
   - Settings → Phone Number → Coexistence mode
   - Allows both human and API access

3. **Get API Credentials**
   - Phone Number ID
   - Access Token

4. **Connect to MY HOST BizMate**
   - Contact support with credentials
   - Support email: support@myhostbizmate.com

5. **Test & Launch**
   - Team will help test
   - Go live after verification

**What AI Will Do:**
- ✅ Answer FAQs (check-in, WiFi, amenities)
- ✅ Provide local recommendations
- ✅ Send check-in/check-out reminders
- ✅ Generate message drafts for review

**What AI Won't Do:**
- ❌ Handle booking modifications
- ❌ Process refunds/cancellations
- ❌ Reply to complex/sensitive issues

**Styling:**
- Info banner: `bg-blue-500/10 border-blue-500/30`
- Warning banner: `bg-amber-500/10 border-amber-500/30`
- Modal: Full-screen overlay with scrollable content
- Step numbers: Orange circles with white text

---

### 3. EmailCommunication.jsx (Email Composer)

**Purpose:** AI-powered email composer with segment targeting

**Features:**
- Info banner explaining SendGrid requirement
- "Setup SendGrid" CTA button
- Guest segment selector (4 segments)
- Email tone selector (3 tones)
- "Generate AI Draft" button
- Subject + body editor
- Send and Save Draft buttons
- Modal with 5-step SendGrid setup guide

**State Management:**
```javascript
const [showSendGridGuide, setShowSendGridGuide] = useState(false);
const [selectedSegment, setSelectedSegment] = useState('all');
const [emailTone, setEmailTone] = useState('friendly');
const [emailSubject, setEmailSubject] = useState('');
const [emailBody, setEmailBody] = useState('');
```

**Guest Segments:**
```javascript
const segments = [
  { id: 'all', label: 'All Guests', count: 1180 },
  { id: 'recent', label: 'Recent Guests (Last 30 days)', count: 127 },
  { id: 'vip', label: 'VIP Guests (3+ stays)', count: 89 },
  { id: 'longstay', label: 'Long Stay (7+ nights)', count: 156 }
];
```

**Email Tones:**
- **Formal**: Professional business communication
- **Friendly**: Casual, warm tone
- **Promo**: Marketing/promotional style

**AI Draft Generation:**
```javascript
const handleGenerateDraft = () => {
  const drafts = {
    formal: {
      subject: 'Important Update from Your Host',
      body: 'Dear Valued Guest,\n\nWe hope this message finds you well...'
    },
    friendly: {
      subject: 'Hey! Quick update from us',
      body: 'Hi there!\n\nWe hope you\'re doing great!...'
    },
    promo: {
      subject: '🎉 Special Offer Just for You!',
      body: 'Hello!\n\nWe have something special for you!...'
    }
  };
  const draft = drafts[emailTone];
  setEmailSubject(draft.subject);
  setEmailBody(draft.body);
};
```

**SendGrid Setup Modal (5 Steps):**
1. **Create SendGrid Account**
   - Free tier: 100 emails/day
   - Link to signup.sendgrid.com

2. **Verify Sender Identity**
   - Settings → Sender Authentication
   - Use business email

3. **Generate API Key**
   - Settings → API Keys → Create
   - Restricted Access: Mail Send only

4. **Connect to MY HOST BizMate**
   - Contact support with API key
   - Support email: support@myhostbizmate.com

5. **Test & Send**
   - Team sends test email
   - Go live after verification

**Styling:**
- Segment buttons: Grid layout, orange highlight when selected
- Tone buttons: Horizontal flex, orange active state
- Generate button: Gradient `from-purple-500 to-pink-500`
- Text inputs: Dark background with orange focus border
- Send button: Orange with hover effect

---

## 🎨 DESIGN SYSTEM

### Color Palette
```css
/* Backgrounds */
bg-[#1a1f2e]  /* Main background */
bg-[#252b3b]  /* Card background */

/* Brand Colors */
#d85a2a  /* Primary orange */
#FF8C42  /* Lighter orange */
#f5a524  /* Yellow accent */

/* Status Colors */
blue-500  /* Info banners */
amber-500 /* Warning banners */
green-400 /* Success icons */
purple-500 /* AI features */
pink-500  /* AI features */

/* Text */
text-white
text-white/90  /* Slightly dimmed */
text-white/80
text-white/70
text-white/60
text-white/40  /* Placeholders */
```

### Typography
- **Headers (h1)**: `text-2xl font-bold text-white`
- **Headers (h3)**: `text-lg font-semibold text-white`
- **Body**: `text-sm text-white/80`
- **Labels**: `text-sm font-medium text-white/80`
- **KPI Numbers**: `text-2xl font-bold text-white`
- **KPI Labels**: `text-xs text-white/70`

### Spacing
- Container padding: `p-6`
- Card padding: `p-4` or `p-6`
- Gap between items: `gap-4` or `gap-6`
- Section spacing: `space-y-6`

### Borders & Shadows
- Card borders: `border border-white/10`
- Info banners: `border border-blue-500/30`
- Warning banners: `border border-amber-500/30`
- Rounded corners: `rounded-xl` for cards, `rounded-lg` for buttons

---

## 🔌 INTEGRATION POINTS

### Current State (Mock Data)
All data is currently hardcoded within components. No backend calls.

### Future Backend Integration

#### Required Services

**1. Guest Communications Service**
```javascript
// src/services/guestCommunicationsService.js

export const guestCommunicationsService = {
  // Get guest statistics
  async getGuestStats() {
    // Query Supabase for real counts
    // Return: { totalGuests, reachableEmail, reachableWhatsApp, messagesDrafted }
  },

  // Get guest segments
  async getGuestSegments() {
    // Return segment definitions with real counts
  },

  // Send email via SendGrid
  async sendEmail(segmentId, subject, body, tone) {
    // Call SendGrid API
    // Log to Supabase email_logs table
  },

  // Save email draft
  async saveDraft(segmentId, subject, body, tone) {
    // Save to Supabase email_drafts table
  },

  // Generate AI email draft
  async generateEmailDraft(segmentId, tone, userContext) {
    // Call OpenAI API with context
    // Return { subject, body }
  }
};
```

**2. Supabase Tables**

```sql
-- Guest contacts table
CREATE TABLE guest_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id),
  full_name TEXT NOT NULL,
  email TEXT,
  whatsapp TEXT,
  segment TEXT[], -- ['vip', 'longstay', etc]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email drafts table
CREATE TABLE email_drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id),
  segment_id TEXT,
  subject TEXT,
  body TEXT,
  tone TEXT, -- 'formal', 'friendly', 'promo'
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email logs table
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id),
  segment_id TEXT,
  subject TEXT,
  recipients_count INTEGER,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT -- 'sent', 'failed', 'pending'
);
```

**3. SendGrid Integration**

```javascript
// In EmailCommunication.jsx
const handleSendEmail = async () => {
  try {
    setLoading(true);
    await guestCommunicationsService.sendEmail(
      selectedSegment,
      emailSubject,
      emailBody,
      emailTone
    );
    // Show success message
    // Clear form
  } catch (error) {
    // Show error message
  } finally {
    setLoading(false);
  }
};
```

**4. WhatsApp Business API Integration**

Future implementation via ChakraHQ or Meta Cloud API:
- Webhook for incoming messages
- Send template messages
- Track message status
- Coexistence mode configuration

---

## 🚀 DEPLOYMENT CHECKLIST

### Frontend (Already Complete)
- ✅ Components created and styled
- ✅ Navigation integrated (Sidebar + App.jsx)
- ✅ Responsive design
- ✅ Modal guides for setup

### Backend (Pending)
- ⏳ Create Supabase tables
- ⏳ Build guestCommunicationsService.js
- ⏳ Integrate SendGrid API
- ⏳ Add loading states to components
- ⏳ Add error handling
- ⏳ Add success notifications

### External Services (Pending)
- ⏳ SendGrid account setup
- ⏳ WhatsApp Business API approval
- ⏳ ChakraHQ integration
- ⏳ OpenAI API for draft generation

---

## 📊 USER FLOW

### WhatsApp Setup Flow
```
1. User clicks "Guest Communications" in sidebar
2. User selects "WhatsApp Coexistence" tab
3. User reads info banner about coexistence mode
4. User clicks "Setup WhatsApp Coexistence"
5. Modal opens with 5-step guide
6. User follows steps in Meta Business Suite
7. User contacts support with credentials
8. Support team configures integration
9. User receives confirmation email
10. WhatsApp tab shows "Connected" status
```

### Email Sending Flow
```
1. User clicks "Guest Communications" in sidebar
2. User selects "Email Communication" tab
3. User selects guest segment (e.g., "VIP Guests")
4. User selects email tone (e.g., "Friendly")
5. User clicks "Generate AI Draft"
6. AI generates subject + body based on tone
7. User edits subject/body as needed
8. User clicks "Send to 89 Guests"
9. System confirms sending
10. Email sent via SendGrid
11. Success message displayed
12. Email logged to database
```

---

## 🐛 KNOWN LIMITATIONS

### Current Implementation
- **Mock data only** - No real backend integration
- **No authentication** - Assumes user is logged in
- **No error handling** - Buttons don't actually send emails
- **No draft persistence** - Drafts lost on page refresh
- **No AI generation** - Drafts are pre-written templates

### Technical Debt
- Need to add loading spinners
- Need to add toast notifications
- Need to add form validation
- Need to add rate limiting for AI generation
- Need to add email preview before sending

---

## 🔮 FUTURE ENHANCEMENTS

### Phase 1 (High Priority)
- Real backend integration with Supabase
- SendGrid API connection
- AI draft generation via OpenAI
- Save/load drafts functionality
- Email sending history

### Phase 2 (Medium Priority)
- WhatsApp Business API integration
- Template message library
- A/B testing for email campaigns
- Analytics dashboard (open rate, click rate)
- Unsubscribe management

### Phase 3 (Low Priority)
- Email template builder (drag & drop)
- Scheduling for future sends
- Multi-language support
- SMS integration
- Advanced segmentation (behavioral, RFM)

---

## 📝 CODE EXAMPLES

### Adding a New Segment
```javascript
// In EmailCommunication.jsx
const segments = [
  { id: 'all', label: 'All Guests', count: 1180 },
  { id: 'recent', label: 'Recent Guests (Last 30 days)', count: 127 },
  { id: 'vip', label: 'VIP Guests (3+ stays)', count: 89 },
  { id: 'longstay', label: 'Long Stay (7+ nights)', count: 156 },
  // Add new segment
  { id: 'returning', label: 'Returning Guests (2+ stays)', count: 234 }
];
```

### Adding a New Email Tone
```javascript
// In EmailCommunication.jsx
const drafts = {
  formal: { subject: '...', body: '...' },
  friendly: { subject: '...', body: '...' },
  promo: { subject: '...', body: '...' },
  // Add new tone
  urgent: {
    subject: 'Important: Action Required',
    body: 'We need your immediate attention...'
  }
};
```

### Integrating Real Backend
```javascript
// Replace mock KPIs with real data
useEffect(() => {
  const fetchStats = async () => {
    const stats = await guestCommunicationsService.getGuestStats();
    setKpis(stats);
  };
  fetchStats();
}, []);
```

---

## ✅ TESTING CHECKLIST

### Manual Testing
- [ ] Navigate to Guest Communications from sidebar
- [ ] Both tabs switch correctly
- [ ] WhatsApp setup modal opens and closes
- [ ] SendGrid setup modal opens and closes
- [ ] Segment selection works
- [ ] Tone selection works
- [ ] Generate Draft populates fields
- [ ] Subject input is editable
- [ ] Body textarea is editable
- [ ] Responsive on mobile (tabs stack vertically)
- [ ] Back button returns to overview

### Future Automated Tests
- [ ] Component renders without errors
- [ ] KPIs display correct numbers
- [ ] Tab switching updates state
- [ ] Modal state management works
- [ ] Form validation works
- [ ] API calls handle errors gracefully

---

## 📞 SUPPORT & CONTACT

For questions about this module, contact:
- **Developer:** Claude Code (Anthropic)
- **Project Owner:** José Carrallo
- **Support Email:** support@myhostbizmate.com

---

**Last Updated:** December 29, 2025
**Version:** 1.0.0
**Status:** ✅ Complete (Mock Data)

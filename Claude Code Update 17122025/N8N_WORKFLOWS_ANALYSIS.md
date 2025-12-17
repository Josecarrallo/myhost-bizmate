# 📋 n8n WORKFLOWS ANALYSIS

**Date:** 17 December 2025
**n8n Instance:** https://n8n-production-bb2d.up.railway.app
**Status:** Workflows created, ready for integration

---

## 🔄 EXISTING WORKFLOWS

### 1. Booking Confirmation Flow (VI)
**File:** `MY HOST - Booking Confirmation Flow (Emial=WhatsApp Chakra - MY HOST Bizmate VI).json`
**Status:** Inactive (needs activation)
**Webhook Path:** `/booking-created` (POST)

**Flow:**
```
Webhook → Get Property (Supabase) → Send Email (SendGrid) → WhatsApp Guest → WhatsApp Owner
```

**Expected Data:**
```json
{
  "property_id": "uuid",
  "guest_email": "email@example.com",
  "guest_name": "Name",
  "guest_phone": "34619794604",
  "check_in": "2025-12-20",
  "check_out": "2025-12-25",
  "guests_count": 2,
  "total_amount": 500
}
```

**Actions:**
- ✅ Retrieves property details from Supabase
- ✅ Sends confirmation email via SendGrid
- ✅ Sends WhatsApp message to guest
- ✅ Sends WhatsApp notification to owner (34619794604)

---

### 2. Staff Notification - New Booking (VII)
**File:** `Staff Notification - New Booking (Izumi Hotel) MYHOST Bizmate VII.json`
**Status:** ACTIVE ✅
**Webhook Path:** `/new-booking-notification` (POST)

**Flow:**
```
Webhook → Format Data → Get Property (Supabase) → WhatsApp Guest + WhatsApp Staff → Respond
```

**Expected Data:**
```json
{
  "body": {
    "record": {
      "id": "uuid",
      "guest_name": "Name",
      "guest_email": "email@example.com",
      "guest_phone": "34619794604",
      "check_in": "2025-12-20",
      "check_out": "2025-12-25",
      "guests": 2,
      "total_price": 500,
      "status": "confirmed",
      "channel": "direct",
      "created_at": "timestamp",
      "property_id": "uuid"
    }
  }
}
```

**Actions:**
- ✅ Formats booking data
- ✅ Retrieves property info from Supabase
- ✅ Sends confirmation WhatsApp to guest
- ✅ Sends notification WhatsApp to staff
- ✅ Returns success response

---

### 3. WhatsApp AI Chatbot (IV)
**File:** `WhatsApp AI Chatbot - MY HOST Bizmate IV.json`
**Status:** Inactive (needs activation)
**Webhook Path:** `/whatsapp-webhook` (POST + GET)

**Flow:**
```
Webhook → Extract Message → AI Agent (OpenAI GPT-4.1-mini) → Send WhatsApp Response
```

**Expected Data:**
WhatsApp webhook format from Meta/ChakraHQ

**Actions:**
- ✅ Receives WhatsApp messages
- ✅ Processes with AI agent
- ✅ Maintains conversation memory
- ✅ Responds via WhatsApp API

---

## 🔐 CREDENTIALS CONFIGURED

### Supabase
- **ID:** SJLQzwU9BVHEVAGc
- **URL:** https://jjpscimtxrudtepzwhag.supabase.co

### SendGrid
- **ID:** Y35BYbcV5SYfjBwc
- **API Key:** Configured ✅
- **From:** josecarrallodelafuente@gmail.com
- **Name:** MY HOST BizMate

### WhatsApp (ChakraHQ)
- **API URL:** https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c/api/v19.0/944855278702577/messages
- **Authorization:** Bearer token configured
- **Staff Phone:** 34619794604

### OpenAI
- **ID:** hlVVk9ThwmKbr4yS
- **Model:** gpt-4.1-mini

---

## 📂 ALL WORKFLOW FILES

Located in: `C:\myhost-bizmate\n8n_worlkflow_claude\`

1. ✅ Booking Confirmation Flow (VI) - Email + WhatsApp
2. ✅ Staff Notification (VII) - ACTIVE
3. ✅ WhatsApp AI Chatbot (IV) - AI Agent
4. Booking Confirmation (0) - Old version
5. Chatbot WhatsApp + Claude (II) - Manual webhook version
6. Extraer Datos PDF (III) - Invoice data extraction
7. Recomendaciones IA Diarias (I) - Daily AI recommendations
8. Vapi Izumi Hotel (IX) - Voice AI integration
9. WhatsApp AI Agent V2 (12/12/2025) - Latest version

---

## 🚀 INTEGRATION PLAN

### Day 1 Tasks (Today):

#### 1. Environment Setup (15 min)
- [ ] Add n8n URL to .env
- [ ] Add webhook endpoints to .env

#### 2. Create Webhook Service (30 min)
- [ ] Create `src/services/n8n.js`
- [ ] Function: `triggerBookingConfirmation(bookingData)`
- [ ] Function: `triggerStaffNotification(bookingData)`
- [ ] Error handling and logging

#### 3. Integrate with Bookings.jsx (30 min)
- [ ] Import n8n service
- [ ] Call webhook when booking is created
- [ ] Show success/error toast notifications

#### 4. Create Logging System (1 hour)
- [ ] Create `workflow_logs` table in Supabase
- [ ] Create `WorkflowLogs` component
- [ ] Display workflow execution history
- [ ] Show success/failure status

#### 5. Testing (1 hour)
- [ ] Test Booking Confirmation flow
- [ ] Test Staff Notification flow
- [ ] Verify emails sent
- [ ] Verify WhatsApp messages sent
- [ ] Check logs

---

## 📊 WEBHOOK URLs (FULL)

```javascript
const N8N_BASE_URL = 'https://n8n-production-bb2d.up.railway.app';

// Workflow endpoints
const WEBHOOKS = {
  bookingConfirmation: `${N8N_BASE_URL}/webhook/booking-created`,
  staffNotification: `${N8N_BASE_URL}/webhook/new-booking-notification`,
  whatsappChatbot: `${N8N_BASE_URL}/webhook/whatsapp-webhook`,
};
```

---

## ⚠️ IMPORTANT NOTES

1. **Workflow II (Staff Notification) is ACTIVE** - Can be tested immediately
2. **Workflow VI (Booking Confirmation) is INACTIVE** - Needs activation in n8n
3. **WhatsApp numbers must include country code** without + symbol
4. **Owner notification goes to:** 34619794604
5. **All workflows use same Supabase instance**
6. **Response format:** Workflow VII returns JSON response for better integration

---

## 🧪 TESTING CHECKLIST

- [ ] Webhook endpoints accessible
- [ ] n8n workflows active
- [ ] Supabase connection working
- [ ] SendGrid sending emails
- [ ] WhatsApp messages delivered
- [ ] Error handling working
- [ ] Logs being recorded
- [ ] UI shows success notifications

---

**Next Step:** Create webhook service and integrate with React app

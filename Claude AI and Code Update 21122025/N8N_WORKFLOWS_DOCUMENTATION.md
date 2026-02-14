# 🤖 n8n Workflows Documentation

**MY HOST BizMate - Automation Architecture**
**Updated:** December 21, 2025

---

## 📑 Table of Contents

1. [n8n Instance Overview](#n8n-instance-overview)
2. [Workflows Inventory](#workflows-inventory)
3. [New Property Workflow (Dec 21)](#new-property-workflow-dec-21)
4. [Booking Confirmation Workflow](#booking-confirmation-workflow)
5. [WhatsApp AI Agent](#whatsapp-ai-agent)
6. [Payload Format Standards](#payload-format-standards)
7. [Integration with MY HOST BizMate](#integration-with-my-host-bizmate)
8. [MCP Server Setup](#mcp-server-setup)
9. [Next Steps](#next-steps)

---

## n8n Instance Overview

### Production Instance

**URL:** https://n8n-production-bb2d.up.railway.app

**Hosting:** Railway
**Database:** PostgreSQL (Railway)
**Status:** ✅ Active & Running

### Services Configured

| Service | Status | Purpose |
|---------|--------|---------|
| **SendGrid** | ✅ Active | Email notifications |
| **Chakra API** | ✅ Active | WhatsApp messaging |
| **Supabase** | ✅ Active | Database integration |
| **Claude API** | ⏸️ Planned | AI agent responses |
| **VAPI** | ⏸️ Planned | Voice AI receptionist |

### API Credentials

- **SendGrid:** Configured for `josecarrallodelafuente@gmail.com`
- **Chakra WhatsApp:** Phone ID `944855278702577`
- **Supabase:** Connected to MY HOST BizMate database
- **n8n API:** Available for MCP server integration

---

## Workflows Inventory

### Active Workflows (Production)

| # | Workflow Name | Status | Trigger | Purpose |
|---|--------------|--------|---------|---------|
| 1 | **Booking Confirmation Flow** | ✅ Active | Webhook | Email + WhatsApp on new booking |
| 2 | **Staff Notification - New Booking** | ✅ Active | Webhook | Notify staff of new reservations |
| 3 | **WhatsApp AI Agent - Izumi Hotel** | ✅ Active | Webhook | AI chatbot for guest inquiries |
| 4 | **DOMUS Polling - Reservations Sync** | ✅ Active | Schedule | Sync reservations from DOMUS API |
| 5 | **New Property Notification** | ⚠️ Pending | Webhook | Email + WhatsApp for new properties |

### Development/Testing Workflows

| # | Workflow Name | Status | Purpose |
|---|--------------|--------|---------|
| 6 | **WhatsApp AI Agent - Testing Mode** | 🧪 Testing | Sandbox for AI agent testing |
| 7 | **VAPI Izumi Hotel** | 🧪 Testing | Voice AI integration |
| 8 | **Flujo B - Recomendaciones IA** | 📋 Planned | Daily AI recommendations |
| 9 | **Demo MCP** | 🧪 Testing | MCP server demo |

### Archived/Reference Workflows

- Booking Created - Email + SMS (v1)
- WhatsApp starter workflow
- Simple Chat AI - Webhook + Anthropic
- Various iterations of WhatsApp AI Chatbot

**Total Workflows:** 27 files in repository
**Active Production:** 4 workflows
**In Development:** 5 workflows
**Planned (21 workflows):** See CLAUDE.md automation categories

---

## New Property Workflow (Dec 21)

### Overview

**File:** `MY HOST - New Property Notification (Email+WhatsApp).json`
**Created:** December 21, 2025
**Status:** ⚠️ Pending final configuration
**Purpose:** Notify property owner when new property is created in system

### Workflow Structure

```
┌─────────────┐
│   Webhook   │
│ POST /new_  │
│  property   │
└──────┬──────┘
       │
       ├─────────────────────────────┐
       │                             │
       ▼                             ▼
┌──────────────┐            ┌──────────────┐
│  SendGrid    │            │   Chakra     │
│    Email     │            │  WhatsApp    │
│              │            │              │
│ To: Owner    │            │ To: Owner    │
│ Subject:     │            │ Message:     │
│ Nueva        │            │ Nueva        │
│ Propiedad    │            │ Propiedad    │
└──────────────┘            └──────────────┘
```

### Node 1: Webhook

**Type:** `n8n-nodes-base.webhook`
**Method:** POST
**Path:** `/webhook/new_property`
**Webhook ID:** `new-property-webhook-id`

**Expected Payload:**
```json
{
  "body": {
    "data": {
      "property": {
        "name": "Villa Sunrise Bali",
        "city": "Canggu",
        "country": "Indonesia",
        "bedrooms": 4,
        "max_guests": 8,
        "base_price": 250,
        "currency": "USD",
        "status": "active"
      }
    }
  }
}
```

### Node 2: SendGrid Email

**Type:** `n8n-nodes-base.sendGrid`
**From:** `josecarrallodelafuente@gmail.com`
**From Name:** MY HOST BizMate
**To:** `josecarrallodelafuente@gmail.com` (owner email)

**Subject Template:**
```
🏠 Nueva Propiedad Creada - {{ $node["Webhook"].json["body"]["data"]["property"]["name"] }}
```

**Email Body:**
```
¡Nueva propiedad registrada en MY HOST BizMate!

DETALLES DE LA PROPIEDAD:
━━━━━━━━━━━━━━━━━━━━━━━━━
🏠 Nombre: {{ $node["Webhook"].json["body"]["data"]["property"]["name"] }}
📍 Ubicación: {{ $node["Webhook"].json["body"]["data"]["property"]["city"] }}, {{ $node["Webhook"].json["body"]["data"]["property"]["country"] }}
🛏️ Habitaciones: {{ $node["Webhook"].json["body"]["data"]["property"]["bedrooms"] }}
👥 Huéspedes máx: {{ $node["Webhook"].json["body"]["data"]["property"]["max_guests"] }}
💰 Precio base: ${{ $node["Webhook"].json["body"]["data"]["property"]["base_price"] }} {{ $node["Webhook"].json["body"]["data"]["property"]["currency"] }}
📋 Estado: {{ $node["Webhook"].json["body"]["data"]["property"]["status"] }}

Próximos pasos:
✅ Configurar fotos de la propiedad
✅ Completar amenidades
✅ Definir reglas de la casa
✅ Activar sincronización con canales

El equipo de MY HOST BizMate 🌺
```

### Node 3: Chakra WhatsApp

**Type:** `n8n-nodes-base.httpRequest`
**Method:** POST
**URL:** `https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c/api/v19.0/944855278702577/messages`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer [CHAKRA_API_TOKEN]"
}
```

**Body Template:**
```json
{
  "messaging_product": "whatsapp",
  "to": "34676421826",
  "type": "text",
  "text": {
    "body": "🏠 *Nueva Propiedad Creada*\n\n*Nombre:* {{ $node[\"Webhook\"].json[\"body\"][\"data\"][\"property\"][\"name\"] }}\n*Ubicación:* {{ $node[\"Webhook\"].json[\"body\"][\"data\"][\"property\"][\"city\"] }}\n*Habitaciones:* {{ $node[\"Webhook\"].json[\"body\"][\"data\"][\"property\"][\"bedrooms\"] }}\n*Precio:* ${{ $node[\"Webhook\"].json[\"body\"][\"data\"][\"property\"][\"base_price\"] }}\n\nRevisa los detalles en MY HOST BizMate! 🌺"
  }
}
```

### Current Issues

#### ⚠️ Issue 1: Email Fields Empty

**Symptom:** Email arrives but all fields show empty values

**Example:**
```
🏠 Nueva Propiedad Creada -

DETALLES DE LA PROPIEDAD:
━━━━━━━━━━━━━━━━━━━━━━━━━
🏠 Nombre:
📍 Ubicación: ,
🛏️ Habitaciones:
...
```

**Cause:** Payload format mismatch

**Current App Payload:**
```javascript
// src/services/n8n.js - onPropertyCreated()
{
  property_id: "abc123",
  property_name: "Villa Sunrise",
  city: "Canggu",
  // ... flat structure
}
```

**Expected Payload:**
```javascript
{
  body: {
    data: {
      property: {
        name: "Villa Sunrise",
        city: "Canggu",
        // ... nested structure
      }
    }
  }
}
```

#### ⚠️ Issue 2: WhatsApp Not Delivered

**Symptom:** WhatsApp message doesn't arrive

**Possible Causes:**
1. API token expired
2. Phone number format incorrect
3. Chakra API rate limit
4. Payload format issue (same as email)

### Solution Plan

#### Step 1: Fix Payload Format (App Side)

**File to modify:** `src/services/n8n.js`

**Current code:**
```javascript
export const onPropertyCreated = async (property) => {
  const payload = {
    property_id: property.id,
    property_name: property.name,
    city: property.city,
    country: property.country,
    bedrooms: property.bedrooms,
    max_guests: property.max_guests,
    base_price: property.base_price,
    currency: property.currency,
    status: property.status
  };

  return fetch(`${N8N_BASE_URL}/webhook/new_property`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
};
```

**Fixed code:**
```javascript
export const onPropertyCreated = async (property) => {
  const payload = {
    body: {
      data: {
        property: {
          id: property.id,
          name: property.name,
          city: property.city,
          country: property.country,
          bedrooms: property.bedrooms,
          max_guests: property.max_guests,
          base_price: property.base_price,
          currency: property.currency,
          status: property.status,
          owner_email: property.owner_email || 'josecarrallodelafuente@gmail.com',
          owner_phone: property.owner_phone || '+34676421826'
        }
      }
    }
  };

  return fetch(`${N8N_BASE_URL}/webhook/new_property`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
};
```

#### Step 2: Test with MCP Server

Use Claude AI with n8n MCP to:
1. `get_workflow` - Inspect current workflow structure
2. `trigger_workflow` - Test with correct payload
3. `get_executions` - Debug any errors
4. Iterate until working

#### Step 3: Verify Delivery

- [ ] Email arrives with all fields populated
- [ ] WhatsApp message delivered
- [ ] Property owner receives notifications
- [ ] Data matches what was entered in app

---

## Booking Confirmation Workflow

### Overview

**File:** `MY HOST - Booking Confirmation Flow (Email+WhatsApp Meta) FINAL.json`
**Status:** ✅ Fully functional
**Purpose:** Send confirmation to guest on new booking

### Workflow Structure

```
Webhook (POST /booking_confirmation)
    ↓
SendGrid Email (Booking details + payment info)
    ↓
Chakra WhatsApp (Booking confirmation message)
```

### Payload Format (WORKING REFERENCE)

```json
{
  "body": {
    "data": {
      "booking": {
        "id": "BK-2025-001",
        "guest_name": "John Doe",
        "guest_email": "john@example.com",
        "guest_phone": "+1234567890",
        "property_name": "Villa Sunset Bali",
        "check_in": "2025-12-25",
        "check_out": "2025-12-30",
        "nights": 5,
        "guests": 4,
        "total_amount": 1250,
        "currency": "USD",
        "status": "confirmed"
      }
    }
  }
}
```

**Key Insight:** This is the **standard format** that should be used for ALL webhooks

### Email Template

```
✅ Booking Confirmed - {{ booking.property_name }}

Dear {{ booking.guest_name }},

Your booking has been confirmed!

BOOKING DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Check-in: {{ booking.check_in }}
📅 Check-out: {{ booking.check_out }}
🏠 Property: {{ booking.property_name }}
👥 Guests: {{ booking.guests }}
🌙 Nights: {{ booking.nights }}
💰 Total: ${{ booking.total_amount }} {{ booking.currency }}

Looking forward to hosting you! 🌺
```

### WhatsApp Template

```
✅ *Booking Confirmed!*

*Property:* {{ booking.property_name }}
*Check-in:* {{ booking.check_in }}
*Check-out:* {{ booking.check_out }}
*Total:* ${{ booking.total_amount }}

Booking ID: {{ booking.id }}

We're excited to host you! 🌺
```

---

## WhatsApp AI Agent

### Overview

**File:** `WhatsApp AI Agent - Izumi Hotel (ChakraHQ) - MY HOST Bizmate VIII.json`
**Status:** ✅ Active (Izumi Hotel)
**Purpose:** AI-powered chatbot for guest inquiries via WhatsApp

### Architecture

```
Guest sends WhatsApp message
    ↓
Chakra Webhook receives message
    ↓
n8n extracts message text + sender
    ↓
Anthropic Claude API (conversational AI)
    ↓
Response formatted for WhatsApp
    ↓
Chakra API sends reply to guest
```

### Features

- **Conversational AI:** Powered by Claude (Anthropic)
- **Context Awareness:** Remembers conversation history
- **Multi-language:** Supports EN, ES, ID
- **24/7 Availability:** Always responsive
- **Handoff to Human:** Can escalate complex queries

### Example Conversation

```
Guest: Hola, ¿tienen disponibilidad para 2 personas del 25 al 30 de diciembre?

AI Agent: ¡Hola! 👋 Claro, déjame revisar la disponibilidad para esas fechas.

Para 2 huéspedes del 25 al 30 de diciembre (5 noches), tengo las siguientes opciones:

🏠 Villa Sunrise - $250/noche
🏠 Beach House - $180/noche

¿Te gustaría saber más detalles de alguna? 😊

Guest: Cuéntame más de Villa Sunrise

AI Agent: ¡Perfecto! Villa Sunrise es una de nuestras propiedades más populares:

✨ 4 habitaciones, hasta 8 huéspedes
🏊 Piscina privada
🌴 Jardín tropical
📍 Canggu, cerca de playas

Precio para tus fechas: $1,250 (5 noches)

¿Te gustaría hacer la reserva? 🌺
```

### Integration Points

1. **Supabase:** Fetch property availability
2. **Booking System:** Create reservations
3. **Payment Gateway:** Process deposits
4. **Staff Notifications:** Alert on complex queries

---

## Payload Format Standards

### Standard Webhook Payload Structure

Based on working Booking Confirmation workflow:

```json
{
  "body": {
    "data": {
      "[resource_name]": {
        "field1": "value1",
        "field2": "value2",
        ...
      }
    }
  }
}
```

**Examples:**

#### Booking
```json
{
  "body": {
    "data": {
      "booking": { ... }
    }
  }
}
```

#### Property
```json
{
  "body": {
    "data": {
      "property": { ... }
    }
  }
}
```

#### Guest
```json
{
  "body": {
    "data": {
      "guest": { ... }
    }
  }
}
```

### Accessing Data in n8n

**Template syntax:**
```
{{ $node["Webhook"].json["body"]["data"]["resource"]["field"] }}
```

**Examples:**
```
{{ $node["Webhook"].json["body"]["data"]["booking"]["guest_name"] }}
{{ $node["Webhook"].json["body"]["data"]["property"]["name"] }}
{{ $node["Webhook"].json["body"]["data"]["guest"]["email"] }}
```

### Why This Structure?

1. **Consistency:** All webhooks use same format
2. **Extensibility:** Easy to add metadata outside `data`
3. **Clarity:** Clear separation of payload vs HTTP body
4. **Best Practice:** Standard REST API pattern

---

## Integration with MY HOST BizMate

### Frontend → n8n Flow

```
React Component (e.g., Properties.jsx)
    ↓
Create Property Form Submitted
    ↓
src/services/n8n.js → onPropertyCreated()
    ↓
Fetch POST to n8n webhook
    ↓
n8n receives payload
    ↓
n8n sends Email + WhatsApp
    ↓
Property owner notified
```

### n8n Service File

**Location:** `src/services/n8n.js`

**Functions:**

```javascript
const N8N_BASE_URL = 'https://n8n-production-bb2d.up.railway.app';

// Trigger on new property
export const onPropertyCreated = async (property) => { ... };

// Trigger on new booking
export const onBookingCreated = async (booking) => { ... };

// Trigger on booking cancellation
export const onBookingCancelled = async (booking) => { ... };

// Trigger on guest check-in
export const onGuestCheckIn = async (guest, property) => { ... };

// ... (21 total workflows planned)
```

### Workflow Triggers Map

| Event | n8n Workflow | Webhook Path |
|-------|-------------|--------------|
| Property Created | New Property Notification | `/webhook/new_property` |
| Booking Created | Booking Confirmation | `/webhook/booking_confirmation` |
| Booking Cancelled | Cancellation Flow | `/webhook/booking_cancelled` |
| Check-in Today | Check-in Reminder | `/webhook/checkin_reminder` |
| Review Request | Review Request | `/webhook/review_request` |

---

## MCP Server Setup

### What is MCP?

**MCP (Model Context Protocol)** allows Claude AI to directly interact with n8n workflows:
- List all workflows
- Get workflow details
- Trigger workflows
- View execution history
- Debug errors

### Setup Steps

#### 1. Generate n8n API Key

1. Login to n8n: https://n8n-production-bb2d.up.railway.app
2. Go to Settings → API
3. Click "Create API Key"
4. Copy the key (starts with `n8n_api_...`)

#### 2. Configure Claude Desktop

**File:** `%APPDATA%/Claude/claude_desktop_config.json` (Windows)

```json
{
  "mcpServers": {
    "n8n": {
      "command": "node",
      "args": [
        "C:/myhost-bizmate/.claude/mcp/n8n/build/index.js"
      ],
      "env": {
        "N8N_API_KEY": "n8n_api_xxxxxxxxxxxxxx",
        "N8N_BASE_URL": "https://n8n-production-bb2d.up.railway.app"
      }
    }
  }
}
```

#### 3. Install Dependencies

```bash
cd C:/myhost-bizmate/.claude/mcp/n8n
npm install
```

#### 4. Restart Claude Code

Close and reopen Claude Code to load MCP server

### MCP Commands

Once configured, use natural language:

```
"List all my n8n workflows"
→ Shows all workflows with status

"Show me the New Property workflow"
→ Returns workflow JSON structure

"Trigger the booking confirmation workflow with test data"
→ Executes workflow with provided payload

"Why did the last execution fail?"
→ Shows execution logs and errors

"Update the email template in Property workflow"
→ Modifies workflow nodes
```

### Documentation

- **Quick Start:** `.claude/mcp/n8n/QUICK_START.md`
- **Full Guide:** `.claude/mcp/n8n/README.md`
- **Installation:** `.claude/mcp/n8n/INSTALL.md`

---

## Next Steps

### Immediate (Next Session with Claude AI)

1. **Configure MCP Server**
   - [ ] Generate n8n API key
   - [ ] Update `claude_desktop_config.json`
   - [ ] Install MCP dependencies
   - [ ] Test connection: "List workflows"

2. **Fix New Property Workflow**
   - [ ] Use MCP to inspect workflow
   - [ ] Modify `src/services/n8n.js` payload format
   - [ ] Test with MCP: `trigger_workflow`
   - [ ] Verify email + WhatsApp delivery

3. **WhatsApp Delivery Debug**
   - [ ] Check Chakra API credentials
   - [ ] Verify phone number format
   - [ ] Test manual API call
   - [ ] Review n8n execution logs

### Short Term (This Week)

1. **Implement Additional Workflows**
   - [ ] Booking Cancellation
   - [ ] Check-in Reminder
   - [ ] Review Request
   - [ ] Payment Confirmation
   - [ ] Staff Task Assignment

2. **Testing & Validation**
   - [ ] End-to-end test each workflow
   - [ ] Verify email templates render correctly
   - [ ] Confirm WhatsApp delivery
   - [ ] Check Supabase data updates

### Medium Term (Next 2 Weeks)

1. **Complete 21 Planned Workflows** (See CLAUDE.md)
   - Booking Management (6 workflows)
   - Guest Operations (5 workflows)
   - Marketing (4 workflows)
   - Operations (6 workflows)

2. **AI Enhancements**
   - Integrate Claude API for AI responses
   - Implement VAPI for voice AI
   - Add cultural intelligence features

3. **Monitoring & Analytics**
   - Track workflow execution success rate
   - Monitor email/WhatsApp delivery
   - Analyze guest response times

---

## Workflow Files Reference

### Complete File List

```
n8n_worlkflow_claude/
├── MY HOST - New Property Notification (Email+WhatsApp).json  ← NEW (Dec 21)
├── MY HOST - Booking Confirmation Flow (Emial=WhatsApp Meta) FINAL.json
├── MY HOST - Booking Confirmation Flow (Emial=WhatsApp Chakra - MY HOST Bizmate VI).json
├── Staff Notification - New Booking (Izumi Hotel) MYHOST Bizmate VII.json
├── WhatsApp AI Agent - Izumi Hotel (ChakraHQ) - MY HOST Bizmate VIII.json
├── WhatsApp AI Agent - Izumi Hotel (ChakraHQ) - MY HOST Bizmate V2 12122025.json
├── DOMUS Polling - Reservations Sync.json
├── Vapi Izumi Hotel - MYHOST Bizmate IX.json
├── Flujo B - Recomendaciones IA Diarias FINAL MY HOST Bizmate I.json
├── Extraer Datos Facturas PDF - Izumi Hotel  MY HOST Bizmate III.json
├── Chatbot WhatsApp + Claude (Webhook Manual) MY HOST Bizmate II.json
├── WhatsApp AI Chatbot - MY HOST Bizmate IV.json
├── WhatsApp AI Agent - Testing Mode.json
├── Demo MCP_ Webhook + Claude Chatbot.json
├── new_property_notification.json  ← OLD version
├── Booking Created - Email + SMS copy 2.json
├── Booking Created - Email + WhatsApp copy.json
├── WhatsApp starter workflow FUNCIONA.json
├── 🤖 Chat AI Agent con MCP Tools - WhatsApp.json
├── 🤖 Simple Chat AI - Webhook + Anthropic FIXED.json
├── Acceso nuevos registros Supabase & envio email copy.json
└── Flujo_B_Recomendaciones_IA_Diarias.json

Supporting Files:
├── FLUJO_B_INSTRUCCIONES.md
├── DOMUS_POLLING_SETUP.md
├── n8n workflows.docx
├── flujos n8n.docx
├── create_recommendation_logs_table.sql
└── A list of Zodomus API's.txt
```

---

## Summary

### Current State

- ✅ **n8n Instance:** Running on Railway
- ✅ **Booking Workflow:** Fully functional
- ✅ **WhatsApp AI Agent:** Active for Izumi Hotel
- ✅ **DOMUS Sync:** Polling reservations
- ⚠️ **Property Workflow:** Created, needs payload fix
- 🔜 **MCP Server:** Ready to configure

### Issues to Resolve

1. **New Property Workflow**
   - Email fields empty (payload format)
   - WhatsApp not delivered (API/payload)

2. **Integration**
   - Standardize payload format across all workflows
   - Add error handling in frontend
   - Implement retry logic

3. **Testing**
   - End-to-end validation needed
   - Verify all email templates
   - Confirm WhatsApp delivery

### Success Metrics

- ✅ 4 workflows in production
- ⏸️ 1 workflow pending (New Property)
- 📋 21 workflows planned
- 🎯 Goal: All 21 workflows active by end of month

---

**Documented by:** Claude Code
**Date:** December 21, 2025
**Next Action:** Configure MCP + Fix Property Workflow

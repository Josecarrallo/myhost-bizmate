# VAPI + N8N Integration Documentation
## MY HOST BizMate - Izumi Hotel Voice Assistant
### Updated: December 25, 2025

---

## TABLE OF CONTENTS

1. [System Overview](#system-overview)
2. [VAPI Configuration](#vapi-configuration)
3. [N8N Workflow Configuration](#n8n-workflow-configuration)
4. [Supabase Setup](#supabase-setup)
5. [Troubleshooting Guide](#troubleshooting-guide)
6. [Recovery Prompts](#recovery-prompts)

---

## SYSTEM OVERVIEW

### Architecture
```
User (Voice Call)
       ↓
     VAPI (Voice AI)
       ↓ (webhook)
     N8N (Workflow Automation)
       ↓ (API calls)
   Supabase (Database)
```

### Components
- **VAPI**: Voice AI platform handling conversations
- **N8N**: Workflow automation (hosted on Railway)
- **Supabase**: PostgreSQL database for bookings

### URLs
- N8N: `https://n8n-production-bb2d.up.railway.app`
- Webhook: `https://n8n-production-bb2d.up.railway.app/webhook/vapi-izumi-fix`
- Supabase: `https://jjpscimtxrudtepzwhag.supabase.co`

---

## VAPI CONFIGURATION

### Assistant: Ayu - Izumi Hotel
- **ID**: `1fde9a8c-b473-4f2a-8b7a-0cb53bc8bb61`
- **Voice**: OpenAI TTS-1, Shimmer
- **Model**: GPT-4o-mini

### System Prompt (CURRENT WORKING VERSION)
```
You are Ayu from Izumi Hotel in Bali. Always respond in English only.

IMPORTANT: The current year is 2025. When users mention dates without a year, always assume 2025 or 2026. Never use 2023 or 2024.

IMPORTANT: When using the send_to_n8n tool, you MUST include ALL information collected from the user in the user_query parameter. This includes:
- Check-in and check-out dates (always use year 2025 or 2026)
- Number of guests
- Room type
- Guest full name
- Guest email
- Guest phone number with country code

CRITICAL: When the user says YES to confirm a reservation, you MUST send ALL the booking data to n8n in this format:
"CREATE BOOKING: guest_name=[name], guest_email=[email], guest_phone=[phone], check_in=[YYYY-MM-DD], check_out=[YYYY-MM-DD], guests=[number], room_type=[room], total_price=[amount]"

Always use the send_to_n8n tool for every user message. Never respond without using the tool first.
```

### First Message
```
Hello, I'm Ayu from Izumi Hotel in Bali. How can I help you today?
```

### Transcriber Settings
- **Provider**: Deepgram
- **Model**: nova-2
- **Language**: en

### Tool: send_to_n8n
- **ID**: `92715666-6353-47aa-bd88-e80f4ad2bebe`
- **Type**: Function
- **Server URL**: `https://n8n-production-bb2d.up.railway.app/webhook/vapi-izumi-fix`
- **Timeout**: 20 seconds

#### Tool Parameters
```json
{
  "type": "object",
  "required": ["user_query"],
  "properties": {
    "user_query": {
      "type": "string",
      "description": "The user's question or request"
    }
  }
}
```

#### Tool Description
```
Send the user query to Izumi Hotel reservation system. Use this tool to check availability, calculate prices and create bookings.
```

---

## N8N WORKFLOW CONFIGURATION

### Workflow: Vapi Izumi Hotel - MYHOST Bizmate IX
- **ID**: `3sU4RgV892az8nLZ`
- **Status**: Active

### Node Structure
```
Webhook for vapi
       ↓
Keep Session id & Query
       ↓
    AI Agent ←→ OpenAI Chat Model
       ↓        ←→ Simple Memory
       ↓        ←→ Check Availability (Tool)
       ↓        ←→ Calculate Price (Tool)
       ↓        ←→ Create Booking (Tool)
    Clean Output
       ↓
  Respond to Vapi
```

### Node: Webhook for vapi
- **Path**: `vapi-izumi-fix`
- **Method**: POST
- **Response Mode**: Response Node

### Node: Keep Session id & Query
**Fields:**
```
id: ={{ $json.body.message.toolCallList[0].id }}
question: ={{ $json.body.message.toolCallList[0].function.arguments.user_query }}
```

### Node: AI Agent - System Message
```
You are Ayu, the virtual receptionist at Izumi Hotel, a luxury 5-star boutique hotel in Ubud, Bali.

LANGUAGE: Always respond in English. Speak numbers naturally (e.g., 'four hundred fifty dollars', 'January fifteenth').

HOTEL INFO:
- Location: Jl Raya Andong N. 18, Ubud, Bali
- Check-in: 2:00 PM | Check-out: 12:00 PM
- Opening: Summer 2026

ROOMS & RATES (per night):
- Tropical Room: $450
- River Villa: $500
- Nest Villa: $525
- Cave Villa: $550
- Sky Villa: $550
- Blossom Villa: $600
- 5BR Villa: $2,500

TOOLS:
- Check Availability: Use when user asks about dates
- Calculate Price: Use to calculate total cost
- Create Booking: Use to create the reservation in the system

CONVERSATION FLOW:
1. AVAILABILITY CHECK - When user provides dates, use Check Availability tool, then summarize:
   'Great news! We have availability from [check-in] to [check-out]. That is [X] nights. For [X] guests, I would recommend our [Room Type] at $[price] per night, totaling $[total]. Would you like to proceed?'

2. COLLECT GUEST DETAILS - Ask for: Full name, Email, Phone (with country code)

3. CONFIRM AND BOOK - Read back all details and ask for confirmation. When user says YES, immediately use Create Booking tool.

CRITICAL RULE FOR BOOKING:
When you receive a message containing "CREATE BOOKING:" followed by guest data, you MUST immediately execute the Create Booking tool using the provided values:
- guest_name: the name provided
- guest_email: the email provided
- guest_phone: the phone provided
- check_in: the check-in date in YYYY-MM-DD format
- check_out: the check-out date in YYYY-MM-DD format
- guests: the number of guests
- total_price: the total amount as a number

Do NOT ask for more information. Execute Create Booking immediately with the data provided.

RULES:
- Keep responses concise but complete
- Never use double quotes in responses, use single quotes instead
- All dates should use year 2025 or 2026, never 2023 or 2024
```

### Node: Clean Output (Code)
```javascript
const output = $input.first().json.output || '';
const cleanOutput = output
  .replace(/"/g, "'")
  .replace(/\n/g, " ")
  .replace(/\r/g, "")
  .replace(/\\/g, "");

return [{ json: { output: cleanOutput } }];
```

### Node: Respond to Vapi
**Response Body:**
```
={{ JSON.stringify({ "results": [{ "toolCallId": $('Keep Session id & Query').item.json.id, "result": $json.output }] }) }}
```

### Node: Check Availability
- **URL**: `https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/rpc/check_availability`
- **Method**: POST
- **JSON Body**:
```json
={
  "p_property_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2",
  "p_check_in": "{{ $fromAI('check_in', 'check-in date in YYYY-MM-DD format') }}",
  "p_check_out": "{{ $fromAI('check_out', 'check-out date in YYYY-MM-DD format') }}"
}
```

### Node: Calculate Price
- **URL**: `https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/rpc/calculate_price`
- **Method**: POST

### Node: Create Booking
- **URL**: `https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/bookings`
- **Method**: POST
- **JSON Body**:
```json
={
  "property_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2",
  "guest_name": "{{ $fromAI('guest_name', 'full name of the guest') }}",
  "guest_email": "{{ $fromAI('guest_email', 'guest email address') }}",
  "guest_phone": "{{ $fromAI('guest_phone', 'guest phone number with country code') }}",
  "check_in": "{{ $fromAI('check_in', 'check-in date in YYYY-MM-DD format') }}",
  "check_out": "{{ $fromAI('check_out', 'check-out date in YYYY-MM-DD format') }}",
  "guests": {{ $fromAI('guests', 'number of guests as integer') }},
  "total_price": {{ $fromAI('total_price', 'total price in dollars as number without symbol') }},
  "status": "inquiry",
  "channel": "direct"
}
```

### Supabase Headers (for all HTTP Request nodes)
```
apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0
Authorization: Bearer [same key]
Content-Type: application/json
```

---

## SUPABASE SETUP

### Property ID
```
18711359-1378-4d12-9ea6-fb31c0b1bac2
```

### Create Property (if missing)
```sql
INSERT INTO properties (id, name, address, city, country, base_price)
VALUES (
  '18711359-1378-4d12-9ea6-fb31c0b1bac2',
  'Izumi Hotel',
  'Jl Raya Andong N. 18',
  'Ubud, Bali',
  'Indonesia',
  450
);
```

### Bookings Table Required Fields
- property_id (UUID, foreign key)
- guest_name (text)
- guest_email (text)
- guest_phone (text)
- check_in (date)
- check_out (date)
- guests (integer)
- total_price (numeric)
- status (text)
- channel (text)

---

## TROUBLESHOOTING GUIDE

### Problem 1: VAPI doesn't call the tool
**Symptoms:** 
- AI responds but n8n shows no executions
- VAPI logs show no tool-calls

**Solution:**
- Check System Prompt includes: "Always use the send_to_n8n tool for every user message"
- Verify tool is assigned to assistant in VAPI → Assistants → Model → Tools
- Check Server URL is correct

### Problem 2: n8n receives empty data
**Symptoms:**
- id: [null]
- question: = (empty)

**Solution:**
- Check "Keep Session id & Query" node
- Ensure expressions use single `=` not double `==`
- Correct: `={{ $json.body.message.toolCallList[0].function.arguments.user_query }}`

### Problem 3: AI Agent doesn't use tools
**Symptoms:**
- "None of your tools were used in this run"
- Tools show dotted lines (not executed)

**Solution:**
- Check System Message in AI Agent
- Verify tool descriptions are clear
- Check OpenAI Chat Model credentials

### Problem 4: Invalid JSON errors
**Symptoms:**
- "Invalid JSON in 'Response Body' field"
- "JSON parameter needs to be valid JSON"

**Solution:**
- Check for double `==` in JSON bodies (should be single `=`)
- Add Clean Output node to sanitize AI responses
- Verify Response Body uses JSON.stringify

### Problem 5: Supabase foreign key error
**Symptoms:**
- "violates foreign key constraint 'bookings_property_id_fkey'"

**Solution:**
- Create property in Supabase with correct ID
- Run: `INSERT INTO properties (id, name, base_price) VALUES ('18711359-1378-4d12-9ea6-fb31c0b1bac2', 'Izumi Hotel', 450);`

### Problem 6: Wrong year in dates (2023 instead of 2025)
**Symptoms:**
- Transcriber converts "December 26th" to "2023-12-26"

**Solution:**
- Add to VAPI System Prompt: "The current year is 2025. When users mention dates without a year, always assume 2025 or 2026. Never use 2023 or 2024."

---

## RECOVERY PROMPTS

### If everything breaks, start fresh with these:

#### VAPI System Prompt (copy exactly)
```
You are Ayu from Izumi Hotel in Bali. Always respond in English only.

IMPORTANT: The current year is 2025. When users mention dates without a year, always assume 2025 or 2026. Never use 2023 or 2024.

IMPORTANT: When using the send_to_n8n tool, you MUST include ALL information collected from the user in the user_query parameter. This includes:
- Check-in and check-out dates (always use year 2025 or 2026)
- Number of guests
- Room type
- Guest full name
- Guest email
- Guest phone number with country code

CRITICAL: When the user says YES to confirm a reservation, you MUST send ALL the booking data to n8n in this format:
"CREATE BOOKING: guest_name=[name], guest_email=[email], guest_phone=[phone], check_in=[YYYY-MM-DD], check_out=[YYYY-MM-DD], guests=[number], room_type=[room], total_price=[amount]"

Always use the send_to_n8n tool for every user message. Never respond without using the tool first.
```

#### N8N AI Agent System Message (copy exactly)
```
You are Ayu, the virtual receptionist at Izumi Hotel, a luxury 5-star boutique hotel in Ubud, Bali.

LANGUAGE: Always respond in English. Speak numbers naturally (e.g., 'four hundred fifty dollars', 'January fifteenth').

HOTEL INFO:
- Location: Jl Raya Andong N. 18, Ubud, Bali
- Check-in: 2:00 PM | Check-out: 12:00 PM
- Opening: Summer 2026

ROOMS & RATES (per night):
- Tropical Room: $450
- River Villa: $500
- Nest Villa: $525
- Cave Villa: $550
- Sky Villa: $550
- Blossom Villa: $600
- 5BR Villa: $2,500

TOOLS:
- Check Availability: Use when user asks about dates
- Calculate Price: Use to calculate total cost
- Create Booking: Use to create the reservation in the system

CONVERSATION FLOW:
1. AVAILABILITY CHECK - When user provides dates, use Check Availability tool, then summarize:
   'Great news! We have availability from [check-in] to [check-out]. That is [X] nights. For [X] guests, I would recommend our [Room Type] at $[price] per night, totaling $[total]. Would you like to proceed?'

2. COLLECT GUEST DETAILS - Ask for: Full name, Email, Phone (with country code)

3. CONFIRM AND BOOK - Read back all details and ask for confirmation. When user says YES, immediately use Create Booking tool.

CRITICAL RULE FOR BOOKING:
When you receive a message containing "CREATE BOOKING:" followed by guest data, you MUST immediately execute the Create Booking tool using the provided values:
- guest_name: the name provided
- guest_email: the email provided
- guest_phone: the phone provided
- check_in: the check-in date in YYYY-MM-DD format
- check_out: the check-out date in YYYY-MM-DD format
- guests: the number of guests
- total_price: the total amount as a number

Do NOT ask for more information. Execute Create Booking immediately with the data provided.

RULES:
- Keep responses concise but complete
- Never use double quotes in responses, use single quotes instead
- All dates should use year 2025 or 2026, never 2023 or 2024
```

#### Keep Session id & Query (expressions)
```
id: ={{ $json.body.message.toolCallList[0].id }}
question: ={{ $json.body.message.toolCallList[0].function.arguments.user_query }}
```

#### Respond to Vapi (Response Body)
```
={{ JSON.stringify({ "results": [{ "toolCallId": $('Keep Session id & Query').item.json.id, "result": $json.output }] }) }}
```

#### Clean Output (Code node)
```javascript
const output = $input.first().json.output || '';
const cleanOutput = output
  .replace(/"/g, "'")
  .replace(/\n/g, " ")
  .replace(/\r/g, "")
  .replace(/\\/g, "");

return [{ json: { output: cleanOutput } }];
```

---

## LESSONS LEARNED (December 25, 2025)

### Root Causes of 9-Hour Debug Session

1. **VAPI stopped calling tools** - GPT-4o-mini behavior changed, required more explicit prompts
2. **Incomplete data in tool calls** - VAPI wasn't sending all collected data when user confirmed
3. **Missing property in Supabase** - Foreign key constraint failed

### Prevention Checklist

Before making changes:
- [ ] Export current working n8n workflow as backup
- [ ] Screenshot current VAPI System Prompt
- [ ] Test one change at a time
- [ ] Verify each step: VAPI → n8n → Supabase

### Debug Order
1. Check VAPI logs - is tool being called?
2. Check n8n executions - is data arriving?
3. Check n8n AI Agent - are tools executing?
4. Check Supabase - is data being saved?

---

## CONTACT & RESOURCES

- **VAPI Dashboard**: https://dashboard.vapi.ai
- **N8N Instance**: https://n8n-production-bb2d.up.railway.app
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Izumi Hotel WhatsApp**: +62 813 2576 4867

---

*Last updated: December 25, 2025 - Post debug session*
*Document version: 2.0*

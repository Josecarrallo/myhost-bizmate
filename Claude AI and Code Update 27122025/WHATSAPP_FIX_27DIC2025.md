# WHATSAPP LINE BREAKS FIX - December 27, 2025

**Status:** ✅ RESOLVED
**Commit:** `834c4de` - fix: WhatsApp messages with line breaks - escape \n before sending to n8n
**Date:** December 27, 2025

---

## PROBLEM DESCRIPTION

### Error Message
```
JSON parameter needs to be valid JSON
```

### Symptom
WhatsApp messages with line breaks (`\n`) failed to send through n8n workflow WF-COMM-02. The workflow would fail with a JSON validation error.

### Example Failing Message
```
Dear José Carrallo,

Welcome to Your Property! We're thrilled to have you stay with us.

If you have any questions before your arrival, please don't hesitate to reach out.

Best regards,
Your Property Team
```

---

## ROOT CAUSE ANALYSIS

The problem was caused by **TWO COMBINED ISSUES**:

### Issue 1: Frontend - Unescaped Line Breaks

**Location:** `src/services/communicationsService.js` - method `triggerN8NWebhook`

**Problem:** Frontend was sending raw line breaks (`\n`) in the JSON payload to n8n webhook:

```json
{
  "message": "Line 1
Line 2
Line 3"
}
```

This created **invalid JSON** because real line breaks break JSON string formatting.

**Should be:**
```json
{
  "message": "Line 1\\nLine 2\\nLine 3"
}
```

### Issue 2: n8n - Incorrect JSON Body Syntax

**Location:** n8n workflow WF-COMM-02, HTTP Request node (Chakra - Send WhatsApp)

**Problem:** The JSON Body field had `=` prefix:

```json
={
  "messaging_product": "whatsapp",
  "to": "{{ $json.body.recipient }}",
  "type": "text",
  "text": {
    "body": "{{ $json.body.message }}"
  }
}
```

In n8n, the `=` prefix tells n8n to evaluate the **entire expression** as JavaScript, which added a **literal `=` character** to the output, creating invalid JSON.

---

## SOLUTION IMPLEMENTED

### Fix 1: Frontend - Escape Line Breaks (Claude Code)

**File:** `src/services/communicationsService.js`
**Lines:** 227-231

**Code Added:**
```javascript
async triggerN8NWebhook(payload) {
  const webhookPath = payload.channel === 'email'
    ? '/webhook/communications/send-email'
    : '/webhook/communications/send-whatsapp';

  const N8N_WEBHOOK_URL = `https://n8n-production-bb2d.up.railway.app${webhookPath}`;

  // Escapar saltos de línea en el mensaje para evitar romper JSON en n8n
  const escapedPayload = {
    ...payload,
    message: payload.message ? payload.message.replace(/\n/g, '\\n').replace(/\r/g, '\\r') : payload.message
  };

  console.log('Triggering n8n webhook:', N8N_WEBHOOK_URL);
  console.log('Payload:', escapedPayload);

  const response = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(escapedPayload)
  });

  // ... rest of code
}
```

**What it does:**
- Creates a copy of the payload
- Replaces `\n` → `\\n` (escaped newline)
- Replaces `\r` → `\\r` (escaped carriage return)
- Sends the escaped payload to n8n

**Result:** n8n now receives valid JSON with escaped line breaks.

### Fix 2: n8n - Remove = Prefix (José with Claude AI)

**Workflow:** WF-COMM-02 - Send WhatsApp to Guest
**Node:** Chakra - Send WhatsApp (HTTP Request)

**Before (WRONG):**
```json
={
  "messaging_product": "whatsapp",
  "to": "{{ $json.body.recipient }}",
  "type": "text",
  "text": {
    "body": "{{ $json.body.message }}"
  }
}
```

**After (CORRECT):**
```json
{
  "messaging_product": "whatsapp",
  "to": "{{ $json.body.recipient }}",
  "type": "text",
  "text": {
    "body": "{{ $json.body.message }}"
  }
}
```

**What changed:** Removed the `=` prefix at the beginning

**Result:** n8n now correctly interpolates variables without adding literal `=`

---

## N8N SYNTAX RULES - CRITICAL LEARNING

### Rule 1: JSON Body with Variable Interpolation

When using n8n's HTTP Request node with JSON body containing `{{ }}` interpolations:

✅ **CORRECT:**
```json
{
  "to": "{{ $json.body.recipient }}",
  "message": "{{ $json.body.message }}"
}
```

❌ **WRONG:**
```json
={
  "to": "{{ $json.body.recipient }}",
  "message": "{{ $json.body.message }}"
}
```

**Why it's wrong:** The `=` prefix makes n8n evaluate the entire thing as a JavaScript expression, which adds a literal `=` to the output.

### Rule 2: When to Use = Prefix

Only use `=` when the **ENTIRE field** is a JavaScript expression:

✅ **CORRECT:**
```javascript
={{ JSON.stringify($json) }}
```

✅ **CORRECT:**
```javascript
={{ $json.body.message.toUpperCase() }}
```

❌ **WRONG:**
```json
={
  "key": "value"
}
```

### Rule 3: Field Types in n8n

**Fixed Mode:**
- Plain text, no variables
- Example: `"Hello World"`

**Expression Mode (with {{ }}):**
- JSON with variable interpolations
- Example: `{ "name": "{{ $json.name }}" }`
- **DO NOT** add `=` prefix

**JavaScript Expression Mode (with =):**
- Entire field is JavaScript code
- Example: `={{ JSON.stringify($json) }}`
- Returns the result of the expression

---

## TESTING & VALIDATION

### Test Case 1: Welcome Message with Line Breaks

**Input:**
```javascript
const message = `Dear José Carrallo,

Welcome to Your Property! We're thrilled to have you stay with us.

If you have any questions before your arrival, please don't hesitate to reach out.

Best regards,
Your Property Team`;
```

**Expected:** Message sent successfully via WhatsApp with proper line breaks

**Result:** ✅ PASS - WhatsApp delivered with correct formatting

### Test Case 2: Pre-Check-in Instructions with Line Breaks

**Input:**
```javascript
const message = `Hi José,

We're excited to host you on December 30, 2025!

Check-in time: 2:00 PM
Check-out time: 11:00 AM

Please let us know if you need any special arrangements.

Best regards,
Izumi Hotel Team`;
```

**Expected:** Message sent successfully

**Result:** ✅ PASS

---

## DATA FLOW

### Before Fix (BROKEN)

1. Frontend creates message with `\n` line breaks
2. Frontend sends to n8n webhook:
   ```json
   {
     "message": "Line 1\nLine 2"  // Real line break - INVALID JSON
   }
   ```
3. n8n receives malformed JSON → Error
4. Even if received, n8n's `=` prefix adds literal `=` → Invalid Chakra API call

### After Fix (WORKING)

1. Frontend creates message with `\n` line breaks
2. Frontend **escapes** line breaks:
   ```javascript
   message.replace(/\n/g, '\\n').replace(/\r/g, '\\r')
   ```
3. Frontend sends to n8n webhook:
   ```json
   {
     "message": "Line 1\\nLine 2"  // Escaped - VALID JSON
   }
   ```
4. n8n receives valid JSON
5. n8n interpolates variables **without `=` prefix** → Valid JSON for Chakra
6. Chakra API receives:
   ```json
   {
     "messaging_product": "whatsapp",
     "to": "+34619794604",
     "type": "text",
     "text": {
       "body": "Line 1\\nLine 2"
     }
   }
   ```
7. WhatsApp delivers message with proper line breaks ✅

---

## FILES MODIFIED

### Frontend
- **File:** `src/services/communicationsService.js`
- **Method:** `triggerN8NWebhook`
- **Lines:** 227-231
- **Change:** Added `escapedPayload` with line break escaping

### n8n Workflow
- **Workflow:** WF-COMM-02 - Send WhatsApp to Guest
- **File:** `n8n_worlkflow_claude/WF-COMM-02-[version].json`
- **Node:** Chakra - Send WhatsApp (HTTP Request)
- **Change:** Removed `=` prefix from JSON Body field

---

## COMPARISON: Email vs WhatsApp

### Email Workflow (WF-COMM-01)
- **No line break escaping needed** in frontend
- SendGrid node handles multi-line content natively
- Works with raw `\n` in message

### WhatsApp Workflow (WF-COMM-02)
- **Requires line break escaping** in frontend (`\n` → `\\n`)
- HTTP Request to Chakra API requires valid JSON
- Cannot handle raw line breaks in JSON strings

**Conclusion:** Frontend now escapes line breaks **for all channels**, ensuring compatibility with both email and WhatsApp workflows.

---

## COMMIT DETAILS

**Commit Hash:** `834c4de`
**Branch:** `backup-antes-de-automatizacion`
**Author:** José Carrallo
**Date:** December 27, 2025

**Commit Message:**
```
fix: WhatsApp messages with line breaks - escape \n before sending to n8n

Fixed "JSON parameter needs to be valid JSON" error in n8n WhatsApp workflow.

Problem:
Two issues were breaking WhatsApp messages with line breaks (\n):
1. Frontend sent raw \n (real line breaks) which broke JSON in n8n
2. n8n JSON Body had = prefix which added literal = to output

Solution:
Frontend (communicationsService.js):
- Escape \n → \\n and \r → \\r before sending to webhook
- Lines 227-231: escapedPayload with message.replace()

n8n (WF-COMM-02):
- Remove = prefix from JSON Body field
- Use: { "to": "{{ $json.body.recipient }}" }
- NOT: ={ "to": "{{ ... }}" }

Key Learning:
In n8n JSON Body field:
✅ Correct: { "key": "{{ $json.value }}" } (JSON with interpolations)
❌ Wrong: ={ "key": "{{ $json.value }}" } (adds literal =)
✅ Only use = when: ={{ JSON.stringify($json) }} (full JS expression)

Result: WhatsApp messages now work correctly with multi-line content.
```

---

## LESSONS LEARNED

### 1. Always Escape Special Characters Before Sending JSON
When sending data to APIs via JSON:
- Escape newlines: `\n` → `\\n`
- Escape carriage returns: `\r` → `\\r`
- Escape tabs: `\t` → `\\t`
- Escape backslashes: `\` → `\\`

### 2. Understand n8n Field Types
- **Fixed:** Plain values
- **Expression {{ }}:** Variables in strings/JSON
- **JavaScript =:** Full JS expressions

### 3. Test with Real Multi-line Content
Don't just test with "Hello World" - test with:
- Multi-paragraph messages
- Lists with line breaks
- Formatted text (emails, receipts, etc.)

### 4. Debug Both Ends
When webhook fails:
- Check frontend payload (console.log before fetch)
- Check n8n received data (webhook node output)
- Check n8n processed data (subsequent nodes)
- Check final API call (HTTP Request node)

---

## FUTURE IMPROVEMENTS

### 1. Template Preview with Line Breaks
Add preview in frontend that shows how message will look with line breaks:
```
Welcome message will be sent as:
┌────────────────────────────┐
│ Dear José,                 │
│                            │
│ Welcome to Izumi Hotel!    │
│                            │
│ Check-in: 2:00 PM          │
│ Check-out: 11:00 AM        │
│                            │
│ Best regards,              │
│ Izumi Hotel Team           │
└────────────────────────────┘
```

### 2. Centralized String Escaping Utility
Create utility function:
```javascript
export const escapeForJSON = (str) => {
  return str
    .replace(/\\/g, '\\\\')   // Backslash first
    .replace(/\n/g, '\\n')    // Newline
    .replace(/\r/g, '\\r')    // Carriage return
    .replace(/\t/g, '\\t')    // Tab
    .replace(/"/g, '\\"');    // Double quote
};
```

### 3. n8n Workflow Testing Guide
Document standard test cases:
- Empty message
- Single line message
- Multi-line message
- Special characters (emojis, accents)
- Very long messages (>1000 chars)

---

## REFERENCES

### n8n Documentation
- [Expressions](https://docs.n8n.io/code-examples/expressions/)
- [HTTP Request Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/)
- [Working with JSON](https://docs.n8n.io/data/data-structure/)

### Chakra WhatsApp API
- API URL: `https://api.chakrahq.com/v1/ext/plugin/whatsapp/.../messages`
- Message format requires escaped line breaks in JSON

### Related Workflows
- WF-COMM-01: Send Email to Guest (working)
- WF-COMM-02: Send WhatsApp to Guest (now working)

---

**Status:** ✅ RESOLVED AND DOCUMENTED
**Next Steps:** Continue with Marketing & Growth module

# MCP Integrations - Quick Start Guide

## 5-Minute Setup

### Step 1: Copy Environment File

```bash
cp .env.example .env
```

### Step 2: Add Your Credentials

Edit `.env` and add your credentials:

```bash
# Get from your n8n instance settings → API
N8N_API_URL=https://your-n8n.com
N8N_API_KEY=your_api_key

# Get from Supabase dashboard → Settings → API
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

### Step 3: Test Your Setup

```bash
node tests/test-mcp-integrations.js
```

You should see:
```
✅ n8n Authentication: SUCCESS
✅ Supabase Authentication: SUCCESS
✅ ALL TESTS PASSED!
```

### Step 4: Try the Demo

```bash
node examples/demo-integrations.js
```

---

## Using in Your Code

### Option 1: Quick Start (Individual Clients)

```javascript
import { createN8nClient, createSupabaseClient } from './src/integrations/index.js';

// n8n
const n8n = createN8nClient();
const workflows = await n8n.getWorkflows();

// Supabase
const supabase = createSupabaseClient();
const data = await supabase.select('bookings', { limit: 10 });
```

### Option 2: MCP Server (Recommended)

```javascript
import { getMCPServer } from './src/integrations/index.js';

const server = getMCPServer();
await server.initialize();

// Now use both integrations
const workflows = await server.getN8nClient().getWorkflows();
const bookings = await server.queryTable('bookings', { limit: 10 });
```

---

## Common Use Cases

### 1. Send Email When Booking Created

```javascript
// Save booking to database
const booking = await supabase.insert('bookings', bookingData);

// Trigger email workflow
await n8n.executeWorkflow('send-confirmation-email', {
  guestEmail: booking.guest_email,
  bookingId: booking.id
});
```

### 2. Fetch Data from Database

```javascript
// Get active bookings
const bookings = await supabase.select('bookings', {
  filter: { status: 'active' },
  order: 'check_in_date.asc',
  limit: 20
});
```

### 3. Update Dynamic Pricing

```javascript
// Execute pricing workflow
const pricing = await n8n.executeWorkflow('calculate-pricing');

// Update in database
await supabase.update('properties',
  { id: propertyId },
  { price: pricing.newPrice }
);
```

---

## Next Steps

- Read the full documentation: `docs/MCP-INTEGRATIONS.md`
- Explore example workflows: `examples/demo-integrations.js`
- Set up your first automation
- Deploy to production

---

## Troubleshooting

**Can't connect?**
- Check your credentials in `.env`
- Verify your n8n instance is running
- Ensure Supabase project is active

**Need help?**
- Run: `node tests/test-mcp-integrations.js`
- Check error messages
- Review the full docs

---

That's it! You're ready to automate your MY HOST BizMate workflows! 🚀

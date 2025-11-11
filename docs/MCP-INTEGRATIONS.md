# MCP Integrations Guide

## Overview

This guide explains how to use the n8n and Supabase MCP (Model Context Protocol) integrations in your MY HOST BizMate environment.

## Table of Contents

1. [Setup](#setup)
2. [n8n Integration](#n8n-integration)
3. [Supabase Integration](#supabase-integration)
4. [MCP Server](#mcp-server)
5. [Testing](#testing)
6. [Usage Examples](#usage-examples)
7. [Troubleshooting](#troubleshooting)

---

## Setup

### 1. Environment Variables

Create a `.env` file in the root directory (use `.env.example` as a template):

```bash
# n8n Integration
N8N_API_URL=https://your-n8n-instance.com
N8N_API_KEY=your_n8n_api_key_here

# Supabase Integration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Getting Your API Keys

#### n8n API Key
1. Log in to your n8n instance
2. Go to Settings → API
3. Generate a new API key
4. Copy the key to your `.env` file

#### Supabase Keys
1. Log in to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy the "Project URL" and "anon/public" key
5. Add them to your `.env` file

### 3. Verify Setup

Run the test suite to verify your integrations:

```bash
node tests/test-mcp-integrations.js
```

---

## n8n Integration

The n8n client provides methods to interact with your n8n workflows.

### Basic Usage

```javascript
import { createN8nClient } from './src/integrations/index.js';

// Create client
const n8n = createN8nClient();

// Test authentication
const authResult = await n8n.testAuth();
console.log(authResult);
```

### Available Methods

#### Get All Workflows
```javascript
const workflows = await n8n.getWorkflows();
console.log('Workflows:', workflows);
```

#### Get Specific Workflow
```javascript
const workflow = await n8n.getWorkflow('workflow-id');
console.log('Workflow details:', workflow);
```

#### Execute a Workflow
```javascript
const result = await n8n.executeWorkflow('workflow-id', {
  guestName: 'John Doe',
  bookingId: '12345',
  checkInDate: '2025-11-15'
});
console.log('Execution result:', result);
```

#### Get Workflow Executions
```javascript
// Get all executions
const executions = await n8n.getExecutions();

// Get executions for specific workflow
const workflowExecutions = await n8n.getExecutions('workflow-id', 10);
```

#### Create New Workflow
```javascript
const newWorkflow = await n8n.createWorkflow({
  name: 'Guest Welcome Email',
  nodes: [...],
  connections: {...},
  active: true
});
```

#### Activate/Deactivate Workflow
```javascript
// Activate
await n8n.setWorkflowActive('workflow-id', true);

// Deactivate
await n8n.setWorkflowActive('workflow-id', false);
```

---

## Supabase Integration

The Supabase client provides methods to interact with your Supabase database and services.

### Basic Usage

```javascript
import { createSupabaseClient } from './src/integrations/index.js';

// Create client
const supabase = createSupabaseClient();

// Test authentication
const authResult = await supabase.testAuth();
console.log(authResult);
```

### Available Methods

#### Query Data (SELECT)
```javascript
// Get all records
const allBookings = await supabase.select('bookings');

// With filters
const activeBookings = await supabase.select('bookings', {
  filter: { status: 'active' },
  order: 'created_at.desc',
  limit: 10
});

// Complex filters
const results = await supabase.select('payments', {
  filter: {
    amount: { operator: 'gt', value: 1000 },
    status: 'paid'
  }
});
```

#### Insert Data
```javascript
// Single record
const newGuest = await supabase.insert('guests', {
  name: 'Jane Smith',
  email: 'jane@example.com',
  phone: '+1234567890'
});

// Multiple records
const newBookings = await supabase.insert('bookings', [
  { guest_id: 1, property_id: 2, status: 'confirmed' },
  { guest_id: 2, property_id: 3, status: 'pending' }
]);
```

#### Update Data
```javascript
const updated = await supabase.update(
  'bookings',
  { id: 123 },
  { status: 'confirmed', confirmed_at: new Date().toISOString() }
);
```

#### Delete Data
```javascript
await supabase.delete('bookings', { id: 123 });
```

#### Execute Stored Procedures (RPC)
```javascript
const result = await supabase.rpc('calculate_revenue', {
  start_date: '2025-01-01',
  end_date: '2025-11-11'
});
```

#### File Storage
```javascript
// Upload file
await supabase.uploadFile('property-images', 'villa-1.jpg', fileBlob);

// Get file URL
const url = supabase.getFileUrl('property-images', 'villa-1.jpg');

// Delete file
await supabase.deleteFile('property-images', 'villa-1.jpg');
```

#### Authentication
```javascript
// Sign in
const session = await supabase.signIn('user@example.com', 'password');

// Get user info
const user = await supabase.getUser(session.access_token);
```

---

## MCP Server

The MCP Server provides a unified interface for both integrations.

### Basic Usage

```javascript
import { getMCPServer } from './src/integrations/index.js';

// Get server instance
const server = getMCPServer();

// Initialize
await server.initialize();

// Test all connections
const results = await server.testAllConnections();
console.log(results);
```

### High-Level Methods

#### Execute Workflow
```javascript
const result = await server.executeWorkflow('workflow-id', {
  bookingId: '123'
});
```

#### Query Database
```javascript
const bookings = await server.queryTable('bookings', {
  filter: { status: 'active' }
});
```

#### Insert Data
```javascript
const newRecord = await server.insertData('guests', {
  name: 'John Doe',
  email: 'john@example.com'
});
```

### Combined Operations

#### Execute Workflow and Save Results
```javascript
const result = await server.executeWorkflowAndSave(
  'data-processing-workflow',
  { input: 'data' },
  'processed_results',
  (workflowResult) => ({
    processed_at: new Date().toISOString(),
    data: workflowResult.output
  })
);
```

#### Trigger Workflow from Database
```javascript
const result = await server.triggerWorkflowFromDatabase(
  'bookings',
  { status: 'pending' },
  'booking-confirmation-workflow'
);
```

---

## Testing

### Run All Tests

```bash
node tests/test-mcp-integrations.js
```

### Test Output

The test suite will verify:
- ✅ n8n authentication and connectivity
- ✅ Supabase authentication and connectivity
- ✅ MCP Server initialization
- ✅ All integration status

Example output:
```
╔════════════════════════════════════════════╗
║   MCP INTEGRATIONS TEST SUITE              ║
║   MY HOST BizMate Environment              ║
╚════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 Testing n8n Integration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Authentication: SUCCESS
✅ Connection: ESTABLISHED
📊 Workflows found: 5
```

---

## Usage Examples

### Example 1: Automated Guest Welcome

```javascript
import { getMCPServer } from './src/integrations/index.js';

async function sendGuestWelcome(bookingId) {
  const server = getMCPServer();
  await server.initialize();

  // Get booking details from database
  const [booking] = await server.queryTable('bookings', {
    filter: { id: bookingId }
  });

  // Execute welcome email workflow
  const result = await server.executeWorkflow('guest-welcome-email', {
    guestName: booking.guest_name,
    checkInDate: booking.check_in_date,
    propertyName: booking.property_name
  });

  // Log the execution in database
  await server.insertData('workflow_logs', {
    booking_id: bookingId,
    workflow_name: 'guest-welcome-email',
    execution_id: result.id,
    status: result.status
  });

  return result;
}
```

### Example 2: Dynamic Pricing Update

```javascript
import { getMCPServer } from './src/integrations/index.js';

async function updateDynamicPricing() {
  const server = getMCPServer();
  await server.initialize();

  // Execute pricing calculation workflow
  const pricingData = await server.executeWorkflow('calculate-dynamic-pricing', {
    date: new Date().toISOString()
  });

  // Update prices in database
  for (const item of pricingData.prices) {
    await server.queryTable('properties').update(
      { id: item.property_id },
      { current_price: item.new_price, updated_at: new Date().toISOString() }
    );
  }

  return pricingData;
}
```

### Example 3: Booking Workflow Automation

```javascript
import { getMCPServer } from './src/integrations/index.js';

async function processNewBooking(bookingData) {
  const server = getMCPServer();
  await server.initialize();

  // Save booking to database
  const [booking] = await server.insertData('bookings', bookingData);

  // Trigger automation workflows
  const workflows = [
    'send-confirmation-email',
    'notify-property-manager',
    'create-calendar-event',
    'generate-invoice'
  ];

  const results = await Promise.all(
    workflows.map(workflowId =>
      server.executeWorkflow(workflowId, { bookingId: booking.id })
    )
  );

  return {
    booking,
    automationResults: results
  };
}
```

### Example 4: React Component Integration

```javascript
import { useEffect, useState } from 'react';
import { getMCPServer } from './integrations/index.js';

function BookingsList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const server = getMCPServer();
        await server.initialize();

        const data = await server.queryTable('bookings', {
          order: 'created_at.desc',
          limit: 20
        });

        setBookings(data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {bookings.map(booking => (
        <div key={booking.id}>{booking.guest_name}</div>
      ))}
    </div>
  );
}
```

---

## Troubleshooting

### Common Issues

#### Authentication Failed

**Problem:** `Authentication failed. Check your API key.`

**Solution:**
1. Verify your `.env` file has the correct credentials
2. Ensure no extra spaces or quotes in the values
3. Check that your API keys are still valid
4. For n8n: Verify the API is enabled in your instance
5. For Supabase: Check your project is active

#### Connection Timeout

**Problem:** Request times out or hangs

**Solution:**
1. Verify your API URLs are correct and accessible
2. Check your network connection
3. Ensure no firewall is blocking the requests
4. For n8n: Verify your instance is running

#### CORS Errors (Browser)

**Problem:** CORS policy errors in browser console

**Solution:**
1. For production: Configure CORS in your n8n/Supabase settings
2. For development: Use a proxy or run tests in Node.js
3. Add proper headers to your requests

#### Missing Environment Variables

**Problem:** `Required environment variables not found`

**Solution:**
1. Copy `.env.example` to `.env`
2. Fill in all required values
3. Restart your development server
4. For Vite: Use `VITE_` prefix (e.g., `VITE_N8N_API_URL`)

### Debug Mode

Enable debug logging:

```javascript
const server = getMCPServer();
server.initialize({ debug: true });
```

---

## Best Practices

1. **Security**
   - Never commit `.env` files to git
   - Use environment variables for all credentials
   - Rotate API keys regularly
   - Use row-level security in Supabase

2. **Performance**
   - Cache frequently accessed data
   - Use pagination for large datasets
   - Implement retry logic for failed requests
   - Consider rate limiting

3. **Error Handling**
   - Always wrap API calls in try-catch blocks
   - Log errors for debugging
   - Provide user-friendly error messages
   - Implement fallback mechanisms

4. **Testing**
   - Run tests before deployment
   - Test with production-like data
   - Monitor API usage and quotas
   - Set up alerts for failures

---

## Support

For issues or questions:
- Check the [n8n documentation](https://docs.n8n.io)
- Check the [Supabase documentation](https://supabase.com/docs)
- Review test output for specific error messages
- Check your API quota and limits

---

## Next Steps

1. Set up your environment variables
2. Run the test suite
3. Try the usage examples
4. Build your own integrations
5. Deploy to production

Happy automating! 🚀

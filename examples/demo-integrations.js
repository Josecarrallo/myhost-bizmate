/**
 * MCP Integrations Demo
 * Shows how to use n8n and Supabase integrations in your application
 *
 * Usage: node examples/demo-integrations.js
 */

import { getMCPServer } from '../src/integrations/index.js';

// Demo 1: Initialize and test connections
async function demo1_TestConnections() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Demo 1: Initialize and Test Connections');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const server = getMCPServer();

  // Initialize
  console.log('Initializing MCP Server...');
  const initResult = await server.initialize();
  console.log('✓ Initialized:', initResult.clients.join(', '));

  // Test connections
  console.log('\nTesting connections...');
  const testResults = await server.testAllConnections();

  console.log('\nResults:');
  console.log('  n8n:', testResults.n8n.success ? '✅ Connected' : '❌ Failed');
  console.log('  Supabase:', testResults.supabase.success ? '✅ Connected' : '❌ Failed');

  return testResults;
}

// Demo 2: Working with n8n workflows
async function demo2_N8nWorkflows() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Demo 2: Working with n8n Workflows');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const server = getMCPServer();
  await server.initialize();

  try {
    const n8n = server.getN8nClient();

    // Get all workflows
    console.log('Fetching workflows...');
    const workflows = await n8n.getWorkflows();
    console.log(`✓ Found ${workflows.data?.length || 0} workflows`);

    if (workflows.data && workflows.data.length > 0) {
      console.log('\nWorkflows:');
      workflows.data.slice(0, 5).forEach((wf, i) => {
        console.log(`  ${i + 1}. ${wf.name} (${wf.id}) - ${wf.active ? 'Active' : 'Inactive'}`);
      });
    }

    // Example: Execute a workflow (uncomment and modify with your workflow ID)
    // const result = await n8n.executeWorkflow('your-workflow-id', {
    //   param1: 'value1',
    //   param2: 'value2'
    // });
    // console.log('\nWorkflow execution result:', result);

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Demo 3: Working with Supabase database
async function demo3_SupabaseData() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Demo 3: Working with Supabase Database');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const server = getMCPServer();
  await server.initialize();

  try {
    const supabase = server.getSupabaseClient();

    // Example: Query a table (uncomment and modify with your table name)
    // console.log('Querying bookings table...');
    // const bookings = await supabase.select('bookings', {
    //   limit: 10,
    //   order: 'created_at.desc'
    // });
    // console.log(`✓ Found ${bookings.length} bookings`);

    // Example: Insert data (uncomment and modify)
    // const newRecord = await supabase.insert('guests', {
    //   name: 'Demo Guest',
    //   email: 'demo@example.com',
    //   created_at: new Date().toISOString()
    // });
    // console.log('✓ Created new guest:', newRecord);

    console.log('Supabase client is ready!');
    console.log('Uncomment the examples above to test with your tables.');

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Demo 4: Combined workflow - Execute n8n workflow and save to Supabase
async function demo4_CombinedWorkflow() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Demo 4: Combined Workflow (n8n + Supabase)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const server = getMCPServer();
  await server.initialize();

  try {
    // Example: Execute workflow and save results
    // const result = await server.executeWorkflowAndSave(
    //   'data-processing-workflow',
    //   { date: new Date().toISOString() },
    //   'workflow_results',
    //   (workflowData) => ({
    //     executed_at: new Date().toISOString(),
    //     status: 'completed',
    //     data: workflowData
    //   })
    // );
    // console.log('✓ Workflow executed and saved:', result);

    console.log('Combined workflow capabilities are ready!');
    console.log('This allows you to:');
    console.log('  1. Execute n8n workflows');
    console.log('  2. Transform the results');
    console.log('  3. Save to Supabase database');
    console.log('\nUncomment the example above to test.');

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Demo 5: Practical example - Guest booking automation
async function demo5_BookingAutomation() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Demo 5: Practical Example - Booking Automation');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('Example booking automation workflow:\n');

  console.log('Step 1: Guest makes a booking (saved to Supabase)');
  console.log('  → const booking = await supabase.insert("bookings", {...})');

  console.log('\nStep 2: Trigger welcome email workflow (n8n)');
  console.log('  → await n8n.executeWorkflow("guest-welcome", { bookingId })');

  console.log('\nStep 3: Schedule check-in reminder (n8n)');
  console.log('  → await n8n.executeWorkflow("check-in-reminder", {...})');

  console.log('\nStep 4: Update booking status (Supabase)');
  console.log('  → await supabase.update("bookings", { id }, { status: "confirmed" })');

  console.log('\nStep 5: Generate invoice (n8n → Supabase)');
  console.log('  → await server.executeWorkflowAndSave(...)');

  console.log('\n✓ All steps can be automated with these integrations!\n');
}

// Main runner
async function runDemos() {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║   MCP INTEGRATIONS DEMO                    ║');
  console.log('║   MY HOST BizMate Environment              ║');
  console.log('╚════════════════════════════════════════════╝');

  try {
    // Run all demos
    await demo1_TestConnections();
    await demo2_N8nWorkflows();
    await demo3_SupabaseData();
    await demo4_CombinedWorkflow();
    await demo5_BookingAutomation();

    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║   ✅ DEMOS COMPLETED                       ║');
    console.log('║   Check the documentation for more info    ║');
    console.log('║   → docs/MCP-INTEGRATIONS.md               ║');
    console.log('╚════════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('\n❌ Demo error:', error.message);
    console.error('\nMake sure you have:');
    console.error('  1. Created a .env file with your credentials');
    console.error('  2. Valid n8n and Supabase credentials');
    console.error('  3. Network access to both services\n');
  }
}

// Run demos
runDemos();

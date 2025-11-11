/**
 * MCP Integrations Test Suite
 * Tests authentication and connectivity for n8n and Supabase
 *
 * Usage: node tests/test-mcp-integrations.js
 */

import N8nClient from '../src/integrations/n8n-client.js';
import SupabaseClient from '../src/integrations/supabase-client.js';
import { getMCPServer } from '../src/integrations/mcp-server.js';

// Load environment variables from .env file if it exists
async function loadEnv() {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const envPath = path.join(process.cwd(), '.env');

    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      envContent.split('\n').forEach(line => {
        const [key, ...values] = line.split('=');
        if (key && values.length > 0) {
          process.env[key.trim()] = values.join('=').trim();
        }
      });
      console.log('✓ Loaded environment variables from .env file\n');
    }
  } catch (error) {
    console.log('ℹ No .env file found, using system environment variables\n');
  }
}

// Test n8n Integration
async function testN8n() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔧 Testing n8n Integration');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const n8nUrl = process.env.N8N_API_URL;
  const n8nKey = process.env.N8N_API_KEY;

  if (!n8nUrl || !n8nKey) {
    console.log('❌ FAILED: Missing environment variables');
    console.log('   Required: N8N_API_URL and N8N_API_KEY\n');
    return { success: false, error: 'Missing credentials' };
  }

  console.log(`📍 API URL: ${n8nUrl}`);
  console.log(`🔑 API Key: ${n8nKey.substring(0, 8)}...${n8nKey.substring(n8nKey.length - 4)}\n`);

  try {
    const client = new N8nClient(n8nUrl, n8nKey);
    const result = await client.testAuth();

    if (result.success) {
      console.log('✅ Authentication: SUCCESS');
      console.log(`✅ Connection: ESTABLISHED`);
      if (result.workflowCount !== undefined) {
        console.log(`📊 Workflows found: ${result.workflowCount}`);
      }
      console.log(`💬 Message: ${result.message}\n`);
      return result;
    } else {
      console.log('❌ Authentication: FAILED');
      console.log(`❌ Error: ${result.error}`);
      console.log(`📊 Status Code: ${result.status || 'N/A'}\n`);
      return result;
    }
  } catch (error) {
    console.log('❌ EXCEPTION during n8n test:');
    console.log(`   ${error.message}\n`);
    return { success: false, error: error.message };
  }
}

// Test Supabase Integration
async function testSupabase() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🗄️  Testing Supabase Integration');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ FAILED: Missing environment variables');
    console.log('   Required: SUPABASE_URL and SUPABASE_ANON_KEY\n');
    return { success: false, error: 'Missing credentials' };
  }

  console.log(`📍 Project URL: ${supabaseUrl}`);
  console.log(`🔑 Anon Key: ${supabaseKey.substring(0, 20)}...${supabaseKey.substring(supabaseKey.length - 10)}\n`);

  try {
    const client = new SupabaseClient(supabaseUrl, supabaseKey);
    const result = await client.testAuth();

    if (result.success) {
      console.log('✅ Authentication: SUCCESS');
      console.log(`✅ Connection: ESTABLISHED`);
      console.log(`💬 Message: ${result.message}`);
      console.log(`📊 Status Code: ${result.status}\n`);
      return result;
    } else {
      console.log('❌ Authentication: FAILED');
      console.log(`❌ Error: ${result.error}`);
      console.log(`📊 Status Code: ${result.status || 'N/A'}\n`);
      return result;
    }
  } catch (error) {
    console.log('❌ EXCEPTION during Supabase test:');
    console.log(`   ${error.message}\n`);
    return { success: false, error: error.message };
  }
}

// Test MCP Server
async function testMCPServer() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 Testing MCP Server');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    const server = getMCPServer();

    console.log('Initializing MCP Server...');
    const initResult = await server.initialize();

    if (!initResult.success) {
      console.log('❌ Initialization: FAILED');
      console.log(`❌ Error: ${initResult.error}\n`);
      return initResult;
    }

    console.log('✅ Initialization: SUCCESS');
    console.log(`✅ Clients initialized: ${initResult.clients.join(', ')}\n`);

    console.log('Testing all connections...\n');
    const testResults = await server.testAllConnections();

    return {
      success: true,
      initResult,
      testResults
    };
  } catch (error) {
    console.log('❌ EXCEPTION during MCP Server test:');
    console.log(`   ${error.message}\n`);
    return { success: false, error: error.message };
  }
}

// Main test runner
async function runAllTests() {
  console.log('\n');
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   MCP INTEGRATIONS TEST SUITE              ║');
  console.log('║   MY HOST BizMate Environment              ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('\n');

  await loadEnv();

  const results = {
    n8n: null,
    supabase: null,
    mcpServer: null
  };

  // Test individual integrations
  results.n8n = await testN8n();
  results.supabase = await testSupabase();

  // Test MCP Server
  results.mcpServer = await testMCPServer();

  // Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 TEST SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const n8nStatus = results.n8n?.success ? '✅ PASS' : '❌ FAIL';
  const supabaseStatus = results.supabase?.success ? '✅ PASS' : '❌ FAIL';
  const mcpServerStatus = results.mcpServer?.success ? '✅ PASS' : '❌ FAIL';

  console.log(`n8n Integration:        ${n8nStatus}`);
  console.log(`Supabase Integration:   ${supabaseStatus}`);
  console.log(`MCP Server:             ${mcpServerStatus}`);

  const allPassed = results.n8n?.success && results.supabase?.success && results.mcpServer?.success;

  console.log('\n');
  if (allPassed) {
    console.log('╔════════════════════════════════════════════╗');
    console.log('║  ✅ ALL TESTS PASSED!                      ║');
    console.log('║  MCP integrations are ready to use         ║');
    console.log('╚════════════════════════════════════════════╝');
  } else {
    console.log('╔════════════════════════════════════════════╗');
    console.log('║  ⚠️  SOME TESTS FAILED                     ║');
    console.log('║  Please check your configuration           ║');
    console.log('╚════════════════════════════════════════════╝');
  }
  console.log('\n');

  return results;
}

// Run tests
runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

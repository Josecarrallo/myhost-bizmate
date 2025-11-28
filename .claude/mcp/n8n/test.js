#!/usr/bin/env node

/**
 * Test script for n8n MCP server
 * Usage: N8N_API_KEY=your_key node test.js
 */

import fetch from 'node-fetch';

const N8N_API_URL = process.env.N8N_API_URL || 'https://n8n-production-bb2d.up.railway.app/api/v1';
const N8N_API_KEY = process.env.N8N_API_KEY;

if (!N8N_API_KEY) {
  console.error('❌ Error: N8N_API_KEY environment variable is required');
  console.error('Usage: N8N_API_KEY=your_key node test.js');
  process.exit(1);
}

console.log('🧪 Testing n8n MCP Server Connection...\n');
console.log(`📡 API URL: ${N8N_API_URL}`);
console.log(`🔑 API Key: ${N8N_API_KEY.substring(0, 10)}...\n`);

async function testConnection() {
  try {
    console.log('1️⃣ Testing API connection...');

    const response = await fetch(`${N8N_API_URL}/workflows`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`❌ API request failed with status ${response.status}`);
      const errorText = await response.text();
      console.error(`Error: ${errorText}`);
      process.exit(1);
    }

    const workflows = await response.json();
    const workflowList = workflows.data || workflows;

    console.log(`✅ Connection successful!`);
    console.log(`📊 Found ${workflowList.length} workflows\n`);

    if (workflowList.length > 0) {
      console.log('📋 Workflows:');
      workflowList.forEach((w, i) => {
        console.log(`   ${i + 1}. ${w.name} (ID: ${w.id}) - ${w.active ? '🟢 Active' : '⚫ Inactive'}`);
      });
    } else {
      console.log('ℹ️ No workflows found. This is normal for a new n8n instance.');
    }

    console.log('\n✅ All tests passed!');
    console.log('\n🎉 Your n8n MCP server is ready to use!');
    console.log('\nNext steps:');
    console.log('1. Add your API key to claude_desktop_config.json');
    console.log('2. Restart Claude Code');
    console.log('3. Try: "List all my n8n workflows"');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('- Verify your n8n instance is running');
    console.error('- Check that the API key is correct');
    console.error('- Ensure you have network connectivity');
    process.exit(1);
  }
}

testConnection();

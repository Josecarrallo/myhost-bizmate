/**
 * MCP Integrations Entry Point
 * Exports all integration clients and utilities
 */

export { default as N8nClient, createN8nClient } from './n8n-client.js';
export { default as SupabaseClient, createSupabaseClient } from './supabase-client.js';
export { default as MCPServer, getMCPServer } from './mcp-server.js';

// Convenience function to initialize all integrations
export async function initializeMCP(config = {}) {
  const { getMCPServer } = await import('./mcp-server.js');
  const server = getMCPServer();
  return await server.initialize(config);
}

// Convenience function to test all connections
export async function testMCPConnections() {
  const { getMCPServer } = await import('./mcp-server.js');
  const server = getMCPServer();
  return await server.testAllConnections();
}

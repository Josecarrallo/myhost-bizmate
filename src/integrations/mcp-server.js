/**
 * MCP (Model Context Protocol) Server Implementation
 * Unified interface for n8n and Supabase integrations
 */

import N8nClient from './n8n-client.js';
import SupabaseClient from './supabase-client.js';

class MCPServer {
  constructor() {
    this.clients = {};
    this.initialized = false;
  }

  /**
   * Initialize all MCP integrations
   */
  async initialize(config = {}) {
    try {
      // Initialize n8n client
      const n8nUrl = config.n8nUrl || process.env.N8N_API_URL || import.meta.env.VITE_N8N_API_URL;
      const n8nKey = config.n8nKey || process.env.N8N_API_KEY || import.meta.env.VITE_N8N_API_KEY;

      if (n8nUrl && n8nKey) {
        this.clients.n8n = new N8nClient(n8nUrl, n8nKey);
        console.log('✓ n8n client initialized');
      } else {
        console.warn('⚠ n8n credentials not found. Skipping n8n initialization.');
      }

      // Initialize Supabase client
      const supabaseUrl = config.supabaseUrl || process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = config.supabaseKey || process.env.SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        this.clients.supabase = new SupabaseClient(supabaseUrl, supabaseKey);
        console.log('✓ Supabase client initialized');
      } else {
        console.warn('⚠ Supabase credentials not found. Skipping Supabase initialization.');
      }

      this.initialized = true;
      return {
        success: true,
        clients: Object.keys(this.clients)
      };
    } catch (error) {
      console.error('Failed to initialize MCP server:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Test all integrations
   */
  async testAllConnections() {
    if (!this.initialized) {
      await this.initialize();
    }

    const results = {};

    // Test n8n
    if (this.clients.n8n) {
      console.log('Testing n8n connection...');
      results.n8n = await this.clients.n8n.testAuth();
    } else {
      results.n8n = {
        success: false,
        error: 'n8n client not initialized'
      };
    }

    // Test Supabase
    if (this.clients.supabase) {
      console.log('Testing Supabase connection...');
      results.supabase = await this.clients.supabase.testAuth();
    } else {
      results.supabase = {
        success: false,
        error: 'Supabase client not initialized'
      };
    }

    return results;
  }

  /**
   * Get n8n client
   */
  getN8nClient() {
    if (!this.clients.n8n) {
      throw new Error('n8n client not initialized. Call initialize() first.');
    }
    return this.clients.n8n;
  }

  /**
   * Get Supabase client
   */
  getSupabaseClient() {
    if (!this.clients.supabase) {
      throw new Error('Supabase client not initialized. Call initialize() first.');
    }
    return this.clients.supabase;
  }

  /**
   * Execute a workflow automation
   * High-level helper for common tasks
   */
  async executeWorkflow(workflowId, data) {
    const n8n = this.getN8nClient();
    return await n8n.executeWorkflow(workflowId, data);
  }

  /**
   * Query database table
   * High-level helper for common tasks
   */
  async queryTable(table, options) {
    const supabase = this.getSupabaseClient();
    return await supabase.select(table, options);
  }

  /**
   * Insert data into database
   * High-level helper for common tasks
   */
  async insertData(table, data) {
    const supabase = this.getSupabaseClient();
    return await supabase.insert(table, data);
  }

  /**
   * Create an automation workflow that saves results to database
   * Example of combining both integrations
   */
  async executeWorkflowAndSave(workflowId, workflowData, table, transformFn = null) {
    try {
      // Execute n8n workflow
      const n8n = this.getN8nClient();
      const workflowResult = await n8n.executeWorkflow(workflowId, workflowData);

      // Transform data if needed
      const dataToSave = transformFn ? transformFn(workflowResult) : workflowResult;

      // Save to Supabase
      const supabase = this.getSupabaseClient();
      const saveResult = await supabase.insert(table, dataToSave);

      return {
        success: true,
        workflowResult,
        saveResult
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Trigger workflow based on database changes
   * Example of combining both integrations
   */
  async triggerWorkflowFromDatabase(table, filter, workflowId) {
    try {
      // Query Supabase
      const supabase = this.getSupabaseClient();
      const data = await supabase.select(table, { filter });

      // Execute workflow for each record
      const n8n = this.getN8nClient();
      const results = await Promise.all(
        data.map(record => n8n.executeWorkflow(workflowId, record))
      );

      return {
        success: true,
        recordsProcessed: data.length,
        results
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get server status
   */
  getStatus() {
    return {
      initialized: this.initialized,
      clients: {
        n8n: !!this.clients.n8n,
        supabase: !!this.clients.supabase
      }
    };
  }
}

// Singleton instance
let mcpServerInstance = null;

/**
 * Get or create MCP server instance
 */
export function getMCPServer() {
  if (!mcpServerInstance) {
    mcpServerInstance = new MCPServer();
  }
  return mcpServerInstance;
}

export default MCPServer;

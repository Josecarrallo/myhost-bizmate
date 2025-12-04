#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fetch from 'node-fetch';

// n8n API Configuration
const N8N_API_URL = process.env.N8N_API_URL || 'https://n8n-production-bb2d.up.railway.app/api/v1';
const N8N_API_KEY = process.env.N8N_API_KEY;

if (!N8N_API_KEY) {
  console.error('Error: N8N_API_KEY environment variable is required');
  process.exit(1);
}

// Helper function to make n8n API calls
async function n8nRequest(endpoint, method = 'GET', body = null) {
  const url = `${N8N_API_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'X-N8N-API-KEY': N8N_API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`n8n API error (${response.status}): ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return await response.text();
  } catch (error) {
    throw new Error(`n8n API request failed: ${error.message}`);
  }
}

// Create MCP server
const server = new Server(
  {
    name: 'n8n-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool 1: List Workflows
async function listWorkflows(args) {
  const { active_only = false } = args;

  const workflows = await n8nRequest('/workflows');

  let filteredWorkflows = workflows.data || workflows;

  if (active_only) {
    filteredWorkflows = filteredWorkflows.filter(w => w.active === true);
  }

  const summary = filteredWorkflows.map(w => ({
    id: w.id,
    name: w.name,
    active: w.active,
    tags: w.tags || [],
    createdAt: w.createdAt,
    updatedAt: w.updatedAt,
  }));

  return {
    total: filteredWorkflows.length,
    workflows: summary,
  };
}

// Tool 2: Create Workflow
async function createWorkflow(args) {
  const { name, workflow_data } = args;

  if (!name) {
    throw new Error('Workflow name is required');
  }

  if (!workflow_data) {
    throw new Error('Workflow data is required');
  }

  let workflowPayload;

  if (typeof workflow_data === 'string') {
    try {
      workflowPayload = JSON.parse(workflow_data);
    } catch (e) {
      throw new Error('Invalid workflow JSON data');
    }
  } else {
    workflowPayload = workflow_data;
  }

  // Ensure required fields
  workflowPayload.name = name;
  if (!workflowPayload.nodes) {
    workflowPayload.nodes = [];
  }
  if (!workflowPayload.connections) {
    workflowPayload.connections = {};
  }

  const result = await n8nRequest('/workflows', 'POST', workflowPayload);

  return {
    success: true,
    workflow: {
      id: result.id,
      name: result.name,
      active: result.active,
      createdAt: result.createdAt,
    },
    message: `Workflow "${name}" created successfully with ID: ${result.id}`,
  };
}

// Tool 3: Get Executions
async function getExecutions(args) {
  const { workflow_id, limit = 10, include_data = false } = args;

  let endpoint = '/executions';
  const params = new URLSearchParams();

  if (workflow_id) {
    params.append('workflowId', workflow_id);
  }

  params.append('limit', limit.toString());
  params.append('includeData', include_data.toString());

  endpoint += `?${params.toString()}`;

  const executions = await n8nRequest(endpoint);

  const executionData = executions.data || executions;

  const summary = executionData.map(exec => ({
    id: exec.id,
    workflowId: exec.workflowId,
    workflowName: exec.workflowName,
    status: exec.status || exec.finished ? 'success' : 'error',
    finished: exec.finished,
    stoppedAt: exec.stoppedAt,
    startedAt: exec.startedAt,
    mode: exec.mode,
    error: exec.data?.resultData?.error?.message || null,
  }));

  return {
    total: summary.length,
    executions: summary,
  };
}

// Tool 4: Trigger Workflow
async function triggerWorkflow(args) {
  const { workflow_id, data = {} } = args;

  if (!workflow_id) {
    throw new Error('workflow_id is required');
  }

  const result = await n8nRequest(`/workflows/${workflow_id}/execute`, 'POST', data);

  return {
    success: true,
    executionId: result.id || result.executionId,
    status: result.finished ? 'completed' : 'running',
    message: `Workflow ${workflow_id} triggered successfully`,
  };
}

// Tool 5: Update Workflow
async function updateWorkflow(args) {
  const { workflow_id, updates } = args;

  if (!workflow_id) {
    throw new Error('workflow_id is required');
  }

  if (!updates) {
    throw new Error('updates object is required');
  }

  let updatePayload;

  if (typeof updates === 'string') {
    try {
      updatePayload = JSON.parse(updates);
    } catch (e) {
      throw new Error('Invalid updates JSON data');
    }
  } else {
    updatePayload = updates;
  }

  const result = await n8nRequest(`/workflows/${workflow_id}`, 'PATCH', updatePayload);

  return {
    success: true,
    workflow: {
      id: result.id,
      name: result.name,
      active: result.active,
      updatedAt: result.updatedAt,
    },
    message: `Workflow ${workflow_id} updated successfully`,
  };
}

// Register tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_workflows',
        description: 'List all n8n workflows with their status and metadata. Can filter to show only active workflows.',
        inputSchema: {
          type: 'object',
          properties: {
            active_only: {
              type: 'boolean',
              description: 'If true, only return active workflows',
              default: false,
            },
          },
        },
      },
      {
        name: 'create_workflow',
        description: 'Create a new n8n workflow. Requires workflow name and workflow data (nodes, connections, settings).',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the workflow',
            },
            workflow_data: {
              type: ['object', 'string'],
              description: 'Workflow configuration (nodes, connections, settings) as JSON object or string',
            },
          },
          required: ['name', 'workflow_data'],
        },
      },
      {
        name: 'get_executions',
        description: 'Get execution history for workflows. Can filter by workflow ID and control how many results to return.',
        inputSchema: {
          type: 'object',
          properties: {
            workflow_id: {
              type: 'string',
              description: 'Optional: Filter executions by workflow ID',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of executions to return',
              default: 10,
            },
            include_data: {
              type: 'boolean',
              description: 'Include execution data in response',
              default: false,
            },
          },
        },
      },
      {
        name: 'trigger_workflow',
        description: 'Manually trigger a workflow execution. Can optionally pass input data to the workflow.',
        inputSchema: {
          type: 'object',
          properties: {
            workflow_id: {
              type: 'string',
              description: 'ID of the workflow to trigger',
            },
            data: {
              type: 'object',
              description: 'Optional input data to pass to the workflow',
              default: {},
            },
          },
          required: ['workflow_id'],
        },
      },
      {
        name: 'update_workflow',
        description: 'Update an existing workflow. Can modify name, nodes, connections, settings, or active status.',
        inputSchema: {
          type: 'object',
          properties: {
            workflow_id: {
              type: 'string',
              description: 'ID of the workflow to update',
            },
            updates: {
              type: ['object', 'string'],
              description: 'Update payload (can include: name, nodes, connections, active, settings) as JSON object or string',
            },
          },
          required: ['workflow_id', 'updates'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;

    switch (name) {
      case 'list_workflows':
        result = await listWorkflows(args);
        break;
      case 'create_workflow':
        result = await createWorkflow(args);
        break;
      case 'get_executions':
        result = await getExecutions(args);
        break;
      case 'trigger_workflow':
        result = await triggerWorkflow(args);
        break;
      case 'update_workflow':
        result = await updateWorkflow(args);
        break;
      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: error.message }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('n8n MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

/**
 * n8n HTTP Client Integration
 * Provides methods to interact with n8n workflow automation platform
 */

class N8nClient {
  constructor(apiUrl, apiKey) {
    if (!apiUrl || !apiKey) {
      throw new Error('N8N_API_URL and N8N_API_KEY are required');
    }
    this.baseUrl = apiUrl.replace(/\/$/, ''); // Remove trailing slash
    this.apiKey = apiKey;
    this.headers = {
      'X-N8N-API-KEY': this.apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  /**
   * Test authentication by fetching workflows
   */
  async testAuth() {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows`, {
        method: 'GET',
        headers: this.headers
      });

      if (response.status === 401 || response.status === 403) {
        return {
          success: false,
          error: 'Authentication failed. Check your API key.',
          status: response.status
        };
      }

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status
        };
      }

      const data = await response.json();
      return {
        success: true,
        message: 'Authentication successful',
        workflowCount: data.data?.length || 0
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all workflows
   */
  async getWorkflows() {
    const response = await fetch(`${this.baseUrl}/api/v1/workflows`, {
      method: 'GET',
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch workflows: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get a specific workflow by ID
   */
  async getWorkflow(workflowId) {
    const response = await fetch(`${this.baseUrl}/api/v1/workflows/${workflowId}`, {
      method: 'GET',
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch workflow: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(workflowId, data = {}) {
    const response = await fetch(`${this.baseUrl}/api/v1/workflows/${workflowId}/execute`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Failed to execute workflow: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get workflow executions
   */
  async getExecutions(workflowId = null, limit = 20) {
    const url = workflowId
      ? `${this.baseUrl}/api/v1/executions?workflowId=${workflowId}&limit=${limit}`
      : `${this.baseUrl}/api/v1/executions?limit=${limit}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch executions: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get a specific execution by ID
   */
  async getExecution(executionId) {
    const response = await fetch(`${this.baseUrl}/api/v1/executions/${executionId}`, {
      method: 'GET',
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch execution: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Create a new workflow
   */
  async createWorkflow(workflowData) {
    const response = await fetch(`${this.baseUrl}/api/v1/workflows`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(workflowData)
    });

    if (!response.ok) {
      throw new Error(`Failed to create workflow: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Update a workflow
   */
  async updateWorkflow(workflowId, workflowData) {
    const response = await fetch(`${this.baseUrl}/api/v1/workflows/${workflowId}`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(workflowData)
    });

    if (!response.ok) {
      throw new Error(`Failed to update workflow: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Delete a workflow
   */
  async deleteWorkflow(workflowId) {
    const response = await fetch(`${this.baseUrl}/api/v1/workflows/${workflowId}`, {
      method: 'DELETE',
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to delete workflow: ${response.statusText}`);
    }

    return { success: true };
  }

  /**
   * Activate/Deactivate a workflow
   */
  async setWorkflowActive(workflowId, active) {
    const response = await fetch(`${this.baseUrl}/api/v1/workflows/${workflowId}/activate`, {
      method: active ? 'POST' : 'DELETE',
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to ${active ? 'activate' : 'deactivate'} workflow: ${response.statusText}`);
    }

    return await response.json();
  }
}

// Factory function to create n8n client from environment variables
export function createN8nClient() {
  const apiUrl = process.env.N8N_API_URL || import.meta.env.VITE_N8N_API_URL;
  const apiKey = process.env.N8N_API_KEY || import.meta.env.VITE_N8N_API_KEY;

  return new N8nClient(apiUrl, apiKey);
}

export default N8nClient;

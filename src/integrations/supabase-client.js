/**
 * Supabase PostgREST Client Integration
 * Provides methods to interact with Supabase backend services
 */

class SupabaseClient {
  constructor(supabaseUrl, supabaseKey) {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY are required');
    }
    this.baseUrl = supabaseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.apiKey = supabaseKey;
    this.headers = {
      'apikey': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  }

  /**
   * Test authentication and connectivity
   */
  async testAuth() {
    try {
      // Test REST API by attempting to access the root endpoint
      const response = await fetch(`${this.baseUrl}/rest/v1/`, {
        method: 'GET',
        headers: this.headers
      });

      if (response.status === 401 || response.status === 403) {
        return {
          success: false,
          error: 'Authentication failed. Check your Supabase URL and API key.',
          status: response.status
        };
      }

      if (!response.ok && response.status !== 404) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status
        };
      }

      // Also test the health endpoint
      const healthResponse = await fetch(`${this.baseUrl}/rest/v1/`, {
        method: 'HEAD',
        headers: this.headers
      });

      return {
        success: true,
        message: 'Authentication successful',
        status: healthResponse.status,
        url: this.baseUrl
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Query data from a table (SELECT)
   * @param {string} table - Table name
   * @param {object} options - Query options (select, filter, order, limit, etc.)
   */
  async select(table, options = {}) {
    const { select = '*', filter = {}, order = null, limit = null, offset = null } = options;

    let url = `${this.baseUrl}/rest/v1/${table}?select=${select}`;

    // Add filters
    Object.entries(filter).forEach(([key, value]) => {
      if (typeof value === 'object' && value.operator) {
        url += `&${key}=${value.operator}.${value.value}`;
      } else {
        url += `&${key}=eq.${value}`;
      }
    });

    // Add ordering
    if (order) {
      url += `&order=${order}`;
    }

    // Add limit
    if (limit) {
      url += `&limit=${limit}`;
    }

    // Add offset
    if (offset) {
      url += `&offset=${offset}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to query ${table}: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Insert data into a table
   * @param {string} table - Table name
   * @param {object|array} data - Data to insert (single object or array)
   */
  async insert(table, data) {
    const response = await fetch(`${this.baseUrl}/rest/v1/${table}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to insert into ${table}: ${error}`);
    }

    return await response.json();
  }

  /**
   * Update data in a table
   * @param {string} table - Table name
   * @param {object} filter - Filter conditions
   * @param {object} data - Data to update
   */
  async update(table, filter, data) {
    let url = `${this.baseUrl}/rest/v1/${table}?`;

    // Add filters
    Object.entries(filter).forEach(([key, value], index) => {
      if (index > 0) url += '&';
      url += `${key}=eq.${value}`;
    });

    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update ${table}: ${error}`);
    }

    return await response.json();
  }

  /**
   * Delete data from a table
   * @param {string} table - Table name
   * @param {object} filter - Filter conditions
   */
  async delete(table, filter) {
    let url = `${this.baseUrl}/rest/v1/${table}?`;

    // Add filters
    Object.entries(filter).forEach(([key, value], index) => {
      if (index > 0) url += '&';
      url += `${key}=eq.${value}`;
    });

    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.headers
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to delete from ${table}: ${error}`);
    }

    return { success: true };
  }

  /**
   * Execute a stored procedure (RPC)
   * @param {string} functionName - Name of the stored procedure
   * @param {object} params - Parameters to pass
   */
  async rpc(functionName, params = {}) {
    const response = await fetch(`${this.baseUrl}/rest/v1/rpc/${functionName}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to execute RPC ${functionName}: ${error}`);
    }

    return await response.json();
  }

  /**
   * Upload a file to Supabase Storage
   * @param {string} bucket - Storage bucket name
   * @param {string} path - File path in bucket
   * @param {File|Blob} file - File to upload
   */
  async uploadFile(bucket, path, file) {
    const response = await fetch(`${this.baseUrl}/storage/v1/object/${bucket}/${path}`, {
      method: 'POST',
      headers: {
        'apikey': this.apiKey,
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': file.type || 'application/octet-stream'
      },
      body: file
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to upload file: ${error}`);
    }

    return await response.json();
  }

  /**
   * Get a file URL from Supabase Storage
   * @param {string} bucket - Storage bucket name
   * @param {string} path - File path in bucket
   */
  getFileUrl(bucket, path) {
    return `${this.baseUrl}/storage/v1/object/public/${bucket}/${path}`;
  }

  /**
   * Delete a file from Supabase Storage
   * @param {string} bucket - Storage bucket name
   * @param {string} path - File path in bucket
   */
  async deleteFile(bucket, path) {
    const response = await fetch(`${this.baseUrl}/storage/v1/object/${bucket}/${path}`, {
      method: 'DELETE',
      headers: {
        'apikey': this.apiKey,
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to delete file: ${error}`);
    }

    return { success: true };
  }

  /**
   * Sign in with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   */
  async signIn(email, password) {
    const response = await fetch(`${this.baseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Sign in failed: ${error}`);
    }

    return await response.json();
  }

  /**
   * Get the current user
   * @param {string} accessToken - User's access token
   */
  async getUser(accessToken) {
    const response = await fetch(`${this.baseUrl}/auth/v1/user`, {
      method: 'GET',
      headers: {
        'apikey': this.apiKey,
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get user: ${error}`);
    }

    return await response.json();
  }
}

// Factory function to create Supabase client from environment variables
export function createSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

  return new SupabaseClient(supabaseUrl, supabaseKey);
}

export default SupabaseClient;

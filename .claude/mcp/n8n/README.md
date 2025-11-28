# n8n MCP Server - LITE Edition

MCP (Model Context Protocol) server for n8n workflow automation integration with Claude Code.

## Features

This LITE version includes 5 essential tools:

1. **list_workflows** - List all workflows with status
2. **create_workflow** - Create new workflows
3. **get_executions** - View execution history and logs
4. **trigger_workflow** - Manually execute workflows
5. **update_workflow** - Modify existing workflows

## Setup

### 1. Install Dependencies

```bash
cd .claude/mcp/n8n
npm install
```

### 2. Get n8n API Key

1. Go to: https://n8n-production-bb2d.up.railway.app
2. Navigate to: Settings → API
3. Generate a new API key
4. Copy the key (shown only once)

### 3. Configure Claude Code

Create or update `claude_desktop_config.json` (location depends on OS):

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Linux:** `~/.config/Claude/claude_desktop_config.json`

Add this configuration:

```json
{
  "mcpServers": {
    "n8n": {
      "command": "node",
      "args": ["C:\\myhost-bizmate\\.claude\\mcp\\n8n\\index.js"],
      "env": {
        "N8N_API_URL": "https://n8n-production-bb2d.up.railway.app/api/v1",
        "N8N_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

Replace `YOUR_API_KEY_HERE` with your actual n8n API key.

### 4. Restart Claude Code

After configuration, restart Claude Code completely for the MCP server to be loaded.

## Usage Examples

Once configured, you can interact with n8n workflows directly through Claude Code:

### List All Workflows

```
"Show me all my n8n workflows"
```

Claude will use `list_workflows` to display all workflows with their status.

### Create a New Workflow

```
"Create a workflow called 'Daily Guest Recommendations' that runs at 9 AM"
```

Claude will use `create_workflow` to generate and upload the workflow.

### View Execution Logs

```
"Show me the last 10 executions of the payment workflow"
```

Claude will use `get_executions` to display execution history.

### Trigger a Workflow

```
"Run the booking confirmation workflow for guest ID 123"
```

Claude will use `trigger_workflow` to execute it manually.

### Update a Workflow

```
"Add a Slack notification node to the booking workflow"
```

Claude will use `update_workflow` to modify the existing workflow.

## Tool Reference

### list_workflows

**Parameters:**
- `active_only` (boolean, optional): Filter to show only active workflows

**Example:**
```json
{
  "active_only": true
}
```

### create_workflow

**Parameters:**
- `name` (string, required): Workflow name
- `workflow_data` (object/string, required): Complete workflow definition

**Example:**
```json
{
  "name": "Test Workflow",
  "workflow_data": {
    "nodes": [...],
    "connections": {...},
    "settings": {...}
  }
}
```

### get_executions

**Parameters:**
- `workflow_id` (string, optional): Filter by specific workflow
- `limit` (number, optional): Max results (default: 10)
- `include_data` (boolean, optional): Include full execution data

**Example:**
```json
{
  "workflow_id": "123",
  "limit": 5,
  "include_data": false
}
```

### trigger_workflow

**Parameters:**
- `workflow_id` (string, required): ID of workflow to execute
- `data` (object, optional): Input data for the workflow

**Example:**
```json
{
  "workflow_id": "123",
  "data": {
    "guestId": "456",
    "propertyId": "789"
  }
}
```

### update_workflow

**Parameters:**
- `workflow_id` (string, required): ID of workflow to update
- `updates` (object/string, required): Fields to update

**Example:**
```json
{
  "workflow_id": "123",
  "updates": {
    "active": true,
    "name": "Updated Name"
  }
}
```

## Troubleshooting

### MCP Server Not Loading

1. Check Claude Code logs for errors
2. Verify the path in `claude_desktop_config.json` is correct
3. Ensure dependencies are installed: `npm install` in `.claude/mcp/n8n/`
4. Verify n8n API key is valid

### API Connection Issues

1. Verify n8n instance is running: https://n8n-production-bb2d.up.railway.app
2. Check API key is correct in config
3. Test API manually: `curl -H "X-N8N-API-KEY: your-key" https://n8n-production-bb2d.up.railway.app/api/v1/workflows`

### Permission Errors

1. Ensure n8n API key has proper permissions
2. Check Railway instance is running and accessible

## Next Steps

After testing the LITE version, you can expand with additional tools:

- `delete_workflow` - Remove workflows
- `activate_workflow` / `deactivate_workflow` - Toggle workflow status
- `validate_workflow` - Check workflow configuration
- `test_workflow` - Dry-run execution
- `get_credentials` - List available credentials
- `export_workflow` / `import_workflow` - Backup/restore

## Support

For issues specific to:
- **MCP Server:** Check this README and logs
- **n8n API:** https://docs.n8n.io/api/
- **Claude Code:** https://claude.com/claude-code

# HTTP MCP Server Support

This implementation now supports both WebSocket and HTTP-based MCP servers.

## ✅ GitHub MCP Server Support

The GitHub MCP server at `https://api.githubcopilot.com/mcp/` is now fully supported with Personal Access Token authentication.

**Requirements**:
1. Valid GitHub Personal Access Token
2. GitHub Copilot subscription

**Session Management**: GitHub MCP server uses session-based authentication. Our implementation automatically:
- Creates sessions during `initialize` requests
- Maintains session IDs for subsequent requests
- Handles session expiration and cleanup

## Other HTTP MCP Servers

For other HTTP MCP servers that support Bearer token authentication:

1. **URL**: `https://your-mcp-server.com/mcp/`
2. **Authentication**: 
   - Check "Use Authentication" 
   - Enter your API token

### Server Configuration Example
```json
{
  "serverUrl": "https://your-mcp-server.com/mcp/",
  "type": "http",
  "auth": {
    "type": "bearer",
    "headers": {
      "Authorization": "Bearer YOUR_API_TOKEN"
    }
  },
  "timeout": 30000
}
```

## Future Enhancement: OAuth Support

To fully support GitHub MCP server, we need to implement:
1. OAuth 2.0 flow for GitHub authentication
2. Token storage and refresh mechanisms
3. GitHub-specific authentication UI

## Implementation Details

### Connection Types
- **WebSocket**: `ws://` or `wss://` URLs
- **HTTP**: `http://` or `https://` URLs

### Authentication
- Bearer tokens for HTTP endpoints
- Custom headers support
- Automatic detection of connection type

### Backend Changes
- `mcpProxyRouter.ts` now handles both WebSocket and HTTP
- Status checking for HTTP endpoints via ping requests
- Auth headers passed through to HTTP requests

### Frontend Changes
- MCPViewer shows connection type
- Authentication input fields for HTTP connections
- Updated placeholder to show HTTP example

## Testing
To test with GitHub MCP server:
1. Create a GitHub Personal Access Token
2. Use URL: `https://api.githubcopilot.com/mcp/`
3. Enable authentication and enter your token
4. Connect to see available GitHub tools
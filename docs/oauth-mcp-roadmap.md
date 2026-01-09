# OAuth MCP Server Support Roadmap

## Current Status
✅ **Completed**: HTTP MCP server support with Bearer token authentication
❌ **Missing**: OAuth 2.0 flow for servers like GitHub MCP

## GitHub MCP Server Requirements
- **Endpoint**: `https://api.githubcopilot.com/mcp/`
- **Authentication**: OAuth 2.0 (not Bearer tokens)
- **Requirements**: GitHub Copilot subscription
- **OAuth Resource**: `https://api.githubcopilot.com/.well-known/oauth-protected-resource/mcp`

## Implementation Plan for OAuth Support

### Phase 1: OAuth Infrastructure
1. **Backend OAuth Routes**
   - `/auth/github/mcp/start` - Initiate OAuth flow
   - `/auth/github/mcp/callback` - Handle OAuth callback
   - `/auth/github/mcp/token` - Get/refresh access tokens

2. **Token Storage**
   - Secure token storage in database
   - Token refresh mechanism
   - User session management

### Phase 2: Frontend OAuth Integration
1. **OAuth UI Components**
   - OAuth login button for GitHub MCP
   - Connection status with OAuth state
   - Token refresh handling

2. **MCPViewer Updates**
   - Detect OAuth-required servers
   - Show OAuth login option instead of token input
   - Handle OAuth connection state

### Phase 3: Server-Specific Configurations
1. **GitHub MCP Server Profile**
   - Pre-configured OAuth settings
   - Automatic server detection
   - GitHub-specific error handling

2. **Generic OAuth Framework**
   - Support for other OAuth MCP servers
   - Configurable OAuth endpoints
   - Multiple OAuth provider support

## Example OAuth Flow

```typescript
// 1. User clicks "Connect with GitHub OAuth"
// 2. Frontend redirects to GitHub OAuth
// 3. User authorizes application
// 4. Callback handler stores tokens
// 5. MCP requests use stored OAuth tokens

interface OAuthMCPConfig {
  serverUrl: string;
  type: 'http';
  auth: {
    type: 'oauth';
    provider: 'github';
    clientId: string;
    scopes: string[];
    tokenEndpoint: string;
  };
}
```

## Testing Strategy
1. **Mock OAuth Server** for development
2. **GitHub MCP Server** for real-world testing
3. **Token Refresh** edge cases
4. **Error Handling** for expired tokens

## Timeline Estimate
- **Phase 1**: 1-2 weeks (OAuth backend infrastructure)
- **Phase 2**: 1 week (Frontend OAuth integration)
- **Phase 3**: 1 week (GitHub-specific implementation)

**Total**: 3-4 weeks for full OAuth MCP support
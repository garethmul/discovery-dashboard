# How to Fix API Connection Issues

## 1. Start the Backend Server

Make sure the backend server is running first:

```bash
# Navigate to the discovery directory (parent of crawler-dashboard)
cd ..

# Start the server
npm run dev
```

## 2. Check the Backend Server

The backend server should display a message like:

```
Server running on port 3009
Dashboard available at http://localhost:3009
```

## 3. Access the API Test Tool

After starting the frontend (with `npm run dev` in the crawler-dashboard directory), visit:

**http://localhost:5173/api-test.html**

This tool helps test the API directly and diagnose authentication issues.

## 4. Try Different API Keys

The server code suggests these API keys:
- `test-api-key-123` (default test key)
- `b2c0c67c1e9a4257b0e3d04dc88b6d71` (from server logs)

## 5. Look for Clues in Server Logs

When the server rejects a request, it should provide error messages in the console where the server is running:

```
Authentication failed: Invalid API key
```

or

```
Authentication failed: No API key provided
```

## 6. Use the API Debug Tool

While using the dashboard, click the wrench icon (🔧) in the bottom right corner to access the API Debug tool.

This lets you:
- See the current API key status
- Enter a new API key
- Reload the page to apply changes

## 7. Manual Resolution

If all else fails, you can directly edit the `localStorage` value in your browser:

1. Open Chrome DevTools (F12 or Ctrl+Shift+I)
2. Go to "Application" tab
3. Expand "Local Storage" on the left
4. Click on your site (http://localhost:5173)
5. Find the `apiToken` key
6. Set its value to `test-api-key-123`
7. Reload the page 
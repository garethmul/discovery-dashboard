/**
 * Simple password protection middleware for the dashboard
 * Uses a hardcoded password for now
 */

// Hardcoded dashboard password - this should be stored in environment variables in production
const DASHBOARD_PASSWORD = 'discovery123';

// Sessions that have been authenticated (in-memory store)
// In production, you would use a proper session store
const authenticatedSessions = new Set();

export default function passwordMiddleware(req, res, next) {
  // Check if the request is for the API - if so, skip this middleware
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  // Skip for static assets like CSS, JS, images
  if (/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)(\?.*)?$/i.test(req.path)) {
    return next();
  }
  
  // Skip for the login endpoint itself
  if (req.path === '/login' || req.path === '/auth') {
    return next();
  }
  
  // Handle logout
  if (req.path === '/auth/logout') {
    // Get the session ID from the cookie
    const sessionId = req.cookies?.dashboardSession;
    
    // Remove from authenticated sessions if it exists
    if (sessionId) {
      authenticatedSessions.delete(sessionId);
    }
    
    // Clear the cookie
    res.clearCookie('dashboardSession');
    
    // Redirect to login page
    return res.redirect('/login');
  }
  
  // Check for session cookie
  const sessionId = req.cookies?.dashboardSession;
  
  if (sessionId && authenticatedSessions.has(sessionId)) {
    // User is authenticated
    return next();
  }
  
  // Handle login form submission
  if (req.path === '/auth/login' && req.method === 'POST') {
    const { password } = req.body;
    
    if (password === DASHBOARD_PASSWORD) {
      // Generate a simple session ID
      const newSessionId = Math.random().toString(36).substring(2, 15);
      
      // Add to authenticated sessions
      authenticatedSessions.add(newSessionId);
      
      // Set cookie
      res.cookie('dashboardSession', newSessionId, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: 'strict'
      });
      
      // Redirect to dashboard
      return res.redirect('/');
    } else {
      // Failed login
      return res.status(401).redirect('/login?error=invalid');
    }
  }
  
  // Not authenticated, redirect to login
  res.redirect('/login');
} 
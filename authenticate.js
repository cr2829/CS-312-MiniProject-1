// middleware/authenticate.js

module.exports = (req, res, next) => {
  // Check for user in session (or fallback to req.user if set by other middleware)
  const user = req.session?.user || req.user;

  if (!user || !user.user_id) {
    console.warn('Authentication failed: No user in session');
    return res.status(401).json({ error: 'Not authenticated. Please sign in.' });
  }

  // Attach user to request for downstream access
  req.user = user;
  next();
};

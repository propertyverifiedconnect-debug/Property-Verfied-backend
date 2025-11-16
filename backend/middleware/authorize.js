// middleware/authorize.js
const jwt = require('jsonwebtoken');

const authorize = (roles = []) => {
  if (typeof roles === 'string') roles = [roles];
  
  return (req, res, next) => {
    
    let token = null;
    
    // Try to find token from role-specific cookies
    if (roles.length > 0) {
      // Check cookies for each allowed role
      for (const role of roles) {
        const cookieName = `token_${role}`;
        if (req.cookies[cookieName]) {
          token = req.cookies[cookieName];
          break;
        }
      }
    } else {
      // If no specific roles, check for generic token cookie
      token = req.cookies.token;
    }
    
    // Fallback to Authorization header
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    console.log('Token found:', token ? 'Yes' : 'No');
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Check if user has required role
      // if (roles.length && !roles.includes(decoded.role)) {
      //   return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      // }

      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
};

module.exports = authorize;
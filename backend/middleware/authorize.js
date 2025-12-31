const jwt = require('jsonwebtoken');

const authorize = (roles = []) => {
  // Normalize roles to array
  if (typeof roles === 'string') roles = [roles];
  
  return (req, res, next) => {
    let token = null;
    let foundRole = null;
    
    // Try to find token from role-specific cookies
    if (roles.length > 0) {
      for (const role of roles) {
        const cookieName = `token_${role}`;
        if (req.cookies[cookieName]) {
          token = req.cookies[cookieName];
          foundRole = role;
          console.log(`Found token in cookie: ${cookieName}`);
          break;
        }
      }
    } else {
      // If no specific roles required, check all possible role cookies
      for (const role of ['admin', 'user', 'partner']) {
        const cookieName = `token_${role}`;
        if (req.cookies[cookieName]) {
          token = req.cookies[cookieName];
          foundRole = role;
          console.log(`Found token in cookie: ${cookieName}`);
          break;
        }
      }
    }

    // Fallback to Authorization header
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1];
      console.log("Using token from Authorization header");
    }
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Unauthorized: No token provided',
        hint: 'Expected role-specific cookie or Authorization header'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET ,{algorithms:['HS256']});
      
      console.log('Token decoded successfully:', decoded);
      console.log('Token expires at:', new Date(decoded.exp * 1000));
      console.log('Current time:', new Date());
      
      req.user = decoded;

      // Check if user has required role
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ 
          error: 'Forbidden: Insufficient permissions',
          userRole: decoded.role,
          requiredRoles: roles
        });
      }

      next();
    } catch (err) {
      console.error('JWT Verification Error:', err.message);
      console.error('Error name:', err.name);
      
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Token expired',
          expiredAt: err.expiredAt 
        });
      }
      
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token signature' });
      }
      
      res.status(401).json({ error: 'Invalid token' });
    }
  };
};

module.exports = authorize;
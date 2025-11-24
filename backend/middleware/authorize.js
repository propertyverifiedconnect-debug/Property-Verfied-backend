const jwt = require('jsonwebtoken');

const authorize = (roles = []) => {
  if (typeof roles === 'string') roles = [roles];
  
  return (req, res, next) => {
    let token = null;
    let foundRole = null;
 
    // Try to find token from role-specific cookies
    // if (roles.length > 0) {
    //   for (const role of roles) {
    //     const cookieName = `token_${role}`;
    //     if (req.cookies[cookieName]) {
    //       token = req.cookies[cookieName];
    //       foundRole = role;
    //       console.log(`Found token in cookie: ${cookieName}`);
    //       break;
    //     }
    //   }
    // }


    token = req.cookies["access_token"]


    // Fallback to Authorization header
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Add more debugging
      console.log('Token decoded successfully:', decoded);
      console.log('Token expires at:', new Date(decoded.exp * 1000));
      console.log('Current time:', new Date());
      
      req.user = decoded;

      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ 
          error: 'Forbidden: Insufficient permissions',
          userRole: decoded.role,
          requiredRoles: roles
        });
      }

      next();
    } catch (err) {
      // Better error logging
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
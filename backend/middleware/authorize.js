// middleware/authorize.js
const jwt = require('jsonwebtoken');

const authorize = (roles = []) => {
  if (typeof roles === 'string') roles = [roles];
  
  return (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    console.log(token)
    if (!token) return res.status(401).json({ error: `Unauthorized ` });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // if (roles.length && !roles.includes(decoded.role)) {
      //   return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      // }

      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
};


module.exports = authorize
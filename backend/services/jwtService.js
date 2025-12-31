const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET;  // ✅ Define it first
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  return jwt.sign(payload, secret, { expiresIn: '24h', algorithm: 'HS256' });
};

module.exports = { generateToken };

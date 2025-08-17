const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  const cookie = req.cookies['auth-token'];
  return cookie || null;
}

function getUserFromRequest(req) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  
  return verifyToken(token);
}

function authMiddleware(req, res, next) {
  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.user = user;
  next();
}

module.exports = {
  generateToken,
  verifyToken,
  getTokenFromRequest,
  getUserFromRequest,
  authMiddleware
};
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function getAuthUser(req) {
  const token = req.cookies?.authToken || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) return null;
  
  const decoded = verifyToken(token);
  return decoded;
}
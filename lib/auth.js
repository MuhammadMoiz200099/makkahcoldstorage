import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}


export function getAuthUser(req) {
  let token = null;
  if (typeof req.cookies?.get === 'function') {
    // Middleware or NextRequest
    token = req.cookies.get('authToken')?.value;
  } else {
    // API Route or Node handler
    token = req.cookies?.authToken;
  }

  if (!token) {
    const authHeader = req.headers.get
      ? req.headers.get('authorization')
      : req.headers?.authorization;
    token = authHeader?.replace('Bearer ', '');
  }

  return token;
}

import jwt from 'jsonwebtoken';

function getBearerToken(req) {
  const raw = req?.headers?.authorization || req?.headers?.Authorization;
  if (!raw || typeof raw !== 'string') return null;
  const [scheme, token] = raw.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  return token.trim();
}

export function requireAdmin(req, res) {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not configured in environment variables');
    res.status(500).json({
      success: false,
      error: 'Server auth is not configured. Please contact the site owner.'
    });
    return null;
  }

  const token = getBearerToken(req);
  if (!token) {
    res.status(401).json({ success: false, error: 'Missing Authorization token' });
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded?.role !== 'admin') {
      res.status(403).json({ success: false, error: 'Forbidden' });
      return null;
    }
    return decoded;
  } catch (e) {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
    return null;
  }
}


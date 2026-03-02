import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { email, password } = req.body || {};

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error('ADMIN_EMAIL or ADMIN_PASSWORD is not configured in environment variables');
      return res.status(500).json({
        success: false,
        error: 'Admin credentials are not configured. Please contact the site owner.'
      });
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    let token;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (JWT_SECRET) {
      token = jwt.sign(
        { id: 'admin', email: ADMIN_EMAIL, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
    } else {
      token = `admin-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }

    const admin = {
      id: 'admin',
      email: ADMIN_EMAIL,
      name: 'Admin User'
    };

    return res.status(200).json({
      success: true,
      data: {
        token,
        admin
      }
    });
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

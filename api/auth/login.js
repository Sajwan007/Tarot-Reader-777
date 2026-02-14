export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { email, password } = req.body;
    
    // Demo credentials
    if (email === 'admin@tarot777.com' && password === 'admin123') {
      const token = 'demo-token-' + Date.now();
      const admin = {
        id: 1,
        email: 'admin@tarot777.com',
        name: 'Admin User'
      };
      
      res.status(200).json({
        success: true,
        data: {
          token,
          admin
        }
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

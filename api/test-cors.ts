import { VercelRequest, VercelResponse } from '@vercel/node';

// Simple CORS test endpoint
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method === 'GET') {
    res.json({ 
      message: 'CORS test successful',
      timestamp: new Date().toISOString(),
      method: req.method
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

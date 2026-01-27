const { verifyToken } = require('../config/auth');
const Admin = require('../models/Admin');
const Client = require('../models/Client');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = verifyToken(token);
    
    // Check if admin
    let user = await Admin.findById(decoded.id);
    if (user) {
      req.user = { ...user, type: 'admin' };
      return next();
    }

    // Check if client
    user = await Client.findById(decoded.id);
    if (user) {
      req.user = { ...user, type: 'client' };
      return next();
    }

    res.status(401).json({ error: 'Invalid token.' });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.type !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin rights required.' });
  }
  next();
};

const requireClient = (req, res, next) => {
  if (req.user.type !== 'client') {
    return res.status(403).json({ error: 'Access denied. Client rights required.' });
  }
  next();
};

module.exports = {
  authenticate,
  requireAdmin,
  requireClient
};

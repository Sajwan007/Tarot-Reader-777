const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin-supabase');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const admin = await Admin.findByEmail(email);
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await Admin.validatePassword(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(admin.id);

    // Remove password from response
    const { password: _, ...adminWithoutPassword } = admin;

    res.json({
      success: true,
      data: {
        token,
        admin: adminWithoutPassword
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password, and name'
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findByEmail(email);
    
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    const admin = await Admin.create({ email, password, name });
    const token = generateToken(admin.id);

    res.status(201).json({
      success: true,
      data: {
        token,
        admin
      }
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    
    // Remove password from response
    const { password: _, ...adminWithoutPassword } = admin;
    
    res.json({ success: true, data: adminWithoutPassword });
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

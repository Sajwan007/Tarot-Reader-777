const Client = require('../models/Client');
const { generateToken } = require('../config/auth');
const { validateClient, validateLogin } = require('../utils/validators');

const getAllClients = async (req, res, next) => {
  try {
    const clients = await Client.findAll();
    res.json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    next(error);
  }
};

const getClientById = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    // Check if user has permission to view this client
    if (req.user.type === 'client' && req.params.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    next(error);
  }
};

const createClient = async (req, res, next) => {
  try {
    const { error } = validateClient(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    // Check if client already exists
    const existingClient = await Client.findByEmail(req.body.email);
    if (existingClient) {
      return res.status(400).json({
        success: false,
        error: 'Client with this email already exists'
      });
    }

    const client = await Client.create(req.body);

    res.status(201).json({
      success: true,
      data: client
    });
  } catch (error) {
    next(error);
  }
};

const updateClient = async (req, res, next) => {
  try {
    // Check if user has permission to update this client
    if (req.user.type === 'client' && req.params.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const client = await Client.update(req.params.id, req.body);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    next(error);
  }
};

const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.delete(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { email, password } = req.body;
    
    const client = await Client.findByEmail(email);
    if (!client) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const isPasswordValid = await Client.validatePassword(password, client.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const token = generateToken({ id: client.id, type: 'client' });

    res.json({
      success: true,
      data: {
        token,
        client: {
          id: client.id,
          name: client.name,
          email: client.email,
          phone: client.phone
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  login
};

const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all clients (admin only)
router.get('/', authMiddleware.authenticate, authMiddleware.requireAdmin, clientController.getAllClients);

// Get client by ID
router.get('/:id', authMiddleware.authenticate, clientController.getClientById);

// Create new client
router.post('/', clientController.createClient);

// Update client
router.put('/:id', authMiddleware.authenticate, clientController.updateClient);

// Delete client
router.delete('/:id', authMiddleware.authenticate, authMiddleware.requireAdmin, clientController.deleteClient);

// Client login
router.post('/login', clientController.login);

module.exports = router;

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Admin login
router.post('/login', authController.adminLogin);

// Refresh token
router.post('/refresh', authController.refreshToken);

// Logout
router.post('/logout', authController.logout);

module.exports = router;

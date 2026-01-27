const express = require('express');
const router = express.Router();
const {
  getAllClients,
  getClient,
  updateClient,
  deleteClient
} = require('../controllers/clientController-supabase');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getAllClients);
router.route('/:id').get(protect, getClient).put(protect, updateClient).delete(protect, deleteClient);

module.exports = router;

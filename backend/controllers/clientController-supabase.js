const Client = require('../models/Client-supabase');
const Booking = require('../models/Booking-supabase');

exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json({ success: true, data: clients });
  } catch (error) {
    console.error('Error in getAllClients:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    
    // Get client's bookings
    const bookings = await Booking.findAll({ search: client.email });
    
    res.json({ success: true, data: { ...client, bookings } });
  } catch (error) {
    console.error('Error in getClient:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const client = await Client.update(req.params.id, req.body);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.json({ success: true, data: client });
  } catch (error) {
    console.error('Error in updateClient:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.delete(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.json({ success: true, message: 'Client deleted' });
  } catch (error) {
    console.error('Error in deleteClient:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

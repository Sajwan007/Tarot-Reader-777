const Joi = require('joi');

const validateBooking = (booking) => {
  const schema = Joi.object({
    client_name: Joi.string().min(2).max(100).required(),
    client_email: Joi.string().email().required(),
    client_phone: Joi.string().pattern(/^\d{10,15}$/).required(),
    service_type: Joi.string().valid('Love Tarot', 'Career Tarot', 'General Reading', '3-Card Spread', 'Celtic Cross').required(),
    date: Joi.date().iso().min('now').required(),
    time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    status: Joi.string().valid('pending', 'confirmed', 'completed', 'cancelled').default('pending'),
    notes: Joi.string().max(500).optional()
  });

  return schema.validate(booking);
};

const validateClient = (client) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\d{10,15}$/).required(),
    password: Joi.string().min(6).max(100).optional()
  });

  return schema.validate(client);
};

const validateAdmin = (admin) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
    role: Joi.string().valid('admin', 'super_admin').default('admin')
  });

  return schema.validate(admin);
};

const validateLogin = (login) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  return schema.validate(login);
};

const validateUpdateBooking = (booking) => {
  const schema = Joi.object({
    service_type: Joi.string().valid('Love Tarot', 'Career Tarot', 'General Reading', '3-Card Spread', 'Celtic Cross').optional(),
    date: Joi.date().iso().min('now').optional(),
    time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    status: Joi.string().valid('pending', 'confirmed', 'completed', 'cancelled').optional(),
    notes: Joi.string().max(500).optional()
  });

  return schema.validate(booking);
};

const validateUpdateClient = (client) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().pattern(/^\d{10,15}$/).optional(),
    password: Joi.string().min(6).max(100).optional()
  });

  return schema.validate(client);
};

module.exports = {
  validateBooking,
  validateClient,
  validateAdmin,
  validateLogin,
  validateUpdateBooking,
  validateUpdateClient
};

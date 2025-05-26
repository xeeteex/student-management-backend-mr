const Joi = require('joi');

// Validation schema for creating an admin
const createAdminSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().label('Name'),
  email: Joi.string().email().required().label('Email'),
  role: Joi.string().valid('admin').default('admin')
});

// Validation schema for updating an admin
const updateAdminSchema = Joi.object({
  name: Joi.string().min(2).max(100).label('Name'),
  email: Joi.string().email().label('Email')
}).min(1);

module.exports = {
  createAdminSchema,
  updateAdminSchema
};

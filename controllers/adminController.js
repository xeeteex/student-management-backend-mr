import User from '../models/User.js';
import { createAdminSchema, updateAdminSchema } from '../validations/adminValidation.js';

/**
 * @desc    Get all admins
 * @route   GET /api/admins
 * @access  Private/Admin
 */
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).sort({ createdAt: -1 });
    res.json(admins);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching admins',
      error: error.message
    });
  }
};

/**
 * @desc    Get single admin by ID
 * @route   GET /api/admins/:id
 * @access  Private/Admin
 */
export const getAdminById = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching admin',
      error: error.message
    });
  }
};

/**
 * @desc    Create new admin
 * @route   POST /api/admins
 * @access  Private/Admin
 */
export const createAdmin = async (req, res) => {
  try {
    const { error } = createAdminSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existingAdmin = await User.findOne({ email: req.body.email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    const admin = await User.create({
      ...req.body,
      role: 'admin'
    });
    
    res.status(201).json(admin);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating admin',
      error: error.message
    });
  }
};

/**
 * @desc    Update admin
 * @route   PUT /api/admins/:id
 * @access  Private/Admin
 */
export const updateAdmin = async (req, res) => {
  try {
    const { error } = updateAdminSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const admin = await User.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (req.body.email) {
      const existingAdmin = await User.findOne({
        _id: { $ne: req.params.id },
        email: req.body.email
      });

      if (existingAdmin) {
        return res.status(400).json({ message: 'Email already in use by another admin' });
      }
    }

    const updatedAdmin = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedAdmin);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating admin',
      error: error.message
    });
  }
};

/**
 * @desc    Delete admin
 * @route   DELETE /api/admins/:id
 * @access  Private/Admin
 */
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await User.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting admin', error: error.message });
  }
};

module.exports = {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin
};

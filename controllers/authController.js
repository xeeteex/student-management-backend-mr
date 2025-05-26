import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Student from '../models/Student.js';
import { protect } from '../middleware/authMiddleware.js';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if admin exists
    const admin = await User.findOne({ email, role: 'admin' }).select('+password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(admin._id);

    // Clean up admin object
    admin.password = undefined;
    admin.__v = undefined;

    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// @desc    Get current admin
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    // req.user is set by the protect middleware
    const admin = await User.findById(req.user._id).select('-password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'student', age, course } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Validate student-specific fields if role is student
    if (role === 'student') {
      if (!age || isNaN(age) || age < 1 || age > 120) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid age'
        });
      }
      if (!course) {
        return res.status(400).json({
          success: false,
          message: 'Course is required for student registration'
        });
      }
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Start a session for transaction
    const session = await User.startSession();
    session.startTransaction();
    
    try {
      // Create user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role
      });

      await newUser.save({ session });

      // If user is a student, create student record
      if (role === 'student') {
        const newStudent = new Student({
          user: newUser._id,
          name,
          email,
          age: parseInt(age, 10),
          course,
          status: 'active',
          owner: newUser._id  // Set the owner to the new user's ID
        });
        await newStudent.save({ session });
      }

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Generate token
      const token = generateToken(newUser._id);

      // Return success response
      return res.status(201).json({
        success: true,
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        token,
        message: 'Registration successful!'
      });
    } catch (error) {
      // If anything fails, abort the transaction
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

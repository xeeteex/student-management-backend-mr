import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';

// @desc    Protect routes
// @access  Private
export const protect = async (req, res, next) => {
  try {
    // Get token from header
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');
      
      // Add user ID to request
      req.userId = decoded.id;
      
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

export const ensureOwnership = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    if (req.user.role === 'student' && student.owner.toString() !== req.userId) {
      return res.status(403).json({
        message: 'You can only access your own student record'
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

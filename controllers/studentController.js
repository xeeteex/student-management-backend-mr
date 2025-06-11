import Student from '../models/Student.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const checkAdmin = authorize('admin');

export const getCurrentStudent = [protect, async (req, res, next) => {
  try {
    const student = await Student.findOne({ owner: req.user._id });
    
    if (!student) {
      console.log('Student profile not found for user ID:', req.user._id);
      return res.status(404).json({ 
        success: false,
        error: 'Student profile not found' 
      });
    }

    console.log('Successfully fetched current student profile:', student);
    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Error in getCurrentStudent:', error);
    next(error);
  }
}];

/**
 * @desc    Create a new student
 * @route   POST /api/students
 * @access  Admin only
 */
export const createStudent = [protect, authorize('admin'), async (req, res, next) => {
  try {
    const { name, email, age, course } = req.body;
    
    // Check if student with this email already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        error: 'Student with this email already exists'
      });
    }

    // Create a new student
    const student = new Student({
      name,
      email,
      age,
      course
    });

    await student.save();

    res.status(201).json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Error in createStudent:', error);
    next(error);
  }
}];

/**
 * @desc    Get all students
 * @route   GET /api/students
 * @access  Public
 */
export const getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    next(error);
  }
};

/**
 * @desc    Get single student by ID
 * @route   GET /api/students/:id
 * @access  Public
 */
export const getStudentById = async (req, res, next) => {
  try {
    console.log('Fetching student with ID:', req.params.id);
    
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      console.log('Student not found with ID:', req.params.id);
      return res.status(404).json({ 
        success: false,
        error: 'Student not found' 
      });
    }

    console.log('Successfully fetched student:', student);
    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Error in getStudentById:', {
      message: error.message,
      stack: error.stack,
      params: req.params
    });
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch student details',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

export const updateStudent = [protect, async (req, res, next) => {
  try {
    console.log('Updating student with ID:', req.params.id);
    console.log('Authenticated user:', req.user);
    console.log('Update data:', req.body);
    
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      console.log('Student not found with ID:', req.params.id);
      return res.status(404).json({ 
        success: false,
        error: 'Student not found' 
      });
    }

    // Students can only update their own records
    if (req.user.role === 'student' && student.owner.toString() !== req.user._id.toString()) {
      console.log('Access denied - user not authorized to update this student');
      return res.status(403).json({ 
        success: false,
        error: 'You can only update your own student record' 
      });
    }

    // Only allow updating specific fields
    const { name, age, course } = req.body;
    const updateData = { name, age, course };
    
    console.log('Updating student with data:', updateData);
    
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    console.log('Successfully updated student:', updatedStudent);
    
    res.json({
      success: true,
      data: updatedStudent
    });
  } catch (error) {
    console.error('Error in updateStudent:', {
      message: error.message,
      stack: error.stack,
      params: req.params,
      user: req.user,
      body: req.body
    });
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to update student',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}]

export const deleteStudent = [protect, authorize('admin'), async (req, res, next) => {
  try {
    console.log('Deleting student with ID:', req.params.id);
    
    // Find and delete the student
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) {
      console.log('Student not found with ID:', req.params.id);
      return res.status(404).json({
        success: false,
        error: `Student not found with id of ${req.params.id}`
      });
    }
    
    // Also delete the associated user account
    if (student.owner) {
      await User.findByIdAndDelete(student.owner);
      console.log('Deleted associated user account:', student.owner);
    }
    
    console.log('Successfully deleted student:', student);
    res.json({
      success: true,
      data: {},
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteStudent:', {
      message: error.message,
      stack: error.stack,
      params: req.params
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to delete student',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}];

import express from 'express';
import { 
  getAllStudents, 
  getStudentById, 
  updateStudent, 
  deleteStudent,
  getCurrentStudent,
  createStudent
} from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/students
 * @desc    Get all students
 * @access  Admin only
 */
router.get('/', protect, authorize('admin'), getAllStudents);

/**
 * @route   POST /api/students
 * @desc    Create a new student
 * @access  Admin only
 */
router.post('/', protect, authorize('admin'), createStudent);

/**
 * @route   GET /api/students/me
 * @desc    Get current student's profile
 * @access  Private/Student
 */
router.get('/me', getCurrentStudent);

/**
 * @route   GET /api/students/:id
 * @desc    Get single student
 * @access  Admin & Student
 */
router.get('/:id', protect, getStudentById);



/**
 * @route   PUT /api/students/:id
 * @desc    Update a student
 * @access  Admin & Student
 */
router.put('/:id', protect, updateStudent);

/**
 * @route   DELETE /api/students/:id
 * @desc    Delete a student
 * @access  Admin only
 */
router.delete('/:id', protect, authorize('admin'), deleteStudent);

export default router;

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

// Public route (no authentication required)
router.get('/', getAllStudents);

// Protected routes (require authentication)
router.get('/me', protect, getCurrentStudent);
router.get('/:id', protect, getStudentById);
router.post('/', protect, authorize('admin'), createStudent);
router.put('/:id', protect, updateStudent);
router.delete('/:id', protect, authorize('admin'), deleteStudent);

export default router;

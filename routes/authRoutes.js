import { Router } from 'express';
import { login, register, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Auth routes
router.post('/login', login);
router.post('/register', register);
router.get('/me', protect, getMe);

export default router;

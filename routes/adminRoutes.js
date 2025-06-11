import express from 'express';
const router = express.Router();
import adminController from '../controllers/adminController.js';

router.get('/', adminController.getAllAdmins);

router.get('/:id', adminController.getAdminById);

router.post('/', adminController.createAdmin);

router.put('/:id', adminController.updateAdmin);

router.delete('/:id', adminController.deleteAdmin);

export default router;

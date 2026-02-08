import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
} from '../controllers/userController.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.delete('/profile/:userId', requireAdmin, deleteUserProfile);

export default router;


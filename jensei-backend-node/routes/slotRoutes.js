import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getDoctorSlots,
  generateDoctorSlots,
  markDoctorUnavailable,
  getDoctorUnavailability,
  bulkUpdateSlots,
} from '../controllers/slotController.js';

const router = express.Router();

// Get doctor unavailability (specific route must come before generic /:doctorId)
router.get('/:doctorId/unavailable', authenticate, getDoctorUnavailability);

// Get available slots for a doctor (public - users can view slots before logging in)
router.get('/:doctorId', getDoctorSlots);

// All other routes require authentication
router.use(authenticate);

// Generate slots for a doctor (Admin/Cron Job)
router.post('/:doctorId/generate', generateDoctorSlots);

// Mark doctor as unavailable
router.post('/:doctorId/unavailable', markDoctorUnavailable);

// Bulk update slot statuses
router.patch('/:doctorId/bulk', bulkUpdateSlots);

export default router;

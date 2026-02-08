import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  bookAppointment,
  getUserAppointments,
  getDoctorAppointments,
  cancelAppointment,
  getAppointmentById,
  updateAppointmentStatus,
  updateDoctorNotes,
  getDoctorStatistics,
  searchDoctorAppointments,
} from '../controllers/appointmentController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Book an appointment
router.post('/', bookAppointment);

// Get user's appointments
router.get('/', getUserAppointments);

// Doctor dashboard routes (must come BEFORE /:appointmentId to avoid route conflicts)
router.get('/doctor/:doctorId/statistics', getDoctorStatistics);
router.get('/doctor/:doctorId/search', searchDoctorAppointments);
router.get('/doctor/:doctorId', getDoctorAppointments);

// Single appointment routes
router.get('/:appointmentId', getAppointmentById);
router.patch('/:appointmentId/cancel', cancelAppointment);
router.patch('/:appointmentId/status', updateAppointmentStatus);
router.patch('/:appointmentId/notes', updateDoctorNotes);

export default router;

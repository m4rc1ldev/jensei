// Barrel file - re-exports all appointment controllers from split modules
// This ensures existing imports from '../controllers/appointmentController.js' continue to work

export { bookAppointment } from './appointment/bookAppointment.js';
export { getUserAppointments } from './appointment/userAppointments.js';
export {
  getDoctorAppointments,
  getDoctorStatistics,
  searchDoctorAppointments,
} from './appointment/doctorAppointments.js';
export {
  getAppointmentById,
  cancelAppointment,
  updateAppointmentStatus,
  updateDoctorNotes,
} from './appointment/appointmentActions.js';



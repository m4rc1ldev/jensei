import Appointment from '../../models/Appointment.js';
import TimeSlot from '../../models/TimeSlot.js';
import mongoose from 'mongoose';
import { isValidObjectId } from './helpers.js';

// Get single appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user._id.toString();

    if (!isValidObjectId(appointmentId)) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const appointment = await Appointment.findById(appointmentId)
      .populate('userId', 'name email phone')
      .populate('doctorId', 'name specialty image')
      .populate('timeSlotId', 'date startTime endTime period bookingType');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check if user has permission to view
    if (
      appointment.userId._id.toString() !== userId &&
      appointment.doctorId._id.toString() !== userId &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ error: 'Unauthorized to view this appointment' });
    }

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error('Get appointment by ID error:', error);
    res.status(500).json({ error: 'Server error while fetching appointment' });
  }
};

// Cancel appointment
export const cancelAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { appointmentId } = req.params;
    const { reason, cancelledBy } = req.body;
    const userId = req.user._id.toString();

    if (!isValidObjectId(appointmentId)) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const appointment = await Appointment.findById(appointmentId).session(session);
    if (!appointment) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check if user has permission to cancel (user or doctor)
    if (
      appointment.userId.toString() !== userId &&
      appointment.doctorId.toString() !== userId &&
      req.user.role !== 'admin'
    ) {
      await session.abortTransaction();
      return res.status(403).json({ error: 'Unauthorized to cancel this appointment' });
    }

    if (appointment.status === 'cancelled') {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Appointment is already cancelled' });
    }

    // Update appointment
    appointment.status = 'cancelled';
    appointment.cancelledAt = new Date();
    appointment.cancelledBy = cancelledBy || (appointment.userId.toString() === userId ? 'user' : 'doctor');
    appointment.cancellationReason = reason || '';
    await appointment.save({ session });

    // Update time slot back to available
    const timeSlot = await TimeSlot.findById(appointment.timeSlotId).session(session);
    if (timeSlot) {
      timeSlot.status = 'available';
      timeSlot.appointmentId = null;
      timeSlot.bookingType = null; // Clear booking type when cancelled
      await timeSlot.save({ session });
    }

    await session.commitTransaction();

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Cancel appointment error:', error);
    res.status(500).json({ error: 'Server error while cancelling appointment' });
  } finally {
    session.endSession();
  }
};

// Update appointment status (for doctor dashboard)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;
    const userId = req.user._id.toString();

    if (!isValidObjectId(appointmentId)) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const validStatuses = ['confirmed', 'completed', 'no-show'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Must be: confirmed, completed, or no-show'
      });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Only doctor or admin can update status
    if (
      appointment.doctorId.toString() !== userId &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        error: 'Only the doctor can update appointment status'
      });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        error: 'Cannot update status of cancelled appointment'
      });
    }

    appointment.status = status;
    if (status === 'completed') {
      appointment.completedAt = new Date();
    }

    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment status updated successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({ error: 'Server error while updating status' });
  }
};

// Update doctor notes on an appointment
export const updateDoctorNotes = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { doctorNotes } = req.body;
    const userId = req.user._id.toString();

    if (!isValidObjectId(appointmentId)) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (!doctorNotes || typeof doctorNotes !== 'string') {
      return res.status(400).json({
        error: 'Doctor notes are required and must be a string'
      });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Only doctor or admin can add notes
    if (
      appointment.doctorId.toString() !== userId &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        error: 'Only the doctor can add notes to this appointment'
      });
    }

    appointment.doctorNotes = doctorNotes;
    appointment.notesUpdatedAt = new Date();

    await appointment.save();

    res.json({
      success: true,
      message: 'Doctor notes updated successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Update doctor notes error:', error);
    res.status(500).json({ error: 'Server error while updating notes' });
  }
};

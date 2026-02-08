import Appointment from '../../models/Appointment.js';
import TimeSlot from '../../models/TimeSlot.js';
import User from '../../models/User.js';
import Doctor from '../../models/Doctor.js';
import { sendEmail } from '../../config/email.js';
import mongoose from 'mongoose';

// Send booking confirmation emails
const sendBookingConfirmationEmails = async (user, doctor, appointment, timeSlot) => {
  const slotDate = new Date(timeSlot.date);
  const dateStr = slotDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const appointmentTypeLabels = {
    video_call: 'Video Call',
    voice_call: 'Voice Call',
    clinic_visit: 'Clinic Visit',
  };

  // User confirmation email
  const userEmailContent = {
    to: user.email,
    subject: `Appointment Confirmed with ${doctor.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Appointment Confirmed!</h2>
        <p>Dear ${user.name || 'User'},</p>
        <p>Your appointment has been successfully booked.</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Appointment Details:</h3>
          <p><strong>Doctor:</strong> ${doctor.name}</p>
          <p><strong>Specialty:</strong> ${doctor.specialty}</p>
          <p><strong>Date:</strong> ${dateStr}</p>
          <p><strong>Time:</strong> ${timeSlot.startTime} - ${timeSlot.endTime}</p>
          <p><strong>Type:</strong> ${appointmentTypeLabels[appointment.appointmentType]}</p>
          <p><strong>Fee:</strong> ₹${appointment.consultationFee}</p>
          ${appointment.notes ? `<p><strong>Your Notes:</strong> ${appointment.notes}</p>` : ''}
        </div>
        <p>We look forward to seeing you!</p>
        <p>Best regards,<br>Jensei Healthcare Team</p>
      </div>
    `,
  };

  // Doctor notification email
  const doctorEmailContent = {
    to: doctor.email,
    subject: `New Appointment Booking - ${user.name || 'Patient'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Appointment Booking</h2>
        <p>Dear Dr. ${doctor.name},</p>
        <p>You have a new appointment booking.</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Appointment Details:</h3>
          <p><strong>Patient:</strong> ${user.name || 'Patient'}</p>
          <p><strong>Patient Email:</strong> ${user.email}</p>
          <p><strong>Date:</strong> ${dateStr}</p>
          <p><strong>Time:</strong> ${timeSlot.startTime} - ${timeSlot.endTime}</p>
          <p><strong>Type:</strong> ${appointmentTypeLabels[appointment.appointmentType]}</p>
          ${appointment.notes ? `<p><strong>Patient Notes:</strong> ${appointment.notes}</p>` : ''}
        </div>
        <p>Best regards,<br>Jensei Healthcare Team</p>
      </div>
    `,
  };

  // Send user confirmation email
  try {
    await sendEmail(userEmailContent);
    console.log(`Booking confirmation email sent to user: ${user.email}`);
  } catch (emailError) {
    console.error('Error sending user confirmation email:', emailError);
  }

  // Send doctor notification email (if doctor has email)
  if (doctor.email) {
    try {
      await sendEmail(doctorEmailContent);
      console.log(`Booking notification email sent to doctor: ${doctor.email}`);
    } catch (emailError) {
      console.error('Error sending doctor notification email:', emailError);
    }
  } else {
    console.log('Doctor email not available, skipping doctor notification email');
  }
};

// Book an appointment
export const bookAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { doctorId, timeSlotId, appointmentType, notes } = req.body;
    const userId = req.user._id.toString();

    if (!doctorId || !timeSlotId || !appointmentType) {
      await session.abortTransaction();
      return res.status(400).json({
        error: 'Doctor ID, time slot ID, and appointment type are required',
      });
    }

    // Validate appointment type
    const validTypes = ['video_call', 'voice_call', 'clinic_visit'];
    if (!validTypes.includes(appointmentType)) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Invalid appointment type' });
    }

    // Check if time slot exists and is available
    const timeSlot = await TimeSlot.findById(timeSlotId).session(session);
    if (!timeSlot) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Time slot not found' });
    }

    if (timeSlot.status !== 'available') {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Time slot is not available' });
    }

    if (timeSlot.doctorId.toString() !== doctorId) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Time slot does not belong to this doctor' });
    }

    // Check if slot is in the past
    // Slots are stored with date as local midnight (via setHours(0,0,0,0)),
    // so we must extract local date components, not UTC (toISOString would give wrong day)
    const slotDate = new Date(timeSlot.date);
    const [hours, minutes] = timeSlot.startTime.split(':').map(Number);
    const slotDateTime = new Date(
      slotDate.getFullYear(),
      slotDate.getMonth(),
      slotDate.getDate(),
      hours,
      minutes,
      0,
      0
    );
    if (slotDateTime < new Date()) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Cannot book past time slots' });
    }

    // Get doctor to get consultation fee
    const doctor = await Doctor.findById(doctorId).session(session);
    if (!doctor) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Get user for email
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'User not found' });
    }

    // Create appointment
    const appointment = new Appointment({
      userId,
      doctorId,
      timeSlotId,
      appointmentType,
      notes: notes || '',
      consultationFee: doctor.fee,
      paymentStatus: 'pending', // Can be updated when payment is integrated
    });

    await appointment.save({ session });

    // Update time slot status and booking type
    timeSlot.status = 'booked';
    timeSlot.appointmentId = appointment._id;
    timeSlot.bookingType = appointmentType; // Set booking type when slot is booked
    await timeSlot.save({ session });

    await session.commitTransaction();

    // Send confirmation emails (outside transaction)
    try {
      await sendBookingConfirmationEmails(user, doctor, appointment, timeSlot);
    } catch (emailError) {
      console.error('Error sending confirmation emails:', emailError);
      // Don't fail the booking if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Book appointment error:', error);
    res.status(500).json({ error: 'Server error while booking appointment' });
  } finally {
    session.endSession();
  }
};

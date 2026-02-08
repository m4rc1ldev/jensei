import Appointment from '../../models/Appointment.js';
import { getPaginationParams } from './helpers.js';

// Get user's appointments
export const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { page, limit, skip } = getPaginationParams(req);
    const { status } = req.query;

    const query = { userId };
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('doctorId', 'name specialty image')
      .populate('timeSlotId', 'date startTime endTime period bookingType')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      data: appointments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get user appointments error:', error);
    res.status(500).json({ error: 'Server error while fetching appointments' });
  }
};

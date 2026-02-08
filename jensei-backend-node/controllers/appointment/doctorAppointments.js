import Appointment from '../../models/Appointment.js';
import TimeSlot from '../../models/TimeSlot.js';
import User from '../../models/User.js';
import mongoose from 'mongoose';
import { getPaginationParams } from './helpers.js';

// Get doctor's appointments (optimized with server-side date filtering)
export const getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { page, limit, skip } = getPaginationParams(req);
    const { status, date, startDate, endDate } = req.query;

    const query = { doctorId };
    if (status) {
      query.status = status;
    }

    // Server-side date filtering via TimeSlot lookup
    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const timeSlots = await TimeSlot.find({
        doctorId,
        date: { $gte: startOfDay, $lte: endOfDay }
      }).select('_id');

      query.timeSlotId = { $in: timeSlots.map(ts => ts._id) };
    }

    // Date range filtering
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const timeSlots = await TimeSlot.find({
        doctorId,
        date: { $gte: start, $lte: end }
      }).select('_id');

      query.timeSlotId = { $in: timeSlots.map(ts => ts._id) };
    }

    const appointments = await Appointment.find(query)
      .populate('userId', 'name email phone')
      .populate('timeSlotId', 'date startTime endTime period bookingType')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

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
    console.error('Get doctor appointments error:', error);
    res.status(500).json({ error: 'Server error while fetching appointments' });
  }
};

// Get doctor statistics for dashboard
export const getDoctorStatistics = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { period = 'today' } = req.query;
    const userId = req.user._id.toString();

    if (doctorId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Unauthorized to view these statistics'
      });
    }

    const now = new Date();
    let startDate;

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'all':
        startDate = new Date(0);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

    const stats = await Appointment.aggregate([
      {
        $match: {
          doctorId: doctorObjectId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: 'timeslots',
          localField: 'timeSlotId',
          foreignField: '_id',
          as: 'timeSlot'
        }
      },
      {
        $unwind: { path: '$timeSlot', preserveNullAndEmptyArrays: true }
      },
      {
        $facet: {
          statusCounts: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          todayAppointments: [
            {
              $match: {
                'timeSlot.date': {
                  $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                  $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
                }
              }
            },
            { $count: 'count' }
          ],
          upcomingAppointments: [
            {
              $match: {
                'timeSlot.date': { $gt: now },
                status: 'confirmed'
              }
            },
            { $count: 'count' }
          ],
          revenue: [
            { $match: { paymentStatus: 'paid' } },
            {
              $group: {
                _id: null,
                total: { $sum: '$consultationFee' },
                count: { $sum: 1 },
                avg: { $avg: '$consultationFee' }
              }
            }
          ],
          typeBreakdown: [
            { $group: { _id: '$appointmentType', count: { $sum: 1 } } }
          ]
        }
      }
    ]);

    const result = stats[0];
    const statusMap = {};
    result.statusCounts.forEach(s => {
      statusMap[s._id] = s.count;
    });

    const appointmentTypes = { videoCall: 0, voiceCall: 0, clinicVisit: 0 };
    result.typeBreakdown.forEach(t => {
      if (t._id === 'video_call') appointmentTypes.videoCall = t.count;
      if (t._id === 'voice_call') appointmentTypes.voiceCall = t.count;
      if (t._id === 'clinic_visit') appointmentTypes.clinicVisit = t.count;
    });

    const responseData = {
      period,
      totalAppointments: result.statusCounts.reduce((sum, s) => sum + s.count, 0),
      todayCount: result.todayAppointments[0]?.count || 0,
      upcomingCount: result.upcomingAppointments[0]?.count || 0,
      counts: {
        confirmed: statusMap.confirmed || 0,
        completed: statusMap.completed || 0,
        cancelled: statusMap.cancelled || 0,
        noShow: statusMap['no-show'] || 0,
      },
      // Keep flat fields for backward compatibility
      confirmedCount: statusMap.confirmed || 0,
      completedCount: statusMap.completed || 0,
      cancelledCount: statusMap.cancelled || 0,
      noShowCount: statusMap['no-show'] || 0,
      revenue: result.revenue[0]?.total || 0,
      totalRevenue: result.revenue[0]?.total || 0,
      paidAppointments: result.revenue[0]?.count || 0,
      avgConsultationFee: result.revenue[0]?.avg || 0,
      appointmentTypes
    };

    res.json({
      success: true,
      data: responseData,
      // Top-level keys for easier access / test compatibility
      counts: responseData.counts,
      appointmentTypes,
      revenue: responseData.revenue,
    });
  } catch (error) {
    console.error('Get doctor statistics error:', error);
    res.status(500).json({ error: 'Server error while fetching statistics' });
  }
};

// Search doctor's appointments by patient name/email
export const searchDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { query, page = 1, limit = 10 } = req.query;
    const userId = req.user._id.toString();

    if (doctorId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Unauthorized to search these appointments'
      });
    }

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const matchingUsers = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select('_id');

    const userIds = matchingUsers.map(u => u._id);

    const searchQuery = {
      doctorId,
      userId: { $in: userIds }
    };

    const appointments = await Appointment.find(searchQuery)
      .populate('userId', 'name email phone')
      .populate('timeSlotId', 'date startTime endTime period bookingType')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Appointment.countDocuments(searchQuery);

    res.json({
      success: true,
      data: appointments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Search appointments error:', error);
    res.status(500).json({ error: 'Server error while searching appointments' });
  }
};

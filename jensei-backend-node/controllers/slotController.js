import { getAvailableSlots, generateSlots } from '../services/slotService.js';
import TimeSlot from '../models/TimeSlot.js';
import DoctorUnavailability from '../models/DoctorUnavailability.js';

// Get available slots for a doctor
export const getDoctorSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date, period } = req.query;
    
    if (!doctorId) {
      return res.status(400).json({ error: 'Doctor ID is required' });
    }
    
    // Default to today if no date provided
    const queryDate = date || new Date().toISOString().split('T')[0];
    
    // Note: bookingType parameter removed - slots don't have bookingType until booked
    const result = await getAvailableSlots(doctorId, queryDate, period);
    
    res.json(result);
  } catch (error) {
    console.error('Get doctor slots error:', error);
    res.status(500).json({ error: 'Server error while fetching slots' });
  }
};

// Generate slots for a doctor (Admin/Cron Job)
export const generateDoctorSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { startDate, endDate, periods } = req.body;
    
    if (!doctorId || !startDate || !endDate) {
      return res.status(400).json({
        error: 'Doctor ID, start date, and end date are required',
      });
    }

    // Validate date range - endDate must not be before startDate
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        error: 'Invalid date format. Use YYYY-MM-DD.',
      });
    }
    if (end < start) {
      return res.status(400).json({
        error: 'End date must not be before start date',
      });
    }
    
    const result = await generateSlots(doctorId, startDate, endDate);
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Generate slots error:', error);
    res.status(500).json({ error: 'Server error while generating slots' });
  }
};

// Mark doctor as unavailable
export const markDoctorUnavailable = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { startDate, endDate, reason, type, isRecurring } = req.body;
    
    if (!doctorId || !startDate || !endDate) {
      return res.status(400).json({
        error: 'Doctor ID, start date, and end date are required',
      });
    }
    
    // Create unavailability entry
    const unavailability = new DoctorUnavailability({
      doctorId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason: reason || '',
      type: type || 'other',
      isRecurring: isRecurring || false,
    });
    
    await unavailability.save();
    
    // Cancel any existing slots in this date range
    await TimeSlot.updateMany(
      {
        doctorId,
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        status: 'available',
      },
      {
        status: 'cancelled',
      }
    );
    
    res.json({
      success: true,
      message: 'Doctor marked as unavailable',
      data: unavailability,
    });
  } catch (error) {
    console.error('Mark doctor unavailable error:', error);
    res.status(500).json({ error: 'Server error while marking doctor unavailable' });
  }
};

// Bulk update slot statuses
export const bulkUpdateSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { slotIds, status } = req.body;
    const userId = req.user._id.toString();

    // Authorization: Only doctor or admin
    if (doctorId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Unauthorized to update slots'
      });
    }

    if (!slotIds || !Array.isArray(slotIds) || slotIds.length === 0) {
      return res.status(400).json({
        error: 'slotIds array is required'
      });
    }

    const validStatuses = ['available', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Must be: available or cancelled'
      });
    }

    // Cannot bulk-update booked slots to available
    if (status === 'available') {
      const bookedSlots = await TimeSlot.find({
        _id: { $in: slotIds },
        status: 'booked'
      });

      if (bookedSlots.length > 0) {
        return res.status(400).json({
          error: 'Cannot change booked slots to available. Cancel appointments first.'
        });
      }
    }

    const result = await TimeSlot.updateMany(
      {
        _id: { $in: slotIds },
        doctorId,
        status: { $ne: 'booked' }
      },
      {
        $set: { status }
      }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} slots updated successfully`,
      data: {
        updatedCount: result.modifiedCount,
        totalRequested: slotIds.length
      }
    });
  } catch (error) {
    console.error('Bulk update slots error:', error);
    res.status(500).json({ error: 'Server error while updating slots' });
  }
};

// Get doctor unavailability
export const getDoctorUnavailability = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { startDate, endDate } = req.query;
    
    const query = { doctorId };
    
    if (startDate && endDate) {
      query.$or = [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) },
        },
      ];
    }
    
    const unavailability = await DoctorUnavailability.find(query).sort({ startDate: 1 });
    
    res.json({
      success: true,
      data: unavailability,
    });
  } catch (error) {
    console.error('Get doctor unavailability error:', error);
    res.status(500).json({ error: 'Server error while fetching unavailability' });
  }
};


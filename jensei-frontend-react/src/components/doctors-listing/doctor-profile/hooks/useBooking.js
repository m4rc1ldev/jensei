import { useState } from 'react';
import { API_URL } from '../../../../config/api.js';

/**
 * Custom hook to manage the multi-step booking flow.
 */
const useBooking = (id, selectedSlot, setSelectedSlot, refreshSlots) => {
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [appointmentType, setAppointmentType] = useState('clinic_visit');
  const [bookingNotes, setBookingNotes] = useState('');

  const handleBookNow = () => {
    if (!selectedSlot) return;
    setShowBookingPopup(true);
    setBookingError(null);
    setBookingSuccess(false);
    setBookingStep(1);
    setAppointmentType('clinic_visit');
    setBookingNotes('');
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !id) return;

    try {
      setBookingInProgress(true);
      setBookingError(null);

      const response = await fetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          doctorId: id,
          timeSlotId: selectedSlot.id,
          appointmentType: appointmentType,
          notes: bookingNotes
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to book appointment');
      }

      if (data.success) {
        setBookingSuccess(true);
        setTimeout(() => {
          setShowBookingPopup(false);
          setSelectedSlot(null);
          setBookingStep(1);
          refreshSlots();
        }, 2500);
      }
    } catch (err) {
      console.error('Booking error:', err);
      setBookingError(err.message || 'Failed to book appointment. Please try again.');
    } finally {
      setBookingInProgress(false);
    }
  };

  return {
    showBookingPopup,
    setShowBookingPopup,
    bookingInProgress,
    bookingError,
    bookingSuccess,
    bookingStep,
    setBookingStep,
    appointmentType,
    setAppointmentType,
    bookingNotes,
    setBookingNotes,
    handleBookNow,
    handleConfirmBooking,
  };
};

export default useBooking;

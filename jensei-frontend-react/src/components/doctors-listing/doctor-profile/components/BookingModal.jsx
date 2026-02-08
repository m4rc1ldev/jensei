import React from 'react';
import { APPOINTMENT_TYPES } from '../constants.js';
import { formatTime, formatDateForDisplay } from '../utils.js';
import StepIndicator from './StepIndicator.jsx';

const BookingModal = ({
  doctor,
  selectedSlot,
  selectedDate,
  showBookingPopup,
  setShowBookingPopup,
  setSelectedSlot,
  bookingInProgress,
  bookingError,
  bookingSuccess,
  bookingStep,
  setBookingStep,
  appointmentType,
  setAppointmentType,
  bookingNotes,
  setBookingNotes,
  handleConfirmBooking,
}) => {
  if (!showBookingPopup) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !bookingInProgress && !bookingSuccess) {
          setShowBookingPopup(false);
          setSelectedSlot(null);
        }
      }}
    >
      <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 max-w-md w-full sm:mx-4 shadow-2xl max-h-[90vh] overflow-y-auto transition-all duration-300"
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        {bookingSuccess ? (
          /* Success State */
          <div className="text-center space-y-6 py-4">
            <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center"
              style={{ animation: 'scaleIn 0.5s ease-out' }}
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="#1fbd5c" strokeWidth="2.5"/>
                <path d="M13 20l5 5 10-10" stroke="#1fbd5c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
              <p className="text-sm text-gray-500">
                Your appointment has been successfully booked. A confirmation email has been sent to you.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Step Indicator */}
            <StepIndicator currentStep={bookingStep} totalSteps={3} />

            {/* Step 1: Appointment Type */}
            {bookingStep === 1 && (
              <div className="space-y-4" style={{ animation: 'fadeIn 0.2s ease-out' }}>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">Choose Appointment Type</h2>
                  <p className="text-sm text-gray-500">How would you like to consult?</p>
                </div>

                <div className="space-y-2.5">
                  {APPOINTMENT_TYPES.map((type) => {
                    const isActive = appointmentType === type.value;
                    return (
                      <div
                        key={type.value}
                        onClick={() => setAppointmentType(type.value)}
                        className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-[#796bff]/5 to-[#4c9eff]/5 border-2 border-[#4c9eff]'
                            : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                        }`}
                      >
                        <span className="text-2xl">{type.icon}</span>
                        <div className="flex-1">
                          <p className={`font-semibold text-sm ${isActive ? 'text-[#4c9eff]' : 'text-gray-800'}`}>
                            {type.label}
                          </p>
                          <p className="text-xs text-gray-400">{type.description}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isActive ? 'border-[#4c9eff]' : 'border-gray-300'
                        }`}>
                          {isActive && <div className="w-2.5 h-2.5 rounded-full bg-[#4c9eff]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setBookingStep(2)}
                  className="w-full bg-gradient-to-r from-[#796bff] to-[#4c9eff] text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Notes/Symptoms */}
            {bookingStep === 2 && (
              <div className="space-y-4" style={{ animation: 'fadeIn 0.2s ease-out' }}>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">Add Notes</h2>
                  <p className="text-sm text-gray-500">Describe your symptoms or reason for visit (optional)</p>
                </div>

                <textarea
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="E.g., I've been experiencing headaches for the past week..."
                  className="w-full h-32 p-4 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4c9eff]/30 focus:border-[#4c9eff] resize-none transition-all"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setBookingStep(1)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setBookingStep(3)}
                    className="flex-1 bg-gradient-to-r from-[#796bff] to-[#4c9eff] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                  >
                    Review
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {bookingStep === 3 && (
              <div className="space-y-4" style={{ animation: 'fadeIn 0.2s ease-out' }}>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">Confirm Appointment</h2>
                  <p className="text-sm text-gray-500">Please review your appointment details</p>
                </div>

                {selectedSlot && doctor && (
                  <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Doctor</span>
                      <span className="text-sm font-semibold text-gray-800">{doctor.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Specialty</span>
                      <span className="text-sm text-gray-700">{doctor.specialty}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Date</span>
                      <span className="text-sm text-gray-700">
                        {selectedDate && formatDateForDisplay(selectedDate)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Time</span>
                      <span className="text-sm text-gray-700">
                        {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Type</span>
                      <span className="text-sm text-gray-700 flex items-center gap-1.5">
                        <span>{APPOINTMENT_TYPES.find(t => t.value === appointmentType)?.icon}</span>
                        {APPOINTMENT_TYPES.find(t => t.value === appointmentType)?.label}
                      </span>
                    </div>
                    {bookingNotes && (
                      <div className="pt-2 border-t border-gray-200">
                        <span className="text-xs font-medium text-gray-400 block mb-1">Your Notes</span>
                        <p className="text-sm text-gray-600 line-clamp-2">{bookingNotes}</p>
                      </div>
                    )}
                    <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                      <span className="text-base font-bold text-gray-800">Consultation Fee</span>
                      <span className="text-base font-bold text-[#4c9eff]">{doctor.price}</span>
                    </div>
                  </div>
                )}

                {bookingError && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2.5">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-red-500 mt-0.5 shrink-0">
                      <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M9 5.5v4M9 12h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-red-700">{bookingError}</p>
                      {bookingError.includes('not available') && (
                        <p className="text-xs text-red-500 mt-1">This slot may have been booked by someone else. Please select a different time.</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setBookingStep(2)}
                    disabled={bookingInProgress}
                    className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    disabled={bookingInProgress}
                    className="flex-1 bg-gradient-to-r from-[#796bff] to-[#4c9eff] text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {bookingInProgress ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Booking...
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;

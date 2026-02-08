import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SideNavigation, SearchBar } from '../index';

import Marcus from '../../Marcus';
import { useSidebar } from '../../../contexts/SidebarContext';

// Hooks
import useDoctorData from './hooks/useDoctorData.js';
import useCalendar from './hooks/useCalendar.js';
import useSlots from './hooks/useSlots.js';
import useBooking from './hooks/useBooking.js';
import useMarcusMessages from './hooks/useMarcusMessages.js';

// Components
import DoctorCard from './components/DoctorCard.jsx';
import AboutSection from './components/AboutSection.jsx';
import TimeSlotsSection from './components/TimeSlotsSection.jsx';
import OfficeSection from './components/OfficeSection.jsx';
import ReviewsSection from './components/ReviewsSection.jsx';
import BookingModal from './components/BookingModal.jsx';

// Hardcoded reviews (until API supports them)
const REVIEWS = [
  {
    name: 'Sarah L.',
    rating: 5.0,
    comment: "The virtual consultation was so efficient. Dr. Sharma was empathetic and clearly explained the next steps based on the AI's initial findings. Highly recommend her for quick appointments.",
    avatar: '/doctors-listing/177d140e192caa63642ab9208e3afc0c6202a7cc.png'
  },
  {
    name: 'Sarah L.',
    rating: 5.0,
    comment: "The virtual consultation was so efficient. Dr. Sharma was empathetic and clearly explained the next steps based on the AI's initial findings. Highly recommend her for quick appointments.",
    avatar: '/doctors-listing/177d140e192caa63642ab9208e3afc0c6202a7cc.png'
  }
];

const DoctorsProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isCollapsed, toggleMobileMenu, isMobile } = useSidebar();

  // Custom hooks
  const { doctorData, setDoctorData, loading, error } = useDoctorData(id);

  const calendar = useCalendar();

  const slots = useSlots(id, calendar.calendarMonth, doctorData, setDoctorData);

  const booking = useBooking(id, slots.selectedSlot, slots.setSelectedSlot, slots.refreshSlots);

  const marcus = useMarcusMessages({
    doctorData,
    loading,
    selectedDate: slots.selectedDate,
    selectedSlot: slots.selectedSlot,
    bookingSuccess: booking.bookingSuccess,
  });

  // Prepare doctor data with reviews
  const doctorWithReviews = doctorData ? { ...doctorData, reviews: REVIEWS } : null;

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#4c9eff] border-t-transparent rounded-full animate-spin" />
          <p className="text-lg text-gray-600">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !doctorWithReviews) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-red-500">
            <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="text-lg text-red-500">{error || 'Doctor not found'}</p>
        <button
          onClick={() => navigate('/doctors')}
          className="px-6 py-2.5 bg-gradient-to-r from-[#796bff] to-[#4c9eff] text-white rounded-xl hover:opacity-90 transition-opacity font-medium"
        >
          Back to Doctors
        </button>
      </div>
    );
  }

  return (
    <>
      <SideNavigation />

      <div className="bg-white relative w-full min-h-screen flex overflow-x-auto">
        <div className="w-full mx-auto flex relative">
          <main
            className={`flex-1 flex flex-col p-4 lg:p-8 min-w-0 transition-all duration-300 ${
              !isMobile
                ? (isCollapsed ? 'lg:pl-[104px]' : 'lg:pl-[280px]')
                : ''
            }`}
          >
            {/* Mobile Hamburger Button */}
            {isMobile && (
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden fixed top-4 left-4 z-30 bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-2 shadow-md hover:bg-gray-50 transition-colors"
                aria-label="Toggle menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}

            {/* Header Section */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 lg:mb-8 mt-12 lg:mt-0">
              <h1 className="font-semibold text-2xl lg:text-[28px] text-black whitespace-nowrap">Doctors Profile</h1>
              <div ref={marcus.searchBarRef}>
                <SearchBar
                  onSearchChange={marcus.handleSearchChange}
                  onFocus={marcus.handleSearchFocus}
                  onBlur={marcus.handleSearchBlur}
                />
              </div>
            </div>

            {/* Doctor Info and Content */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start w-full mb-8 min-w-0">
              <DoctorCard doctor={doctorWithReviews} />

              <div className="flex flex-col gap-6 items-start flex-1 w-full min-w-0">
                <AboutSection doctor={doctorWithReviews} />

                <TimeSlotsSection
                  doctor={doctorWithReviews}
                  slotsByPeriod={slots.slotsByPeriod}
                  slotsCountByDate={slots.slotsCountByDate}
                  loadingSlots={slots.loadingSlots}
                  selectedDate={slots.selectedDate}
                  setSelectedDate={slots.setSelectedDate}
                  selectedSlot={slots.selectedSlot}
                  selectedPeriod={slots.selectedPeriod}
                  setSelectedPeriod={slots.setSelectedPeriod}
                  handleSlotClick={slots.handleSlotClick}
                  handleBookNow={booking.handleBookNow}
                  calendarMonth={calendar.calendarMonth}
                  showFullCalendar={calendar.showFullCalendar}
                  setShowFullCalendar={calendar.setShowFullCalendar}
                  goToPrevMonth={calendar.goToPrevMonth}
                  goToNextMonth={calendar.goToNextMonth}
                  isPrevMonthDisabled={calendar.isPrevMonthDisabled}
                  totalCalendarRows={calendar.totalCalendarRows}
                  visibleCells={calendar.visibleCells}
                />
              </div>
            </div>

            <OfficeSection office={doctorWithReviews.office} />
            <ReviewsSection reviews={doctorWithReviews.reviews} />
          </main>

          <BookingModal
            doctor={doctorWithReviews}
            selectedSlot={slots.selectedSlot}
            selectedDate={slots.selectedDate}
            showBookingPopup={booking.showBookingPopup}
            setShowBookingPopup={booking.setShowBookingPopup}
            setSelectedSlot={slots.setSelectedSlot}
            bookingInProgress={booking.bookingInProgress}
            bookingError={booking.bookingError}
            bookingSuccess={booking.bookingSuccess}
            bookingStep={booking.bookingStep}
            setBookingStep={booking.setBookingStep}
            appointmentType={booking.appointmentType}
            setAppointmentType={booking.setAppointmentType}
            bookingNotes={booking.bookingNotes}
            setBookingNotes={booking.setBookingNotes}
            handleConfirmBooking={booking.handleConfirmBooking}
          />
        </div>
      </div>

      {/* Marcus */}
      <Marcus
        size="sm"
        message={marcus.marcusMessage}
        isSearching={marcus.isSearching}
        searchBarPosition={marcus.searchBarPosition}
        style={{
          width: '48px',
          height: '48px',
        }}
      />

      {/* CSS Animations */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes scaleIn {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (min-width: 640px) {
          @keyframes slideUp {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        }
      `}</style>
    </>
  );
};

export default DoctorsProfile;

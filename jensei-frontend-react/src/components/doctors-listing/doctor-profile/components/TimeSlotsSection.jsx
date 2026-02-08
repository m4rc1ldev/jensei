import React from 'react';
import { PERIOD_CONFIG, MONTH_NAMES, DAY_HEADERS } from '../constants.js';
import { formatTime } from '../utils.js';
import { CalendarSkeleton, SlotGridSkeleton } from './Skeletons.jsx';

const TimeSlotsSection = ({
  doctor,
  slotsByPeriod,
  slotsCountByDate,
  loadingSlots,
  selectedDate,
  setSelectedDate,
  selectedSlot,
  selectedPeriod,
  setSelectedPeriod,
  handleSlotClick,
  handleBookNow,
  calendarMonth,
  showFullCalendar,
  setShowFullCalendar,
  goToPrevMonth,
  goToNextMonth,
  isPrevMonthDisabled,
  totalCalendarRows,
  visibleCells,
}) => {
  const totalSlotsForSelected = Object.values(slotsByPeriod).reduce((sum, slots) => sum + slots.length, 0);

  return (
    <div className="flex flex-col gap-5 items-start w-full">
      <div className="flex flex-col gap-3 items-start w-full">
        <div className="flex items-center justify-between w-full">
          <p className="font-semibold text-base text-black">Available Time Slots</p>
          {totalSlotsForSelected > 0 && !loadingSlots && (
            <span className="text-xs font-medium text-[#1fbd5c] bg-[#edffea] px-2.5 py-1 rounded-full">
              {totalSlotsForSelected} slot{totalSlotsForSelected !== 1 ? 's' : ''} available
            </span>
          )}
        </div>

        {/* Calendar Date Picker */}
        <div className="w-full">
          {loadingSlots && Object.keys(slotsCountByDate).length === 0 ? (
            <CalendarSkeleton />
          ) : (
            <div className="w-full">
              {/* Month header with navigation arrows */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-black">
                  {MONTH_NAMES[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={goToPrevMonth}
                    disabled={isPrevMonthDisabled}
                    className={`p-1.5 rounded-full transition-colors ${
                      isPrevMonthDisabled
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    aria-label="Previous month"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    onClick={goToNextMonth}
                    className="p-1.5 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label="Next month"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Day-of-week headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAY_HEADERS.map(day => (
                  <div key={day} className="text-center text-[11px] font-medium text-[rgba(0,0,0,0.4)] py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Date cells grid */}
              <div className="grid grid-cols-7">
                {visibleCells.map((cell, idx) => {
                  if (cell.empty) {
                    return <div key={`empty-${idx}`} className="py-2" />;
                  }

                  const isSelected = selectedDate === cell.date;
                  const slotCount = slotsCountByDate[cell.date];
                  const hasSlots = slotCount > 0;

                  return (
                    <button
                      key={cell.date}
                      onClick={() => !cell.isPast && setSelectedDate(cell.date)}
                      disabled={cell.isPast}
                      className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-all duration-150 relative ${
                        cell.isPast
                          ? 'text-gray-300 cursor-not-allowed'
                          : isSelected
                            ? 'bg-[#4c9eff] text-white shadow-sm'
                            : 'text-black hover:bg-[#f0f7ff] cursor-pointer'
                      }`}
                    >
                      <span className={`text-sm font-medium leading-tight ${
                        cell.isToday && !isSelected ? 'text-[#4c9eff] font-bold' : ''
                      }`}>
                        {cell.day}
                      </span>
                      {/* Green dot for dates with available slots */}
                      {!cell.isPast && hasSlots && (
                        <div className={`w-1 h-1 rounded-full mt-0.5 ${
                          isSelected ? 'bg-white' : 'bg-[#1fbd5c]'
                        }`} />
                      )}
                      {/* Gray dot for dates with no slots (only if count is fetched) */}
                      {!cell.isPast && slotCount !== undefined && !hasSlots && (
                        <div className={`w-1 h-1 rounded-full mt-0.5 ${
                          isSelected ? 'bg-white/50' : 'bg-gray-300'
                        }`} />
                      )}
                      {/* Invisible spacer when no dot to keep consistent height */}
                      {(cell.isPast || slotCount === undefined) && (
                        <div className="w-1 h-1 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Show Full Calendar / Show Less toggle */}
              {totalCalendarRows > 3 && (
                <button
                  onClick={() => setShowFullCalendar(prev => !prev)}
                  className="text-xs font-medium text-[#4c9eff] hover:text-[#3a85dd] mt-2 transition-colors"
                >
                  {showFullCalendar ? 'Show Less Calendar' : 'Show Full Calendar'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Time Period Tabs */}
      <div className="flex flex-col gap-4 items-start w-full">
        <div className="flex flex-nowrap lg:flex-wrap gap-2 items-start w-full overflow-x-auto lg:overflow-x-visible pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {doctor.timePeriods.map((period) => {
            const config = PERIOD_CONFIG[period.label];
            const isActive = selectedPeriod === period.label;
            const hasSlots = period.count > 0;

            return (
              <div
                key={period.label}
                onClick={() => setSelectedPeriod(period.label)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 flex-shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#796bff]/10 to-[#4c9eff]/10 border border-[#4c9eff]/30'
                    : 'bg-[#f7f7f7] border border-transparent hover:bg-[#f0f0f0]'
                }`}
              >
                <span className="text-base">{config.icon}</span>
                <div className="flex flex-col">
                  <span className={`text-sm font-semibold leading-tight ${
                    isActive ? 'text-[#4c9eff]' : 'text-[rgba(0,0,0,0.7)]'
                  }`}>
                    {period.label}
                  </span>
                  <span className={`text-[10px] leading-tight ${
                    isActive ? 'text-[#4c9eff]/70' : 'text-[rgba(0,0,0,0.35)]'
                  }`}>
                    {config.timeRange}
                  </span>
                </div>
                <span className={`text-xs font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full px-1.5 ${
                  isActive
                    ? 'bg-[#4c9eff] text-white'
                    : hasSlots
                      ? 'bg-[#1fbd5c]/10 text-[#1fbd5c]'
                      : 'bg-gray-200 text-gray-400'
                }`}>
                  {period.count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Enhanced Slots Grid Display */}
        {loadingSlots ? (
          <SlotGridSkeleton />
        ) : slotsByPeriod[selectedPeriod] && slotsByPeriod[selectedPeriod].length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 w-full">
            {slotsByPeriod[selectedPeriod].map((slot) => {
              const isSelected = selectedSlot?.id === slot.id;
              return (
                <div
                  key={slot.id}
                  onClick={() => handleSlotClick(slot)}
                  className={`relative flex items-center justify-center px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 min-h-[44px] ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#796bff] to-[#4c9eff] text-white shadow-md scale-[1.02]'
                      : 'bg-[#f7f7f7] text-[rgba(0,0,0,0.7)] hover:bg-[#e8f4ff] hover:text-[#4c9eff] border border-transparent hover:border-[#4c9eff]/30'
                  }`}
                >
                  <p className={`font-semibold text-sm whitespace-nowrap ${
                    isSelected ? 'text-white' : ''
                  }`}>
                    {formatTime(slot.startTime)}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full py-8 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-gray-300">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="font-medium text-sm text-gray-700">
                {selectedDate ? `No ${selectedPeriod.toLowerCase()} slots available` : 'Select a date to view slots'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {selectedDate ? 'Try selecting a different time period or date' : 'Choose a date from the calendar above'}
              </p>
            </div>
          </div>
        )}

        {/* Book Now Button */}
        {selectedSlot && (
          <div className="w-full pt-2">
            <button
              onClick={handleBookNow}
              className="w-full py-3.5 rounded-xl font-semibold text-base text-white bg-gradient-to-r from-[#796bff] to-[#4c9eff] hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Book Now - {formatTime(selectedSlot.startTime)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSlotsSection;

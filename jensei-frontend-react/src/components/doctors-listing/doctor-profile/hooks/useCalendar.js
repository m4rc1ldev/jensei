import { useState } from 'react';

/**
 * Custom hook to manage calendar month state, navigation, and grid computation.
 */
const useCalendar = () => {
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [showFullCalendar, setShowFullCalendar] = useState(false);

  // Calendar navigation
  const goToPrevMonth = () => {
    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const goToNextMonth = () => {
    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Check if prev month button should be disabled (can't go before current month)
  const today = new Date();
  const isPrevMonthDisabled = calendarMonth.getFullYear() === today.getFullYear() && calendarMonth.getMonth() === today.getMonth();

  // Build calendar grid for the current calendarMonth
  const calendarDays = (() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = new Date().toISOString().split('T')[0];
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const cells = [];
    // Leading empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      cells.push({ empty: true });
    }
    // Actual day cells
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const dateStr = dateObj.toISOString().split('T')[0];
      const isPast = dateObj < todayDate;
      cells.push({
        empty: false,
        date: dateStr,
        day: d,
        isToday: dateStr === todayStr,
        isPast,
        dateObj
      });
    }
    return cells;
  })();

  // Determine rows to show based on showFullCalendar
  const totalCalendarRows = Math.ceil(calendarDays.length / 7);
  const visibleRows = showFullCalendar ? totalCalendarRows : Math.min(3, totalCalendarRows);
  const visibleCells = calendarDays.slice(0, visibleRows * 7);

  return {
    calendarMonth,
    showFullCalendar,
    setShowFullCalendar,
    goToPrevMonth,
    goToNextMonth,
    isPrevMonthDisabled,
    calendarDays,
    totalCalendarRows,
    visibleCells,
  };
};

export default useCalendar;

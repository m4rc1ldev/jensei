import { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../../../../config/api.js';

/**
 * Custom hook to manage slot fetching, grouping by period, and slot counts.
 */
const useSlots = (id, calendarMonth, doctorData, setDoctorData) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [slotsByPeriod, setSlotsByPeriod] = useState({
    Morning: [],
    Afternoon: [],
    Evening: [],
    Night: []
  });
  const [slotsCountByDate, setSlotsCountByDate] = useState({});
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('Evening');

  // Fetch slot counts for the visible calendar month
  useEffect(() => {
    const fetchSlotCounts = async () => {
      if (!id) return;

      try {
        setLoadingSlots(true);

        const year = calendarMonth.getFullYear();
        const month = calendarMonth.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        const todayStr = todayDate.toISOString().split('T')[0];

        // Build list of fetchable dates (today and future only)
        const datesToFetch = [];
        for (let d = 1; d <= daysInMonth; d++) {
          const dateObj = new Date(year, month, d);
          if (dateObj >= todayDate) {
            datesToFetch.push(dateObj.toISOString().split('T')[0]);
          }
        }

        // Set default selected date if not already set or if it's in a different month
        if (!selectedDate || !datesToFetch.includes(selectedDate)) {
          if (datesToFetch.includes(todayStr)) {
            setSelectedDate(todayStr);
          } else if (datesToFetch.length > 0) {
            setSelectedDate(datesToFetch[0]);
          }
        }

        // Fetch slot counts in batches
        const batchSize = 5;
        const counts = {};
        for (let i = 0; i < datesToFetch.length; i += batchSize) {
          const batch = datesToFetch.slice(i, i + batchSize);
          const results = await Promise.all(
            batch.map(async (dateStr) => {
              try {
                const resp = await fetch(
                  `${API_URL}/api/slots/${id}?date=${dateStr}`,
                  { credentials: 'include' }
                );
                const data = await resp.json();
                if (data.success && data.data) {
                  return { date: dateStr, count: (data.data.availableSlots || []).length };
                }
                return { date: dateStr, count: 0 };
              } catch {
                return { date: dateStr, count: 0 };
              }
            })
          );
          results.forEach(r => { counts[r.date] = r.count; });
          setSlotsCountByDate(prev => ({ ...prev, ...counts }));
        }
      } catch (err) {
        console.error('Error fetching slot counts:', err);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlotCounts();
  }, [id, calendarMonth]);

  // Fetch slots for selected date
  useEffect(() => {
    const fetchSlotsForDate = async () => {
      if (!id || !selectedDate) return;

      // Clear selected slot when date changes
      setSelectedSlot(null);

      try {
        setLoadingSlots(true);
        const response = await fetch(
          `${API_URL}/api/slots/${id}?date=${selectedDate}`,
          { credentials: 'include' }
        );
        const data = await response.json();

        if (data.success && data.data) {
          const slots = data.data.availableSlots || [];

          const grouped = {
            Morning: [],
            Afternoon: [],
            Evening: [],
            Night: []
          };

          slots.forEach(slot => {
            if (grouped[slot.period]) {
              grouped[slot.period].push({
                id: slot._id,
                startTime: slot.startTime,
                endTime: slot.endTime,
                period: slot.period,
                bookingType: slot.bookingType
              });
            }
          });

          Object.keys(grouped).forEach(period => {
            grouped[period].sort((a, b) => {
              const timeA = a.startTime.split(':').map(Number);
              const timeB = b.startTime.split(':').map(Number);
              return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
            });
          });

          setSlotsByPeriod(grouped);

          // Update slot count for this date
          setSlotsCountByDate(prev => ({
            ...prev,
            [selectedDate]: slots.length
          }));

          if (doctorData) {
            const updatedPeriods = doctorData.timePeriods.map(period => ({
              ...period,
              count: grouped[period.label]?.length || 0,
              active: period.label === selectedPeriod
            }));
            setDoctorData(prev => ({
              ...prev,
              timePeriods: updatedPeriods,
              slots: grouped
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching slots:', err);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlotsForDate();
  }, [id, selectedDate]);

  // Refresh slots without full page reload
  const refreshSlots = useCallback(async () => {
    if (!id || !selectedDate) return;
    try {
      const response = await fetch(
        `${API_URL}/api/slots/${id}?date=${selectedDate}`,
        { credentials: 'include' }
      );
      const data = await response.json();
      if (data.success && data.data) {
        const slots = data.data.availableSlots || [];
        const grouped = { Morning: [], Afternoon: [], Evening: [], Night: [] };
        slots.forEach(slot => {
          if (grouped[slot.period]) {
            grouped[slot.period].push({
              id: slot._id,
              startTime: slot.startTime,
              endTime: slot.endTime,
              period: slot.period,
              bookingType: slot.bookingType
            });
          }
        });
        Object.keys(grouped).forEach(period => {
          grouped[period].sort((a, b) => {
            const timeA = a.startTime.split(':').map(Number);
            const timeB = b.startTime.split(':').map(Number);
            return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
          });
        });
        setSlotsByPeriod(grouped);
        setSlotsCountByDate(prev => ({ ...prev, [selectedDate]: slots.length }));
        if (doctorData) {
          setDoctorData(prev => ({
            ...prev,
            timePeriods: prev.timePeriods.map(p => ({
              ...p,
              count: grouped[p.label]?.length || 0
            })),
            slots: grouped
          }));
        }
      }
    } catch (err) {
      console.error('Error refreshing slots:', err);
    }
  }, [id, selectedDate, doctorData]);

  // Handle slot selection toggle
  const handleSlotClick = (slot) => {
    if (selectedSlot?.id === slot.id) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot(slot);
    }
  };

  return {
    selectedDate,
    setSelectedDate,
    slotsByPeriod,
    slotsCountByDate,
    loadingSlots,
    selectedSlot,
    setSelectedSlot,
    selectedPeriod,
    setSelectedPeriod,
    refreshSlots,
    handleSlotClick,
  };
};

export default useSlots;

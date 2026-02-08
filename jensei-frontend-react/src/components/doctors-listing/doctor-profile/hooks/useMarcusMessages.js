import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Returns a time-of-day greeting message.
 */
const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "Good morning! \uD83D\uDC4B";
  if (hour >= 12 && hour < 18) return "Afternoon! \uD83D\uDE0A";
  if (hour >= 18 && hour < 22) return "Evening! \uD83C\uDF19";
  return "Hey! Late night? \uD83C\uDF19";
};

/**
 * Custom hook that manages all Marcus assistant message state,
 * search-bar interaction handlers, and inactivity tracking.
 */
const useMarcusMessages = ({ doctorData, loading, selectedDate, selectedSlot, bookingSuccess }) => {
  const [marcusMessage, setMarcusMessage] = useState("Hi! \uD83D\uDC4B");
  const [isSearching, setIsSearching] = useState(false);
  const [searchBarPosition, setSearchBarPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const searchBarRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const lastInteractionRef = useRef(Date.now());

  // Initialize Marcus with personalized greeting
  useEffect(() => {
    try {
      const visited = localStorage.getItem('marcus_visited');
      if (!visited) {
        localStorage.setItem('marcus_visited', 'true');
        setMarcusMessage("Hi! I'm Marcus \uD83D\uDC4B Welcome!");
      } else {
        setMarcusMessage(getTimeGreeting());
      }
    } catch {
      setMarcusMessage(getTimeGreeting());
    }
  }, []);

  // Handle search value change from SearchBar component
  const handleSearchChange = useCallback((value) => {
    if (value && value.trim().length > 0) {
      setIsSearching(true);
      setMarcusMessage("Got it! \uD83D\uDD0D");
      lastInteractionRef.current = Date.now();

      if (searchBarRef.current) {
        const rect = searchBarRef.current.getBoundingClientRect();
        setSearchBarPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    } else {
      setIsSearching(false);
      setMarcusMessage(getTimeGreeting());
    }
  }, []);

  const handleSearchFocus = useCallback(() => {
    const showSearchMessage = () => {
      const messages = [
        "How can I help? \uD83E\uDD17",
        "What are you looking for? \uD83D\uDD0D",
        "I'm here to help! \uD83D\uDC99",
        "Ready to search! \u2728"
      ];
      setMarcusMessage(messages[Math.floor(Math.random() * messages.length)]);
      lastInteractionRef.current = Date.now();
    };

    if (searchBarRef.current) {
      const rect = searchBarRef.current.getBoundingClientRect();
      setSearchBarPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsSearching(true);
          showSearchMessage();
        });
      });
    } else {
      setIsSearching(true);
      showSearchMessage();
    }
  }, []);

  const handleSearchBlur = useCallback(() => {
    const blurTimeout = setTimeout(() => {
      if (!searchBarRef.current?.querySelector('input:focus')) {
        const input = searchBarRef.current?.querySelector('input');
        if (input && !input.value.trim()) {
          setIsSearching(false);
          setMarcusMessage(getTimeGreeting());
        }
      }
    }, 200);

    return () => clearTimeout(blurTimeout);
  }, []);

  // Update search bar position when isSearching changes
  useEffect(() => {
    if (isSearching && searchBarRef.current) {
      const rect = searchBarRef.current.getBoundingClientRect();
      setSearchBarPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
  }, [isSearching]);

  // Update Marcus message when doctor data loads
  useEffect(() => {
    if (doctorData && !loading) {
      setMarcusMessage("Great doctor! \u2B50");
      lastInteractionRef.current = Date.now();
    }
  }, [doctorData, loading]);

  // Update Marcus message when date is selected
  useEffect(() => {
    if (selectedDate) {
      const messages = [
        "Good choice! \uD83D\uDCC5",
        "Nice date! \u2728",
        "Perfect timing! \uD83D\uDC99"
      ];
      setMarcusMessage(messages[Math.floor(Math.random() * messages.length)]);
      lastInteractionRef.current = Date.now();
    }
  }, [selectedDate]);

  // Update Marcus message when slot is selected
  useEffect(() => {
    if (selectedSlot) {
      setMarcusMessage("Ready to book? \uD83C\uDFAF");
      lastInteractionRef.current = Date.now();
    }
  }, [selectedSlot]);

  // Update Marcus message when booking succeeds
  useEffect(() => {
    if (bookingSuccess) {
      setMarcusMessage("Booking confirmed! \uD83C\uDF89");
      lastInteractionRef.current = Date.now();
    }
  }, [bookingSuccess]);

  // Track user interactions for personalized messages
  useEffect(() => {
    const handleDateClick = (e) => {
      const target = e.target.closest('[class*="date"]') || e.target.closest('[class*="rounded-lg"]');
      if (target && target.textContent) {
        setMarcusMessage("Selecting a date? \uD83D\uDCC5");
        lastInteractionRef.current = Date.now();
      }
    };

    const handleSlotClick = (e) => {
      const target = e.target.closest('[class*="slot"]') || e.target.closest('[class*="rounded-lg"]');
      if (target && target.textContent && (target.textContent.includes('AM') || target.textContent.includes('PM'))) {
        setMarcusMessage("Great time slot! \u23F0");
        lastInteractionRef.current = Date.now();
      }
    };

    const handlePeriodClick = (e) => {
      const target = e.target.closest('[class*="period"]') || e.target;
      if (target.textContent && (target.textContent.includes('Morning') || target.textContent.includes('Afternoon') || target.textContent.includes('Evening') || target.textContent.includes('Night'))) {
        setMarcusMessage("Checking availability! \uD83D\uDD0D");
        lastInteractionRef.current = Date.now();
      }
    };

    const handleScroll = () => {
      lastInteractionRef.current = Date.now();
    };

    document.addEventListener('click', handleDateClick);
    document.addEventListener('click', handleSlotClick);
    document.addEventListener('click', handlePeriodClick);
    window.addEventListener('scroll', handleScroll);

    const checkInactivity = () => {
      const timeSinceLastInteraction = Date.now() - lastInteractionRef.current;
      if (timeSinceLastInteraction > 30000) {
        const messages = [
          "Need help booking? \uD83D\uDCAC",
          "I'm here if you need me! \uD83D\uDC99",
          "Want some guidance? \uD83D\uDE0A"
        ];
        setMarcusMessage(messages[Math.floor(Math.random() * messages.length)]);
        lastInteractionRef.current = Date.now();
      }
    };

    inactivityTimerRef.current = setInterval(checkInactivity, 5000);

    return () => {
      document.removeEventListener('click', handleDateClick);
      document.removeEventListener('click', handleSlotClick);
      document.removeEventListener('click', handlePeriodClick);
      window.removeEventListener('scroll', handleScroll);
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current);
      }
    };
  }, []);

  return {
    marcusMessage,
    isSearching,
    searchBarPosition,
    searchBarRef,
    handleSearchChange,
    handleSearchFocus,
    handleSearchBlur,
  };
};

export default useMarcusMessages;

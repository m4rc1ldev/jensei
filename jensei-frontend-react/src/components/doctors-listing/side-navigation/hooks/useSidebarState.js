import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';

/**
 * Custom hook to manage sidebar expanded/collapsed state and debounced toggles.
 */
const useSidebarState = (isCollapsed) => {
  const params = useParams();
  const location = useLocation();
  const [isDoctorExpanded, setIsDoctorExpanded] = useState(false);
  const [isRecentExpanded, setIsRecentExpanded] = useState(
    params.thread_id != null && location.pathname.split("/")[1] === "chat"
  );
  const clickTimeoutRef = useRef(null);
  const prevCollapsedRef = useRef(isCollapsed);

  // Reset expanded states when sidebar collapses
  useEffect(() => {
    const wasExpanded = !prevCollapsedRef.current;
    if (isCollapsed && wasExpanded) {
      // Only reset when transitioning from expanded to collapsed
      setIsDoctorExpanded(false);
      setIsRecentExpanded(false);
    }
    prevCollapsedRef.current = isCollapsed;
  }, [isCollapsed]);

  // Debounced toggle to prevent rapid clicks on slow connections
  const debouncedToggle = useCallback((toggleFn) => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    clickTimeoutRef.current = setTimeout(() => {
      toggleFn();
    }, 50); // Small debounce to prevent rapid state changes
  }, []);

  const toggleDoctorExpanded = useCallback(() => {
    debouncedToggle(() => setIsDoctorExpanded(prev => !prev));
  }, [debouncedToggle]);

  const toggleRecentExpanded = useCallback(() => {
    debouncedToggle(() => setIsRecentExpanded(prev => !prev));
  }, [debouncedToggle]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  return {
    isDoctorExpanded,
    isRecentExpanded,
    toggleDoctorExpanded,
    toggleRecentExpanded,
  };
};

export default useSidebarState;

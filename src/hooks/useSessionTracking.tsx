// Helper hook for engagement tracking
import { useEffect, useRef, useState } from "react";

export const useSessionTracking = () => {
  const [sessionTime, setSessionTime] = useState(0);  // Total session time in seconds
  const [engagementTime, setEngagementTime] = useState(0);  // Total time the user was engaged (focused)
  const engagedRef = useRef(true);  // Tracks whether the user is currently engaged
  const startTimeRef = useRef(Date.now());  // Time when the user opened the page or became engaged

  // Initialize session and engagement tracking
  useEffect(() => {
    // Update session time every second
    const sessionInterval = setInterval(() => {
      setSessionTime((prev) => prev + 1);
      if (engagedRef.current) {
        setEngagementTime((prev) => prev + 1);
      }
    }, 1000);

    // Add event listeners for focus and blur
    const handleFocus = () => {
      engagedRef.current = true;
      startTimeRef.current = Date.now();
      console.log('engagedRef.current', engagedRef.current)
    };

    const handleBlur = () => {
      engagedRef.current = false;
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Cleanup on unmount
    return () => {
      clearInterval(sessionInterval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Calculate engagement percentage
  const engagement = Math.round((engagementTime / sessionTime) * 100) ;

  return { sessionTime, engagement };
};


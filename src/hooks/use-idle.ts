import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook to detect when the user has gone idle.
 * @param timeoutMs The number of milliseconds of inactivity before triggering the idle state.
 * @returns boolean `isIdle`
 */
export function useIdle(timeoutMs: number = 30000): boolean {
  const [isIdle, setIsIdle] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    // If the user was idle and just interacted, wake them up instantly
    if (isIdle) {
      setIsIdle(false);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsIdle(true);
    }, timeoutMs);
  }, [isIdle, timeoutMs]);

  useEffect(() => {
    // List of events that reset the idle timer
    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "wheel"
    ];

    // Initialize timer
    resetTimer();

    // Attach event listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [resetTimer]);

  return isIdle;
}

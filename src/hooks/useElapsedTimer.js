import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * A simple count-up timer (tracks elapsed seconds) that resets whenever
 * `resetKey` changes — used to time each interview question independently.
 */
export function useElapsedTimer(resetKey) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    setSeconds(0);
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [resetKey]);

  const reset = useCallback(() => setSeconds(0), []);

  return { seconds, reset };
}

export function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

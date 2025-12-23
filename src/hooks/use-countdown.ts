'use client';

import { useState, useEffect } from 'react';
import { differenceInMilliseconds } from 'date-fns';

const TARGET_DATE_STRING = '2025-12-25T12:00:00+02:00'; // Israel Standard Time (UTC+2)

// Calculate the total duration for the progress bar
const START_DATE_STRING = '2025-12-23T12:00:00+02:00';
const TOTAL_DURATION = differenceInMilliseconds(new Date(TARGET_DATE_STRING), new Date(START_DATE_STRING));


export const useCountdown = () => {
  const [targetDate] = useState(() => new Date(TARGET_DATE_STRING).getTime());
  const [timeLeft, setTimeLeft] = useState(() => {
     const now = new Date().getTime();
     return Math.max(0, targetDate - now);
  });

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      setTimeLeft(Math.max(0, targetDate - now));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, timeLeft]);
  
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)));
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);
  const progress = Math.min(100, ((TOTAL_DURATION - timeLeft) / TOTAL_DURATION) * 100);
  
  return { 
    timeLeft, 
    hours: hours.toString().padStart(2, '0'), 
    minutes: minutes.toString().padStart(2, '0'), 
    seconds: seconds.toString().padStart(2, '0'), 
    progress 
  };
};

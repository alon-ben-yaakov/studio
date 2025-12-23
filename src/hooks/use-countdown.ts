'use client';

import { useState, useEffect } from 'react';

const COUNTDOWN_DURATION = 48 * 60 * 60 * 1000; // 48 hours in ms

export const useCountdown = () => {
  const [targetDate, setTargetDate] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_DURATION);

  useEffect(() => {
    const storedTarget = localStorage.getItem('countdownTarget');
    const now = new Date().getTime();

    let targetTime: number;

    if (storedTarget) {
      targetTime = parseInt(storedTarget, 10);
      // If target is in the past by more than 48 hours, reset it.
      if (now > targetTime + COUNTDOWN_DURATION) {
        targetTime = now + COUNTDOWN_DURATION;
        localStorage.setItem('countdownTarget', targetTime.toString());
      }
    } else {
      targetTime = now + COUNTDOWN_DURATION;
      localStorage.setItem('countdownTarget', targetTime.toString());
    }
    
    setTargetDate(targetTime);
    setTimeLeft(Math.max(0, targetTime - now));

  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 1000 ? prev - 1000 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);
  
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)));
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);
  const progress = targetDate ? Math.min(100, ((COUNTDOWN_DURATION - timeLeft) / COUNTDOWN_DURATION) * 100) : 0;
  
  return { 
    timeLeft, 
    hours: hours.toString().padStart(2, '0'), 
    minutes: minutes.toString().padStart(2, '0'), 
    seconds: seconds.toString().padStart(2, '0'), 
    progress 
  };
};

'use client';

import type { FC } from 'react';

interface CountdownClockProps {
  hours: string;
  minutes: string;
  seconds: string;
  isHadal: boolean;
}

const TimeBlock: FC<{ value: string; label: string; isHadal: boolean }> = ({ value, label, isHadal }) => (
  <div className="flex flex-col items-center">
    <div className="font-headline text-6xl md:text-8xl lg:text-9xl text-primary bg-primary-foreground/10 p-2 rounded-lg w-[100px] md:w-[150px] lg:w-[200px] shadow-inner">
      {isHadal ? '??' : value}
    </div>
    <span className="mt-2 text-sm md:text-base text-foreground/70 font-headline">{isHadal ? '???' : label}</span>
  </div>
);

const CountdownClock: FC<CountdownClockProps> = ({ hours, minutes, seconds, isHadal }) => {
  return (
    <div className="flex flex-row-reverse justify-center items-center gap-2 md:gap-4">
      <TimeBlock value={hours} label="שעות" isHadal={isHadal} />
      <span className="font-headline text-6xl md:text-8xl text-primary/70 pb-8">:</span>
      <TimeBlock value={minutes} label="דקות" isHadal={isHadal} />
      <span className="font-headline text-6xl md:text-8xl text-primary/70 pb-8">:</span>
      <TimeBlock value={seconds} label="שניות" isHadal={isHadal} />
    </div>
  );
};

export default CountdownClock;

'use client';

import { Coffee, Utensils, BedDouble } from 'lucide-react';
import type { FC } from 'react';

interface UnitCountersProps {
  timeLeft: number;
  isHadal: boolean;
}

const UnitCounters: FC<UnitCountersProps> = ({ timeLeft, isHadal }) => {
  const remainingHours = timeLeft / (1000 * 60 * 60);
  const coffeeCups = Math.max(0, Math.ceil(remainingHours / 4));
  const meals = Math.max(0, Math.ceil(remainingHours / 6)); // Assuming a meal every 6 hours
  const sleepMinutes = Math.max(0, Math.floor((timeLeft / 1000) / 10)); // Humorous value

  const Counter = ({ icon: Icon, value, label }: { icon: React.ElementType, value: number, label: string }) => (
    <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg shadow-sm w-32">
      <Icon className="h-8 w-8 text-primary" />
      <span className="text-3xl font-bold font-headline text-foreground mt-2">
        {isHadal ? '??' : value}
      </span>
      <span className="text-xs text-foreground/70">{isHadal ? '???' : label}</span>
    </div>
  );

  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Counter icon={Coffee} value={coffeeCups} label="כוסות קפה" />
      <Counter icon={Utensils} value={meals} label="פריסות" />
      <Counter icon={BedDouble} value={sleepMinutes} label="דקות שינה" />
    </div>
  );
};

export default UnitCounters;

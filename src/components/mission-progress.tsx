'use client';

import { Progress } from '@/components/ui/progress';

interface MissionProgressProps {
  progress: number;
}

const MissionProgress: React.FC<MissionProgressProps> = ({ progress }) => {
  return (
    <div className="w-full px-4">
      <Progress value={progress} className="h-4 bg-primary-foreground/20 [&>*]:bg-accent" />
      <div className="flex justify-between text-xs text-foreground/70 mt-1">
        <span>0%</span>
        <span className="font-headline">Mission Progress: {Math.floor(progress)}%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

export default MissionProgress;

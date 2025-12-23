'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Bomb, Waves, Zap, AudioLines } from 'lucide-react';
import { cn } from '@/lib/utils';
import HelmetIcon from './icons/helmet-icon';
import DuffelBagIcon from './icons/duffel-bag-icon';

interface StressReliefZoneProps {
  className?: string;
  onGetawayChange: (active: boolean) => void;
  onHadalChange: (active: boolean) => void;
}

const Particle = ({ onAnimationEnd, emoji }: { onAnimationEnd: () => void; emoji: string }) => {
  const style = {
    left: '50%',
    top: '50%',
    position: 'absolute',
    fontSize: '2rem',
    animation: `fly-out ${1 + Math.random()}s ease-out forwards`,
  } as const;

  return <div style={style} onAnimationEnd={onAnimationEnd}>{emoji}</div>;
};

const StressReliefZone: React.FC<StressReliefZoneProps> = ({ className, onGetawayChange, onHadalChange }) => {
  const [particles, setParticles] = useState<number[]>([]);
  const [isHadalActive, setIsHadalActive] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout>();

  const handleDischarge = () => {
    setParticles(prev => [...prev, Date.now()]);
  };
  
  const handleParticleEnd = (id: number) => {
    setParticles(prev => prev.filter(pId => pId !== id));
  };

  const handleHadalToggle = () => {
    const newHadalState = !isHadalActive;
    setIsHadalActive(newHadalState);
    onHadalChange(newHadalState);
  };

  const handleGetawayPress = () => {
    longPressTimer.current = setTimeout(() => {
      onGetawayChange(true);
    }, 1000);
  };
  
  const handleGetawayRelease = () => {
    clearTimeout(longPressTimer.current);
    onGetawayChange(false);
  };

  const EMOJIS = [<HelmetIcon key="h" className="w-8 h-8 text-primary"/>, <DuffelBagIcon key="d" className="w-8 h-8 text-primary"/>];

  return (
    <div className={cn('glass-card p-6 text-center', className)}>
       <style jsx global>{`
        @keyframes fly-out {
          from {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          to {
            transform: translate(calc(-50% + ${Math.random() * 400 - 200}px), calc(-50% + ${Math.random() * 400 - 200}px)) scale(0) rotate(${Math.random() * 720 - 360}deg);
            opacity: 0;
          }
        }
      `}</style>
      <h3 className="font-headline text-2xl text-primary font-bold mb-4">אזור פורקן מתחים</h3>
      <div className="relative space-y-4">
        {particles.map((id) => (
          <Particle key={id} onAnimationEnd={() => handleParticleEnd(id)} emoji={EMOJIS[id % EMOJIS.length]} />
        ))}
        <Button onClick={handleDischarge} className="w-full glow-on-hover">
          <Bomb className="mr-2 h-4 w-4" />
          הזדכות
        </Button>
        <Button
          onClick={handleHadalToggle}
          variant={isHadalActive ? "destructive" : "default"}
          className="w-full glow-on-hover"
        >
          {isHadalActive ? <AudioLines className="mr-2 h-4 w-4"/> : <Zap className="mr-2 h-4 w-4" />}
          {isHadalActive ? 'בטל "חדל"' : 'חדל'}
        </Button>
        <Button
          onMouseDown={handleGetawayPress}
          onMouseUp={handleGetawayRelease}
          onTouchStart={handleGetawayPress}
          onTouchEnd={handleGetawayRelease}
          className="w-full glow-on-hover"
        >
          <Waves className="mr-2 h-4 w-4" />
          התחפשנות (לחיצה ארוכה)
        </Button>
      </div>
    </div>
  );
};

export default StressReliefZone;

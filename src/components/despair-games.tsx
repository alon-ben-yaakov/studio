'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Hand, Repeat, Play, Timer } from 'lucide-react';

interface DespairGamesProps {
  className?: string;
}

const GAME_DURATION = 5; // 5 seconds

const DespairGames: React.FC<DespairGamesProps> = ({ className }) => {
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (gameState === 'playing' && timeLeft === 0) {
      setGameState('finished');
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [gameState, timeLeft]);

  const startGame = () => {
    setClicks(0);
    setTimeLeft(GAME_DURATION);
    setGameState('playing');
  };

  const handleDisciplineClick = () => {
    if (gameState === 'playing') {
      setClicks(prev => prev + 1);
    }
  };

  const renderContent = () => {
    switch (gameState) {
      case 'playing':
        return (
          <>
            <div className="absolute top-4 left-4 flex items-center gap-2 text-primary">
                <Timer className="h-5 w-5" />
                <span className="font-mono text-lg font-bold">{timeLeft}</span>
            </div>
             <div className="absolute top-4 right-4 text-primary font-bold text-lg">{clicks}</div>
            <h3 className="font-headline text-2xl text-primary font-bold mb-2">שבור שפצורים!</h3>
            <p className="text-foreground/80 mb-4">כמה מהר אתה יכול?</p>
            <Button onClick={handleDisciplineClick} className="w-full h-24 text-2xl animate-pulse">
                <Hand className="mr-4 h-8 w-8" />
                לחץ!
            </Button>
          </>
        );
      case 'finished':
        return (
          <>
            <h3 className="font-headline text-2xl text-primary font-bold">המשחק נגמר!</h3>
            <p className="text-foreground/80 mt-2 mb-4">
              שברת <span className="font-bold text-accent">{clicks}</span> שפצורים ב-{GAME_DURATION} שניות.
            </p>
             <p className="text-sm text-foreground/60 mb-4">
              {clicks > 25 ? "אתה מכונת ייאוש!" : "לא מספיק, נסה שוב!"}
            </p>
            <Button onClick={startGame} className="glow-on-hover">
              <Repeat className="mr-2 h-4 w-4" />
              שחק שוב
            </Button>
          </>
        );
      case 'idle':
      default:
        return (
          <>
            <h3 className="font-headline text-2xl text-center text-primary font-bold mb-4">משחקי ייאוש</h3>
            <p className="text-foreground/80 mb-4 text-center">מרגיש שהזמן לא זז? נסה את זה.</p>
            <Button onClick={startGame} className="w-full glow-on-hover">
              <Play className="mr-2 h-4 w-4" />
              התחל משחק "שבירת שפצורים"
            </Button>
          </>
        );
    }
  };

  return (
    <div className={cn('glass-card p-6 flex flex-col items-center justify-center text-center relative min-h-[250px]', className)}>
      {renderContent()}
    </div>
  );
};

export default DespairGames;

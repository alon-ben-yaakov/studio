'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Hand, Repeat, Play, Timer, Search, ThumbsDown, X } from 'lucide-react';
import HelmetIcon from './icons/helmet-icon';

interface DespairGamesProps {
  className?: string;
}

type Game = 'clicker' | 'find-sergeant' | null;

const CLICKER_GAME_DURATION = 5; // 5 seconds
const FIND_SERGEANT_GRID_SIZE = 4;

const DespairGames: React.FC<DespairGamesProps> = ({ className }) => {
  // Shared state
  const [activeGame, setActiveGame] = useState<Game>(null);
  
  // Clicker Game State
  const [clicks, setClicks] =useState(0);
  const [clickerTimeLeft, setClickerTimeLeft] = useState(CLICKER_GAME_DURATION);
  const [clickerGameState, setClickerGameState] = useState<'playing' | 'finished'>('playing');
  const clickerTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Find Sergeant Game State
  const [sergeantPosition, setSergeantPosition] = useState({ row: 0, col: 0 });
  const [found, setFound] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [clickedCells, setClickedCells] = useState<boolean[][]>([]);


  // Clicker Game Logic
  useEffect(() => {
    if (activeGame === 'clicker' && clickerGameState === 'playing' && clickerTimeLeft > 0) {
      clickerTimerRef.current = setTimeout(() => {
        setClickerTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (activeGame === 'clicker' && clickerGameState === 'playing' && clickerTimeLeft === 0) {
      setClickerGameState('finished');
      if (clickerTimerRef.current) {
        clearTimeout(clickerTimerRef.current);
      }
    }

    return () => {
      if (clickerTimerRef.current) {
        clearTimeout(clickerTimerRef.current);
      }
    };
  }, [activeGame, clickerGameState, clickerTimeLeft]);

  const startClickerGame = () => {
    setActiveGame('clicker');
    setClicks(0);
    setClickerTimeLeft(CLICKER_GAME_DURATION);
    setClickerGameState('playing');
  };

  const handleDisciplineClick = () => {
    if (clickerGameState === 'playing') {
      setClicks(prev => prev + 1);
    }
  };

  // Find Sergeant Game Logic
  const startFindSergeantGame = () => {
    setActiveGame('find-sergeant');
    resetFindSergeantGame();
  };
  
  const resetFindSergeantGame = () => {
    setFound(false);
    setAttempts(0);
    setSergeantPosition({
      row: Math.floor(Math.random() * FIND_SERGEANT_GRID_SIZE),
      col: Math.floor(Math.random() * FIND_SERGEANT_GRID_SIZE),
    });
    setClickedCells(
        Array.from({ length: FIND_SERGEANT_GRID_SIZE }, () =>
        Array(FIND_SERGEANT_GRID_SIZE).fill(false)
      )
    );
  };

  const handleGridClick = (row: number, col: number) => {
    if (found || clickedCells[row][col]) return;
    
    const newClickedCells = clickedCells.map(r => [...r]);
    newClickedCells[row][col] = true;
    setClickedCells(newClickedCells);

    setAttempts(prev => prev + 1);
    if (row === sergeantPosition.row && col === sergeantPosition.col) {
      setFound(true);
    }
  };

  const renderGameContent = () => {
    if (activeGame === 'clicker') {
      return renderClickerGame();
    }
    if (activeGame === 'find-sergeant') {
      return renderFindSergeantGame();
    }
    return renderGameMenu();
  };

  const renderClickerGame = () => {
    if (clickerGameState === 'playing') {
      return (
        <>
          <div className="absolute top-4 left-4 flex items-center gap-2 text-primary">
              <Timer className="h-5 w-5" />
              <span className="font-mono text-lg font-bold">{clickerTimeLeft}</span>
          </div>
          <div className="absolute top-4 right-4 text-primary font-bold text-lg">{clicks}</div>
          <h3 className="font-headline text-2xl text-primary font-bold mb-2">שבור שפצורים!</h3>
          <p className="text-foreground/80 mb-4">כמה מהר אתה יכול?</p>
          <Button onClick={handleDisciplineClick} className="w-full h-24 text-2xl animate-pulse">
              <Hand className="mr-4 h-8 w-8" />
              לחץ!
          </Button>
          <Button variant="link" size="sm" onClick={() => setActiveGame(null)} className="mt-4">חזור</Button>
        </>
      );
    }
    // Finished state
    return (
      <>
        <h3 className="font-headline text-2xl text-primary font-bold">המשחק נגמר!</h3>
        <p className="text-foreground/80 mt-2 mb-4">
          שברת <span className="font-bold text-primary">{clicks}</span> שפצורים ב-{CLICKER_GAME_DURATION} שניות.
        </p>
         <p className="text-sm text-foreground/60 mb-4">
          {clicks > 25 ? "אתה מכונת ייאוש!" : "לא מספיק, נסה שוב!"}
        </p>
        <div className="flex gap-2">
          <Button onClick={startClickerGame} className="glow-on-hover">
            <Repeat className="mr-2 h-4 w-4" />
            שחק שוב
          </Button>
          <Button variant="outline" onClick={() => setActiveGame(null)}>חזור</Button>
        </div>
      </>
    );
  };
  
  const renderFindSergeantGame = () => {
    return (
      <>
        <h3 className="font-headline text-2xl text-primary font-bold mb-2">איפה הרס"ר?</h3>
        <p className="text-foreground/80 mb-4 text-center">
          {found ? `מצאת אותו ב-${attempts} ניסיונות!` : `הוא מסתתר... מצא אותו.`}
        </p>
        <div className={`grid gap-2 mb-4`} style={{gridTemplateColumns: `repeat(${FIND_SERGEANT_GRID_SIZE}, 1fr)`}}>
          {Array.from({ length: FIND_SERGEANT_GRID_SIZE * FIND_SERGEANT_GRID_SIZE }).map((_, index) => {
            const row = Math.floor(index / FIND_SERGEANT_GRID_SIZE);
            const col = index % FIND_SERGEANT_GRID_SIZE;
            const isSergeant = row === sergeantPosition.row && col === sergeantPosition.col;
            const isClicked = clickedCells[row]?.[col] ?? false;

            return (
              <Button
                key={index}
                variant="outline"
                className="w-12 h-12 p-0"
                onClick={() => handleGridClick(row, col)}
                disabled={isClicked}
              >
                {isClicked && isSergeant ? (
                  <HelmetIcon className="w-8 h-8 text-destructive animate-bounce" />
                ) : isClicked ? (
                   <X className="w-6 h-6 text-foreground/30" />
                ) : (
                  <ThumbsDown className="w-6 h-6 text-foreground/30" />
                )}
              </Button>
            );
          })}
        </div>
        {found && (
          <div className="flex gap-2 animate-in fade-in">
            <Button onClick={resetFindSergeantGame} className="glow-on-hover">
              <Repeat className="mr-2 h-4 w-4" />
              שחק שוב
            </Button>
             <Button variant="outline" onClick={() => setActiveGame(null)}>חזור</Button>
          </div>
        )}
      </>
    );
  };

  const renderGameMenu = () => {
    return (
      <>
        <h3 className="font-headline text-2xl text-center text-primary font-bold mb-4">משחקי ייאוש</h3>
        <p className="text-foreground/80 mb-4 text-center">מרגיש שהזמן לא זז? נסה את זה.</p>
        <div className="flex flex-col gap-2 w-full">
          <Button onClick={startClickerGame} className="w-full glow-on-hover">
            <Play className="mr-2 h-4 w-4" />
            התחל "שבירת שפצורים"
          </Button>
          <Button onClick={startFindSergeantGame} className="w-full glow-on-hover">
            <Search className="mr-2 h-4 w-4" />
             התחל "מצא את הרס"ר"
          </Button>
        </div>
      </>
    );
  }


  return (
    <div className={cn('glass-card p-6 flex flex-col items-center justify-center text-center relative min-h-[300px]', className)}>
      {renderGameContent()}
    </div>
  );
};

export default DespairGames;

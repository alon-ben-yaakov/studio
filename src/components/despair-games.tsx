'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Hand, Repeat, Play, Timer, Search, ThumbsDown, X, Trophy } from 'lucide-react';
import HelmetIcon from './icons/helmet-icon';
import { useUser } from '@/firebase/auth/use-user';
import { addScore } from '@/firebase/firestore/scores';
import { useFirestore } from '@/firebase';
import { Input } from './ui/input';
import { useForm, SubmitHandler } from "react-hook-form";
import Leaderboard from './leaderboard';

interface DespairGamesProps {
  className?: string;
}

type Game = 'clicker' | 'find-sergeant' | null;
type GameState = 'menu' | 'playing' | 'finished';

const CLICKER_GAME_DURATION = 5;
const FIND_SERGEANT_GRID_SIZE = 4;

type Inputs = {
  name: string,
};

const DespairGames: React.FC<DespairGamesProps> = ({ className }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const user = useUser();
  const firestore = useFirestore();

  const [activeGame, setActiveGame] = useState<Game>(null);
  const [gameState, setGameState] = useState<GameState>('menu');

  // Clicker Game State
  const [clicks, setClicks] = useState(0);
  const [clickerTimeLeft, setClickerTimeLeft] = useState(CLICKER_GAME_DURATION);
  const clickerTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Find Sergeant Game State
  const [sergeantPosition, setSergeantPosition] = useState({ row: 0, col: 0 });
  const [found, setFound] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [clickedCells, setClickedCells] = useState<boolean[][]>([]);
  const [viewLeaderboard, setViewLeaderboard] = useState(false);

  useEffect(() => {
    if (activeGame === 'clicker' && gameState === 'playing' && clickerTimeLeft > 0) {
      clickerTimerRef.current = setTimeout(() => {
        setClickerTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (activeGame === 'clicker' && gameState === 'playing' && clickerTimeLeft === 0) {
      setGameState('finished');
      if (clickerTimerRef.current) {
        clearTimeout(clickerTimerRef.current);
      }
    }

    return () => {
      if (clickerTimerRef.current) {
        clearTimeout(clickerTimerRef.current);
      }
    };
  }, [activeGame, gameState, clickerTimeLeft]);

  const startClickerGame = () => {
    setActiveGame('clicker');
    setClicks(0);
    setClickerTimeLeft(CLICKER_GAME_DURATION);
    setGameState('playing');
    setViewLeaderboard(false);
  };

  const handleDisciplineClick = () => {
    if (gameState === 'playing') {
      setClicks(prev => prev + 1);
    }
  };

  const startFindSergeantGame = () => {
    setActiveGame('find-sergeant');
    resetFindSergeantGame();
    setViewLeaderboard(false);
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
    setGameState('playing');
  };

  const handleGridClick = (row: number, col: number) => {
    if (found || clickedCells[row][col]) return;

    const newClickedCells = clickedCells.map(r => [...r]);
    newClickedCells[row][col] = true;
    setClickedCells(newClickedCells);

    setAttempts(prev => prev + 1);
    if (row === sergeantPosition.row && col === sergeantPosition.col) {
      setFound(true);
      setGameState('finished');
    }
  };

  const onNameSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!user || !firestore || activeGame !== 'clicker') return;
    
    const score = clicks;
    const gameName = 'שבירת שפצורים';

    try {
      await addScore(firestore, {
        name: data.name,
        score: score,
        game: gameName,
        userId: user.uid,
        createdAt: new Date(),
      });
      setViewLeaderboard(true); // Show leaderboard after submitting
      setGameState('menu');
      setActiveGame(null);

    } catch (error) {
      console.error("Error adding score: ", error);
    }
  };

  const renderGameContent = () => {
    if (viewLeaderboard) {
        return (
            <>
                <Leaderboard />
                <Button variant="link" size="sm" onClick={() => { setViewLeaderboard(false); setGameState('menu'); }} className="mt-4">חזור למשחקים</Button>
            </>
        );
    }
    
    if (gameState === 'menu') {
        return renderGameMenu();
    }

    if (activeGame === 'clicker') {
      return renderClickerGame();
    }
    if (activeGame === 'find-sergeant') {
      return renderFindSergeantGame();
    }
    return renderGameMenu();
  };

  const renderGameMenu = () => (
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
        <Button onClick={() => setViewLeaderboard(true)} variant="outline" className="w-full mt-4">
             <Trophy className="mr-2 h-4 w-4" />
            טבלת שיאים
        </Button>
      </div>
    </>
  );

  const renderClickerFinishScreen = () => (
     <>
      <h3 className="font-headline text-2xl text-primary font-bold">המשחק נגמר!</h3>
      <p className="text-foreground/80 mt-2 mb-4">
        {`שברת ${clicks} שפצורים ב-${CLICKER_GAME_DURATION} שניות.`}
      </p>
      <form onSubmit={handleSubmit(onNameSubmit)} className="w-full space-y-4">
        <Input {...register("name", { required: true, maxLength: 15 })} placeholder="הכנס שם לטבלת השיאים" className="text-center" />
        {errors.name && <p className="text-destructive text-sm">צריך להכניס שם (עד 15 תווים).</p>}
        <Button type="submit" className="w-full">שמור תוצאה</Button>
      </form>
       <div className="flex gap-2 mt-4">
          <Button onClick={startClickerGame} className="glow-on-hover">
            <Repeat className="mr-2 h-4 w-4" />
            שחק שוב
          </Button>
          <Button variant="outline" onClick={() => { setGameState('menu'); setActiveGame(null); }}>חזור</Button>
        </div>
    </>
  );
  
  const renderSergeantFinishScreen = () => (
     <>
      <h3 className="font-headline text-2xl text-primary font-bold">כל הכבוד!</h3>
      <p className="text-foreground/80 mt-2 mb-4">
        {`מצאת את הרס"ר ב-${attempts} ניסיונות!`}
      </p>
       <div className="flex gap-2 mt-4">
          <Button onClick={resetFindSergeantGame} className="glow-on-hover">
            <Repeat className="mr-2 h-4 w-4" />
            שחק שוב
          </Button>
          <Button variant="outline" onClick={() => { setGameState('menu'); setActiveGame(null); }}>חזור</Button>
        </div>
    </>
  );


  const renderClickerGame = () => {
    if (gameState === 'playing') {
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
          <Button variant="link" size="sm" onClick={() => { setGameState('menu'); setActiveGame(null);}} className="mt-4">חזור</Button>
        </>
      );
    }
    // Finished state
    return renderClickerFinishScreen();
  };

  const renderFindSergeantGame = () => {
    if (gameState === 'playing') {
      return (
      <>
        <h3 className="font-headline text-2xl text-primary font-bold mb-2">איפה הרס"ר?</h3>
        <p className="text-foreground/80 mb-4 text-center">
          {found ? `מצאת אותו ב-${attempts} ניסיונות!` : `הוא מסתתר... מצא אותו. (${attempts} ניסיונות)`}
        </p>
        <div className={`grid gap-2 mb-4`} style={{ gridTemplateColumns: `repeat(${FIND_SERGEANT_GRID_SIZE}, 1fr)` }}>
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
                disabled={found || isClicked}
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
         <Button variant="link" size="sm" onClick={() => { setGameState('menu'); setActiveGame(null); }}>חזור</Button>
        </>
      );
    }
     // Finished state
    return renderSergeantFinishScreen();
  };

  return (
    <div className={cn('glass-card p-6 flex flex-col items-center justify-center text-center relative min-h-[350px]', className)}>
      {renderGameContent()}
    </div>
  );
};

export default DespairGames;

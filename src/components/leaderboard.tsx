'use client';

import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const Leaderboard = () => {
  const firestore = useFirestore();

  const scoresQuery = useMemo(() => {
    if (!firestore) return null;
    // We can query for a specific game, but for now let's show all scores
    return query(
        collection(firestore, 'scores'),
        orderBy('score', 'desc'),
        limit(10)
    );
  }, [firestore]);

  const { data: scores, loading } = useCollection(scoresQuery);

  return (
    <div className="w-full">
      <h3 className="font-headline text-2xl text-primary font-bold mb-4 flex items-center justify-center gap-2">
        <Trophy className="w-6 h-6 text-accent" />
        טבלת שיאים
      </h3>
      <div className="max-h-60 overflow-y-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">שם</TableHead>
              <TableHead className="text-center">משחק</TableHead>
              <TableHead className="text-center">ניקוד</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                </TableRow>
            ))}
            {!loading && scores?.map((score, index) => (
              <TableRow key={score.id} className={index === 0 ? 'bg-accent/20' : ''}>
                <TableCell className="font-medium text-right">{score.name}</TableCell>
                <TableCell className="text-center">{score.game}</TableCell>
                <TableCell className="text-center font-bold">{score.score}</TableCell>
              </TableRow>
            ))}
             {!loading && scores?.length === 0 && (
                <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                        אין עדיין שיאים. שחק כדי להיות הראשון!
                    </TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Leaderboard;

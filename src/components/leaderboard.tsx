'use client';

import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Medal, Trophy } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


const GameLeaderboard = ({ gameName }: { gameName: string }) => {
    const firestore = useFirestore();

    const scoresQuery = useMemo(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, 'scores'),
            where('game', '==', gameName),
            orderBy('score', 'desc'),
            limit(10)
        );
    }, [firestore, gameName]);

    const { data: scores, loading } = useCollection(scoresQuery);
    
    const getMedal = (index: number) => {
        if (index === 0) return <Medal className="w-5 h-5 text-yellow-500" />;
        if (index === 1) return <Medal className="w-5 h-5 text-slate-400" />;
        if (index === 2) return <Medal className="w-5 h-5 text-amber-700" />;
        return <span className="w-5 text-sm font-mono">{index + 1}</span>;
    }

    return (
        <div className="max-h-60 overflow-y-auto rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-10 text-center">דירוג</TableHead>
                        <TableHead className="text-right">שם</TableHead>
                        <TableHead className="text-center">ניקוד</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading && Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-4 mx-auto" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                        </TableRow>
                    ))}
                    {!loading && scores?.map((score, index) => (
                        <TableRow key={score.id} className={index < 3 ? 'font-bold' : ''}>
                           <TableCell className="text-center">
                             <div className="flex items-center justify-center">
                                {getMedal(index)}
                             </div>
                           </TableCell>
                            <TableCell className="text-right">{score.name}</TableCell>
                            <TableCell className="text-center">{score.score}</TableCell>
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
    )
}

const Leaderboard = () => {
    const games = ['שבירת שפצורים', 'ניקיון שירותים'];

    return (
        <div className="w-full">
            <h3 className="font-headline text-2xl text-primary font-bold mb-4 flex items-center justify-center gap-2">
                <Trophy className="w-6 h-6 text-accent" />
                טבלת שיאים
            </h3>
            <Tabs defaultValue={games[0]} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                   {games.map(game => (
                     <TabsTrigger key={game} value={game}>{game}</TabsTrigger>
                   ))}
                </TabsList>
                 {games.map(game => (
                    <TabsContent key={game} value={game}>
                        <GameLeaderboard gameName={game} />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
};

export default Leaderboard;

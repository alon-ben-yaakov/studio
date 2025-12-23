'use client';

import { useState, useEffect, useRef } from 'react';
import { useCountdown } from '@/hooks/use-countdown';
import CountdownClock from '@/components/countdown-clock';
import UnitCounters from '@/components/unit-counters';
import MissionProgress from '@/components/mission-progress';
import StressReliefZone from '@/components/stress-relief-zone';
import ExcuseGenerator from '@/components/excuse-generator';
import DespairGames from '@/components/despair-games';
import GrandFinale from '@/components/grand-finale';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { AutoFilter, Noise, Synth } from 'tone';

export default function Home() {
  const { timeLeft, hours, minutes, seconds, progress } = useCountdown();
  const [isGetaway, setIsGetaway] = useState(false);
  const [isHadal, setIsHadal] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const getawaySound = useRef<{ filter: AutoFilter, noise: Noise } | null>(null);
  const hadalSynth = useRef<Synth | null>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Lazy load Tone.js and initialize audio components
    import('tone').then(Tone => {
      const noise = new Tone.Noise("pink");
      const filter = new Tone.AutoFilter({
        frequency: 0.5,
        depth: 0.8,
        baseFrequency: 400,
        octaves: 4,
      }).toDestination();
      noise.connect(filter);
      getawaySound.current = { filter, noise };
      
      hadalSynth.current = new Tone.Synth().toDestination();
    });

    return () => {
      getawaySound.current?.noise.dispose();
      getawaySound.current?.filter.dispose();
      hadalSynth.current?.dispose();
    };
  }, []);

  const getawayImage = PlaceHolderImages.find(img => img.id === 'getaway-background');
  
  const handleGetawayChange = (active: boolean) => {
    setIsGetaway(active);
    if (active) {
      getawaySound.current?.noise.start();
      getawaySound.current?.filter.start();
    } else {
      getawaySound.current?.filter.stop();
      getawaySound.current?.noise.stop();
    }
  };

  const handleHadalChange = (active: boolean) => {
    setIsHadal(active);
    if (active) {
      hadalSynth.current?.triggerAttackRelease("C5", "8n");
    }
  };
  
  if (!isClient) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const isFinished = timeLeft <= 0;

  return (
    <div className={isGetaway ? 'getaway-active' : ''}>
      <style jsx global>{`
        .getaway-active {
          background-image: url(${getawayImage?.imageUrl || ''}) !important;
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }
      `}</style>
      <main className={`relative min-h-screen p-4 sm:p-8 transition-all duration-1000 ${isGetaway ? 'opacity-0' : 'opacity-100'}`}>
        {isFinished && <GrandFinale />}
        
        <div className={`mx-auto max-w-7xl space-y-8 transition-filter duration-500 ${isFinished ? 'blur-sm pointer-events-none' : ''}`}>
          <header className="text-center">
            <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-bold text-primary-foreground bg-primary/80 inline-block px-6 py-2 rounded-lg shadow-xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              {isHadal ? '?????' : '48 שעות לחדל'}
            </h1>
            <p className="text-foreground/80 mt-4 text-lg">
              {isHadal ? '???? ?????? ????? ??????' : 'הספירה לאחור לחופש'}
            </p>
          </header>

          <section className="glass-card p-4 sm:p-6 text-center space-y-6">
             <CountdownClock hours={hours} minutes={minutes} seconds={seconds} isHadal={isHadal} />
             <UnitCounters timeLeft={timeLeft} isHadal={isHadal} />
             <MissionProgress progress={progress} />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ExcuseGenerator className="lg:col-span-1" isHadal={isHadal} />
            <StressReliefZone className="lg:col-span-1" onGetawayChange={handleGetawayChange} onHadalChange={handleHadalChange} />
            <DespairGames className="lg:col-span-1" />
          </div>
        </div>
      </main>
      
      {isGetaway && (
        <div className="fixed inset-0 flex items-center justify-center z-10 p-4">
          <div className="text-center text-white bg-black/60 p-8 rounded-2xl backdrop-blur-sm shadow-2xl">
            <h2 className="font-headline text-5xl sm:text-7xl">מתחפשן...</h2>
            <p className="mt-2 text-lg">תאילנד קוראת לי</p>
          </div>
        </div>
      )}
    </div>
  );
}

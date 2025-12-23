'use client';

import { useEffect, useRef } from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import * as Tone from 'tone';

const ConfettiParticle = () => {
  const emojis = ['📜', '📄', '🎉', '🏆'];
  const style = {
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 3 + 2}s`,
    animationDelay: `${Math.random() * 2}s`,
    fontSize: `${Math.random() * 1.5 + 1}rem`,
  };
  return <div className="confetti-particle" style={style}>{emojis[Math.floor(Math.random() * emojis.length)]}</div>;
};

const GrandFinale = () => {
  const synth = useRef<Tone.PolySynth | null>(null);

  useEffect(() => {
    synth.current = new Tone.PolySynth(Tone.Synth).toDestination();
    const now = Tone.now();
    // Play a simple victory melody
    synth.current.triggerAttackRelease("C4", "8n", now);
    synth.current.triggerAttackRelease("E4", "8n", now + 0.2);
    synth.current.triggerAttackRelease("G4", "8n", now + 0.4);
    synth.current.triggerAttackRelease("C5", "4n", now + 0.6);
    
    return () => {
      synth.current?.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-1000">
      <style jsx global>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotateZ(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotateZ(720deg); opacity: 0; }
        }
        .confetti-particle {
          position: absolute;
          top: 0;
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
      <div className="relative w-full h-full overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <ConfettiParticle key={i} />
        ))}
      </div>
      <div className="absolute text-center text-white p-4">
        <ShieldCheck className="mx-auto h-24 w-24 text-accent animate-pulse" />
        <h1 className="font-headline text-5xl md:text-8xl mt-4" style={{ textShadow: '0 0 20px hsl(var(--accent))' }}>
          אזרח! השתחררת!
        </h1>
        <p className="text-xl md:text-2xl mt-2 text-white/80">(זמנית, כן?)</p>
      </div>
    </div>
  );
};

export default GrandFinale;

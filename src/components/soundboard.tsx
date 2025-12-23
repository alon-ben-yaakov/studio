'use client';

import { useRef, useEffect } from 'react';
import type { Noise, Player, Synth } from 'tone';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Phone, Utensils, FileSignature, Radio } from 'lucide-react';

interface SoundboardProps {
  className?: string;
}

const sounds = [
  { id: 'tuna', label: 'מי גמר את הטונה?', icon: Utensils },
  { id: 'permit', label: 'יש אישור יציאה?', icon: FileSignature },
  { id: 'signed', label: 'תביא חתום', icon: Phone },
  { id: 'static', label: 'רעש קשר', icon: Radio },
];

const Soundboard: React.FC<SoundboardProps> = ({ className }) => {
  const audioRefs = useRef<Record<string, Synth | Noise | Player>>({});

  useEffect(() => {
    // Lazy load Tone.js
    import('tone').then(Tone => {
      audioRefs.current['tuna'] = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.2 } }).toDestination();
      audioRefs.current['permit'] = new Tone.Synth({ oscillator: { type: 'square' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.1 } }).toDestination();
      audioRefs.current['signed'] = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 }, volume: -10 }).toDestination();
      audioRefs.current['static'] = new Tone.Noise('white').toDestination();
    });

    return () => {
      Object.values(audioRefs.current).forEach(audio => audio.dispose());
    };
  }, []);

  const playSound = (id: string) => {
    const audio = audioRefs.current[id];
    if (!audio) return;

    if (id === 'tuna' && audio instanceof Tone.Synth) {
      audio.triggerAttackRelease('C4', '8n');
    } else if (id === 'permit' && audio instanceof Tone.Synth) {
      audio.triggerAttackRelease('G4', '16n');
    } else if (id === 'signed' && audio instanceof Tone.Synth) {
      audio.triggerAttackRelease('E4', '4n');
    } else if (id === 'static' && audio instanceof Tone.Noise) {
      audio.start().stop('+0.2');
    }
  };

  return (
    <div className={cn('glass-card p-6', className)}>
      <h3 className="font-headline text-2xl text-center text-primary font-bold mb-4">לוח סאונדים</h3>
      <div className="grid grid-cols-2 gap-4">
        {sounds.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            onClick={() => playSound(id)}
            variant="secondary"
            className="flex flex-col h-24 items-center justify-center p-2 text-center glow-on-hover bg-primary/80 hover:bg-primary text-primary-foreground"
          >
            <Icon className="h-8 w-8 mb-2" />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Soundboard;

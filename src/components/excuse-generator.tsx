'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { generateMiluimExcuse } from '@/ai/flows/generate-miluim-excuse';
import { Wand2 } from 'lucide-react';
import HelmetIcon from './icons/helmet-icon';

interface ExcuseGeneratorProps {
  className?: string;
  isHadal: boolean;
}

const ExcuseGenerator: React.FC<ExcuseGeneratorProps> = ({ className, isHadal }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [excuse, setExcuse] = useState('');

  const handleGenerate = async () => {
    if (isLoading) return;
    setIsLoading(true);
    if (!isFlipped) {
      setIsFlipped(true);
    }
    try {
      const result = await generateMiluimExcuse({});
      setExcuse(result.excuse);
    } catch (error) {
      console.error(error);
      setExcuse('שגיאה... נסה שוב מאוחר יותר.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('w-full h-full min-h-[250px] [perspective:1000px]', className)}>
      <div
        className={cn('relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]', {
          '[transform:rotateY(180deg)]': isFlipped,
        })}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full [backface-visibility:hidden]">
          <div className="glass-card flex flex-col items-center justify-center p-6 text-center h-full">
            <h3 className="font-headline text-2xl text-primary font-bold">מחולל התירוצים</h3>
            <p className="text-foreground/80 mt-2 mb-4">
              {isHadal ? '?????? ?????? ????? ??????' : 'צריך להתחמק ממשימה? לחץ על הכפתור'}
            </p>
            <Button onClick={handleGenerate} disabled={isLoading} className="glow-on-hover">
              {isLoading ? (
                <Wand2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              {isHadal ? '???' : 'ייצור תירוץ'}
            </Button>
          </div>
        </div>

        {/* Back of the card */}
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="glass-card flex flex-col items-center justify-center p-6 text-center h-full">
             <div className="absolute top-4 right-4">
                <HelmetIcon className="w-8 h-8 text-primary/30" />
            </div>
            <h3 className="font-headline text-2xl text-primary mb-4">התירוץ שלך:</h3>
            {isLoading ? (
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />
            ) : (
              <p className="text-xl font-medium text-foreground text-center animate-in fade-in duration-500">
                "{isHadal ? '????????' : excuse}"
              </p>
            )}
            <Button onClick={handleGenerate} disabled={isLoading} variant="outline" className="mt-6">
               {isLoading ? (
                <Wand2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              {isHadal ? '???' : 'נסה שוב'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcuseGenerator;

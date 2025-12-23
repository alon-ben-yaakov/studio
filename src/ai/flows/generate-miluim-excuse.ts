'use server';

/**
 * @fileOverview Excuse generator for soldiers in their final 48 hours of reserve duty.
 *
 * - generateMiluimExcuse - A function that generates a random excuse.
 * - GenerateMiluimExcuseInput - The input type for the generateMiluimExcuse function (currently empty).
 * - GenerateMiluimExcuseOutput - The return type for the generateMiluimExcuse function (contains the excuse).
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateMiluimExcuseInputSchema = z.object({});
export type GenerateMiluimExcuseInput = z.infer<typeof GenerateMiluimExcuseInputSchema>;

const GenerateMiluimExcuseOutputSchema = z.object({
  excuse: z.string().describe('A plausible and funny excuse for a soldier to avoid a task.'),
});
export type GenerateMiluimExcuseOutput = z.infer<typeof GenerateMiluimExcuseOutputSchema>;

export async function generateMiluimExcuse(input: GenerateMiluimExcuseInput): Promise<GenerateMiluimExcuseOutput> {
  return generateMiluimExcuseFlow(input);
}

const generateMiluimExcuseFlow = ai.defineFlow(
  {
    name: 'generateMiluimExcuseFlow',
    inputSchema: GenerateMiluimExcuseInputSchema,
    outputSchema: GenerateMiluimExcuseOutputSchema,
  },
  async () => {
    const excuses = [
        "אמא שלי מופיע בטקס",
        "יש לי מעבדה ברביעי",
        "אני צריך לבנות מיטת קומותיים",
        "פקאוולה",
        "חברה שלי מבואסת אני חייב ללכת הביתה"
      ];
    const randomIndex = Math.floor(Math.random() * excuses.length);
    const excuse = excuses[randomIndex];
    return { excuse };
  }
);

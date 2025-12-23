'use server';

/**
 * @fileOverview Excuse generator for soldiers in their final 48 hours of reserve duty.
 *
 * - generateMiluimExcuse - A function that generates a random excuse.
 * - GenerateMiluimExcuseInput - The input type for the generateMiluimExcuse function (currently empty).
 * - GenerateMiluimExcuseOutput - The return type for the generateMiluimExcuse function (contains the excuse).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMiluimExcuseInputSchema = z.object({});
export type GenerateMiluimExcuseInput = z.infer<typeof GenerateMiluimExcuseInputSchema>;

const GenerateMiluimExcuseOutputSchema = z.object({
  excuse: z.string().describe('A plausible excuse for a soldier to avoid a task.'),
});
export type GenerateMiluimExcuseOutput = z.infer<typeof GenerateMiluimExcuseOutputSchema>;

export async function generateMiluimExcuse(input: GenerateMiluimExcuseInput): Promise<GenerateMiluimExcuseOutput> {
  return generateMiluimExcuseFlow(input);
}

const excuseGeneratorTool = ai.defineTool({
  name: 'excuseGenerator',
  description: 'Generates a plausible excuse for a soldier to avoid a task during reserve duty.',
  inputSchema: z.object({}),
  outputSchema: z.string(),
},
async () => {
  const excuses = [
    'I am currently on a phone call with the kapsit.',
    'My shoelace broke, and I am waiting for the quartermaster.',
    'I have a sudden migraine and need to rest for a bit.',
    'I am helping a comrade with an urgent task.',
    'I need to fill out טופס 55 immediately.',
    'I am waiting for אישור יציאה.',
  ];

  const randomIndex = Math.floor(Math.random() * excuses.length);
  return excuses[randomIndex];
});

const generateMiluimExcusePrompt = ai.definePrompt({
  name: 'generateMiluimExcusePrompt',
  tools: [excuseGeneratorTool],
  input: {schema: GenerateMiluimExcuseInputSchema},
  output: {schema: GenerateMiluimExcuseOutputSchema},
  prompt: `You are a helpful assistant that generates a random excuse for a soldier to avoid last minute tasks. Use the excuseGenerator tool to generate the excuse and return it to the user.`,
});

const generateMiluimExcuseFlow = ai.defineFlow(
  {
    name: 'generateMiluimExcuseFlow',
    inputSchema: GenerateMiluimExcuseInputSchema,
    outputSchema: GenerateMiluimExcuseOutputSchema,
  },
  async input => {
    const { excuse } = await excuseGeneratorTool(input);
    return { excuse };
  }
);

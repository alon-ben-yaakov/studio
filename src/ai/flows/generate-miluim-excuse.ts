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
        "אני בשיחה עם הקפסיט.",
        "השרוך שלי נקרע, אני מחכה לרס\"פ.",
        "יש לי מיגרנה פתאומית, צריך לנוח.",
        "אני עוזר לחבר במשימה דחופה.",
        "אני צריך למלא טופס 55 באופן מיידי.",
        "אני מחכה לאישור יציאה.",
        "אמרו לי להיות בכוננות למקרה שהרמטכ\"ל יתקשר.",
        "הלכתי לאיבוד בדרך לשק\"ם.",
        "בדיוק קיבלתי פקודה סודית מהשב\"כ, לא יכול לדבר.",
        "הנעל הצבאית שלי לוחצת, אני חייב לראות חובש.",
        "אני אחראי על מורל היחידה, כרגע אני מארגן ערב קריוקי.",
        "האפוד הקרמי שלי כבד מדי היום.",
        "אני בתרגול \"יבש\" של פינוי פצועים דמיוניים.",
        "המפקד אמר לי לשמור על הנשקייה... בעיניים עצומות.",
        "אני חייב לעשות ביקורת תקינות למכונת קפה.",
        "קיבלתי פטור מיוחד ממחשבות על תורנויות.",
        "אני בדרך להרצאה על חשיבות השינה בצבא.",
        "השעון שלי לא מסונכרן עם שעון המשימות, אני בדרך לסנכרון.",
        "הכלב של מפקד הבסיס ברח, אני בצוות חיפוש.",
        "אני צריך להחזיר ציוד אישי מלפני שנתיים.",
        "התנדבתי להיות בודק הטעם של ארוחת הצהריים.",
        "אני מכין מצגת על ההיסטוריה של המילואים.",
        "אני חייב להשקות את העציץ של המפקדת.",
        "אני מחכה לתשובה מהרב הצבאי לגבי כשרות הטונה.",
        "התבקשתי לבדוק אם יש אינטרנט אלחוטי בבונקר.",
        "אני צריך לעבור השתלמות על איך לקפל שק שינה.",
        "נקראתי בדחיפות למשרד של מפקד הטייסת.",
        "אני בעיצומה של מדיטציה טרנסנדנטלית.",
        "איבדתי את הדיסקית, אני חייב למצוא אותה.",
        "אני בדרך לחתום על נשק שלא קיים.",
        "הודיעו לי שאני צריך להיות נהג תורן מחר.",
        "אני צריך להכין את עצמי נפשית למסדר סיום.",
        "אני מתאם משלוח פיצה לכל היחידה.",
        "הלכתי לבדוק מה מצב הרוח של הגנרטור.",
        "אני כותב שיר הלל למילואימניקים.",
        "הייתי צריך להחליף בטרייה בשלט של המזגן.",
        "אני מחפש את טופס היציאה שלי משנת 2008.",
        "הקצין ת\"ש ביקש ממני עזרה אישית.",
        "אני בודק אם השאירו לי משהו מהארוחת בוקר.",
        "אני באמצע שיחת ועידה עם המשפחה.",
        "אני אחראי על מלאי הקפה במטבחון.",
        "אני חייב להתכונן למבחן כושר גופני פתע.",
        "אני צריך לעדכן את פרטי החירום שלי.",
        "אני מעביר סדנת יצירה עם אצטרובלים.",
        "הקומקום החשמלי התקלקל, אני מנסה לתקן.",
        "אני בודק את תאריך התפוגה של כל המנות קרב.",
        "התבקשתי להדריך קבוצת תיירים בבסיס.",
        "אני ממלא דוח על חוסר בשעות שינה.",
        "אני צריך לתלות שלט \"נא לא להפריע\" על הדלת שלי.",
        "אני כותב את ספר הנהלים החדש של היחידה."
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
    // Directly call the tool to get an excuse.
    const excuse = await excuseGeneratorTool();
    return { excuse };
  }
);

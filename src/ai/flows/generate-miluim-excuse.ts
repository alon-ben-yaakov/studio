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
        "אני בשיחה עם הקפסיט. דחוף.",
        "השרוך שלי נקרע, אני בדרך לרס\"פ.",
        "תקפה אותי מיגרנה פתאומית, אני חייב לנוח כמה דקות.",
        "אני בדיוק עוזר לחבר במשימה סודית ביותר.",
        "אני צריך למלא טופס 55 באופן מיידי, זה עניין של חיים ומוות.",
        "אני מחכה לאישור יציאה מהרופא.",
        "אמרו לי להיות בכוננות למקרה שהרמטכ\"ל יתקשר באופן אישי.",
        "הלכתי לאיבוד בדרך לשק\"ם, אני חושב שאני במצרים.",
        "בדיוק קיבלתי פקודה סודית מהשב\"כ, אני לא יכול לדבר על זה.",
        "הנעל הצבאית שלי לוחצת, אני חושב שאיבדתי אצבע.",
        "אני אחראי על מורל היחידה, כרגע אני מארגן ערב קריוקי.",
        "האפוד הקרמי שלי כבד מדי היום, מרגיש כמו 100 קילו.",
        "אני בתרגול \"יבש\" של פינוי פצועים דמיוניים מהחטיבה.",
        "המפקד אמר לי לשמור על הנשקייה... בעיניים עצומות.",
        "אני חייב לעשות ביקורת תקינות דחופה למכונת קפה.",
        "קיבלתי פטור מיוחד ממחשבות על תורנויות מהפסיכולוג.",
        "אני בדרך להרצאה על חשיבות השינה בצבא, זה חובה.",
        "השעון שלי לא מסונכרן עם שעון המשימות, אני בדרך לסנכרון.",
        "הכלב של מפקד הבסיס ברח, אני בצוות חיפוש מיוחד.",
        "אני צריך להחזיר ציוד אישי מלפני שנתיים, זה דחוף.",
        "התנדבתי להיות בודק הטעם של ארוחת הצהריים, תפקיד קריטי.",
        "אני מכין מצגת על ההיסטוריה של המילואים, זה למורשת קרב.",
        "אני חייב להשקות את העציץ של המפקדת, הוא נראה עצוב.",
        "אני מחכה לתשובה מהרב הצבאי לגבי כשרות הטונה.",
        "התבקשתי לבדוק אם יש אינטרנט אלחוטי בבונקר, משימה לאומית.",
        "אני צריך לעבור השתלמות על איך לקפל שק שינה כמו שצריך.",
        "נקראתי בדחיפות למשרד של מפקד הטייסת, נראה לי אני מקודם.",
        "אני בעיצומה של מדיטציה טרנסנדנטלית להעלאת המורל.",
        "איבדתי את הדיסקית, אני חייב למצוא אותה לפני שאהיה עריק.",
        "אני בדרך לחתום על נשק שלא קיים, בירוקרטיה.",
        "הודיעו לי שאני צריך להיות נהג תורן מחר, אני מתכונן נפשית.",
        "אני צריך להכין את עצמי נפשית למסדר סיום, זה אירוע מרגש.",
        "אני מתאם משלוח פיצה לכל היחידה, זה ישפר את המורל.",
        "הלכתי לבדוק מה מצב הרוח של הגנרטור, הוא נשמע עצבני.",
        "אני כותב שיר הלל למילואימניקים, זה יושר בטקס הסיום.",
        "הייתי צריך להחליף בטרייה בשלט של המזגן, היה חם מדי.",
        "אני מחפש את טופס היציאה שלי משנת 2008, זה חשוב.",
        "הקצין ת\"ש ביקש ממני עזרה אישית, אני לא יכול לסרב.",
        "אני בודק אם השאירו לי משהו מהארוחת בוקר, אני רעב.",
        "אני באמצע שיחת ועידה עם המשפחה, הם דואגים.",
        "אני אחראי על מלאי הקפה במטבחון, זה תפקיד אסטרטגי.",
        "אני חייב להתכונן למבחן כושר גופני פתע, המפקד הודיע.",
        "אני צריך לעדכן את פרטי החירום שלי, זה נוהל חדש.",
        "אני מעביר סדנת יצירה עם אצטרובלים לחיילים החדשים.",
        "הקומקום החשמלי התקלקל, אני מנסה לתקן אותו, אני הנדימן.",
        "אני בודק את תאריך התפוגה של כל המנות קרב, למען הבריאות.",
        "התבקשתי להדריך קבוצת תיירים בבסיס, אני הפנים של צה\"ל.",
        "אני ממלא דוח על חוסר בשעות שינה, זה ישפיע על התפקוד.",
        "אני צריך לתלות שלט \"נא לא להפריע\" על הדלת שלי, אני עסוק.",
        "אני כותב את ספר הנהלים החדש של היחידה, אני היסטוריון."
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
    const excuse = await excuseGeneratorTool({});
    return { excuse };
  }
);

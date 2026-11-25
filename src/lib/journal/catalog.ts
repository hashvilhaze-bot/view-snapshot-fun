import type { Article } from "../content";
import type { PhotoKey } from "./photos";

export type JournalMeta = {
  cover: PhotoKey;
  minutes: number;
  photos: Record<string, PhotoKey>;
  related: string[];
  treks: string[];
};
export const journalArticles: Article[] = [
  {
    slug: "nepal-planning",
    title: "מתכננים טיול לנפאל? כל מה שצריך לדעת לפני הנסיעה",
    kicker: "מדריך מעשי",
    category: "תכנון והכנה",
    summary:
      "מתי כדאי להגיע, כמה זמן להקדיש לטיול, מה התקציב המתאים ואיזה ציוד באמת צריך? מדריך מעשי שיעזור לכם לתכנן נכון את הטיול בנפאל ולהגיע מוכנים.",
    body: [],
    journal: {
      cover: "village",
      minutes: 10,
      photos: { duration: "lake", altitude: "mountain" },
      related: ["nepal-close-up", "himalayas", "choosing-trek"],
      treks: ["everest-base-camp", "poon-hill"],
    },
  },
  {
    slug: "nepal-close-up",
    title: "נפאל מקרוב – האנשים, ההרים והחיים שביניהם",
    kicker: "כתבת מגזין",
    category: "תרבות וחוויות",
    summary:
      "שמונה מהפסגות הגבוהות בעולם, עשרות תרבויות ושפות, חגים צבעוניים, אוכל נהדר ואנשים שקשה לשכוח. בואו להכיר את נפאל שמאחורי הנופים המפורסמים שלה.",
    body: [],
    journal: {
      cover: "stupa",
      minutes: 8,
      photos: { landscape: "village", food: "meal" },
      related: ["nepal-planning", "himalayas", "culture-food"],
      treks: ["langtang-valley", "manaslu-circuit"],
    },
  },
  {
    slug: "himalayas",
    title: "ההימלאיה – רכס אחד, עולמות שונים",
    kicker: "מסע לאורך הרכס",
    category: "תרבות וחוויות",
    summary:
      "כ־2,500 קילומטרים של פסגות מושלגות, קרחונים, נהרות אדירים ועמקים נסתרים. מסע מפקיסטן והודו, דרך נפאל וטיבט ועד בהוטן, בעקבות הנופים, האנשים והתרבויות שהתפתחו בין ההרים הגבוהים בעולם.",
    body: [],
    journal: {
      cover: "mountain",
      minutes: 13,
      photos: { nepal: "village", "eastern-himalayas": "monastery" },
      related: ["nepal-close-up", "nepal-planning", "manaslu-vs-annapurna"],
      treks: ["annapurna-circuit", "everest-base-camp"],
    },
  },
];

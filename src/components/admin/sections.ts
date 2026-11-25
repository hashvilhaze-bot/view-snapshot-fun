export const adminSections = [
  { to: "/admin", name: "סקירה", section: "מערכת" },
  {
    to: "/admin/leads",
    name: "ניהול לידים",
    section: "פניות",
    description: "פניות שהתקבלו, שיוך למטפל ותאריכי מעקב.",
  },
  {
    to: "/admin/reports",
    name: "דוח המרות",
    section: "פניות",
    description: "פניות ואחוזי סגירה לפי טופס, עמוד ומקור הגעה.",
  },
  {
    to: "/admin/calendar",
    name: "יומן תוכן",
    section: "תוכן",
    description: "תאריכי הפרסום והביצועים של המאמרים באתר.",
  },
  {
    to: "/admin/home",
    name: "עריכת דף הבית",
    section: "תוכן",
    description: "עריכת הכותרת ופסקת הפתיחה, טיוטה ותצוגה מקדימה.",
  },
  {
    to: "/admin/treks",
    name: "עריכת מסלולים",
    section: "תוכן",
    description: "פרטי הטרקים, חלוקת הימים והיסטוריית הגרסאות.",
  },
  {
    to: "/admin/seo",
    name: "ניהול SEO",
    section: "תוכן",
    description: "המלצות ותצוגה מקדימה לחיפוש ולשיתוף.",
  },
  {
    to: "/admin/statistics",
    name: "סטטיסטיקות",
    section: "ניהול",
    description: "צפיות באתר, חשיפות וקליקים מתוצאות החיפוש בגוגל.",
  },
  {
    to: "/admin/integrations",
    name: "חיבורים",
    section: "ניהול",
    description: "חיבור כלי מדידה ואימות אנושי לטפסים.",
  },
  {
    to: "/admin/history",
    name: "יומן שינויים",
    section: "ניהול",
    description: "פעולות שבוצעו במערכת, לפי מועד וחשבון מנהל.",
  },
] as const;

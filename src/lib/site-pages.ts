import { articles, experiences, treks } from "./content";
export const sitePages = [
  ...Object.entries({
    "/": "דף הבית",
    "/treks": "טרקים ומסלולים",
    "/treks/compare": "השוואת טרקים",
    "/experiences": "חוויות",
    "/knowledge": "מרכז הידע",
    "/about": "מי אנחנו",
    "/contact": "צור קשר",
    "/nepal": "נפאל",
    "/destinations": "יעדים",
    "/destinations/bhutan": "בהוטן",
    "/destinations/tibet": "טיבט",
    "/quote": "בקשת הצעה",
    "/privacy": "פרטיות",
    "/match": "שאלון הכוונה",
  }).map(([path, name]) => ({ path, name })),
  ...treks.map((t) => ({ path: "/treks/" + t.slug, name: t.name })),
  ...experiences.map((t) => ({ path: "/experiences/" + t.slug, name: t.name })),
  ...articles.map((t) => ({ path: "/knowledge/" + t.slug, name: t.title })),
];
export const pageName = (path: string) => sitePages.find((p) => p.path === path)?.name ?? path;

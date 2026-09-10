import bhutanImg from "@/assets/destinations/bhutan.jpg";
import tibetImg from "@/assets/destinations/tibet.jpg";
import nepalImg from "@/assets/hero-himalaya.jpg";

/**
 * Destination registry. "השביל הזה" is the brand; Nepal is simply the most
 * developed destination today. Each destination has its own route and can grow
 * independently — nothing here forces symmetry between them.
 */
export type DestinationSlug = "nepal" | "bhutan" | "tibet";

export type Destination = {
  slug: DestinationSlug;
  /** Hebrew name as shown in navigation and cards. */
  name: string;
  /** Route path for this destination's page. */
  to: string;
  /** One short line about the character of the place. */
  character: string;
  /** A few sentences for the destinations page card. */
  blurb: string;
  cta: string;
  image: string;
  imageAlt: string;
  /** developed = full content today; opening = base page, content still coming. */
  status: "developed" | "opening";
};

export const destinations: Destination[] = [
  {
    slug: "nepal",
    name: "נפאל",
    to: "/nepal",
    character: "הרים, עמקים, ערים וכפרים — הכול במדינה אחת",
    blurb:
      "היעד המרכזי שלנו, והמפותח ביותר באתר: טרקים בכל רמות המאמץ, ערים ותרבות חיה, כפרים בגבעות וג׳ונגל בשפלה. כאן יש לנו הכי הרבה ניסיון, הכי הרבה שותפים בשטח והכי הרבה דרכים להרכיב טיול שמתאים לכם.",
    cta: "לגלות את נפאל",
    image: nepalImg,
    imageAlt: "רכס מושלג בהימלאיה באור ראשון",
    status: "developed",
  },
  {
    slug: "bhutan",
    name: "בהוטן",
    to: "/destinations/bhutan",
    character: "מדינה שמרנית ושקטה בהימלאיה המזרחית",
    blurb:
      "בהוטן היא חוויה אחרת לגמרי מנפאל: קטנה, מסודרת, שקטה, עם נוכחות בודהיסטית חזקה ומספר מבקרים מוגבל. אנחנו בונים כרגע את התוכן המקצועי ליעד הזה, ובינתיים אפשר לדבר איתנו ישירות.",
    cta: "לגלות את בהוטן",
    image: bhutanImg,
    imageAlt: "מבנה מנזר בהוטני לבן על רכס מיוער מעל עמק אפוף ערפל",
    status: "opening",
  },
  {
    slug: "tibet",
    name: "טיבט",
    to: "/destinations/tibet",
    character: "רמה גבוהה, מרחבים פתוחים ואופק רחוק",
    blurb:
      "טיבט היא בעיקר גובה ומרחב: מרחבים פתוחים, אורות חדים, מנזרים ואזורים שדורשים תכנון והיערכות שונים לגמרי. גם כאן אנחנו בשלב בניית התוכן, ולא נכתוב פרטים לפני שנאמת אותם.",
    cta: "לגלות את טיבט",
    image: tibetImg,
    imageAlt: "אגם טורקיז ברמה הטיבטית עם דגלי תפילה ורכסים מושלגים באופק",
    status: "opening",
  },
];

export function destinationBySlug(slug: DestinationSlug) {
  return destinations.find((d) => d.slug === slug)!;
}

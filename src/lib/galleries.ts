import manaslu1 from "@/assets/gallery/manaslu-1.jpg";
import manaslu2 from "@/assets/gallery/manaslu-2.jpg";
import manaslu3 from "@/assets/gallery/manaslu-3.jpg";
import manaslu4 from "@/assets/gallery/manaslu-4.jpg";
import annapurna1 from "@/assets/gallery/annapurna-1.jpg";
import annapurna2 from "@/assets/gallery/annapurna-2.jpg";
import annapurna3 from "@/assets/gallery/annapurna-3.jpg";
import annapurna4 from "@/assets/gallery/annapurna-4.jpg";
import ph1 from "@/assets/gallery/pokhara-hills-1.jpg";
import ph2 from "@/assets/gallery/pokhara-hills-2.jpg";
import ph3 from "@/assets/gallery/pokhara-hills-3.jpg";
import ph4 from "@/assets/gallery/pokhara-hills-4.jpg";
import ktm1 from "@/assets/gallery/kathmandu-1.jpg";
import ktm2 from "@/assets/gallery/kathmandu-2.jpg";
import ktm3 from "@/assets/gallery/kathmandu-3.jpg";
import ktm4 from "@/assets/gallery/kathmandu-4.jpg";
import pkr1 from "@/assets/gallery/pokhara-1.jpg";
import pkr2 from "@/assets/gallery/pokhara-2.jpg";
import pkr3 from "@/assets/gallery/pokhara-3.jpg";
import vil1 from "@/assets/gallery/villages-1.jpg";
import vil2 from "@/assets/gallery/villages-2.jpg";
import vil3 from "@/assets/gallery/villages-3.jpg";
import raft1 from "@/assets/gallery/rafting-1.jpg";
import raft2 from "@/assets/gallery/rafting-2.jpg";
import raft3 from "@/assets/gallery/rafting-3.jpg";
import chit1 from "@/assets/gallery/chitwan-1.jpg";
import chit2 from "@/assets/gallery/chitwan-2.jpg";
import chit3 from "@/assets/gallery/chitwan-3.jpg";
import yoga1 from "@/assets/gallery/yoga-rest-1.jpg";
import yoga2 from "@/assets/gallery/yoga-rest-2.jpg";
import yoga3 from "@/assets/gallery/yoga-rest-3.jpg";
import poon1 from "@/assets/gallery/poonhill-1.jpg";
import poon2 from "@/assets/gallery/poonhill-2.jpg";
import poon3 from "@/assets/gallery/poonhill-3.jpg";
import mardi1 from "@/assets/gallery/mardi-1.jpg";
import mardi2 from "@/assets/gallery/mardi-2.jpg";
import lang1 from "@/assets/gallery/langtang-1.jpg";
import lang2 from "@/assets/gallery/langtang-2.jpg";
import lang3 from "@/assets/gallery/langtang-3.jpg";
import acirc1 from "@/assets/gallery/acircuit-1.jpg";
import acirc2 from "@/assets/gallery/acircuit-2.jpg";
import acirc3 from "@/assets/gallery/acircuit-3.jpg";
import ebc1 from "@/assets/gallery/everest-1.jpg";
import ebc2 from "@/assets/gallery/everest-2.jpg";
import ebc3 from "@/assets/gallery/everest-3.jpg";

export type Photo = { src: string; alt: string; caption: string };

/**
 * Original photography produced for this site (no third-party stock licensing).
 * Each gallery mixes landscape, trail, village/lodging, people and one
 * distinctive detail, so a visitor can picture the day, not just the view.
 */
export const galleries: Record<string, Photo[]> = {
  "manaslu-circuit": [
    {
      src: manaslu1,
      alt: "פסגה מושלגת גבוהה מעל עמק נהר ירוק ועמוק בהימלאיה",
      caption: "ההר מעל העמק",
    },
    {
      src: manaslu2,
      alt: "שביל אבן צר בין חומות אבן מגולפות ודגלי תפילה",
      caption: "שביל בין חומות מאני",
    },
    {
      src: manaslu3,
      alt: "כפר גבוה בסגנון טיבטי, בתי אבן וגגות שטוחים, ערמות עצים ושדות",
      caption: "כפר גבוה, בתים מאבן",
    },
    {
      src: manaslu4,
      alt: "מטיילים חוצים מעבר הרים גבוה ומושלג לצד גלעדי אבן ודגלי תפילה",
      caption: "יום המעבר",
    },
  ],
  "annapurna-base-camp": [
    {
      src: annapurna1,
      alt: "טבעת פסגות מושלגות סביב אגן גבוה, באור זריחה ורוד",
      caption: "הבוקר בתוך האגן",
    },
    {
      src: annapurna2,
      alt: "מדרגות אבן ארוכות עולות ביער רודודנדרון אפוף ערפל",
      caption: "מדרגות אבן ורודודנדרון",
    },
    {
      src: annapurna3,
      alt: "טיהאוס פשוט על רכס, גג פח כחול, ספסלי עץ וכבל כביסה",
      caption: "לודג׳ על הרכס",
    },
    {
      src: annapurna4,
      alt: "פסגת סלע חדה מתנשאת מעל רכסים מיוערים כהים",
      caption: "פסגה מעל היער",
    },
  ],
  "poon-hill": [
    {
      src: poon1,
      alt: "זריחה מנקודת תצפית: שורת פסגות מושלגות גבוהות באור ורוד",
      caption: "הזריחה מפון היל",
    },
    {
      src: poon2,
      alt: "מדרגות אבן עולות בתוך יער רודודנדרון סמיך ומעורפל",
      caption: "המדרגות אל גורפאני",
    },
    {
      src: poon3,
      alt: "כפר גבעות נפאלי עם אכסניות פשוטות ומרפסות מול רכס מושלג",
      caption: "לינה בכפר",
    },
  ],
  "mardi-himal": [
    {
      src: mardi1,
      alt: "שביל צר על גב רכס פתוח מעל קו העצים, פסגה חדה ברקע",
      caption: "הליכה על הרכס",
    },
    {
      src: mardi2,
      alt: "מחנה גבוה ופשוט על מדרון, מעל ים עננים שממלא את העמק",
      caption: "המחנה הגבוה",
    },
  ],
  "langtang-valley": [
    {
      src: lang1,
      alt: "עמק הימלאיה רחב עם נהר, יערות ופסגות מושלגות בקצה",
      caption: "העמק נפתח",
    },
    {
      src: lang2,
      alt: "כפר אבן בעמק לנגטנג, חומות אבן, גגות פח ושדות קטנים",
      caption: "כפר שנבנה מחדש",
    },
    {
      src: lang3,
      alt: "קרחון וקירות סלע מושלגים מעל מרעה גבוה עם יאקים",
      caption: "סוף העמק",
    },
  ],
  "annapurna-circuit": [
    {
      src: acirc1,
      alt: "שביל עולה בעמק ירוק ותלול עם נהר וגשר תלוי",
      caption: "העמק הירוק בהתחלה",
    },
    {
      src: acirc2,
      alt: "כפר גבוה בסגנון טיבטי במדבר גבוה, פסגות מושלגות מעליו",
      caption: "כפר גבוה סביב מאנאנג",
    },
    {
      src: acirc3,
      alt: "מטיילים חוצים מעבר הרים גבוה ומושלג בבוקר",
      caption: "יום המעבר בתורונג לה",
    },
  ],
  "everest-base-camp": [
    {
      src: ebc1,
      alt: "פסגות מושלגות גבוהות מעל קרחון אפור וארוך",
      caption: "קרחון הקומבו",
    },
    {
      src: ebc2,
      alt: "מונסטרי בודהיסטי על רכס גבוה מול הר מושלג חד",
      caption: "מונסטרי מול ההרים",
    },
    {
      src: ebc3,
      alt: "שביל אבנים עולה בגובה בין גלעדי אבן ודגלי תפילה",
      caption: "השביל בגובה",
    },
  ],
  "pokhara-hills": [
    {
      src: ph1,
      alt: "מרפסות אורז ירוקות יורדות במדרון, ורכס מושלג באופק",
      caption: "מרפסות אורז וההרים באופק",
    },
    {
      src: ph2,
      alt: "סמטת אבן בכפר גבעות נפאלי, בתים לבנים עם בסיס אדום ותרנגולות",
      caption: "סמטה בכפר",
    },
    {
      src: ph3,
      alt: "זריחה מגבעה ירוקה: שורת פסגות מושלגות מעל ים של ערפל",
      caption: "זריחה מעל ים ערפל",
    },
    {
      src: ph4,
      alt: "כוס תה חלב על שולחן עץ במרפסת אכסניה, רכסים מיוערים מעורפלים",
      caption: "תה, לפני שיוצאים",
    },
  ],
  kathmandu: [
    {
      src: ktm1,
      alt: "סמטה צרה וסואנת בקטמנדו העתיקה, בתי לבנים וחלונות עץ מגולפים",
      caption: "סמטה בעיר העתיקה",
    },
    {
      src: ktm2,
      alt: "כיכר מקדשים נווארית עם גגות פגודה מדורגים וקורות עץ מגולפות",
      caption: "כיכר מקדשים",
    },
    {
      src: ktm3,
      alt: "דוכן אוכל רחוב בקטמנדו, סירי מומו מהבילים וירקות חתוכים",
      caption: "מומו על הדוכן",
    },
    {
      src: ktm4,
      alt: "סטופה בודהיסטית לבנה ודגלי תפילה, אנשים מקיפים אותה ויונים בכיכר",
      caption: "סטופה בשעת בוקר",
    },
  ],
  pokhara: [
    {
      src: pkr1,
      alt: "סירות עץ על אגם שקט בפוקרה, גבעות ירוקות משתקפות במים",
      caption: "האגם לפני שהעיר מתעוררת",
    },
    {
      src: pkr2,
      alt: "מרפסת בית קפה על שפת האגם עם נוף לפסגות מושלגות",
      caption: "בוקר מול ההרים",
    },
    {
      src: pkr3,
      alt: "רחוב שקט לחוף האגם עם חנויות ציוד לטרקים ודגלי תפילה",
      caption: "רחוב הציוד",
    },
  ],
  villages: [
    {
      src: vil1,
      alt: "תושבי כפר דשים תבואה בחצר בין בתי טיט וגגות סכך",
      caption: "חצר בזמן קציר",
    },
    {
      src: vil2,
      alt: "אישה מבשלת דאל בהאט על כירת חימר במטבח כפרי",
      caption: "דאל בהאט על הכירה",
    },
    {
      src: vil3,
      alt: "שביל בין טרסות מעובדות ונחל, בתים על המדרון וגשר חבלים",
      caption: "השביל בין שני כפרים",
    },
  ],
  rafting: [
    {
      src: raft1,
      alt: "רפסודה צהובה עם חותרים בתוך אשד לבן בנהר נפאלי",
      caption: "בתוך האשדות",
    },
    {
      src: raft2,
      alt: "נהר טורקיז רחב בערוץ ירוק, כביש חצוב במדרון מעליו",
      caption: "הנהר מהכביש",
    },
    {
      src: raft3,
      alt: "מחנה על גדת חול לצד הנהר, רפסודות על החוף, אוהלים ומדורה",
      caption: "לילה על גדת החול",
    },
  ],
  "yoga-rest": [
    {
      src: yoga1,
      alt: "רחבת עץ פתוחה עם מזרנים מגולגלים מול גבעות ירוקות בזריחה",
      caption: "רחבה מול הגבעות",
    },
    {
      src: yoga2,
      alt: "גן שקט של אכסניה בגבעות, ערסל בין עצים וכיסא עץ עם ספר",
      caption: "גן, ערסל, ספר",
    },
    {
      src: yoga3,
      alt: "ידיים מחזיקות כוס תה חמה על מעקה מרפסת מול רכסים מעורפלים",
      caption: "בוקר בלי לוח זמנים",
    },
  ],
  chitwan: [
    {
      src: chit1,
      alt: "קרנף חד־קרן רועה בעשב גבוה בשמורה בשפלת נפאל בבוקר מעורפל",
      caption: "קרנף בעשב הגבוה",
    },
    {
      src: chit2,
      alt: "סירת עץ חצובה שטה בנהר ג׳ונגל איטי בין גדות ירוקות",
      caption: "בוקר על הנהר",
    },
    {
      src: chit3,
      alt: "שביל חול בין עשב גבוה ויער סאל, אַיָּלים ברקע",
      caption: "שביל ביער",
    },
  ],
};

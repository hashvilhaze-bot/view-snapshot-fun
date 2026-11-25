import { heroPhotos } from "@/lib/home-hero-photos";

export type JournalPhoto = {
  src: string;
  srcSet?: string;
  alt: string;
  name: string;
  author: string;
  source: string;
  license: string;
  licenseUrl: string;
};
function localPhoto(
  key: string,
  alt: string,
  name: string,
  author: string,
  file: string,
  license: string,
  licensePath: string,
): JournalPhoto {
  return {
    src: "/journal/" + key + "-1360.webp",
    srcSet: "/journal/" + key + "-640.webp 640w, /journal/" + key + "-1360.webp 1360w",
    alt,
    name,
    author,
    source: "https://commons.wikimedia.org/wiki/File:" + file,
    license,
    licenseUrl: "https://creativecommons.org/licenses/" + licensePath + "/",
  };
}
export const journalPhotos = {
  village: heroPhotos[0],
  lake: heroPhotos[1],
  mountain: heroPhotos[2],
  stupa: localPhoto(
    "boudhanath",
    "עוברי אורח ויונים ברחבה מול הסטופה הלבנה של בודהנאת בקטמנדו",
    "רחבת סטופת בודהנאת, קטמנדו",
    "AmitPokhrel",
    "Boudhanath_Stupa%2C_Kathmandu_Nepal.jpg",
    "CC BY-SA 4.0",
    "by-sa/4.0",
  ),
  meal: localPhoto(
    "dal-bhat",
    "מגש דאל באט בקטמנדו עם אורז, עדשים, ירקות ותוספות",
    "דאל באט בקטמנדו",
    "Govind Rai (Getlostforever)",
    "Nepali_dal_bhat_thali%2C_Kathmandu%2C_Nepal_%28September_2026%29.jpg",
    "CC BY 4.0",
    "by/4.0",
  ),
  monastery: localPhoto(
    "taktsang",
    "מנזר טאקצאנג צמוד למצוק סלע מעל עצי היער בבהוטן",
    "מנזר טאקצאנג מעל עמק פארו, בהוטן",
    "Hou092",
    "Bhutan_okt-nov_2010.jpg",
    "CC BY-SA 3.0",
    "by-sa/3.0",
  ),
} satisfies Record<string, JournalPhoto>;
export type PhotoKey = keyof typeof journalPhotos;

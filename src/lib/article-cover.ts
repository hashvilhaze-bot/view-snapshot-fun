import { galleries } from "./galleries";
import { journalArticles } from "./journal/catalog";
import { journalPhotos } from "./journal/photos";

/** A photo from the site's own galleries that matches each guide's subject. */
const articleCover: Record<string, [string, number]> = {
  altitude: ["everest-base-camp", 2],
  "when-to-go": ["poon-hill", 0],
  "lodges-permits": ["annapurna-base-camp", 2],
  "gear-money": ["pokhara", 2],
  "choosing-trek": ["pokhara-hills", 0],
  "manaslu-vs-annapurna": ["manaslu-circuit", 1],
  "day-on-trail": ["villages", 2],
  "culture-food": ["kathmandu", 2],
};

export function coverForArticle(slug: string) {
  const journal = journalArticles.find((a) => a.slug === slug)?.journal;
  if (journal) return journalPhotos[journal.cover];
  const ref = articleCover[slug];
  return ref ? galleries[ref[0]]?.[ref[1]] : undefined;
}

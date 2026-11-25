export type ArticleChapter = {
  id: string;
  title: string;
  blocks: (string | { heading: string })[];
};
export type JournalBody = { intro: string[]; sections: ArticleChapter[] };
const loaders: Record<string, () => Promise<{ default: JournalBody }>> = {
  "nepal-planning": () => import("./nepal-planning.json"),
  "nepal-close-up": () => import("./nepal-close-up.json"),
  himalayas: () => import("./himalayas.json"),
};
export async function loadJournal(slug: string) {
  return (await loaders[slug]?.())?.default;
}

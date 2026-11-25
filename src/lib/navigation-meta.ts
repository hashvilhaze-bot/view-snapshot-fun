import { PUBLIC_ORIGIN } from "./public-meta";

const collections = {
  knowledge: "מרכז הידע",
  treks: "טרקים ומסלולים",
  experiences: "חוויות בנפאל",
  destinations: "יעדים",
} as const;
export type Collection = keyof typeof collections;
function itemPath(group: Collection, slug: string) {
  return group === "destinations" && slug === "nepal" ? "/nepal" : "/" + group + "/" + slug;
}
export function contentTrail(group: Collection, slug: string, name: string) {
  return [
    { name: "דף הבית", path: "/" },
    { name: collections[group], path: "/" + group },
    { name, path: itemPath(group, slug) },
  ];
}
export function structuredData(data: object) {
  return { type: "application/ld+json", children: JSON.stringify(data).replace(/</g, "\\u003c") };
}
export function breadcrumbData(group: Collection, slug: string, name: string) {
  return structuredData({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: contentTrail(group, slug, name).map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: PUBLIC_ORIGIN + item.path,
    })),
  });
}
export function collectionData(group: Collection, items: { slug: string; name: string }[]) {
  return structuredData({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collections[group],
    url: PUBLIC_ORIGIN + "/" + group,
    inLanguage: "he",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        url: PUBLIC_ORIGIN + itemPath(group, item.slug),
      })),
    },
  });
}

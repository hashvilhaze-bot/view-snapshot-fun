export const PUBLIC_ORIGIN = "https://view-snapshot-fun.lovable.app";
export function publicMeta(
  title: string,
  description: string,
  path: string,
  type = "website",
  image?: string,
) {
  const url = new URL(path, PUBLIC_ORIGIN).href;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { property: "og:locale", content: "he_IL" },
      { name: "twitter:card", content: "summary_large_image" },
      ...(image ? [{ property: "og:image", content: new URL(image, PUBLIC_ORIGIN).href }] : []),
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

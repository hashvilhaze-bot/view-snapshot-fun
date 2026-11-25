import defaultShareImage from "@/assets/valley-golden.jpg";

export const PUBLIC_ORIGIN = "https://view-snapshot-fun.lovable.app";
export function publicMeta(
  title: string,
  description: string,
  path: string,
  type = "website",
  image = defaultShareImage,
  share?: { title: string; description: string },
) {
  const url = new URL(path, PUBLIC_ORIGIN).href;
  const imageUrl = new URL(image, PUBLIC_ORIGIN).href;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: share?.title ?? title },
      { property: "og:description", content: share?.description ?? description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { property: "og:locale", content: "he_IL" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: imageUrl },
      { name: "twitter:image", content: imageUrl },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

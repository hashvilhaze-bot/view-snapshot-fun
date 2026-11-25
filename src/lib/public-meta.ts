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

export function managedMeta(
  cms: import("./cms").PublicConfig | undefined,
  ...args: Parameters<typeof publicMeta>
) {
  const [originalTitle, originalDescription, path, type, originalImage, share] = args;
  const seo = cms?.pages[path] ?? {};
  const defaults = publicMeta(...args);
  const result = publicMeta(
    seo.title || originalTitle,
    seo.description || originalDescription,
    path,
    type,
    seo.image || originalImage,
    {
      title: seo.title || share?.title || originalTitle,
      description: seo.description || share?.description || originalDescription,
    },
  );
  return {
    ...result,
    meta: [
      ...result.meta.map((tag) => {
        if (tag.property === "og:title") return { ...tag, "data-default": originalTitle };
        if (tag.property === "og:description")
          return { ...tag, "data-default": originalDescription };
        if (tag.property === "og:image")
          return {
            ...tag,
            "data-default": defaults.meta.find((t) => t.property === "og:image")?.content,
          };
        return tag;
      }),
      ...(seo.noindex ? [{ name: "robots", content: "noindex, follow" }] : []),
    ],
  };
}

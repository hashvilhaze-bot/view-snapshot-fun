export const PUBLIC_ORIGIN = 'https://view-snapshot-fun.lovable.app';
export function publicMeta(title: string, description: string, path: string, type = 'website') {
  const url = PUBLIC_ORIGIN + path;
  return {
    meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: type }, { property: 'og:url', content: url }, { name: 'twitter:card', content: 'summary_large_image' }],
    links: [{ rel: 'canonical', href: url }],
  };
}
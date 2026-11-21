import { getCollection } from 'astro:content';
import type { Language } from '../data/ui';

export async function getPosts(lang: Language) {
  const entries = await getCollection('blog', (entry) => entry.data.lang === lang);
  return entries.sort((a, b) =>
    (b.data.pubDate ?? '').localeCompare(a.data.pubDate ?? '') || a.id.localeCompare(b.id)
  );
}

import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { profile } from '../data/profile';
import type { Language } from '../data/ui';
import { getPosts } from './blog';
import { routePath } from './routes.mjs';
import { withBase } from './url';

export async function createFeed(context: APIContext, lang: Language) {
  const home = new URL(withBase(routePath(lang, 'blog')), context.site);
  const posts = await getPosts(lang);
  return rss({
    title: profile.name,
    description: profile.affiliation[lang],
    site: home,
    items: posts.map(({ data }) => ({
      title: data.title,
      description: data.description,
      link: new URL(withBase(routePath(lang, `blog/${data.slug}`)), context.site).href,
      ...(data.pubDate ? { pubDate: new Date(data.pubDate) } : {}),
    })),
    customData: `<language>${lang}</language>`,
  });
}

export const languages = ['en', 'zh-tw'];
export const publicLanguages = ['en'];
export const primaryRoutes = ['home', 'about', 'publications', 'experience', 'blog'];

export function routePath(lang, page) {
  const prefix = lang === 'en' ? '' : '/zh-tw';
  if (page === 'home') return prefix + '/';
  if (page === '404' && lang === 'en') return '/404.html';
  if (page === 'rss') return prefix + '/rss.xml';
  return prefix + '/' + page + '/';
}

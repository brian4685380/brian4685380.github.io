import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { profile } from '../src/data/profile.ts';
import { publications } from '../src/data/publications.ts';
import stripPostTitle from '../src/lib/strip-post-title.mjs';
import { pageSchema, postSchema } from '../src/lib/content-schema.mjs';
import { primaryRoutes, publicLanguages, routePath } from '../src/lib/routes.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const publicRoot = join(root, 'public');
const origin = 'https://content-check.invalid';
const routes = new Set(
  publicLanguages.flatMap((lang) => [...primaryRoutes, '404', 'rss'].map((page) => routePath(lang, page))),
);
routes.add('/sitemap-index.xml');
routes.add('/sitemap-0.xml');
const errors = [];
const documents = [];

async function checkLink(value, source, current, assetOnly = false) {
  if (!value || value.startsWith('TODO:')) return;

  let url;
  try {
    url = new URL(value, new URL(current, origin));
  } catch {
    errors.push(`${source}: invalid URL "${value}"`);
    return;
  }
  if (url.origin !== origin) return;

  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    errors.push(`${source}: invalid URL encoding "${value}"`);
    return;
  }
  if (!assetOnly && (routes.has(pathname) || routes.has(pathname + '/'))) return;

  const assetPath = join(publicRoot, pathname);
  if (!relative(publicRoot, assetPath).startsWith('..')) {
    const asset = await stat(assetPath).catch((error) => {
      if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return undefined;
      throw error;
    });
    if (asset?.isFile()) return;
  }
  errors.push(`${source}: "${value}" points to a missing ${assetOnly ? 'asset' : 'page or asset'}`);
}

function* walk(node) {
  yield node;
  for (const child of node.children ?? []) yield* walk(child);
}

const parser = unified().use(remarkParse).use(remarkMdx).use(remarkGfm).use(remarkMath).use(stripPostTitle);

for (const [collection, schema, requiredSlugs] of [
  ['pages', pageSchema, ['home', 'about']],
  ['blog', postSchema, []],
]) {
  const contentRoot = join(root, 'src/content', collection);
  const entries = new Map();
  const slugs = new Set(requiredSlugs);
  for (const file of await readdir(contentRoot, { recursive: true })) {
    const path = join(contentRoot, file);
    const source = relative(root, path);
    if (file.endsWith('.md')) errors.push(`${source}: use the .mdx extension`);
    if (!file.endsWith('.mdx')) continue;

    try {
      const { data, content } = matter(await readFile(path, 'utf8'));
      const { lang, slug, sample, title } = schema.parse(data);
      const id = `${lang}/${slug}`;
      if (entries.has(id)) {
        errors.push(`${source}: duplicate content ID "${id}" (also used by ${entries.get(id).source})`);
        continue;
      }
      if (sample && !content.includes('TODO:') && !title.startsWith('TODO:')) {
        errors.push(`${source}: sample content needs a TODO: marker`);
      }
      const input = { path, value: content };
      const nodes = [...walk(parser.runSync(parser.parse(input), input))];
      const current = routePath(lang, collection === 'blog' ? `blog/${slug}` : slug);
      const document = { source, current, nodes, headings: nodes.filter(({ type }) => type === 'heading').length };
      entries.set(id, document);
      slugs.add(slug);
      if (publicLanguages.includes(lang)) routes.add(current);
      documents.push({ ...document, lang });
    } catch (error) {
      errors.push(`${source}: ${error.message}`);
    }
  }

  for (const slug of slugs) {
    for (const lang of publicLanguages) {
      if (!entries.has(`${lang}/${slug}`)) errors.push(`Missing ${collection} content entry: ${lang}/${slug}`);
    }
    const pair = publicLanguages.map((lang) => entries.get(`${lang}/${slug}`));
    if (pair.length > 1 && pair.every(Boolean) && pair.some((entry) => entry.headings !== pair[0].headings)) {
      errors.push(`${pair[0].source} and ${pair[1].source}: heading counts differ`);
    }
  }
}

for (const { source, current, nodes, lang } of documents) {
  if (!publicLanguages.includes(lang)) continue;
  const definitions = new Map(nodes.filter(({ type }) => type === 'definition').map((node) => [node.identifier, node.url]));
  for (const node of nodes) {
    const location = `${source} (body line ${node.position?.start.line ?? 1})`;
    if (node.type === 'link' || node.type === 'image') {
      await checkLink(node.url, location, current, node.type === 'image');
    }
    if (node.type === 'linkReference' || node.type === 'imageReference') {
      await checkLink(definitions.get(node.identifier), location, current, node.type === 'imageReference');
    }
    if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
      if (node.attributes.some(({ name }) => ['href', 'src', 'srcSet', 'poster'].includes(name))) {
        errors.push(`${location}: use Markdown links and images so the site can apply its base path`);
      }
    }
    if (current.includes('/blog/') && node.type === 'heading' && node.depth === 1) {
      errors.push(`${location}: the layout provides the post title, so use H2 or lower in the body`);
    }
  }
}

for (const lang of publicLanguages) {
  for (const page of [...primaryRoutes, '404', 'rss']) {
    const directory = lang === 'en' ? '' : lang;
    const filenames = {
      home: ['index.astro'],
      blog: ['blog/index.astro', 'blog/[slug].astro'],
      rss: ['rss.xml.ts'],
    };
    for (const filename of filenames[page] ?? [`${page}.astro`]) {
      const source = join('src/pages', directory, filename);
      try {
        if (!(await stat(join(root, source))).isFile()) errors.push(`${source}: expected a route file`);
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        errors.push(`${source}: missing route file`);
      }
    }
  }
}

await checkLink(profile.photo, 'src/data/profile.ts (photo)', '/', true);
await checkLink(profile.socialImage, 'src/data/profile.ts (socialImage)', '/', true);
for (const [label, url] of Object.entries(profile.links)) {
  for (const lang of publicLanguages) await checkLink(url, `src/data/profile.ts (${label})`, routePath(lang, 'about'));
}
for (const entry of publications) {
  for (const lang of publicLanguages) {
    const pages = [routePath(lang, 'publications')];
    if (entry.selected) pages.push(routePath(lang, 'home'));
    for (const page of pages) {
      const source = `src/data/publications.ts (${entry.id}, ${page})`;
      await checkLink(entry.teaser?.src, source, page, true);
      for (const url of Object.values(entry.links ?? {})) await checkLink(url, source, page);
    }
  }
}

if (errors.length) {
  for (const error of errors) console.error(error);
  process.exitCode = 1;
} else {
  console.log(`Checked ${documents.length} content entries and ${routes.size} routes.`);
}

# Editing the academic site

The static Astro source lives in `site/`. The author supplies personal claims,
records, dates, and assets. Use a `TODO:` marker until those details are supplied.

- Edit identity and contact details in `site/src/data/profile.ts`. Use a complete
  `mailto:` URL for Email. Put personal assets in `site/public/images/` or
  `site/public/assets/` and refer to them by root-relative paths.
- Add real publications to `site/src/data/publications.ts`. Update experience in `site/src/data/experience.ts`.
- For a new static page, add the English route file, then
  register the route and set its navigation label if it belongs in the header.
  Extend the content schema and validator if the new page uses a collection.
  Paired collection entries share a slug and have IDs based on frontmatter
  language and slug. Check that their heading counts agree when both languages are public.
- Pass internal paths through `withBase()`. In MDX, use Markdown links and
  images to pick up the shared renderers. Keep design tokens in
  `site/src/styles/global.css` and sample records clearly labeled.
- Run `npm run check` and `npm run build` from `site/`. GitHub Pages serves the
  English `404.html` for missing URLs. Traditional Chinese content is kept in collections. Its route templates live under
  `site/src/deferred-pages/` so Astro generates English routes only.


## Adding a blog post

1. Add an English MDX file under `site/src/content/blog/en/`. An archived
   Traditional Chinese translation can use the same slug. The slug controls
   the public URL.
2. Fill in `lang`, `slug`, `title`, `description`, `pubDate` (quoted
   YYYY-MM-DD), and `sample: false`. Placeholder examples use `sample: true`
   and may leave `pubDate: null`.
3. Start body sections at H2. The layout uses the frontmatter title as H1.
   Use dollar delimiters for math. For a captioned figure, place a Markdown
   image and a `<figcaption>` in an MDX `<figure>`, as in the sample figure post.
4. Run the validator. The public post route, feed, and sitemap derive from English entries.

## Verification and deployment

- Check both the default root deployment and a subpath build using
  `SITE_BASE=/preview/`. Feed entries, site links, and figure assets
  must retain that prefix in the generated output.
- Keep publication dates as quoted ISO date strings. Use `null` only in
  sample posts so examples never claim a publication date.

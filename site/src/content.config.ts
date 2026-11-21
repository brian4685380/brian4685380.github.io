import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { pageSchema, postSchema } from './lib/content-schema.mjs';

const pages = defineCollection({
  loader: glob({
    base: './src/content/pages',
    pattern: '**/*.mdx',
    generateId: ({ data }) => {
      const { lang, slug } = pageSchema.parse(data);
      return `${lang}/${slug}`;
    },
  }),
  schema: pageSchema,
});

const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/*.mdx',
    generateId: ({ data }) => {
      const { lang, slug } = postSchema.parse(data);
      return `${lang}/${slug}`;
    },
  }),
  schema: postSchema,
});

export const collections = { pages, blog };

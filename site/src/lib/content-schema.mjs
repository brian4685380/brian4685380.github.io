import { z } from 'zod';

const entrySchema = z.object({
  lang: z.enum(['en', 'zh-tw']),
  title: z.string().trim().min(1),
  sample: z.boolean(),
});

export const pageSchema = entrySchema.extend({
  slug: z.enum(['home', 'about']),
});

export const postSchema = entrySchema.extend({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().min(1),
  pubDate: z.preprocess(
    (value) => value instanceof Date && !Number.isNaN(value.valueOf())
      ? value.toISOString().slice(0, 10)
      : value,
    z.string().date().nullable(),
  ),
}).refine(({ sample, pubDate }) => sample || pubDate !== null, {
  message: 'Published posts need a date',
  path: ['pubDate'],
});

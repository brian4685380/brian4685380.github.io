import type { APIContext } from 'astro';
import { createFeed } from '../../lib/feed';

export const GET = (context: APIContext) => createFeed(context, 'zh-tw');

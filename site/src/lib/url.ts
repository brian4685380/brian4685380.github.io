export function withBase(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;

  // Callers use site-relative paths so the same content works at either hosting depth.
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
}

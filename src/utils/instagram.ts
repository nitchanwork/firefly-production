/** Accept copied Post/Reel URLs and return a query-free canonical permalink. */
export function normalizeInstagramUrl(value: string): string {
  try {
    const url = new URL(value.trim());
    const path = url.pathname.match(/^\/(p|reel)\/([A-Za-z0-9_-]+)\/?$/);
    if (url.protocol === 'https:' && ['instagram.com', 'www.instagram.com'].includes(url.hostname) && path) {
      return `https://www.instagram.com/${path[1]}/${path[2]}/`;
    }
  } catch {
    // Incomplete URLs must not create broken embeds.
  }
  return '';
}

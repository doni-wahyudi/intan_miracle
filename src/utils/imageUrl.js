/**
 * Returns a correctly prefixed URL for public-folder assets.
 * Vite sets import.meta.env.BASE_URL to the `base` in vite.config.js
 * (e.g. "/intan_miracle/" in production, "/" in dev).
 *
 * Usage:  img(src="/Image/foo.webp")   →  /intan_miracle/Image/foo.webp
 */
export const img = (path) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

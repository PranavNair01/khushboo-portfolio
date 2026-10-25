// The site's public address, for canonical URLs, the sitemap and link previews.
// On Vercel this comes from the production domain automatically; set NEXT_PUBLIC_SITE_URL
// to override it (e.g. after adding a custom domain).
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
);

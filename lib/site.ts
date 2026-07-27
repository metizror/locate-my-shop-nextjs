// Single source of truth for the site's canonical base URL.
//
// The production site is canonicalised on the WWW host (www.storelocator.in);
// the apex (storelocator.in) 301-redirects to it in next.config.mjs. To keep
// canonical tags, sitemap and robots consistent with that redirect, we force
// the apex host to www here — so even if NEXT_PUBLIC_SITE_URL is set to the
// apex, every generated URL still points at the canonical www host.
const CANONICAL_APEX = "storelocator.in";
const CANONICAL_HOST = "www.storelocator.in";

export function getSiteBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  const fromVercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
  const raw = (fromEnv || fromVercel || "http://localhost:3000").replace(/\/+$/, "");

  try {
    const url = new URL(raw);
    // Enforce the canonical www host for the production domain. Local dev
    // (localhost) and any other host are left untouched.
    if (url.hostname === CANONICAL_APEX) {
      url.hostname = CANONICAL_HOST;
    }
    return url.toString().replace(/\/+$/, "");
  } catch {
    return raw;
  }
}

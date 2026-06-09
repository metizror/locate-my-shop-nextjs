/**
 * Pure text helpers safe to import from both client and server (no deps).
 */

/**
 * Derive a short plain-text excerpt from post body HTML. Prefers the first
 * paragraph; falls back to the whole stripped body. Used when a post has no
 * explicit excerpt (e.g. posts published from heyfilo, which omit it).
 */
export function deriveExcerpt(html?: string | null, max = 160): string {
  if (!html) return "";
  // Prefer the first non-empty <p>…</p>; otherwise use the full body.
  const paragraphs = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
  let source = html;
  for (const p of paragraphs) {
    const t = p.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (t) {
      source = p;
      break;
    }
  }
  const text = source.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

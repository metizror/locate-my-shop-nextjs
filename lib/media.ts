import fs from "fs";
import { promises as fsp } from "fs";
import path from "path";
import crypto from "crypto";

/**
 * Runtime media store — lives OUTSIDE public/ and outside any build folder, so
 * files written here are served live by the dynamic route at
 * `app/media/[...path]/route.ts` with NO rebuild/redeploy required.
 */

export const MEDIA_URL_PREFIX = "/media";

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",
};

let cachedDir: string | null = null;

/**
 * Resolve the media directory (creating it on first use):
 *   1. process.env.MEDIA_STORAGE_DIR if set
 *   2. otherwise <projectRoot>/storage/media
 */
export function getMediaDir(): string {
  if (cachedDir) return cachedDir;
  const fromEnv = process.env.MEDIA_STORAGE_DIR?.trim();
  const dir = fromEnv
    ? path.resolve(fromEnv)
    : path.join(process.cwd(), "storage", "media");
  fs.mkdirSync(dir, { recursive: true });
  cachedDir = dir;
  return dir;
}

export function extFromContentType(contentType = "", url = ""): string {
  if (EXT_BY_TYPE[contentType]) return EXT_BY_TYPE[contentType];
  return extFromUrl(url) || "jpg";
}

/** Best-effort extension from a URL path (no content-type involved). */
export function extFromUrl(url: string): string {
  const m = url.split("?")[0].split("#")[0].match(/\.([a-zA-Z0-9]{2,5})$/);
  return m ? m[1].toLowerCase() : "";
}

/** SEO-friendly slug fragment for filenames. */
function sanitizeSlug(s: string): string {
  const out = (s || "image")
    .toString()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return out || "image";
}

/** Short, stable hash of the source URL (stable across webhook retries). */
function shortHash(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex").slice(0, 8);
}

/** True for absolute http(s) URLs that are NOT already served by this site. */
export function isRemoteHttpUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  if (!/^https?:\/\//i.test(url)) return false;
  try {
    const u = new URL(url);
    // Already rehosted on our own /media path — leave it alone.
    if (u.pathname.startsWith(`${MEDIA_URL_PREFIX}/`)) return false;
  } catch {
    return false;
  }
  return true;
}

/** Fetch with redirect-following and a sane timeout. */
async function fetchImage(url: string, timeoutMs = 15000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { redirect: "follow", signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Persist a raw buffer into the media dir under a random name and return its
 * public `/media/...` path. Used for admin manual uploads (no source URL).
 */
export async function saveImageBuffer(
  buffer: Buffer,
  ext: string
): Promise<string> {
  const dir = getMediaDir();
  const name = `${crypto.randomBytes(12).toString("hex")}.${ext.replace(/^\./, "")}`;
  await fsp.writeFile(path.join(dir, name), buffer);
  return `${MEDIA_URL_PREFIX}/${name}`;
}

/**
 * Download a remote image into the media dir and return its local `/media/...`
 * path. SEO-friendly + idempotent: filename is `<slug>-<hash>.<ext>` where the
 * hash is derived from the source URL, so retries map to the same file and an
 * existing file is reused without re-downloading.
 *
 * Best-effort: returns the original URL unchanged on any failure or if the URL
 * is not a remote http(s) image.
 */
export async function rehostRemoteImage(
  remoteUrl: string,
  slugBase: string
): Promise<string> {
  if (!isRemoteHttpUrl(remoteUrl)) return remoteUrl;

  const dir = getMediaDir();
  const slug = sanitizeSlug(slugBase);
  const hash = shortHash(remoteUrl);

  const toPublic = (name: string) => `${MEDIA_URL_PREFIX}/${name}`;
  const makeName = (ext: string) => `${slug}-${hash}.${ext.replace(/^\./, "")}`;

  // Fast idempotency path: if we can guess the extension from the URL and the
  // file already exists, skip the network entirely.
  const urlExt = extFromUrl(remoteUrl);
  if (urlExt) {
    const existingName = makeName(urlExt);
    if (fs.existsSync(path.join(dir, existingName))) {
      return toPublic(existingName);
    }
  }

  try {
    const res = await fetchImage(remoteUrl);
    if (!res.ok) return remoteUrl;

    const ext =
      urlExt || extFromContentType(res.headers.get("content-type") || "", remoteUrl);
    const name = makeName(ext);
    const dest = path.join(dir, name);

    // Idempotent: another delivery may have written it already.
    if (fs.existsSync(dest)) return toPublic(name);

    const buffer = Buffer.from(await res.arrayBuffer());
    await fsp.writeFile(dest, buffer);
    return toPublic(name);
  } catch {
    return remoteUrl;
  }
}

/**
 * Rewrite every `<img src="http(s)://...">` in an HTML string to a local
 * `/media/...` path, rehosting each remote image. Returns the rewritten HTML.
 */
export async function rehostImagesInHtml(
  html: string,
  slugBase: string
): Promise<string> {
  if (!html) return html;

  const srcs = new Set<string>();
  const re = /<img\b[^>]*?\bsrc\s*=\s*["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    if (isRemoteHttpUrl(m[1])) srcs.add(m[1]);
  }

  let out = html;
  let i = 0;
  for (const src of srcs) {
    const local = await rehostRemoteImage(src, `${slugBase}-img-${i++}`);
    if (local !== src) out = out.split(src).join(local);
  }
  return out;
}

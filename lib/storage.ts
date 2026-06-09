import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "blog-images");
const PUBLIC_PREFIX = "/uploads/blog-images";

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",
};

export function extFromContentType(contentType = "", url = ""): string {
  if (EXT_BY_TYPE[contentType]) return EXT_BY_TYPE[contentType];
  const m = url.split("?")[0].match(/\.([a-zA-Z0-9]{2,5})$/);
  return m ? m[1].toLowerCase() : "jpg";
}

/** Persist a buffer under public/uploads/blog-images and return its public path. */
export async function saveImageBuffer(
  buffer: Buffer,
  ext: string
): Promise<string> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${crypto.randomBytes(12).toString("hex")}.${ext.replace(/^\./, "")}`;
  await fs.writeFile(path.join(UPLOAD_DIR, name), buffer);
  return `${PUBLIC_PREFIX}/${name}`;
}

/**
 * Download a remote image to local disk. Best-effort: returns the original URL
 * if the download or write fails.
 */
export async function downloadImageToLocal(url: string): Promise<string> {
  try {
    const res = await fetch(url);
    if (!res.ok) return url;
    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = Buffer.from(await res.arrayBuffer());
    return await saveImageBuffer(buffer, extFromContentType(contentType, url));
  } catch {
    return url;
  }
}

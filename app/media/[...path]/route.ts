import { NextRequest } from "next/server";
import { promises as fsp } from "fs";
import path from "path";
import { getMediaDir } from "@/lib/media";

// Read the filesystem at REQUEST time — this is the no-rebuild fix. Files
// written into the media dir are served immediately, never baked at build.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  avif: "image/avif",
};

function badRequest(message: string) {
  return new Response(message, { status: 400 });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const segments = params?.path ?? [];

  // SECURITY: reject traversal attempts before touching the filesystem.
  if (
    segments.length === 0 ||
    segments.some((s) => s.includes("..") || s.includes("\0") || s.includes("/"))
  ) {
    return badRequest("Invalid path");
  }

  const mediaDir = path.resolve(getMediaDir());
  const resolved = path.resolve(mediaDir, segments.join("/"));

  // SECURITY: ensure the resolved path stays inside the media dir.
  if (resolved !== mediaDir && !resolved.startsWith(mediaDir + path.sep)) {
    return badRequest("Invalid path");
  }

  let stat;
  try {
    stat = await fsp.stat(resolved);
  } catch {
    return new Response("Not found", { status: 404 });
  }
  if (!stat.isFile()) {
    return new Response("Not found", { status: 404 });
  }

  const ext = path.extname(resolved).slice(1).toLowerCase();
  const contentType = CONTENT_TYPE_BY_EXT[ext] || "application/octet-stream";
  const data = await fsp.readFile(resolved);

  return new Response(data, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(stat.size),
      // Filenames are content-hashed, so they are safe to cache forever.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

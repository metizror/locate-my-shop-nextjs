/**
 * Back-compat shim. Image storage now lives in `lib/media.ts`, which writes to
 * a runtime media dir OUTSIDE public/ and serves files via the dynamic route at
 * `app/media/[...path]/route.ts` (no rebuild required). These re-exports keep
 * existing importers working while routing everything through the new store.
 */
import { rehostRemoteImage } from "./media";

export {
  saveImageBuffer,
  extFromContentType,
  getMediaDir,
  MEDIA_URL_PREFIX,
} from "./media";

/**
 * Download a remote image to the local media dir and return its `/media/...`
 * path. Retained for compatibility; new code should prefer `rehostRemoteImage`
 * (in `lib/media.ts`) which also accepts an SEO slug base.
 */
export async function downloadImageToLocal(url: string): Promise<string> {
  return rehostRemoteImage(url, "image");
}

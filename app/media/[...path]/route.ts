// Serve images from the runtime media dir (HEYFILO_MEDIA_DIR) at request time —
// the "no rebuild" mechanism. The SDK's GET reads the file fresh on every
// request, so images downloaded by the webhook appear live immediately.
//
// NOTE: the package exports this from "@heyfilo/sdk/next" (NOT "/next/media"
// as the README shows — that subpath is not exported).
export { GET } from "@heyfilo/sdk/next";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

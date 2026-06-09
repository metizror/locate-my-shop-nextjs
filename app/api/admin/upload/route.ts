import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveImageBuffer, extFromContentType } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB, matches the old admin UI limit

// Admin: upload a blog image to local disk; returns its public URL.
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image must be smaller than 5MB" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = extFromContentType(file.type, file.name);
  const url = await saveImageBuffer(buffer, ext);

  // `publicUrl` kept for parity with the previous Supabase response shape.
  return NextResponse.json({ url, publicUrl: url });
}

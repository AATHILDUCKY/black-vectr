import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getCurrentUser } from "@/lib/auth-server";
import { CONTENT_TAGS } from "@/lib/api";

// On-demand cache purge for the public site. The admin UI POSTs here after a
// mutation (which goes straight to the Express backend) so edited content shows
// up immediately instead of waiting out the ISR window. Lives outside /api,
// which is rewritten to the backend and would otherwise shadow this route.
export async function POST(request: Request) {
  // Only authenticated admins may purge the cache.
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let tag: string | undefined;
  try {
    const body = await request.json();
    if (typeof body?.tag === "string") tag = body.tag;
  } catch {
    // No / invalid body — fall through to purging everything.
  }

  const tags =
    tag && (CONTENT_TAGS as readonly string[]).includes(tag) ? [tag] : CONTENT_TAGS;
  for (const t of tags) revalidateTag(t);

  return NextResponse.json({ revalidated: true, tags });
}

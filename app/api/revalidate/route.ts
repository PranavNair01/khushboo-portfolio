import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

// Called by a Sanity webhook on every publish, unpublish or delete.
// The signature proves the call came from Sanity; then all content tagged "sanity" is
// marked stale with expire: 0, so the very next visit renders fresh content.
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return new Response("SANITY_REVALIDATE_SECRET is not set", { status: 500 });

  // `true`: wait for Sanity's Content Lake to be consistent before we revalidate.
  const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
  if (!isValidSignature) return new Response("Invalid signature", { status: 401 });

  revalidateTag("sanity", { expire: 0 });
  return NextResponse.json({ revalidated: true, type: body?._type ?? null });
}

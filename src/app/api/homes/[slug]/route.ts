import { NextRequest, NextResponse } from "next/server";
import { getHomeWithEntries } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const home = getHomeWithEntries(slug);
  if (!home) {
    return NextResponse.json({ error: "Home not found." }, { status: 404 });
  }
  return NextResponse.json({ home });
}

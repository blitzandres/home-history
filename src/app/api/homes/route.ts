import { NextRequest, NextResponse } from "next/server";
import { findOrCreateHome } from "@/lib/db";
import { slugifyAddress } from "@/lib/slug";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const address = typeof body.address === "string" ? body.address.trim() : "";
    if (!address || address.length < 3) {
      return NextResponse.json(
        { error: "Please enter a street address (at least a few characters)." },
        { status: 400 }
      );
    }
    const slug = slugifyAddress(address);
    if (!slug) {
      return NextResponse.json(
        { error: "That address doesn't make a usable link. Try again." },
        { status: 400 }
      );
    }
    const home = findOrCreateHome(address, slug);
    return NextResponse.json({ home, created: true });
  } catch (err) {
    console.error("POST /api/homes", err);
    return NextResponse.json({ error: "Could not open that home." }, { status: 500 });
  }
}

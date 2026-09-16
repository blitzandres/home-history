import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { createEntry, getHomeBySlug, getUploadsDir } from "@/lib/db";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
]);

function parseYear(value: FormDataEntryValue | null): number | null {
  if (value == null || value === "") return null;
  const n = Number(String(value).trim());
  if (!Number.isFinite(n)) return null;
  const y = Math.trunc(n);
  if (y < 1600 || y > 2100) return null;
  return y;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const home = getHomeBySlug(slug);
    if (!home) {
      return NextResponse.json({ error: "Home not found." }, { status: 404 });
    }

    const form = await req.formData();
    const story = String(form.get("story") ?? "").trim();
    const yearStart = parseYear(form.get("yearStart"));
    let yearEnd = parseYear(form.get("yearEnd"));

    if (yearStart != null && yearEnd != null && yearEnd < yearStart) {
      yearEnd = yearStart;
    }

    const files = form
      .getAll("photos")
      .filter((f): f is File => f instanceof File && f.size > 0);

    if (!story && files.length === 0) {
      return NextResponse.json(
        { error: "Add a short story or at least one photo." },
        { status: 400 }
      );
    }

    const uploadsRoot = getUploadsDir();
    const homeUploadDir = path.join(uploadsRoot, slug);
    fs.mkdirSync(homeUploadDir, { recursive: true });

    const saved: { relativePath: string; originalName: string }[] = [];

    for (const file of files) {
      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json(
          { error: `Photo "${file.name}" is too large (max 8MB).` },
          { status: 400 }
        );
      }
      const type = file.type || "application/octet-stream";
      if (!ALLOWED.has(type) && !/\.(jpe?g|png|webp|gif|heic|heif)$/i.test(file.name)) {
        return NextResponse.json(
          { error: `Unsupported file type: ${file.name}` },
          { status: 400 }
        );
      }

      const ext =
        path.extname(file.name).toLowerCase() ||
        (type === "image/png"
          ? ".png"
          : type === "image/webp"
            ? ".webp"
            : type === "image/gif"
              ? ".gif"
              : ".jpg");
      const filename = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
      const abs = path.join(homeUploadDir, filename);
      const buf = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(abs, buf);
      saved.push({
        relativePath: `/uploads/${slug}/${filename}`,
        originalName: file.name,
      });
    }

    const entry = createEntry({
      homeId: home.id,
      yearStart,
      yearEnd,
      story,
      images: saved,
    });

    return NextResponse.json({ entry });
  } catch (err) {
    console.error("POST entries", err);
    return NextResponse.json(
      { error: "Could not save that entry." },
      { status: 500 }
    );
  }
}

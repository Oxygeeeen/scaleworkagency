import { del, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { applications } from "@/db/schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_FILE_SIZE = 4_000_000;
const allowed = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  country: z.string().trim().min(2).max(120),
  languages: z.string().trim().min(2).max(400),
  education: z.string().trim().max(250).optional(),
  discipline: z.string().trim().min(2).max(180),
  coding: z.string().trim().max(400).optional(),
  experience: z.string().trim().min(20).max(5000),
  availability: z.string().trim().min(2).max(100),
  profileUrl: z.union([z.string().trim().url().max(500), z.literal("")]).optional(),
  note: z.string().trim().max(2000).optional(),
  source: z.string().trim().max(100).optional(),
  startedAt: z.coerce.number(),
  company_site: z.string().max(0).optional(),
});

const value = (form: FormData, key: string) => String(form.get(key) ?? "");
const safeFilename = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, "-");

export async function POST(request: Request) {
  let uploadedUrl: string | null = null;
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("multipart/form-data") && !contentType.includes("application/x-www-form-urlencoded")) {
    return NextResponse.json({ ok: false, message: "Submit the application form using supported form data." }, { status: 415 });
  }

  try {
    const form = await request.formData();
    const parsed = schema.safeParse({
      name: value(form, "name"), email: value(form, "email"), country: value(form, "country"),
      languages: value(form, "languages"), education: value(form, "education"), discipline: value(form, "discipline"),
      coding: value(form, "coding"), experience: value(form, "experience"), availability: value(form, "availability"),
      profileUrl: value(form, "profileUrl"), note: value(form, "note"), source: value(form, "source"),
      startedAt: value(form, "startedAt"), company_site: value(form, "company_site"),
    });

    if (!parsed.success || Date.now() - parsed.data.startedAt < 1200) {
      return NextResponse.json({ ok: false, message: "Please review the required fields and try again." }, { status: 400 });
    }

    const file = form.get("cv");
    if (!(file instanceof File) || !file.size) {
      return NextResponse.json({ ok: false, message: "Please attach your CV or résumé." }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ ok: false, message: "Your CV must be no larger than 4 MB." }, { status: 400 });
    }
    if (!allowed.has(file.type)) {
      return NextResponse.json({ ok: false, message: "Upload your CV as a PDF or DOCX file." }, { status: 400 });
    }

    const db = getDb();
    const id = crypto.randomUUID();
    const reference = `TRAIN-${id.slice(0, 8).toUpperCase()}`;
    const blob = await put(`applications/${id}/${safeFilename(file.name)}`, file, {
      access: "private",
      addRandomSuffix: true,
      contentType: file.type,
    });
    uploadedUrl = blob.url;

    await db.insert(applications).values({
      id,
      name: parsed.data.name,
      email: parsed.data.email,
      country: parsed.data.country,
      languages: parsed.data.languages,
      education: parsed.data.education || null,
      discipline: parsed.data.discipline,
      coding: parsed.data.coding || null,
      experience: parsed.data.experience,
      availability: parsed.data.availability,
      profileUrl: parsed.data.profileUrl || null,
      note: parsed.data.note || null,
      cvKey: blob.pathname,
      source: parsed.data.source || "website",
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true, reference });
  } catch (error) {
    if (uploadedUrl) await del(uploadedUrl).catch(() => undefined);
    console.error("Trainer application failed", error);
    return NextResponse.json({ ok: false, message: "The application service is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }
}

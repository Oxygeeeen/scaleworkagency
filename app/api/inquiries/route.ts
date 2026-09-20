import { del, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { inquiries } from "@/db/schema";
import { sendSubmissionEmails, type SubmissionEmailResult } from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_FILE_SIZE = 4_000_000;
const allowed = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/csv",
  "text/plain",
]);

const schema = z.object({
  projectType: z.string().trim().min(2).max(120),
  expertise: z.string().trim().max(300).optional(),
  languages: z.string().trim().max(300).optional(),
  volume: z.string().trim().max(120).optional(),
  timeline: z.string().trim().max(120).optional(),
  sensitivity: z.string().trim().max(120).optional(),
  budget: z.string().trim().max(120).optional(),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  company: z.string().trim().min(2).max(180),
  role: z.string().trim().max(160).optional(),
  details: z.string().trim().min(20).max(5000),
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
    return NextResponse.json({ ok: false, message: "Submit the enquiry form using supported form data." }, { status: 415 });
  }

  try {
    const form = await request.formData();
    const parsed = schema.safeParse({
      projectType: value(form, "projectType"), expertise: value(form, "expertise"), languages: value(form, "languages"),
      volume: value(form, "volume"), timeline: value(form, "timeline"), sensitivity: value(form, "sensitivity"),
      budget: value(form, "budget"), name: value(form, "name"), email: value(form, "email"), company: value(form, "company"),
      role: value(form, "role"), details: value(form, "details"), source: value(form, "source"),
      startedAt: value(form, "startedAt"), company_site: value(form, "company_site"),
    });

    if (!parsed.success || Date.now() - parsed.data.startedAt < 1200) {
      return NextResponse.json({ ok: false, message: "Please review the required fields and try again." }, { status: 400 });
    }

    const file = form.get("attachment");
    if (file instanceof File && file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ ok: false, message: "The attachment must be no larger than 4 MB." }, { status: 400 });
    }
    if (file instanceof File && file.size && !allowed.has(file.type)) {
      return NextResponse.json({ ok: false, message: "Use PDF, DOCX, CSV or TXT for attachments." }, { status: 400 });
    }
    if (!process.env.DATABASE_URL || (file instanceof File && file.size && !process.env.BLOB_READ_WRITE_TOKEN)) {
      return NextResponse.json({
        ok: false,
        message: "Project enquiries are not configured yet. Please email hello@scaleworkagency.com while we finish the secure submission setup.",
      }, { status: 503 });
    }

    const db = getDb();
    const id = crypto.randomUUID();
    const reference = `SWA-${id.slice(0, 8).toUpperCase()}`;
    let attachmentKey: string | null = null;
    let emailAttachment: { filename: string; content: Buffer; contentType: string } | undefined;

    if (file instanceof File && file.size) {
      emailAttachment = { filename: file.name, content: Buffer.from(await file.arrayBuffer()), contentType: file.type };
      const blob = await put(`inquiries/${id}/${safeFilename(file.name)}`, file, {
        access: "private",
        addRandomSuffix: true,
        contentType: file.type,
      });
      uploadedUrl = blob.url;
      attachmentKey = blob.pathname;
    }

    await db.insert(inquiries).values({
      id,
      projectType: parsed.data.projectType,
      expertise: parsed.data.expertise || null,
      languages: parsed.data.languages || null,
      volume: parsed.data.volume || null,
      timeline: parsed.data.timeline || null,
      sensitivity: parsed.data.sensitivity || null,
      budget: parsed.data.budget || null,
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company,
      role: parsed.data.role || null,
      details: parsed.data.details,
      attachmentKey,
      source: parsed.data.source || "website",
      createdAt: new Date(),
    });

    let notifications: SubmissionEmailResult = { configured: false, confirmationSent: false, adminSent: false };
    try {
      notifications = await sendSubmissionEmails({
        kind: "project",
        reference,
        recipientName: parsed.data.name,
        recipientEmail: parsed.data.email,
        headline: `${parsed.data.company} · ${parsed.data.projectType}`,
        message: parsed.data.details,
        details: [
          { label: "Contact", value: parsed.data.name },
          { label: "Email", value: parsed.data.email },
          { label: "Company", value: parsed.data.company },
          { label: "Role", value: parsed.data.role },
          { label: "Project type", value: parsed.data.projectType },
          { label: "Expertise", value: parsed.data.expertise },
          { label: "Languages", value: parsed.data.languages },
          { label: "Expected volume", value: parsed.data.volume },
          { label: "Timeline", value: parsed.data.timeline },
          { label: "Data sensitivity", value: parsed.data.sensitivity },
          { label: "Budget", value: parsed.data.budget },
          { label: "Attached brief", value: file instanceof File && file.size ? file.name : null },
        ],
        attachment: emailAttachment,
      });
    } catch (emailError) {
      console.error("Project enquiry saved but email preparation failed", emailError);
    }

    return NextResponse.json({ ok: true, reference, notifications });
  } catch (error) {
    if (uploadedUrl) await del(uploadedUrl).catch(() => undefined);
    console.error("Project enquiry failed", error);
    return NextResponse.json({ ok: false, message: "The secure enquiry service is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }
}

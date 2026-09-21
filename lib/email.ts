import { Resend, type Attachment, type CreateEmailOptions } from "resend";
import { getSiteUrl } from "@/lib/site-url";

type SubmissionKind = "project" | "application";

type SubmissionEmailInput = {
  kind: SubmissionKind;
  reference: string;
  recipientName: string;
  recipientEmail: string;
  headline: string;
  message: string;
  details: Array<{ label: string; value?: string | null }>;
  attachment?: Attachment;
};

export type SubmissionEmailResult = {
  configured: boolean;
  confirmationSent: boolean;
  adminSent: boolean;
};

const defaultAdminEmail = "hello@scaleworkagency.com";
const defaultFrom = "ScaleWorkAgency <hello@scaleworkagency.com>";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

function safeHeader(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function emailShell(preheader: string, content: string) {
  const siteUrl = getSiteUrl().origin;
  const logoUrl = `${siteUrl}/email-logo.png`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(preheader)}</title>
    <style>
      @media (max-width: 620px) {
        .email-wrap { width: 100% !important; }
        .email-pad { padding-left: 24px !important; padding-right: 24px !important; }
        .detail-label, .detail-value { display: block !important; width: 100% !important; }
        .detail-value { padding-top: 4px !important; text-align: left !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#f5f3ee;color:#0a1020;font-family:Inter,Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f3ee;">
      <tr><td align="center" style="padding:36px 14px;">
        <table role="presentation" class="email-wrap" width="620" cellspacing="0" cellpadding="0" style="width:620px;max-width:620px;background:#ffffff;border:1px solid #dcdad4;border-radius:24px;overflow:hidden;box-shadow:0 18px 50px rgba(10,16,32,.09);">
          <tr><td class="email-pad" style="padding:24px 38px;background:#0a1020;color:#ffffff;border-bottom:4px solid #c6f56b;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td width="58" valign="middle">
                  <a href="${escapeHtml(siteUrl)}" style="display:inline-block;text-decoration:none;"><img src="${escapeHtml(logoUrl)}" width="46" height="46" alt="" style="display:block;width:46px;height:46px;border:0;border-radius:12px;"></a>
                </td>
                <td valign="middle">
                  <a href="${escapeHtml(siteUrl)}" style="color:#ffffff;text-decoration:none;font-size:21px;font-weight:800;letter-spacing:-.7px;">ScaleWork<span style="color:#c6f56b;">Agency</span></a>
                  <div style="margin-top:7px;color:#bdc6d9;font-size:10px;font-weight:700;letter-spacing:1.45px;text-transform:uppercase;">Human intelligence for better AI</div>
                </td>
              </tr>
            </table>
          </td></tr>
          ${content}
          <tr><td class="email-pad" style="padding:25px 38px;background:#0a1020;border-top:1px solid #202a40;color:#aeb7ca;font-size:12px;line-height:1.7;">
            <strong style="color:#ffffff;">ScaleWorkAgency</strong> · Managed AI training data services<br>
            <a href="mailto:${defaultAdminEmail}" style="color:#c6f56b;text-decoration:none;font-weight:700;">${defaultAdminEmail}</a>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function referenceCard(reference: string) {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:26px 0;background:#e8efff;border:1px solid #c8d8ff;border-radius:14px;">
    <tr><td style="padding:17px 20px;color:#47628f;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">Submission reference</td>
    <td align="right" style="padding:17px 20px;color:#0a1020;font-size:15px;font-weight:800;">${escapeHtml(reference)}</td></tr>
  </table>`;
}

function confirmationHtml(input: SubmissionEmailInput) {
  const isProject = input.kind === "project";
  const nextSteps = isProject
    ? ["A delivery specialist reviews your brief.", "We assess the expertise, workflow and controls required.", "We contact you with the most useful next step."]
    : ["Our contributor team reviews your experience.", "Relevant applications may be invited to an assessment.", "Project opportunities depend on demand and successful qualification."];
  const title = isProject ? "Your project brief is with us." : "Your application is with us.";
  const intro = isProject
    ? "Thank you for considering ScaleWorkAgency. We have securely received your enquiry and will review it before responding."
    : "Thank you for applying to contribute your expertise to AI training projects. Your information has been securely received.";

  return emailShell(title, `
    <tr><td class="email-pad" style="padding:42px 38px 18px;">
      <div style="display:inline-block;padding:7px 10px;border-radius:999px;background:#e8f8c8;color:#344b12;font-size:10px;font-weight:800;letter-spacing:1.3px;text-transform:uppercase;">Received securely</div>
      <h1 style="margin:20px 0 12px;color:#0a1020;font-size:34px;line-height:1.12;letter-spacing:-1.2px;">${title}</h1>
      <p style="margin:0;color:#535e73;font-size:16px;line-height:1.7;">Hello ${escapeHtml(input.recipientName)},</p>
      <p style="margin:12px 0 0;color:#535e73;font-size:16px;line-height:1.7;">${intro}</p>
      ${referenceCard(input.reference)}
      <h2 style="margin:0 0 15px;color:#0a1020;font-size:17px;">What happens next</h2>
      ${nextSteps.map((step, index) => `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 10px;"><tr><td width="34" valign="top"><span style="display:inline-block;width:26px;height:26px;border-radius:50%;background:#0a1020;color:#c6f56b;text-align:center;line-height:26px;font-size:11px;font-weight:800;">${index + 1}</span></td><td style="padding:3px 0;color:#535e73;font-size:14px;line-height:1.55;">${step}</td></tr></table>`).join("")}
    </td></tr>
    <tr><td class="email-pad" style="padding:12px 38px 42px;">
      <div style="padding:18px 20px;background:#f5f3ee;border:1px solid #e4e1d9;border-radius:14px;color:#606a7d;font-size:13px;line-height:1.65;">Please keep your reference for any follow-up. You can reply directly to this email if you need to add context.</div>
    </td></tr>`);
}

function adminHtml(input: SubmissionEmailInput) {
  const detailRows = input.details
    .filter((detail) => detail.value)
    .map((detail) => `<tr>
      <td class="detail-label" width="38%" style="padding:11px 0;border-bottom:1px solid #e7e4dc;color:#6d7688;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;">${escapeHtml(detail.label)}</td>
      <td class="detail-value" style="padding:11px 0;border-bottom:1px solid #e7e4dc;color:#0a1020;font-size:14px;line-height:1.55;text-align:right;">${escapeHtml(detail.value ?? "")}</td>
    </tr>`).join("");
  const replySubject = encodeURIComponent(`Re: ${input.reference}`);

  return emailShell(input.headline, `
    <tr><td class="email-pad" style="padding:40px 38px 18px;">
      <div style="display:inline-block;padding:7px 10px;border-radius:999px;background:#ffdfbb;color:#69400c;font-size:10px;font-weight:800;letter-spacing:1.3px;text-transform:uppercase;">New website submission</div>
      <h1 style="margin:20px 0 10px;color:#0a1020;font-size:31px;line-height:1.15;letter-spacing:-1px;">${escapeHtml(input.headline)}</h1>
      <p style="margin:0;color:#606a7d;font-size:14px;line-height:1.65;">Reference <strong style="color:#0a1020;">${escapeHtml(input.reference)}</strong></p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:25px 0 8px;">${detailRows}</table>
    </td></tr>
    <tr><td class="email-pad" style="padding:8px 38px 24px;">
      <div style="margin-bottom:9px;color:#6d7688;font-size:11px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;">Message</div>
      <div style="padding:20px;background:#f0f4ff;border-left:4px solid #98b8ff;border-radius:0 14px 14px 0;color:#253149;font-size:14px;line-height:1.75;white-space:pre-wrap;">${escapeHtml(input.message)}</div>
    </td></tr>
    <tr><td class="email-pad" style="padding:4px 38px 42px;">
      <a href="mailto:${escapeHtml(input.recipientEmail)}?subject=${replySubject}" style="display:inline-block;padding:14px 20px;border-radius:999px;background:#c6f56b;color:#0a1020;text-decoration:none;font-size:13px;font-weight:800;">Reply to ${escapeHtml(input.recipientName)}</a>
      ${input.attachment ? `<div style="margin-top:16px;color:#606a7d;font-size:12px;">The submitted file is attached to this notification and stored securely with the submission.</div>` : ""}
    </td></tr>`);
}

function confirmationText(input: SubmissionEmailInput) {
  const intro = input.kind === "project"
    ? "We securely received your project enquiry and will review it before responding."
    : "We securely received your AI trainer application. Opportunities depend on project demand and successful qualification.";
  return `Hello ${input.recipientName},\n\n${intro}\n\nReference: ${input.reference}\n\nKeep this reference for any follow-up. You can reply to this email if you need to add context.\n\nScaleWorkAgency\n${defaultAdminEmail}`;
}

function adminText(input: SubmissionEmailInput) {
  const details = input.details.filter((detail) => detail.value).map((detail) => `${detail.label}: ${detail.value}`).join("\n");
  return `${input.headline}\nReference: ${input.reference}\n\n${details}\n\nMessage:\n${input.message}`;
}

async function deliver(resend: Resend, email: CreateEmailOptions, idempotencyKey: string) {
  const response = await resend.emails.send(email, { idempotencyKey });
  if (response.error) throw new Error(response.error.message);
}

export async function sendSubmissionEmails(input: SubmissionEmailInput): Promise<SubmissionEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn(`Email delivery skipped for ${input.reference}: RESEND_API_KEY is not configured.`);
    return { configured: false, confirmationSent: false, adminSent: false };
  }

  const resend = new Resend(apiKey);
  const from = process.env.EMAIL_FROM?.trim() || defaultFrom;
  const adminEmail = process.env.ADMIN_EMAIL?.trim() || defaultAdminEmail;
  const confirmationSubject = input.kind === "project"
    ? `We received your project brief · ${input.reference}`
    : `We received your AI trainer application · ${input.reference}`;
  const adminSubject = input.kind === "project"
    ? `New project enquiry · ${safeHeader(input.headline)} · ${input.reference}`
    : `New trainer application · ${safeHeader(input.recipientName)} · ${input.reference}`;

  const [confirmation, admin] = await Promise.allSettled([
    deliver(resend, {
      from,
      to: input.recipientEmail,
      replyTo: adminEmail,
      subject: confirmationSubject,
      html: confirmationHtml(input),
      text: confirmationText(input),
      tags: [{ name: "submission", value: input.kind }],
    }, `${input.reference.toLowerCase()}-confirmation`),
    deliver(resend, {
      from,
      to: adminEmail,
      replyTo: input.recipientEmail,
      subject: adminSubject,
      html: adminHtml(input),
      text: adminText(input),
      attachments: input.attachment ? [input.attachment] : undefined,
      tags: [{ name: "submission", value: input.kind }],
    }, `${input.reference.toLowerCase()}-admin`),
  ]);

  const result = {
    configured: true,
    confirmationSent: confirmation.status === "fulfilled",
    adminSent: admin.status === "fulfilled",
  };

  if (!result.confirmationSent || !result.adminSent) {
    console.error("Submission email delivery was incomplete", {
      reference: input.reference,
      confirmation: confirmation.status === "rejected" ? confirmation.reason instanceof Error ? confirmation.reason.message : "Unknown error" : "sent",
      admin: admin.status === "rejected" ? admin.reason instanceof Error ? admin.reason.message : "Unknown error" : "sent",
    });
  }

  return result;
}

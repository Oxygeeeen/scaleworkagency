"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, LoaderCircle, Paperclip, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";

const projectTypes = ["AI response evaluation", "Data annotation and labelling", "RLHF programme", "Model safety testing", "Prompt and answer creation", "Expert AI training tasks", "Freelance workforce management", "Not sure yet"];
const MIN_PROJECT_CONTEXT = 20;

type ProjectDraft = {
  projectType: string; expertise: string; languages: string; volume: string; timeline: string;
  sensitivity: string; budget: string; name: string; email: string; company: string; role: string; details: string;
};

const initial: ProjectDraft = { projectType: "", expertise: "", languages: "", volume: "", timeline: "", sensitivity: "", budget: "", name: "", email: "", company: "", role: "", details: "" };

function TextField({ label, name, value, onChange, type = "text", required = false, placeholder }: { label: string; name: keyof ProjectDraft; value: string; onChange: (name: keyof ProjectDraft, value: string) => void; type?: string; required?: boolean; placeholder?: string }) {
  return <label className="field"><span>{label}{required && <b> *</b>}</span><input name={name} type={type} value={value} onChange={(event) => onChange(name, event.target.value)} required={required} placeholder={placeholder} /></label>;
}

function SelectField({ label, value, onChange, options, placeholder, required = false }: { label: string; value: string; onChange: (value: string) => void; options: string[]; placeholder: string; required?: boolean }) {
  return <label className="field"><span>{label}{required && <b> *</b>}</span><Select value={value} onValueChange={(next) => next && onChange(String(next))}><SelectTrigger className="form-select"><SelectValue placeholder={placeholder} /></SelectTrigger><SelectContent>{options.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></label>;
}

export function ProjectForm() {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<ProjectDraft>(initial);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [reference, setReference] = useState("");
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [detailsTouched, setDetailsTouched] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const startedAt = useRef<number | null>(null);
  const progress = useMemo(() => (step / 3) * 100, [step]);
  const detailsLength = draft.details.trim().length;
  const detailsError = detailsTouched && detailsLength < MIN_PROJECT_CONTEXT;
  const update = (name: keyof ProjectDraft, value: string) => setDraft((current) => ({ ...current, [name]: value }));

  async function send(payload: ProjectDraft, file?: File | null) {
    const body = new FormData();
    Object.entries(payload).forEach(([key, value]) => body.set(key, value));
    body.set("startedAt", String(startedAt.current ?? Date.now()));
    body.set("source", "website-project-enquiry");
    if (file && file.size) body.set("attachment", file);
    const response = await fetch("/api/inquiries", { method: "POST", body });
    const result = await response.json() as { ok?: boolean; reference?: string; message?: string; notifications?: { confirmationSent?: boolean } };
    if (!response.ok || !result.ok) throw new Error(result.message || "We could not send your enquiry.");
    return result;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDetailsTouched(true);
    if (detailsLength < MIN_PROJECT_CONTEXT) {
      toast.error(`Add at least ${MIN_PROJECT_CONTEXT} characters of project context.`);
      return;
    }
    if (!consent) { toast.error("Please confirm that we may use these details to respond."); return; }
    setStatus("submitting");
    try {
      const result = await send(draft, fileRef.current?.files?.[0]);
      setReference(result.reference || "Received");
      setConfirmationSent(Boolean(result.notifications?.confirmationSent));
      setStatus("success");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "We could not send your enquiry.");
      setStatus("idle");
    }
  }

  useEffect(() => {
    startedAt.current = Date.now();
    const context = (document as Document & { modelContext?: { registerTool?: (tool: unknown, options?: { signal?: AbortSignal }) => unknown } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: "submit_project_enquiry",
      title: "Submit project enquiry",
      description: "Submit a ScaleWorkAgency project enquiry using the same workflow as the visible consultation form.",
      inputSchema: { type: "object", additionalProperties: false, required: ["projectType", "name", "email", "company", "details"], properties: { projectType: { type: "string" }, expertise: { type: "string" }, languages: { type: "string" }, volume: { type: "string" }, timeline: { type: "string" }, sensitivity: { type: "string" }, budget: { type: "string" }, name: { type: "string" }, email: { type: "string" }, company: { type: "string" }, role: { type: "string" }, details: { type: "string" } } },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: async (input: unknown) => {
        const payload = { ...initial, ...(input as Partial<ProjectDraft>) };
        setDraft(payload); setStep(3); setStatus("submitting");
        const result = await send(payload); setReference(result.reference || "Received"); setConfirmationSent(Boolean(result.notifications?.confirmationSent)); setStatus("success");
        return { status: "received", reference: result.reference };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);

  if (status === "success") {
    return <div className="form-success"><span><Check size={24} /></span><p className="eyebrow">Enquiry received</p><h2>Thank you. We’ll review the brief and respond with the right next step.</h2><p>Your reference is <strong>{reference}</strong>. Keep it if you need to follow up.</p>{confirmationSent && <p>A confirmation has been sent to <strong>{draft.email}</strong>.</p>}<Link className="button button-dark" href="/">Return to the homepage</Link></div>;
  }

  return (
    <form className="project-form" onSubmit={submit}>
      <Toaster position="top-center" />
      <div className="form-progress"><div><span>Project enquiry</span><strong>Step {step} of 3</strong></div><Progress value={progress} /></div>
      {step === 1 && <fieldset><legend>What are you building?</legend><p className="form-intro">Start with the outcome. We can help shape the operating model during discovery.</p><div className="form-grid"><SelectField label="Project type" required value={draft.projectType} onChange={(value) => update("projectType", value)} options={projectTypes} placeholder="Choose a service" /><TextField label="Expertise required" name="expertise" value={draft.expertise} onChange={update} placeholder="e.g. Python, mathematics, French" /><TextField label="Languages" name="languages" value={draft.languages} onChange={update} placeholder="e.g. English and French" /></div></fieldset>}
      {step === 2 && <fieldset><legend>What does delivery look like?</legend><p className="form-intro">Estimates are useful. They do not need to be final at this stage.</p><div className="form-grid form-grid-two"><SelectField label="Expected volume" value={draft.volume} onChange={(value) => update("volume", value)} options={["Pilot or proof of concept", "Up to 10,000 tasks", "10,000–100,000 tasks", "More than 100,000 tasks", "Not yet defined"]} placeholder="Select a range" /><SelectField label="Timeline" value={draft.timeline} onChange={(value) => update("timeline", value)} options={["As soon as possible", "Within 4 weeks", "1–3 months", "3–6 months", "Exploratory"]} placeholder="Select a timeline" /><SelectField label="Data sensitivity" value={draft.sensitivity} onChange={(value) => update("sensitivity", value)} options={["Public or synthetic data", "Internal business data", "Confidential / restricted", "Personal or sensitive data", "To be assessed"]} placeholder="Choose the closest fit" /><SelectField label="Indicative budget" value={draft.budget} onChange={(value) => update("budget", value)} options={["Under $10,000", "$10,000–$50,000", "$50,000–$150,000", "$150,000+", "Not yet defined"]} placeholder="Select a range" /></div></fieldset>}
      {step === 3 && <fieldset><legend>Who should we speak with?</legend><p className="form-intro">A member of the delivery team will review the information before responding.</p><div className="form-grid form-grid-two"><TextField label="Full name" required name="name" value={draft.name} onChange={update} /><TextField label="Work email" required name="email" type="email" value={draft.email} onChange={update} /><TextField label="Company" required name="company" value={draft.company} onChange={update} /><TextField label="Role" name="role" value={draft.role} onChange={update} /></div><label className={`field${detailsError ? " field-error" : ""}`}><span>Project context <b>*</b></span><textarea value={draft.details} onChange={(event) => update("details", event.target.value)} onBlur={() => setDetailsTouched(true)} onInvalid={(event) => { event.preventDefault(); setDetailsTouched(true); }} required minLength={MIN_PROJECT_CONTEXT} rows={5} aria-invalid={detailsError} aria-describedby="project-context-guidance" placeholder="Share the model, data, desired outcome and any constraints we should understand." /><span className="field-meta" id="project-context-guidance"><small className={detailsError ? "field-message field-message-error" : "field-message"} role={detailsError ? "alert" : undefined}>{detailsError ? `Add ${MIN_PROJECT_CONTEXT - detailsLength} more character${MIN_PROJECT_CONTEXT - detailsLength === 1 ? "" : "s"} so we can understand the project.` : "Include the model, data, outcome or key constraints."}</small><small className="field-counter">{detailsLength} / {MIN_PROJECT_CONTEXT} minimum</small></span></label><label className="upload-field"><Paperclip size={18} /><span><strong>Attach a brief</strong><small>Optional. PDF, DOCX, CSV or TXT, up to 4 MB.</small></span><input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.csv,.txt" /></label><div className="consent-row"><Checkbox id="project-consent" checked={consent} onCheckedChange={(value) => setConsent(Boolean(value))} /><label htmlFor="project-consent">I agree that ScaleWorkAgency may use these details to respond to this enquiry. <Link href="/legal/privacy">Privacy notice</Link></label></div></fieldset>}
      <input className="honeypot" type="text" name="company_site" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="form-controls">{step > 1 ? <button className="button button-outline" type="button" onClick={() => setStep((value) => value - 1)}><ArrowLeft size={17} /> Back</button> : <span />} {step < 3 ? <button className="button button-dark" type="button" onClick={() => { if (step === 1 && !draft.projectType) { toast.error("Choose a project type to continue."); return; } setStep((value) => value + 1); }}>Continue <ArrowRight size={17} /></button> : <button className="button button-dark" type="submit" disabled={status === "submitting"}>{status === "submitting" ? <LoaderCircle className="spin" size={18} /> : <ShieldCheck size={18} />} Send secure enquiry</button>}</div>
    </form>
  );
}

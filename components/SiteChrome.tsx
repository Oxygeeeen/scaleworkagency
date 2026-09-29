import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown, ShieldCheck } from "lucide-react";
import { MobileMenu } from "@/components/MobileMenu";

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.5H3.56V9.04h3.56V20.5Zm13.33 0h-3.55v-5.58c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.68H9.36V9.04h3.41v1.57h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28Z" />
    </svg>
  );
}

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link className={`brand${inverse ? " brand-inverse" : ""}`} href="/" aria-label="ScaleWorkAgency home">
      <Image className="brand-logo" src="/favicon.svg" alt="" width={40} height={40} />
      <span>ScaleWork</span><em>Agency</em>
    </Link>
  );
}

export function SiteHeader({ inverse = false }: { inverse?: boolean }) {
  return (
    <header className={`site-header${inverse ? " header-inverse" : ""}`}>
      <Brand inverse />
      <nav className="desktop-nav" aria-label="Primary navigation">
        <Link href="/services">Services <ChevronDown size={14} /></Link>
        <Link href="/how-it-works">How it works</Link>
        <Link href="/quality-security">Quality &amp; security</Link>
        <Link href="/insights">Insights</Link>
      </nav>
      <div className="header-actions">
        <Link className="text-link" href="/freelancers">For freelancers</Link>
        <Link className="button button-small button-light" href="/contact">
          Discuss a project <ArrowRight size={15} />
        </Link>
        <MobileMenu />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-cta">
        <p className="eyebrow eyebrow-light">Start with a clear brief</p>
        <h2>Turn complex data work into a managed delivery programme.</h2>
        <p>Tell us what your model needs. We’ll help define the people, workflow and quality controls around it.</p>
        <Link className="button button-light" href="/contact">Discuss a project <ArrowRight size={17} /></Link>
      </div>
      <div className="footer-grid">
        <div className="footer-brand"><Brand inverse /><p>Managed human expertise for better artificial intelligence systems.</p><span><ShieldCheck size={16} /> Controlled access. Human-reviewed delivery.</span></div>
        <div><h3>Capabilities</h3><Link href="/services/ai-response-evaluation">Response evaluation</Link><Link href="/services/data-annotation-labelling">Data annotation</Link><Link href="/services/rlhf-services">RLHF services</Link><Link href="/services/model-safety-quality-testing">Safety testing</Link></div>
        <div><h3>Company</h3><Link href="/about">About</Link><Link href="/how-it-works">How it works</Link><Link href="/quality-security">Quality &amp; security</Link><Link href="/insights">Insights</Link></div>
        <div><h3>Contributors</h3><Link href="/freelancers">For freelancers</Link><Link href="/apply">Apply as an AI trainer</Link><Link href="/legal/contributor-notice">Contributor notice</Link></div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 ScaleWorkAgency</span>
        <div className="footer-legal"><Link href="/legal/privacy">Privacy</Link><Link href="/legal/terms">Terms</Link><Link href="/legal/cookies">Cookies</Link></div>
        <a className="footer-social-link" href="https://www.linkedin.com/company/scaleworkagency" target="_blank" rel="noreferrer" aria-label="ScaleWorkAgency on LinkedIn">
          <LinkedInIcon />
        </a>
      </div>
    </footer>
  );
}

export function PageIntro({ eyebrow, title, text, dark = false }: { eyebrow: string; title: string; text: string; dark?: boolean }) {
  return (
    <section className={`page-intro${dark ? " page-intro-dark" : ""}`}>
      <p className={`eyebrow${dark ? " eyebrow-light" : ""}`}>{eyebrow}</p>
      <h1>{title}</h1><p>{text}</p>
    </section>
  );
}

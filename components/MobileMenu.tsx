"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  ["Services", "/services"],
  ["Industries", "/industries"],
  ["How it works", "/how-it-works"],
  ["Quality & security", "/quality-security"],
  ["About", "/about"],
  ["Insights", "/insights"],
  ["For freelancers", "/freelancers"],
  ["Discuss a project", "/contact"],
] as const;

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname;
      setOpen(false);
    }
  }, [pathname]);

  return (
    <div className={`mobile-menu${open ? " is-open" : ""}`}>
      <button type="button" aria-controls="mobile-navigation" aria-expanded={open} aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen((value) => !value)}>
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      {open && <nav id="mobile-navigation" aria-label="Mobile navigation">
        {links.map(([label, href]) => (
          <Link href={href} key={href} onClick={() => pathname === href && setOpen(false)}>
            {label}
          </Link>
        ))}
      </nav>}
    </div>
  );
}

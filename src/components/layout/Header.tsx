"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav } from "@/lib/site";

// Floating Linear/Raycast-style nav bar: a centered glassy rounded bar with a
// subtle border + top highlight, gray center links, and a light pill CTA.
const BAR_GRADIENT =
  "linear-gradient(136deg, rgba(17,18,20,0.75) 5%, rgba(12,13,15,0.9) 76%)";
const PILL_SHADOW =
  "0 0 0 2px rgba(0,0,0,0.5), 0 0 14px 0 rgba(255,255,255,0.19), inset 0 -1px 0.4px 0 rgba(0,0,0,0.2), inset 0 1px 0.4px 0 #fff";

const centerLinks = nav.slice(1, -1); // Services … Insights

function Star({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 0c.6 6.3 5.7 11.4 12 12-6.3.6-11.4 5.7-12 12-.6-6.3-5.7-11.4-12-12C6.3 11.4 11.4 6.3 12 0z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-3 md:pt-4">
      <div className="container-x">
        <div
          className="relative flex h-[64px] items-center justify-center rounded-2xl border border-white/[0.06] px-3 backdrop-blur-md md:h-[68px] md:px-4"
          style={{
            backgroundImage: BAR_GRADIENT,
            boxShadow: "inset 0 1px 1px 0 rgba(255,255,255,0.14)",
          }}
        >
          {/* Logo — left */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="absolute left-4 font-display text-xl font-bold tracking-tight md:left-6"
          >
            KIOSK<span className="text-accent">.</span>
          </Link>

          {/* Center links */}
          <nav className="hidden items-center gap-1 lg:flex">
            {centerLinks.map((item) => (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-sm font-medium tracking-[0.2px] text-[#9c9c9d] transition-colors hover:text-paper"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    <div className="min-w-56 rounded-2xl border border-line bg-surface p-2 shadow-2xl shadow-black/50">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-xl px-3 py-2 text-sm text-mist transition-colors hover:bg-surface-2 hover:text-paper"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right group */}
          <div className="absolute right-3 hidden items-center gap-5 lg:flex md:right-5">
            <Link
              href="/contact"
              className="text-sm font-medium tracking-[0.2px] text-[#9c9c9d] transition-colors hover:text-paper"
            >
              Contact
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[36px] items-center gap-2 rounded-lg bg-[#e6e6e6] px-3 text-sm font-medium tracking-[0.2px] text-[#2f3031] transition-colors hover:bg-white"
              style={{ boxShadow: PILL_SHADOW }}
            >
              <Star />
              Book A Strategy Call
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="absolute right-3 z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          >
            <span
              className={`h-0.5 w-6 bg-paper transition-all duration-300 ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-paper transition-all duration-300 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-paper transition-all duration-300 ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 top-[76px] z-40 origin-top overflow-y-auto bg-ink px-6 pb-12 pt-4 transition-all duration-300 lg:hidden ${
          open
            ? "visible opacity-100"
            : "pointer-events-none invisible -translate-y-2 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1">
          {nav.map((item) => (
            <div key={item.href} className="border-b border-line/60 py-1">
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-3 font-display text-lg"
              >
                {item.label}
              </Link>
              {item.children && (
                <div className="flex flex-col gap-1 pb-2 pl-3">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setOpen(false)}
                      className="py-1.5 text-sm text-mist"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-6 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#e6e6e6] px-4 text-sm font-medium text-[#2f3031]"
            style={{ boxShadow: PILL_SHADOW }}
          >
            <Star />
            Book A Strategy Call
          </Link>
        </nav>
      </div>
    </header>
  );
}

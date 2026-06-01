"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { nav } from "@/lib/site";

type NavEntry = (typeof nav)[number];

// Floating Linear/Raycast-style nav bar: a centered glassy rounded bar with a
// subtle border + top highlight, gray center links, and a light pill CTA.
const BAR_GRADIENT =
  "linear-gradient(136deg, rgba(17,18,20,0.75) 5%, rgba(12,13,15,0.9) 76%)";
const PILL_SHADOW =
  "0 0 0 2px rgba(0,0,0,0.5), 0 0 14px 0 rgba(255,255,255,0.19), inset 0 -1px 0.4px 0 rgba(0,0,0,0.2), inset 0 1px 0.4px 0 #fff";

// Active segmented-control pill (Raycast/Linear material from Figma): a soft
// gray radial dome lit from the top, with a faint white top highlight.
const ACTIVE_PILL =
  "radial-gradient(120% 145% at 50% 0%, #5a5a5a 0%, #3a3a3a 50%, #2a2a2a 75%, #1a1a1a 100%)";
const ACTIVE_PILL_SHADOW =
  "inset 0 1px 0.5px 0 rgba(255,255,255,0.22), 0 1px 2px 0 rgba(0,0,0,0.45)";

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

// A single segmented-control nav item. The pill + text are eased in/out with
// GSAP so hover feels natural: a short intent delay before it lights up, a
// soft power curve, and a quicker, delay-free fade on the way out.
const PILL_IDLE = "#6a6b6c";
const PILL_ACTIVE_TEXT = "#ffffff";

function NavLink({
  item,
  active,
  isOpen,
  onOpen,
  onClose,
}: {
  item: NavEntry;
  active: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const pillRef = useRef<HTMLSpanElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    // Pill + text only animate for non-active items (active keeps its pill).
    // overwrite:true kills any pending leave tween (even mid-delay) so the
    // pill can never get stuck "on".
    if (!active) {
      gsap.to(pillRef.current, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.5,
        delay: 0.12,
        ease: "power3.out",
        overwrite: true,
      });
      gsap.to(linkRef.current, {
        color: PILL_ACTIVE_TEXT,
        duration: 0.5,
        delay: 0.12,
        ease: "power3.out",
        overwrite: true,
      });
    }
    onOpen();
  };

  const handleLeave = () => {
    if (!active) {
      gsap.to(pillRef.current, {
        autoAlpha: 0,
        scale: 0.92,
        duration: 0.32,
        ease: "power2.out",
        overwrite: true,
      });
      gsap.to(linkRef.current, {
        color: PILL_IDLE,
        duration: 0.32,
        ease: "power2.out",
        overwrite: true,
      });
    }
    onClose();
  };

  // The dropdown is driven by a single nav-level "open" value, so only one can
  // ever be open. Opening keeps the pill's intent delay + soft curve; closing
  // is quick and cancels any in-flight open tween (overwrite).
  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    gsap.to(
      el,
      isOpen
        ? {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            delay: 0.1,
            ease: "power3.out",
            overwrite: true,
          }
        : {
            autoAlpha: 0,
            y: -8,
            duration: 0.22,
            ease: "power2.out",
            overwrite: true,
          },
    );
  }, [isOpen]);

  return (
    <div
      className="group relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Segmented-control pill behind the label (does not affect layout) */}
      <span
        ref={pillRef}
        aria-hidden
        className="absolute -inset-x-3.5 -inset-y-2 rounded-full"
        style={{
          backgroundImage: ACTIVE_PILL,
          boxShadow: ACTIVE_PILL_SHADOW,
          opacity: active ? 1 : 0,
          visibility: active ? "visible" : "hidden",
          transform: active ? "scale(1)" : "scale(0.92)",
        }}
      />
      <Link
        ref={linkRef}
        href={item.href}
        className="relative z-10 block text-sm font-medium tracking-[0.2px]"
        style={{ color: active ? PILL_ACTIVE_TEXT : PILL_IDLE }}
      >
        {item.label}
      </Link>
      {item.children && (
        // pt-3 keeps a hover bridge between the label and the card; the card is
        // left-aligned to the item so neighbouring menus never overlap.
        // While closed the wrapper is click-through so the empty area below the
        // button can't trigger the menu — only hovering the button opens it.
        <div
          className={`absolute left-0 top-full z-20 pt-3 ${
            isOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <div
            ref={menuRef}
            className="min-w-[15rem] rounded-2xl border border-white/[0.06] p-2 backdrop-blur-md"
            style={{
              backgroundImage: BAR_GRADIENT,
              boxShadow:
                "inset 0 1px 1px 0 rgba(255,255,255,0.14), 0 24px 48px -16px rgba(0,0,0,0.65)",
              opacity: 0,
              visibility: "hidden",
              transform: "translateY(-8px)",
            }}
          >
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className="block rounded-xl px-3 py-2 text-sm font-medium tracking-[0.2px] text-[#9c9c9d] transition-colors duration-200 hover:bg-white/[0.06] hover:text-white"
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [openHref, setOpenHref] = useState<string | null>(null);
  const pathname = usePathname();

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
          className="relative flex h-[64px] items-center rounded-2xl border border-white/[0.06] px-4 backdrop-blur-md md:h-[68px] md:px-6"
          style={{
            backgroundImage: BAR_GRADIENT,
            boxShadow: "inset 0 1px 1px 0 rgba(255,255,255,0.14)",
          }}
        >
          {/* Logo — left */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="shrink-0 font-display text-xl font-bold tracking-tight"
          >
            KIOSK<span className="text-accent">.</span>
          </Link>

          {/* Left-aligned nav next to the logo — Raycast-style segmented control */}
          <nav
            className="ml-10 hidden items-center gap-9 lg:flex xl:ml-14"
            onMouseLeave={() => setOpenHref(null)}
          >
            {centerLinks.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <NavLink
                  key={item.href}
                  item={item}
                  active={active}
                  isOpen={openHref === item.href}
                  onOpen={() => setOpenHref(item.href)}
                  onClose={() =>
                    setOpenHref((cur) => (cur === item.href ? null : cur))
                  }
                />
              );
            })}
          </nav>

          {/* Right group — pushed to the right edge */}
          <div className="ml-auto hidden items-center gap-5 lg:flex">
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

"use client";

import { useEffect, useState } from "react";
import { waFor } from "@/lib/cms";
import { useContent } from "./Content";

/**
 * Floating "Start a project" pill. It stays pinned to the bottom-right for the
 * whole page once the visitor has scrolled past the hero, so the CTA is never
 * more than one tap away.
 */
export default function StickyCta() {
  const { settings } = useContent();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (shown) return;
    const reveal = () => setShown(true);
    const onScroll = () => {
      if (scrollY > 420) reveal();
    };
    // Already scrolled (reload mid-page), or the visitor lingers on the hero.
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    const t = setTimeout(reveal, 6000);
    return () => {
      removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
  }, [shown]);

  return (
    <div className="fab-wrap">
      <a
        className={`fab${shown ? " in" : ""}`}
        href={waFor(settings, "Hi Kiosk — I'd like to start a project.")}
        target="_blank"
        rel="noopener"
        tabIndex={shown ? 0 : -1}
        aria-hidden={!shown}
      >
        <span className="fab-dot" />
        <span className="fab-txt">Start a project</span>
      </a>
    </div>
  );
}

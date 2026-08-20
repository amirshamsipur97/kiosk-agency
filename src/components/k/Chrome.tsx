"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { CONTACT, MENU } from "@/lib/kiosk";

/**
 * Site furniture: film grain, custom cursor, intro loader, fixed nav with the
 * live Muscat clock, and the full-screen overlay menu.
 */
export default function Chrome() {
  const [open, setOpen] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  /* ---------------------------------------------------------- loader --- */
  useEffect(() => {
    const loader = loaderRef.current;
    const pct = pctRef.current;
    if (!loader || !pct) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // rAF is throttled in a background tab, which would strand the loader on
    // screen — skip straight to the finished state instead.
    const idle = document.visibilityState === "hidden";
    if (reduce || idle) {
      loader.classList.add("gone");
      return;
    }

    const intro = gsap.timeline({ paused: true });
    intro
      .to(loader, { yPercent: -100, duration: 0.85, ease: "power4.inOut" })
      .call(() => loader.classList.add("gone"))
      .from(
        "#hero h1 .hl > span",
        { yPercent: 115, duration: 1.05, ease: "power4.out" },
        "-=.4",
      )
      .from(
        "[data-hf]",
        { opacity: 0, y: 20, duration: 0.8, stagger: 0.09, ease: "power3.out" },
        "-=.55",
      );

    const pre = { v: 0 };
    const count = gsap.to(pre, {
      v: 100,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        pct.textContent = String(Math.round(pre.v));
      },
      onComplete: () => intro.play(),
    });

    return () => {
      count.kill();
      intro.kill();
    };
  }, []);

  /* ------------------------------------------------------------ menu --- */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    addEventListener("keydown", onKey);
    const anim = gsap.from(menuRef.current!.querySelectorAll(".m-link"), {
      yPercent: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.06,
      ease: "power3.out",
      delay: 0.25,
    });
    return () => {
      removeEventListener("keydown", onKey);
      anim.kill();
    };
  }, [open]);

  /* ---------------------------------------------------------- cursor --- */
  useEffect(() => {
    if (matchMedia("(hover: none)").matches) return;
    const cursor = cursorRef.current;
    const label = labelRef.current;
    if (!cursor || !label) return;

    let cx = 0,
      cy = 0,
      tx = 0,
      ty = 0;
    const move = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const render = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    };
    addEventListener("mousemove", move);
    gsap.ticker.add(render);

    // Delegated so rows rendered later still light the cursor up.
    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement)?.closest?.("a,button") as
        | HTMLElement
        | null;
      if (!el) return;
      const text = el.dataset.cursor;
      if (text) {
        label.textContent = text;
        cursor.classList.add("label-on");
      } else {
        cursor.classList.add("hover");
      }
    };
    const out = (e: PointerEvent) => {
      if (!(e.target as HTMLElement)?.closest?.("a,button")) return;
      cursor.classList.remove("hover", "label-on");
    };
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);

    return () => {
      removeEventListener("mousemove", move);
      gsap.ticker.remove(render);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
    };
  }, []);

  return (
    <>
      <div className="grain" aria-hidden />

      <div id="cursor" ref={cursorRef} aria-hidden>
        <div className="dot" />
        <div className="label" ref={labelRef}>
          Watch
        </div>
      </div>

      <div id="loader" ref={loaderRef}>
        <div className="display">
          We design.
          <br />
          We create.
          <br />
          <i>You grow.</i>
        </div>
        <div className="l-pct" ref={pctRef}>
          0
        </div>
      </div>

      <nav>
        {/* Home from every page, not an anchor that only exists on one */}
        <Link className="logo" href="/" aria-label="KIOSK, back to home">
          Kiosk<i>.</i>
        </Link>
        <div className="n-right">
          <button
            className="menu-btn"
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span className="bars" />
          </button>
        </div>
      </nav>

      <div id="menu" ref={menuRef} className={open ? "open" : undefined}>
        {MENU.map((m) => (
          <a
            key={m.href}
            className="m-link"
            href={m.href}
            onClick={() => setOpen(false)}
          >
            {m.label}
            <small>{m.n}</small>
          </a>
        ))}
        <div className="m-foot">
          <span>Muscat, Oman</span>
          <span>{CONTACT.email}</span>
          <span>
            {CONTACT.phone} · {CONTACT.phone2}
          </span>
        </div>
      </div>
    </>
  );
}

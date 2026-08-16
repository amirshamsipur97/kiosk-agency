"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TRAIL } from "@/lib/kiosk";

gsap.registerPlugin(ScrollTrigger);

/**
 * Every scroll/pointer behaviour on the page, wired against the static markup
 * the section components render — mirroring the reference build, which drives
 * all of this from one script. Kept in a single gsap.context so React can tear
 * the whole thing down cleanly.
 */
export default function Motion() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const cleanups = useRef<Array<() => void>>([]);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = matchMedia("(hover: none)").matches;
    const off = cleanups.current;

    const ctx = gsap.context(() => {
      /* ------------------------------------------- hero image trail --- */
      const trail = document.getElementById("trail");
      const hero = document.getElementById("hero");
      if (trail && hero && !isTouch && !reduce) {
        let ti = 0,
          lx = -999,
          ly = -999;
        const onMove = (e: MouseEvent) => {
          const r = trail.getBoundingClientRect();
          const x = e.clientX - r.left,
            y = e.clientY - r.top;
          if (Math.hypot(x - lx, y - ly) < 90) return;
          lx = x;
          ly = y;
          const img = document.createElement("img");
          img.src = TRAIL[ti++ % TRAIL.length];
          img.alt = "";
          trail.appendChild(img);
          gsap.set(img, {
            x: x - 95,
            y: y - 120,
            rotate: (Math.random() - 0.5) * 14,
            scale: 0.5,
            opacity: 0,
          });
          gsap
            .timeline({ onComplete: () => img.remove() })
            .to(img, { scale: 1, opacity: 1, duration: 0.35, ease: "power3.out" })
            .to(
              img,
              {
                scale: 0.85,
                opacity: 0,
                y: "+=40",
                duration: 0.55,
                ease: "power2.in",
              },
              "+=.25",
            );
          if (trail.children.length > 16)
            trail.removeChild(trail.firstChild as ChildNode);
        };
        hero.addEventListener("mousemove", onMove);
        off.push(() => {
          hero.removeEventListener("mousemove", onMove);
          trail.replaceChildren();
        });
      }

      /* --------------------------------------- manifesto word reveal --- */
      const mani = document.getElementById("mani");
      if (mani) {
        // Manifesto renders the word spans; clear anything a previous run left
        // on them so yPercent is measured from zero rather than stacking.
        const words = mani.querySelectorAll(".w > span");
        gsap.set(words, { clearProps: "transform" });
        const reveal = () =>
          gsap.to(words, {
            yPercent: 0,
            duration: 0.9,
            stagger: 0.045,
            ease: "power4.out",
            overwrite: true,
          });

        if (reduce) {
          gsap.set(words, { yPercent: 0 });
        } else {
          gsap.set(words, { yPercent: 110 });
          ScrollTrigger.create({
            trigger: mani,
            start: "top 80%",
            once: true,
            onEnter: reveal,
          });
          // The words are clipped until the trigger fires, so never rely on it
          // alone: if the heading is already past the start line when we set
          // up, play immediately.
          if (mani.getBoundingClientRect().top < innerHeight * 0.8) reveal();
        }
      }

      /* ------------------------------------------- generic reveals ---- */
      gsap.utils.toArray<HTMLElement>(".rv").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 30,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });
      document.querySelectorAll<HTMLElement>(".split-l > span").forEach((el) => {
        gsap.from(el, {
          yPercent: 112,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: { trigger: el.closest("h2") || el, start: "top 85%" },
        });
      });
      gsap.utils.toArray<HTMLElement>(".s-card").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 26,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 94%" },
        });
      });

      /* ------------------------------------------- signature draw ----- */
      document.querySelectorAll<SVGPathElement>(".sig").forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(p, {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: "power2.inOut",
          scrollTrigger: { trigger: p, start: "top 85%" },
        });
      });

      /* --------------------------------------------------- marquees --- */
      document.querySelectorAll<HTMLElement>("[data-marquee]").forEach((el) => {
        const dir = Number(el.dataset.dir) || -1;
        let x = 0;
        // The track holds its content twice, so the loop distance is where the
        // second copy starts. scrollWidth/2 is NOT that distance once the row
        // has a gap — it drops half a gap every lap, which is the visible tear.
        // Re-read it each frame so it stays right while images are still
        // loading and the row is still growing.
        const loopWidth = () => {
          const mid = el.children[el.children.length / 2] as
            | HTMLElement
            | undefined;
          return mid ? mid.offsetLeft : el.scrollWidth / 2;
        };
        const render = () => {
          const h = loopWidth();
          if (h <= 1) return;
          x += dir * 0.65;
          while (x <= -h) x += h;
          while (x >= 0) x -= h;
          el.style.transform = `translateX(${x}px)`;
        };
        gsap.ticker.add(render);
        off.push(() => gsap.ticker.remove(render));
      });

      /* --------------------------------- pinned number sequence ------- */
      const slides = [...document.querySelectorAll<HTMLElement>(".n-slide")];
      if (slides.length) {
        const rail = [
          ...document.querySelectorAll<HTMLElement>("#nRail button"),
        ];
        const prog = document.getElementById("nProg");
        const nums = slides.map((s) => s.querySelector<HTMLElement>(".n-num")!);
        const targets = slides.map((s) => Number(s.dataset.target));
        const pads = targets.map((t) => String(t).length);

        const paint = (i: number, v: number) => {
          const rounded = String(Math.round(v));
          const s = rounded.padStart(pads[i], "0");
          const lead = s.length - rounded.length;
          nums[i].innerHTML =
            lead > 0
              ? `<span class="z">${s.slice(0, lead)}</span>${s.slice(lead)}`
              : s;
        };
        slides.forEach((_, i) => paint(i, 0));

        let active = -1;
        const setActive = (i: number) => {
          if (i === active) return;
          active = i;
          slides.forEach((s, k) => s.classList.toggle("on", k === i));
          rail.forEach((b, k) => b.classList.toggle("on", k === i));
        };
        setActive(0);

        const mobile = matchMedia("(max-width:760px)").matches;
        if (mobile || reduce) {
          ScrollTrigger.create({
            trigger: "#numbers",
            start: "top 60%",
            once: true,
            onEnter: () => {
              setActive(0);
              gsap.to(
                { v: 0 },
                {
                  v: targets[0],
                  duration: 1.6,
                  ease: "power3.out",
                  onUpdate() {
                    paint(0, (this.targets()[0] as { v: number }).v);
                  },
                },
              );
            },
          });
          let mi = 0;
          const id = setInterval(() => {
            mi = (mi + 1) % slides.length;
            setActive(mi);
            gsap.to(
              { v: 0 },
              {
                v: targets[mi],
                duration: 1.2,
                ease: "power3.out",
                onUpdate() {
                  paint(mi, (this.targets()[0] as { v: number }).v);
                },
              },
            );
          }, 3400);
          off.push(() => clearInterval(id));
        } else {
          ScrollTrigger.create({
            trigger: "#numbers",
            start: "top top",
            end: "+=" + slides.length * 110 + "%",
            pin: ".n-sticky",
            scrub: true,
            onUpdate: (self) => {
              const t = self.progress * slides.length;
              const i = Math.min(slides.length - 1, Math.max(0, Math.floor(t)));
              const local = t - i;
              setActive(i);
              const p = Math.min(1, local / 0.5);
              paint(i, targets[i] * (1 - Math.pow(1 - p, 3)));
              if (prog) prog.style.width = self.progress * 100 + "%";
            },
          });

          rail.forEach((b) => {
            const click = () => {
              const sec = document.getElementById("numbers");
              if (!sec) return;
              const total = sec.offsetHeight - innerHeight;
              const frac = (Number(b.dataset.i) + 0.5) / slides.length;
              scrollTo({ top: sec.offsetTop + total * frac, behavior: "smooth" });
            };
            b.addEventListener("click", click);
            off.push(() => b.removeEventListener("click", click));
          });
        }
      }

      /* ---------------------------------------------- counters -------- */
      document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const end = Number(el.dataset.count);
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              el,
              { textContent: 0 },
              {
                textContent: end,
                duration: 1.6,
                ease: "power3.out",
                snap: { textContent: 1 },
              },
            );
          },
        });
      });

      /* -------------------------------------------- drag strip -------- */
      const strip = document.getElementById("strip");
      if (strip) {
        let dragging = false,
          startX = 0,
          startScroll = 0;
        const down = (e: PointerEvent) => {
          dragging = true;
          startX = e.clientX;
          startScroll = strip.scrollLeft;
          strip.classList.add("grabbing");
          strip.setPointerCapture(e.pointerId);
        };
        const move = (e: PointerEvent) => {
          if (dragging) strip.scrollLeft = startScroll - (e.clientX - startX);
        };
        const up = () => {
          dragging = false;
          strip.classList.remove("grabbing");
        };
        strip.addEventListener("pointerdown", down);
        strip.addEventListener("pointermove", move);
        strip.addEventListener("pointerup", up);
        strip.addEventListener("pointercancel", up);
        off.push(() => {
          strip.removeEventListener("pointerdown", down);
          strip.removeEventListener("pointermove", move);
          strip.removeEventListener("pointerup", up);
          strip.removeEventListener("pointercancel", up);
        });
      }

      /* The clients honeycomb owns its own pointer and raf loop, in
         Clients.tsx: it is driven by drag, not by scroll. */

      /* -------------------------------------------------- contact ----- */
      gsap.from("#contact .ln > span", {
        yPercent: 118,
        duration: 1.1,
        stagger: 0.12,
        ease: "power4.out",
        scrollTrigger: { trigger: "#contact", start: "top 55%" },
      });
      gsap.from(".c-link", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: { trigger: ".c-links", start: "top 92%" },
      });

      /* ------------------------------------------------- magnetic ----- */
      if (!isTouch) {
        document
          .querySelectorAll<HTMLElement>(".magnetic,.cta")
          .forEach((m) => {
            const move = (e: MouseEvent) => {
              const r = m.getBoundingClientRect();
              gsap.to(m, {
                x: (e.clientX - r.left - r.width / 2) * 0.22,
                y: (e.clientY - r.top - r.height / 2) * 0.22,
                duration: 0.4,
              });
            };
            const leave = () =>
              gsap.to(m, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,.4)" });
            m.addEventListener("mousemove", move);
            m.addEventListener("mouseleave", leave);
            off.push(() => {
              m.removeEventListener("mousemove", move);
              m.removeEventListener("mouseleave", leave);
            });
          });
      }

      /* Images stream in after hydration — keep pin positions honest. */
      const refresh = () => ScrollTrigger.refresh();
      addEventListener("load", refresh);
      off.push(() => removeEventListener("load", refresh));
    });

    return () => {
      off.forEach((fn) => fn());
      off.length = 0;
      ctx.revert();
    };
  }, []);

  /* ------------------------------------------------------- lightbox --- */
  useEffect(() => {
    const click = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.(".zoom");
      if (!a) return;
      const img = a.querySelector("img");
      if (img) setLightbox(img.getAttribute("src"));
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    document.addEventListener("click", click);
    addEventListener("keydown", key);
    return () => {
      document.removeEventListener("click", click);
      removeEventListener("keydown", key);
    };
  }, []);

  return (
    <div
      className={`lb${lightbox ? " on" : ""}`}
      onClick={() => setLightbox(null)}
    >
      <span className="x">×</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={lightbox || undefined} alt="" />
    </div>
  );
}

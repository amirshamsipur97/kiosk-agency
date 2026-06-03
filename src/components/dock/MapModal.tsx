"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const TOKEN =
  "pk.eyJ1IjoiYW1pcnJlemExOTk3IiwiYSI6ImNtcHg5Y2h6ZTA4ankycnIwNG96Z3l4MW0ifQ.U-f36Ck1Iq_dEx4lr-YISA";
const CENTER: [number, number] = [58.412185, 23.586078]; // [lng, lat]
const CSS_URL = "https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.css";
const JS_URL = "https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.js";

// Load Mapbox GL JS from CDN once (no npm dependency / build config needed).
/* eslint-disable @typescript-eslint/no-explicit-any */
function loadMapbox(): Promise<any> {
  return new Promise((resolve, reject) => {
    const w = window as any;
    if (w.mapboxgl) return resolve(w.mapboxgl);
    if (!document.querySelector("link[data-mapbox]")) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = CSS_URL;
      link.dataset.mapbox = "1";
      document.head.appendChild(link);
    }
    const existing = document.querySelector(
      "script[data-mapbox]"
    ) as HTMLScriptElement | null;
    if (existing) {
      if (w.mapboxgl) resolve(w.mapboxgl);
      else existing.addEventListener("load", () => resolve(w.mapboxgl), { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = JS_URL;
    s.dataset.mapbox = "1";
    s.onload = () => resolve(w.mapboxgl);
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export default function MapModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const mapEl = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    let map: any = null;

    loadMapbox()
      .then((mapboxgl: any) => {
        if (cancelled || !mapEl.current) return;
        mapboxgl.accessToken = TOKEN;
        map = new mapboxgl.Map({
          container: mapEl.current,
          style: "mapbox://styles/mapbox/dark-v11",
          center: CENTER,
          zoom: 16.5,
          attributionControl: false,
        });
        new mapboxgl.Marker({ color: "#df6a1b" }).setLngLat(CENTER).addTo(map);
        setTimeout(() => map?.resize(), 150);
      })
      .catch(() => {});

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      cancelled = true;
      document.removeEventListener("keydown", onKey);
      if (map) map.remove();
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
      />
      <div className="relative w-[min(92vw,520px)] overflow-hidden rounded-2xl border border-white/12 bg-[#0c0d10] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
        <div ref={mapEl} className="aspect-square w-full bg-[#15171c]" />
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-paper">Aqar Building</p>
            <p className="truncate text-xs text-mist">1991 Office · Unit 617 · Muscat</p>
          </div>
          <a
            href="https://www.google.com/maps/search/?api=1&query=23.586078,58.412185"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-[#df6a1b] px-4 py-2 text-xs font-medium text-ink transition-colors hover:bg-[#e87d33]"
          >
            Open in Maps
          </a>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>,
    document.body
  );
}

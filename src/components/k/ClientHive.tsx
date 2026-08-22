"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { BRAND_COUNT, CLIENTS } from "@/lib/kiosk";

/** Cell diameter and centre-to-centre spacing, in canvas units. */
const D = 150;
const PITCH = D * 1.08;
const ROW = PITCH * 0.866;

const MAX_Z = 2.8;

/**
 * How many times the client list is laid out around the centre. The brands
 * repeat, so dragging never reaches an empty edge and the grid is not limited
 * to the length of the list. Nine copies is roughly ten rings of hexagons,
 * far more than fits on any screen at any zoom this page allows.
 */
const REPEATS = 9;

/**
 * How far out, in fade radii, a cell is written once and then skipped. Just
 * past the point where its opacity has reached zero.
 */
const FAR = 1.45;

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/** Axial neighbour directions, in ring-walk order. */
const AX: [number, number][] = [
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
];

function ringCells(ring: number) {
  const out: { q: number; r: number }[] = [];
  let q = AX[4][0] * ring;
  let r = AX[4][1] * ring;
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < ring; j++) {
      out.push({ q, r });
      q += AX[i][0];
      r += AX[i][1];
    }
  }
  return out;
}

/**
 * Hex rings out from the centre. A ring that cannot be filled completely is
 * spread evenly around itself rather than left with one bald side.
 */
function hexLayout(n: number) {
  const out = [{ q: 0, r: 0 }];
  for (let ring = 1; out.length < n; ring++) {
    const cells = ringCells(ring);
    const need = n - out.length;
    if (need >= cells.length) {
      out.push(...cells);
    } else {
      const step = cells.length / need;
      for (let k = 0; k < need; k++) {
        out.push(cells[Math.round(k * step) % cells.length]);
      }
    }
  }
  return out;
}

/**
 * The client honeycomb: the Apple Watch home screen, in the site's own
 * typography. Brands sit on a hex grid you drag around and zoom into, and
 * every cell scales and fades with its distance from the centre of the stage,
 * so whatever you steer to the middle is what you read.
 *
 * This is the /clients page. The homepage keeps its marquee wall.
 *
 * The grid is laid out in the markup with plain left/top, so with no script at
 * all it still renders as a complete honeycomb. The effect only adds motion.
 */
export default function ClientHive() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLDivElement>(null);

  const cells = useMemo(() => {
    // Featured brands first, so the spiral drops them in the middle.
    const ordered = [...CLIENTS].sort(
      (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0),
    );
    const total = ordered.length * REPEATS;
    const coords = hexLayout(total);
    // The list cycles, so a brand recurs a whole list later: never beside
    // itself, and the centre still opens on the featured ones.
    return Array.from({ length: total }, (_, i) => {
      const c = ordered[i % ordered.length];
      const { q, r } = coords[i];
      const longest = Math.max(...c.name.split(" ").map((w) => w.length));
      return {
        ...c,
        x: PITCH * (q + r / 2),
        y: ROW * r,
        // Anton is condensed, so roughly 236px of room per character line.
        fs: clamp(236 / longest, 12, 34),
      };
    });
  }, []);

  /** Far enough to reach the outermost ring, whatever the list length. */
  const panLimit = useMemo(
    () => Math.max(...cells.map((c) => Math.max(Math.abs(c.x), Math.abs(c.y)))),
    [cells],
  );

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const cellEls = [...canvas.querySelectorAll<HTMLElement>(".aw-cell")];
    const zoomBtns = [
      ...stage.parentElement!.querySelectorAll<HTMLElement>("[data-zoom]"),
    ];

    let w = stage.clientWidth;
    let h = stage.clientHeight;
    /**
     * The furthest you may zoom out. Any further and the outermost ring would
     * come inside the frame and the grid would stop looking endless, so the
     * floor is whatever keeps it filling the stage on this screen.
     */
    const floorZ = () =>
      Math.max(0.3, (w / 2) / panLimit, (h / 2) / panLimit);

    /**
     * Opening zoom. Sized so the two inner rings sit comfortably in frame
     * rather than so the whole grid fits: fitting everything made the cells
     * far too small to read.
     */
    const fit = () =>
      clamp(Math.min(w / 1000, h / 712), Math.max(0.68, floorZ()), 1.5);

    let tx = 0;
    let ty = 0;
    let tz = fit();
    let cx = tx;
    let cy = ty;
    let cz = tz;
    let vx = 0;
    let vy = 0;
    let active = -1;
    /** Which cells are already sitting at rest off the edge of the fade. */
    const parked = new Array(cellEls.length).fill(false);

    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;

    const clampPan = () => {
      const m = panLimit * tz + 40;
      tx = clamp(tx, -m, m);
      ty = clamp(ty, -m, m);
    };

    /* ---------------------------------------------------- pointer ---- */
    const pts = new Map<number, { x: number; y: number }>();
    let pinchStart = 0;
    let pinchZ = 1;
    let travel = 0;

    const spread = () => {
      const [a, b] = [...pts.values()];
      return Math.hypot(a.x - b.x, a.y - b.y);
    };

    const down = (e: PointerEvent) => {
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      stage.setPointerCapture(e.pointerId);
      stage.classList.add("grabbing");
      vx = 0;
      vy = 0;
      travel = 0;
      if (pts.size === 2) {
        pinchStart = spread();
        pinchZ = tz;
      }
    };

    const move = (e: PointerEvent) => {
      const p = pts.get(e.pointerId);
      if (!p) return;
      const dx = e.clientX - p.x;
      const dy = e.clientY - p.y;
      p.x = e.clientX;
      p.y = e.clientY;

      if (pts.size >= 2) {
        if (pinchStart)
          tz = clamp(pinchZ * (spread() / pinchStart), floorZ(), MAX_Z);
        clampPan();
        return;
      }
      travel += Math.abs(dx) + Math.abs(dy);
      tx += dx;
      ty += dy;
      vx = dx;
      vy = dy;
      clampPan();
    };

    const up = (e: PointerEvent) => {
      pts.delete(e.pointerId);
      if (pts.size < 2) pinchStart = 0;
      if (!pts.size) stage.classList.remove("grabbing");
    };

    /* Click a brand and it comes to the middle, the way tapping an app does. */
    const click = (e: MouseEvent) => {
      if (travel > 8) return;
      const cell = (e.target as HTMLElement).closest?.(".aw-cell");
      if (!cell) return;
      const i = Number((cell as HTMLElement).dataset.i);
      tz = clamp(Math.max(tz, 1.15), floorZ(), MAX_Z);
      tx = -cells[i].x * tz;
      ty = -cells[i].y * tz;
      clampPan();
    };

    /* Plain wheel still scrolls the page. Only a pinch gesture zooms. */
    const wheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      tz = clamp(tz * (1 - e.deltaY * 0.0022), floorZ(), MAX_Z);
      clampPan();
    };

    const zoom = (e: Event) => {
      const dir =
        (e.currentTarget as HTMLElement).dataset.zoom === "in" ? 1 : -1;
      tz = clamp(tz * (dir > 0 ? 1.32 : 1 / 1.32), floorZ(), MAX_Z);
      clampPan();
    };

    stage.addEventListener("pointerdown", down);
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerup", up);
    stage.addEventListener("pointercancel", up);
    stage.addEventListener("click", click);
    stage.addEventListener("wheel", wheel, { passive: false });
    zoomBtns.forEach((b) => b.addEventListener("click", zoom));

    const ro = new ResizeObserver(() => {
      const wasFit = Math.abs(tz - fit()) < 0.001;
      w = stage.clientWidth;
      h = stage.clientHeight;
      if (wasFit) tz = fit();
      clampPan();
    });
    ro.observe(stage);

    /* ------------------------------------------------------ frame ---- */
    let raf = 0;
    const frame = () => {
      const k = smooth ? 0.15 : 1;
      cx += (tx - cx) * k;
      cy += (ty - cy) * k;
      cz += (tz - cz) * k;

      // Momentum, once the finger is off.
      if (!pts.size && smooth && (vx || vy)) {
        tx += vx;
        ty += vy;
        vx *= 0.92;
        vy *= 0.92;
        if (Math.abs(vx) < 0.06) vx = 0;
        if (Math.abs(vy) < 0.06) vy = 0;
        clampPan();
      }

      canvas.style.transform = `translate3d(${cx}px, ${cy}px, 0) scale(${cz})`;

      // Distance from the middle of the stage drives scale and opacity.
      const R = Math.min(w, h) * 0.52 || 1;
      let near = -1;
      let nearD = Infinity;
      for (let i = 0; i < cellEls.length; i++) {
        const sx = cells[i].x * cz + cx;
        const sy = cells[i].y * cz + cy;
        const d = Math.hypot(sx, sy) / R;

        // Beyond the fade there is nothing left to see. Write those cells
        // once, then leave them alone: with the list repeated there are
        // several hundred of them and only the neighbourhood of the centre
        // is worth a style write every frame.
        if (d > FAR) {
          if (!parked[i]) {
            cellEls[i].style.transform = "translate(-50%, -50%) scale(.54)";
            cellEls[i].style.opacity = "0";
            parked[i] = true;
          }
          continue;
        }
        parked[i] = false;

        const t = Math.min(d, 1.3);
        const s = 1 - 0.46 * (t / 1.3);
        const o = clamp(1 - 1.05 * Math.max(0, t - 0.5), 0.07, 1);
        cellEls[i].style.transform = `translate(-50%, -50%) scale(${s})`;
        cellEls[i].style.opacity = String(o);
        if (d < nearD) {
          nearD = d;
          near = i;
        }
      }

      // Only touch the DOM when the centred brand actually changes.
      if (near !== active) {
        cellEls[active]?.classList.remove("on");
        active = near;
        cellEls[active]?.classList.add("on");
        const cap = capRef.current;
        const c = cells[active];
        if (cap && c) {
          cap.querySelector("b")!.textContent = c.name;
          cap.querySelector("span")!.textContent = c.sector;
        }
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      stage.removeEventListener("pointerdown", down);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerup", up);
      stage.removeEventListener("pointercancel", up);
      stage.removeEventListener("click", click);
      stage.removeEventListener("wheel", wheel);
      zoomBtns.forEach((b) => b.removeEventListener("click", zoom));
    };
  }, [cells, panLimit]);

  return (
    <section id="clienthive">
      <div className="cw-inner">
        <Link className="k-back" href="/">
          ← Back to home
        </Link>
        <div className="sec-label">Clients — the full list</div>

        <div className="cw-top">
          <h1 className="cw-h">
            Brands we&apos;ve <i>delivered for</i>
          </h1>
          <div className="cw-tally">
            {/* data-count is what Motion's counter picks up */}
            <div>
              <b data-count={BRAND_COUNT}>0</b>
              <small>Brands</small>
            </div>
            <div>
              <b data-count="5">0</b>
              <small>Countries</small>
            </div>
            <div>
              <b data-count="17">0</b>
              <small>Years</small>
            </div>
          </div>
        </div>

        <div className="aw-stage" ref={stageRef}>
          <div className="aw-canvas" ref={canvasRef}>
            {cells.map((c, i) => (
              <div
                className={`aw-cell${c.featured ? " feat" : ""}`}
                key={i}
                data-i={i}
                style={{
                  left: `${c.x}px`,
                  top: `${c.y}px`,
                  ["--fs" as string]: `${c.fs}px`,
                }}
              >
                <span className="aw-name">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="aw-bar">
          <div className="aw-cap" ref={capRef}>
            <b>{cells[0]?.name}</b>
            <span>{cells[0]?.sector}</span>
          </div>
          <div className="aw-tools">
            <span className="aw-hint">Drag to explore · pinch to zoom</span>
            <div className="aw-zoom">
              <button type="button" data-zoom="out" aria-label="Zoom out">
                −
              </button>
              <button type="button" data-zoom="in" aria-label="Zoom in">
                +
              </button>
            </div>
          </div>
        </div>

        <div className="cw-footrow">
          <span>…and growing. Ask us for sector-specific references.</span>
        </div>
      </div>
    </section>
  );
}

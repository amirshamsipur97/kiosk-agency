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
 * How far out, in fade radii, a cell is written once and then skipped. Well
 * past anything the eye can pick out, so nothing pops as it comes back.
 */
const FAR = 2.1;

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/**
 * The grid is one tile repeated forever.
 *
 * Rows are offset by half a pitch, which is what makes it read as a honeycomb,
 * and an even number of rows means the tile joins itself top to bottom as
 * exactly as it does left to right. Every cell is drawn once and each frame is
 * placed at whichever copy of itself is nearest the camera, so dragging never
 * reaches an edge and no second copy is ever needed on screen at once.
 */
const COLS = 20;
const ROWS = 14; // even, or the offset rows would not meet
const TILE_W = COLS * PITCH;
const TILE_H = ROWS * ROW;

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
    // Every slot in the tile, centred on the origin.
    const slots: { x: number; y: number }[] = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        slots.push({
          x: (col - (COLS - 1) / 2) * PITCH + (row % 2) * (PITCH / 2),
          y: (row - (ROWS - 1) / 2) * ROW,
        });
      }
    }

    // Featured brands first, dealt to the slots nearest the middle, so the
    // page still opens on them. The list then cycles through the rest.
    const ordered = [...CLIENTS].sort(
      (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0),
    );
    const byDistance = slots
      .map((s, i) => ({ i, d: Math.hypot(s.x, s.y) }))
      .sort((a, b) => a.d - b.d);

    const out = new Array(slots.length);
    byDistance.forEach(({ i }, rank) => {
      const c = ordered[rank % ordered.length];
      const longest = Math.max(...c.name.split(" ").map((w) => w.length));
      out[i] = {
        ...c,
        ...slots[i],
        // Anton is condensed, so roughly 236px of room per character line.
        fs: clamp(236 / longest, 12, 34),
      };
    });
    return out as ((typeof CLIENTS)[number] & {
      x: number;
      y: number;
      fs: number;
    })[];
  }, []);

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
     * The furthest you may zoom out. One tile has to stay at least as big as
     * the stage: any further out and a cell would have to appear twice on
     * screen at once, which one element cannot do.
     */
    const floorZ = () => Math.max(w / TILE_W, h / TILE_H, 0.34);

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
        return;
      }
      travel += Math.abs(dx) + Math.abs(dy);
      tx += dx;
      ty += dy;
      vx = dx;
      vy = dy;
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
      // Steer to the copy of this cell that is actually on screen, not to
      // the one at its base position, which may be tiles away.
      const c = cells[i];
      const camX = -tx / tz;
      const camY = -ty / tz;
      const wx = TILE_W * Math.round((camX - c.x) / TILE_W);
      const wy = TILE_H * Math.round((camY - c.y) / TILE_H);
      tx = -(c.x + wx) * tz;
      ty = -(c.y + wy) * tz;
    };

    /* Plain wheel still scrolls the page. Only a pinch gesture zooms. */
    const wheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      tz = clamp(tz * (1 - e.deltaY * 0.0022), floorZ(), MAX_Z);
    };

    const zoom = (e: Event) => {
      const dir =
        (e.currentTarget as HTMLElement).dataset.zoom === "in" ? 1 : -1;
      tz = clamp(tz * (dir > 0 ? 1.32 : 1 / 1.32), floorZ(), MAX_Z);
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
      }

      canvas.style.transform = `translate3d(${cx}px, ${cy}px, 0) scale(${cz})`;

      // Distance from the middle of the stage drives scale and opacity.
      const R = Math.min(w, h) * 0.52 || 1;
      let near = -1;
      let nearD = Infinity;
      // Where the camera is, in the grid's own units.
      const camX = -cx / cz;
      const camY = -cy / cz;

      for (let i = 0; i < cellEls.length; i++) {
        // Place this cell at whichever copy of itself is nearest the camera.
        // That is the whole trick: the grid has no edge because every cell
        // follows you.
        const wx = TILE_W * Math.round((camX - cells[i].x) / TILE_W);
        const wy = TILE_H * Math.round((camY - cells[i].y) / TILE_H);
        const sx = (cells[i].x + wx) * cz + cx;
        const sy = (cells[i].y + wy) * cz + cy;
        const d = Math.hypot(sx, sy) / R;

        // Beyond the fade there is nothing left to see. Write those cells
        // once, then leave them alone: with the list repeated there are
        // several hundred of them and only the neighbourhood of the centre
        // is worth a style write every frame.
        if (d > FAR) {
          if (!parked[i]) {
            cellEls[i].style.opacity = "0";
            parked[i] = true;
          }
          continue;
        }
        parked[i] = false;

        const t = Math.min(d, 1.4);
        const s = 1 - 0.34 * (t / 1.4);
        // Gentler than it was: the point of an endless grid is that you can
        // read what you are dragging towards, not just what is dead centre.
        const o = clamp(1 - 0.72 * Math.max(0, t - 0.66), 0.28, 1);
        // The wrap rides in the transform, so it costs no layout.
        cellEls[i].style.transform =
          `translate(-50%, -50%) translate(${wx}px, ${wy}px) scale(${s})`;
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
  }, [cells]);

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

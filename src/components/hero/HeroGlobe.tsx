"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Network globe for the hero: points distributed in clusters on a sphere
 * (continents-like) connected by thin lines. It rotates slowly, shifts a
 * little toward the pointer on hover, and a faint lime "signal" pulse travels
 * along the connecting lines.
 */

type Vec = [number, number, number];

function randUniformDir(): Vec {
  const z = Math.random() * 2 - 1;
  const t = Math.random() * Math.PI * 2;
  const r = Math.sqrt(1 - z * z);
  return [r * Math.cos(t), r * Math.sin(t), z];
}

function normalize([x, y, z]: Vec): Vec {
  const l = Math.hypot(x, y, z) || 1;
  return [x / l, y / l, z / l];
}

function buildPoints() {
  const POINTS = 340;
  const CLUSTERS = 16;
  const SPREAD = 0.45;

  const centers: Vec[] = [];
  for (let i = 0; i < CLUSTERS; i++) centers.push(randUniformDir());

  const pts: Vec[] = [];
  for (let i = 0; i < POINTS; i++) {
    if (Math.random() < 0.82) {
      // Clustered point (continent-like)
      const c = centers[(Math.random() * CLUSTERS) | 0];
      const jitter: Vec = [
        (Math.random() * 2 - 1) * SPREAD,
        (Math.random() * 2 - 1) * SPREAD,
        (Math.random() * 2 - 1) * SPREAD,
      ];
      pts.push(normalize([c[0] + jitter[0], c[1] + jitter[1], c[2] + jitter[2]]));
    } else {
      // Sparse uniform sprinkle (ocean nodes)
      pts.push(randUniformDir());
    }
  }
  return pts;
}

export default function HeroGlobe() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 2.75;

    const group = new THREE.Group();
    group.rotation.x = -0.35;
    scene.add(group);

    // --- Points ---
    const pts = buildPoints();
    const pos = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => {
      pos[i * 3] = p[0];
      pos[i * 3 + 1] = p[1];
      pos[i * 3 + 2] = p[2];
    });
    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pointMat = new THREE.PointsMaterial({
      color: 0xf4f4f5,
      size: 0.02,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    group.add(new THREE.Points(pointGeo, pointMat));

    // --- Lines (nearest-neighbour web) ---
    const MAX_DIST = 0.34;
    const MAX_PER_POINT = 3;
    const linePos: number[] = [];
    const lineProgress: number[] = [];
    const linePhase: number[] = [];

    for (let i = 0; i < pts.length; i++) {
      let connections = 0;
      for (let j = i + 1; j < pts.length && connections < MAX_PER_POINT; j++) {
        const dx = pts[i][0] - pts[j][0];
        const dy = pts[i][1] - pts[j][1];
        const dz = pts[i][2] - pts[j][2];
        const d = Math.hypot(dx, dy, dz);
        if (d < MAX_DIST) {
          const phase = Math.random() * 10;
          linePos.push(...pts[i], ...pts[j]);
          lineProgress.push(0, 1);
          linePhase.push(phase, phase);
          connections++;
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(linePos), 3)
    );
    lineGeo.setAttribute(
      "aProgress",
      new THREE.BufferAttribute(new Float32Array(lineProgress), 1)
    );
    lineGeo.setAttribute(
      "aPhase",
      new THREE.BufferAttribute(new Float32Array(linePhase), 1)
    );

    const lineMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: 0.12 },
        uBase: { value: new THREE.Color(0x6a7176) },
        uSignal: { value: new THREE.Color(0xd7ff3e) },
      },
      vertexShader: /* glsl */ `
        attribute float aProgress;
        attribute float aPhase;
        varying float vProgress;
        varying float vPhase;
        void main() {
          vProgress = aProgress;
          vPhase = aPhase;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        precision mediump float;
        uniform float uTime;
        uniform float uSpeed;
        uniform vec3 uBase;
        uniform vec3 uSignal;
        varying float vProgress;
        varying float vPhase;
        void main() {
          float p = fract(uTime * uSpeed + vPhase);
          float pulse = smoothstep(0.06, 0.0, abs(vProgress - p));
          vec3 col = uBase * 0.45 + uSignal * pulse;
          float a = 0.12 + pulse * 0.42;
          gl_FragColor = vec4(col, a);
        }
      `,
    });
    group.add(new THREE.LineSegments(lineGeo, lineMat));

    // --- Sizing ---
    const resize = () => {
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // --- Pointer parallax ---
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    const onPointer = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!reduce) window.addEventListener("pointermove", onPointer);

    // --- Animate ---
    let raf = 0;
    let running = true;
    const clock = new THREE.Clock();
    let baseRot = 0;

    const frame = () => {
      const dt = clock.getDelta();
      baseRot += dt * 0.06; // slow, natural spin
      lineMat.uniforms.uTime.value += dt;

      // Ease the parallax toward the pointer (small shift on hover).
      curX += (targetX - curX) * 0.045;
      curY += (targetY - curY) * 0.045;

      group.rotation.y = baseRot + curX * 0.4;
      group.rotation.x = -0.35 + curY * 0.28;
      group.position.x = curX * 0.06;

      renderer.render(scene, camera);
      if (running) raf = requestAnimationFrame(frame);
    };

    if (reduce) {
      renderer.render(scene, camera);
    } else {
      raf = requestAnimationFrame(frame);
    }

    // Pause when the hero scrolls out of view or the tab is hidden.
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? true;
        if (reduce) return;
        if (visible && !running) {
          running = true;
          clock.getDelta();
          raf = requestAnimationFrame(frame);
        } else if (!visible && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (reduce) return;
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        clock.getDelta();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
      io.disconnect();
      pointGeo.dispose();
      pointMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(640px,86vw)] -translate-x-1/2 -translate-y-1/2"
    />
  );
}

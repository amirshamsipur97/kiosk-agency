"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";

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
    // Rendered as fat, anti-aliased lines (LineSegments2 / LineMaterial) for a
    // crisp web instead of the jaggy 1px native gl.LINES. A green "signal"
    // pulse travels each segment, injected into LineMaterial's shader.
    const MAX_DIST = 0.34;
    const MAX_PER_POINT = 3;
    const linePos: number[] = []; // 6 floats per segment (start xyz, end xyz)
    const segPhase: number[] = []; // one phase per segment (instance)

    for (let i = 0; i < pts.length; i++) {
      let connections = 0;
      for (let j = i + 1; j < pts.length && connections < MAX_PER_POINT; j++) {
        const dx = pts[i][0] - pts[j][0];
        const dy = pts[i][1] - pts[j][1];
        const dz = pts[i][2] - pts[j][2];
        const d = Math.hypot(dx, dy, dz);
        if (d < MAX_DIST) {
          linePos.push(...pts[i], ...pts[j]);
          segPhase.push(Math.random() * 10);
          connections++;
        }
      }
    }

    const lineGeo = new LineSegmentsGeometry();
    lineGeo.setPositions(new Float32Array(linePos));
    lineGeo.setAttribute(
      "aPhase",
      new THREE.InstancedBufferAttribute(new Float32Array(segPhase), 1)
    );

    const lineMat = new LineMaterial({
      color: 0x6a7176,
      linewidth: 1.5, // device-independent pixels (resolution-aware)
      transparent: true,
      depthTest: true,
      dashed: false,
    });
    lineMat.depthWrite = false;
    lineMat.blending = THREE.AdditiveBlending;

    // Inject the travelling signal pulse into LineMaterial's built-in shader.
    // `vUv.y` runs +1 (segment start) → -1 (segment end), so remap to 0..1.
    let lineShader: { uniforms: Record<string, { value: number }> } | null =
      null;
    lineMat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uSpeed = { value: 0.13 };
      shader.uniforms.uSignal = { value: new THREE.Color(0xd14320) };

      shader.vertexShader =
        "attribute float aPhase;\nvarying float vPhase;\n" +
        shader.vertexShader.replaceAll("vUv = uv;", "vUv = uv;\n\tvPhase = aPhase;");

      shader.fragmentShader =
        "uniform float uTime;\nuniform float uSpeed;\nuniform vec3 uSignal;\nvarying float vPhase;\n" +
        shader.fragmentShader.replace(
          "gl_FragColor = vec4( diffuseColor.rgb, alpha );",
          /* glsl */ `
          float segT = clamp((1.0 - vUv.y) * 0.5, 0.0, 1.0);
          float p = fract(uTime * uSpeed + vPhase);
          float pulse = smoothstep(0.13, 0.0, abs(segT - p));
          vec3 sigCol = diffuseColor.rgb * 0.5 + uSignal * pulse * 2.4;
          float sigA = alpha * (0.28 + pulse * 1.9);
          gl_FragColor = vec4( sigCol, sigA );
          `
        );

      lineShader = shader as unknown as {
        uniforms: Record<string, { value: number }>;
      };
    };

    const lines = new LineSegments2(lineGeo, lineMat);
    lines.computeLineDistances();
    group.add(lines);

    // --- Sizing ---
    const resize = () => {
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // LineMaterial needs the viewport resolution (CSS px) so `linewidth`
      // stays a device-independent pixel size.
      lineMat.resolution.set(w, h);
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
    let uTimeVal = 0;

    const frame = () => {
      const dt = clock.getDelta();
      baseRot += dt * 0.06; // slow, natural spin
      uTimeVal += dt;
      if (lineShader) lineShader.uniforms.uTime.value = uTimeVal;

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

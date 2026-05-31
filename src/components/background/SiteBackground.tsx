"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Site-wide fixed WebGL background. Renders the same "material" as the hero —
 * a dark ambient gradient with an animated film-grain noise overlay and a
 * faint lime brand glow — fixed behind ALL content so the texture continues
 * from the hero down to the footer as the page scrolls.
 */
const VERT = /* glsl */ `
  varying vec2 v_uv;
  void main() {
    v_uv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;

  uniform float u_time;
  uniform vec2  u_resolution;
  uniform float u_grain;
  uniform float u_pixelRatio;
  varying vec2  v_uv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main() {
    vec2 uv = v_uv;

    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 p = vec2(uv.x * aspect, uv.y);

    // Ambient glow near the upper-center of the viewport.
    vec2 focal = vec2(0.5 * aspect, 0.78);
    float radius = 1.05 + 0.05 * sin(u_time * 0.35);
    float d = distance(p, focal);
    float glow = smoothstep(radius, 0.0, d);

    vec3 dark  = vec3(0.031, 0.031, 0.039); // ~#080809
    vec3 light = vec3(0.105, 0.112, 0.130); // soft ambient gray
    vec3 col = mix(dark, light, pow(glow, 1.7));

    // Faint KIOSK lime glow at the core.
    vec3 lime = vec3(0.843, 1.0, 0.243);
    col += lime * pow(glow, 3.5) * 0.035;

    // Edge vignette.
    float vig = smoothstep(1.35, 0.3, distance(uv, vec2(0.5)));
    col *= mix(0.7, 1.0, vig);

    // Animated film grain — sampled in CSS pixels (DPR-independent) so the
    // grain stays the same fine, even texture on every screen.
    vec2 gp = gl_FragCoord.xy / u_pixelRatio;
    float g = hash(gp * 0.85 + fract(u_time) * 70.0);
    col += (g - 0.5) * u_grain;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function SiteBackground() {
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
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      });
    } catch {
      return; // WebGL unavailable — body bg-ink remains as fallback.
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const uniforms = {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(1, 1) },
      u_grain: { value: reduce ? 0.018 : 0.028 },
      u_pixelRatio: { value: renderer.getPixelRatio() },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      uniforms.u_resolution.value.set(
        w * renderer.getPixelRatio(),
        h * renderer.getPixelRatio()
      );
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const start = performance.now();
    let running = true;

    const render = (now: number) => {
      uniforms.u_time.value = (now - start) / 1000;
      renderer.render(scene, camera);
      if (running) raf = requestAnimationFrame(render);
    };

    if (reduce) {
      uniforms.u_time.value = 1.2;
      renderer.render(scene, camera);
    } else {
      raf = requestAnimationFrame(render);
    }

    const onVisibility = () => {
      if (reduce) return;
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="fixed inset-0 z-0 h-full w-full"
    />
  );
}

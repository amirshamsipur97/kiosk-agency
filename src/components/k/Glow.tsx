"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  Color,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from "three";

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;

  varying vec2 vUv;
  uniform float uAspect;
  uniform float uTime;
  uniform vec2  uMouse;     // aspect-space, follows the pointer
  uniform float uPointer;   // 0 while the pointer has never entered
  uniform float uIntensity;
  uniform vec3  uColor;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }
  float blob(vec2 q, vec2 c, float r) {
    float d = length(q - c) / r;
    return exp(-d * d);
  }

  void main() {
    vec2 q = (vUv - 0.5) * vec2(uAspect, 1.0);
    float t = uTime * 0.14;

    // Three slow, independent drifts so the field never visibly repeats.
    vec2 c1 = vec2(-0.42 + sin(t * 0.71) * 0.30, 0.16 + cos(t * 0.53) * 0.18);
    vec2 c2 = vec2( 0.46 + cos(t * 0.49) * 0.26, -0.20 + sin(t * 0.83) * 0.20);
    vec2 c3 = vec2( 0.02 + sin(t * 0.37 + 2.0) * 0.34, 0.04 + cos(t * 0.44 + 1.0) * 0.26);

    float g = blob(q, c1, 0.46) * 0.95
            + blob(q, c2, 0.52) * 0.80
            + blob(q, c3, 0.36) * 0.62;

    // The pointer carries its own light.
    g += blob(q, uMouse, 0.30) * 1.15 * uPointer;

    // Break the gaussians up so they read as haze, not as circles.
    g *= 0.66 + 0.62 * fbm(q * 2.1 + vec2(t * 0.5, -t * 0.35));

    // Never let the canvas edge become a visible seam.
    vec2 e = min(vUv, 1.0 - vUv);
    float edge = smoothstep(0.0, 0.30, min(e.x, e.y));

    float a = clamp(g, 0.0, 1.0) * uIntensity * edge;
    gl_FragColor = vec4(uColor, a);
  }
`;

type Props = {
  /** Peak alpha of the wash. Kept low — this sits under body copy. */
  intensity?: number;
};

/**
 * Soft drifting accent glow rendered on a WebGL layer behind a section.
 *
 * It only runs while its section is on screen, eases toward the pointer with
 * GSAP, and degrades quietly: reduced motion gets a single still frame, and a
 * context failure leaves the section exactly as the CSS already paints it.
 */
export default function Glow({ intensity = 0.17 }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
    } catch {
      return; // No WebGL — the CSS gradients already carry the section.
    }

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.setClearAlpha(0);
    const canvas = renderer.domElement;
    canvas.setAttribute("aria-hidden", "true");
    host.appendChild(canvas);

    const uniforms = {
      uAspect: { value: 1 },
      uTime: { value: 0 },
      uMouse: { value: new Vector2(0, 0) },
      uPointer: { value: 0 },
      uIntensity: { value: intensity },
      uColor: { value: new Color("#ff4b1f") },
    };

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const mesh = new Mesh(
      new PlaneGeometry(2, 2),
      new ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms,
        transparent: true,
        depthWrite: false,
      }),
    );
    scene.add(mesh);

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      uniforms.uAspect.value = width / height;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    /* pointer — eased, so the light lags the cursor instead of snapping */
    const target = new Vector2(0, 0);
    const onMove = (e: MouseEvent) => {
      const r = host.getBoundingClientRect();
      target.set(
        ((e.clientX - r.left) / r.width - 0.5) * (r.width / r.height),
        -((e.clientY - r.top) / r.height - 0.5),
      );
      if (uniforms.uPointer.value < 1)
        gsap.to(uniforms.uPointer, { value: 1, duration: 1.2, overwrite: true });
    };
    const onLeave = () =>
      gsap.to(uniforms.uPointer, { value: 0, duration: 1.4, overwrite: true });
    if (!reduce) {
      host.parentElement?.addEventListener("mousemove", onMove);
      host.parentElement?.addEventListener("mouseleave", onLeave);
    }

    /* only draw while the section is actually on screen */
    let visible = false;
    const render = () => {
      if (!visible) return;
      uniforms.uTime.value += gsap.ticker.deltaRatio() * (1 / 60);
      const m = uniforms.uMouse.value;
      m.x += (target.x - m.x) * 0.05;
      m.y += (target.y - m.y) * 0.05;
      renderer.render(scene, camera);
    };

    if (reduce) {
      renderer.render(scene, camera); // one still frame, no loop
    } else {
      gsap.ticker.add(render);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "120px" },
    );
    io.observe(host);

    return () => {
      io.disconnect();
      ro.disconnect();
      gsap.ticker.remove(render);
      host.parentElement?.removeEventListener("mousemove", onMove);
      host.parentElement?.removeEventListener("mouseleave", onLeave);
      mesh.geometry.dispose();
      (mesh.material as ShaderMaterial).dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, [intensity]);

  return <div className="k-glow" ref={hostRef} aria-hidden />;
}

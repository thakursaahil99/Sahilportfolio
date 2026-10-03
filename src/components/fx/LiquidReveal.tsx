"use client";

import { useEffect, useRef } from "react";
import { getPerfTier } from "@/lib/perf";

/**
 * WebGL "liquid x-ray" reveal.
 *
 * Renders the `top` image full-bleed and melts through to the `bottom` image
 * wherever a gooey metaball trail follows the pointer. The blob edge refracts
 * and splits RGB like glass. When nobody interacts, an autopilot blob drifts
 * around so the effect is discoverable on touch screens too.
 *
 * Pointer input is read from `targetRef` (the element the canvas sits in).
 */

const TRAIL = 22;

const VERT = /* glsl */ `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;

uniform sampler2D uTop;
uniform sampler2D uBottom;
uniform vec2 uRes;
uniform vec2 uTopSize;
uniform vec2 uBottomSize;
uniform vec2 uTopFocus;
uniform vec2 uBottomFocus;
uniform vec3 uTrail[${TRAIL}];
uniform vec2 uParallax;
uniform float uRadius;
uniform float uTime;
uniform float uIntro;
uniform float uScroll;

// --- simplex noise (Ashima / Ian McEwan, MIT) ---
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// object-fit: cover around a focal point, with extra zoom
vec2 coverUv(vec2 uv, vec2 img, vec2 focus, float zoom) {
  float rs = uRes.x / uRes.y;
  float ri = img.x / img.y;
  vec2 s = rs < ri ? vec2(rs / ri, 1.0) : vec2(1.0, ri / rs);
  s /= zoom;
  // keep the focal point as centred as the crop allows
  vec2 offset = clamp(focus - s * 0.5, vec2(0.0), vec2(1.0) - s);
  return offset + uv * s;
}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / uRes.y;

  // ---- metaball field from the pointer trail ----
  vec2 p = vec2(uv.x * aspect, uv.y);
  float field = 0.0;
  for (int i = 0; i < ${TRAIL}; i++) {
    vec3 t = uTrail[i];
    vec2 q = vec2(t.x * aspect, t.y);
    vec2 d = p - q;
    field += t.z * (uRadius * uRadius) / (dot(d, d) + 0.00005);
  }

  // wobble the surface so the edge feels liquid. Most of the frame is far from
  // the lens, so skip the noise there — this is the bulk of the per-pixel cost.
  float n = 0.0;
  if (field > 0.3) {
    n = snoise(p * 4.0 + uTime * 0.35) * 0.5 + snoise(p * 11.0 - uTime * 0.6) * 0.25;
    field *= 1.0 + n * 0.35;
  }

  float mask = smoothstep(0.82, 1.08, field);
  float rim = smoothstep(0.55, 0.9, field) * (1.0 - smoothstep(0.95, 1.25, field));

  // refraction: push uv along the noise gradient near the rim
  vec2 refr = vec2(0.0);
  if (rim > 0.001) {
    vec2 grad = vec2(
      snoise(p * 6.0 + vec2(0.1, 0.0) + uTime * 0.3) - snoise(p * 6.0 - vec2(0.1, 0.0) + uTime * 0.3),
      snoise(p * 6.0 + vec2(0.0, 0.1) + uTime * 0.3) - snoise(p * 6.0 - vec2(0.0, 0.1) + uTime * 0.3)
    );
    refr = grad * rim * 0.035;
  }

  // ---- sample images ----
  float zoom = mix(1.18, 1.04, uIntro) + uScroll * 0.12;
  vec2 par = uParallax * 0.012;

  vec2 topUv = coverUv(uv + par + refr * 0.4, uTopSize, uTopFocus, zoom);
  vec3 top = texture2D(uTop, topUv).rgb;

  vec3 col = top;
  if (mask > 0.001) {
    vec2 botUv = coverUv(uv + par * 1.6 - refr, uBottomSize, uBottomFocus, zoom * 1.02);
    float ca = 0.004 + rim * 0.012;
    vec3 bottom = vec3(
      texture2D(uBottom, botUv + vec2(ca, 0.0)).r,
      texture2D(uBottom, botUv).g,
      texture2D(uBottom, botUv - vec2(ca, 0.0)).b
    );
    // slight cool grade inside the lens so it reads as "x-ray"
    bottom = mix(bottom, bottom * vec3(0.92, 1.0, 1.08), 0.5);
    col = mix(top, bottom, mask);
  }

  // molten rim glow
  vec3 rimCol = mix(vec3(1.0, 0.18, 0.1), vec3(1.0, 0.72, 0.28), n * 0.5 + 0.5);
  col += rimCol * rim * 0.55;

  // vignette + scroll fade + intro fade
  float vig = smoothstep(1.25, 0.25, length((uv - 0.5) * vec2(aspect * 0.8, 1.0)));
  col *= mix(0.55, 1.0, vig);
  col *= 1.0 - uScroll * 0.55;
  col *= uIntro;

  // film grain
  float g = fract(sin(dot(uv * uRes + uTime * 60.0, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - 0.5) * 0.045;

  gl_FragColor = vec4(col, 1.0);
}`;

interface LiquidRevealProps {
  top: string;
  bottom: string;
  topFocus?: [number, number];
  bottomFocus?: [number, number];
  targetRef: React.RefObject<HTMLElement | null>;
  /** 0 → 1 fade/zoom-in; flip to true when the intro should play */
  play: boolean;
  onReady?: () => void;
  onActiveChange?: (active: boolean) => void;
}

export default function LiquidReveal({
  top,
  bottom,
  topFocus = [0.5, 0.5],
  bottomFocus = [0.5, 0.5],
  targetRef,
  play,
  onReady,
  onActiveChange,
}: LiquidRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playRef = useRef(play);
  const cb = useRef({ onReady, onActiveChange });
  useEffect(() => {
    playRef.current = play;
    cb.current = { onReady, onActiveChange };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const target = targetRef.current;
    if (!canvas || !target) return;

    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) return; // fallback <Image> underneath stays visible

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // with a mouse the blob follows the cursor; the idle drift is only for touch screens
    const touch = window.matchMedia("(pointer: coarse)").matches;

    // ---------- program ----------
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(prog, name);
    const uni = {
      res: u("uRes"),
      topSize: u("uTopSize"),
      bottomSize: u("uBottomSize"),
      topFocus: u("uTopFocus"),
      bottomFocus: u("uBottomFocus"),
      trail: u("uTrail"),
      parallax: u("uParallax"),
      radius: u("uRadius"),
      time: u("uTime"),
      intro: u("uIntro"),
      scroll: u("uScroll"),
    };
    gl.uniform1i(u("uTop"), 0);
    gl.uniform1i(u("uBottom"), 1);
    // image uv has y pointing down, gl has y up — flip focus y accordingly
    gl.uniform2f(uni.topFocus, topFocus[0], 1 - topFocus[1]);
    gl.uniform2f(uni.bottomFocus, bottomFocus[0], 1 - bottomFocus[1]);

    // ---------- textures ----------
    let loaded = 0;
    const loadTexture = (src: string, unit: number, sizeUniform: WebGLUniformLocation | null) => {
      const tex = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([7, 7, 10, 255]));
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.uniform2f(sizeUniform, img.naturalWidth, img.naturalHeight);
        if (++loaded === 2) cb.current.onReady?.();
      };
      img.src = src;
      return tex;
    };
    const textures = [loadTexture(top, 0, uni.topSize), loadTexture(bottom, 1, uni.bottomSize)];
    gl.uniform2f(uni.topSize, 1, 1);
    gl.uniform2f(uni.bottomSize, 1, 1);

    // ---------- sizing ----------
    // Render scale: low-power devices start below 1x (the image is soft and grainy
    // anyway), and any device steps down further if it can't hold ~40fps.
    const lite = getPerfTier() === "lite";
    const maxScale = lite ? 0.75 : 1.5;
    const minScale = 0.5;
    let scale = Math.min(window.devicePixelRatio || 1, maxScale);
    let box = { width: 1, height: 1, docTop: 0 };

    const applySize = () => {
      canvas.width = Math.max(1, Math.round(box.width * scale));
      canvas.height = Math.max(1, Math.round(box.height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uni.res, canvas.width, canvas.height);
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      box = { width: rect.width, height: rect.height, docTop: rect.top + window.scrollY };
      applySize();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ---------- pointer + trail state ----------
    const pointer = { x: 0.5, y: 0.5, inside: false, pressed: false, lastMove: -1e9 };
    const head = { x: 0.5, y: 0.5 };
    const trail = new Float32Array(TRAIL * 3); // x, y, strength
    let headStrength = 0;
    let lastPush = { x: -1, y: -1 };
    let active = false;

    const toLocal = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = (e.clientX - r.left) / r.width;
      pointer.y = 1 - (e.clientY - r.top) / r.height;
    };
    const onMove = (e: PointerEvent) => {
      toLocal(e);
      pointer.inside = true;
      pointer.lastMove = performance.now();
    };
    const onLeave = () => {
      pointer.inside = false;
      pointer.pressed = false;
    };
    const onDown = (e: PointerEvent) => {
      toLocal(e);
      pointer.inside = true;
      pointer.pressed = true;
      pointer.lastMove = performance.now();
    };
    const onUp = (e: PointerEvent) => {
      pointer.pressed = false;
      if (e.pointerType !== "mouse") pointer.inside = false;
    };
    target.addEventListener("pointermove", onMove);
    target.addEventListener("pointerdown", onDown);
    target.addEventListener("pointerup", onUp);
    target.addEventListener("pointerleave", onLeave);
    target.addEventListener("pointercancel", onLeave);

    // pause when the hero is off-screen
    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(canvas);

    // ---------- loop ----------
    let raf = 0;
    let intro = 0;
    let slowFrames = 0;
    let lastDraw = 0;
    let lastScroll = -1;
    let parX = 0;
    let parY = 0;
    const t0 = performance.now();
    let last = t0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) {
        last = now;
        return;
      }
      const time = (now - t0) / 1000;
      // frame-rate independent smoothing: `k` is the per-frame factor at 60fps
      const rawDt = (now - last) / 1000;
      const dt = Math.min(0.1, rawDt);
      last = now;

      // struggling to keep up? drop the render resolution a notch
      if (rawDt > 0.025 && rawDt < 0.25) slowFrames++;
      else slowFrames = Math.max(0, slowFrames - 1);
      if (slowFrames > 30 && scale > minScale) {
        scale = Math.max(minScale, scale - 0.15);
        slowFrames = 0;
        applySize();
      }
      const lerp = (k: number) => 1 - Math.pow(1 - k, dt * 60);

      let tx = pointer.x;
      let ty = pointer.y;
      let targetStrength = pointer.inside ? (pointer.pressed ? 2.4 : 1) : 0;

      const autopilot = touch && !pointer.inside && !reduced && intro > 0.9;
      if (autopilot) {
        // a slow lissajous drift across the frame invites interaction
        tx = 0.55 + Math.sin(time * 0.43) * 0.22 + Math.sin(time * 0.17) * 0.08;
        ty = 0.55 + Math.cos(time * 0.31) * 0.18;
        targetStrength = 0.75;
      }

      const ease = lerp(pointer.inside ? 0.2 : 0.035);
      head.x += (tx - head.x) * ease;
      head.y += (ty - head.y) * ease;
      headStrength += (targetStrength - headStrength) * lerp(0.08);

      // decay the tail, then drop a new droplet whenever the head has travelled
      const decay = Math.pow(0.93, dt * 60);
      for (let i = 1; i < TRAIL; i++) trail[i * 3 + 2] *= decay;
      const dx = head.x - lastPush.x;
      const dy = head.y - lastPush.y;
      if (dx * dx + dy * dy > 0.00018) {
        for (let i = TRAIL - 1; i > 1; i--) {
          trail[i * 3] = trail[(i - 1) * 3];
          trail[i * 3 + 1] = trail[(i - 1) * 3 + 1];
          trail[i * 3 + 2] = trail[(i - 1) * 3 + 2];
        }
        trail[3] = head.x;
        trail[4] = head.y;
        trail[5] = headStrength * 0.42;
        lastPush = { x: head.x, y: head.y };
      }
      trail[0] = head.x;
      trail[1] = head.y;
      trail[2] = headStrength;

      if (pointer.inside !== active) {
        active = pointer.inside;
        cb.current.onActiveChange?.(active);
      }

      intro += ((playRef.current ? 1 : 0) - intro) * lerp(0.035);
      parX += ((pointer.inside ? pointer.x - 0.5 : 0) - parX) * lerp(0.05);
      parY += ((pointer.inside ? pointer.y - 0.5 : 0) - parY) * lerp(0.05);

      const scroll = Math.min(1, Math.max(0, (window.scrollY - box.docTop) / box.height));
      const small = box.width < 768;

      // nothing moving (no pointer, no drift, intro settled, not scrolling)? only the
      // liquid wobble and grain change, so ~20fps is indistinguishable and far cheaper
      const idle =
        !pointer.inside && !autopilot && headStrength < 0.01 && Math.abs((playRef.current ? 1 : 0) - intro) < 0.002 && scroll === lastScroll;
      lastScroll = scroll;
      if (idle && now - lastDraw < 50) return;
      lastDraw = now;

      gl.uniform3fv(uni.trail, trail);
      gl.uniform1f(uni.radius, small ? 0.11 : 0.13);
      gl.uniform1f(uni.time, reduced ? 0 : time);
      gl.uniform1f(uni.intro, intro);
      gl.uniform1f(uni.scroll, scroll);
      gl.uniform2f(uni.parallax, parX, parY);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerdown", onDown);
      target.removeEventListener("pointerup", onUp);
      target.removeEventListener("pointerleave", onLeave);
      target.removeEventListener("pointercancel", onLeave);
      textures.forEach((t) => gl.deleteTexture(t));
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
    // images / focus are fixed for the lifetime of the hero
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [top, bottom, targetRef]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

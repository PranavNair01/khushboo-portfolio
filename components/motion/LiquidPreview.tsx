"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { hasFinePointer, prefersReducedMotion } from "./motion";
import s from "./LiquidPreview.module.css";

// Hovering a row inside the same list as this canvas shows that row's cover on a WebGL plane
// that trails the cursor: it pours in from the bottom, ripples, and smears with speed.
// Rows opt in with data-liquid-src (an image or video URL), data-liquid-kind and data-liquid-poster.
// Sets data-liquid="on" on the list so its CSS-only previews can step aside.

const SIZE = { w: 260, h: 325 };

const VERTEX = `
attribute vec2 aPos;
uniform vec4 uRect;        // x, y, w, h in CSS px (top-left origin)
uniform vec2 uViewport;    // CSS px
varying vec2 vUv;
void main() {
  vUv = aPos;
  vec2 px = uRect.xy + aPos * uRect.zw;
  vec2 clip = (px / uViewport) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}`;

const FRAGMENT = `
precision mediump float;
uniform sampler2D uTex;
uniform vec2 uTexSize;
uniform vec2 uVel;
uniform float uTime;
uniform float uProgress;
varying vec2 vUv;

// object-fit: cover
vec2 cover(vec2 uv) {
  float planeRatio = ${(SIZE.w / SIZE.h).toFixed(4)};
  float texRatio = uTexSize.x / uTexSize.y;
  vec2 scale = planeRatio < texRatio ? vec2(planeRatio / texRatio, 1.0) : vec2(1.0, texRatio / planeRatio);
  return (uv - 0.5) * scale + 0.5;
}

void main() {
  vec2 uv = vUv;
  float speed = clamp(length(uVel), 0.0, 1.0);

  // Liquid surface: two slow sine ripples, stronger while moving.
  uv += vec2(sin(uv.y * 9.0 + uTime * 2.6), sin(uv.x * 7.0 - uTime * 2.1)) * (0.006 + speed * 0.02);
  // Lean into the direction of travel.
  uv.x -= uVel.x * 0.12 * (uv.y - 0.5);

  // Pour in from the bottom with a wavy edge (vUv.y is 0 at the top).
  float edge = 1.0 - uProgress * 1.15 + sin(vUv.x * 10.0 + uTime * 5.0) * 0.04;
  if (vUv.y < edge) discard;

  vec2 shift = uVel * 0.02;
  vec2 c = cover(uv);
  float r = texture2D(uTex, c + shift).r;
  float g = texture2D(uTex, c).g;
  float b = texture2D(uTex, c - shift).b;
  gl_FragColor = vec4(r, g, b, 1.0);
}`;

type Texture = { tex: WebGLTexture; source: HTMLImageElement | HTMLVideoElement; ready: boolean };

export function LiquidPreview() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    // The canvas sits inside the list's wrapper; hovering rows in that wrapper drives it.
    const list = canvas?.parentElement;
    if (!canvas || !list || !hasFinePointer() || prefersReducedMotion()) return;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: true });
    if (!gl) return;

    const program = link(gl, VERTEX, FRAGMENT);
    if (!program) return;
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    const u = (name: string) => gl.getUniformLocation(program, name);
    const uni = {
      rect: u("uRect"),
      viewport: u("uViewport"),
      texSize: u("uTexSize"),
      vel: u("uVel"),
      time: u("uTime"),
      progress: u("uProgress"),
    };
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

    list.dataset.liquid = "on";

    // ---------- textures, cached per URL ----------
    const textures = new Map<string, Texture>();
    const makeTexture = (src: string, kind: string, poster?: string): Texture => {
      const cached = textures.get(src);
      if (cached) return cached;
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      let entry: Texture;
      if (kind === "video") {
        const video = document.createElement("video");
        Object.assign(video, { crossOrigin: "anonymous", muted: true, loop: true, playsInline: true, src, poster });
        video.addEventListener("loadeddata", () => (entry.ready = true));
        entry = { tex, source: video, ready: false };
      } else {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
          entry.ready = true;
        };
        img.src = src;
        entry = { tex, source: img, ready: false };
      }
      textures.set(src, entry);
      return entry;
    };

    // ---------- state ----------
    const state = {
      current: null as Texture | null,
      // Last hovered texture: keeps drawing while the plane drains away after leaving.
      shown: null as Texture | null,
      mouse: { x: 0, y: 0 },
      pos: { x: 0, y: 0 },
      vel: { x: 0, y: 0 },
      progress: { value: 0 },
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const onMove = (e: PointerEvent) => {
      state.mouse.x = e.clientX;
      state.mouse.y = e.clientY;
    };
    const onOver = (e: PointerEvent) => {
      const row = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-liquid-src]") : null;
      if (!row || !list.contains(row)) return;
      const { liquidSrc, liquidKind, liquidPoster } = row.dataset;
      const next = makeTexture(liquidSrc!, liquidKind ?? "image", liquidPoster);
      if (state.current !== next) {
        if (state.current?.source instanceof HTMLVideoElement) state.current.source.pause();
        if (next.source instanceof HTMLVideoElement) next.source.play().catch(() => {});
        state.current = next;
        // Re-pour for every new row.
        gsap.fromTo(state.progress, { value: 0 }, { value: 1, duration: 0.9, ease: "expo.out", overwrite: true });
      }
    };
    const onLeave = () => {
      gsap.to(state.progress, { value: 0, duration: 0.5, ease: "power3.in", overwrite: true });
      if (state.current?.source instanceof HTMLVideoElement) state.current.source.pause();
      state.current = null;
    };

    // ---------- render loop ----------
    const render = (time: number) => {
      const ease = 0.12;
      const dx = state.mouse.x - state.pos.x;
      const dy = state.mouse.y - state.pos.y;
      state.pos.x += dx * ease;
      state.pos.y += dy * ease;
      state.vel.x += (gsap.utils.clamp(-1, 1, dx / 120) - state.vel.x) * 0.15;
      state.vel.y += (gsap.utils.clamp(-1, 1, dy / 120) - state.vel.y) * 0.15;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (state.current) state.shown = state.current;
      const shown = state.shown;
      if (state.progress.value <= 0.001 || !shown?.ready) return;

      gl.bindTexture(gl.TEXTURE_2D, shown.tex);
      const src = shown.source;
      if (src instanceof HTMLVideoElement && src.readyState >= 2) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
      }
      const w = src instanceof HTMLVideoElement ? src.videoWidth : src.naturalWidth;
      const h = src instanceof HTMLVideoElement ? src.videoHeight : src.naturalHeight;
      gl.uniform4f(uni.rect, state.pos.x + 24, state.pos.y - SIZE.h / 2, SIZE.w, SIZE.h);
      gl.uniform2f(uni.viewport, innerWidth, innerHeight);
      gl.uniform2f(uni.texSize, w || 1, h || 1);
      gl.uniform2f(uni.vel, state.vel.x, state.vel.y);
      gl.uniform1f(uni.time, time);
      gl.uniform1f(uni.progress, state.progress.value);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    gsap.ticker.add(render);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    list.addEventListener("pointerover", onOver);
    list.addEventListener("pointerleave", onLeave);
    return () => {
      gsap.ticker.remove(render);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      list.removeEventListener("pointerover", onOver);
      list.removeEventListener("pointerleave", onLeave);
      delete list.dataset.liquid;
      // Free GPU resources but keep the context alive: React may mount this canvas again.
      textures.forEach(({ tex, source }) => {
        if (source instanceof HTMLVideoElement) source.pause();
        gl.deleteTexture(tex);
      });
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={ref} className={s.canvas} aria-hidden />;
}

function link(gl: WebGLRenderingContext, vertex: string, fragment: string) {
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("LiquidPreview shader:", gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  };
  const vs = compile(gl.VERTEX_SHADER, vertex);
  const fs = compile(gl.FRAGMENT_SHADER, fragment);
  if (!vs || !fs) return null;
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

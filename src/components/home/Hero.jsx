"use client";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { heroProgress } from "@/lib/heroProgress";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

// ─── scroll stage thresholds (must match HeroCanvas.jsx) ──────────────────
const STAGE_SPHERE_END     = 0.38;
const STAGE_TRANSITION_END = 0.60;

// ─── util: clamp & map range ──────────────────────────────────────────────
function mapRange(value, inMin, inMax, outMin, outMax) {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}
function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

export default function Hero() {
  const sectionRef  = useRef(null);

  // overlay layer refs — updated via direct DOM (no React re-render, stays at 60 fps)
  const hintRef      = useRef(null); // "scroll to discover"
  const nameRef      = useRef(null); // "Parth Verma" heading block
  const ctaRef       = useRef(null); // buttons
  const progressRef  = useRef(null); // thin bottom progress bar
  const dotRef       = useRef(null); // scroll dot

  useEffect(() => {
    function onScroll() {
      const section = sectionRef.current;
      if (!section) return;

      const { top, height } = section.getBoundingClientRect();
      const scrollable = height - window.innerHeight;
      const raw = clamp(-top / scrollable, 0, 1);

      // Write to shared progress so HeroCanvas.jsx picks it up in useFrame
      heroProgress.value = raw;

      // ── Stage 1 (0 → STAGE_SPHERE_END): hint visible, name hidden ──
      const hintAlpha = raw < STAGE_SPHERE_END
        ? 1
        : clamp(mapRange(raw, STAGE_SPHERE_END, STAGE_SPHERE_END + 0.08, 1, 0), 0, 1);

      // ── Stage 2 (STAGE_SPHERE_END → STAGE_TRANSITION_END): name fades in then stays ──
      const nameAlpha = raw < STAGE_SPHERE_END
        ? 0
        : raw < STAGE_TRANSITION_END
          ? clamp(mapRange(raw, STAGE_SPHERE_END, STAGE_TRANSITION_END, 0, 1), 0, 1)
          : clamp(mapRange(raw, STAGE_TRANSITION_END, STAGE_TRANSITION_END + 0.15, 1, 0), 0, 1);

      const nameY = raw < STAGE_SPHERE_END
        ? 30
        : clamp(mapRange(raw, STAGE_SPHERE_END, STAGE_TRANSITION_END, 30, 0), 0, 30);

      // ── CTA: appears slightly after name ──
      const ctaAlpha = raw < STAGE_SPHERE_END + 0.08
        ? 0
        : raw < STAGE_TRANSITION_END
          ? clamp(mapRange(raw, STAGE_SPHERE_END + 0.08, STAGE_TRANSITION_END, 0, 1), 0, 1)
          : clamp(mapRange(raw, STAGE_TRANSITION_END, STAGE_TRANSITION_END + 0.12, 1, 0), 0, 1);

      // ── Apply DOM updates ──
      if (hintRef.current) {
        hintRef.current.style.opacity  = hintAlpha;
        hintRef.current.style.transform = `translateY(${(1 - hintAlpha) * -10}px)`;
      }
      if (nameRef.current) {
        nameRef.current.style.opacity   = nameAlpha;
        nameRef.current.style.transform = `translateY(${nameY}px)`;
      }
      if (ctaRef.current) {
        ctaRef.current.style.opacity  = ctaAlpha;
      }
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${raw})`;
      }
      if (dotRef.current) {
        dotRef.current.style.opacity = raw < 0.05 ? 1 : Math.max(0, 1 - raw * 4);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initialise
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/*
       * TALL SECTION — provides the scroll distance.
       * height: 350vh → lots of scroll room for all three stages.
       * The sticky inner div stays locked to the viewport the whole time.
       */}
      <section
        ref={sectionRef}
        style={{ height: "350vh" }}
        className="relative"
      >
        {/* ── STICKY VIEWPORT ── */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">

          {/* 3-D canvas fills the whole sticky area */}
          <HeroCanvas />

          {/* ── STAGE 1: "Scroll to discover" hint ── */}
          <div
            ref={hintRef}
            className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-3 pointer-events-none select-none"
            style={{ transition: "none" }}
          >
            <p className="text-[11px] uppercase tracking-[0.32em] text-amber-600/60 font-mono">
              Scroll to discover
            </p>
            {/* animated scroll dot */}
            <div
              ref={dotRef}
              className="w-5 h-8 rounded-full border border-amber-700/30 flex items-start justify-center pt-1"
            >
              <div className="w-1 h-1.5 rounded-full bg-amber-500/60 animate-bounce" />
            </div>
          </div>

          {/* ── STAGE 2: Name + tagline overlay ── */}
          <div
            ref={nameRef}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
            style={{ opacity: 0, transition: "none" }}
          >
            {/* eyebrow */}
            <p className="text-[11px] uppercase tracking-[0.38em] text-amber-600/60 mb-5 font-mono">
              Portfolio · 2025
            </p>

            {/* main name */}
            <h1
              className="text-[clamp(3.5rem,12vw,10rem)] leading-[0.9] tracking-[-0.06em] font-bold font-display text-center"
              style={{
                color: "#e8d0a0",
                textShadow: "0 0 80px rgba(200,136,48,0.4), 0 2px 0 rgba(0,0,0,0.5)",
              }}
            >
              Parth<br />Verma
            </h1>

            {/* sub-tagline */}
            <p className="mt-6 text-[12px] uppercase tracking-[0.36em] text-amber-700/50 font-mono">
              Frontend · 3D Web · Creative Code
            </p>
          </div>

          {/* ── STAGE 2: CTA buttons ── */}
          <div
            ref={ctaRef}
            className="absolute inset-x-0 bottom-16 flex justify-center gap-5 pointer-events-auto"
            style={{ opacity: 0, transition: "none" }}
          >
            <Link
              href="/projects"
              className="px-8 py-3 rounded-xl text-sm font-semibold text-black transition-all duration-300 hover:brightness-90"
              style={{ background: "linear-gradient(135deg, #c88830, #e8a840)" }}
            >
              View Projects
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 rounded-xl text-sm font-semibold border transition-all duration-300 hover:bg-amber-900/20"
              style={{ borderColor: "rgba(200,136,48,0.35)", color: "#c88830" }}
            >
              About Me
            </Link>
          </div>

          {/* ── Progress bar (very bottom of sticky area) ── */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent">
            <div
              ref={progressRef}
              className="h-full origin-left"
              style={{
                background: "linear-gradient(to right, #c88830, #e8a840, #6366f1)",
                transform: "scaleX(0)",
                transition: "none",
              }}
            />
          </div>
        </div>
      </section>

      {/* ── Transition: soft gradient that bleeds from the hero's warm BG into the portfolio's dark BG ── */}
      <div
        className="relative z-10 h-24 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, #05050f 0%, var(--color-background) 100%)",
          marginTop: -2,
        }}
      />
    </>
  );
}

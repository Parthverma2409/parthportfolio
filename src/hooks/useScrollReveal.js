"use client";
import { useEffect, useRef, useMemo } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function useScrollReveal(options = {}) {
  const ref = useRef(null);

  const {
    y = 40,
    x = 0,
    opacity = 0,
    scale = 1,
    duration = 0.8,
    delay = 0,
    ease = "power3.out",
    stagger = 0.1,
    start = "top 85%",
  } = options;

  // Stable reference to avoid re-triggering
  const config = useMemo(
    () => ({ y, x, opacity, scale, duration, delay, ease, stagger, start }),
    [y, x, opacity, scale, duration, delay, ease, stagger, start]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      el.style.opacity = "1";
      return;
    }

    const children = el.querySelectorAll("[data-reveal-child]");
    const targets = children.length > 0 ? children : el;

    gsap.set(targets, {
      y: config.y,
      x: config.x,
      opacity: config.opacity,
      scale: config.scale,
    });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: config.start,
      once: true,
      onEnter: () => {
        gsap.to(targets, {
          y: 0,
          x: 0,
          opacity: 1,
          scale: 1,
          duration: config.duration,
          delay: config.delay,
          ease: config.ease,
          stagger: children.length > 0 ? config.stagger : 0,
        });
      },
    });

    return () => trigger.kill();
  }, [config]);

  return ref;
}

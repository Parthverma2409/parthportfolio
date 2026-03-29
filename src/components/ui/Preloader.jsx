"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef(null);
  const textRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const text = textRef.current;
    const bar = barRef.current;

    // Safety fallback — always dismiss after 4s no matter what
    const fallback = setTimeout(() => setVisible(false), 4000);

    if (!overlay || !text || !bar) {
      setVisible(false);
      return () => clearTimeout(fallback);
    }

    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(fallback);
        setVisible(false);
      },
    });

    tl.fromTo(text, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" })
      .to(text, { textShadow: "0 0 60px rgba(99,102,241,0.8), 0 0 120px rgba(139,92,246,0.4)", duration: 0.4, ease: "power2.in" })
      .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, "-=0.3")
      .to(text, { y: -30, opacity: 0, duration: 0.3, ease: "power2.in" })
      .to(overlay, { yPercent: -100, duration: 0.6, ease: "power3.inOut" });

    return () => {
      clearTimeout(fallback);
      tl.kill();
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
    >
      <div
        ref={textRef}
        className="text-6xl md:text-8xl font-bold font-display bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent"
      >
        PV
      </div>
      <div className="w-32 h-0.5 mt-6 rounded-full bg-background-tertiary overflow-hidden">
        <div
          ref={barRef}
          className="h-full bg-gradient-to-r from-accent to-accent-hover origin-left"
        />
      </div>
    </div>
  );
}

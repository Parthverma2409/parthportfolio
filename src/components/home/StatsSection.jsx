"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";

const stats = [
  { label: "Projects Shipped", value: 5, suffix: "+" },
  { label: "Technologies Mastered", value: 12, suffix: "+" },
  { label: "GitHub Commits", value: 500, suffix: "+" },
  { label: "Hours of Code", value: 2000, suffix: "+" },
];

function Counter({ target, suffix }) {
  const [display, setDisplay] = useState(0);
  const elRef = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: elRef.current,
      start: "top 85%",
      once: true,
      onEnter: () => {
        if (started.current) return;
        started.current = true;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          onUpdate() {
            setDisplay(Math.round(obj.val));
          },
        });
      },
    });
    return () => trigger.kill();
  }, [target]);

  return (
    <span ref={elRef}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current?.querySelector("[data-stats-card]"),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-[#f8fafc] dark:bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 dark:text-foreground mb-4 leading-tight">
          The only thing I create is
          <br />
          <span className="bg-gradient-to-r from-accent to-accent-cyan bg-clip-text text-transparent">
            unique &amp; impact-driven experiences
          </span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-14 max-w-md mx-auto text-sm">
          Every line of code is intentional. Here&apos;s the proof.
        </p>

        <div
          data-stats-card
          className="p-10 rounded-2xl bg-white dark:bg-background-secondary shadow-[0_4px_60px_rgba(0,0,0,0.06)] dark:shadow-none border border-gray-100 dark:border-glass-border"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-3">
                  {s.label}
                </p>
                <p className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-foreground">
                  <Counter target={s.value} suffix={s.suffix} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

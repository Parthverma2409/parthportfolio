"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { timeline } from "@/data/timeline";
import {
  Rocket, MapPin, Brain, Shield, Box, BarChart3,
} from "lucide-react";

const iconMap = {
  Rocket, MapPin, Brain, Shield, Box, BarChart3,
};

export default function TimelineSection() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate SVG line draw
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              end: "bottom 80%",
              scrub: 1,
            },
          }
        );
      }

      // Animate timeline items
      const items = sectionRef.current?.querySelectorAll("[data-timeline-item]");
      items?.forEach((item, i) => {
        gsap.fromTo(
          item,
          {
            x: i % 2 === 0 ? -60 : 60,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              once: true,
            },
          }
        );
      });

      // Animate dots
      const dots = sectionRef.current?.querySelectorAll("[data-timeline-dot]");
      dots?.forEach((dot) => {
        gsap.fromTo(
          dot,
          { scale: 0 },
          {
            scale: 1,
            duration: 0.5,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: dot,
              start: "top 80%",
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            My{" "}
            <span className="bg-gradient-to-r from-accent to-accent-cyan bg-clip-text text-transparent">
              Journey
            </span>
          </h2>
          <p className="text-slate-400 text-lg">The milestones that shaped my path.</p>
        </div>

        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-glass-border -translate-x-1/2">
            <div
              ref={lineRef}
              className="w-full h-full bg-gradient-to-b from-accent via-accent-hover to-accent-cyan origin-top"
            />
          </div>

          {/* Timeline items */}
          <div className="space-y-16">
            {timeline.map((item, i) => {
              const Icon = iconMap[item.icon] || Rocket;
              const isLeft = i % 2 === 0;

              return (
                <div
                  key={item.id}
                  data-timeline-item
                  className={`relative flex items-center gap-8 ${
                    isLeft ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  {/* Content card */}
                  <div className={`w-[calc(50%-2rem)] ${isLeft ? "text-right" : "text-left"}`}>
                    <div className="inline-block p-6 rounded-2xl bg-glass-bg backdrop-blur-xl border border-glass-border hover:border-accent/30 transition-colors duration-300">
                      <span className={`text-xs font-mono px-2 py-1 rounded-lg ${
                        item.type === "upcoming"
                          ? "bg-accent-cyan/10 text-accent-cyan"
                          : item.type === "milestone"
                          ? "bg-accent/10 text-accent"
                          : "bg-accent-hover/10 text-accent-hover"
                      }`}>
                        {item.date}
                      </span>
                      <h3 className="text-lg font-semibold font-display mt-3 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div
                    data-timeline-dot
                    className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-background-secondary border-2 border-accent flex items-center justify-center text-accent z-10"
                  >
                    <Icon size={18} />
                  </div>

                  {/* Spacer */}
                  <div className="w-[calc(50%-2rem)]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

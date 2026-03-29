"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { testimonials } from "@/data/testimonials";
import { Star, ExternalLink } from "lucide-react";

const glowColors = [
  { from: "rgba(52,211,153,0.35)", via: "rgba(56,189,248,0.25)", to: "transparent" },
  { from: "rgba(139,92,246,0.35)", via: "rgba(99,102,241,0.25)", to: "transparent" },
  { from: "rgba(251,113,133,0.35)", via: "rgba(251,191,36,0.25)", to: "transparent" },
];

function Stars() {
  return (
    <div className="flex gap-1 mb-6">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, index }) {
  const g = glowColors[index % glowColors.length];
  return (
    <div
      data-tcard
      className="relative flex flex-col p-8 bg-white dark:bg-background-secondary rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.08)] dark:shadow-none border border-gray-100 dark:border-glass-border overflow-hidden"
    >
      {/* coloured glow behind card */}
      <div
        className="absolute -top-12 left-1/2 -translate-x-1/2 w-full h-28 blur-2xl opacity-60 pointer-events-none"
        style={{
          background: `linear-gradient(to right, ${g.from}, ${g.via}, ${g.to})`,
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <Stars />

        <p className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed flex-1 mb-8">
          &ldquo;{testimonial.quote}&rdquo;
        </p>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center text-white font-semibold text-sm shrink-0">
            {testimonial.author.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-foreground">
              {testimonial.author}
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-500">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-tcard]",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            once: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden bg-[#f8fafc] dark:bg-background"
    >
      {/* Ambient gradient layer behind the cards row */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-40 pointer-events-none">
        <div
          className="absolute inset-0 blur-3xl opacity-50"
          style={{
            background:
              "linear-gradient(to right, rgba(52,211,153,0.3) 0%, rgba(56,189,248,0.2) 25%, rgba(139,92,246,0.2) 50%, rgba(251,113,133,0.2) 75%, rgba(251,191,36,0.3) 100%)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-slate-500 text-sm mb-3 tracking-wide">
            People who&apos;ve worked and collaborated with me
          </p>
          <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-foreground">
            What they say about my work
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((t, i) => (
            <TestimonialCard key={t.id} testimonial={t} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-14">
          <a
            href="https://github.com/Parthverma2409"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 border border-gray-900 dark:border-foreground/60 text-sm font-medium text-gray-900 dark:text-foreground hover:bg-gray-900 hover:text-white dark:hover:bg-foreground dark:hover:text-background transition-all duration-300"
          >
            View all my projects on GitHub
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}

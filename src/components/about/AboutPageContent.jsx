"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { timeline } from "@/data/timeline";
import {
  GraduationCap, Briefcase, Sparkles, Code2, Palette, Zap,
  Rocket, MapPin, Brain, Shield, Box, BarChart3,
} from "lucide-react";

const iconMap = { Rocket, MapPin, Brain, Shield, Box, BarChart3 };

const aboutCards = [
  {
    icon: Sparkles,
    title: "Who I Am",
    content: "A passionate frontend developer turning complex ideas into beautiful, interactive web experiences. I blend 3D graphics, creative coding, and modern UI to build things that feel alive.",
    funFact: "I once spent 6 hours perfecting a single particle animation",
  },
  {
    icon: GraduationCap,
    title: "Education",
    content: "Pursuing Computer Science with a focus on web technologies, AI/ML, and creative computing. I believe in learning by building — every project teaches something new.",
    funFact: "Built my first website when I was 16",
  },
  {
    icon: Briefcase,
    title: "Experience",
    content: "5+ projects shipped across SaaS, AI tools, civic tech, and immersive 3D experiences. Full-stack capable with a frontend-first mindset.",
    funFact: "I've written production code in 8 different languages",
  },
];

const benefits = [
  { icon: Code2, title: "Clean Architecture", desc: "Modular, maintainable code with modern patterns and best practices." },
  { icon: Palette, title: "Creative Vision", desc: "Pixel-perfect implementation of designs with attention to micro-interactions." },
  { icon: Zap, title: "Performance First", desc: "Optimized bundles, lazy loading, and efficient rendering for 60fps." },
  { icon: Sparkles, title: "3D & Animation", desc: "WebGL, Three.js, and GSAP expertise for immersive experiences." },
];

function TiltCard({ card }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -15;
    gsap.to(cardRef.current, { rotateY: x, rotateX: y, duration: 0.4, ease: "power2.out", transformPerspective: 1000 });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
  };

  const Icon = card.icon;
  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative p-8 rounded-2xl bg-glass-bg backdrop-blur-xl border border-glass-border hover:border-accent/30 transition-colors cursor-pointer"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-accent/5 to-accent-hover/5" />
      <div className="relative z-10 space-y-4">
        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:shadow-glow transition-shadow">
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-semibold font-display">{card.title}</h3>
        <p className="text-slate-400 leading-relaxed">{card.content}</p>
        <div className="overflow-hidden max-h-0 group-hover:max-h-20 transition-all duration-500">
          <div className="pt-3 border-t border-glass-border">
            <p className="text-sm text-accent-cyan"><span className="font-medium">Fun fact:</span> {card.funFact}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AboutPageContent() {
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-about-reveal]", { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: pageRef.current, start: "top 80%", once: true },
      });

      // Timeline line draw
      const line = pageRef.current?.querySelector("[data-timeline-line]");
      if (line) {
        gsap.fromTo(line, { scaleY: 0 }, {
          scaleY: 1, ease: "none",
          scrollTrigger: { trigger: line.parentElement, start: "top 60%", end: "bottom 80%", scrub: 1 },
        });
      }

      // Timeline items
      pageRef.current?.querySelectorAll("[data-timeline-item]")?.forEach((item, i) => {
        gsap.fromTo(item, { x: i % 2 === 0 ? -40 : 40, opacity: 0 }, {
          x: 0, opacity: 1, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 85%", once: true },
        });
      });

      // Benefits
      gsap.fromTo("[data-benefit]", { y: 30, opacity: 0, scale: 0.95 }, {
        y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: "[data-benefits-section]", start: "top 80%", once: true },
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20" data-about-reveal>
          <h1 className="text-5xl md:text-7xl font-bold font-display mb-6">
            About{" "}
            <span className="bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">Me</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A glimpse into who I am, what drives me, and the journey that shaped my path as a developer.
          </p>
        </div>

        {/* About Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32" data-about-reveal>
          {aboutCards.map((card) => <TiltCard key={card.title} card={card} />)}
        </div>

        {/* Timeline */}
        <div className="mb-32">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-center mb-16" data-about-reveal>
            My <span className="bg-gradient-to-r from-accent to-accent-cyan bg-clip-text text-transparent">Journey</span>
          </h2>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-glass-border -translate-x-1/2">
              <div data-timeline-line className="w-full h-full bg-gradient-to-b from-accent via-accent-hover to-accent-cyan origin-top" />
            </div>
            <div className="space-y-12">
              {timeline.map((item, i) => {
                const Icon = iconMap[item.icon] || Rocket;
                const isLeft = i % 2 === 0;
                return (
                  <div key={item.id} data-timeline-item className={`relative flex items-center gap-6 ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
                    <div className={`w-[calc(50%-1.5rem)] ${isLeft ? "text-right" : "text-left"}`}>
                      <div className="inline-block p-5 rounded-2xl bg-glass-bg backdrop-blur-xl border border-glass-border hover:border-accent/30 transition-colors">
                        <span className={`text-xs font-mono px-2 py-1 rounded-lg ${
                          item.type === "upcoming" ? "bg-accent-cyan/10 text-accent-cyan"
                          : item.type === "milestone" ? "bg-accent/10 text-accent"
                          : "bg-accent-hover/10 text-accent-hover"
                        }`}>{item.date}</span>
                        <h3 className="text-lg font-semibold font-display mt-3 mb-2">{item.title}</h3>
                        <p className="text-sm text-slate-400">{item.description}</p>
                      </div>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-background-secondary border-2 border-accent flex items-center justify-center text-accent z-10">
                      <Icon size={16} />
                    </div>
                    <div className="w-[calc(50%-1.5rem)]" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div data-benefits-section>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-center mb-16" data-about-reveal>
            What I <span className="bg-gradient-to-r from-accent-cyan to-accent bg-clip-text text-transparent">Bring</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} data-benefit className="p-6 rounded-2xl bg-glass-bg border border-glass-border hover:border-accent/30 transition-all hover:-translate-y-1 cursor-pointer group">
                  <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:shadow-glow transition-shadow">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-semibold font-display mb-2">{b.title}</h3>
                  <p className="text-sm text-slate-400">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

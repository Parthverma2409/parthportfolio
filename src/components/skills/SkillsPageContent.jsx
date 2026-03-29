"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { skills, skillCategories } from "@/data/skills";
import { Code2, Globe, Box } from "lucide-react";

const deepDives = [
  {
    icon: Code2,
    title: "React Ecosystem",
    color: "#61dafb",
    desc: "From component architecture and custom hooks to state management with Zustand and server components in Next.js — React is my primary tool for building production-grade interfaces.",
    tools: ["React 19", "Next.js 16", "Zustand", "React Query", "Framer Motion"],
  },
  {
    icon: Box,
    title: "3D & Creative Coding",
    color: "#049ef4",
    desc: "Three.js with React Three Fiber for declarative 3D scenes. GSAP for scroll-driven animations, magnetic effects, and complex timelines. WebGL shaders for particle systems and visual effects.",
    tools: ["Three.js", "React Three Fiber", "GSAP", "Postprocessing", "Shaders"],
  },
  {
    icon: Globe,
    title: "Backend & Data",
    color: "#339933",
    desc: "Node.js and Express for REST APIs, MongoDB for data persistence, Python for ML pipelines and data analysis. Currently expanding into data analytics and visualization.",
    tools: ["Node.js", "Express", "MongoDB", "Python", "FastAPI"],
  },
];

function SkillCard({ skill }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="perspective-[1000px] cursor-pointer"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div className={`relative w-full h-40 transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}>
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl bg-glass-bg backdrop-blur-xl border border-glass-border p-5 flex flex-col items-center justify-center gap-2"
          style={{ borderColor: `${skill.color}30` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold font-display"
            style={{ backgroundColor: `${skill.color}15`, color: skill.color }}>
            {skill.name.slice(0, 2)}
          </div>
          <span className="text-sm font-medium">{skill.name}</span>
          <span className="text-xs text-slate-500">{skill.category}</span>
        </div>
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl p-5 flex flex-col justify-between border"
          style={{ backgroundColor: `${skill.color}10`, borderColor: `${skill.color}40` }}>
          <div>
            <h4 className="font-semibold text-sm mb-1.5" style={{ color: skill.color }}>{skill.name}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{skill.desc}</p>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Proficiency</span>
              <span style={{ color: skill.color }}>{skill.level}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-background-tertiary overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: flipped ? `${skill.level}%` : "0%", backgroundColor: skill.color }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SkillsPageContent() {
  const pageRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All" ? skills : skills.filter((s) => s.category === activeCategory);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-skill-reveal]", { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: pageRef.current, start: "top 80%", once: true },
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16" data-skill-reveal>
          <h1 className="text-5xl md:text-7xl font-bold font-display mb-6">
            Skills & <span className="bg-gradient-to-r from-accent-cyan to-accent bg-clip-text text-transparent">Expertise</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">Technologies I use daily to build production-grade web experiences.</p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12" data-skill-reveal>
          {skillCategories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeCategory === cat ? "bg-accent text-white shadow-glow" : "bg-glass-bg border border-glass-border text-slate-400 hover:text-foreground hover:border-accent/30"
              }`}>{cat}</button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-32" data-skill-reveal>
          {filtered.map((skill) => <SkillCard key={skill.name} skill={skill} />)}
        </div>

        {/* Deep Dives */}
        <h2 className="text-3xl md:text-4xl font-bold font-display text-center mb-12" data-skill-reveal>
          Deep <span className="bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">Dives</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-skill-reveal>
          {deepDives.map((d) => {
            const Icon = d.icon;
            return (
              <div key={d.title} className="p-8 rounded-2xl bg-glass-bg border border-glass-border hover:border-accent/30 transition-all hover:-translate-y-1 group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:shadow-glow transition-shadow"
                  style={{ backgroundColor: `${d.color}15`, color: d.color }}>
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-semibold font-display mb-3">{d.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-5">{d.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {d.tools.map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-lg bg-background-tertiary text-slate-400 border border-glass-border">{t}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

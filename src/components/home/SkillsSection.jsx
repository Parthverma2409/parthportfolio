"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";
import { skills, skillCategories } from "@/data/skills";

// Map proficiency % → game level label + colour
function getLevel(pct) {
  if (pct >= 90) return { label: "MAX",    ring: "#f59e0b", bg: "#f59e0b15" };
  if (pct >= 80) return { label: "S",      ring: "#6366f1", bg: "#6366f115" };
  if (pct >= 70) return { label: "A",      ring: "#8b5cf6", bg: "#8b5cf615" };
  if (pct >= 60) return { label: "B",      ring: "#06b6d4", bg: "#06b6d415" };
  return              { label: "C",      ring: "#64748b", bg: "#64748b15" };
}

function XPBar({ pct, color, active }) {
  const barRef = useRef(null);

  useEffect(() => {
    if (!barRef.current) return;
    gsap.to(barRef.current, {
      width: active ? `${pct}%` : "0%",
      duration: active ? 1.2 : 0,
      ease: "power2.out",
      delay: 0.1,
    });
  }, [active, pct]);

  return (
    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
      <div
        ref={barRef}
        className="h-full rounded-full"
        style={{ width: "0%", backgroundColor: color }}
      />
    </div>
  );
}

function SkillCard({ skill }) {
  const [active, setActive] = useState(false);
  const cardRef = useRef(null);
  const lv = getLevel(skill.level);

  // Trigger XP bar fill when card enters viewport
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: cardRef.current,
      start: "top 88%",
      once: true,
      onEnter: () => setActive(true),
    });
    return () => trigger.kill();
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 cursor-default"
      style={{
        backgroundColor: lv.bg,
        borderColor: `${lv.ring}30`,
      }}
    >
      {/* Level badge — top-right */}
      <div
        className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono border"
        style={{ color: lv.ring, borderColor: `${lv.ring}50`, backgroundColor: `${lv.ring}15` }}
      >
        {lv.label}
      </div>

      {/* Skill icon abbreviation */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold font-display mb-3"
        style={{ backgroundColor: `${skill.color}18`, color: skill.color }}
      >
        {skill.name.slice(0, 2)}
      </div>

      {/* Name + category */}
      <p className="text-sm font-semibold text-foreground mb-0.5">{skill.name}</p>
      <p className="text-[10px] text-slate-500 mb-3">{skill.category}</p>

      {/* XP bar */}
      <XPBar pct={skill.level} color={skill.color} active={active} />

      {/* XP fraction */}
      <div className="flex justify-between mt-1.5 text-[9px] font-mono text-slate-600">
        <span>XP</span>
        <span style={{ color: skill.color }}>{skill.level} / 100</span>
      </div>

      {/* Hover tooltip */}
      <div className="absolute inset-x-0 bottom-full mb-2 px-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
        <div className="bg-background-secondary border border-glass-border rounded-xl px-4 py-3 text-xs text-slate-300 leading-relaxed shadow-xl">
          {skill.desc}
        </div>
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const sectionRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-skills-header]",
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
    <section ref={sectionRef} className="py-32 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div data-skills-header className="text-center mb-14">
          {/* Player-card style title */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono tracking-widest uppercase">
            ⚔ Skill Tree
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            What I{" "}
            <span className="bg-gradient-to-r from-accent-cyan to-accent bg-clip-text text-transparent">
              Master
            </span>
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Hover a card to read the skill description. XP fills as the card enters view.
          </p>

          {/* Level legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-6 text-[10px] font-mono">
            {[
              { lv: "MAX", desc: "90-100", color: "#f59e0b" },
              { lv: "S",   desc: "80-89",  color: "#6366f1" },
              { lv: "A",   desc: "70-79",  color: "#8b5cf6" },
              { lv: "B",   desc: "60-69",  color: "#06b6d4" },
              { lv: "C",   desc: "< 60",   color: "#64748b" },
            ].map((t) => (
              <span
                key={t.lv}
                className="px-3 py-1 rounded-lg border"
                style={{ color: t.color, borderColor: `${t.color}40`, backgroundColor: `${t.color}10` }}
              >
                {t.lv} &nbsp;·&nbsp; {t.desc} XP
              </span>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {skillCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-xl text-xs font-mono uppercase tracking-widest transition-all duration-300 border ${
                activeCategory === cat
                  ? "bg-accent text-white border-accent shadow-glow"
                  : "bg-glass-bg border-glass-border text-slate-400 hover:text-foreground hover:border-accent/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skill grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </div>
      </div>
    </section>
  );
}

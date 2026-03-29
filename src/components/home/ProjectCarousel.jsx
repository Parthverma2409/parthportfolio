"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { projects } from "@/data/projects";
import { Code2, ExternalLink, ArrowLeft, ArrowRight } from "lucide-react";

// ─── helpers ────────────────────────────────────────────────────────────────

function getCardTransform(offset) {
  // offset = cardIndex - activeFloat  (negative = left, 0 = centre, positive = right)
  const absOff = Math.abs(offset);
  return {
    x:       offset * 340,
    rotateY: -offset * 30,
    z:       -absOff * 160,
    scale:   Math.max(0.68, 1 - absOff * 0.115),
    opacity: absOff > 2.6 ? 0 : Math.max(0.18, 1 - absOff * 0.28),
    zIndex:  Math.round(100 - absOff * 10),
  };
}

// ─── single card ─────────────────────────────────────────────────────────────

function ProjectCard({ project, cardRef }) {
  return (
    <div
      ref={cardRef}
      className="absolute rounded-[28px] overflow-hidden will-change-transform"
      style={{
        width: 300,
        height: 460,
        left: "50%",
        top: "50%",
        marginLeft: -150,
        marginTop: -230,
        transformOrigin: "center center",
        boxShadow: "0 40px 100px -20px rgba(0,0,0,0.7)",
      }}
    >
      {/* base bg */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(145deg, ${project.color}20 0%, ${project.color}06 50%, #0a0a0f 100%)`,
          backgroundColor: "#111118",
        }}
      />

      {/* grid texture */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(${project.color} 1px, transparent 1px),
            linear-gradient(90deg, ${project.color} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* browser chrome */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-1.5 px-4 py-3 bg-black/40 backdrop-blur-sm border-b border-white/5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <div className="flex-1 mx-3 h-5 rounded-md bg-white/5 flex items-center px-2">
            <span className="text-[8px] text-white/25 truncate font-mono">
              {project.github.replace("https://", "")}
            </span>
          </div>
        </div>

        {/* visual area */}
        <div className="flex-1 relative overflow-hidden">
          {/* glow orb */}
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full blur-3xl"
            style={{ backgroundColor: project.color, opacity: 0.28 }}
          />
          {/* category badge */}
          <div className="absolute top-4 right-4">
            <span
              className="text-[10px] font-mono px-2.5 py-1 rounded-md border"
              style={{
                color: project.color,
                borderColor: `${project.color}45`,
                backgroundColor: `${project.color}12`,
              }}
            >
              {project.category}
            </span>
          </div>
          {/* corner accent */}
          <div
            className="absolute bottom-0 left-0 w-full h-px"
            style={{ background: `linear-gradient(to right, ${project.color}60, transparent)` }}
          />
        </div>

        {/* info */}
        <div className="shrink-0 p-6 space-y-3 bg-gradient-to-t from-black/60 to-transparent">
          <h3 className="text-lg font-bold font-display text-white leading-tight">
            {project.title}
          </h3>
          <p className="text-xs text-white/45 leading-relaxed line-clamp-2">
            {project.desc}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[9px] px-2 py-0.5 rounded bg-white/6 text-white/35 border border-white/8"
              >
                {tag}
              </span>
            ))}
          </div>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-[11px] text-white/45 hover:text-white transition-colors pt-1"
          >
            <Code2 size={11} /> View Source
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── main carousel ───────────────────────────────────────────────────────────

export default function ProjectCarousel() {
  const sectionRef  = useRef(null);
  const cardRefs    = useRef([]);
  const activeRef   = useRef(0);          // raw float as scroll progresses
  const [activeIdx, setActiveIdx] = useState(0); // rounded, for the dot UI

  const n = projects.length;

  // ── apply transforms for a given activeFloat ──────────────────────────────
  function applyTransforms(activeFloat) {
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const { x, rotateY, z, scale, opacity, zIndex } = getCardTransform(i - activeFloat);
      gsap.set(card, { x, rotateY, z, scale, opacity, zIndex });
    });
    setActiveIdx(Math.round(activeFloat));
  }

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean);
    if (!cards.length) return;

    // Set initial positions (card 0 = centre)
    applyTransforms(0);

    // ScrollTrigger: no pin → no DOM reparenting → no removeChild crash
    // The sticky CSS keeps the viewport locked; this just drives the progress value.
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start:  "top top",
      end:    "bottom bottom",
      scrub:  1.4,
      onUpdate(self) {
        const active = self.progress * (n - 1);
        activeRef.current = active;
        applyTransforms(active);
      },
    });

    return () => trigger.kill();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  return (
    /*
     * Tall section = (n + 0.5) full screen-heights of scrollable distance.
     * The sticky inner div stays fixed for the whole ride.
     * No GSAP pin — CSS sticky does the visual lock.
     */
    <section
      ref={sectionRef}
      style={{ height: `${n * 100 + 50}vh` }}
      className="relative"
    >
      <div
        className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden bg-background"
        style={{ perspective: "1800px", perspectiveOrigin: "50% 50%" }}
      >
        {/* ambient bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 55% at 50% 58%, #12123a 0%, transparent 70%)",
          }}
        />

        {/* ── header ── */}
        <div className="relative z-20 text-center mb-6 px-6 select-none">
          <p className="text-slate-500 text-xs mb-2 tracking-widest uppercase font-mono">
            Scroll to browse
          </p>
          <h2 className="text-4xl md:text-5xl font-bold font-display text-foreground">
            Featured{" "}
            <span className="bg-gradient-to-r from-accent-hover to-accent bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <p className="text-slate-400 mt-2 text-sm max-w-md mx-auto">
            Each project pushes the boundary of what&apos;s possible on the web.
          </p>
        </div>

        {/* ── 3-D card stage ── */}
        <div
          className="relative z-10 flex-shrink-0"
          style={{ width: "100%", height: 480 }}
        >
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              cardRef={(el) => { cardRefs.current[i] = el; }}
            />
          ))}
        </div>

        {/* ── dot indicator ── */}
        <div className="relative z-20 flex items-center gap-2 mt-6 select-none">
          {projects.map((p, i) => (
            <button
              key={p.id}
              aria-label={`Go to ${p.title}`}
              className="transition-all duration-300"
              style={{
                width:  i === activeIdx ? 24 : 6,
                height: 6,
                borderRadius: 9999,
                backgroundColor: i === activeIdx ? p.color : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>

        {/* ── active project name ── */}
        <div className="relative z-20 mt-4 h-6 select-none">
          {projects.map((p, i) => (
            <p
              key={p.id}
              className="absolute inset-0 text-center text-sm font-medium text-slate-400 transition-all duration-300"
              style={{
                opacity:   i === activeIdx ? 1 : 0,
                transform: i === activeIdx ? "translateY(0)" : "translateY(6px)",
              }}
            >
              {p.title}
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-300 transition-colors"
              >
                <ExternalLink size={10} />
              </a>
            </p>
          ))}
        </div>

        {/* ── scroll hint arrows (fade out after first card) ── */}
        <div className="relative z-20 flex items-center gap-3 mt-5 text-slate-600 select-none pointer-events-none">
          <ArrowLeft size={14} className={activeIdx === 0 ? "opacity-20" : "opacity-60"} />
          <span className="text-[10px] font-mono tracking-widest uppercase">
            {activeIdx + 1} / {n}
          </span>
          <ArrowRight size={14} className={activeIdx === n - 1 ? "opacity-20" : "opacity-60"} />
        </div>
      </div>
    </section>
  );
}

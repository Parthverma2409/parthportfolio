"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { projects, categories } from "@/data/projects";
import { Code2, ExternalLink, ArrowUpRight } from "lucide-react";

function ProjectCard({ project }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    gsap.to(cardRef.current, { rotateY: x, rotateX: y, duration: 0.4, ease: "power2.out" });

    if (glowRef.current) {
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;
      glowRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%, ${project.color}25, transparent 60%)`;
    }
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    if (glowRef.current) glowRef.current.style.background = "transparent";
  };

  return (
    <div
      ref={cardRef}
      className="group rounded-2xl bg-glass-bg backdrop-blur-xl border border-glass-border hover:border-accent/30 transition-all duration-500 overflow-hidden cursor-pointer"
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Browser Frame */}
      <div className="relative h-52 bg-background-tertiary overflow-hidden">
        <div className="absolute top-3 left-0 right-0 mx-auto w-[90%] h-[85%] rounded-t-lg border border-glass-border bg-background-secondary overflow-hidden">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-background-tertiary border-b border-glass-border">
            <div className="w-2 h-2 rounded-full bg-red-500/60" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
            <div className="w-2 h-2 rounded-full bg-green-500/60" />
            <div className="flex-1 mx-2 h-4 rounded bg-background/60 flex items-center px-2">
              <span className="text-[8px] text-slate-600 truncate">{project.github}</span>
            </div>
          </div>
          <div className="p-4 space-y-2">
            <div className="h-3 rounded bg-glass-border w-3/4" />
            <div className="h-3 rounded bg-glass-border w-1/2" />
            <div className="h-3 rounded bg-glass-border w-5/6" />
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="h-8 rounded bg-glass-border" />
              <div className="h-8 rounded bg-glass-border" />
              <div className="h-8 rounded bg-glass-border" />
            </div>
          </div>
        </div>
        <div ref={glowRef} className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold font-display group-hover:text-accent transition-colors">{project.title}</h3>
            <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${project.color}15`, color: project.color }}>
              {project.category}
            </span>
          </div>
          <a href={project.github} target="_blank" rel="noopener noreferrer"
            className="p-2 rounded-lg bg-glass-bg border border-glass-border hover:border-accent/40 hover:text-accent transition-all"
            aria-label={`View ${project.title} on GitHub`}>
            <ArrowUpRight size={18} />
          </a>
        </div>

        <p className="text-sm text-slate-400 leading-relaxed">{project.desc}</p>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded-lg bg-background-tertiary text-slate-400 border border-glass-border">{tag}</span>
          ))}
        </div>

        <div className="flex gap-3 pt-2 border-t border-glass-border">
          <a href={project.github} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-accent transition-colors">
            <Code2 size={16} /> Source Code
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPageContent() {
  const pageRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All" ? projects : projects.filter((p) => p.category === activeCategory);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-project-reveal]", { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: pageRef.current, start: "top 80%", once: true },
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16" data-project-reveal>
          <h1 className="text-5xl md:text-7xl font-bold font-display mb-6">
            My <span className="bg-gradient-to-r from-accent-hover to-accent bg-clip-text text-transparent">Projects</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            A collection of work spanning AI tools, SaaS platforms, civic tech, and immersive 3D experiences.
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12" data-project-reveal>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-accent text-white shadow-glow"
                  : "bg-glass-bg border border-glass-border text-slate-400 hover:text-foreground hover:border-accent/30"
              }`}>{cat}</button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-project-reveal>
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Coming Soon */}
        {activeCategory === "Data Analytics" && filtered.length === 0 && (
          <div className="text-center py-20" data-project-reveal>
            <div className="inline-block p-8 rounded-2xl bg-glass-bg border border-glass-border">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-accent-cyan/10 flex items-center justify-center text-accent-cyan">
                <ExternalLink size={28} />
              </div>
              <h3 className="text-xl font-semibold font-display mb-2">Coming Soon</h3>
              <p className="text-slate-400 text-sm max-w-sm">
                Data analytics projects are currently in development. Stay tuned for dashboards, visualizations, and insights.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

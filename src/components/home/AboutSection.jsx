"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { GraduationCap, Briefcase, Sparkles } from "lucide-react";

const cards = [
  {
    icon: Sparkles,
    title: "Who I Am",
    content: "A passionate frontend developer who loves turning complex ideas into beautiful, interactive web experiences. I specialize in blending 3D graphics with modern UI.",
    funFact: "I once spent 6 hours perfecting a single particle animation",
    speed: 0.8,
  },
  {
    icon: GraduationCap,
    title: "Education",
    content: "Pursuing Computer Science with a focus on web technologies, AI/ML, and creative computing. Always learning, always building.",
    funFact: "Built my first website at 16",
    speed: 1.2,
  },
  {
    icon: Briefcase,
    title: "Experience",
    content: "5+ projects shipped including SaaS platforms, AI tools, civic tech solutions, and immersive 3D experiences. Full-stack capable, frontend-focused.",
    funFact: "I've written code in 8 different programming languages",
    speed: 1.0,
  },
];

function TiltCard({ card, index }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (y / rect.height) * -15;
    const rotateY = (x / rect.width) * 15;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 1000,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
  };

  const Icon = card.icon;

  return (
    <div
      ref={cardRef}
      data-reveal-child
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative p-8 rounded-2xl bg-glass-bg backdrop-blur-xl border border-glass-border hover:border-accent/30 transition-colors duration-300 cursor-pointer"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-accent/5 to-accent-hover/5" />

      <div className="relative z-10 space-y-4">
        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:shadow-glow transition-shadow duration-300">
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-semibold font-display">{card.title}</h3>
        <p className="text-slate-400 leading-relaxed">{card.content}</p>

        {/* Fun fact tooltip */}
        <div className="overflow-hidden max-h-0 group-hover:max-h-20 transition-all duration-500 ease-out">
          <div className="pt-3 border-t border-glass-border">
            <p className="text-sm text-accent-cyan">
              <span className="font-medium">Fun fact:</span> {card.funFact}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AboutSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax scroll on cards
      const cardEls = sectionRef.current?.querySelectorAll("[data-reveal-child]");
      if (!cardEls) return;

      cardEls.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              once: true,
            },
          }
        );

        // Parallax effect
        gsap.to(card, {
          y: cards[i].speed * -30,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            About{" "}
            <span className="bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">
              Me
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            A glimpse into who I am, what I do, and where I&apos;m headed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <TiltCard key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { Send, CheckCircle } from "lucide-react";

function MagneticButton({ children, className }) {
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btnRef.current, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(btnRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)",
    });
  };

  return (
    <button
      ref={btnRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      type="submit"
    >
      {children}
    </button>
  );
}

function AnimatedInput({ label, type = "text", name, required }) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div className="relative">
      <label
        className={`absolute left-4 transition-all duration-300 pointer-events-none ${
          focused || value
            ? "top-1 text-xs text-accent"
            : "top-3.5 text-sm text-slate-500"
        }`}
      >
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          name={name}
          required={required}
          rows={4}
          className="w-full bg-glass-bg border border-glass-border rounded-xl px-4 pt-6 pb-3 text-foreground focus:outline-none focus:border-accent/50 transition-colors resize-none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          className="w-full bg-glass-bg border border-glass-border rounded-xl px-4 pt-6 pb-3 text-foreground focus:outline-none focus:border-accent/50 transition-colors"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      )}
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-accent transition-all duration-500 rounded-full ${
          focused ? "w-full" : "w-0"
        }`}
      />
    </div>
  );
}

export default function ContactSection() {
  const sectionRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current?.querySelectorAll("[data-contact-anim]") || [],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section ref={sectionRef} className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16" data-contact-anim>
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Get In{" "}
            <span className="bg-gradient-to-r from-accent-cyan to-accent bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Have a project in mind or just want to chat? I&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6" data-contact-anim>
            <AnimatedInput label="Your Name" name="name" required />
            <AnimatedInput label="Email Address" type="email" name="email" required />
            <AnimatedInput label="Subject" name="subject" />
            <AnimatedInput label="Your Message" type="textarea" name="message" required />

            <MagneticButton
              className={`group w-full py-4 rounded-xl font-medium text-white flex items-center justify-center gap-3 transition-all duration-300 ${
                submitted
                  ? "bg-green-500 shadow-[0_0_40px_rgba(34,197,94,0.3)]"
                  : "bg-accent hover:shadow-glow"
              }`}
            >
              {submitted ? (
                <>
                  <CheckCircle size={20} /> Message Sent!
                </>
              ) : (
                <>
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Send Message
                </>
              )}
            </MagneticButton>
          </form>

          {/* Info */}
          <div className="space-y-8" data-contact-anim>
            <div className="p-6 rounded-2xl bg-glass-bg border border-glass-border">
              <h3 className="font-semibold font-display mb-4 text-lg">Let&apos;s Connect</h3>
              <div className="space-y-4 text-slate-400">
                <a
                  href="mailto:parthverma2409@gmail.com"
                  className="block hover:text-accent transition-colors"
                >
                  parthverma2409@gmail.com
                </a>
                <a
                  href="https://github.com/Parthverma2409"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-accent transition-colors"
                >
                  github.com/Parthverma2409
                </a>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent-hover/10 border border-accent/20">
              <p className="text-sm text-slate-300 leading-relaxed">
                I&apos;m currently open to freelance projects, collaborations, and full-time opportunities.
                Let&apos;s build something amazing together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

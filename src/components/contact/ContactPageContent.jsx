"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { Send, CheckCircle, Mail, MapPin, Clock, ChevronDown } from "lucide-react";

function MagneticButton({ children, className }) {
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btnRef.current, { x: x * 0.35, y: y * 0.35, duration: 0.3, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
  };

  return (
    <button ref={btnRef} className={className} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} type="submit">
      {children}
    </button>
  );
}

function AnimatedInput({ label, type = "text", name, required }) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div className="relative">
      <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
        focused || value ? "top-1 text-xs text-accent" : "top-3.5 text-sm text-slate-500"
      }`}>{label}</label>
      {type === "textarea" ? (
        <textarea name={name} required={required} rows={5}
          className="w-full bg-glass-bg border border-glass-border rounded-xl px-4 pt-6 pb-3 text-foreground focus:outline-none focus:border-accent/50 transition-colors resize-none"
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          onChange={(e) => setValue(e.target.value)} value={value} />
      ) : (
        <input type={type} name={name} required={required}
          className="w-full bg-glass-bg border border-glass-border rounded-xl px-4 pt-6 pb-3 text-foreground focus:outline-none focus:border-accent/50 transition-colors"
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          onChange={(e) => setValue(e.target.value)} value={value} />
      )}
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-accent transition-all duration-500 rounded-full ${focused ? "w-full" : "w-0"}`} />
    </div>
  );
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-glass-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-glass-bg transition-colors cursor-pointer"
        aria-expanded={open}
      >
        <span className="font-medium text-sm">{question}</span>
        <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-40" : "max-h-0"}`}>
        <p className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

const faqs = [
  { q: "What types of projects do you take on?", a: "I work on web applications, SaaS platforms, 3D/WebGL experiences, AI-powered tools, and data visualization dashboards. I'm open to both freelance and full-time roles." },
  { q: "What's your typical tech stack?", a: "React/Next.js for frontend, Three.js for 3D, GSAP for animations, Node.js/Express for backend, and MongoDB or PostgreSQL for databases. I also work with Python for ML projects." },
  { q: "How quickly can you deliver?", a: "Timelines depend on scope. A landing page takes days, a full SaaS platform takes weeks. I prioritize quality and clean architecture over speed." },
  { q: "Do you work with teams or solo?", a: "Both! I've shipped solo projects and collaborated on team-based builds. I'm comfortable with Git workflows, code reviews, and agile processes." },
];

const contactInfo = [
  { icon: Mail, label: "Email", value: "parthverma2409@gmail.com", href: "mailto:parthverma2409@gmail.com" },
  { icon: MapPin, label: "Location", value: "India", href: null },
  { icon: Clock, label: "Availability", value: "Open to opportunities", href: null },
];

export default function ContactPageContent() {
  const pageRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-contact-reveal]", { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: pageRef.current, start: "top 80%", once: true },
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div ref={pageRef} className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16" data-contact-reveal>
          <h1 className="text-5xl md:text-7xl font-bold font-display mb-6">
            Get In <span className="bg-gradient-to-r from-accent-cyan to-accent bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Have a project idea, collaboration opportunity, or just want to say hello? I&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16" data-contact-reveal>
          {contactInfo.map((info) => {
            const Icon = info.icon;
            const Wrapper = info.href ? "a" : "div";
            const wrapperProps = info.href ? { href: info.href, target: info.href.startsWith("http") ? "_blank" : undefined, rel: info.href.startsWith("http") ? "noopener noreferrer" : undefined } : {};
            return (
              <Wrapper key={info.label} {...wrapperProps}
                className="p-6 rounded-2xl bg-glass-bg border border-glass-border hover:border-accent/30 transition-all hover:-translate-y-1 cursor-pointer group text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:shadow-glow transition-shadow">
                  <Icon size={22} />
                </div>
                <p className="text-xs text-slate-500 mb-1">{info.label}</p>
                <p className="font-medium text-sm">{info.value}</p>
              </Wrapper>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <div data-contact-reveal>
            <h2 className="text-2xl font-bold font-display mb-8">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <AnimatedInput label="Your Name" name="name" required />
                <AnimatedInput label="Email Address" type="email" name="email" required />
              </div>
              <AnimatedInput label="Subject" name="subject" />
              <AnimatedInput label="Your Message" type="textarea" name="message" required />

              <MagneticButton
                className={`group w-full py-4 rounded-xl font-medium text-white flex items-center justify-center gap-3 transition-all duration-300 ${
                  submitted ? "bg-green-500 shadow-[0_0_40px_rgba(34,197,94,0.3)]" : "bg-accent hover:shadow-glow"
                }`}>
                {submitted ? (
                  <><CheckCircle size={20} /> Message Sent!</>
                ) : (
                  <><Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Send Message</>
                )}
              </MagneticButton>
            </form>
          </div>

          {/* FAQ */}
          <div data-contact-reveal>
            <h2 className="text-2xl font-bold font-display mb-8">Frequently Asked</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <FaqItem key={faq.q} question={faq.q} answer={faq.a} />
              ))}
            </div>

            {/* CTA Card */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent-hover/10 border border-accent/20">
              <h3 className="font-semibold font-display mb-2">Open to Opportunities</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                I&apos;m currently available for freelance projects, collaborations, and full-time positions.
                Let&apos;s build something amazing together.
              </p>
              <a href="https://github.com/Parthverma2409" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-sm text-accent hover:text-accent-hover transition-colors">
                View my GitHub <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowUpRight({ size = 24, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

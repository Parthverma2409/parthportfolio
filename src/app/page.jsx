import Hero from "@/components/home/Hero";
import AboutSection from "@/components/home/AboutSection";
import StatsSection from "@/components/home/StatsSection";
import SkillsSection from "@/components/home/SkillsSection";
import ProjectCarousel from "@/components/home/ProjectCarousel";
import TimelineSection from "@/components/home/TimelineSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ContactSection from "@/components/home/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <StatsSection />
      <SkillsSection />
      <ProjectCarousel />
      <TimelineSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}

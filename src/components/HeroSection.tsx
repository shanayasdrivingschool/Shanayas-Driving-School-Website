import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { FlipWords } from "@/components/ui/flip-words";

const HeroSection = () => {
  const flipWords = ["Experiences", "Solutions", "Innovations", "Strategies"];

  return (
    <section id="home" className="hero-section relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" decoding="async" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-hero/60 via-hero/80 to-hero" />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/10 blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="container mx-auto relative z-10 pt-24">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block gradient-bg text-primary-foreground text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
              Digital Agency
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-heading text-5xl md:text-7xl font-bold leading-tight mb-6 text-hero-foreground"
          >
            We Craft Digital
            <br />
            <FlipWords words={flipWords} className="gradient-text" />
            <br />
            That Matter
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-xl text-hero-muted max-w-xl mx-auto mb-10 leading-relaxed"
          >
            From stunning designs to powerful web solutions, we help brands stand out in the digital landscape with creativity, strategy, and innovation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a
              href="#services"
              className="gradient-bg text-primary-foreground font-semibold px-8 py-3.5 rounded-lg inline-flex items-center gap-2 hover:opacity-90 transition-opacity group"
            >
              Our Services
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#portfolio"
              className="border border-hero-foreground/20 text-hero-foreground font-semibold px-8 py-3.5 rounded-lg inline-flex items-center gap-2 hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Play size={18} />
              View Portfolio
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex justify-center gap-12 mt-16 pt-10 border-t border-hero-foreground/10"
          >
            {[
              { num: "150+", label: "Projects Delivered" },
              { num: "50+", label: "Happy Clients" },
              { num: "5+", label: "Years Experience" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-heading text-3xl font-bold gradient-text">{stat.num}</div>
                <div className="text-sm text-hero-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

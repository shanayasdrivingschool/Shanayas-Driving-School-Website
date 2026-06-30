import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";

const team = [
  { name: "Ahmed Khan", role: "CEO & Founder", initials: "AK" },
  { name: "Sara Ali", role: "Creative Director", initials: "SA" },
  { name: "Bilal Ahmed", role: "Lead Developer", initials: "BA" },
  { name: "Fatima Noor", role: "Marketing Head", initials: "FN" },
];

const TeamSection = () => (
  <section id="team" className="section-padding bg-section-alt">
    <div className="container mx-auto">
      <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-sm font-semibold text-primary tracking-widest uppercase">Our People</span>
        <h2 className="font-heading text-4xl md:text-5xl font-bold mt-3 mb-4 text-foreground">
          Meet the <span className="gradient-text">Team</span>
        </h2>
        <p className="text-muted-foreground">
          Passionate experts dedicated to bringing your digital vision to life.
        </p>
      </AnimatedSection>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {team.map((m, i) => (
          <AnimatedSection key={m.name} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -8 }}
              className="bg-card rounded-2xl p-6 text-center group border border-border hover:glow-border transition-all duration-300"
            >
              <div className="w-24 h-24 rounded-full gradient-bg mx-auto mb-5 flex items-center justify-center">
                <span className="font-heading text-2xl font-bold text-primary-foreground">{m.initials}</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">{m.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">{m.role}</p>
              <div className="flex justify-center gap-3">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  About
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  Contact
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default TeamSection;

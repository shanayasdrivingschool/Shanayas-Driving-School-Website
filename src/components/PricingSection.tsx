import { Check } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Starter",
    price: "$499",
    period: "/project",
    desc: "Perfect for small businesses just getting started",
    features: ["Logo & Brand Identity", "Single Page Website", "Social Media Setup", "Google Business Setup", "2 Revisions"],
    featured: false,
  },
  {
    name: "Growth",
    price: "$999",
    period: "/month",
    desc: "Best for businesses ready to scale their digital presence",
    features: ["Everything in Starter", "Multi-Page Website", "Monthly SMM Management", "SEO Optimization", "Analytics & Reports", "Priority Support"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "Tailored solutions for large-scale operations",
    features: ["Everything in Growth", "Custom Web Application", "Dedicated Account Manager", "Advanced Analytics", "24/7 Support", "Unlimited Revisions"],
    featured: false,
  },
];

const PricingSection = () => (
  <section id="pricing" className="section-padding bg-background">
    <div className="container mx-auto">
      <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-sm font-semibold text-primary tracking-widest uppercase">Pricing</span>
        <h2 className="font-heading text-4xl md:text-5xl font-bold mt-3 mb-4 text-foreground">
          Plans That <span className="gradient-text">Fit</span>
        </h2>
        <p className="text-muted-foreground">Transparent pricing. No hidden fees. Cancel anytime.</p>
      </AnimatedSection>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((p, i) => (
          <AnimatedSection key={p.name} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -8 }}
              className={`rounded-2xl p-8 h-full flex flex-col relative ${
                p.featured
                  ? "gradient-bg text-primary-foreground glow-border"
                  : "bg-card border border-border"
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-4 py-1 rounded-full">
                  Popular
                </span>
              )}
              <h3 className={`font-heading text-xl font-bold ${p.featured ? "" : "text-foreground"}`}>{p.name}</h3>
              <p className={`text-sm mt-1 mb-6 ${p.featured ? "opacity-80" : "text-muted-foreground"}`}>{p.desc}</p>
              <div className="mb-6">
                <span className="font-heading text-4xl font-bold">{p.price}</span>
                <span className={`text-sm ${p.featured ? "opacity-70" : "text-muted-foreground"}`}>{p.period}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check size={16} className="flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`text-center font-semibold py-3 rounded-lg transition-all ${
                  p.featured
                    ? "bg-card text-foreground hover:bg-card/90"
                    : "gradient-bg text-primary-foreground hover:opacity-90"
                }`}
              >
                Get Started
              </a>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection;

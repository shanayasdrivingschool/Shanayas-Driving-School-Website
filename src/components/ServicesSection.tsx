import { Palette, Globe, Share2, Settings, MapPin } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";

const services = [
  {
    icon: Palette,
    title: "Graphic Designing",
    desc: "Eye-catching visuals that tell your brand story—logos, banners, social media creatives, and complete brand identity kits.",
  },
  {
    icon: Globe,
    title: "Web Development",
    desc: "Custom-built, responsive websites and web apps using modern technologies that look stunning and perform flawlessly.",
  },
  {
    icon: Share2,
    title: "Social Media Marketing",
    desc: "Strategic campaigns across all platforms to grow your audience, boost engagement, and drive real business results.",
  },
  {
    icon: Settings,
    title: "Management",
    desc: "Full-service project and account management ensuring seamless execution, timely delivery, and measurable outcomes.",
  },
  {
    icon: MapPin,
    title: "Google Business",
    desc: "Optimize your Google Business profile to increase local visibility, manage reviews, and attract more customers.",
  },
];

const ServicesSection = () => (
  <section id="services" className="section-padding bg-section-alt">
    <div className="container mx-auto">
      <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-sm font-semibold text-primary tracking-widest uppercase">What We Do</span>
        <h2 className="font-heading text-4xl md:text-5xl font-bold mt-3 mb-4 text-foreground">
          Services That <span className="gradient-text">Deliver</span>
        </h2>
        <p className="text-muted-foreground">
          We offer a comprehensive suite of digital services to take your brand from idea to impact.
        </p>
      </AnimatedSection>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <AnimatedSection key={s.title} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="glass-card rounded-2xl p-8 h-full group cursor-pointer hover:glow-border transition-shadow duration-300"
            >
              <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <s.icon size={24} className="text-primary-foreground" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-3 text-foreground">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;

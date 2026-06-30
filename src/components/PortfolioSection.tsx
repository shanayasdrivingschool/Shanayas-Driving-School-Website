import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";

const categories = ["All", "Web", "Design", "Marketing"];

const projects = [
  { img: portfolio1, title: "Brand Redesign", cat: "Design", tag: "Graphic Design" },
  { img: portfolio2, title: "Analytics Dashboard", cat: "Web", tag: "Web Development" },
  { img: portfolio3, title: "Brand Identity Kit", cat: "Design", tag: "Branding" },
  { img: portfolio2, title: "Social Campaign", cat: "Marketing", tag: "SMM" },
  { img: portfolio1, title: "E-Commerce Platform", cat: "Web", tag: "Web Development" },
  { img: portfolio3, title: "Content Strategy", cat: "Marketing", tag: "Marketing" },
];

const PortfolioSection = () => {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? projects : projects.filter((p) => p.cat === active);

  return (
    <section id="portfolio" className="section-padding bg-background">
      <div className="container mx-auto">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-semibold text-primary tracking-widest uppercase">Our Work</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mt-3 mb-4 text-foreground">
            Featured <span className="gradient-text">Portfolio</span>
          </h2>
        </AnimatedSection>

        <AnimatedSection className="flex justify-center gap-3 mb-12 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                active === c
                  ? "gradient-bg text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </AnimatedSection>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group relative rounded-2xl overflow-hidden cursor-pointer"
              >
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  decoding="async"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-xs font-semibold text-primary mb-1">{p.tag}</span>
                  <h3 className="font-heading text-xl font-bold text-background">{p.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioSection;

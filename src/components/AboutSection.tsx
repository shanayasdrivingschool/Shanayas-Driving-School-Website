import AnimatedSection from "./AnimatedSection";
import { CheckCircle } from "lucide-react";

const points = [
  "Creative-first approach to every project",
  "Data-driven strategies that deliver results",
  "Dedicated team of industry experts",
  "End-to-end digital solutions",
];

const AboutSection = () => (
  <section id="about" className="section-padding bg-background">
    <div className="container mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <AnimatedSection>
          <span className="text-sm font-semibold text-primary tracking-widest uppercase">About Us</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mt-3 mb-6 text-foreground">
            Driving Digital <span className="gradient-text">Innovation</span> Since 2019
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            At Arsha, we blend creativity with technology to build digital experiences that captivate audiences and accelerate growth. Our multidisciplinary team brings together design, development, and marketing expertise under one roof.
          </p>
          <div className="space-y-4">
            {points.map((p) => (
              <div key={p} className="flex items-center gap-3">
                <CheckCircle size={20} className="text-primary flex-shrink-0" />
                <span className="text-foreground">{p}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="relative">
            <div className="aspect-square rounded-2xl gradient-bg p-[2px]">
              <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="font-heading text-7xl font-bold gradient-text mb-2">5+</div>
                  <div className="text-muted-foreground text-lg">Years of Excellence</div>
                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-muted rounded-lg p-4">
                      <div className="font-heading text-2xl font-bold text-foreground">150+</div>
                      <div className="text-muted-foreground">Projects</div>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <div className="font-heading text-2xl font-bold text-foreground">50+</div>
                      <div className="text-muted-foreground">Clients</div>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <div className="font-heading text-2xl font-bold text-foreground">15+</div>
                      <div className="text-muted-foreground">Team Members</div>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <div className="font-heading text-2xl font-bold text-foreground">98%</div>
                      <div className="text-muted-foreground">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full rounded-2xl bg-primary/10" />
          </div>
        </AnimatedSection>
      </div>
    </div>
  </section>
);

export default AboutSection;

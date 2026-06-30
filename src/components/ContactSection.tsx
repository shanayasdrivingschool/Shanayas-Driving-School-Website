import { Mail, MapPin, Phone } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { useState } from "react";

const ContactSection = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="section-padding hero-section">
      <div className="container mx-auto">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary tracking-widest uppercase">Get In Touch</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mt-3 mb-4 text-hero-foreground">
            Let's Start a <span className="gradient-text">Project</span>
          </h2>
          <p className="text-hero-muted">Ready to bring your vision to life? We'd love to hear from you.</p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <AnimatedSection className="md:col-span-1 space-y-6">
            {[
              { icon: MapPin, label: "Visit Us", value: "Karachi, Pakistan" },
              { icon: Mail, label: "Email Us", value: "hello@arsha.com" },
              { icon: Phone, label: "Call Us", value: "+92 300 1234567" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0">
                  <item.icon size={20} className="text-primary-foreground" />
                </div>
                <div>
                  <div className="text-sm text-hero-muted">{item.label}</div>
                  <div className="text-hero-foreground font-medium">{item.value}</div>
                </div>
              </div>
            ))}
          </AnimatedSection>

          <AnimatedSection delay={0.15} className="md:col-span-2">
            {submitted ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="font-heading text-2xl font-bold text-hero-foreground mb-2">Message Sent!</h3>
                <p className="text-hero-muted">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                className="glass-card rounded-2xl p-8 space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    className="bg-muted/20 border border-border/30 rounded-lg px-4 py-3 text-hero-foreground placeholder:text-hero-muted/50 focus:outline-none focus:border-primary transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    required
                    className="bg-muted/20 border border-border/30 rounded-lg px-4 py-3 text-hero-foreground placeholder:text-hero-muted/50 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subject"
                  required
                  className="w-full bg-muted/20 border border-border/30 rounded-lg px-4 py-3 text-hero-foreground placeholder:text-hero-muted/50 focus:outline-none focus:border-primary transition-colors"
                />
                <textarea
                  placeholder="Your Message"
                  rows={5}
                  required
                  className="w-full bg-muted/20 border border-border/30 rounded-lg px-4 py-3 text-hero-foreground placeholder:text-hero-muted/50 focus:outline-none focus:border-primary transition-colors resize-none"
                />
                <button
                  type="submit"
                  className="gradient-bg text-primary-foreground font-semibold px-8 py-3.5 rounded-lg hover:opacity-90 transition-opacity w-full sm:w-auto"
                >
                  Send Message
                </button>
              </form>
            )}
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

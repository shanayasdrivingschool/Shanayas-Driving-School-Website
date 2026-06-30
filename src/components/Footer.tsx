const Footer = () => (
  <footer className="hero-section border-t border-border/10 py-12">
    <div className="container mx-auto">
      <div className="grid md:grid-cols-4 gap-10 mb-10">
        <div>
          <h3 className="font-heading text-2xl font-bold gradient-text mb-3">Arsha</h3>
          <p className="text-hero-muted text-sm leading-relaxed">
            Crafting digital experiences that inspire, engage, and deliver results.
          </p>
        </div>
        {[
          { title: "Services", links: ["Graphic Design", "Web Development", "Social Media", "Google Business"] },
          { title: "Company", links: ["About", "Team", "Portfolio", "Pricing"] },
          { title: "Connect", links: ["hello@arsha.com", "+92 300 1234567", "Karachi, Pakistan"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-heading font-bold text-hero-foreground mb-4">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l}>
                  <span className="text-sm text-hero-muted hover:text-primary cursor-pointer transition-colors">{l}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/10 pt-8 text-center text-sm text-hero-muted">
        © {new Date().getFullYear()} Arsha. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;

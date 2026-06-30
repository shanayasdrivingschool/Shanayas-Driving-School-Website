import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Team", href: "#team" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
    // Close sidebar when clicking outside
    useEffect(() => {
      if (!mobileOpen) return;
      const handleOutside = (e: MouseEvent) => {
        const sidebar = document.getElementById("mobile-sidebar");
        if (sidebar && !sidebar.contains(e.target as Node)) {
          setMobileOpen(false);
        }
      };
      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "nav-glass shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4">
        <a href="#home" className="font-heading text-2xl font-bold text-hero-foreground tracking-tight">
          <span className="gradient-text">Arsha</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-hero-foreground/70 hover:text-primary transition-colors duration-200 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="gradient-bg text-primary-foreground font-semibold text-sm px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            Get Started
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-hero-foreground"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 md:hidden"
            >
              {/* Overlay */}
             <button
               onClick={() => setMobileOpen(!mobileOpen)}
               className="md:hidden flex items-center justify-center p-2 rounded-lg text-hero-foreground bg-white/80 shadow-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary"
               style={{ position: 'absolute', top: 18, right: 18 }}
               aria-label="Open sidebar menu"
             >
               {mobileOpen ? <X size={28} /> : <Menu size={28} />}
             </button>
              <div className="absolute inset-0 bg-black bg-opacity-40" />
              {/* Sidebar */}
              <div
                id="mobile-sidebar"
                className="relative h-full w-64 bg-white dark:bg-sidebar rounded-r-xl shadow-lg flex flex-col py-6 px-6"
              >
                <button
                  onClick={() => setMobileOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-primary"
                  aria-label="Close sidebar"
                >
                  <X size={28} />
                </button>
                <div className="mt-10 flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-lg font-medium text-hero-foreground/80 hover:text-primary transition-colors py-2"
                    >
                      {link.label}
                    </a>
                  ))}
                  <a
                    href="#contact"
                    onClick={() => setMobileOpen(false)}
                    className="gradient-bg text-primary-foreground font-semibold text-lg px-6 py-2.5 rounded-lg text-center"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </motion.div>
          )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

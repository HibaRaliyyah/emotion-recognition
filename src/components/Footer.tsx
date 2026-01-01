import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Features", path: "/about" },
      { label: "Pricing", path: "/pricing" },
      { label: "Dashboard", path: "/dashboard" },
      { label: "API", path: "/instructions" },
    ],
    resources: [
      { label: "Documentation", path: "/instructions" },
      { label: "Blog", path: "/about" },
      { label: "Support", path: "/about" },
      { label: "FAQs", path: "/about" },
    ],
    company: [
      { label: "About Us", path: "/about" },
      { label: "Careers", path: "/about" },
      { label: "Contact", path: "/about" },
      { label: "Partners", path: "/about" },
    ],
    legal: [
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Terms of Service", path: "/terms" },
      { label: "Cookie Policy", path: "/cookies" },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Mail, href: "#", label: "Email" },
  ];

  return (
    <footer className="relative mt-20 border-t border-border/50">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-muted/50 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">EmotiSense</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Advanced facial emotion recognition powered by AI. Understand emotions, improve well-being, and connect better with yourself and others.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-4 text-foreground">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} EmotiSense. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-accent fill-accent" /> for emotional well-being
          </p>
        </div>
      </div>
    </footer>
  );
};

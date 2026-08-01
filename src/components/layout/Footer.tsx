import { Globe, Github, Linkedin, Mail, ArrowUp, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-24 border-t border-[var(--glass-border)] bg-gradient-to-b from-transparent via-[#040d1a]/60 to-[#040d1a]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
                <Globe className="w-5 h-5 text-ink" strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-display font-bold text-lg text-white">
                  TerraMind <span className="text-primary font-mono text-xs">AI</span>
                </div>
                <div className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase font-mono">
                  Environmental Digital Twin & Policy Platform
                </div>
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] max-w-md leading-relaxed mb-4">
              An advanced 3D decision-intelligence platform built to model planetary health, simulate climate interventions, and protect global ecosystems.
            </p>
            <div className="flex items-center gap-2 text-xs text-primary font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Developed with <Heart className="w-3 h-3 fill-danger text-danger inline mx-0.5" /> by <strong className="text-white">Nalin Tuscano</strong> & <strong className="text-white">Tanishq</strong>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary mb-4 font-mono">Navigation</div>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/" className="text-[var(--text-muted)] hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/simulation" className="text-[var(--text-muted)] hover:text-primary transition-colors">Simulation Engine</Link></li>
              <li><Link to="/command-center" className="text-[var(--text-muted)] hover:text-primary transition-colors">Command Center</Link></li>
              <li><Link to="/challenges" className="text-[var(--text-muted)] hover:text-primary transition-colors">Climate Action Hub</Link></li>
              <li><Link to="/insights" className="text-[var(--text-muted)] hover:text-primary transition-colors">Insights & Analytics</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary mb-4 font-mono">Connect & Code</div>
            <div className="flex items-center gap-3 mb-4">
              <motion.a
                whileHover={{ scale: 1.15, y: -2 }}
                href="https://github.com/nalintuscano0023-boop/TerraMind-AI.git"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-[var(--text-muted)] hover:text-primary hover:border-primary/40 transition-all shadow-glow"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.15, y: -2 }}
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-[var(--text-muted)] hover:text-secondary hover:border-secondary/40 transition-all shadow-glow"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.15, y: -2 }}
                href="mailto:contact@terramind.ai"
                className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-[var(--text-muted)] hover:text-warning hover:border-warning/40 transition-all shadow-glow"
                aria-label="Email Us"
              >
                <Mail className="w-4 h-4" />
              </motion.a>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              AI-for-Earth Final Hackathon Submission
            </p>
          </div>
        </div>

        {/* Bottom Bar & Scroll to top */}
        <div className="pt-6 border-t border-[var(--glass-border)] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[var(--text-muted)] font-mono">
          <div>
            © 2026 <strong>TerraMind AI</strong>. Built by <strong>Nalin Tuscano</strong> & <strong>Tanishq</strong>. All rights reserved.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-primary/20 text-primary hover:bg-primary/10 transition-all group"
          >
            <span>Back To Top</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}

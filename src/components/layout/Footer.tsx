import { Globe, ArrowUp, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-24 border-t border-[var(--glass-border)] bg-gradient-to-b from-transparent via-[#040d1a]/80 to-[#020610] overflow-hidden">
      {/* Subtle background environmental glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute -top-24 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 sm:mb-10">
          {/* Column 1 & 2: Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow flex-shrink-0">
                <Globe className="w-5 h-5 text-ink" strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-display font-bold text-base sm:text-lg text-white">
                  TerraMind <span className="text-primary font-mono text-xs">AI</span>
                </div>
                <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] tracking-widest uppercase font-mono">
                  Environmental Digital Twin & Policy Platform
                </div>
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] max-w-md leading-relaxed mb-4">
              An advanced 3D decision-intelligence platform built to model planetary health, simulate climate interventions, and protect global ecosystems.
            </p>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-primary font-medium">
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Developed with <Heart className="w-3 h-3 fill-danger text-danger inline mx-0.5" /> by <strong className="text-white">Nalin Tuscano</strong> & <strong className="text-white">Tanishq</strong></span>
            </div>
          </div>

          {/* Column 3: Navigation */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary mb-3 sm:mb-4 font-mono">Navigation</div>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="inline-block py-1 text-[var(--text-muted)] hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/simulation" className="inline-block py-1 text-[var(--text-muted)] hover:text-primary transition-colors">Simulation Engine</Link></li>
              <li><Link to="/command-center" className="inline-block py-1 text-[var(--text-muted)] hover:text-primary transition-colors">Command Center</Link></li>
              <li><Link to="/challenges" className="inline-block py-1 text-[var(--text-muted)] hover:text-primary transition-colors">Climate Action Hub</Link></li>
              <li><Link to="/insights" className="inline-block py-1 text-[var(--text-muted)] hover:text-primary transition-colors">Insights & Analytics</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar & Scroll to top */}
        <div className="pt-6 border-t border-[var(--glass-border)] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[var(--text-muted)] font-mono text-center sm:text-left">
          <div className="text-[11px] sm:text-xs">
            © 2026 <strong>TerraMind AI</strong>. Built by <strong>Nalin Tuscano</strong> & <strong>Tanishq</strong>. All rights reserved.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-primary/20 text-primary hover:bg-primary/10 transition-all group text-xs font-semibold"
          >
            <span>Back To Top</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}

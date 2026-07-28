import { Globe, Github, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-[var(--glass-border)]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Globe className="w-5 h-5 text-ink" strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-display font-bold">EcoSphere Genesis</div>
                <div className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase">Environmental Intelligence</div>
              </div>
            </div>
            <p className="text-sm text-[var(--text-muted)] max-w-md leading-relaxed">
              An interactive environmental decision intelligence platform. Explore Earth's systems,
              simulate sustainability decisions, and understand their long-term impact.
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-3">Platform</div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/simulation" className="hover:text-primary transition-colors">Simulation</Link></li>
              <li><Link to="/command-center" className="hover:text-primary transition-colors">Command Center</Link></li>
              <li><Link to="/challenges" className="hover:text-primary transition-colors">Challenges</Link></li>
              <li><Link to="/insights" className="hover:text-primary transition-colors">Insights</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-3">Connect</div>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full glass flex items-center justify-center hover:text-primary transition-colors" aria-label="GitHub"><Github className="w-4 h-4" /></a>
              <a href="#" className="w-9 h-9 rounded-full glass flex items-center justify-center hover:text-primary transition-colors" aria-label="Twitter"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="w-9 h-9 rounded-full glass flex items-center justify-center hover:text-primary transition-colors" aria-label="Email"><Mail className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-[var(--glass-border)] flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[var(--text-muted)]">
          <div>© 2026 EcoSphere Genesis. Built for the AI-for-Earth Hackathon.</div>
          <div>Rule-based environmental intelligence. No external AI APIs.</div>
        </div>
      </div>
    </footer>
  );
}

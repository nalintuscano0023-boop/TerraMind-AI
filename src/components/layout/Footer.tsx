import { Globe, Github, Linkedin, Mail, ArrowUp, Sparkles, Heart, ArrowRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-24 border-t border-[var(--glass-border)] bg-gradient-to-b from-[#040d1a]/80 to-[#020610] overflow-hidden">
      
      {/* Subtle Environmental Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]"></div>
        <motion.div 
          animate={{ opacity: [0.03, 0.06, 0.03], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-primary/20 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ opacity: [0.03, 0.05, 0.03], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-blue-500/10 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ opacity: [0.02, 0.04, 0.02], scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45rem] h-[45rem] bg-purple-500/10 rounded-full blur-[150px]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        
        {/* NEW PREMIUM CLOSING SECTION */}
        <div className="mb-20 glass border border-white/10 rounded-[2rem] p-8 md:p-12 lg:p-16 backdrop-blur-md bg-[#040d1a]/50 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden group">
           
           {/* Inner glow hover effect */}
           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              
              {/* Left Side: Messaging */}
              <div>
                 {/* 1. Brand Mark & Status */}
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   className="flex flex-wrap items-center gap-3 mb-8"
                 >
                   <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                     <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                     <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white">TERRAMIND AI</span>
                   </div>
                   <div className="text-[10px] uppercase tracking-[0.1em] text-[var(--text-muted)] font-mono flex items-center gap-1.5">
                     <Activity className="w-3 h-3 text-primary/70" />
                     PLANETARY INTELLIGENCE SYSTEM
                   </div>
                 </motion.div>

                 {/* 2 & 3. Main Headline and Supporting Message */}
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.1 }}
                 >
                   <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 leading-tight tracking-tight">
                     THE PLANET IS OUR <br className="hidden md:block" />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">SHARED SYSTEM.</span>
                   </h2>
                   <div className="text-lg md:text-xl font-medium text-white/90 mb-6 font-display tracking-wide">
                     Understand it. Simulate it. Protect it.
                   </div>
                 </motion.div>
                 
                 {/* 4. Description */}
                 <motion.p 
                   initial={{ opacity: 0 }}
                   whileInView={{ opacity: 1 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.2 }}
                   className="text-[var(--text-muted)] text-sm md:text-base max-w-md leading-relaxed font-light mb-8"
                 >
                   TerraMind AI transforms environmental data into immersive simulations, predictive insights, and actionable intelligence for a more resilient planet.
                 </motion.p>
                 
                 {/* 6. Primary CTA */}
                 <motion.div
                   initial={{ opacity: 0, y: 10 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.3 }}
                 >
                   <Link to="/simulation" className="inline-block">
                     <motion.button
                       whileHover={{ scale: 1.02, y: -2 }}
                       whileTap={{ scale: 0.98 }}
                       className="group relative flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-primary/30 text-white font-medium overflow-hidden transition-all shadow-glow hover:border-primary/60 hover:shadow-[0_0_20px_rgba(52,211,153,0.3)]"
                     >
                       <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                       <span className="relative z-10 tracking-wide text-sm font-semibold">EXPLORE TERRAMIND</span>
                       <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                     </motion.button>
                   </Link>
                 </motion.div>
              </div>

              {/* Right Side: Socials and Sub-footer info */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-col lg:items-end justify-center h-full space-y-12 lg:pl-12 mt-10 lg:mt-0"
              >
                 {/* 5. Connect with TerraMind Row */}
                 <div className="w-full max-w-sm">
                   <div className="text-[10px] font-mono tracking-[0.2em] text-[var(--text-muted)] mb-4 font-semibold uppercase">
                     CONNECT WITH TERRAMIND
                   </div>
                   <div className="grid grid-cols-3 gap-3">
                     <motion.a
                       whileHover={{ y: -3, scale: 1.02 }}
                       href="https://github.com/nalintuscano0023-boop/TerraMind-AI"
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-xl glass border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all group"
                     >
                       <Github className="w-5 h-5 text-[var(--text-muted)] group-hover:text-white transition-colors" />
                       <span className="text-[10px] font-medium text-[var(--text-muted)] group-hover:text-white transition-colors">GitHub</span>
                     </motion.a>
                     <motion.a
                       whileHover={{ y: -3, scale: 1.02 }}
                       href="https://linkedin.com"
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-xl glass border border-white/5 hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/10 transition-all group"
                     >
                       <Linkedin className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[#0A66C2] transition-colors" />
                       <span className="text-[10px] font-medium text-[var(--text-muted)] group-hover:text-white transition-colors">LinkedIn</span>
                     </motion.a>
                     <motion.a
                       whileHover={{ y: -3, scale: 1.02 }}
                       href="mailto:contact@terramind.ai"
                       className="flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-xl glass border border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all group"
                     >
                       <Mail className="w-5 h-5 text-[var(--text-muted)] group-hover:text-emerald-400 transition-colors" />
                       <span className="text-[10px] font-medium text-[var(--text-muted)] group-hover:text-white transition-colors">Email</span>
                     </motion.a>
                   </div>
                 </div>

                 {/* 7. Secondary Information */}
                 <div className="w-full max-w-sm pt-6 border-t border-white/5">
                   <div className="text-[9px] sm:text-[10px] font-mono tracking-[0.2em] text-[var(--text-muted)] leading-relaxed lg:text-right uppercase">
                     AI FOR EARTH • ENVIRONMENTAL INTELLIGENCE • PLANETARY FUTURES
                   </div>
                 </div>
              </motion.div>
              
           </div>
        </div>
        
        {/* OLD FOOTER GRIDS (Logo, Desc, Nav) - keeping unchanged functionality outside this section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
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

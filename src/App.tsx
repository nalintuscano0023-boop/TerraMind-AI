import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '@/context/ThemeContext';
import { Navbar } from '@/components/layout/Navbar';
import { PageTransition } from '@/components/layout/PageTransition';
import { LoadingScreen } from '@/components/layout/LoadingScreen';

const Home = lazy(() => import('@/pages/Home'));
const Simulation = lazy(() => import('@/pages/Simulation'));
const CommandCenter = lazy(() => import('@/pages/CommandCenter'));
const Challenges = lazy(() => import('@/pages/Challenges'));
const Insights = lazy(() => import('@/pages/Insights'));

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/simulation" element={<PageTransition><Simulation /></PageTransition>} />
        <Route path="/command-center" element={<PageTransition><CommandCenter /></PageTransition>} />
        <Route path="/challenges" element={<PageTransition><Challenges /></PageTransition>} />
        <Route path="/insights" element={<PageTransition><Insights /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <LoadingScreen show={loading} />
        <ScrollToTop />
        <Navbar />
        <main className="min-h-screen pt-20">
          <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" /></div>}>
            <AnimatedRoutes />
          </Suspense>
        </main>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

import { useState, useEffect, useRef } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Assessment from './components/Assessment';
import QASection from './components/QASection';
import Footer from './components/Footer';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import { Sparkles, Brain, Heart } from 'lucide-react';
import Lenis from 'lenis';

import AuthModal from './components/AuthModal';
import GenderModal from './components/GenderModal';
import ProductsPage from './components/ProductsPage';

import ScientificSystem from './components/ScientificSystem';
import UserProfile from './components/user/UserProfile';
import { useFirebase } from './contexts/FirebaseContext';
import { useTranslation } from 'react-i18next';

export function ParallaxImage({ src, alt }: { src: string, alt: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <div ref={ref} className="relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-[32px] sm:rounded-[40px] shadow-2xl gpu-accelerated pointer-events-none">
      <motion.img 
        style={{ y }}
        initial={{ scale: 1.1 }}
        src={src} 
        alt={alt}
        className="w-full h-full object-cover grayscale-[0.2] select-none will-change-transform"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-brand-primary/5 mix-blend-multiply" />
    </div>
  );
}

export default function App() {
  const { t } = useTranslation();
  const { user } = useFirebase();
  const [activeTab, setActiveTab] = useState<'public' | 'qa' | 'scientific' | 'user'>('public');
  const [showProducts, setShowProducts] = useState(false);

  useEffect(() => {
    if (!user && activeTab === 'user') {
      setActiveTab('public');
    }
  }, [user, activeTab]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [activeTab]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const coreMethodologies = [
    {
      title: t('methodologies.brain.title'),
      description: t('methodologies.brain.desc'),
      Icon: Brain,
    },
    {
      title: t('methodologies.beauty.title'),
      description: t('methodologies.beauty.desc'),
      Icon: Sparkles,
    },
    {
      title: t('methodologies.harmony.title'),
      description: t('methodologies.harmony.desc'),
      Icon: Heart,
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % coreMethodologies.length);
    }, 5000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleManualNav = (idx: number) => {
    setCurrentIndex(idx);
    startTimer();
  };

  return (
    <div className="min-h-screen bg-transparent relative selection:bg-brand-primary selection:text-white">
      {/* Global Design Details */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] mix-blend-overlay" 
           style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-brand-primary z-[200] origin-left"
        style={{ scaleX }}
      />
      
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        openAuth={() => setIsAuthModalOpen(true)} 
      />
      
      <AnimatePresence>
        {isAuthModalOpen && (
          <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProducts && (
          <ProductsPage onClose={() => setShowProducts(false)} />
        )}
      </AnimatePresence>
      <GenderModal />
      
      <AnimatePresence mode="wait">
        {activeTab === 'public' ? (
          <motion.main
            key="public"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen overflow-y-auto scroll-smooth"
          >
            <section className="min-h-screen shrink-0">
              <Hero onExplore={() => setActiveTab('scientific')} onProductsClick={() => setShowProducts(true)} />
            </section>
            
            {/* Value Proposition Slider */}
            <section className="min-h-screen px-4 sm:px-6 lg:px-8 relative flex items-center bg-transparent py-20 overflow-hidden">
              <div className="max-w-7xl mx-auto w-full relative z-10">
                
                <div className="text-center mb-24">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-brand-primary/10 bg-brand-primary/5 mb-8"
                  >
                    <div className="size-1 rounded-full bg-brand-primary animate-pulse" />
                    <span className="text-subtle text-[8px] uppercase tracking-[0.4em] font-mono">{t('app.core_methodology')}</span>
                  </motion.div>
                  
                  <h2 className="text-4xl sm:text-5xl md:text-8xl font-serif leading-[0.85] tracking-tighter flex flex-col items-center">
                    <div className="overflow-hidden py-2">
                      <motion.span 
                        initial={{ y: "100%" }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="relative inline-block px-10"
                      >
                        {t('app.balance_beauty')}
                        <div className="absolute inset-x-0 bottom-4 h-[20%] bg-brand-primary/10 -skew-x-12 -z-10 blur-[8px]" />
                      </motion.span>
                    </div>
                    <div className="overflow-hidden py-1">
                      <motion.span 
                        initial={{ y: "100%" }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="text-luxury text-xl sm:text-2xl md:text-5xl block mt-4 opacity-40 font-light italic"
                      >
                        {t('app.percieve_life')}
                      </motion.span>
                    </div>
                  </h2>
                </div>

                <div className="relative max-w-5xl mx-auto px-2 sm:px-0">
                  <div className="overflow-hidden rounded-[24px] sm:rounded-[32px] gpu-accelerated">
                    <motion.div 
                      animate={{ x: `-${currentIndex * 100}%` }}
                      transition={{ 
                        duration: 1.2, 
                        ease: [0.22, 1, 0.36, 1] 
                      }}
                      className="flex"
                    >
                      {coreMethodologies.map((item, idx) => (
                        <div key={idx} className="w-full shrink-0 px-1">
                          <div className="glass-card group p-6 sm:p-10 md:p-12 h-full relative overflow-hidden">
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
                              <div className="w-12 h-12 sm:w-20 sm:h-20 bg-brand-primary/5 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                                <item.Icon className="size-6 sm:size-10 text-brand-primary font-normal" />
                              </div>
                              <div className="text-center md:text-left">
                                <h3 className="text-xl md:text-3xl font-serif italic mb-3 sm:mb-4">
                                  <span className="relative inline-block px-1">
                                    {item.title}
                                    <div className="absolute bottom-1 inset-x-0 h-1.5 bg-brand-primary/10 -z-10" />
                                  </span>
                                </h3>
                                <p className="text-base md:text-lg text-brand-ink/60 leading-relaxed font-light">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                            
                            {/* Decorative Background Element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </div>

                  {/* Navigation Dots & Progress Bar */}
                  <div className="flex justify-center gap-3 mt-10">
                    {coreMethodologies.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleManualNav(idx)}
                        className="relative w-10 h-[1.5px] bg-brand-ink/5 rounded-full overflow-hidden transition-all duration-300 hover:h-1"
                      >
                        {idx === currentIndex && (
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 5, ease: "linear" }}
                            className="absolute inset-0 bg-brand-primary"
                          />
                        )}
                        {idx < currentIndex && <div className="absolute inset-0 bg-brand-primary/30" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Assessment Section */}
            <section className="min-h-screen flex items-center bg-transparent content-visibility-auto">
              <div className="w-full">
                <Assessment />
              </div>
            </section>

            <section className="min-h-screen px-4 sm:px-6 lg:px-8 py-20 bg-transparent relative overflow-hidden flex items-center content-visibility-auto">
               <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="relative order-2 lg:order-1"
                  >
                    <ParallaxImage 
                      src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200" 
                      alt="Scientific Wellness"
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-10 -left-10 w-40 h-40 bg-brand-primary/5 rounded-full blur-3xl -z-10" 
                    />
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="space-y-6 sm:space-y-10 order-1 lg:order-2"
                  >
                    <h2 className="text-3xl sm:text-5xl md:text-7xl font-serif leading-[1.1] sm:leading-[0.85] tracking-tighter">
                      {t('app.not_just_product')}<br />
                      <span className="text-luxury block sm:inline mt-2 sm:mt-0">{t('app.but_evolution')}</span>
                    </h2>
                    <p className="text-sm sm:text-lg text-brand-ink/50 font-light leading-relaxed max-w-lg">
                      {t('app.wellness_desc')}
                    </p>
                    <motion.div 
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: false, amount: 0.3 }}
                      variants={{
                        hidden: { opacity: 0 },
                        show: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.5
                          }
                        }
                      }}
                      className="grid grid-cols-3 gap-4 sm:gap-6 border-t border-brand-ink/5 pt-6 sm:pt-10 mt-8 sm:mt-12"
                    >
                      <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                        <span className="text-2xl sm:text-4xl font-serif text-brand-primary">15+</span>
                        <p className="text-subtle text-[7px] sm:text-[8px] mt-2 group-hover:text-brand-ink transition-colors">{t('app.expert_team')}</p>
                      </motion.div>
                      <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                        <span className="text-2xl sm:text-4xl font-serif text-brand-primary">12W+</span>
                        <p className="text-subtle text-[7px] sm:text-[8px] mt-2">{t('app.global_users')}</p>
                      </motion.div>
                      <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                        <span className="text-2xl sm:text-4xl font-serif text-brand-primary">98%</span>
                        <p className="text-subtle text-[7px] sm:text-[8px] mt-2">{t('app.customer_satisfaction')}</p>
                      </motion.div>
                    </motion.div>
                  </motion.div>
               </div>
            </section>

            <section>
              <Footer />
            </section>
          </motion.main>
        ) : activeTab === 'qa' ? (
          <motion.div
            key="qa"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen overflow-y-auto"
          >
            <section className="min-h-screen">
              <QASection />
            </section>
            <section className="">
              <Footer />
            </section>
          </motion.div>
        ) : activeTab === 'scientific' ? (
          <motion.div
            key="scientific"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen overflow-y-auto"
          >
             <ScientificSystem />
             <Footer />
          </motion.div>
        ) : (
          <motion.div
            key="user"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen overflow-y-auto"
          >
             <UserProfile />
             <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


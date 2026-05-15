import { useState, useEffect, useRef } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Assessment from './components/Assessment';
import QASection from './components/QASection';
import AIAssistant from './components/AIAssistant';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import { Sparkles, Brain, Heart } from 'lucide-react';
import Lenis from 'lenis';

import AuthModal from './components/AuthModal';

import ScientificSystem from './components/ScientificSystem';

export function ParallaxImage({ src, alt }: { src: string, alt: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className="relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-[32px] sm:rounded-[40px] shadow-2xl gpu-accelerated pointer-events-none">
      <motion.img 
        style={{ y, scale: 1.2 }}
        src={src} 
        alt={alt}
        className="w-full h-full object-cover grayscale-[0.2] select-none"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-brand-primary/5 mix-blend-multiply" />
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'public' | 'qa' | 'scientific'>('public');
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
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
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
      title: "大脑的情绪锚点",
      description: "性激素水平直接影响大脑神经元，调节情绪波动。一个平衡的状态，是您温柔且坚韧的力量源泉。",
      Icon: Brain,
    },
    {
      title: "容颜的无形装饰",
      description: "胶原蛋白的流失与激素密切相关。科学调理，让您的肌肤重现通透感，由内而外散发自信磁场。",
      Icon: Sparkles,
    },
    {
      title: "亲密关系的化学键",
      description: "和谐的夫妻生活需要身体的响应。调理好激素，唤醒身体感知力，让爱意重新在流动的韵律中升温。",
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
    <div className="min-h-screen bg-brand-paper">
      <CustomCursor />
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
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      
      <AIAssistant />

      <AnimatePresence mode="wait">
        {activeTab === 'public' ? (
          <motion.main
            key="public"
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen overflow-y-auto scroll-smooth gpu-accelerated"
          >
            <section className="min-h-screen shrink-0 content-visibility-auto">
              <Hero onExplore={() => setActiveTab('scientific')} />
            </section>
            
            {/* Value Proposition Slider */}
            <section className="min-h-screen px-4 sm:px-6 lg:px-8 relative flex items-center bg-white py-20 content-visibility-auto">
              <div className="max-w-7xl mx-auto w-full">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-brand-primary/20" />
                <div className="text-center mb-24">
                  <motion.span 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-subtle text-[10px] block mb-8"
                  >
                    Core Methodology / 核心支柱
                  </motion.span>
                  <h2 className="text-4xl sm:text-5xl md:text-8xl font-serif leading-[1.1] sm:leading-[0.9] flex flex-col items-center">
                    <div className="overflow-hidden py-1">
                      <motion.span 
                        initial={{ y: "100%" }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="relative inline-block px-4"
                      >
                        平衡之美
                        <div className="absolute inset-x-0 bottom-2 h-[30%] bg-brand-primary/5 -skew-x-12 -z-10 blur-[4px]" />
                      </motion.span>
                    </div>
                    <div className="overflow-hidden py-1">
                      <motion.span 
                        initial={{ y: "100%" }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="text-luxury text-3xl sm:text-4xl md:text-6xl block mt-4 sm:mt-0"
                      >
                        源于对生命的精准感知
                      </motion.span>
                    </div>
                  </h2>
                </div>

                <div className="relative max-w-5xl mx-auto px-2 sm:px-0">
                  <div className="overflow-hidden rounded-[32px] sm:rounded-[48px] gpu-accelerated">
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
                          <div className="glass-card group p-8 sm:p-10 md:p-16 h-full relative overflow-hidden">
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-brand-primary/5 rounded-2xl sm:rounded-3xl flex items-center justify-center shrink-0">
                                <item.Icon className="size-8 sm:size-12 text-brand-primary font-normal" />
                              </div>
                              <div className="text-center md:text-left">
                                <h3 className="text-2xl md:text-4xl font-serif italic mb-4 sm:mb-6">
                                  <span className="relative inline-block px-1">
                                    {item.title}
                                    <div className="absolute bottom-1 inset-x-0 h-2 bg-brand-primary/10 -z-10" />
                                  </span>
                                </h3>
                                <p className="text-lg md:text-xl text-brand-ink/60 leading-relaxed font-light">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                            
                            {/* Decorative Background Element */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </div>

                  {/* Navigation Dots & Progress Bar */}
                  <div className="flex justify-center gap-4 mt-12">
                    {coreMethodologies.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleManualNav(idx)}
                        className="relative w-12 h-[2px] bg-brand-ink/5 rounded-full overflow-hidden transition-all duration-300 hover:h-1"
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
            <section className="min-h-screen flex items-center bg-brand-paper/20 content-visibility-auto">
              <div className="w-full">
                <Assessment />
              </div>
            </section>

            <section className="min-h-screen px-4 sm:px-6 lg:px-8 py-20 bg-white relative overflow-hidden flex items-center content-visibility-auto">
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
                    className="space-y-8 sm:space-y-12 order-1 lg:order-2"
                  >
                    <h2 className="text-4xl sm:text-6xl md:text-8xl font-serif leading-[1.1] sm:leading-[0.85] tracking-tighter">
                      不仅是产品<br />
                      更是<span className="text-luxury block sm:inline mt-2 sm:mt-0">生命质感</span>的进化
                    </h2>
                    <p className="text-base sm:text-xl text-brand-ink/50 font-light leading-relaxed max-w-lg">
                      在大健康领域，我们深知单一的症状改善只是权宜之计。
                      <span className="text-brand-primary/80 font-normal italic">荷尔蒙之衡</span>通过全球前沿科研成果，精准对冲生理下降曲线，
                      为追求极限体验与长效优雅的您，提供高能营养支持。
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
                      className="grid grid-cols-3 gap-4 sm:gap-8 border-t border-brand-ink/5 pt-8 sm:pt-12 mt-10 sm:mt-16"
                    >
                      <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                        <span className="text-3xl sm:text-5xl font-serif text-brand-primary">15+</span>
                        <p className="text-subtle text-[7px] sm:text-[8px] mt-2 sm:mt-3">科研专家团队</p>
                      </motion.div>
                      <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                        <span className="text-3xl sm:text-5xl font-serif text-brand-primary">12W+</span>
                        <p className="text-subtle text-[7px] sm:text-[8px] mt-2 sm:mt-3">全球真实用户</p>
                      </motion.div>
                      <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                        <span className="text-3xl sm:text-5xl font-serif text-brand-primary">98%</span>
                        <p className="text-subtle text-[7px] sm:text-[8px] mt-2 sm:mt-3">客户满意度</p>
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
        ) : (
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
        )}
      </AnimatePresence>
    </div>
  );
}


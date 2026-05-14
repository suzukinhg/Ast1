import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';

interface HeroProps {
  onExplore: () => void;
}

export default function Hero({ onExplore }: HeroProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center pt-20 overflow-hidden bg-brand-paper">
      <motion.div 
        style={{ y, scale, opacity }} 
        className="absolute inset-0 z-0 gpu-accelerated overflow-hidden pointer-events-none"
      >
        <img 
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=2000" 
          alt="Wellness Background"
          className="w-full h-full object-cover opacity-60 contrast-[1.1] select-none"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-paper via-brand-paper/80 to-transparent" />
      </motion.div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,164,126,0.12),transparent_70%)] pointer-events-none" />
      
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]) }}
        className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[150px] pointer-events-none" 
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <motion.div style={{ opacity }} className="max-w-4xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2
                  }
                }
              }}
            >
              <motion.div 
                variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-4 mb-10"
              >
                <div className="h-[1px] w-8 bg-brand-primary/40" />
                <span className="text-[10px] uppercase tracking-[0.6em] font-medium text-brand-primary">
                  Ritual of Grace · 2024
                </span>
              </motion.div>

              <motion.h1 
                variants={{ 
                  hidden: { opacity: 0 }, 
                  visible: { 
                    opacity: 1, 
                    transition: { 
                      staggerChildren: 0.15, 
                      delayChildren: 0.4
                    } 
                  } 
                }}
                className="text-6xl sm:text-8xl md:text-[11rem] leading-[0.85] font-light mb-12 tracking-tighter relative gpu-accelerated"
              >
                <span className="relative inline-block overflow-hidden py-4 -my-4 px-1">
                  <motion.span 
                    variants={{ hidden: { y: "110%" }, visible: { y: 0 } }}
                    transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 block italic font-serif text-brand-primary"
                  >
                    荷尔蒙的
                  </motion.span>
                </span>
                <br />
                <span className="overflow-hidden py-4 -my-4 px-1 inline-block">
                  <motion.span 
                    variants={{ hidden: { y: "110%" }, visible: { y: 0 } }}
                    transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-brand-ink block font-light tracking-widest"
                  >
                    无声艺术
                  </motion.span>
                </span>
              </motion.h1>

              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="mb-16 border-l-[1.5px] border-brand-primary/10 pl-8 space-y-6"
              >
                <div className="text-xl md:text-3xl text-brand-ink/50 leading-relaxed font-light max-w-2xl">
                  这不只是生理的平衡，而是一场关于{" "}
                  <span className="text-brand-ink font-normal relative inline-block">
                    魅力磁场、生命韵律与情感
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 2, duration: 2 }}
                      className="absolute -bottom-1 left-0 w-full h-[1px] bg-brand-primary/30 origin-left"
                    />
                  </span>{" "}
                  深度的化学重构。
                </div>
                <div className="flex gap-3">
                  {[1,2,3,4].map(i => (
                    <motion.div 
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.5 + (i*0.1) }}
                      className="size-1 rounded-full bg-brand-primary/30"
                    />
                  ))}
                </div>
              </motion.div>

              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 1, delay: 1 }}
                className="flex flex-col sm:flex-row gap-6 items-start sm:items-center"
              >
                <button className="group relative bg-brand-ink text-brand-paper px-14 py-7 rounded-full text-xs uppercase tracking-[0.4em] overflow-hidden transition-all active:scale-95 shadow-2xl hover:shadow-brand-primary/20">
                  <span className="relative z-10 flex items-center gap-3">
                    立即开启评测 <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-500" />
                  </span>
                  <div className="absolute inset-0 bg-brand-primary translate-y-full group-hover:translate-y-0 transition-transform duration-1000 ease-[0.16,1,0.3,1]" />
                </button>
                
                <button 
                  onClick={onExplore}
                  className="group px-14 py-7 rounded-full text-xs uppercase tracking-[0.4em] border border-brand-ink/5 hover:border-brand-primary transition-all duration-700 text-brand-ink/40 hover:text-brand-ink flex items-center gap-3"
                >
                  探索科学系统
                  <div className="size-1.5 rounded-full bg-brand-primary/20 group-hover:bg-brand-primary transition-colors" />
                </button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="absolute bottom-12 left-0 flex items-center gap-6"
          >
            <div className="w-16 h-[1px] bg-brand-ink/10" />
            <span className="text-[9px] uppercase tracking-[0.6em] text-brand-ink/30">Scroll to Explore Ritual</span>
          </motion.div>
        </div>
      </section>
    );
  }

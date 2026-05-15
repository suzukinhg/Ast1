import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { useTranslation, Trans } from 'react-i18next';

interface HeroProps {
  onExplore: () => void;
  onProductsClick: () => void;
}

export default function Hero({ onExplore, onProductsClick }: HeroProps) {
  const { t } = useTranslation();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center pt-20 overflow-hidden bg-transparent">
      <motion.div 
        style={{ y, scale, opacity }} 
        className="absolute inset-0 z-0 gpu-accelerated overflow-hidden pointer-events-none will-change-transform"
      >
        <img 
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=2000" 
          alt={t('hero.bg_alt')}
          className="w-full h-full object-cover opacity-40 brightness-110 contrast-[1.05] grayscale-[0.2] select-none"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-paper via-brand-paper/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-paper" />
      </motion.div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(138,141,145,0.15),transparent_70%)] pointer-events-none" />
      
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]) }}
        className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[150px] pointer-events-none" 
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <motion.div style={{ opacity }} className="max-w-3xl">
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
                className="flex items-center gap-4 mb-8"
              >
                <div className="h-[1px] w-8 bg-brand-primary/40" />
                <span className="text-[9px] uppercase tracking-[0.5em] font-medium text-brand-primary">
                  {t('hero.subtitle')}
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
                className="text-5xl sm:text-7xl md:text-8xl leading-[0.9] font-light mb-10 tracking-tighter relative gpu-accelerated"
              >
                <span className="relative inline-block overflow-hidden py-2 -my-2 px-1">
                  <motion.span 
                    variants={{ hidden: { y: "110%" }, visible: { y: 0 } }}
                    transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 block italic font-serif text-brand-primary"
                  >
                    {t('hero.slogan_1')}
                  </motion.span>
                </span>
                <br />
                <span className="overflow-hidden py-2 -my-2 px-1 inline-block">
                  <motion.span 
                    variants={{ hidden: { y: "110%" }, visible: { y: 0 } }}
                    transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-brand-ink block font-light tracking-wider"
                  >
                    {t('hero.slogan_2')}
                  </motion.span>
                </span>
              </motion.h1>

              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="mb-12 border-l-[1px] border-brand-primary/10 pl-6 space-y-4"
              >
                <div className="text-lg md:text-2xl text-brand-ink/50 leading-relaxed font-light max-w-xl">
                  <Trans i18nKey="hero.description">
                    这不只是生理的平衡，而是一场关于{" "}
                    <span className="text-brand-ink font-normal relative inline-block">
                      {t('hero.highlight')}
                      <motion.div 
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 2, duration: 2 }}
                        className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-brand-primary/30 origin-left"
                      />
                    </span>{" "}
                    的重构。
                  </Trans>
                </div>
                <div className="flex gap-2">
                  {[1,2,3].map(i => (
                    <motion.div 
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.5 + (i*0.1) }}
                      className="size-0.5 rounded-full bg-brand-primary/30"
                    />
                  ))}
                </div>
              </motion.div>

              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 1, delay: 1 }}
                className="flex flex-wrap gap-4 items-center"
              >
                <button 
                  onClick={onProductsClick}
                  className="group relative bg-brand-ink text-brand-paper px-10 py-5 rounded-full text-[10px] uppercase tracking-[0.3em] overflow-hidden transition-all active:scale-95 shadow-lg hover:shadow-2xl hover:shadow-brand-ink/30 hover:-translate-y-1"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {t('hero.cta_products')} <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-500" />
                  </span>
                  <div className="absolute inset-0 bg-brand-primary translate-y-full group-hover:translate-y-0 transition-transform duration-1000 ease-[0.16,1,0.3,1]" />
                </button>
                
                <button 
                  onClick={onExplore}
                  className="group px-10 py-5 rounded-full text-[10px] uppercase tracking-[0.3em] border border-brand-ink/30 hover:border-brand-primary transition-all duration-700 text-brand-ink hover:text-brand-ink flex items-center gap-2 hover:shadow-lg hover:bg-brand-paper/50 hover:-translate-y-1"
                >
                  {t('hero.cta_explore')}
                  <div className="size-1 rounded-full bg-brand-primary/40 group-hover:bg-brand-primary transition-colors" />
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
            <span className="text-[9px] uppercase tracking-[0.6em] text-brand-ink/30">{t('hero.scroll_explore')}</span>
          </motion.div>
        </div>
      </section>
  );
}

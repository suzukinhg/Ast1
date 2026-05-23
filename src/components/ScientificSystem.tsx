import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Sparkles, Beaker, Zap, Shield, Heart, Globe, Droplets, Leaf, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const IngredientCard = ({ item, index }: { item: any, index: number }) => {
  const { t } = useTranslation();
  const isEven = index % 2 === 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1], 
        delay: index * 0.1 
      }}
      className={`flex flex-col lg:flex-row gap-8 lg:gap-16 items-center mb-16 lg:mb-24 ${!isEven ? 'lg:flex-row-reverse' : ''}`}
    >
      <div className="w-full lg:w-1/2 relative group">
        <div className="aspect-[16/10] lg:aspect-[4/2.5] rounded-[24px] overflow-hidden shadow-2xl relative bg-brand-ink/5">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s] ease-out"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-ink/40 via-transparent to-transparent opacity-60" />
        </div>
        
        {/* Floating Technical Detail */}
        <div className={`absolute -bottom-6 ${isEven ? '-right-6' : '-left-6'} hidden lg:block z-20`}>
          <motion.div 
            initial={{ rotate: 12, scale: 0.8, opacity: 0 }}
            whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, type: "spring", bounce: 0.4 }}
            className="w-40 bg-brand-paper p-6 rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-2 text-[6px] font-mono text-brand-ink/10">FIG. {index + 1}A</div>
             <div className="text-brand-primary mb-3 p-2 bg-brand-primary/5 w-fit rounded-xl">
                {item.icon}
             </div>
             <p className="text-[7px] uppercase tracking-[0.4em] text-brand-ink/60 font-semibold mb-1">{t('scientific.molecular_profile')}</p>
             <p className="font-serif italic text-base leading-tight text-brand-ink">{item.name}</p>
          </motion.div>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 space-y-6 px-4 lg:px-0">
        <div className="space-y-3">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 40 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-[1.5px] bg-brand-primary"
          />
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-brand-primary text-[10px] font-medium uppercase tracking-[0.3em] block"
          >
            {t('scientific.spotlight')}
          </motion.span>
          <motion.h3 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl lg:text-4xl font-serif leading-tight text-brand-ink"
          >
            {item.name}
          </motion.h3>
        </div>
        
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-brand-ink/80 text-sm lg:text-base font-light leading-relaxed max-w-xl"
        >
          {item.desc}
        </motion.p>
        
        <div className="flex flex-col gap-6">
          <div className="pt-3 flex items-center gap-4 text-[8px] uppercase tracking-widest font-bold text-brand-ink/50 border-t border-brand-ink/5 max-w-xs">
            <span>{t('scientific.purity')}: 99.9%</span>
            <div className="size-0.5 rounded-full bg-brand-ink/10" />
            <span>{t('scientific.bioavailability')}: {t('scientific.max')}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ScientificSystem = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const liquidFocus = [
    { 
      name: t('scientific.ingredients.0.name'), 
      desc: t('scientific.ingredients.0.desc'), 
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200&fm=webp",
      icon: <Droplets className="size-6 text-brand-primary" />
    },
    { 
      name: t('scientific.ingredients.1.name'), 
      desc: t('scientific.ingredients.1.desc'), 
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200&fm=webp", 
      icon: <Sparkles className="size-6 text-brand-primary" />
    },
    { 
      name: t('scientific.ingredients.2.name'), 
      desc: t('scientific.ingredients.2.desc'), 
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200&fm=webp", 
      icon: <Zap className="size-6 text-brand-primary" />
    }
  ];

  const otherIngredients = [
    { name: t('scientific.others.hyaluronic'), cat: t('scientific.cat_hydration'), icon: <Droplets className="size-4" /> },
    { name: t('scientific.others.neuraminic'), cat: t('scientific.cat_vitality'), icon: <Heart className="size-4" /> },
    { name: t('scientific.others.blood_orange'), cat: t('scientific.cat_defense'), icon: <Shield className="size-4" /> },
    { name: t('scientific.others.peony'), cat: t('scientific.cat_balance'), icon: <Leaf className="size-4" /> },
  ];

  const stats = [
    { label: t('scientific.stats.0.label'), val: "12+", sub: t('scientific.stats.0.sub') },
    { label: t('scientific.stats.1.label'), val: "98.5%", sub: t('scientific.stats.1.sub') },
    { label: t('scientific.stats.2.label'), val: "2400+", sub: t('scientific.stats.2.sub') },
    { label: t('scientific.stats.3.label'), val: "15", sub: t('scientific.stats.3.sub') }
  ];

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const smoothBackgroundY = useSpring(backgroundY, { stiffness: 100, damping: 30 });

  return (
    <div ref={containerRef} className="bg-transparent section-padding px-4 relative overflow-hidden pattern-tech-grid border-t border-white/5">
      
      {/* Background Marble Overlay */}
      <div className="absolute inset-0 pattern-marble opacity-[0.4] pointer-events-none" />
      
      {/* Background Micro-elements */}
      <motion.div 
        style={{ y: smoothBackgroundY }}
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.2] gpu-accelerated"
      >
        <div className="absolute top-[10%] left-[5%] text-[15vw] font-serif italic text-brand-ink/[0.03] select-none uppercase tracking-tighter">Purity</div>
        <div className="absolute top-[60%] right-[5%] text-[15vw] font-serif italic text-brand-ink/[0.03] select-none uppercase tracking-tighter">Science</div>
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10 px-4">
        {/* Editorial Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 lg:mb-24 items-end relative">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-brand-primary text-[10px] font-semibold uppercase tracking-[0.6em] mb-6 block">{t('scientific.dossier')}</span>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif text-brand-ink leading-normal tracking-tighter">
                {t('scientific.title_1')}<br />
                <span className="italic font-light opacity-30 text-[0.9em]">{t('scientific.title_2')}</span>{t('scientific.title_3')}
              </h2>
            </motion.div>
          </div>
          <div className="lg:col-span-4 lg:mb-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.2 }}
              className="relative"
            >
              <div className="absolute -left-6 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-brand-primary via-brand-primary/20 to-transparent" />
              <p className="text-brand-ink/60 text-base lg:text-lg font-light leading-relaxed">
                {t('scientific.desc')}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Feature Image Grid */}
        <div className="mb-16 lg:mb-32">
          {liquidFocus.map((item, idx) => (
            <IngredientCard key={idx} item={item} index={idx} />
          ))}
        </div>

        {/* Secondary Ingredients - Bento style */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 lg:mb-24">
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xl lg:text-2xl font-serif italic text-brand-primary leading-tight">
              {t('scientific.synergy')}
            </h3>
            <p className="text-brand-ink/70 font-light leading-relaxed text-sm">
              {t('scientific.synergy_desc')}
            </p>
          </div>
          
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {otherIngredients.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -2, backgroundColor: 'rgba(28,28,30,0.04)' }}
                  className="p-6 rounded-[20px] bg-brand-ink/5 border border-brand-ink/5 flex items-center justify-between group transition-all duration-500"
                >
                  <div>
                    <span className="text-[8px] uppercase tracking-widest text-brand-primary mb-0.5 block">{item.cat}</span>
                    <h4 className="text-base font-medium text-brand-ink">{item.name}</h4>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-brand-ink/10 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
                    {item.icon}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Brand Philosophy - Asymmetrical Layout */}
        <div className="relative mb-16 lg:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.5 }}
              className="lg:col-span-12 relative z-0"
            >
              <div className="aspect-square rounded-[32px] overflow-hidden image-container-modern shadow-[0_0_50px_rgba(0,240,255,0.2)]">
                <img 
                  src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2000&fm=webp" 
                  alt="Scientific Purity" 
                  className="w-full h-full object-cover opacity-80 mix-blend-screen"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-[#121214]/70 backdrop-blur-[2px]" />
                
                <div className="absolute inset-0 p-8 lg:p-16 flex flex-col justify-center items-center text-center max-w-5xl mx-auto">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-8"
                  >
                    <div className="w-16 h-0.5 bg-brand-primary mx-auto opacity-80" />
                    <h3 className="text-xl md:text-2xl font-serif leading-[1.6] text-brand-primary tracking-wide drop-shadow-md">
                      {t('scientific.philosophy_quote')}
                    </h3>
                    <p className="text-brand-ink/80 text-xs md:text-sm font-light leading-loose max-w-2xl mx-auto">
                      {t('scientific.philosophy_desc')}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats Bento */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:pb-12">
          {stats.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-[24px] bg-brand-ink/20 backdrop-blur-3xl border border-white/5 flex flex-col items-center text-center hover:bg-brand-ink/40 transition-colors cursor-default"
            >
              <span className="text-[8px] uppercase tracking-widest text-brand-primary mb-2">{item.label}</span>
              <span className="text-3xl font-serif text-brand-ink mb-1">{item.val}</span>
              <span className="text-[9px] font-light text-brand-ink/80 tracking-tight">{item.sub}</span>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ScientificSystem;

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Sparkles, Beaker, Zap, Shield, Heart, Globe, Droplets, Leaf, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const IngredientCard = ({ item, index }: { item: any, index: number }) => {
  const { t } = useTranslation();
  const isEven = index % 2 === 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      className={`flex flex-col lg:flex-row gap-8 lg:gap-16 items-center mb-32 lg:mb-48 ${!isEven ? 'lg:flex-row-reverse' : ''}`}
    >
      <div className="w-full lg:w-1/2 relative group">
        <div className="aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl relative bg-brand-ink/5">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[4s] ease-outgrayscale-[0.1]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-ink/20 via-transparent to-transparent opacity-60" />
        </div>
        
        {/* Floating Technical Detail */}
        <div className={`absolute -bottom-8 ${isEven ? '-right-8' : '-left-8'} hidden lg:block z-20`}>
          <motion.div 
            initial={{ rotate: 12, scale: 0.9 }}
            whileInView={{ rotate: 0, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-48 bg-brand-paper p-8 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-brand-ink/5 relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-2 text-[6px] font-mono text-brand-ink/10">FIG. {index + 1}A</div>
             <div className="text-brand-primary mb-4 p-3 bg-brand-primary/5 w-fit rounded-2xl">
                {item.icon}
             </div>
             <p className="text-[8px] uppercase tracking-[0.4em] text-brand-ink/30 font-semibold mb-2">{t('scientific.molecular_profile')}</p>
             <p className="font-serif italic text-lg leading-tight text-brand-ink">{item.name}</p>
             
             <div className="mt-4 flex gap-1">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className={`h-0.5 flex-1 ${i <= 4 ? 'bg-brand-primary/20' : 'bg-brand-ink/5'}`} />
               ))}
             </div>
          </motion.div>
        </div>

        {/* Decorative corner markers */}
        <div className="absolute top-4 left-4 size-8 border-t border-l border-white/30 pointer-events-none" />
        <div className="absolute bottom-4 right-4 size-8 border-b border-r border-white/30 pointer-events-none" />
      </div>
      
      <div className="w-full lg:w-1/2 space-y-8 px-4 lg:px-0">
        <div className="space-y-4">
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
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-3xl lg:text-5xl font-serif leading-[1.1] text-brand-ink"
          >
            {item.name.split(' & ').map((part: string, i: number) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="italic font-light opacity-50 block lg:inline"> & </span>}
                <motion.span
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 + (i * 0.1) }}
                  className="inline-block"
                >
                  {part}
                </motion.span>
              </React.Fragment>
            ))}
          </motion.h3>
        </div>
        
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-brand-ink/50 text-base lg:text-lg font-light leading-relaxed max-w-xl"
        >
          {item.desc}
        </motion.p>
        
        <div className="flex flex-col gap-6">
          <div className="pt-3 flex items-center gap-4 text-[9px] uppercase tracking-widest font-bold text-brand-ink/20 border-t border-brand-ink/5 max-w-xs">
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
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=1200",
      icon: <Droplets className="size-6" />
    },
    { 
      name: t('scientific.ingredients.1.name'), 
      desc: t('scientific.ingredients.1.desc'), 
      image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&q=80&w=1200", 
      icon: <Sparkles className="size-6" />
    },
    { 
      name: t('scientific.ingredients.2.name'), 
      desc: t('scientific.ingredients.2.desc'), 
      image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200", 
      icon: <Zap className="size-6" />
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
    <div ref={containerRef} className="min-h-screen bg-transparent py-24 lg:py-48 px-4 relative overflow-hidden">
      
      {/* Background Micro-elements */}
      <motion.div 
        style={{ y: smoothBackgroundY }}
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.15]"
      >
        <div className="absolute top-[15%] left-[2%] text-[18vw] font-serif italic text-brand-ink/[0.04] select-none uppercase tracking-tighter">Purity</div>
        <div className="absolute top-[65%] right-[2%] text-[18vw] font-serif italic text-brand-ink/[0.04] select-none uppercase tracking-tighter">Science</div>
        
        {/* Technical floating nodes */}
        <div className="absolute top-[30%] right-[15%] size-32 border border-brand-primary/10 rounded-full animate-pulse" />
        <div className="absolute bottom-[25%] left-[10%] size-64 border border-brand-primary/5 rounded-full" />
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10 px-4">
        {/* Editorial Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-32 lg:mb-64 items-end relative">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-brand-primary text-[10px] font-semibold uppercase tracking-[0.6em] mb-12 block">{t('scientific.dossier')}</span>
              <h2 className="text-5xl md:text-7xl lg:text-[110px] font-serif text-brand-ink leading-[0.88] tracking-tighter mb-12">
                {t('scientific.title_1')}<br />
                <span className="italic font-light opacity-30 text-[0.9em]">{t('scientific.title_2')}</span>{t('scientific.title_3')}
              </h2>
            </motion.div>
          </div>
          <div className="lg:col-span-4 lg:mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.2 }}
              className="relative"
            >
              <div className="absolute -left-6 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-brand-primary via-brand-primary/20 to-transparent" />
              <p className="text-brand-ink/60 text-lg lg:text-xl font-light leading-relaxed">
                {t('scientific.desc')}
              </p>
              
              <div className="mt-8 flex items-center gap-2 text-[8px] font-mono text-brand-ink/30 uppercase tracking-[0.2em]">
                <span className="text-brand-primary">●</span> {t('scientific.qa_active')}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Feature Image Grid */}
        <div className="mb-32 lg:mb-48">
          {liquidFocus.map((item, idx) => (
            <IngredientCard key={idx} item={item} index={idx} />
          ))}
        </div>

        {/* Secondary Ingredients - Bento style */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-32 lg:mb-48">
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-2xl font-serif italic text-brand-primary leading-tight">
              {t('scientific.synergy').split(' ').map((word, i) => <React.Fragment key={i}>{word}<br /></React.Fragment>)}
            </h3>
            <p className="text-brand-ink/40 font-light leading-relaxed text-base">
              {t('scientific.synergy_desc')}
            </p>
          </div>
          
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherIngredients.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -3 }}
                  className="p-8 rounded-[24px] bg-brand-ink/[0.02] border border-brand-ink/5 flex items-center justify-between group transition-all duration-500"
                >
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-brand-primary mb-1 block">{item.cat}</span>
                    <h4 className="text-lg font-medium text-brand-ink">{item.name}</h4>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-brand-ink/10 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
                    {item.icon}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Brand Philosophy - Asymmetrical Layout */}
        <div className="relative mb-24 lg:mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="lg:col-span-6 relative z-0"
            >
              <div className="aspect-square lg:aspect-[4/5] rounded-[40px] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1200" 
                  alt="Scientific Purity" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="lg:col-span-7 lg:-ml-16 bg-brand-ink text-brand-paper p-8 lg:p-16 rounded-[40px] relative z-10 shadow-2xl space-y-8"
            >
              <div className="w-12 h-0.5 bg-brand-primary" />
              <h3 className="text-3xl lg:text-5xl font-serif leading-tight italic">
                {t('scientific.philosophy_quote')}
              </h3>
              <p className="text-brand-paper/50 text-base lg:text-xl font-light leading-relaxed">
                {t('scientific.philosophy_desc')}
              </p>
              
              <div className="flex flex-wrap gap-6 pt-8 border-t border-brand-paper/10">
                <div className="space-y-1">
                   <span className="text-brand-primary text-[9px] uppercase tracking-widest font-bold">{t('scientific.research')}</span>
                   <p className="text-base">{t('scientific.research')}</p>
                </div>
                <div className="space-y-1">
                   <span className="text-brand-primary text-[9px] uppercase tracking-widest font-bold">{t('scientific.advanced')}</span>
                   <p className="text-base">{t('scientific.advanced')}</p>
                </div>
                <div className="space-y-1">
                   <span className="text-brand-primary text-[9px] uppercase tracking-widest font-bold">{t('scientific.traceable')}</span>
                   <p className="text-base">{t('scientific.traceable')}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-24">
          {stats.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[32px] bg-brand-paper/50 backdrop-blur-sm border border-brand-primary/10 flex flex-col items-center text-center hover:bg-brand-paper/80 transition-colors cursor-default"
            >
              <span className="text-[9px] uppercase tracking-widest text-brand-ink/30 mb-3">{item.label}</span>
              <span className="text-4xl font-serif text-brand-ink mb-1">{item.val}</span>
              <span className="text-[10px] font-light text-brand-ink/40 tracking-tight">{item.sub}</span>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ScientificSystem;

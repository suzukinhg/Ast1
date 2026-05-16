import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, ShieldCheck, Zap, UserCheck, Clock, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Skeleton from './ui/Skeleton';

const faqStaticData = [
  {
    icon: <Sparkles className="size-6" />,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
  },
  {
    icon: <ShieldCheck className="size-6" />,
    image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&q=80&w=800"
  },
  {
    icon: <Clock className="size-6" />,
    image: "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?auto=format&fit=crop&q=80&w=800"
  },
  {
    icon: <UserCheck className="size-6" />,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
  },
  {
    icon: <Zap className="size-6" />,
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800"
  }
];

const QASkeleton = () => (
  <div className="space-y-40">
    {[1, 2].map((i) => (
      <div key={i} className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${i % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
        <div className="w-full lg:w-1/2">
          <Skeleton variant="rect" className="w-full aspect-[16/10] lg:aspect-[4/3] rounded-[40px]" />
        </div>
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton variant="rect" width={48} height={48} className="rounded-2xl" />
            <Skeleton variant="rect" width={120} height={12} />
          </div>
          <Skeleton variant="rect" width="90%" height={48} />
          <div className="space-y-3">
            <Skeleton variant="rect" width="100%" height={24} />
            <Skeleton variant="rect" width="95%" height={24} />
            <Skeleton variant="rect" width="80%" height={24} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const QAItem = ({ item, index }: { item: any, index: number }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
           transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
      className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-16 mb-16 lg:mb-20 ${!isEven ? 'lg:flex-row-reverse' : ''}`}
    >
      <div className="w-full lg:w-1/2">
        <div className="relative group overflow-hidden rounded-[32px] aspect-[16/9] shadow-2xl bg-brand-ink/5">
          <motion.img
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 1.5 }}
            src={item.image}
            alt="FAQ Detail"
            className="w-full h-full object-cover grayscale-[0.2]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-primary/10 mix-blend-overlay" />
        </div>
      </div>

      <div className="w-full lg:w-1/2 space-y-3">
        <div className="flex items-center gap-3">
          <motion.div 
            initial={{ rotate: -45, scale: 0 }}
            whileInView={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.3 }}
            className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary"
          >
            {item.icon}
          </motion.div>
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-[8px] uppercase tracking-widest text-brand-ink/70 font-bold"
          >
            Q.0{index + 1}
          </motion.span>
        </div>
        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg lg:text-2xl font-serif text-brand-ink leading-tight"
        >
          {item.question}
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-sm lg:text-base text-brand-ink/80 font-light leading-relaxed"
        >
          {item.answer}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default function QASection() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const faqData = (t('qa.faqs', { returnObjects: true }) as any[]).map((f, i) => ({
    ...f,
    icon: faqStaticData[i].icon,
    image: faqStaticData[i].image
  }));

  return (
    <div className="bg-transparent section-padding overflow-hidden pattern-tech-grid relative">
      <div className="absolute inset-0 pattern-marble opacity-[0.4] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16 space-y-2">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[8px] uppercase tracking-[0.5em] block text-brand-primary"
          >
            FAQ / Insights
          </motion.span>
          <h2 className="text-3xl lg:text-6xl font-serif tracking-tighter leading-none text-brand-ink">
             <span className="block italic opacity-30 font-light">{t('qa.title_1')}</span>
             <span className="block -mt-1">{t('qa.title_2')}</span>
          </h2>
        </div>

        {/* FAQ List */}
        <div className="grid grid-cols-1 lg:py-10">
          {isLoading ? (
            <QASkeleton />
          ) : (
            <div className="grid grid-cols-1 gap-12 lg:gap-24">
              {faqData.map((item, index) => (
                <QAItem key={index} item={item} index={index} />
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mt-16 lg:mt-24 p-6 lg:p-16 bg-brand-paper border border-white/5 text-brand-ink rounded-[32px] text-center space-y-6 relative overflow-hidden shadow-2xl group pattern-dark-texture"
        >
          <div className="relative z-10 space-y-4">
            <div className="flex justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="size-10 rounded-full border border-brand-primary/30 flex items-center justify-center"
              >
                <Sparkles className="size-4 text-brand-primary" />
              </motion.div>
            </div>
            <h3 className="text-2xl lg:text-4xl font-serif italic">{t('qa.cta_title')}</h3>
            <p className="text-sm lg:text-base font-light text-brand-ink/70 max-w-lg mx-auto leading-relaxed">
              {t('qa.cta_desc')}
            </p>
            <a 
              href="https://work.weixin.qq.com/ca/cawcde4492a85a4cef"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block group relative bg-brand-primary text-brand-paper px-8 lg:px-10 py-4 rounded-full text-[9px] uppercase tracking-[0.3em] overflow-hidden transition-all active:scale-95 shadow-lg"
            >
              <span className="relative z-10">{t('qa.cta_btn')}</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </a>
          </div>
          
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-primary/10 blur-3xl rounded-full" />
        </motion.div>
      </div>
    </div>
  );
}

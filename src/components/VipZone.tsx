import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface VipZoneProps {
  onBack: () => void;
}

export default function VipZone({ onBack }: VipZoneProps) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-brand-paper relative selection:bg-brand-primary selection:text-white flex flex-col items-center justify-center p-6 sm:p-12"
    >
      <div className="absolute inset-0 pattern-marble opacity-50 mix-blend-overlay pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <button 
        onClick={onBack}
        className="absolute top-8 left-8 sm:top-12 sm:left-12 flex items-center gap-2 text-brand-ink/60 hover:text-brand-primary transition-colors z-10"
      >
        <ArrowLeft size={20} />
        <span className="text-sm tracking-widest uppercase font-brand-en">返回 / Back</span>
      </button>

      <div className="w-full max-w-3xl relative z-[1]">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="bg-brand-ink/5 backdrop-blur-3xl border border-brand-primary/20 rounded-[40px] p-8 sm:p-16 text-center shadow-2xl overflow-hidden relative"
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-50" />
          
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.4 }}
          >
            <CheckCircle className="w-24 h-24 sm:w-32 sm:h-32 text-[#10B981] mx-auto mb-8 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" strokeWidth={1.5} />
          </motion.div>
          
          <h1 className="text-3xl sm:text-5xl font-serif text-brand-primary mb-4 tracking-wide leading-tight">
            {t('vip.title')}
          </h1>
          <h2 className="text-lg sm:text-2xl text-brand-ink/80 font-light italic mb-8">
            {t('vip.subtitle')}
          </h2>
          
          <div className="w-16 h-[1px] bg-brand-primary/30 mx-auto mb-8" />

          <p className="text-brand-ink/70 font-light leading-relaxed max-w-xl mx-auto mb-10 text-sm sm:text-base">
            {t('vip.desc')}
          </p>

          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] font-serif tracking-widest text-sm">
            <Sparkles size={16} />
            <span>{t('vip.verified')}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

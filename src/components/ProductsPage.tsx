import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ProductsPage({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[300] bg-brand-paper overflow-y-auto"
    >
      <div className="min-h-screen relative flex flex-col items-center justify-center p-8">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-4 bg-brand-ink/5 hover:bg-brand-ink/10 text-brand-ink rounded-full transition-colors z-10"
        >
          <X size={24} />
        </button>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center"
        >
          <div className="size-32 mx-auto border border-brand-ink/10 rounded-full flex items-center justify-center mb-8">
            <span className="text-brand-ink/30 text-sm tracking-widest uppercase">{t('products.coming_soon')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-brand-ink mb-6">{t('products.title')}</h2>
          <p className="text-brand-ink/50 max-w-md mx-auto leading-relaxed">
            {t('products.desc')}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

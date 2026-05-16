import { Sparkles, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative bg-brand-paper text-brand-ink py-16 overflow-hidden pattern-dark-texture">
      {/* Background Marble Overlay */}
      <div className="absolute inset-0 pattern-marble opacity-[0.2] pointer-events-none" />
      
      {/* Decorative gold gradient background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-primary/10 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex flex-col gap-1 border-l border-brand-primary/30 pl-6 group">
              <span className="brand-logo-text text-3xl sm:text-4xl text-white group-hover:text-brand-primary transition-colors cursor-default">萃丽妍</span>
              <span className="brand-sub-text text-[9px] text-brand-primary/40 ml-0.5 tracking-[0.4em]">CUILEA</span>
            </div>
            <p className="text-brand-ink/60 max-w-xs leading-relaxed font-light text-xs italic pl-6">
              {t('footer.desc')}
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-white/80">{t('footer.contact_us')}</h4>
            <ul className="space-y-3 text-xs text-brand-ink/70 font-light">
              <li className="flex items-center gap-3 transition-colors hover:text-white"><Mail size={12} className="text-brand-primary/50" /> {t('footer.email')}</li>
              <li className="flex items-center gap-3 items-start"><MapPin size={12} className="text-brand-primary/50 mt-1 shrink-0" /> <span className="leading-relaxed">{t('footer.address_val')}</span></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-white/80">{t('footer.follow_us')}</h4>
            <div className="flex flex-col gap-3">
              <a 
                href="https://work.weixin.qq.com/ca/cawcde4492a85a4cef" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-fit px-5 py-2.5 rounded-full border border-white/5 flex items-center justify-center gap-2 hover:bg-brand-primary hover:border-brand-primary hover:text-white transition-all duration-300 cursor-pointer group"
              >
                <span className="text-[9px] font-bold uppercase tracking-wider">{t('footer.add_wechat')}</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] uppercase tracking-widest text-brand-ink/50 font-medium">
          <p>{t('footer.all_rights_reserved')}</p>
          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-white transition-colors">{t('footer.privacy')}</span>
            <span className="cursor-pointer hover:text-white transition-colors">{t('footer.terms')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

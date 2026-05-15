import { Sparkles, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-brand-ink text-brand-paper py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex flex-col gap-1 border-l border-brand-primary/30 pl-8">
              <span className="brand-logo-text text-4xl sm:text-5xl text-white">萃丽妍</span>
              <span className="brand-sub-text text-[9px] sm:text-[11px] text-brand-primary/40 ml-0.5">CUILEA</span>
            </div>
            <p className="text-brand-paper/30 max-w-sm leading-relaxed font-light text-sm italic pl-8">
              {t('footer.desc')}
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">{t('footer.contact_us')}</h4>
            <ul className="space-y-4 text-sm text-brand-paper/50 font-light">
              <li className="flex items-center gap-3 transition-colors hover:text-white"><Mail size={14} className="text-brand-primary/60" /> {t('footer.email')}</li>
              <li className="flex items-center gap-3 items-start"><MapPin size={14} className="text-brand-primary/60 mt-1 shrink-0" /> <span className="leading-relaxed">{t('footer.address_val')}</span></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">{t('footer.follow_us')}</h4>
            <div className="flex flex-col gap-3">
              <a 
                href="https://work.weixin.qq.com/ca/cawcde4492a85a4cef" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-fit px-6 py-3 rounded-full border border-white/10 flex items-center justify-center gap-2 hover:bg-white hover:text-brand-ink transition-colors cursor-pointer"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider">{t('footer.add_wechat')}</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-brand-paper/30 font-medium">
          <p>{t('footer.all_rights_reserved')}</p>
          <div className="flex gap-8">
            <span className="cursor-pointer hover:text-white transition-colors">{t('footer.privacy')}</span>
            <span className="cursor-pointer hover:text-white transition-colors">{t('footer.terms')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

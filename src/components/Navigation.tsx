import React, { useState, useEffect } from 'react';
import { LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { useFirebase } from '../contexts/FirebaseContext';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';

interface NavigationProps {
  activeTab: 'public' | 'qa' | 'scientific' | 'user' | 'vip' | 'qr';
  setActiveTab: (tab: 'public' | 'qa' | 'scientific' | 'user' | 'vip' | 'qr') => void;
  openAuth: () => void;
}

const navItems = [
  { id: 'public', label: '品牌哲学', en: 'Philosophy' },
  { id: 'scientific', label: '科学系统', en: 'Scientific' },
  { id: 'qa', label: 'Q&A', en: 'Consulting' },
];

const languages = [
  { code: 'en-US', label: 'English', flag: '🇺🇸' },
  { code: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
  { code: 'ja-JP', label: '日本語', flag: '🇯🇵' },
  { code: 'fr-FR', label: 'Français', flag: '🇫🇷' },
  { code: 'ko-KR', label: '한국어', flag: '🇰🇷' },
  { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
];

export default function Navigation({ activeTab, setActiveTab, openAuth }: NavigationProps) {
  const { t, i18n } = useTranslation();
  const { user, logout } = useFirebase();
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  
  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const navItems = [
    { id: 'public', label: t('nav.philosophy'), en: t('nav.philosophy_sub') },
    { id: 'scientific', label: t('nav.scientific'), en: t('nav.scientific_sub') },
    { id: 'qa', label: t('nav.qa'), en: t('nav.qa_sub') },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ease-[0.16, 1, 0.3, 1] ${
      scrolled 
        ? 'bg-brand-paper/95 backdrop-blur-3xl border-b border-brand-primary/10 pt-2 pb-2 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
        : 'bg-transparent pt-6 pb-4'
    }`}>
      {/* Removed texture overlay for performance */}
      
      {/* Decorative Navigation Accents */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-brand-primary/10 to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center relative gap-4">

          {/* Navigation Items */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-8 flex-1 px-2 overflow-x-auto no-scrollbar scroll-smooth">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.96 }}
                className="group relative px-4 sm:px-6 py-2 shrink-0 outline-none"
              >
                <div className="relative z-10 flex flex-col items-center gap-0.5">
                  <span className={`text-[11px] sm:text-xs md:text-sm font-medium tracking-[0.2em] transition-all duration-500 ${
                    activeTab === item.id ? 'text-brand-ink font-bold' : 'text-brand-ink/40 group-hover:text-brand-ink/80'
                  }`}>
                    {item.label}
                  </span>
                  <span className={`text-[6px] sm:text-[7px] uppercase tracking-[0.3em] font-light transition-all duration-500 ${
                    activeTab === item.id ? 'text-brand-primary opacity-100' : 'text-brand-ink/20 opacity-40 group-hover:opacity-60'
                  }`}>
                    {item.en}
                  </span>
                </div>

                {activeTab === item.id && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute inset-0 bg-brand-primary/5 rounded-full -z-0"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                  />
                )}
                
                <motion.div 
                  initial={false}
                  animate={{ 
                    width: activeTab === item.id ? '40%' : '0%',
                    opacity: activeTab === item.id ? 1 : 0 
                  }}
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[1px] bg-brand-primary/40 rounded-full"
                />
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-4 z-[110] shrink-0">
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setLangOpen(!langOpen)}
                onBlur={() => setTimeout(() => setLangOpen(false), 200)}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full border border-brand-primary/20 bg-brand-primary/5 hover:border-brand-primary hover:bg-brand-primary/10 transition-colors text-brand-ink/90"
              >
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium">
                  <span className="text-sm sm:text-base">{currentLang.flag}</span>
                  <span className="hidden sm:inline-block">{currentLang.label}</span>
                  <span className="inline-block sm:hidden uppercase font-bold tracking-wider">{currentLang.code.split('-')[0]}</span>
                </div>
                <ChevronDown size={14} className={`transition-transform duration-300 opacity-60 ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {langOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-40 sm:w-44 bg-brand-paper/95 backdrop-blur-2xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-brand-primary/10 overflow-hidden py-2"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          i18n.changeLanguage(lang.code).catch(console.error);
                          setLangOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm transition-all flex items-center gap-3 hover:bg-brand-primary/5 hover:text-brand-primary ${
                          i18n.language === lang.code ? 'bg-brand-primary/10 text-brand-primary font-bold' : 'text-brand-ink/70'
                        }`}
                      >
                        <span className="text-base sm:text-lg">{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth Area */}
            {user && (
              <div className="flex items-center gap-3">
                <button 
                  onClick={async () => {
                    await logout();
                    setActiveTab('public' as any);
                  }}
                  className="text-xs font-medium text-brand-ink/50 hover:text-red-500 transition-colors hidden sm:flex items-center gap-1.5"
                >
                  <LogOut size={14} /> {t('nav.logout')}
                </button>
                <div 
                  onClick={() => setActiveTab('user' as any)} 
                  className="size-8 sm:size-10 rounded-full border-2 border-brand-primary/20 overflow-hidden bg-brand-ink/5 shadow-sm cursor-pointer hover:border-brand-primary transition-colors"
                >
                  <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}


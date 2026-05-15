import React, { useState, useEffect } from 'react';
import { LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { useFirebase } from '../contexts/FirebaseContext';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';

interface NavigationProps {
  activeTab: 'public' | 'qa' | 'scientific' | 'user';
  setActiveTab: (tab: 'public' | 'qa' | 'scientific' | 'user') => void;
  openAuth: () => void;
}

const navItems = [
  { id: 'public', label: '品牌哲学', en: 'Philosophy' },
  { id: 'scientific', label: '科学系统', en: 'Scientific' },
  { id: 'qa', label: 'Q&A', en: 'Consulting' },
];

const languages = [
  { code: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
  { code: 'en-US', label: 'English', flag: '🇺🇸' },
  { code: 'ja-JP', label: '日本語', flag: '🇯🇵' },
  { code: 'fr-FR', label: 'Français', flag: '🇫🇷' },
  { code: 'ko-KR', label: '한국어', flag: '🇰🇷' },
];

export default function Navigation({ activeTab, setActiveTab, openAuth }: NavigationProps) {
  const { t, i18n } = useTranslation();
  const { user, logout } = useFirebase();
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  
  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];
  const [flagIndex, setFlagIndex] = useState(0);

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

    const flagInterval = setInterval(() => {
      setFlagIndex((prev) => (prev + 1) % languages.length);
    }, 2500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(flagInterval);
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-1000 ease-[0.16, 1, 0.3, 1] ${
      scrolled 
        ? 'bg-brand-paper/80 backdrop-blur-3xl border-b border-brand-ink/5 pt-3 pb-3 shadow-[0_1px_10px_rgba(0,0,0,0.02)]' 
        : 'bg-brand-paper/40 backdrop-blur-xl border-b border-white/10 pt-5 pb-5'
    }`}>
      {/* Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay" 
           style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />
      
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

          <div className="flex items-center gap-4 sm:gap-6 z-[110] shrink-0">
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setLangOpen(!langOpen)}
                onBlur={() => setTimeout(() => setLangOpen(false), 200)}
                className="flex items-center gap-2 text-brand-ink/60 hover:text-brand-primary transition-colors py-2"
              >
                <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={flagIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="absolute text-lg"
                    >
                      {languages[flagIndex].flag}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <span className="text-sm font-medium hidden sm:block">
                  {currentLang.label}
                </span>
                <ChevronDown size={14} className={`transition-transform duration-300 hidden sm:block ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {langOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-36 bg-white rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-brand-ink/5 overflow-hidden py-2"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          i18n.changeLanguage(lang.code).catch(console.error);
                          setLangOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs transition-all flex items-center gap-2 hover:bg-brand-primary/5 hover:text-brand-primary ${
                          i18n.language === lang.code ? 'bg-brand-primary/10 text-brand-primary font-medium' : 'text-brand-ink/60'
                        }`}
                      >
                        <span className="text-sm">{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth Area */}
            {user ? (
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
            ) : (
              <button 
                onClick={openAuth}
                className="group relative px-5 sm:px-8 py-2.5 sm:py-3 bg-orange-500 text-white rounded-full overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5"
              >
                <div className="relative z-10 flex items-center gap-2 text-xs sm:text-sm font-medium tracking-wide">
                  <UserIcon size={16} className="group-hover:scale-110 transition-transform" />
                  <span className="hidden xs:inline">{t('nav.login')}</span>
                </div>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}


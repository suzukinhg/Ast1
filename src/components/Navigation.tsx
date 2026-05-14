import React, { useState, useEffect } from 'react';
import { Sparkles, LogOut, User as UserIcon } from 'lucide-react';
import { useFirebase } from '../contexts/FirebaseContext';
import { motion, AnimatePresence } from 'motion/react';

interface NavigationProps {
  activeTab: 'public' | 'qa' | 'scientific';
  setActiveTab: (tab: 'public' | 'qa' | 'scientific') => void;
  openAuth: () => void;
}

export default function Navigation({ activeTab, setActiveTab, openAuth }: NavigationProps) {
  const { user, logout } = useFirebase();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'public', label: '品牌哲学', en: 'Philosophy' },
    { id: 'scientific', label: '科学系统', en: 'Scientific' },
    { id: 'qa', label: 'Q&A', en: 'Consulting' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ease-[0.22, 1, 0.36, 1] ${
      scrolled 
        ? 'bg-brand-paper/70 backdrop-blur-3xl border-b border-brand-ink/5 py-4' 
        : 'bg-transparent border-b border-transparent py-8'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center relative gap-8">
          
          {/* Flattened Nav Items - Now visible on all screens */}
          <div className="flex items-center gap-6 sm:gap-12 flex-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className="group relative py-2"
              >
                <div className="flex flex-col items-start sm:items-center">
                  <span className={`text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-all duration-500 ${
                    activeTab === item.id ? 'text-brand-primary font-bold' : 'text-brand-ink/40 group-hover:text-brand-ink'
                  }`}>
                    {item.label}
                  </span>
                  <span className="hidden sm:block text-[7px] uppercase tracking-[0.4em] text-brand-ink/20 opacity-0 group-hover:opacity-100 transition-all duration-500 mt-1">
                    {item.en}
                  </span>
                </div>
                <motion.div 
                  initial={false}
                  animate={{ 
                    width: activeTab === item.id ? '100%' : '0%',
                    opacity: activeTab === item.id ? 1 : 0 
                  }}
                  className="absolute -bottom-1 left-0 h-[1px] bg-brand-primary"
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 sm:gap-6 z-[110] shrink-0">
            {user ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => logout()}
                  className="text-[10px] uppercase tracking-widest text-brand-ink/40 hover:text-brand-primary transition-colors hidden sm:flex items-center gap-2"
                >
                  <LogOut size={12} /> 退出
                </button>
                <div className="size-8 sm:size-10 rounded-full border border-brand-ink/10 overflow-hidden bg-brand-ink/5">
                  <img src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
            ) : (
              <button 
                onClick={openAuth}
                className="group relative px-5 sm:px-8 py-2.5 sm:py-3 border border-brand-ink/10 rounded-full overflow-hidden transition-all duration-500 hover:border-brand-ink"
              >
                <div className="relative z-10 flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-widest text-brand-ink/60 group-hover:text-brand-ink transition-colors">
                  <UserIcon size={14} className="group-hover:scale-110 transition-transform" />
                  <span className="hidden xs:inline">尊享会员</span>
                </div>
                <div className="absolute inset-0 bg-brand-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

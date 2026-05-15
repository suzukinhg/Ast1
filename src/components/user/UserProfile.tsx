import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFirebase, AVATAR_SEEDS } from '../../contexts/FirebaseContext';
import { LogOut, User, Camera, X, Check, Loader2 } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useTranslation } from 'react-i18next';

export default function UserProfile() {
  const { t } = useTranslation();
  const { user, logout } = useFirebase();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
        <p className="text-brand-ink/50">{t('user.please_login')}</p>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleChangeAvatar = async (seed: string) => {
    setUpdatingAvatar(true);
    try {
      const newPhotoURL = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
      await updateProfile(user, { photoURL: newPhotoURL });
      await updateDoc(doc(db, 'users', user.uid), { photoURL: newPhotoURL });
      
      const phoneNumber = user.phoneNumber || (user.email ? user.email.replace('@hormone.app', '') : 'unknown');
      fetch('/api/user/sync-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, username: user.displayName, avatar: newPhotoURL })
      }).catch(() => {});
      
      setIsAvatarModalOpen(false);
    } catch (error) {
      console.error("Failed to update avatar", error);
    } finally {
      setUpdatingAvatar(false);
    }
  };

  const getDisplayContact = () => {
    if (user.phoneNumber) return user.phoneNumber;
    if (user.email && user.email.endsWith('@hormone.app')) {
      return '+' + user.email.replace('@hormone.app', '');
    }
    return user.email || t('user.unbound');
  };

  const displayContact = getDisplayContact();
  const displayName = user.displayName || displayContact || t('user.premium_member');

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
      <motion.aside 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-64 shrink-0 flex flex-col gap-4"
      >
        <div className="bg-brand-paper/50 backdrop-blur-3xl border border-brand-primary/10 rounded-3xl p-6 shadow-sm text-center">
          <div className="relative size-20 mx-auto mb-4 group">
            <div className="w-full h-full rounded-full border-2 border-brand-primary/20 overflow-hidden bg-brand-ink/5 relative">
              <img 
                src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                alt="Avatar" 
                className="w-full h-full object-cover transition-opacity group-hover:opacity-60" 
              />
            </div>
            <button 
              onClick={() => setIsAvatarModalOpen(true)}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-brand-ink/20 rounded-full"
            >
              <Camera className="text-white drop-shadow-md" size={24} />
            </button>
          </div>
          <h3 className="font-serif text-lg text-brand-ink truncate font-medium">
            {displayName}
          </h3>
          <p className="text-xs font-semibold text-brand-primary mt-2 uppercase tracking-wider">{t('user.diamond_member')}</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white px-6 py-4 rounded-3xl transition-all font-medium text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <LogOut size={16} />
          {t('nav.logout')}
        </button>
      </motion.aside>

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 bg-brand-paper/50 backdrop-blur-3xl border border-brand-primary/10 rounded-3xl p-6 sm:p-10 shadow-sm"
      >
        <div className="space-y-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
              <User className="text-brand-primary" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-serif text-brand-ink">{t('user.basic_info')}</h2>
              <p className="text-xs text-brand-ink/50 mt-1">{t('user.manage_profile')}</p>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="bg-white/40 border border-brand-ink/5 rounded-2xl p-5">
              <label className="block text-xs font-medium text-brand-ink/60 uppercase tracking-wider mb-2">{t('user.nickname')}</label>
              <div className="text-sm text-brand-ink font-medium">{displayName}</div>
            </div>
            
            <div className="bg-white/40 border border-brand-ink/5 rounded-2xl p-5">
              <label className="block text-xs font-medium text-brand-ink/60 uppercase tracking-wider mb-2">{t('user.contact')}</label>
              <div className="text-sm text-brand-ink font-medium">{displayContact}</div>
            </div>
            
            <div className="bg-white/40 border border-brand-ink/5 rounded-2xl p-5">
              <label className="block text-xs font-medium text-brand-ink/60 uppercase tracking-wider mb-2">{t('user.reg_time')}</label>
              <div className="text-sm text-brand-ink font-medium">
                {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : '-'}
              </div>
            </div>
          </div>
        </div>
      </motion.main>

      <AnimatePresence>
        {isAvatarModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] overflow-y-auto"
          >
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-brand-ink/60 backdrop-blur-sm" onClick={() => !updatingAvatar && setIsAvatarModalOpen(false)} />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-brand-paper w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl p-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-serif">{t('user.select_avatar')}</h2>
                  <button 
                    onClick={() => setIsAvatarModalOpen(false)}
                    disabled={updatingAvatar}
                    className="p-2 bg-brand-ink/5 rounded-full hover:bg-brand-ink/10 transition-colors disabled:opacity-50"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                  {AVATAR_SEEDS.map((seed) => {
                    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
                    const isSelected = user.photoURL === avatarUrl;

                    return (
                      <button
                        key={seed}
                        disabled={updatingAvatar}
                        onClick={() => handleChangeAvatar(seed)}
                        className={`relative aspect-square rounded-2xl border-2 overflow-hidden transition-all group ${
                          isSelected ? 'border-brand-primary' : 'border-brand-ink/10 hover:border-brand-primary/50'
                        }`}
                      >
                        <div className="absolute inset-0 bg-brand-ink/5 group-hover:bg-transparent transition-colors" />
                        <img src={avatarUrl} alt={seed} className="w-full h-full object-cover" />
                        
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-brand-primary text-white rounded-full p-0.5 shadow-sm">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                        
                        {updatingAvatar && !isSelected && (
                          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {updatingAvatar && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-[32px]">
                    <Loader2 className="animate-spin text-brand-primary mb-2" size={32} />
                    <p className="font-medium text-brand-ink text-sm">{t('user.updating_avatar')}</p>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFirebase } from '../contexts/FirebaseContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function GenderModal() {
  const { user } = useFirebase();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsOpen(false);
      return;
    }

    const checkGender = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (!data.gender) {
            setIsOpen(true);
          }
        }
      } catch (error) {
        console.error("Error checking gender", error);
      } finally {
        setLoading(false);
      }
    };
    checkGender();
  }, [user]);

  const handleSelect = async (genderValue: string) => {
    if (!user) return;
    setSubmitting(true);
    try {
      // 1. Update Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        gender: genderValue
      });

      // 2. Mock upload to future server
      const phoneNumber = user.phoneNumber || (user.email ? user.email.replace('@hormone.app', '') : '未知');
      console.log(`[Mock Server Sync] Uploading to future server: Phone: ${phoneNumber}, Gender: ${genderValue}, Username: ${user.displayName}`);
      
      try {
        fetch('/api/user/sync-gender', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            phone: phoneNumber, 
            gender: genderValue, 
            username: user.displayName,
            avatar: user.photoURL
          })
        }).catch(() => {});
      } catch (e) {}

      setIsOpen(false);
    } catch (error) {
      console.error("Error saving gender", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && !loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] overflow-y-auto"
        >
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <div className="fixed inset-0 bg-brand-ink/80 backdrop-blur-md -z-10" />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-brand-paper rounded-[32px] overflow-hidden shadow-2xl p-8"
            >
              <div className="mx-auto w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-6">
                <UserRound className="w-8 h-8 text-brand-primary" />
              </div>
              
              <h2 className="text-2xl font-serif text-brand-ink mb-2">{t('gender.thanks')}</h2>
              <p className="text-brand-ink/60 text-sm mb-8">
                {t('gender.desc')}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleSelect('female')}
                  disabled={submitting}
                  className="py-4 rounded-2xl border-2 border-brand-ink/10 hover:border-brand-primary hover:bg-brand-primary/5 transition-all outline-none flex flex-col items-center gap-2 group disabled:opacity-50"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">👩</span>
                  <span className="font-medium text-brand-ink">{t('gender.female')}</span>
                </button>
                <button
                  onClick={() => handleSelect('male')}
                  disabled={submitting}
                  className="py-4 rounded-2xl border-2 border-brand-ink/10 hover:border-brand-primary hover:bg-brand-primary/5 transition-all outline-none flex flex-col items-center gap-2 group disabled:opacity-50"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">👨</span>
                  <span className="font-medium text-brand-ink">{t('gender.male')}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

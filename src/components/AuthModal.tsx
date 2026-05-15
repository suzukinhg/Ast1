import React, { useState, useEffect } from 'react';
import { X, Phone, Mail, Loader2, ArrowRight } from 'lucide-react';
import { auth, signInWithGoogle } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DUMMY_PASSWORD = "hormone_safe_login_2026"; // 内部静态密码

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'options' | 'phone'>('options');
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode('options');
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      setError(err.message || t('auth.error_login_failed'));
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async () => {
    if (!phoneNumber) {
        setError(t('auth.error_enter_phone'));
        return;
    }
    
    if (!isValidPhoneNumber(phoneNumber)) {
        setError(t('auth.error_invalid_phone'));
        return;
    }

    setLoading(true);
    setError(null);

    // 将手机号转换为虚拟邮箱，例如 +8613800000000@hormone.app
    const dummyEmail = `${phoneNumber.replace('+', '')}@hormone.app`;

    try {
      // 尝试登录
      const userCredential = await signInWithEmailAndPassword(auth, dummyEmail, DUMMY_PASSWORD);
      console.log('Login success:', userCredential.user.uid);
      onClose();
    } catch (err: any) {
      console.error('Login error code:', err.code, err.message);
      
      // auth/invalid-credential 或 auth/user-not-found 时尝试注册
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-login-credentials') {
        try {
          console.log('User not found, attempting registration...');
          await createUserWithEmailAndPassword(auth, dummyEmail, DUMMY_PASSWORD);
          onClose();
        } catch (regErr: any) {
          console.error('Registration error:', regErr.code, regErr.message);
          if (regErr.code === 'auth/operation-not-allowed') {
            setError(t('auth.error_enable_email'));
          } else {
            setError(t('auth.error_reg_failed') + ': ' + (regErr.message || t('auth.error_enter_phone')));
          }
        }
      } else if (err.code === 'auth/operation-not-allowed') {
        setError(t('auth.error_method_disabled'));
      } else {
        setError(t('auth.error_system_busy') + ': ' + (err.code || 'Check network'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] overflow-y-auto"
    >
      <div 
        className="flex min-h-screen items-center justify-center p-4 sm:p-6 text-center"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-brand-ink/60 backdrop-blur-md -z-10" 
          onClick={onClose} 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-brand-paper w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl border border-white/20 my-auto text-left"
          onClick={(e) => e.stopPropagation()}
        >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-brand-ink/40 hover:text-brand-ink transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-10 pt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif mb-2">{t('auth.login_title')}</h2>
            <p className="text-sm text-brand-ink/50">{t('auth.login_subtitle')}</p>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'options' ? (
              <motion.div 
                key="options"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <button 
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-brand-paper/50 backdrop-blur-sm border border-brand-ink/10 py-4 rounded-2xl shadow-sm hover:shadow-md hover:bg-white transition-all disabled:opacity-50 hover:-translate-y-0.5"
                >
                  <Mail className="text-red-500" size={18} />
                  <span className="text-sm font-medium">{t('auth.google_login')}</span>
                </button>

                <button 
                  onClick={() => setMode('phone')}
                  className="w-full flex items-center justify-center gap-3 bg-brand-ink text-brand-paper py-4 rounded-2xl shadow-sm hover:shadow-md hover:bg-black transition-all hover:-translate-y-0.5"
                >
                  <Phone size={18} />
                  <span className="text-sm font-medium">{t('auth.phone_login')}</span>
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="phone-input-container">
                    <label className="text-[10px] uppercase tracking-widest text-brand-ink/40 mb-2 block ml-1">{t('auth.phone_label')}</label>
                    <PhoneInput
                      placeholder={t('auth.phone_placeholder')}
                      value={phoneNumber}
                      onChange={setPhoneNumber}
                      defaultCountry="CN"
                      className="w-full px-4 py-4 rounded-2xl border border-brand-ink/10 bg-brand-paper/50 backdrop-blur-sm focus-within:border-brand-primary transition-colors overflow-hidden"
                    />
                  </div>
                  
                  {/* Security protection hint */}
                  <div id="recaptcha-container" className="hidden"></div>
                  
                  <button 
                    onClick={handlePhoneSubmit}
                    disabled={!phoneNumber || loading}
                    className="w-full bg-brand-ink text-brand-paper py-4 rounded-2xl flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-black transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                    {t('auth.submit')}
                  </button>
                </div>
                
                <button 
                  onClick={() => setMode('options')}
                  className="w-full text-xs text-brand-ink/40 hover:text-brand-ink transition-colors flex items-center justify-center gap-1"
                >
                  <ArrowRight className="rotate-180" size={12} /> {t('auth.back')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <p className="mt-4 text-xs text-red-500 text-center bg-red-50 py-2 rounded-lg">{error}</p>
          )}

          <div className="mt-10 pt-6 border-t border-brand-ink/5 text-center">
            <p className="text-[10px] text-brand-ink/30 uppercase tracking-[0.2em]">
              {t('auth.secure_note')}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
    </motion.div> 
  );
}

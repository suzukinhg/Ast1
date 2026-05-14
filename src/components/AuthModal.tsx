import React, { useState, useEffect } from 'react';
import { X, Phone, Mail, Loader2, ArrowRight } from 'lucide-react';
import { auth, signInWithGoogle } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DUMMY_PASSWORD = "hormone_safe_login_2026"; // 内部静态密码

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'options' | 'phone'>('options');
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode('options');
      setError(null);
    }
  }, [isOpen]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      setError(err.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async () => {
    if (!phoneNumber) {
        setError('请输入手机号');
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
            setError('请先在 Firebase 控制台启用 Email/Password 登录方式');
          } else {
            setError('注册失败: ' + (regErr.message || '请检查手机号'));
          }
        }
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('登录方式未开启：请在 Firebase 控制台启用 Email/Password');
      } else {
        setError('系统繁忙: ' + (err.code || '请检查网络'));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div 
        className="flex min-h-screen items-center justify-center p-4 sm:p-6 text-center"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="fixed inset-0 bg-brand-ink/60 backdrop-blur-md -z-10" onClick={onClose} />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
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
            <h2 className="text-3xl font-serif mb-2">账号登陆</h2>
            <p className="text-sm text-brand-ink/50">无需验证码，输入手机号即刻开启</p>
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
                  className="w-full flex items-center justify-center gap-3 bg-white border border-brand-ink/10 py-4 rounded-2xl hover:bg-brand-ink/5 transition-colors disabled:opacity-50"
                >
                  <Mail className="text-red-500" size={18} />
                  <span className="text-sm font-medium">使用 Google 登陆</span>
                </button>

                <button 
                  onClick={() => setMode('phone')}
                  className="w-full flex items-center justify-center gap-3 bg-brand-primary text-brand-paper py-4 rounded-2xl hover:opacity-90 transition-opacity"
                >
                  <Phone size={18} />
                  <span className="text-sm font-medium">手机号便捷登陆</span>
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
                    <label className="text-[10px] uppercase tracking-widest text-brand-ink/40 mb-2 block ml-1">请选择国家/地区并输入号码</label>
                    <PhoneInput
                      placeholder="输入手机号"
                      value={phoneNumber}
                      onChange={setPhoneNumber}
                      defaultCountry="CN"
                      className="w-full px-4 py-4 rounded-2xl border border-brand-ink/10 bg-white focus-within:border-brand-primary transition-colors overflow-hidden"
                    />
                  </div>
                  <button 
                    onClick={handlePhoneSubmit}
                    disabled={!phoneNumber || loading}
                    className="w-full bg-brand-primary text-brand-paper py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                    立即进入
                  </button>
                </div>
                
                <button 
                  onClick={() => setMode('options')}
                  className="w-full text-xs text-brand-ink/40 hover:text-brand-ink transition-colors flex items-center justify-center gap-1"
                >
                  <ArrowRight className="rotate-180" size={12} /> 返回其他方式
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <p className="mt-4 text-xs text-red-500 text-center bg-red-50 py-2 rounded-lg">{error}</p>
          )}

          <div className="mt-10 pt-6 border-t border-brand-ink/5 text-center">
            <p className="text-[10px] text-brand-ink/30 uppercase tracking-[0.2em]">
              由系统加密保护，您的隐私安全无忧
            </p>
          </div>
        </div>
      </motion.div>
    </div>
    </div>
  );
}

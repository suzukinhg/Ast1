import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip, Legend } from 'recharts';
import { useFirebase, handleFirestoreError } from '../contexts/FirebaseContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

export default function Assessment() {
  const { t } = useTranslation();
  const questions = t('assessment.questions', { returnObjects: true }) as string[];
  const dimensions = t('assessment.dimensions', { returnObjects: true }) as string[];

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const { user, OperationType } = useFirebase();

  const chartData = useMemo(() => {
    if (!isFinished || answers.length === 0) return [];
    
    return dimensions.map((dim, index) => {
      const q1 = answers[index];
      const q2 = answers[index + 5];
      
      let val = 95; 
      if (q1 && q2) val = 55; 
      else if (q1 || q2) val = 75; 
      
      return {
        subject: dim,
        A: val,
        B: 90, 
        fullMark: 100,
      };
    });
  }, [isFinished, answers, dimensions]);

  const getFeedback = (score: number) => {
    if (score >= 90) return t('assessment.feedbacks.high');
    if (score >= 75) return t('assessment.feedbacks.medium_high');
    if (score >= 60) return t('assessment.feedbacks.medium');
    return t('assessment.feedbacks.low');
  };

  const handleAnswer = async (answer: boolean) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const positiveCount = newAnswers.filter(a => !a).length; 
      const calculatedScore = Math.floor((positiveCount / questions.length) * 40 + 60); 
      setScore(calculatedScore);
      setIsFinished(true);
      if (user) {
        await saveResults(newAnswers, calculatedScore);
      }
    }
  };

  const saveResults = async (finalAnswers: boolean[], calculatedScore: number) => {
    setIsSaving(true);
    const path = 'assessmentResults';
    
    try {
      await addDoc(collection(db, path), {
        userId: user?.uid,
        score: calculatedScore,
        answers: finalAnswers,
        completedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="py-20 bg-transparent">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16 md:mb-20">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-subtle text-[9px] block mb-4 uppercase tracking-widest"
          >
            {t('assessment.title_sub')}
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif mb-6 leading-[1.1]">
            {t('assessment.title').slice(0, 2)}<span className="text-luxury">{t('assessment.title').slice(2, 4)}</span>{t('assessment.title').slice(4)}
          </h2>
          <p className="text-base md:text-lg text-brand-ink/40 max-w-lg mx-auto font-light">
            {t('assessment.desc')}
          </p>
        </div>

        <div className="bg-brand-paper/60 backdrop-blur-md rounded-[24px] p-6 md:p-10 shadow-[0_32px_80px_-16px_rgba(28,28,30,0.08)] border border-brand-primary/10 min-h-[400px] flex flex-col justify-center relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {!isFinished ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-12"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-0.5"
                  >
                    <span className="text-subtle text-[8px] uppercase tracking-widest">{t('assessment.step')} {step + 1} {t('assessment.of')} {questions.length}</span>
                    <h4 className="text-xs font-serif italic text-brand-primary">{t('assessment.analysis')}</h4>
                  </motion.div>
                  <div className="w-full sm:w-40 h-[1.5px] bg-brand-ink/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                      className="h-full bg-brand-primary" 
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
                
                <div className="py-2 sm:py-6 min-h-[140px] flex items-center justify-center">
                  <motion.h3 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 1 }}
                    className="text-xl sm:text-2xl md:text-3xl font-serif leading-snug sm:leading-tight text-center px-4 relative"
                  >
                    <span className="absolute -top-8 -left-4 text-5xl sm:text-7xl text-brand-primary/5 font-serif pointer-events-none italic select-none">“</span>
                    {questions[step]}
                    <span className="absolute -bottom-10 -right-4 text-5xl sm:text-7xl text-brand-primary/5 font-serif pointer-events-none italic select-none">”</span>
                  </motion.h3>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-8"
                >
                  <button 
                    onClick={() => handleAnswer(true)}
                    className="group relative py-6 px-8 bg-brand-paper/30 rounded-xl sm:rounded-[24px] overflow-hidden hover:bg-brand-primary transition-all duration-700 text-left border border-brand-ink/5 hover:border-brand-primary shadow-sm hover:shadow-md hover:-translate-y-1"
                  >
                    <div className="relative z-10">
                      <span className="text-brand-ink group-hover:text-brand-paper text-base sm:text-lg font-normal block transition-colors duration-500">{t('assessment.yes_label')}</span>
                      <span className="text-brand-ink/40 group-hover:text-brand-paper/60 text-[9px] block mt-1 transition-colors duration-500 uppercase tracking-[0.15em]">{t('assessment.yes_sub')}</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => handleAnswer(false)}
                    className="group relative py-6 px-8 bg-brand-paper/30 rounded-xl sm:rounded-[24px] overflow-hidden hover:bg-brand-ink transition-all duration-700 text-left border border-brand-ink/5 hover:border-brand-ink shadow-sm hover:shadow-md hover:-translate-y-1"
                  >
                    <div className="relative z-10">
                      <span className="text-brand-ink group-hover:text-brand-paper text-base sm:text-lg font-normal block transition-colors duration-500">{t('assessment.no_label')}</span>
                      <span className="text-brand-ink/40 group-hover:text-brand-paper/60 text-[9px] block mt-1 transition-colors duration-500 uppercase tracking-[0.15em]">{t('assessment.no_sub')}</span>
                    </div>
                  </button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-center space-y-6"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
                  className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner"
                >
                  {isSaving ? <Loader2 className="w-8 h-8 text-brand-primary animate-spin" /> : <CheckCircle2 className="w-8 h-8 text-brand-primary" />}
                </motion.div>
                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl font-serif tracking-tight"
                >
                  {t('assessment.report_generated')}
                </motion.h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
                  <motion.div 
                    initial={{ opacity: 0, rotate: -5, scale: 0.95 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="h-[280px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                        <PolarGrid stroke="#E0E7FF" strokeOpacity={0.1} />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#00F0FF', fontSize: 10, fontWeight: 500 }} />
                        <Radar
                          name={t('assessment.your_status')}
                          dataKey="A"
                          stroke="#00F0FF"
                          fill="#00F0FF"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name={t('assessment.ideal_range')}
                          dataKey="B"
                          stroke="#8A2BE2"
                          fill="#8A2BE2"
                          fillOpacity={0.2}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -5px rgb(0 0 0 / 0.1)', padding: '10px', fontSize: '12px' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </motion.div>

                  <div className="space-y-6 text-left">
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                      className="space-y-2"
                    >
                      <p className="text-brand-ink/80 text-lg leading-relaxed font-light">
                        {t('assessment.overall_index')}
                      </p>
                      <div className="text-6xl font-serif text-brand-primary font-bold tracking-tighter">
                        {score}%
                      </div>
                    </motion.div>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="text-brand-ink/60 leading-relaxed text-sm italic border-l border-brand-primary/20 pl-4"
                    >
                      {score ? getFeedback(score) : t('assessment.processing')}
                    </motion.p>
                  </div>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="pt-4 space-y-6"
                >
                  {!user && (
                      <div className="text-[9px] uppercase tracking-widest text-brand-primary bg-brand-primary/5 px-5 py-2 rounded-full inline-block border border-brand-primary/10">
                          {t('assessment.login_save')}
                      </div>
                  )}
                  <div className="flex flex-wrap gap-4 justify-center items-center">
                    <button className="bg-brand-ink text-brand-paper px-8 py-4 rounded-full text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm hover:shadow-md hover:bg-black hover:-translate-y-0.5 transition-all">
                      {t('assessment.get_whitepaper')} <ArrowRight size={12} />
                    </button>
                    <button className="bg-brand-primary text-brand-paper px-8 py-4 rounded-full text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-opacity-90 transition-all">
                      {t('assessment.get_consultation')} <ArrowRight size={12} />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

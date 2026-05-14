import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip, Legend } from 'recharts';
import { useFirebase, handleFirestoreError } from '../contexts/FirebaseContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const questions = [
  "是否感到精力下降，午后容易疲惫？",
  "皮肤是否出现暗沉、色斑或者难以修护的细纹？",
  "情绪波动是否变大，容易焦虑或低落？",
  "与伴侣的互动亲密度是否有所下降？",
  "睡眠质量是否变差，难以进入深度睡眠？",
  "脑力活动后是否感觉反应迟钝，思维不如以往敏捷？",
  "身体是否存在局部浮肿，或体重受饮食波动影响极大？",
  "是否经常感到心烦意乱，难以专注完成手头工作？",
  "身体的感受力是否变得迟钝，对触碰和温存的反应减弱？",
  "醒后是否感到浑身沉重，仿佛没有得到真正的休息？"
];

const dimensions = [
  "精力活力",
  "代谢节奏",
  "情绪控制",
  "亲密和谐",
  "睡眠质量"
];

export default function Assessment() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const { user, OperationType } = useFirebase();

  const chartData = useMemo(() => {
    if (!isFinished || answers.length === 0) return [];
    
    // Each dimension corresponds to two questions: i and i+5
    return dimensions.map((dim, index) => {
      const q1 = answers[index];
      const q2 = answers[index + 5];
      
      let val = 95; // Both 'No' (healthy)
      if (q1 && q2) val = 55; // Both 'Yes' (issue)
      else if (q1 || q2) val = 75; // One 'Yes'
      
      return {
        subject: dim,
        A: val,
        B: 90, // Healthy reference
        fullMark: 100,
      };
    });
  }, [isFinished, answers]);

  const getFeedback = (score: number) => {
    if (score >= 90) return "您的生理平衡状态极佳，体内的自然节奏正处于高效且和谐的运转中。继续保持现有的生活方式，这为您持久的魅力奠定了坚实的基础。";
    if (score >= 75) return "您的生理状态目前总体稳定，但局部可能受外界环境或近期压力影响，出现了细微的波动信号。通过科学的节律调整与精准的营养补充，您可以轻松地让平衡感再次回归顶峰。";
    if (score >= 60) return "目前的评估显示，您的身体系统正通过微弱的信号提醒您关注内部节律。这并非意味着健康隐患，而是提示您需要关注激素水平与情绪节奏的科学协同，专业的温和干预将显著提升您的生活质感。";
    return "检测到您的生理状态正面临一定的平衡挑战，这可能已经细微地反映在您的日常活力与外观表现。建议从荷尔蒙平衡的角度进行科学审视，通过分阶段的精准调序，帮助身体找回原本的和谐韵律。";
  };

  const handleAnswer = async (answer: boolean) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const positiveCount = newAnswers.filter(a => !a).length; // "No" is positive
      const calculatedScore = Math.floor((positiveCount / questions.length) * 40 + 60); // Score range 60-100
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
    <section className="py-24 bg-brand-paper">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-20 md:mb-24">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-subtle text-[10px] block mb-6"
          >
            Wellness Assessment / 生理平衡自测
          </motion.span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif mb-8 leading-[1.1]">
            精准<span className="text-luxury">节律</span>评估
          </h2>
          <p className="text-lg md:text-xl text-brand-ink/40 max-w-xl mx-auto font-light">
            通过科学的维度分析，探索您的生理节律状态，获取个性化的平衡与魅力方案。
          </p>
        </div>

        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-2xl border border-brand-ink/5 min-h-[500px] flex flex-col justify-center relative overflow-hidden backdrop-blur-sm bg-white/80">
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-1"
                  >
                    <span className="text-subtle text-[9px] uppercase tracking-widest">Step {step + 1} of {questions.length}</span>
                    <h4 className="text-sm font-serif italic text-brand-primary">Biological Rhythm Analysis</h4>
                  </motion.div>
                  <div className="w-full sm:w-48 h-[2px] bg-brand-ink/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                      className="h-full bg-brand-primary" 
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
                
                <div className="py-2 sm:py-8 min-h-[160px] flex items-center justify-center">
                  <motion.h3 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 1 }}
                    className="text-2xl sm:text-3xl md:text-5xl font-serif leading-snug sm:leading-tight text-center px-4 relative"
                  >
                    <span className="absolute -top-10 -left-6 text-7xl sm:text-9xl text-brand-primary/5 font-serif pointer-events-none italic select-none">“</span>
                    {questions[step]}
                    <span className="absolute -bottom-14 -right-6 text-7xl sm:text-9xl text-brand-primary/5 font-serif pointer-events-none italic select-none">”</span>
                  </motion.h3>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mt-12 sm:mt-16"
                >
                  <button 
                    onClick={() => handleAnswer(true)}
                    className="group relative py-8 px-10 bg-brand-paper/30 rounded-2xl sm:rounded-[32px] overflow-hidden hover:bg-brand-primary transition-all duration-700 text-left border border-brand-ink/5 hover:border-brand-primary hover:shadow-2xl"
                  >
                    <div className="relative z-10">
                      <span className="text-brand-ink group-hover:text-brand-paper text-lg sm:text-xl font-normal block transition-colors duration-500">是的，时常如此</span>
                      <span className="text-brand-ink/40 group-hover:text-brand-paper/60 text-[10px] block mt-1 transition-colors duration-500 uppercase tracking-[0.2em]">Presence Detected</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => handleAnswer(false)}
                    className="group relative py-8 px-10 bg-brand-paper/30 rounded-2xl sm:rounded-[32px] overflow-hidden hover:bg-brand-ink transition-all duration-700 text-left border border-brand-ink/5 hover:border-brand-ink hover:shadow-2xl"
                  >
                    <div className="relative z-10">
                      <span className="text-brand-ink group-hover:text-brand-paper text-lg sm:text-xl font-normal block transition-colors duration-500">不，目前还好</span>
                      <span className="text-brand-ink/40 group-hover:text-brand-paper/60 text-[10px] block mt-1 transition-colors duration-500 uppercase tracking-[0.2em]">Balanced Rhythm</span>
                    </div>
                  </button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-center space-y-8"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
                  className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
                >
                  {isSaving ? <Loader2 className="w-12 h-12 text-brand-primary animate-spin" /> : <CheckCircle2 className="w-12 h-12 text-brand-primary" />}
                </motion.div>
                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl font-serif tracking-tight"
                >
                  评估报告已生成
                </motion.h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-8">
                  <motion.div 
                    initial={{ opacity: 0, rotate: -10, scale: 0.9 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="h-[350px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#1a1a1a', fontSize: 12, fontWeight: 500 }} />
                        <Radar
                          name="您的现状"
                          dataKey="A"
                          stroke="#5A5A40"
                          fill="#5A5A40"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name="理想区间"
                          dataKey="B"
                          stroke="#1a1a1a"
                          fill="#1a1a1a"
                          fillOpacity={0.05}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', padding: '12px' }}
                        />
                        <Legend iconType="circle" />
                      </RadarChart>
                    </ResponsiveContainer>
                  </motion.div>

                  <div className="space-y-8 text-left">
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                      className="space-y-4"
                    >
                      <p className="text-brand-ink/80 text-xl leading-relaxed font-light">
                        根据您的生理反馈，您的<br />
                        <span className="font-medium text-brand-ink uppercase tracking-tight text-3xl">综合平衡指数</span>
                      </p>
                      <div className="text-8xl font-serif text-brand-primary font-bold tracking-tighter">
                        {score}%
                      </div>
                    </motion.div>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="text-brand-ink/60 leading-relaxed text-base italic border-l-2 border-brand-primary/20 pl-6"
                    >
                      {score ? getFeedback(score) : "正在处理计算结果..."}
                    </motion.p>
                  </div>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="pt-8 space-y-8"
                >
                  {!user && (
                      <div className="text-xs uppercase tracking-widest text-brand-primary bg-brand-primary/5 px-6 py-3 rounded-full inline-block border border-brand-primary/10">
                          登录后即可永久保存您的评测记录
                      </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button className="bg-brand-ink text-brand-paper px-10 py-5 rounded-full text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-brand-primary transition-colors shadow-xl">
                      免费领取调理白皮书 <ArrowRight size={14} />
                    </button>
                    <button className="bg-brand-primary text-brand-paper px-10 py-5 rounded-full text-xs uppercase tracking-widest flex items-center gap-2 hover:shadow-2xl hover:-translate-y-1 transition-all">
                      获取专家咨询方案 <ArrowRight size={14} />
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

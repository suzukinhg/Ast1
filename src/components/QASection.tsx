import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, ShieldCheck, Zap, UserCheck, Clock, Sparkles } from 'lucide-react';
import Skeleton from './ui/Skeleton';

const faqData = [
  {
    question: "什么是“荷尔蒙之衡”系列的核心理念？",
    answer: "我们不仅关注单一指数的突破，更致力于通过深海三文鱼胶原蛋白肽、PQQ等核心成分，调节机体内源性平衡，从细胞层面延缓生理衰老曲线。我们的目标是为您找回那种失落已久的、充满生命力的平衡态。",
    icon: <Sparkles className="size-6" />,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
  },
  {
    question: "长期服用会有依赖性吗？",
    answer: "“荷尔蒙之衡”产品采用天然精萃成分，如极地白松露与专利酶解三肽。它们的设计初衷是修复与赋能机体自身系统，而非替代身体机能。我们坚持纯净配方，不含人工激素，让身体在自然的律动中重获新生。",
    icon: <ShieldCheck className="size-6" />,
    image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&q=80&w=800"
  },
  {
    question: "见效周期通常是多久？",
    answer: "根据万名真实用户的反馈，生理机能的微调通常在1-2个周期（约28-56天）显现。最初的表现往往是睡眠质量的改善与精力状态的平稳，随后是肌肤弹性和身体感知力的全方位修复。",
    icon: <Clock className="size-6" />,
    image: "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?auto=format&fit=crop&q=80&w=800"
  },
  {
    question: "适合哪些人群服用？",
    answer: "适合追求卓越生活品质、处于职场高压期、希望精准管理健康曲线的成年人群。特别是对于那些渴望在繁忙都市节奏中，依然维持优雅外观与充沛体能的高端人士，它是理想的选择。",
    icon: <UserCheck className="size-6" />,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
  },
  {
    question: "产品成分是否可信？",
    answer: "所有成分均可溯源。我们选用的每一克原料都经过严苛的实验室筛选，从深海精萃到极地植物活性因子，均通过国际公认的纯度测试，确保在为您提供高效营养的同时，维持极致的安全底线。",
    icon: <Zap className="size-6" />,
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800"
  }
];

const QASkeleton = () => (
  <div className="space-y-40">
    {[1, 2].map((i) => (
      <div key={i} className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${i % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
        <div className="w-full lg:w-1/2">
          <Skeleton variant="rect" className="w-full aspect-[16/10] lg:aspect-[4/3] rounded-[40px]" />
        </div>
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton variant="rect" width={48} height={48} className="rounded-2xl" />
            <Skeleton variant="rect" width={120} height={12} />
          </div>
          <Skeleton variant="rect" width="90%" height={48} />
          <div className="space-y-3">
            <Skeleton variant="rect" width="100%" height={24} />
            <Skeleton variant="rect" width="95%" height={24} />
            <Skeleton variant="rect" width="80%" height={24} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const QAItem = ({ item, index }: { item: typeof faqData[0], index: number }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 mb-24 lg:mb-32 ${!isEven ? 'lg:flex-row-reverse' : ''}`}
    >
      <div className="w-full lg:w-1/2">
        <div className="relative group overflow-hidden rounded-[40px] aspect-[16/10] lg:aspect-[4/3] shadow-2xl">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 1.5 }}
            src={item.image}
            alt="FAQ Detail"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-primary/5 mix-blend-overlay" />
        </div>
      </div>

      <div className="w-full lg:w-1/2 space-y-6">
        <div className="flex items-center gap-3">
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.3 }}
            className="p-3 bg-brand-primary/5 rounded-2xl text-brand-primary"
          >
            {item.icon}
          </motion.div>
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-[10px] uppercase tracking-widest text-brand-ink/40 font-bold"
          >
            Question 0{index + 1}
          </motion.span>
        </div>
        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-2xl lg:text-5xl font-serif text-brand-ink leading-tight"
        >
          {item.question}
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-lg lg:text-2xl text-brand-ink/50 font-light leading-relaxed"
        >
          {item.answer}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default function QASection() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenConsultant = () => {
    window.dispatchEvent(new CustomEvent('open-ai-chat'));
  };

  return (
    <div className="bg-brand-paper min-h-screen pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 lg:mb-32 space-y-8">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-subtle text-[10px] uppercase tracking-[0.6em] block text-brand-primary"
          >
            Support & Inquiry / Q&A
          </motion.span>
          <h2 className="text-6xl lg:text-[10rem] font-serif tracking-tighter leading-none text-brand-ink">
             <span className="block italic opacity-40 font-light">Questions</span>
             <span className="block -mt-4">& Answers</span>
          </h2>
        </div>

        {/* FAQ List */}
        <div className="grid grid-cols-1 lg:py-20">
          {isLoading ? (
            <QASkeleton />
          ) : (
            <div className="grid grid-cols-1 gap-24 lg:gap-40">
              {faqData.map((item, index) => (
                <QAItem key={index} item={item} index={index} />
              ))}
            </div>
          )}
        </div>
        
        {/* ... remaining CTA section */}

        {/* CTA Section */}
        <motion.div
           initial={{ opacity: 0, scale: 0.98 }}
           whileInView={{ opacity: 1, scale: 1 }}
           className="mt-32 lg:mt-48 p-12 lg:p-32 bg-brand-ink text-brand-paper rounded-[80px] text-center space-y-12 relative overflow-hidden shadow-3xl"
        >
          <div className="relative z-10 space-y-8">
            <div className="flex justify-center">
              <div className="size-16 rounded-full border border-brand-primary/30 flex items-center justify-center">
                <Sparkles className="size-6 text-brand-primary" />
              </div>
            </div>
            <h3 className="text-5xl lg:text-7xl font-serif italic mb-6">仍有其他疑问？</h3>
            <p className="text-xl lg:text-3xl font-light text-brand-paper/50 mb-12 max-w-2xl mx-auto leading-relaxed">
              我们的私人健康顾问全天候在线，为您提供一对一的精准咨询服务。
            </p>
            <button 
              onClick={handleOpenConsultant}
              className="group relative bg-brand-primary text-brand-paper px-12 lg:px-16 py-6 rounded-full text-xs uppercase tracking-[0.4em] overflow-hidden transition-all active:scale-95 hover:shadow-brand-primary/20 shadow-xl"
            >
              <span className="relative z-10">立即咨询顾问</span>
              <div className="absolute inset-0 bg-brand-paper/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </div>
          
          {/* Decorative gradients */}
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-brand-primary/5 blur-[120px] rounded-full" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-brand-primary/10 blur-[150px] rounded-full" />
        </motion.div>
      </div>
    </div>
  );
}

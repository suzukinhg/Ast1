import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Sparkles, BrainCircuit, MessageSquare, Cloud, Zap, Cpu, Server, Box } from 'lucide-react';

const partnersData = [
  { name: 'Google AI Studio', sub: 'Gemini Algorithm', icon: Sparkles, color: 'bg-gradient-to-br from-indigo-500/5 to-purple-500/5 text-indigo-500 border-indigo-500/20 hover:border-indigo-500/40 hover:bg-indigo-50/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/20' },
  { name: 'DeepSeek', sub: 'Neural Engine', icon: BrainCircuit, color: 'bg-gradient-to-br from-blue-500/5 to-cyan-500/5 text-blue-500 border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-50/50 shadow-sm hover:shadow-xl hover:shadow-blue-500/20' },
  { name: 'Claude', sub: 'Anthropic Core', icon: MessageSquare, color: 'bg-gradient-to-br from-amber-500/5 to-orange-500/5 text-amber-500 border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-50/50 shadow-sm hover:shadow-xl hover:shadow-amber-500/20' },
  { name: '阿里云', sub: 'Cloud Infra', icon: Cloud, color: 'bg-gradient-to-br from-sky-500/5 to-blue-500/5 text-sky-500 border-sky-500/20 hover:border-sky-500/40 hover:bg-sky-50/50 shadow-sm hover:shadow-xl hover:shadow-sky-500/20' },
  { name: 'NVIDIA', sub: 'GPU Computing', icon: Cpu, color: 'bg-gradient-to-br from-emerald-500/5 to-green-500/5 text-emerald-500 border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-50/50 shadow-sm hover:shadow-xl hover:shadow-emerald-500/20' },
  { name: 'Microsoft Azure', sub: 'Cloud Services', icon: Server, color: 'bg-gradient-to-br from-cyan-500/5 to-blue-500/5 text-cyan-500 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-cyan-50/50 shadow-sm hover:shadow-xl hover:shadow-cyan-500/20' },
  { name: 'Tencent Cloud', sub: 'Data Center', icon: Box, color: 'bg-gradient-to-br from-violet-500/5 to-purple-500/5 text-violet-500 border-violet-500/20 hover:border-violet-500/40 hover:bg-violet-50/50 shadow-sm hover:shadow-xl hover:shadow-violet-500/20' }
];

export default function Partners() {
  const { t } = useTranslation();

  return (
    <section className="py-24 relative overflow-hidden bg-transparent perspective-1000">
      <div className="absolute inset-0 pattern-tech-grid opacity-[0.2] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-2xl sm:text-4xl md:text-5xl font-serif text-brand-ink mb-4"
          >
            {t('partners.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-brand-ink/60 font-light max-w-2xl mx-auto"
          >
            {t('partners.desc')}
          </motion.p>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 relative"
        >
          {partnersData.map((partner, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, scale: 0.8, y: 50, rotateX: -15 },
                show: { 
                  opacity: 1, 
                  scale: 1, 
                  y: 0,
                  rotateX: 0,
                  transition: { type: "spring", stiffness: 80, damping: 15, mass: 1.2 }
                }
              }}
              whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
              // Make layout slightly staggered for "错落有致" (scattered/staggered alignment)
              className={`flex flex-col items-center justify-center p-6 sm:p-8 rounded-[24px] lg:rounded-[32px] border backdrop-blur-md transition-colors duration-500 cursor-default relative overflow-hidden group ${partner.color} ${
                idx % 2 === 1 ? 'md:mt-12' : 'md:mb-12'
              } ${
                idx === 3 || idx === 6 ? 'col-span-2 md:col-span-1 md:row-span-2' : ''
              }`}
              style={{ minHeight: '160px' }}
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <partner.icon className="size-8 sm:size-10 mb-4 opacity-80 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
              <h3 className="text-xl sm:text-2xl font-bold tracking-wider mb-2 text-center font-serif leading-tight relative z-10 w-full">
                {partner.name}
              </h3>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] opacity-70 font-mono text-center relative z-10">
                {partner.sub}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Endless Marquee Style Gradient Fades */}
        <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-brand-paper to-transparent pointer-events-none z-20" />
        <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-brand-paper to-transparent pointer-events-none z-20" />
      </div>
    </section>
  );
}

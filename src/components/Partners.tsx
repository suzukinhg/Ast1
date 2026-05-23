import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Sparkles, BrainCircuit, MessageSquare, Cloud, Cpu, Server, Box, X, TrendingUp, Zap } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const partnersData = [
  { name: 'Google AI Studio', sub: 'Gemini Algorithm', icon: Sparkles, color: 'bg-gradient-to-br from-indigo-500/5 to-purple-500/5 text-indigo-500 border-indigo-500/20 hover:border-indigo-500/40 hover:bg-indigo-50/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/20',
    desc: 'Deep integration with Gemini unlocks multimodal capabilities, boosting processing speed and contextual awareness significantly across our AI agents.',
    charts: [ { name: 'Q1', baseline: 30, synergy: 85 }, { name: 'Q2', baseline: 45, synergy: 92 }, { name: 'Q3', baseline: 40, synergy: 98 }, { name: 'Q4', baseline: 50, synergy: 110 } ]
  },
  { name: 'DeepSeek', sub: 'Neural Engine', icon: BrainCircuit, color: 'bg-gradient-to-br from-blue-500/5 to-cyan-500/5 text-blue-500 border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-50/50 shadow-sm hover:shadow-xl hover:shadow-blue-500/20',
    desc: 'Utilizing DeepSeek\'s advanced reasoning engine reduces computational overhead while maximizing codebase generation accuracy.',
    charts: [ { name: 'Q1', baseline: 25, synergy: 75 }, { name: 'Q2', baseline: 35, synergy: 88 }, { name: 'Q3', baseline: 40, synergy: 95 }, { name: 'Q4', baseline: 65, synergy: 120 } ]
  },
  { name: 'Claude', sub: 'Anthropic Core', icon: MessageSquare, color: 'bg-gradient-to-br from-amber-500/5 to-orange-500/5 text-amber-500 border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-50/50 shadow-sm hover:shadow-xl hover:shadow-amber-500/20',
    desc: 'Connecting with Anthropic Claude provides our systems with industry-leading context window reasoning and nuanced enterprise communication.',
    charts: [ { name: 'Q1', baseline: 40, synergy: 80 }, { name: 'Q2', baseline: 50, synergy: 90 }, { name: 'Q3', baseline: 55, synergy: 105 }, { name: 'Q4', baseline: 60, synergy: 115 } ]
  },
  { name: '阿里云', sub: 'Cloud Infra', icon: Cloud, color: 'bg-gradient-to-br from-sky-500/5 to-blue-500/5 text-sky-500 border-sky-500/20 hover:border-sky-500/40 hover:bg-sky-50/50 shadow-sm hover:shadow-xl hover:shadow-sky-500/20',
    desc: 'Alibaba Cloud infrastructure delivers ultra-low latency enterprise deployments, optimizing local container cold-starts and bandwidth.',
    charts: [ { name: 'Q1', baseline: 50, synergy: 90 }, { name: 'Q2', baseline: 60, synergy: 100 }, { name: 'Q3', baseline: 65, synergy: 120 }, { name: 'Q4', baseline: 70, synergy: 135 } ]
  },
  { name: 'NVIDIA', sub: 'GPU Computing', icon: Cpu, color: 'bg-gradient-to-br from-emerald-500/5 to-green-500/5 text-emerald-500 border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-50/50 shadow-sm hover:shadow-xl hover:shadow-emerald-500/20',
    desc: 'Native NVIDIA GPU hardware acceleration enables our core AI topologies to process terabytes of data with parallelized efficiency.',
    charts: [ { name: 'Q1', baseline: 30, synergy: 100 }, { name: 'Q2', baseline: 45, synergy: 125 }, { name: 'Q3', baseline: 60, synergy: 140 }, { name: 'Q4', baseline: 80, synergy: 165 } ]
  },
  { name: 'Microsoft Azure', sub: 'Cloud Services', icon: Server, color: 'bg-gradient-to-br from-cyan-500/5 to-blue-500/5 text-cyan-500 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-cyan-50/50 shadow-sm hover:shadow-xl hover:shadow-cyan-500/20',
    desc: 'Leveraging Azure\'s enterprise-scale ML pipelines ensures continuous delivery of ML models with globally distributed data protection.',
    charts: [ { name: 'Q1', baseline: 45, synergy: 85 }, { name: 'Q2', baseline: 50, synergy: 95 }, { name: 'Q3', baseline: 55, synergy: 110 }, { name: 'Q4', baseline: 60, synergy: 125 } ]
  },
  { name: 'Tencent Cloud', sub: 'Data Center', icon: Box, color: 'bg-gradient-to-br from-violet-500/5 to-purple-500/5 text-violet-500 border-violet-500/20 hover:border-violet-500/40 hover:bg-violet-50/50 shadow-sm hover:shadow-xl hover:shadow-violet-500/20',
    desc: 'Tencent Cloud integration provides unmatched stability for high-concurrency connections in the Asian-Pacific operational zones.',
    charts: [ { name: 'Q1', baseline: 55, synergy: 90 }, { name: 'Q2', baseline: 60, synergy: 105 }, { name: 'Q3', baseline: 75, synergy: 115 }, { name: 'Q4', baseline: 80, synergy: 130 } ]
  }
];

export default function Partners() {
  const { t } = useTranslation();
  const [selectedPartner, setSelectedPartner] = useState<typeof partnersData[0] | null>(null);

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
              onClick={() => setSelectedPartner(partner)}
              // Make layout slightly staggered for "错落有致" (scattered/staggered alignment)
              className={`flex flex-col items-center justify-center p-6 sm:p-8 rounded-[24px] lg:rounded-[32px] border backdrop-blur-md transition-colors duration-500 cursor-pointer relative overflow-hidden group ${partner.color} ${
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

      {/* Synergy Analysis Modal */}
      <AnimatePresence>
        {selectedPartner && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPartner(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-brand-ink/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-brand-paper rounded-[32px] shadow-2xl overflow-hidden border border-brand-primary/10 flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedPartner(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-brand-ink/5 hover:bg-brand-ink/10 transition-colors z-10"
              >
                <X className="size-5 text-brand-ink/60" />
              </button>

              <div className={`w-full md:w-1/3 p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-brand-primary/10 ${selectedPartner.color.replace('hover:scale-105', '').replace('cursor-pointer', '')}`}>
                <selectedPartner.icon className="size-12 mb-6" strokeWidth={1.5} />
                <h3 className="text-3xl font-serif font-bold text-brand-ink mb-2 leading-tight">
                  {selectedPartner.name}
                </h3>
                <p className="text-sm font-mono uppercase tracking-widest opacity-80 mb-6">
                  {selectedPartner.sub}
                </p>
                <p className="text-sm leading-relaxed text-brand-ink/80">
                  {selectedPartner.desc}
                </p>
              </div>

              <div className="w-full md:w-2/3 p-8 bg-white">
                <div className="flex items-center gap-3 mb-8">
                  <TrendingUp className="size-5 text-brand-primary" />
                  <h4 className="text-lg font-bold text-brand-ink">Synergy Performance Delta</h4>
                </div>
                
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedPartner.charts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorSynergy" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '14px', fontWeight: 500 }}
                      />
                      <Area type="monotone" dataKey="baseline" name="Baseline" stroke="#94a3b8" strokeWidth={2} fillOpacity={1} fill="url(#colorBaseline)" />
                      <Area type="monotone" dataKey="synergy" name="With Astcare Synergy" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSynergy)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

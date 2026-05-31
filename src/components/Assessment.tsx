import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';

export default function Assessment() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<{keyword: string, data: any[], overallScore: number} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const keyword = input.trim();
    setIsLoading(true);
    setAssessmentResult(null);

    const cacheKey = `geoScore_${keyword}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        setTimeout(() => {
          setAssessmentResult(parsedData);
          setIsLoading(false);
        }, 500); // Small delay for UX
        return;
      } catch (err) {
        // Ignore JSON parse errors and proceed to fetch
      }
    }

    try {
      const response = await fetch('/api/geoScore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: keyword })
      });

      if (!response.ok) {
        throw new Error(t('assessment.api_error'));
      }

      const resData = await response.json();
      
      if (resData.code !== 200 || !resData.data) {
        throw new Error(resData.msg || t('assessment.invalid_json'));
      }

      const { aiVisible = 0, authority = 0, credibility = 0, brandWeight = 0, infoComplete = 0 } = resData.data;

      const mockData = [
        { subject: t('assessment.dim_aiVisible'), score: aiVisible, ideal: 95 },
        { subject: t('assessment.dim_authority'), score: authority, ideal: 90 },
        { subject: t('assessment.dim_credibility'), score: credibility, ideal: 95 },
        { subject: t('assessment.dim_brandWeight'), score: brandWeight, ideal: 90 },
        { subject: t('assessment.dim_infoComplete'), score: infoComplete, ideal: 95 },
      ];
      
      const overallScore = Math.floor(mockData.reduce((acc, curr) => acc + curr.score, 0) / mockData.length);

      const result = {
        keyword,
        data: mockData,
        overallScore
      };

      localStorage.setItem(cacheKey, JSON.stringify(result));
      setAssessmentResult(result);
    } catch (err: any) {
      alert(err.message || t('assessment.api_error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 relative bg-transparent">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-brand-primary text-[9px] block mb-4 uppercase tracking-widest font-semibold"
          >
            {t('assessment.title_sub')}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 leading-tight text-brand-ink"
          >
            {t('assessment.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm md:text-base text-brand-ink/60 font-light max-w-2xl mx-auto"
          >
            {t('assessment.desc')}
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-xl rounded-[24px] sm:rounded-[32px] border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col min-h-[400px] relative px-4 py-8 sm:p-12 items-center justify-center"
        >
          <AnimatePresence mode="wait">
            {!assessmentResult && !isLoading && (
              <motion.div 
                key="input-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl flex flex-col items-center justify-center space-y-8"
              >
                <div className="w-16 h-16 rounded-full bg-brand-primary/20 flex items-center justify-center mb-4">
                  <Sparkles className="size-8 text-brand-primary" />
                </div>
                
                <h3 className="text-xl sm:text-2xl font-serif text-brand-ink">
                  {t('assessment.chat_terminal')}
                </h3>

                {/* Inspiration Chips */}
                <div className="flex flex-wrap justify-center gap-2 max-w-xl">
                  {[
                    t('assessment.suggestion_1'),
                    t('assessment.suggestion_2'),
                    t('assessment.suggestion_3')
                  ].map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(suggestion)}
                      className="text-[11px] sm:text-xs px-4 py-2 rounded-full border border-white/10 text-brand-ink/70 hover:bg-white/10 hover:text-brand-ink transition-colors cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>

                <form 
                  onSubmit={handleSubmit}
                  className="relative flex items-center w-full bg-white/5 rounded-full sm:rounded-2xl border border-white/10 shadow-sm focus-within:ring-2 focus-within:ring-brand-primary/50 focus-within:border-brand-primary transition-all overflow-hidden"
                >
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('assessment.chat_placeholder')}
                    className="flex-1 bg-transparent border-none py-4 sm:py-5 pl-6 pr-14 outline-none text-sm sm:text-base text-brand-ink placeholder:text-brand-ink/30"
                    disabled={isLoading}
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-brand-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-primary/90 transition-colors shadow-sm"
                  >
                    <Send size={18} className="ml-0.5" />
                  </button>
                </form>
                <div className="text-center">
                  <span className="text-[10px] text-brand-ink/40 uppercase tracking-widest font-mono">Powered by Doubao 2.0 API</span>
                </div>
              </motion.div>
            )}

            {isLoading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-brand-primary/20 flex items-center justify-center">
                  <Loader2 className="size-8 text-brand-primary animate-spin" />
                </div>
                <p className="text-brand-ink/60 tracking-widest text-sm uppercase animate-pulse">{t('assessment.running_analysis')}</p>
              </motion.div>
            )}

            {assessmentResult && !isLoading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full h-full flex flex-col items-center"
              >
                <div className="text-center mb-8">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif text-brand-ink mb-2">
                    {t('assessment.evaluation_complete')}
                  </h3>
                  <p className="text-brand-ink/60 text-sm">
                    {t('assessment.keyword')} <span className="text-brand-primary font-medium">{assessmentResult.keyword}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl">
                  {/* Left Column: Chart and Stats */}
                  <div className="flex flex-col items-center justify-center space-y-8 bg-white/5 p-8 rounded-3xl border border-white/5">
                    <div className="h-[300px] sm:h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={assessmentResult.data}>
                          <PolarGrid stroke="#ffffff" strokeOpacity={0.4} />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff', fontSize: 13, opacity: 1, fontWeight: 600 }} />
                          <PolarRadiusAxis 
                            angle={90} 
                            domain={[0, 100]} 
                            tick={{ fill: '#ffffff', opacity: 0.8, fontSize: 11, fontWeight: 700 }} 
                            tickCount={6} 
                            axisLine={true} 
                          />
                          <Radar
                            name={t('assessment.current_status')}
                            dataKey="score"
                            stroke="#00F0FF"
                            strokeWidth={4}
                            fill="#00F0FF"
                            fillOpacity={0.6}
                            dot={{ r: 5, fill: '#00F0FF', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 8, fill: '#fff', strokeWidth: 3, stroke: '#00F0FF' }}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid rgba(0,240,255,0.3)', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                            itemStyle={{ fontSize: '14px', fontWeight: 600, color: '#00F0FF' }}
                            labelStyle={{ color: '#94a3b8', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}
                          />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#fff', opacity: 0.8, paddingTop: '20px' }} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="text-center w-full">
                      <p className="text-brand-ink/80 text-lg leading-relaxed font-light mb-2">
                        {t('assessment.overall_index')}
                      </p>
                      <div className="flex items-end justify-center">
                        <span className={`text-6xl font-serif font-bold tracking-tighter ${assessmentResult.overallScore < 60 ? 'text-red-400' : 'text-brand-primary'}`}>
                          {assessmentResult.overallScore}
                        </span>
                        <span className="text-2xl text-brand-ink/40 ml-2 mb-2">/ 100</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Detailed Score Table */}
                  <div className="flex flex-col space-y-6 bg-white/5 p-8 rounded-3xl border border-white/5 h-full">
                     <h4 className="text-xl font-medium text-brand-ink flex items-center gap-2 mb-2">
                        <CheckCircle2 className="size-5 text-brand-primary" />
                        {t('assessment.score_detail')}
                     </h4>
                     
                     <div className="flex-1 overflow-hidden rounded-xl border border-white/10 bg-black/20">
                       <table className="w-full text-left text-sm whitespace-nowrap">
                         <thead className="bg-white/5 uppercase tracking-wider text-brand-ink/60 text-[11px]">
                           <tr>
                             <th className="px-6 py-4 font-medium">{t('assessment.dim_name')}</th>
                             <th className="px-6 py-4 font-medium text-right">{t('assessment.score')}</th>
                             <th className="px-6 py-4 font-medium text-center">{t('assessment.evaluation')}</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-white/10 text-brand-ink/90">
                           {assessmentResult.data.map((item, idx) => (
                             <tr key={idx} className="hover:bg-white/5 transition-colors">
                               <td className="px-6 py-4 font-medium">{item.subject}</td>
                               <td className={`px-6 py-4 text-right font-mono text-lg font-bold ${item.score < 60 ? 'text-red-400' : 'text-brand-primary'}`}>
                                 {item.score}
                               </td>
                               <td className="px-6 py-4 text-center">
                                 {item.score < 60 ? (
                                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                     {t('assessment.warn')}
                                   </span>
                                 ) : (
                                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                                     {t('assessment.excellent')}
                                   </span>
                                 )}
                               </td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </div>

                    <div className="bg-white/5 p-5 rounded-xl border border-white/5 backdrop-blur-sm mt-auto">
                      <p className="text-brand-ink/70 text-sm leading-relaxed italic">
                        {t('assessment.mock_feedback')}
                      </p>
                    </div>
                    
                     <button 
                       onClick={() => setAssessmentResult(null)}
                       className="w-full bg-brand-primary/10 hover:bg-brand-primary text-brand-ink hover:text-white border border-brand-primary/20 hover:border-brand-primary py-4 rounded-xl text-sm font-medium tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_-10px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_-5px_rgba(0,240,255,0.5)]"
                     >
                       {t('assessment.run_another')}
                     </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

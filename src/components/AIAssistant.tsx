import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { getHealthAdvice } from '../services/geminiService';
import Markdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const OFFLINE_KNOWLEDGE_BASE: Record<string, string> = {
  'default': '当前处于离线咨询模式。我是您的本地健康顾问。对于更深度的个人化分析，请在连接网络后再次咨询。您可以尝试询问：睡眠、饮食、运动、压力等关键词。',
  '睡眠': '### 关于睡眠与荷尔蒙\n优质睡眠是荷尔蒙平衡的基石。建议：\n1. **规律作息**：每晚 11 点前入睡，维持生物钟稳定。\n2. **黑暗环境**：促进褪黑素分泌，这对黄体酮平衡至11q要。\n3. **减少蓝光**：睡前 1 小时停止使用电子产品。',
  '饮食': '### 荷尔蒙友好饮食\n1. **优质蛋白**：每餐摄入足够的鱼、瘦肉或豆类。\n2. **健康脂肪**：牛油果、坚果和橄榄油可促进性激素合成。\n3. **升糖控制**：减少精制糖和白面粉，稳定胰岛素水平。',
  '运动': '### 运动建议\n1. **力量训练**：每周 2-3 次，有助于维持代谢率和胰岛素敏感性。\n2. **柔和运动**：经期建议进行瑜伽、拉伸或快走。\n3. **避免过度**：过高强度的运动可能引发皮质醇过载。',
  '压力': '### 压力管理\n长期高压力会消耗孕酮，导致“皮质醇盗取”。建议：\n1. **深呼吸训练**：每天三次，每次 5 分钟。\n2. **植物力量**：如南非醉茄等成分有助于平衡压力响应。',
  '痛经': '### 缓解经前不适\n1. **热敷**：促进盆腔血液循环。\n2. **镁元素**：有助于缓解平滑肌收缩。\n3. **抗炎饮食**：减少饱和脂肪，增加 Omega-3。',
  '皮肤': '### 荷尔蒙与肤质\n下巴周围的爆发往往与雄激素波动有关。建议关注肠道健康与糖分摄入，并保持充足水分。'
};

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: '您好！我是您的专属荷尔蒙健康顾问。有什么我可以帮您的吗？无论关于评估结果、产品建议还是生活方式调理，我都在这里。' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenChat);
  }, []);

  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getLocalResponse = (query: string): string => {
    const queryLower = query.toLowerCase();
    for (const key in OFFLINE_KNOWLEDGE_BASE) {
      if (queryLower.includes(key)) {
        return OFFLINE_KNOWLEDGE_BASE[key];
      }
    }
    return OFFLINE_KNOWLEDGE_BASE['default'];
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    if (!isOnline) {
      // Simulate small delay for local processing
      setTimeout(() => {
        const localReply = getLocalResponse(userMessage);
        setMessages(prev => [...prev, { role: 'model', content: `[离线模式] ${localReply}` }]);
        setIsLoading(false);
      }, 800);
      return;
    }

    try {
      // Map history for Gemini SDK
      const history = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));

      const response = await getHealthAdvice(userMessage, history);
      setMessages(prev => [...prev, { role: 'model', content: response || '握手协议超时，请重试。' }]);
    } catch (error) {
      // Fallback to local on API error
      const localReply = getLocalResponse(userMessage);
      setMessages(prev => [...prev, { role: 'model', content: `[网络连接异常，为您匹配本地专家建议] ${localReply}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[500] w-16 h-16 bg-brand-primary text-brand-paper rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group"
      >
        <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-2 -right-2 bg-brand-ink text-[10px] px-2 py-1 rounded-full animate-bounce">
          AI 咨询
        </div>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 sm:bottom-28 right-4 sm:right-8 z-[510] w-[calc(100vw-32px)] sm:w-[400px] h-[500px] sm:h-[600px] max-h-[calc(100vh-140px)] bg-brand-paper rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-brand-ink/5 overflow-hidden flex flex-col backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-6 bg-brand-primary text-brand-paper flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium">荷尔蒙智慧助手</h3>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-400' : 'bg-orange-400'} animate-pulse`} />
                    <p className="text-[10px] uppercase tracking-widest opacity-70">
                      {isOnline ? 'Active Online' : 'Expert Offline Mode'}
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:rotate-90 transition-transform"
              >
                <X size={24} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-brand-paper to-brand-primary/5"
            >
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-brand-primary text-brand-paper shadow-lg rounded-tr-none' 
                        : 'bg-white text-brand-ink shadow-sm border border-brand-ink/5 rounded-tl-none'
                    }`}
                  >
                    <div className="markdown-body">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white p-5 rounded-2xl shadow-md border border-brand-ink/5 flex flex-col gap-3 min-w-[140px]">
                    <div className="flex items-center gap-2">
                      <div className="size-1.5 rounded-full bg-brand-primary/40 animate-pulse" />
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-ink/30 italic">AI Analyzing</span>
                    </div>
                    <div className="flex gap-1.5 items-center px-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ 
                            y: [0, -4, 0],
                            opacity: [0.3, 1, 0.3]
                          }}
                          transition={{ 
                            duration: 1, 
                            repeat: Infinity, 
                            delay: i * 0.2,
                            ease: "easeInOut"
                          }}
                          className="size-1.5 rounded-full bg-brand-primary"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-brand-ink/5">
              <div className="flex gap-2 bg-brand-ink/5 p-2 rounded-2xl focus-within:ring-2 focus-within:ring-brand-primary transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="询问您的健康顾虑..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 bg-brand-primary text-brand-paper rounded-xl flex items-center justify-center hover:bg-brand-ink transition-colors disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[10px] text-center text-brand-ink/30 mt-3 uppercase tracking-widest">
                Professional Advice Driven by Gemini AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

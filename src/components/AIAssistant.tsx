import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { getHealthAdvice } from '../services/geminiService';
import Markdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: '您好！我是您的专属荷尔蒙健康顾问。有什么我可以帮您的吗？无论关于评估结果、产品建议还是生活方式调理，我都在这里。' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenChat);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userQuery = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setInput('');
    setIsLoading(true);

    try {
      if (!navigator.onLine) {
        throw new Error('网络连接中断，请检查您的网络设置。');
      }

      const history = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));

      const response = await getHealthAdvice(userQuery, history);
      if (!response) throw new Error('EMPTY_RESPONSE');
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (error: any) {
      // 尝试解析服务器返回的 JSON 错误
      let displayError = '抱歉，当前咨询服务暂时不可用。请检查您的服务器连接或稍后再试。';
      try {
        if (error.message.includes('{')) {
          const parsed = JSON.parse(error.message);
          displayError = parsed.error || displayError;
        } else {
          displayError = error.message;
        }
      } catch (e) {
        // 解析失败则使用 message 原文
      }

      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'model', 
          content: `${displayError}\n\n如需紧急咨询，请通过官网顶部联系【私人健康顾问】。` 
        }]);
        setIsLoading(false);
      }, 800);
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
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <p className="text-[10px] uppercase tracking-widest opacity-70">
                      Precision Health AI Active
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

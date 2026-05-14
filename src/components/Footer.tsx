import { Sparkles, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-ink text-brand-paper py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-brand-primary" />
              <span className="font-serif text-2xl font-semibold tracking-tight">荷尔蒙之衡</span>
            </div>
            <p className="text-brand-paper/50 max-w-sm leading-relaxed font-light">
              致力于通过科学的荷尔蒙调理方案，让每一位客户找回属于自己的黄金状态，重塑个人魅力，构建和谐家庭生活。
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">联系我们</h4>
            <ul className="space-y-4 text-sm text-brand-paper/50 font-light">
              <li className="flex items-center gap-3"><Mail size={16} /> contact@hormone.com</li>
              <li className="flex items-center gap-3"><Phone size={16} /> 400-888-9999</li>
              <li className="flex items-center gap-3"><MapPin size={16} /> 上海市静安区健康产业园 88 号</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">关注我们</h4>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-brand-ink transition-colors cursor-pointer">
                <span className="text-[10px] font-bold">小红书</span>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-brand-ink transition-colors cursor-pointer">
                <span className="text-[10px] font-bold">抖音</span>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-brand-ink transition-colors cursor-pointer">
                <span className="text-[10px] font-bold">公众号</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-brand-paper/30 font-medium">
          <p>© 2026 Hormone Harmony. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <span className="cursor-pointer hover:text-white transition-colors">隐私政策</span>
            <span className="cursor-pointer hover:text-white transition-colors">服务协议</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

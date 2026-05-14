import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Sparkles, Beaker, Zap, Shield, Heart, Globe, Droplets, Leaf, ArrowRight } from 'lucide-react';

const IngredientCard = ({ item, index }: { item: any, index: number }) => {
  const isEven = index % 2 === 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      className={`flex flex-col lg:flex-row gap-8 lg:gap-16 items-center mb-32 lg:mb-48 ${!isEven ? 'lg:flex-row-reverse' : ''}`}
    >
      <div className="w-full lg:w-1/2 relative group">
        <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl relative">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s] ease-out"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-ink/10 group-hover:bg-transparent transition-colors duration-1000" />
        </div>
        <div className={`absolute -bottom-8 ${isEven ? '-right-8' : '-left-8'} hidden lg:block`}>
          <div className="w-48 h-48 bg-brand-paper p-8 rounded-[32px] shadow-xl border border-brand-ink/5">
             <div className="text-brand-primary mb-4 p-3 bg-brand-primary/10 w-fit rounded-2xl">
               {item.icon}
             </div>
             <p className="text-[10px] uppercase tracking-widest text-brand-ink/40 font-medium">Element 0{index + 1}</p>
             <p className="font-serif italic text-lg leading-tight mt-1">{item.name}</p>
          </div>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 space-y-12 px-4 lg:px-0">
        <div className="space-y-6">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 60 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-[2px] bg-brand-primary"
          />
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-brand-primary text-xs font-medium uppercase tracking-[0.4em] block"
          >
            Ingredient Spotlight
          </motion.span>
          <motion.h3 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-4xl lg:text-7xl font-serif leading-[1.1] text-brand-ink"
          >
            {item.name.split(' & ').map((part: string, i: number) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="italic font-light opacity-50 block lg:inline"> & </span>}
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 + (i * 0.1) }}
                  className="inline-block"
                >
                  {part}
                </motion.span>
              </React.Fragment>
            ))}
          </motion.h3>
        </div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-brand-ink/50 text-lg lg:text-2xl font-light leading-relaxed max-w-xl"
        >
          {item.desc}
        </motion.p>
        
        <div className="flex flex-col gap-10">
          <div className="pt-4 flex items-center gap-6 text-[10px] uppercase tracking-widest font-bold text-brand-ink/20 border-t border-brand-ink/5 max-w-xs">
            <span>Purity: 99.9%</span>
            <div className="size-1 rounded-full bg-brand-ink/10" />
            <span>Bioavailability: Max</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ScientificSystem = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const liquidFocus = [
    { 
      name: "鱼胶原蛋白肽 & 三肽", 
      desc: "双重分子量梯度渗透，深层修护结缔组织。我们采用专利酶解技术，从深海三文鱼中精萃优质蛋白，将大分子精确切割至吸收极限，重塑紧致肌理。", 
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=1200",
      icon: <Droplets className="size-6" />
    },
    { 
      name: "白松露 & 白番茄", 
      desc: "极地美白因子与森林钻石的邂逅。富含稀有氨基酸与类胡萝卜素，由内而外阻断自由基与黑色素，焕发无瑕通透质感。", 
      image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&q=80&w=1200", 
      icon: <Sparkles className="size-6" />
    },
    { 
      name: "PQQ & 酵母葡聚糖", 
      desc: "细胞级修护枢纽。PQQ赋能线粒体再生，结合葡聚糖免疫激活系统，在机体内部构建坚固的抗衰老防御森林。", 
      image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200", 
      icon: <Zap className="size-6" />
    }
  ];

  const otherIngredients = [
    { name: "透明质酸钠", cat: "Hydration", icon: <Droplets className="size-4" /> },
    { name: "N-乙酰神经氨酸", cat: "Vitality", icon: <Heart className="size-4" /> },
    { name: "血橙 & 葡萄籽", cat: "Defense", icon: <Shield className="size-4" /> },
    { name: "牡丹肽 & 玫瑰", cat: "Balance", icon: <Leaf className="size-4" /> },
  ];

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const smoothBackgroundY = useSpring(backgroundY, { stiffness: 100, damping: 30 });

  return (
    <div ref={containerRef} className="min-h-screen bg-brand-paper py-32 lg:py-48 px-4 relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(var(--color-brand-primary-rgb),0.03),transparent)]">
      
      {/* Background Micro-elements */}
      <motion.div 
        style={{ y: smoothBackgroundY }}
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-50"
      >
        <div className="absolute top-[20%] left-[5%] text-[20vw] font-serif italic text-brand-ink/[0.03] select-none uppercase">Purity</div>
        <div className="absolute top-[60%] right-[5%] text-[20vw] font-serif italic text-brand-ink/[0.03] select-none uppercase">Science</div>
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10 px-4">
        {/* Editorial Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-48 lg:mb-72 items-end">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-brand-primary text-xs font-medium uppercase tracking-[0.6em] mb-12 block">The Scientific Dossier</span>
              <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-serif text-brand-ink leading-[0.9] tracking-tighter mb-12">
                内外<br />
                <span className="italic font-light opacity-50">共振</span>的<br />
                生命节律
              </h2>
            </motion.div>
          </div>
          <div className="lg:col-span-4 lg:mb-12">
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.2 }}
              className="text-brand-ink/50 text-xl font-light leading-relaxed border-l-2 border-brand-primary pl-8"
            >
              极致配方是对生命的最高敬畏。我们整合全球尖端生物资源，在每一毫升液体中编织出精准的生命律动蓝图。
            </motion.p>
          </div>
        </div>

        {/* Feature Image Grid */}
        <div className="mb-48 lg:mb-72">
          {liquidFocus.map((item, idx) => (
            <IngredientCard key={idx} item={item} index={idx} />
          ))}
        </div>

        {/* Secondary Ingredients - Bento style */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-48 lg:mb-72">
          <div className="lg:col-span-4 space-y-8">
            <h3 className="text-3xl font-serif italic text-brand-primary leading-tight">
              Complementary<br />Synergy
            </h3>
            <p className="text-brand-ink/40 font-light leading-relaxed text-lg">
              不仅仅是单一补充，而是全方位协同。这些微量却关键的成分，如交响乐中的余韵，补全了机体平衡的最后一块拼图。
            </p>
          </div>
          
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherIngredients.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  className="p-10 rounded-[32px] bg-brand-ink/[0.02] border border-brand-ink/5 flex items-center justify-between group transition-all duration-500"
                >
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-brand-primary mb-1 block">{item.cat}</span>
                    <h4 className="text-xl font-medium text-brand-ink">{item.name}</h4>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-brand-ink/10 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
                    {item.icon}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Brand Philosophy - Asymmetrical Layout */}
        <div className="relative mb-32 lg:mb-48">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="lg:col-span-6 relative z-0"
            >
              <div className="aspect-square lg:aspect-[4/5] rounded-[60px] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1200" 
                  alt="Scientific Purity" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="lg:col-span-7 lg:-ml-24 bg-brand-ink text-brand-paper p-12 lg:p-24 rounded-[60px] relative z-10 shadow-3xl space-y-12"
            >
              <div className="w-16 h-1 bg-brand-primary" />
              <h3 className="text-4xl lg:text-7xl font-serif leading-tight italic">
                “我们精研的不仅是营养方案，更是对机体的一种‘深度沟通’。”
              </h3>
              <p className="text-brand-paper/50 text-lg lg:text-2xl font-light leading-relaxed">
                在荷尔蒙之衡，研发不只是实验数据的叠加。它是对生命复杂性的敬畏，是将每一个分子置于正确的律动点。
              </p>
              
              <div className="flex flex-wrap gap-8 pt-12 border-t border-brand-paper/10">
                <div className="space-y-2">
                   <span className="text-brand-primary text-[10px] uppercase tracking-widest font-bold">Research</span>
                   <p className="text-lg">Global Synergy</p>
                </div>
                <div className="space-y-2">
                   <span className="text-brand-primary text-[10px] uppercase tracking-widest font-bold">Advanced</span>
                   <p className="text-lg">Bio-Tech Lab</p>
                </div>
                <div className="space-y-2">
                   <span className="text-brand-primary text-[10px] uppercase tracking-widest font-bold">Traceable</span>
                   <p className="text-lg">Source Origin</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-32">
          {[
            { label: "Active Ingredients", val: "12+", sub: "Synergistic Profile" },
            { label: "Extraction Rate", val: "98.5%", sub: "Micron-level Tech" },
            { label: "Clinical Tests", val: "2400+", sub: "Participant Data" },
            { label: "Global Source", val: "15", sub: "Regional Origins" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[40px] bg-white border border-brand-ink/5 flex flex-col items-center text-center hover:bg-brand-paper transition-colors cursor-default"
            >
              <span className="text-[10px] uppercase tracking-widest text-brand-ink/30 mb-4">{item.label}</span>
              <span className="text-5xl font-serif text-brand-ink mb-2">{item.val}</span>
              <span className="text-xs font-light text-brand-ink/40 tracking-tight">{item.sub}</span>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ScientificSystem;

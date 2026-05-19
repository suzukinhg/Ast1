import { motion } from 'motion/react';
import { ArrowLeft, Download, ScanLine } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface OfflineQRGeneratorProps {
  onBack: () => void;
}

export default function OfflineQRGenerator({ onBack }: OfflineQRGeneratorProps) {
  const qrUrl = typeof window !== 'undefined' ? `${window.location.origin}/?vip=1` : '';

  const downloadQR = () => {
    const svg = document.getElementById("vip-qrcode");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      // Add padding
      const padding = 20;
      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding * 2;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, padding, padding);
      }
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "Astcare_VIP_QRCode.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-brand-paper relative selection:bg-brand-primary selection:text-white flex flex-col items-center justify-center p-6"
    >
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 sm:top-12 sm:left-12 flex items-center gap-2 text-brand-ink/60 hover:text-brand-primary transition-colors z-10"
      >
        <ArrowLeft size={20} />
        <span className="text-sm tracking-widest uppercase font-brand-en">返回 / Back</span>
      </button>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-[32px] p-10 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-2 bg-brand-primary" />
          
          <div className="flex justify-center mb-6 text-brand-paper">
            <ScanLine size={40} />
          </div>
          
          <h2 className="text-2xl font-serif text-brand-paper mb-2">
            线下专属二维码
          </h2>
          <p className="text-brand-paper/60 text-sm mb-8">
            下载此二维码供线下客户扫码进入隐藏页面
          </p>

          <div className="flex justify-center mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <QRCodeSVG 
              id="vip-qrcode"
              value={qrUrl} 
              size={200}
              level="H"
              fgColor="#1A1A1C"
              bgColor="transparent"
            />
          </div>

          <button
            onClick={downloadQR}
            className="w-full flex justify-center items-center gap-2 bg-brand-primary text-white py-4 rounded-full font-medium hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/30"
          >
            <Download size={18} />
            保存二维码 PNG
          </button>
        </div>
      </div>
    </motion.div>
  );
}

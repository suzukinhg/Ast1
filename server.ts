import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for AI Chat
  app.post("/api/chat", async (req, res) => {
    const { prompt, history } = req.body;

    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey || apiKey === "undefined") {
      console.error("Server Error: DEEPSEEK_API_KEY is missing or undefined");
      return res.status(500).json({ error: "服务器未配置 DeepSeek API 密钥，请在后台 Secrets 中填写。" });
    }

    // 安全地记录当前使用的 Key 指纹
    const keyFingerprint = `${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)}`;
    console.log(`[DeepSeek Chat] Using key: ${keyFingerprint}`);

    try {
      // Prepare messages (OpenAI format)
      const messages: any[] = [
        {
          role: "system",
          content: `你是一位专业的荷尔蒙健康与女性生理平衡专家。你的目标是为用户提供科学、客观、温和且具有实用价值的健康建议。
要求：
1. 始终保持专业且关怀的语气。
2. 建议应基于科学原理，涵盖饮食、运动、生活方式和营养补充建议。
3. 如果用户描述了严重症状，请务必提醒他们咨询专业医生。
4. 回答要简洁明了，多用列表和清晰的段落。
5. 专注于“荷尔蒙之衡”品牌的核心理念：平衡、新生、魅力。
6. 严禁讨论政治、色情、违法等无关内容。`
        }
      ];

      // Convert history from Gemini format to OpenAI format
      if (history && Array.isArray(history)) {
        history.forEach((item: any) => {
          messages.push({
            role: item.role === 'model' ? 'assistant' : 'user',
            content: item.parts[0].text
          });
        });
      }

      // Add current prompt
      messages.push({ role: "user", content: prompt });

      // 调用指定的 API 地址
      const response = await fetch('https://astcare.vip/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: messages,
          temperature: 0.2,
          max_tokens: 128,
          stream: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[API Error] Status: ${response.status}, Body: ${errorText}`);
        return res.status(response.status).json({ 
          error: `API 响应异常 (${response.status})`,
          detail: errorText
        });
      }

      const data: any = await response.json();
      
      // 兼容 OpenAI 格式的返回
      const aiText = data.choices?.[0]?.message?.content || data.content || "未获取到有效响应";
      res.json({ text: aiText });

    } catch (error: any) {
      console.error("API Connection Error:", error?.message || error);
      res.status(500).json({ error: "无法连接到 AI 服务接口，请检查网络连接或 API 状态。" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

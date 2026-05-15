import { GoogleGenAI } from "@google/genai";

const aiClient: { instance: GoogleGenAI | null } = { instance: null };

function getAI() {
  if (!aiClient.instance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'undefined' || key === '') {
      throw new Error("API Key missing. Please configure GEMINI_API_KEY.");
    }
    aiClient.instance = new GoogleGenAI({ apiKey: key });
  }
  return aiClient.instance;
}

export async function getHealthAdvice(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  try {
    const ai = getAI();
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `你是一位专业的荷尔蒙健康与女性生理平衡专家。你的目标是为用户提供科学、客观、温和且具有实用价值的健康建议。
要求：
1. 始终保持专业且关怀的语气。
2. 建议应基于科学原理，涵盖饮食、运动、生活方式和营养补充建议。
3. 如果用户描述了严重症状，请务必提醒他们咨询专业医生。
4. 回答要简洁明了，多用列表和清晰的段落。
5. 专注于“荷尔蒙之衡”品牌的核心理念：平衡、新生、魅力。
6. 严禁讨论政治、色情、违法等无关内容。`,
      },
      history: history.length > 0 ? history : undefined,
    });

    const response = await chat.sendMessage({ message: prompt });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("无法连接到AI助手，请稍后再试。");
  }
}

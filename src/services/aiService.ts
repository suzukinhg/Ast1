export async function getHealthAdvice(prompt: string, history: any[] = []) {
  try {
    // 根据用户要求，直接在前端嵌入调用逻辑以确保部署后可用
    // 注意：在正式生产环境建议通过后端中转以保护 API Key
    const apiKey = "sk-b30091d320004f0c973ab1f0735e2546";
    const apiUrl = "https://astcare.vip/api/v1/chat/completions";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-v4-flash",
        messages: [
          { role: "system", content: "你是一位专业的荷尔蒙健康与女性生理平衡专家。请提供科学、简洁的建议。" },
          ...history.map(h => ({
            role: h.role === 'model' ? 'assistant' : 'user',
            content: h.parts[0].text
          })),
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 128,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek API Error:", errorText);
      throw new Error(`请求失败: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("调用失败：", error);
    throw new Error("请求出错，请稍后再试");
  }
}

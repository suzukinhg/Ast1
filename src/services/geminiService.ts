export async function getHealthAdvice(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, history }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get response from server');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Chat Proxy Error:", error);
    throw new Error("无法连接到AI助手，请稍后再试。");
  }
}

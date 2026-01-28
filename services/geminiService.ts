import { GoogleGenAI } from "@google/genai";

// Safety check: Ensure process is defined before accessing it to prevent white-screen crashes in browser
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY || '';
    }
  } catch (e) {
    console.warn("Environment variable access failed, using empty key.");
  }
  return '';
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

export const askGeminiAssistant = async (prompt: string, contextData: string) => {
  if (!apiKey) {
    return "API Key tidak ditemukan atau tidak terkonfigurasi. Pastikan environment variable API_KEY sudah diset.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Context: You are an expert Industrial Generator Mechanic specialized in 150 kVA diesel gensets.
        Current Log Data Context: ${contextData}
        
        User Question: ${prompt}
        
        Answer concisely in Indonesian language. Focus on safety, technical accuracy, and preventive maintenance. 
        If the values in the context look dangerous (e.g. Water Temp > 95C, Oil Pressure < 2 Bar), warn the user immediately.
      `,
      config: {
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Maaf, terjadi kesalahan saat menghubungi asisten AI. Silakan coba lagi nanti.";
  }
};
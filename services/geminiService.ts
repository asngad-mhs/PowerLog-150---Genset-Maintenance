import { GoogleGenAI } from "@google/genai";

export const askGeminiAssistant = async (prompt: string, contextData: string) => {
  // Safe access to API Key to prevent crash in browsers where process is undefined
  let apiKey = '';
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      apiKey = process.env.API_KEY;
    }
  } catch (e) {
    console.warn("Could not access process.env.API_KEY");
  }

  // Handle missing key gracefully without crashing the entire app
  if (!apiKey) {
    return "API Key tidak ditemukan. Pastikan konfigurasi environment variable (API_KEY) sudah benar.";
  }

  try {
    // Initialize here (Lazy Initialization) to avoid top-level load crashes
    const ai = new GoogleGenAI({ apiKey });

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
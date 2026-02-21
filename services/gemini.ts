
import { GoogleGenAI } from "@google/genai";

export async function getCreepyTechTip(part: string): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a corrupted AI assistant in a haunted computer academy. 
      The user just correctly answered a question about the computer part: "${part}". 
      Give them a short, unsettling, but technically accurate "Tech Tip" (max 20 words). 
      Mix technical hardware knowledge with horror themes (e.g., the CPU is a brain that never sleeps, or the PSU thirsts for voltage).
      Do not use emojis. Use all caps for emphasis on certain words.`,
      config: {
        temperature: 0.9,
        topP: 0.95,
        maxOutputTokens: 60,
      }
    });
    
    return response.text?.trim() || "SYSTEM_STABLE_FOR_NOW...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "DATA_CORRUPTION_DETECTED_IN_SECTOR_7...";
  }
}

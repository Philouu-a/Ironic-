import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse } from "../types.ts";

export const fetchIronicMantras = async (): Promise<GeminiResponse | null> => {
  const apiKey = process.env.API_KEY;
  
  // Si aucune clé n'est fournie (déploiement statique classique), on ne tente pas l'appel
  if (!apiKey || apiKey === "") {
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate 12 ironic, sassy, or slightly dark motivational mantras. Each should be short (1-2 sentences). Also include a fake or funny author name for each.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mantras: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  backText: { type: Type.STRING },
                  author: { type: Type.STRING }
                },
                required: ["backText", "author"]
              }
            }
          },
          required: ["mantras"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim()) as GeminiResponse;
    }
    return null;
  } catch (error) {
    console.error("Gemini Service Error:", error);
    return null;
  }
};
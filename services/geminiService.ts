import { GoogleGenAI, Type } from "@google/genai";
import { TarotAnalysis, Language } from "../types";

const getSystemInstruction = (language: Language) => `
You are a Jungian psychologist and Tarot master. Analyze the user's state of mind described in the input.
You must return a JSON object containing:
1. "card_name": The name of a Tarot card that best represents the archetype of their situation (in ${language === 'ru' ? 'Russian' : 'English'}).
2. "interpretation": A psychological analysis (300-400 characters) written from the perspective of a wise mentor (in ${language === 'ru' ? 'Russian' : 'English'}).
3. "image_prompt": A detailed English prompt for AI image generation. The style must be: surrealism, abstract, mystical, dark gold colors, psychological portrait. NOTE: This prompt must ALWAYS be in English, regardless of the user's language.
`;

/**
 * Safely initialize the Gemini Client on demand.
 * This prevents the app from crashing on load if the key is missing.
 */
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("System Error: API Key is missing. Please configure the environment.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Step 1: Analyze text and determine the Tarot card and prompt.
 */
export const analyzeText = async (userInput: string, language: Language): Promise<TarotAnalysis> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userInput,
      config: {
        systemInstruction: getSystemInstruction(language),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            card_name: { type: Type.STRING },
            interpretation: { type: Type.STRING },
            image_prompt: { type: Type.STRING },
          },
          required: ["card_name", "interpretation", "image_prompt"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini Text Model");
    
    return JSON.parse(text) as TarotAnalysis;
  } catch (error: any) {
    console.error("Text Analysis Error:", error);
    throw new Error(error.message || "Failed to analyze the spirit path.");
  }
};

/**
 * Step 2: Generate the visual representation using the prompt.
 * Using Gemini 3 Pro Image Preview for high-quality surrealist art.
 */
export const generateTarotImage = async (prompt: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4",
          imageSize: "1K"
        }
      }
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data returned from Gemini.");
  } catch (error: any) {
    console.error("Image Generation Error:", error);
    throw new Error(error.message || "Failed to manifest the vision.");
  }
};
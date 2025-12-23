
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { DetectedObject } from "../types";
import { SYSTEM_PROMPT } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async detectObjects(base64Image: string): Promise<DetectedObject[]> {
    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              { text: SYSTEM_PROMPT },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: base64Image
                }
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                brand: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                boundingBox: {
                  type: Type.ARRAY,
                  items: { type: Type.NUMBER }
                }
              },
              required: ["name", "brand", "confidence", "boundingBox"]
            }
          }
        }
      });

      const text = response.text;
      if (!text) return [];

      const parsed: any[] = JSON.parse(text);
      return parsed.map((item, idx) => ({
        id: `obj-${Date.now()}-${idx}`,
        name: item.name,
        brand: item.brand,
        confidence: item.confidence,
        boundingBox: item.boundingBox,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error("Gemini Detection Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();

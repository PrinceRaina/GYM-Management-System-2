import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getHealthAdvice(userProfile: any, query: string) {
  const model = "gemini-3-flash-preview";
  const systemInstruction = `
    You are an AI Health & Fitness Coach named ZenBot. 
    You are part of ZenFit, a gym management and wellness app.
    User Profile: ${JSON.stringify(userProfile)}
    Provide professional, encouraging, and science-based fitness and nutrition advice.
    Keep responses concise and formatted with markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: query,
      config: { systemInstruction },
    });
    return response.text;
  } catch (error) {
    console.error("AI Advice Error:", error);
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later!";
  }
}

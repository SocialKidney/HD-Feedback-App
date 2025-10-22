import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeConversation = async (chatHistory: ChatMessage[]): Promise<string> => {
    if (chatHistory.length === 0) {
        return "No feedback was provided during the session.";
    }

    const feedbackForSummary = chatHistory.map(msg => `- ${msg.content}`).join('\n');
    
    const prompt = `Your task is to analyze a list of user-submitted feedback points about workflow issues and extract ONLY the problems and pain points.

- Do NOT suggest solutions, improvements, or next steps.
- Do NOT add any introductory or concluding sentences.
- The output must be a simple, concise bulleted list.
- Each bullet point should directly state a pain point identified by the user in their feedback.

User Feedback:
---
${feedbackForSummary}
---

Pain Points Identified:`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
    });
    return response.text;
};
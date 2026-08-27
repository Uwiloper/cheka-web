// src/pages/api/chat.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import chatConfig from '../../data/chatbot.json';

export const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const userMessage = body.message;

    // 1. Validar que la API KEY exista
    const apiKey = import.meta.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Falta la GEMINI_API_KEY en el archivo .env");
      return new Response(JSON.stringify({ error: "Falta API Key" }), { status: 500 });
    }

    // 2. Construir el Prompt dinámico basado en tu JSON
    const { ai } = chatConfig;
    const systemPrompt = `
      CONTEXTO: ${ai.systemContext}
      REGLAS: ${ai.rules.join(" ")}
      MENSAJE DE FALLO (Si no sabes algo): ${ai.contactFallback}
    `;

    // 3. Consultar a Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest", // <-- Gemini 1.5 flash ultima version 
      systemInstruction: systemPrompt
    });

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ reply: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error en Chatbot (Revisa tu terminal):", error);
    return new Response(JSON.stringify({ error: "Error interno" }), { status: 500 });
  }
}
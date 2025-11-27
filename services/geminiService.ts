import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ProductInfo, GeneratedContent } from "../types";
import { SYSTEM_PROMPT_TEMPLATE } from "../constants";

// Initialize the API client
// Note: In a production environment, ensure process.env.API_KEY is set.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Extracts product title and description from a Shopee URL using Google Search Grounding.
 * Note: When using tools like googleSearch, we cannot use responseMimeType: 'application/json' or responseSchema.
 * We must rely on the prompt to request JSON and parse it manually.
 */
export const extractProductInfo = async (url: string): Promise<ProductInfo> => {
  try {
    const modelId = "gemini-2.5-flash"; // Good balance of speed and search capability
    
    const prompt = `
      Analise este link da Shopee: ${url}
      
      Sua tarefa é identificar qual é o PRODUTO principal.
      
      Se não conseguir acessar o link diretamente, use a busca do Google para encontrar informações sobre o produto baseado na URL.

      Retorne APENAS um JSON válido (sem markdown, sem explicações extras) com o seguinte formato:
      {
        "title": "Nome comercial do produto",
        "description": "Descrição resumida do que o produto faz, suas principais funções e benefícios."
      }
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType and responseSchema are NOT allowed when using tools
      },
    });

    let text = response.text;
    if (!text) throw new Error("No response from AI");

    // Clean up markdown code blocks if present (e.g. ```json ... ```)
    text = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '').trim();

    const data = JSON.parse(text) as ProductInfo;
    return data;
  } catch (error) {
    console.error("Extraction error:", error);
    throw new Error("Falha ao extrair informações do produto. Tente preencher manualmente.");
  }
};

/**
 * Generates captions, hashtags, and titles based on the inputs.
 * Uses strict JSON schema enforcement since no tools are used here.
 */
export const generateSocialContent = async (
  info: ProductInfo,
  timeInSeconds: number
): Promise<GeneratedContent> => {
  try {
    const modelId = "gemini-2.5-flash"; 

    // Inject values into the template
    const filledPrompt = SYSTEM_PROMPT_TEMPLATE
      .replace("{{TITLE}}", info.title)
      .replace("{{DESCRIPTION}}", info.description)
      .replace("{{TIME}}", timeInSeconds.toString());

    const response = await ai.models.generateContent({
      model: modelId,
      contents: filledPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            captions: {
              type: Type.OBJECT,
              properties: {
                option1: { type: Type.STRING },
                option2: { type: Type.STRING },
                option3: { type: Type.STRING },
                bestOption: { type: Type.STRING },
                reason: { type: Type.STRING },
              },
            },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            titles: {
              type: Type.OBJECT,
              properties: {
                option1: { type: Type.STRING },
                option2: { type: Type.STRING },
                option3: { type: Type.STRING },
                bestOption: { type: Type.STRING },
                reason: { type: Type.STRING },
              },
            },
          },
        } as Schema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No content generated");

    return JSON.parse(text) as GeneratedContent;
  } catch (error) {
    console.error("Generation error:", error);
    throw new Error("Falha ao gerar o conteúdo criativo.");
  }
};
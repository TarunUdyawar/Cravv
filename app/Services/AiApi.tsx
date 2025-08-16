import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import {GoogleGenAI, GeneratedImage, PersonGeneration} from '@google/genai';
// API keys (Move to env for security)
const apiKey = "AIzaSyASPCHFCyZN6DqYQ4KZnEiKwzzb_QCP76k";
const imageApiKey = "50578cd9-5817-48e5-943c-33a3475fcaba";
import OpenAI from "openai";
import { usePollinationsImage } from '@pollinations/react';

const genAI = new GoogleGenerativeAI(apiKey);

const defaultModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * Run a prompt with Gemini
 */
export async function run(prompt: string, options: Partial<any> = {}) {
  const generationConfig = {
    temperature: options.temperature ?? 0.5, // lower temp for JSON stability
    topP: 0.9,
    topK: 40,
    maxOutputTokens: options.maxOutputTokens ?? 800, // dynamically changeable
  };

  try {
    const result = await defaultModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    return result.response.text();
  } catch (error) {
    console.error("AI Error:", error);
    return null;
  }
}

/**
 * Safely parse AI's JSON response
 */
export function parseJsonSafely(text: string) {
  if (!text) return null;
  try {
    return JSON.parse(text.trim());
  } catch {
    // Try to extract JSON from extra text
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}


// export const generateAiImage = async (imagePrompt:string) => {
//   const BASE_URL = "https://aigurulab.tech";
//   const result = await axios.post(
//     BASE_URL + "/api/generate-image",
//     {
//       width: 1024,
//       height: 1024,
//       input: imagePrompt,
//       model: "flux", 

//     },
//     {
//       headers: {
//         "x-api-key": process.env.AI_IMAGE_API, 
//         "Content-Type": "application/json",
//       },
//     }
//   );
//   return result.data.image
// };

const client = new OpenAI({
  apiKey: "ddc-a4f-bd6aa820871b47ac8743344baf49ae00",
  baseURL: "https://api.a4f.co/v1",
    dangerouslyAllowBrowser: true,
});



export const GenerateAiImage = (promptImage: string) => {
  const imageUrl = usePollinationsImage(promptImage, {
    width: 1024,
    height: 1024,
    seed: 42,
    model: "flux",
  });

  return imageUrl;
};



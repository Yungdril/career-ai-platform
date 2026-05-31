import Groq from "groq-sdk";

const groqApiKey = process.env.GROQ_API_KEY;

let groqClient: Groq | null = null;

export function getGroqClient(): Groq {
  if (!groqClient) {
    if (!groqApiKey) {
      throw new Error("GROQ_API_KEY environment variable is not set");
    }
    groqClient = new Groq({ apiKey: groqApiKey });
  }
  return groqClient;
}

export interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Call Groq API for fast, real-time responses
 * Great for interview questions, quick suggestions, and real-time feedback
 */
export async function invokeGroq(options: {
  messages: GroqMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
}): Promise<string> {
  const client = getGroqClient();

  const response = await client.chat.completions.create({
    model: options.model || "llama-3.3-70b-versatile", // Fast, powerful model
    messages: options.messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.max_tokens ?? 1024,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from Groq API");
  }

  return content;
}

/**
 * Call Groq API with JSON response format
 * Useful for structured data like interview questions
 */
export async function invokeGroqJSON<T>(options: {
  messages: GroqMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
}): Promise<T> {
  const client = getGroqClient();

  const response = await client.chat.completions.create({
    model: options.model || "llama-3.3-70b-versatile",
    messages: options.messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.max_tokens ?? 2048,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from Groq API");
  }

  try {
    return JSON.parse(content) as T;
  } catch (error) {
    throw new Error(`Failed to parse Groq JSON response: ${content}`);
  }
}

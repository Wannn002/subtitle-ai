import { GoogleGenerativeAI } from '@google/genai';

// Get your API key from Google AI Studio and set it as an environment variable
const VITE_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!VITE_GEMINI_API_KEY) {
  throw new Error('Missing VITE_GEMINI_API_KEY environment variable. Please set it in your .env file.');
}

const genAI = new GoogleGenerativeAI(VITE_GEMINI_API_KEY);

export async function generateText(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error('Error generating text from Gemini:', error);
    throw new Error('Failed to generate text from Gemini API.');
  }
}

// Example of how to use the function (optional, for testing)
/*
async function main() {
  try {
    const text = await generateText("Write a story about a magic backpack.");
    console.log(text);
  } catch (e) {
    console.error(e);
  }
}

main();
*/
// src/aiProcessor.ts...
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

//const endpoint = process.env.AZURE_OPENAI_ENDPOINT!;
const key = process.env.AZURE_OPENAI_KEY!;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT!;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-05-01-preview"; // latest GA
//const fullEndpoint = endpoint.endsWith('/') ? endpoint : endpoint + '/';
const rawEndpoint = process.env.AZURE_OPENAI_ENDPOINT!;
if (!rawEndpoint) {
    throw new Error("❌ Missing AZURE_OPENAI_ENDPOINT in .env");
  }
const endpoint = rawEndpoint.endsWith('/') ? rawEndpoint : rawEndpoint + '/';

export async function extractPainPoints(feedback: { title: string; text: string }[]): Promise<string[]> {
  const messages = [
    {
      role: "system",
      content: "You are a helpful AI assistant helping the Microsoft Teams Platform team extract key developer pain points. Only return clear, concise bullet points of issues."
    },
    {
      role: "user",
      content: `Please analyze and extract the main pain points from the following feedback:\n\n${feedback.map(f => `Title: ${f.title}\nText: ${f.text}`).join('\n\n')}`
    }
  ];

  try {
    const response = await axios.post(
      `${endpoint}openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`,
      {
        messages,
        temperature: 0.3,
        max_tokens: 800,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': key
        }
      }
    );

    const result = response.data.choices[0].message.content;
    console.log("🔍 Raw GPT Output:\n", result);
    return result
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line && !line.toLowerCase().startsWith("pain points:"));
  } catch (error: any) {
    console.error("🛑 AI extraction failed:", error.response?.data || error.message);
    return ["⚠️ Failed to extract pain points."];
  }
}

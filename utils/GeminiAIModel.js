import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Gemini API key is not set in NEXT_PUBLIC_GEMINI_API_KEY or GEMINI_API_KEY");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Use a broadly supported v1beta text model; adjust according to your project access.
const model = genAI.getGenerativeModel({
  model: "gemini-flash-latest",
});

const generationConfig = {
  temperature: 0.9,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 2048,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW,
  },
];

// Single chat session instance used by components via `chatSession.sendMessage(...)`.
export const chatSession = model.startChat({
  generationConfig,
  safetySettings,
});

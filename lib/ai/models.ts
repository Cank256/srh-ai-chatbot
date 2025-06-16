import { google } from '@ai-sdk/google';

export const DEFAULT_CHAT_MODEL: string = 'gemini-2.0-flash-001';

export const myProvider = google;

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'primary-model',
    name: 'SRH AI Chatbot',
    description: 'The SRH AI Chatbot model for Uganda.',
  },
];

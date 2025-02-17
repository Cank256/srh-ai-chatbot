import { google } from '@ai-sdk/google';
import { customProvider } from 'ai';

export const DEFAULT_CHAT_MODEL: string = 'gemini-2';

export const myProvider = customProvider({
  languageModels: {
    'primary': google('gemini-2.0-flash-001'),
    'title-model': google('gemini-2.0-flash-001'),
  },
});

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'primary',
    name: 'SRH AI Chatbot',
    description: 'The SRH AI Chatbot model for Uganda.',
  },
];

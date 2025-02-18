import { google } from '@ai-sdk/google';
import { customProvider } from 'ai';

export const DEFAULT_CHAT_MODEL: string = 'primary-model';

export const myProvider = customProvider({
  languageModels: {
    'primary-model': google('gemini-2.0-flash-001'),
  },
});

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

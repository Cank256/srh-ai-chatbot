// import { openai } from '@ai-sdk/openai';
import { fireworks } from '@ai-sdk/fireworks';
import { google } from '@ai-sdk/google';
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';

export const DEFAULT_CHAT_MODEL: string = 'google-chat-small';

export const myProvider = customProvider({
  languageModels: {
    // 'chat-model-small': openai('gpt-4o-mini'),
    // 'chat-model-large': openai('gpt-4o'),
    'chat-model-reasoning': wrapLanguageModel({
      model: fireworks('accounts/fireworks/models/deepseek-r1'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    // 'title-model': openai('gpt-4-turbo'),
    // 'artifact-model': openai('gpt-4o-mini'),

    // Google AI models
    'google-chat-small': google('gemini-1-flash'),
    'google-chat-large': google('gemini-1-pro'),
    'google-chat-advanced': google('gemini-1.5-pro'),
  },
  imageModels: {
    // 'small-model': openai.image('dall-e-2'),
    // 'large-model': openai.image('dall-e-3'),
  },
});

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  // {
  //   id: 'chat-model-small',
  //   name: 'Small model',
  //   description: 'Small model for fast, lightweight tasks',
  // },
  // {
  //   id: 'chat-model-large',
  //   name: 'Large model',
  //   description: 'Large model for complex, multi-step tasks',
  // },
  {
    id: 'chat-model-reasoning',
    name: 'Reasoning model',
    description: 'Uses advanced reasoning',
  },
  {
    id: 'google-chat-small',
    name: 'Google Small',
    description: 'Google Gemini 1 Flash for fast, lightweight tasks',
  },
  {
    id: 'google-chat-large',
    name: 'Google Large',
    description: 'Google Gemini 1 Pro for advanced multi-step reasoning',
  },
  {
    id: 'google-chat-advanced',
    name: 'Google Advanced',
    description: 'Google Gemini 1.5 Pro for high-level reasoning',
  },
];

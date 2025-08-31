import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI, google } from '@ai-sdk/google';
import { getActiveAiModel, getSystemSettings } from '@/lib/db/queries';

export const chatModels = [
  {
    name: 'gemini-2.0-flash-001',
    label: 'Gemini 2.0 Flash',
    provider: 'google',
    default: true,
  },
];

export async function getDefaultChatModel() {
  try {
    const settings = await getSystemSettings();
    const defaultModelSetting = settings.find(setting => setting.key === 'default_model');
    
    if (defaultModelSetting && defaultModelSetting.value) {
      return defaultModelSetting.value;
    }
    
    // Fallback to hardcoded default if no setting found
    console.warn('No default_model setting found in database, using fallback');
    return 'gemini-2.0-flash-001';
  } catch (error) {
    console.error('Error fetching default model from database:', error);
    // Fallback to hardcoded default on error
    return 'gemini-2.0-flash-001';
  }
}

// Simple decryption function (in production, use proper decryption)
function decryptApiKey(encryptedKey: string): string {
  try {
    return Buffer.from(encryptedKey, 'base64').toString();
  } catch {
    throw new Error('Failed to decrypt API key');
  }
}

export async function getActiveModel() {
  try {
    const activeModel = await getActiveAiModel();
    if (!activeModel) {
      console.warn('No active AI model found, falling back to default model');
      return google('gemini-2.0-flash-001');
    }

    const provider = activeModel.provider;
    const decryptedApiKey = decryptApiKey(activeModel.encryptedApiKey);
    
    if (provider === 'openai') {
      const openaiProvider = createOpenAI({ apiKey: decryptedApiKey });
      return openaiProvider(activeModel.modelId);
    } else if (provider === 'gemini') {
      const googleProvider = createGoogleGenerativeAI({ apiKey: decryptedApiKey });
      return googleProvider(activeModel.modelId);
    }
    
    // Fallback to default model
    console.warn('Unknown provider, falling back to default model');
    return google('gemini-2.0-flash-001');
  } catch (error) {
    console.error('Error getting active model:', error);
    return google('gemini-2.0-flash-001');
  }
}

export async function getModelByName(modelName: string) {
  try {
    // console.log('DEBUG: getModelByName called with modelName =', modelName);
    const activeModel = await getActiveAiModel();
    // console.log('DEBUG: activeModel from database =', activeModel);
    if (!activeModel) {
      console.warn('No active AI model found, falling back to Google provider with modelName:', modelName);
      console.warn('This might cause issues if modelName is not a valid Google model');
      return google(modelName);
    }

    const provider = activeModel.provider;
    const decryptedApiKey = decryptApiKey(activeModel.encryptedApiKey);
    // console.log('DEBUG: provider =', provider, 'modelName =', modelName);
    
    if (provider === 'openai') {
      const openaiProvider = createOpenAI({ apiKey: decryptedApiKey });
      return openaiProvider(modelName);
    } else if (provider === 'gemini') {
      const googleProvider = createGoogleGenerativeAI({ apiKey: decryptedApiKey });
      return googleProvider(modelName);
    }
    
    // Fallback to Google provider
    console.warn('Unknown provider, falling back to Google provider');
    return google(modelName);
  } catch (error) {
    console.error('Error getting model by name:', error);
    return google(modelName);
  }
}

export async function getActiveProvider() {
  try {
    const activeModel = await getActiveAiModel();
    if (!activeModel) {
      console.warn('No active AI model found, falling back to Google provider');
      return google;
    }

    const provider = activeModel.provider;
    const decryptedApiKey = decryptApiKey(activeModel.encryptedApiKey);
    
    if (provider === 'openai') {
      return createOpenAI({ apiKey: decryptedApiKey });
    } else if (provider === 'gemini') {
      return createGoogleGenerativeAI({ apiKey: decryptedApiKey });
    }
    
    // Fallback to Google provider
    console.warn('Unknown provider, falling back to Google provider');
    return google;
  } catch (error) {
    console.error('Error getting active provider:', error);
    return google;
  }
}

// Deprecated: Use getDefaultChatModel() instead
// This constant is kept for backward compatibility but should not be used
export const DEFAULT_CHAT_MODEL: string = 'gemini-2.0-flash-001';

'use server';

import { 
  createAiModel as dbCreateAiModel,
  updateAiModel as dbUpdateAiModel, 
  deleteAiModel as dbDeleteAiModel 
} from '@/lib/db/queries';

export async function createAiModel(modelData: {
  provider: 'openai' | 'gemini';
  modelId: string;
  modelName: string;
  description: string | null;
  apiKeyName: string;
  encryptedApiKey: string;
  isActive: boolean;
}) {
  try {
    return await dbCreateAiModel(modelData);
  } catch (error) {
    console.error('Failed to create AI model:', error);
    throw new Error('Failed to create AI model');
  }
}

export async function updateAiModel(modelId: string, data: { 
  isActive?: boolean;
  provider?: 'openai' | 'gemini';
  modelId?: string;
  modelName?: string;
  description?: string | null;
  apiKeyName?: string;
  encryptedApiKey?: string;
}) {
  try {
    return await dbUpdateAiModel(modelId, data);
  } catch (error) {
    console.error('Failed to update AI model:', error);
    throw new Error('Failed to update AI model');
  }
}

export async function deleteAiModel(modelId: string) {
  try {
    return await dbDeleteAiModel(modelId);
  } catch (error) {
    console.error('Failed to delete AI model:', error);
    throw new Error('Failed to delete AI model');
  }
}
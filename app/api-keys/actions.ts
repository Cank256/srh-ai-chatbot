'use server';

import { 
  createApiKey as dbCreateApiKey,
  updateApiKey as dbUpdateApiKey,
  deleteApiKey as dbDeleteApiKey 
} from '@/lib/db/queries';

export async function createApiKey(keyData: {
  provider: 'openai' | 'gemini';
  keyName: string;
  encryptedKey: string;
  isActive: boolean;
}) {
  try {
    return await dbCreateApiKey(keyData);
  } catch (error) {
    console.error('Failed to create API key:', error);
    throw new Error('Failed to create API key');
  }
}

export async function updateApiKey(keyId: string, data: { isActive?: boolean }) {
  try {
    return await dbUpdateApiKey(keyId, data);
  } catch (error) {
    console.error('Failed to update API key:', error);
    throw new Error('Failed to update API key');
  }
}

export async function deleteApiKey(keyId: string) {
  try {
    return await dbDeleteApiKey(keyId);
  } catch (error) {
    console.error('Failed to delete API key:', error);
    throw new Error('Failed to delete API key');
  }
}
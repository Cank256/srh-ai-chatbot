'use server';

import { updateSystemSetting as dbUpdateSystemSetting } from '@/lib/db/queries';

export async function updateSystemSetting(key: string, value: string) {
  try {
    // Pass 'system' as the default updatedBy parameter
    return await dbUpdateSystemSetting(key, value, 'system');
  } catch (error) {
    console.error('Failed to update system setting:', error);
    throw new Error('Failed to update system setting');
  }
}
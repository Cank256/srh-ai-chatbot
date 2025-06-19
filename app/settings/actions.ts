'use server';

import { updateSystemSetting as dbUpdateSystemSetting } from '@/lib/db/queries';
import { auth } from '@/app/(auth)/auth';

export async function updateSystemSetting(key: string, value: string) {
  try {
    const session = await auth();
    
    if (!session || !session.user || !session.user.id) {
      throw new Error('Unauthorized: No valid session found');
    }
    
    return await dbUpdateSystemSetting(key, value, session.user.id);
  } catch (error) {
    console.error('Failed to update system setting:', error);
    throw new Error('Failed to update system setting');
  }
}
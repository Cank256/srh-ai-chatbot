'use server';

import { updateUserRole as dbUpdateUserRole, deleteUserById as dbDeleteUserById } from '@/lib/db/queries';

export async function updateUserRole(userId: string, role: 'user' | 'admin') {
  try {
    return await dbUpdateUserRole(userId, role);
  } catch (error) {
    console.error('Failed to update user role:', error);
    throw new Error('Failed to update user role');
  }
}

export async function deleteUserById(userId: string) {
  try {
    return await dbDeleteUserById(userId);
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw new Error('Failed to delete user');
  }
}
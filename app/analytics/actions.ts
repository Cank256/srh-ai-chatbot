'use server';

import { getAnalytics as dbGetAnalytics, getSystemStats as dbGetSystemStats } from '@/lib/db/queries';

export type SystemStats = {
  totalUsers: number;
  totalChats: number;
  totalMessages: number;
  totalDocuments: number;
  activeUsersToday: number;
};

export async function getAnalytics(startDate?: Date, endDate?: Date) {
  try {
    return await dbGetAnalytics(startDate, endDate);
  } catch (error) {
    console.error('Failed to get analytics:', error);
    return [];
  }
}

export async function getSystemStats(): Promise<SystemStats> {
  try {
    // Explicitly cast the return value to SystemStats
    const stats = await dbGetSystemStats() as unknown as SystemStats;
    return {
      totalUsers: Number(stats.totalUsers) || 0,
      totalChats: Number(stats.totalChats) || 0,
      totalMessages: Number(stats.totalMessages) || 0,
      totalDocuments: Number(stats.totalDocuments) || 0,
      activeUsersToday: Number(stats.activeUsersToday) || 0
    };
  } catch (error) {
    console.error('Failed to get system stats:', error);
    // Return default values if there's an error
    return {
      totalUsers: 0,
      totalChats: 0,
      totalMessages: 0,
      totalDocuments: 0,
      activeUsersToday: 0
    };
  }
}
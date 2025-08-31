import 'server-only';

import { genSaltSync, hashSync } from 'bcrypt-ts';
import { and, asc, desc, eq, gt, gte, inArray, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import {
  user,
  chat,
  type User,
  document,
  type Suggestion,
  suggestion,
  type Message,
  message,
  vote,
  aiModel,
  type AiModel,
  apiKey,
  type ApiKey,
  analytics,
  type Analytics,
  systemSettings,
  type SystemSettings,
} from './schema';
import { ArtifactKind } from '@/components/artifact';

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle

// Database connection with error handling
if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!, {
  onnotice: () => {}, // Suppress notices
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout in seconds
});
const db = drizzle(client);

// Test database connection
export async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    await db.execute(sql`SELECT 1`);
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.error('Failed to get user from database');
    throw error;
  }
}

export async function getUserByResetToken(token: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.reset_token, token));
  } catch (error) {
    console.error('Failed to get user from database');
    throw error;
  }
}

export async function createUser(email: string, password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  try {
    return await db.insert(user).values({ email, password: hash });
  } catch (error) {
    console.error('Failed to create user in database');
    throw error;
  }
}

export async function updateUser(passwordReset: boolean = false, data: User) {
  if (passwordReset && data.password) {
    const salt = genSaltSync(10);
    const hash = hashSync(data.password, salt);
    data.password = hash;
  }

  try {
    return await db.update(user).set(data).where(eq(user.id, data.id));
  } catch (error) {
    console.error('Failed to update user in database');
    throw error;
  }
}

export async function saveChat({
  id,
  userId,
  title,
}: {
  id: string;
  userId: string;
  title: string;
}) {
  try {
    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      userId,
      title,
    });
  } catch (error) {
    console.error('Failed to save chat in database');
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await db.delete(vote).where(eq(vote.chatId, id));
    await db.delete(message).where(eq(message.chatId, id));

    return await db.delete(chat).where(eq(chat.id, id));
  } catch (error) {
    console.error('Failed to delete chat by id from database');
    throw error;
  }
}

export async function getChatsByUserId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(chat)
      .where(eq(chat.userId, id))
      .orderBy(desc(chat.createdAt));
  } catch (error) {
    console.error('Failed to get chats by user from database');
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    console.error('Failed to get chat by id from database');
    throw error;
  }
}

export async function saveMessages({ messages }: { messages: Array<Message> }) {
  try {
    return await db.insert(message).values(messages);
  } catch (error) {
    console.error('Failed to save messages in database', error);
    throw error;
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(message)
      .where(eq(message.chatId, id))
      .orderBy(asc(message.createdAt));
  } catch (error) {
    console.error('Failed to get messages by chat id from database', error);
    throw error;
  }
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: 'up' | 'down';
}) {
  try {
    const [existingVote] = await db
      .select()
      .from(vote)
      .where(and(eq(vote.messageId, messageId)));

    if (existingVote) {
      return await db
        .update(vote)
        .set({ isUpvoted: type === 'up' })
        .where(and(eq(vote.messageId, messageId), eq(vote.chatId, chatId)));
    }
    return await db.insert(vote).values({
      chatId,
      messageId,
      isUpvoted: type === 'up',
    });
  } catch (error) {
    console.error('Failed to upvote message in database', error);
    throw error;
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    return await db.select().from(vote).where(eq(vote.chatId, id));
  } catch (error) {
    console.error('Failed to get votes by chat id from database', error);
    throw error;
  }
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) {
  try {
    return await db.insert(document).values({
      id,
      title,
      kind,
      content,
      userId,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Failed to save document in database');
    throw error;
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  try {
    const documents = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(asc(document.createdAt));

    return documents;
  } catch (error) {
    console.error('Failed to get document by id from database');
    throw error;
  }
}

export async function getDocumentById({ id }: { id: string }) {
  try {
    const [selectedDocument] = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(desc(document.createdAt));

    return selectedDocument;
  } catch (error) {
    console.error('Failed to get document by id from database');
    throw error;
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  try {
    await db
      .delete(suggestion)
      .where(
        and(
          eq(suggestion.documentId, id),
          gt(suggestion.documentCreatedAt, timestamp),
        ),
      );

    return await db
      .delete(document)
      .where(and(eq(document.id, id), gt(document.createdAt, timestamp)));
  } catch (error) {
    console.error(
      'Failed to delete documents by id after timestamp from database',
    );
    throw error;
  }
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Array<Suggestion>;
}) {
  try {
    return await db.insert(suggestion).values(suggestions);
  } catch (error) {
    console.error('Failed to save suggestions in database');
    throw error;
  }
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  try {
    return await db
      .select()
      .from(suggestion)
      .where(and(eq(suggestion.documentId, documentId)));
  } catch (error) {
    console.error(
      'Failed to get suggestions by document version from database',
    );
    throw error;
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    return await db.select().from(message).where(eq(message.id, id));
  } catch (error) {
    console.error('Failed to get message by id from database');
    throw error;
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    const messagesToDelete = await db
      .select({ id: message.id })
      .from(message)
      .where(
        and(eq(message.chatId, chatId), gte(message.createdAt, timestamp)),
      );

    const messageIds = messagesToDelete.map((message) => message.id);

    if (messageIds.length > 0) {
      await db
        .delete(vote)
        .where(
          and(eq(vote.chatId, chatId), inArray(vote.messageId, messageIds)),
        );

      return await db
        .delete(message)
        .where(
          and(eq(message.chatId, chatId), inArray(message.id, messageIds)),
        );
    }
  } catch (error) {
    console.error(
      'Failed to delete messages by id after timestamp from database',
    );
    throw error;
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: 'private' | 'public';
}) {
  try {
    return await db.update(chat).set({ visibility }).where(eq(chat.id, chatId));
  } catch (error) {
    console.error('Failed to update chat visibility in database');
    throw error;
  }
}

// Admin functions
export async function getAllUsers() {
  try {
    return await db.select().from(user).orderBy(desc(user.createdAt));
  } catch (error) {
    console.error('Failed to get all users from database');
    throw error;
  }
}

export async function updateUserRole(userId: string, role: 'user' | 'admin') {
  try {
    return await db.update(user).set({ role }).where(eq(user.id, userId));
  } catch (error) {
    console.error('Failed to update user role in database');
    throw error;
  }
}

export async function deleteUserById(userId: string) {
  try {
    // Delete user's chats and related data first
    const userChats = await db.select({ id: chat.id }).from(chat).where(eq(chat.userId, userId));
    const chatIds = userChats.map(c => c.id);
    
    if (chatIds.length > 0) {
      await db.delete(vote).where(inArray(vote.chatId, chatIds));
      await db.delete(message).where(inArray(message.chatId, chatIds));
      await db.delete(chat).where(eq(chat.userId, userId));
    }
    
    await db.delete(document).where(eq(document.userId, userId));
    return await db.delete(user).where(eq(user.id, userId));
  } catch (error) {
    console.error('Failed to delete user from database');
    throw error;
  }
}

// AI Model management
export async function getAllAiModels() {
  try {
    console.log('Attempting to fetch AI models from database...');
    const result = await db.select().from(aiModel).orderBy(desc(aiModel.createdAt));
    console.log(`Successfully fetched ${result.length} AI models`);
    return result;
  } catch (error) {
    console.error('Failed to get AI models from database:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    throw error;
  }
}

export async function createAiModel(modelData: Omit<AiModel, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    return await db.insert(aiModel).values({
      ...modelData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Failed to create AI model in database');
    throw error;
  }
}

export async function updateAiModel(id: string, modelData: Partial<Omit<AiModel, 'id' | 'createdAt'>>) {
  try {
    return await db.update(aiModel).set({
      ...modelData,
      updatedAt: new Date(),
    }).where(eq(aiModel.id, id));
  } catch (error) {
    console.error('Failed to update AI model in database');
    throw error;
  }
}

export async function deleteAiModel(id: string) {
  try {
    return await db.delete(aiModel).where(eq(aiModel.id, id));
  } catch (error) {
    console.error('Failed to delete AI model from database');
    throw error;
  }
}

export async function getActiveAiModel() {
  try {
    const result = await db.select().from(aiModel)
      .where(eq(aiModel.isActive, true))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Failed to get active AI model from database');
    throw error;
  }
}

// API Key management
export async function getAllApiKeys() {
  try {
    return await db.select({
      id: apiKey.id,
      provider: apiKey.provider,
      keyName: apiKey.keyName,
      isActive: apiKey.isActive,
      createdAt: apiKey.createdAt,
      updatedAt: apiKey.updatedAt,
    }).from(apiKey).orderBy(desc(apiKey.createdAt));
  } catch (error) {
    console.error('Failed to get API keys from database');
    throw error;
  }
}

export async function createApiKey(keyData: Omit<ApiKey, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    return await db.insert(apiKey).values({
      ...keyData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Failed to create API key in database');
    throw error;
  }
}

export async function updateApiKey(id: string, keyData: Partial<Omit<ApiKey, 'id' | 'createdAt'>>) {
  try {
    return await db.update(apiKey).set({
      ...keyData,
      updatedAt: new Date(),
    }).where(eq(apiKey.id, id));
  } catch (error) {
    console.error('Failed to update API key in database');
    throw error;
  }
}

export async function deleteApiKey(id: string) {
  try {
    return await db.delete(apiKey).where(eq(apiKey.id, id));
  } catch (error) {
    console.error('Failed to delete API key from database');
    throw error;
  }
}

export async function getActiveApiKey(provider: 'openai' | 'gemini') {
  try {
    const result = await db.select().from(apiKey)
      .where(and(eq(apiKey.provider, provider), eq(apiKey.isActive, true)))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Failed to get active API key from database');
    throw error;
  }
}

// Analytics functions
export async function getAnalytics(startDate?: Date, endDate?: Date) {
  try {
    // Start with a base query
    let baseQuery = db.select().from(analytics);
    
    // Build conditions array
    const conditions: string[] = [];
    const params: any[] = [];
    
    if (startDate) {
      conditions.push('date >= $1');
      params.push(startDate);
    }
    
    if (endDate) {
      conditions.push('date <= $' + (params.length + 1));
      params.push(endDate);
    }
    
    // Apply conditions if any exist
    let result;
    if (conditions.length > 0) {
      // For simplicity, let's use the drizzle query builder instead of raw SQL
      if (startDate && endDate) {
        result = await db
          .select()
          .from(analytics)
          .where(
            and(
              sql`${analytics.date} >= ${startDate}`,
              sql`${analytics.date} <= ${endDate}`
            )
          )
          .orderBy(desc(analytics.date));
      } else if (startDate) {
        result = await db
          .select()
          .from(analytics)
          .where(sql`${analytics.date} >= ${startDate}`)
          .orderBy(desc(analytics.date));
      } else if (endDate) {
        result = await db
          .select()
          .from(analytics)
          .where(sql`${analytics.date} <= ${endDate}`)
          .orderBy(desc(analytics.date));
      }
    } else {
      result = await baseQuery.orderBy(desc(analytics.date));
    }
    
    return result;
  } catch (error) {
    console.error('Failed to get analytics from database:', error);
    throw error;
  }
}

export async function createAnalyticsEntry(analyticsData: Omit<Analytics, 'id' | 'createdAt'>) {
  try {
    return await db.insert(analytics).values({
      ...analyticsData,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Failed to create analytics entry in database');
    throw error;
  }
}

export async function getSystemStats() {
  try {
    const [userCount] = await db.select({ count: sql`count(*)` }).from(user);
    const [chatCount] = await db.select({ count: sql`count(*)` }).from(chat);
    const [messageCount] = await db.select({ count: sql`count(*)` }).from(message);
    const [documentCount] = await db.select({ count: sql`count(*)` }).from(document);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [activeUsersToday] = await db.select({ count: sql`count(distinct ${chat.userId})` })
      .from(chat)
      .where(gte(chat.createdAt, today));
    
    return {
      totalUsers: userCount.count,
      totalChats: chatCount.count,
      totalMessages: messageCount.count,
      totalDocuments: documentCount.count,
      activeUsersToday: activeUsersToday.count,
    };
  } catch (error) {
    console.error('Failed to get system stats from database');
    throw error;
  }
}

// System Settings
export async function getSystemSettings() {
  try {
    return await db.select().from(systemSettings).orderBy(asc(systemSettings.key));
  } catch (error) {
    console.error('Failed to get system settings from database');
    throw error;
  }
}

export async function updateSystemSetting(key: string, value: string, updatedBy: string) {
  try {
    const existing = await db.select().from(systemSettings).where(eq(systemSettings.key, key)).limit(1);
    
    if (existing.length > 0) {
      return await db.update(systemSettings)
        .set({ value, updatedAt: new Date(), updatedBy })
        .where(eq(systemSettings.key, key));
    } else {
      return await db.insert(systemSettings).values({
        key,
        value,
        updatedAt: new Date(),
        updatedBy,
      });
    }
  } catch (error) {
    console.error('Failed to update system setting in database');
    throw error;
  }
}

import { InferSelectModel } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  text,
  primaryKey,
  foreignKey,
  boolean,
  integer,
} from 'drizzle-orm/pg-core';

export const user = pgTable('User', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 64 }).notNull(),
  password: varchar('password', { length: 64 }),
  reset_token: uuid('reset_token'),
  role: varchar('role', { enum: ['user', 'admin'] }).notNull().default('user'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  lastLoginAt: timestamp('lastLoginAt'),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable('Chat', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  title: text('title').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  visibility: varchar('visibility', { enum: ['public', 'private'] })
    .notNull()
    .default('private'),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = pgTable('Message', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => chat.id),
  role: varchar('role').notNull(),
  content: json('content').notNull(),
  createdAt: timestamp('createdAt').notNull(),
});

export type Message = InferSelectModel<typeof message>;

export const vote = pgTable(
  'Vote',
  {
    chatId: uuid('chatId')
      .notNull()
      .references(() => chat.id),
    messageId: uuid('messageId')
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean('isUpvoted').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  },
);

export type Vote = InferSelectModel<typeof vote>;

export const document = pgTable(
  'Document',
  {
    id: uuid('id').notNull().defaultRandom(),
    createdAt: timestamp('createdAt').notNull(),
    title: text('title').notNull(),
    content: text('content'),
    kind: varchar('kind', { enum: ['text', 'code', 'image', 'sheet'] })
      .notNull()
      .default('text'),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  },
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable(
  'Suggestion',
  {
    id: uuid('id').notNull().defaultRandom(),
    documentId: uuid('documentId').notNull(),
    documentCreatedAt: timestamp('documentCreatedAt').notNull(),
    originalText: text('originalText').notNull(),
    suggestedText: text('suggestedText').notNull(),
    description: text('description'),
    isResolved: boolean('isResolved').notNull().default(false),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
    createdAt: timestamp('createdAt').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  }),
);

export type Suggestion = InferSelectModel<typeof suggestion>;

// Admin tables
export const aiModel = pgTable('AiModel', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  provider: varchar('provider', { enum: ['openai', 'gemini'] }).notNull(),
  modelId: varchar('modelId', { length: 100 }).notNull(),
  modelName: varchar('modelName', { length: 100 }).notNull(),
  description: text('description'),
  apiKeyName: varchar('apiKeyName', { length: 100 }).notNull(),
  encryptedApiKey: text('encryptedApiKey').notNull(),
  isActive: boolean('isActive').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export type AiModel = InferSelectModel<typeof aiModel>;

export const apiKey = pgTable('ApiKey', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  provider: varchar('provider', { enum: ['openai', 'gemini'] }).notNull(),
  keyName: varchar('keyName', { length: 100 }).notNull(),
  encryptedKey: text('encryptedKey').notNull(),
  isActive: boolean('isActive').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export type ApiKey = InferSelectModel<typeof apiKey>;

export const analytics = pgTable('Analytics', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  date: timestamp('date').notNull(),
  totalUsers: integer('totalUsers').notNull().default(0),
  activeUsers: integer('activeUsers').notNull().default(0),
  totalChats: integer('totalChats').notNull().default(0),
  totalMessages: integer('totalMessages').notNull().default(0),
  apiCalls: integer('apiCalls').notNull().default(0),
  errors: integer('errors').notNull().default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export type Analytics = InferSelectModel<typeof analytics>;

export const systemSettings = pgTable('SystemSettings', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value').notNull(),
  description: text('description'),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  updatedBy: uuid('updatedBy')
    .notNull()
    .references(() => user.id),
});

export type SystemSettings = InferSelectModel<typeof systemSettings>;

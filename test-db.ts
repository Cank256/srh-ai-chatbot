import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';

import {
  user,
  chat,
  message,
  document,
  suggestion,
  vote,
  aiModel,
  apiKey,
  analytics,
  systemSettings,
} from './lib/db/schema';

config({
  path: '.env',
});

async function testDatabase() {
  console.log('Testing database connection...');
  
  if (!process.env.POSTGRES_URL) {
    console.error('POSTGRES_URL is not defined');
    process.exit(1);
  }

  try {
    const client = postgres(process.env.POSTGRES_URL, { max: 1 });
    const db = drizzle(client);
    
    console.log('Connected to database successfully!');
    
    // Test tables existence
    console.log('\nChecking tables...');
    
    try {
      const users = await db.select().from(user).limit(1);
      console.log('✅ User table exists');
    } catch (error) {
      console.error('❌ User table error:', error);
    }
    
    try {
      const chats = await db.select().from(chat).limit(1);
      console.log('✅ Chat table exists');
    } catch (error) {
      console.error('❌ Chat table error:', error);
    }
    
    try {
      const messages = await db.select().from(message).limit(1);
      console.log('✅ Message table exists');
    } catch (error) {
      console.error('❌ Message table error:', error);
    }
    
    try {
      const documents = await db.select().from(document).limit(1);
      console.log('✅ Document table exists');
    } catch (error) {
      console.error('❌ Document table error:', error);
    }
    
    try {
      const suggestions = await db.select().from(suggestion).limit(1);
      console.log('✅ Suggestion table exists');
    } catch (error) {
      console.error('❌ Suggestion table error:', error);
    }
    
    try {
      const votes = await db.select().from(vote).limit(1);
      console.log('✅ Vote table exists');
    } catch (error) {
      console.error('❌ Vote table error:', error);
    }
    
    try {
      const models = await db.select().from(aiModel).limit(1);
      console.log('✅ AiModel table exists');
    } catch (error) {
      console.error('❌ AiModel table error:', error);
    }
    
    try {
      const keys = await db.select().from(apiKey).limit(1);
      console.log('✅ ApiKey table exists');
    } catch (error) {
      console.error('❌ ApiKey table error:', error);
    }
    
    try {
      const analyticsData = await db.select().from(analytics).limit(1);
      console.log('✅ Analytics table exists');
    } catch (error) {
      console.error('❌ Analytics table error:', error);
    }
    
    try {
      const settings = await db.select().from(systemSettings).limit(1);
      console.log('✅ SystemSettings table exists');
    } catch (error) {
      console.error('❌ SystemSettings table error:', error);
    }
    
    console.log('\nDatabase test completed!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
}

testDatabase();
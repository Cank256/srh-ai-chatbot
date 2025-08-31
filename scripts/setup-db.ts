import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';
import { genSaltSync, hashSync } from 'bcrypt-ts';
import { eq } from 'drizzle-orm';
import { exec } from 'child_process';
import { promisify } from 'util';

import { user, systemSettings } from '../lib/db/schema';

const execAsync = promisify(exec);

config({
  path: '.env.local',
});

async function setupDatabase() {
  console.log('Setting up database...');
  
  if (!process.env.POSTGRES_URL) {
    console.error('POSTGRES_URL is not defined');
    process.exit(1);
  }

  try {
    // Run migrations first
    console.log('Running migrations...');
    try {
      await execAsync('npx tsx lib/db/migrate.ts');
      console.log('✅ Migrations completed successfully');
    } catch (error) {
      console.error('Failed to run migrations:', error);
      process.exit(1);
    }

    const client = postgres(process.env.POSTGRES_URL, { max: 1 });
    const db = drizzle(client);
    
    // Check if admin user exists
    const adminUsers = await db.select()
      .from(user)
      .where(eq(user.role, 'admin'));
    
    if (adminUsers.length === 0) {
      // Create admin user if none exists
      console.log('No admin account found. Creating demo admin account...');
      
      const email = 'admin@example.com';
      const password = 'Admin123!';
      
      const salt = genSaltSync(10);
      const hash = hashSync(password, salt);
      
      await db.insert(user).values({
        email,
        password: hash,
        role: 'admin',
      });
      
      console.log('✅ Demo admin account created successfully!');
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
      console.log('Please change these credentials after first login.');
    } else {
      console.log('✅ Admin account already exists');
    }

    // Check if system settings exist
    const settings = await db.select().from(systemSettings).limit(1);
    
    if (settings.length === 0) {
      // Create default system settings if none exist
      console.log('No system settings found. Creating default settings...');
      
      // Get the admin user for updatedBy field
      const adminUser = await db.select()
        .from(user)
        .where(eq(user.role, 'admin'))
        .limit(1);
      
      if (adminUser.length === 0) {
        console.error('No admin user found to set as updatedBy for system settings');
        process.exit(1);
      }
      
      // Insert default settings
      const defaultSettings = [
        {
          key: 'app_name',
          value: 'SRH AI Chatbot',
          description: 'Application name displayed in the UI',
          updatedBy: adminUser[0].id
        },
        {
          key: 'app_description',
          value: 'An AI-powered chatbot for SRH',
          description: 'Application description',
          updatedBy: adminUser[0].id
        },
        {
          key: 'allow_signup',
          value: 'true',
          description: 'Whether new users can sign up',
          updatedBy: adminUser[0].id
        },
        {
          key: 'default_model',
          value: 'gpt-3.5-turbo',
          description: 'Default AI model to use',
          updatedBy: adminUser[0].id
        }
      ];
      
      for (const setting of defaultSettings) {
        await db.insert(systemSettings).values(setting);
      }
      
      console.log('✅ Default system settings created successfully!');
    } else {
      console.log('✅ System settings already exist');
    }
    
    console.log('✅ Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to set up database:', error);
    process.exit(1);
  }
}

setupDatabase();
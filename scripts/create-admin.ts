import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';
import { genSaltSync, hashSync } from 'bcrypt-ts';
import { eq } from 'drizzle-orm';

import { user } from '../lib/db/schema';

config({
  path: '.env',
});

async function createAdminUser() {
  console.log('Checking for admin user...');
  
  if (!process.env.POSTGRES_URL) {
    console.error('POSTGRES_URL is not defined');
    process.exit(1);
  }

  try {
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
      console.log(`Email: ${adminUsers[0].email}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Failed to create admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
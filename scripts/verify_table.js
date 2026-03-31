
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');

// Simple parse for .env
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function verify() {
  console.log('Verifying food_waste_logs table...');
  const { data, error } = await supabase.from('food_waste_logs').select('*', { count: 'exact', head: true });
  
  if (error) {
    if (error.code === '42P01') {
      console.error('CRITICAL: Table food_waste_logs DOES NOT EXIST in the remote database.');
      console.error('Please run the contents of food_waste_logs_migration.sql in the Supabase SQL Editor.');
    } else {
      console.error('Error checking table:', error.message);
    }
  } else {
    console.log('SUCCESS: Table food_waste_logs exists.');
  }
}

verify();

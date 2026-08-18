import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function getSchema() {
  const { data, error } = await supabase.from('products').select('*').limit(1);
  console.log('Products sample:', JSON.stringify(data, null, 2));
  console.log('Error:', error);
}
getSchema();

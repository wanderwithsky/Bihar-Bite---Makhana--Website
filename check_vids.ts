import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const supabase = createClient(process.env.VITE_SUPABASE_URL || '', process.env.VITE_SUPABASE_ANON_KEY || '');

async function check() {
  const { data, error } = await supabase.from('products').select('id, name, gallery_images').in('id', ['4-suta-loose-makhana', '5-suta-loose-makhana', '6-suta-handpick-loose-makhana']);
  console.log(JSON.stringify(data, null, 2));
}
check();

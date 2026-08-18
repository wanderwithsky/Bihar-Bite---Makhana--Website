import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const supabase = createClient(process.env.VITE_SUPABASE_URL || '', process.env.VITE_SUPABASE_ANON_KEY || '');

async function updateVideos() {
  const updates = [
    { id: '4-suta-loose-makhana', video: '/products/4 suta.mp4' },
    { id: '5-suta-loose-makhana', video: '/products/5 suta.mp4' },
    { id: '6-suta-handpick-loose-makhana', video: '/products/6 suta.mp4' }
  ];

  for (const update of updates) {
    const { data, error } = await supabase
      .from('products')
      .update({ video: update.video })
      .eq('id', update.id);
      
    if (error) {
      console.error(`Error updating ${update.id}:`, error);
    } else {
      console.log(`Successfully updated ${update.id}`);
    }
  }
}
updateVideos();

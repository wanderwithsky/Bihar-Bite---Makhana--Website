import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: 'c:/Users/wanderwithsky/Downloads/Bihar-s-Finest-main/Bihar-s-Finest-main/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadTest() {
  const filePath = 'c:/Users/wanderwithsky/Downloads/Bihar-s-Finest-main/Bihar-s-Finest-main/public/products/plain-makhana.png';
  console.log(`Reading file: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.error('Test file not found.');
    return;
  }
  
  const fileData = fs.readFileSync(filePath);
  
  console.log('Uploading to product-images/plain-makhana.png...');
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload('plain-makhana.png', fileData, {
      contentType: 'image/png',
      upsert: true
    });
    
  if (error) {
    console.error('Upload failed:', error.message);
  } else {
    console.log('Upload successful!', data);
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl('plain-makhana.png');
    console.log('Public URL:', urlData.publicUrl);
  }
}

uploadTest();

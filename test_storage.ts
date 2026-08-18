import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: 'c:/Users/wanderwithsky/Downloads/Bihar-s-Finest-main/Bihar-s-Finest-main/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testStorage() {
  console.log('Creating bucket product-images...');
  const { data: bucket, error: bucketErr } = await supabase.storage.createBucket('product-images', {
    public: true,
  });

  if (bucketErr) {
    console.error('Failed to create bucket (might already exist or permission denied):', bucketErr.message);
  } else {
    console.log('Bucket created successfully!');
  }
}
testStorage();

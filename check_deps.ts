import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: 'c:/Users/wanderwithsky/Downloads/Bihar-s-Finest-main/Bihar-s-Finest-main/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDependencies() {
  console.log('Fetching existing products...');
  const { data: products, error: pErr } = await supabase.from('products').select('id');
  
  if (pErr) {
    console.error('Error fetching products:', pErr);
    return;
  }
  
  console.log(`Found ${products.length} products.`);

  const productIds = products.map((p: any) => p.id);
  
  const depChecks = [
    'order_items', 'orders', 'reviews', 'wishlist_items'
  ];

  for (const table of depChecks) {
    console.log(`Checking ${table}...`);
    try {
      const { data, error } = await supabase.from(table).select('product_id').limit(10);
      if (error) {
         console.log(`Table ${table} might not exist or no access:`, error.message);
      } else {
         console.log(`Table ${table} has ${data.length} recent rows. Product IDs referenced:`, [...new Set(data.map((d:any) => d.product_id))]);
      }
    } catch (e: any) {
      console.log(`Exception checking ${table}:`, e.message);
    }
  }
  
  console.log('Checking storage buckets...');
  const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
  if (bErr) {
    console.error('Error listing buckets:', bErr);
  } else {
    console.log('Buckets:', buckets.map((b:any) => b.name));
  }
}
checkDependencies();

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const supabase = createClient(process.env.VITE_SUPABASE_URL || '', process.env.VITE_SUPABASE_ANON_KEY || '');

async function fix() {
  const p = {
      id: "10-kg-loose-makhana",
      name: "10 KG Loose Makhana",
      description: "Premium wholesale phool makhana directly from Purnea farms. Graded 4, 5, or 6 suta. Perfect for re-packaging or large family usage. Contact for B2B rates.",
      price: 6500,
      original_price: 7500,
      category: "Plain",
      flavors: [],
      image: "https://wmhbjybxerdmpemfezpp.supabase.co/storage/v1/object/public/product-images/loose-makhana.jpeg",
      gallery_images: ["https://wmhbjybxerdmpemfezpp.supabase.co/storage/v1/object/public/product-images/loose-makhana.jpeg"],
      weights: ["10 KG", "20 KG", "50 KG"],
      weight_prices: { "10 KG": 6500, "20 KG": 12500, "50 KG": 30000 },
      rating: 5,
      review_count: 0,  
      is_bestseller: false,
      is_new: false,
      stock_quantity: 100,
      status: 'Active'
  };
  const { error } = await supabase.from('products').upsert(p);
  console.log('Error:', error?.message || 'Success!');
}
fix();

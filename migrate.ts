import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Import our local data proxy directly!
import { localProducts } from './src/localCatalog.ts';

dotenv.config({ path: 'c:/Users/wanderwithsky/Downloads/Bihar-s-Finest-main/Bihar-s-Finest-main/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadLocalAsset(assetPath: string): Promise<string> {
  // If it's already a full URL (like Google drive), just return it
  if (assetPath.startsWith('http')) return assetPath;
  
  // Format the asset path (e.g. /products/plain-makhana.png)
  const normalizedPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
  const localFile = path.join('c:/Users/wanderwithsky/Downloads/Bihar-s-Finest-main/Bihar-s-Finest-main/public', normalizedPath);
  
  if (!fs.existsSync(localFile)) {
    console.warn(`Asset not found locally: ${localFile}`);
    return assetPath; // Return original if not found
  }
  
  const fileName = path.basename(localFile).replace(/\s+/g, '-');
  const fileData = fs.readFileSync(localFile);
  
  // Upload to Supabase Storage
  console.log(`Uploading ${fileName}...`);
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, fileData, {
      contentType: fileName.endsWith('.mp4') ? 'video/mp4' : (fileName.endsWith('.jpeg') || fileName.endsWith('.jpg') ? 'image/jpeg' : 'image/png'),
      upsert: true
    });
    
  if (error) {
    console.error(`Failed to upload ${fileName}:`, error.message);
    return assetPath;
  }
  
  const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
  return urlData.publicUrl;
}

async function runMigration() {
  console.log('Starting migration...');
  
  // 1. Backup existing
  const { data: existingProducts } = await supabase.from('products').select('*');
  fs.writeFileSync('c:/Users/wanderwithsky/Downloads/Bihar-s-Finest-main/Bihar-s-Finest-main/scratch_backup.json', JSON.stringify(existingProducts, null, 2));
  console.log(`Backed up ${existingProducts?.length || 0} existing products.`);
  
  // 2. Process and Upsert each local product
  for (const p of localProducts) {
    console.log(`\nProcessing: ${p.name}`);
    
    // Process main image
    let newMainImage = p.image;
    if (newMainImage) {
      newMainImage = await uploadLocalAsset(newMainImage);
    }
    
    // Process gallery images + video
    const newGallery = [];
    if (p.galleryImages) {
      for (const gi of p.galleryImages) {
        newGallery.push(await uploadLocalAsset(gi));
      }
    }
    
    // Include video in gallery if present in original data
    const originalProd = (p as any);
    if (originalProd.video) {
      const vidUrl = await uploadLocalAsset(originalProd.video);
      if (!newGallery.includes(vidUrl)) newGallery.push(vidUrl);
    }
    
    // Map to Supabase schema
    const dbRow = {
      id: p.id || p.slug,
      name: p.name,
      description: p.description,
      tagline: (p as any).tagline || null,
      price: p.price,
      original_price: (p as any).originalPrice || null,
      category: p.category || 'Plain',
      flavors: (p as any).flavors || [],
      image: newMainImage,
      gallery_images: newGallery,
      weights: p.weights || ['100g'],
      weight_prices: p.weightPrices || {},
      rating: p.rating || 5.0,
      review_count: p.reviewCount || 0,
      is_bestseller: !!p.isBestseller,
      is_new: !!p.isNew,
      stock_quantity: typeof p.stock === 'number' ? p.stock : 100,
      status: 'Active'
    };
    
    const { error } = await supabase.from('products').upsert(dbRow);
    if (error) {
      console.error(`Error upserting ${p.name}:`, error.message);
    } else {
      console.log(`Upserted ${p.name} successfully.`);
    }
  }
  
  // 3. Delete any products NOT in localCatalog
  const validIds = localProducts.map(p => p.id || p.slug);
  const { data: toDelete } = await supabase.from('products').select('id');
  if (toDelete) {
    for (const item of toDelete) {
      if (!validIds.includes(item.id)) {
        console.log(`Deleting obsolete product: ${item.id}`);
        await supabase.from('products').delete().eq('id', item.id);
      }
    }
  }
  
  console.log('Migration complete!');
}

runMigration();

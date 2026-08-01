import { createClient } from '@supabase/supabase-js';
import { Product, Order, User as AppUser, Review } from '../types';

const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

// Initialize client only if variables exist, else we can use a proxy/stub to prevent crashes
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase URL or Anon Key is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your env secrets.'
  );
}

// Helper to convert database product row to App Product interface
export function mapDbProductToProduct(row: any): Product {
  // Map PostgreSQL json/array fields back to App types
  const weights = Array.isArray(row.weights) ? row.weights : ['100g', '250g', '500g'];
  const weightPrices = row.weight_prices && typeof row.weight_prices === 'object' 
    ? row.weight_prices 
    : { '100g': row.price };

  return {
    id: row.id || row.product_id,
    name: row.name,
    description: row.description || '',
    price: row.price,
    originalPrice: row.original_price || undefined,
    category: row.category,
    flavors: Array.isArray(row.flavors) ? row.flavors : [],
    image: row.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop',
    galleryImages: Array.isArray(row.gallery_images) ? row.gallery_images : [],
    weights: weights,
    weightPrices: weightPrices,
    rating: Number(row.rating) || 5.0,
    reviewCount: Number(row.review_count) || 0,
    isBestseller: Boolean(row.is_bestseller),
    isNew: Boolean(row.is_new),
    stock: row.stock_quantity !== undefined && row.stock_quantity !== null ? Number(row.stock_quantity) : 100,
    tagline: row.tagline || undefined,
    nutritionalInfo: row.nutritional_info ? {
      calories: row.nutritional_info.calories || 'N/A',
      protein: row.nutritional_info.protein || 'N/A',
      fiber: row.nutritional_info.fiber || 'N/A',
      fat: row.nutritional_info.fat || 'N/A'
    } : undefined,
    reviews: Array.isArray(row.reviews) ? row.reviews.map((rev: any) => ({
      id: rev.id,
      userName: rev.user_name || rev.userName || 'Anonymous',
      rating: Number(rev.rating) || 5,
      date: rev.date || new Date().toISOString().split('T')[0],
      comment: rev.comment || ''
    })) : []
  };
}

// ====================================================================
// PRODUCT DATABASE QUERIES
// ====================================================================

export async function seedDefaultProducts() {
  if (!supabase) return;
  
  const seedData = [
    {
      id: 'himalayan-pink-salt',
      name: 'Himalayan Pink Salt Roasted',
      description: 'Delicately roasted with subtle hints of mineral-rich pink salt. Perfect crunch and eye-safe twilight aesthetic.',
      price: 349,
      original_price: 399,
      category: 'Roasted',
      flavors: ['Himalayan Salt'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE8NZSYfiYMC09NWAibdLNv51ejq_Qp1-IFFWffR4LcaiYNtj0A3_mCmJVgCb__MAvXOpTgarPpFjmIQpgJTjBptORCKIGkbJT4cDDgacGBmknR6wR0eRTBJ96olvbu-8lFwFRqLLWRWxjRLJXlf9LBvaW7avfUswRCpqzZx_O_wMbqAcfYXd9s9_DDpMApj1AMKne5x_XkoB3G9xA9e1hGovyZj0G8ZBQ5Ed4cULYicJxBjWcGX6Hpw',
      gallery_images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAeFYgCxP5A0_pK4KhY5-yEMquxVfiXvJ1Qrp_kVb_nKFR-Y-AAPJYcuBC1e5YsDgLx9lXC0eiu7CylCOb3BdqEktK541jAnk4rwBd-CGzJIBxoEMGV2jyCGhMgKqZmToiHZYVqzEe2MGvzIZ8jglsVo9GQEw5DLUMdn7gB7wuOqdZGAQY3gkKg4CIA2-2qJ8I5ORNEB83AfDF3N1eOfKNxIO1mILrYWIRgqfSJsZ7NioB0J78v-xEswg',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC9fWhGNNgcRjoK8W0ntw5HuZIHHzOjIAjF_5CeQNpwRclfgIM-DGSWsYcUXttaNfcj4knXYntQJNTUZ9Sj9rdogL1zqKws6tlA836Yve5E6KyEja20C5pevXbFrS881vUvNRt-DyMy1o2eI3px6MKu1iYX3I6md1dweaVabMB4bm-HcvX4QEsIR-6sy5fpL7paQQiN43G49oan21Q2TVfE2KBts-vp64609N39yApDotaNN0q-aNBLbQ'
      ],
      weights: ['100g', '250g', '500g'],
      weight_prices: {
        '100g': 149,
        '250g': 349,
        '500g': 649
      },
      rating: 4.8,
      review_count: 3,
      is_bestseller: true,
      is_new: false,
      tagline: 'Delicate and perfectly crunchy',
      nutritional_info: {
        calories: '347 kcal',
        protein: '9.7g',
        fiber: '14.5g',
        fat: '0.1g'
      },
      status: 'Active'
    },
    {
      id: 'aged-cheddar-herb',
      name: 'Aged Cheddar & Herb',
      description: 'Rich, savory profile with premium aged cheddar and a blend of organic herbs scatter-dusted beautifully.',
      price: 389,
      original_price: 429,
      category: 'Flavoured',
      flavors: ['Cheese'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBpX6KqIkd4aGLgWBUKzrmD2Q5i5rlv1_NMZqu4KSkS1WHJ2jxozKLS9BURwvjst8VcBo8reqRoN9UhKLrDzCuZOq5l4Vm0Xo0PPOPzGYXmGNPbVktqouHkgkDI9XxEwy6bPYWo0E634IkX3cZRK3pU0d-zcx78dGXywOWip4GDs-VwavWBLFgpC6YbzBKB56ahX3UgM2shrOosvB2ehIJBkjy-Wb9KmGlyyjBOoEhvrq_0chKG9QVWg',
      gallery_images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBBpX6KqIkd4aGLgWBUKzrmD2Q5i5rlv1_NMZqu4KSkS1WHJ2jxozKLS9BURwvjst8VcBo8reqRoN9UhKLrDzCuZOq5l4Vm0Xo0PPOPzGYXmGNPbVktqouHkgkDI9XxEwy6bPYWo0E634IkX3cZRK3pU0d-zcx78dGXywOWip4GDs-VwavWBLFgpC6YbzBKB56ahX3UgM2shrOosvB2ehIJBkjy-Wb9KmGlyyjBOoEhvrq_0chKG9QVWg'
      ],
      weights: ['100g', '250g', '500g'],
      weight_prices: {
        '100g': 169,
        '250g': 389,
        '500g': 729
      },
      rating: 4.7,
      review_count: 1,
      is_bestseller: false,
      is_new: false,
      tagline: 'Savory cheese delight',
      nutritional_info: {
        calories: '390 kcal',
        protein: '10.2g',
        fiber: '12.8g',
        fat: '4.5g'
      },
      status: 'Active'
    },
    {
      id: 'premium-raw-phool',
      name: 'Premium Raw Phool',
      description: 'Unroasted, raw lotus seeds. Ideal for cooking authentic curries, kheer, or roasting at home.',
      price: 599,
      original_price: 699,
      category: 'Plain',
      flavors: [],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3qNYzTGVKHqibfdRoCjWoVL1W1xMxcJXVueJ8SDASbkfYI5SmxKmV_-7GAax1YSEWpGAhHE6l7AuziuxXyBuny6tj6v_PrkdtMjYmix8iivpI8HsFy2MUoDvy-hN_kWPB0UV1f0sOTw63zbPBJvhZMefS2iP07s5LvHycFpBQENYmtH1YpcJg_PxVy2LZdMAJSRj7vOJiZ_APU_voXfUvX9-ICrgZaaXwdrJBfKcmNuRLO971PFWHPg',
      gallery_images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD3qNYzTGVKHqibfdRoCjWoVL1W1xMxcJXVueJ8SDASbkfYI5SmxKmV_-7GAax1YSEWpGAhHE6l7AuziuxXyBuny6tj6v_PrkdtMjYmix8iivpI8HsFy2MUoDvy-hN_kWPB0UV1f0sOTw63zbPBJvhZMefS2iP07s5LvHycFpBQENYmtH1YpcJg_PxVy2LZdMAJSRj7vOJiZ_APU_voXfUvX9-ICrgZaaXwdrJBfKcmNuRLO971PFWHPg'
      ],
      weights: ['250g', '500g', '1kg'],
      weight_prices: {
        '250g': 179,
        '500g': 329,
        '1kg': 599
      },
      rating: 4.9,
      review_count: 1,
      is_bestseller: false,
      is_new: true,
      tagline: 'Pristine raw fox nuts',
      nutritional_info: {
        calories: '310 kcal',
        protein: '11.1g',
        fiber: '16.0g',
        fat: '0.1g'
      },
      status: 'Active'
    },
    {
      id: 'classic-raw-makhana',
      name: 'Classic Raw Makhana',
      description: 'The pure, unadulterated crunch of nature. Lightly airy, raw phool makhana ready for custom seasoning.',
      price: 199,
      original_price: 249,
      category: 'Plain',
      flavors: [],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBT3lfMzCIqYySdIXGHmYYJEhvR_MENrENhVwKei1Qcgi1G_1o1aFHUObYbWgvWShC-UPm1DArLelvtkoM8U9o2IRwHgA3Ji58sI6NDtXILTiSECVDiev1OqyLSfYmHefU4x7VmqwtH5cK9PS870GBLUVl2tPziLlgWdbPxBENkV3x9_NrtWeAxgslJNUbOWSAy85W9XRbhl98aILphq6wwEf0hHh2WwDKLR2F4X6NNPfeO0KZsMYWBag',
      gallery_images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBT3lfMzCIqYySdIXGHmYYJEhvR_MENrENhVwKei1Qcgi1G_1o1aFHUObYbWgvWShC-UPm1DArLelvtkoM8U9o2IRwHgA3Ji58sI6NDtXILTiSECVDiev1OqyLSfYmHefU4x7VmqwtH5cK9PS870GBLUVl2tPziLlgWdbPxBENkV3x9_NrtWeAxgslJNUbOWSAy85W9XRbhl98aILphq6wwEf0hHh2WwDKLR2F4X6NNPfeO0KZsMYWBag'
      ],
      weights: ['100g', '250g', '500g'],
      weight_prices: {
        '100g': 99,
        '250g': 199,
        '500g': 379
      },
      rating: 4.6,
      review_count: 0,
      is_bestseller: false,
      is_new: false,
      tagline: 'Standard airy superfood',
      nutritional_info: {
        calories: '315 kcal',
        protein: '10.8g',
        fiber: '15.2g',
        fat: '0.1g'
      },
      status: 'Active'
    },
    {
      id: 'smoked-peri-peri',
      name: 'Smoked Peri-Peri Makhana',
      description: 'Bold, spicy, and roasted with authentic hot African bird-eye chili blend. Irresistible smoky tang!',
      price: 279,
      original_price: 329,
      category: 'Flavoured',
      flavors: ['Peri Peri'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9Wsnj84UebVbOWYW8aChTcdEpCLjduYjSDQJUHS4CvIlLyJn8mvy5O1HOD0Ei5EKDn90WpFmK3VqOFbWgmKJT_siLqlmZFc-fhxFaQ5Mdtz1SDuZTnwd6P_GgpRJNmnDUDXSXWNA4ZWvwyvpC5IMU1J1fAjN9EQayxgNFCnmOvUMeScGUzq0y3eLpgLYbr3SL93ZIrdyMxWDoJ-v8dZd1XqYt46lSanl4WCwkHUvsFq34WQbVSwMXEQ',
      gallery_images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD9Wsnj84UebVbOWYW8aChTcdEpCLjduYjSDQJUHS4CvIlLyJn8mvy5O1HOD0Ei5EKDn90WpFmK3VqOFbWgmKJT_siLqlmZFc-fhxFaQ5Mdtz1SDuZTnwd6P_GgpRJNmnDUDXSXWNA4ZWvwyvpC5IMU1J1fAjN9EQayxgNFCnmOvUMeScGUzq0y3eLpgLYbr3SL93ZIrdyMxWDoJ-v8dZd1XqYt46lSanl4WCwkHUvsFq34WQbVSwMXEQ'
      ],
      weights: ['100g', '250g', '500g'],
      weight_prices: {
        '100g': 129,
        '250g': 279,
        '500g': 519
      },
      rating: 4.8,
      review_count: 0,
      is_bestseller: true,
      is_new: false,
      tagline: 'Zesty smoked bird-eye chili',
      nutritional_info: {
        calories: '365 kcal',
        protein: '9.5g',
        fiber: '13.9g',
        fat: '1.2g'
      },
      status: 'Active'
    },
    {
      id: 'heritage-tasting-box',
      name: 'Heritage Tasting Box',
      description: 'An elegant premium green gift pack featuring an assortment of our best-selling roasted and seasoned Makhanas.',
      price: 899,
      original_price: 999,
      category: 'Gift Packs',
      flavors: [],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJXFR3KdlRMguX5dgzWG3eyPFsfcvuHZucWY5JywKIjSYUl1S9v-op5eetwjmwmKGJNB0u40qzyqH57ag26tMXA3BTXz_nQq6XQffo1QyMYIUnk-fScHsSv06qSF2c29zSfdIkJVbQxrBvpB5CB9PaRK_abV3ohv2lw0P__qKRpuMGJzI9E2pkgs-wFQSkliynI7KIgJGSF13K8mDedq8Vv9QjKqXS2GyF8HqDVi1Z3UBWK8j2be95PQ',
      gallery_images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAJXFR3KdlRMguX5dgzWG3eyPFsfcvuHZucWY5JywKIjSYUl1S9v-op5eetwjmwmKGJNB0u40qzyqH57ag26tMXA3BTXz_nQq6XQffo1QyMYIUnk-fScHsSv06qSF2c29zSfdIkJVbQxrBvpB5CB9PaRK_abV3ohv2lw0P__qKRpuMGJzI9E2pkgs-wFQSkliynI7KIgJGSF13K8mDedq8Vv9QjKqXS2GyF8HqDVi1Z3UBWK8j2be95PQ'
      ],
      weights: ['1 Pack'],
      weight_prices: {
        '1 Pack': 899
      },
      rating: 4.9,
      review_count: 0,
      is_bestseller: false,
      is_new: false,
      tagline: 'Exquisite festive gifting box',
      nutritional_info: {
        calories: 'N/A',
        protein: 'Mixed Pack',
        fiber: 'High Fiber',
        fat: 'Low Fat'
      },
      status: 'Active'
    }
  ];

  const { error } = await supabase
    .from('products')
    .insert(seedData);
    
  if (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
}

export async function seedDefaultReviews() {
  if (!supabase) return;
  const reviewsSeed = [
    {
      product_id: 'himalayan-pink-salt',
      user_name: 'Aarav Sharma',
      rating: 5,
      date: '2026-06-15',
      comment: 'Absolutely brilliant crunch and the pink salt taste is very balanced!'
    },
    {
      product_id: 'himalayan-pink-salt',
      user_name: 'Priya Patel',
      rating: 5,
      date: '2026-07-02',
      comment: 'Very high quality, large seeds. Best makhana brand I have tasted.'
    },
    {
      product_id: 'himalayan-pink-salt',
      user_name: 'Rohan Mehra',
      rating: 5,
      date: '2026-07-10',
      comment: 'Pure, clean, and delicious snack. Sourced from authentic ponds!'
    },
    {
      product_id: 'aged-cheddar-herb',
      user_name: 'Meera Sen',
      rating: 5,
      date: '2026-05-18',
      comment: 'Smells amazing! The real cheese powder makes a huge difference.'
    },
    {
      product_id: 'premium-raw-phool',
      user_name: 'Karan J.',
      rating: 5,
      date: '2026-07-01',
      comment: 'Very large white seeds with minimal waste. Extremely pure.'
    }
  ];

  await supabase.from('reviews').insert(reviewsSeed);
}

async function mapAndAttachReviews(productsData: any[]): Promise<Product[]> {
  if (!supabase) return [];
  
  // Fetch reviews to attach
  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('*');

  const allReviews = reviewsData || [];

  return productsData.map((row: any) => {
    const prod = mapDbProductToProduct(row);
    prod.reviews = allReviews
      .filter((r: any) => r.product_id === prod.id)
      .map((r: any) => ({
        id: r.id,
        userName: r.user_name || 'Anonymous',
        rating: Number(r.rating) || 5,
        date: r.date || new Date().toISOString().split('T')[0],
        comment: r.comment || ''
      }));
    prod.reviewCount = prod.reviews.length;
    if (prod.reviewCount > 0) {
      prod.rating = Number((prod.reviews.reduce((sum: number, r: any) => sum + Number(r.rating), 0) / prod.reviewCount).toFixed(1));
    }
    return prod;
  });
}

export async function fetchProducts(): Promise<Product[]> {
  if (!supabase) return [];
  try {
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'Active');

    if (productsError) throw productsError;

    if (!productsData || productsData.length === 0) {
      console.log('Products table empty. Seeding defaults...');
      await seedDefaultProducts();
      try {
        await seedDefaultReviews();
      } catch (reviewErr) {
        console.error('Failed to seed default reviews:', reviewErr);
      }
      
      const { data: reFetched, error: reError } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'Active');
        
      if (reError) throw reError;
      return mapAndAttachReviews(reFetched || []);
    }

    return mapAndAttachReviews(productsData || []);
  } catch (err) {
    console.error('Error fetching products from Supabase:', err);
    throw err;
  }
}

// ====================================================================
// PRODUCT ADMIN MUTATIONS (Add / Edit / Delete from Admin Dashboard)
// ====================================================================

export async function addProductToDb(product: Product): Promise<Product> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const row = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    original_price: product.originalPrice || null,
    category: product.category,
    flavors: product.flavors,
    image: product.image,
    gallery_images: product.galleryImages,
    weights: product.weights,
    weight_prices: product.weightPrices,
    rating: product.rating,
    review_count: product.reviewCount,
    is_bestseller: product.isBestseller || false,
    is_new: product.isNew ?? true,
    tagline: product.tagline || null,
    nutritional_info: product.nutritionalInfo || null,
    stock_quantity: product.stock ?? 100,
    status: 'Active'
  };

  const { data, error } = await supabase
    .from('products')
    .insert([row])
    .select('*')
    .single();

  if (error) throw error;

  return mapDbProductToProduct(data);
}

export async function updateProductInDb(product: Product): Promise<Product> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const row = {
    name: product.name,
    description: product.description,
    price: product.price,
    original_price: product.originalPrice || null,
    category: product.category,
    flavors: product.flavors,
    image: product.image,
    gallery_images: product.galleryImages,
    weights: product.weights,
    weight_prices: product.weightPrices,
    is_bestseller: product.isBestseller || false,
    tagline: product.tagline || null,
    nutritional_info: product.nutritionalInfo || null,
    stock_quantity: product.stock ?? 100,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('products')
    .update(row)
    .eq('id', product.id)
    .select('*')
    .single();

  if (error) throw error;

  return mapDbProductToProduct(data);
}

export async function deleteProductFromDb(productId: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) throw error;
}

// ====================================================================
// USER REVIEWS
// ====================================================================

export async function submitProductReview(
  productId: string,
  userId: string | undefined,
  userName: string,
  rating: number,
  comment: string
): Promise<Review> {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const reviewRow = {
    product_id: productId,
    user_id: userId || null,
    user_name: userName,
    rating: rating,
    comment: comment,
    date: new Date().toISOString().split('T')[0]
  };

  const { data, error } = await supabase
    .from('reviews')
    .insert([reviewRow])
    .select('*')
    .single();

  if (error) throw error;

  return {
    id: data.id,
    userName: data.user_name,
    rating: Number(data.rating),
    comment: data.comment,
    date: data.date
  };
}

// ====================================================================
// USER PROFILE & ADDRESS MANAGEMENT
// ====================================================================

export async function fetchUserProfile(userId: string): Promise<AppUser | null> {
  if (!supabase) return null;
  try {
    let { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile from Supabase:', error);
    }

    if (!profile) {
      // Automatic profile auto-creation if not found
      console.log(`Profile for user ID ${userId} not found in profiles table. Auto-creating from Auth metadata...`);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!userError && user && user.id === userId) {
        const metadata = user.user_metadata || {};
        const fullName = metadata.full_name || metadata.fullName || user.email?.split('@')[0] || 'Bihar Bite Customer';
        const mobile = metadata.mobile || '';
        
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{
            id: userId,
            full_name: fullName,
            email: user.email,
            mobile: mobile,
            status: 'Active',
            saved_addresses: []
          }])
          .select('*')
          .maybeSingle();
          
        if (insertError) {
          console.error('Error auto-creating profile in database table:', insertError);
        } else if (newProfile) {
          profile = newProfile;
          console.log('Successfully auto-created profile record for user:', user.email);
        }
      }
    }

    if (!profile) {
      console.warn('Could not retrieve or create profile for user ID:', userId);
      return null;
    }

    // Fetch order history
    const orderHistory = await fetchUserOrders(userId);

    return {
      id: profile.id,
      fullName: profile.full_name || 'Bihar Bite User',
      email: profile.email || '',
      mobile: profile.mobile || '',
      status: (profile.status as 'Active' | 'Suspended') || 'Active',
      dateRegistered: profile.created_at ? new Date(profile.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      orderHistory: orderHistory,
      savedAddresses: profile.saved_addresses || []
    };
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return null;
  }
}

export async function updateUserProfile(
  userId: string,
  fullName: string,
  mobile: string,
  savedAddresses: any[]
): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      mobile: mobile,
      saved_addresses: savedAddresses,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) throw error;
  return true;
}

export async function changeUserPassword(password: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
  return true;
}

// ====================================================================
// ORDERS & ORDER ITEMS DATABASE MANAGEMENT
// ====================================================================

export async function fetchUserOrders(userId: string): Promise<Order[]> {
  if (!supabase) return [];
  try {
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;
    if (!ordersData || ordersData.length === 0) return [];

    const orderIds = ordersData.map(o => o.id);

    // Fetch order items for these orders
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .in('order_id', orderIds);

    if (itemsError) throw itemsError;

    const allItems = itemsData || [];

    return ordersData.map((orderRow: any) => {
      const items = allItems
        .filter(item => item.order_id === orderRow.id)
        .map(item => ({
          productId: item.product_id,
          name: item.name,
          quantity: Number(item.quantity),
          weight: item.weight,
          price: Number(item.price)
        }));

      return {
        id: orderRow.id,
        date: orderRow.date || new Date(orderRow.created_at).toISOString().split('T')[0],
        status: orderRow.order_status,
        total: Number(orderRow.total),
        customerName: orderRow.customer_name,
        customerEmail: orderRow.customer_email,
        customerMobile: orderRow.customer_mobile || undefined,
        shippingAddress: orderRow.shipping_address,
        paymentMethod: orderRow.payment_method || 'Card',
        paymentStatus: orderRow.payment_status || 'Paid',
        trackingStatus: orderRow.tracking_status || 'Order Placed',
        items: items
      } as any; // Cast as any to include extended database tracking properties dynamically
    });
  } catch (err) {
    console.error('Error fetching user orders:', err);
    return [];
  }
}

export async function createOrderInDb(
  userId: string | null,
  customerName: string,
  customerEmail: string,
  customerMobile: string,
  shippingAddress: string,
  total: number,
  items: { productId: string; name: string; quantity: number; weight: string; price: number }[]
): Promise<Order> {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  // 1. Insert order row
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([{
      user_id: userId || null,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_mobile: customerMobile,
      shipping_address: shippingAddress,
      total: total,
      order_status: 'Pending',
      tracking_status: 'Order Placed',
      payment_method: 'Card',
      payment_status: 'Paid',
      date: new Date().toISOString().split('T')[0]
    }])
    .select('*')
    .single();

  if (orderError) throw orderError;

  // 2. Insert order items
  const itemsRows = items.map(item => ({
    order_id: orderData.id,
    product_id: item.productId,
    name: item.name,
    quantity: item.quantity,
    weight: item.weight,
    price: item.price
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsRows);

  if (itemsError) throw itemsError;

  return {
    id: orderData.id,
    date: orderData.date,
    status: 'Pending',
    total: total,
    customerName: customerName,
    customerEmail: customerEmail,
    customerMobile: customerMobile,
    shippingAddress: shippingAddress,
    items: items
  };
}

// ====================================================================
// INQUIRIES & NEWSLETTER SERVICES
// ====================================================================

const LOCAL_CONTACTS_KEY = 'bihar_bite_contact_messages';
const LOCAL_SUBSCRIBERS_KEY = 'bihar_bite_newsletter_subscribers';

function getLocalInquiries(key: string, initial: any[] = []): any[] {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
}

function saveLocalInquiries(key: string, data: any[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export async function submitContactMessage(message: {
  fullName: string;
  email: string;
  phone?: string;
  inquiryType?: string;
  message: string;
  subscribeNewsletter?: boolean;
}) {
  const row = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
    full_name: message.fullName,
    email: message.email,
    phone: message.phone || null,
    inquiry_type: message.inquiryType || 'Retail Inquiry',
    message: message.message,
    subscribe_newsletter: message.subscribeNewsletter !== false,
    status: 'Pending',
    admin_notes: '',
    created_at: new Date().toISOString()
  };

  if (supabase && isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([row])
      .select('*')
      .single();
    if (error) {
      console.error('Supabase contact save failed:', error);
      throw error;
    }
    const local = getLocalInquiries(LOCAL_CONTACTS_KEY);
    saveLocalInquiries(LOCAL_CONTACTS_KEY, [data || row, ...local]);
    return data || row;
  }

  // Fallback if not configured
  const local = getLocalInquiries(LOCAL_CONTACTS_KEY);
  saveLocalInquiries(LOCAL_CONTACTS_KEY, [row, ...local]);
  return row;
}

export async function submitNewsletterSubscriber(email: string) {
  const row = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
    email: email.trim().toLowerCase(),
    status: 'Active',
    created_at: new Date().toISOString()
  };

  if (supabase && isSupabaseConfigured) {
    try {
      const { data: existing, error: checkError } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('email', row.email)
        .maybeSingle();

      if (checkError) throw checkError;
      if (existing) return existing;

      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert([row])
        .select('*')
        .single();
      if (error) throw error;
      const local = getLocalInquiries(LOCAL_SUBSCRIBERS_KEY);
      if (!local.some(s => s.email === row.email)) {
        saveLocalInquiries(LOCAL_SUBSCRIBERS_KEY, [data || row, ...local]);
      }
      return data || row;
    } catch (err) {
      console.error('Supabase subscriber save failed, using local storage fallback:', err);
    }
  }

  const local = getLocalInquiries(LOCAL_SUBSCRIBERS_KEY);
  if (!local.some(s => s.email === row.email)) {
    saveLocalInquiries(LOCAL_SUBSCRIBERS_KEY, [row, ...local]);
  }
  return row;
}

export async function fetchInquiriesFromDb(table: 'contact_messages' | 'newsletter_subscribers') {
  let localKey = '';
  if (table === 'contact_messages') localKey = LOCAL_CONTACTS_KEY;
  else if (table === 'newsletter_subscribers') localKey = LOCAL_SUBSCRIBERS_KEY;

  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data) {
        saveLocalInquiries(localKey, data);
        return data;
      }
    } catch (err) {
      console.error(`Fetch ${table} from Supabase failed, using local storage backup:`, err);
    }
  }

  const seedInquiries: Record<string, any[]> = {
    [LOCAL_CONTACTS_KEY]: [
      { id: 'c-1', full_name: 'Aman Verma', email: 'aman.verma@outlook.com', phone: '+91 91234 56789', inquiry_type: 'Retail Inquiry', message: 'Hi Bihar Bite! Do you deliver to remote areas in Assam? My mother really loves roasted phool makhana and we want to try your Himalayan Pink Salt selection.', status: 'Pending', admin_notes: '', created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
      { id: 'c-2', full_name: 'Sanjana Sen', email: 'sanjana@gmail.com', phone: '+91 88776 65544', inquiry_type: 'Feedback', message: 'The Aged Cheddar Foxnuts are incredibly cheesy! Can you add a larger 1kg jar option for families? We finished 250g in one evening.', status: 'Reviewed', admin_notes: 'Followed up via phone on 2026-07-16.', created_at: new Date(Date.now() - 3600000 * 18).toISOString() }
    ],
    [LOCAL_SUBSCRIBERS_KEY]: [
      { id: 's-1', email: 'rohanbhattacharya173@gmail.com', status: 'Active', created_at: new Date(Date.now() - 3600000 * 1).toISOString() },
      { id: 's-2', email: 'hello@biharbite.com', status: 'Active', created_at: new Date(Date.now() - 3600000 * 100).toISOString() }
    ]
  };

  return getLocalInquiries(localKey, seedInquiries[localKey] || []);
}

export async function updateInquiryStatusInDb(
  table: 'contact_messages' | 'newsletter_subscribers',
  id: string,
  newStatus: 'Pending' | 'Reviewed' | 'Resolved' | 'Active' | 'Unsubscribed',
  adminNotes?: string
) {
  let localKey = '';
  if (table === 'contact_messages') localKey = LOCAL_CONTACTS_KEY;
  else if (table === 'newsletter_subscribers') localKey = LOCAL_SUBSCRIBERS_KEY;

  const updatePayload: any = { status: newStatus };
  if (adminNotes !== undefined) {
    updatePayload.admin_notes = adminNotes;
  }

  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from(table)
        .update(updatePayload)
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) throw error;
      if (data) {
        const local = getLocalInquiries(localKey);
        const updated = local.map(item => item.id === id ? data : item);
        saveLocalInquiries(localKey, updated);
        return data;
      }
    } catch (err) {
      console.error(`Update ${table} in Supabase failed, fallback to local:`, err);
    }
  }

  const local = getLocalInquiries(localKey);
  const updated = local.map(item => item.id === id ? { ...item, ...updatePayload } : item);
  saveLocalInquiries(localKey, updated);
  return updated.find(item => item.id === id);
}
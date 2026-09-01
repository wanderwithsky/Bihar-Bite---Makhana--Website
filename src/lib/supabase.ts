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
    video: row.video || undefined,
    galleryImages: (row.video ? [row.video] : []).concat(Array.isArray(row.gallery_images) ? row.gallery_images : []),
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
    console.log('[PRODUCTS] Fetching from Supabase...');
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'Active');

    if (productsError) {
      console.error('Supabase products error:', productsError);
      throw productsError;
    }

    console.log('[PRODUCTS] Supabase products:', productsData);
    console.log('[PRODUCTS] Product count:', productsData?.length);
    console.log('[PRODUCTS] Product IDs:', productsData?.map(p => p.id || p.product_id));

    if (!productsData || productsData.length === 0) {
      return [];
    }

    return mapAndAttachReviews(productsData);
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
            saved_addresses: [],
            avatar_url: null,
            preferences: { orderUpdates: true, emailNotifications: true, marketingOffers: false }
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
      savedAddresses: profile.saved_addresses || [],
      avatarUrl: profile.avatar_url,
      preferences: profile.preferences || { orderUpdates: true, emailNotifications: true, marketingOffers: false }
    };
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return null;
  }
}

export async function fetchAllProfiles(): Promise<AppUser[]> {
  if (!supabase) return [];
  try {
    // Check if there is a frontend admin session
    const adminSessionRaw = localStorage.getItem('bihar_bite_admin_session');
    let isAdmin = false;
    if (adminSessionRaw) {
      try {
        const adminSession = JSON.parse(adminSessionRaw);
        isAdmin = adminSession?.email === 'admin@biharbite.com';
      } catch (e) {
        console.error('Error parsing admin session:', e);
      }
    }

    let data, error;

    if (isAdmin) {
      // Securely fetch all profiles via RPC
      const res = await supabase.rpc('get_admin_profiles', { admin_secret: 'admin123' });
      data = res.data;
      error = res.error;
    } else {
      // Normal RLS restricted fetch (will only return the user's own profile)
      const res = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      data = res.data;
      error = res.error;
    }

    if (error) throw error;
    return data as AppUser[];
  } catch (err) {
    console.error('Error fetching all profiles:', err);
    return [];
  }
}



export async function deleteGuestCustomer(email: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    // Anonymize the guest customer data in the orders table to "delete" them 
    // from the Guest Customers directory without destroying historical order records.
    const { error } = await supabase
      .from('orders')
      .update({
        customer_name: 'Deleted Guest',
        customer_email: `deleted_${Date.now()}@guest.com`,
        customer_mobile: null,
        shipping_address: 'Deleted'
      })
      .is('user_id', null)
      .ilike('customer_email', email);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error deleting guest customer:', err);
    return false;
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<any>
): Promise<boolean> {
  if (!supabase) return false;
  
  const payload: any = { updated_at: new Date().toISOString() };
  if (updates.fullName !== undefined) payload.full_name = updates.fullName;
  if (updates.mobile !== undefined) payload.mobile = updates.mobile;
  if (updates.savedAddresses !== undefined) payload.saved_addresses = updates.savedAddresses;
  if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;
  if (updates.preferences !== undefined) payload.preferences = updates.preferences;

  const { error } = await supabase
    .from('profiles')
    .update(payload)
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
        items: items,
        customerId: orderRow.user_id
      } as any; // Cast as any to include extended database tracking properties dynamically
    });
  } catch (err) {
    console.error('Error fetching user orders:', err);
    return [];
  }
}

export async function fetchAllOrders(): Promise<Order[]> {
  if (!supabase) return [];
  try {
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
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
        items: items,
        customerId: orderRow.user_id
      } as any; // Cast as any to include extended database tracking properties dynamically
    });
  } catch (err) {
    console.error('Error fetching all orders for admin:', err);
    throw err;
  }
}

export async function createOrderInDb(
  userId: string | null,
  customerName: string,
  customerEmail: string,
  customerMobile: string,
  shippingAddress: string,
  total: number,
  items: { productId: string; name: string; quantity: number; weight: string; price: number }[],
  paymentMethod: string = 'cod',
  paymentStatus: string = 'Pending'
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
      payment_method: paymentMethod,
      payment_status: paymentStatus,
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

  if (itemsError) {
    // Rollback the order creation to prevent orphan orders
    await supabase.from('orders').delete().eq('id', orderData.id);
    throw itemsError;
  }

  return {
    id: orderData.id,
    date: orderData.date,
    status: 'Pending',
    total: total,
    customerName: customerName,
    customerEmail: customerEmail,
    customerMobile: customerMobile,
    shippingAddress: shippingAddress,
    items: items,
    customerId: userId || undefined
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
  name: string;
  phone_whatsapp: string;
  business_name?: string;
  city?: string;
  requirement?: string;
  quantity?: string;
  message: string;
}) {
  const row = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
    full_name: message.name,
    email: 'no-email-provided@example.com', // Dummy email to satisfy NOT NULL constraint
    phone: message.phone_whatsapp,
    inquiry_type: message.requirement || 'General Inquiry',
    message: message.message,
    subscribe_newsletter: false,
    status: 'Pending',
    admin_notes: '',
    created_at: new Date().toISOString(),
    business_name: message.business_name || null,
    city: message.city || null,
    requirement: message.requirement || null,
    quantity: message.quantity || null
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
  const normalizedEmail = email.trim().toLowerCase();

  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: normalizedEmail, subscribed: true }]);
        
      if (error) {
        if (error.code === '23505') { // Unique violation
          throw new Error('You\'re already subscribed to our newsletter.');
        }
        throw error;
      }
      return { email: normalizedEmail, subscribed: true };
    } catch (err: any) {
      console.error('Supabase subscriber save failed:', err);
      throw err;
    }
  }

  throw new Error("Unable to subscribe right now. Please try again.");
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
        if (table === 'newsletter_subscribers') {
          data.forEach(item => {
            if (item.status === undefined) {
              item.status = item.subscribed ? 'Active' : 'Unsubscribed';
            }
          });
        }
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

  const updatePayload: any = {};
  
  if (table === 'newsletter_subscribers') {
    updatePayload.subscribed = newStatus === 'Active';
  } else {
    updatePayload.status = newStatus;
  }

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

// ====================================================================
// WISHLIST MANAGEMENT
// ====================================================================

export async function fetchUserWishlist(userId: string): Promise<string[]> {
  if (!supabase) return [];
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return [];

    const { data, error } = await supabase
      .from('wishlist_items')
      .select('product_id')
      .eq('user_id', user.id);

    if (error) throw error;
    
    return data ? data.map(item => item.product_id) : [];
  } catch (err) {
    console.error('Error fetching user wishlist:', err);
    return [];
  }
}

export async function addToUserWishlist(userId: string, productId: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Not authenticated with Supabase. Cannot modify wishlist.');
    }

    const { error } = await supabase
      .from('wishlist_items')
      .insert([{ user_id: user.id, product_id: productId }]);

    if (error) {
      if (error.code === '23505') { // Unique violation
        return true; // Already exists
      }
      throw error;
    }
    return true;
  } catch (err) {
    console.error('Error adding to wishlist:', err);
    throw err;
  }
}

export async function removeFromUserWishlist(userId: string, productId: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Not authenticated with Supabase. Cannot modify wishlist.');
    }

    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error removing from wishlist:', err);
    throw err;
  }
}

export async function updateOrderStatusInDb(orderId: string, status: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ order_status: status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error("Update failed (0 rows affected). Check RLS policies.");
    
    return true;
  } catch (err) {
    console.error('Error updating order status:', err);
    return false;
  }
}
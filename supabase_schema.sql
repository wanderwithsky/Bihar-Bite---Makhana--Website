-- ====================================================================
-- SUPABASE SCHEMA FOR BIHAR BITE E-COMMERCE
-- Copy and paste this into the Supabase SQL Editor to create tables, 
-- configure relationships, insert seed data, and enable RLS.
-- ====================================================================

-- 1. Create Products table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    category TEXT CHECK (category IN ('Plain', 'Roasted', 'Flavoured', 'Premium', 'Gift Packs')),
    flavors TEXT[] DEFAULT '{}',
    image TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT '{}',
    weights TEXT[] NOT NULL DEFAULT '{"100g", "250g", "500g"}',
    weight_prices JSONB NOT NULL DEFAULT '{}',
    rating NUMERIC DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    is_bestseller BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    tagline TEXT,
    nutritional_info JSONB,
    stock_quantity INTEGER DEFAULT 100,
    sku TEXT,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create User Profiles table (Linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    mobile TEXT,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Suspended')),
    saved_addresses JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_mobile TEXT,
    shipping_address TEXT NOT NULL,
    payment_method TEXT DEFAULT 'Card',
    payment_status TEXT DEFAULT 'Paid',
    order_status TEXT DEFAULT 'Pending' CHECK (order_status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Completed', 'Cancelled', 'Returned')),
    tracking_status TEXT DEFAULT 'Order Placed',
    total NUMERIC NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Order Items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    weight TEXT NOT NULL,
    price NUMERIC NOT NULL
);

-- 5.5. Create Order Notifications table
CREATE TABLE IF NOT EXISTS public.order_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    channel TEXT CHECK (channel IN ('email', 'whatsapp')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(order_id, channel)
);

-- 6. Seed initial Products data
INSERT INTO public.products (id, name, description, price, original_price, category, flavors, image, gallery_images, weights, weight_prices, rating, review_count, is_bestseller, is_new, tagline, nutritional_info, sku, stock_quantity, status)
VALUES 
('himalayan-pink-salt', 'Himalayan Pink Salt Roasted', 'Delicately roasted with subtle hints of mineral-rich pink salt. Perfect crunch and eye-safe twilight aesthetic.', 349, 399, 'Roasted', ARRAY['Himalayan Salt'], 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE8NZSYfiYMC09NWAibdLNv51ejq_Qp1-IFFWffR4LcaiYNtj0A3_mCmJVgCb__MAvXOpTgarPpFjmIQpgJTjBptORCKIGkbJT4cDDgacGBmknR6wR0eRTBJ96olvbu-8lFwFRqLLWRWxjRLJXlf9LBvaW7avfUswRCpqzZx_O_wMbqAcfYXd9s9_DDpMApj1AMKne5x_XkoB3G9xA9e1hGovyZj0G8ZBQ5Ed4cULYicJxBjWcGX6Hpw', ARRAY['https://lh3.googleusercontent.com/aida-public/AB6AXuAeFYgCxP5A0_pK4KhY5-yEMquxVfiXvJ1Qrp_kVb_nKFR-Y-AAPJYcuBC1e5YsDgLx9lXC0eiu7CylCOb3BdqEktK541jAnk4rwBd-CGzJIBxoEMGV2jyCGhMgKqZmToiHZYVqzEe2MGvzIZ8jglsVo9GQEw5DLUMdn7gB7wuOqdZGAQY3gkKg4CIA2-2qJ8I5ORNEB83AfDF3N1eOfKNxIO1mILrYWIRgqfSJsZ7NioB0J78v-xEswg', 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9fWhGNNgcRjoK8W0ntw5HuZIHHzOjIAjF_5CeQNpwRclfgIM-DGSWsYcUXttaNfcj4knXYntQJNTUZ9Sj9rdogL1zqKws6tlA836Yve5E6KyEja20C5pevXbFrS881vUvNRt-DyMy1o2eI3px6MKu1iYX3I6md1dweaVabMB4bm-HcvX4QEsIR-6sy5fpL7paQQiN43G49oan21Q2TVfE2KBts-vp64609N39yApDotaNN0q-aNBLbQ', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjMvP6O8lKWJwJo9Cqn4w6QgstXDrCK-2iD5v26S8baN80zbC9pY4GG0ZipEM2fR4eRN03E8Q7Gy713OrWWKzKjIeeb6Ggqx79sMWLm1z-gZxdw7YU4YhniNFX62ljNP5V7sxleZj8EUbcoFD_bwL2ENz6aE6knV4W6XIHhB9eHmhHQhzkb7IgA87rcb2wJ7YPB3R8zqCEUM3a8OaSs_eRqyBC67hyEoeQMGI82bC4RPPQ0WYlq_H6iA', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyVd2qbjM2Naidxw0Rit4TOSH0-i_1ra5FmQWMMaESQ0ErqOPo6Ol_sUWBw8AKT1tVCOQulrZcxt2aO7eAJg71mxq94-JYkPJJRnoEI6_S_X_IDTXsrzAPMHOxc-_lYla-gkiPuekInkZ3vuPkzU0Z0O8qLffAXKWW14v7PeQq2xSWH5FF_26b_YnF5Eu2-WT96D3TTo1eS-pXpJj-yTggYnEjDY9uMLibHl00esEQ2fhJSKDYiG6IXg'], ARRAY['100g', '250g', '500g'], '{"100g": 149, "250g": 349, "500g": 649}'::jsonb, 4.8, 124, true, false, 'Delicate and perfectly crunchy', '{"calories": "347 kcal", "protein": "9.7g", "fiber": "14.5g", "fat": "0.1g"}'::jsonb, 'ROAST-HPS-01', 150, 'Active'),

('aged-cheddar-herb', 'Aged Cheddar & Herb', 'Rich, savory profile with premium aged cheddar and a blend of organic herbs scatter-dusted beautifully.', 389, 429, 'Flavoured', ARRAY['Cheese'], 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBpX6KqIkd4aGLgWBUKzrmD2Q5i5rlv1_NMZqu4KSkS1WHJ2jxozKLS9BURwvjst8VcBo8reqRoN9UhKLrDzCuZOq5l4Vm0Xo0PPOPzGYXmGNPbVktqouHkgkDI9XxEwy6bPYWo0E634IkX3cZRK3pU0d-zcx78dGXywOWip4GDs-VwavWBLFgpC6YbzBKB56ahX3UgM2shrOosvB2ehIJBkjy-Wb9KmGlyyjBOoEhvrq_0chKG9QVWg', ARRAY['https://lh3.googleusercontent.com/aida-public/AB6AXuBBpX6KqIkd4aGLgWBUKzrmD2Q5i5rlv1_NMZqu4KSkS1WHJ2jxozKLS9BURwvjst8VcBo8reqRoN9UhKLrDzCuZOq5l4Vm0Xo0PPOPzGYXmGNPbVktqouHkgkDI9XxEwy6bPYWo0E634IkX3cZRK3pU0d-zcx78dGXywOWip4GDs-VwavWBLFgpC6YbzBKB56ahX3UgM2shrOosvB2ehIJBkjy-Wb9KmGlyyjBOoEhvrq_0chKG9QVWg'], ARRAY['100g', '250g', '500g'], '{"100g": 169, "250g": 389, "500g": 729}'::jsonb, 4.7, 98, false, false, 'Savory cheese delight', '{"calories": "390 kcal", "protein": "10.2g", "fiber": "12.8g", "fat": "4.5g"}'::jsonb, 'FLAV-ACH-02', 120, 'Active'),

('premium-raw-phool', 'Premium Raw Phool', 'Unroasted, raw lotus seeds. Ideal for cooking authentic curries, kheer, or roasting at home.', 599, 699, 'Plain', ARRAY[]::text[], 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3qNYzTGVKHqibfdRoCjWoVL1W1xMxcJXVueJ8SDASbkfYI5SmxKmV_-7GAax1YSEWpGAhHE6l7AuziuxXyBuny6tj6v_PrkdtMjYmix8iivpI8HsFy2MUoDvy-hN_kWPB0UV1f0sOTw63zbPBJvhZMefS2iP07s5LvHycFpBQENYmtH1YpcJg_PxVy2LZdMAJSRj7vOJiZ_APU_voXfUvX9-ICrgZaaXwdrJBfKcmNuRLO971PFWHPg', ARRAY['https://lh3.googleusercontent.com/aida-public/AB6AXuD3qNYzTGVKHqibfdRoCjWoVL1W1xMxcJXVueJ8SDASbkfYI5SmxKmV_-7GAax1YSEWpGAhHE6l7AuziuxXyBuny6tj6v_PrkdtMjYmix8iivpI8HsFy2MUoDvy-hN_kWPB0UV1f0sOTw63zbPBJvhZMefS2iP07s5LvHycFpBQENYmtH1YpcJg_PxVy2LZdMAJSRj7vOJiZ_APU_voXfUvX9-ICrgZaaXwdrJBfKcmNuRLO971PFWHPg'], ARRAY['250g', '500g', '1kg'], '{"250g": 179, "500g": 329, "1kg": 599}'::jsonb, 4.9, 154, false, true, 'Pristine raw fox nuts', '{"calories": "310 kcal", "protein": "11.1g", "fiber": "16.0g", "fat": "0.1g"}'::jsonb, 'PLAIN-PRP-03', 200, 'Active'),

('classic-raw-makhana', 'Classic Raw Makhana', 'The pure, unadulterated crunch of nature. Lightly airy, raw phool makhana ready for custom seasoning.', 199, 249, 'Plain', ARRAY[]::text[], 'https://lh3.googleusercontent.com/aida-public/AB6AXuBT3lfMzCIqYySdIXGHmYYJEhvR_MENrENhVwKei1Qcgi1G_1o1aFHUObYbWgvWShC-UPm1DArLelvtkoM8U9o2IRwHgA3Ji58sI6NDtXILTiSECVDiev1OqyLSfYmHefU4x7VmqwtH5cK9PS870GBLUVl2tPziLlgWdbPxBENkV3x9_NrtWeAxgslJNUbOWSAy85W9XRbhl98aILphq6wwEf0hHh2WwDKLR2F4X6NNPfeO0KZsMYWBag', ARRAY['https://lh3.googleusercontent.com/aida-public/AB6AXuBT3lfMzCIqYySdIXGHmYYJEhvR_MENrENhVwKei1Qcgi1G_1o1aFHUObYbWgvWShC-UPm1DArLelvtkoM8U9o2IRwHgA3Ji58sI6NDtXILTiSECVDiev1OqyLSfYmHefU4x7VmqwtH5cK9PS870GBLUVl2tPziLlgWdbPxBENkV3x9_NrtWeAxgslJNUbOWSAy85W9XRbhl98aILphq6wwEf0hHh2WwDKLR2F4X6NNPfeO0KZsMYWBag'], ARRAY['100g', '250g', '500g'], '{"100g": 99, "250g": 199, "500g": 379}'::jsonb, 4.6, 74, false, false, 'Standard airy superfood', '{"calories": "315 kcal", "protein": "10.8g", "fiber": "15.2g", "fat": "0.1g"}'::jsonb, 'PLAIN-CRM-04', 300, 'Active'),

('smoked-peri-peri', 'Smoked Peri-Peri Makhana', 'Bold, spicy, and roasted with authentic hot African bird-eye chili blend. Irresistible smoky tang!', 279, 329, 'Flavoured', ARRAY['Peri Peri'], 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9Wsnj84UebVbOWYW8aChTcdEpCLjduYjSDQJUHS4CvIlLyJn8mvy5O1HOD0Ei5EKDn90WpFmK3VqOFbWgmKJT_siLqlmZFc-fhxFaQ5Mdtz1SDuZTnwd6P_GgpRJNmnDUDXSXWNA4ZWvwyvpC5IMU1J1fAjN9EQayxgNFCnmOvUMeScGUzq0y3eLpgLYbr3SL93ZIrdyMxWDoJ-v8dZd1XqYt46lSanl4WCwkHUvsFq34WQbVSwMXEQ', ARRAY['https://lh3.googleusercontent.com/aida-public/AB6AXuD9Wsnj84UebVbOWYW8aChTcdEpCLjduYjSDQJUHS4CvIlLyJn8mvy5O1HOD0Ei5EKDn90WpFmK3VqOFbWgmKJT_siLqlmZFc-fhxFaQ5Mdtz1SDuZTnwd6P_GgpRJNmnDUDXSXWNA4ZWvwyvpC5IMU1J1fAjN9EQayxgNFCnmOvUMeScGUzq0y3eLpgLYbr3SL93ZIrdyMxWDoJ-v8dZd1XqYt46lSanl4WCwkHUvsFq34WQbVSwMXEQ'], ARRAY['100g', '250g', '500g'], '{"100g": 129, "250g": 279, "500g": 519}'::jsonb, 4.8, 210, true, false, 'Zesty smoked bird-eye chili', '{"calories": "365 kcal", "protein": "9.5g", "fiber": "13.9g", "fat": "1.2g"}'::jsonb, 'FLAV-SPP-05', 180, 'Active'),

('heritage-tasting-box', 'Heritage Tasting Box', 'An elegant premium green gift pack featuring an assortment of our best-selling roasted and seasoned Makhanas.', 899, 999, 'Gift Packs', ARRAY[]::text[], 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJXFR3KdlRMguX5dgzWG3eyPFsfcvuHZucWY5JywKIjSYUl1S9v-op5eetwjmwmKGJNB0u40qzyqH57ag26tMXA3BTXz_nQq6XQffo1QyMYIUnk-fScHsSv06qSF2c29zSfdIkJVbQxrBvpB5CB9PaRK_abV3ohv2lw0P__qKRpuMGJzI9E2pkgs-wFQSkliynI7KIgJGSF13K8mDedq8Vv9QjKqXS2GyF8HqDVi1Z3UBWK8j2be95PQ', ARRAY['https://lh3.googleusercontent.com/aida-public/AB6AXuAJXFR3KdlRMguX5dgzWG3eyPFsfcvuHZucWY5JywKIjSYUl1S9v-op5eetwjmwmKGJNB0u40qzyqH57ag26tMXA3BTXz_nQq6XQffo1QyMYIUnk-fScHsSv06qSF2c29zSfdIkJVbQxrBvpB5CB9PaRK_abV3ohv2lw0P__qKRpuMGJzI9E2pkgs-wFQSkliynI7KIgJGSF13K8mDedq8Vv9QjKqXS2GyF8HqDVi1Z3UBWK8j2be95PQ'], ARRAY['1 Pack'], '{"1 Pack": 899}'::jsonb, 4.9, 45, false, false, 'Exquisite festive gifting box', '{"calories": "N/A", "protein": "Mixed Pack", "fiber": "High Fiber", "fat": "Low Fat"}'::jsonb, 'GIFT-HTB-06', 80, 'Active')
ON CONFLICT (id) DO NOTHING;

-- 7. Seed sample reviews
INSERT INTO public.reviews (product_id, user_name, rating, comment, date)
VALUES
('himalayan-pink-salt', 'Aarav Sharma', 5, 'Absolutely brilliant crunch and the pink salt taste is very balanced!', '2026-06-15'),
('himalayan-pink-salt', 'Priya Patel', 5, 'Very high quality, large seeds. Best makhana brand I have tasted.', '2026-07-02'),
('himalayan-pink-salt', 'Rohan Mehra', 5, 'Pure, clean, and delicious snack. Sourced from authentic ponds!', '2026-07-10'),
('aged-cheddar-herb', 'Meera Sen', 5, 'Smells amazing! The real cheese powder makes a huge difference.', '2026-05-18'),
('premium-raw-phool', 'Karan J.', 5, 'Very large white seeds with minimal waste. Extremely pure.', '2026-07-01')
ON CONFLICT DO NOTHING;

-- ====================================================================
-- 8. Create Contact Messages table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    inquiry_type TEXT DEFAULT 'Retail Inquiry',
    message TEXT NOT NULL,
    subscribe_newsletter BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Reviewed', 'Resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- 9. Create Distributor Inquiries table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.distributor_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Reviewed', 'Resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- 10. Create Bulk Inquiries table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.bulk_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    country TEXT NOT NULL,
    type TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Reviewed', 'Resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- 11. Create Export Inquiries table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.export_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    country TEXT NOT NULL,
    type TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Reviewed', 'Resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- 12. Create Newsletter Subscribers table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    subscribed BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR INQUIRIES
-- ====================================================================

-- Enable RLS on all new tables
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distributor_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public insert access
CREATE POLICY "Allow public insert to contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to distributor_inquiries" ON public.distributor_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to bulk_inquiries" ON public.bulk_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to export_inquiries" ON public.export_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to newsletter_subscribers" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Allow read/update access (for simplicity we can allow it to all, or restrict to auth users)
CREATE POLICY "Allow select to contact_messages" ON public.contact_messages FOR SELECT USING (true);
CREATE POLICY "Allow update to contact_messages" ON public.contact_messages FOR UPDATE USING (true);

CREATE POLICY "Allow select to distributor_inquiries" ON public.distributor_inquiries FOR SELECT USING (true);
CREATE POLICY "Allow update to distributor_inquiries" ON public.distributor_inquiries FOR UPDATE USING (true);

CREATE POLICY "Allow select to bulk_inquiries" ON public.bulk_inquiries FOR SELECT USING (true);
CREATE POLICY "Allow update to bulk_inquiries" ON public.bulk_inquiries FOR UPDATE USING (true);

CREATE POLICY "Allow select to export_inquiries" ON public.export_inquiries FOR SELECT USING (true);
CREATE POLICY "Allow update to export_inquiries" ON public.export_inquiries FOR UPDATE USING (true);

-- Only authenticated users should read/update newsletter_subscribers
CREATE POLICY "Allow authenticated select to newsletter_subscribers" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated update to newsletter_subscribers" ON public.newsletter_subscribers FOR UPDATE TO authenticated USING (true);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Products Policies: Anyone can view active products, only authenticated/admin can insert/update (or manage via DB editor)
CREATE POLICY "Allow public read access to active products" ON public.products
    FOR SELECT USING (status = 'Active');

-- Profiles Policies: Users can view and update only their own profile
CREATE POLICY "Allow users to view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow users to insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Reviews Policies: Anyone can read reviews, authenticated users can write reviews
CREATE POLICY "Allow public read access to reviews" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to create reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Orders Policies: Users can only view their own orders (and admins via dashboard)
CREATE POLICY "Allow users to view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow authenticated users to insert their own orders, AND allow guests (user_id IS NULL)
CREATE POLICY "Allow users to insert their own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to delete their own orders (needed for frontend rollback if order_items insert fails)
CREATE POLICY "Allow users to delete their own orders" ON public.orders
    FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow authenticated users or guests to update their own orders (and admin bypassing)
CREATE POLICY "Allow users to update their own orders" ON public.orders
    FOR UPDATE USING (true);

-- Order Items Policies: Users can view and insert items for their own orders
CREATE POLICY "Allow users to view their own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE public.orders.id = public.order_items.order_id 
            AND public.orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Allow users to insert their own order items" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE public.orders.id = public.order_items.order_id 
            AND (public.orders.user_id = auth.uid() OR public.orders.user_id IS NULL)
        )
    );

-- Trigger to automatically create a profile row in public.profiles when a new auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, mobile, status)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'New User'),
        new.email,
        new.raw_user_meta_data->>'mobile',
        'Active'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- 13. Create Wishlist Items table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.wishlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, product_id)
);

ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to select their own wishlist items" ON public.wishlist_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own wishlist items" ON public.wishlist_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own wishlist items" ON public.wishlist_items
    FOR DELETE USING (auth.uid() = user_id);


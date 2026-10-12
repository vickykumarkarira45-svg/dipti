-- ==========================================================
-- DESIHUT RESTAURANT (دیسی ہٹ) DATABASE SCHEMA FOR SUPABASE
-- Location: Banglow No A/2, Auto Bahn Rd, Latifabad Unit # 3, Latifabad, Hyderabad, Pakistan
-- Phone: 0314-3666277
-- ==========================================================

-- 1. Create Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL, -- Price in PKR (Rs.)
    description TEXT,
    image_url TEXT,
    is_veg BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    badge VARCHAR(50), -- e.g. "Chef's Special", "Bestseller", "Must Try"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    special_instructions TEXT,
    items JSONB NOT NULL, -- Array of items: [{id, title, price, qty, image_url}]
    total_amount DECIMAL(10, 2) NOT NULL, -- Total in PKR
    status VARCHAR(50) DEFAULT 'Pending' NOT NULL, -- 'Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies for Public Access (Anon key)
CREATE POLICY "Allow public read on menu_items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert on menu_items" ON public.menu_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on menu_items" ON public.menu_items FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on menu_items" ON public.menu_items FOR DELETE USING (true);

CREATE POLICY "Allow public read on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on orders" ON public.orders FOR DELETE USING (true);

-- 5. Seed Initial Authentic Desihut Dishes (from uploaded photos)
INSERT INTO public.menu_items (title, category, price, description, image_url, is_veg, is_available, badge) VALUES
('Desihut Special Mutton Handi', 'Handi Specials', 1850.00, 'Tender baby mutton simmered in a traditional clay handi with rich tomatoes, yogurt, fresh ginger juliennes, and a velvety cream swirl.', 'assets/special_handi.png', false, true, 'Chef''s Special'),
('Desihut Chicken Makhni Handi', 'Handi Specials', 1450.00, 'Boneless chicken cubes slow-cooked in pure butter and mild aromatic spices with a rich, silky gravy in an authentic earthenware pot.', 'assets/special_handi.png', false, true, 'Bestseller'),
('Charcoal Grilled Chicken Malai Boti', 'BBQ & Grills', 890.00, 'Supreme boneless chicken cubes marinated in fresh heavy cream, green cardamom, and mild spices, charcoal-grilled to tender perfection. Served with mint chutney.', 'assets/malai_boti_bbq.png', false, true, 'Must Try'),
('Desihut Reshmi Kabab Platter', 'BBQ & Grills', 850.00, 'Silky minced chicken skewers blended with fresh herbs and butter, barbecued over red-hot coals with fresh crisp onion rings and raita.', 'assets/malai_boti_bbq.png', false, true, 'Popular'),
('Royal Desihut Dastarkhwan Feast', 'Dastarkhwan & Mandi', 3950.00, 'The ultimate royal family platter (Serves 4-5)! A generous spread of aromatic Mandi/Kabsa rice, whole spiced roasted chicken/mutton, sizzling Shinwari Karahi, fresh naan, raita, and dips.', 'assets/royal_dastarkhwan_feast.png', false, true, 'Grand Feast'),
('Chicken Sajji with Fragrant Mandi Rice', 'Dastarkhwan & Mandi', 1650.00, 'Full slow-roasted marinated Balochi Sajji chicken served over steaming golden basmati rice, paired with special Desihut tomato salsa and raita.', 'assets/royal_dastarkhwan_feast.png', false, true, 'Signature'),
('Shinwari Mutton Karahi (Clay Wok)', 'Karahi Specials', 2450.00, 'Authentic Khyber Shinwari style fresh mutton wok cooked in pure animal fat, fresh vine tomatoes, green chillies, and coarse black pepper.', 'assets/royal_dastarkhwan_feast.png', false, true, 'Authentic'),
('Desihut Special Chicken Karahi', 'Karahi Specials', 1550.00, 'Traditional Pakistani chicken karahi tossed on high flame with fragrant ginger, roasted cumin, coriander seeds, and fresh green chillies.', 'assets/special_handi.png', false, true, 'Spicy'),
('Tandoori Roghani Naan (Sesame & Butter)', 'Tandoor & Breads', 90.00, 'Puffy, soft clay-oven baked bread brushed with golden desi butter and sprinkled with toasted sesame seeds.', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80', true, true, 'Tandoori'),
('Garlic Butter Naan', 'Tandoor & Breads', 110.00, 'Hot clay-oven flatbread infused with roasted garlic chunks, fresh coriander, and melted butter.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', true, true, 'Fresh'),
('Fresh Mint Margarita / Lemonade', 'Drinks & Desserts', 250.00, 'Ice-blended fresh garden mint leaves, fresh lime juice, black salt, and sparkling soda.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', true, true, 'Refreshing'),
('Desihut Shahi Matka Kheer / Kulfa', 'Drinks & Desserts', 280.00, 'Chilled traditional saffron and cardamom infused rice pudding served in earthen matka, topped with crushed almonds and pistachios.', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80', true, true, 'Sweet Delight');


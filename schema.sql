-- ==========================================
-- DIPTI'S RESTAURANT DATABASE SCHEMA FOR SUPABASE
-- ==========================================

-- 1. Create Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image_url TEXT,
    is_veg BOOLEAN DEFAULT true,
    is_available BOOLEAN DEFAULT true,
    badge VARCHAR(50), -- e.g. "Bestseller", "Spicy", "Chef Special"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    items JSONB NOT NULL, -- Array of ordered items with title, price, quantity
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' NOT NULL, -- 'Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies for Public Access
CREATE POLICY "Allow public read on menu_items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert on menu_items" ON public.menu_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on menu_items" ON public.menu_items FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on menu_items" ON public.menu_items FOR DELETE USING (true);

CREATE POLICY "Allow public read on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on orders" ON public.orders FOR DELETE USING (true);

-- 5. Seed Initial Sample Data
INSERT INTO public.menu_items (title, category, price, description, image_url, is_veg, is_available, badge) VALUES
('Truffle Mushroom Risotto', 'Main Course', 18.99, 'Creamy Arborio rice infused with wild forest mushrooms, black truffle oil, and shaved Parmesan.', 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80', true, true, 'Chef Special'),
('Artisanal Burrata Salad', 'Starters', 14.50, 'Fresh Italian burrata with heirloom tomatoes, basil pesto, balsamic reduction, and toasted sourdough.', 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19655?auto=format&fit=crop&w=800&q=80', true, true, 'Bestseller'),
('Pan-Seared Atlantic Salmon', 'Main Course', 24.00, 'Crispy skin salmon served over saffron cauliflower puree, charred asparagus, and lemon butter sauce.', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80', false, true, 'Popular'),
('Classic Margherita Pizza', 'Main Course', 15.00, 'Wood-fired sourdough crust, San Marzano tomato sauce, fresh mozzarella di bufala, and basil leaves.', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80', true, true, 'Classic'),
('Smoky Fiery Chicken Wings', 'Starters', 12.99, 'Glazed in house-made habanero honey sauce served with crisp celery and blue cheese dip.', 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80', false, true, 'Spicy'),
('Velvety Mango Tiramisu', 'Desserts', 8.99, 'Layered espresso ladyfingers with mascarpone cream and fresh Alphonso mango pulp infusion.', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80', true, true, 'Sweet Delight'),
('Matcha Pistachio Gelato', 'Desserts', 7.50, 'Artisanal slow-churned matcha green tea ice cream topped with crushed roasted pistachios.', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80', true, true, 'New'),
('Iced Passionfruit Mint Fizz', 'Beverages', 5.99, 'Refreshing blend of sparkling water, fresh passionfruit pulp, lime juice, and smashed mint.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', true, true, 'Refreshing'),
('Craft Berry Cold Brew Coffee', 'Beverages', 6.50, 'Single-origin Ethiopian cold brew coffee lightly sweetened with natural raspberry syrup.', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80', true, true, 'Energizing');

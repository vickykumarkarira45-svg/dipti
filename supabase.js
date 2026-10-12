/**
 * Supabase & Local DB Service Provider for Desihut Restaurant (دیسی ہٹ)
 * Provides CRUD operations for Menu Items and Orders.
 * Connects directly to Supabase with seamless localStorage fallback.
 */

const DEFAULT_SUPABASE_URL = 'https://uxoinirmwjryghfprewe.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4b2luaXJtd2pyeWdoZnByZXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3MTA3NjIsImV4cCI6MjEwNzI4Njc2Mn0.4AW7UmPwrs3YEbz4JvNNDR4PglhIOxb-T8eScRNQJTs';

const DESIHUT_DEFAULT_MENU = [
    {
        id: 'dh-1',
        title: 'Desihut Special Mutton Handi',
        category: 'Handi Specials',
        price: 1850,
        description: 'Tender baby mutton simmered in a traditional clay handi with rich tomatoes, yogurt, fresh ginger juliennes, and a velvety cream swirl.',
        image_url: 'assets/special_handi.png',
        is_veg: false,
        is_available: true,
        badge: "Chef's Special"
    },
    {
        id: 'dh-2',
        title: 'Desihut Chicken Makhni Handi',
        category: 'Handi Specials',
        price: 1450,
        description: 'Boneless chicken cubes slow-cooked in pure butter and mild aromatic spices with a rich, silky gravy in an authentic earthenware pot.',
        image_url: 'assets/special_handi.png',
        is_veg: false,
        is_available: true,
        badge: 'Bestseller'
    },
    {
        id: 'dh-3',
        title: 'Charcoal Grilled Chicken Malai Boti',
        category: 'BBQ & Grills',
        price: 890,
        description: 'Supreme boneless chicken cubes marinated in fresh heavy cream, green cardamom, and mild spices, charcoal-grilled to tender perfection. Served with mint chutney.',
        image_url: 'assets/malai_boti_bbq.png',
        is_veg: false,
        is_available: true,
        badge: 'Must Try'
    },
    {
        id: 'dh-4',
        title: 'Desihut Reshmi Kabab Platter',
        category: 'BBQ & Grills',
        price: 850,
        description: 'Silky minced chicken skewers blended with fresh herbs and butter, barbecued over red-hot coals with fresh crisp onion rings and raita.',
        image_url: 'assets/malai_boti_bbq.png',
        is_veg: false,
        is_available: true,
        badge: 'Popular'
    },
    {
        id: 'dh-5',
        title: 'Royal Desihut Dastarkhwan Feast',
        category: 'Dastarkhwan & Mandi',
        price: 3950,
        description: 'The ultimate royal family platter (Serves 4-5)! A generous spread of aromatic Mandi/Kabsa rice, whole spiced roasted chicken/mutton, sizzling Shinwari Karahi, fresh naan, raita, and dips.',
        image_url: 'assets/royal_dastarkhwan_feast.png',
        is_veg: false,
        is_available: true,
        badge: 'Grand Feast'
    },
    {
        id: 'dh-6',
        title: 'Chicken Sajji with Fragrant Mandi Rice',
        category: 'Dastarkhwan & Mandi',
        price: 1650,
        description: 'Full slow-roasted marinated Balochi Sajji chicken served over steaming golden basmati rice, paired with special Desihut tomato salsa and raita.',
        image_url: 'assets/royal_dastarkhwan_feast.png',
        is_veg: false,
        is_available: true,
        badge: 'Signature'
    },
    {
        id: 'dh-7',
        title: 'Shinwari Mutton Karahi (Clay Wok)',
        category: 'Karahi Specials',
        price: 2450,
        description: 'Authentic Khyber Shinwari style fresh mutton wok cooked in pure animal fat, fresh vine tomatoes, green chillies, and coarse black pepper.',
        image_url: 'assets/royal_dastarkhwan_feast.png',
        is_veg: false,
        is_available: true,
        badge: 'Authentic'
    },
    {
        id: 'dh-8',
        title: 'Desihut Special Chicken Karahi',
        category: 'Karahi Specials',
        price: 1550,
        description: 'Traditional Pakistani chicken karahi tossed on high flame with fragrant ginger, roasted cumin, coriander seeds, and fresh green chillies.',
        image_url: 'assets/special_handi.png',
        is_veg: false,
        is_available: true,
        badge: 'Spicy'
    },
    {
        id: 'dh-9',
        title: 'Tandoori Roghani Naan (Sesame & Butter)',
        category: 'Tandoor & Breads',
        price: 90,
        description: 'Puffy, soft clay-oven baked bread brushed with golden desi butter and sprinkled with toasted sesame seeds.',
        image_url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
        is_veg: true,
        is_available: true,
        badge: 'Tandoori'
    },
    {
        id: 'dh-10',
        title: 'Garlic Butter Naan',
        category: 'Tandoor & Breads',
        price: 110,
        description: 'Hot clay-oven flatbread infused with roasted garlic chunks, fresh coriander, and melted butter.',
        image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
        is_veg: true,
        is_available: true,
        badge: 'Fresh'
    },
    {
        id: 'dh-11',
        title: 'Fresh Mint Margarita / Lemonade',
        category: 'Drinks & Desserts',
        price: 250,
        description: 'Ice-blended fresh garden mint leaves, fresh lime juice, black salt, and sparkling soda.',
        image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
        is_veg: true,
        is_available: true,
        badge: 'Refreshing'
    },
    {
        id: 'dh-12',
        title: 'Desihut Shahi Matka Kheer / Kulfa',
        category: 'Drinks & Desserts',
        price: 280,
        description: 'Chilled traditional saffron and cardamom infused rice pudding served in earthen matka, topped with crushed almonds and pistachios.',
        image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
        is_veg: true,
        is_available: true,
        badge: 'Sweet Delight'
    }
];

class DBService {
    constructor() {
        this.supabaseClient = null;
        this.isSupabaseConnected = false;
        this.initSupabase();
        this.initLocalStorage();
    }

    getSupabaseConfig() {
        return {
            url: localStorage.getItem('desihut_sb_url') || DEFAULT_SUPABASE_URL,
            key: localStorage.getItem('desihut_sb_key') || DEFAULT_SUPABASE_KEY
        };
    }

    saveSupabaseConfig(url, key) {
        localStorage.setItem('desihut_sb_url', (url || '').trim());
        localStorage.setItem('desihut_sb_key', (key || '').trim());
        this.initSupabase();
    }

    initSupabase() {
        const { url, key } = this.getSupabaseConfig();
        if (url && key && window.supabase) {
            try {
                this.supabaseClient = window.supabase.createClient(url, key);
                console.log('Desihut DB: Initialized Supabase client for', url);
            } catch (err) {
                console.error('Supabase initialization failed:', err);
                this.supabaseClient = null;
            }
        } else {
            this.supabaseClient = null;
        }
    }

    initLocalStorage() {
        if (!localStorage.getItem('desihut_menu_items')) {
            localStorage.setItem('desihut_menu_items', JSON.stringify(DESIHUT_DEFAULT_MENU));
        }
        if (!localStorage.getItem('desihut_orders')) {
            localStorage.setItem('desihut_orders', JSON.stringify([]));
        }
    }

    // --- MENU ITEMS CRUD ---

    async getMenuItems() {
        if (this.supabaseClient) {
            try {
                const { data, error } = await this.supabaseClient
                    .from('menu_items')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (!error && data && data.length > 0) {
                    this.isSupabaseConnected = true;
                    return data;
                }
            } catch (err) {
                console.warn('Supabase menu fetch fell back to local cache:', err);
            }
        }
        return JSON.parse(localStorage.getItem('desihut_menu_items') || '[]');
    }

    async addMenuItem(item) {
        const newItem = {
            title: item.title,
            category: item.category,
            price: parseFloat(item.price),
            description: item.description || '',
            image_url: item.image_url || 'assets/special_handi.png',
            is_veg: Boolean(item.is_veg),
            is_available: item.is_available !== undefined ? Boolean(item.is_available) : true,
            badge: item.badge || ''
        };

        if (this.supabaseClient) {
            try {
                const { data, error } = await this.supabaseClient
                    .from('menu_items')
                    .insert([newItem])
                    .select();

                if (!error && data && data.length > 0) {
                    this.isSupabaseConnected = true;
                    const items = JSON.parse(localStorage.getItem('desihut_menu_items') || '[]');
                    items.unshift(data[0]);
                    localStorage.setItem('desihut_menu_items', JSON.stringify(items));
                    return data[0];
                }
            } catch (err) {
                console.warn('Supabase insert failed, storing locally:', err);
            }
        }

        newItem.id = 'dh-' + Date.now();
        const items = JSON.parse(localStorage.getItem('desihut_menu_items') || '[]');
        items.unshift(newItem);
        localStorage.setItem('desihut_menu_items', JSON.stringify(items));
        return newItem;
    }

    async updateMenuItem(id, updatedFields) {
        if (this.supabaseClient) {
            try {
                const { data, error } = await this.supabaseClient
                    .from('menu_items')
                    .update(updatedFields)
                    .eq('id', id)
                    .select();

                if (!error && data && data.length > 0) {
                    this.isSupabaseConnected = true;
                }
            } catch (err) {
                console.warn('Supabase update failed, updating local copy:', err);
            }
        }

        const items = JSON.parse(localStorage.getItem('desihut_menu_items') || '[]');
        const idx = items.findIndex(i => String(i.id) === String(id));
        if (idx !== -1) {
            items[idx] = { ...items[idx], ...updatedFields };
            localStorage.setItem('desihut_menu_items', JSON.stringify(items));
            return items[idx];
        }
        return null;
    }

    async deleteMenuItem(id) {
        if (this.supabaseClient) {
            try {
                const { error } = await this.supabaseClient
                    .from('menu_items')
                    .delete()
                    .eq('id', id);

                if (!error) this.isSupabaseConnected = true;
            } catch (err) {
                console.warn('Supabase delete failed, deleting locally:', err);
            }
        }

        let items = JSON.parse(localStorage.getItem('desihut_menu_items') || '[]');
        items = items.filter(i => String(i.id) !== String(id));
        localStorage.setItem('desihut_menu_items', JSON.stringify(items));
        return true;
    }

    // --- ORDERS CRUD ---

    async getOrders() {
        if (this.supabaseClient) {
            try {
                const { data, error } = await this.supabaseClient
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (!error && data) {
                    this.isSupabaseConnected = true;
                    return data;
                }
            } catch (err) {
                console.warn('Supabase orders fetch fell back to local cache:', err);
            }
        }
        return JSON.parse(localStorage.getItem('desihut_orders') || '[]');
    }

    async createOrder(orderData) {
        const orderId = 'DH-' + Math.floor(100000 + Math.random() * 900000);
        const newOrder = {
            id: orderId,
            customer_name: orderData.customer_name,
            phone: orderData.phone,
            address: orderData.address,
            special_instructions: orderData.special_instructions || '',
            items: orderData.items,
            total_amount: parseFloat(orderData.total_amount),
            status: 'Pending',
            created_at: new Date().toISOString()
        };

        if (this.supabaseClient) {
            try {
                const dbPayload = {
                    customer_name: newOrder.customer_name,
                    phone: newOrder.phone,
                    address: newOrder.address,
                    items: newOrder.items,
                    total_amount: newOrder.total_amount,
                    status: newOrder.status
                };

                const { data, error } = await this.supabaseClient
                    .from('orders')
                    .insert([dbPayload])
                    .select();

                if (!error && data && data.length > 0) {
                    this.isSupabaseConnected = true;
                    const savedOrder = data[0];
                    const orders = JSON.parse(localStorage.getItem('desihut_orders') || '[]');
                    orders.unshift(savedOrder);
                    localStorage.setItem('desihut_orders', JSON.stringify(orders));
                    return savedOrder;
                }
            } catch (err) {
                console.warn('Supabase order insert failed, saving to local store:', err);
            }
        }

        const orders = JSON.parse(localStorage.getItem('desihut_orders') || '[]');
        orders.unshift(newOrder);
        localStorage.setItem('desihut_orders', JSON.stringify(orders));
        return newOrder;
    }

    async updateOrderStatus(orderId, status) {
        if (this.supabaseClient) {
            try {
                const { data, error } = await this.supabaseClient
                    .from('orders')
                    .update({ status })
                    .eq('id', orderId)
                    .select();

                if (!error && data && data.length > 0) {
                    this.isSupabaseConnected = true;
                }
            } catch (err) {
                console.warn('Supabase update order status error:', err);
            }
        }

        const orders = JSON.parse(localStorage.getItem('desihut_orders') || '[]');
        const idx = orders.findIndex(o => String(o.id) === String(orderId));
        if (idx !== -1) {
            orders[idx].status = status;
            localStorage.setItem('desihut_orders', JSON.stringify(orders));
            return orders[idx];
        }
        return null;
    }

    async checkSupabaseHealth() {
        if (!this.supabaseClient) return { ok: false, message: 'Supabase client not initialized' };
        try {
            const { data, error } = await this.supabaseClient
                .from('menu_items')
                .select('count', { count: 'exact', head: true });
            
            if (error) {
                return { ok: false, error: error.message };
            }
            return { ok: true, message: 'Connected to Supabase menu_items table!' };
        } catch (e) {
            return { ok: false, error: e.message };
        }
    }
}

const dbService = new DBService();
window.dbService = dbService;

/**
 * Supabase & Local DB Service Provider for Dipti's Restaurant
 * Provides CRUD operations for Menu Items and Orders.
 * Seamlessly uses Supabase if configured, or falls back to localStorage.
 */

const DEFAULT_MENU_ITEMS = [
    {
        id: '1',
        title: 'Truffle Mushroom Risotto',
        category: 'Main Course',
        price: 18.99,
        description: 'Creamy Arborio rice infused with wild forest mushrooms, black truffle oil, and shaved Parmesan.',
        image_url: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80',
        is_veg: true,
        is_available: true,
        badge: 'Chef Special'
    },
    {
        id: '2',
        title: 'Artisanal Burrata Salad',
        category: 'Starters',
        price: 14.50,
        description: 'Fresh Italian burrata with heirloom tomatoes, basil pesto, balsamic reduction, and toasted sourdough.',
        image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19655?auto=format&fit=crop&w=800&q=80',
        is_veg: true,
        is_available: true,
        badge: 'Bestseller'
    },
    {
        id: '3',
        title: 'Pan-Seared Atlantic Salmon',
        category: 'Main Course',
        price: 24.00,
        description: 'Crispy skin salmon served over saffron cauliflower puree, charred asparagus, and lemon butter sauce.',
        image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
        is_veg: false,
        is_available: true,
        badge: 'Popular'
    },
    {
        id: '4',
        title: 'Classic Margherita Pizza',
        category: 'Main Course',
        price: 15.00,
        description: 'Wood-fired sourdough crust, San Marzano tomato sauce, fresh mozzarella di bufala, and basil leaves.',
        image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
        is_veg: true,
        is_available: true,
        badge: 'Classic'
    },
    {
        id: '5',
        title: 'Smoky Fiery Chicken Wings',
        category: 'Starters',
        price: 12.99,
        description: 'Glazed in house-made habanero honey sauce served with crisp celery and blue cheese dip.',
        image_url: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80',
        is_veg: false,
        is_available: true,
        badge: 'Spicy'
    },
    {
        id: '6',
        title: 'Velvety Mango Tiramisu',
        category: 'Desserts',
        price: 8.99,
        description: 'Layered espresso ladyfingers with mascarpone cream and fresh Alphonso mango pulp infusion.',
        image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
        is_veg: true,
        is_available: true,
        badge: 'Sweet Delight'
    },
    {
        id: '7',
        title: 'Matcha Pistachio Gelato',
        category: 'Desserts',
        price: 7.50,
        description: 'Artisanal slow-churned matcha green tea ice cream topped with crushed roasted pistachios.',
        image_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
        is_veg: true,
        is_available: true,
        badge: 'New'
    },
    {
        id: '8',
        title: 'Iced Passionfruit Mint Fizz',
        category: 'Beverages',
        price: 5.99,
        description: 'Refreshing blend of sparkling water, fresh passionfruit pulp, lime juice, and smashed mint.',
        image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
        is_veg: true,
        is_available: true,
        badge: 'Refreshing'
    },
    {
        id: '9',
        title: 'Craft Berry Cold Brew Coffee',
        category: 'Beverages',
        price: 6.50,
        description: 'Single-origin Ethiopian cold brew coffee lightly sweetened with natural raspberry syrup.',
        image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
        is_veg: true,
        is_available: true,
        badge: 'Energizing'
    }
];

class DBService {
    constructor() {
        this.supabaseClient = null;
        this.initSupabase();
        this.initLocalStorage();
    }

    getSupabaseConfig() {
        return {
            url: localStorage.getItem('dipti_sb_url') || '',
            key: localStorage.getItem('dipti_sb_key') || ''
        };
    }

    saveSupabaseConfig(url, key) {
        localStorage.setItem('dipti_sb_url', url.trim());
        localStorage.setItem('dipti_sb_key', key.trim());
        this.initSupabase();
    }

    initSupabase() {
        const { url, key } = this.getSupabaseConfig();
        if (url && key && window.supabase) {
            try {
                this.supabaseClient = window.supabase.createClient(url, key);
                console.log('Connected to Supabase DB');
            } catch (err) {
                console.error('Supabase initialization failed:', err);
                this.supabaseClient = null;
            }
        } else {
            this.supabaseClient = null;
        }
    }

    initLocalStorage() {
        if (!localStorage.getItem('dipti_menu_items')) {
            localStorage.setItem('dipti_menu_items', JSON.stringify(DEFAULT_MENU_ITEMS));
        }
        if (!localStorage.getItem('dipti_orders')) {
            localStorage.setItem('dipti_orders', JSON.stringify([]));
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
                    return data;
                }
            } catch (err) {
                console.warn('Supabase fetch failed, falling back to local DB:', err);
            }
        }
        return JSON.parse(localStorage.getItem('dipti_menu_items') || '[]');
    }

    async addMenuItem(item) {
        const newItem = {
            title: item.title,
            category: item.category,
            price: parseFloat(item.price),
            description: item.description || '',
            image_url: item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
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

                if (!error && data) {
                    return data[0];
                }
            } catch (err) {
                console.warn('Supabase insert failed, using local DB:', err);
            }
        }

        newItem.id = Date.now().toString();
        const items = JSON.parse(localStorage.getItem('dipti_menu_items') || '[]');
        items.unshift(newItem);
        localStorage.setItem('dipti_menu_items', JSON.stringify(items));
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

                if (!error && data) {
                    return data[0];
                }
            } catch (err) {
                console.warn('Supabase update failed, using local DB:', err);
            }
        }

        const items = JSON.parse(localStorage.getItem('dipti_menu_items') || '[]');
        const idx = items.findIndex(i => String(i.id) === String(id));
        if (idx !== -1) {
            items[idx] = { ...items[idx], ...updatedFields };
            localStorage.setItem('dipti_menu_items', JSON.stringify(items));
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

                if (!error) return true;
            } catch (err) {
                console.warn('Supabase delete failed, using local DB:', err);
            }
        }

        let items = JSON.parse(localStorage.getItem('dipti_menu_items') || '[]');
        items = items.filter(i => String(i.id) !== String(id));
        localStorage.setItem('dipti_menu_items', JSON.stringify(items));
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
                    return data;
                }
            } catch (err) {
                console.warn('Supabase order fetch failed, using local DB:', err);
            }
        }
        return JSON.parse(localStorage.getItem('dipti_orders') || '[]');
    }

    async createOrder(orderData) {
        const newOrder = {
            customer_name: orderData.customer_name,
            phone: orderData.phone,
            address: orderData.address,
            items: orderData.items,
            total_amount: parseFloat(orderData.total_amount),
            status: 'Pending',
            created_at: new Date().toISOString()
        };

        if (this.supabaseClient) {
            try {
                const { data, error } = await this.supabaseClient
                    .from('orders')
                    .insert([newOrder])
                    .select();

                if (!error && data) {
                    return data[0];
                }
            } catch (err) {
                console.warn('Supabase order insert failed, using local DB:', err);
            }
        }

        newOrder.id = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        const orders = JSON.parse(localStorage.getItem('dipti_orders') || '[]');
        orders.unshift(newOrder);
        localStorage.setItem('dipti_orders', JSON.stringify(orders));
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

                if (!error && data) {
                    return data[0];
                }
            } catch (err) {
                console.warn('Supabase update order status failed:', err);
            }
        }

        const orders = JSON.parse(localStorage.getItem('dipti_orders') || '[]');
        const idx = orders.findIndex(o => String(o.id) === String(orderId));
        if (idx !== -1) {
            orders[idx].status = status;
            localStorage.setItem('dipti_orders', JSON.stringify(orders));
            return orders[idx];
        }
        return null;
    }
}

const dbService = new DBService();
window.dbService = dbService;

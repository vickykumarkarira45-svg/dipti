/**
 * Dipti's Restaurant - Customer App Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // State
    let menuItems = [];
    let cart = JSON.parse(localStorage.getItem('dipti_cart') || '[]');
    let currentCategory = 'All';
    let searchQuery = '';

    // DOM Elements
    const menuGrid = document.getElementById('menuGrid');
    const categoryTabsContainer = document.getElementById('categoryTabs');
    const searchInput = document.getElementById('searchInput');
    const cartBtn = document.getElementById('cartBtn');
    const cartBadge = document.getElementById('cartBadge');
    const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
    const cartDrawer = document.getElementById('cartDrawer');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalElement = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
    const checkoutForm = document.getElementById('checkoutForm');
    const toastContainer = document.getElementById('toastContainer');

    // Initialize App
    init();

    async function init() {
        showLoading();
        try {
            menuItems = await window.dbService.getMenuItems();
            renderCategoryTabs();
            renderMenu();
            updateCartUI();
        } catch (err) {
            console.error('Failed to load menu items:', err);
            showToast('Error loading menu. Please refresh.', 'error');
        }
    }

    function showLoading() {
        menuGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Preparing the kitchen menu...</p>
            </div>
        `;
    }

    // Category Tabs Setup
    function renderCategoryTabs() {
        const categories = ['All', ...new Set(menuItems.map(item => item.category))];
        categoryTabsContainer.innerHTML = categories.map(cat => `
            <button class="cat-tab ${cat === currentCategory ? 'active' : ''}" data-category="${cat}">
                ${cat}
            </button>
        `).join('');

        categoryTabsContainer.querySelectorAll('.cat-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                categoryTabsContainer.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCategory = btn.dataset.category;
                renderMenu();
            });
        });
    }

    // Search Input Listener
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            renderMenu();
        });
    }

    // Render Menu Items
    function renderMenu() {
        const filtered = menuItems.filter(item => {
            const matchesCat = currentCategory === 'All' || item.category === currentCategory;
            const matchesSearch = item.title.toLowerCase().includes(searchQuery) || 
                                  item.description.toLowerCase().includes(searchQuery);
            return matchesCat && matchesSearch;
        });

        if (filtered.length === 0) {
            menuGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-utensils"></i>
                    <p>No dishes found matching your criteria.</p>
                </div>
            `;
            return;
        }

        menuGrid.innerHTML = filtered.map(item => {
            const isVegBadge = item.is_veg 
                ? `<span class="badge-tag badge-veg"><i class="fas fa-leaf"></i> VEG</span>`
                : `<span class="badge-tag badge-nonveg"><i class="fas fa-drumstick-bite"></i> NON-VEG</span>`;
            
            const highlightBadge = item.badge 
                ? `<span class="badge-tag badge-highlight">${item.badge}</span>` 
                : '';

            const isOut = !item.is_available;

            return `
                <div class="food-card ${isOut ? 'disabled' : ''}">
                    <div class="food-img-container">
                        <img src="${item.image_url}" alt="${item.title}" loading="lazy" onError="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'">
                        <div class="food-top-badges">
                            ${isVegBadge}
                            ${highlightBadge}
                        </div>
                        ${isOut ? `<div class="out-of-stock-overlay">OUT OF STOCK</div>` : ''}
                    </div>
                    <div class="food-content">
                        <div class="food-header">
                            <h3 class="food-title">${item.title}</h3>
                            <span class="food-price">$${parseFloat(item.price).toFixed(2)}</span>
                        </div>
                        <p class="food-desc">${item.description}</p>
                        <div class="food-footer">
                            <button class="btn btn-primary add-cart-btn" data-id="${item.id}" ${isOut ? 'disabled' : ''}>
                                <i class="fas fa-plus"></i> Add to Order
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Attach event listeners to Add to Cart buttons
        menuGrid.querySelectorAll('.add-cart-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = btn.dataset.id;
                addToCart(itemId);
            });
        });
    }

    // Cart Management Logic
    function addToCart(itemId) {
        const item = menuItems.find(i => String(i.id) === String(itemId));
        if (!item || !item.is_available) return;

        const existing = cart.find(c => String(c.id) === String(itemId));
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({
                id: item.id,
                title: item.title,
                price: parseFloat(item.price),
                image_url: item.image_url,
                qty: 1
            });
        }

        saveCart();
        updateCartUI();
        showToast(`Added "${item.title}" to cart!`);
    }

    function updateQty(itemId, delta) {
        const idx = cart.findIndex(c => String(c.id) === String(itemId));
        if (idx !== -1) {
            cart[idx].qty += delta;
            if (cart[idx].qty <= 0) {
                cart.splice(idx, 1);
            }
            saveCart();
            updateCartUI();
        }
    }

    function saveCart() {
        localStorage.setItem('dipti_cart', JSON.stringify(cart));
    }

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

        if (cartBadge) cartBadge.textContent = totalItems;
        if (cartTotalElement) cartTotalElement.textContent = `$${totalPrice.toFixed(2)}`;

        if (cartItemsContainer) {
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div style="text-align:center; padding: 40px 0; color: var(--text-dim);">
                        <i class="fas fa-shopping-bag" style="font-size: 2.5rem; margin-bottom: 12px; color: var(--text-muted);"></i>
                        <p>Your cart is empty.</p>
                    </div>
                `;
                if (checkoutBtn) checkoutBtn.disabled = true;
            } else {
                if (checkoutBtn) checkoutBtn.disabled = false;
                cartItemsContainer.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image_url}" class="cart-item-img" alt="${item.title}" onError="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'">
                        <div class="cart-item-info">
                            <div class="cart-item-title">${item.title}</div>
                            <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
                        </div>
                        <div class="qty-controls">
                            <button class="qty-btn" data-id="${item.id}" data-action="minus">-</button>
                            <span>${item.qty}</span>
                            <button class="qty-btn" data-id="${item.id}" data-action="plus">+</button>
                        </div>
                    </div>
                `).join('');

                cartItemsContainer.querySelectorAll('.qty-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.dataset.id;
                        const action = btn.dataset.action;
                        updateQty(id, action === 'plus' ? 1 : -1);
                    });
                });
            }
        }
    }

    // Drawer Toggles
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            cartDrawerOverlay.classList.add('active');
            cartDrawer.classList.add('active');
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }

    if (cartDrawerOverlay) {
        cartDrawerOverlay.addEventListener('click', (e) => {
            if (e.target === cartDrawerOverlay) closeCart();
        });
    }

    function closeCart() {
        cartDrawerOverlay.classList.remove('active');
        cartDrawer.classList.remove('active');
    }

    // Checkout Modal Setup
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            closeCart();
            checkoutModal.classList.add('active');
        });
    }

    if (closeCheckoutBtn) {
        closeCheckoutBtn.addEventListener('click', () => {
            checkoutModal.classList.remove('active');
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (cart.length === 0) return;

            const customerName = document.getElementById('custName').value.trim();
            const phone = document.getElementById('custPhone').value.trim();
            const address = document.getElementById('custAddress').value.trim();

            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

            const submitBtn = checkoutForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Placing Order...`;

            try {
                const orderData = {
                    customer_name: customerName,
                    phone: phone,
                    address: address,
                    items: cart,
                    total_amount: totalPrice
                };

                const createdOrder = await window.dbService.createOrder(orderData);

                // Reset state
                cart = [];
                saveCart();
                updateCartUI();
                checkoutForm.reset();
                checkoutModal.classList.remove('active');

                showToast(`🎉 Order ${createdOrder.id || 'placed'} successfully! Dipti's kitchen is on it!`, 'success');
            } catch (err) {
                console.error('Checkout error:', err);
                showToast('Failed to place order. Please try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `Confirm Order`;
            }
        });
    }

    // Toast Notification Utility
    function showToast(message, type = 'info') {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}" style="color: ${type === 'error' ? 'var(--nonveg-red)' : 'var(--veg-green)'}"></i>
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }
});

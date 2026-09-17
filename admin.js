/**
 * Dipti's Restaurant - Admin Panel Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Admin state
    let menuItems = [];
    let orders = [];
    let editingItemId = null;

    // DOM Elements
    const statRevenue = document.getElementById('statRevenue');
    const statOrders = document.getElementById('statOrders');
    const statActiveItems = document.getElementById('statActiveItems');
    const statOutStock = document.getElementById('statOutStock');

    const adminTabs = document.querySelectorAll('.admin-tab-btn');
    const tabContents = document.querySelectorAll('.admin-tab-content');

    const menuTableBody = document.getElementById('menuTableBody');
    const ordersTableBody = document.getElementById('ordersTableBody');

    const addDishBtn = document.getElementById('addDishBtn');
    const itemModal = document.getElementById('itemModal');
    const closeItemModalBtn = document.getElementById('closeItemModalBtn');
    const itemForm = document.getElementById('itemForm');
    const modalTitle = document.getElementById('modalTitle');

    const sbUrlInput = document.getElementById('sbUrl');
    const sbKeyInput = document.getElementById('sbKey');
    const saveSbConfigBtn = document.getElementById('saveSbConfigBtn');
    const toastContainer = document.getElementById('toastContainer');

    initAdmin();

    async function initAdmin() {
        loadSbSettings();
        await refreshData();

        // Setup Tabs
        adminTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                adminTabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.style.display = 'none');

                tab.classList.add('active');
                const target = document.getElementById(tab.dataset.tab);
                if (target) target.style.display = 'block';
            });
        });
    }

    async function refreshData() {
        try {
            menuItems = await window.dbService.getMenuItems();
            orders = await window.dbService.getOrders();

            updateStats();
            renderMenuTable();
            renderOrdersTable();
        } catch (err) {
            console.error('Failed to load admin data:', err);
            showToast('Error refreshing database data', 'error');
        }
    }

    // Dashboard Statistics Calculation
    function updateStats() {
        const totalRevenue = orders
            .filter(o => o.status !== 'Cancelled')
            .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

        const totalOrders = orders.length;
        const activeCount = menuItems.filter(i => i.is_available).length;
        const outStockCount = menuItems.filter(i => !i.is_available).length;

        if (statRevenue) statRevenue.textContent = `$${totalRevenue.toFixed(2)}`;
        if (statOrders) statOrders.textContent = totalOrders;
        if (statActiveItems) statActiveItems.textContent = activeCount;
        if (statOutStock) statOutStock.textContent = outStockCount;
    }

    // Render Menu Items Table
    function renderMenuTable() {
        if (!menuTableBody) return;

        if (menuItems.length === 0) {
            menuTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center; padding: 30px; color: var(--text-dim);">
                        No dishes found in menu database.
                    </td>
                </tr>
            `;
            return;
        }

        menuTableBody.innerHTML = menuItems.map(item => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <img src="${item.image_url}" style="width:48px; height:48px; border-radius:8px; object-fit:cover;" onError="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'">
                        <div>
                            <strong style="font-size: 0.95rem;">${item.title}</strong>
                            <div style="font-size: 0.75rem; color: var(--text-dim);">${item.badge || 'Standard'}</div>
                        </div>
                    </div>
                </td>
                <td><span class="badge-tag">${item.category}</span></td>
                <td><strong style="color: var(--accent-gold);">$${parseFloat(item.price).toFixed(2)}</strong></td>
                <td>
                    ${item.is_veg 
                        ? `<span class="badge-tag badge-veg">VEG</span>` 
                        : `<span class="badge-tag badge-nonveg">NON-VEG</span>`}
                </td>
                <td>
                    <label class="switch">
                        <input type="checkbox" class="toggle-stock-btn" data-id="${item.id}" ${item.is_available ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </td>
                <td>
                    <button class="btn btn-secondary edit-dish-btn" data-id="${item.id}" style="padding: 6px 12px; font-size: 0.8rem;">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger delete-dish-btn" data-id="${item.id}" style="padding: 6px 12px; font-size: 0.8rem; margin-left: 4px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // Attach listeners
        menuTableBody.querySelectorAll('.toggle-stock-btn').forEach(chk => {
            chk.addEventListener('change', async (e) => {
                const id = chk.dataset.id;
                const isAvailable = chk.checked;
                await window.dbService.updateMenuItem(id, { is_available: isAvailable });
                showToast(`Stock status updated for item!`);
                await refreshData();
            });
        });

        menuTableBody.querySelectorAll('.edit-dish-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                openEditModal(btn.dataset.id);
            });
        });

        menuTableBody.querySelectorAll('.delete-dish-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (confirm('Are you sure you want to delete this menu dish?')) {
                    await window.dbService.deleteMenuItem(btn.dataset.id);
                    showToast('Item deleted successfully');
                    await refreshData();
                }
            });
        });
    }

    // Render Orders Table
    function renderOrdersTable() {
        if (!ordersTableBody) return;

        if (orders.length === 0) {
            ordersTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center; padding: 30px; color: var(--text-dim);">
                        No customer orders received yet.
                    </td>
                </tr>
            `;
            return;
        }

        ordersTableBody.innerHTML = orders.map(ord => {
            const itemsSummary = (ord.items || []).map(i => `${i.title} x${i.qty}`).join(', ');
            const dateStr = ord.created_at ? new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent';

            return `
                <tr>
                    <td><strong>${ord.id || 'ORD-#'}</strong><br><small style="color:var(--text-muted);">${dateStr}</small></td>
                    <td>
                        <strong>${ord.customer_name}</strong><br>
                        <small style="color:var(--text-dim);"><i class="fas fa-phone"></i> ${ord.phone}</small>
                    </td>
                    <td style="max-width:200px; font-size:0.85rem; color:var(--text-dim);">${ord.address}</td>
                    <td style="max-width:220px; font-size:0.85rem;">${itemsSummary}</td>
                    <td><strong style="color:var(--accent-gold);">$${parseFloat(ord.total_amount).toFixed(2)}</strong></td>
                    <td>
                        <select class="form-control status-select" data-id="${ord.id}" style="padding: 6px 10px; font-size: 0.85rem; width: 130px;">
                            ${['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'].map(s => `
                                <option value="${s}" ${ord.status === s ? 'selected' : ''}>${s}</option>
                            `).join('')}
                        </select>
                    </td>
                </tr>
            `;
        }).join('');

        ordersTableBody.querySelectorAll('.status-select').forEach(sel => {
            sel.addEventListener('change', async () => {
                const orderId = sel.dataset.id;
                const newStatus = sel.value;
                await window.dbService.updateOrderStatus(orderId, newStatus);
                showToast(`Order ${orderId} status set to ${newStatus}`);
                await refreshData();
            });
        });
    }

    // Modal Add / Edit dish handling
    if (addDishBtn) {
        addDishBtn.addEventListener('click', () => {
            editingItemId = null;
            modalTitle.textContent = 'Add New Menu Item';
            itemForm.reset();
            itemModal.classList.add('active');
        });
    }

    if (closeItemModalBtn) {
        closeItemModalBtn.addEventListener('click', () => {
            itemModal.classList.remove('active');
        });
    }

    function openEditModal(id) {
        const item = menuItems.find(i => String(i.id) === String(id));
        if (!item) return;

        editingItemId = id;
        modalTitle.textContent = 'Edit Menu Item';
        document.getElementById('itemTitle').value = item.title;
        document.getElementById('itemCategory').value = item.category;
        document.getElementById('itemPrice').value = item.price;
        document.getElementById('itemBadge').value = item.badge || '';
        document.getElementById('itemDesc').value = item.description || '';
        document.getElementById('itemImg').value = item.image_url || '';
        document.getElementById('itemIsVeg').value = item.is_veg ? 'true' : 'false';

        itemModal.classList.add('active');
    }

    if (itemForm) {
        itemForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const itemData = {
                title: document.getElementById('itemTitle').value.trim(),
                category: document.getElementById('itemCategory').value,
                price: parseFloat(document.getElementById('itemPrice').value),
                badge: document.getElementById('itemBadge').value.trim(),
                description: document.getElementById('itemDesc').value.trim(),
                image_url: document.getElementById('itemImg').value.trim(),
                is_veg: document.getElementById('itemIsVeg').value === 'true'
            };

            if (editingItemId) {
                await window.dbService.updateMenuItem(editingItemId, itemData);
                showToast('Menu item updated successfully!');
            } else {
                await window.dbService.addMenuItem(itemData);
                showToast('New menu item added to database!');
            }

            itemModal.classList.remove('active');
            itemForm.reset();
            await refreshData();
        });
    }

    // Supabase Settings Form
    function loadSbSettings() {
        const { url, key } = window.dbService.getSupabaseConfig();
        if (sbUrlInput) sbUrlInput.value = url;
        if (sbKeyInput) sbKeyInput.value = key;
    }

    if (saveSbConfigBtn) {
        saveSbConfigBtn.addEventListener('click', async () => {
            const url = sbUrlInput.value;
            const key = sbKeyInput.value;
            window.dbService.saveSupabaseConfig(url, key);
            showToast('Supabase settings saved! Reloading data...');
            await refreshData();
        });
    }

    // Helper Toast
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

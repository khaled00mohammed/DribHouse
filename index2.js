tailwind.config = {
    theme: {
        extend: {
            fontFamily: { bebas: ['"Bebas Neue"', 'cursive'] },
            height: {
                'img-card': '260px',
                'cart-thumb': '64px',
            },
            width: {
                'cart-thumb': '64px',
                'cart-side': '420px',
            },
            maxWidth: {
                'modal': '420px',
                'cart-side': '96vw',
            },
            backgroundImage: {
                'cart-thumb-bg': 'linear-gradient(135deg, #e8d3b8, #d4a97a)',
                'nl-grad': 'linear-gradient(135deg, #221208, #3e2210)',
            },
            boxShadow: { 'cart': '-8px 0 40px rgba(0,0,0,0.25)' },
            zIndex: {
                'modal': '2000',
                'cart': '1050',
                'overlay': '1040',
                'toast': '9999',
            },
            animation: { 'marquee': 'marquee 20s linear infinite' },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
            },
        }
    }
}


let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() { localStorage.setItem('cart', JSON.stringify(cart)); }

function addToCart(name, price, emoji) {
    const found = cart.find(i => i.name === name);
    found ? found.qty++ : cart.push({ name, price, emoji, qty: 1 });
    renderCart();
    saveCart();
    showToast(`✅ "${name}" added to cart`);
    const b = document.getElementById('cartBadge');
    b.style.transform = 'scale(1.6)';
    setTimeout(() => b.style.transform = 'scale(1)', 250);
}

function renderCart() {
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const count = cart.reduce((s, i) => s + i.qty, 0);
    document.getElementById('cartBadge').textContent = count;

    const itemsEl = document.getElementById('cartItems');
    const footerEl = document.getElementById('cartFooter');

    if (!cart.length) {
        itemsEl.innerHTML = `
          <div class="text-center py-5 text-stone-400">
            <i class="fas fa-shopping-bag text-5xl text-stone-200 mb-3"></i>
            <p class="mt-3">Your cart is empty.<br/>Start shopping!</p>
          </div>`;
        footerEl.classList.add('hidden');
        return;
    }

    footerEl.classList.remove('hidden');
    document.getElementById('cartTotal').textContent = '$' + total.toFixed(2);
    itemsEl.innerHTML = cart.map((item, idx) => `
        <div class="d-flex align-items-center gap-3 py-3 border-b border-amber-100">
          <div class="rounded-xl d-flex align-items-center justify-content-center flex-shrink-0 w-cart-thumb h-cart-thumb bg-cart-thumb-bg text-3xl">${item.emoji}</div>
          <div class="flex-grow-1">
            <p class="font-bold text-stone-900 text-sm mb-1">${item.name}</p>
            <p class="text-amber-700 font-bebas tracking-wide">$${(item.price * item.qty).toFixed(2)}</p>
            <div class="d-flex align-items-center gap-2 mt-1">
              <button onclick="changeQty(${idx},-1)" class="border border-amber-300 rounded-full bg-amber-50 text-stone-700 font-bold text-xs w-6 h-6 d-flex align-items-center justify-content-center">−</button>
              <span class="font-bold text-sm">${item.qty}</span>
              <button onclick="changeQty(${idx},1)" class="border border-amber-300 rounded-full bg-amber-50 text-stone-700 font-bold text-xs w-6 h-6 d-flex align-items-center justify-content-center">+</button>
            </div>
          </div>
          <button onclick="removeItem(${idx})" class="text-stone-300 hover:text-red-500 border-0 bg-transparent"><i class="fas fa-trash-alt"></i></button>
        </div>`).join('');
}

function changeQty(idx, d) {
    cart[idx].qty += d;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    renderCart(); saveCart();
}

function removeItem(idx) {
    cart.splice(idx, 1);
    renderCart(); saveCart();
    showToast('🗑️ Item removed');
}

function openCart() {
    document.getElementById('cartSidebar').classList.remove('translate-x-full');
    document.getElementById('cartOverlay').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cartSidebar').classList.add('translate-x-full');
    document.getElementById('cartOverlay').classList.add('hidden');
    document.body.style.overflow = '';
}


function doFilter(cat, btn) {
    document.querySelectorAll('.filter-tab').forEach(b => {
        b.classList.remove('active', 'bg-amber-700', 'text-white');
        b.classList.add('bg-transparent', 'text-amber-900');
    });
    btn.classList.add('active', 'bg-amber-700', 'text-white');
    btn.classList.remove('bg-transparent', 'text-amber-900');

    const items = document.querySelectorAll('.product-item');
    let visible = 0;
    items.forEach(el => {
        const show = cat === 'all' || el.dataset.cat.includes(cat);
        el.style.display = show ? '' : 'none';
        if (show) visible++;
    });

    document.getElementById('resultCount').textContent =
        cat === 'all' ? `Showing all ${visible} products` : `Showing ${visible} product${visible !== 1 ? 's' : ''} in "${btn.textContent.trim()}"`;

    document.getElementById('noResults').classList.toggle('hidden', visible > 0);
}


function doSort(val) {
    const grid = document.getElementById('productsGrid');
    const items = [...grid.querySelectorAll('.product-item')];
    items.sort((a, b) => {
        if (val === 'price-asc') return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
        if (val === 'price-desc') return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
        if (val === 'name') return a.dataset.name.localeCompare(b.dataset.name);
        return 0;
    });
    items.forEach(el => grid.appendChild(el));
}


function showToast(msg) {
    const wrap = document.getElementById('toastContainer');
    const t = document.createElement('div');
    t.className = 'bg-stone-900 text-white px-4 py-2 rounded-xl text-sm font-semibold border-l-4 border-amber-700 max-w-xs';
    t.textContent = msg;
    wrap.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = '.3s'; }, 2500);
    setTimeout(() => t.remove(), 2800);
}


function openModal(id) {
    const m = document.getElementById(id);
    m.classList.remove('hidden'); m.classList.add('flex');
    document.body.style.overflow = 'hidden';
}
function closeModal(id) {
    const m = document.getElementById(id);
    m.classList.add('hidden'); m.classList.remove('flex');
    document.body.style.overflow = '';
}
function switchModal(a, b) { closeModal(a); openModal(b); }
function handleOverlayClick(e, id) { if (e.target === document.getElementById(id)) closeModal(id); }


renderCart();
document.getElementById('resultCount').textContent =
    `Showing all ${document.querySelectorAll('.product-item').length} products`;
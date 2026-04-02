tailwind.config = {
    theme: {
        extend: {
            fontFamily: { bebas: ['"Bebas Neue"', 'cursive'] },
            height: { 'img-card': '240px', 'cat-card': '250px', 'hero-card': '400px', 'cart-thumb': '64px' },
            width: { 'cart-thumb': '64px', 'cart-side': '420px' },
            maxWidth: { 'modal': '420px', 'nl-form': '460px', 'cart-side': '96vw' },
            backgroundImage: {
                'hero-grad': 'linear-gradient(135deg, #0c0805 0%, #3e2210 45%, #5e3516 75%, #0c0805 100%)',
                'cat-tshirt': 'linear-gradient(145deg, #3e2210, #7d4a1e)',
                'cat-jacket': 'linear-gradient(145deg, #5e3516, #a0622a)',
                'cat-pants': 'linear-gradient(145deg, #221208, #5e3516)',
                'cat-acc': 'linear-gradient(145deg, #7d4a1e, #d4a97a)',
                'cat-overlay': 'linear-gradient(to top, rgba(26,16,8,0.92), transparent)',
                'nl-grad': 'linear-gradient(135deg, #221208, #3e2210)',
                'cart-thumb-bg': 'linear-gradient(135deg, #e8d3b8, #d4a97a)',
            },
            boxShadow: { 'cart': '-8px 0 40px rgba(0,0,0,0.25)' },
            zIndex: { 'modal': '2000', 'cart': '1050', 'overlay': '1040', 'toast': '9999' },
            animation: { 'marquee': 'marquee 20s linear infinite' },
            keyframes: { marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } } },
        }
    }
}






let cart = JSON.parse(localStorage.getItem('cart')) || [];
function saveCart() { localStorage.setItem('cart', JSON.stringify(cart)); }

function addToCart(name, price, emoji) {
    const found = cart.find(i => i.name === name);
    found ? found.qty++ : cart.push({ name, price, emoji, qty: 1 });
    renderCart(); saveCart();
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
        itemsEl.innerHTML = `<div class="text-center py-5 text-stone-400"><i class="fas fa-shopping-bag text-5xl text-stone-200 mb-3"></i><p class="mt-3">Your cart is empty.<br/>Start shopping!</p></div>`;
        footerEl.classList.add('hidden'); return;
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

function changeQty(idx, d) { cart[idx].qty += d; if (cart[idx].qty <= 0) cart.splice(idx, 1); renderCart(); saveCart(); }
function removeItem(idx) { cart.splice(idx, 1); renderCart(); saveCart(); showToast('🗑️ Item removed'); }
function openCart() { document.getElementById('cartSidebar').classList.remove('translate-x-full'); document.getElementById('cartOverlay').classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
function closeCart() { document.getElementById('cartSidebar').classList.add('translate-x-full'); document.getElementById('cartOverlay').classList.add('hidden'); document.body.style.overflow = ''; }

function doFilter(cat, btn) {
    document.querySelectorAll('.filter-tab').forEach(b => { b.classList.remove('bg-amber-700', 'text-white'); b.classList.add('bg-transparent', 'text-amber-900'); });
    btn.classList.add('bg-amber-700', 'text-white'); btn.classList.remove('bg-transparent', 'text-amber-900');
    document.querySelectorAll('.product-item').forEach(el => { el.style.display = (cat === 'all' || el.dataset.cat.includes(cat)) ? '' : 'none'; });
}

function showToast(msg) {
    const wrap = document.getElementById('toastContainer');
    const t = document.createElement('div');
    t.className = 'bg-stone-900 text-white px-4 py-2 rounded-xl text-sm font-semibold border-l-4 border-amber-700 max-w-xs';
    t.textContent = msg; wrap.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = '.3s'; }, 2500);
    setTimeout(() => t.remove(), 2800);
}

function subscribe() {
    const val = document.getElementById('nlEmail').value;
    if (!val || !val.includes('@')) { showToast('❌ Enter a valid email'); return; }
    showToast('🎉 Subscribed! Thanks for joining.');
    document.getElementById('nlEmail').value = '';
}

// Fake Api By Helping Cloude AI :) //

function openModal(id) { const m = document.getElementById(id); m.classList.remove('hidden'); m.classList.add('flex'); document.body.style.overflow = 'hidden'; }
function closeModal(id) { const m = document.getElementById(id); m.classList.add('hidden'); m.classList.remove('flex'); document.body.style.overflow = ''; }
function switchModal(a, b) { closeModal(a); openModal(b); }
function handleOverlayClick(e, id) { if (e.target === document.getElementById(id)) closeModal(id); }


function getUsers() { return JSON.parse(localStorage.getItem('dh_users') || '[]'); }
function saveUsers(u) { localStorage.setItem('dh_users', JSON.stringify(u)); }
function getCurrentUser() { return JSON.parse(localStorage.getItem('dh_current_user') || 'null'); }
function setCurrentUser(u) { localStorage.setItem('dh_current_user', JSON.stringify(u)); }

function updateNavAuth() {
    const user = getCurrentUser();
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const navUserName = document.getElementById('navUserName');
    if (user) {
        authButtons.classList.add('d-none');
        userMenu.classList.remove('d-none');
        navUserName.textContent = user.firstName;
    } else {
        authButtons.classList.remove('d-none');
        userMenu.classList.add('d-none');
    }
}

function showErr(el, msg) { el.textContent = msg; el.classList.remove('hidden'); }

async function callClaudeAuth(prompt) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [{ role: 'user', content: prompt }]
        })
    });
    const data = await response.json();
    const text = data.content.map(i => i.text || '').join('');
    return JSON.parse(text.replace(/```json|```/g, '').trim());
}

async function handleRegister() {
    const firstName = document.getElementById('regFirstName').value.trim();
    const lastName = document.getElementById('regLastName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;
    const errEl = document.getElementById('registerError');
    const btn = document.getElementById('registerBtn');
    errEl.classList.add('hidden');

    if (!firstName || !lastName) return showErr(errEl, 'Please enter your full name.');
    if (!email || !email.includes('@')) return showErr(errEl, 'Please enter a valid email.');
    if (password.length < 6) return showErr(errEl, 'Password must be at least 6 characters.');
    if (password !== confirm) return showErr(errEl, 'Passwords do not match.');

    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase()))
        return showErr(errEl, 'This email is already registered. Please login.');

    btn.textContent = 'Creating account...';
    btn.disabled = true;

    try {
        const result = await callClaudeAuth(
            `You are the auth system for "Drip House" men's fashion store.
New registration: Name: ${firstName} ${lastName}, Email: ${email}
Respond ONLY with JSON (no markdown): {"success": true, "message": "short welcome message"} or {"success": false, "message": "reason"}.
Approve unless name/email is clearly invalid or inappropriate.`
        );
        if (result.success) {
            users.push({ firstName, lastName, email, password });
            saveUsers(users);
            setCurrentUser({ firstName, lastName, email });
            closeModal('registerModal');
            updateNavAuth();
            showToast(`🎉 ${result.message}`);
        } else {
            showErr(errEl, result.message);
        }
    } catch {
        // Fallback if API unavailable
        users.push({ firstName, lastName, email, password });
        saveUsers(users);
        setCurrentUser({ firstName, lastName, email });
        closeModal('registerModal');
        updateNavAuth();
        showToast(`🎉 Welcome to Drip House, ${firstName}!`);
    }

    btn.textContent = 'Create Account';
    btn.disabled = false;
}

async function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errEl = document.getElementById('loginError');
    const btn = document.getElementById('loginBtn');
    errEl.classList.add('hidden');

    if (!email || !email.includes('@')) return showErr(errEl, 'Please enter a valid email.');
    if (!password) return showErr(errEl, 'Please enter your password.');

    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return showErr(errEl, 'Incorrect email or password. Please try again.');

    btn.textContent = 'Logging in...';
    btn.disabled = true;

    try {
        const result = await callClaudeAuth(
            `You are the auth system for "Drip House" men's fashion store.
${user.firstName} ${user.lastName} just logged in successfully.
Respond ONLY with JSON (no markdown): {"message": "friendly welcome back message, max 8 words, include their first name"}`
        );
        showToast(`👋 ${result.message}`);
    } catch {
        showToast(`👋 Welcome back, ${user.firstName}!`);
    }

    setCurrentUser({ firstName: user.firstName, lastName: user.lastName, email: user.email });
    closeModal('loginModal');
    updateNavAuth();
    btn.textContent = 'Login';
    btn.disabled = false;
}

function logout() {
    localStorage.removeItem('dh_current_user');
    updateNavAuth();
    showToast('👋 Logged out. See you soon!');
}

renderCart();
updateNavAuth();
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.box1');
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('hidden');
            triggerScrollAnimations();
        }
    }, 900);

    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    function triggerScrollAnimations() {
        const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-bottom');
        revealElements.forEach(el => scrollObserver.observe(el));
    }

    const cards3D = document.querySelectorAll('.card-3d');
    cards3D.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
        });
    });

    let cart = [];
    let discountPercent = 0;
    const cartCounter = document.querySelector('.box22');
    const openCartBtn = document.getElementById('openCartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartModal = document.getElementById('cartModal');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalPrice = document.getElementById('cartTotalPrice');
    const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');
    const applyPromoBtn = document.getElementById('applyPromoBtn');
    const promoInput = document.getElementById('promoInput');
    const promoDiscountRow = document.getElementById('promoDiscountRow');
    const cartDiscountPrice = document.getElementById('cartDiscountPrice');

    const watchVideoBtn = document.getElementById('watchVideoBtn');
    const videoModal = document.getElementById('videoModal');
    const closeVideoBtn = document.getElementById('closeVideoBtn');

    const checkoutBtn = document.getElementById('checkoutBtn');
    const orderModal = document.getElementById('orderModal');
    const closeOrderBtn = document.getElementById('closeOrderBtn');
    const orderForm = document.getElementById('orderForm');

    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    function showToast(msg) {
        toastMessage.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    function updateCartUI() {
        let totalCount = 0;
        cart.forEach(item => totalCount += item.quantity);
        if (cartCounter) cartCounter.textContent = totalCount;

        if (cartItemsContainer) {
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="box348">Savatchangiz bo\'sh</p>';
                cartTotalPrice.textContent = '0 UZS';
                if (promoDiscountRow) promoDiscountRow.style.display = 'none';
            } else {
                cartItemsContainer.innerHTML = '';
                let rawTotal = 0;
                cart.forEach((item, index) => {
                    rawTotal += item.price * item.quantity;
                    const row = document.createElement('div');
                    row.className = 'cart-item-row';
                    row.innerHTML = `
                        <div class="cart-item-info">
                            <span class="cart-item-title">${item.name}</span>
                            <span class="cart-item-price">${(item.price * item.quantity).toLocaleString()} UZS</span>
                        </div>
                        <div class="cart-item-controls">
                            <button class="qty-btn" onclick="window.changeQty(${index}, -1)">-</button>
                            <span class="cart-item-qty">${item.quantity}</span>
                            <button class="qty-btn" onclick="window.changeQty(${index}, 1)">+</button>
                        </div>
                    `;
                    cartItemsContainer.appendChild(row);
                });

                if (discountPercent > 0) {
                    const discountValue = (rawTotal * discountPercent) / 100;
                    const finalTotal = rawTotal - discountValue;
                    if (promoDiscountRow) promoDiscountRow.style.display = 'flex';
                    if (cartDiscountPrice) cartDiscountPrice.textContent = `-${discountValue.toLocaleString()} UZS`;
                    cartTotalPrice.textContent = finalTotal.toLocaleString() + ' UZS';
                } else {
                    if (promoDiscountRow) promoDiscountRow.style.display = 'none';
                    cartTotalPrice.textContent = rawTotal.toLocaleString() + ' UZS';
                }
            }
        }
    }

    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', () => {
            const code = promoInput.value.trim().toUpperCase();
            if (code === 'LUXE10') {
                discountPercent = 10;
                showToast("10% chegirma promo-kodi qo'llanildi!");
                updateCartUI();
            } else if (code === '') {
                showToast("Iltimos, promo-kodni kiriting!");
            } else {
                showToast("Noto'g me'yorsiz promo-kod!");
            }
        });
    }

    window.changeQty = function(index, delta) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        updateCartUI();
    };

    function addToCart(name, price) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, quantity: 1 });
        }
        updateCartUI();
        showToast(`${name} savatchaga qo'shildi!`);
    }

    const basePrice = 450000;
    let selectedAddons = { height: 0, fill: 0, cover: 0 };
    let customPillowTitle = "Custom LuxeRest Pillow";

    const pillowCore = document.getElementById('pillowLayerCore');
    const pillowGel = document.getElementById('pillowLayerGel');
    const pillowCover = document.getElementById('pillowLayerCover');
    const priceDisplay = document.getElementById('customPillowPrice');

    function updateCustomizer() {
        const total = basePrice + selectedAddons.height + selectedAddons.fill + selectedAddons.cover;
        if (priceDisplay) priceDisplay.textContent = total.toLocaleString() + " UZS";
    }

    document.querySelectorAll('#heightOptions .box80').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#heightOptions .box80').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedAddons.height = parseInt(btn.getAttribute('data-add'));
            const h = btn.getAttribute('data-height');
            if (h === 'low') pillowCore.style.height = '100px';
            if (h === 'medium') pillowCore.style.height = '120px';
            if (h === 'high') pillowCore.style.height = '145px';
            updateCustomizer();
        });
    });

    document.querySelectorAll('#fillOptions .box80').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#fillOptions .box80').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedAddons.fill = parseInt(btn.getAttribute('data-add'));
            const f = btn.getAttribute('data-fill');
            if (f === 'gel') {
                pillowGel.style.opacity = '1';
                pillowCore.style.background = 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)';
            } else if (f === 'latex') {
                pillowGel.style.opacity = '0';
                pillowCore.style.background = 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)';
            } else {
                pillowGel.style.opacity = '0';
                pillowCore.style.background = 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)';
            }
            updateCustomizer();
        });
    });

    document.querySelectorAll('#coverOptions .box80').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#coverOptions .box80').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedAddons.cover = parseInt(btn.getAttribute('data-add'));
            const c = btn.getAttribute('data-cover');
            if (c === 'silk') pillowCover.style.borderColor = '#f59e0b';
            else if (c === 'cotton') pillowCover.style.borderColor = '#94a3b8';
            else pillowCover.style.borderColor = '#38bdf8';
            updateCustomizer();
        });
    });

    const addCustomBtn = document.getElementById('addCustomToCartBtn');
    if (addCustomBtn) {
        addCustomBtn.addEventListener('click', () => {
            const finalPrice = basePrice + selectedAddons.height + selectedAddons.fill + selectedAddons.cover;
            addCustomBtn.style.pointerEvents = 'none';
            const originalHTML = addCustomBtn.innerHTML;
            addCustomBtn.innerHTML = 'Loading...';

            setTimeout(() => {
                addCustomBtn.innerHTML = originalHTML;
                addCustomBtn.style.pointerEvents = 'auto';
                addToCart(customPillowTitle, finalPrice);
            }, 1500);
        });
    }

    const buyButtons = document.querySelectorAll('.box137, .box149, .box161, .box173, .box185, .box197');
    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseInt(button.getAttribute('data-price'));
            
            button.style.pointerEvents = 'none';
            const originalHTML = button.innerHTML;
            button.innerHTML = 'Loading...';

            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.pointerEvents = 'auto';
                addToCart(name, price);
            }, 1500);
        });
    });

    if (openCartBtn) openCartBtn.addEventListener('click', () => cartModal.classList.add('active'));
    if (closeCartBtn) closeCartBtn.addEventListener('click', () => cartModal.classList.remove('active'));

    if (watchVideoBtn) watchVideoBtn.addEventListener('click', () => videoModal.classList.add('active'));
    if (closeVideoBtn) closeVideoBtn.addEventListener('click', () => videoModal.classList.remove('active'));

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            orderModal.classList.add('active');
        });
    }

    if (cartCheckoutBtn) {
        cartCheckoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('Savatchangiz bo\'sh!');
                return;
            }
            cartModal.classList.remove('active');
            orderModal.classList.add('active');
        });
    }

    if (closeOrderBtn) closeOrderBtn.addEventListener('click', () => orderModal.classList.remove('active'));

    if (orderForm) {
        orderForm.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'submitOrderBtn') {
                e.preventDefault();
                const submitBtn = e.target;
                submitBtn.style.pointerEvents = 'none';
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Yuklanmoqda...';

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.pointerEvents = 'auto';
                    orderModal.classList.remove('active');
                    cart = [];
                    discountPercent = 0;
                    if (promoInput) promoInput.value = '';
                    updateCartUI();
                    showToast('Buyurtma yuborildi! Operator tez orada siz bilan bog\'lanadi.');
                }, 2000);
            }
        });
    }

    const quizOptions = document.querySelectorAll('.box209 button, .box215 button');
    quizOptions.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const parent = e.target.parentElement;
            parent.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    const quizResultBtn = document.getElementById('getQuizResult');
    const quizResultDiv = document.getElementById('quizResultBox');

    if (quizResultBtn) {
        quizResultBtn.addEventListener('click', () => {
            const pos = document.querySelector('.box209 button.active');
            const prob = document.querySelector('.box215 button.active');

            if (!pos || !prob) {
                showToast('Iltimos, ikkala savolga ham javob tanlang!');
                return;
            }

            quizResultBtn.style.pointerEvents = 'none';
            const originalHTML = quizResultBtn.innerHTML;
            quizResultBtn.innerHTML = 'Loading...';

            setTimeout(() => {
                quizResultBtn.innerHTML = originalHTML;
                quizResultBtn.style.pointerEvents = 'auto';

                let rec = 'Ergo Memory Pro';
                const probVal = prob.getAttribute('data-prob');
                if (probVal === 'heat') rec = 'Aqua Cool Gel Max';
                if (probVal === 'snore') rec = 'Silent Night Pro';

                if (quizResultDiv) {
                    quizResultDiv.textContent = `Siz uchun tavsiya etiladi: ${rec}!`;
                }
                showToast(`Natija tayyor: ${rec}`);
            }, 2000);
        });
    }

    const faqHeaders = document.querySelectorAll('.box297, .box303, .box309');
    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            item.classList.toggle('active');
        });
    });
});

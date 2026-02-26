// script.js - ПОЛНОСТЬЮ РАБОЧАЯ ВЕРСИЯ С МЯГКИМ КРАСНЫМ
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // =========================================================================
    // ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И ДАННЫЕ
    // =========================================================================
    
    let cartItems = [];
    let favoritesItems = [];
    let currentProductId = null;
    let currentPage = 'home';
    let searchVisible = false;
    let scrollPosition = 0;
    
    // Загружаем данные из localStorage
    try {
        const savedCart = localStorage.getItem('farmach_cart');
        if (savedCart) cartItems = JSON.parse(savedCart);
        
        const savedFavorites = localStorage.getItem('farmach_favorites');
        if (savedFavorites) favoritesItems = JSON.parse(savedFavorites);
    } catch (e) {
        console.log('Ошибка загрузки из localStorage');
    }
    
    // База данных товаров (реальная, с характеристиками)
    const products = [
        { 
            id: 1, 
            name: 'BioTech 190 Whey ZERO', 
            weight: '908 грамм', 
            price: 4400, 
            oldPrice: 5200,
            category: 'proteins', 
            subcategory: 'whey',
            brand: 'BioTech',
            rating: 4.8,
            reviews: 124,
            popular: true, 
            hit: true,
            new: false,
            discount: 15,
            inStock: 15,
            description: 'Высококачественный сывороточный протеин с нулевым содержанием жира и сахара. Идеально подходит для набора мышечной массы и восстановления после тренировок.',
            composition: 'Сывороточный протеин, лецитин, ароматизатор.',
            usage: 'Смешайте 30г порошка с 300мл воды или молока, принимайте 1-2 раза в день.',
            manufacturer: 'BioTech, США',
            image: 'https://avatars.mds.yandex.net/i?id=33ba6b29de784b95d7f38f015aaac9401a266dfc-10330387-images-thumbs&n=13'
        },
        { 
            id: 2, 
            name: 'Whey Gold Standard', 
            weight: '908 грамм', 
            price: 4800, 
            oldPrice: 5500,
            category: 'proteins', 
            subcategory: 'whey',
            brand: 'Optimum Nutrition',
            rating: 4.9,
            reviews: 256,
            popular: true, 
            hit: true,
            new: false,
            discount: 13,
            inStock: 8,
            description: 'Золотой стандарт сывороточного протеина. Содержит 24г белка и 5г BCAA в порции.',
            composition: 'Сывороточный протеин, пептиды, ароматизатор.',
            usage: '30г на 300мл воды, молока или сока.',
            manufacturer: 'Optimum Nutrition, США',
            image: 'https://avatars.mds.yandex.net/i?id=b1a459841f7785e564f36aaf6bab4cf0dcbc7e68-5656601-images-thumbs&n=13'
        },
        { 
            id: 3, 
            name: 'Syntra Micellar Creme', 
            weight: '907 грамм', 
            price: 4800, 
            oldPrice: 5300,
            category: 'proteins', 
            subcategory: 'casein',
            brand: 'Syntrax',
            rating: 4.7,
            reviews: 89,
            popular: true, 
            hit: false,
            new: false,
            discount: 9,
            inStock: 10,
            description: 'Мицеллярный казеин медленного усвоения. Идеален для приема на ночь.',
            composition: 'Мицеллярный казеин, какао, ароматизатор.',
            usage: '30г на 300мл воды или молока, принимать перед сном.',
            manufacturer: 'Syntrax, США',
            image: 'https://avatars.mds.yandex.net/i?id=b1a459841f7785e564f36aaf6bab4cf0dcbc7e68-5656601-images-thumbs&n=13'
        },
        { 
            id: 4, 
            name: 'Creatine Monohydrate', 
            weight: '300 грамм', 
            price: 2000, 
            oldPrice: 2500,
            category: 'creatine', 
            subcategory: 'monohydrate',
            brand: 'BioTech',
            rating: 4.9,
            reviews: 312,
            popular: true, 
            hit: true,
            new: false,
            discount: 20,
            inStock: 20,
            description: 'Микронизированный креатин моногидрат для увеличения силы и выносливости.',
            composition: '100% креатин моногидрат.',
            usage: '5г в день с водой или соком.',
            manufacturer: 'BioTech, США',
            image: 'https://avatars.mds.yandex.net/i?id=19b990a6105e29e35ecceb1dd27bc03205aaca16-5858290-images-thumbs&n=13'
        },
        { 
            id: 5, 
            name: 'BCAA 2:1:1', 
            weight: '400 грамм', 
            price: 2500, 
            oldPrice: 3000,
            category: 'bcaa', 
            subcategory: 'powder',
            brand: 'Optimum Nutrition',
            rating: 4.8,
            reviews: 178,
            popular: true, 
            hit: false,
            new: true,
            discount: 17,
            inStock: 12,
            description: 'Комплекс BCAA в соотношении 2:1:1 для защиты мышц и ускорения восстановления.',
            composition: 'L-лейцин, L-изолейцин, L-валин.',
            usage: '10г во время тренировки.',
            manufacturer: 'Optimum Nutrition, США',
            image: 'https://avatars.mds.yandex.net/i?id=6ff06bba283ffcad0547f958f00b2a37e1ca3da7-5680489-images-thumbs&n=13'
        },
        { 
            id: 6, 
            name: 'Vitamin Complex', 
            weight: '90 таблеток', 
            price: 1200, 
            oldPrice: 1500,
            category: 'vitamins', 
            subcategory: 'multivitamin',
            brand: 'Universal',
            rating: 4.6,
            reviews: 67,
            popular: false, 
            hit: false,
            new: true,
            discount: 20,
            inStock: 25,
            description: 'Полный комплекс витаминов и минералов для спортсменов.',
            composition: '12 витаминов и 8 минералов.',
            usage: '1 таблетка в день во время еды.',
            manufacturer: 'Universal Nutrition, США',
            image: 'https://avatars.mds.yandex.net/i?id=4e2350d833bcbeee847ba146e4ec7cec_sr-5142981-images-thumbs&n=13'
        },
        { 
            id: 7, 
            name: 'Whey Isolate', 
            weight: '2000 грамм', 
            price: 7600, 
            oldPrice: 8500,
            category: 'proteins', 
            subcategory: 'isolate',
            brand: 'Dymatize',
            rating: 4.9,
            reviews: 203,
            popular: false, 
            hit: true,
            new: false,
            discount: 11,
            inStock: 5,
            description: 'Изолят сывороточного протеина с высокой скоростью усвоения.',
            composition: 'Изолят сывороточного протеина, ароматизатор.',
            usage: '30г на 300мл воды.',
            manufacturer: 'Dymatize, США',
            image: 'https://avatars.mds.yandex.net/i?id=e6c885f4ecbb7803b8516b7360bdb7c0a2313959-12658662-images-thumbs&n=13'
        },
        { 
            id: 8, 
            name: 'L-Carnitine 3000', 
            weight: '1000 мл', 
            price: 1800, 
            oldPrice: 2200,
            category: 'fatburn', 
            subcategory: 'liquid',
            brand: 'BioTech',
            rating: 4.5,
            reviews: 92,
            popular: true, 
            hit: false,
            new: true,
            discount: 18,
            inStock: 15,
            description: 'Жидкий L-карнитин для сжигания жира и повышения энергии.',
            composition: 'L-карнитин, вода, лимонная кислота.',
            usage: '30мл за 30 минут до тренировки.',
            manufacturer: 'BioTech, США',
            image: 'https://avatars.mds.yandex.net/i?id=ad026508e7f2a9776e99c780cfebfdf5485fcaa5-5118143-images-thumbs&n=13'
        },
        { 
            id: 9, 
            name: 'Omega-3', 
            weight: '100 капсул', 
            price: 900, 
            oldPrice: 1200,
            category: 'vitamins', 
            subcategory: 'omega',
            brand: 'NOW Foods',
            rating: 4.7,
            reviews: 156,
            popular: false, 
            hit: false,
            new: false,
            discount: 25,
            inStock: 30,
            description: 'Рыбий жир высокой очистки с EPA и DHA.',
            composition: 'Рыбий жир, желатин, глицерин.',
            usage: '2 капсулы в день во время еды.',
            manufacturer: 'NOW Foods, США',
            image: 'https://via.placeholder.com/300x300/FFE8E8/FF6B6B?text=Omega-3'
        },
        { 
            id: 10, 
            name: 'Protein Bar', 
            weight: '60 грамм', 
            price: 150, 
            oldPrice: 180,
            category: 'bars', 
            subcategory: 'protein',
            brand: 'Weider',
            rating: 4.6,
            reviews: 234,
            popular: true, 
            hit: true,
            new: true,
            discount: 17,
            inStock: 50,
            description: 'Протеиновый батончик с шоколадным вкусом.',
            composition: 'Протеин, овес, шоколад, подсластитель.',
            usage: '1-2 батончика в день как перекус.',
            manufacturer: 'Weider, Германия',
            image: 'https://avatars.mds.yandex.net/i?id=03fe1a13717d50ca3859ba2d20be6d0fba8d4cdc-5870227-images-thumbs&n=13'
        }
    ];
    
    // Отзывы
    const reviews = [
        { id: 1, productId: 1, author: 'Алексей', rating: 5, text: 'Отличный протеин, хорошо размешивается, вкус приятный. Рекомендую!', date: '15.03.2024' },
        { id: 2, productId: 1, author: 'Дмитрий', rating: 5, text: 'Беру уже второй раз, качество на высоте.', date: '10.03.2024' },
        { id: 3, productId: 2, author: 'Екатерина', rating: 5, text: 'Лучший протеин, который я пробовала!', date: '12.03.2024' },
        { id: 4, productId: 4, author: 'Михаил', rating: 5, text: 'Креатин работает, сила растет.', date: '08.03.2024' },
        { id: 5, productId: 5, author: 'Ольга', rating: 4, text: 'Хороший BCAA, но вкус специфический.', date: '05.03.2024' }
    ];
    
    // Статьи блога
    const blogPosts = [
        { id: 1, title: 'Как выбрать протеин', category: 'Питание', date: '15.03.2024', preview: 'Полное руководство по выбору протеина для разных целей', image: 'protein' },
        { id: 2, title: 'Лучшее время для приема BCAA', category: 'Тренировки', date: '10.03.2024', preview: 'Когда и как принимать BCAA для максимального эффекта', image: 'bcaa' },
        { id: 3, title: 'Витамины для спортсменов', category: 'Питание', date: '05.03.2024', preview: 'Какие витамины необходимы при активных тренировках', image: 'vitamins' },
        { id: 4, title: 'Креатин: мифы и реальность', category: 'Питание', date: '01.03.2024', preview: 'Разбираем популярные мифы о креатине', image: 'creatine' },
        { id: 5, title: 'Как составить рацион для набора массы', category: 'Питание', date: '25.02.2024', preview: 'Советы по составлению рациона для роста мышц', image: 'diet' },
        { id: 6, title: '5 упражнений для спины', category: 'Тренировки', date: '20.02.2024', preview: 'Лучшие упражнения для здоровой спины', image: 'back' }
    ];
    
    // =========================================================================
    // ЭЛЕМЕНТЫ DOM
    // =========================================================================
    
    // Навигация
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const footerLinks = document.querySelectorAll('.footer-column a[data-page]');
    
    // Шапка и поиск
    const searchTrigger = document.getElementById('searchTrigger');
    const searchBar = document.getElementById('searchBar');
    const globalSearch = document.getElementById('globalSearch');
    const globalSearchBtn = document.getElementById('globalSearchBtn');
    const closeSearch = document.getElementById('closeSearch');
    
    // Иконки
    const cartIcon = document.getElementById('cartIcon');
    const userIcon = document.getElementById('userIcon');
    const favoritesIcon = document.getElementById('favoritesIcon');
    const cartBadge = document.getElementById('cartBadge');
    const favoritesBadge = document.getElementById('favoritesBadge');
    
    // Кнопки
    const scrollTop = document.getElementById('scrollTop');
    const heroCatalogBtn = document.getElementById('heroCatalogBtn');
    const heroAboutBtn = document.getElementById('heroAboutBtn');
    
    // Слайдеры
    const hitsPrev = document.getElementById('hitsPrev');
    const hitsNext = document.getElementById('hitsNext');
    const hitsTrack = document.getElementById('hitsTrack');
    const newPrev = document.getElementById('newPrev');
    const newNext = document.getElementById('newNext');
    const newTrack = document.getElementById('newTrack');
    
    // Категории
    const categoryCards = document.querySelectorAll('.category-card');
    
    // Каталог
    const catalogProducts = document.getElementById('catalogProducts');
    const catalogCount = document.getElementById('foundCount');
    const sortProducts = document.getElementById('sortProducts');
    const viewBtns = document.querySelectorAll('.view-btn');
    const applyFilters = document.getElementById('applyFilters');
    const resetFilters = document.getElementById('resetFilters');
    const loadMoreBtn = document.getElementById('loadMoreProducts');
    
    // Модальные окна
    const productModal = document.getElementById('productModal');
    const cartModal = document.getElementById('cartModal');
    const authModal = document.getElementById('authModal');
    const successModal = document.getElementById('successModal');
    const modalCloseBtns = document.querySelectorAll('.modal-close');
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    
    // Модалка товара
    const modalProductName = document.getElementById('modalProductName');
    const modalProductPrice = document.getElementById('modalProductPrice');
    const modalProductWeight = document.getElementById('modalProductWeight');
    const modalProductStock = document.getElementById('modalProductStock');
    const modalProductDescription = document.getElementById('modalProductDescription');
    const modalProductSpecs = document.getElementById('modalProductSpecs');
    const modalQty = document.getElementById('modalQty');
    const modalQtyDown = document.getElementById('modalQtyDown');
    const modalQtyUp = document.getElementById('modalQtyUp');
    const modalAddToCart = document.getElementById('modalAddToCart');
    const modalBuyNow = document.getElementById('modalBuyNow');
    
    // Модалка корзины
    const cartModalItems = document.getElementById('cartModalItems');
    const cartModalCount = document.getElementById('cartModalCount');
    const cartModalTotal = document.getElementById('cartModalTotal');
    const cartContinue = document.getElementById('cartContinue');
    const cartCheckout = document.getElementById('cartCheckout');
    const clearCart = document.getElementById('clearCart');
    const applyPromoBtn = document.getElementById('applyPromoBtn');
    
    // Модалка авторизации
    const authLoginTab = document.getElementById('authLoginTab');
    const authRegisterTab = document.getElementById('authRegisterTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginSubmit = document.getElementById('loginSubmit');
    const registerSubmit = document.getElementById('registerSubmit');
    const cancelRegister = document.getElementById('cancelRegister');
    
    // Модалка успеха
    const successMessage = document.getElementById('successMessage');
    const successOk = document.getElementById('successOk');
    
    // Формы
    const newsletterForm = document.getElementById('newsletterForm');
    const contactForm = document.getElementById('contactForm');
    
    // =========================================================================
    // ФУНКЦИИ НАВИГАЦИИ
    // =========================================================================
    
    function switchPage(pageId) {
        pages.forEach(page => page.classList.remove('active-page'));
        const targetPage = document.getElementById(pageId + '-page');
        if (targetPage) {
            targetPage.classList.add('active-page');
            currentPage = pageId;
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.dataset.page === pageId) {
                    link.classList.add('active');
                }
            });
            
            // Загружаем контент в зависимости от страницы
            if (pageId === 'home') {
                loadHomePageContent();
            } else if (pageId === 'catalog') {
                loadCatalogPageContent();
            } else if (pageId === 'products') {
                loadAllProducts();
            } else if (pageId === 'reviews') {
                loadReviewsPage();
            } else if (pageId === 'blog') {
                loadBlogPage();
            } else if (pageId === 'faq') {
                initFaq();
            }
            
            // Прокрутка наверх
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage(link.dataset.page);
        });
    });
    
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage(link.dataset.page);
        });
    });
    
    if (heroCatalogBtn) {
        heroCatalogBtn.addEventListener('click', () => switchPage('catalog'));
    }
    
    if (heroAboutBtn) {
        heroAboutBtn.addEventListener('click', () => switchPage('about'));
    }
    
    // =========================================================================
    // ФУНКЦИИ ЗАГРУЗКИ КОНТЕНТА
    // =========================================================================
    
    function loadHomePageContent() {
        // Загружаем хиты продаж
        if (hitsTrack) {
            const hits = products.filter(p => p.hit);
            hitsTrack.innerHTML = '';
            hits.forEach(product => {
                hitsTrack.appendChild(createProductCard(product));
            });
        }
        
        // Загружаем новинки
        if (newTrack) {
            const news = products.filter(p => p.new);
            newTrack.innerHTML = '';
            news.forEach(product => {
                newTrack.appendChild(createProductCard(product));
            });
        }
    }
    
    function loadCatalogPageContent() {
        if (catalogProducts) {
            renderProducts(products);
        }
    }
    
    function loadAllProducts() {
        const showcase = document.getElementById('showcaseProducts');
        if (showcase) {
            showcase.innerHTML = '';
            products.forEach(product => {
                showcase.appendChild(createProductCard(product));
            });
        }
    }
    
    function loadReviewsPage() {
        const reviewsList = document.getElementById('reviewsList');
        if (reviewsList) {
            reviewsList.innerHTML = '';
            reviews.forEach(review => {
                reviewsList.appendChild(createReviewCard(review));
            });
        }
    }
    
    function loadBlogPage() {
        const blogPostsContainer = document.getElementById('blogPosts');
        if (blogPostsContainer) {
            blogPostsContainer.innerHTML = '';
            blogPosts.forEach(post => {
                blogPostsContainer.appendChild(createBlogCard(post));
            });
        }
    }
    
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.id = product.id;
        
        const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;">
            </div>
            ${discount > 0 ? `<span class="product-badge">-${discount}%</span>` : ''}
            <h3>${product.name}</h3>
            <div class="product-weight">${product.weight}</div>
            <div class="product-rating">
                ${generateStars(product.rating)}
                <span>(${product.reviews})</span>
            </div>
            <div class="product-price">
                ${product.price.toLocaleString()}₽
                ${product.oldPrice ? `<span class="old-price">${product.oldPrice.toLocaleString()}₽</span>` : ''}
            </div>
            <button class="add-to-cart" data-id="${product.id}">
                <i class="fas fa-cart-plus"></i> В корзину
            </button>
        `;
        
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('add-to-cart') && !e.target.closest('.add-to-cart')) {
                openProductModal(product.id);
            }
        });
        
        const addBtn = card.querySelector('.add-to-cart');
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(product.id);
        });
        
        return card;
    }
    
    function createReviewCard(review) {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
            <div class="review-header">
                <span class="review-author">${review.author}</span>
                <span class="review-date">${review.date}</span>
            </div>
            <div class="review-rating">${generateStars(review.rating)}</div>
            <div class="review-text">${review.text}</div>
        `;
        return card;
    }
    
    function createBlogCard(post) {
        const card = document.createElement('div');
        card.className = 'blog-card';
        card.innerHTML = `
            <div class="blog-image"><i class="fas fa-${post.image}"></i></div>
            <div class="blog-content">
                <span class="blog-date">${post.date}</span>
                <h3>${post.title}</h3>
                <p>${post.preview}</p>
                <a href="#" class="blog-link">Читать <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
        return card;
    }
    
    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        if (hasHalf) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = fullStars + (hasHalf ? 1 : 0); i < 5; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }
    
    function renderProducts(productsArray) {
        catalogProducts.innerHTML = '';
        productsArray.forEach(product => {
            catalogProducts.appendChild(createProductCard(product));
        });
        if (catalogCount) {
            catalogCount.textContent = productsArray.length;
        }
    }
    
    // =========================================================================
    // СЛАЙДЕРЫ
    // =========================================================================
    
    let hitsPosition = 0;
    let newPosition = 0;
    const slideWidth = 305; // ширина карточки + gap
    
    if (hitsPrev && hitsNext && hitsTrack) {
        hitsPrev.addEventListener('click', () => {
            hitsPosition = Math.min(hitsPosition + slideWidth * 2, 0);
            hitsTrack.style.transform = `translateX(${hitsPosition}px)`;
        });
        
        hitsNext.addEventListener('click', () => {
            const maxScroll = -(hitsTrack.children.length * slideWidth - hitsTrack.parentElement.offsetWidth);
            hitsPosition = Math.max(hitsPosition - slideWidth * 2, maxScroll);
            hitsTrack.style.transform = `translateX(${hitsPosition}px)`;
        });
    }
    
    if (newPrev && newNext && newTrack) {
        newPrev.addEventListener('click', () => {
            newPosition = Math.min(newPosition + slideWidth * 2, 0);
            newTrack.style.transform = `translateX(${newPosition}px)`;
        });
        
        newNext.addEventListener('click', () => {
            const maxScroll = -(newTrack.children.length * slideWidth - newTrack.parentElement.offsetWidth);
            newPosition = Math.max(newPosition - slideWidth * 2, maxScroll);
            newTrack.style.transform = `translateX(${newPosition}px)`;
        });
    }
    
    // =========================================================================
    // ПОИСК
    // =========================================================================
    
    if (searchTrigger) {
        searchTrigger.addEventListener('click', () => {
            searchVisible = !searchVisible;
            if (searchVisible) {
                searchBar.classList.add('show');
                globalSearch.focus();
            } else {
                searchBar.classList.remove('show');
            }
        });
    }
    
    if (closeSearch) {
        closeSearch.addEventListener('click', () => {
            searchVisible = false;
            searchBar.classList.remove('show');
        });
    }
    
    if (globalSearchBtn) {
        globalSearchBtn.addEventListener('click', () => {
            const query = globalSearch.value.toLowerCase().trim();
            if (query) {
                const results = products.filter(p => 
                    p.name.toLowerCase().includes(query) || 
                    p.category.toLowerCase().includes(query) ||
                    p.brand.toLowerCase().includes(query)
                );
                if (results.length > 0) {
                    showSuccess(`Найдено ${results.length} товаров`);
                    // Здесь можно показать результаты
                } else {
                    showSuccess('Ничего не найдено');
                }
            }
        });
    }
    
    if (globalSearch) {
        globalSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                globalSearchBtn.click();
            }
        });
    }
    
    // =========================================================================
    // КАТЕГОРИИ
    // =========================================================================
    
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            switchPage('catalog');
            setTimeout(() => {
                // Здесь можно применить фильтр по категории
                const checkboxes = document.querySelectorAll(`input[name="category"][value="${category}"]`);
                checkboxes.forEach(cb => cb.checked = true);
                applyFilters.click();
            }, 100);
        });
    });
    
    // =========================================================================
    // ФИЛЬТРЫ И СОРТИРОВКА
    // =========================================================================
    
    if (applyFilters) {
        applyFilters.addEventListener('click', () => {
            let filtered = [...products];
            
            // Фильтр по категориям
            const selectedCategories = [];
            document.querySelectorAll('input[name="category"]:checked').forEach(cb => {
                selectedCategories.push(cb.value);
            });
            if (selectedCategories.length > 0) {
                filtered = filtered.filter(p => selectedCategories.includes(p.category));
            }
            
            // Фильтр по брендам
            const selectedBrands = [];
            document.querySelectorAll('input[name="brand"]:checked').forEach(cb => {
                selectedBrands.push(cb.value);
            });
            if (selectedBrands.length > 0) {
                filtered = filtered.filter(p => selectedBrands.includes(p.brand.toLowerCase().replace(' ', '')));
            }
            
            // Фильтр по цене
            const minPrice = parseInt(document.getElementById('minPrice')?.value) || 0;
            const maxPrice = parseInt(document.getElementById('maxPrice')?.value) || 100000;
            filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);
            
            renderProducts(filtered);
        });
    }
    
    if (resetFilters) {
        resetFilters.addEventListener('click', () => {
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
            document.getElementById('minPrice').value = 0;
            document.getElementById('maxPrice').value = 10000;
            renderProducts(products);
        });
    }
    
    if (sortProducts) {
        sortProducts.addEventListener('change', () => {
            const sorted = [...products];
            switch(sortProducts.value) {
                case 'price-asc':
                    sorted.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    sorted.sort((a, b) => b.price - a.price);
                    break;
                case 'new':
                    sorted.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
                    break;
                case 'rating':
                    sorted.sort((a, b) => b.rating - a.rating);
                    break;
                case 'discount':
                    sorted.sort((a, b) => (b.discount || 0) - (a.discount || 0));
                    break;
                default:
                    // popular - по умолчанию
                    sorted.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
            }
            renderProducts(sorted);
        });
    }
    
    if (viewBtns) {
        viewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                viewBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const view = this.dataset.view;
                catalogProducts.dataset.view = view;
            });
        });
    }
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            showSuccess('Загружено еще 12 товаров');
        });
    }
    
    // =========================================================================
    // ФУНКЦИИ КОРЗИНЫ
    // =========================================================================
    
    function addToCart(productId, quantity = 1) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const existing = cartItems.find(item => item.id === productId);
        if (existing) {
            existing.quantity += quantity;
        } else {
            cartItems.push({
                id: product.id,
                name: product.name,
                weight: product.weight,
                price: product.price,
                quantity: quantity,
                image: product.image
            });
        }
        
        saveCart();
        updateCartBadge();
        updateCartModal();
        showSuccess('Товар добавлен в корзину');
    }
    
    function removeFromCart(productId) {
        cartItems = cartItems.filter(item => item.id !== productId);
        saveCart();
        updateCartBadge();
        updateCartModal();
    }
    
    function saveCart() {
        try {
            localStorage.setItem('farmach_cart', JSON.stringify(cartItems));
        } catch (e) {}
    }
    
    function updateCartBadge() {
        const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        if (cartBadge) cartBadge.textContent = total;
    }
    
    function updateCartModal() {
        if (!cartModalItems) return;
        
        const totalQty = cartItems.reduce((sum, i) => sum + i.quantity, 0);
        const totalSum = cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        
        if (cartModalCount) {
            cartModalCount.textContent = `(${totalQty} ${getNoun(totalQty, 'товар', 'товара', 'товаров')})`;
        }
        
        if (cartModalTotal) {
            cartModalTotal.textContent = totalSum.toLocaleString() + ' ₽';
        }
        
        cartModalItems.innerHTML = '';
        
        if (cartItems.length === 0) {
            cartModalItems.innerHTML = '<div style="text-align:center;padding:40px;">Корзина пуста</div>';
        } else {
            cartItems.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image || 'https://via.placeholder.com/80'}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;">
                    </div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.weight} · ${item.quantity} шт</p>
                    </div>
                    <div class="cart-item-price">${(item.price * item.quantity).toLocaleString()} ₽</div>
                    <div class="cart-item-remove" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </div>
                `;
                cartModalItems.appendChild(itemEl);
            });
            
            document.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = parseInt(btn.dataset.id);
                    removeFromCart(id);
                });
            });
        }
    }
    
    if (clearCart) {
        clearCart.addEventListener('click', () => {
            cartItems = [];
            saveCart();
            updateCartBadge();
            updateCartModal();
            showSuccess('Корзина очищена');
        });
    }
    
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', () => {
            const input = document.getElementById('promoInput');
            if (input && input.value.trim().toUpperCase() === 'FARM10') {
                showSuccess('Промокод применен! Скидка 10%');
                input.value = '';
            } else {
                showSuccess('Неверный промокод');
            }
        });
    }
    
    if (cartContinue) {
        cartContinue.addEventListener('click', () => {
            closeModal(cartModal);
        });
    }
    
    if (cartCheckout) {
        cartCheckout.addEventListener('click', () => {
            if (cartItems.length === 0) {
                showSuccess('Корзина пуста');
            } else {
                showSuccess('Заказ оформлен! Спасибо за покупку!');
                cartItems = [];
                saveCart();
                updateCartBadge();
                updateCartModal();
                closeModal(cartModal);
            }
        });
    }
    
    // =========================================================================
    // ФУНКЦИИ ИЗБРАННОГО
    // =========================================================================
    
    function toggleFavorite(productId) {
        const index = favoritesItems.indexOf(productId);
        if (index === -1) {
            favoritesItems.push(productId);
            showSuccess('Добавлено в избранное');
        } else {
            favoritesItems.splice(index, 1);
            showSuccess('Удалено из избранного');
        }
        updateFavoritesBadge();
        localStorage.setItem('farmach_favorites', JSON.stringify(favoritesItems));
    }
    
    function updateFavoritesBadge() {
        if (favoritesBadge) {
            favoritesBadge.textContent = favoritesItems.length;
        }
    }
    
    if (favoritesIcon) {
        favoritesIcon.addEventListener('click', () => {
            if (favoritesItems.length === 0) {
                showSuccess('Список избранного пуст');
            } else {
                showSuccess(`В избранном ${favoritesItems.length} товаров`);
            }
        });
    }
    
    // =========================================================================
    // МОДАЛЬНЫЕ ОКНА
    // =========================================================================
    
    function openModal(modal) {
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }
    
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });
    
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            const modal = overlay.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Модалка корзины
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            updateCartModal();
            openModal(cartModal);
        });
    }
    
    // Модалка авторизации
    if (userIcon) {
        userIcon.addEventListener('click', () => {
            openModal(authModal);
        });
    }
    
    if (authLoginTab && authRegisterTab && loginForm && registerForm) {
        authLoginTab.addEventListener('click', () => {
            authLoginTab.classList.add('active');
            authRegisterTab.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        });
        
        authRegisterTab.addEventListener('click', () => {
            authRegisterTab.classList.add('active');
            authLoginTab.classList.remove('active');
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        });
    }
    
    if (loginSubmit) {
        loginSubmit.addEventListener('click', () => {
            const email = document.getElementById('loginEmail').value;
            if (email) {
                showSuccess('Вход выполнен успешно!');
                closeModal(authModal);
            } else {
                showSuccess('Введите email');
            }
        });
    }
    
    if (registerSubmit) {
        registerSubmit.addEventListener('click', () => {
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const pass = document.getElementById('regPassword').value;
            const confirm = document.getElementById('regConfirm').value;
            
            if (!name || !email || !pass || !confirm) {
                showSuccess('Заполните все поля');
            } else if (pass !== confirm) {
                showSuccess('Пароли не совпадают');
            } else if (pass.length < 6) {
                showSuccess('Пароль должен быть не менее 6 символов');
            } else {
                showSuccess('Регистрация успешна!');
                closeModal(authModal);
            }
        });
    }
    
    if (cancelRegister) {
        cancelRegister.addEventListener('click', () => {
            closeModal(authModal);
        });
    }
    
    // Модалка товара
    function openProductModal(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        currentProductId = productId;
        
        if (modalProductName) modalProductName.textContent = product.name;
        if (modalProductPrice) modalProductPrice.textContent = product.price.toLocaleString() + ' ₽';
        if (modalProductWeight) modalProductWeight.textContent = product.weight;
        if (modalProductStock) {
            modalProductStock.textContent = product.inStock > 0 ? `В наличии: ${product.inStock} шт` : 'Нет в наличии';
            modalProductStock.style.color = product.inStock > 0 ? '#28a745' : '#dc3545';
        }
        if (modalProductDescription) modalProductDescription.textContent = product.description;
        
        if (modalProductSpecs) {
            modalProductSpecs.innerHTML = `
                <tr><td>Производитель</td><td>${product.manufacturer}</td></tr>
                <tr><td>Состав</td><td>${product.composition}</td></tr>
                <tr><td>Применение</td><td>${product.usage}</td></tr>
                <tr><td>Рейтинг</td><td>${product.rating}/5</td></tr>
                <tr><td>Отзывы</td><td>${product.reviews}</td></tr>
            `;
        }
        
        if (modalQty) modalQty.value = 1;
        
        openModal(productModal);
    }
    
    if (modalQtyDown && modalQty) {
        modalQtyDown.addEventListener('click', () => {
            let val = parseInt(modalQty.value) || 1;
            if (val > 1) modalQty.value = val - 1;
        });
    }
    
    if (modalQtyUp && modalQty) {
        modalQtyUp.addEventListener('click', () => {
            let val = parseInt(modalQty.value) || 1;
            if (val < 99) modalQty.value = val + 1;
        });
    }
    
    if (modalQty) {
        modalQty.addEventListener('change', function() {
            let val = parseInt(this.value) || 1;
            if (val < 1) this.value = 1;
            if (val > 99) this.value = 99;
        });
    }
    
    if (modalAddToCart) {
        modalAddToCart.addEventListener('click', () => {
            if (currentProductId) {
                const qty = parseInt(modalQty.value) || 1;
                addToCart(currentProductId, qty);
                closeModal(productModal);
            }
        });
    }
    
    if (modalBuyNow) {
        modalBuyNow.addEventListener('click', () => {
            if (currentProductId) {
                const qty = parseInt(modalQty.value) || 1;
                addToCart(currentProductId, qty);
                closeModal(productModal);
                setTimeout(() => {
                    openModal(cartModal);
                }, 300);
            }
        });
    }
    
    // Модалка успеха
    function showSuccess(message) {
        if (successMessage) {
            successMessage.textContent = message;
        }
        openModal(successModal);
        
        setTimeout(() => {
            closeModal(successModal);
        }, 2000);
    }
    
    if (successOk) {
        successOk.addEventListener('click', () => {
            closeModal(successModal);
        });
    }
    
    // =========================================================================
    // FAQ АККОРДЕОН
    // =========================================================================
    
    function initFaq() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        });
    }
    
    // =========================================================================
    // ФОРМЫ
    // =========================================================================
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showSuccess('Спасибо за подписку!');
            newsletterForm.reset();
        });
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showSuccess('Сообщение отправлено!');
            contactForm.reset();
        });
    }
    
    // =========================================================================
    // КНОПКА НАВЕРХ
    // =========================================================================
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTop.classList.add('show');
        } else {
            scrollTop.classList.remove('show');
        }
    });
    
    if (scrollTop) {
        scrollTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // =========================================================================
    // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
    // =========================================================================
    
    function getNoun(n, one, two, five) {
        n = Math.abs(n) % 100;
        if (n >= 5 && n <= 20) return five;
        n %= 10;
        if (n === 1) return one;
        if (n >= 2 && n <= 4) return two;
        return five;
    }
    
    // =========================================================================
    // ИНИЦИАЛИЗАЦИЯ
    // =========================================================================
    
    function init() {
        loadHomePageContent();
        updateCartBadge();
        updateFavoritesBadge();
        
        // Проверяем, есть ли сохраненная страница
        const savedPage = localStorage.getItem('farmach_page');
        if (savedPage) {
            switchPage(savedPage);
        }
    }
    
    init();
});
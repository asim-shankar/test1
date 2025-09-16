// Menu Data
const menuItems = [
    {
        id: 1,
        name: "Vegetable Biryani",
        category: "main",
        price: 120,
        description: "Fragrant basmati rice cooked with mixed vegetables and aromatic spices",
        image: "https://via.placeholder.com/300x200/FFB6C1/000000?text=Veg+Biryani"
    },
    {
        id: 2,
        name: "Chicken Curry Rice",
        category: "main",
        price: 150,
        description: "Traditional chicken curry served with steamed rice",
        image: "https://via.placeholder.com/300x200/FFA07A/000000?text=Chicken+Curry"
    },
    {
        id: 3,
        name: "Dal Tadka",
        category: "main",
        price: 80,
        description: "Yellow lentils tempered with cumin, garlic, and spices",
        image: "https://via.placeholder.com/300x200/F0E68C/000000?text=Dal+Tadka"
    },
    {
        id: 4,
        name: "Samosa",
        category: "snacks",
        price: 25,
        description: "Crispy pastry filled with spiced potatoes and peas",
        image: "https://via.placeholder.com/300x200/DDA0DD/000000?text=Samosa"
    },
    {
        id: 5,
        name: "Pav Bhaji",
        category: "snacks",
        price: 60,
        description: "Spicy vegetable curry served with buttered bread rolls",
        image: "https://via.placeholder.com/300x200/98FB98/000000?text=Pav+Bhaji"
    },
    {
        id: 6,
        name: "Sandwich",
        category: "snacks",
        price: 45,
        description: "Grilled sandwich with vegetables and chutney",
        image: "https://via.placeholder.com/300x200/87CEEB/000000?text=Sandwich"
    },
    {
        id: 7,
        name: "Masala Chai",
        category: "beverages",
        price: 15,
        description: "Traditional Indian spiced tea",
        image: "https://via.placeholder.com/300x200/D2691E/000000?text=Masala+Chai"
    },
    {
        id: 8,
        name: "Fresh Lime Soda",
        category: "beverages",
        price: 30,
        description: "Refreshing lime juice with soda water",
        image: "https://via.placeholder.com/300x200/90EE90/000000?text=Lime+Soda"
    },
    {
        id: 9,
        name: "Cold Coffee",
        category: "beverages",
        price: 40,
        description: "Chilled coffee with ice cream and milk",
        image: "https://via.placeholder.com/300x200/D3D3D3/000000?text=Cold+Coffee"
    }
];

// Global Variables
let cart = [];
let currentCategory = 'all';
let currentUser = null;

// DOM Elements
const menuGrid = document.getElementById('menu-grid');
const cartSection = document.getElementById('cart-section');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const totalAmount = document.getElementById('total-amount');
const categoryButtons = document.querySelectorAll('.category-btn');
const cartBtn = document.getElementById('cart-btn');
const checkoutBtn = document.getElementById('checkout-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');
const orderModal = document.getElementById('order-modal');
const orderForm = document.getElementById('order-form');

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Stagger menu items animation
            if (entry.target.classList.contains('menu-item')) {
                const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`;
            }
        }
    });
}, observerOptions);

// Section reveal observer
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in');
        }
    });
}, { threshold: 0.2 });

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    displayMenuItems(menuItems);
    setupEventListeners();
    setupUserAccountListeners();
    loadUserSession();
    initScrollAnimations();
    setupParallaxEffects();
});

// Initialize scroll animations
function initScrollAnimations() {
    // Observe sections
    const sections = document.querySelectorAll('#menu, #cart-section');
    sections.forEach(section => {
        section.classList.add('section-reveal');
        sectionObserver.observe(section);
    });

    // Add smooth scroll behavior to navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                smoothScrollTo(target.id);
            }
        });
    });
}

// Setup parallax effects
function setupParallaxEffects() {
    window.addEventListener('scroll', throttle(handleParallaxScroll, 16));
}

// Throttle function for performance
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Parallax scroll handler
function handleParallaxScroll() {
    const scrolled = window.pageYOffset;
    const hero = document.getElementById('hero');
    if (hero) {
        const speed = scrolled * 0.3;
        hero.style.transform = `translateY(${speed}px)`;
    }

    // Header background opacity change
    const header = document.querySelector('header');
    if (header) {
        const opacity = Math.min(scrolled / 100, 0.95);
        header.style.backgroundColor = `rgba(102, 126, 234, ${opacity})`;
    }
}

// Smooth scroll to sections
function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Display menu items with animations
function displayMenuItems(items) {
    menuGrid.innerHTML = '';
    items.forEach((item, index) => {
        if (currentCategory === 'all' || item.category === currentCategory) {
            const menuItemElement = createMenuItemElement(item, index);
            menuGrid.appendChild(menuItemElement);
        }
    });

    // Observe new menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.classList.add('scroll-animate');
        observer.observe(item);
    });
}

// Create menu item element with enhanced animations
function createMenuItemElement(item, index) {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.style.transitionDelay = `${index * 0.1}s`;
    div.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="price">₹${item.price}</div>
        <button onclick="addToCart(${item.id})">
            <span>Add to Cart</span>
        </button>
    `;
    return div;
}

// Enhanced add to cart with animations
function addToCart(itemId) {
    const item = menuItems.find(item => item.id === itemId);
    const existingCartItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingCartItem) {
        existingCartItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCartDisplayWithAnimation();
    showNotification(`${item.name} added to cart! 🛒`);
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplayWithAnimation();
    showNotification('Item removed from cart');
}

// Update item quantity in cart
function updateQuantity(itemId, change) {
    const cartItem = cart.find(item => item.id === itemId);
    if (cartItem) {
        cartItem.quantity += change;
        if (cartItem.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCartDisplayWithAnimation();
        }
    }
}

// Enhanced cart display with animations
function updateCartDisplayWithAnimation() {
    const cartCountElement = document.getElementById('cart-count');
    const newCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Animate count change
    cartCountElement.classList.add('bounce');
    cartCountElement.textContent = newCount;
    
    setTimeout(() => {
        cartCountElement.classList.remove('bounce');
    }, 400);
    
    updateCartItemsWithAnimation();
}

// Animate cart items with staggered entrance
function updateCartItemsWithAnimation() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="scroll-animate animate-in">Your cart is empty 🛒</p>';
        totalAmount.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item scroll-animate';
        cartItemElement.style.transitionDelay = `${index * 0.1}s`;
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>₹${item.price} each</p>
            </div>
            <div class="cart-item-controls">
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
                <button onclick="removeFromCart(${item.id})" style="background: linear-gradient(135deg, #e74c3c, #c0392b); margin-left: 10px;">×</button>
            </div>
        `;
        cartItems.appendChild(cartItemElement);
        
        // Trigger animation
        setTimeout(() => {
            cartItemElement.classList.add('animate-in');
        }, 50 + index * 50);
    });
    
    totalAmount.textContent = total;
}

// Setup main event listeners
function setupEventListeners() {
    // Category filter buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            
            // Add loading effect
            menuGrid.style.opacity = '0';
            menuGrid.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                displayMenuItems(menuItems);
                menuGrid.style.opacity = '1';
                menuGrid.style.transform = 'translateY(0)';
            }, 200);
        });
    });
    
    // Cart button with enhanced animation
    cartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        toggleCartSection();
    });
    
    // Clear cart button
    clearCartBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Cart is already empty! 🛒');
            return;
        }
        
        if (confirm('Are you sure you want to clear your cart?')) {
            cart = [];
            updateCartDisplayWithAnimation();
            showNotification('Cart cleared successfully! ✨');
        }
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Your cart is empty! Add some items first 🍽️');
            return;
        }
        showModal('order-modal');
    });
    
    // Order form submission
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processOrderWithAnimation();
    });
}

// Setup user account event listeners
function setupUserAccountListeners() {
    const profileBtn = document.getElementById('profile-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Toggle dropdown menu
    profileBtn?.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-account')) {
            dropdownMenu?.classList.remove('show');
        }
    });

    // Login button
    loginBtn?.addEventListener('click', function(e) {
        e.preventDefault();
        showModal('login-modal');
        dropdownMenu?.classList.remove('show');
    });

    // Register button
    registerBtn?.addEventListener('click', function(e) {
        e.preventDefault();
        showModal('register-modal');
        dropdownMenu?.classList.remove('show');
    });

    // Logout button
    logoutBtn?.addEventListener('click', function(e) {
        e.preventDefault();
        logoutUser();
        dropdownMenu?.classList.remove('show');
    });

    // Login form submission
    loginForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });

    // Register form submission
    registerForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        handleRegistration();
    });
}

// Handle user login
function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (email && password) {
        // Show loading
        const submitBtn = document.querySelector('#login-form button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<div class="loading-spinner"></div>Logging in...';
        submitBtn.disabled = true;

        setTimeout(() => {
            const userData = {
                name: email.includes('@') ? email.split('@')[0] : email,
                email: email,
                studentId: email.includes('@') ? 'STU' + Date.now() : email,
                profileImage: generateProfileImage(email)
            };

            loginUser(userData);
            closeModal('login-modal');
            document.getElementById('login-form').reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            showNotification(`Welcome back, ${userData.name}! 🎉`);
        }, 1000);
    }
}

// Handle user registration
function handleRegistration() {
    const name = document.getElementById('register-name').value;
    const studentId = document.getElementById('register-student-id').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const password = document.getElementById('register-password').value;

    if (name && studentId && email && phone && password) {
        const submitBtn = document.querySelector('#register-form button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<div class="loading-spinner"></div>Creating account...';
        submitBtn.disabled = true;

        setTimeout(() => {
            const userData = {
                name: name,
                email: email,
                studentId: studentId,
                phone: phone,
                profileImage: generateProfileImage(name)
            };

            localStorage.setItem('userData', JSON.stringify(userData));
            loginUser(userData);
            closeModal('register-modal');
            document.getElementById('register-form').reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            showNotification(`Account created successfully! Welcome ${name}! ✨`);
        }, 1500);
    }
}

// Login user and update UI
function loginUser(userData) {
    currentUser = userData;
    localStorage.setItem('currentUser', JSON.stringify(userData));
    updateUserInterface();
}

// Logout user
function logoutUser() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateUserInterface();
        showNotification('Successfully logged out! See you soon! 👋');
    }
}

// Update user interface based on login status
function updateUserInterface() {
    const username = document.getElementById('username');
    const profileImg = document.getElementById('profile-img');
    const profileCircle = document.querySelector('.profile-circle');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const profileBtnMenu = document.getElementById('profile-btn-menu');
    const ordersBtn = document.getElementById('orders-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (currentUser) {
        // User is logged in
        username.textContent = currentUser.name;
        profileImg.src = currentUser.profileImage;
        profileImg.alt = currentUser.name;
        profileCircle.classList.add('online');

        // Show logged-in menu items
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (profileBtnMenu) profileBtnMenu.style.display = 'block';
        if (ordersBtn) ordersBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'block';

        // Pre-fill order form
        const studentNameField = document.getElementById('student-name');
        const studentIdField = document.getElementById('student-id');
        const phoneField = document.getElementById('phone');
        
        if (studentNameField) studentNameField.value = currentUser.name;
        if (studentIdField) studentIdField.value = currentUser.studentId;
        if (phoneField && currentUser.phone) phoneField.value = currentUser.phone;

        updateHeroGreeting();
    } else {
        // User is not logged in
        username.textContent = 'Guest';
        profileImg.src = 'https://via.placeholder.com/40x40/667eea/ffffff?text=G';
        profileImg.alt = 'Guest';
        profileCircle.classList.remove('online');

        // Show login/register menu items
        if (loginBtn) loginBtn.style.display = 'block';
        if (registerBtn) registerBtn.style.display = 'block';
        if (profileBtnMenu) profileBtnMenu.style.display = 'none';
        if (ordersBtn) ordersBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';

        // Remove greeting
        const greetingElement = document.querySelector('.user-greeting');
        if (greetingElement) greetingElement.remove();
    }
}

// Update hero section with personalized greeting
function updateHeroGreeting() {
    const heroSection = document.querySelector('#hero .container');
    let greetingElement = heroSection.querySelector('.user-greeting');
    
    if (currentUser) {
        if (!greetingElement) {
            greetingElement = document.createElement('p');
            greetingElement.className = 'user-greeting';
            heroSection.insertBefore(greetingElement, heroSection.querySelector('h2'));
        }
        greetingElement.textContent = `Welcome back, ${currentUser.name}! 👋`;
    }
}

// Generate profile image
function generateProfileImage(name) {
    const initial = name.charAt(0).toUpperCase();
    const colors = ['667eea', '00b894', 'e17055', '6c5ce7', 'fd79a8', '00cec9', 'fdcb6e', 'e84393'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return `https://via.placeholder.com/40x40/${randomColor}/ffffff?text=${initial}`;
}

// Load user session
function loadUserSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserInterface();
    }
}

// Enhanced cart section toggle with smooth animations
function toggleCartSection() {
    const menuSection = document.getElementById('menu');
    const heroSection = document.getElementById('hero');
    
    if (cartSection.style.display === 'none' || !cartSection.style.display) {
        // Show cart
        cartSection.style.display = 'block';
        menuSection.style.display = 'none';
        heroSection.style.display = 'none';
        
        setTimeout(() => {
            cartSection.classList.add('slide-in');
        }, 50);
        
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        // Hide cart
        cartSection.classList.remove('slide-in');
        setTimeout(() => {
            cartSection.style.display = 'none';
            menuSection.style.display = 'block';
            heroSection.style.display = 'block';
        }, 600);
    }
}

// Enhanced order processing with animations
function processOrderWithAnimation() {
    const submitBtn = document.querySelector('#order-form button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading animation
    submitBtn.innerHTML = '<div class="loading-spinner"></div>Processing Order...';
    submitBtn.disabled = true;

    setTimeout(() => {
        const formData = new FormData(orderForm);
        const orderDetails = {
            studentName: formData.get('student-name') || document.getElementById('student-name').value,
            studentId: formData.get('student-id') || document.getElementById('student-id').value,
            phone: formData.get('phone') || document.getElementById('phone').value,
            paymentMethod: formData.get('payment-method') || document.getElementById('payment-method').value,
            items: cart,
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            orderId: 'ORD' + Date.now(),
            timestamp: new Date().toLocaleString(),
            userId: currentUser ? currentUser.studentId : null
        };
        
        // Save order
        const existingOrders = JSON.parse(localStorage.getItem('userOrders')) || [];
        existingOrders.push(orderDetails);
        localStorage.setItem('userOrders', JSON.stringify(existingOrders));
        
        // Success animation
        submitBtn.innerHTML = '✅ Order Placed!';
        submitBtn.style.background = 'linear-gradient(135deg, #00b894, #00a085)';
        
        setTimeout(() => {
            // Clear cart and close modal
            cart = [];
            updateCartDisplayWithAnimation();
            closeModal('order-modal');
            orderForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
            
            showNotification(`Order placed successfully! 🎉 Order ID: ${orderDetails.orderId}`);
            
            // Show detailed confirmation
            setTimeout(() => {
                alert(`🎉 Order Confirmation\n\nOrder ID: ${orderDetails.orderId}\nTotal Amount: ₹${orderDetails.total}\nEstimated Pickup: ${getEstimatedPickupTime()}\n\nThank you for your order!`);
            }, 1000);
        }, 2000);
    }, 2000);
}

// Get estimated pickup time
function getEstimatedPickupTime() {
    const now = new Date();
    const pickupTime = new Date(now.getTime() + 20 * 60000);
    return pickupTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

// Enhanced modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 400);
    }
}

// Enhanced notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3500);
}

// Close modal when clicking outside or pressing Escape
window.addEventListener('click', function(event) {
    const modals = ['login-modal', 'register-modal', 'order-modal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal && event.target === modal) {
            closeModal(modalId);
        }
    });
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = ['login-modal', 'register-modal', 'order-modal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal && modal.style.display === 'block') {
                closeModal(modalId);
            }
        });
    }
});

// Page loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
    showNotification('Welcome to College Canteen! 🍽️');
});

// Add CSS for initial page load
document.addEventListener('DOMContentLoaded', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
});

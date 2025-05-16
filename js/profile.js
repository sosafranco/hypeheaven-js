/**
 * JavaScript para la página de perfil de usuario
 */

// Importar módulos
import { showNotification } from './modules/ui.js';
import { getUserData, logout } from './auth.js';

// Constantes para almacenamiento local
const ADDRESSES_KEY = "user-addresses";
const WISHLIST_KEY = "user-wishlist";
const ORDERS_KEY = "user-orders";
const USER_SETTINGS_KEY = "user-settings";

// Función principal de inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si el usuario está logueado
    const userData = getUserData();
    if (!userData) {
        // Redirigir a la página de login si no hay usuario autenticado
        window.location.href = 'login.html';
        return;
    }

    // Mostrar nombre del usuario
    document.getElementById('profile-name').textContent = userData.name;

    // Inicializar navegación del perfil
    initProfileNavigation();

    // Inicializar formulario de información personal
    initPersonalInfoForm(userData);

    // Inicializar sección de direcciones
    initAddressesSection();

    // Inicializar sección de lista de deseos
    initWishlistSection();

    // Inicializar sección de pedidos
    initOrdersSection();

    // Inicializar sección de notificaciones
    initNotificationsSection();

    // Inicializar sección de seguridad
    initSecuritySection();

    // Configurar botón de cerrar sesión
    document.getElementById('logout-button').addEventListener('click', () => {
        logout();
    });
});

// Función para inicializar la navegación entre secciones del perfil
function initProfileNavigation() {
    const navItems = document.querySelectorAll('.profile-nav-item');
    const sections = document.querySelectorAll('.profile-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Desactivar todos los ítems y secciones
            navItems.forEach(navItem => navItem.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));

            // Activar el ítem y sección seleccionados
            item.classList.add('active');
            const sectionId = item.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

// Función para inicializar el formulario de información personal
function initPersonalInfoForm(userData) {
    const form = document.getElementById('personal-info-form');
    const fullNameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const birthDateInput = document.getElementById('birth-date');

    // Cargar datos existentes
    fullNameInput.value = userData.name || '';
    emailInput.value = userData.email || '';
    
    // Cargar datos adicionales si existen
    const userSettings = JSON.parse(localStorage.getItem(USER_SETTINGS_KEY)) || {};
    phoneInput.value = userSettings.phone || '';
    birthDateInput.value = userSettings.birthDate || '';

    // Manejar envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Actualizar datos del usuario
        const updatedUserData = {
            ...userData,
            name: fullNameInput.value
        };

        // Actualizar configuraciones adicionales
        const updatedSettings = {
            ...userSettings,
            phone: phoneInput.value,
            birthDate: birthDateInput.value
        };

        // Guardar cambios
        localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(updatedSettings));
        localStorage.setItem('user-data', JSON.stringify(updatedUserData));

        showNotification('Información personal actualizada correctamente', 'success');
    });
}

// Función para inicializar la sección de direcciones
function initAddressesSection() {
    const addressesList = document.getElementById('addresses-list');
    const addAddressButton = document.getElementById('add-address-button');
    const addressFormContainer = document.getElementById('address-form-container');
    const addressForm = document.getElementById('address-form');
    const cancelAddressButton = document.getElementById('cancel-address-button');
    const formTitle = document.getElementById('address-form-title');

    // Cargar direcciones existentes
    loadAddresses();

    // Mostrar formulario para agregar dirección
    addAddressButton.addEventListener('click', () => {
        // Limpiar formulario
        addressForm.reset();
        document.getElementById('address-id').value = '';
        formTitle.textContent = 'Agregar Nueva Dirección';
        
        // Mostrar formulario
        addressFormContainer.style.display = 'block';
        addAddressButton.style.display = 'none';
    });

    // Cancelar formulario
    cancelAddressButton.addEventListener('click', () => {
        addressFormContainer.style.display = 'none';
        addAddressButton.style.display = 'inline-flex';
    });

    // Guardar dirección
    addressForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Obtener datos del formulario
        const addressId = document.getElementById('address-id').value;
        const addressName = document.getElementById('address-name').value;
        const addressLine = document.getElementById('address-line').value;
        const addressCity = document.getElementById('address-city').value;
        const addressPostal = document.getElementById('address-postal').value;
        const addressCountry = document.getElementById('address-country').value;
        const isDefault = document.getElementById('default-address').checked;

        // Validar campos requeridos
        if (!addressName || !addressLine || !addressCity || !addressPostal || !addressCountry) {
            showNotification('Por favor, completa todos los campos requeridos', 'error');
            return;
        }

        // Crear objeto de dirección
        const address = {
            id: addressId || generateId(),
            name: addressName,
            line: addressLine,
            city: addressCity,
            postalCode: addressPostal,
            country: addressCountry,
            isDefault: isDefault
        };

        // Obtener direcciones existentes
        let addresses = JSON.parse(localStorage.getItem(ADDRESSES_KEY)) || [];

        // Si es dirección predeterminada, quitar marca de las demás
        if (isDefault) {
            addresses = addresses.map(addr => ({
                ...addr,
                isDefault: false
            }));
        }

        // Agregar o actualizar dirección
        if (addressId) {
            // Actualizar dirección existente
            addresses = addresses.map(addr => addr.id === addressId ? address : addr);
        } else {
            // Agregar nueva dirección
            addresses.push(address);
        }

        // Guardar en localStorage
        localStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));

        // Recargar lista de direcciones
        loadAddresses();

        // Ocultar formulario
        addressFormContainer.style.display = 'none';
        addAddressButton.style.display = 'inline-flex';

        showNotification('Dirección guardada correctamente', 'success');
    });

    // Función para cargar direcciones
    function loadAddresses() {
        const addresses = JSON.parse(localStorage.getItem(ADDRESSES_KEY)) || [];
        
        // Limpiar contenido actual
        addressesList.innerHTML = '';
        
        if (addresses.length === 0) {
            addressesList.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-geo-alt"></i>
                    <p>No has agregado ninguna dirección todavía.</p>
                </div>
            `;
            return;
        }
        
        // Renderizar cada dirección
        addresses.forEach(address => {
            const addressCard = document.createElement('div');
            addressCard.className = 'address-card';
            addressCard.innerHTML = `
                <div class="address-card-header">
                    <h4 class="address-card-title">
                        ${address.name}
                        ${address.isDefault ? '<span class="default-badge">Predeterminada</span>' : ''}
                    </h4>
                    <div class="address-card-actions">
                        <button class="address-card-action edit-address" data-id="${address.id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="address-card-action delete-address" data-id="${address.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="address-card-content">
                    <p>${address.line}</p>
                    <p>${address.city}, ${address.postalCode}</p>
                    <p>${getCountryName(address.country)}</p>
                </div>
            `;
            
            // Agregar al contenedor
            addressesList.appendChild(addressCard);
            
            // Configurar evento de editar
            addressCard.querySelector('.edit-address').addEventListener('click', () => {
                editAddress(address.id);
            });
            
            // Configurar evento de eliminar
            addressCard.querySelector('.delete-address').addEventListener('click', () => {
                deleteAddress(address.id);
            });
        });
    }
    
    // Función para editar dirección
    function editAddress(id) {
        const addresses = JSON.parse(localStorage.getItem(ADDRESSES_KEY)) || [];
        const address = addresses.find(addr => addr.id === id);
        
        if (address) {
            // Llenar formulario con datos de la dirección
            document.getElementById('address-id').value = address.id;
            document.getElementById('address-name').value = address.name;
            document.getElementById('address-line').value = address.line;
            document.getElementById('address-city').value = address.city;
            document.getElementById('address-postal').value = address.postalCode;
            document.getElementById('address-country').value = address.country;
            document.getElementById('default-address').checked = address.isDefault;
            
            // Actualizar título del formulario
            formTitle.textContent = 'Editar Dirección';
            
            // Mostrar formulario
            addressFormContainer.style.display = 'block';
            addAddressButton.style.display = 'none';
        }
    }
    
    // Función para eliminar dirección
    function deleteAddress(id) {
        if (confirm('¿Estás seguro de que deseas eliminar esta dirección?')) {
            let addresses = JSON.parse(localStorage.getItem(ADDRESSES_KEY)) || [];
            
            // Eliminar dirección
            addresses = addresses.filter(addr => addr.id !== id);
            
            // Guardar en localStorage
            localStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));
            
            // Recargar lista de direcciones
            loadAddresses();
            
            showNotification('Dirección eliminada correctamente', 'success');
        }
    }
    
    // Función para obtener nombre del país
    function getCountryName(countryCode) {
        const countries = {
            'AR': 'Argentina',
            'CL': 'Chile',
            'UY': 'Uruguay',
            'PY': 'Paraguay',
            'BR': 'Brasil',
            'CO': 'Colombia',
            'MX': 'México',
            'ES': 'España'
        };
        
        return countries[countryCode] || countryCode;
    }
}

// Función para inicializar la sección de lista de deseos
function initWishlistSection() {
    const wishlistContainer = document.getElementById('wishlist-items');
    const emptyWishlist = document.getElementById('empty-wishlist');
    
    // Cargar lista de deseos
    loadWishlist();
    
    // Función para cargar lista de deseos
    function loadWishlist() {
        const wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
        
        // Mostrar mensaje si la lista está vacía
        if (wishlist.length === 0) {
            emptyWishlist.style.display = 'block';
            wishlistContainer.style.display = 'none';
            return;
        }
        
        // Ocultar mensaje de vacío y mostrar productos
        emptyWishlist.style.display = 'none';
        wishlistContainer.style.display = 'grid';
        
        // Limpiar contenido actual
        wishlistContainer.innerHTML = '';
        
        // Renderizar cada producto
        wishlist.forEach(product => {
            const wishlistItem = document.createElement('div');
            wishlistItem.className = 'wishlist-item';
            wishlistItem.innerHTML = `
                <img src="${product.imagen}" alt="${product.titulo}" class="wishlist-item-img">
                <div class="wishlist-item-info">
                    <h4 class="wishlist-item-title">${product.titulo}</h4>
                    <p class="wishlist-item-price">$${product.precio}</p>
                    <div class="wishlist-item-actions">
                        <button class="wishlist-add-to-cart" data-id="${product.id}">
                            <i class="bi bi-cart-plus"></i>
                        </button>
                        <button class="wishlist-remove" data-id="${product.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            // Agregar al contenedor
            wishlistContainer.appendChild(wishlistItem);
            
            // Configurar evento de agregar al carrito
            wishlistItem.querySelector('.wishlist-add-to-cart').addEventListener('click', () => {
                addToCart(product);
            });
            
            // Configurar evento de eliminar de la lista
            wishlistItem.querySelector('.wishlist-remove').addEventListener('click', () => {
                removeFromWishlist(product.id);
            });
        });
    }
    
    // Función para agregar al carrito
    function addToCart(product) {
        // Obtener carrito actual
        let cart = JSON.parse(localStorage.getItem('productos-en-carrito')) || [];
        
        // Verificar si el producto ya está en el carrito
        const existingProductIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingProductIndex >= 0) {
            // Si el producto ya existe, aumentar cantidad
            cart[existingProductIndex].cantidad++;
        } else {
            // Si el producto no existe, agregarlo con cantidad 1
            const productWithQuantity = { ...product, cantidad: 1 };
            cart.push(productWithQuantity);
        }
        
        // Guardar carrito actualizado
        localStorage.setItem('productos-en-carrito', JSON.stringify(cart));
        
        showNotification('Producto agregado al carrito', 'success');
    }
    
    // Función para eliminar de la lista de deseos
    function removeFromWishlist(productId) {
        let wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
        
        // Eliminar producto
        wishlist = wishlist.filter(product => product.id !== productId);
        
        // Guardar lista actualizada
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
        
        // Recargar lista
        loadWishlist();
        
        showNotification('Producto eliminado de la lista de deseos', 'success');
    }
}

// Función para inicializar la sección de pedidos
function initOrdersSection() {
    const ordersList = document.getElementById('orders-list');
    const emptyOrders = document.getElementById('empty-orders');
    
    // Cargar pedidos
    loadOrders();
    
    // Función para cargar pedidos
    function loadOrders() {
        const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
        
        // Mostrar mensaje si no hay pedidos
        if (orders.length === 0) {
            emptyOrders.style.display = 'block';
            ordersList.style.display = 'none';
            return;
        }
        
        // Ocultar mensaje de vacío y mostrar pedidos
        emptyOrders.style.display = 'none';
        ordersList.style.display = 'flex';
        
        // Limpiar contenido actual
        ordersList.innerHTML = '';
        
        // Renderizar cada pedido
        orders.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';
            
            // Calcular subtotal
            const subtotal = order.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
            
            orderCard.innerHTML = `
                <div class="order-header">
                    <span class="order-id">Pedido #${order.id}</span>
                    <span class="order-status ${order.status.toLowerCase()}">${getStatusText(order.status)}</span>
                </div>
                <div class="order-info">
                    <div class="order-info-item">
                        <span class="order-info-label">Fecha</span>
                        <span class="order-info-value">${formatDate(order.date)}</span>
                    </div>
                    <div class="order-info-item">
                        <span class="order-info-label">Total</span>
                        <span class="order-info-value">$${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="order-info-item">
                        <span class="order-info-label">Productos</span>
                        <span class="order-info-value">${order.items.length} items</span>
                    </div>
                    <div class="order-info-item">
                        <span class="order-info-label">Envío</span>
                        <span class="order-info-value">${order.shippingMethod}</span>
                    </div>
                </div>
                <div class="order-products">
                    ${renderOrderProducts(order.items.slice(0, 2))}
                    ${order.items.length > 2 ? `<p class="more-products">+ ${order.items.length - 2} productos más</p>` : ''}
                </div>
                <div class="order-actions">
                    <button class="view-order-details" data-id="${order.id}">Ver Detalles</button>
                    <button class="reorder" data-id="${order.id}">Reordenar</button>
                </div>
            `;
            
            // Agregar al contenedor
            ordersList.appendChild(orderCard);
            
            // Configurar evento de ver detalles
            orderCard.querySelector('.view-order-details').addEventListener('click', () => {
                // Aquí iría la lógica para ver los detalles del pedido
                alert(`Ver detalles del pedido #${order.id}`);
            });
            
            // Configurar evento de reordenar
            orderCard.querySelector('.reorder').addEventListener('click', () => {
                reorder(order.id);
            });
        });
    }
    
    // Función para renderizar productos del pedido
    function renderOrderProducts(products) {
        return products.map(product => `
            <div class="order-product">
                <img src="${product.imagen}" alt="${product.titulo}" class="order-product-img">
                <div class="order-product-details">
                    <h5 class="order-product-name">${product.titulo}</h5>
                    <p class="order-product-variant">Cantidad: ${product.cantidad}</p>
                    <p class="order-product-price">$${product.precio}</p>
                </div>
            </div>
        `).join('');
    }
    
    // Función para reordenar
    function reorder(orderId) {
        const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
        const order = orders.find(o => o.id === orderId);
        
        if (order) {
            // Obtener carrito actual
            let cart = JSON.parse(localStorage.getItem('productos-en-carrito')) || [];
            
            // Agregar productos del pedido al carrito
            order.items.forEach(product => {
                // Verificar si el producto ya está en el carrito
                const existingProductIndex = cart.findIndex(item => item.id === product.id);
                
                if (existingProductIndex >= 0) {
                    // Si el producto ya existe, aumentar cantidad
                    cart[existingProductIndex].cantidad += product.cantidad;
                } else {
                    // Si el producto no existe, agregarlo con la cantidad del pedido
                    cart.push({ ...product });
                }
            });
            
            // Guardar carrito actualizado
            localStorage.setItem('productos-en-carrito', JSON.stringify(cart));
            
            showNotification('Productos agregados al carrito', 'success');
            
            // Redirigir al carrito
            setTimeout(() => {
                window.location.href = 'cart.html';
            }, 1500);
        }
    }
    
    // Función para obtener texto de estado
    function getStatusText(status) {
        const statusMap = {
            'COMPLETED': 'Completado',
            'PROCESSING': 'En proceso',
            'SHIPPED': 'Enviado',
            'CANCELLED': 'Cancelado'
        };
        
        return statusMap[status] || status;
    }
    
    // Función para formatear fecha
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
}

// Función para inicializar la sección de notificaciones
function initNotificationsSection() {
    const toggles = document.querySelectorAll('.toggle-checkbox');
    
    // Cargar configuraciones guardadas
    const settings = JSON.parse(localStorage.getItem(USER_SETTINGS_KEY)) || {};
    const notifications = settings.notifications || {
        promoEmails: true,
        orderNotifications: true,
        restockNotifications: false,
        newProductsNotifications: false
    };
    
    // Establecer estados de los toggles
    document.getElementById('promo-emails').checked = notifications.promoEmails;
    document.getElementById('order-notifications').checked = notifications.orderNotifications;
    document.getElementById('restock-notifications').checked = notifications.restockNotifications;
    document.getElementById('new-products-notifications').checked = notifications.newProductsNotifications;
    
    // Configurar eventos de cambio
    toggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
            // Actualizar configuraciones
            notifications.promoEmails = document.getElementById('promo-emails').checked;
            notifications.orderNotifications = document.getElementById('order-notifications').checked;
            notifications.restockNotifications = document.getElementById('restock-notifications').checked;
            notifications.newProductsNotifications = document.getElementById('new-products-notifications').checked;
            
            // Guardar configuraciones
            settings.notifications = notifications;
            localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(settings));
            
            showNotification('Preferencias de notificaciones actualizadas', 'success');
        });
    });
}

// Función para inicializar la sección de seguridad
function initSecuritySection() {
    const passwordForm = document.getElementById('change-password-form');
    const currentPassword = document.getElementById('current-password');
    const newPassword = document.getElementById('new-password');
    const confirmPassword = document.getElementById('confirm-new-password');
    
    // Manejar cambio de contraseña
    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validar campos requeridos
        if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
            showNotification('Por favor, completa todos los campos', 'error');
            return;
        }
        
        // Validar que las contraseñas coincidan
        if (newPassword.value !== confirmPassword.value) {
            showNotification('Las contraseñas no coinciden', 'error');
            return;
        }
        
        // Validar requisitos de contraseña
        if (!validatePassword(newPassword.value)) {
            showNotification('La contraseña no cumple con los requisitos de seguridad', 'error');
            return;
        }
        
        // Simulación de cambio de contraseña exitoso
        showNotification('Contraseña actualizada correctamente', 'success');
        
        // Limpiar formulario
        passwordForm.reset();
    });
    
    // Configurar cierre de sesión
    document.querySelectorAll('.logout-session, .logout-all-button').forEach(button => {
        button.addEventListener('click', () => {
            showNotification('Sesión cerrada correctamente', 'success');
            
            // Simular cierre de sesión
            setTimeout(() => {
                if (button.classList.contains('logout-all-button')) {
                    logout();
                }
            }, 1500);
        });
    });
    
    // Función para validar requisitos de contraseña
    function validatePassword(password) {
        // Al menos 8 caracteres
        if (password.length < 8) return false;
        
        // Al menos una letra mayúscula
        if (!/[A-Z]/.test(password)) return false;
        
        // Al menos un número
        if (!/[0-9]/.test(password)) return false;
        
        // Al menos un carácter especial
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
        
        return true;
    }
}

// Función para generar ID único
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
} 
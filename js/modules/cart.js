/**
 * Módulo para la gestión del carrito
 */

// Constantes
export const LOCAL_STORAGE_KEY = "productos-en-carrito";
export const DISCOUNT_CODES_KEY = "discount-codes";

// Códigos de descuento disponibles
const AVAILABLE_DISCOUNT_CODES = {
    "WELCOME10": { percentage: 10, description: "10% de descuento en tu primera compra" },
    "SUMMER25": { percentage: 25, description: "25% de descuento en toda la tienda" },
    "FREESHIP": { percentage: 15, description: "15% de descuento + envío gratis" }
};

// Función para guardar el carrito en localStorage
export const saveCartToLocalStorage = (cart) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
};

// Función para cargar el carrito desde localStorage
export const loadCartFromLocalStorage = () => {
    const cart = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    return cart || [];
};

// Función para agregar un producto al carrito
export const addProductToCart = (cart, product) => {
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex >= 0) {
        // Si el producto ya existe, aumentar cantidad
        const updatedCart = [...cart];
        updatedCart[existingProductIndex].cantidad++;
        return updatedCart;
    } else {
        // Si el producto no existe, agregarlo con cantidad 1
        const productWithQuantity = { ...product, cantidad: 1 };
        return [...cart, productWithQuantity];
    }
};

// Función para eliminar un producto del carrito
export const removeProductFromCart = (cart, productId) => {
    return cart.filter(product => product.id !== productId);
};

// Función para actualizar la cantidad de un producto
export const updateProductQuantity = (cart, productId, quantity) => {
    return cart.map(product => {
        if (product.id === productId) {
            return {
                ...product,
                cantidad: quantity
            };
        }
        return product;
    });
};

// Función para vaciar el carrito
export const emptyCart = () => {
    return [];
};

// Función para calcular el total del carrito
export const calculateCartTotal = (cart, discountCode = null) => {
    // Calcular subtotal
    const subtotal = cart.reduce((total, product) => total + (product.precio * product.cantidad), 0);
    
    // Aplicar descuento si hay código válido
    if (discountCode && AVAILABLE_DISCOUNT_CODES[discountCode]) {
        const discountPercentage = AVAILABLE_DISCOUNT_CODES[discountCode].percentage;
        const discountAmount = (subtotal * discountPercentage) / 100;
        return subtotal - discountAmount;
    }
    
    return subtotal;
};

// Función para contar items en el carrito
export const countCartItems = (cart) => {
    return cart.reduce((total, product) => total + product.cantidad, 0);
};

// Función para verificar si un código de descuento es válido
export const isValidDiscountCode = (code) => {
    return code in AVAILABLE_DISCOUNT_CODES;
};

// Función para obtener información de un código de descuento
export const getDiscountInfo = (code) => {
    return AVAILABLE_DISCOUNT_CODES[code] || null;
};

// Función para guardar el código de descuento aplicado
export const saveDiscountCode = (code) => {
    localStorage.setItem(DISCOUNT_CODES_KEY, code);
};

// Función para obtener el código de descuento aplicado
export const getAppliedDiscountCode = () => {
    return localStorage.getItem(DISCOUNT_CODES_KEY);
};

// Función para calcular el descuento aplicado
export const calculateDiscount = (subtotal, discountCode) => {
    if (discountCode && AVAILABLE_DISCOUNT_CODES[discountCode]) {
        const discountPercentage = AVAILABLE_DISCOUNT_CODES[discountCode].percentage;
        return (subtotal * discountPercentage) / 100;
    }
    return 0;
}; 
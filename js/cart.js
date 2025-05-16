/**
 * Script principal para la página del carrito
 */

// Importar módulos
import { 
    loadCartFromLocalStorage, 
    saveCartToLocalStorage, 
    removeProductFromCart, 
    updateProductQuantity,
    emptyCart,
    isValidDiscountCode,
    saveDiscountCode,
    getAppliedDiscountCode,
    getDiscountInfo
} from './modules/cart.js';
import { 
    renderCart, 
    showNotification, 
    showConfirmation, 
    showPurchaseComplete 
} from './modules/ui.js';

// Elementos del DOM
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");
const contenedorSubtotal = document.querySelector("#subtotal");
const contenedorDescuento = document.querySelector("#descuento");
const contenedorCodigoDescuento = document.querySelector("#carrito-codigo-descuento");
const numerito = document.querySelector("#numerito");

// Variables globales
let carrito = loadCartFromLocalStorage() || [];
let discountCode = getAppliedDiscountCode();

// Contenedores para la función renderCart
const containers = {
    emptyCartContainer: contenedorCarritoVacio,
    productsContainer: contenedorCarritoProductos,
    actionsContainer: contenedorCarritoAcciones,
    purchasedContainer: contenedorCarritoComprado,
    totalContainer: contenedorTotal,
    subtotalContainer: contenedorSubtotal,
    discountContainer: contenedorDescuento,
    discountCodeContainer: contenedorCodigoDescuento
};

// Callbacks para la función renderCart
const callbacks = {
    onRemoveProduct: eliminarDelCarrito,
    onEmptyCart: vaciarCarrito,
    onUpdateQuantity: actualizarCantidad,
    onApplyDiscount: aplicarCodigoDescuento
};

// Inicialización
const init = () => {
    renderCart(carrito, containers, callbacks);
    setupEventListeners();
};

// Configurar event listeners
const setupEventListeners = () => {
    botonVaciar.addEventListener("click", vaciarCarrito);
    botonComprar.addEventListener("click", comprarCarrito);
};

// Función para eliminar un producto del carrito
function eliminarDelCarrito(e) {
    showNotification("¡Producto eliminado del carrito!");
    
    const idBoton = e.currentTarget.id;
    carrito = removeProductFromCart(carrito, idBoton);
    
    saveCartToLocalStorage(carrito);
    renderCart(carrito, containers, callbacks);
    
    actualizarContadorCarrito();
}

// Función para vaciar el carrito
function vaciarCarrito() {
    const productCount = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    const message = `${productCount} producto/s serán eliminados del carrito`;
    
    showConfirmation("¿Deseas vaciar tu carrito?", message, () => {
        carrito = emptyCart();
        saveCartToLocalStorage(carrito);
        renderCart(carrito, containers, callbacks);
        
        actualizarContadorCarrito();
    });
}

// Función para actualizar la cantidad de un producto
function actualizarCantidad(productId, newQuantity) {
    if (newQuantity > 0) {
        carrito = updateProductQuantity(carrito, productId, newQuantity);
        saveCartToLocalStorage(carrito);
        renderCart(carrito, containers, callbacks);
        
        actualizarContadorCarrito();
        showNotification("Cantidad actualizada");
    }
}

// Función para aplicar un código de descuento
function aplicarCodigoDescuento(code) {
    if (!code) {
        // Si no hay código, remover cualquier descuento existente
        localStorage.removeItem('discount-codes');
        discountCode = null;
        renderCart(carrito, containers, callbacks);
        showNotification("Código de descuento eliminado");
        return;
    }
    
    // Verificar si el código es válido
    if (isValidDiscountCode(code)) {
        const discountInfo = getDiscountInfo(code);
        saveDiscountCode(code);
        discountCode = code;
        renderCart(carrito, containers, callbacks);
        showNotification(`¡Descuento del ${discountInfo.percentage}% aplicado!`);
    } else {
        showNotification("Código de descuento inválido", { 
            style: { background: "#aa0000" }
        });
    }
}

// Función para actualizar el contador del carrito en la barra lateral
function actualizarContadorCarrito() {
    if (numerito) {
        const itemCount = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
        numerito.innerText = itemCount;
    }
}

// Función para finalizar la compra
function comprarCarrito() {
    // Verificar que el carrito no esté vacío
    if (carrito.length === 0) {
        showNotification("Tu carrito está vacío", { 
            style: { background: "#aa0000" }
        });
        return;
    }
    
    // Redirigir al checkout en lugar de vaciar el carrito y mostrar mensaje
    window.location.href = "./checkout.html";
}

// Iniciar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', init);
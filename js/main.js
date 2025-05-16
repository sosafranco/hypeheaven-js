/**
 * Script principal para la página de productos
 */

// Importar módulos
import { fetchProducts, filterProductsByCategory, findProductById } from './modules/products.js';
import { 
    loadCartFromLocalStorage, 
    saveCartToLocalStorage, 
    addProductToCart
} from './modules/cart.js';
import { 
    renderProducts, 
    showNotification, 
    updateCartBadge 
} from './modules/ui.js';

// Elementos del DOM
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".nav-link[id]");
const numerito = document.querySelector("#numerito");

// Variables globales
let productos = [];
let carrito = loadCartFromLocalStorage();

// Inicialización
const init = async () => {
    // Cargar productos
    productos = await fetchProducts();
    
    // Renderizar productos
    renderProducts(productos, contenedorProductos, agregarAlCarrito);
    
    // Actualizar contador del carrito
    updateCartBadge(carrito, numerito);
    
    // Configurar eventos de categorías
    setupCategoryButtons();
};

// Configurar botones de categoría
const setupCategoryButtons = () => {
    botonesCategorias.forEach(boton => {
        boton.addEventListener("click", (e) => {
            // Actualizar estado visual de los botones
            botonesCategorias.forEach(btn => btn.classList.remove("active"));
            e.currentTarget.classList.add("active");
            
            // Filtrar productos por categoría
            const categoriaId = e.currentTarget.id;
            const productosFiltrados = filterProductsByCategory(productos, categoriaId);
            
            // Renderizar productos filtrados
            renderProducts(productosFiltrados, contenedorProductos, agregarAlCarrito);
        });
    });
};

// Función para agregar productos al carrito
function agregarAlCarrito(e) {
    // Mostrar notificación
    showNotification("¡Producto agregado al carrito!");
    
    // Obtener producto seleccionado
    const idBoton = e.currentTarget.id;
    const productoAgregado = findProductById(productos, idBoton);
    
    // Actualizar carrito
    carrito = addProductToCart(carrito, productoAgregado);
    
    // Guardar en localStorage
    saveCartToLocalStorage(carrito);
    
    // Actualizar contador
    updateCartBadge(carrito, numerito);
}

// Iniciar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', init);
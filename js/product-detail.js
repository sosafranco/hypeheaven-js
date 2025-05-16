/**
 * Script principal para la página de detalle de producto
 */

// Importar módulos
import { getProductById } from './modules/products.js';
import { 
    loadCartFromLocalStorage, 
    saveCartToLocalStorage, 
    addProductToCart
} from './modules/cart.js';
import { 
    showNotification, 
    updateCartBadge 
} from './modules/ui.js';
import { renderReviews } from './modules/reviews.js';

// Elementos del DOM
const contenedorProducto = document.querySelector("#contenedor-producto");
const contenedorReviews = document.querySelector("#contenedor-reviews");
const numerito = document.querySelector("#numerito");

// Variables globales
let producto = null;
let carrito = loadCartFromLocalStorage();
let cantidadSeleccionada = 1;
let tallaSeleccionada = '';

// Inicialización
const init = async () => {
    // Actualizar contador del carrito
    updateCartBadge(carrito, numerito);
    
    // Obtener el ID del producto desde la URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    
    if (!productId) {
        mostrarError("No se proporcionó un ID de producto válido");
        return;
    }
    
    // Cargar datos del producto
    try {
        producto = await getProductById(productId);
        
        if (producto) {
            renderizarProducto(producto);
            setupEventListeners();
            
            // Renderizar las reseñas del producto
            renderReviews(productId, contenedorReviews);
        } else {
            mostrarError("No se encontró el producto solicitado");
        }
    } catch (error) {
        console.error("Error al cargar el producto:", error);
        mostrarError("Ocurrió un error al cargar el producto");
    }
};

// Función para mostrar un mensaje de error
const mostrarError = (mensaje) => {
    contenedorProducto.innerHTML = `
        <div class="error-mensaje">
            <i class="bi bi-exclamation-triangle-fill"></i>
            <p>${mensaje}</p>
            <a href="./index.html" class="boton-volver-inicio">Volver al inicio</a>
        </div>
    `;
};

// Función para renderizar los datos del producto
const renderizarProducto = (producto) => {
    // Si es la primera talla, seleccionarla por defecto
    if (producto.tallas && producto.tallas.length > 0) {
        tallaSeleccionada = producto.tallas[0];
    }
    
    // Renderizar la interfaz del producto
    contenedorProducto.innerHTML = `
        <div class="producto-detalle">
            <div class="producto-imagenes">
                <div class="producto-imagen-contenedor">
                    <img src="${producto.imagen}" alt="${producto.titulo}" class="producto-imagen-grande">
                </div>
                <div class="producto-thumbs">
                    ${producto.imagenes.map((img, index) => `
                        <img src="${img}" alt="${producto.titulo} ${index + 1}" 
                            class="producto-thumb ${index === 0 ? 'active' : ''}" 
                            data-index="${index}">
                    `).join('')}
                </div>
            </div>
            <div class="producto-info">
                <span class="producto-categoria-detalle">${producto.categoria.nombre}</span>
                <h1 class="producto-titulo-detalle">${producto.titulo}</h1>
                <p class="producto-precio-detalle">USD$${producto.precio}</p>
                <div class="producto-descripcion">
                    ${producto.descripcion}
                </div>
                
                <div class="producto-opciones">
                    <div class="producto-tallas">
                        <div class="producto-tallas-titulo">Talla</div>
                        <div class="producto-tallas-opciones">
                            ${producto.tallas.map(talla => `
                                <div class="producto-talla ${talla === tallaSeleccionada ? 'selected' : ''}" 
                                    data-talla="${talla}">${talla}</div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="producto-cantidad">
                        <div class="producto-cantidad-titulo">Cantidad</div>
                        <div class="producto-cantidad-controles">
                            <button class="producto-cantidad-boton" id="disminuir">-</button>
                            <span class="producto-cantidad-numero">${cantidadSeleccionada}</span>
                            <button class="producto-cantidad-boton" id="aumentar">+</button>
                        </div>
                    </div>
                </div>
                
                <div class="producto-botones">
                    <button class="producto-agregar-carrito" id="agregar-al-carrito">
                        Agregar al carrito
                    </button>
                </div>
            </div>
        </div>
        
        <div class="producto-detalles-adicionales">
            <div class="producto-tabs">
                <div class="producto-tab active" data-tab="caracteristicas">Características</div>
                <div class="producto-tab" data-tab="envio">Envío</div>
                <div class="producto-tab" data-tab="devoluciones">Devoluciones</div>
            </div>
            
            <div class="producto-tab-contenido active" id="tab-caracteristicas">
                <div class="producto-caracteristicas">
                    ${producto.caracteristicas.map(caracteristica => `
                        <div class="producto-caracteristica">
                            <span class="producto-caracteristica-icono">
                                <i class="bi bi-check-circle-fill"></i>
                            </span>
                            <span>${caracteristica}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="producto-tab-contenido" id="tab-envio">
                <p>Envío gratuito a toda la Argentina para compras superiores a $15.000.</p>
                <p>Tiempo estimado de entrega: 3-5 días hábiles.</p>
                <p>Envíos internacionales disponibles a países seleccionados.</p>
            </div>
            
            <div class="producto-tab-contenido" id="tab-devoluciones">
                <p>Tienes 30 días para devolver los productos que no estén usados y con todas sus etiquetas.</p>
                <p>Las devoluciones son gratuitas si utilizas nuestras etiquetas de devolución.</p>
                <p>Para más información sobre nuestra política de devoluciones, contáctanos.</p>
            </div>
        </div>
    `;
};

// Configurar event listeners
const setupEventListeners = () => {
    // Cambiar imagen principal al hacer clic en miniaturas
    const thumbs = document.querySelectorAll('.producto-thumb');
    thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            // Desactivar todas las miniaturas
            thumbs.forEach(t => t.classList.remove('active'));
            
            // Activar la miniatura seleccionada
            thumb.classList.add('active');
            
            // Actualizar imagen principal
            const imagenGrande = document.querySelector('.producto-imagen-grande');
            imagenGrande.src = thumb.src;
        });
    });
    
    // Selección de tallas
    const tallas = document.querySelectorAll('.producto-talla');
    tallas.forEach(talla => {
        talla.addEventListener('click', () => {
            // Desactivar todas las tallas
            tallas.forEach(t => t.classList.remove('selected'));
            
            // Activar la talla seleccionada
            talla.classList.add('selected');
            
            // Actualizar talla seleccionada
            tallaSeleccionada = talla.dataset.talla;
        });
    });
    
    // Control de cantidad
    const btnDisminuir = document.querySelector('#disminuir');
    const btnAumentar = document.querySelector('#aumentar');
    const cantidadNumero = document.querySelector('.producto-cantidad-numero');
    
    btnDisminuir.addEventListener('click', () => {
        if (cantidadSeleccionada > 1) {
            cantidadSeleccionada--;
            cantidadNumero.textContent = cantidadSeleccionada;
        }
    });
    
    btnAumentar.addEventListener('click', () => {
        cantidadSeleccionada++;
        cantidadNumero.textContent = cantidadSeleccionada;
    });
    
    // Agregar al carrito
    const btnAgregarCarrito = document.querySelector('#agregar-al-carrito');
    btnAgregarCarrito.addEventListener('click', agregarAlCarrito);
    
    // Tabs de información adicional
    const tabs = document.querySelectorAll('.producto-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Desactivar todos los tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Ocultar todos los contenidos
            document.querySelectorAll('.producto-tab-contenido')
                .forEach(c => c.classList.remove('active'));
            
            // Activar tab seleccionado
            tab.classList.add('active');
            
            // Mostrar contenido correspondiente
            const tabId = `tab-${tab.dataset.tab}`;
            document.querySelector(`#${tabId}`).classList.add('active');
        });
    });
};

// Función para agregar al carrito
const agregarAlCarrito = () => {
    if (!tallaSeleccionada) {
        showNotification("Por favor, selecciona una talla", { 
            style: { background: "#c00" }
        });
        return;
    }
    
    // Crear un producto con la información seleccionada
    const productoParaCarrito = {
        ...producto,
        cantidad: cantidadSeleccionada,
        talla: tallaSeleccionada,
    };
    
    // Agregar al carrito
    carrito = addProductToCart(carrito, productoParaCarrito);
    
    // Guardar en localStorage
    saveCartToLocalStorage(carrito);
    
    // Actualizar contador del carrito
    updateCartBadge(carrito, numerito);
    
    // Mostrar notificación
    showNotification("Producto agregado al carrito", { 
        style: { background: "#4b8068" } 
    });
};

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", init); 
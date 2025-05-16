/**
 * Módulo para la gestión de la interfaz de usuario
 */

import { 
    countCartItems, 
    calculateCartTotal, 
    calculateDiscount, 
    getAppliedDiscountCode, 
    getDiscountInfo 
} from './cart.js';

// Función para mostrar notificaciones
export const showNotification = (message, options = {}) => {
    Toastify({
        text: message,
        duration: 1500,
        close: false,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "#2b2b2b",
            borderRadius: "1.5rem",
            textTransform: "uppercase",
            fontSize: "0.80rem",
            ...options.style
        },
        onClick: function () { }
    }).showToast();
};

// Función para mostrar confirmación
export const showConfirmation = (title, message, confirmCallback) => {
    Swal.fire({
        title,
        icon: "question",
        html: message,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: `Sí`,
        cancelButtonText: `No`,
    }).then((result) => {
        if (result.isConfirmed && confirmCallback) {
            confirmCallback();
        }
    });
};

// Función para renderizar productos en la página principal
export const renderProducts = (products, container, addToCartCallback) => {
    // Primero animamos la salida de los productos actuales
    const currentProducts = container.querySelectorAll('.producto');
    
    if (currentProducts.length > 0) {
        // Fase 1: Ocultar productos actuales con animación
        currentProducts.forEach(producto => {
            producto.classList.add('hidden');
        });
        
        // Esperar a que termine la animación antes de actualizar el contenido
        setTimeout(() => {
            // Fase 2: Limpiar contenedor
            container.innerHTML = "";
            
            // Fase 3: Añadir nuevos productos con animación de entrada
            renderNewProducts(products, container, addToCartCallback);
        }, 300); // Tiempo ligeramente menor que la transición para que parezca fluido
    } else {
        // Si no hay productos previos, simplemente mostrar los nuevos
        container.innerHTML = "";
        renderNewProducts(products, container, addToCartCallback);
    }
};

// Función auxiliar para renderizar nuevos productos con animación
const renderNewProducts = (products, container, addToCartCallback) => {
    if (products.length === 0) {
        const emptyMessage = document.createElement("div");
        emptyMessage.classList.add("empty-results");
        emptyMessage.innerHTML = `
            <p>No se encontraron productos en esta categoría</p>
        `;
        container.appendChild(emptyMessage);
        return;
    }
    
    products.forEach((producto, index) => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.style.opacity = "0"; // Inicialmente invisible
        div.innerHTML = `
        <a href="product-detail.html?id=${producto.id}" class="producto-enlace">
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">USD$${producto.precio}</p>
            </div>
        </a>
        <button class="producto-agregar" id="${producto.id}">Agregar al carrito</button>
        `;

        container.append(div);
        
        // Aplicar efecto de aparición escalonado
        setTimeout(() => {
            div.style.opacity = "1";
            div.style.transform = "translateY(0)";
        }, 50 * index); // Efecto escalonado por producto
    });

    // Actualizar botones agregar
    const botonesAgregar = document.querySelectorAll(".producto-agregar");
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", addToCartCallback);
    });
};

// Función para renderizar el carrito
export const renderCart = (cart, containers, callbacks) => {
    const {
        emptyCartContainer,
        productsContainer,
        actionsContainer,
        purchasedContainer,
        totalContainer,
        subtotalContainer,
        discountContainer,
        discountCodeContainer
    } = containers;

    const {
        onRemoveProduct,
        onEmptyCart,
        onUpdateQuantity,
        onApplyDiscount
    } = callbacks;

    if (cart && cart.length > 0) {
        // Mostrar productos y acciones, ocultar mensajes
        emptyCartContainer.classList.add("disabled");
        productsContainer.classList.remove("disabled");
        actionsContainer.classList.remove("disabled");
        purchasedContainer.classList.add("disabled");

        // Limpiar contenedor de productos
        productsContainer.innerHTML = "";

        // Renderizar cada producto
        cart.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
            <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="carrito-producto-titulo">
                <small>Producto</small>
                <h3>${producto.titulo}</h3>
                ${producto.talla ? `<small>Talla: ${producto.talla}</small>` : ''}
            </div>
            <div class="carrito-producto-cantidad">
                <small>Cantidad</small>
                <div class="carrito-cantidad-controles">
                    <button class="cantidad-btn restar" data-id="${producto.id}">-</button>
                    <span class="cantidad-numero">${producto.cantidad}</span>
                    <button class="cantidad-btn sumar" data-id="${producto.id}">+</button>
                </div>
            </div>
            <div class="carrito-producto-precio">
                <small>Precio</small>
                <p>USD$${producto.precio}</p>
            </div>
            <div class="carrito-producto-subtotal">
                <small>Subtotal</small>
                <p>USD$${producto.precio * producto.cantidad}</p>
            </div>
            <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;

            productsContainer.append(div);
        });

        // Actualizar botones eliminar
        const botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
        botonesEliminar.forEach(boton => {
            boton.addEventListener("click", onRemoveProduct);
        });

        // Configurar controles de cantidad
        const botonesSumar = document.querySelectorAll(".cantidad-btn.sumar");
        const botonesRestar = document.querySelectorAll(".cantidad-btn.restar");

        botonesSumar.forEach(boton => {
            boton.addEventListener("click", () => {
                const productId = boton.dataset.id;
                const cantidadActual = parseInt(boton.parentElement.querySelector(".cantidad-numero").textContent);
                onUpdateQuantity(productId, cantidadActual + 1);
            });
        });

        botonesRestar.forEach(boton => {
            boton.addEventListener("click", () => {
                const productId = boton.dataset.id;
                const cantidadActual = parseInt(boton.parentElement.querySelector(".cantidad-numero").textContent);
                if (cantidadActual > 1) {
                    onUpdateQuantity(productId, cantidadActual - 1);
                }
            });
        });

        // Calcular valores
        const discountCode = getAppliedDiscountCode();
        const subtotal = cart.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
        const discount = calculateDiscount(subtotal, discountCode);
        const total = calculateCartTotal(cart, discountCode);

        // Actualizar el total y subtotal
        if (subtotalContainer) {
            subtotalContainer.innerText = `$${subtotal}`;
        }
        
        if (totalContainer) {
            totalContainer.innerText = `$${total}`;
        }

        // Mostrar descuento si hay código aplicado
        if (discountContainer && discountCodeContainer) {
            if (discountCode && discount > 0) {
                const discountInfo = getDiscountInfo(discountCode);
                discountContainer.innerHTML = `
                    <div class="descuento-aplicado">
                        <span>Descuento (${discountInfo.percentage}%):</span>
                        <span>-$${discount}</span>
                    </div>
                `;
                discountContainer.classList.remove("disabled");
                discountCodeContainer.querySelector('input').value = discountCode;
            } else {
                discountContainer.classList.add("disabled");
            }
        }

        // Configurar código de descuento
        if (discountCodeContainer && onApplyDiscount) {
            const discountForm = discountCodeContainer.querySelector('form');
            if (discountForm) {
                discountForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const codeInput = discountForm.querySelector('input');
                    onApplyDiscount(codeInput.value.trim());
                });
            }
        }

    } else {
        // Ocultar productos y acciones, mostrar mensaje de carrito vacío
        emptyCartContainer.classList.remove("disabled");
        productsContainer.classList.add("disabled");
        actionsContainer.classList.add("disabled");
        purchasedContainer.classList.add("disabled");
    }
};

// Función para mostrar mensaje de compra realizada
export const showPurchaseComplete = (containers) => {
    const {
        emptyCartContainer,
        productsContainer,
        actionsContainer,
        purchasedContainer
    } = containers;

    emptyCartContainer.classList.add("disabled");
    productsContainer.classList.add("disabled");
    actionsContainer.classList.add("disabled");
    purchasedContainer.classList.remove("disabled");
};

// Función para actualizar el contador del carrito
export const updateCartBadge = (cart, badgeElement) => {
    const count = countCartItems(cart);
    badgeElement.innerText = count;
}; 
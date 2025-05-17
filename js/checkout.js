/**
 * Script principal para la página de checkout
 */

// Importar módulos
import { 
    loadCartFromLocalStorage,
    getAppliedDiscountCode,
    calculateCartTotal,
    calculateDiscount,
    getDiscountInfo
} from './modules/cart.js';
import { showNotification } from './modules/ui.js';
import { initTheme, createDarkModeToggle } from './modules/theme.js';

// Elementos del DOM
const productosContainer = document.getElementById('checkout-productos');
const subtotalElement = document.getElementById('checkout-subtotal');
const descuentoElement = document.getElementById('checkout-descuento');
const envioElement = document.getElementById('checkout-envio');
const totalElement = document.getElementById('checkout-total');
const formularioPersonal = document.getElementById('form-personal');
const formularioDireccion = document.getElementById('form-direccion');
const formularioPago = document.getElementById('form-pago');
const formConfirmacion = document.getElementById('form-confirmacion');
const btnFinalizar = document.getElementById('btn-finalizar');
const pedidoCompletado = document.getElementById('pedido-completado');

// Variables globales
let carrito = [];
let discountCode = null;
let currentStep = 1;
const COSTO_ENVIO = 15; // Costo fijo de envío

// Inicialización
const init = () => {
    // Inicializar tema (modo claro/oscuro)
    initTheme();
    
    // Añadir toggle para modo oscuro en la navbar
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        createDarkModeToggle(navMenu);
    }
    
    // Cargar carrito desde localStorage
    carrito = loadCartFromLocalStorage();
    
    // Verificar si el carrito está vacío
    if (!carrito || carrito.length === 0) {
        showNotification("Tu carrito está vacío", { 
            style: { background: "#aa0000" }
        });
        
        // Redirigir al carrito después de un momento
        setTimeout(() => {
            window.location.href = "./cart.html";
        }, 1500);
        return;
    }
    
    // Cargar código de descuento
    discountCode = getAppliedDiscountCode();
    
    // Renderizar productos y totales
    renderizarProductos();
    actualizarTotales();
    
    // Configurar event listeners
    setupEventListeners();
};

// Función para renderizar los productos del carrito
const renderizarProductos = () => {
    productosContainer.innerHTML = '';
    
    carrito.forEach(producto => {
        const div = document.createElement('div');
        div.classList.add('checkout-producto');
        
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.titulo}" class="checkout-producto-imagen">
            <div class="checkout-producto-info">
                <p class="checkout-producto-nombre">${producto.titulo}</p>
                <div class="checkout-producto-detalles">
                    <span>Cantidad: ${producto.cantidad}</span>
                    ${producto.talla ? `<span>Talla: ${producto.talla}</span>` : ''}
                </div>
            </div>
            <p class="checkout-producto-precio">$${(producto.precio * producto.cantidad).toFixed(2)}</p>
        `;
        
        productosContainer.appendChild(div);
    });
};

// Función para actualizar los totales
const actualizarTotales = () => {
    // Calcular subtotal
    const subtotal = carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    
    // Calcular descuento si aplica
    const descuento = calculateDiscount(subtotal, discountCode);
    
    // Calcular total (subtotal - descuento + envío)
    const total = subtotal - descuento + COSTO_ENVIO;
    
    // Actualizar elementos en el DOM
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    envioElement.textContent = `$${COSTO_ENVIO.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
    
    // Mostrar descuento si hay código aplicado
    if (discountCode && descuento > 0) {
        const discountInfo = getDiscountInfo(discountCode);
        descuentoElement.innerHTML = `
            <span>Descuento (${discountInfo.percentage}%):</span>
            <span>-$${descuento.toFixed(2)}</span>
        `;
        descuentoElement.classList.remove('disabled');
    } else {
        descuentoElement.classList.add('disabled');
    }
};

// Configurar event listeners
const setupEventListeners = () => {
    // Botones para navegación entre pasos
    setupStepNavigation();
    
    // Botones de método de pago
    setupPaymentMethods();
    
    // Formulario de confirmación
    setupConfirmationStep();
    
    // Botón finalizar compra
    setupFinishOrder();
};

// Configurar navegación entre pasos
const setupStepNavigation = () => {
    const stepsContainer = document.querySelector('.checkout-progress');
    const forms = document.querySelectorAll('.checkout-form');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    
    // Botones siguiente
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentForm = button.closest('.checkout-form');
            const currentStepNumber = parseInt(currentForm.dataset.step);
            
            // Validar el formulario actual antes de avanzar
            if (validateStep(currentStepNumber)) {
                const nextStep = currentStepNumber + 1;
                goToStep(nextStep);
            }
        });
    });
    
    // Botones anterior
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentForm = button.closest('.checkout-form');
            const currentStepNumber = parseInt(currentForm.dataset.step);
            const prevStep = currentStepNumber - 1;
            
            goToStep(prevStep);
        });
    });
};

// Ir a un paso específico
const goToStep = (stepNumber) => {
    const steps = document.querySelectorAll('.progress-step');
    const forms = document.querySelectorAll('.checkout-form');
    
    // Ocultar todos los forms
    forms.forEach(form => {
        form.classList.remove('active');
    });
    
    // Mostrar el form correspondiente al paso
    const targetForm = document.querySelector(`.checkout-form[data-step="${stepNumber}"]`);
    if (targetForm) {
        targetForm.classList.add('active');
    }
    
    // Actualizar indicadores de pasos
    steps.forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        step.classList.remove('active', 'completed');
        
        if (stepNum === stepNumber) {
            step.classList.add('active');
        } else if (stepNum < stepNumber) {
            step.classList.add('completed');
        }
    });
    
    // Actualizar paso actual
    currentStep = stepNumber;
    
    // Si es el paso de confirmación, actualizar resumen
    if (stepNumber === 4) {
        actualizarResumenConfirmacion();
    }
};

// Validar el paso actual
const validateStep = (stepNumber) => {
    switch (stepNumber) {
        case 1:
            return validatePersonalInfo();
        case 2:
            return validateShippingAddress();
        case 3:
            return validatePaymentMethod();
        default:
            return true;
    }
};

// Validar información personal
const validatePersonalInfo = () => {
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const telefono = document.getElementById('telefono');
    
    if (!nombre.value.trim()) {
        showNotification("Por favor ingresa tu nombre completo", { 
            style: { background: "#aa0000" }
        });
        return false;
    }
    
    if (!email.value.trim() || !isValidEmail(email.value)) {
        showNotification("Por favor ingresa un correo electrónico válido", { 
            style: { background: "#aa0000" }
        });
        return false;
    }
    
    if (!telefono.value.trim()) {
        showNotification("Por favor ingresa tu número de teléfono", { 
            style: { background: "#aa0000" }
        });
        return false;
    }
    
    return true;
};

// Validar dirección de envío
const validateShippingAddress = () => {
    const direccion = document.getElementById('direccion');
    const codigoPostal = document.getElementById('codigo_postal');
    const ciudad = document.getElementById('ciudad');
    const provincia = document.getElementById('provincia');
    const pais = document.getElementById('pais');
    
    if (!direccion.value.trim()) {
        showNotification("Por favor ingresa tu dirección", { 
            style: { background: "#aa0000" }
        });
        return false;
    }
    
    if (!codigoPostal.value.trim()) {
        showNotification("Por favor ingresa tu código postal", { 
            style: { background: "#aa0000" }
        });
        return false;
    }
    
    if (!ciudad.value.trim()) {
        showNotification("Por favor ingresa tu ciudad", { 
            style: { background: "#aa0000" }
        });
        return false;
    }
    
    if (!provincia.value.trim()) {
        showNotification("Por favor ingresa tu provincia", { 
            style: { background: "#aa0000" }
        });
        return false;
    }
    
    if (!pais.value) {
        showNotification("Por favor selecciona tu país", { 
            style: { background: "#aa0000" }
        });
        return false;
    }
    
    return true;
};

// Validar método de pago
const validatePaymentMethod = () => {
    const metodoPago = document.querySelector('input[name="metodo_pago"]:checked');
    
    if (!metodoPago) {
        showNotification("Por favor selecciona un método de pago", { 
            style: { background: "#aa0000" }
        });
        return false;
    }
    
    // Si es tarjeta, validar campos adicionales
    if (metodoPago.value === 'tarjeta') {
        const numeroTarjeta = document.getElementById('numero_tarjeta');
        const fechaVencimiento = document.getElementById('fecha_vencimiento');
        const cvv = document.getElementById('cvv');
        const titular = document.getElementById('titular');
        
        if (!numeroTarjeta.value.trim()) {
            showNotification("Por favor ingresa el número de tarjeta", { 
                style: { background: "#aa0000" }
            });
            return false;
        }
        
        if (!fechaVencimiento.value.trim()) {
            showNotification("Por favor ingresa la fecha de vencimiento", { 
                style: { background: "#aa0000" }
            });
            return false;
        }
        
        if (!cvv.value.trim()) {
            showNotification("Por favor ingresa el código de seguridad", { 
                style: { background: "#aa0000" }
            });
            return false;
        }
        
        if (!titular.value.trim()) {
            showNotification("Por favor ingresa el nombre del titular", { 
                style: { background: "#aa0000" }
            });
            return false;
        }
    }
    
    return true;
};

// Configurar métodos de pago
const setupPaymentMethods = () => {
    const metodoPagoInputs = document.querySelectorAll('input[name="metodo_pago"]');
    const detallesTarjeta = document.getElementById('tarjeta-detalles');
    const detallesMercadopago = document.getElementById('mercadopago-detalles');
    const detallesTransferencia = document.getElementById('transferencia-detalles');
    
    metodoPagoInputs.forEach(input => {
        input.addEventListener('change', () => {
            // Ocultar todos los detalles
            detallesTarjeta.classList.remove('active');
            detallesMercadopago.classList.remove('active');
            detallesTransferencia.classList.remove('active');
            
            // Mostrar los detalles correspondientes
            switch (input.value) {
                case 'tarjeta':
                    detallesTarjeta.classList.add('active');
                    break;
                case 'mercadopago':
                    detallesMercadopago.classList.add('active');
                    break;
                case 'transferencia':
                    detallesTransferencia.classList.add('active');
                    break;
            }
        });
    });
};

// Actualizar resumen de confirmación
const actualizarResumenConfirmacion = () => {
    const resumenPersonal = document.getElementById('resumen-personal');
    const resumenDireccion = document.getElementById('resumen-direccion');
    const resumenPago = document.getElementById('resumen-pago');
    
    // Información personal
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    
    resumenPersonal.innerHTML = `
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
    `;
    
    // Dirección de envío
    const direccion = document.getElementById('direccion').value;
    const codigoPostal = document.getElementById('codigo_postal').value;
    const ciudad = document.getElementById('ciudad').value;
    const provincia = document.getElementById('provincia').value;
    const paisSelect = document.getElementById('pais');
    const paisTexto = paisSelect.options[paisSelect.selectedIndex].text;
    
    resumenDireccion.innerHTML = `
        <p><strong>Dirección:</strong> ${direccion}</p>
        <p><strong>Ciudad:</strong> ${ciudad}, ${provincia}</p>
        <p><strong>Código Postal:</strong> ${codigoPostal}</p>
        <p><strong>País:</strong> ${paisTexto}</p>
    `;
    
    // Método de pago
    const metodoPagoSeleccionado = document.querySelector('input[name="metodo_pago"]:checked');
    let metodoPagoTexto = '';
    
    switch (metodoPagoSeleccionado.value) {
        case 'tarjeta':
            const numeroTarjeta = document.getElementById('numero_tarjeta').value;
            const titular = document.getElementById('titular').value;
            const ultimosDigitos = numeroTarjeta.slice(-4).padStart(numeroTarjeta.length, '*');
            
            metodoPagoTexto = `
                <p><strong>Método:</strong> Tarjeta de Crédito/Débito</p>
                <p><strong>Tarjeta:</strong> ${ultimosDigitos}</p>
                <p><strong>Titular:</strong> ${titular}</p>
            `;
            break;
        case 'mercadopago':
            metodoPagoTexto = `
                <p><strong>Método:</strong> MercadoPago</p>
                <p>Serás redirigido a MercadoPago para completar el pago.</p>
            `;
            break;
        case 'transferencia':
            metodoPagoTexto = `
                <p><strong>Método:</strong> Transferencia Bancaria</p>
                <p>Envía el comprobante a <strong>pagos@hypeheaven.com</strong> después de realizar la transferencia.</p>
            `;
            break;
    }
    
    resumenPago.innerHTML = metodoPagoTexto;
};

// Configurar paso de confirmación
const setupConfirmationStep = () => {
    const aceptarTerminos = document.getElementById('aceptar_terminos');
    
    aceptarTerminos.addEventListener('change', () => {
        btnFinalizar.disabled = !aceptarTerminos.checked;
    });
};

// Configurar finalización de pedido
const setupFinishOrder = () => {
    btnFinalizar.addEventListener('click', () => {
        const aceptarTerminos = document.getElementById('aceptar_terminos');
        
        if (!aceptarTerminos.checked) {
            showNotification("Debes aceptar los términos y condiciones", { 
                style: { background: "#aa0000" }
            });
            return;
        }
        
        // Procesar pedido
        procesarPedido();
    });
};

// Procesar el pedido
const procesarPedido = () => {
    // Generar número de pedido aleatorio
    const numeroPedido = 'P' + Date.now().toString().slice(-8);
    
    // Ocultar formulario de checkout
    document.querySelector('.checkout-container').style.display = 'none';
    document.querySelector('.checkout-resumen').style.display = 'none';
    
    // Mostrar mensaje de pedido completado
    pedidoCompletado.classList.remove('disabled');
    
    // Actualizar email y número de pedido
    document.getElementById('email-confirmacion').textContent = document.getElementById('email').value;
    document.getElementById('numero-pedido').textContent = numeroPedido;
    
    // Vaciar carrito
    localStorage.removeItem('productos-en-carrito');
    
    // Guardar el pedido en el historial (opcional, para futuras mejoras)
    guardarHistorialPedido(numeroPedido);
};

// Guardar el pedido en el historial de pedidos
const guardarHistorialPedido = (numeroPedido) => {
    const pedido = {
        id: numeroPedido,
        date: new Date().toISOString(),
        items: carrito,
        status: 'PROCESSING',
        shippingMethod: 'Estándar',
        personalInfo: {
            name: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('telefono').value
        },
        shippingAddress: {
            address: document.getElementById('direccion').value,
            postalCode: document.getElementById('codigo_postal').value,
            city: document.getElementById('ciudad').value,
            province: document.getElementById('provincia').value,
            country: document.getElementById('pais').value
        },
        paymentMethod: document.querySelector('input[name="metodo_pago"]:checked').value
    };
    
    // Obtener historial de pedidos existente
    let historialPedidos = JSON.parse(localStorage.getItem('user-orders')) || [];
    
    // Agregar el nuevo pedido
    historialPedidos.push(pedido);
    
    // Guardar en localStorage
    localStorage.setItem('user-orders', JSON.stringify(historialPedidos));
};

// Función auxiliar para validar email
const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// Iniciar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', init); 
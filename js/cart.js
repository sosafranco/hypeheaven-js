const productosAgregadosAlCarrito = JSON.parse(localStorage.getItem("productos-en-carrito"));

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const ContenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

function cargarProductosCarrito() {
    if (productosAgregadosAlCarrito && productosAgregadosAlCarrito.length > 0) {

        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        ContenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = "";

        productosAgregadosAlCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
            <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="carrito-producto-titulo">
                <small>Product</small>
                <h3>${producto.titulo}</h3>
            </div>
            <div class="carrito-producto-cantidad">
                <small>Quantity</small>
                <p>${producto.cantidad}</p>
            </div>
            <div class="carrito-producto-precio">
                <small>Price</small>
                <p>USD$${producto.precio}</p>
            </div>
            <div class="carrito-producto-subtotal">
                <small>Subtotal</small>
                <p>USD$${producto.precio * producto.cantidad}</p>
            </div>
            <button class="carrito-producto-eliminar" id=${producto.id}><i class="bi bi-trash-fill"></i></button>
            `;

            contenedorCarritoProductos.append(div);
        })

    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        ContenedorCarritoComprado.classList.add("disabled");

    }

    actualizarBotonesEliminar();
    actualizarTotal();
}

cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "Product removed from your bag!",
        duration: 1500,
        close: false,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "#2b2b2b",
            borderRadius: "1.5rem",
            textTransform: "uppercase",
            fontSize: "0.75rem",
        },
        onClick: function () { }
    }).showToast();
    const idBoton = e.currentTarget.id;
    const index = productosAgregadosAlCarrito.findIndex(producto => producto.id === idBoton);

    productosAgregadosAlCarrito.splice(index, 1);
    cargarProductosCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosAgregadosAlCarrito));
}

botonVaciar.addEventListener("click", vaciarCarrito);

function vaciarCarrito() {

    Swal.fire({
        title: "You do want to clean your cart?",
        icon: "question",
        html: `${productosAgregadosAlCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} products will be removed from the cart`,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: `Yes`,
        cancelButtonText: `No`,
    }).then((result) => {
        if (result.isConfirmed) {
            productosAgregadosAlCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosAgregadosAlCarrito));
            cargarProductosCarrito();
        }
    });
}

function actualizarTotal() {
    const totalCalculado = productosAgregadosAlCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `$${totalCalculado}`
}

botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {

    productosAgregadosAlCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosAgregadosAlCarrito));

    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    ContenedorCarritoComprado.classList.remove("disabled");
}
/*----------------------------FETCH----------------------------*/

let productos = [];

fetch("./js/products.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })

/*----------------------------DOM----------------------------*/

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");


function cargarProductos(productosElegidos) {

    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
        <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
        <div class="producto-detalles">
            <h3 class="producto-titulo">${producto.titulo}</h3>
            <p class="producto-precio">USD$${producto.precio}</p>
            <button class="producto-agregar" id="${producto.id}">Add to cart</button>
        </div>
        `;

        contenedorProductos.append(div);
    })

    actualizarBotonesAgregar();
}



botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {

        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "todos") {
            const productoCategoria = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productoCategoria);
        } else {
            cargarProductos(productos);
        }
    })
})

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosAgregadosAlCarrito;

const productosAgregadosAlCarritoLS = JSON.parse(localStorage.getItem("productos-en-carrito"));

if (productosAgregadosAlCarritoLS) {
    productosAgregadosAlCarrito = productosAgregadosAlCarritoLS;
    numeroCarrito();
} else {
    productosAgregadosAlCarrito = [];
}

function agregarAlCarrito(e) {
    /*----------------------------TOASTIFY JS----------------------------*/
    Toastify({
        text: "Product added to your bag!",
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
        onClick: function(){}
    }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if (productosAgregadosAlCarrito.some(producto => producto.id === idBoton)) {
        const index = productosAgregadosAlCarrito.findIndex(producto => producto.id === idBoton);
        productosAgregadosAlCarrito[index].cantidad++;

    } else {
        productoAgregado.cantidad = 1;
        productosAgregadosAlCarrito.push(productoAgregado);
    }

    numeroCarrito();

    /*----------------------------LocalStorage----------------------------*/

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosAgregadosAlCarrito));
}

function numeroCarrito() {
    let nuevoNumerito = productosAgregadosAlCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}
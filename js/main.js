/*----------------------------ARRAY DE PRODUCTOS----------------------------*/

const productos = [
    /*----------------------------Jackets---------------------------*/
    {
        id: "jacket-01",
        titulo: "Jacket 01",
        imagen: "./assets/img/Campera 01.jpg",
        categoria: {
            nombre: "Jackets",
            id: "jackets"
        },
        precio: "100",
    },
    {
        id: "jacket-02",
        titulo: "Jacket 02",
        imagen: "./assets/img/Campera 02.jpg",
        categoria: {
            nombre: "Jackets",
            id: "jackets"
        },
        precio: "100"
    },
    {
        id: "jacket-03",
        titulo: "Jacket 03",
        imagen: "./assets/img/Campera 03.jpg",
        categoria: {
            nombre: "Jackets",
            id: "jackets"
        },
        precio: "100"
    },
    {
        id: "jacket-04",
        titulo: "Jacket 04",
        imagen: "./assets/img/Campera 04.jpg",
        categoria: {
            nombre: "Jackets",
            id: "jackets"
        },
        precio: "100"
    },
    /*----------------------------Tee's----------------------------*/
    {
        id: "tee-01",
        titulo: "Tee 01",
        imagen: "./assets/img/Tee 01.jpg",
        categoria: {
            nombre: "Tee's",
            id: "tee"
        },
        precio: "50",
    },
    {
        id: "Tee-02",
        titulo: "Tee 02",
        imagen: "./assets/img/Tee 02.jpg",
        categoria: {
            nombre: "Tee's",
            id: "tee"
        },
        precio: "50"
    },
    {
        id: "Tee-03",
        titulo: "Tee 03",
        imagen: "./assets/img/Tee 03.jpg",
        categoria: {
            nombre: "Tee's",
            id: "tee"
        },
        precio: "50"
    },
    {
        id: "Tee-04",
        titulo: "Tee 04",
        imagen: "./assets/img/Tee 04.jpg",
        categoria: {
            nombre: "Tee's",
            id: "tee",
        },
        precio: "50"
    },
    /*----------------------------Sneakers----------------------------*/
    {
        id: "Sneaker-01",
        titulo: "Sneaker 01",
        imagen: "./assets/img/Sneaker 01.jpg",
        categoria: {
            nombre: "Sneakers",
            id: "sneakers"
        },
        precio: "200",
    },
    {
        id: "Sneaker-02",
        titulo: "Sneaker 02",
        imagen: "./assets/img/Sneaker 02.jpg",
        categoria: {
            nombre: "Sneakers",
            id: "sneakers"
        },
        precio: "200",
    },
    {
        id: "Sneaker-03",
        titulo: "Sneaker 03",
        imagen: "./assets/img/Sneaker 03.jpg",
        categoria: {
            nombre: "Sneakers",
            id: "sneakers"
        },
        precio: "200",
    },
    {
        id: "Sneaker-04",
        titulo: "Sneaker 04",
        imagen: "./assets/img/Sneaker 04.jpg",
        categoria: {
            nombre: "Sneakers",
            id: "sneakers"
        },
        precio: "200",
    }
]

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

cargarProductos(productos);

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

if(productosAgregadosAlCarritoLS) {
    productosAgregadosAlCarrito = productosAgregadosAlCarritoLS;
    numeroCarrito();
} else {
    productosAgregadosAlCarrito = [];
}

function agregarAlCarrito(e) {

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
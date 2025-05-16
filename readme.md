# HypeHeaven - Tienda Online de Ropa Deportiva

![HypeHeaven Logo](./assets/img/Logo.png)

## Descripción del Proyecto

HypeHeaven es una tienda online moderna y totalmente funcional especializada en ropa deportiva y streetwear. El proyecto está desarrollado con JavaScript puro (vanilla JS) siguiendo un enfoque modular con tecnologías web estándar (HTML, CSS y JavaScript).

La aplicación ofrece una experiencia de usuario completa desde la navegación por productos hasta el proceso de checkout, con gestión de usuarios, reseñas de productos y un carrito de compras totalmente funcional.

## Demo

Para ver el proyecto en funcionamiento, puedes clonar este repositorio y ejecutarlo localmente siguiendo las instrucciones de instalación.

## Características Principales

- **Navegación por Categorías**: Filtrado de productos por zapatillas, camisetas y chaquetas
- **Visualización Detallada de Productos**: Página dedicada con múltiples imágenes, descripción y opciones de talla
- **Sistema de Reseñas**: Los usuarios pueden dejar valoraciones y comentarios sobre los productos
- **Carrito de Compras Avanzado**: 
  - Agregar/eliminar productos
  - Modificar cantidades directamente desde el carrito
  - Aplicar códigos de descuento (WELCOME10, SUMMER25, FREESHIP)
  - Cálculo en tiempo real de subtotales, descuentos y total
- **Proceso de Checkout Completo**: Formulario de 4 pasos para completar la compra
- **Sistema de Autenticación**: Registro e inicio de sesión de usuarios
- **Perfil de Usuario**: Gestión de información personal, historial de pedidos y direcciones
- **Diseño Responsive**: Adaptable a diferentes tamaños de pantalla

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con flexbox y grid
- **JavaScript (ES6+)**: 
  - Módulos ES6 nativos
  - Manipulación del DOM
  - localStorage para persistencia de datos
  - Asincronía con async/await
  - Fetch API para carga de datos
- **Toastify**: Notificaciones visuales
- **SweetAlert2**: Diálogos y alertas mejoradas
- **Bootstrap Icons**: Iconografía

## Estructura del Proyecto

```
HypeHeaven/
│
├── assets/
│   └── img/             # Imágenes de productos y recursos visuales
│
├── css/
│   ├── main.css         # Estilos principales
│   ├── product-detail.css  # Estilos para la página de detalle
│   ├── checkout.css     # Estilos para el proceso de checkout
│   ├── login.css        # Estilos para autenticación
│   ├── profile.css      # Estilos para perfil de usuario
│   └── reviews.css      # Estilos para el sistema de reseñas
│
├── js/
│   ├── modules/
│   │   ├── cart.js      # Lógica del carrito de compras
│   │   ├── products.js  # Gestión de productos
│   │   ├── reviews.js   # Sistema de reseñas
│   │   └── ui.js        # Utilidades de interfaz de usuario
│   │
│   ├── main.js          # Script principal para la página de inicio
│   ├── cart.js          # Script para la página del carrito
│   ├── product-detail.js # Script para la página de detalle
│   ├── checkout.js      # Script para el proceso de compra
│   ├── auth.js          # Lógica de autenticación
│   ├── profile.js       # Script para el perfil de usuario
│   └── products.json    # Base de datos de productos
│
├── index.html           # Página principal/catálogo de productos
├── cart.html            # Página del carrito de compras
├── product-detail.html  # Página de detalle de producto
├── checkout.html        # Página de proceso de compra
├── login.html           # Página de inicio de sesión/registro
└── profile.html         # Página de perfil de usuario
```

## Funcionalidades Detalladas

### Página Principal
- Catálogo de productos con filtrado por categorías
- Visualización de productos con imagen, título y precio
- Botón para agregar al carrito directamente desde el catálogo
- Enlace al detalle del producto

### Detalle de Producto
- Visualización de múltiples imágenes con galería
- Información detallada: título, precio, descripción
- Selección de talla y cantidad
- Características del producto organizadas en pestañas
- Sistema de reseñas y valoraciones
- Botón para agregar al carrito

### Carrito de Compras
- Lista de productos agregados con imagen, título y precio
- Control de cantidades (aumentar/disminuir)
- Cálculo automático de subtotales por producto
- Sistema de códigos de descuento
  - WELCOME10: 10% de descuento
  - SUMMER25: 25% de descuento
  - FREESHIP: 15% de descuento y envío gratis
- Resumen de compra con subtotal, descuento y total
- Botones para vaciar carrito o proceder al checkout

### Proceso de Checkout
- Flujo de compra en 4 pasos:
  1. Información Personal
  2. Dirección de Envío
  3. Método de Pago (tarjeta, MercadoPago, transferencia)
  4. Confirmación de Pedido
- Resumen de pedido siempre visible
- Validación de formularios
- Generación de número de pedido
- Almacenamiento del historial de compras

### Sistema de Usuarios
- Registro de nuevos usuarios
- Inicio de sesión con validación
- Recuperación de contraseña
- Persistencia de sesión con localStorage

### Perfil de Usuario
- Gestión de información personal
- Historial de pedidos realizados
- Lista de deseos
- Gestión de direcciones de envío
- Preferencias de notificaciones
- Seguridad de la cuenta

### Sistema de Reseñas
- Visualización de estadísticas (promedio, distribución de valoraciones)
- Lista de reseñas con ordenamiento (recientes, útiles, valoración)
- Añadir nuevas reseñas con valoración, título y comentario
- Votar reseñas como útiles/no útiles
- Eliminar reseñas propias

## Almacenamiento de Datos

El proyecto utiliza localStorage para simular una base de datos y mantener la persistencia entre sesiones:

- **productos-en-carrito**: Productos en el carrito actual
- **discount-codes**: Código de descuento aplicado
- **product-reviews**: Reseñas de productos
- **user-data**: Información del usuario logueado
- **auth-token**: Token de autenticación
- **user-orders**: Historial de pedidos del usuario
- **user-addresses**: Direcciones guardadas del usuario
- **user-wishlist**: Lista de deseos del usuario
- **user-settings**: Configuraciones y preferencias

## Instalación y Ejecución

1. Clona este repositorio:
   ```bash
   git clone https://github.com/your-username/hypeheaven.git
   ```

2. Navega al directorio del proyecto:
   ```bash
   cd hypeheaven
   ```

3. Puedes ejecutar el proyecto de varias formas:

   - Utilizando un servidor HTTP simple con Node.js:
     ```bash
     npx http-server
     ```
   
   - Con la extensión Live Server en Visual Studio Code
   
   - Abriendo directamente el archivo index.html en un navegador (algunas funcionalidades podrían no funcionar correctamente debido a restricciones CORS)

4. Accede a la aplicación en tu navegador:
   ```
   http://localhost:8080
   ```

## Códigos de Descuento Disponibles

Para probar la funcionalidad de descuentos, puedes utilizar estos códigos en la página del carrito:

- `WELCOME10`: 10% de descuento en tu primera compra
- `SUMMER25`: 25% de descuento en toda la tienda
- `FREESHIP`: 15% de descuento + envío gratis

## Mejoras Futuras

- Implementar backend real con base de datos
- Integración con pasarelas de pago reales
- Sistema de búsqueda avanzada
- Filtrado por precios y otras características
- Implementación de PWA (Progressive Web App)
- Integración con redes sociales
- Sistema de notificaciones en tiempo real
- Mejoras de optimización y rendimiento

## Créditos

Desarrollado como proyecto educativo. Las imágenes utilizadas son solo para fines demostrativos y pertenecen a sus respectivos dueños.

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

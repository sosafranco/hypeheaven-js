/**
 * Módulo para la gestión de productos
 */

// Función para cargar productos desde el JSON
export const fetchProducts = async () => {
    try {
        const response = await fetch("./js/products.json");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        return [];
    }
};

// Función para filtrar productos por categoría
export const filterProductsByCategory = (products, categoryId) => {
    if (categoryId === "todos") {
        return products;
    }
    return products.filter(product => product.categoria.id === categoryId);
};

// Función para encontrar un producto por su ID
export const findProductById = (products, id) => {
    return products.find(product => product.id === id);
};

// Función para obtener un producto por su ID directamente desde el JSON
export const getProductById = async (productId) => {
    try {
        const products = await fetchProducts();
        const product = findProductById(products, productId);
        
        if (!product) {
            throw new Error(`Producto con ID ${productId} no encontrado`);
        }
        
        return product;
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        return null;
    }
}; 
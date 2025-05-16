/**
 * Módulo para gestionar reseñas y valoraciones de productos
 */

// Importar módulos necesarios
import { showNotification } from './ui.js';
import { getUserData } from '../auth.js';

// Constantes para almacenamiento local
const REVIEWS_KEY = "product-reviews";

/**
 * Generar datos de ejemplo para las reseñas
 * Esta función es solo para propósitos de demostración
 */
const generateSampleReviews = () => {
    // Verificar si ya existen reseñas
    const existingReviews = localStorage.getItem(REVIEWS_KEY);
    if (existingReviews) return;
    
    // Datos de ejemplo
    const sampleReviews = [
        {
            id: 'rev_sample1',
            productId: 'jacket-01',
            userId: 'sample_user1@example.com',
            userName: 'Carlos Rodríguez',
            rating: 5,
            title: 'Excelente chaqueta',
            comment: 'Me encanta esta chaqueta, el material es de muy buena calidad y el diseño es genial. La uso casi todos los días y sigue como nueva.',
            date: new Date(2023, 10, 15).toISOString(),
            likes: 8,
            dislikes: 1,
            verified: true,
            userVotes: []
        },
        {
            id: 'rev_sample2',
            productId: 'jacket-01',
            userId: 'sample_user2@example.com',
            userName: 'María López',
            rating: 4,
            title: 'Buena compra',
            comment: 'La chaqueta es muy bonita y abrigada. El único detalle es que me quedó un poco grande, pero aun así me gusta mucho.',
            date: new Date(2023, 11, 2).toISOString(),
            likes: 3,
            dislikes: 0,
            verified: true,
            userVotes: []
        },
        {
            id: 'rev_sample3',
            productId: 'jacket-01',
            userId: 'sample_user3@example.com',
            userName: 'Juan González',
            rating: 3,
            title: 'Regular',
            comment: 'La chaqueta está bien, pero esperaba mejor calidad considerando el precio. Los bolsillos son algo pequeños.',
            date: new Date(2024, 0, 10).toISOString(),
            likes: 2,
            dislikes: 1,
            verified: false,
            userVotes: []
        },
        {
            id: 'rev_sample4',
            productId: 'Sneaker-01',
            userId: 'sample_user4@example.com',
            userName: 'Ana Martínez',
            rating: 5,
            title: 'Las mejores zapatillas',
            comment: 'Son muy cómodas y lucen genial. Definitivamente compraré otro par en otro color.',
            date: new Date(2023, 9, 25).toISOString(),
            likes: 12,
            dislikes: 0,
            verified: true,
            userVotes: []
        },
        {
            id: 'rev_sample5',
            productId: 'Sneaker-01',
            userId: 'sample_user5@example.com',
            userName: 'Pedro Sánchez',
            rating: 2,
            title: 'Decepcionado',
            comment: 'Después de un mes de uso ya empezaron a deteriorarse. Esperaba mucho más de una marca como esta.',
            date: new Date(2024, 1, 5).toISOString(),
            likes: 4,
            dislikes: 3,
            verified: true,
            userVotes: []
        }
    ];
    
    // Guardar en localStorage
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(sampleReviews));
};

// Ejecutar al cargar el módulo
generateSampleReviews();

/**
 * Añadir una nueva reseña
 * @param {string} productId - ID del producto
 * @param {number} rating - Valoración (1-5)
 * @param {string} comment - Comentario de la reseña
 * @param {string} title - Título de la reseña
 * @returns {boolean} - Éxito de la operación
 */
export const addReview = (productId, rating, comment, title = "") => {
    // Verificar que el usuario esté autenticado
    const userData = getUserData();
    if (!userData) {
        showNotification("Debes iniciar sesión para dejar una reseña", "error");
        return false;
    }
    
    // Validar datos
    if (!productId || !rating || !comment) {
        showNotification("Por favor completa todos los campos requeridos", "error");
        return false;
    }
    
    if (rating < 1 || rating > 5) {
        showNotification("La valoración debe estar entre 1 y 5 estrellas", "error");
        return false;
    }
    
    // Crear objeto de reseña
    const review = {
        id: generateReviewId(),
        productId,
        userId: userData.email,
        userName: userData.name,
        rating,
        title,
        comment,
        date: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        verified: false, // Indica si es una compra verificada
        userVotes: [] // Usuarios que han votado esta reseña
    };
    
    // Obtener reseñas existentes
    let reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY)) || [];
    
    // Verificar si el usuario ya ha dejado una reseña para este producto
    const existingReviewIndex = reviews.findIndex(r => 
        r.productId === productId && r.userId === userData.email
    );
    
    if (existingReviewIndex >= 0) {
        // Actualizar reseña existente
        reviews[existingReviewIndex] = {
            ...reviews[existingReviewIndex],
            rating,
            title,
            comment,
            date: new Date().toISOString()
        };
        
        showNotification("Tu reseña ha sido actualizada", "success");
    } else {
        // Agregar nueva reseña
        reviews.push(review);
        showNotification("¡Gracias por tu reseña!", "success");
    }
    
    // Guardar reseñas
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    
    return true;
};

/**
 * Obtener todas las reseñas de un producto
 * @param {string} productId - ID del producto
 * @returns {Array} - Array de reseñas
 */
export const getProductReviews = (productId) => {
    const reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY)) || [];
    return reviews.filter(review => review.productId === productId);
};

/**
 * Obtener estadísticas de reseñas para un producto
 * @param {string} productId - ID del producto
 * @returns {Object} - Estadísticas de reseñas
 */
export const getReviewStats = (productId) => {
    const reviews = getProductReviews(productId);
    
    // Si no hay reseñas, devolver valores predeterminados
    if (reviews.length === 0) {
        return {
            averageRating: 0,
            totalReviews: 0,
            ratingDistribution: {
                5: 0,
                4: 0,
                3: 0,
                2: 0,
                1: 0
            }
        };
    }
    
    // Calcular promedio de valoraciones
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    // Calcular distribución de valoraciones
    const ratingDistribution = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
    };
    
    reviews.forEach(review => {
        ratingDistribution[review.rating]++;
    });
    
    return {
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalReviews: reviews.length,
        ratingDistribution
    };
};

/**
 * Votar una reseña (me gusta / no me gusta)
 * @param {string} reviewId - ID de la reseña
 * @param {boolean} isLike - true para me gusta, false para no me gusta
 * @returns {boolean} - Éxito de la operación
 */
export const voteReview = (reviewId, isLike) => {
    // Verificar que el usuario esté autenticado
    const userData = getUserData();
    if (!userData) {
        showNotification("Debes iniciar sesión para votar reseñas", "error");
        return false;
    }
    
    // Obtener reseñas existentes
    let reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY)) || [];
    
    // Encontrar la reseña
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex === -1) {
        showNotification("Reseña no encontrada", "error");
        return false;
    }
    
    const review = reviews[reviewIndex];
    
    // Verificar si el usuario ya ha votado esta reseña
    const userVoteIndex = review.userVotes.findIndex(vote => vote.userId === userData.email);
    
    if (userVoteIndex >= 0) {
        const previousVote = review.userVotes[userVoteIndex].isLike;
        
        // Si el voto es el mismo que antes, eliminar el voto
        if (previousVote === isLike) {
            // Eliminar el voto del usuario
            review.userVotes.splice(userVoteIndex, 1);
            
            // Actualizar contadores
            if (isLike) {
                review.likes--;
            } else {
                review.dislikes--;
            }
            
            showNotification("Voto eliminado", "success");
        } else {
            // Cambiar el voto
            review.userVotes[userVoteIndex].isLike = isLike;
            
            // Actualizar contadores
            if (isLike) {
                review.likes++;
                review.dislikes--;
            } else {
                review.likes--;
                review.dislikes++;
            }
            
            showNotification("Voto actualizado", "success");
        }
    } else {
        // Agregar nuevo voto
        review.userVotes.push({
            userId: userData.email,
            isLike
        });
        
        // Actualizar contadores
        if (isLike) {
            review.likes++;
        } else {
            review.dislikes++;
        }
        
        showNotification("Gracias por tu voto", "success");
    }
    
    // Actualizar reseña
    reviews[reviewIndex] = review;
    
    // Guardar reseñas
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    
    return true;
};

/**
 * Eliminar una reseña
 * @param {string} reviewId - ID de la reseña
 * @returns {boolean} - Éxito de la operación
 */
export const deleteReview = (reviewId) => {
    // Verificar que el usuario esté autenticado
    const userData = getUserData();
    if (!userData) {
        showNotification("Debes iniciar sesión para eliminar una reseña", "error");
        return false;
    }
    
    // Obtener reseñas existentes
    let reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY)) || [];
    
    // Encontrar la reseña
    const review = reviews.find(r => r.id === reviewId);
    
    if (!review) {
        showNotification("Reseña no encontrada", "error");
        return false;
    }
    
    // Verificar que el usuario sea el autor de la reseña
    if (review.userId !== userData.email) {
        showNotification("No tienes permiso para eliminar esta reseña", "error");
        return false;
    }
    
    // Eliminar la reseña
    reviews = reviews.filter(r => r.id !== reviewId);
    
    // Guardar reseñas
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    
    showNotification("Reseña eliminada correctamente", "success");
    
    return true;
};

/**
 * Obtener las reseñas de un usuario
 * @returns {Array} - Array de reseñas del usuario
 */
export const getUserReviews = () => {
    // Verificar que el usuario esté autenticado
    const userData = getUserData();
    if (!userData) {
        return [];
    }
    
    const reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY)) || [];
    return reviews.filter(review => review.userId === userData.email);
};

/**
 * Renderizar el componente de reseñas en un contenedor
 * @param {string} productId - ID del producto
 * @param {HTMLElement} container - Contenedor donde se renderizarán las reseñas
 */
export const renderReviews = (productId, container) => {
    // Obtener reseñas del producto
    const reviews = getProductReviews(productId);
    
    // Obtener estadísticas
    const stats = getReviewStats(productId);
    
    // Verificar si el usuario está autenticado
    const userData = getUserData();
    const isLoggedIn = !!userData;
    
    // Verificar si el usuario ya ha dejado una reseña
    let userReview = null;
    if (isLoggedIn) {
        userReview = reviews.find(review => review.userId === userData.email);
    }
    
    // Crear el HTML para las estadísticas
    const statsHTML = `
        <div class="reviews-stats">
            <div class="reviews-summary">
                <div class="reviews-average">
                    <span class="average-rating">${stats.averageRating}</span>
                    <div class="stars-container">
                        ${generateStarsHTML(stats.averageRating)}
                    </div>
                    <span class="total-reviews">${stats.totalReviews} valoraciones</span>
                </div>
                <div class="rating-bars">
                    ${generateRatingBarsHTML(stats.ratingDistribution, stats.totalReviews)}
                </div>
            </div>
            <div class="reviews-actions">
                ${!userReview ? `
                    <button id="write-review-btn" class="review-btn ${!isLoggedIn ? 'disabled' : ''}">
                        Escribir una reseña
                    </button>
                ` : `
                    <button id="edit-review-btn" class="review-btn">
                        Editar mi reseña
                    </button>
                `}
            </div>
        </div>
    `;
    
    // Crear formulario de reseña
    const reviewFormHTML = `
        <div id="review-form-container" class="review-form-container" style="display: none;">
            <h4>Escribe tu reseña</h4>
            <form id="review-form">
                <div class="form-group">
                    <label>Tu valoración:</label>
                    <div class="rating-input">
                        <input type="hidden" id="rating-value" name="rating" value="${userReview ? userReview.rating : '5'}">
                        <div class="rating-stars">
                            <i class="bi bi-star-fill rating-star" data-rating="1"></i>
                            <i class="bi bi-star-fill rating-star" data-rating="2"></i>
                            <i class="bi bi-star-fill rating-star" data-rating="3"></i>
                            <i class="bi bi-star-fill rating-star" data-rating="4"></i>
                            <i class="bi bi-star-fill rating-star" data-rating="5"></i>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="review-title">Título (opcional):</label>
                    <input type="text" id="review-title" name="title" value="${userReview ? userReview.title : ''}">
                </div>
                <div class="form-group">
                    <label for="review-comment">Tu reseña:</label>
                    <textarea id="review-comment" name="comment" rows="4" required>${userReview ? userReview.comment : ''}</textarea>
                </div>
                <div class="form-buttons">
                    <button type="button" id="cancel-review-btn" class="cancel-button">Cancelar</button>
                    <button type="submit" class="submit-button">Publicar reseña</button>
                </div>
            </form>
        </div>
    `;
    
    // Crear el HTML para la lista de reseñas
    let reviewsListHTML = '';
    
    if (reviews.length === 0) {
        reviewsListHTML = `
            <div class="reviews-empty">
                <p>Este producto aún no tiene reseñas. ¡Sé el primero en opinar!</p>
            </div>
        `;
    } else {
        reviewsListHTML = `
            <div class="reviews-list">
                <div class="reviews-filters">
                    <select id="reviews-sort">
                        <option value="recent">Más recientes</option>
                        <option value="helpful">Más útiles</option>
                        <option value="highest">Mayor puntuación</option>
                        <option value="lowest">Menor puntuación</option>
                    </select>
                </div>
                <div class="reviews-items">
                    ${reviews.map(review => generateReviewItemHTML(review, isLoggedIn, userData)).join('')}
                </div>
            </div>
        `;
    }
    
    // Establecer el HTML en el contenedor
    container.innerHTML = `
        <div class="product-reviews">
            <h3>Opiniones de los clientes</h3>
            ${statsHTML}
            ${reviewFormHTML}
            ${reviewsListHTML}
        </div>
    `;
    
    // Configurar eventos después de renderizar
    setupReviewEvents(container, productId, userReview);
};

/**
 * Configurar eventos para el componente de reseñas
 */
function setupReviewEvents(container, productId, userReview) {
    // Botón para escribir reseña
    const writeReviewBtn = container.querySelector('#write-review-btn');
    if (writeReviewBtn) {
        writeReviewBtn.addEventListener('click', () => {
            if (writeReviewBtn.classList.contains('disabled')) {
                showNotification("Debes iniciar sesión para escribir una reseña", "error");
                return;
            }
            
            container.querySelector('#review-form-container').style.display = 'block';
        });
    }
    
    // Botón para editar reseña
    const editReviewBtn = container.querySelector('#edit-review-btn');
    if (editReviewBtn) {
        editReviewBtn.addEventListener('click', () => {
            container.querySelector('#review-form-container').style.display = 'block';
        });
    }
    
    // Botón para cancelar reseña
    const cancelReviewBtn = container.querySelector('#cancel-review-btn');
    if (cancelReviewBtn) {
        cancelReviewBtn.addEventListener('click', () => {
            container.querySelector('#review-form-container').style.display = 'none';
        });
    }
    
    // Estrellas para valoración
    const ratingStars = container.querySelectorAll('.rating-star');
    const ratingInput = container.querySelector('#rating-value');
    
    // Establecer valoración inicial
    if (userReview) {
        highlightStars(ratingStars, userReview.rating);
    } else {
        highlightStars(ratingStars, 5);
    }
    
    ratingStars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.getAttribute('data-rating'));
            ratingInput.value = rating;
            highlightStars(ratingStars, rating);
        });
        
        // Efecto hover
        star.addEventListener('mouseenter', () => {
            const rating = parseInt(star.getAttribute('data-rating'));
            highlightStars(ratingStars, rating);
        });
    });
    
    // Restaurar valoración al salir del hover
    const starsContainer = container.querySelector('.rating-stars');
    if (starsContainer) {
        starsContainer.addEventListener('mouseleave', () => {
            const currentRating = parseInt(ratingInput.value);
            highlightStars(ratingStars, currentRating);
        });
    }
    
    // Envío del formulario
    const reviewForm = container.querySelector('#review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const rating = parseInt(ratingInput.value);
            const title = container.querySelector('#review-title').value;
            const comment = container.querySelector('#review-comment').value;
            
            if (addReview(productId, rating, comment, title)) {
                // Ocultar formulario
                container.querySelector('#review-form-container').style.display = 'none';
                
                // Recargar reseñas
                renderReviews(productId, container);
            }
        });
    }
    
    // Ordenar reseñas
    const sortSelect = container.querySelector('#reviews-sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const reviews = getProductReviews(productId);
            const sortedReviews = sortReviews(reviews, sortSelect.value);
            
            // Obtener info de usuario actual
            const userData = getUserData();
            const isLoggedIn = !!userData;
            
            // Actualizar lista de reseñas
            const reviewsItems = container.querySelector('.reviews-items');
            if (reviewsItems) {
                reviewsItems.innerHTML = sortedReviews.map(review => 
                    generateReviewItemHTML(review, isLoggedIn, userData)
                ).join('');
                
                // Reconfigurar eventos de votos
                setupVoteEvents(container);
            }
        });
    }
    
    // Configurar eventos de votos para reseñas
    setupVoteEvents(container);
}

/**
 * Configurar eventos de votos para reseñas
 */
function setupVoteEvents(container) {
    // Botones de "me gusta"
    const likeButtons = container.querySelectorAll('.review-like');
    likeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const reviewId = button.getAttribute('data-review-id');
            voteReview(reviewId, true);
            
            // Recargar sección para actualizar contadores
            const reviewElement = button.closest('.review-item');
            updateReviewVotes(reviewId, reviewElement);
        });
    });
    
    // Botones de "no me gusta"
    const dislikeButtons = container.querySelectorAll('.review-dislike');
    dislikeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const reviewId = button.getAttribute('data-review-id');
            voteReview(reviewId, false);
            
            // Recargar sección para actualizar contadores
            const reviewElement = button.closest('.review-item');
            updateReviewVotes(reviewId, reviewElement);
        });
    });
    
    // Botones de eliminar reseña
    const deleteButtons = container.querySelectorAll('.review-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const reviewId = button.getAttribute('data-review-id');
            const productId = button.getAttribute('data-product-id');
            
            if (confirm("¿Estás seguro de que deseas eliminar esta reseña?")) {
                if (deleteReview(reviewId)) {
                    // Recargar toda la sección de reseñas
                    renderReviews(productId, container);
                }
            }
        });
    });
}

/**
 * Actualizar los contadores de votos de una reseña
 */
function updateReviewVotes(reviewId, reviewElement) {
    // Obtener reseñas
    const reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY)) || [];
    const review = reviews.find(r => r.id === reviewId);
    
    if (review && reviewElement) {
        // Actualizar contador de me gusta
        const likeCount = reviewElement.querySelector('.like-count');
        if (likeCount) {
            likeCount.textContent = review.likes;
        }
        
        // Actualizar contador de no me gusta
        const dislikeCount = reviewElement.querySelector('.dislike-count');
        if (dislikeCount) {
            dislikeCount.textContent = review.dislikes;
        }
        
        // Obtener info de usuario
        const userData = getUserData();
        
        if (userData) {
            // Verificar si el usuario ha votado esta reseña
            const userVote = review.userVotes.find(vote => vote.userId === userData.email);
            
            // Actualizar clases activas
            const likeButton = reviewElement.querySelector('.review-like');
            const dislikeButton = reviewElement.querySelector('.review-dislike');
            
            if (likeButton && dislikeButton) {
                likeButton.classList.remove('active');
                dislikeButton.classList.remove('active');
                
                if (userVote) {
                    if (userVote.isLike) {
                        likeButton.classList.add('active');
                    } else {
                        dislikeButton.classList.add('active');
                    }
                }
            }
        }
    }
}

/**
 * Ordenar reseñas según el criterio seleccionado
 */
function sortReviews(reviews, sortCriteria) {
    const sortedReviews = [...reviews];
    
    switch (sortCriteria) {
        case 'recent':
            // Ordenar por fecha, más recientes primero
            sortedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'helpful':
            // Ordenar por número de me gusta, mayor primero
            sortedReviews.sort((a, b) => b.likes - a.likes);
            break;
        case 'highest':
            // Ordenar por valoración, mayor primero
            sortedReviews.sort((a, b) => b.rating - a.rating);
            break;
        case 'lowest':
            // Ordenar por valoración, menor primero
            sortedReviews.sort((a, b) => a.rating - b.rating);
            break;
    }
    
    return sortedReviews;
}

/**
 * Resaltar las estrellas según la valoración
 */
function highlightStars(stars, rating) {
    stars.forEach(star => {
        const starRating = parseInt(star.getAttribute('data-rating'));
        if (starRating <= rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

/**
 * Generar HTML para las estrellas de valoración
 */
function generateStarsHTML(rating) {
    let html = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            // Estrella completa
            html += '<i class="bi bi-star-fill"></i>';
        } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
            // Media estrella
            html += '<i class="bi bi-star-half"></i>';
        } else {
            // Estrella vacía
            html += '<i class="bi bi-star"></i>';
        }
    }
    
    return html;
}

/**
 * Generar HTML para las barras de distribución de valoraciones
 */
function generateRatingBarsHTML(distribution, totalReviews) {
    let html = '';
    
    for (let i = 5; i >= 1; i--) {
        const count = distribution[i];
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        
        html += `
            <div class="rating-bar">
                <span class="rating-level">${i} <i class="bi bi-star-fill"></i></span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
                <span class="rating-count">${count}</span>
            </div>
        `;
    }
    
    return html;
}

/**
 * Generar HTML para un item de reseña
 */
function generateReviewItemHTML(review, isLoggedIn, userData) {
    // Verificar si el usuario ha votado esta reseña
    const userVote = isLoggedIn ? 
        review.userVotes.find(vote => vote.userId === userData.email) : null;
    
    // Verificar si el usuario es el autor de la reseña
    const isAuthor = isLoggedIn && review.userId === userData.email;
    
    return `
        <div class="review-item">
            <div class="review-header">
                <div class="review-user-info">
                    <span class="review-user-avatar">
                        <i class="bi bi-person-circle"></i>
                    </span>
                    <span class="review-user-name">${review.userName}</span>
                </div>
                <div class="review-rating">
                    ${generateStarsHTML(review.rating)}
                    <span class="review-date">${formatReviewDate(review.date)}</span>
                </div>
            </div>
            <div class="review-content">
                ${review.title ? `<h4 class="review-title">${review.title}</h4>` : ''}
                <p class="review-comment">${review.comment}</p>
            </div>
            <div class="review-footer">
                <div class="review-feedback">
                    <span class="review-feedback-label">¿Te ha resultado útil?</span>
                    <button class="review-like ${userVote && userVote.isLike ? 'active' : ''}" 
                        data-review-id="${review.id}" ${!isLoggedIn ? 'disabled' : ''}>
                        <i class="bi bi-hand-thumbs-up"></i>
                        <span class="like-count">${review.likes}</span>
                    </button>
                    <button class="review-dislike ${userVote && !userVote.isLike ? 'active' : ''}" 
                        data-review-id="${review.id}" ${!isLoggedIn ? 'disabled' : ''}>
                        <i class="bi bi-hand-thumbs-down"></i>
                        <span class="dislike-count">${review.dislikes}</span>
                    </button>
                </div>
                ${isAuthor ? `
                    <div class="review-actions">
                        <button class="review-delete" data-review-id="${review.id}" data-product-id="${review.productId}">
                            <i class="bi bi-trash"></i> Eliminar
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

/**
 * Formatear fecha de reseña
 */
function formatReviewDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

/**
 * Generar ID único para reseña
 */
function generateReviewId() {
    return 'rev_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
} 
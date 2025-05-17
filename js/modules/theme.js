/**
 * Módulo para la gestión del tema (claro/oscuro)
 */

// Constantes
export const THEME_KEY = "user-theme-preference";
export const DARK_MODE_CLASS = "dark-mode";

/**
 * Inicializa el tema basado en la preferencia guardada o la preferencia del sistema
 */
export const initTheme = () => {
    // Comprobar si hay una preferencia guardada
    const savedTheme = localStorage.getItem(THEME_KEY);
    
    if (savedTheme) {
        // Aplicar tema guardado
        if (savedTheme === "dark") {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    } else {
        // Comprobar preferencia del sistema
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            enableDarkMode();
        }
        
        // Escuchar cambios en la preferencia del sistema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (e.matches) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        });
    }
};

/**
 * Activa el modo oscuro
 */
export const enableDarkMode = () => {
    document.body.classList.add(DARK_MODE_CLASS);
    localStorage.setItem(THEME_KEY, "dark");
    
    // Actualizar estado del toggle si existe
    const toggle = document.querySelector('.darkmode-toggle');
    if (toggle) {
        toggle.classList.add('active');
        toggle.setAttribute('aria-pressed', 'true');
    }
    
    // Actualizar meta theme-color para dispositivos móviles
    updateMetaThemeColor(true);
};

/**
 * Desactiva el modo oscuro
 */
export const disableDarkMode = () => {
    document.body.classList.remove(DARK_MODE_CLASS);
    localStorage.setItem(THEME_KEY, "light");
    
    // Actualizar estado del toggle si existe
    const toggle = document.querySelector('.darkmode-toggle');
    if (toggle) {
        toggle.classList.remove('active');
        toggle.setAttribute('aria-pressed', 'false');
    }
    
    // Actualizar meta theme-color para dispositivos móviles
    updateMetaThemeColor(false);
};

/**
 * Alterna entre modo claro y oscuro
 */
export const toggleDarkMode = () => {
    if (document.body.classList.contains(DARK_MODE_CLASS)) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
};

/**
 * Actualiza el color de tema para la barra de navegación móvil
 */
const updateMetaThemeColor = (isDark) => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', isDark ? '#1e1e1e' : '#ffffff');
    }
};

/**
 * Crea y añade el toggle del modo oscuro
 */
export const createDarkModeToggle = (container) => {
    // Crear contenedor para el toggle
    const toggleContainer = document.createElement('li');
    toggleContainer.className = 'nav-item dark-mode-container';
    
    // Crear el toggle
    const toggle = document.createElement('button');
    toggle.className = 'darkmode-toggle';
    toggle.setAttribute('aria-label', 'Cambiar a modo oscuro');
    toggle.setAttribute('role', 'switch');
    toggle.setAttribute('aria-pressed', document.body.classList.contains(DARK_MODE_CLASS) ? 'true' : 'false');
    
    if (document.body.classList.contains(DARK_MODE_CLASS)) {
        toggle.classList.add('active');
    }
    
    // Añadir event listener
    toggle.addEventListener('click', toggleDarkMode);
    
    // Añadir a la página
    toggleContainer.appendChild(toggle);
    container.appendChild(toggleContainer);
}; 
/**
 * Módulo para la gestión de autenticación de usuarios
 */

// Importar módulos
import { showNotification } from './modules/ui.js';

// Constantes para almacenamiento local
const USER_KEY = "user-data";
const AUTH_TOKEN_KEY = "auth-token";

// Elementos del DOM
document.addEventListener('DOMContentLoaded', () => {
    // Tabs de autenticación
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    
    // Formulario de login
    const loginForm = document.getElementById('login-form');
    const loginButton = document.getElementById('login-button');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    
    // Formulario de registro
    const registerForm = document.getElementById('register-form');
    const registerButton = document.getElementById('register-button');
    const registerName = document.getElementById('register-name');
    const registerEmail = document.getElementById('register-email');
    const registerPassword = document.getElementById('register-password');
    const registerConfirmPassword = document.getElementById('register-confirm-password');
    
    // Formulario de recuperación de contraseña
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const resetButton = document.getElementById('reset-button');
    const resetEmail = document.getElementById('reset-email');
    const backToLoginButton = document.getElementById('back-to-login');
    
    // Cambio entre pestañas
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Desactivar todas las pestañas y formularios
            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            
            // Activar pestaña seleccionada
            tab.classList.add('active');
            
            // Activar formulario correspondiente
            const targetForm = tab.getAttribute('data-tab');
            document.getElementById(`${targetForm}-form`).classList.add('active');
        });
    });
    
    // Mostrar formulario de recuperación de contraseña
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        loginForm.classList.remove('active');
        forgotPasswordForm.classList.add('active');
        
        // Desactivar todas las pestañas
        authTabs.forEach(t => t.classList.remove('active'));
    });
    
    // Volver al login desde recuperación de contraseña
    backToLoginButton.addEventListener('click', () => {
        forgotPasswordForm.classList.remove('active');
        loginForm.classList.add('active');
        
        // Activar pestaña de login
        authTabs.forEach(t => {
            if (t.getAttribute('data-tab') === 'login') {
                t.classList.add('active');
            }
        });
    });
    
    // Iniciar sesión
    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Validar campos
        if (!loginEmail.value || !loginPassword.value) {
            showNotification("Por favor, completa todos los campos", "error");
            return;
        }
        
        // Simulación de login exitoso (en producción se conectaría a un backend)
        // Este es solo un ejemplo para demostración
        setTimeout(() => {
            const userData = {
                email: loginEmail.value,
                name: "Usuario de Ejemplo",
                isLoggedIn: true
            };
            
            // Guardar información del usuario
            localStorage.setItem(USER_KEY, JSON.stringify(userData));
            localStorage.setItem(AUTH_TOKEN_KEY, "token-ejemplo-12345");
            
            showNotification("¡Inicio de sesión exitoso!", "success");
            
            // Redireccionar al usuario
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        }, 1000);
    });
    
    // Registrar usuario
    registerButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Validar campos
        if (!registerName.value || !registerEmail.value || !registerPassword.value || !registerConfirmPassword.value) {
            showNotification("Por favor, completa todos los campos", "error");
            return;
        }
        
        // Validar que las contraseñas coincidan
        if (registerPassword.value !== registerConfirmPassword.value) {
            showNotification("Las contraseñas no coinciden", "error");
            return;
        }
        
        // Validar aceptación de términos
        const acceptTerms = document.getElementById('accept-terms');
        if (!acceptTerms.checked) {
            showNotification("Debes aceptar los términos y condiciones", "error");
            return;
        }
        
        // Simulación de registro exitoso (en producción se conectaría a un backend)
        setTimeout(() => {
            const userData = {
                name: registerName.value,
                email: registerEmail.value,
                isLoggedIn: true
            };
            
            // Guardar información del usuario
            localStorage.setItem(USER_KEY, JSON.stringify(userData));
            localStorage.setItem(AUTH_TOKEN_KEY, "token-ejemplo-12345");
            
            showNotification("¡Registro exitoso!", "success");
            
            // Redireccionar al usuario
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        }, 1000);
    });
    
    // Enviar solicitud de recuperación de contraseña
    resetButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Validar campo de email
        if (!resetEmail.value) {
            showNotification("Por favor, ingresa tu correo electrónico", "error");
            return;
        }
        
        // Simulación de envío de correo
        showNotification("Se ha enviado un correo con instrucciones para restablecer tu contraseña", "success");
        
        // Volver al formulario de login después de unos segundos
        setTimeout(() => {
            forgotPasswordForm.classList.remove('active');
            loginForm.classList.add('active');
            
            // Activar pestaña de login
            authTabs.forEach(t => {
                if (t.getAttribute('data-tab') === 'login') {
                    t.classList.add('active');
                }
            });
        }, 3000);
    });
});

// Funciones de utilidad para autenticación
export const isLoggedIn = () => {
    const userData = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    
    return userData && token;
};

export const getUserData = () => {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
};

export const logout = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    
    window.location.href = "login.html";
}; 
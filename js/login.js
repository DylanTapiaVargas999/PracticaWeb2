// Vista: Login
// Maneja la interfaz de inicio de sesión

import { authController } from '../controllers/AuthController.js';

// Elementos del DOM
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginMessage = document.getElementById('loginMessage');

// Función para mostrar mensajes
function showMessage(message, type = 'info') {
    loginMessage.textContent = message;
    loginMessage.className = `message ${type}`;
    loginMessage.style.display = 'block';
}

// Función para ocultar mensajes
function hideMessage() {
    loginMessage.style.display = 'none';
}

// Función para alternar el estado de carga del botón
function toggleButtonLoading(button, loading) {
    const btnText = button.querySelector('.btn-text');
    const btnLoading = button.querySelector('.btn-loading');
    
    if (loading) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        button.disabled = true;
    } else {
        btnText.style.display = 'inline-flex';
        btnLoading.style.display = 'none';
        button.disabled = false;
    }
}

// Redirigir si ya está autenticado
authController.onAuthChange((user) => {
    if (user) {
        window.location.href = 'dashboard.html';
    }
});

// Manejar envío del formulario
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessage();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    
    // Validar campos
    if (!email || !password) {
        showMessage('Por favor, completa todos los campos.', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('La contraseña debe tener al menos 6 caracteres.', 'error');
        return;
    }
    
    toggleButtonLoading(submitBtn, true);
    
    try {
        // Intentar login
        const result = await authController.login(email, password);
        
        if (result.success) {
            console.log('Usuario autenticado:', result.user.uid);
            showMessage('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
            // Redirigir al dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            // Mostrar error
            showMessage(result.error, 'error');
        }
    } catch (error) {
        showMessage('Error al iniciar sesión: ' + error.message, 'error');
    } finally {
        // Rehabilitar botón
        toggleButtonLoading(submitBtn, false);
    }
});

// Validar email mientras se escribe
emailInput.addEventListener('input', () => {
    const email = emailInput.value.trim();
    if (email && !email.toLowerCase().endsWith('@virtual.upt.pe') && !email.toLowerCase().endsWith('@upt.pe')) {
        emailInput.setCustomValidity('Debe usar un correo institucional (@virtual.upt.pe o @upt.pe)');
    } else {
        emailInput.setCustomValidity('');
    }
});

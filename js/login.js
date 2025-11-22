// Login functionality
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { firebaseConfig } from './firebase-config.js';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Elementos del DOM
const loginForm = document.getElementById('loginForm');
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

// Manejar el envío del formulario
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessage();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');

    // Validaciones básicas
    if (!email || !password) {
        showMessage('Por favor, completa todos los campos.', 'error');
        return;
    }

    // Validar dominio de correo institucional
    const dominiosPermitidos = ['@virtual.upt.pe', '@upt.pe'];
    const dominioValido = dominiosPermitidos.some(dominio => email.toLowerCase().endsWith(dominio));
    
    if (!dominioValido) {
        showMessage('Solo se permite el acceso con correos institucionales (@virtual.upt.pe o @upt.pe)', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('La contraseña debe tener al menos 6 caracteres.', 'error');
        return;
    }

    toggleButtonLoading(submitBtn, true);

    try {
        // Intentar iniciar sesión
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log('Usuario autenticado:', user.uid);
        showMessage('¡Inicio de sesión exitoso! Redirigiendo...', 'success');

        // Redirigir al dashboard después de 1 segundo
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);

    } catch (error) {
        console.error('Error al iniciar sesión:', error.code, error.message);
        toggleButtonLoading(submitBtn, false);

        // Manejar diferentes tipos de errores
        let errorMessage = 'Error al iniciar sesión. ';

        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage += 'El correo electrónico no es válido.';
                break;
            case 'auth/user-disabled':
                errorMessage += 'Esta cuenta ha sido deshabilitada.';
                break;
            case 'auth/user-not-found':
                errorMessage += 'No existe una cuenta con este correo.';
                break;
            case 'auth/wrong-password':
                errorMessage += 'Contraseña incorrecta.';
                break;
            case 'auth/invalid-credential':
                errorMessage += 'Credenciales inválidas. Verifica tu correo y contraseña.';
                break;
            case 'auth/too-many-requests':
                errorMessage += 'Demasiados intentos fallidos. Intenta más tarde.';
                break;
            case 'auth/network-request-failed':
                errorMessage += 'Error de conexión. Verifica tu internet.';
                break;
            default:
                errorMessage += error.message;
        }

        showMessage(errorMessage, 'error');
    }
});

// Verificar si el usuario ya está autenticado
auth.onAuthStateChanged((user) => {
    if (user) {
        // Si el usuario ya está autenticado, redirigir al dashboard
        console.log('Usuario ya autenticado, redirigiendo...');
        window.location.href = 'dashboard.html';
    }
});

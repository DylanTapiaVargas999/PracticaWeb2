// Register functionality
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { firebaseConfig } from '../config/firebase-config.js';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Elementos del DOM
const registerForm = document.getElementById('registerForm');
const registerMessage = document.getElementById('registerMessage');

// Función para mostrar mensajes
function showMessage(message, type = 'info') {
    registerMessage.textContent = message;
    registerMessage.className = `message ${type}`;
    registerMessage.style.display = 'block';
}

// Función para ocultar mensajes
function hideMessage() {
    registerMessage.style.display = 'none';
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
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessage();

    const nombre = document.getElementById('nombre').value.trim();
    const codigo = document.getElementById('codigo').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const submitBtn = registerForm.querySelector('button[type="submit"]');

    // Validaciones
    if (!nombre || !codigo || !email || !password || !confirmPassword) {
        showMessage('Por favor, completa todos los campos.', 'error');
        return;
    }

    // Validar dominio de correo institucional
    const dominiosPermitidos = ['@virtual.upt.pe', '@upt.pe'];
    const dominioValido = dominiosPermitidos.some(dominio => email.toLowerCase().endsWith(dominio));
    
    if (!dominioValido) {
        showMessage('Solo se permite el registro con correos institucionales (@virtual.upt.pe o @upt.pe)', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showMessage('Las contraseñas no coinciden.', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('La contraseña debe tener al menos 6 caracteres.', 'error');
        return;
    }

    if (codigo.length < 5) {
        showMessage('El código de docente debe tener al menos 5 caracteres.', 'error');
        return;
    }

    toggleButtonLoading(submitBtn, true);

    try {
        // Crear usuario en Firebase Authentication
        console.log('Creando usuario en Firebase Auth...');
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log('Usuario creado en Auth:', user.uid);

        // Guardar datos adicionales en Firestore
        console.log('Guardando datos del docente en Firestore...');
        const docenteData = {
            nombre: nombre,
            codigo: codigo,
            email: email,
            rol: 'docente',
            fechaRegistro: new Date().toISOString(),
            timestamp: Date.now()
        };

        await setDoc(doc(db, 'docentes', user.uid), docenteData);
        console.log('Datos guardados exitosamente en Firestore');

        showMessage('¡Registro exitoso! Redirigiendo al panel...', 'success');

        // Redirigir al dashboard después de 2 segundos
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);

    } catch (error) {
        console.error('Error en el registro:', error.code, error.message);
        toggleButtonLoading(submitBtn, false);

        // Manejar diferentes tipos de errores
        let errorMessage = 'Error al crear la cuenta. ';

        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage += 'Este correo ya está registrado. Intenta iniciar sesión.';
                break;
            case 'auth/invalid-email':
                errorMessage += 'El correo electrónico no es válido.';
                break;
            case 'auth/operation-not-allowed':
                errorMessage += 'El registro de usuarios no está habilitado.';
                break;
            case 'auth/weak-password':
                errorMessage += 'La contraseña es muy débil. Usa al menos 6 caracteres.';
                break;
            case 'auth/network-request-failed':
                errorMessage += 'Error de conexión. Verifica tu internet.';
                break;
            case 'permission-denied':
                errorMessage += 'No tienes permisos para realizar esta operación. Verifica las reglas de Firestore.';
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

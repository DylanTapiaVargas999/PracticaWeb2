// Controlador de Autenticación
// Maneja el login, registro y cierre de sesión

import { firebaseConfig } from '../config/firebase-config.js';
import { User } from '../models/User.js';

// Importar Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
    getAuth, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export class AuthController {
    constructor() {
        this.auth = auth;
        this.currentUser = null;
    }

    // Registrar nuevo usuario
    async register(email, password) {
        try {
            // Validar email institucional
            if (!User.validarEmailInstitucional(email)) {
                throw new Error('Debes usar un correo institucional (@virtual.upt.pe o @upt.pe)');
            }

            // Crear usuario en Firebase
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            this.currentUser = User.fromFirebaseUser(userCredential.user);
            
            return {
                success: true,
                user: this.currentUser
            };
        } catch (error) {
            console.error('Error en registro:', error);
            return {
                success: false,
                error: this.getErrorMessage(error)
            };
        }
    }

    // Iniciar sesión
    async login(email, password) {
        try {
            // Validar email institucional
            if (!User.validarEmailInstitucional(email)) {
                throw new Error('Debes usar un correo institucional (@virtual.upt.pe o @upt.pe)');
            }

            // Autenticar con Firebase
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            this.currentUser = User.fromFirebaseUser(userCredential.user);
            
            return {
                success: true,
                user: this.currentUser
            };
        } catch (error) {
            console.error('Error en login:', error);
            return {
                success: false,
                error: this.getErrorMessage(error)
            };
        }
    }

    // Cerrar sesión
    async logout() {
        try {
            await signOut(this.auth);
            this.currentUser = null;
            return { success: true };
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            return {
                success: false,
                error: 'Error al cerrar sesión'
            };
        }
    }

    // Obtener usuario actual
    getCurrentUser() {
        return this.auth.currentUser ? User.fromFirebaseUser(this.auth.currentUser) : null;
    }

    // Observar cambios de autenticación
    onAuthChange(callback) {
        onAuthStateChanged(this.auth, (user) => {
            this.currentUser = user ? User.fromFirebaseUser(user) : null;
            callback(this.currentUser);
        });
    }

    // Verificar si está autenticado
    isAuthenticated() {
        return this.auth.currentUser !== null;
    }

    // Obtener mensaje de error amigable
    getErrorMessage(error) {
        const errorMessages = {
            'auth/email-already-in-use': 'Este correo ya está registrado',
            'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
            'auth/invalid-email': 'Correo electrónico inválido',
            'auth/user-not-found': 'Usuario no encontrado',
            'auth/wrong-password': 'Contraseña incorrecta',
            'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
            'auth/network-request-failed': 'Error de conexión. Verifica tu internet'
        };

        return errorMessages[error.code] || error.message;
    }

    // Redirigir si no está autenticado
    requireAuth(redirectTo = 'login.html') {
        if (!this.isAuthenticated()) {
            window.location.href = redirectTo;
            return false;
        }
        return true;
    }

    // Redirigir si ya está autenticado
    redirectIfAuthenticated(redirectTo = 'dashboard.html') {
        if (this.isAuthenticated()) {
            window.location.href = redirectTo;
            return true;
        }
        return false;
    }
}

// Exportar instancia única (Singleton)
export const authController = new AuthController();

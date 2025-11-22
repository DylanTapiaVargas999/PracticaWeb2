// Modelo: User (Usuario)
// Representa un usuario del sistema (docente)

export class User {
    constructor(uid, email, displayName = null) {
        this.uid = uid;
        this.email = email;
        this.displayName = displayName;
    }

    // Validar que el email pertenece a dominios institucionales
    static validarEmailInstitucional(email) {
        const dominiosPermitidos = ['@virtual.upt.pe', '@upt.pe'];
        const emailLower = email.toLowerCase();
        return dominiosPermitidos.some(dominio => emailLower.endsWith(dominio));
    }

    // Crear instancia desde datos de Firebase Auth
    static fromFirebaseUser(firebaseUser) {
        return new User(
            firebaseUser.uid,
            firebaseUser.email,
            firebaseUser.displayName
        );
    }

    // Obtener nombre del dominio
    getDomain() {
        return this.email.split('@')[1];
    }

    // Obtener nombre de usuario (parte antes del @)
    getUsername() {
        return this.email.split('@')[0];
    }

    // Verificar si es email institucional
    esEmailInstitucional() {
        return User.validarEmailInstitucional(this.email);
    }
}

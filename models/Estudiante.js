// Modelo: Estudiante
// Representa los datos de un estudiante

export class Estudiante {
    constructor(codigo, nombres, apellidos, email = '', telefono = '') {
        this.codigo = codigo;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.email = email;
        this.telefono = telefono;
    }

    // Validar código de estudiante (10 dígitos)
    static validarCodigo(codigo) {
        const pattern = /^[0-9]{10}$/;
        return pattern.test(codigo);
    }

    // Obtener nombre completo
    getNombreCompleto() {
        return `${this.nombres} ${this.apellidos}`.trim();
    }

    // Crear desde objeto plano
    static fromObject(obj) {
        return new Estudiante(
            obj.codigo,
            obj.nombres,
            obj.apellidos,
            obj.email || '',
            obj.telefono || ''
        );
    }

    // Convertir a objeto plano para Firestore
    toObject() {
        return {
            codigo: this.codigo,
            nombres: this.nombres,
            apellidos: this.apellidos,
            email: this.email,
            telefono: this.telefono
        };
    }

    // Validar que todos los campos requeridos estén presentes
    esValido() {
        return this.codigo && 
               this.nombres && 
               this.apellidos && 
               Estudiante.validarCodigo(this.codigo);
    }
}

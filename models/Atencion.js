// Modelo: Atencion
// Representa una sesión de atención/consultoría registrada

export class Atencion {
    constructor(data) {
        this.id = data.id || null;
        this.semestre = data.semestre;
        this.fecha = data.fecha;
        this.hora = data.hora;
        this.tema = data.tema;
        this.estudiante = data.estudiante; // Objeto Estudiante
        this.descripcion = data.descripcion || '';
        this.evidencia = data.evidencia || '';
        this.docente = data.docente;
        this.timestamp = data.timestamp || new Date().toISOString();
    }

    // Temas de consulta disponibles
    static TEMAS = [
        'Orientación académica',
        'Asesoría en investigación',
        'Tutoría especializada',
        'Consejería personal',
        'Apoyo metodológico'
    ];

    // Validar que la fecha no sea pasada
    static validarFecha(fecha) {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fechaSeleccionada = new Date(fecha + 'T00:00:00');
        return fechaSeleccionada >= hoy;
    }

    // Validar que la hora no sea pasada (si es hoy)
    static validarHora(fecha, hora) {
        const hoy = new Date();
        const fechaSeleccionada = new Date(fecha + 'T00:00:00');
        
        // Si es una fecha futura, cualquier hora es válida
        if (fechaSeleccionada.toDateString() !== hoy.toDateString()) {
            return true;
        }
        
        // Si es hoy, validar que la hora no sea pasada
        const [hours, minutes] = hora.split(':');
        const horaSeleccionada = new Date();
        horaSeleccionada.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        return horaSeleccionada >= hoy;
    }

    // Convertir a objeto para Firestore
    toFirestore() {
        return {
            semestre: this.semestre,
            fecha: this.fecha,
            hora: this.hora,
            tema: this.tema,
            estudiante: this.estudiante,
            descripcion: this.descripcion,
            evidencia: this.evidencia,
            docente: this.docente,
            timestamp: this.timestamp
        };
    }

    // Crear desde documento de Firestore
    static fromFirestore(doc) {
        const data = doc.data();
        return new Atencion({
            id: doc.id,
            ...data
        });
    }

    // Validar todos los campos
    esValida() {
        return this.semestre &&
               this.fecha &&
               this.hora &&
               this.tema &&
               this.estudiante &&
               this.estudiante.codigo &&
               this.estudiante.nombres &&
               this.estudiante.apellidos &&
               this.descripcion &&
               this.docente &&
               Atencion.validarFecha(this.fecha);
    }

    // Obtener nombre del mes
    getMesNombre() {
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const fecha = new Date(this.fecha + 'T00:00:00');
        return meses[fecha.getMonth()];
    }

    // Obtener año
    getAnio() {
        const fecha = new Date(this.fecha + 'T00:00:00');
        return fecha.getFullYear();
    }

    // Obtener fecha formateada
    getFechaFormateada() {
        const fecha = new Date(this.fecha + 'T00:00:00');
        return fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
}

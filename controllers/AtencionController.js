// Controlador de Atenciones
// Maneja el CRUD de atenciones y la lógica de negocio

import { firebaseConfig } from '../config/firebase-config.js';
import { Atencion } from '../models/Atencion.js';
import { Estudiante } from '../models/Estudiante.js';

// Importar Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { 
    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export class AtencionController {
    constructor() {
        this.db = db;
        this.auth = auth;
        this.collectionName = 'atenciones';
    }

    // Crear nueva atención
    async crear(atencionData) {
        try {
            // Validar estudiante
            const estudiante = Estudiante.fromObject(atencionData.estudiante);
            if (!estudiante.esValido()) {
                throw new Error('Datos del estudiante inválidos');
            }

            // Crear atención
            const atencion = new Atencion({
                ...atencionData,
                estudiante: estudiante.toObject(),
                docente: this.auth.currentUser.email,
                timestamp: new Date().toISOString()
            });

            // Validar atención
            if (!atencion.esValida()) {
                throw new Error('Datos de la atención incompletos o inválidos');
            }

            // Guardar en Firestore
            const docRef = await addDoc(collection(this.db, this.collectionName), atencion.toFirestore());
            
            return {
                success: true,
                id: docRef.id,
                atencion: atencion
            };
        } catch (error) {
            console.error('Error al crear atención:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Obtener todas las atenciones
    async obtenerTodas() {
        try {
            const querySnapshot = await getDocs(
                query(collection(this.db, this.collectionName), orderBy('timestamp', 'desc'))
            );
            
            const atenciones = [];
            querySnapshot.forEach((doc) => {
                atenciones.push(Atencion.fromFirestore(doc));
            });
            
            return {
                success: true,
                atenciones: atenciones
            };
        } catch (error) {
            console.error('Error al obtener atenciones:', error);
            return {
                success: false,
                error: error.message,
                atenciones: []
            };
        }
    }

    // Obtener atenciones por docente
    async obtenerPorDocente(emailDocente) {
        try {
            const q = query(
                collection(this.db, this.collectionName),
                where('docente', '==', emailDocente),
                orderBy('timestamp', 'desc')
            );
            
            const querySnapshot = await getDocs(q);
            const atenciones = [];
            
            querySnapshot.forEach((doc) => {
                atenciones.push(Atencion.fromFirestore(doc));
            });
            
            return {
                success: true,
                atenciones: atenciones
            };
        } catch (error) {
            console.error('Error al obtener atenciones por docente:', error);
            return {
                success: false,
                error: error.message,
                atenciones: []
            };
        }
    }

    // Obtener atenciones por semestre
    async obtenerPorSemestre(semestre) {
        try {
            const q = query(
                collection(this.db, this.collectionName),
                where('semestre', '==', semestre),
                orderBy('timestamp', 'desc')
            );
            
            const querySnapshot = await getDocs(q);
            const atenciones = [];
            
            querySnapshot.forEach((doc) => {
                atenciones.push(Atencion.fromFirestore(doc));
            });
            
            return {
                success: true,
                atenciones: atenciones
            };
        } catch (error) {
            console.error('Error al obtener atenciones por semestre:', error);
            return {
                success: false,
                error: error.message,
                atenciones: []
            };
        }
    }

    // Obtener atenciones por rango de fechas
    async obtenerPorFechas(fechaInicio, fechaFin) {
        try {
            const q = query(
                collection(this.db, this.collectionName),
                where('fecha', '>=', fechaInicio),
                where('fecha', '<=', fechaFin),
                orderBy('fecha', 'desc')
            );
            
            const querySnapshot = await getDocs(q);
            const atenciones = [];
            
            querySnapshot.forEach((doc) => {
                atenciones.push(Atencion.fromFirestore(doc));
            });
            
            return {
                success: true,
                atenciones: atenciones
            };
        } catch (error) {
            console.error('Error al obtener atenciones por fechas:', error);
            return {
                success: false,
                error: error.message,
                atenciones: []
            };
        }
    }

    // Obtener atenciones por tema
    async obtenerPorTema(tema) {
        try {
            const q = query(
                collection(this.db, this.collectionName),
                where('tema', '==', tema),
                orderBy('timestamp', 'desc')
            );
            
            const querySnapshot = await getDocs(q);
            const atenciones = [];
            
            querySnapshot.forEach((doc) => {
                atenciones.push(Atencion.fromFirestore(doc));
            });
            
            return {
                success: true,
                atenciones: atenciones
            };
        } catch (error) {
            console.error('Error al obtener atenciones por tema:', error);
            return {
                success: false,
                error: error.message,
                atenciones: []
            };
        }
    }

    // Obtener una atención por ID
    async obtenerPorId(id) {
        try {
            const docRef = doc(this.db, this.collectionName, id);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                return {
                    success: true,
                    atencion: Atencion.fromFirestore(docSnap)
                };
            } else {
                throw new Error('Atención no encontrada');
            }
        } catch (error) {
            console.error('Error al obtener atención:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Actualizar atención
    async actualizar(id, data) {
        try {
            const docRef = doc(this.db, this.collectionName, id);
            await updateDoc(docRef, data);
            
            return {
                success: true,
                message: 'Atención actualizada correctamente'
            };
        } catch (error) {
            console.error('Error al actualizar atención:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Eliminar atención
    async eliminar(id) {
        try {
            const docRef = doc(this.db, this.collectionName, id);
            await deleteDoc(docRef);
            
            return {
                success: true,
                message: 'Atención eliminada correctamente'
            };
        } catch (error) {
            console.error('Error al eliminar atención:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Obtener estadísticas generales
    async obtenerEstadisticas() {
        try {
            const result = await this.obtenerTodas();
            if (!result.success) {
                throw new Error(result.error);
            }

            const atenciones = result.atenciones;
            const estudiantesUnicos = new Set(atenciones.map(a => a.estudiante.codigo)).size;
            const docentesUnicos = new Set(atenciones.map(a => a.docente)).size;

            // Contar por tema
            const porTema = {};
            atenciones.forEach(a => {
                porTema[a.tema] = (porTema[a.tema] || 0) + 1;
            });

            // Contar por semestre
            const porSemestre = {};
            atenciones.forEach(a => {
                porSemestre[a.semestre] = (porSemestre[a.semestre] || 0) + 1;
            });

            return {
                success: true,
                estadisticas: {
                    totalAtenciones: atenciones.length,
                    estudiantesAtendidos: estudiantesUnicos,
                    docentesParticipantes: docentesUnicos,
                    porTema: porTema,
                    porSemestre: porSemestre
                }
            };
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Validar fecha y hora
    validarFechaHora(fecha, hora) {
        if (!Atencion.validarFecha(fecha)) {
            return {
                valid: false,
                error: 'No se pueden registrar atenciones en fechas pasadas'
            };
        }

        if (!Atencion.validarHora(fecha, hora)) {
            return {
                valid: false,
                error: 'La hora seleccionada ya pasó'
            };
        }

        return { valid: true };
    }
}

// Exportar instancia única (Singleton)
export const atencionController = new AtencionController();

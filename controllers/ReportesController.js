// Controlador de Reportes
// Maneja la generación de reportes y estadísticas

import { atencionController } from './AtencionController.js';

export class ReportesController {
    constructor() {
        this.atencionController = atencionController;
        this.atenciones = [];
    }

    // Cargar todas las atenciones
    async cargarAtenciones() {
        const result = await this.atencionController.obtenerTodas();
        if (result.success) {
            this.atenciones = result.atenciones;
        }
        return result;
    }

    // Generar reporte por semestre
    generarReportePorSemestre(semestre = null) {
        let atencionesFiltradas = this.atenciones;
        
        if (semestre) {
            atencionesFiltradas = this.atenciones.filter(a => a.semestre === semestre);
        }

        return {
            total: atencionesFiltradas.length,
            atenciones: atencionesFiltradas,
            semestre: semestre
        };
    }

    // Generar reporte por docente
    generarReportePorDocente(docente = null) {
        let atencionesFiltradas = this.atenciones;
        
        if (docente) {
            atencionesFiltradas = this.atenciones.filter(a => a.docente === docente);
        }

        const docentesStats = {};
        atencionesFiltradas.forEach(a => {
            if (!docentesStats[a.docente]) {
                docentesStats[a.docente] = {
                    docente: a.docente,
                    total: 0,
                    porTema: {}
                };
            }
            docentesStats[a.docente].total++;
            docentesStats[a.docente].porTema[a.tema] = (docentesStats[a.docente].porTema[a.tema] || 0) + 1;
        });

        return {
            total: atencionesFiltradas.length,
            docentes: Object.values(docentesStats),
            atenciones: atencionesFiltradas
        };
    }

    // Generar reporte por tema
    generarReportePorTema(tema = null) {
        let atencionesFiltradas = this.atenciones;
        
        if (tema) {
            atencionesFiltradas = this.atenciones.filter(a => a.tema === tema);
        }

        const temasStats = {};
        atencionesFiltradas.forEach(a => {
            if (!temasStats[a.tema]) {
                temasStats[a.tema] = {
                    tema: a.tema,
                    total: 0,
                    estudiantes: new Set()
                };
            }
            temasStats[a.tema].total++;
            temasStats[a.tema].estudiantes.add(a.estudiante.codigo);
        });

        // Convertir Sets a números
        Object.values(temasStats).forEach(stat => {
            stat.estudiantesUnicos = stat.estudiantes.size;
            delete stat.estudiantes;
        });

        return {
            total: atencionesFiltradas.length,
            temas: Object.values(temasStats),
            atenciones: atencionesFiltradas
        };
    }

    // Generar reporte por rango de fechas
    generarReportePorFechas(fechaInicio, fechaFin) {
        const atencionesFiltradas = this.atenciones.filter(a => {
            return a.fecha >= fechaInicio && a.fecha <= fechaFin;
        });

        const fechasStats = {};
        atencionesFiltradas.forEach(a => {
            fechasStats[a.fecha] = (fechasStats[a.fecha] || 0) + 1;
        });

        const promedioDiario = atencionesFiltradas.length / Object.keys(fechasStats).length || 0;

        return {
            total: atencionesFiltradas.length,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            porFecha: fechasStats,
            promedioDiario: promedioDiario.toFixed(1),
            atenciones: atencionesFiltradas
        };
    }

    // Generar reporte por ciclo académico
    generarReportePorCiclo(ciclo) {
        const atencionesFiltradas = this.atenciones.filter(a => a.semestre === ciclo);

        const estudiantesUnicos = new Set(atencionesFiltradas.map(a => a.estudiante.codigo)).size;
        const docentesUnicos = new Set(atencionesFiltradas.map(a => a.docente)).size;

        const porTema = {};
        atencionesFiltradas.forEach(a => {
            porTema[a.tema] = (porTema[a.tema] || 0) + 1;
        });

        return {
            ciclo: ciclo,
            total: atencionesFiltradas.length,
            estudiantes: estudiantesUnicos,
            docentes: docentesUnicos,
            porTema: porTema,
            atenciones: atencionesFiltradas
        };
    }

    // Generar reporte mensual
    generarReporteMensual(mes, anio) {
        const atencionesFiltradas = this.atenciones.filter(a => {
            const fechaAtencion = new Date(a.fecha + 'T00:00:00');
            const mesAtencion = String(fechaAtencion.getMonth() + 1).padStart(2, '0');
            const anioAtencion = fechaAtencion.getFullYear();
            
            return mesAtencion === mes && anioAtencion === parseInt(anio);
        });

        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const nombreMes = meses[parseInt(mes) - 1];

        const estudiantesUnicos = new Set(atencionesFiltradas.map(a => a.estudiante.codigo)).size;
        const docentesUnicos = new Set(atencionesFiltradas.map(a => a.docente)).size;

        // Distribución por días
        const porDia = {};
        atencionesFiltradas.forEach(a => {
            const dia = new Date(a.fecha + 'T00:00:00').getDate();
            porDia[dia] = (porDia[dia] || 0) + 1;
        });

        return {
            mes: nombreMes,
            anio: anio,
            total: atencionesFiltradas.length,
            estudiantes: estudiantesUnicos,
            docentes: docentesUnicos,
            porDia: porDia,
            atenciones: atencionesFiltradas
        };
    }

    // Generar reporte por tipo de cita (tema)
    generarReportePorTipoCita(tipo) {
        return this.generarReportePorTema(tipo);
    }

    // Obtener lista de semestres únicos
    obtenerSemestres() {
        return [...new Set(this.atenciones.map(a => a.semestre))].sort().reverse();
    }

    // Obtener lista de docentes únicos
    obtenerDocentes() {
        return [...new Set(this.atenciones.map(a => a.docente))].sort();
    }

    // Obtener lista de temas únicos
    obtenerTemas() {
        return [...new Set(this.atenciones.map(a => a.tema))].sort();
    }

    // Obtener estadísticas generales
    obtenerEstadisticasGenerales() {
        const estudiantesUnicos = new Set(this.atenciones.map(a => a.estudiante.codigo)).size;
        const docentesUnicos = new Set(this.atenciones.map(a => a.docente)).size;

        const porTema = {};
        this.atenciones.forEach(a => {
            porTema[a.tema] = (porTema[a.tema] || 0) + 1;
        });

        const porSemestre = {};
        this.atenciones.forEach(a => {
            porSemestre[a.semestre] = (porSemestre[a.semestre] || 0) + 1;
        });

        return {
            totalAtenciones: this.atenciones.length,
            estudiantesAtendidos: estudiantesUnicos,
            docentesParticipantes: docentesUnicos,
            porTema: porTema,
            porSemestre: porSemestre
        };
    }

    // Exportar datos a formato para CSV/Excel
    exportarDatos(atenciones = null) {
        const datos = atenciones || this.atenciones;
        
        return datos.map(a => ({
            'Semestre': a.semestre,
            'Fecha': a.getFechaFormateada(),
            'Hora': a.hora,
            'Tema': a.tema,
            'Código Estudiante': a.estudiante.codigo,
            'Nombres': a.estudiante.nombres,
            'Apellidos': a.estudiante.apellidos,
            'Email': a.estudiante.email || '',
            'Teléfono': a.estudiante.telefono || '',
            'Descripción': a.descripcion,
            'Evidencia': a.evidencia,
            'Docente': a.docente
        }));
    }
}

// Exportar instancia única (Singleton)
export const reportesController = new ReportesController();

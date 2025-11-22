// Reportes functionality
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { firebaseConfig } from '../config/firebase-config.js';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Variables globales
let todasLasAtenciones = [];
let atencionesFiltradas = [];

// Elementos del DOM
const reportTotalAtenciones = document.getElementById('reportTotalAtenciones');
const reportTotalSemestres = document.getElementById('reportTotalSemestres');
const reportTotalDocentes = document.getElementById('reportTotalDocentes');
const reportTotalEstudiantes = document.getElementById('reportTotalEstudiantes');
const reportSemestreTable = document.getElementById('reportSemestreTable');
const reportDocenteTable = document.getElementById('reportDocenteTable');
const reportTemaTable = document.getElementById('reportTemaTable');
const temaChartContainer = document.getElementById('temaChartContainer');
const btnExport = document.getElementById('btnExport');
const btnPrint = document.getElementById('btnPrint');

// Nuevos elementos de filtros
const reportFilterTipo = document.getElementById('reportFilterTipo');
const filtroFechas = document.getElementById('filtroFechas');
const filtroCiclo = document.getElementById('filtroCiclo');
const filtroMes = document.getElementById('filtroMes');
const filtroTipoCita = document.getElementById('filtroTipoCita');
const btnAplicarFiltro = document.getElementById('btnAplicarFiltro');
const fechaInicio = document.getElementById('fechaInicio');
const fechaFin = document.getElementById('fechaFin');
const cicloSelect = document.getElementById('cicloSelect');
const mesSelect = document.getElementById('mesSelect');
const anioSelect = document.getElementById('anioSelect');
const tipoCitaSelect = document.getElementById('tipoCitaSelect');

// Secciones de reportes específicos
const reporteFechas = document.getElementById('reporteFechas');
const reporteMes = document.getElementById('reporteMes');
const reportFechasTable = document.getElementById('reportFechasTable');
const fechasResumen = document.getElementById('fechasResumen');
const mesResumen = document.getElementById('mesResumen');
const mesChartContainer = document.getElementById('mesChartContainer');

// Función para cargar atenciones
async function cargarAtenciones() {
    try {
        console.log('Cargando atenciones para reportes...');
        const querySnapshot = await getDocs(collection(db, 'atenciones'));

        todasLasAtenciones = [];
        querySnapshot.forEach((doc) => {
            todasLasAtenciones.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log(`Cargadas ${todasLasAtenciones.length} atenciones`);
        
        atencionesFiltradas = [...todasLasAtenciones];
        llenarFiltros();
        generarReportes();

    } catch (error) {
        console.error('Error al cargar atenciones:', error);
        alert('Error al cargar los datos: ' + error.message);
    }
}

// Llenar selectores de filtros
function llenarFiltros() {
    // Llenar ciclos académicos
    const ciclos = [...new Set(todasLasAtenciones.map(a => a.semestre))].sort().reverse();
    cicloSelect.innerHTML = '<option value="">Todos</option>';
    ciclos.forEach(ciclo => {
        const option = document.createElement('option');
        option.value = ciclo;
        option.textContent = ciclo;
        cicloSelect.appendChild(option);
    });

    // Llenar tipos de cita
    const tipos = [...new Set(todasLasAtenciones.map(a => a.tema))].sort();
    tipoCitaSelect.innerHTML = '<option value="">Todos</option>';
    tipos.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo;
        tipoCitaSelect.appendChild(option);
    });
}

// Cambiar tipo de filtro
reportFilterTipo.addEventListener('change', () => {
    const tipo = reportFilterTipo.value;
    
    // Ocultar todos los filtros
    filtroFechas.style.display = 'none';
    filtroCiclo.style.display = 'none';
    filtroMes.style.display = 'none';
    filtroTipoCita.style.display = 'none';
    
    // Mostrar el filtro correspondiente
    if (tipo === 'fechas') {
        filtroFechas.style.display = 'block';
    } else if (tipo === 'ciclo') {
        filtroCiclo.style.display = 'block';
    } else if (tipo === 'mes') {
        filtroMes.style.display = 'block';
    } else if (tipo === 'tipoCita') {
        filtroTipoCita.style.display = 'block';
    }
});

// Aplicar filtros
btnAplicarFiltro.addEventListener('click', () => {
    const tipoFiltro = reportFilterTipo.value;
    
    if (tipoFiltro === 'general') {
        atencionesFiltradas = [...todasLasAtenciones];
        ocultarReportesEspecificos();
        generarReportes();
    } else if (tipoFiltro === 'fechas') {
        filtrarPorFechas();
    } else if (tipoFiltro === 'ciclo') {
        filtrarPorCiclo();
    } else if (tipoFiltro === 'mes') {
        filtrarPorMes();
    } else if (tipoFiltro === 'tipoCita') {
        filtrarPorTipoCita();
    }
});

// Ocultar reportes específicos
function ocultarReportesEspecificos() {
    reporteFechas.style.display = 'none';
    reporteMes.style.display = 'none';
}

// Filtrar por rango de fechas
function filtrarPorFechas() {
    const inicio = fechaInicio.value;
    const fin = fechaFin.value;
    
    if (!inicio || !fin) {
        alert('Por favor, selecciona ambas fechas');
        return;
    }
    
    if (inicio > fin) {
        alert('La fecha de inicio no puede ser posterior a la fecha fin');
        return;
    }
    
    atencionesFiltradas = todasLasAtenciones.filter(a => {
        return a.fecha >= inicio && a.fecha <= fin;
    });
    
    ocultarReportesEspecificos();
    reporteFechas.style.display = 'block';
    generarReportes();
    generarReportePorFechas(inicio, fin);
}

// Filtrar por ciclo académico
function filtrarPorCiclo() {
    const ciclo = cicloSelect.value;
    
    if (!ciclo) {
        atencionesFiltradas = [...todasLasAtenciones];
    } else {
        atencionesFiltradas = todasLasAtenciones.filter(a => a.semestre === ciclo);
    }
    
    ocultarReportesEspecificos();
    generarReportes();
}

// Filtrar por mes
function filtrarPorMes() {
    const mes = mesSelect.value;
    const anio = anioSelect.value;
    
    if (!mes) {
        alert('Por favor, selecciona un mes');
        return;
    }
    
    atencionesFiltradas = todasLasAtenciones.filter(a => {
        const fechaAtencion = new Date(a.fecha);
        const mesAtencion = String(fechaAtencion.getMonth() + 1).padStart(2, '0');
        const anioAtencion = fechaAtencion.getFullYear();
        
        return mesAtencion === mes && anioAtencion === parseInt(anio);
    });
    
    ocultarReportesEspecificos();
    reporteMes.style.display = 'block';
    generarReportes();
    generarReporteMensual(mes, anio);
}

// Filtrar por tipo de cita
function filtrarPorTipoCita() {
    const tipo = tipoCitaSelect.value;
    
    if (!tipo) {
        atencionesFiltradas = [...todasLasAtenciones];
    } else {
        atencionesFiltradas = todasLasAtenciones.filter(a => a.tema === tipo);
    }
    
    ocultarReportesEspecificos();
    generarReportes();
}

// Generar reporte por fechas
function generarReportePorFechas(inicio, fin) {
    const fechasPorDia = {};
    
    atencionesFiltradas.forEach(a => {
        const fecha = a.fecha;
        fechasPorDia[fecha] = (fechasPorDia[fecha] || 0) + 1;
    });
    
    const total = atencionesFiltradas.length;
    fechasResumen.innerHTML = `
        <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
            <p><strong>Período:</strong> ${formatearFecha(inicio)} - ${formatearFecha(fin)}</p>
            <p><strong>Total de atenciones:</strong> ${total}</p>
            <p><strong>Promedio diario:</strong> ${(total / Object.keys(fechasPorDia).length).toFixed(1)}</p>
        </div>
    `;
    
    const fechasOrdenadas = Object.entries(fechasPorDia).sort((a, b) => b[0].localeCompare(a[0]));
    
    reportFechasTable.innerHTML = '';
    fechasOrdenadas.forEach(([fecha, count]) => {
        const porcentaje = ((count / total) * 100).toFixed(1);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${formatearFecha(fecha)}</strong></td>
            <td>${count}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div style="flex: 1; background: var(--bg-secondary); height: 24px; border-radius: 4px; overflow: hidden;">
                        <div style="background: var(--primary-color); height: 100%; width: ${porcentaje}%; transition: width 0.5s;"></div>
                    </div>
                    <span style="min-width: 50px; text-align: right;">${porcentaje}%</span>
                </div>
            </td>
        `;
        reportFechasTable.appendChild(row);
    });
}

// Generar reporte mensual
function generarReporteMensual(mes, anio) {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const nombreMes = meses[parseInt(mes) - 1];
    
    const total = atencionesFiltradas.length;
    const estudiantes = new Set(atencionesFiltradas.map(a => a.estudiante.codigo)).size;
    const docentes = new Set(atencionesFiltradas.map(a => a.docente)).size;
    
    mesResumen.innerHTML = `
        <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
            <h3 style="color: var(--primary-color); margin-bottom: 1rem;">${nombreMes} ${anio}</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">📋</div>
                    <div class="stat-content">
                        <h3>${total}</h3>
                        <p>Total Atenciones</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">👨‍🎓</div>
                    <div class="stat-content">
                        <h3>${estudiantes}</h3>
                        <p>Estudiantes</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">👨‍🏫</div>
                    <div class="stat-content">
                        <h3>${docentes}</h3>
                        <p>Docentes</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Gráfico por días del mes
    const diasCount = {};
    atencionesFiltradas.forEach(a => {
        const dia = new Date(a.fecha).getDate();
        diasCount[dia] = (diasCount[dia] || 0) + 1;
    });
    
    const diasOrdenados = Object.entries(diasCount).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
    const maxCount = Math.max(...diasOrdenados.map(([_, count]) => count));
    
    mesChartContainer.innerHTML = '<h3>Distribución por Días</h3>';
    diasOrdenados.forEach(([dia, count]) => {
        const porcentajeAncho = (count / maxCount) * 100;
        
        const chartBar = document.createElement('div');
        chartBar.className = 'chart-bar';
        chartBar.innerHTML = `
            <div class="chart-label">
                <span>Día ${dia}</span>
                <span><strong>${count}</strong> atenciones</span>
            </div>
            <div class="chart-bar-fill" style="width: ${porcentajeAncho}%;">
                ${count}
            </div>
        `;
        
        mesChartContainer.appendChild(chartBar);
    });
}

// Función para formatear fecha
function formatearFecha(fecha) {
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Función para generar todos los reportes
function generarReportes() {
    generarResumenGeneral();
    generarReporteSemestre();
    generarReporteDocente();
    generarReporteTema();
    generarGraficoTemas();
}

// Resumen General
function generarResumenGeneral() {
    const semestres = new Set(todasLasAtenciones.map(a => a.semestre));
    const docentes = new Set(todasLasAtenciones.map(a => a.docente));
    const estudiantes = new Set(todasLasAtenciones.map(a => a.estudiante.codigo));

    reportTotalAtenciones.textContent = todasLasAtenciones.length;
    reportTotalSemestres.textContent = semestres.size;
    reportTotalDocentes.textContent = docentes.size;
    reportTotalEstudiantes.textContent = estudiantes.size;
}

// Reporte por Semestre
function generarReporteSemestre() {
    const semestreCount = {};
    
    todasLasAtenciones.forEach(atencion => {
        const semestre = atencion.semestre;
        semestreCount[semestre] = (semestreCount[semestre] || 0) + 1;
    });

    const total = todasLasAtenciones.length;
    const semestresOrdenados = Object.entries(semestreCount)
        .sort((a, b) => b[1] - a[1]);

    if (semestresOrdenados.length === 0) {
        reportSemestreTable.innerHTML = `
            <tr>
                <td colspan="3" class="text-center">No hay datos disponibles</td>
            </tr>
        `;
        return;
    }

    reportSemestreTable.innerHTML = '';
    semestresOrdenados.forEach(([semestre, count]) => {
        const porcentaje = ((count / total) * 100).toFixed(1);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${semestre}</strong></td>
            <td>${count}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div style="flex: 1; background: var(--bg-secondary); height: 24px; border-radius: 4px; overflow: hidden;">
                        <div style="background: var(--primary-color); height: 100%; width: ${porcentaje}%; transition: width 0.5s;"></div>
                    </div>
                    <span style="min-width: 50px; text-align: right;">${porcentaje}%</span>
                </div>
            </td>
        `;
        reportSemestreTable.appendChild(row);
    });
}

// Reporte por Docente
function generarReporteDocente() {
    const docenteCount = {};
    
    todasLasAtenciones.forEach(atencion => {
        const docente = atencion.docente;
        docenteCount[docente] = (docenteCount[docente] || 0) + 1;
    });

    const total = todasLasAtenciones.length;
    const docentesOrdenados = Object.entries(docenteCount)
        .sort((a, b) => b[1] - a[1]);

    if (docentesOrdenados.length === 0) {
        reportDocenteTable.innerHTML = `
            <tr>
                <td colspan="3" class="text-center">No hay datos disponibles</td>
            </tr>
        `;
        return;
    }

    reportDocenteTable.innerHTML = '';
    docentesOrdenados.forEach(([docente, count]) => {
        const porcentaje = ((count / total) * 100).toFixed(1);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${docente}</strong></td>
            <td>${count}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div style="flex: 1; background: var(--bg-secondary); height: 24px; border-radius: 4px; overflow: hidden;">
                        <div style="background: var(--success-color); height: 100%; width: ${porcentaje}%; transition: width 0.5s;"></div>
                    </div>
                    <span style="min-width: 50px; text-align: right;">${porcentaje}%</span>
                </div>
            </td>
        `;
        reportDocenteTable.appendChild(row);
    });
}

// Reporte por Tema
function generarReporteTema() {
    const temaCount = {};
    
    todasLasAtenciones.forEach(atencion => {
        const tema = atencion.tema;
        temaCount[tema] = (temaCount[tema] || 0) + 1;
    });

    const total = todasLasAtenciones.length;
    const temasOrdenados = Object.entries(temaCount)
        .sort((a, b) => b[1] - a[1]);

    if (temasOrdenados.length === 0) {
        reportTemaTable.innerHTML = `
            <tr>
                <td colspan="3" class="text-center">No hay datos disponibles</td>
            </tr>
        `;
        return;
    }

    reportTemaTable.innerHTML = '';
    temasOrdenados.forEach(([tema, count]) => {
        const porcentaje = ((count / total) * 100).toFixed(1);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${tema}</strong></td>
            <td>${count}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div style="flex: 1; background: var(--bg-secondary); height: 24px; border-radius: 4px; overflow: hidden;">
                        <div style="background: var(--warning-color); height: 100%; width: ${porcentaje}%; transition: width 0.5s;"></div>
                    </div>
                    <span style="min-width: 50px; text-align: right;">${porcentaje}%</span>
                </div>
            </td>
        `;
        reportTemaTable.appendChild(row);
    });
}

// Gráfico de barras para temas
function generarGraficoTemas() {
    const temaCount = {};
    
    todasLasAtenciones.forEach(atencion => {
        const tema = atencion.tema;
        temaCount[tema] = (temaCount[tema] || 0) + 1;
    });

    const temasOrdenados = Object.entries(temaCount)
        .sort((a, b) => b[1] - a[1]);

    if (temasOrdenados.length === 0) {
        temaChartContainer.innerHTML = '<p class="text-center">No hay datos disponibles</p>';
        return;
    }

    const maxCount = Math.max(...temasOrdenados.map(([_, count]) => count));

    temaChartContainer.innerHTML = '';
    temasOrdenados.forEach(([tema, count]) => {
        const porcentajeAncho = (count / maxCount) * 100;
        
        const chartBar = document.createElement('div');
        chartBar.className = 'chart-bar';
        chartBar.innerHTML = `
            <div class="chart-label">
                <span>${tema}</span>
                <span><strong>${count}</strong> atenciones</span>
            </div>
            <div class="chart-bar-fill" style="width: ${porcentajeAncho}%;">
                ${porcentajeAncho.toFixed(0)}%
            </div>
        `;
        
        temaChartContainer.appendChild(chartBar);
    });
}

// Exportar reporte como texto
btnExport.addEventListener('click', () => {
    const fechaHoy = new Date().toLocaleDateString('es-ES');
    let reporte = `REPORTE DE ATENCIONES DE CONSEJERÍA Y TUTORÍA\n`;
    reporte += `Generado el: ${fechaHoy}\n`;
    reporte += `${'='.repeat(60)}\n\n`;

    reporte += `RESUMEN GENERAL\n`;
    reporte += `${'-'.repeat(60)}\n`;
    reporte += `Total de Atenciones: ${todasLasAtenciones.length}\n`;
    reporte += `Semestres Registrados: ${new Set(todasLasAtenciones.map(a => a.semestre)).size}\n`;
    reporte += `Docentes Activos: ${new Set(todasLasAtenciones.map(a => a.docente)).size}\n`;
    reporte += `Estudiantes Atendidos: ${new Set(todasLasAtenciones.map(a => a.estudiante.codigo)).size}\n\n`;

    reporte += `ATENCIONES POR SEMESTRE\n`;
    reporte += `${'-'.repeat(60)}\n`;
    const semestreCount = {};
    todasLasAtenciones.forEach(a => {
        semestreCount[a.semestre] = (semestreCount[a.semestre] || 0) + 1;
    });
    Object.entries(semestreCount).sort((a, b) => b[1] - a[1]).forEach(([sem, count]) => {
        reporte += `${sem}: ${count} atenciones\n`;
    });
    reporte += `\n`;

    reporte += `ATENCIONES POR DOCENTE\n`;
    reporte += `${'-'.repeat(60)}\n`;
    const docenteCount = {};
    todasLasAtenciones.forEach(a => {
        docenteCount[a.docente] = (docenteCount[a.docente] || 0) + 1;
    });
    Object.entries(docenteCount).sort((a, b) => b[1] - a[1]).forEach(([doc, count]) => {
        reporte += `${doc}: ${count} atenciones\n`;
    });
    reporte += `\n`;

    reporte += `ATENCIONES POR TEMA\n`;
    reporte += `${'-'.repeat(60)}\n`;
    const temaCount = {};
    todasLasAtenciones.forEach(a => {
        temaCount[a.tema] = (temaCount[a.tema] || 0) + 1;
    });
    Object.entries(temaCount).sort((a, b) => b[1] - a[1]).forEach(([tema, count]) => {
        reporte += `${tema}: ${count} atenciones\n`;
    });

    // Descargar como archivo
    const blob = new Blob([reporte], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_atenciones_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('✅ Reporte exportado exitosamente');
});

// Imprimir reporte
btnPrint.addEventListener('click', () => {
    window.print();
});

// Verificar autenticación y cargar datos
onAuthStateChanged(auth, (user) => {
    if (!user) {
        console.log('No hay usuario autenticado, redirigiendo...');
        window.location.href = 'login.html';
    } else {
        console.log('Usuario autenticado:', user.email);
        cargarAtenciones();
    }
});

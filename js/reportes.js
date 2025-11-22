// Reportes functionality
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Variables globales
let todasLasAtenciones = [];

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
        
        generarReportes();

    } catch (error) {
        console.error('Error al cargar atenciones:', error);
        alert('Error al cargar los datos: ' + error.message);
    }
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

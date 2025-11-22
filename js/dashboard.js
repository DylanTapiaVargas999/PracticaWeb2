// Dashboard functionality
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore, collection, getDocs, query, orderBy, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Variables globales
let todasLasAtenciones = [];
let filteredAtenciones = [];

// Elementos del DOM
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');
const btnNewAttention = document.getElementById('btnNewAttention');
const btnReports = document.getElementById('btnReports');
const atencionesTableBody = document.getElementById('atencionesTableBody');
const detailModal = document.getElementById('detailModal');
const closeDetailModal = document.getElementById('closeDetailModal');
const detailModalBody = document.getElementById('detailModalBody');

// Filtros
const filterSemestre = document.getElementById('filterSemestre');
const filterDocente = document.getElementById('filterDocente');
const filterTema = document.getElementById('filterTema');
const btnClearFilters = document.getElementById('btnClearFilters');

// Estadísticas
const totalAtenciones = document.getElementById('totalAtenciones');
const totalSemestres = document.getElementById('totalSemestres');
const totalDocentes = document.getElementById('totalDocentes');
const totalTemas = document.getElementById('totalTemas');

// Botones de navegación
btnNewAttention.addEventListener('click', () => {
    window.location.href = 'atencion.html';
});

btnReports.addEventListener('click', () => {
    window.location.href = 'reportes.html';
});

// Cerrar sesión
logoutBtn.addEventListener('click', async () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        try {
            await signOut(auth);
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            alert('Error al cerrar sesión: ' + error.message);
        }
    }
});

// Cerrar modal
closeDetailModal.addEventListener('click', () => {
    detailModal.classList.remove('show');
});

detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) {
        detailModal.classList.remove('show');
    }
});

// Función para cargar atenciones desde Firestore
async function cargarAtenciones() {
    try {
        console.log('Cargando atenciones desde Firestore...');
        const q = query(collection(db, 'atenciones'), orderBy('fecha', 'desc'));
        const querySnapshot = await getDocs(q);

        todasLasAtenciones = [];
        querySnapshot.forEach((doc) => {
            todasLasAtenciones.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log(`Cargadas ${todasLasAtenciones.length} atenciones`);
        filteredAtenciones = [...todasLasAtenciones];
        
        actualizarEstadisticas();
        llenarFiltros();
        mostrarAtenciones();

    } catch (error) {
        console.error('Error al cargar atenciones:', error);
        atencionesTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center" style="color: var(--error-color);">
                    Error al cargar las atenciones: ${error.message}
                </td>
            </tr>
        `;
    }
}

// Función para actualizar estadísticas
function actualizarEstadisticas() {
    const semestres = new Set(todasLasAtenciones.map(a => a.semestre));
    const docentes = new Set(todasLasAtenciones.map(a => a.docente));
    const temas = new Set(todasLasAtenciones.map(a => a.tema));

    totalAtenciones.textContent = todasLasAtenciones.length;
    totalSemestres.textContent = semestres.size;
    totalDocentes.textContent = docentes.size;
    totalTemas.textContent = temas.size;
}

// Función para llenar los selectores de filtros
function llenarFiltros() {
    // Obtener valores únicos
    const semestres = [...new Set(todasLasAtenciones.map(a => a.semestre))].sort().reverse();
    const docentes = [...new Set(todasLasAtenciones.map(a => a.docente))].sort();
    const temas = [...new Set(todasLasAtenciones.map(a => a.tema))].sort();

    // Llenar selector de semestres
    filterSemestre.innerHTML = '<option value="">Todos</option>';
    semestres.forEach(semestre => {
        const option = document.createElement('option');
        option.value = semestre;
        option.textContent = semestre;
        filterSemestre.appendChild(option);
    });

    // Llenar selector de docentes
    filterDocente.innerHTML = '<option value="">Todos</option>';
    docentes.forEach(docente => {
        const option = document.createElement('option');
        option.value = docente;
        option.textContent = docente;
        filterDocente.appendChild(option);
    });

    // Llenar selector de temas
    filterTema.innerHTML = '<option value="">Todos</option>';
    temas.forEach(tema => {
        const option = document.createElement('option');
        option.value = tema;
        option.textContent = tema;
        filterTema.appendChild(option);
    });
}

// Función para aplicar filtros
function aplicarFiltros() {
    const semestreSeleccionado = filterSemestre.value;
    const docenteSeleccionado = filterDocente.value;
    const temaSeleccionado = filterTema.value;

    filteredAtenciones = todasLasAtenciones.filter(atencion => {
        const cumpleSemestre = !semestreSeleccionado || atencion.semestre === semestreSeleccionado;
        const cumpleDocente = !docenteSeleccionado || atencion.docente === docenteSeleccionado;
        const cumpleTema = !temaSeleccionado || atencion.tema === temaSeleccionado;

        return cumpleSemestre && cumpleDocente && cumpleTema;
    });

    mostrarAtenciones();
}

// Event listeners para los filtros
filterSemestre.addEventListener('change', aplicarFiltros);
filterDocente.addEventListener('change', aplicarFiltros);
filterTema.addEventListener('change', aplicarFiltros);

// Limpiar filtros
btnClearFilters.addEventListener('click', () => {
    filterSemestre.value = '';
    filterDocente.value = '';
    filterTema.value = '';
    filteredAtenciones = [...todasLasAtenciones];
    mostrarAtenciones();
});

// Función para mostrar atenciones en la tabla
function mostrarAtenciones() {
    if (filteredAtenciones.length === 0) {
        atencionesTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    No hay atenciones registradas con los filtros seleccionados.
                </td>
            </tr>
        `;
        return;
    }

    atencionesTableBody.innerHTML = '';

    filteredAtenciones.forEach(atencion => {
        const row = document.createElement('tr');
        row.style.cursor = 'pointer';
        row.onclick = () => mostrarDetalle(atencion);

        row.innerHTML = `
            <td>${formatearFecha(atencion.fecha)}</td>
            <td>${atencion.hora}</td>
            <td>${atencion.semestre}</td>
            <td>${atencion.estudiante.nombreCompleto}</td>
            <td>${atencion.estudiante.codigo}</td>
            <td>${atencion.docente}</td>
            <td>${atencion.tema}</td>
            <td>
                <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
                    Ver Detalle
                </button>
            </td>
        `;

        atencionesTableBody.appendChild(row);
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

// Función para mostrar detalle de una atención
function mostrarDetalle(atencion) {
    detailModalBody.innerHTML = `
        <div class="detail-group">
            <h3>📅 Información General</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Semestre</div>
                    <div class="detail-value">${atencion.semestre}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Fecha</div>
                    <div class="detail-value">${formatearFecha(atencion.fecha)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Hora</div>
                    <div class="detail-value">${atencion.hora}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Docente</div>
                    <div class="detail-value">${atencion.docente}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Tema</div>
                    <div class="detail-value">${atencion.tema}</div>
                </div>
            </div>
        </div>

        <div class="detail-group">
            <h3>👨‍🎓 Datos del Estudiante</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Código</div>
                    <div class="detail-value">${atencion.estudiante.codigo}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Apellidos</div>
                    <div class="detail-value">${atencion.estudiante.apellidos}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Nombres</div>
                    <div class="detail-value">${atencion.estudiante.nombres}</div>
                </div>
            </div>
        </div>

        <div class="detail-group">
            <h3>📝 Consulta del Estudiante</h3>
            <p style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-sm);">
                ${atencion.consultaEstudiante}
            </p>
        </div>

        <div class="detail-group">
            <h3>💬 Descripción de la Atención</h3>
            <p style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-sm);">
                ${atencion.descripcionAtencion}
            </p>
        </div>

        ${atencion.evidencia ? `
            <div class="detail-group">
                <h3>📎 Evidencia</h3>
                <p style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-sm);">
                    ${atencion.evidencia}
                </p>
            </div>
        ` : ''}

        <div class="detail-group">
            <h3>ℹ️ Información de Registro</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Registrado por</div>
                    <div class="detail-value">${atencion.registradoPorEmail || 'N/A'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Fecha de Registro</div>
                    <div class="detail-value">${new Date(atencion.fechaRegistro).toLocaleString('es-ES')}</div>
                </div>
            </div>
        </div>
    `;

    detailModal.classList.add('show');
}

// Verificar autenticación y cargar datos
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        console.log('No hay usuario autenticado, redirigiendo...');
        window.location.href = 'login.html';
    } else {
        console.log('Usuario autenticado:', user.email);
        
        // Intentar obtener el nombre del docente desde Firestore
        try {
            const docenteDoc = await getDoc(doc(db, 'docentes', user.uid));
            if (docenteDoc.exists()) {
                const docenteData = docenteDoc.data();
                userInfo.textContent = `👋 Hola, ${docenteData.nombre}`;
            } else {
                userInfo.textContent = `👋 ${user.email}`;
            }
        } catch (error) {
            console.error('Error al obtener datos del docente:', error);
            userInfo.textContent = `👋 ${user.email}`;
        }

        // Cargar atenciones
        cargarAtenciones();
    }
});

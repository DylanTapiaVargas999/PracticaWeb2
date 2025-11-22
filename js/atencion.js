// Atencion form functionality
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Elementos del DOM
const atencionForm = document.getElementById('atencionForm');
const formMessage = document.getElementById('formMessage');
const btnCancel = document.getElementById('btnCancel');
const temaSelect = document.getElementById('tema');
const otroTemaGroup = document.getElementById('otroTemaGroup');
const otroTemaInput = document.getElementById('otroTema');

// Establecer la fecha actual por defecto
document.getElementById('fecha').valueAsDate = new Date();

// Mostrar/ocultar campo "Otro tema"
temaSelect.addEventListener('change', () => {
    if (temaSelect.value === 'Otros') {
        otroTemaGroup.style.display = 'block';
        otroTemaInput.required = true;
    } else {
        otroTemaGroup.style.display = 'none';
        otroTemaInput.required = false;
        otroTemaInput.value = '';
    }
});

// Función para mostrar mensajes
function showMessage(message, type = 'info') {
    formMessage.textContent = message;
    formMessage.className = `message ${type}`;
    formMessage.style.display = 'block';
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Función para ocultar mensajes
function hideMessage() {
    formMessage.style.display = 'none';
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

// Validación del código de estudiante
document.getElementById('codigoEstudiante').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 8);
});

// Botón cancelar
btnCancel.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que deseas cancelar? Se perderán los datos ingresados.')) {
        window.location.href = 'dashboard.html';
    }
});

// Manejar el envío del formulario
atencionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessage();

    const user = auth.currentUser;
    if (!user) {
        showMessage('Debes iniciar sesión para registrar una atención.', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    const submitBtn = atencionForm.querySelector('button[type="submit"]');

    // Recopilar datos del formulario
    const semestre = document.getElementById('semestre').value.trim();
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const docente = document.getElementById('docente').value.trim();
    let tema = document.getElementById('tema').value;
    const codigoEstudiante = document.getElementById('codigoEstudiante').value.trim();
    const apellidosEstudiante = document.getElementById('apellidosEstudiante').value.trim();
    const nombresEstudiante = document.getElementById('nombresEstudiante').value.trim();
    const consultaEstudiante = document.getElementById('consultaEstudiante').value.trim();
    const descripcionAtencion = document.getElementById('descripcionAtencion').value.trim();
    const evidencia = document.getElementById('evidencia').value.trim();

    // Si seleccionó "Otros", usar el texto del campo adicional
    if (tema === 'Otros') {
        const otroTema = document.getElementById('otroTema').value.trim();
        if (!otroTema) {
            showMessage('Por favor, especifica el tema de la atención.', 'error');
            return;
        }
        tema = `Otros: ${otroTema}`;
    }

    // Validaciones adicionales
    if (codigoEstudiante.length !== 8) {
        showMessage('El código del estudiante debe tener exactamente 8 dígitos.', 'error');
        return;
    }

    if (consultaEstudiante.length < 20) {
        showMessage('La consulta del estudiante debe tener al menos 20 caracteres.', 'error');
        return;
    }

    if (descripcionAtencion.length < 30) {
        showMessage('La descripción de la atención debe tener al menos 30 caracteres.', 'error');
        return;
    }

    toggleButtonLoading(submitBtn, true);

    try {
        // Crear objeto de datos para guardar
        const atencionData = {
            // Información general
            semestre: semestre,
            fecha: fecha,
            hora: hora,
            docente: docente,
            tema: tema,
            
            // Datos del estudiante
            estudiante: {
                codigo: codigoEstudiante,
                apellidos: apellidosEstudiante,
                nombres: nombresEstudiante,
                nombreCompleto: `${apellidosEstudiante} ${nombresEstudiante}`
            },
            
            // Descripción de la atención
            consultaEstudiante: consultaEstudiante,
            descripcionAtencion: descripcionAtencion,
            evidencia: evidencia || null,
            
            // Metadatos
            registradoPor: user.uid,
            registradoPorEmail: user.email,
            fechaRegistro: new Date().toISOString(),
            timestamp: serverTimestamp()
        };

        console.log('Guardando atención:', atencionData);

        // Guardar en Firestore
        const docRef = await addDoc(collection(db, 'atenciones'), atencionData);
        console.log('Atención guardada con ID:', docRef.id);

        showMessage('✅ ¡Atención registrada exitosamente!', 'success');

        // Limpiar el formulario
        atencionForm.reset();
        document.getElementById('fecha').valueAsDate = new Date();
        otroTemaGroup.style.display = 'none';

        // Redirigir al dashboard después de 2 segundos
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);

    } catch (error) {
        console.error('Error al guardar la atención:', error);
        toggleButtonLoading(submitBtn, false);

        let errorMessage = 'Error al registrar la atención. ';

        if (error.code === 'permission-denied') {
            errorMessage += 'No tienes permisos para realizar esta operación. Verifica las reglas de Firestore.';
        } else if (error.code === 'network-request-failed') {
            errorMessage += 'Error de conexión. Verifica tu internet.';
        } else {
            errorMessage += error.message;
        }

        showMessage(errorMessage, 'error');
    }
});

// Verificar autenticación al cargar la página
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Si no hay usuario autenticado, redirigir al login
        console.log('No hay usuario autenticado, redirigiendo...');
        window.location.href = 'login.html';
    } else {
        console.log('Usuario autenticado:', user.email);
        // Prellenar el campo de docente con el email del usuario
        // (En una aplicación real, deberías obtener el nombre del docente desde Firestore)
        document.getElementById('docente').value = user.email;
    }
});

# Sistema de Registro de Atenciones de Consejería y Tutoría

## 📋 Descripción

Sistema web completo para el registro y gestión de atenciones de consejería y tutoría a estudiantes. Desarrollado con HTML, CSS, JavaScript y Firebase (Authentication y Firestore).

## ✨ Características Principales

### 🔐 Autenticación
- **Registro de docentes** con email y contraseña
- **Login seguro** con Firebase Authentication
- **Sesión persistente** entre páginas
- **Cierre de sesión** seguro

### 📝 Registro de Atenciones
- **Formulario completo** con validación de campos
- **Información obligatoria:**
  - Semestre académico
  - Fecha y hora de atención
  - Docente responsable
  - Tema de consejería (5 opciones predefinidas + otros)
  - Datos del estudiante (código de 8 dígitos, apellidos, nombres)
  - Consulta del estudiante
  - Descripción de la atención brindada
- **Campo opcional:** Evidencia (documentos, links, referencias)
- **Validaciones en tiempo real**

### 📊 Dashboard Interactivo
- **Estadísticas en tiempo real:**
  - Total de atenciones
  - Semestres activos
  - Docentes participantes
  - Temas diferentes atendidos
- **Filtros avanzados:**
  - Por semestre
  - Por docente
  - Por tema
- **Tabla completa** con todas las atenciones ordenadas por fecha
- **Modal de detalles** al hacer clic en cualquier atención

### 📈 Reportes y Estadísticas
- **Reporte por semestre** con porcentajes
- **Reporte por docente** con porcentajes
- **Reporte por tema** con porcentajes y gráficos visuales
- **Exportación** de reportes en formato texto
- **Impresión** optimizada para PDF

### 🎨 Diseño Moderno
- **Interfaz limpia y profesional**
- **Responsive design** para móviles y tablets
- **Iconos SVG** integrados
- **Efectos visuales** suaves y transiciones
- **Sistema de colores** consistente

## 🚀 Configuración del Proyecto

### Paso 1: Configurar Firebase

1. **Crear un proyecto en Firebase:**
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Clic en "Agregar proyecto"
   - Ingresa un nombre (ej: "sistema-consejeria-web")
   - Acepta los términos y crea el proyecto

2. **Registrar tu aplicación web:**
   - En el panel de Firebase, clic en el ícono web `</>`
   - Registra tu app con un nombre
   - **Copia las credenciales** que aparecen

3. **Actualizar la configuración:**
   - Abre el archivo `js/firebase-config.js`
   - Reemplaza los valores con tus credenciales de Firebase:
   ```javascript
   export const firebaseConfig = {
       apiKey: "TU_API_KEY",
       authDomain: "TU_AUTH_DOMAIN",
       projectId: "TU_PROJECT_ID",
       storageBucket: "TU_STORAGE_BUCKET",
       messagingSenderId: "TU_MESSAGING_SENDER_ID",
       appId: "TU_APP_ID"
   };
   ```

### Paso 2: Configurar Firebase Authentication

1. En Firebase Console, ve a **Authentication**
2. Clic en "Comenzar"
3. Habilita el proveedor **"Correo electrónico/contraseña"**
4. Guarda los cambios

### Paso 3: Configurar Firestore Database

1. En Firebase Console, ve a **Firestore Database**
2. Clic en "Crear base de datos"
3. Selecciona **"Modo de prueba"** (para desarrollo)
4. Elige una ubicación (ej: us-central)

5. **IMPORTANTE - Configurar Reglas de Seguridad:**
   - Ve a la pestaña "Reglas"
   - Reemplaza las reglas con:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Regla para la colección de docentes
       match /docentes/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
         allow read: if request.auth != null;
       }
       
       // Regla para la colección de atenciones
       match /atenciones/{atencionId} {
         allow read: if request.auth != null;
         allow create: if request.auth != null;
         allow update, delete: if request.auth != null && 
                                  resource.data.registradoPor == request.auth.uid;
       }
     }
   }
   ```
   - Clic en "Publicar"

### Paso 4: Estructura de Colecciones en Firestore

El sistema crea automáticamente dos colecciones:

#### Colección `docentes`
Almacena información de los docentes registrados:
```javascript
{
  nombre: "Juan Pérez García",
  codigo: "DOC20250001",
  email: "juan.perez@universidad.edu.pe",
  rol: "docente",
  fechaRegistro: "2025-01-20T10:30:00.000Z",
  timestamp: 1737368400000
}
```

#### Colección `atenciones`
Almacena todas las atenciones registradas:
```javascript
{
  semestre: "2025-I",
  fecha: "2025-01-20",
  hora: "14:30",
  docente: "juan.perez@universidad.edu.pe",
  tema: "Plan de Estudios",
  estudiante: {
    codigo: "20220145",
    apellidos: "García López",
    nombres: "María Elena",
    nombreCompleto: "García López María Elena"
  },
  consultaEstudiante: "Necesito orientación sobre los cursos electivos...",
  descripcionAtencion: "Se le proporcionó información detallada sobre...",
  evidencia: "Documento entregado: Plan_Estudios_2025.pdf",
  registradoPor: "uid_del_docente",
  registradoPorEmail: "juan.perez@universidad.edu.pe",
  fechaRegistro: "2025-01-20T14:45:00.000Z",
  timestamp: (serverTimestamp)
}
```

## 📁 Estructura del Proyecto

```
PracticaWeb2/
│
├── index.html              # Página de bienvenida
├── login.html              # Página de inicio de sesión
├── register.html           # Página de registro
├── dashboard.html          # Panel principal con listado
├── atencion.html           # Formulario de nueva atención
├── reportes.html           # Página de reportes y estadísticas
│
├── css/
│   └── styles.css          # Estilos globales del sistema
│
├── js/
│   ├── firebase-config.js  # Configuración de Firebase
│   ├── login.js            # Lógica de inicio de sesión
│   ├── register.js         # Lógica de registro
│   ├── dashboard.js        # Lógica del panel principal
│   ├── atencion.js         # Lógica del formulario de atención
│   └── reportes.js         # Lógica de reportes
│
├── package.json            # Dependencias (Firebase)
└── README.md               # Este archivo
```

## 🎯 Temas de Consejería Disponibles

1. **Consejería en asuntos relacionados con el plan de estudios**
2. **Consejería en asuntos relacionados con el desarrollo profesional**
3. **Consejería en asuntos relacionados con la inserción laboral**
4. **Asuntos Académicos del Proceso de Plan de Tesis o Tesis**
5. **Otros** (con campo de texto adicional para especificar)

## 🔍 Validaciones Implementadas

### Registro de Docentes
- ✅ Nombre completo obligatorio
- ✅ Código de docente mínimo 5 caracteres
- ✅ Email válido
- ✅ Contraseña mínimo 6 caracteres
- ✅ Confirmación de contraseña debe coincidir
- ✅ Email único (no puede estar duplicado)

### Registro de Atenciones
- ✅ Todos los campos obligatorios deben estar completos
- ✅ Código de estudiante debe ser exactamente 8 dígitos
- ✅ Consulta del estudiante mínimo 20 caracteres
- ✅ Descripción de atención mínimo 30 caracteres
- ✅ Fecha no puede ser futura
- ✅ Si selecciona "Otros" en tema, debe especificar

## 📱 Funcionalidades del Dashboard

### Estadísticas en Tiempo Real
- Contador total de atenciones
- Número de semestres diferentes
- Cantidad de docentes participantes
- Total de temas atendidos

### Sistema de Filtros
- **Filtro por semestre:** Muestra solo atenciones del semestre seleccionado
- **Filtro por docente:** Muestra solo atenciones de un docente específico
- **Filtro por tema:** Muestra solo atenciones de un tema específico
- **Combinación de filtros:** Los filtros se pueden aplicar simultáneamente
- **Botón limpiar:** Restaura la vista completa

### Tabla de Atenciones
- Ordenadas por fecha (más recientes primero)
- Información resumida: fecha, hora, semestre, estudiante, código, docente, tema
- Click en cualquier fila para ver detalle completo
- Responsive en dispositivos móviles

### Modal de Detalle
- Muestra toda la información de la atención
- Dividida en secciones claras
- Botón de cerrar (X) y click fuera del modal
- Diseño limpio y legible

## 📊 Sistema de Reportes

### Reportes Disponibles

1. **Resumen General:**
   - Total de atenciones
   - Semestres registrados
   - Docentes activos
   - Estudiantes únicos atendidos

2. **Atenciones por Semestre:**
   - Tabla con cantidad y porcentaje
   - Barra de progreso visual
   - Ordenado de mayor a menor

3. **Atenciones por Docente:**
   - Ranking de docentes
   - Cantidad y porcentaje de atenciones
   - Barra de progreso visual

4. **Atenciones por Tema:**
   - Distribución de temas
   - Cantidad y porcentaje
   - Gráfico de barras interactivo

### Exportación
- **Exportar:** Descarga un archivo .txt con todo el reporte
- **Imprimir:** Impresión optimizada (oculta elementos de navegación)

## 🛠️ Tecnologías Utilizadas

- **Frontend:**
  - HTML5 semántico
  - CSS3 con variables y flexbox/grid
  - JavaScript ES6+ (módulos)
  - Iconos SVG inline

- **Backend:**
  - Firebase Authentication (gestión de usuarios)
  - Firebase Firestore (base de datos NoSQL)
  - Firebase Hosting (opcional para despliegue)

- **Características:**
  - 100% responsivo
  - Sin dependencias externas (frameworks CSS/JS)
  - Código modular y mantenible
  - Validaciones en cliente y servidor

## 🚦 Cómo Usar el Sistema

### Para Docentes (Primera Vez)

1. **Registro:**
   - Abrir `index.html` en el navegador
   - Clic en "Registrarse"
   - Completar todos los campos
   - Hacer clic en "Crear Cuenta"

2. **Iniciar Sesión:**
   - En próximas visitas, clic en "Iniciar Sesión"
   - Ingresar email y contraseña
   - Clic en "Ingresar"

### Registrar una Atención

1. En el dashboard, clic en **"Nueva Atención"**
2. Completar todos los campos obligatorios (marcados con *)
3. Revisar que el código del estudiante tenga 8 dígitos
4. Escribir una consulta descriptiva (mínimo 20 caracteres)
5. Describir la atención brindada (mínimo 30 caracteres)
6. Opcionalmente, agregar evidencia
7. Clic en **"Registrar Atención"**

### Ver Atenciones Registradas

1. En el dashboard se muestran todas las atenciones
2. Usar los filtros para buscar atenciones específicas
3. Hacer clic en cualquier fila para ver el detalle completo

### Generar Reportes

1. Clic en **"Ver Reportes"** desde el dashboard
2. Revisar las estadísticas y gráficos
3. Usar **"Exportar Reporte"** para descargar los datos
4. Usar **"Imprimir"** para generar un PDF

## ⚠️ Solución de Problemas Comunes

### Error: "permission-denied" al registrar

**Causa:** Las reglas de Firestore no están configuradas correctamente.

**Solución:**
1. Ve a Firebase Console → Firestore Database → Reglas
2. Copia y pega las reglas del Paso 3 de la configuración
3. Clic en "Publicar"

### Error: "auth/email-already-in-use"

**Causa:** El email ya está registrado.

**Solución:**
- Usa otro email o inicia sesión con el existente

### No aparecen las atenciones en el dashboard

**Causa:** Puede ser por reglas de Firestore o falta de permisos.

**Solución:**
1. Verifica que el usuario esté autenticado (debe aparecer el email arriba)
2. Revisa las reglas de Firestore
3. Abre la consola del navegador (F12) y busca errores

### El formulario no se envía

**Causa:** Validaciones de campos no cumplidas.

**Solución:**
- Revisa que todos los campos obligatorios estén completos
- El código del estudiante debe tener 8 dígitos
- Las descripciones deben cumplir el mínimo de caracteres

## 🔒 Seguridad

- ✅ Autenticación requerida para acceder al sistema
- ✅ Validación de datos en cliente y servidor
- ✅ Reglas de Firestore configuradas
- ✅ Solo el creador puede modificar/eliminar sus registros
- ✅ Contraseñas encriptadas por Firebase
- ✅ Sesiones seguras con tokens

## 📈 Mejoras Futuras Sugeridas

- [ ] Edición de atenciones registradas
- [ ] Eliminación de atenciones con confirmación
- [ ] Búsqueda por nombre o código de estudiante
- [ ] Notificaciones por email al registrar atención
- [ ] Carga de archivos (PDFs, imágenes) como evidencia
- [ ] Exportación de reportes en Excel/PDF
- [ ] Perfil de usuario editable
- [ ] Roles diferenciados (admin, docente, coordinador)
- [ ] Dashboard con gráficos más avanzados (Chart.js)
- [ ] Historial de atenciones por estudiante

## 📞 Soporte

Para problemas técnicos:
1. Revisa la consola del navegador (F12)
2. Verifica la configuración de Firebase
3. Consulta la documentación oficial de Firebase

## 📄 Licencia

Este proyecto es de uso educativo y puede ser modificado según las necesidades de la institución.

---

**Desarrollado con ❤️ para mejorar el seguimiento académico estudiantil**

## 🎓 Notas de Implementación

### Requisitos del Sistema
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Conexión a Internet activa
- JavaScript habilitado

### Despliegue
Para desplegar en producción:
1. Configurar Firebase Hosting
2. Cambiar las reglas de Firestore de modo prueba a producción
3. Configurar dominio personalizado (opcional)

### Mantenimiento
- Revisar periódicamente las reglas de seguridad
- Hacer backup de la base de datos Firestore
- Monitorear el uso de Firebase (cuotas gratuitas)

# Sistema de Registro de Atenciones de Consejería y Tutoría

## 📋 Características Implementadas

✅ **Sistema de Autenticación**
- Login con email y contraseña
- Registro de nuevos usuarios
- Sesión persistente
- Cierre de sesión seguro

✅ **Registro de Atenciones**
- Formulario completo con validación
- Campos obligatorios: semestre, fecha, hora, docente, tema, datos del estudiante, consulta y descripción
- Campo opcional: evidencia
- Validación de código de estudiante (8 dígitos)
- Guardado en tiempo real en Firebase Firestore

✅ **Estadísticas en Tiempo Real**
- Total de atenciones registradas
- Número de semestres activos
- Docentes participantes
- Temas diferentes atendidos
- Filtros por: semestre, docente y tema

✅ **Visualización de Datos**
- Tabla ordenada por fecha (más reciente primero)
- Click en cualquier fila para ver detalles completos
- Diseño responsivo para móviles y tablets
- Interfaz moderna y amigable

## 🚀 Configuración de Firebase

### Paso 1: Crear un Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Click en "Agregar proyecto"
3. Ingresa un nombre para tu proyecto (ej: "sistema-consejeria")
4. Acepta los términos y click en "Crear proyecto"

### Paso 2: Registrar tu Aplicación Web

1. En el panel de Firebase, click en el ícono web `</>`
2. Registra tu app con un nombre (ej: "App Consejería")
3. **IMPORTANTE**: Copia las credenciales que aparecen. Deberían verse así:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### Paso 3: Configurar Authentication

1. En el menú lateral, ve a **Authentication**
2. Click en "Comenzar"
3. Selecciona **"Correo electrónico/contraseña"**
4. Activa la opción y guarda

### Paso 4: Configurar Firestore Database

1. En el menú lateral, ve a **Firestore Database**
2. Click en "Crear base de datos"
3. Selecciona **"Comenzar en modo de prueba"** (para desarrollo)
4. Elige una ubicación cercana (ej: us-central)
5. Click en "Habilitar"

### Paso 5: Configurar Reglas de Seguridad (Importante)

En la pestaña "Reglas" de Firestore, pega estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /atenciones/{document} {
      // Permitir lectura y escritura solo a usuarios autenticados
      allow read, write: if request.auth != null;
    }
  }
}
```

Click en "Publicar"

### Paso 6: Actualizar el Archivo HTML

Abre `login_register.html` y busca esta sección (línea ~379):

```javascript
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};
```

Reemplaza con tus credenciales del Paso 2.

## 📱 Cómo Usar la Aplicación

### Primera Vez

1. Abre `login_register.html` en tu navegador
2. Click en **"Registrarse"**
3. Ingresa un email y contraseña (mínimo 6 caracteres)
4. Se creará tu cuenta y accederás automáticamente

### Registrar una Atención

1. Completa todos los campos obligatorios (marcados con *)
2. El código del estudiante debe tener 8 dígitos
3. Click en **"Registrar Atención"**
4. Verás un mensaje de confirmación

### Ver Estadísticas

1. Usa los filtros para segmentar por:
   - Semestre
   - Docente
   - Tema
2. Las tarjetas mostrarán los totales actualizados
3. La tabla se filtrará automáticamente

### Ver Detalles de una Atención

1. Click en cualquier fila de la tabla
2. Se mostrará un popup con toda la información

## 🔒 Seguridad

- Solo usuarios autenticados pueden acceder al sistema
- Los datos se guardan de forma segura en Firebase
- Cada registro guarda quién lo creó y cuándo
- Las contraseñas son encriptadas automáticamente

## 📊 Temas de Consejería Disponibles

1. Consejería en asuntos relacionados con el plan de estudios
2. Consejería en asuntos relacionados con el desarrollo profesional
3. Consejería en asuntos relacionados con la inserción laboral
4. Asuntos Académicos del Proceso de Plan de Tesis o Tesis
5. Otros

## 🎨 Características de Diseño

- ✅ Interfaz moderna con gradientes
- ✅ Responsive (se adapta a móviles)
- ✅ Validación de formularios en tiempo real
- ✅ Mensajes de error y éxito claros
- ✅ Tabla ordenada por fecha
- ✅ Estadísticas visuales con tarjetas

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura
- **CSS3**: Estilos modernos con gradientes y animaciones
- **JavaScript (ES6+)**: Lógica de la aplicación
- **Firebase Authentication**: Autenticación de usuarios
- **Firebase Firestore**: Base de datos en tiempo real

## 📝 Validaciones Implementadas

- Email válido
- Contraseña mínimo 6 caracteres
- Código de estudiante: exactamente 8 dígitos
- Todos los campos obligatorios deben completarse
- Fecha y hora válidas

## 🐛 Solución de Problemas

### "Error: Firebase not initialized"
→ Verifica que hayas configurado correctamente las credenciales de Firebase

### "Error: Permission denied"
→ Asegúrate de haber configurado las reglas de Firestore correctamente

### No se muestra nada después de login
→ Abre la consola del navegador (F12) para ver errores

### Los datos no se guardan
→ Verifica tu conexión a internet y que Firestore esté habilitado

## 📞 Notas Importantes

1. **Modo de Prueba**: Las reglas actuales permiten acceso por 30 días. Para producción, configura reglas más estrictas.
2. **Backup**: Firebase hace backups automáticos, pero considera exportar datos periódicamente.
3. **Límites**: El plan gratuito de Firebase tiene límites. Monitorea tu uso.

## 🚀 Mejoras Futuras Sugeridas

- [ ] Exportar datos a Excel/PDF
- [ ] Gráficos con Chart.js
- [ ] Edición y eliminación de registros
- [ ] Búsqueda avanzada
- [ ] Notificaciones por email
- [ ] Panel de administración
- [ ] Roles de usuario (admin, docente)

---

¡Tu sistema está listo para usar! 🎉

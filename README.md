# Sistema de Registro de Atenciones de Consejería y Tutoría

## 📋 Descripción

Sistema web completo para el registro y gestión de atenciones de consejería y tutoría a estudiantes. Desarrollado con **arquitectura MVC (Modelo-Vista-Controlador)** usando HTML, CSS, JavaScript y Firebase (Authentication y Firestore).

## 🏗️ Arquitectura MVC

Este proyecto utiliza el patrón **MVC** para una mejor organización y mantenibilidad:

```
PracticaWeb2/
├── config/              # Configuración de Firebase
├── models/              # Modelos de datos (User, Estudiante, Atencion)
├── controllers/         # Lógica de negocio (Auth, Atencion, Reportes)
├── views/               # Interfaces HTML
├── js/                  # Scripts de interfaz de usuario
└── css/                 # Estilos
```

📖 **Documentación completa de MVC**: [ARQUITECTURA_MVC.md](./ARQUITECTURA_MVC.md)

## 🚀 Inicio Rápido

### Acceso al Sistema
1. **Desde navegador local**: Abrir `index.html` (redirección automática a `/views/`)
2. **URL directa**: Navegar a `views/index.html`

### Páginas del Sistema
- **`views/index.html`** - Página de bienvenida
- **`views/login.html`** - Inicio de sesión
- **`views/register.html`** - Registro de nuevos docentes
- **`views/dashboard.html`** - Panel principal
- **`views/atencion.html`** - Registro de atenciones
- **`views/reportes.html`** - Reportes y estadísticas

## ✨ Características Principales

### 🔐 Autenticación
- **Registro de docentes** con email institucional (@virtual.upt.pe, @upt.pe)
- **Login seguro** con Firebase Authentication
- **Validación de dominios institucionales**
- **Sesión persistente** entre páginas
- **Cierre de sesión** seguro

### 📝 Registro de Atenciones
- **Formulario completo** con validación de campos
- **Información obligatoria:**
  - Semestre académico (default: 2025-II)
  - Fecha y hora de atención (solo fechas actuales o futuras)
  - Docente responsable (automático)
  - Tema de consejería (5 opciones predefinidas)
  - Datos del estudiante (código de 10 dígitos, apellidos, nombres, email, teléfono)
  - Consulta del estudiante
  - Descripción de la atención brindada
- **Campo opcional:** Evidencia (documentos, links, referencias)
- **Validaciones en tiempo real:**
  - No permite fechas pasadas
  - Código de estudiante: 10 dígitos numéricos
  - Email institucional obligatorio para docentes

### 📊 Dashboard Interactivo
- **Estadísticas en tiempo real:**
  - Total de atenciones
  - Estudiantes atendidos
  - Docentes participantes
  - Temas diferentes
- **Filtros avanzados:**
  - Por semestre
  - Por docente
  - Por tema
- **Tabla completa** con todas las atenciones ordenadas por fecha
- **Modal de detalles** al hacer clic en cualquier atención

### 📈 Reportes y Estadísticas Avanzadas
- **Reporte general** con estadísticas globales
- **Reporte por fechas** con rango personalizado y distribución diaria
- **Reporte por ciclo académico** con detalles completos
- **Reporte mensual** con estadísticas y distribución por días
- **Reporte por tipo de cita/tema** con porcentajes
- **Reporte por semestre** con gráficos visuales
- **Reporte por docente** con estadísticas individuales
- **Exportación** de reportes en formato texto
- **Impresión** optimizada para PDF

## 📂 Estructura del Proyecto

```
PracticaWeb2/
├── config/
│   └── firebase-config.js          # Configuración de Firebase
├── models/                          # Modelos de datos
│   ├── User.js
│   ├── Estudiante.js
│   └── Atencion.js
├── controllers/                     # Lógica de negocio
│   ├── AuthController.js
│   ├── AtencionController.js
│   └── ReportesController.js
├── views/                           # Interfaces HTML
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── atencion.html
│   └── reportes.html
├── js/                              # Scripts de interfaz
│   ├── login.js
│   ├── register.js
│   ├── dashboard.js
│   ├── atencion.js
│   └── reportes.js
└── css/
    └── styles.css                   # Estilos generales
```

# 📚 Guía de Uso - Sistema de Atenciones

## 👤 Para Docentes - Primera Vez

### 1. Registro (Solo la Primera Vez)

1. Abre el proyecto (accede a `index.html` en tu navegador)
2. Clic en **"Registrarse"**
3. Completa el formulario:
   - **Email:** tu-email@virtual.upt.pe o tu-email@upt.pe
   - **Contraseña:** (mínimo 6 caracteres)
   - **Confirmar Contraseña:** (misma contraseña)
4. Clic en **"Crear Cuenta"**
5. Serás redirigido automáticamente al dashboard

> **⚠️ IMPORTANTE:** Solo se permite el registro con correos institucionales que terminen en **@virtual.upt.pe** o **@upt.pe**

### 2. Iniciar Sesión (Próximas Visitas)

1. Abre el proyecto (`index.html`)
2. Clic en **"Iniciar Sesión"**
3. Ingresa tu email institucional (@virtual.upt.pe o @upt.pe) y contraseña
4. Clic en **"Ingresar"**

> **⚠️ IMPORTANTE:** Solo se permite el acceso con correos institucionales que terminen en **@virtual.upt.pe** o **@upt.pe**

---

## 📝 Registrar una Atención

### Paso a Paso

1. **Desde el Dashboard:**
   - Clic en el botón verde **"Nueva Atención"**

2. **Información General:**
   - **Semestre:** Por defecto aparece "2025-II" (puedes cambiarlo)
   - **Fecha:** Selecciona la fecha (solo fechas actuales o futuras)
   - **Hora:** Selecciona la hora de la atención (ej: 14:30)
   - **Tema:** Selecciona uno de los 5 temas disponibles

3. **Datos del Estudiante:**
   - **Código:** 10 dígitos numéricos (ej: 2021072630)
   - **Apellidos:** García López
   - **Nombres:** María Elena
   - **Email:** maria.garcia@virtual.upt.pe (opcional)
   - **Teléfono:** 987654321 (opcional)

4. **Descripción:**
   - **Consulta del Estudiante:** 
     ```
     Necesito orientación sobre los cursos electivos que debo 
     llevar el próximo semestre para cumplir con mi plan de estudios.
     Tengo dudas sobre las equivalencias.
     ```
   
   - **Atención Brindada:**
     ```
     Se revisó el plan de estudios del estudiante y se verificó 
     que ha cumplido con los prerrequisitos. Se le proporcionó 
     información detallada sobre los cursos electivos disponibles 
     y se le recomendó inscribirse en "Desarrollo Web Avanzado" 
     y "Inteligencia Artificial Aplicada". Se le entregó una copia 
     del plan de estudios actualizado.
     ```

   - **Evidencia (Opcional):**
     ```
     Documento entregado: Plan_Estudios_2025_I.pdf
     Link útil: https://universidad.edu.pe/planes-estudio
     ```

5. **Registrar:**
   - Clic en **"Registrar Atención"**
   - Espera la confirmación
   - Serás redirigido al dashboard

---

## 🔍 Buscar y Filtrar Atenciones

### Usar Filtros

1. **Filtrar por Semestre:**
   - En el dashboard, selecciona "2025-I" en el filtro de semestre
   - Solo verás atenciones de ese semestre

2. **Filtrar por Docente:**
   - Selecciona un docente específico
   - Solo verás sus atenciones

3. **Filtrar por Tema:**
   - Selecciona un tema (ej: "Plan de Estudios")
   - Solo verás atenciones de ese tema

4. **Combinar Filtros:**
   - Puedes usar varios filtros a la vez
   - Ejemplo: Semestre "2025-I" + Tema "Plan de Tesis"

5. **Limpiar Filtros:**
   - Clic en **"Limpiar Filtros"**
   - Vuelve a mostrar todas las atenciones

### Ver Detalles de una Atención

1. En la tabla del dashboard, haz clic en cualquier fila
2. Se abrirá un modal con toda la información:
   - Datos generales
   - Datos del estudiante
   - Consulta completa
   - Descripción de la atención
   - Evidencia (si existe)
   - Info de registro
3. Clic en la X o fuera del modal para cerrar

---

## 📊 Generar Reportes

### Acceder a Reportes

1. Desde el dashboard, clic en **"Ver Reportes"**
2. Verás 4 secciones principales:

### Resumen General
- Total de atenciones
- Semestres registrados
- Docentes activos
- Estudiantes únicos

### Atenciones por Semestre
- Tabla con cantidad de atenciones
- Porcentaje de cada semestre
- Barra de progreso visual

### Atenciones por Docente
- Ranking de docentes
- Cantidad de atenciones de cada uno
- Porcentaje del total

### Atenciones por Tema
- Distribución de temas
- Gráfico de barras horizontal
- Porcentajes

### Exportar Reporte

1. Clic en **"Exportar Reporte"**
2. Se descargará un archivo `.txt` con:
   - Resumen general
   - Datos por semestre
   - Datos por docente
   - Datos por tema
3. Nombre del archivo: `reporte_atenciones_2025-01-20.txt`

### Imprimir Reporte

1. Clic en **"Imprimir"**
2. Se abrirá el diálogo de impresión
3. Puedes:
   - Imprimir en papel
   - Guardar como PDF
   - Enviar por email

---

## 📋 Ejemplos de Temas de Consejería

### 1. Plan de Estudios
**Consultas típicas:**
- "¿Qué cursos debo llevar este semestre?"
- "¿Cuáles son los prerrequisitos de X curso?"
- "¿Puedo adelantar cursos del siguiente ciclo?"

### 2. Desarrollo Profesional
**Consultas típicas:**
- "¿Qué habilidades debo desarrollar para mi carrera?"
- "¿Cómo puedo mejorar mi perfil profesional?"
- "¿Qué certificaciones son recomendables?"

### 3. Inserción Laboral
**Consultas típicas:**
- "¿Cómo elaboro un buen CV?"
- "¿Dónde puedo buscar prácticas preprofesionales?"
- "¿Qué empresas contratan recién egresados?"

### 4. Plan de Tesis
**Consultas típicas:**
- "¿Cómo inicio mi proyecto de tesis?"
- "¿Quién puede ser mi asesor?"
- "¿Cuáles son los requisitos para sustentar?"

### 5. Otros
**Ejemplos:**
- Trámites administrativos
- Problemas académicos
- Consultas sobre movilidad estudiantil
- Preguntas sobre becas

---

## 💡 Consejos y Buenas Prácticas

### Al Registrar Atenciones

✅ **SÍ hacer:**
- Registrar la atención el mismo día que se realiza
- Ser específico en la descripción
- Incluir acciones concretas realizadas
- Mencionar documentos entregados en "Evidencia"
- Verificar que el código del estudiante sea correcto

❌ **NO hacer:**
- Dejar descripciones vagas o genéricas
- Olvidar registrar atenciones importantes
- Copiar y pegar la misma descripción siempre
- Dejar el campo de consulta muy corto

### Ejemplos de Buenas Descripciones

#### ❌ Mal ejemplo:
```
Consulta: El estudiante preguntó sobre tesis
Atención: Se le explicó
```

#### ✅ Buen ejemplo:
```
Consulta: El estudiante necesita orientación sobre la estructura 
del proyecto de tesis, específicamente sobre la metodología a 
utilizar en su investigación sobre inteligencia artificial.

Atención: Se revisó su propuesta inicial y se le recomendó usar 
una metodología de investigación aplicada. Se le proporcionó el 
formato oficial de la universidad y ejemplos de tesis anteriores. 
Se acordó una próxima reunión en 2 semanas para revisar su avance. 
Se le compartió bibliografía especializada.
```

### Manejo de Evidencias

**Ejemplos de evidencias útiles:**
- Links a documentos compartidos
- Nombres de archivos entregados
- Referencias bibliográficas recomendadas
- Links a formularios o recursos online
- Contactos compartidos

```
Evidencias:
- Documento entregado: Formato_Tesis_2025.docx
- Link compartido: https://drive.google.com/...
- Bibliografía: García (2023) - Metodologías de Investigación
- Próxima cita: 03/02/2025 a las 15:00
```

---

## 📱 Uso en Dispositivos Móviles

El sistema es completamente responsive:

- ✅ Puedes registrar desde tu celular
- ✅ La tabla se adapta a pantallas pequeñas
- ✅ Los formularios son fáciles de completar en móvil
- ✅ Los reportes se ven bien en tablets

---

## 🔐 Seguridad y Privacidad

### Tu sesión es segura:
- Solo tú puedes ver y registrar tus atenciones
- Otros docentes no pueden editar tus registros
- Las contraseñas están encriptadas
- La sesión se cierra automáticamente si cierras el navegador

### Cerrar Sesión:
1. Clic en **"Cerrar Sesión"** (arriba a la derecha)
2. Confirma que deseas cerrar sesión
3. Serás redirigido al login

---

## ❓ Preguntas Frecuentes

### ¿Qué correos electrónicos puedo usar para registrarme?
Solo se permiten correos institucionales de la Universidad Privada de Tacna:
- ✅ Correos terminados en **@virtual.upt.pe** (Ejemplo: docente@virtual.upt.pe)
- ✅ Correos terminados en **@upt.pe** (Ejemplo: docente@upt.pe)
- ❌ No se aceptan correos de Gmail, Hotmail, Yahoo u otros proveedores

### ¿Puedo editar una atención ya registrada?
No, por el momento no se pueden editar atenciones. Asegúrate de revisar bien antes de guardar.

### ¿Puedo eliminar una atención?
No, para mantener el historial completo, las atenciones no se pueden eliminar.

### ¿Cuántas atenciones puedo registrar?
No hay límite. Puedes registrar todas las atenciones que necesites.

### ¿Los datos se guardan automáticamente?
No, debes hacer clic en "Registrar Atención" para guardar los datos.

### ¿Puedo acceder desde cualquier computadora?
Sí, solo necesitas tu email institucional (@virtual.upt.pe o @upt.pe) y contraseña.

### ¿Qué pasa si olvido mi contraseña?
Por ahora debes crear una nueva cuenta. En el futuro se agregará recuperación de contraseña.

### ¿Puedo ver las atenciones de otros docentes?
Sí, en el dashboard puedes ver todas las atenciones (con fines de coordinación y estadísticas).

---

## 📞 Soporte Técnico

Si tienes problemas:

1. **Error: "Solo se permite el acceso con correos institucionales"**
   - Verifica que tu correo termine en @virtual.upt.pe o @upt.pe
   - No uses correos personales (Gmail, Hotmail, etc.)

2. **Revisa la consola del navegador:**
   - Presiona F12
   - Ve a la pestaña "Console"
   - Busca mensajes de error en rojo

3. **Verifica tu conexión a internet**

4. **Intenta cerrar sesión y volver a ingresar**

5. **Limpia la caché del navegador:**
   - Ctrl + Shift + Delete
   - Marca "Caché" e "Imágenes"
   - Acepta

---

**¡Listo! Ya puedes usar el sistema completo** 🎉

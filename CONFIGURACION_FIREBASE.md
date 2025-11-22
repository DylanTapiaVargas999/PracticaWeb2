# 🔥 Configuración Rápida de Firebase

## Paso 1: Crear Proyecto Firebase (2 minutos)

1. Ve a https://console.firebase.google.com/
2. Clic en **"Agregar proyecto"**
3. Nombre del proyecto: `sistema-consejeria-web`
4. Acepta términos → **"Crear proyecto"**
5. Espera a que se complete → **"Continuar"**

## Paso 2: Registrar App Web (1 minuto)

1. En el panel principal, clic en el ícono **`</>`** (Web)
2. Alias de la app: `Sistema Consejería`
3. NO marcar Firebase Hosting
4. Clic en **"Registrar app"**

## Paso 3: Copiar Configuración (1 minuto)

Verás algo así:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

**IMPORTANTE:** Copia estos valores y pégalos en `js/firebase-config.js`

## Paso 4: Habilitar Authentication (1 minuto)

1. En el menú lateral, clic en **"Authentication"**
2. Clic en **"Comenzar"**
3. Selecciona **"Correo electrónico/contraseña"**
4. Activa el primer switch (Email/Password)
5. **"Guardar"**

## Paso 5: Crear Firestore Database (2 minutos)

1. En el menú lateral, clic en **"Firestore Database"**
2. Clic en **"Crear base de datos"**
3. Selecciona **"Comenzar en modo de prueba"**
4. Ubicación: `us-central` (o el más cercano a ti)
5. **"Habilitar"**

## Paso 6: Configurar Reglas de Seguridad (1 minuto)

1. En Firestore, ve a la pestaña **"Reglas"**
2. Borra todo y pega esto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Docentes
    match /docentes/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Atenciones
    match /atenciones/{atencionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                              resource.data.registradoPor == request.auth.uid;
    }
  }
}
```

3. Clic en **"Publicar"**

## ✅ ¡Listo! Tu Firebase está Configurado

### Ahora puedes:
1. Abrir `index.html` en tu navegador
2. Registrarte como docente
3. Empezar a registrar atenciones

---

## 🔍 Verificar que Todo Funciona

### Test 1: Registro de Usuario
1. Abre `index.html`
2. Clic en "Registrarse"
3. Completa el formulario
4. Si te lleva al dashboard → ✅ Funciona

### Test 2: Ver Usuario en Firebase
1. Ve a Firebase Console → Authentication
2. Deberías ver tu email registrado → ✅ Funciona

### Test 3: Registrar Atención
1. En el dashboard, clic en "Nueva Atención"
2. Completa el formulario
3. Si aparece "Registro exitoso" → ✅ Funciona

### Test 4: Ver Datos en Firestore
1. Ve a Firebase Console → Firestore Database
2. Deberías ver colecciones `docentes` y `atenciones` → ✅ Funciona

---

## ⚠️ Problemas Comunes

### Error: "permission-denied"
→ Revisa las reglas de Firestore (Paso 6)

### No aparece nada en el dashboard
→ Abre la consola del navegador (F12) y busca errores

### Error: "auth/operation-not-allowed"
→ Verifica que habilitaste Email/Password en Authentication

---

## 📊 Monitorear el Uso

Firebase tiene cuotas gratuitas:
- **Authentication:** 50,000 usuarios gratis
- **Firestore:** 
  - 1 GB de almacenamiento gratis
  - 50,000 lecturas/día
  - 20,000 escrituras/día

Para ver tu uso:
1. Firebase Console → ⚙️ Configuración del proyecto
2. Pestaña "Uso"

---

## 🚀 Despliegue (Opcional)

Para publicar tu app en internet:

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Iniciar sesión
firebase login

# Inicializar proyecto
firebase init hosting

# Desplegar
firebase deploy
```

Tu app estará en: `https://tu-proyecto.web.app`

---

**Tiempo total de configuración: ~8 minutos**

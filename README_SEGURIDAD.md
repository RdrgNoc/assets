# 🔐 SEGURIDAD - GUÍA DE IMPLEMENTACIÓN CONTRA INYECCIÓN SQL Y XSS

## 📌 Resumen Rápido

Se han creado **3 archivos principales** para proteger tu aplicación:

| Archivo | Propósito | Ubicación |
|---------|-----------|-----------|
| **securityHelper.js** | Funciones de validación, codificación y seguridad | `/Content/assets/js/securityHelper.js` |
| **GUIA_SEGURIDAD.html** | Guía visual y ejemplos completos | `/Content/assets/GUIA_SEGURIDAD.html` |
| **IMPLEMENTACION_SEGURIDAD.js** | Patrones, templates y ejemplos de código | `/Content/assets/js/IMPLEMENTACION_SEGURIDAD.js` |

---

## 🚀 PASOS DE IMPLEMENTACIÓN (Orden Correcto)

### PASO 1: Incluir securityHelper.js en tu HTML Master

```html
<!-- En el <head>, ANTES de otros scripts -->
<script src="/Content/assets/js/securityHelper.js"></script>
<script src="/Content/assets/js/apiHelper.js"></script>
<script src="/Content/assets/js/modifiers/controllers/automata-slayer.js"></script>
```

**⚠️ IMPORTANTE:** securityHelper.js debe cargarse **primero**.

---

### PASO 2: Configurar CSP en el Servidor (C# / ASP.NET)

En **Global.asax**, método `Application_BeginRequest`:

```csharp
protected void Application_BeginRequest()
{
    string csp = "default-src 'self'; " +
                 "script-src 'self' 'unsafe-inline' 'unsafe-eval' cdnjs.cloudflare.com code.jquery.com; " +
                 "style-src 'self' 'unsafe-inline' cdnjs.cloudflare.com fonts.googleapis.com; " +
                 "img-src 'self' data: https:; " +
                 "font-src 'self' fonts.gstatic.com; " +
                 "connect-src 'self' https:; " +
                 "frame-ancestors 'none'; " +
                 "base-uri 'self'; " +
                 "form-action 'self';";
    
    Response.Headers.Add("Content-Security-Policy", csp);
}
```

**Alternativa (meta tag en HTML):**
```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self'; 
    script-src 'self' 'unsafe-inline' cdnjs.cloudflare.com">
```

---

### PASO 3: Actualizar Funciones para Validar Datos

**ANTES (Vulnerable):**
```javascript
function guardarDatos() {
    var nombre = $("#txtNombre").val();
    var ano = $("#txtAno").val();
    
    // ❌ PELIGRO: Sin validación
    fetchDataArr(5, { nombre: nombre, ano: ano }, 9, function(response) { ... });
}
```

**DESPUÉS (Seguro):**
```javascript
function guardarDatos() {
    // 1. Definir reglas de validación
    const rules = {
        nombre: { type: 'string', required: true, minLength: 5, maxLength: 100 },
        ano: { type: 'number', required: true, min: 2000, max: 2100 }
    };

    // 2. Obtener datos y validar
    const formData = {
        nombre: $("#txtNombre").val(),
        ano: $("#txtAno").val()
    };
    
    const validation = validateAndPrepareData(formData, rules);
    
    // 3. Si hay errores, mostrar y salir
    if (!validation.valid) {
        showMsg(validation.errors.join('\n'), 'error');
        return;
    }

    // 4. Preparar datos con seguridad
    const secureData = prepareSecureData(validation.data, AUTOMATA_SLAYER_VERSION);
    
    // 5. Enviar al servidor
    fetchDataArr(5, secureData, 9, function(response) { ... });
}
```

---

### PASO 4: Codificar Datos al Mostrar en HTML

**ANTES (Vulnerable a XSS):**
```javascript
fetchDataArr(1, {}, 9, function(response) {
    response.forEach(item => {
        // ❌ Si item.descripcion contiene <script>, se ejecutará
        $("#tabla").append(`<tr><td>${item.descripcion}</td></tr>`);
    });
});
```

**DESPUÉS (Seguro):**
```javascript
fetchDataArr(1, {}, 9, function(response) {
    response.forEach(item => {
        // ✅ Codificar evita que se ejecute cualquier script
        const descripcionSegura = encodeHTML(item.descripcion);
        $("#tabla").append(`<tr><td>${descripcionSegura}</td></tr>`);
    });
});
```

---

## 📚 Funciones Principales de securityHelper.js

### Validación de Entradas

```javascript
// Validar número dentro de rango
isValidNumber(2025, 2000, 2100)  // true

// Validar email
isValidEmail("usuario@example.com")  // true

// Validar fecha (YYYY-MM-DD)
isValidDate("2025-02-18")  // true

// Validar alfanuméricos
isAlphanumeric("ABC-123")  // true

// Validar y limpiar múltiples campos
const validation = validateAndPrepareData(
    { campo1: valor1, campo2: valor2 },
    { campo1: { type: 'string', required: true }, campo2: { type: 'number' } }
);
```

### Codificación de Salida

```javascript
// Para mostrar en HTML
encodeHTML("<script>alert('XSS')</script>")
// → "&lt;script&gt;alert('XSS')&lt;/script&gt;"

// Para atributos HTML
encodeAttribute('data"value')
// → 'data&quot;value'

// Para URLs
encodeURL("user@domain.com")
// → "user%40domain.com"
```

### Preparación Segura de Datos

```javascript
const secureData = prepareSecureData(
    { campo1: valor1 },
    AUTOMATA_SLAYER_VERSION
);
// Resultado incluye:
// - Datos limpios
// - Versión del archivo
// - Timestamp
// - Checksum para verificar integridad
```

---

## 🧪 Pruebas de Seguridad

### Prueba 1: Inyección XSS
```
En un campo de texto, escribe: <script>alert('XSS')</script>
Resultado esperado: Se muestra el texto, NO se ejecuta el script
```

### Prueba 2: Inyección SQL
```
En un campo de año, escribe: 2020'; DROP TABLE users --
Resultado esperado: Mensaje de error de validación
(El servidor nunca recibe esta entrada sin validar)
```

### Prueba 3: Manipulación de Datos
```
Abre la consola del navegador (F12)
En un botón editior, cambia: data-id="123" -> data-id="999"
Resultado esperado: El servidor valida que tienes permiso para editar ese ID
(El servidor nunca debe confiar solo en datos del cliente)
```

---

## ✅ CHECKLIST ANTES DE DEPLOYAR A PRODUCCIÓN

```
☐ securityHelper.js está incluido en el archivo master/layout
☐ Todos los formularios usan validateAndPrepareData()
☐ Todos los datos mostrados en HTML usan encodeHTML()
☐ Los datos en atributos HTML usan encodeAttribute()
☐ CSP está configurado en los headers HTTP (Global.asax)
☐ Monitoreo de CSP está activo (monitorCSPViolations())
☐ El SERVIDOR valida TODOS los datos recibidos
☐ El SERVIDOR rechaza versiones desconocidas del archivo JS
☐ Se han probado ataques XSS comunes
☐ Se han probado inyecciones SQL
☐ Los logs de error NO exponen información sensible
☐ Se usan HTTPS en producción (NO HTTP)
☐ Las sesiones tienen tokens CSRF implementados
☐ Los usuarios solo ven datos que pueden ver
☐ Se realiza auditoría de cambios en base de datos
```

---

## 📂 Archivos Creados

### 1. **securityHelper.js**
Ubicación: `/Content/assets/js/securityHelper.js`

Contiene:
- `sanitizeInput()` - Limpia cadenas de caracteres peligrosos
- `isValidNumber()` - Valida números con rango
- `isValidEmail()` - Valida emails
- `isValidDate()` - Valida fechas ISO
- `isAlphanumeric()` - Valida alfanuméricos
- `encodeHTML()` - Codifica para HTML
- `encodeAttribute()` - Codifica para atributos
- `encodeURL()` - Codifica URLs
- `validateAndPrepareData()` - Valida múltiples campos
- `prepareSecureData()` - Prepara datos con seguridad completa
- `monitorCSPViolations()` - Escucha violaciones de CSP

### 2. **GUIA_SEGURIDAD.html**
Ubicación: `/Content/assets/GUIA_SEGURIDAD.html`

Abre en navegador para ver:
- Guía completa visual
- Ejemplos de código
- Explicación de cada función
- Tabla de funciones

### 3. **IMPLEMENTACION_SEGURIDAD.js**
Ubicación: `/Content/assets/js/IMPLEMENTACION_SEGURIDAD.js`

Contiene:
- Patrones de validación predefinidos
- Templates para funciones seguras
- Ejemplos específicos para tu aplicación
- Checklist completo

---

## 🎯 Patrones de Validación Predefinidos

En `IMPLEMENTACION_SEGURIDAD.js` encontrarás:

```javascript
VALIDATION_PATTERNS = {
    EFISCAL: /^\d{4}$/,                          // Año fiscal
    CODIGO_DOS_CHARS: /^[A-Z0-9]{2}$/,          // OS, UP
    NUMERO_CONTROL: /^[A-Z0-9\-]+$/,            // Números de control
    DESCRIPCION: /^[a-zA-Z0-9\s\.\,\-\(\)áéíóúñ]+$/, // Descripciones
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,        // Emails
    FECHA_ISO: /^\d{4}-\d{2}-\d{2}$/,           // Fechas
    TELEFONO: /^[\d\s\-\(\)\+]{10,}$/           // Teléfonos
}
```

Úsalos en tus validaciones:
```javascript
const rules = {
    _eFiscal: { type: 'string', pattern: VALIDATION_PATTERNS.EFISCAL }
};
```

---

## 🔒 ¿Cómo Funciona la Protección?

### 1. **Validación (Client-side)**
- Limpia entradas de usuario
- Verifica tipos de datos
- Rechaza formatos inválidos
- Evita peticiones malformadas

### 2. **Codificación (Output)**
- Convierte caracteres especiales
- Previene que browsers interpreten código
- Muestra datos de forma segura

### 3. **CSP (Content Security Policy)**
- Define qué scripts pueden ejecutarse
- Bloquea scripts inline no autorizados
- Previene carga de recursos externos maliciosos

### 4. **Validación Server-side** ⚠️ CRÍTICA
- El servidor VE VALIDA y RECHAZA datos inválidos
- El servidor no confía en datos del cliente
- El servidor verifica permisos del usuario
- El servidor registra intentos de ataque

---

## ⚠️ RECORDAR SIEMPRE

### El cliente (JavaScript) NO es suficiente
La validación aquí es para:
- Mejorar experiencia del usuario
- Reducir carga del servidor
- Detección temprana de errores

**✅ El servidor DEBE validar SIEMPRE:**
- Afirmar datos
- Tipo y formato
- Permisos del usuario
- Integridad de datos

### Nunca confíes en datos del cliente
Un usuario malintencionado puede:
- Deshabilitar JavaScript
- Modificar valores HTML
- Enviar peticiones HTTP directas
- Cambiar cookies/tokens

---

## 📞 Soporte

Si necesitas ayuda:
1. Abre `GUIA_SEGURIDAD.html` en un navegador
2. Revisa `IMPLEMENTACION_SEGURIDAD.js` para ejemplos
3. Consulta la documentación de `securityHelper.js`

---

## 📝 Notas Finales

Esta implementación protege contra:
- ✅ Inyección SQL
- ✅ XSS (Cross-Site Scripting)
- ✅ Algunos ataques CSRF
- ✅ Carga de scripts no autorizados

No protege contra:
- ❌ CSRF sin tokens en el servidor
- ❌ Ataques de fuerza bruta
- ❌ Phishing
- ❌ Vulnerabilidades del servidor

**Recuerda: La seguridad es un proceso continuo, no una solución única.**

---

**Versión:** 1.0.0  
**Fecha:** 18/02/2025  
**Autor:** Security Implementation Guide

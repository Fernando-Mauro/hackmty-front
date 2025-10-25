# Sistema de Autenticación con Rutas Protegidas

## Configuración

1. **Copia el archivo de variables de entorno:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Configura tu URL de API:**
   Edita `.env.local` y actualiza la URL de tu backend:
   ```
   NEXT_PUBLIC_API_URL=http://tu-api.com
   ```

## Estructura de Autenticación

### Rutas

- **`/`** - Página de login (raíz)
- **`/app`** - Ruta protegida (dashboard)

### Flujo de Autenticación

1. **Login (`/`)**:
   - El usuario ingresa sus credenciales
   - Se hace una petición POST a `/api/login`
   - Si el login es exitoso, se guarda el token en una cookie (`authToken`)
   - Automáticamente se redirige a `/app`

2. **Middleware (Verificación automática)**:
   - En cada petición, el middleware verifica:
     - Si estás en `/` y tienes token válido → redirige a `/app`
     - Si estás en `/app` sin token → redirige a `/`
     - Si estás en `/app` con token inválido → elimina cookie y redirige a `/`

3. **Ruta Protegida (`/app`)**:
   - Solo accesible con token válido
   - Muestra el dashboard
   - Tiene botón de logout que elimina el token y redirige a `/`

### Endpoints Requeridos en el Backend

Tu API debe implementar estos endpoints:

1. **POST `/api/login`**
   - Body: `{ email, password }`
   - Respuesta exitosa: `{ token: "..." }` o token en header `Authorization`

2. **GET `/api/verify-token`**
   - Header: `Authorization: Bearer {token}`
   - Respuesta: 200 si el token es válido, 401 si no lo es

### Flujo del Middleware

```
Usuario intenta acceder a una ruta
       ↓
¿Tiene cookie authToken?
       ↓
   SI        NO
   ↓          ↓
Verifica    ¿Está en /app?
con API         ↓
   ↓         SI → Redirige a /
¿Válido?    NO → Permite acceso
   ↓
SI     NO
↓      ↓
Permite Elimina cookie
acceso  y redirige a /
```

## Seguridad

- Los tokens se guardan en cookies HTTP con `Secure` y `SameSite`
- El middleware verifica el token en cada petición a rutas protegidas
- Los tokens inválidos se eliminan automáticamente

## Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

## Personalización

Para proteger más rutas, edita el middleware en `src/middleware.ts`:

```typescript
export const config = {
  matcher: [
    '/',
    '/app/:path*',
    '/otra-ruta-protegida/:path*',  // Agregar aquí
  ],
}
```

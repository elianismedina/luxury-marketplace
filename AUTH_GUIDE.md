# Guía de Autenticación - Supabase Auth

Esta aplicación implementa autenticación completa con **Supabase Auth** usando React Context y componentes de UI accesibles.

## 🔐 Características Implementadas

- ✅ Registro de usuarios con email/contraseña
- ✅ Inicio de sesión
- ✅ Cierre de sesión
- ✅ Persistencia de sesión
- ✅ Protección de datos por usuario
- ✅ UI moderna con validación de formularios (Zod + React Hook Form)
- ✅ Manejo de errores y notificaciones

## 📁 Arquitectura

### 1. Context de Autenticación (`src/contexts/AuthContext.tsx`)

Proporciona estado y métodos de autenticación a toda la aplicación:

```tsx
const { user, session, loading, signIn, signUp, signOut } = useAuth();
```

**Propiedades:**
- `user`: Usuario autenticado actual (o `null`)
- `session`: Sesión de Supabase actual
- `loading`: Estado de carga de la autenticación
- `signIn(email, password)`: Iniciar sesión
- `signUp(email, password, fullName)`: Registrarse
- `signOut()`: Cerrar sesión

### 2. Componente de Autenticación (`src/components/AuthDialog.tsx`)

Dialog con tabs para Login y Registro:

- **Login**: Email y contraseña
- **Registro**: Nombre completo, email, contraseña y confirmación
- Validación con Zod
- Mensajes de error contextuales
- Creación automática de perfil en tabla `profiles`

### 3. Integración en App.tsx

```tsx
// Verificar autenticación antes de operaciones
if (!user) {
  toast.error("Debes iniciar sesión");
  setShowAuthDialog(true);
  return;
}

// Incluir user_id en operaciones
await supabase
  .from("vehicles")
  .insert([{ ...vehicle, user_id: user.id }]);
```

## 🎯 Uso

### Registrar un Usuario

```tsx
await signUp("user@example.com", "password123", "Juan Pérez");
```

### Iniciar Sesión

```tsx
await signIn("user@example.com", "password123");
```

### Cerrar Sesión

```tsx
await signOut();
```

### Verificar Usuario Actual

```tsx
const { user } = useAuth();

if (user) {
  console.log("Usuario:", user.email);
} else {
  console.log("No autenticado");
}
```

## 🗄️ Base de Datos

### Tabla `profiles`

Almacena información adicional del usuario:

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Políticas RLS:**
- Solo el usuario puede ver su propio perfil
- Solo el usuario puede actualizar su propio perfil

### Tabla `vehicles`

Relacionada con el usuario autenticado:

```sql
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  mileage INTEGER NOT NULL,
  vin TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Políticas RLS:**
- Usuario solo ve sus propios vehículos
- Usuario solo puede insertar con su `user_id`
- Usuario solo puede actualizar/eliminar sus vehículos

## 🔒 Row Level Security (RLS)

Todas las tablas tienen RLS habilitado. Las políticas verifican `auth.uid()`:

```sql
-- Ejemplo de política
CREATE POLICY "Users can view own vehicles" 
  ON public.vehicles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vehicles" 
  ON public.vehicles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
```

## 🎨 UI/UX

### Header con Estado de Autenticación

```tsx
{user ? (
  <div>
    <User /> {user.email?.split("@")[0]}
    <Button onClick={signOut}>
      <LogOut /> Salir
    </Button>
  </div>
) : (
  <Button onClick={() => setShowAuthDialog(true)}>
    <LogIn /> Iniciar Sesión
  </Button>
)}
```

### Protección de Acciones

Las acciones que requieren autenticación muestran el dialog:

```tsx
const handleAddVehicle = async (vehicle) => {
  if (!user) {
    toast.error("Debes iniciar sesión");
    setShowAuthDialog(true);
    return;
  }
  // ... proceder con la operación
};
```

## 🔄 Flujo de Autenticación

1. **Usuario no autenticado**:
   - Ve botón "Iniciar Sesión" en header
   - Intenta agregar vehículo → Dialog de autenticación

2. **Usuario hace clic en "Iniciar Sesión"**:
   - Se abre AuthDialog
   - Puede elegir Login o Registro

3. **Registro exitoso**:
   - Crea usuario en `auth.users`
   - Crea perfil en `profiles`
   - Muestra mensaje de verificación de email
   - Usuario debe confirmar email antes de iniciar sesión

4. **Login exitoso**:
   - Sesión persistida automáticamente
   - Header muestra email y botón "Salir"
   - Carga vehículos del usuario

5. **Sesión persistente**:
   - Al recargar página, sesión se restaura automáticamente
   - Usuario permanece autenticado

6. **Cerrar sesión**:
   - Limpia sesión local
   - Limpia estado de vehículos
   - Vuelve a UI de no autenticado

## 📧 Confirmación de Email

Por defecto, Supabase requiere confirmación de email. Para desarrollo:

**Opción 1: Desactivar confirmación (Solo desarrollo)**
1. Ve a Supabase Dashboard → Authentication → Settings
2. Desactiva "Enable email confirmations"

**Opción 2: Usar Magic Link**
Implementar autenticación sin contraseña con link mágico.

## 🛡️ Seguridad

### Mejores Prácticas Implementadas

1. ✅ **Nunca exponer credenciales**: Las keys de Supabase están en variables de entorno
2. ✅ **RLS habilitado**: Todas las tablas tienen políticas de seguridad
3. ✅ **Validación del lado del cliente**: Zod valida antes de enviar
4. ✅ **Validación del lado del servidor**: Supabase valida con RLS
5. ✅ **Sanitización de inputs**: React y Zod previenen XSS
6. ✅ **Sesiones seguras**: Manejadas por Supabase Auth

### Recomendaciones Adicionales

- 🔐 Implementar 2FA (Two-Factor Authentication)
- 🔐 Agregar recuperación de contraseña
- 🔐 Implementar rate limiting
- 🔐 Agregar CAPTCHA en registro
- 🔐 Logging de intentos fallidos de login

## 🚀 Próximas Mejoras

- [ ] Recuperación de contraseña (password reset)
- [ ] Cambio de contraseña
- [ ] Actualización de perfil
- [ ] Avatar de usuario
- [ ] Autenticación con proveedores OAuth (Google, GitHub)
- [ ] 2FA con TOTP
- [ ] Registro de actividad del usuario
- [ ] Sesiones múltiples

## 📚 Referencias

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [React Context API](https://react.dev/reference/react/useContext)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Nota**: Asegúrate de tener las variables de entorno configuradas en Vercel:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`


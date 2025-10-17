# Guía de Formularios - React Hook Form + Zod + shadcn/ui

Esta aplicación utiliza **React Hook Form** con **Zod** para validación y los componentes de **shadcn/ui** para crear formularios type-safe, accesibles y con validación del lado del cliente.

## 📚 Tecnologías

- **React Hook Form**: Manejo del estado del formulario y envío
- **Zod**: Schema de validación type-safe
- **@hookform/resolvers**: Integración de Zod con React Hook Form
- **shadcn/ui Form Components**: Componentes UI accesibles

## 🎯 Ejemplo: Formulario de Vehículo

El formulario `AddVehicleDialog` es un ejemplo completo de implementación. Aquí está la estructura:

### 1. Definir el Schema de Validación con Zod

```tsx
import { z } from "zod";

const vehicleFormSchema = z.object({
  make: z
    .string()
    .min(2, { message: "La marca debe tener al menos 2 caracteres" })
    .max(50, { message: "La marca no puede exceder 50 caracteres" }),
  model: z
    .string()
    .min(2, { message: "El modelo debe tener al menos 2 caracteres" })
    .max(50, { message: "El modelo no puede exceder 50 caracteres" }),
  year: z
    .number()
    .min(1900, { message: "El año debe ser 1900 o posterior" })
    .max(new Date().getFullYear() + 1, {
      message: `El año no puede ser mayor a ${new Date().getFullYear() + 1}`,
    }),
  mileage: z
    .number()
    .min(0, { message: "El kilometraje debe ser un número positivo" })
    .max(9999999, { message: "El kilometraje es demasiado alto" }),
  vin: z
    .string()
    .length(17, { message: "El VIN debe tener exactamente 17 caracteres" })
    .optional()
    .or(z.literal("")),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;
```

### 2. Inicializar el Formulario con useForm

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const form = useForm<VehicleFormValues>({
  resolver: zodResolver(vehicleFormSchema),
  defaultValues: {
    make: "",
    model: "",
    year: new Date().getFullYear(),
    mileage: 0,
    vin: "",
  },
});
```

### 3. Construir el Formulario con shadcn/ui Components

```tsx
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <FormField
      control={form.control}
      name="make"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Marca</FormLabel>
          <FormControl>
            <Input placeholder="ej., Toyota, Ford, Honda" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    
    {/* Más campos... */}
    
    <Button type="submit">Enviar</Button>
  </form>
</Form>
```

### 4. Handler del Submit

```tsx
function onSubmit(values: VehicleFormValues) {
  // Los valores están validados y son type-safe
  console.log(values);
  // Hacer algo con los datos
}
```

## 🔢 Campos Numéricos

Para campos numéricos, necesitas convertir el valor del input:

```tsx
<FormField
  control={form.control}
  name="year"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Año</FormLabel>
      <FormControl>
        <Input
          type="number"
          {...field}
          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## ✅ Validación de Zod Común

### Strings
```tsx
z.string()
  .min(2, { message: "Mínimo 2 caracteres" })
  .max(50, { message: "Máximo 50 caracteres" })
  .email({ message: "Email inválido" })
  .regex(/^\d+$/, { message: "Solo números" })
```

### Números
```tsx
z.number()
  .min(0, { message: "Debe ser positivo" })
  .max(100, { message: "Máximo 100" })
  .int({ message: "Debe ser entero" })
  .positive({ message: "Debe ser positivo" })
```

### Opcionales
```tsx
z.string().optional()
z.string().nullable()
z.string().optional().or(z.literal(""))
```

### Enums
```tsx
z.enum(["opcion1", "opcion2", "opcion3"])
```

### Fechas
```tsx
z.date()
  .min(new Date("2000-01-01"), { message: "Fecha muy antigua" })
  .max(new Date(), { message: "Fecha no puede ser futura" })
```

## 🎨 Componentes Disponibles

Los siguientes componentes de shadcn/ui están disponibles para formularios:

- `<Form>` - Wrapper del formulario
- `<FormField>` - Campo controlado
- `<FormItem>` - Contenedor del campo
- `<FormLabel>` - Label del campo
- `<FormControl>` - Wrapper del input
- `<FormDescription>` - Descripción del campo
- `<FormMessage>` - Mensaje de error

## 📝 Mejores Prácticas

1. **Siempre define un schema de Zod** para validación type-safe
2. **Usa `z.infer<typeof schema>`** para tipos TypeScript automáticos
3. **Proporciona mensajes de error claros** en español
4. **Usa `FormMessage`** para mostrar errores de validación
5. **Resetea el formulario** después del submit exitoso con `form.reset()`
6. **Para edición**, usa `form.reset(data)` para poblar valores
7. **Valida en el cliente** antes de enviar al servidor

## 🔄 Resetear Formulario

```tsx
// Resetear a valores por defecto
form.reset();

// Resetear con nuevos valores
form.reset({
  make: "Toyota",
  model: "Camry",
  year: 2020,
  mileage: 50000,
});
```

## 🎯 Estado del Formulario

```tsx
// Verificar si el formulario es válido
const isValid = form.formState.isValid;

// Verificar si hay errores
const hasErrors = Object.keys(form.formState.errors).length > 0;

// Verificar si el formulario está enviándose
const isSubmitting = form.formState.isSubmitting;

// Verificar si el formulario ha sido modificado
const isDirty = form.formState.isDirty;
```

## 📚 Referencias

- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [shadcn/ui Form Component](https://ui.shadcn.com/docs/components/form)

## 🚀 Crear un Nuevo Formulario

1. Crear schema de Zod
2. Inicializar useForm con zodResolver
3. Construir JSX con componentes Form
4. Implementar handler de submit
5. Agregar validación y mensajes de error

¡Ya tienes todo lo necesario para crear formularios robustos y accesibles!


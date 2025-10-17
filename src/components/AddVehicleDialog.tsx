import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  vin?: string;
}

interface AddVehicleDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (vehicle: Omit<Vehicle, "id">) => void;
  editVehicle?: Vehicle;
}

// Schema de validación con Zod
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

export function AddVehicleDialog({
  open,
  onClose,
  onSave,
  editVehicle,
}: AddVehicleDialogProps) {
  // Definir el formulario
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

  // Actualizar valores cuando se edita un vehículo
  useEffect(() => {
    if (editVehicle && open) {
      form.reset({
        make: editVehicle.make,
        model: editVehicle.model,
        year: editVehicle.year,
        mileage: editVehicle.mileage,
        vin: editVehicle.vin || "",
      });
    } else if (!open) {
      form.reset({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        mileage: 0,
        vin: "",
      });
    }
  }, [editVehicle, open, form]);

  // Handler del submit
  function onSubmit(values: VehicleFormValues) {
    onSave({
      make: values.make,
      model: values.model,
      year: values.year,
      mileage: values.mileage,
      vin: values.vin || undefined,
    });
    handleClose();
  }

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[90vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editVehicle ? "Editar Vehículo" : "Agregar Vehículo"}
          </DialogTitle>
          <DialogDescription>
            {editVehicle
              ? "Actualice la información de su vehículo"
              : "Registre un nuevo vehículo para obtener recomendaciones personalizadas"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="make"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ej., Toyota, Ford, Honda"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ej., Camry, F-150, Civic"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="2020"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mileage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kilometraje</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="50000"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="vin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VIN (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VIN de 17 caracteres"
                      maxLength={17}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                {editVehicle ? "Actualizar" : "Agregar Vehículo"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

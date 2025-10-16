import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

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

export function AddVehicleDialog({
  open,
  onClose,
  onSave,
  editVehicle,
}: AddVehicleDialogProps) {
  const [make, setMake] = useState(editVehicle?.make || "");
  const [model, setModel] = useState(editVehicle?.model || "");
  const [year, setYear] = useState(editVehicle?.year.toString() || "");
  const [mileage, setMileage] = useState(editVehicle?.mileage.toString() || "");
  const [vin, setVin] = useState(editVehicle?.vin || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      make,
      model,
      year: parseInt(year),
      mileage: parseInt(mileage),
      vin: vin || undefined,
    });
    handleClose();
  };

  const handleClose = () => {
    setMake("");
    setModel("");
    setYear("");
    setMileage("");
    setVin("");
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="make">Marca</Label>
            <Input
              id="make"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              placeholder="ej., Toyota, Ford, Honda"
              required
            />
          </div>
          <div>
            <Label htmlFor="model">Modelo</Label>
            <Input
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="ej., Camry, F-150, Civic"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="year">Año</Label>
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2020"
                min="1900"
                max="2025"
                required
              />
            </div>
            <div>
              <Label htmlFor="mileage">Kilometraje</Label>
              <Input
                id="mileage"
                type="number"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="50000"
                min="0"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="vin">VIN (Opcional)</Label>
            <Input
              id="vin"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              placeholder="VIN de 17 caracteres"
              maxLength={17}
            />
          </div>
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
      </DialogContent>
    </Dialog>
  );
}

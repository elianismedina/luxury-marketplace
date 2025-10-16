import { Car, Edit, Trash2 } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  vin?: string;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isSelected?: boolean;
}

export function VehicleCard({
  vehicle,
  onSelect,
  onEdit,
  onDelete,
  isSelected,
}: VehicleCardProps) {
  return (
    <Card
      className={`p-4 cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
          <Car className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="truncate">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-gray-600 text-sm">
            {vehicle.mileage.toLocaleString()} km
          </p>
          {vehicle.vin && (
            <p className="text-gray-400 text-xs mt-1">VIN: {vehicle.vin}</p>
          )}
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="h-8 w-8"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="h-8 w-8 text-red-500 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

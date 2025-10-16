import { MapPin, Phone, Star, Clock } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Service {
  id: string;
  name: string;
  type: string;
  rating: number;
  reviews: number;
  distance: string;
  address: string;
  phone: string;
  imageUrl: string;
  openNow: boolean;
  services: string[];
}

interface ServiceCardProps {
  service: Service;
  onBook?: () => void;
}

export function ServiceCard({ service, onBook }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-gray-100 relative">
        <ImageWithFallback
          src={service.imageUrl}
          alt={service.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          {service.openNow ? (
            <Badge className="bg-green-500">Abierto Ahora</Badge>
          ) : (
            <Badge variant="secondary">Cerrado</Badge>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="mb-2">
          <h3 className="mb-1">{service.name}</h3>
          <Badge variant="outline" className="text-xs">
            {service.type}
          </Badge>
        </div>
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm">{service.rating}</span>
          <span className="text-sm text-gray-500">
            ({service.reviews} reseñas)
          </span>
        </div>
        <div className="space-y-2 mb-3">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="flex-1">
              {service.distance} • {service.address}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>{service.phone}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {service.services.slice(0, 3).map((s, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {s}
            </Badge>
          ))}
        </div>
        <Button onClick={onBook} className="w-full">
          Reservar Cita
        </Button>
      </div>
    </Card>
  );
}

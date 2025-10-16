import { ShoppingCart, Star } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Part {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  imageUrl: string;
  inStock: boolean;
  compatibility?: string[];
}

interface PartCardProps {
  part: Part;
  onAddToCart?: () => void;
}

export function PartCard({ part, onAddToCart }: PartCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square bg-gray-100 relative">
        <ImageWithFallback
          src={part.imageUrl}
          alt={part.name}
          className="w-full h-full object-cover"
        />
        {!part.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary">Agotado</Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <Badge variant="outline" className="mb-2 text-xs">
              {part.category}
            </Badge>
            <h3 className="truncate">{part.name}</h3>
          </div>
        </div>
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm">{part.rating}</span>
          <span className="text-sm text-gray-500">({part.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-blue-600">${part.price.toFixed(2)}</span>
          <Button
            size="sm"
            onClick={onAddToCart}
            disabled={!part.inStock}
            className="gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Agregar
          </Button>
        </div>
      </div>
    </Card>
  );
}

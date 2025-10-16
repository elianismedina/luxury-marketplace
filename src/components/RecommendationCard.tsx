import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: "maintenance" | "repair" | "upgrade";
  estimatedCost?: string;
  dueDate?: string;
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  onViewDetails?: () => void;
}

const priorityConfig = {
  high: {
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-50",
    label: "Prioridad Alta",
    badgeVariant: "destructive" as const,
  },
  medium: {
    icon: Clock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    label: "Prioridad Media",
    badgeVariant: "secondary" as const,
  },
  low: {
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-50",
    label: "Prioridad Baja",
    badgeVariant: "outline" as const,
  },
};

export function RecommendationCard({
  recommendation,
  onViewDetails,
}: RecommendationCardProps) {
  const config = priorityConfig[recommendation.priority];
  const Icon = config.icon;

  return (
    <Card
      className={`p-4 ${config.bgColor} border-l-4 ${
        recommendation.priority === "high"
          ? "border-l-red-500"
          : recommendation.priority === "medium"
          ? "border-l-yellow-500"
          : "border-l-green-500"
      }`}
    >
      <div className="flex gap-3">
        <div className={`${config.color} flex-shrink-0 mt-1`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="flex-1">{recommendation.title}</h3>
            <Badge
              variant={config.badgeVariant}
              className="text-xs flex-shrink-0"
            >
              {config.label}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            {recommendation.description}
          </p>
          <div className="flex flex-wrap gap-3 mb-3 text-sm">
            {recommendation.estimatedCost && (
              <div>
                <span className="text-gray-500">Costo Est.: </span>
                <span>{recommendation.estimatedCost}</span>
              </div>
            )}
            {recommendation.dueDate && (
              <div>
                <span className="text-gray-500">Vence: </span>
                <span>{recommendation.dueDate}</span>
              </div>
            )}
            <div>
              <Badge variant="outline" className="text-xs capitalize">
                {recommendation.category}
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="w-full sm:w-auto"
          >
            Ver Detalles
          </Button>
        </div>
      </div>
    </Card>
  );
}

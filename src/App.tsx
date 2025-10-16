import { useState, useEffect } from "react";
import {
  Home,
  Search,
  Wrench,
  Car,
  Plus,
  Filter,
  ShoppingCart,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { VehicleCard } from "./components/VehicleCard";
import { AddVehicleDialog } from "./components/AddVehicleDialog";
import { PartCard } from "./components/PartCard";
import { ServiceCard } from "./components/ServiceCard";
import { RecommendationCard } from "./components/RecommendationCard";
import { toast } from "sonner";
import { supabase } from "./utils/supabase";

interface Vehicle {
  id: string;
  user_id?: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  vin?: string;
  created_at?: string;
  updated_at?: string;
}

type Tab = "home" | "search" | "services" | "garage";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartCount, setCartCount] = useState(0);

  // Load vehicles from Supabase
  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        setVehicles(data);
        if (data.length > 0) {
          setSelectedVehicle(data[0]);
        }
      }
    } catch (error) {
      console.error("Error loading vehicles:", error);
      toast.error("Error al cargar vehículos");
    }
  };

  const handleAddVehicle = async (vehicle: Omit<Vehicle, "id">) => {
    try {
      if (editingVehicle) {
        // Update existing vehicle
        const { error } = await supabase
          .from("vehicles")
          .update(vehicle)
          .eq("id", editingVehicle.id);

        if (error) throw error;

        toast.success("Vehículo actualizado exitosamente");
        setEditingVehicle(undefined);
      } else {
        // Insert new vehicle
        const { data, error } = await supabase
          .from("vehicles")
          .insert([vehicle])
          .select()
          .single();

        if (error) throw error;

        if (data && !selectedVehicle) {
          setSelectedVehicle(data);
        }

        toast.success("Vehículo agregado exitosamente");
      }

      // Reload vehicles from database
      await loadVehicles();
    } catch (error) {
      console.error("Error saving vehicle:", error);
      toast.error("Error al guardar el vehículo");
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      const { error } = await supabase.from("vehicles").delete().eq("id", id);

      if (error) throw error;

      if (selectedVehicle?.id === id) {
        const remainingVehicles = vehicles.filter((v: Vehicle) => v.id !== id);
        setSelectedVehicle(remainingVehicles[0] || null);
      }

      toast.success("Vehículo eliminado");

      // Reload vehicles from database
      await loadVehicles();
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error("Error al eliminar el vehículo");
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowAddDialog(true);
  };

  const handleAddToCart = () => {
    setCartCount((prev: number) => prev + 1);
    toast.success("Agregado al carrito");
  };

  const handleBookService = (serviceName: string) => {
    toast.success(`Reservando cita en ${serviceName}`);
  };

  // Mock data
  const mockParts = [
    {
      id: "1",
      name: "Filtro de Aceite",
      category: "Mantenimiento",
      price: 12.99,
      rating: 4.5,
      reviews: 234,
      imageUrl:
        "https://images.unsplash.com/photo-1758381358962-efc41be53986?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBlbmdpbmUlMjBwYXJ0c3xlbnwxfHx8fDE3NjA1NDU1OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      inStock: true,
    },
    {
      id: "2",
      name: "Pastillas de Freno",
      category: "Frenos",
      price: 89.99,
      rating: 4.8,
      reviews: 567,
      imageUrl:
        "https://images.unsplash.com/photo-1758381358962-efc41be53986?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBlbmdpbmUlMjBwYXJ0c3xlbnwxfHx8fDE3NjA1NDU1OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      inStock: true,
    },
    {
      id: "3",
      name: "Filtro de Aire",
      category: "Mantenimiento",
      price: 24.99,
      rating: 4.6,
      reviews: 189,
      imageUrl:
        "https://images.unsplash.com/photo-1758381358962-efc41be53986?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBlbmdpbmUlMjBwYXJ0c3xlbnwxfHx8fDE3NjA1NDU1OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      inStock: true,
    },
    {
      id: "4",
      name: "Bujías (Juego de 4)",
      category: "Motor",
      price: 34.99,
      rating: 4.7,
      reviews: 423,
      imageUrl:
        "https://images.unsplash.com/photo-1758381358962-efc41be53986?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBlbmdpbmUlMjBwYXJ0c3xlbnwxfHx8fDE3NjA1NDU1OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      inStock: false,
    },
    {
      id: "5",
      name: "Batería",
      category: "Eléctrico",
      price: 129.99,
      rating: 4.9,
      reviews: 891,
      imageUrl:
        "https://images.unsplash.com/photo-1758381358962-efc41be53986?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBlbmdpbmUlMjBwYXJ0c3xlbnwxfHx8fDE3NjA1NDU1OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      inStock: true,
    },
    {
      id: "6",
      name: "Escobillas Limpiaparabrisas",
      category: "Mantenimiento",
      price: 19.99,
      rating: 4.3,
      reviews: 145,
      imageUrl:
        "https://images.unsplash.com/photo-1758381358962-efc41be53986?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBlbmdpbmUlMjBwYXJ0c3xlbnwxfHx8fDE3NjA1NDU1OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      inStock: true,
    },
  ];

  const mockServices = [
    {
      id: "1",
      name: "Reparación Rápida Auto",
      type: "Servicio Completo",
      rating: 4.8,
      reviews: 342,
      distance: "3.7 km",
      address: "Calle Principal 123, Ciudad, ST 12345",
      phone: "(555) 123-4567",
      imageUrl:
        "https://images.unsplash.com/photo-1642399299924-c9c97617bf86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwbWVjaGFuaWMlMjBzZXJ2aWNlfGVufDF8fHx8MTc2MDYzNjYzMnww&ixlib=rb-4.1.0&q=80&w=1080",
      openNow: true,
      services: [
        "Cambio de Aceite",
        "Servicio de Frenos",
        "Rotación de Llantas",
      ],
    },
    {
      id: "2",
      name: "Elite Auto Care",
      type: "Taller Especializado",
      rating: 4.9,
      reviews: 567,
      distance: "6.6 km",
      address: "Avenida Roble 456, Ciudad, ST 12345",
      phone: "(555) 987-6543",
      imageUrl:
        "https://images.unsplash.com/photo-1642399299924-c9c97617bf86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwbWVjaGFuaWMlMjBzZXJ2aWNlfGVufDF8fHx8MTc2MDYzNjYzMnww&ixlib=rb-4.1.0&q=80&w=1080",
      openNow: true,
      services: ["Diagnósticos", "Reparación de Motor", "Transmisión"],
    },
    {
      id: "3",
      name: "Frenos y Llantas Económicas",
      type: "Servicio Rápido",
      rating: 4.5,
      reviews: 189,
      distance: "2.9 km",
      address: "Calle Olmo 789, Ciudad, ST 12345",
      phone: "(555) 456-7890",
      imageUrl:
        "https://images.unsplash.com/photo-1642399299924-c9c97617bf86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwbWVjaGFuaWMlMjBzZXJ2aWNlfGVufDF8fHx8MTc2MDYzNjYzMnww&ixlib=rb-4.1.0&q=80&w=1080",
      openNow: false,
      services: ["Reparación de Frenos", "Servicio de Llantas", "Alineación"],
    },
  ];

  const mockRecommendations = [
    {
      id: "1",
      title: "Cambio de Aceite Pendiente",
      description:
        "Su vehículo necesita un cambio de aceite según el kilometraje. Los cambios regulares de aceite ayudan a mantener la salud del motor.",
      priority: "high" as const,
      category: "maintenance" as const,
      estimatedCost: "$40-60",
      dueDate: "30 Oct 2025",
    },
    {
      id: "2",
      title: "Rotación de Llantas Recomendada",
      description:
        "Rote sus llantas cada 8,000-12,000 km para asegurar un desgaste uniforme y extender su vida útil.",
      priority: "medium" as const,
      category: "maintenance" as const,
      estimatedCost: "$25-50",
      dueDate: "15 Nov 2025",
    },
    {
      id: "3",
      title: "Reemplazo de Filtro de Aire",
      description:
        "Un filtro de aire limpio mejora la eficiencia del combustible y el rendimiento del motor.",
      priority: "low" as const,
      category: "maintenance" as const,
      estimatedCost: "$20-40",
      dueDate: "1 Dic 2025",
    },
  ];

  const categories = ["all", "Mantenimiento", "Frenos", "Motor", "Eléctrico"];

  const filteredParts = mockParts.filter((part) => {
    const matchesSearch = part.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || part.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center justify-between">
          <div>
            <h1>Buscador de Repuestos</h1>
            {selectedVehicle && (
              <p className="text-sm text-gray-600">
                {selectedVehicle.year} {selectedVehicle.make}{" "}
                {selectedVehicle.model}
              </p>
            )}
          </div>
          {activeTab === "search" && (
            <div className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        {/* Home Tab */}
        {activeTab === "home" && (
          <div className="space-y-6">
            {vehicles.length === 0 ? (
              <div className="text-center py-12">
                <Car className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h2 className="mb-2">Aún No Hay Vehículos</h2>
                <p className="text-gray-600 mb-6">
                  Agregue su vehículo para obtener recomendaciones
                  personalizadas
                </p>
                <Button
                  onClick={() => setShowAddDialog(true)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Su Primer Vehículo
                </Button>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2>Sus Vehículos</h2>
                    <Button
                      onClick={() => setShowAddDialog(true)}
                      size="sm"
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {vehicles.map((vehicle) => (
                      <VehicleCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        isSelected={selectedVehicle?.id === vehicle.id}
                        onSelect={() => setSelectedVehicle(vehicle)}
                        onEdit={() => handleEditVehicle(vehicle)}
                        onDelete={() => handleDeleteVehicle(vehicle.id)}
                      />
                    ))}
                  </div>
                </div>

                {selectedVehicle && (
                  <div>
                    <h2 className="mb-4">Recomendaciones</h2>
                    <div className="space-y-3">
                      {mockRecommendations.map((rec) => (
                        <RecommendationCard
                          key={rec.id}
                          recommendation={rec}
                          onViewDetails={() =>
                            toast.info("Ver detalles próximamente")
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Search Tab */}
        {activeTab === "search" && (
          <div className="space-y-4">
            <div className="space-y-3">
              <Input
                placeholder="Buscar repuestos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className="flex-shrink-0"
                  >
                    {cat === "all" ? "Todos" : cat}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {filteredParts.map((part) => (
                <PartCard
                  key={part.id}
                  part={part}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="space-y-4">
            <div>
              <h2 className="mb-2">Servicios Cercanos</h2>
              <p className="text-sm text-gray-600">
                Encuentre proveedores de servicios automotrices confiables cerca
                de usted
              </p>
            </div>
            <div className="space-y-4">
              {mockServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onBook={() => handleBookService(service.name)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Garage Tab */}
        {activeTab === "garage" && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-2">Mi Garaje</h2>
              <p className="text-sm text-gray-600">
                Administre sus vehículos e historial de mantenimiento
              </p>
            </div>

            {vehicles.length === 0 ? (
              <div className="text-center py-12">
                <Car className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="mb-2">No hay vehículos en su garaje</h3>
                <p className="text-gray-600 mb-6">
                  Agregue su primer vehículo para comenzar
                </p>
                <Button
                  onClick={() => setShowAddDialog(true)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Vehículo
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {vehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onSelect={() => setSelectedVehicle(vehicle)}
                    onEdit={() => handleEditVehicle(vehicle)}
                    onDelete={() => handleDeleteVehicle(vehicle.id)}
                  />
                ))}
                <Button
                  onClick={() => setShowAddDialog(true)}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Otro Vehículo
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-4 gap-1 p-2">
          <Button
            variant={activeTab === "home" ? "default" : "ghost"}
            onClick={() => setActiveTab("home")}
            className="flex flex-col h-auto py-2 gap-1"
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Inicio</span>
          </Button>
          <Button
            variant={activeTab === "search" ? "default" : "ghost"}
            onClick={() => setActiveTab("search")}
            className="flex flex-col h-auto py-2 gap-1"
          >
            <Search className="w-5 h-5" />
            <span className="text-xs">Repuestos</span>
          </Button>
          <Button
            variant={activeTab === "services" ? "default" : "ghost"}
            onClick={() => setActiveTab("services")}
            className="flex flex-col h-auto py-2 gap-1"
          >
            <Wrench className="w-5 h-5" />
            <span className="text-xs">Servicios</span>
          </Button>
          <Button
            variant={activeTab === "garage" ? "default" : "ghost"}
            onClick={() => setActiveTab("garage")}
            className="flex flex-col h-auto py-2 gap-1"
          >
            <Car className="w-5 h-5" />
            <span className="text-xs">Garaje</span>
          </Button>
        </div>
      </nav>

      {/* Add Vehicle Dialog */}
      <AddVehicleDialog
        open={showAddDialog}
        onClose={() => {
          setShowAddDialog(false);
          setEditingVehicle(undefined);
        }}
        onSave={handleAddVehicle}
        editVehicle={editingVehicle}
      />
    </div>
  );
}

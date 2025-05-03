
import { useState, useEffect } from "react";
import { WorkoutDashboard } from "@/components/dashboard/WorkoutDashboard";
import { RoutinesList } from "@/components/dashboard/RoutinesList";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setUserName(user.user_metadata.full_name);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/auth");
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast({
        title: "Error",
        description: "No se pudo cerrar sesión",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {userName ? `¡Bienvenido, ${userName}!` : "¡Bienvenido a tu Dashboard!"}
          </h1>
          <p className="text-muted-foreground">
            Aquí puedes ver tus estadísticas de entrenamiento y gestionar tus rutinas.
          </p>
        </div>
        <Button 
          variant="outline" 
          className="mt-4 md:mt-0 flex items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Mis rutinas</h2>
          <RoutinesList />
        </div>

        <WorkoutDashboard />
      </div>
    </div>
  );
};

export default Dashboard;

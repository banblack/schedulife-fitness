
import { useToast } from '@/components/ui/use-toast';
import { transferDemoDataToAccount } from '@/services/workoutTracking';

export const useDemoDataTransfer = () => {
  const { toast } = useToast();

  const transferDemoData = async (userId: string | undefined): Promise<boolean> => {
    if (!userId) {
      toast({
        title: "Error",
        description: "No hay usuario autenticado para transferir los datos",
        variant: "destructive",
      });
      return false;
    }

    const success = await transferDemoDataToAccount(userId);
    
    if (success) {
      toast({
        title: "Datos transferidos",
        description: "Tus entrenamientos de prueba han sido guardados en tu cuenta",
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudieron transferir los datos de prueba",
        variant: "destructive",
      });
    }
    
    return success;
  };

  return { transferDemoData };
};

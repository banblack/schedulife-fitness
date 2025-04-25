
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary?: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  const navigate = useNavigate();

  const handleReset = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    }
    navigate('/');
  };

  const getErrorMessage = (error: Error) => {
    if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
      return 'Error de conexión. Por favor, verifica tu conexión a internet.';
    }
    
    if (error.message.includes('401')) {
      return 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
    }
    
    if (error.message.includes('403')) {
      return 'No tienes permiso para acceder a este recurso.';
    }
    
    if (error.message.includes('404')) {
      return 'El recurso que buscas no existe.';
    }
    
    if (error.message.includes('500')) {
      return 'Error del servidor. Por favor, inténtalo más tarde.';
    }
    
    return 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="text-center max-w-md">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-4">¡Ups! Algo salió mal</h1>
        <p className="text-muted-foreground mb-6">
          {getErrorMessage(error)}
        </p>
        <div className="space-y-4">
          <Button 
            onClick={handleReset}
            variant="default"
            className="w-full"
          >
            Volver al inicio
          </Button>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="w-full"
          >
            Recargar la página
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;

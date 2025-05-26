
import { Button } from '@/components/ui/button';

export const SkipNavigation = () => {
  return (
    <Button
      variant="outline"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
      onClick={() => {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView();
        }
      }}
    >
      Saltar al contenido principal
    </Button>
  );
};

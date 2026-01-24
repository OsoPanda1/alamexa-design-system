import { useState, useEffect } from "react";
import { WifiOff, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => {
      setIsOffline(true);
      setDismissed(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline || dismissed) return null;

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[100]",
        "bg-warning text-warning-foreground",
        "px-4 py-2 text-center text-sm font-medium",
        "flex items-center justify-center gap-2"
      )}
    >
      <WifiOff className="h-4 w-4" />
      <span>Sin conexión a internet. Algunas funciones pueden no estar disponibles.</span>
      <button
        onClick={() => setDismissed(true)}
        className="ml-2 p-1 hover:bg-warning-foreground/10 rounded"
        aria-label="Cerrar"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

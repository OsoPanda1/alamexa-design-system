import { Loader2 } from "lucide-react";
import { useLoading } from "@/contexts/LoadingContext";

export const GlobalLoader = () => {
  const { isLoading } = useLoading();
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <Loader2 className="h-8 w-8 animate-spin text-accent" />
    </div>
  );
};

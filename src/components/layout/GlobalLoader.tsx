import React from "react";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useLoading } from "@/contexts/LoadingContext";

interface LoadingState {
  isLoading: boolean;
  progress?: number; // 0-100
  message?: string;
  type?: "primary" | "success" | "error" | "warning";
  autoHide?: boolean;
  duration?: number;
}

export const GlobalLoader = () => {
  const { isLoading, progress, message, type = "primary" } = useLoading();
  
  if (!isLoading) return null;

  const getVariantClasses = (variant: string) => {
    const variants = {
      primary: "bg-accent/10 border-accent/20 text-accent",
      success: "bg-success/10 border-success/20 text-success",
      error: "bg-destructive/10 border-destructive/20 text-destructive",
      warning: "bg-warning/10 border-warning/20 text-warning",
    };
    return variants[variant as keyof typeof variants] || variants.primary;
  };

  const getIcon = (variant: string) => {
    const icons = {
      primary: Loader2,
      success: CheckCircle2,
      error: AlertCircle,
    };
    const Icon = icons[variant as keyof typeof icons] || Loader2;
    return <Icon className="h-6 w-6 animate-spin sm:animate-pulse" />;
  };

  return (
    <>
      {/* Overlay backdrop */}
      <div className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-[8px]" />

      {/* Loader principal */}
      <div className="fixed left-1/2 top-1/2 z-[10000] flex -translate-x-1/2 -translate-y-1/2 transform items-center gap-4 rounded-2xl border bg-card/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="flex flex-col items-center gap-3">
          {/* Icono */}
          <div className={getVariantClasses(type)}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background p-3 shadow-lg">
              {getIcon(type)}
            </div>
          </div>

          {/* Progress bar (opcional) */}
          {progress !== undefined && (
            <div className="w-48 rounded-full bg-muted/50 p-0.5 sm:w-64">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getVariantClasses(type).replace('text-', 'bg-')}`}
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
          )}
        </div>

        {/* Mensaje (desktop) */}
        {message && (
          <div className="hidden min-w-0 flex-1 flex-col gap-1 sm:flex">
            <p className={`font-medium ${getVariantClasses(type)} truncate`}>{message}</p>
            {progress !== undefined && (
              <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>
            )}
          </div>
        )}
      </div>

      {/* Mobile message (compacto) */}
      {message && (
        <div className="fixed bottom-6 left-1/2 z-[10000] -translate-x-1/2 transform rounded-lg border bg-card/95 px-4 py-2 text-xs shadow-2xl backdrop-blur-xl sm:hidden">
          <span className={`font-medium ${getVariantClasses(type)}`}>{message}</span>
        </div>
      )}
    </>
  );
};


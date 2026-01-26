import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { GlobalLoader } from "./components/layout/GlobalLoader";
import { OfflineBanner } from "./components/OfflineBanner";
import "./index.css";

// QueryClient optimizado para producción
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error) => {
        const err = error as { status?: number };
        if (err.status === 404) return false;
        if (err.status && err.status >= 500) return failureCount < 3;
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: "always",
    },
    mutations: {
      retry: 2,
    },
  },
});

// Componente raíz con providers consolidados
function AppRoot() {
  return (
    <React.StrictMode>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <CartProvider>
                <LoadingProvider>
                  <ErrorBoundary>
                    <Suspense fallback={<GlobalLoader />}>
                      <div className="app-root">
                        <OfflineBanner />
                        <App />
                      </div>
                    </Suspense>
                  </ErrorBoundary>
                </LoadingProvider>
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
}

// Service Worker (PWA) - Deshabilitado hasta que se configure correctamente
// if ("serviceWorker" in navigator && import.meta.env.PROD) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker.register("/sw.js");
//   });
// }

// Error reporting global
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});

// Performance monitoring
if (import.meta.env.PROD) {
  import("./utils/web-vitals").then(({ reportWebVitals }) => {
    reportWebVitals((metric) => {
      console.log(`[Web Vitals] ${metric.name}: ${metric.value}`);
    });
  });
}

// Renderizado final
const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(<AppRoot />);

// Cleanup en hot reload (Vite dev)
if (import.meta.hot) {
  import.meta.hot.accept();
  
  import.meta.hot.dispose(() => {
    root.unmount();
  });
}

import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos garbage collection
      retry: (failureCount, error: any) => {
        if (error.status === 404) return false;
        if (error.status >= 500) return 3;
        return 1;
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
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
}

// Service Worker (PWA)
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller?.addEventListener("message", (event) => {
        if (event.data?.type === "UPDATE_AVAILABLE") {
          // Notificar actualización disponible
          window.location.reload();
        }
      });
    }
    
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registrado: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW falló al registrarse: ", registrationError);
      });
  });
}

// Error reporting global
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});

// Performance monitoring
if (import.meta.env.PROD) {
  // Report Web Vitals
  import("./utils/web-vitals").then(({ reportWebVitals }) => {
    reportWebVitals(console.log);
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

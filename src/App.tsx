import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { LoadingProvider } from "@/contexts/LoadingContext"; // nuevo
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { GlobalLoader } from "@/components/layout/GlobalLoader"; // overlay global

import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Account from "./pages/Account";
import Memberships from "./pages/Memberships";
import Dashboard from "./pages/Dashboard";
import CreateProduct from "./pages/CreateProduct";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

// Layout raíz para UI compartida
const AppShell = ({ children }: { children: React.ReactNode }) => (
  <>
    <GlobalLoader />
    {children}
    <Toaster />
    <Sonner />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <LoadingProvider>
            <BrowserRouter>
              <AppShell>
                <Routes>
                  {/* Rutas públicas */}
                  <Route path="/auth" element={<Auth />} />
                  {/* Si quieres que /about sea público, ponlo aquí */}
                  <Route path="/about" element={<About />} />

                  {/* Rutas protegidas */}
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/catalog"
                    element={
                      <ProtectedRoute>
                        <Catalog />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/memberships"
                    element={
                      <ProtectedRoute>
                        <Memberships />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account"
                    element={
                      <ProtectedRoute>
                        <Account />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/products/new"
                    element={
                      <ProtectedRoute>
                        <CreateProduct />
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppShell>
            </BrowserRouter>
          </LoadingProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { GlobalLoader } from "@/components/layout/GlobalLoader";

import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Account from "./pages/Account";
import Memberships from "./pages/Memberships";
import Dashboard from "./pages/Dashboard";
import CreateProduct from "./pages/CreateProduct";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import DevHubRegister from "./pages/DevHubRegister";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

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
                  <Route path="/about" element={<About />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />

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
                  <Route
                    path="/devhub"
                    element={
                      <ProtectedRoute>
                        <DevHubRegister />
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

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
import { OnboardingModal, useOnboarding } from "@/components/OnboardingModal";

import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import Catalog from "./pages/Catalog";
import Trades from "./pages/Trades";
import Messages from "./pages/Messages";
import ProductDetail from "./pages/ProductDetail";
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
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function AppShellWithOnboarding({ children }: { children: React.ReactNode }) {
  const { showOnboarding, setShowOnboarding, completeOnboarding } = useOnboarding();

  return (
    <>
      <GlobalLoader />
      {children}
      <Toaster />
      <Sonner />
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={completeOnboarding}
      />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <LoadingProvider>
            <BrowserRouter>
              <AppShellWithOnboarding>
                <Routes>
                  {/* Rutas públicas */}
                  <Route path="/" element={<Index />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/memberships" element={<Memberships />} />

                  {/* Rutas protegidas */}
                  <Route
                    path="/trades"
                    element={
                      <ProtectedRoute>
                        <Trades />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/messages"
                    element={
                      <ProtectedRoute>
                        <Messages />
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
                  <Route
                    path="/notifications"
                    element={
                      <ProtectedRoute>
                        <Notifications />
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppShellWithOnboarding>
            </BrowserRouter>
          </LoadingProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, X, Home, LayoutDashboard, ShoppingBag } from "lucide-react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useDevHubCheckout } from "@/hooks/useDevHubCheckout";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ... (schema y tipos iguales)

export default function DevHubRegister() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const { initiateCheckout, isLoading: checkoutLoading } = useDevHubCheckout();

  // Función universal para salir
  const handleCancel = () => {
    toast.info("Registro cancelado. Puedes volver cuando quieras.");
    navigate(-1); // Regresa a página anterior
  };

  // Check for cancelled payment
  useEffect(() => {
    if (searchParams.get("payment") === "cancelled") {
      toast.error("Pago cancelado. Puedes intentar de nuevo cuando quieras.");
    }
  }, [searchParams]);

  const form = useForm<DevHubFormData>({
    resolver: zodResolver(devHubSchema),
    defaultValues: {
      fullName: "",
      email: user?.email || "",
      phone: "",
      country: "México",
      city: "",
      githubUrl: "",
      portfolioUrl: "",
      linkedinUrl: "",
      experienceYears: "",
      skills: "",
      motivation: "",
    },
  });

  const onSubmit = async (data: DevHubFormData) => {
    // ... (lógica igual)
  };

  const handlePayment = () => {
    // ... (lógica igual)
  };

  // Pantalla sin usuario (con escape claro)
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24 lg:py-32">
          <div className="mx-auto max-w-lg text-center">
            {/* Breadcrumb */}
            <div className="mb-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                Volver
              </button>
            </div>

            <Code className="mx-auto mb-6 h-16 w-16 text-primary" />
            <h1 className="mb-4 text-3xl font-bold text-foreground">
              Únete al Gremio TAMV DevHub
            </h1>
            <p className="mb-8 text-muted-foreground">
              Inicia sesión para registrarte como desarrollador del ecosistema TAMV.
            </p>
            <div className="space-y-4">
              <Link to="/auth">
                <Button size="lg" className="w-full">
                  Iniciar Sesión
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full"
                onClick={handleCancel}
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Pantalla de pago (con múltiples escapes)
  if (isRegistered) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24 lg:py-32">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-4 text-sm text-muted-foreground">
            <button onClick={handleCancel} className="flex items-center gap-1 hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              DevHub
            </button>
            <span>/</span>
            <span className="font-medium">Pago</span>
          </div>

          <div className="mx-auto max-w-lg text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-success/20">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h1 className="mb-4 text-3xl font-bold text-foreground">¡Registro Completado!</h1>
            <p className="mb-8 text-muted-foreground">
              Completa el pago único de <strong>$250 MXN</strong> para activar tu membresía.
            </p>

            <div className="mb-8 rounded-lg border border-border/50 bg-card/50 p-6">
              <p className="mb-2 text-2xl font-bold text-foreground">$250 MXN</p>
              <p className="text-sm text-muted-foreground">Pago único • ID: {registrationId}</p>
            </div>

            {/* Acciones principales */}
            <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:justify-center">
              <Button 
                size="lg" 
                variant="hero"
                onClick={handlePayment}
                disabled={checkoutLoading}
                className="shadow-lg hover:shadow-xl"
              >
                {checkoutLoading ? "Procesando..." : "Pagar Ahora"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link to="/dashboard">
                <Button size="lg" variant="outline">
                  Pagar Después
                </Button>
              </Link>
            </div>

            {/* Opciones de escape */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-6 border-t border-border/30 text-xs text-muted-foreground">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="gap-1 hover:text-foreground"
              >
                <LayoutDashboard className="h-4 w-4" />
                Ir al Dashboard
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/catalog")}
                className="gap-1 hover:text-foreground"
              >
                <ShoppingBag className="h-4 w-4" />
                Ver Catálogo
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleCancel}
                className="gap-1 hover:text-destructive"
              >
                <X className="h-4 w-4" />
                Cancelar Registro
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Formulario principal (con cancelación clara)
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-24 lg:py-32">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-4 text-sm text-muted-foreground">
          <button onClick={handleCancel} className="flex items-center gap-1 hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </button>
          <span>/</span>
          <Badge variant="outline" className="text-xs">DevHub Registro</Badge>
        </div>

        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 inline-flex items-center gap-2">
              <Shield className="h-3 w-3" />
              TAMV ONLINE NETWORK
            </Badge>
            <h1 className="mb-4 text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Registro DevHub
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Únete al gremio latinoamericano de desarrolladores. Cuota única: <strong>$250 MXN</strong>
            </p>
          </div>

          {/* Benefits (igual) */}
          <div className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {/* ... benefits igual */}
          </div>

          {/* Formulario con footer de acciones */}
          <Card className="border-border/30">
            <CardHeader>
              <CardTitle>Información del Desarrollador</CardTitle>
              <CardDescription>Completa tu perfil para unirte al ecosistema TAMV</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* ... todo el formulario igual hasta el final */}
                  
                  {/* Footer con acciones duales */}
                  <div className="flex flex-col gap-4 pt-6 border-t border-border/30 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <p>Al registrarte aceptas los</p>
                      <Link to="/terms" className="underline hover:text-primary">términos</Link>
                      <span>y</span>
                      <Link to="/privacy" className="underline hover:text-primary">privacidad</Link>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={handleCancel}
                        className="shrink-0 gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="shrink-0 shadow-lg hover:shadow-xl"
                      >
                        {isSubmitting ? "Registrando..." : "Registrarme"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

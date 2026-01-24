import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  ArrowRight, 
  X, 
  LayoutDashboard, 
  ShoppingBag,
  Code,
  CheckCircle,
  Shield,
  Users,
  Globe,
  Zap
} from "lucide-react";

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

// Schema de validación
const devHubSchema = z.object({
  fullName: z.string().min(3, "Nombre debe tener al menos 3 caracteres").max(100),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Teléfono debe tener al menos 10 dígitos").max(20),
  country: z.string().min(2, "País requerido"),
  city: z.string().min(2, "Ciudad requerida"),
  githubUrl: z.string().url("URL de GitHub inválida").optional().or(z.literal("")),
  portfolioUrl: z.string().url("URL de portfolio inválida").optional().or(z.literal("")),
  linkedinUrl: z.string().url("URL de LinkedIn inválida").optional().or(z.literal("")),
  experienceYears: z.string().min(1, "Selecciona tu experiencia"),
  skills: z.string().min(10, "Describe tus habilidades (mínimo 10 caracteres)"),
  motivation: z.string().min(20, "Cuéntanos tu motivación (mínimo 20 caracteres)"),
});

type DevHubFormData = z.infer<typeof devHubSchema>;

const benefits = [
  { icon: Users, label: "Comunidad LATAM", desc: "Red de desarrolladores" },
  { icon: Globe, label: "Visibilidad", desc: "Perfil en directorio" },
  { icon: Zap, label: "Proyectos", desc: "Acceso a oportunidades" },
  { icon: Shield, label: "Credencial", desc: "Badge verificado" },
];

export default function DevHubRegister() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const { initiateCheckout, isLoading: checkoutLoading } = useDevHubCheckout();

  const handleCancel = () => {
    toast.info("Registro cancelado. Puedes volver cuando quieras.");
    navigate(-1);
  };

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
    if (!user) {
      toast.error("Debes iniciar sesión");
      return;
    }

    setIsSubmitting(true);
    try {
      const insertData = {
        user_id: user.id,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        country: data.country,
        city: data.city,
        github_url: data.githubUrl || null,
        portfolio_url: data.portfolioUrl || null,
        linkedin_url: data.linkedinUrl || null,
        experience_years: data.experienceYears,
        skills: data.skills,
        motivation: data.motivation,
        payment_status: "pending",
        payment_amount: 250,
        payment_currency: "MXN",
      };

      const { data: registration, error } = await supabase
        .from("devhub_registrations")
        .insert(insertData as any)
        .select()
        .single();

      if (error) throw error;

      setRegistrationId(registration.id);
      setIsRegistered(true);
      toast.success("¡Registro guardado! Completa el pago para activar tu membresía.");
    } catch (error) {
      console.error("Error al registrar:", error);
      toast.error("Error al guardar el registro. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async () => {
    if (!user || !registrationId) return;
    
    try {
      await initiateCheckout({ userId: user.id, email: user.email || "", registrationId });
    } catch (error) {
      console.error("Error al iniciar pago:", error);
      toast.error("Error al procesar pago. Intenta de nuevo.");
    }
  };

  // Pantalla sin usuario
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24 lg:py-32">
          <div className="mx-auto max-w-lg text-center">
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

  // Pantalla de pago
  if (isRegistered) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24 lg:py-32">
          <div className="mb-8 flex items-center gap-4 text-sm text-muted-foreground">
            <button onClick={handleCancel} className="flex items-center gap-1 hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              DevHub
            </button>
            <span>/</span>
            <span className="font-medium">Pago</span>
          </div>

          <div className="mx-auto max-w-lg text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="mb-4 text-3xl font-bold text-foreground">¡Registro Completado!</h1>
            <p className="mb-8 text-muted-foreground">
              Completa el pago único de <strong>$250 MXN</strong> para activar tu membresía.
            </p>

            <div className="mb-8 rounded-lg border border-border/50 bg-card/50 p-6">
              <p className="mb-2 text-2xl font-bold text-foreground">$250 MXN</p>
              <p className="text-sm text-muted-foreground">Pago único • ID: {registrationId?.slice(0, 8)}</p>
            </div>

            <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:justify-center">
              <Button 
                size="lg" 
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
                Cancelar
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Formulario principal
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-24 lg:py-32">
        <div className="mb-8 flex items-center gap-4 text-sm text-muted-foreground">
          <button onClick={handleCancel} className="flex items-center gap-1 hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </button>
          <span>/</span>
          <Badge variant="outline" className="text-xs">DevHub Registro</Badge>
        </div>

        <div className="mx-auto max-w-4xl">
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

          {/* Benefits */}
          <div className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div key={benefit.label} className="rounded-lg border border-border/30 bg-card/50 p-4 text-center">
                <benefit.icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="font-medium text-foreground">{benefit.label}</p>
                <p className="text-xs text-muted-foreground">{benefit.desc}</p>
              </div>
            ))}
          </div>

          {/* Formulario */}
          <Card className="border-border/30">
            <CardHeader>
              <CardTitle>Información del Desarrollador</CardTitle>
              <CardDescription>Completa tu perfil para unirte al ecosistema TAMV</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Datos personales */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre completo *</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu nombre completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="tu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono *</FormLabel>
                          <FormControl>
                            <Input placeholder="+52 55 1234 5678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>País *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona tu país" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="México">México</SelectItem>
                              <SelectItem value="Colombia">Colombia</SelectItem>
                              <SelectItem value="Argentina">Argentina</SelectItem>
                              <SelectItem value="Chile">Chile</SelectItem>
                              <SelectItem value="Perú">Perú</SelectItem>
                              <SelectItem value="Ecuador">Ecuador</SelectItem>
                              <SelectItem value="Venezuela">Venezuela</SelectItem>
                              <SelectItem value="Otro">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ciudad *</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu ciudad" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="experienceYears"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Años de experiencia *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0-1">0-1 años</SelectItem>
                              <SelectItem value="2-3">2-3 años</SelectItem>
                              <SelectItem value="4-5">4-5 años</SelectItem>
                              <SelectItem value="6-10">6-10 años</SelectItem>
                              <SelectItem value="10+">10+ años</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* URLs profesionales */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="githubUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GitHub</FormLabel>
                          <FormControl>
                            <Input placeholder="https://github.com/usuario" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="portfolioUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Portfolio</FormLabel>
                          <FormControl>
                            <Input placeholder="https://tuportfolio.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="linkedinUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn</FormLabel>
                          <FormControl>
                            <Input placeholder="https://linkedin.com/in/usuario" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Habilidades y motivación */}
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Habilidades técnicas *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="React, Node.js, Python, bases de datos, etc." 
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>Describe tus tecnologías y habilidades principales</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="motivation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motivación *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="¿Por qué quieres unirte al ecosistema TAMV DevHub?" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Footer con acciones */}
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

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
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

import {
  Code,
  Users,
  Shield,
  Rocket,
  CheckCircle,
  ArrowRight,
  Github,
  Linkedin,
  Globe,
} from "lucide-react";

// Esquema de validación con zod
const devHubSchema = z.object({
  fullName: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  email: z
    .string()
    .email("Ingresa un correo electrónico válido")
    .max(255, "El correo no puede exceder 255 caracteres"),
  phone: z
    .string()
    .min(10, "El teléfono debe tener al menos 10 dígitos")
    .max(20, "El teléfono no puede exceder 20 caracteres")
    .optional()
    .or(z.literal("")),
  country: z.string().min(2, "Selecciona un país"),
  city: z.string().max(100, "La ciudad no puede exceder 100 caracteres").optional(),
  githubUrl: z
    .string()
    .url("Ingresa una URL válida de GitHub")
    .optional()
    .or(z.literal("")),
  portfolioUrl: z
    .string()
    .url("Ingresa una URL válida")
    .optional()
    .or(z.literal("")),
  linkedinUrl: z
    .string()
    .url("Ingresa una URL válida de LinkedIn")
    .optional()
    .or(z.literal("")),
  experienceYears: z.string().min(1, "Selecciona tu experiencia"),
  skills: z.string().min(3, "Ingresa al menos una habilidad"),
  motivation: z
    .string()
    .min(50, "Cuéntanos un poco más (mínimo 50 caracteres)")
    .max(1000, "La motivación no puede exceder 1000 caracteres"),
});

type DevHubFormData = z.infer<typeof devHubSchema>;

const benefits = [
  {
    icon: Users,
    title: "Representación Profesional",
    description: "Tu perfil respaldado por TAMV ONLINE NETWORK",
  },
  {
    icon: Code,
    title: "Ecosistema Tecnológico",
    description: "Acceso a Metaverso, ALAMEXA, Isabella AI y más",
  },
  {
    icon: Shield,
    title: "Metagobernanza",
    description: "Participa en DAOs híbridas y decisiones del gremio",
  },
  {
    icon: Rocket,
    title: "Visibilidad Global",
    description: "Portafolio latinoamericano de desarrolladores unidos",
  },
];

const countries = [
  "México",
  "Argentina",
  "Colombia",
  "Chile",
  "Perú",
  "Ecuador",
  "Venezuela",
  "España",
  "Estados Unidos",
  "Otro",
];

export default function DevHubRegister() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

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
      toast.error("Debes iniciar sesión para registrarte");
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);

    try {
      const skillsArray = data.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const { error } = await supabase.from("devhub_registrations").insert({
        user_id: user.id,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone || null,
        country: data.country,
        city: data.city || null,
        github_url: data.githubUrl || null,
        portfolio_url: data.portfolioUrl || null,
        linkedin_url: data.linkedinUrl || null,
        skills: skillsArray,
        experience_years: parseInt(data.experienceYears, 10),
        motivation: data.motivation,
        payment_status: "pending",
      });

      if (error) {
        if (error.code === "23505") {
          toast.error("Ya tienes un registro en DevHub");
        } else {
          throw error;
        }
        return;
      }

      setIsRegistered(true);
      toast.success("¡Registro exitoso! Procede al pago para completar tu membresía.");
    } catch (err) {
      console.error("Error al registrar:", err);
      toast.error("Error al procesar el registro. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24 lg:py-32">
          <div className="mx-auto max-w-lg text-center">
            <Code className="mx-auto mb-6 h-16 w-16 text-primary" />
            <h1 className="mb-4 text-3xl font-bold text-foreground">
              Únete al Gremio TAMV DevHub
            </h1>
            <p className="mb-8 text-muted-foreground">
              Inicia sesión para registrarte como desarrollador del ecosistema
              TAMV ONLINE NETWORK.
            </p>
            <Link to="/auth">
              <Button size="lg">
                Iniciar Sesión
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24 lg:py-32">
          <div className="mx-auto max-w-lg text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-success/20">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h1 className="mb-4 text-3xl font-bold text-foreground">
              ¡Registro Completado!
            </h1>
            <p className="mb-8 text-muted-foreground">
              Tu solicitud ha sido recibida. Para activar tu membresía DevHub,
              completa el pago único de $250 MXN.
            </p>
            <div className="mb-8 rounded-lg border border-border/50 bg-card/50 p-6">
              <p className="mb-2 text-2xl font-bold text-foreground">$250 MXN</p>
              <p className="text-sm text-muted-foreground">Pago único de membresía</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to="/memberships">
                <Button size="lg" variant="hero">
                  Completar Pago
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline">
                  Ir al Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-24 lg:py-32">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              TAMV ONLINE NETWORK
            </Badge>
            <h1 className="mb-4 text-4xl font-bold text-foreground">
              Registro DevHub
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Únete al primer gremio latinoamericano de desarrolladores. Cuota
              única de registro: <strong className="text-foreground">$250 MXN</strong>
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="border-border/30 bg-card/50">
                <CardContent className="p-4 text-center">
                  <Icon className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <h3 className="mb-1 text-sm font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Form */}
          <Card className="border-border/30">
            <CardHeader>
              <CardTitle>Información del Desarrollador</CardTitle>
              <CardDescription>
                Completa tu perfil profesional para unirte al ecosistema TAMV
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Info */}
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
                          <FormLabel>Correo electrónico *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="tu@email.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input placeholder="+52 555 123 4567" {...field} />
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
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona país" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
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
                          <FormLabel>Ciudad</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu ciudad" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Professional Links */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="githubUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Github className="h-4 w-4" /> GitHub
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://github.com/usuario"
                              {...field}
                            />
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
                          <FormLabel className="flex items-center gap-2">
                            <Linkedin className="h-4 w-4" /> LinkedIn
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://linkedin.com/in/usuario"
                              {...field}
                            />
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
                          <FormLabel className="flex items-center gap-2">
                            <Globe className="h-4 w-4" /> Portafolio
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://tuportafolio.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Skills & Experience */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="experienceYears"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Años de experiencia *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">Menos de 1 año</SelectItem>
                              <SelectItem value="1">1-2 años</SelectItem>
                              <SelectItem value="3">3-5 años</SelectItem>
                              <SelectItem value="5">5-10 años</SelectItem>
                              <SelectItem value="10">Más de 10 años</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="skills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Habilidades principales *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="React, Node.js, Python..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Separadas por comas</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Motivation */}
                  <FormField
                    control={form.control}
                    name="motivation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>¿Por qué quieres unirte a TAMV? *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Cuéntanos qué te motiva a ser parte del gremio latino de desarrolladores..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Mínimo 50 caracteres</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit */}
                  <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                      Al registrarte aceptas los{" "}
                      <Link to="/terms" className="text-primary underline">
                        términos de servicio
                      </Link>{" "}
                      y la{" "}
                      <Link to="/privacy" className="text-primary underline">
                        política de privacidad
                      </Link>
                      .
                    </p>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="shrink-0"
                    >
                      {isSubmitting ? "Registrando..." : "Registrarme"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
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

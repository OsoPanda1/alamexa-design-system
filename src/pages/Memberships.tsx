import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Check, Crown, Zap, Star, Shield } from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Gratis",
    description: "Para comenzar a explorar",
    price: 0,
    features: [
      "1 publicación por semana",
      "Acceso al marketplace",
      "Chat básico",
      "Soporte por email",
    ],
    limitations: [
      "Sin analytics",
      "Sin boosts",
      "Publicidad visible",
    ],
    icon: Star,
    popular: false,
  },
  {
    id: "basic",
    name: "Básico",
    description: "Para vendedores activos",
    price: 99,
    features: [
      "10 publicaciones por mes",
      "Analytics básicos",
      "Soporte prioritario",
      "Sin publicidad",
      "1 boost gratis/mes",
    ],
    limitations: [],
    icon: Zap,
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Para profesionales del trueque",
    price: 199,
    features: [
      "Publicaciones ilimitadas",
      "Analytics avanzados",
      "Soporte 24/7",
      "Sin publicidad",
      "5 boosts gratis/mes",
      "Badge verificado",
      "Acceso anticipado a funciones",
      "API de integraciones",
    ],
    limitations: [],
    icon: Crown,
    popular: true,
  },
];

export default function Memberships() {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container-alamexa pt-24 pb-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge className="bg-success/10 text-success border-success/20 mb-4">
            <Crown className="h-3 w-3 mr-1" />
            Membresías
          </Badge>
          <h1 className="text-display text-foreground mb-4">
            Elige tu Plan
          </h1>
          <p className="text-lg text-muted-foreground">
            Desbloquea todo el potencial de ALAMEXA con nuestras membresías premium.
            Más publicaciones, más visibilidad, más oportunidades.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const isCurrentPlan = profile?.membership_tier === plan.id;
            const Icon = plan.icon;

            return (
              <Card
                key={plan.id}
                className={`relative border-border/30 bg-card/50 ${
                  plan.popular ? "border-success/50 shadow-lg shadow-success/10" : ""
                } ${isCurrentPlan ? "ring-2 ring-accent" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-success text-success-foreground">
                      Más Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pt-8">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    plan.popular ? "bg-success/20" : "bg-muted"
                  }`}>
                    <Icon className={`h-6 w-6 ${plan.popular ? "text-success" : "text-accent"}`} />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="text-center">
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">
                      ${plan.price}
                    </span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>

                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation) => (
                      <li key={limitation} className="flex items-start gap-2 opacity-50">
                        <span className="h-5 w-5 shrink-0 text-center">✕</span>
                        <span className="text-sm text-muted-foreground">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  {isCurrentPlan ? (
                    <Button variant="outline" className="w-full" disabled>
                      Plan Actual
                    </Button>
                  ) : plan.price === 0 ? (
                    <Button variant="outline" className="w-full" disabled>
                      Plan Gratuito
                    </Button>
                  ) : (
                    <Button
                      variant={plan.popular ? "success" : "default"}
                      className="w-full"
                      onClick={() => {
                        if (!user) {
                          // Keep SPA navigation (no full reload)
                          window.history.pushState({}, "", "/auth");
                          window.dispatchEvent(new PopStateEvent("popstate"));
                        } else {
                          // TODO: Implement payment flow
                        }
                      }}
                    >
                      {user ? "Seleccionar Plan" : "Iniciar Sesión"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-headline text-foreground text-center mb-12">
            ¿Por qué ser miembro Pro?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="shrink-0 w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Visibilidad Máxima</h3>
                <p className="text-sm text-muted-foreground">
                  Tus publicaciones aparecen primero en las búsquedas y obtienen más vistas.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Badge Verificado</h3>
                <p className="text-sm text-muted-foreground">
                  Genera confianza con compradores mostrando tu insignia de verificación.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Crown className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Soporte Prioritario</h3>
                <p className="text-sm text-muted-foreground">
                  Atención 24/7 con respuesta en menos de 2 horas para cualquier problema.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Analytics Avanzados</h3>
                <p className="text-sm text-muted-foreground">
                  Conoce a tu audiencia, optimiza tus precios y maximiza tus ventas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            ¿Tienes preguntas sobre las membresías?
          </p>
          <Link to="/support">
            <Button variant="outline">Contactar Soporte</Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

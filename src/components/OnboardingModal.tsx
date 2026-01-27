import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  ShoppingBag,
  Shield,
  Star,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const steps = [
  {
    id: 1,
    icon: Sparkles,
    title: "Bienvenido a ALAMEXA",
    subtitle: "La nueva era del comercio inteligente",
    description:
      "ALAMEXA fusiona lo mejor de Mercado Libre, Temu, Alibaba y Shopify en una plataforma revolucionaria. No es solo comprar y vender: es un ecosistema P2P elegante, seguro y exclusivo diseñado para latinos.",
    features: [
      "Interfaz premium inspirada en los mejores marketplaces",
      "Diseñado por y para la comunidad latina",
      "Tecnología de vanguardia con IA integrada",
    ],
    example: "Juan encontró su iPhone soñado y lo intercambió por su consola PS5 + $2,000 MXN. ¡Sin intermediarios, con total seguridad!",
    gradient: "from-accent/20 to-flag-green/20",
  },
  {
    id: 2,
    icon: RefreshCw,
    title: "Sistema de Trueque Inteligente",
    subtitle: "La joya de ALAMEXA",
    description:
      "¿Tienes algo que no usas? Intercámbialo por lo que necesitas. Nuestro algoritmo calcula valores justos, y el sistema de custodia (escrow) asegura que ambas partes cumplan.",
    features: [
      "Valoración automática por IA",
      "Trueque puro o con ajuste de efectivo",
      "Custodia segura hasta confirmar entrega",
    ],
    example: "María ofreció su bicicleta Trek ($8,500) por la cámara Sony de Pedro ($9,000). Pedro aceptó y María pagó $500 de diferencia. ¡Ambos felices!",
    gradient: "from-flag-green/20 to-accent/20",
  },
  {
    id: 3,
    icon: ShoppingBag,
    title: "Compra y Venta Tradicional",
    subtitle: "El marketplace que conoces, mejorado",
    description:
      "Además del trueque, puedes comprar o vender de forma tradicional con pagos seguros. Publica con fotos, videos, audio y textos para maximizar tus ventas.",
    features: [
      "Pagos con tarjeta, transferencia y más",
      "Publicaciones con multimedia (fotos, video, audio)",
      "Categorías especializadas y filtros avanzados",
    ],
    example: "Carlos publicó su MacBook en 5 minutos con 4 fotos y un video. Recibió 3 ofertas en las primeras 2 horas.",
    gradient: "from-accent/20 to-cherry/10",
  },
  {
    id: 4,
    icon: Shield,
    title: "Seguridad de Nivel Bancario",
    subtitle: "Tu tranquilidad es nuestra obsesión",
    description:
      "ALAMEXA actúa como intermediario confiable. Verificamos usuarios, evaluamos productos, detectamos fraudes con IA y protegemos cada transacción.",
    features: [
      "Verificación de identidad (KYC) opcional",
      "Sistema de reputación con reseñas verificadas",
      "Detección de fraudes por inteligencia artificial",
    ],
    example: "El sistema detectó un intento de estafa y bloqueó al usuario malicioso antes de que pudiera hacer daño. Tu dinero siempre protegido.",
    gradient: "from-cherry/10 to-accent/20",
  },
  {
    id: 5,
    icon: Star,
    title: "Membresías para Cada Necesidad",
    subtitle: "Elige tu nivel de experiencia",
    description:
      "Desde el plan Gratis hasta Elite, elige lo que necesitas. Los miembros Premium y Elite disfrutan de beneficios exclusivos, menor comisión y mayor visibilidad.",
    features: [
      "Free: Publicaciones limitadas, funciones básicas",
      "Premium ($199/mes): Sin límites, menor comisión",
      "Elite ($499/mes): Prioridad total, soporte VIP",
    ],
    example: "Los vendedores Premium venden 3x más rápido gracias a su posicionamiento destacado en las búsquedas.",
    gradient: "from-accent/20 to-flag-green/20",
  },
];

export function OnboardingModal({
  isOpen,
  onClose,
  onComplete,
}: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
      onClose();
    } else {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
    onClose();
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden bg-card border-border/50">
        {/* Header con gradiente */}
        <div
          className={cn(
            "relative h-48 bg-gradient-to-br flex items-center justify-center",
            step.gradient
          )}
        >
          {/* Patrón de fondo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-foreground/20 to-transparent" />
          </div>

          {/* Icono animado */}
          <motion.div
            key={step.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative"
          >
            <div className="w-24 h-24 rounded-2xl bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-lg border border-border/50">
              <step.icon className="w-12 h-12 text-accent" />
            </div>
          </motion.div>

          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Indicadores de paso */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentStep ? 1 : -1);
                  setCurrentStep(index);
                }}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  index === currentStep
                    ? "w-6 bg-accent"
                    : "w-1.5 bg-foreground/30 hover:bg-foreground/50"
                )}
              />
            ))}
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="text-center mb-6">
                <span className="text-xs text-accent font-medium uppercase tracking-wider">
                  {step.subtitle}
                </span>
                <h2 className="text-2xl font-bold text-foreground mt-1 mb-3">
                  {step.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-4">
                {step.features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                  >
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-accent" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* Example box */}
              {step.example && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-4 rounded-lg bg-accent/5 border border-accent/20 mb-6"
                >
                  <p className="text-xs text-accent font-medium mb-1">💡 Ejemplo real:</p>
                  <p className="text-sm text-muted-foreground italic">
                    {step.example}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navegación */}
          <div className="flex items-center justify-between pt-4 border-t border-border/30">
            <button
              onClick={handleSkip}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Saltar tutorial
            </button>

            <div className="flex gap-2">
              {!isFirstStep && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>
              )}
              <Button
                size="sm"
                onClick={handleNext}
                className="gap-1 bg-accent text-accent-foreground"
              >
                {isLastStep ? (
                  <>
                    ¡Comenzar!
                    <Sparkles className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook para manejar el onboarding
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true);

  useEffect(() => {
    const seen = localStorage.getItem("alamexa-onboarding-seen");
    if (!seen) {
      setHasSeenOnboarding(false);
      // Pequeño delay para no mostrar inmediatamente
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem("alamexa-onboarding-seen", "true");
    setHasSeenOnboarding(true);
    setShowOnboarding(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem("alamexa-onboarding-seen");
    setHasSeenOnboarding(false);
    setShowOnboarding(true);
  };

  return {
    showOnboarding,
    setShowOnboarding,
    hasSeenOnboarding,
    completeOnboarding,
    resetOnboarding,
  };
}

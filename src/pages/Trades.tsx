import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  RefreshCw,
  ArrowLeftRight,
  Clock,
  CheckCircle2,
  XCircle,
  MessageCircle,
  User,
  Package,
  ChevronRight,
  Filter,
  Plus,
  AlertTriangle,
  Handshake,
  Send,
  ArrowRight,
} from "lucide-react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useTrades } from "@/hooks/useTrades";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string; icon: any }> = {
    pending: {
      label: "Pendiente",
      className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      icon: Clock,
    },
    accepted: {
      label: "Aceptado",
      className: "bg-flag-green/20 text-green-400 border-flag-green/30",
      icon: CheckCircle2,
    },
    rejected: {
      label: "Rechazado",
      className: "bg-cherry/20 text-red-400 border-cherry/30",
      icon: XCircle,
    },
    completed: {
      label: "Completado",
      className: "bg-accent/20 text-accent border-accent/30",
      icon: Handshake,
    },
    cancelled: {
      label: "Cancelado",
      className: "bg-muted text-muted-foreground border-border",
      icon: AlertTriangle,
    },
  };

  const { label, className, icon: Icon } = config[status] || config.pending;

  return (
    <Badge variant="outline" className={cn("gap-1", className)}>
      <Icon className="w-3 h-3" />
      {label}
    </Badge>
  );
}

// Trade card component
function TradeCard({
  proposal,
  type,
  onRespond,
  onComplete,
}: {
  proposal: any;
  type: "sent" | "received";
  onRespond?: (id: string, response: "accepted" | "rejected") => void;
  onComplete?: (id: string) => void;
}) {
  const isReceived = type === "received";
  const isPending = proposal.status === "pending";
  const isAccepted = proposal.status === "accepted";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className="overflow-hidden border-border/30 bg-card/50 hover:border-accent/40 transition-all duration-300">
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Información del trueque */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <StatusBadge status={proposal.status} />
                <span className="text-xs text-muted-foreground">
                  {new Date(proposal.created_at).toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Usuarios involucrados */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border-2 border-border">
                    <AvatarFallback>
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {isReceived ? "De:" : "Para:"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Usuario #{isReceived ? proposal.proposer_id?.slice(0, 8) : proposal.receiver_id?.slice(0, 8)}
                    </p>
                  </div>
                </div>

                <ArrowLeftRight className="w-5 h-5 text-accent shrink-0" />

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center">
                    <Package className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Producto</p>
                    <p className="text-xs text-muted-foreground">Ver detalles</p>
                  </div>
                </div>
              </div>

              {/* Mensaje */}
              {proposal.message && (
                <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/30">
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <MessageCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{proposal.message}</span>
                  </p>
                </div>
              )}

              {/* Cash difference */}
              {proposal.cash_difference > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1">
                    +${proposal.cash_difference.toLocaleString()} MXN
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {proposal.cash_from === "proposer" ? "Tú agregas" : "Te agregan"}
                  </span>
                </div>
              )}
            </div>

            {/* Acciones */}
            <div className="flex flex-col gap-2 lg:w-40 shrink-0">
              {isReceived && isPending && onRespond && (
                <>
                  <Button
                    size="sm"
                    className="w-full bg-flag-green hover:bg-flag-green/90 text-foreground gap-1"
                    onClick={() => onRespond(proposal.id, "accepted")}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Aceptar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-cherry border-cherry/30 hover:bg-cherry/10 gap-1"
                    onClick={() => onRespond(proposal.id, "rejected")}
                  >
                    <XCircle className="w-4 h-4" />
                    Rechazar
                  </Button>
                </>
              )}

              {isAccepted && onComplete && (
                <Button
                  size="sm"
                  className="w-full bg-accent text-accent-foreground gap-1"
                  onClick={() => onComplete(proposal.id)}
                >
                  <Handshake className="w-4 h-4" />
                  Completar
                </Button>
              )}

              {!isPending && !isAccepted && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full text-muted-foreground gap-1"
                >
                  <ChevronRight className="w-4 h-4" />
                  Ver detalles
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Empty state component
function EmptyState({ type }: { type: "received" | "sent" | "completed" }) {
  const configs: Record<string, { icon: any; title: string; description: string; action?: { label: string; href: string } }> = {
    received: {
      icon: RefreshCw,
      title: "Sin propuestas recibidas",
      description: "Cuando alguien quiera intercambiar contigo, aparecerá aquí",
    },
    sent: {
      icon: Send,
      title: "Sin propuestas enviadas",
      description: "Explora el marketplace y envía tu primera propuesta de trueque",
      action: { label: "Explorar productos", href: "/marketplace" },
    },
    completed: {
      icon: Handshake,
      title: "Sin trueques completados",
      description: "Cuando completes un intercambio, aparecerá en tu historial",
    },
  };

  const config = configs[type];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-16"
    >
      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
        <config.icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {config.title}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        {config.description}
      </p>
      {config.action && (
        <Link to={config.action.href}>
          <Button className="gap-2">
            {config.action.label}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      )}
    </motion.div>
  );
}

// Skeleton loader
function TradeSkeleton() {
  return (
    <div className="border border-border/30 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="w-5 h-5" />
        <Skeleton className="w-12 h-12 rounded-lg" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

export default function Trades() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    loading,
    pendingReceived,
    pendingSent,
    accepted: acceptedProposals,
    completed: completedProposals,
    respondToProposal,
    completeProposal,
  } = useTrades();

  const [activeTab, setActiveTab] = useState("received");

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleRespond = async (id: string, response: "accepted" | "rejected") => {
    await respondToProposal(id, response);
  };

  const handleComplete = async (id: string) => {
    await completeProposal(id);
  };

  // Stats
  const stats = [
    { label: "Recibidas", value: pendingReceived.length, icon: RefreshCw },
    { label: "Enviadas", value: pendingSent.length, icon: Send },
    { label: "Activas", value: acceptedProposals.length, icon: Handshake },
    { label: "Completadas", value: completedProposals.length, icon: CheckCircle2 },
  ];

  return (
    <>
      <Helmet>
        <title>Mis Trueques | ALAMEXA</title>
        <meta
          name="description"
          content="Gestiona tus propuestas de trueque, acepta ofertas y completa intercambios de forma segura."
        />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-20">
        {/* Header con stats */}
        <section className="py-8 lg:py-12 border-b border-border/30 bg-gradient-hero">
          <div className="container-alamexa">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  Mis Trueques
                </h1>
                <p className="text-muted-foreground">
                  Gestiona todas tus propuestas e intercambios
                </p>
              </div>

              <Link to="/marketplace">
                <Button className="gap-2 bg-accent text-accent-foreground">
                  <Plus className="w-5 h-5" />
                  Nueva propuesta
                </Button>
              </Link>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-card/30 border-border/30 hover:border-accent/30 transition-colors">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">
                          {stat.value}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {stat.label}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Lista de trueques */}
        <section className="py-8">
          <div className="container-alamexa">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-card/50 mb-6">
                <TabsTrigger value="received" className="gap-1">
                  Recibidas
                  {pendingReceived.length > 0 && (
                    <Badge className="ml-1 bg-cherry text-foreground text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full">
                      {pendingReceived.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="sent">Enviadas</TabsTrigger>
                <TabsTrigger value="active">Activas</TabsTrigger>
                <TabsTrigger value="history">Historial</TabsTrigger>
              </TabsList>

              <TabsContent value="received" className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TradeSkeleton key={i} />
                  ))
                ) : pendingReceived.length === 0 ? (
                  <EmptyState type="received" />
                ) : (
                  pendingReceived.map((proposal) => (
                    <TradeCard
                      key={proposal.id}
                      proposal={proposal}
                      type="received"
                      onRespond={handleRespond}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="sent" className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TradeSkeleton key={i} />
                  ))
                ) : pendingSent.length === 0 ? (
                  <EmptyState type="sent" />
                ) : (
                  pendingSent.map((proposal) => (
                    <TradeCard key={proposal.id} proposal={proposal} type="sent" />
                  ))
                )}
              </TabsContent>

              <TabsContent value="active" className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TradeSkeleton key={i} />
                  ))
                ) : acceptedProposals.length === 0 ? (
                  <div className="text-center py-16">
                    <Handshake className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No tienes trueques activos
                    </p>
                  </div>
                ) : (
                  acceptedProposals.map((proposal) => (
                    <TradeCard
                      key={proposal.id}
                      proposal={proposal}
                      type="received"
                      onComplete={handleComplete}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TradeSkeleton key={i} />
                  ))
                ) : completedProposals.length === 0 ? (
                  <EmptyState type="completed" />
                ) : (
                  completedProposals.map((proposal) => (
                    <TradeCard
                      key={proposal.id}
                      proposal={proposal}
                      type="received"
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-card/30 border-t border-border/30">
          <div className="container-alamexa text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <RefreshCw className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-3">
                ¿Cómo funciona el trueque?
              </h2>
              <p className="text-muted-foreground mb-6">
                ALAMEXA actúa como intermediario confiable. Verificamos usuarios,
                evaluamos productos y protegemos contra fraudes. Todo el proceso
                es transparente, justo y respaldado por la plataforma.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/about">
                  <Button variant="outline" className="gap-2">
                    Conocer más
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button className="gap-2 bg-accent text-accent-foreground">
                    Ir al Marketplace
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

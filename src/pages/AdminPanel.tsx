import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Shield,
  Activity,
  Users,
  Package,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  TrendingUp,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";

interface EventOutboxItem {
  id: string;
  event_type: string;
  origin: string;
  payload: any;
  published: boolean;
  published_at: string | null;
  created_at: string;
}

interface KYCVerification {
  id: string;
  user_id: string;
  full_name: string | null;
  document_type: string | null;
  verification_level: string;
  created_at: string;
  updated_at: string;
}

interface MarketplaceStats {
  totalProducts: number;
  activeProducts: number;
  totalTrades: number;
  pendingTrades: number;
  completedTrades: number;
  totalUsers: number;
  verifiedUsers: number;
  totalEscrow: number;
  pendingKYC: number;
  unpublishedEvents: number;
}

export default function AdminPanel() {
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const [events, setEvents] = useState<EventOutboxItem[]>([]);
  const [kycPending, setKycPending] = useState<KYCVerification[]>([]);
  const [stats, setStats] = useState<MarketplaceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setRefreshing(true);

    try {
      // Use service role via edge function for admin stats
      const [eventsRes, kycRes, productsRes, tradesRes, profilesRes, escrowRes] =
        await Promise.all([
          supabase.from("event_outbox").select("*").order("created_at", { ascending: false }).limit(50),
          supabase.from("kyc_verifications").select("*").in("verification_level", ["none", "pending", "documents_submitted"]).order("created_at", { ascending: false }),
          supabase.from("products").select("id, status", { count: "exact" }),
          supabase.from("trade_proposals").select("id, status", { count: "exact" }),
          supabase.from("profiles").select("id, is_verified", { count: "exact" }),
          supabase.from("escrow_transactions").select("id, amount, status", { count: "exact" }),
        ]);

      setEvents(eventsRes.data || []);
      setKycPending(kycRes.data as KYCVerification[] || []);

      const products = productsRes.data || [];
      const trades = tradesRes.data || [];
      const profiles = profilesRes.data || [];
      const escrows = escrowRes.data || [];

      setStats({
        totalProducts: productsRes.count || products.length,
        activeProducts: products.filter((p: any) => p.status === "active").length,
        totalTrades: tradesRes.count || trades.length,
        pendingTrades: trades.filter((t: any) => t.status === "pending").length,
        completedTrades: trades.filter((t: any) => t.status === "completed").length,
        totalUsers: profilesRes.count || profiles.length,
        verifiedUsers: profiles.filter((p: any) => p.is_verified).length,
        totalEscrow: escrows.reduce((sum: number, e: any) => sum + (Number(e.amount) || 0), 0),
        pendingKYC: (kycRes.data || []).length,
        unpublishedEvents: (eventsRes.data || []).filter((e: any) => !e.published).length,
      });
    } catch (err) {
      console.error("Admin fetch error:", err);
      toast.error("Error cargando datos del panel");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAdmin) fetchAll();
  }, [isAdmin, fetchAll]);

  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin && !loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pb-16 pt-24">
          <div className="container-alamexa text-center py-20">
            <Shield className="mx-auto h-16 w-16 text-destructive/50 mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Acceso Denegado</h1>
            <p className="text-muted-foreground">Necesitas permisos de administrador para acceder a este panel.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const statCards = stats
    ? [
        { label: "Usuarios", value: stats.totalUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Verificados", value: stats.verifiedUsers, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Productos", value: stats.totalProducts, icon: Package, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: "Activos", value: stats.activeProducts, icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Trueques", value: stats.totalTrades, icon: RefreshCw, color: "text-teal-500", bg: "bg-teal-500/10" },
        { label: "Pendientes", value: stats.pendingTrades, icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
        { label: "Completados", value: stats.completedTrades, icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
        { label: "Escrow (MXN)", value: stats.totalEscrow, icon: Shield, color: "text-red-500", bg: "bg-red-500/10" },
        { label: "KYC Pendientes", value: stats.pendingKYC, icon: FileText, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        { label: "Eventos sin publicar", value: stats.unpublishedEvents, icon: Activity, color: "text-indigo-500", bg: "bg-indigo-500/10" },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-16 pt-24">
        <div className="container-alamexa">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                Panel de Administración
              </h1>
              <p className="mt-1 text-muted-foreground">
                Monitoreo en tiempo real de ALAMEXA
              </p>
            </div>
            <Button
              onClick={fetchAll}
              disabled={refreshing}
              variant="outline"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
          </div>

          {/* Stats Grid */}
          {stats && (
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
              {statCards.map((s) => {
                const Icon = s.icon;
                return (
                  <Card key={s.label} className="border-border/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-lg p-2 ${s.bg}`}>
                          <Icon className={`h-5 w-5 ${s.color}`} />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">
                            {typeof s.value === "number" && s.label.includes("MXN")
                              ? `$${s.value.toLocaleString()}`
                              : s.value}
                          </p>
                          <p className="text-xs text-muted-foreground">{s.label}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="events" className="space-y-4">
            <TabsList className="bg-muted/30">
              <TabsTrigger value="events">
                <Activity className="mr-2 h-4 w-4" />
                Event Outbox
              </TabsTrigger>
              <TabsTrigger value="kyc">
                <FileText className="mr-2 h-4 w-4" />
                KYC Pendientes
              </TabsTrigger>
              <TabsTrigger value="federation">
                <TrendingUp className="mr-2 h-4 w-4" />
                Federación
              </TabsTrigger>
            </TabsList>

            {/* Events Tab */}
            <TabsContent value="events">
              <Card className="border-border/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Domain Events (Outbox)
                  </CardTitle>
                  <CardDescription>
                    Eventos de dominio emitidos por ALAMEXA. TAM los consume via webhook endpoint.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {events.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                      <Activity className="mx-auto mb-3 h-10 w-10 opacity-30" />
                      <p>No hay eventos registrados</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Origen</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Payload</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {events.map((event) => (
                            <TableRow key={event.id}>
                              <TableCell>
                                <Badge variant="outline" className="font-mono text-xs">
                                  {event.event_type}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">{event.origin}</TableCell>
                              <TableCell>
                                {event.published ? (
                                  <Badge className="bg-emerald-500/20 text-emerald-600">
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                    Publicado
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="bg-amber-500/20 text-amber-600">
                                    <Clock className="mr-1 h-3 w-3" />
                                    Pendiente
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {new Date(event.created_at).toLocaleString("es-MX")}
                              </TableCell>
                              <TableCell>
                                <code className="text-xs bg-muted/30 p-1 rounded max-w-[200px] block truncate">
                                  {JSON.stringify(event.payload)}
                                </code>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* KYC Tab */}
            <TabsContent value="kyc">
              <Card className="border-border/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Verificaciones KYC Pendientes
                  </CardTitle>
                  <CardDescription>
                    Solicitudes de verificación de identidad que requieren revisión.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {kycPending.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                      <CheckCircle className="mx-auto mb-3 h-10 w-10 opacity-30" />
                      <p>No hay verificaciones pendientes</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Documento</TableHead>
                            <TableHead>Nivel</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {kycPending.map((kyc) => (
                            <TableRow key={kyc.id}>
                              <TableCell className="font-medium">
                                {kyc.full_name || "Sin nombre"}
                              </TableCell>
                              <TableCell>{kyc.document_type || "—"}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    kyc.verification_level === "documents_submitted"
                                      ? "bg-amber-500/20 text-amber-600"
                                      : "bg-muted text-muted-foreground"
                                  }
                                >
                                  {kyc.verification_level}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {new Date(kyc.created_at).toLocaleString("es-MX")}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={async () => {
                                      const { error } = await supabase
                                        .from("kyc_verifications")
                                        .update({
                                          verification_level: "verified",
                                          verified_at: new Date().toISOString(),
                                          verified_by: user?.id,
                                        })
                                        .eq("id", kyc.id);
                                      if (error) {
                                        toast.error("Error al aprobar");
                                      } else {
                                        toast.success("KYC aprobado");
                                        fetchAll();
                                      }
                                    }}
                                  >
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                    Aprobar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={async () => {
                                      const { error } = await supabase
                                        .from("kyc_verifications")
                                        .update({
                                          verification_level: "rejected",
                                          rejected_at: new Date().toISOString(),
                                          rejection_reason: "No cumple requisitos",
                                        })
                                        .eq("id", kyc.id);
                                      if (error) {
                                        toast.error("Error al rechazar");
                                      } else {
                                        toast.success("KYC rechazado");
                                        fetchAll();
                                      }
                                    }}
                                  >
                                    <AlertTriangle className="mr-1 h-3 w-3" />
                                    Rechazar
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Federation Tab */}
            <TabsContent value="federation">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-border/30">
                  <CardHeader>
                    <CardTitle>Book API</CardTitle>
                    <CardDescription>Auto-descripción del módulo para TAM</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={async () => {
                        try {
                          const { data, error } = await supabase.functions.invoke("book-api");
                          if (error) throw error;
                          toast.success("Book API responde correctamente");
                          console.log("Book API response:", data);
                        } catch (err) {
                          toast.error("Error en Book API");
                          console.error(err);
                        }
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Probar Book API
                    </Button>
                    <div className="mt-4 rounded-lg bg-muted/20 p-3">
                      <p className="text-xs text-muted-foreground">
                        Endpoint: <code className="text-foreground">/functions/v1/book-api</code>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Retorna: capabilities, events, APIs, stats, federation config
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/30">
                  <CardHeader>
                    <CardTitle>Health Check</CardTitle>
                    <CardDescription>Estado del sistema y latencia</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={async () => {
                        try {
                          const { data, error } = await supabase.functions.invoke("health");
                          if (error) throw error;
                          toast.success(`Sistema: ${data.status} | Latencia DB: ${data.db_latency_ms}ms`);
                          console.log("Health response:", data);
                        } catch (err) {
                          toast.error("Error en Health Check");
                          console.error(err);
                        }
                      }}
                    >
                      <Activity className="mr-2 h-4 w-4" />
                      Probar Health
                    </Button>
                    <div className="mt-4 rounded-lg bg-muted/20 p-3">
                      <p className="text-xs text-muted-foreground">
                        Endpoint: <code className="text-foreground">/functions/v1/health</code>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Retorna: status, db_latency_ms, timestamp
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/30 md:col-span-2">
                  <CardHeader>
                    <CardTitle>Webhook Endpoint (para TAM)</CardTitle>
                    <CardDescription>
                      TAM consume eventos del outbox via este endpoint seguro
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="rounded-lg bg-muted/20 p-4">
                        <p className="text-sm font-medium text-foreground mb-2">Endpoints disponibles:</p>
                        <div className="space-y-2 text-xs text-muted-foreground font-mono">
                          <p><Badge variant="outline" className="mr-2">POST</Badge>/functions/v1/webhooks?action=poll — Obtener eventos pendientes</p>
                          <p><Badge variant="outline" className="mr-2">POST</Badge>/functions/v1/webhooks?action=ack — Confirmar eventos procesados</p>
                          <p><Badge variant="outline" className="mr-2">GET</Badge>/functions/v1/webhooks?action=stats — Estadísticas del outbox</p>
                        </div>
                      </div>
                      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                        <p className="text-xs text-amber-600 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Autenticación: Header <code>x-webhook-secret</code> o firma HMAC <code>x-webhook-signature</code>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}

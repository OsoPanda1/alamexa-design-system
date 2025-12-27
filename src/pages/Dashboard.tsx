import { useMemo, memo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useTrades } from "@/hooks/useTrades";
import { useProducts } from "@/hooks/useProducts";
import { useNotifications } from "@/hooks/useNotifications";
import { useLoading } from "@/contexts/LoadingContext";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Package,
  Repeat,
  Star,
  Bell,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  Eye,
} from "lucide-react";

/**
 * Responsabilidades de este archivo:
 * - Orquestar datos de hooks (trades, productos, notificaciones, perfil).
 * - Encender/apagar loader global en base a estados de carga.
 * - Componer el layout del dashboard usando sub-componentes puros y memoizados.
 */

// --------- Tipos auxiliares ---------

type StatConfig = {
  label: string;
  value: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  bgColor: string;
  href?: string;
};

// --------- Subcomponentes memoizados ---------

interface StatsGridProps {
  stats: StatConfig[];
}

const StatsGrid = memo(function StatsGrid({ stats }: StatsGridProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const clickable = !!stat.href;

        return (
          <Card
            key={stat.label}
            onClick={clickable ? () => navigate(stat.href!) : undefined}
            className={`bg-card/50 border-border/30 transition
              ${clickable ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-lg" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
});

const QuickActions = memo(function QuickActions() {
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      <Link to="/products/new">
        <Button variant="hero" size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Publicar producto
        </Button>
      </Link>
      <Link to="/catalog">
        <Button variant="outline" size="lg">
          <Eye className="mr-2 h-4 w-4" />
          Explorar trueques
        </Button>
      </Link>
    </div>
  );
});

interface PendingTradesCardProps {
  pendingReceived: any[];
  accepted: any[];
  tradesLoading: boolean;
}

const PendingTradesCard = memo(function PendingTradesCard({
  pendingReceived,
  accepted,
  tradesLoading,
}: PendingTradesCardProps) {
  const isEmpty = !tradesLoading && pendingReceived.length === 0;

  return (
    <Card className="bg-card/50 border-border/30 lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Repeat className="h-5 w-5 text-accent" />
              Propuestas recibidas
            </CardTitle>
            <CardDescription>
              Trueques que otros usuarios te han propuesto
            </CardDescription>
          </div>
          {pendingReceived.length > 0 && (
            <Badge variant="secondary" className="bg-success/20 text-success">
              {pendingReceived.length} pendientes
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {tradesLoading ? (
          <div className="py-6 text-center text-muted-foreground">
            Cargando trueques...
          </div>
        ) : isEmpty ? (
          <div className="py-8 text-center text-muted-foreground">
            <Repeat className="mx-auto mb-3 h-10 w-10 opacity-30" />
            <p>No tienes propuestas pendientes</p>
            <p className="text-sm">¡Publica más productos para recibir ofertas!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingReceived.slice(0, 5).map((proposal) => (
              <div
                key={proposal.id}
                className="flex items-center justify-between rounded-lg border border-border/20 bg-muted/20 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Nueva propuesta de trueque
                  </p>
                  {/* Si tu API lo permite, aquí puedes incluir info del producto ofrecido/solicitado */}
                  {proposal.offered_product_title && proposal.requested_product_title && (
                    <p className="text-xs text-muted-foreground">
                      Ofrecen: {proposal.offered_product_title} por{" "}
                      {proposal.requested_product_title}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(proposal.created_at).toLocaleDateString("es-MX")}
                  </p>
                </div>
                <Link to={`/trades/${proposal.id}`}>
                  <Button size="sm" variant="outline">
                    Ver
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Info contextual: trueques en progreso */}
        {!tradesLoading && accepted.length > 0 && (
          <p className="mt-4 text-xs text-muted-foreground">
            Tienes {accepted.length} trueque(s) en progreso. Revisa tu pestaña de
            trueques para administrar detalles.
          </p>
        )}
      </CardContent>
    </Card>
  );
});

interface NotificationsCardProps {
  notifications: any[];
  unreadCount: number;
}

const NotificationsCard = memo(function NotificationsCard({
  notifications,
  unreadCount,
}: NotificationsCardProps) {
  const isEmpty = notifications.length === 0;

  return (
    <Card className="bg-card/50 border-border/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Bell className="h-5 w-5 text-accent" />
            Notificaciones
          </CardTitle>
          {unreadCount > 0 && <Badge variant="destructive">{unreadCount}</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="py-6 text-center text-muted-foreground">
            <Bell className="mx-auto mb-2 h-8 w-8 opacity-30" />
            <p className="text-sm">Sin notificaciones</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.slice(0, 5).map((notification) => (
              <div
                key={notification.id}
                className={`rounded-lg border p-3 ${
                  notification.read
                    ? "border-border/20 bg-muted/10"
                    : "border-accent/20 bg-accent/5"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {notification.title}
                  </p>
                  {notification.type && (
                    <Badge
                      variant="outline"
                      className="ml-2 text-[10px] uppercase tracking-wide"
                    >
                      {notification.type}
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {notification.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

interface MyProductsCardProps {
  myProducts: any[];
  productsLoading: boolean;
}

const MyProductsCard = memo(function MyProductsCard({
  myProducts,
  productsLoading,
}: MyProductsCardProps) {
  const isEmpty = !productsLoading && myProducts.length === 0;

  return (
    <Card className="bg-card/50 border-border/30 lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Package className="h-5 w-5 text-accent" />
              Mis productos
            </CardTitle>
            <CardDescription>
              Productos que has publicado para truequear
            </CardDescription>
          </div>
          <Link to="/products/new">
            <Button size="sm" variant="ghost">
              <Plus className="mr-1 h-4 w-4" />
              Nuevo
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {productsLoading ? (
          <div className="py-6 text-center text-muted-foreground">
            Cargando productos...
          </div>
        ) : isEmpty ? (
          <div className="py-8 text-center text-muted-foreground">
            <Package className="mx-auto mb-3 h-10 w-10 opacity-30" />
            <p>No has publicado productos aún</p>
            <Link to="/products/new">
              <Button variant="outline" size="sm" className="mt-3">
                <Plus className="mr-1 h-4 w-4" />
                Publicar mi primer producto
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {myProducts.slice(0, 4).map((product) => (
              <div
                key={product.id}
                className="rounded-lg border border-border/20 bg-muted/20 p-3"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {product.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.category}
                    </p>
                    {product.created_at && (
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        Publicado el{" "}
                        {new Date(product.created_at).toLocaleDateString("es-MX")}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={product.status === "active" ? "default" : "secondary"}
                    className={
                      product.status === "active"
                        ? "bg-success/20 text-success"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {product.status === "active" ? "Activo" : "Pausado"}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {product.views || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {product.favorites_count || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

interface SummaryCardProps {
  totalViews: number;
  acceptedCount: number;
  membershipTier: string;
  walletBalance: number;
  reputationScore: number;
  totalTrades: number;
}

const SummaryCard = memo(function SummaryCard({
  totalViews,
  acceptedCount,
  membershipTier,
  walletBalance,
  reputationScore,
  totalTrades,
}: SummaryCardProps) {
  const completionRate = useMemo(() => {
    // Si tuvieras cantidad de completados, la puedes usar aquí.
    const totalRelevant = acceptedCount + totalTrades;
    if (!totalRelevant) return 0;
    return Math.round((totalTrades / totalRelevant) * 100);
  }, [acceptedCount, totalTrades]);

  const avgViewsPerActiveTrade = useMemo(() => {
    if (!totalTrades) return 0;
    return Math.round(totalViews / totalTrades);
  }, [totalViews, totalTrades]);

  return (
    <Card className="bg-card/50 border-border/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <TrendingUp className="h-5 w-5 text-accent" />
          Resumen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Vistas totales</span>
          <span className="text-lg font-semibold text-foreground">
            {totalViews}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Trueques en progreso</span>
          <span className="text-lg font-semibold text-foreground">
            {acceptedCount}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Ratio de trueques completados
          </span>
          <span className="text-lg font-semibold text-foreground">
            {completionRate}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Vistas promedio por trueque
          </span>
          <span className="text-lg font-semibold text-foreground">
            {avgViewsPerActiveTrade}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Reputación</span>
          <span className="text-lg font-semibold text-cherry">
            {reputationScore}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Membresía</span>
          <Badge variant="outline" className="capitalize">
            {membershipTier || "free"}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Wallet</span>
          <span className="text-lg font-semibold text-success">
            ${walletBalance.toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
});

// --------- Componente principal ---------

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { pendingReceived, pendingSent, accepted, completed, loading: tradesLoading } =
    useTrades();
  const { myProducts, loading: productsLoading } = useProducts();
  const { notifications, unreadCount } = useNotifications();
  const { isLoading, setIsLoading } = useLoading();

  // Sin user => redirigir (opcional, dependiendo de tu router)
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/auth", { replace: true });
    }
  }, [user, navigate]);

  // Encender/apagar loader global en base a cargas de hooks
  useEffect(() => {
    const anyLoading = tradesLoading || productsLoading;
    if (anyLoading !== isLoading) {
      setIsLoading(anyLoading);
    }
  }, [tradesLoading, productsLoading, isLoading, setIsLoading]);

  const activeProducts = useMemo(
    () => myProducts.filter((p) => p.status === "active"),
    [myProducts],
  );

  const totalViews = useMemo(
    () => myProducts.reduce((acc, p) => acc + (p.views || 0), 0),
    [myProducts],
  );

  const stats: StatConfig[] = useMemo(
    () => [
      {
        label: "Productos activos",
        value: activeProducts.length,
        icon: Package,
        color: "text-accent",
        bgColor: "bg-accent/10",
        href: "/products?filter=active",
      },
      {
        label: "Trueques pendientes",
        value: pendingReceived.length + pendingSent.length,
        icon: Clock,
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
        href: "/trades?filter=pending",
      },
      {
        label: "Trueques completados",
        value: profile?.total_trades || completed.length,
        icon: CheckCircle,
        color: "text-success",
        bgColor: "bg-success/10",
        href: "/trades?filter=completed",
      },
      {
        label: "Reputación",
        value: profile?.reputation_score || 0,
        icon: Star,
        color: "text-cherry",
        bgColor: "bg-cherry/10",
        href: "/account?tab=profile",
      },
    ],
    [
      activeProducts.length,
      pendingReceived.length,
      pendingSent.length,
      profile?.total_trades,
      profile?.reputation_score,
      completed.length,
    ],
  );

  const firstName = profile?.full_name?.split(" ")[0] || "Truequero";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-16 pt-24">
        <div className="container-alamexa">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-headline text-foreground">
              ¡Hola, {firstName}!
            </h1>
            <p className="mt-2 text-muted-foreground">
              Bienvenido a tu panel de control de Alamexa
            </p>
          </div>

          {/* Stats */}
          <StatsGrid stats={stats} />

          {/* Acciones rápidas */}
          <QuickActions />

          {/* Grid principal */}
          <div className="grid gap-6 lg:grid-cols-3">
            <PendingTradesCard
              pendingReceived={pendingReceived}
              accepted={accepted}
              tradesLoading={tradesLoading}
            />

            <NotificationsCard
              notifications={notifications}
              unreadCount={unreadCount}
            />

            <MyProductsCard
              myProducts={myProducts}
              productsLoading={productsLoading}
            />

            <SummaryCard
              totalViews={totalViews}
              acceptedCount={accepted.length}
              membershipTier={profile?.membership_tier || "free"}
              walletBalance={profile?.wallet_balance || 0}
              reputationScore={profile?.reputation_score || 0}
              totalTrades={profile?.total_trades || completed.length}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default memo(Dashboard);

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useTrades } from "@/hooks/useTrades";
import { useProducts } from "@/hooks/useProducts";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
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
  XCircle,
  Eye
} from "lucide-react";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { pendingReceived, pendingSent, accepted, completed, loading: tradesLoading } = useTrades();
  const { myProducts, loading: productsLoading } = useProducts();
  const { notifications, unreadCount } = useNotifications();

  const activeProducts = myProducts.filter(p => p.status === 'active');
  const totalViews = myProducts.reduce((acc, p) => acc + (p.views || 0), 0);

  const stats = [
    {
      label: "Productos Activos",
      value: activeProducts.length,
      icon: Package,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Trueques Pendientes",
      value: pendingReceived.length + pendingSent.length,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Trueques Completados",
      value: profile?.total_trades || completed.length,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Reputación",
      value: profile?.reputation_score || 0,
      icon: Star,
      color: "text-cherry",
      bgColor: "bg-cherry/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container-alamexa">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-headline text-foreground">
              ¡Hola, {profile?.full_name?.split(' ')[0] || 'Truequero'}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Bienvenido a tu panel de control de Alamexa
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="bg-card/50 border-border/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Link to="/products/new">
              <Button variant="hero" size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Publicar Producto
              </Button>
            </Link>
            <Link to="/catalog">
              <Button variant="outline" size="lg">
                <Eye className="h-4 w-4 mr-2" />
                Explorar Trueques
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Pending Proposals Received */}
            <Card className="bg-card/50 border-border/30 lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Repeat className="h-5 w-5 text-accent" />
                      Propuestas Recibidas
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
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-16 bg-muted/30 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : pendingReceived.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Repeat className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p>No tienes propuestas pendientes</p>
                    <p className="text-sm">¡Publica más productos para recibir ofertas!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingReceived.slice(0, 5).map((proposal) => (
                      <div
                        key={proposal.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/20"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Nueva propuesta de trueque
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(proposal.created_at).toLocaleDateString('es-MX')}
                          </p>
                        </div>
                        <Link to={`/trades/${proposal.id}`}>
                          <Button size="sm" variant="outline">
                            Ver <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-card/50 border-border/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Bell className="h-5 w-5 text-accent" />
                    Notificaciones
                  </CardTitle>
                  {unreadCount > 0 && (
                    <Badge variant="destructive">{unreadCount}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Sin notificaciones</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border ${
                          notification.read 
                            ? 'bg-muted/10 border-border/20' 
                            : 'bg-accent/5 border-accent/20'
                        }`}
                      >
                        <p className="text-sm font-medium text-foreground">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* My Products */}
            <Card className="bg-card/50 border-border/30 lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Package className="h-5 w-5 text-accent" />
                      Mis Productos
                    </CardTitle>
                    <CardDescription>
                      Productos que has publicado para truequear
                    </CardDescription>
                  </div>
                  <Link to="/products/new">
                    <Button size="sm" variant="ghost">
                      <Plus className="h-4 w-4 mr-1" />
                      Nuevo
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-24 bg-muted/30 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : myProducts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p>No has publicado productos aún</p>
                    <Link to="/products/new">
                      <Button variant="outline" size="sm" className="mt-3">
                        <Plus className="h-4 w-4 mr-1" />
                        Publicar mi primer producto
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {myProducts.slice(0, 4).map((product) => (
                      <div
                        key={product.id}
                        className="p-3 rounded-lg bg-muted/20 border border-border/20"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {product.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {product.category}
                            </p>
                          </div>
                          <Badge 
                            variant={product.status === 'active' ? 'default' : 'secondary'}
                            className={product.status === 'active' ? 'bg-success/20 text-success' : ''}
                          >
                            {product.status === 'active' ? 'Activo' : 'Pausado'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
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

            {/* Stats Summary */}
            <Card className="bg-card/50 border-border/30">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Resumen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Vistas totales</span>
                  <span className="text-lg font-semibold text-foreground">{totalViews}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Trueques en progreso</span>
                  <span className="text-lg font-semibold text-foreground">{accepted.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Membresía</span>
                  <Badge variant="outline" className="capitalize">
                    {profile?.membership_tier || 'free'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Wallet</span>
                  <span className="text-lg font-semibold text-success">
                    ${profile?.wallet_balance?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;

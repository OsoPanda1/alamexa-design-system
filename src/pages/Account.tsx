import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  User,
  CreditCard,
  Package,
  Wallet,
  Shield,
  Star,
  Edit,
  Plus,
  Trash2,
  Crown,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethod {
  id: string;
  type: string;
  last_four: string | null;
  brand: string | null;
  is_default: boolean;
}

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
}

interface ProfileFormData {
  full_name: string;
  username: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  bio: string;
}

export default function Account() {
  const navigate = useNavigate();
  const { user, profile, loading, signOut, updateProfile } = useAuth();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: "",
    username: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    bio: "",
  });

  // Redirección si no hay sesión
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, loading, navigate]);

  // Inicializar formulario con perfil
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        username: profile.username || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        postal_code: profile.postal_code || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  const fetchPaymentMethods = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoadingPayments(true);
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPaymentMethods(data ?? []);
    } catch (err) {
      console.error("Error fetching payment methods:", err);
      toast({
        title: "Error al cargar métodos de pago",
        description: "Intenta de nuevo más tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPayments(false);
    }
  }, [user, toast]);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoadingOrders(true);
      const { data, error } = await supabase
        .from("orders")
        .select("id, total, status, created_at")
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setOrders(data ?? []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast({
        title: "Error al cargar pedidos",
        description: "No pudimos obtener tu historial de compras.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingOrders(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      fetchPaymentMethods();
      fetchOrders();
    }
  }, [user, fetchPaymentMethods, fetchOrders]);

  const handleChange =
    (field: keyof ProfileFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSave = async () => {
    if (!profile) return;
    try {
      setIsSaving(true);
      const { error } = await updateProfile(formData);
      if (error) {
        toast({
          title: "Error al actualizar perfil",
          description: error.message ?? "Intenta nuevamente.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Perfil actualizado",
        description: "Tus cambios se guardaron correctamente.",
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      toast({
        title: "Error inesperado",
        description: "No se pudo guardar tu perfil.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    try {
      const { error } = await supabase
        .from("payment_methods")
        .delete()
        .eq("id", id);
      if (error) throw error;

      setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
      toast({ title: "Método de pago eliminado" });
    } catch (err) {
      console.error("Error deleting payment method:", err);
      toast({
        title: "Error al eliminar método de pago",
        description: "Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      pending: "secondary",
      confirmed: "default",
      shipped: "default",
      delivered: "default",
      cancelled: "destructive",
    };
    return (
      <Badge variant={variants[status] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getMembershipBadge = (tier: string) => {
    const config: Record<
      string,
      { label: string; className: string }
    > = {
      free: {
        label: "Gratis",
        className: "bg-muted text-muted-foreground",
      },
      basic: {
        label: "Básico",
        className: "bg-accent text-accent-foreground",
      },
      pro: {
        label: "Pro",
        className: "bg-success text-success-foreground",
      },
    };
    return config[tier] || config.free;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user || !profile) return null;

  const membershipConfig = getMembershipBadge(profile.membership_tier);
  const formattedWalletBalance = useMemo(
    () =>
      typeof profile.wallet_balance === "number"
        ? profile.wallet_balance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : "0.00",
    [profile.wallet_balance],
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container-alamexa pb-16 pt-24">
        {/* Breadcrumb */}
        <nav
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="hover:text-foreground">
            Inicio
          </Link>
          <span>/</span>
          <span className="text-foreground">Mi Cuenta</span>
        </nav>

        {/* Profile Header */}
        <section className="mb-8 flex flex-col items-start gap-6 md:flex-row md:items-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback className="bg-muted text-2xl">
              {profile.full_name?.charAt(0) ||
                user.email?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">
                {profile.full_name || "Usuario"}
              </h1>
              <Badge className={membershipConfig.className}>
                <Crown className="mr-1 h-3 w-3" />
                {membershipConfig.label}
              </Badge>
            </div>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <span className="text-sm text-muted-foreground">
                <Star className="mr-1 inline h-4 w-4 text-accent" />
                {profile.reputation_score} reputación
              </span>
              <span className="text-sm text-muted-foreground">
                {profile.total_trades} intercambios
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={signOut}
            className="w-full md:w-auto"
          >
            Cerrar sesión
          </Button>
        </section>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="wallet">
              <Wallet className="mr-2 h-4 w-4" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="payments">
              <CreditCard className="mr-2 h-4 w-4" />
              Pagos
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="mr-2 h-4 w-4" />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="membership">
              <Crown className="mr-2 h-4 w-4" />
              Membresía
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="mr-2 h-4 w-4" />
              Seguridad
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-border/30 bg-card/50">
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle>Información personal</CardTitle>
                  <CardDescription>
                    Gestiona tu información de perfil
                  </CardDescription>
                </div>
                <Button
                  variant={isEditing ? "ghost" : "outline"}
                  onClick={() => setIsEditing((prev) => !prev)}
                >
                  {isEditing ? (
                    "Cancelar"
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nombre completo</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={handleChange("full_name")}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={handleChange("username")}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange("phone")}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={handleChange("address")}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={handleChange("city")}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={handleChange("state")}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Código Postal</Label>
                    <Input
                      id="postal_code"
                      value={formData.postal_code}
                      onChange={handleChange("postal_code")}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={handleChange("bio")}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="Cuéntanos sobre ti..."
                  />
                </div>

                {isEditing && (
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar cambios"
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet Tab */}
          <TabsContent value="wallet">
            <Card className="border-border/30 bg-card/50">
              <CardHeader>
                <CardTitle>Tu wallet</CardTitle>
                <CardDescription>Balance y transacciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-8 text-center">
                  <Wallet
                    className="mx-auto mb-4 h-12 w-12 text-accent"
                    aria-hidden="true"
                  />
                  <p className="mb-2 text-4xl font-bold text-foreground">
                    ${formattedWalletBalance}
                  </p>
                  <p className="text-muted-foreground">Balance disponible</p>
                  <div className="mt-6 flex justify-center gap-3">
                    <Button variant="success">Depositar</Button>
                    <Button variant="outline">Retirar</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card className="border-border/30 bg-card/50">
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle>Métodos de pago</CardTitle>
                  <CardDescription>
                    Gestiona tus tarjetas y cuentas
                  </CardDescription>
                </div>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar
                </Button>
              </CardHeader>
              <CardContent>
                {isLoadingPayments ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-accent" />
                  </div>
                ) : paymentMethods.length === 0 ? (
                  <div className="py-8 text-center">
                    <CreditCard
                      className="mx-auto mb-4 h-12 w-12 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <p className="text-muted-foreground">
                      No tienes métodos de pago guardados.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center justify-between rounded-lg bg-muted/30 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard
                            className="h-5 w-5 text-accent"
                            aria-hidden="true"
                          />
                          <div>
                            <p className="font-medium text-foreground">
                              {method.brand || method.type} ••••{" "}
                              {method.last_four}
                            </p>
                            {method.is_default && (
                              <Badge
                                variant="secondary"
                                className="mt-1 text-xs"
                              >
                                Predeterminado
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() =>
                            handleDeletePaymentMethod(method.id)
                          }
                          aria-label="Eliminar método de pago"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="border-border/30 bg-card/50">
              <CardHeader>
                <CardTitle>Mis pedidos</CardTitle>
                <CardDescription>Historial de compras</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-accent" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-8 text-center">
                    <Package
                      className="mx-auto mb-4 h-12 w-12 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <p className="text-muted-foreground">
                      No tienes pedidos aún.
                    </p>
                    <Link to="/catalog">
                      <Button variant="outline" className="mt-4">
                        Explorar catálogo
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between rounded-lg bg-muted/30 p-4"
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            Pedido #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(
                              order.created_at,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">
                            ${order.total.toLocaleString()}
                          </p>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    ))}
                    <Link to="/orders">
                      <Button variant="ghost" className="w-full">
                        Ver todos los pedidos
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Membership Tab */}
          <TabsContent value="membership">
            <Card className="border-border/30 bg-card/50">
              <CardHeader>
                <CardTitle>Membresía</CardTitle>
                <CardDescription>
                  Tu plan actual y opciones de upgrade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 py-4 text-center">
                  <Badge
                    className={`${membershipConfig.className} px-4 py-2 text-lg`}
                  >
                    <Crown className="mr-2 h-5 w-5" />
                    Plan {membershipConfig.label}
                  </Badge>
                  {profile.membership_expires_at && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Expira:{" "}
                      {new Date(
                        profile.membership_expires_at,
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <Separator className="my-6" />

                <div className="grid gap-4 md:grid-cols-3">
                  {/* Free */}
                  <Card
                    className={`border-border/30 ${
                      profile.membership_tier === "free"
                        ? "ring-2 ring-accent"
                        : ""
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">Gratis</CardTitle>
                      <CardDescription>Para comenzar</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-3xl font-bold">
                        $0
                        <span className="text-sm font-normal">/mes</span>
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• 1 publicación/semana</li>
                        <li>• Soporte básico</li>
                        <li>• Acceso al marketplace</li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Basic */}
                  <Card
                    className={`border-border/30 ${
                      profile.membership_tier === "basic"
                        ? "ring-2 ring-accent"
                        : ""
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">Básico</CardTitle>
                      <CardDescription>
                        Para vendedores activos
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-3xl font-bold">
                        $99
                        <span className="text-sm font-normal">/mes</span>
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• 10 publicaciones/mes</li>
                        <li>• Soporte prioritario</li>
                        <li>• Analytics básicos</li>
                      </ul>
                      {profile.membership_tier === "free" && (
                        <Link to="/memberships">
                          <Button
                            variant="outline"
                            className="mt-4 w-full"
                          >
                            Upgrade
                          </Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>

                  {/* Pro */}
                  <Card
                    className={`border-border/30 border-success/50 ${
                      profile.membership_tier === "pro"
                        ? "ring-2 ring-success"
                        : ""
                    }`}
                  >
                    <CardHeader>
                      <Badge className="mb-2 w-fit bg-success text-success-foreground">
                        Popular
                      </Badge>
                      <CardTitle className="text-lg">Pro</CardTitle>
                      <CardDescription>Para profesionales</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-3xl font-bold">
                        $199
                        <span className="text-sm font-normal">/mes</span>
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Publicaciones ilimitadas</li>
                        <li>• Soporte 24/7</li>
                        <li>• Analytics avanzados</li>
                        <li>• Boosts incluidos</li>
                      </ul>
                      {profile.membership_tier !== "pro" && (
                        <Link to="/memberships">
                          <Button
                            variant="success"
                            className="mt-4 w-full"
                          >
                            Upgrade
                          </Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="border-border/30 bg-card/50">
              <CardHeader>
                <CardTitle>Seguridad</CardTitle>
                <CardDescription>Protege tu cuenta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
                  <div>
                    <p className="font-medium text-foreground">
                      Cambiar contraseña
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Actualiza tu contraseña regularmente.
                    </p>
                  </div>
                  <Button variant="outline">Cambiar</Button>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
                  <div>
                    <p className="font-medium text-foreground">
                      Autenticación de dos factores
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Añade una capa extra de seguridad.
                    </p>
                  </div>
                  <Button variant="outline">Activar 2FA</Button>
                </div>

                <Separator />

                <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
                  <p className="font-medium text-destructive">
                    Zona de peligro
                  </p>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Estas acciones son permanentes y no se pueden deshacer.
                  </p>
                  <Button variant="destructive" size="sm">
                    Eliminar cuenta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}


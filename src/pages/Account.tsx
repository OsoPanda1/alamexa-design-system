import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Loader2
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

export default function Account() {
  const navigate = useNavigate();
  const { user, profile, loading, signOut, updateProfile } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    bio: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

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

  useEffect(() => {
    if (user) {
      fetchPaymentMethods();
      fetchOrders();
    }
  }, [user]);

  const fetchPaymentMethods = async () => {
    const { data } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("user_id", user?.id);
    if (data) setPaymentMethods(data);
  };

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("id, total, status, created_at")
      .eq("buyer_id", user?.id)
      .order("created_at", { ascending: false })
      .limit(5);
    if (data) setOrders(data);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await updateProfile(formData);
    setIsSaving(false);
    if (!error) {
      setIsEditing(false);
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    const { error } = await supabase
      .from("payment_methods")
      .delete()
      .eq("id", id);
    if (!error) {
      setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id));
      toast({ title: "Método de pago eliminado" });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      confirmed: "default",
      shipped: "default",
      delivered: "default",
      cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getMembershipBadge = (tier: string) => {
    const config: Record<string, { label: string; className: string }> = {
      free: { label: "Gratis", className: "bg-muted text-muted-foreground" },
      basic: { label: "Básico", className: "bg-accent text-accent-foreground" },
      pro: { label: "Pro", className: "bg-success text-success-foreground" },
    };
    return config[tier] || config.free;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user || !profile) return null;

  const membershipConfig = getMembershipBadge(profile.membership_tier);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container-alamexa py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground">Inicio</Link>
          <span>/</span>
          <span className="text-foreground">Mi Cuenta</span>
        </nav>

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback className="text-2xl bg-muted">
              {profile.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-foreground">
                {profile.full_name || "Usuario"}
              </h1>
              <Badge className={membershipConfig.className}>
                <Crown className="h-3 w-3 mr-1" />
                {membershipConfig.label}
              </Badge>
            </div>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-muted-foreground">
                <Star className="h-4 w-4 inline mr-1 text-accent" />
                {profile.reputation_score} reputación
              </span>
              <span className="text-sm text-muted-foreground">
                {profile.total_trades} intercambios
              </span>
            </div>
          </div>

          <Button variant="outline" onClick={() => signOut()}>
            Cerrar Sesión
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="wallet">
              <Wallet className="h-4 w-4 mr-2" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="payments">
              <CreditCard className="h-4 w-4 mr-2" />
              Pagos
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="h-4 w-4 mr-2" />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="membership">
              <Crown className="h-4 w-4 mr-2" />
              Membresía
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Seguridad
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-border/30 bg-card/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>Gestiona tu información de perfil</CardDescription>
                </div>
                <Button
                  variant={isEditing ? "ghost" : "outline"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancelar" : <><Edit className="h-4 w-4 mr-2" /> Editar</>}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre completo</Label>
                    <Input
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Teléfono</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Dirección</Label>
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ciudad</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Input
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Código Postal</Label>
                    <Input
                      value={formData.postal_code}
                      onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="Cuéntanos sobre ti..."
                  />
                </div>

                {isEditing && (
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Guardando...</>
                    ) : (
                      "Guardar Cambios"
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
                <CardTitle>Tu Wallet</CardTitle>
                <CardDescription>Balance y transacciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Wallet className="h-12 w-12 mx-auto text-accent mb-4" />
                  <p className="text-4xl font-bold text-foreground mb-2">
                    ${profile.wallet_balance?.toLocaleString() || "0.00"}
                  </p>
                  <p className="text-muted-foreground">Balance disponible</p>
                  <div className="flex gap-3 justify-center mt-6">
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
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Métodos de Pago</CardTitle>
                  <CardDescription>Gestiona tus tarjetas y cuentas</CardDescription>
                </div>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </CardHeader>
              <CardContent>
                {paymentMethods.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No tienes métodos de pago guardados</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-accent" />
                          <div>
                            <p className="font-medium text-foreground">
                              {method.brand || method.type} •••• {method.last_four}
                            </p>
                            {method.is_default && (
                              <Badge variant="secondary" className="text-xs">Predeterminado</Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDeletePaymentMethod(method.id)}
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
                <CardTitle>Mis Pedidos</CardTitle>
                <CardDescription>Historial de compras</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No tienes pedidos aún</p>
                    <Link to="/catalog">
                      <Button variant="outline" className="mt-4">Explorar Catálogo</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            Pedido #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
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
                      <Button variant="ghost" className="w-full">Ver todos los pedidos</Button>
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
                <CardDescription>Tu plan actual y opciones de upgrade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 mb-6">
                  <Badge className={`${membershipConfig.className} text-lg px-4 py-2`}>
                    <Crown className="h-5 w-5 mr-2" />
                    Plan {membershipConfig.label}
                  </Badge>
                  {profile.membership_expires_at && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Expira: {new Date(profile.membership_expires_at).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <Separator className="my-6" />

                <div className="grid md:grid-cols-3 gap-4">
                  {/* Free Plan */}
                  <Card className={`border-border/30 ${profile.membership_tier === 'free' ? 'ring-2 ring-accent' : ''}`}>
                    <CardHeader>
                      <CardTitle className="text-lg">Gratis</CardTitle>
                      <CardDescription>Para comenzar</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold mb-4">$0<span className="text-sm font-normal">/mes</span></p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• 1 publicación/semana</li>
                        <li>• Soporte básico</li>
                        <li>• Acceso al marketplace</li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Basic Plan */}
                  <Card className={`border-border/30 ${profile.membership_tier === 'basic' ? 'ring-2 ring-accent' : ''}`}>
                    <CardHeader>
                      <CardTitle className="text-lg">Básico</CardTitle>
                      <CardDescription>Para vendedores activos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold mb-4">$99<span className="text-sm font-normal">/mes</span></p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• 10 publicaciones/mes</li>
                        <li>• Soporte prioritario</li>
                        <li>• Analytics básicos</li>
                      </ul>
                      {profile.membership_tier === 'free' && (
                        <Link to="/memberships">
                          <Button variant="outline" className="w-full mt-4">Upgrade</Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>

                  {/* Pro Plan */}
                  <Card className={`border-border/30 border-success/50 ${profile.membership_tier === 'pro' ? 'ring-2 ring-success' : ''}`}>
                    <CardHeader>
                      <Badge className="bg-success text-success-foreground w-fit mb-2">Popular</Badge>
                      <CardTitle className="text-lg">Pro</CardTitle>
                      <CardDescription>Para profesionales</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold mb-4">$199<span className="text-sm font-normal">/mes</span></p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Publicaciones ilimitadas</li>
                        <li>• Soporte 24/7</li>
                        <li>• Analytics avanzados</li>
                        <li>• Boosts incluidos</li>
                      </ul>
                      {profile.membership_tier !== 'pro' && (
                        <Link to="/memberships">
                          <Button variant="success" className="w-full mt-4">Upgrade</Button>
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
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">Cambiar Contraseña</p>
                    <p className="text-sm text-muted-foreground">Actualiza tu contraseña regularmente</p>
                  </div>
                  <Button variant="outline">Cambiar</Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">Autenticación de Dos Factores</p>
                    <p className="text-sm text-muted-foreground">Añade una capa extra de seguridad</p>
                  </div>
                  <Button variant="outline">Activar 2FA</Button>
                </div>

                <Separator />

                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="font-medium text-destructive">Zona de Peligro</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Estas acciones son permanentes y no se pueden deshacer
                  </p>
                  <Button variant="destructive" size="sm">
                    Eliminar Cuenta
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

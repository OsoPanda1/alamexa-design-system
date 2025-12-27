import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Trash2, Plus, Minus, Bookmark, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, savedItems, loading, total, updateQuantity, removeFromCart, saveForLater, moveToCart, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-alamexa py-20 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-headline text-foreground mb-4">Tu carrito está vacío</h1>
          <p className="text-muted-foreground mb-8">Inicia sesión para ver tu carrito</p>
          <Link to="/auth">
            <Button variant="hero" size="lg">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-alamexa py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
        <Footer />
      </div>
    );
  }

  const shipping = total > 999 ? 0 : 99;
  const finalTotal = total + shipping;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container-alamexa pt-24 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground">Inicio</Link>
          <span>/</span>
          <span className="text-foreground">Carrito</span>
        </nav>

        <h1 className="text-headline text-foreground mb-8">Tu Carrito</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium text-foreground mb-2">Tu carrito está vacío</h2>
            <p className="text-muted-foreground mb-8">Explora nuestro catálogo para encontrar productos increíbles</p>
            <Link to="/catalog">
              <Button variant="hero">
                Explorar Catálogo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">{items.length} producto(s)</p>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={clearCart}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Vaciar carrito
                </Button>
              </div>

              {items.map((item) => (
                <Card key={item.id} className="border-border/30 bg-card/50">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                        {item.product?.images?.[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground uppercase">{item.product?.category}</p>
                        <h3 className="font-medium text-foreground truncate">{item.product?.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-semibold text-foreground">
                            ${item.product?.price?.toLocaleString()}
                          </span>
                          {item.product?.original_price && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${item.product.original_price.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center border border-border rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => saveForLater(item.product_id)}
                          >
                            <Bookmark className="h-4 w-4 mr-1" />
                            Guardar
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => removeFromCart(item.product_id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <span className="font-semibold text-foreground">
                          ${((item.product?.price || 0) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Saved for Later */}
              {savedItems.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-medium text-foreground mb-4">Guardados para después</h2>
                  {savedItems.map((item) => (
                    <Card key={item.id} className="border-border/30 bg-card/30 mb-4">
                      <CardContent className="p-4">
                        <div className="flex gap-4 items-center">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                            {item.product?.images?.[0] ? (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground">{item.product?.title}</h3>
                            <span className="text-sm text-muted-foreground">
                              ${item.product?.price?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => moveToCart(item.product_id)}>
                              Mover al carrito
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => removeFromCart(item.product_id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-border/30 bg-card/50 sticky top-24">
                <CardHeader>
                  <CardTitle>Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Coupon */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Código de cupón"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button variant="outline">Aplicar</Button>
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">${total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Envío</span>
                      <span className="text-foreground">
                        {shipping === 0 ? "Gratis" : `$${shipping}`}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-success">
                        Envío gratis en compras mayores a $999
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">Total</span>
                    <span className="text-xl font-bold text-foreground">
                      ${finalTotal.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Button
                    variant="success"
                    className="w-full"
                    size="lg"
                    onClick={() => navigate("/checkout")}
                  >
                    Proceder al Pago
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Link to="/catalog" className="w-full">
                    <Button variant="outline" className="w-full">
                      Seguir Comprando
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

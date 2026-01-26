import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTrades } from '@/hooks/useTrades';
import { useProducts, PRODUCT_CATEGORIES, PRODUCT_CONDITIONS } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Star,
  MessageSquare,
  Repeat,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  Eye,
} from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string | null;
  images: string[] | null;
  price: number | null;
  original_price: number | null;
  category: string;
  subcategory: string | null;
  condition: string | null;
  location: string | null;
  trade_type: string | null;
  trade_preferences: string | null;
  status: string | null;
  views: number | null;
  favorites_count: number | null;
  created_at: string;
  seller_id: string;
}

interface SellerProfile {
  user_id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  reputation_score: number | null;
  total_trades: number | null;
  created_at: string;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { createProposal } = useTrades();
  const { myProducts } = useProducts();

  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showTradeDialog, setShowTradeDialog] = useState(false);
  const [tradeMessage, setTradeMessage] = useState('');
  const [selectedMyProduct, setSelectedMyProduct] = useState<string>('');
  const [submittingTrade, setSubmittingTrade] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      // Fetch product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (productError) throw productError;
      setProduct(productData);

      // Fetch seller profile
      const { data: sellerData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', productData.seller_id)
        .single();

      setSeller(sellerData);

      // Increment views
      await supabase
        .from('products')
        .update({ views: (productData.views || 0) + 1 })
        .eq('id', id);

      // Check if favorited
      if (user) {
        const { data: favData } = await supabase
          .from('favorites')
          .select('id')
          .eq('product_id', id)
          .eq('user_id', user.id)
          .single();
        
        setIsFavorite(!!favData);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar el producto.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!user || !product) {
      toast({
        title: 'Inicia sesión',
        description: 'Debes iniciar sesión para guardar favoritos.',
      });
      return;
    }

    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('product_id', product.id)
          .eq('user_id', user.id);
        setIsFavorite(false);
      } else {
        await supabase
          .from('favorites')
          .insert({ product_id: product.id, user_id: user.id });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product?.title,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Enlace copiado',
        description: 'El enlace se ha copiado al portapapeles.',
      });
    }
  };

  const handleSendTradeProposal = async () => {
    if (!user || !product || !seller) return;

    setSubmittingTrade(true);
    try {
      await createProposal({
        receiverId: seller.user_id,
        receiverProductId: product.id,
        proposerProductId: selectedMyProduct || undefined,
        message: tradeMessage || undefined,
      });
      
      setShowTradeDialog(false);
      setTradeMessage('');
      setSelectedMyProduct('');
    } catch (error) {
      console.error('Error sending trade proposal:', error);
    } finally {
      setSubmittingTrade(false);
    }
  };

  const handleContact = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (seller) {
      navigate(`/messages?user=${seller.user_id}&name=${encodeURIComponent(seller.full_name || 'Usuario')}`);
    }
  };

  const getCategoryLabel = (value: string) => {
    return PRODUCT_CATEGORIES.find((c) => c.value === value)?.label || value;
  };

  const getConditionLabel = (value: string) => {
    return PRODUCT_CONDITIONS.find((c) => c.value === value)?.label || value;
  };

  const images = product?.images?.length ? product.images : ['/placeholder.svg'];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container-alamexa pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-12 w-1/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container-alamexa pt-24 pb-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
          <Button asChild>
            <Link to="/marketplace">Volver al Marketplace</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const discount = product.original_price && product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container-alamexa">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground">Inicio</Link>
            <span>/</span>
            <Link to="/marketplace" className="hover:text-foreground">Marketplace</Link>
            <span>/</span>
            <span className="text-foreground truncate">{product.title}</span>
          </nav>

          {/* Back button */}
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                <img
                  src={images[currentImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
                
                {/* Navigation arrows */}
                {images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      onClick={() => setCurrentImageIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      onClick={() => setCurrentImageIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.status === 'active' && product.trade_type === 'trueque' && (
                    <Badge className="bg-emerald-500 text-white">Solo Trueque</Badge>
                  )}
                  {discount > 0 && (
                    <Badge variant="destructive">-{discount}%</Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleFavorite}
                    className={isFavorite ? 'text-red-500' : ''}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="secondary" size="icon" onClick={handleShare}>
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        idx === currentImageIndex ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category & Condition */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{getCategoryLabel(product.category)}</Badge>
                {product.condition && (
                  <Badge variant="outline">{getConditionLabel(product.condition)}</Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-foreground">{product.title}</h1>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                {product.price ? (
                  <>
                    <span className="text-4xl font-bold text-foreground">
                      ${product.price.toLocaleString()}
                    </span>
                    {product.original_price && (
                      <span className="text-xl text-muted-foreground line-through">
                        ${product.original_price.toLocaleString()}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-2xl font-bold text-emerald-500">Solo Trueque</span>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {product.views || 0} vistas
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {product.favorites_count || 0} favoritos
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date(product.created_at).toLocaleDateString('es-MX')}
                </span>
              </div>

              {/* Location */}
              {product.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span>{product.location}</span>
                </div>
              )}

              <Separator />

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Descripción</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{product.description}</p>
                </div>
              )}

              {/* Trade Preferences */}
              {product.trade_preferences && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Repeat className="h-5 w-5 text-primary" />
                    Intereses de trueque
                  </h3>
                  <p className="text-muted-foreground">{product.trade_preferences}</p>
                </div>
              )}

              <Separator />

              {/* Seller Card */}
              {seller && (
                <Card className="bg-card/50 border-border/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={seller.avatar_url || undefined} />
                        <AvatarFallback className="bg-accent text-accent-foreground text-lg">
                          {seller.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">
                          {seller.full_name || seller.username || 'Usuario'}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            {seller.reputation_score || 0}
                          </span>
                          <span>{seller.total_trades || 0} trueques</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              {user?.id !== product.seller_id && (
                <div className="flex flex-col sm:flex-row gap-3">
                  {(product.trade_type === 'trueque' || product.trade_type === 'both') && (
                    <Dialog open={showTradeDialog} onOpenChange={setShowTradeDialog}>
                      <DialogTrigger asChild>
                        <Button variant="hero" size="lg" className="flex-1">
                          <Repeat className="h-5 w-5 mr-2" />
                          Proponer Trueque
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Proponer Trueque</DialogTitle>
                          <DialogDescription>
                            Envía una propuesta de intercambio por "{product.title}"
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          {myProducts.length > 0 && (
                            <div>
                              <Label>Ofrecer uno de mis productos (opcional)</Label>
                              <select
                                value={selectedMyProduct}
                                onChange={(e) => setSelectedMyProduct(e.target.value)}
                                className="w-full mt-2 p-2 rounded-md border border-border bg-background"
                              >
                                <option value="">Sin producto</option>
                                {myProducts.map((p) => (
                                  <option key={p.id} value={p.id}>
                                    {p.title}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                          <div>
                            <Label htmlFor="trade-message">Mensaje (opcional)</Label>
                            <Textarea
                              id="trade-message"
                              value={tradeMessage}
                              onChange={(e) => setTradeMessage(e.target.value)}
                              placeholder="Describe tu propuesta..."
                              rows={3}
                              className="mt-2"
                            />
                          </div>
                          <Button
                            onClick={handleSendTradeProposal}
                            disabled={submittingTrade}
                            className="w-full"
                          >
                            {submittingTrade ? 'Enviando...' : 'Enviar Propuesta'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {(product.trade_type === 'venta' || product.trade_type === 'both') && product.price && (
                    <Button variant="outline" size="lg" className="flex-1">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Comprar
                    </Button>
                  )}

                  <Button variant="secondary" size="lg" onClick={handleContact}>
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Contactar
                  </Button>
                </div>
              )}

              {/* Trust badges */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4">
                <span className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-green-500" />
                  Transacción protegida
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

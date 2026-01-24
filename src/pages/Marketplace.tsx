import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  MapPin,
  TrendingUp,
  ArrowRight,
  Sparkles,
  RefreshCw,
  ShoppingBag,
  Star,
  Heart,
  Eye,
  ChevronRight,
  Zap,
} from "lucide-react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts, PRODUCT_CATEGORIES } from "@/hooks/useProducts";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

// Componente de producto premium estilo Temu/ML
function ProductCard({
  product,
  viewMode,
}: {
  product: any;
  viewMode: "grid" | "list";
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const discount = product.original_price
    ? Math.round(
        ((product.original_price - (product.price || 0)) /
          product.original_price) *
          100
      )
    : 0;

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="group"
      >
        <Card className="overflow-hidden border-border/30 bg-card/50 hover:border-accent/40 hover:shadow-card-hover transition-all duration-300">
          <div className="flex gap-4 p-4">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden shrink-0">
              <img
                src={product.images?.[0] || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {product.trade_type === "trade" && (
                <Badge className="absolute top-2 left-2 bg-flag-green/90 text-foreground text-xs">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Trueque
                </Badge>
              )}
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs text-muted-foreground capitalize">
                  {product.category}
                </span>
                <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                  {product.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-baseline gap-2">
                  {product.price ? (
                    <>
                      <span className="text-xl font-bold text-foreground">
                        ${product.price.toLocaleString()}
                      </span>
                      {product.original_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.original_price.toLocaleString()}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-lg font-semibold text-flag-green">
                      Solo Trueque
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Eye className="w-4 h-4" />
                  {product.views || 0}
                  <Heart className="w-4 h-4 ml-2" />
                  {product.favorites_count || 0}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden border-border/30 bg-card/50 hover:border-accent/40 hover:shadow-card-hover transition-all duration-300">
        {/* Imagen del producto */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images?.[0] || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Overlay con acciones */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-deep-black/20 to-transparent flex items-end p-3"
              >
                <div className="flex gap-2 w-full">
                  <Button
                    size="sm"
                    className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Ver Detalles
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="border-accent/50 text-foreground hover:bg-accent/20"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsFavorite(!isFavorite);
                    }}
                  >
                    <Heart
                      className={cn(
                        "w-4 h-4",
                        isFavorite && "fill-cherry text-cherry"
                      )}
                    />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.trade_type === "trade" && (
              <Badge className="bg-flag-green/90 text-foreground text-xs gap-1">
                <RefreshCw className="w-3 h-3" />
                Trueque
              </Badge>
            )}
            {product.trade_type === "both" && (
              <Badge className="bg-accent/90 text-accent-foreground text-xs gap-1">
                <Sparkles className="w-3 h-3" />
                Mixto
              </Badge>
            )}
            {discount > 0 && (
              <Badge className="bg-cherry/90 text-foreground text-xs">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Favorito */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart
              className={cn(
                "w-4 h-4",
                isFavorite ? "fill-cherry text-cherry" : "text-muted-foreground"
              )}
            />
          </button>
        </div>

        {/* Info del producto */}
        <CardContent className="p-3">
          <span className="text-xs text-muted-foreground capitalize">
            {product.category}
          </span>
          <h3 className="font-medium text-sm text-foreground line-clamp-2 min-h-[2.5rem] group-hover:text-accent transition-colors">
            {product.title}
          </h3>

          <div className="mt-2 flex items-baseline gap-2">
            {product.price ? (
              <>
                <span className="text-lg font-bold text-foreground">
                  ${product.price.toLocaleString()}
                </span>
                {product.original_price && (
                  <span className="text-xs text-muted-foreground line-through">
                    ${product.original_price.toLocaleString()}
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm font-semibold text-flag-green">
                Solo Trueque
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {product.views || 0}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {product.favorites_count || 0}
            </span>
            {product.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {product.location}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Skeleton de carga
function ProductSkeleton({ viewMode }: { viewMode: "grid" | "list" }) {
  if (viewMode === "list") {
    return (
      <div className="flex gap-4 p-4 border border-border/30 rounded-lg">
        <Skeleton className="w-32 h-32 rounded-lg" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border/30 rounded-lg overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
  );
}

export default function Marketplace() {
  const { user } = useAuth();
  const { products, loading } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [tradeFilter, setTradeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");

  // Filtrar y ordenar productos
  const filteredProducts = useMemo(() => {
    let filtered = [...(products || [])];

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filtrar por tipo de comercio
    if (tradeFilter === "trade") {
      filtered = filtered.filter(
        (p) => p.trade_type === "trade" || p.trade_type === "both"
      );
    } else if (tradeFilter === "sale") {
      filtered = filtered.filter(
        (p) => p.trade_type === "sale" || p.trade_type === "both"
      );
    }

    // Ordenar
    switch (sortBy) {
      case "price_low":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price_high":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "popular":
        filtered.sort(
          (a, b) => (b.views || 0) + (b.favorites_count || 0) - ((a.views || 0) + (a.favorites_count || 0))
        );
        break;
      case "recent":
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, tradeFilter, sortBy]);

  // Categorías destacadas con iconos
  const featuredCategories = [
    { id: "electronics", name: "Electrónica", icon: Zap, count: 234 },
    { id: "fashion", name: "Moda", icon: ShoppingBag, count: 189 },
    { id: "home", name: "Hogar", icon: Star, count: 156 },
    { id: "sports", name: "Deportes", icon: TrendingUp, count: 98 },
  ];

  return (
    <>
      <Helmet>
        <title>Marketplace | ALAMEXA - Compra, Vende e Intercambia</title>
        <meta
          name="description"
          content="Explora miles de productos para comprar, vender o intercambiar. Sistema de trueque seguro y verificado."
        />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section con búsqueda */}
        <section className="relative bg-gradient-hero py-12 lg:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />

          <div className="container-alamexa relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-display text-foreground mb-4">
                Explora el <span className="text-gradient-silver">Marketplace</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Miles de productos para comprar, vender o intercambiar. Tu
                próxima oportunidad está aquí.
              </p>

              {/* Barra de búsqueda premium */}
              <div className="relative max-w-2xl mx-auto">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="¿Qué estás buscando?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-14 text-lg bg-card/80 border-border/40 focus:border-accent rounded-xl"
                    />
                  </div>
                  <Button className="h-14 px-8 bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl">
                    <Search className="w-5 h-5 mr-2" />
                    Buscar
                  </Button>
                </div>

                {/* Sugerencias rápidas */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {["iPhone", "Nike", "PlayStation", "Bicicleta"].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-3 py-1 text-sm rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categorías destacadas */}
        <section className="py-8 border-b border-border/30">
          <div className="container-alamexa">
            <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {featuredCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === cat.id ? "all" : cat.id
                    )
                  }
                  className={cn(
                    "flex items-center gap-3 px-6 py-3 rounded-xl border transition-all duration-300 shrink-0",
                    selectedCategory === cat.id
                      ? "bg-accent/10 border-accent text-foreground"
                      : "bg-card/50 border-border/30 text-muted-foreground hover:border-accent/40"
                  )}
                >
                  <cat.icon className="w-5 h-5" />
                  <span className="font-medium">{cat.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {cat.count}
                  </Badge>
                </button>
              ))}
              <Link
                to="/catalog"
                className="flex items-center gap-2 px-6 py-3 text-accent hover:underline shrink-0"
              >
                Ver todas
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Filtros y Grid de productos */}
        <section className="py-8">
          <div className="container-alamexa">
            {/* Toolbar de filtros */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Tabs
                  value={tradeFilter}
                  onValueChange={setTradeFilter}
                  className="w-auto"
                >
                  <TabsList className="bg-card/50">
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="trade" className="gap-1">
                      <RefreshCw className="w-4 h-4" />
                      Trueque
                    </TabsTrigger>
                    <TabsTrigger value="sale" className="gap-1">
                      <ShoppingBag className="w-4 h-4" />
                      Venta
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44 bg-card/50">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Más recientes</SelectItem>
                    <SelectItem value="popular">Más populares</SelectItem>
                    <SelectItem value="price_low">
                      Precio: menor a mayor
                    </SelectItem>
                    <SelectItem value="price_high">
                      Precio: mayor a menor
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {filteredProducts.length} productos
                </span>
                <div className="flex border border-border/30 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === "grid"
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === "list"
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid de productos */}
            {loading ? (
              <div
                className={cn(
                  viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                    : "space-y-4"
                )}
              >
                {Array.from({ length: 10 }).map((_, i) => (
                  <ProductSkeleton key={i} viewMode={viewMode} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No encontramos productos
                </h3>
                <p className="text-muted-foreground mb-6">
                  Intenta ajustar los filtros o buscar algo diferente
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setTradeFilter("all");
                  }}
                >
                  Limpiar filtros
                </Button>
              </motion.div>
            ) : (
              <div
                className={cn(
                  viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                    : "space-y-4"
                )}
              >
                {filteredProducts.map((product, index) => (
                  <Link key={product.id} to={`/product/${product.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProductCard product={product} viewMode={viewMode} />
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}

            {/* Load more */}
            {filteredProducts.length > 0 && (
              <div className="mt-12 text-center">
                <Button variant="outline" size="lg" className="gap-2">
                  Cargar más productos
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* CTA para publicar */}
        {user && (
          <section className="py-12 bg-card/30 border-t border-border/30">
            <div className="container-alamexa">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-2xl bg-gradient-to-r from-accent/10 to-flag-green/10 border border-accent/20"
              >
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    ¿Tienes algo que ofrecer?
                  </h3>
                  <p className="text-muted-foreground">
                    Publica tu producto y empieza a recibir ofertas de trueque o
                    venta
                  </p>
                </div>
                <Link to="/products/new">
                  <Button size="lg" className="gap-2 bg-accent text-accent-foreground">
                    <Sparkles className="w-5 h-5" />
                    Publicar producto
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Search,
  RefreshCw,
  Shield,
  Star,
  ArrowRight,
  Sparkles,
  Users,
  TrendingUp,
  Zap,
  ShoppingBag,
  Heart,
  Award,
  ChevronRight,
} from "lucide-react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useOnboarding } from "@/components/OnboardingModal";
import { cn } from "@/lib/utils";

// Product images (using assets)
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

// Featured Products data
const featuredProducts = [
  { id: "1", name: "iPhone 15 Pro Max", price: 24999, originalPrice: 29999, image: product1, category: "Electrónica", isNew: true, tradeType: "both" },
  { id: "2", name: "Nike Air Max 2024", price: 3499, originalPrice: 4299, image: product2, category: "Moda", tradeType: "trade" },
  { id: "3", name: "MacBook Pro M3", price: 45999, image: product3, category: "Tecnología", isNew: true, tradeType: "sale" },
  { id: "4", name: "PlayStation 5 Pro", price: 12999, originalPrice: 14999, image: product4, category: "Gaming", tradeType: "both" },
];

// Categories
const categories = [
  { id: "electronics", name: "Electrónica", count: 1234, icon: Zap, gradient: "from-blue-500/20 to-cyan-500/20" },
  { id: "fashion", name: "Moda", count: 892, icon: ShoppingBag, gradient: "from-pink-500/20 to-rose-500/20" },
  { id: "home", name: "Hogar", count: 567, icon: Heart, gradient: "from-amber-500/20 to-orange-500/20" },
  { id: "sports", name: "Deportes", count: 345, icon: TrendingUp, gradient: "from-green-500/20 to-emerald-500/20" },
];

// Features
const features = [
  {
    icon: RefreshCw,
    title: "Sistema de Trueque",
    description: "Intercambia productos de forma segura con nuestro sistema de escrow inteligente.",
    color: "text-flag-green",
  },
  {
    icon: Shield,
    title: "Seguridad Total",
    description: "Verificación de usuarios, evaluación de productos y protección contra fraudes.",
    color: "text-accent",
  },
  {
    icon: Star,
    title: "Membresías Premium",
    description: "Accede a beneficios exclusivos, mayor visibilidad y comisiones reducidas.",
    color: "text-amber-500",
  },
  {
    icon: Users,
    title: "Comunidad Activa",
    description: "Únete a miles de usuarios que ya disfrutan de la nueva era del comercio.",
    color: "text-cherry",
  },
];

// Stats
const stats = [
  { value: "50K+", label: "Usuarios activos" },
  { value: "120K+", label: "Productos publicados" },
  { value: "35K+", label: "Trueques exitosos" },
  { value: "4.9", label: "Calificación promedio" },
];

// Product Card Component
function ProductCard({ product }: { product: typeof featuredProducts[0] }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group"
    >
      <Card className="overflow-hidden border-border/30 bg-card/50 hover:border-accent/40 hover:shadow-card-hover transition-all duration-500">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.isNew && (
              <Badge className="bg-flag-green/90 text-foreground text-xs">Nuevo</Badge>
            )}
            {discount > 0 && (
              <Badge className="bg-cherry/90 text-foreground text-xs">-{discount}%</Badge>
            )}
            {product.tradeType === "trade" && (
              <Badge className="bg-accent/90 text-accent-foreground text-xs gap-1">
                <RefreshCw className="w-3 h-3" />
                Trueque
              </Badge>
            )}
          </div>

          {/* Quick action */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <Button size="sm" className="w-full bg-accent text-accent-foreground gap-1">
              Ver detalles
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <span className="text-xs text-muted-foreground">{product.category}</span>
          <h3 className="font-semibold text-foreground mt-1 line-clamp-1 group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-lg font-bold text-foreground">
              ${product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Index() {
  const { resetOnboarding } = useOnboarding();

  // JSON-LD structured data
  const jsonLdWebsite = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ALAMEXA",
    "description": "La nueva era del comercio inteligente. Compra, vende e intercambia con seguridad.",
    "url": "https://alamexa.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://alamexa.com/marketplace?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }), []);

  return (
    <>
      <Helmet>
        <title>ALAMEXA | La Nueva Era del Comercio Inteligente</title>
        <meta
          name="description"
          content="ALAMEXA fusiona lo mejor de los marketplaces modernos con un revolucionario sistema de trueque. Compra, vende e intercambia con seguridad."
        />
        <meta name="keywords" content="trueque, marketplace, comercio, intercambio, México, P2P, comprar, vender" />
        <script type="application/ld+json">{JSON.stringify(jsonLdWebsite)}</script>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
          {/* Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-hero" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-flag-green/5 via-transparent to-transparent" />
          </div>

          <div className="container-alamexa relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge 
                  variant="outline" 
                  className="mb-6 px-4 py-2 text-sm border-accent/50 bg-accent/5 gap-2 cursor-pointer hover:bg-accent/10 transition-colors"
                  onClick={resetOnboarding}
                >
                  <Sparkles className="w-4 h-4 text-flag-green" />
                  La nueva era del comercio inteligente
                  <ChevronRight className="w-4 h-4" />
                </Badge>
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-display text-foreground mb-6"
              >
                Compra. Vende.{" "}
                <span className="text-gradient-silver">Intercambia.</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
              >
                ALAMEXA es una plataforma innovadora que combina marketplace tradicional 
                con un revolucionario sistema de trueque seguro y verificado.
              </motion.p>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="max-w-2xl mx-auto mb-8"
              >
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="¿Qué estás buscando hoy?"
                      className="pl-12 h-14 text-lg bg-card/80 border-border/50 focus:border-accent rounded-xl backdrop-blur-sm"
                    />
                  </div>
                  <Link to="/marketplace">
                    <Button size="lg" className="h-14 px-8 bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl gap-2">
                      <Search className="w-5 h-5" />
                      Buscar
                    </Button>
                  </Link>
                </div>

                {/* Quick tags */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {["iPhone", "Nike", "PlayStation", "MacBook", "Gaming"].map((tag) => (
                    <Link
                      key={tag}
                      to={`/marketplace?q=${tag}`}
                      className="px-3 py-1 text-sm rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Link to="/marketplace">
                  <Button size="lg" className="gap-2 bg-gradient-silver text-deep-black hover:opacity-90 px-8">
                    Explorar Marketplace
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/products/new">
                  <Button size="lg" variant="outline" className="gap-2 border-accent/50 hover:bg-accent/10 px-8">
                    <Sparkles className="w-5 h-5" />
                    Publicar Producto
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-6 rounded-2xl bg-card/30 border border-border/30 backdrop-blur-sm"
                >
                  <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-28 border-t border-border/30">
          <div className="container-alamexa">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <Badge variant="outline" className="mb-4 border-flag-green/50 text-flag-green">
                ¿Por qué ALAMEXA?
              </Badge>
              <h2 className="text-headline text-foreground mb-4">
                Una nueva forma de{" "}
                <span className="text-gradient-silver">comerciar</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Más que un marketplace: un ecosistema digital elegante, seguro y exclusivo
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-border/30 bg-card/50 hover:border-accent/30 hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                        "bg-muted/50"
                      )}>
                        <feature.icon className={cn("w-7 h-7", feature.color)} />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-card/30 border-y border-border/30">
          <div className="container-alamexa">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
            >
              <div>
                <Badge variant="outline" className="mb-4 border-accent/50">
                  Categorías
                </Badge>
                <h2 className="text-headline text-foreground">
                  Explora por categoría
                </h2>
              </div>
              <Link to="/catalog" className="flex items-center gap-2 text-accent hover:underline">
                Ver todas las categorías
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/marketplace?category=${category.id}`}>
                    <Card className={cn(
                      "relative overflow-hidden border-border/30 hover:border-accent/40 transition-all duration-300 group cursor-pointer",
                      "bg-gradient-to-br",
                      category.gradient
                    )}>
                      <CardContent className="p-6 lg:p-8">
                        <category.icon className="w-10 h-10 text-foreground mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {category.count.toLocaleString()} productos
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-20 lg:py-28">
          <div className="container-alamexa">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
            >
              <div>
                <Badge variant="outline" className="mb-4 border-cherry/50 text-cherry">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Destacados
                </Badge>
                <h2 className="text-headline text-foreground">
                  Productos populares
                </h2>
              </div>
              <Link to="/marketplace" className="flex items-center gap-2 text-accent hover:underline">
                Ver todos los productos
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/product/${product.id}`}>
                    <ProductCard product={product} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28 bg-gradient-to-br from-accent/10 via-card/50 to-flag-green/5 border-t border-border/30">
          <div className="container-alamexa">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <Award className="w-16 h-16 text-accent mx-auto mb-6" />
              <h2 className="text-headline text-foreground mb-4">
                ¿Listo para comenzar?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Únete a miles de usuarios que ya disfrutan de la nueva era del comercio 
                inteligente. Compra, vende e intercambia con estilo, seguridad y confianza.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/auth">
                  <Button size="lg" className="gap-2 bg-accent text-accent-foreground px-8">
                    Crear cuenta gratis
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/memberships">
                  <Button size="lg" variant="outline" className="gap-2 border-accent/50 px-8">
                    Ver membresías
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

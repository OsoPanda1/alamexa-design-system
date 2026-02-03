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
  ChevronRight,
  Play,
  Truck,
  Lock,
  Award,
  Gamepad2,
  Camera,
  Home as HomeIcon,
} from "lucide-react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useOnboarding } from "@/components/OnboardingModal";
import { AIAssistant } from "@/components/AIAssistant";
import { cn } from "@/lib/utils";

// Premium Images
import heroPremium from "@/assets/hero-premium.jpg";
import categoryElectronics from "@/assets/category-electronics.jpg";
import categoryFashion from "@/assets/category-fashion.jpg";
import categoryHome from "@/assets/category-home.jpg";
import categorySports from "@/assets/category-sports.jpg";
import categoryGaming from "@/assets/category-gaming.jpg";
import featureTrade from "@/assets/feature-trade.jpg";
import featureSecurity from "@/assets/feature-security.jpg";
import featurePremium from "@/assets/feature-premium.jpg";
import featureShipping from "@/assets/feature-shipping.jpg";
import productIphone from "@/assets/product-iphone.jpg";
import productSneakers from "@/assets/product-sneakers.jpg";
import productMacbook from "@/assets/product-macbook.jpg";
import productPs5 from "@/assets/product-ps5.jpg";
import productWatch from "@/assets/product-watch.jpg";
import productCamera from "@/assets/product-camera.jpg";
import productHeadphones from "@/assets/product-headphones.jpg";
import productBag from "@/assets/product-bag.jpg";

// Featured Products data with premium images
const featuredProducts = [
  { id: "1", name: "iPhone 15 Pro Max", price: 24999, originalPrice: 29999, image: productIphone, category: "Electrónica", isNew: true, tradeType: "both", rating: 4.9 },
  { id: "2", name: "Air Jordan Retro", price: 4999, originalPrice: 5999, image: productSneakers, category: "Moda", tradeType: "trade", rating: 4.8 },
  { id: "3", name: "MacBook Pro M3", price: 45999, image: productMacbook, category: "Tecnología", isNew: true, tradeType: "sale", rating: 5.0 },
  { id: "4", name: "PlayStation 5 Pro", price: 12999, originalPrice: 14999, image: productPs5, category: "Gaming", tradeType: "both", rating: 4.9 },
  { id: "5", name: "Rolex Submariner", price: 189999, image: productWatch, category: "Lujo", isNew: true, tradeType: "sale", rating: 5.0 },
  { id: "6", name: "Canon EOS R5", price: 78999, originalPrice: 89999, image: productCamera, category: "Fotografía", tradeType: "both", rating: 4.7 },
  { id: "7", name: "Sony WH-1000XM5", price: 7999, image: productHeadphones, category: "Audio", tradeType: "trade", rating: 4.8 },
  { id: "8", name: "Louis Vuitton Speedy", price: 42999, image: productBag, category: "Lujo", tradeType: "sale", rating: 4.9 },
];

// Categories with premium images
const categories = [
  { id: "electronics", name: "Electrónica", count: 12453, icon: Zap, image: categoryElectronics },
  { id: "fashion", name: "Moda & Lujo", count: 8921, icon: ShoppingBag, image: categoryFashion },
  { id: "home", name: "Hogar", count: 5672, icon: HomeIcon, image: categoryHome },
  { id: "sports", name: "Deportes", count: 3456, icon: TrendingUp, image: categorySports },
  { id: "gaming", name: "Gaming", count: 7823, icon: Gamepad2, image: categoryGaming },
  { id: "photography", name: "Fotografía", count: 2134, icon: Camera, image: productCamera },
];

// Features with images
const features = [
  {
    image: featureTrade,
    icon: RefreshCw,
    title: "Trueque Inteligente",
    description: "Intercambia productos con nuestro sistema de valoración asistido por IA y escrow seguro.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    image: featureSecurity,
    icon: Shield,
    title: "Seguridad Total",
    description: "Verificación KYC, protección de pagos y escrow para todas las transacciones.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    image: featureShipping,
    icon: Truck,
    title: "Envíos Integrados",
    description: "FedEx, DHL y Estafeta integrados. Rastreo en tiempo real de tus paquetes.",
    color: "from-amber-500 to-orange-600",
  },
  {
    image: featurePremium,
    icon: Award,
    title: "Membresías Premium",
    description: "Acceso VIP con beneficios exclusivos, menor comisión y soporte prioritario.",
    color: "from-purple-500 to-pink-600",
  },
];

// Stats
const stats = [
  { value: "150K+", label: "Usuarios activos", icon: Users },
  { value: "420K+", label: "Productos publicados", icon: ShoppingBag },
  { value: "85K+", label: "Trueques exitosos", icon: RefreshCw },
  { value: "4.9", label: "Calificación promedio", icon: Star },
];

// Premium Product Card
function ProductCard({ product, index }: { product: typeof featuredProducts[0]; index: number }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link to={`/product/${product.id}`}>
        <Card className="overflow-hidden border-0 bg-card/80 backdrop-blur-sm hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500">
          <div className="relative aspect-square overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isNew && (
                <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 text-xs font-medium">
                  ✨ Nuevo
                </Badge>
              )}
              {discount > 0 && (
                <Badge className="bg-gradient-to-r from-rose-500 to-pink-600 text-white border-0 text-xs font-medium">
                  -{discount}%
                </Badge>
              )}
              {product.tradeType === "trade" && (
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 text-xs gap-1">
                  <RefreshCw className="w-3 h-3" />
                  Trueque
                </Badge>
              )}
            </div>

            {/* Rating */}
            <div className="absolute top-3 right-3">
              <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-xs text-white font-medium">{product.rating}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-white text-black hover:bg-white/90 gap-1 font-medium">
                  Ver detalles
                  <ArrowRight className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" className="bg-black/50 border-white/30 text-white hover:bg-white/20">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <CardContent className="p-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">{product.category}</span>
            <h3 className="font-semibold text-foreground mt-1 line-clamp-1 group-hover:text-amber-500 transition-colors">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-xl font-bold text-foreground">
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
      </Link>
    </motion.div>
  );
}

export default function Index() {
  const { resetOnboarding } = useOnboarding();

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

      <main className="min-h-screen bg-background overflow-x-hidden">
        {/* Hero Section - Ultra Premium */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={heroPremium} 
              alt="ALAMEXA Hero" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
          </div>

          <div className="container-alamexa relative z-10 pt-32 pb-20">
            <div className="max-w-5xl mx-auto text-center">
              {/* Top Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge 
                  variant="outline" 
                  className="mb-8 px-5 py-2.5 text-sm border-amber-500/50 bg-amber-500/10 gap-2 cursor-pointer hover:bg-amber-500/20 transition-all"
                  onClick={resetOnboarding}
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-foreground">La nueva era del comercio inteligente</span>
                  <ChevronRight className="w-4 h-4" />
                </Badge>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-8 leading-tight"
              >
                Compra. Vende.
                <br />
                <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Intercambia.
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
              >
                ALAMEXA fusiona lo mejor de{" "}
                <span className="text-foreground font-medium">Mercado Libre</span>,{" "}
                <span className="text-foreground font-medium">Temu</span> y{" "}
                <span className="text-foreground font-medium">Alibaba</span> con un revolucionario sistema de trueque seguro.
              </motion.p>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="max-w-3xl mx-auto mb-10"
              >
                <div className="flex gap-3 p-2 bg-card/90 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="¿Qué estás buscando? iPhone, Nike, PlayStation..."
                      className="pl-12 h-14 text-lg bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  <Link to="/marketplace">
                    <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 rounded-xl gap-2 font-semibold shadow-lg shadow-amber-500/25">
                      <Search className="w-5 h-5" />
                      Buscar
                    </Button>
                  </Link>
                </div>

                {/* Quick Tags */}
                <div className="flex flex-wrap justify-center gap-2 mt-5">
                  {["iPhone 15", "Nike Jordan", "PlayStation 5", "MacBook", "Rolex", "Gaming"].map((tag) => (
                    <Link
                      key={tag}
                      to={`/marketplace?q=${tag}`}
                      className="px-4 py-2 text-sm rounded-full bg-card/50 border border-border/50 text-muted-foreground hover:bg-amber-500/10 hover:border-amber-500/50 hover:text-foreground transition-all"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Link to="/marketplace">
                  <Button size="lg" className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 px-10 h-14 text-lg font-semibold shadow-lg shadow-amber-500/25">
                    Explorar Marketplace
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/products/new">
                  <Button size="lg" variant="outline" className="gap-2 border-2 border-foreground/20 hover:bg-foreground/5 px-10 h-14 text-lg font-semibold">
                    <Sparkles className="w-5 h-5" />
                    Publicar Producto
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/30 hover:border-amber-500/30 transition-colors group"
                >
                  <stat.icon className="w-6 h-6 mx-auto mb-3 text-amber-500 group-hover:scale-110 transition-transform" />
                  <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-foreground/20 flex justify-center pt-2"
            >
              <div className="w-1.5 h-3 rounded-full bg-amber-500" />
            </motion.div>
          </motion.div>
        </section>

        {/* Categories Section - Premium Grid */}
        <section className="py-24 bg-card/30">
          <div className="container-alamexa">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
            >
              <div>
                <Badge className="mb-4 bg-amber-500/10 text-amber-600 border-amber-500/20">
                  Categorías Premium
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                  Explora el mercado
                </h2>
              </div>
              <Link to="/catalog" className="flex items-center gap-2 text-amber-500 hover:text-amber-600 font-medium transition-colors">
                Ver todas las categorías
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/marketplace?category=${category.id}`}>
                    <Card className="relative overflow-hidden h-48 group border-0 cursor-pointer">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                      <CardContent className="relative h-full flex flex-col justify-end p-4">
                        <category.icon className="w-6 h-6 text-white mb-2" />
                        <h3 className="text-lg font-semibold text-white">
                          {category.name}
                        </h3>
                        <p className="text-xs text-white/70">
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

        {/* Features Section - Premium Cards */}
        <section className="py-24">
          <div className="container-alamexa">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <Badge className="mb-4 bg-amber-500/10 text-amber-600 border-amber-500/20">
                ¿Por qué ALAMEXA?
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                La plataforma que lo tiene{" "}
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  todo
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Más que un marketplace: un ecosistema digital completo, seguro y exclusivo
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="relative overflow-hidden h-80 group border-0">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                    <CardContent className="relative h-full flex flex-col justify-end p-6">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                        `bg-gradient-to-br ${feature.color}`
                      )}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-white/80 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-24 bg-card/30">
          <div className="container-alamexa">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
            >
              <div>
                <Badge className="mb-4 bg-amber-500/10 text-amber-600 border-amber-500/20">
                  Lo más destacado
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                  Productos Premium
                </h2>
              </div>
              <Link to="/marketplace" className="flex items-center gap-2 text-amber-500 hover:text-amber-600 font-medium transition-colors">
                Ver todo el catálogo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-background to-background" />
          <div className="container-alamexa relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <Badge className="mb-6 bg-amber-500/10 text-amber-600 border-amber-500/20">
                Únete a la revolución
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                ¿Listo para empezar a{" "}
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  intercambiar
                </span>
                ?
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Miles de usuarios ya disfrutan de la nueva era del comercio. Publica tu primer producto gratis y descubre el poder del trueque inteligente.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/auth">
                  <Button size="lg" className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 px-10 h-14 text-lg font-semibold shadow-lg shadow-amber-500/25">
                    Crear cuenta gratis
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="gap-2 px-10 h-14 text-lg font-semibold">
                    <Play className="w-5 h-5" />
                    Cómo funciona
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-6 mt-12 pt-12 border-t border-border/30">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Lock className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm">Pagos 100% seguros</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span className="text-sm">Protección al comprador</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Truck className="w-5 h-5 text-amber-500" />
                  <span className="text-sm">Envíos integrados</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm">4.9 calificación promedio</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <AIAssistant />
    </>
  );
}

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { ProductCard } from "@/components/ProductCard";
import { CategoryCard } from "@/components/CategoryCard";
import { ArrowRight, Sparkles, Shield, Truck } from "lucide-react";
import { Link } from "react-router-dom";

import heroBg from "@/assets/hero-bg.jpg";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

const featuredProducts = [
  {
    id: "1",
    name: "Bolso Milano Premium",
    price: 1299,
    originalPrice: 1599,
    image: product1,
    category: "Accesorios",
    isNew: true,
  },
  {
    id: "2",
    name: "Cronógrafo Plata Obsidiana",
    price: 3450,
    image: product2,
    category: "Relojes",
    isNew: false,
  },
  {
    id: "3",
    name: "Gafas Clubmaster Classic",
    price: 289,
    originalPrice: 350,
    image: product3,
    category: "Óptica",
    isNew: false,
  },
  {
    id: "4",
    name: "Eau de Parfum Ámbar",
    price: 185,
    image: product4,
    category: "Fragancias",
    isNew: true,
  },
];

const categories = [
  { name: "Relojes", itemCount: 234, image: product2, href: "/catalog?category=relojes" },
  { name: "Accesorios", itemCount: 512, image: product1, href: "/catalog?category=accesorios" },
  { name: "Fragancias", itemCount: 156, image: product4, href: "/catalog?category=fragancias" },
  { name: "Óptica", itemCount: 89, image: product3, href: "/catalog?category=optica" },
];

const features = [
  {
    icon: Sparkles,
    title: "Productos Premium",
    description: "Curado con los más altos estándares de calidad",
  },
  {
    icon: Shield,
    title: "Compra Segura",
    description: "Protección completa en todas tus transacciones",
  },
  {
    icon: Truck,
    title: "Envío Express",
    description: "Entrega en 24-48h a todo el país",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>

        {/* Content */}
        <div className="relative container-alamexa text-center pt-20">
          <div className="max-w-3xl mx-auto space-y-8 opacity-0 animate-fade-in">
            <span className="inline-block px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-accent border border-accent/30 rounded-full">
              Experiencia Premium
            </span>
            
            <h1 className="text-display text-foreground opacity-0 animate-slide-up stagger-1">
              La Elegancia{" "}
              <span className="text-gradient-silver">Redefinida</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto opacity-0 animate-slide-up stagger-2">
              Descubre una colección curada de productos excepcionales para quienes aprecian lo extraordinario.
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto opacity-0 animate-slide-up stagger-3">
              <SearchInput
                placeholder="Buscar productos, marcas, categorías..."
                className="h-14"
              />
            </div>

            {/* CTA */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 opacity-0 animate-slide-up stagger-4">
              <Link to="/catalog">
                <Button variant="hero" size="xl">
                  Explorar Catálogo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="outline" size="xl">
                  Ver Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-accent/40 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-accent/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-y border-border/30 bg-card/30">
        <div className="container-alamexa">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="flex items-center gap-4 p-4"
              >
                <div className="shrink-0 h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container-alamexa">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-headline text-foreground">Categorías</h2>
              <p className="text-muted-foreground mt-2">
                Explora nuestra selección curada
              </p>
            </div>
            <Link to="/catalog">
              <Button variant="ghost" className="text-accent">
                Ver todas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.name} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-card/30">
        <div className="container-alamexa">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-headline text-foreground">Productos Destacados</h2>
              <p className="text-muted-foreground mt-2">
                Lo mejor de nuestra colección
              </p>
            </div>
            <Link to="/catalog">
              <Button variant="ghost" className="text-accent">
                Ver catálogo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20">
        <div className="container-alamexa">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-card border border-border/30 p-8 md:p-16">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
              <div className="absolute inset-0 bg-gradient-radial from-accent/40 to-transparent" />
            </div>
            
            <div className="relative max-w-2xl">
              <span className="inline-block px-3 py-1 text-xs font-medium uppercase tracking-widest text-success bg-success/10 border border-success/20 rounded-full mb-6">
                Marketplace
              </span>
              <h2 className="text-headline text-foreground mb-4">
                Únete a Nuestra Comunidad de Vendedores
              </h2>
              <p className="text-muted-foreground mb-8">
                Conecta con compradores exclusivos y expande tu negocio en la plataforma de comercio premium más sofisticada.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/marketplace">
                  <Button variant="success" size="lg">
                    Comenzar a Vender
                  </Button>
                </Link>
                <Link to="/support">
                  <Button variant="outline" size="lg">
                    Más Información
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

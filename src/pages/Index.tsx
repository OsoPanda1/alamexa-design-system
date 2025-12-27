import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { ProductCard } from "@/components/ProductCard";
import { CategoryCard } from "@/components/CategoryCard";
import { ArrowRight, Sparkles, Shield, Truck } from "lucide-react";

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
  const jsonLdWebsite = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "ALAMEXA",
      url: "https://alamexa.app",
      description:
        "ALAMEXA es una plataforma premium de trueques, marketplace y ventas P2P, impulsada por TAMV ONLINE NETWORK.",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://alamexa.app/catalog?search={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    }),
    [],
  );

  const jsonLdItemList = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: featuredProducts.map((p, index) => ({
        "@type": "Product",
        position: index + 1,
        name: p.name,
        image: `https://alamexa.app${p.image}`,
        offers: {
          "@type": "Offer",
          price: p.price.toString(),
          priceCurrency: "MXN",
          availability: "https://schema.org/InStock",
        },
      })),
    }),
    [],
  );

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>
          ALAMEXA — Trueques, Marketplace y Ventas Premium impulsadas por TAMV ONLINE NETWORK
        </title>
        <meta
          name="description"
          content="Descubre ALAMEXA, la plataforma premium de trueques y marketplace impulsada por TAMV ONLINE NETWORK. Productos curados, compra segura y envíos express."
        />
        <meta name="author" content="TAMV ONLINE NETWORK" />
        <meta property="og:title" content="ALAMEXA — Marketplace y trueques premium" />
        <meta
          property="og:description"
          content="Colección curada de productos premium, trueques inteligentes y experiencia de compra segura."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/alamexa-og.png" />
        <meta property="og:url" content="https://alamexa.app" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@tamvonline" />
        <meta name="twitter:title" content="ALAMEXA — Plataforma premium de trueques y marketplace" />
        <meta
          name="twitter:description"
          content="Plataforma de comercio y trueque premium con respaldo de TAMV ONLINE NETWORK."
        />
        <meta name="twitter:image" content="/alamexa-og.png" />
        <script type="application/ld+json">{JSON.stringify(jsonLdWebsite)}</script>
        <script type="application/ld+json">{JSON.stringify(jsonLdItemList)}</script>
      </Helmet>

      {/* Glows suaves + grid en background para mayor riqueza visual */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute right-0 top-10 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#111827_1px,transparent_0)] bg-[length:22px_22px] opacity-10" />
      </div>

      <Header />

      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
        </div>

        {/* Content */}
        <div className="relative container-alamexa pt-20 text-center">
          <div className="mx-auto max-w-3xl space-y-8 opacity-0 animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-accent bg-background/40 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(180,180,180,0.9)]" />
              Experiencia Premium · Respaldada por TAMV ONLINE NETWORK
            </span>

            <h1 className="text-display text-foreground opacity-0 animate-slide-up stagger-1">
              La Elegancia{" "}
              <span className="text-gradient-silver drop-shadow-[0_0_24px_rgba(255,255,255,0.45)]">
                Redefinida
              </span>
            </h1>

            <p className="mx-auto max-w-xl text-lg text-muted-foreground opacity-0 animate-slide-up stagger-2 md:text-xl">
              Descubre una colección curada de productos excepcionales para quienes aprecian lo extraordinario, con
              una capa de trueque y comunidad inteligente.
            </p>

            {/* Search */}
            <div className="mx-auto max-w-md opacity-0 animate-slide-up stagger-3">
              <SearchInput
                placeholder="Buscar productos, marcas, categorías..."
                className="h-14"
              />
            </div>

            {/* CTA */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 opacity-0 animate-slide-up stagger-4">
              <Link to="/catalog">
                <Button variant="hero" size="xl" className="shadow-[0_0_30px_rgba(216,171,78,0.45)] hover:shadow-[0_0_45px_rgba(216,171,78,0.7)]">
                  Explorar Catálogo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button
                  variant="outline"
                  size="xl"
                  className="border-border/60 bg-background/60 backdrop-blur hover:bg-background/80"
                >
                  Ver Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-accent/40 p-2">
            <div className="h-2 w-1 rounded-full bg-accent/60" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border/30 bg-card/30 py-16">
        <div className="container-alamexa">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-center gap-4 rounded-xl bg-background/40 p-4 shadow-sm backdrop-blur-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
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
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-headline text-foreground">Categorías</h2>
              <p className="mt-2 text-muted-foreground">
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

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.name} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-card/30 py-20">
        <div className="container-alamexa">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-headline text-foreground">Productos Destacados</h2>
              <p className="mt-2 text-muted-foreground">
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

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20">
        <div className="container-alamexa">
          <div className="bg-gradient-card relative overflow-hidden rounded-2xl border border-border/30 p-8 md:p-16">
            {/* Background decoration */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-20">
              <div className="absolute inset-0 bg-gradient-radial from-accent/40 to-transparent" />
            </div>

            <div className="relative max-w-2xl">
              <span className="mb-6 inline-block rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-success">
                Marketplace
              </span>
              <h2 className="mb-4 text-headline text-foreground">
                Únete a Nuestra Comunidad de Vendedores
              </h2>
              <p className="mb-8 text-muted-foreground">
                Conecta con compradores exclusivos y expande tu negocio en la plataforma de comercio premium más
                sofisticada.
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

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal, Grid3X3, LayoutGrid, X } from "lucide-react";
import { useState } from "react";

import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

const products = [
  { id: "1", name: "Bolso Milano Premium", price: 1299, originalPrice: 1599, image: product1, category: "Accesorios", isNew: true },
  { id: "2", name: "Cronógrafo Plata Obsidiana", price: 3450, image: product2, category: "Relojes", isNew: false },
  { id: "3", name: "Gafas Clubmaster Classic", price: 289, originalPrice: 350, image: product3, category: "Óptica", isNew: false },
  { id: "4", name: "Eau de Parfum Ámbar", price: 185, image: product4, category: "Fragancias", isNew: true },
  { id: "5", name: "Bolso Messenger Executive", price: 899, image: product1, category: "Accesorios", isNew: false },
  { id: "6", name: "Reloj Automático Heritage", price: 4200, originalPrice: 4800, image: product2, category: "Relojes", isNew: true },
  { id: "7", name: "Gafas Aviator Titanium", price: 450, image: product3, category: "Óptica", isNew: false },
  { id: "8", name: "Colonia Intense Night", price: 220, originalPrice: 280, image: product4, category: "Fragancias", isNew: false },
];

const categories = ["Todos", "Accesorios", "Relojes", "Óptica", "Fragancias"];
const priceRanges = ["Todos", "0-500", "500-1000", "1000-3000", "3000+"];

const Catalog = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  const filteredProducts = selectedCategory === "Todos" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 lg:pt-24">
        {/* Page Header */}
        <section className="py-8 lg:py-12 border-b border-border/30">
          <div className="container-alamexa">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <a href="/" className="hover:text-foreground transition-colors">Inicio</a>
              <span>/</span>
              <span className="text-foreground">Catálogo</span>
            </nav>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <h1 className="text-headline text-foreground">Catálogo</h1>
                <p className="text-muted-foreground mt-2">
                  {filteredProducts.length} productos disponibles
                </p>
              </div>

              <div className="flex items-center gap-4">
                <SearchInput 
                  placeholder="Buscar en catálogo..." 
                  containerClassName="w-full lg:w-72"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Toolbar */}
        <section className="py-4 border-b border-border/30 bg-card/30">
          <div className="container-alamexa">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtros
                </Button>

                {/* Category tabs - Desktop */}
                <div className="hidden lg:flex items-center gap-1">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-[160px] bg-muted/50 border-border/50">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevancia</SelectItem>
                    <SelectItem value="price-asc">Precio: menor</SelectItem>
                    <SelectItem value="price-desc">Precio: mayor</SelectItem>
                    <SelectItem value="newest">Más recientes</SelectItem>
                  </SelectContent>
                </Select>

                <div className="hidden sm:flex items-center gap-1 border border-border/50 rounded-lg p-1">
                  <Button
                    variant={gridCols === 3 ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setGridCols(3)}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={gridCols === 4 ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setGridCols(4)}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 lg:py-12">
          <div className="container-alamexa">
            <div className="flex gap-8">
              {/* Sidebar Filters - Desktop */}
              <aside className="hidden lg:block w-64 shrink-0">
                <div className="sticky top-24 space-y-8">
                  {/* Categories */}
                  <div>
                    <h3 className="font-medium text-foreground mb-4">Categorías</h3>
                    <div className="space-y-3">
                      {categories.slice(1).map((cat) => (
                        <div key={cat} className="flex items-center gap-3">
                          <Checkbox 
                            id={cat} 
                            checked={selectedCategory === cat}
                            onCheckedChange={() => setSelectedCategory(
                              selectedCategory === cat ? "Todos" : cat
                            )}
                          />
                          <Label htmlFor={cat} className="text-sm text-muted-foreground cursor-pointer">
                            {cat}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <h3 className="font-medium text-foreground mb-4">Precio</h3>
                    <div className="space-y-3">
                      {priceRanges.slice(1).map((range) => (
                        <div key={range} className="flex items-center gap-3">
                          <Checkbox id={`price-${range}`} />
                          <Label htmlFor={`price-${range}`} className="text-sm text-muted-foreground cursor-pointer">
                            ${range}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <h3 className="font-medium text-foreground mb-4">Disponibilidad</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Checkbox id="in-stock" defaultChecked />
                        <Label htmlFor="in-stock" className="text-sm text-muted-foreground cursor-pointer">
                          En stock
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <Checkbox id="new-arrivals" />
                        <Label htmlFor="new-arrivals" className="text-sm text-muted-foreground cursor-pointer">
                          Novedades
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <Checkbox id="on-sale" />
                        <Label htmlFor="on-sale" className="text-sm text-muted-foreground cursor-pointer">
                          En oferta
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Products Grid */}
              <div className="flex-1">
                {/* Active filters */}
                {selectedCategory !== "Todos" && (
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-sm text-muted-foreground">Filtros activos:</span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedCategory("Todos")}
                      className="h-7"
                    >
                      {selectedCategory}
                      <X className="h-3 w-3 ml-2" />
                    </Button>
                  </div>
                )}

                <div className={`grid gap-6 ${
                  gridCols === 3 
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                }`}>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>

                {/* Load More */}
                <div className="mt-12 text-center">
                  <Button variant="outline" size="lg">
                    Cargar más productos
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Mobile Filters Drawer */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-card border-l border-border/30 p-6 overflow-y-auto animate-slide-down">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Filtros</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-foreground mb-3">Categorías</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowFilters(false);
                      }}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;

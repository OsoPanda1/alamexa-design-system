import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";

// Sample products data
const sampleProducts = [
  {
    title: "iPhone 15 Pro Max 256GB",
    description: "iPhone 15 Pro Max en excelente estado, con caja original y todos los accesorios. Batería al 95%. Color Titanio Natural.",
    category: "electronica",
    subcategory: "smartphones",
    condition: "como_nuevo",
    price: 24999,
    original_price: 29999,
    trade_type: "both",
    trade_preferences: "Busco MacBook Pro o iPad Pro de última generación",
    location: "Ciudad de México",
    images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800"],
  },
  {
    title: "Nike Air Max 90 OG",
    description: "Tenis Nike Air Max 90 originales, talla 28 MX. Edición especial infrared. Usados solo 3 veces.",
    category: "ropa",
    subcategory: "calzado",
    condition: "como_nuevo",
    price: 3499,
    original_price: 4299,
    trade_type: "trade",
    trade_preferences: "Acepto otros tenis Nike o Adidas en buen estado",
    location: "Guadalajara",
    images: ["https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800"],
  },
  {
    title: "MacBook Pro M3 14 pulgadas",
    description: "MacBook Pro con chip M3 Pro, 18GB RAM, 512GB SSD. Comprada hace 2 meses, con AppleCare+ vigente hasta 2026.",
    category: "electronica",
    subcategory: "laptops",
    condition: "nuevo",
    price: 45999,
    trade_type: "sale",
    location: "Monterrey",
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800"],
  },
  {
    title: "PlayStation 5 Digital Edition",
    description: "PS5 edición digital con 2 controles DualSense y 5 juegos digitales incluidos. En perfectas condiciones.",
    category: "electronica",
    subcategory: "gaming",
    condition: "buen_estado",
    price: 12999,
    original_price: 14999,
    trade_type: "both",
    trade_preferences: "Xbox Series X o PC gaming",
    location: "Puebla",
    images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800"],
  },
  {
    title: "Bicicleta Trek Marlin 7",
    description: "Bicicleta de montaña Trek Marlin 7, rodada 29, talla L. Suspensión RockShox, frenos hidráulicos Shimano.",
    category: "deportes",
    subcategory: "ciclismo",
    condition: "buen_estado",
    price: 18500,
    trade_type: "both",
    trade_preferences: "Equipo de fotografía o instrumentos musicales",
    location: "Querétaro",
    images: ["https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800"],
  },
  {
    title: "Cámara Sony A7 III + Lente 24-70mm",
    description: "Kit profesional Sony A7 III con lente Sony FE 24-70mm f/2.8 GM. 15,000 disparos. Incluye 2 baterías extra.",
    category: "electronica",
    subcategory: "camaras",
    condition: "como_nuevo",
    price: 42000,
    trade_type: "both",
    trade_preferences: "MacBook Pro o equipo de video",
    location: "Ciudad de México",
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800"],
  },
  {
    title: "Guitarra Fender Stratocaster MX",
    description: "Fender Stratocaster Player Series hecha en México. Color Sunburst, diapasón de maple. Con estuche rígido.",
    category: "arte",
    subcategory: "instrumentos",
    condition: "buen_estado",
    price: 15500,
    original_price: 18000,
    trade_type: "trade",
    trade_preferences: "Gibson Les Paul o equipos de audio",
    location: "Tijuana",
    images: ["https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800"],
  },
  {
    title: "Apple Watch Series 9 45mm",
    description: "Apple Watch Series 9 GPS + Cellular, caja de acero inoxidable grafito con correa deportiva negra.",
    category: "electronica",
    subcategory: "wearables",
    condition: "nuevo",
    price: 12999,
    trade_type: "sale",
    location: "León",
    images: ["https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800"],
  },
];

interface SampleProductsProps {
  onProductsCreated?: () => void;
}

export function SampleProducts({ onProductsCreated }: SampleProductsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [hasProducts, setHasProducts] = useState<boolean | null>(null);

  useEffect(() => {
    checkExistingProducts();
  }, []);

  const checkExistingProducts = async () => {
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });
    
    setHasProducts((count ?? 0) > 0);
  };

  const createSampleProducts = async () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Necesitas iniciar sesión para crear productos.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const productsToInsert = sampleProducts.map((product) => ({
        ...product,
        seller_id: user.id,
        status: "active",
      }));

      const { error } = await supabase
        .from("products")
        .insert(productsToInsert);

      if (error) throw error;

      toast({
        title: "¡Productos creados!",
        description: `Se han creado ${sampleProducts.length} productos de prueba.`,
      });

      setHasProducts(true);
      onProductsCreated?.();
    } catch (error) {
      console.error("Error creating sample products:", error);
      toast({
        title: "Error",
        description: "No se pudieron crear los productos de prueba.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (hasProducts === null) return null;

  if (hasProducts) return null;

  return (
    <div className="p-4 rounded-xl border border-accent/30 bg-accent/5">
      <div className="flex items-center gap-3 mb-3">
        <Sparkles className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-foreground">Poblar Marketplace</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        El marketplace está vacío. ¿Deseas crear {sampleProducts.length} productos de prueba para comenzar?
      </p>
      <Button
        onClick={createSampleProducts}
        disabled={loading || !user}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creando productos...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Crear productos de prueba
          </>
        )}
      </Button>
      {!user && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Inicia sesión para crear productos
        </p>
      )}
    </div>
  );
}

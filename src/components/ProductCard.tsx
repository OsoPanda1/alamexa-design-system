import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  isNew,
}: ProductCardProps) {
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <Link to={`/product/${id}`} className="block group">
      <Card className="overflow-hidden bg-gradient-card border-border/30 hover:shadow-lg transition-shadow">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Quick actions */}
          <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <Button variant="secondary" size="sm" className="flex-1" onClick={(e) => e.preventDefault()}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Añadir
            </Button>
            <Button variant="outline" size="icon" className="shrink-0 bg-background/50 backdrop-blur-sm" onClick={(e) => e.preventDefault()}>
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {isNew && (
              <span className="px-2 py-1 text-xs font-medium bg-success text-success-foreground rounded">
                Nuevo
              </span>
            )}
            {discount > 0 && (
              <span className="px-2 py-1 text-xs font-medium bg-destructive text-destructive-foreground rounded">
                -{discount}%
              </span>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {category}
          </p>
          <h3 className="font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2 mb-2">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-foreground">
              ${price.toLocaleString()}
            </span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

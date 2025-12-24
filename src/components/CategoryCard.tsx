import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  name: string;
  itemCount: number;
  image: string;
  href: string;
  className?: string;
}

export function CategoryCard({ name, itemCount, image, href, className }: CategoryCardProps) {
  return (
    <Link
      to={href}
      className={cn(
        "group relative overflow-hidden rounded-lg aspect-[3/4] block",
        className
      )}
    >
      <img
        src={image}
        alt={name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      
      {/* Silver glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 border border-accent/40 rounded-lg shadow-silver-glow" />
      </div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-xl font-serif font-semibold text-foreground mb-1">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {itemCount} productos
        </p>
      </div>
    </Link>
  );
}

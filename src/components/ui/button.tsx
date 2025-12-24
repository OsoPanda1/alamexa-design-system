import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // ALAMEXA Primary: Negro con borde plateado, texto marfil
        default:
          "bg-primary text-primary-foreground border border-accent/40 hover:border-accent/70 hover:shadow-silver-glow",
        // ALAMEXA Secondary: Fondo marfil, borde plateado, texto negro
        secondary:
          "bg-secondary text-secondary-foreground border border-accent/40 hover:border-accent/70 hover:shadow-silver-glow",
        // Verde bandera sólido - Confirmaciones
        success:
          "bg-success text-success-foreground hover:bg-success/90 shadow-sm",
        // Cherry sólido - Acciones destructivas
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        // Outline con brillo plateado
        outline:
          "border border-accent/40 bg-transparent text-foreground hover:bg-accent/10 hover:border-accent/70 hover:shadow-silver-glow",
        // Ghost para navegación
        ghost:
          "text-muted-foreground hover:text-foreground hover:bg-muted/50",
        // Link style
        link:
          "text-accent underline-offset-4 hover:underline hover:text-silver-bright",
        // Hero CTA - premium styling
        hero:
          "bg-gradient-silver text-deep-black font-semibold border-0 hover:shadow-silver-glow-lg hover:scale-[1.02] active:scale-[0.98]",
        // Subtle muted button
        muted:
          "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

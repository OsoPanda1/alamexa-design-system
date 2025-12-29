import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { isArray } from "lodash-es"; // O usa tu polyfill

/**
 * Utility suprema para Tailwind CSS con validación, breakpoints y variantes
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * cn responsive con breakpoints automáticos
 * @example cx("p-4", { md: "p-6", lg: "p-8" }) → "p-4 md:p-6 lg:p-8"
 */
export function cx(
  base: ClassValue,
  responsive?: Partial<Record<"sm" | "md" | "lg" | "xl" | "2xl", ClassValue>>,
  conditionals?: Record<string, ClassValue>
): string {
  const classes: ClassValue[] = [base];

  // Responsive variants
  if (responsive) {
    Object.entries(responsive).forEach(([breakpoint, classes]) => {
      if (classes) {
        classes = isArray(classes) ? classes : [classes];
        classes.forEach((cls) => classes.push(`${breakpoint}:${cls}`));
      }
    });
  }

  // Conditionals (hover, focus, active, etc.)
  if (conditionals) {
    Object.entries(conditionals).forEach(([state, classes]) => {
      if (classes) {
        classes = isArray(classes) ? classes : [classes];
        classes.forEach((cls) => classes.push(`${state}:${cls}`));
      }
    });
  }

  return cn(classes);
}

/**
 * cn condicional simple (mejor DX que ternarios)
 * @example cnd("btn", { active: true, disabled: false }) → "btn active"
 */
export function cnd(base: ClassValue, conditions: Record<string, boolean>): string {
  const activeClasses: ClassValue[] = [base];
  
  Object.entries(conditions).forEach(([key, isActive]) => {
    if (isActive) {
      activeClasses.push(key);
    }
  });
  
  return cn(activeClasses);
}

/**
 * cn con variantes de Shadcn/UI pattern
 * @example variant({ variant: "destructive", size: "lg" }) → "btn btn-destructive btn-lg"
 */
export function variant({
  base = "",
  variant = "default",
  size = "default",
  color = "default",
}: {
  base?: ClassValue;
  variant?: string;
  size?: string;
  color?: string;
}): string {
  return cn(
    base,
    `variant-${variant}`,
    `size-${size}`,
    color !== "default" && `color-${color}`
  );
}

/**
 * cn para dark mode inteligente
 * @example dark("text-white", "text-black") → "text-black dark:text-white"
 */
export function dark(light: ClassValue, dark: ClassValue): string {
  return cn(light, "dark:" + dark);
}

/**
 * cn con spacing utilitario (p, m, gap)
 * @example space("p-4 m-2 gap-1", { responsive: true })
 */
export function space(
  spacing: ClassValue,
  options: { responsive?: boolean; direction?: "x" | "y" } = {}
): string {
  const { responsive = false, direction } = options;
  
  if (!responsive) return cn(spacing);
  
  const dirs = {
    x: ["-left", "-right"],
    y: ["-top", "-bottom"],
  };
  
  return cn(
    spacing,
    direction && dirs[direction as keyof typeof dirs]?.map(dir => `${dir}-auto`)
  );
}

/**
 * cn con animaciones predefinidas
 */
export function animate(
  animation: "fadeIn" | "slideUp" | "bounce" | "spin" | string
): string {
  const animations = {
    fadeIn: "animate-fade-in",
    slideUp: "animate-slide-up",
    bounce: "animate-bounce",
    spin: "animate-spin",
  };
  
  return cn(animations[animation as keyof typeof animations] || animation);
}

/**
 * cn para gradients complejos
 */
export function gradient(
  direction: "to-r" | "to-b" | "to-tr" | "to-bl" = "to-r",
  colors: [string, string, string?] = ["primary", "secondary"]
): string {
  const [from, via, to = from] = colors;
  return cn(
    "bg-gradient-to",
    direction,
    `from-${from}`,
    via && `via-${via}`,
    `to-${to}`
  );
}

// Type helpers para autocomplete en IDE
type ResponsiveKeys = "sm" | "md" | "lg" | "xl" | "2xl";
type StateKeys = "hover" | "focus" | "active" | "disabled" | "dark";

declare module "clsx" {
  interface ClassValue {
    [K in ResponsiveKeys]?: ClassValue;
    [K in StateKeys]?: ClassValue;
  }
}

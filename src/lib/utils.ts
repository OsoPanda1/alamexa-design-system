import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility para Tailwind CSS con merge inteligente
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * cn condicional simple
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
 * cn para dark mode
 */
export function dark(light: ClassValue, darkClass: ClassValue): string {
  return cn(light, typeof darkClass === 'string' ? `dark:${darkClass}` : darkClass);
}

/**
 * cn con animaciones predefinidas
 */
export function animate(
  animation: "fadeIn" | "slideUp" | "bounce" | "spin" | string
): string {
  const animations: Record<string, string> = {
    fadeIn: "animate-fade-in",
    slideUp: "animate-slide-up",
    bounce: "animate-bounce",
    spin: "animate-spin",
  };
  
  return cn(animations[animation] || animation);
}

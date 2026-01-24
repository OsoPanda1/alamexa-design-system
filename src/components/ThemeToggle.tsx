import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "icon" | "switch" | "dropdown";
  className?: string;
}

export function ThemeToggle({ variant = "icon", className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  if (variant === "switch") {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          "relative inline-flex h-8 w-14 items-center rounded-full transition-colors",
          isDark ? "bg-muted" : "bg-accent/20",
          className
        )}
        aria-label="Toggle theme"
      >
        <motion.span
          layout
          className={cn(
            "inline-flex h-6 w-6 items-center justify-center rounded-full bg-background shadow-md"
          )}
          animate={{ x: isDark ? 28 : 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {isDark ? (
            <Moon className="h-3.5 w-3.5 text-accent" />
          ) : (
            <Sun className="h-3.5 w-3.5 text-amber-500" />
          )}
        </motion.span>
      </button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className={cn("relative overflow-hidden", className)}
          aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          <motion.div
            initial={false}
            animate={{
              rotate: isDark ? 0 : 180,
              scale: isDark ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute"
          >
            <Moon className="h-5 w-5 text-muted-foreground" />
          </motion.div>
          <motion.div
            initial={false}
            animate={{
              rotate: isDark ? -180 : 0,
              scale: isDark ? 0 : 1,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute"
          >
            <Sun className="h-5 w-5 text-amber-500" />
          </motion.div>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isDark ? "Modo claro" : "Modo oscuro"}</p>
      </TooltipContent>
    </Tooltip>
  );
}

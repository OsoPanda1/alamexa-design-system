import { forwardRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = forwardRef<HTMLDivElement>((props, ref) => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Sugerencias de páginas populares
  const suggestions = [
    { label: "Inicio", path: "/", icon: Home },
    { label: "Marketplace", path: "/marketplace", icon: Search },
    { label: "Catálogo", path: "/catalog", icon: MapPin },
  ];

  return (
    <div
      ref={ref}
      className="min-h-screen bg-background flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative text-center max-w-lg"
      >
        {/* Número 404 animado */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <span className="text-[150px] md:text-[200px] font-bold leading-none text-gradient-silver">
            404
          </span>
        </motion.div>

        {/* Mensaje */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Página no encontrada
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            La página que buscas no existe o ha sido movida. Pero no te
            preocupes, puedes explorar otras secciones de ALAMEXA.
          </p>
        </motion.div>

        {/* Sugerencias */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {suggestions.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant="outline"
                className="gap-2 border-border/50 hover:border-accent/50 hover:bg-accent/5"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </motion.div>

        {/* Botón principal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link to="/">
            <Button size="lg" className="gap-2 bg-accent text-accent-foreground">
              <ArrowLeft className="w-5 h-5" />
              Volver al inicio
            </Button>
          </Link>
        </motion.div>

        {/* Ruta actual */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-xs text-muted-foreground/50"
        >
          Ruta solicitada: <code className="text-accent/70">{location.pathname}</code>
        </motion.p>
      </motion.div>
    </div>
  );
});

NotFound.displayName = "NotFound";

export default NotFound;

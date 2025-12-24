import { Link } from "react-router-dom";

const footerLinks = {
  plataforma: [
    { name: "Catálogo", path: "/catalog" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "DreamSpaces", path: "/dreamspaces" },
    { name: "Gobernanza", path: "/governance" },
  ],
  soporte: [
    { name: "Centro de Ayuda", path: "/support" },
    { name: "Contacto", path: "/support" },
    { name: "FAQ", path: "/support" },
    { name: "Moderación", path: "/moderation" },
  ],
  legal: [
    { name: "Términos de Servicio", path: "/terms" },
    { name: "Privacidad", path: "/privacy" },
    { name: "Cookies", path: "/cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/30 bg-card/50">
      <div className="container-alamexa py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-silver flex items-center justify-center">
                <span className="text-deep-black font-bold text-lg font-serif">A</span>
              </div>
              <span className="text-xl font-serif font-semibold tracking-tight text-foreground">
                ALAMEXA
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La plataforma premium de comercio electrónico y experiencias inmersivas.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Plataforma</h4>
            <ul className="space-y-2">
              {footerLinks.plataforma.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Soporte</h4>
            <ul className="space-y-2">
              {footerLinks.soporte.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 ALAMEXA. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted-foreground">Hecho con sofisticación</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

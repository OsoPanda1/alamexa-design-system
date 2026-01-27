import { Link } from "react-router-dom";
import { RefreshCw, Shield, Star, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const footerLinks = {
  plataforma: [{
    name: "Marketplace",
    path: "/marketplace"
  }, {
    name: "Catálogo",
    path: "/catalog"
  }, {
    name: "Membresías",
    path: "/memberships"
  }, {
    name: "Sobre ALAMEXA",
    path: "/about"
  }, {
    name: "DevHub",
    path: "/devhub"
  }],
  cuenta: [{
    name: "Mi Cuenta",
    path: "/account"
  }, {
    name: "Mis Trueques",
    path: "/trades"
  }, {
    name: "Dashboard",
    path: "/dashboard"
  }, {
    name: "Carrito",
    path: "/cart"
  }, {
    name: "Publicar Producto",
    path: "/products/new"
  }],
  soporte: [{
    name: "Centro de Ayuda",
    path: "/help"
  }, {
    name: "Cómo funciona",
    path: "/about#how-it-works"
  }, {
    name: "Seguridad",
    path: "/about#security"
  }, {
    name: "Contacto",
    path: "/contact"
  }],
  legal: [{
    name: "Términos de Servicio",
    path: "/terms"
  }, {
    name: "Privacidad",
    path: "/privacy"
  }, {
    name: "Cookies",
    path: "/cookies"
  }]
};
const features = [{
  icon: RefreshCw,
  text: "Trueque Seguro"
}, {
  icon: Shield,
  text: "Verificación"
}, {
  icon: Star,
  text: "Reputación"
}];
export function Footer() {
  return <footer className="border-t border-border/30 bg-card/50">
      {/* Main Footer */}
      <div className="container-alamexa py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-silver flex items-center justify-center shadow-md">
                <span className="text-deep-black font-bold text-xl font-serif">A</span>
              </div>
              <span className="text-2xl font-serif font-bold tracking-tight text-foreground">
                ALAMEXA
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-xs leading-relaxed">
              La nueva era del comercio inteligente. Compra, vende e intercambia 
              con estilo, seguridad y confianza.
            </p>
            
            {/* Features badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {features.map(feature => <div key={feature.text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-xs text-muted-foreground">
                  <feature.icon className="w-3.5 h-3.5" />
                  {feature.text}
                </div>)}
            </div>

            {/* Newsletter */}
            <div className="max-w-xs">
              <p className="text-sm font-medium text-foreground mb-3">
                Recibe novedades
              </p>
              <div className="flex gap-2">
                <Input type="email" placeholder="tu@email.com" className="h-10 bg-background/50" />
                <Button size="sm" className="h-10 px-4 bg-accent text-accent-foreground">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Plataforma */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Plataforma</h4>
            <ul className="space-y-3">
              {footerLinks.plataforma.map(link => <li key={link.name}>
                  <Link to={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* Cuenta */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Mi Cuenta</h4>
            <ul className="space-y-3">
              {footerLinks.cuenta.map(link => <li key={link.name}>
                  <Link to={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Soporte</h4>
            <ul className="space-y-3">
              {footerLinks.soporte.map(link => <li key={link.name}>
                  <Link to={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map(link => <li key={link.name}>
                  <Link to={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/30">
        <div className="container-alamexa py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ALAMEXA. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted-foreground">Hecho con ♥ en Real del Monte, Hidalgo, Mexico
Plataforma creada con tecnologia TAMV ONLINE </span>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>;
}
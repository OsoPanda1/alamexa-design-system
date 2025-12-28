import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Search, ShoppingCart, User, Menu, X, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useUserRole } from "@/hooks/useUserRole";
import { getNavRoutes } from "@/config/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { itemCount } = useCart();
  const { role } = useUserRole();
  
  // Get navigation routes from config
  const mainNavRoutes = getNavRoutes('main');

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
      <div className="container-alamexa">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-gradient-silver flex items-center justify-center">
              <span className="text-deep-black font-bold text-lg font-serif">A</span>
            </div>
            <span className="text-xl font-serif font-semibold tracking-tight text-foreground hidden sm:block">
              ALAMEXA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNavRoutes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300",
                  location.pathname === route.path
                    ? "text-foreground bg-muted/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
              >
                {route.labelEs}
              </Link>
            ))}
            <Link
              to="/about"
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300",
                location.pathname === "/about"
                  ? "text-foreground bg-muted/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              )}
            >
              Sobre TAMV
            </Link>
            <Link
              to="/devhub"
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 text-primary",
                location.pathname === "/devhub"
                  ? "bg-primary/10"
                  : "hover:bg-primary/5"
              )}
            >
              DevHub
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Search className="h-5 w-5" />
            </Button>
            
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="text-muted-foreground relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-success text-[10px] font-medium text-success-foreground flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground relative">
                    <User className="h-5 w-5" />
                    {role === 'admin' && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-cherry" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Mi Cuenta
                    </Link>
                  </DropdownMenuItem>
                  {(role === 'admin' || role === 'moderator') && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center gap-2 text-cherry">
                          <Shield className="h-4 w-4" />
                          Panel Admin
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-destructive">
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border/30 bg-background/95 backdrop-blur-xl animate-slide-down">
          <nav className="container-alamexa py-4 flex flex-col gap-1">
            {mainNavRoutes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300",
                  location.pathname === route.path
                    ? "text-foreground bg-muted/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
              >
                {route.labelEs}
              </Link>
            ))}
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300",
                location.pathname === "/about"
                  ? "text-foreground bg-muted/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              )}
            >
              Sobre TAMV
            </Link>
            <Link
              to="/devhub"
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-3 text-sm font-medium rounded-lg text-primary hover:bg-primary/10"
            >
              DevHub / Registro TAMV
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/account"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30"
                >
                  Mi Cuenta
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleSignOut();
                  }}
                  className="px-4 py-3 text-sm font-medium rounded-lg text-destructive hover:bg-destructive/10 text-left"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium rounded-lg text-accent hover:bg-muted/30"
              >
                Iniciar Sesión
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

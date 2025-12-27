import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  fullName: z.string().min(2, "Mínimo 2 caracteres"),
});

type ErrorMap = Record<string, string>;

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signIn, signUp, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [errors, setErrors] = useState<ErrorMap>({});
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");

  useEffect(() => {
    if (user && !authLoading) {
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const mapZodErrors = (prefix: "login" | "register", issue: z.ZodIssue) => {
    const field = issue.path[0];
    if (!field) return null;
    return { key: `${prefix}_${String(field)}`, message: issue.message };
  };

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});

      const result = loginSchema.safeParse({
        email: loginEmail,
        password: loginPassword,
      });

      if (!result.success) {
        const fieldErrors: ErrorMap = {};
        result.error.errors.forEach((err) => {
          const mapped = mapZodErrors("login", err);
          if (mapped) fieldErrors[mapped.key] = mapped.message;
        });
        setErrors(fieldErrors);
        return;
      }

      try {
        setIsLoggingIn(true);
        const { error } = await signIn(loginEmail, loginPassword);
        if (error) {
          setErrors({ login_global: error.message || "Error al iniciar sesión" });
          toast({
            title: "Error al iniciar sesión",
            description: error.message || "Verifica tus credenciales.",
            variant: "destructive",
          });
          return;
        }
        navigate("/", { replace: true });
      } finally {
        setIsLoggingIn(false);
      }
    },
    [loginEmail, loginPassword, signIn, navigate, toast],
  );

  const handleRegister = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});

      const result = registerSchema.safeParse({
        email: registerEmail,
        password: registerPassword,
        fullName: registerName,
      });

      if (!result.success) {
        const fieldErrors: ErrorMap = {};
        result.error.errors.forEach((err) => {
          const mapped = mapZodErrors("register", err);
          if (mapped) fieldErrors[mapped.key] = mapped.message;
        });
        setErrors(fieldErrors);
        return;
      }

      try {
        setIsRegistering(true);
        const { error } = await signUp(
          registerEmail,
          registerPassword,
          registerName,
        );

        if (error) {
          setErrors({
            register_global:
              error.message || "Error al crear la cuenta",
          });
          toast({
            title: "Error al registrarse",
            description: error.message || "Intenta nuevamente.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Cuenta creada",
          description: "Te hemos registrado correctamente.",
        });
        navigate("/", { replace: true });
      } finally {
        setIsRegistering(false);
      }
    },
    [registerEmail, registerPassword, registerName, signUp, navigate, toast],
  );

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  const isLoading = isLoggingIn || isRegistering;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-bold text-gradient-silver">
            ALAMEXA
          </h1>
          <p className="mt-2 text-muted-foreground">
            Tu plataforma de trueque digital
          </p>
        </div>

        <Card className="border-border/30 bg-card/50 backdrop-blur-sm">
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as "login" | "register")}
            className="w-full"
          >
            <CardHeader className="pb-0">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent className="pt-6">
              {/* Login Tab */}
              <TabsContent value="login" className="mt-0">
                <CardTitle className="mb-1 text-xl">
                  Bienvenido de vuelta
                </CardTitle>
                <CardDescription className="mb-6">
                  Ingresa tus credenciales para continuar
                </CardDescription>

                {errors.login_global && (
                  <p className="mb-4 text-sm text-destructive">
                    {errors.login_global}
                  </p>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      placeholder="tu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className={
                        errors.login_email ? "border-destructive" : undefined
                      }
                    />
                    {errors.login_email && (
                      <p className="text-sm text-destructive">
                        {errors.login_email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPasswordLogin ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) =>
                          setLoginPassword(e.target.value)
                        }
                        className={
                          errors.login_password
                            ? "border-destructive"
                            : undefined
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() =>
                          setShowPasswordLogin((prev) => !prev)
                        }
                        aria-label={
                          showPasswordLogin
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                      >
                        {showPasswordLogin ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.login_password && (
                      <p className="text-sm text-destructive">
                        {errors.login_password}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Ingresando...
                      </>
                    ) : (
                      "Iniciar sesión"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="mt-0">
                <CardTitle className="mb-1 text-xl">
                  Crea tu cuenta
                </CardTitle>
                <CardDescription className="mb-6">
                  Únete a la comunidad ALAMEXA
                </CardDescription>

                {errors.register_global && (
                  <p className="mb-4 text-sm text-destructive">
                    {errors.register_global}
                  </p>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nombre completo</Label>
                    <Input
                      id="register-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Tu nombre"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className={
                        errors.register_fullName
                          ? "border-destructive"
                          : undefined
                      }
                    />
                    {errors.register_fullName && (
                      <p className="text-sm text-destructive">
                        {errors.register_fullName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      autoComplete="email"
                      placeholder="tu@email.com"
                      value={registerEmail}
                      onChange={(e) =>
                        setRegisterEmail(e.target.value)
                      }
                      className={
                        errors.register_email
                          ? "border-destructive"
                          : undefined
                      }
                    />
                    {errors.register_email && (
                      <p className="text-sm text-destructive">
                        {errors.register_email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPasswordRegister ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={registerPassword}
                        onChange={(e) =>
                          setRegisterPassword(e.target.value)
                        }
                        className={
                          errors.register_password
                            ? "border-destructive"
                            : undefined
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() =>
                          setShowPasswordRegister((prev) => !prev)
                        }
                        aria-label={
                          showPasswordRegister
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                      >
                        {showPasswordRegister ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.register_password && (
                      <p className="text-sm text-destructive">
                        {errors.register_password}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="success"
                    className="w-full"
                    disabled={isRegistering}
                  >
                    {isRegistering ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creando cuenta...
                      </>
                    ) : (
                      "Crear cuenta"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Al continuar, aceptas nuestros{" "}
          <Link to="/terms" className="text-accent hover:underline">
            Términos de servicio
          </Link>{" "}
          y{" "}
          <Link to="/privacy" className="text-accent hover:underline">
            Política de privacidad
          </Link>
        </p>
      </div>
    </div>
  );
}

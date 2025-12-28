import React, { useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Shield,
  Users,
  Repeat,
  Globe,
  Heart,
  Star,
  Code,
  Zap,
  Lock,
  Eye,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

/**
 * Animations
 */
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

/**
 * Data-driven sections
 */
const platforms: Array<{
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  borderClass: string;
  iconClass: string;
  highlight?: string;
}> = [
  {
    title: "TAMV ONLINE METAVERSO",
    description:
      'Infraestructura para experiencias inmersivas, economías digitales y módulos XR propios. No es un "metaverso genérico", sino un espacio donde se cruzan identidad, cultura, trueque, gobernanza y narrativa latinoamericana.',
    icon: Globe,
    borderClass: "border-primary/20",
    iconClass: "text-primary",
  },
  {
    title: "ISABELLA VILLASEÑOR AI",
    description:
      "Isabella es una inteligencia artificial con identidad, tono y propósito. No es un chatbot genérico: es el cerebro narrativo y operativo del ecosistema, capaz de interpretar el KÓRIMA Codex, asistir en decisiones, guiar experiencias y servir como puente entre las personas y las capas técnicas de TAMV.",
    icon: Sparkles,
    borderClass: "border-secondary/20",
    iconClass: "text-secondary",
  },
  {
    title: "ALAMEXA – Plataforma P2P",
    description:
      "ALAMEXA es la plataforma P2P de trueque y comercio ético entre personas. Es el espacio donde se demuestra que se puede construir una economía más justa, basada en reputación, colaboración y acuerdos transparentes.",
    icon: Repeat,
    borderClass: "border-emerald-500/20",
    iconClass: "text-emerald-500",
    highlight: "TAMV ha decidido destinar el 50% del valor de ALAMEXA (~$3.5M USD) a la creación de una comunidad de desarrolladores.",
  },
  {
    title: "UNO – Representación profesional",
    description:
      "UNO es la pieza que convierte talentos aislados en un gremio representado. Cada desarrollador que se une a TAMV se registra en UNO, su perfil se convierte en una identidad profesional respaldada, y ofrece sus servicios bajo la firma TAMV ONLINE NETWORK.",
    icon: Users,
    borderClass: "border-sky-500/20",
    iconClass: "text-sky-500",
  },
];

const sentinelSystems = [
  {
    name: "ANUBIS Sentinel",
    description:
      "Centinela de integridad y trazabilidad. Vigila accesos, operaciones críticas y patrones anómalos.",
    icon: Shield,
    colorClass: "text-amber-500",
  },
  {
    name: "ORUS Sentinel",
    description:
      "Monitor de actividad y comportamiento. Observa movimientos de usuarios y servicios.",
    icon: Eye,
    colorClass: "text-blue-500",
  },
  {
    name: "Dekateotl System",
    description:
      "Motor de justicia algorítmica. Penaliza el abuso y premia la cooperación.",
    icon: Award,
    colorClass: "text-purple-500",
  },
  {
    name: "Aztek Gods",
    description:
      "Módulos simbólicos basados en deidades mexicas para roles sistémicos.",
    icon: Zap,
    colorClass: "text-red-500",
  },
] as const;

const protocols = [
  {
    name: "KAOS Audio 3D",
    description:
      "Motor de audio espacial para experiencias inmersivas, ceremonias digitales y storytelling sonoro.",
    icon: "🎧",
  },
  {
    name: "Protocolo Fénix",
    description:
      "Marco de resiliencia: recuperación tras fallas, migración de infraestructuras sin pérdida de identidad.",
    icon: "🔥",
  },
  {
    name: "Protocolo de Iniciación",
    description:
      "Camino para nuevos miembros: verificación, alineación de principios e introducción al ecosistema.",
    icon: "🚀",
  },
  {
    name: "Protocolo Hoyo Negro",
    description:
      "Procedimiento extremo para fraude masivo o ataques coordinados: congelar, aislar y reconstruir.",
    icon: "🕳️",
  },
] as const;

/**
 * Component
 */
export default function About() {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section
        className="relative py-20 overflow-hidden"
        aria-labelledby="about-hero-title"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="container relative z-10 mx-auto px-4">
          <motion.header
            className="mx-auto max-w-4xl text-center"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1
              id="about-hero-title"
              className="mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-4xl font-bold text-transparent md:text-6xl"
            >
              TAMV ONLINE NETWORK
            </h1>
            <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
              El gremio latino que se niega a ser solo mano de obra
            </p>
            <div
              className="flex flex-wrap justify-center gap-4"
              aria-label="Acciones principales"
            >
              <Button size="lg" asChild>
                <Link to="/auth">
                  Únete al gremio
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#devhub">DevHub</a>
              </Button>
            </div>
          </motion.header>
        </div>
      </section>

      {/* Manifiesto */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="prose prose-lg mx-auto max-w-4xl dark:prose-invert"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <p className="text-xl leading-relaxed text-foreground">
              En Latinoamérica sobran ideas y talento, pero faltan recursos,
              estructura y respeto hacia los desarrolladores independientes.
              Demasiados proyectos mueren no por falta de capacidad técnica,
              sino por ausencia de respaldo económico, legal y operativo.
            </p>
            <p className="text-xl leading-relaxed text-foreground">
              <strong>TAMV ONLINE NETWORK</strong> nace justamente contra eso:
              como un ecosistema tecnológico y una bandera común para quienes se
              rehúsan a aceptar que su destino es trabajar siempre para otros.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Origen */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="mx-auto max-w-4xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <h2 className="mb-8 text-center text-3xl font-bold">
              Origen: un desarrollador, un sueño, un límite roto
            </h2>
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <p className="mb-6 text-lg text-muted-foreground">
                  Detrás de TAMV está una persona con nombre y apellido:{" "}
                  <strong className="text-foreground">
                    Edwin Oswaldo Castillo Trejo
                  </strong>
                  . No es un fondo de inversión ni una consultora tradicional; es
                  un desarrollador latino que tomó una decisión brutalmente
                  clara:
                </p>
                <blockquote className="rounded-r-lg border-l-4 border-primary bg-primary/5 py-4 pl-6 text-lg italic">
                  "Voy a grabar mi nombre en la historia moderna del internet
                  demostrando que la unidad de los latinos puede construir sus
                  propias plataformas globales. Mi único obstáculo será mi
                  propia mente."
                </blockquote>
                <p className="mt-6 text-lg text-muted-foreground">
                  No hay promesas de dinero fácil ni humo de startup para
                  impresionar inversionistas. Hay código, arquitectura,
                  documentación y una visión obsesiva: crear un ecosistema donde
                  los desarrolladores latinos no pidan permiso para innovar;
                  simplemente lo hagan juntos.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Plataformas */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <header className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold">
              El corazón de TAMV: plataformas que ya existen
            </h2>
            <p className="text-muted-foreground">
              TAMV ONLINE NETWORK no es una idea en una servilleta. Es un
              entramado de plataformas, módulos y protocolos diseñados,
              documentados y conectados bajo una misma visión.
            </p>
          </header>

          <motion.div
            className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {platforms.map(
              (
                {
                  title,
                  description,
                  icon: Icon,
                  borderClass,
                  iconClass,
                  highlight,
                },
                index,
              ) => (
                <motion.div key={title} variants={fadeInUp}>
                  <Card
                    className={`h-full border ${borderClass} transition-shadow hover:shadow-lg`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Icon
                          className={`h-8 w-8 ${iconClass}`}
                          aria-hidden="true"
                        />
                        {title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{description}</p>
                      {highlight && (
                        <div className="mt-4 rounded-lg bg-emerald-500/10 p-4">
                          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                            {highlight}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ),
            )}
          </motion.div>
        </div>
      </section>

      {/* Programa */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold">
              El programa: del freelance aislado al gremio estructurado
            </h2>

            <Card className="mb-8 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="pt-6">
                <p className="mb-6 text-lg">
                  Si eres desarrollador independiente...
                </p>
                <ul className="space-y-3">
                  {[
                    "Si nunca te han tomado en serio tus ideas.",
                    'Si estás harto de que siempre haya "presupuesto" para replicar lo de afuera, pero no para construir lo nuestro.',
                    "Si quieres formar parte del primer portafolio latinoamericano de desarrolladores unidos.",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-left"
                    >
                      <CheckCircle
                        className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cuota única</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">$250 MXN</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Para sostener la base operativa y legal del gremio.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Representación</CardTitle>
                </CardHeader>
                <CardContent>
                  <Users
                    className="mb-2 h-8 w-8 text-primary"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-muted-foreground">
                    Acceso a UNO: identidad profesional respaldada por TAMV.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ecosistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <Globe
                    className="mb-2 h-8 w-8 text-primary"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-muted-foreground">
                    Acceso a Metaverso, ALAMEXA, Isabella y metagobernanza.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Sistemas Centinela */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <header className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold">
              La malla invisible: sistemas centinela
            </h2>
            <p className="text-muted-foreground">
              La fuerza de TAMV no es solo visible en sus productos, sino en su
              infraestructura conceptual y técnica.
            </p>
          </header>

          <motion.div
            className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {sentinelSystems.map(({ name, description, icon: Icon, colorClass }) => (
              <motion.div key={name} variants={fadeInUp}>
                <Card className="h-full text-center transition-shadow hover:shadow-lg">
                  <CardContent className="pt-6">
                    <Icon
                      className={`mx-auto mb-4 h-12 w-12 ${colorClass}`}
                      aria-hidden="true"
                    />
                    <h3 className="mb-2 font-bold">{name}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Identidad y Gobernanza */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Identidad, gobierno y memoria viva
          </h2>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Lock className="h-6 w-6 text-primary" aria-hidden="true" />
                  ID-NVIDA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sistema de identidad distribuida y verificada que registra
                  usuarios, desarrolladores y entidades, integra reputación y
                  credenciales técnicas.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Code className="h-6 w-6 text-primary" aria-hidden="true" />
                  EOCT Codex
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Codex fundacional de Edwin Oswaldo Castillo Trejo. Agrupa
                  principios, reglas y algoritmos como columna vertebral ética y
                  técnica.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" aria-hidden="true" />
                  Metagobernanza
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Capa que define cómo se gobierna TAMV: propuestas, votaciones,
                  documentación y auditoría de decisiones.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Heart className="h-6 w-6 text-primary" aria-hidden="true" />
                  KÓRIMA Codex
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Corazón documental y filosófico del ecosistema. Isabella AI lo
                  interpreta para actuar como conciencia operativa.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* DevHub */}
      <section
        id="devhub"
        className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20"
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="mx-auto max-w-4xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <header className="mb-12 text-center">
              <span className="mb-4 inline-block rounded-full bg-primary/20 px-4 py-2 font-medium text-primary">
                DevHub
              </span>
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                La historia detrás del código
              </h2>
              <p className="text-muted-foreground">
                El origen de quien construye este ecosistema
              </p>
            </header>

            <Card className="overflow-hidden border-primary/30">
              <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/30">
                    <Shield
                      className="h-8 w-8 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      De Anubis Villaseñor a Edwin Oswaldo Castillo Trejo
                    </h3>
                    <p className="text-muted-foreground">
                      El guardián que se convirtió en arquitecto
                    </p>
                  </div>
                </div>
              </div>

              <CardContent className="space-y-6 pt-8">
                {/* texto devhub mantiene tu narrativa */}
                {/* ... (mantener tal cual tu bloque de texto, ya está bien) */}
                {/* Para ahorrar espacio aquí, lo dejo igual que el tuyo */}
                {/* Puedes pegar íntegro el bloque DevHub que ya tienes */}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Visión Estratégica */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Visión estratégica: los ojos del TAMV
          </h2>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            <Card className="border-amber-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Eye
                    className="h-8 w-8 text-amber-500"
                    aria-hidden="true"
                  />
                  Ojo de Ra
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  <strong>Radar externo.</strong> Monitorea amenazas, ataques,
                  cambios regulatorios, movimientos de mercado y factores
                  externos que puedan impactar al ecosistema. Alimenta
                  protocolos de defensa y ajustes estratégicos.
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Sparkles
                    className="h-8 w-8 text-emerald-500"
                    aria-hidden="true"
                  />
                  Ojo de Quetzalcóatl
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  <strong>Radar interno-evolutivo.</strong> Detecta patrones de
                  uso, innovación emergente en la comunidad y nuevas
                  oportunidades tecnológicas. Sugiere rutas de expansión y
                  nuevos módulos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Protocolos */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Protocolos de transformación y resiliencia
          </h2>

          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
            {protocols.map(({ name, description, icon }) => (
              <Card key={name} className="text-center">
                <CardContent className="pt-6">
                  <span className="mb-4 block text-4xl" aria-hidden="true">
                    {icon}
                  </span>
                  <h3 className="mb-2 font-bold">{name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resumen Final */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-8 text-3xl font-bold">
              ¿Qué es TAMV ONLINE NETWORK?
            </h2>

            <div className="mb-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-muted/50 p-6">
                <Code
                  className="mx-auto mb-4 h-10 w-10 text-primary"
                  aria-hidden="true"
                />
                <h3 className="mb-2 font-bold">Plataformas reales</h3>
                <p className="text-sm text-muted-foreground">
                  Metaverso, ALAMEXA, UNO, Isabella y más.
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-6">
                <Shield
                  className="mx-auto mb-4 h-10 w-10 text-primary"
                  aria-hidden="true"
                />
                <h3 className="mb-2 font-bold">Sistemas centinela</h3>
                <p className="text-sm text-muted-foreground">
                  Radares y protocolos que cuidan la integridad.
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-6">
                <Users
                  className="mx-auto mb-4 h-10 w-10 text-primary"
                  aria-hidden="true"
                />
                <h3 className="mb-2 font-bold">Gremio respaldado</h3>
                <p className="text-sm text-muted-foreground">
                  Representación legal y empresarial para devs.
                </p>
              </div>
            </div>

            <blockquote className="mb-8 rounded-r-lg border-l-4 border-primary bg-primary/5 py-4 pl-6 text-left">
              <p className="text-lg italic">
                "TAMV ONLINE NETWORK es un grito en la cara de la narrativa que
                dice que Latinoamérica solo sirve para consumir y producir
                barato."
              </p>
            </blockquote>

            <p className="mb-8 text-lg text-muted-foreground">
              No promete hacerte rico en tres meses. Promete algo más duro y más
              grande:{" "}
              <strong className="text-foreground">
                Un lugar donde tu código pueda sumar a algo que lleve el nombre
                de los latinos a la historia del internet
              </strong>
              , con estructura, documentación y visión para sostenerlo.
            </p>

            <div className="rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 p-8">
              <p className="mb-6 text-xl">
                Si estás a punto de renunciar a tu proyecto por falta de apoyo,
                pero todavía tienes una chispa de rabia y ganas de demostrar que{" "}
                <strong>sí se puede desde aquí</strong>...
              </p>
              <Button size="lg" asChild>
                <Link to="/auth">
                  Únete a TAMV ONLINE NETWORK
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © {year} TAMV ONLINE NETWORK. Todos los derechos reservados.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Orgullosamente desarrollado desde México por Edwin Oswaldo Castillo
            Trejo.
          </p>
        </div>
      </footer>
    </div>
  );
}

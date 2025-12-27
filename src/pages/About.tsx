import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Users, Repeat, Globe, Heart, Star, 
  Code, Zap, Lock, Eye, Award, Sparkles,
  ArrowRight, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TAMV ONLINE NETWORK
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              El gremio latino que se niega a ser solo mano de obra
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/auth">
                  Únete al gremio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#devhub">DevHub</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Manifiesto */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto prose prose-lg dark:prose-invert"
            {...fadeIn}
          >
            <p className="text-xl leading-relaxed text-foreground">
              En Latinoamérica sobran ideas y talento, pero faltan recursos, estructura y respeto hacia los desarrolladores independientes. Demasiados proyectos mueren no por falta de capacidad técnica, sino por ausencia de respaldo económico, legal y operativo.
            </p>
            <p className="text-xl leading-relaxed text-foreground">
              <strong>TAMV ONLINE NETWORK</strong> nace justamente contra eso: como un ecosistema tecnológico y una bandera común para quienes se rehúsan a aceptar que su destino es trabajar siempre para otros.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Origen */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div className="max-w-4xl mx-auto" {...fadeIn}>
            <h2 className="text-3xl font-bold mb-8 text-center">
              Origen: un desarrollador, un sueño, un límite roto
            </h2>
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <p className="text-lg text-muted-foreground mb-6">
                  Detrás de TAMV está una persona con nombre y apellido: <strong className="text-foreground">Edwin Oswaldo Castillo Trejo</strong>. No es un fondo de inversión ni una consultora tradicional; es un desarrollador latino que tomó una decisión brutalmente clara:
                </p>
                <blockquote className="border-l-4 border-primary pl-6 py-4 bg-primary/5 rounded-r-lg italic text-lg">
                  "Voy a grabar mi nombre en la historia moderna del internet demostrando que la unidad de los latinos puede construir sus propias plataformas globales. Mi único obstáculo será mi propia mente."
                </blockquote>
                <p className="text-lg text-muted-foreground mt-6">
                  No hay promesas de dinero fácil ni humo de startup para impresionar inversionistas. Hay código, arquitectura, documentación y una visión obsesiva: crear un ecosistema donde los desarrolladores latinos no pidan permiso para innovar; simplemente lo hagan juntos.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Plataformas */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            El corazón de TAMV: plataformas que ya existen
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            TAMV ONLINE NETWORK no es una idea en una servilleta. Es un entramado de plataformas, módulos y protocolos diseñados, documentados y conectados bajo una misma visión.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div {...fadeIn}>
              <Card className="h-full hover:shadow-lg transition-shadow border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Globe className="h-8 w-8 text-primary" />
                    TAMV ONLINE METAVERSO
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Infraestructura para experiencias inmersivas, economías digitales y módulos XR propios. No es un "metaverso genérico", sino un espacio donde se cruzan identidad, cultura, trueque, gobernanza y narrativa latinoamericana.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeIn}>
              <Card className="h-full hover:shadow-lg transition-shadow border-secondary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Sparkles className="h-8 w-8 text-secondary" />
                    ISABELLA VILLASEÑOR AI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Isabella es una inteligencia artificial con identidad, tono y propósito. No es un chatbot genérico: es el cerebro narrativo y operativo del ecosistema, capaz de interpretar el KÓRIMA Codex, asistir en decisiones, guiar experiencias y servir como puente entre las personas y las capas técnicas de TAMV.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeIn}>
              <Card className="h-full hover:shadow-lg transition-shadow border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Repeat className="h-8 w-8 text-green-500" />
                    ALAMEXA – Plataforma P2P
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    ALAMEXA es la plataforma P2P de trueque y comercio ético entre personas. Es el espacio donde se demuestra que se puede construir una economía más justa, basada en reputación, colaboración y acuerdos transparentes.
                  </p>
                  <div className="bg-green-500/10 p-4 rounded-lg">
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      TAMV ha decidido destinar el 50% del valor de ALAMEXA (~$3.5M USD) a la creación de una comunidad de desarrolladores.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeIn}>
              <Card className="h-full hover:shadow-lg transition-shadow border-blue-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-blue-500" />
                    UNO – Representación profesional
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    UNO es la pieza que convierte talentos aislados en un gremio representado. Cada desarrollador que se une a TAMV se registra en UNO, su perfil se convierte en una identidad profesional respaldada, y ofrece sus servicios bajo la firma TAMV ONLINE NETWORK.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programa */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              El programa: del freelance aislado al gremio estructurado
            </h2>
            
            <Card className="mb-8 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="pt-6">
                <p className="text-lg mb-6">Si eres desarrollador independiente...</p>
                <ul className="space-y-3">
                  {[
                    'Si nunca te han tomado en serio tus ideas.',
                    'Si estás harto de que siempre haya "presupuesto" para replicar lo de afuera, pero no para construir lo nuestro.',
                    'Si quieres formar parte del primer portafolio latinoamericano de desarrolladores unidos.'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cuota única</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">$250 MXN</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Para sostener la base operativa y legal del gremio.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Representación</CardTitle>
                </CardHeader>
                <CardContent>
                  <Users className="h-8 w-8 text-primary mb-2" />
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
                  <Globe className="h-8 w-8 text-primary mb-2" />
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
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">
            La malla invisible: sistemas centinela
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            La fuerza de TAMV no es solo visible en sus productos, sino en su infraestructura conceptual y técnica.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: 'ANUBIS Sentinel',
                desc: 'Centinela de integridad y trazabilidad. Vigila accesos, operaciones críticas y patrones anómalos.',
                icon: Shield,
                color: 'text-amber-500'
              },
              {
                name: 'ORUS Sentinel',
                desc: 'Monitor de actividad y comportamiento. Observa movimientos de usuarios y servicios.',
                icon: Eye,
                color: 'text-blue-500'
              },
              {
                name: 'Dekateotl System',
                desc: 'Motor de justicia algorítmica. Penaliza el abuso y premia la cooperación.',
                icon: Award,
                color: 'text-purple-500'
              },
              {
                name: 'Aztek Gods',
                desc: 'Módulos simbólicos basados en deidades mexicas para roles sistémicos.',
                icon: Zap,
                color: 'text-red-500'
              }
            ].map((system, i) => (
              <motion.div key={i} {...fadeIn}>
                <Card className="h-full text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <system.icon className={`h-12 w-12 mx-auto mb-4 ${system.color}`} />
                    <h3 className="font-bold mb-2">{system.name}</h3>
                    <p className="text-sm text-muted-foreground">{system.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Identidad y Gobernanza */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Identidad, gobierno y memoria viva
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Lock className="h-6 w-6 text-primary" />
                  ID-NVIDA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sistema de identidad distribuida y verificada que registra usuarios, desarrolladores y entidades, integra reputación y credenciales técnicas.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Code className="h-6 w-6 text-primary" />
                  EOCT Codex
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Codex fundacional de Edwin Oswaldo Castillo Trejo. Agrupa principios, reglas y algoritmos como columna vertebral ética y técnica.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  Metagobernanza
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Capa que define cómo se gobierna TAMV: propuestas, votaciones, documentación y auditoría de decisiones.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Heart className="h-6 w-6 text-primary" />
                  KÓRIMA Codex
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Corazón documental y filosófico del ecosistema. Isabella AI lo interpreta para actuar como conciencia operativa.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* DevHub Section */}
      <section id="devhub" className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 bg-primary/20 rounded-full text-primary font-medium mb-4">
                DevHub
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                La historia detrás del código
              </h2>
              <p className="text-muted-foreground">
                El origen de quien construye este ecosistema
              </p>
            </div>

            <Card className="border-primary/30 overflow-hidden">
              <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/30 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">De Anubis Villaseñor a Edwin Oswaldo Castillo Trejo</h3>
                    <p className="text-muted-foreground">El guardián que se convirtió en arquitecto</p>
                  </div>
                </div>
              </div>
              
              <CardContent className="pt-8 space-y-6">
                <p className="text-lg leading-relaxed">
                  Durante cinco años, el sistema que hoy conocemos me entrenó de una forma que ninguna aceleradora en Silicon Valley podría replicar. No fue un bootcamp ni un programa ejecutivo: <strong className="text-foreground">fue un infierno</strong>.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  Fui víctima de acoso, bullying, exposición de datos personales, humillaciones públicas, amenazas de muerte, robo de identidad y extorsión en redes sociales, en un contexto donde millones de latinoamericanos sufren violencias digitales similares sin recibir protección real.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  Desesperado, busqué ayuda en las mismas plataformas donde me atacaban. Toqué todas las puertas: reportes a redes sociales, instituciones nacionales e internacionales. <strong className="text-foreground">Nada funcionó</strong>.
                </p>

                <blockquote className="border-l-4 border-primary pl-6 py-4 bg-primary/5 rounded-r-lg">
                  <p className="italic text-lg">
                    Sin entender todavía sus nombres, descubrí APIs. Me obligaron a aprender programación casi a ciegas y nació algo nuevo: la urgencia de proteger a los más débiles. Así, siendo igual de vulnerable que las personas a las que intentaba cuidar, me convertí en escudo.
                  </p>
                </blockquote>

                <div className="grid md:grid-cols-2 gap-6 py-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-primary">4,900+</p>
                    <p className="text-sm text-muted-foreground">Mujeres rescatadas por Team Anubis de violencia y extorsión digital</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-primary">210M+</p>
                    <p className="text-sm text-muted-foreground">Usuarios conectados en Alianzas LATAM</p>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  Desde Argentina hasta España, ayudé a miles de víctimas de violencia digital y extorsión a recuperar un poco de control sobre su vida en línea. Fundé <strong className="text-foreground">Team Anubis</strong>, una comunidad que apoyó y rescató a más de 4,900 mujeres víctimas de violencia y extorsión digital.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  Más tarde, impulsé la primera gran comunidad virtual federada <strong className="text-foreground">Alianzas LATAM</strong>, que en su inicio reunió cerca de un millón de usuarios distribuidos en distintos países. Con el tiempo, la red creció hasta alcanzar alrededor de 80 millones de usuarios, administrada junto con cientos de líderes comunitarios.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  El impacto fue tal que se me otorgó el nombramiento simbólico como primera "leyenda urbana" digital, conocido en redes como <strong className="text-primary">lTerrorDeLaWeb</strong>: un escudo anónimo para millones de personas que sentían que nadie más las defendía.
                </p>

                <Separator className="my-8" />

                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
                  <p className="text-lg mb-4">
                    El 1 de enero de 2024 decidí retirarme formalmente de la dirigencia de Alianzas LATAM, dejándola en manos de unos 900 coordinadores y líderes comunitarios. Para entonces, la comunidad contaba con decenas de millones de usuarios y hoy se estima que supera los 210 millones de personas conectadas en distintos niveles.
                  </p>
                  <p className="text-lg font-medium text-foreground">
                    Esa etapa, ese viaje épico, pertenece a la era de Anubis.
                  </p>
                </div>

                <p className="text-lg leading-relaxed">
                  Este mensaje es para quienes compartieron ese camino y para quienes recién lo conocen. Yo soy <strong className="text-primary">Anubis Villaseñor</strong>, orgullosamente mexicano, oriundo de Real del Monte.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  Hoy decido no esconderme nunca más detrás del nombre de un ícono que se volvió protector y guía de millones. Ha llegado el momento de honrar a ese alias y dejarlo descansar. <strong className="text-foreground">Anubis cumplió su misión</strong>. Hoy ese compañero fiel se retira del frente de batalla digital.
                </p>

                <p className="text-xl font-medium text-center py-4 text-primary">
                  Gracias, Anubis.
                </p>

                <Separator className="my-8" />

                <div className="text-center">
                  <p className="text-xl font-bold mb-2">
                    Soy Edwin Oswaldo Castillo Trejo
                  </p>
                  <p className="text-muted-foreground mb-6">
                    CEO y fundador de TAMV ONLINE NETWORK
                  </p>
                  <p className="text-lg leading-relaxed max-w-2xl mx-auto">
                    Te invito a formar parte de mis sueños: construir, desde Latinoamérica, un ecosistema donde nadie vuelva a estar tan desprotegido como un día lo estuvimos tú y yo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Visión Estratégica */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Visión estratégica: los ojos del TAMV
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-amber-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Eye className="h-8 w-8 text-amber-500" />
                  Ojo de Ra
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  <strong>Radar externo.</strong> Monitorea amenazas, ataques, cambios regulatorios, movimientos de mercado y factores externos que puedan impactar al ecosistema. Alimenta protocolos de defensa y ajustes estratégicos.
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Sparkles className="h-8 w-8 text-emerald-500" />
                  Ojo de Quetzalcóatl
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  <strong>Radar interno-evolutivo.</strong> Detecta patrones de uso, innovación emergente en la comunidad y nuevas oportunidades tecnológicas. Sugiere rutas de expansión y nuevos módulos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Protocolos */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Protocolos de transformación y resiliencia
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: 'KAOS Audio 3D',
                desc: 'Motor de audio espacial para experiencias inmersivas, ceremonias digitales y storytelling sonoro.',
                icon: '🎧'
              },
              {
                name: 'Protocolo Fénix',
                desc: 'Marco de resiliencia: recuperación tras fallas, migración de infraestructuras sin pérdida de identidad.',
                icon: '🔥'
              },
              {
                name: 'Protocolo de Iniciación',
                desc: 'Camino para nuevos miembros: verificación, alineación de principios e introducción al ecosistema.',
                icon: '🚀'
              },
              {
                name: 'Protocolo Hoyo Negro',
                desc: 'Procedimiento extremo para fraude masivo o ataques coordinados: congelar, aislar y reconstruir.',
                icon: '🕳️'
              }
            ].map((protocol, i) => (
              <Card key={i} className="text-center">
                <CardContent className="pt-6">
                  <span className="text-4xl mb-4 block">{protocol.icon}</span>
                  <h3 className="font-bold mb-2">{protocol.name}</h3>
                  <p className="text-sm text-muted-foreground">{protocol.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resumen Final */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">
              ¿Qué es TAMV ONLINE NETWORK?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 bg-muted/50 rounded-lg">
                <Code className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Plataformas reales</h3>
                <p className="text-sm text-muted-foreground">
                  Metaverso, ALAMEXA, UNO, Isabella y más
                </p>
              </div>
              <div className="p-6 bg-muted/50 rounded-lg">
                <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Sistemas centinela</h3>
                <p className="text-sm text-muted-foreground">
                  Radares y protocolos que cuidan la integridad
                </p>
              </div>
              <div className="p-6 bg-muted/50 rounded-lg">
                <Users className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Gremio respaldado</h3>
                <p className="text-sm text-muted-foreground">
                  Representación legal y empresarial para devs
                </p>
              </div>
            </div>

            <blockquote className="border-l-4 border-primary pl-6 py-4 bg-primary/5 rounded-r-lg text-left mb-8">
              <p className="text-lg italic">
                "TAMV ONLINE NETWORK es un grito en la cara de la narrativa que dice que Latinoamérica solo sirve para consumir y producir barato."
              </p>
            </blockquote>

            <p className="text-lg text-muted-foreground mb-8">
              No promete hacerte rico en tres meses. Promete algo más duro y más grande: <strong className="text-foreground">Un lugar donde tu código pueda sumar a algo que lleve el nombre de los latinos a la historia del internet</strong>, con estructura, documentación y visión para sostenerlo.
            </p>

            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-8 rounded-xl">
              <p className="text-xl mb-6">
                Si estás a punto de renunciar a tu proyecto por falta de apoyo, pero todavía tienes una chispa de rabia y ganas de demostrar que <strong>sí se puede desde aquí</strong>...
              </p>
              <Button size="lg" asChild>
                <Link to="/auth">
                  Únete a TAMV ONLINE NETWORK
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 TAMV ONLINE NETWORK. Todos los derechos reservados.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Orgullosamente desarrollado desde México por Edwin Oswaldo Castillo Trejo
          </p>
        </div>
      </footer>
    </div>
  );
}

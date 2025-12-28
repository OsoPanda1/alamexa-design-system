import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-24 lg:py-32">
        <div className="mx-auto max-w-3xl">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>

          <div className="mb-8 flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Política de Privacidad
            </h1>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-lg">
              <strong>Última actualización:</strong> Diciembre 2024
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                1. Información que Recopilamos
              </h2>
              <p>
                En ALAMEXA, recopilamos la información necesaria para proporcionar
                nuestros servicios de trueque P2P de manera segura:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Información de cuenta:</strong> nombre, correo
                  electrónico, y datos de perfil que usted proporciona
                </li>
                <li>
                  <strong>Información de transacciones:</strong> historial de
                  trueques, productos publicados y calificaciones
                </li>
                <li>
                  <strong>Datos técnicos:</strong> información del dispositivo,
                  dirección IP y datos de navegación
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                2. Uso de la Información
              </h2>
              <p>Utilizamos su información para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Proporcionar y mejorar nuestros servicios</li>
                <li>Procesar transacciones y membresías</li>
                <li>Mantener la seguridad de la plataforma</li>
                <li>Comunicar actualizaciones y notificaciones importantes</li>
                <li>Gestionar el sistema de reputación</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                3. Protección de Datos
              </h2>
              <p>
                Implementamos medidas de seguridad técnicas y organizativas para
                proteger su información personal:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cifrado de datos en tránsito y en reposo</li>
                <li>Control de acceso basado en roles (RLS)</li>
                <li>Auditorías de seguridad regulares</li>
                <li>Monitoreo continuo de actividades sospechosas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                4. Compartir Información
              </h2>
              <p>
                No vendemos ni compartimos su información personal con terceros,
                excepto:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cuando sea necesario para completar una transacción</li>
                <li>Para cumplir con obligaciones legales</li>
                <li>Con su consentimiento explícito</li>
                <li>
                  Con proveedores de servicios que nos ayudan a operar la
                  plataforma
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                5. Sus Derechos
              </h2>
              <p>Usted tiene derecho a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Acceder a su información personal</li>
                <li>Solicitar la corrección de datos inexactos</li>
                <li>Solicitar la eliminación de su cuenta y datos</li>
                <li>Oponerse al procesamiento de sus datos</li>
                <li>Portabilidad de datos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                6. Cookies y Tecnologías Similares
              </h2>
              <p>
                Utilizamos cookies y tecnologías similares para mejorar su
                experiencia, recordar preferencias y analizar el uso de la
                plataforma. Puede gestionar sus preferencias de cookies a través
                de la configuración de su navegador.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                7. Retención de Datos
              </h2>
              <p>
                Conservamos su información personal mientras su cuenta esté
                activa o según sea necesario para proporcionarle nuestros
                servicios. Podemos retener cierta información por períodos más
                largos cuando sea requerido por ley o para fines legítimos de
                negocio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                8. Menores de Edad
              </h2>
              <p>
                ALAMEXA no está dirigido a menores de 18 años. No recopilamos
                intencionalmente información de menores. Si descubrimos que hemos
                recopilado información de un menor, tomaremos medidas para
                eliminarla.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                9. Cambios a esta Política
              </h2>
              <p>
                Podemos actualizar esta política periódicamente. Le notificaremos
                sobre cambios significativos a través de la plataforma o por
                correo electrónico.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                10. Contacto
              </h2>
              <p>
                Si tiene preguntas sobre esta política de privacidad o el
                tratamiento de sus datos, puede contactarnos a través de nuestros
                canales oficiales.
              </p>
            </section>
          </div>

          <div className="mt-12 flex gap-4">
            <Link to="/terms">
              <Button variant="outline">Ver Términos de Servicio</Button>
            </Link>
            <Link to="/">
              <Button>Volver al Inicio</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

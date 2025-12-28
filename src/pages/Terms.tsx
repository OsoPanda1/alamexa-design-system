import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
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

          <h1 className="mb-8 text-4xl font-bold text-foreground">
            Términos de Servicio
          </h1>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-lg">
              <strong>Última actualización:</strong> Diciembre 2024
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                1. Aceptación de los Términos
              </h2>
              <p>
                Al acceder y utilizar ALAMEXA, una plataforma de TAMV ONLINE NETWORK,
                usted acepta estar sujeto a estos Términos de Servicio. Si no está
                de acuerdo con alguna parte de estos términos, no podrá acceder al
                servicio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                2. Descripción del Servicio
              </h2>
              <p>
                ALAMEXA es una plataforma de trueque P2P (peer-to-peer) que permite
                a los usuarios intercambiar productos y servicios de manera segura
                y transparente. Nuestro sistema de reputación y membresías está
                diseñado para fomentar intercambios justos y confiables.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                3. Registro y Cuenta
              </h2>
              <p>
                Para utilizar ciertas funciones de ALAMEXA, debe registrarse y
                crear una cuenta. Usted es responsable de mantener la
                confidencialidad de su cuenta y contraseña, y acepta la
                responsabilidad de todas las actividades que ocurran bajo su
                cuenta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                4. Conducta del Usuario
              </h2>
              <p>Los usuarios se comprometen a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>No publicar contenido falso, fraudulento o engañoso</li>
                <li>Respetar los derechos de propiedad intelectual</li>
                <li>No utilizar la plataforma para actividades ilegales</li>
                <li>Mantener una comunicación respetuosa con otros usuarios</li>
                <li>Cumplir con los acuerdos de trueque establecidos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                5. Membresías y Pagos
              </h2>
              <p>
                ALAMEXA ofrece diferentes niveles de membresía. Los pagos
                realizados son procesados de forma segura y las membresías se
                activan inmediatamente tras la confirmación del pago. Los términos
                específicos de cada membresía se detallan en la página de planes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                6. Sistema de Reputación
              </h2>
              <p>
                El sistema de reputación de ALAMEXA está diseñado para fomentar la
                confianza entre usuarios. Las calificaciones deben ser honestas y
                reflejar la experiencia real del trueque. El abuso del sistema de
                reputación puede resultar en la suspensión de la cuenta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                7. Limitación de Responsabilidad
              </h2>
              <p>
                ALAMEXA actúa como intermediario tecnológico y no es responsable
                de las transacciones entre usuarios. Los usuarios son responsables
                de verificar la calidad y autenticidad de los productos antes de
                completar cualquier intercambio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                8. Modificaciones
              </h2>
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier
                momento. Los cambios serán notificados a través de la plataforma y
                el uso continuado del servicio constituye la aceptación de los
                nuevos términos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                9. Contacto
              </h2>
              <p>
                Para cualquier consulta sobre estos términos, puede contactarnos a
                través de nuestros canales oficiales en la plataforma.
              </p>
            </section>
          </div>

          <div className="mt-12 flex gap-4">
            <Link to="/privacy">
              <Button variant="outline">Ver Política de Privacidad</Button>
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useKYC, type DocumentType } from "@/hooks/useKYC";
import {
  Shield,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  Camera,
  FileText,
  User,
  Loader2,
  ArrowRight,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { id: 1, title: "Datos personales", icon: User },
  { id: 2, title: "Documentos", icon: FileText },
  { id: 3, title: "Selfie", icon: Camera },
  { id: 4, title: "Confirmación", icon: ShieldCheck },
];

const DOC_TYPES: { value: DocumentType; label: string }[] = [
  { value: "ine", label: "INE / IFE" },
  { value: "passport", label: "Pasaporte" },
  { value: "license", label: "Licencia de conducir" },
  { value: "cedula", label: "Cédula profesional" },
];

export default function KYCVerification() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    verification,
    loading,
    isVerified,
    isPending,
    canSubmit,
    startVerification,
    uploadDocument,
    submitForReview,
  } = useKYC();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    nationality: "Mexicana",
    documentType: "ine" as DocumentType,
    documentNumber: "",
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleStartVerification = async () => {
    if (!formData.fullName || !formData.dateOfBirth || !formData.documentNumber) return;
    setSubmitting(true);
    const result = await startVerification(formData);
    setSubmitting(false);
    if (result) setStep(2);
  };

  const handleUpload = async (
    type: "document_front" | "document_back" | "selfie" | "address_proof",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(type);
    await uploadDocument(type, file);
    setUploading(null);
  };

  const handleSubmitForReview = async () => {
    setSubmitting(true);
    const success = await submitForReview();
    setSubmitting(false);
    if (success) setStep(4);
  };

  // If already verified
  if (isVerified) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container-alamexa flex flex-col items-center justify-center pb-16 pt-28">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-success/10">
              <BadgeCheck className="h-12 w-12 text-success" />
            </div>
            <h1 className="text-headline mb-3">Cuenta Verificada</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              Tu identidad ha sido verificada exitosamente. Tienes acceso completo a todas las funciones de ALAMEXA.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate("/account")}>Mi Cuenta</Button>
              <Button variant="outline" onClick={() => navigate("/marketplace")}>
                Ir al Marketplace
              </Button>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container-alamexa pb-16 pt-28">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-headline mb-2">Verificación de Identidad</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Verifica tu identidad para desbloquear funciones premium, mayor confianza y límites extendidos en ALAMEXA.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-10 flex items-center justify-center gap-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isDone = step > s.id || (isVerified && s.id <= 4);
            return (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    isDone
                      ? "border-success bg-success/10 text-success"
                      : isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/30 text-muted-foreground"
                  }`}
                >
                  {isDone ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`hidden sm:block h-0.5 w-12 transition-all ${
                      isDone ? "bg-success" : "bg-border"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="mx-auto max-w-2xl">
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Data */}
            {step === 1 && !isPending && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="border-border/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Datos Personales
                    </CardTitle>
                    <CardDescription>
                      Ingresa tu información tal como aparece en tu documento oficial.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nombre completo *</Label>
                      <Input
                        id="fullName"
                        placeholder="Como aparece en tu identificación"
                        value={formData.fullName}
                        onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                        maxLength={100}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="dob">Fecha de nacimiento *</Label>
                        <Input
                          id="dob"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData((p) => ({ ...p, dateOfBirth: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nationality">Nacionalidad</Label>
                        <Input
                          id="nationality"
                          value={formData.nationality}
                          onChange={(e) => setFormData((p) => ({ ...p, nationality: e.target.value }))}
                          maxLength={50}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Tipo de documento *</Label>
                        <Select
                          value={formData.documentType}
                          onValueChange={(v) => setFormData((p) => ({ ...p, documentType: v as DocumentType }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DOC_TYPES.map((d) => (
                              <SelectItem key={d.value} value={d.value}>
                                {d.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="docNum">Número de documento *</Label>
                        <Input
                          id="docNum"
                          placeholder="Ej: 1234567890123"
                          value={formData.documentNumber}
                          onChange={(e) => setFormData((p) => ({ ...p, documentNumber: e.target.value }))}
                          maxLength={30}
                        />
                      </div>
                    </div>

                    <Button
                      className="w-full mt-4"
                      onClick={handleStartVerification}
                      disabled={submitting || !formData.fullName || !formData.dateOfBirth || !formData.documentNumber}
                    >
                      {submitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowRight className="mr-2 h-4 w-4" />
                      )}
                      Continuar
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Document Upload (or step 1 if isPending) */}
            {(step === 2 || (step === 1 && isPending)) && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="border-border/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Subir Documentos
                    </CardTitle>
                    <CardDescription>
                      Sube fotos claras de tu documento de identidad (frente y reverso).
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Document Front */}
                    <UploadField
                      label="Frente del documento *"
                      description="Foto clara del frente de tu identificación"
                      uploaded={!!verification?.document_front_url}
                      uploading={uploading === "document_front"}
                      onChange={(e) => handleUpload("document_front", e)}
                    />

                    {/* Document Back */}
                    <UploadField
                      label="Reverso del documento"
                      description="Foto del reverso (si aplica)"
                      uploaded={!!verification?.document_back_url}
                      uploading={uploading === "document_back"}
                      onChange={(e) => handleUpload("document_back", e)}
                    />

                    {/* Address Proof */}
                    <UploadField
                      label="Comprobante de domicilio"
                      description="Recibo de luz, agua o estado de cuenta (últimos 3 meses)"
                      uploaded={!!verification?.address_proof_url}
                      uploading={uploading === "address_proof"}
                      onChange={(e) => handleUpload("address_proof", e)}
                    />

                    <div className="flex gap-3">
                      {step === 2 && (
                        <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                          Atrás
                        </Button>
                      )}
                      <Button
                        className="flex-1"
                        onClick={() => setStep(3)}
                        disabled={!verification?.document_front_url}
                      >
                        Continuar <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Selfie */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="border-border/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Selfie de Verificación
                    </CardTitle>
                    <CardDescription>
                      Toma una foto de tu rostro sosteniendo tu documento de identidad junto a ti.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-xl border-2 border-dashed border-border bg-muted/20 p-8 text-center">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <Camera className="h-10 w-10 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        La foto debe mostrar tu rostro claramente junto a tu documento.
                      </p>

                      {verification?.selfie_url ? (
                        <Badge variant="outline" className="text-success border-success">
                          <CheckCircle2 className="mr-1 h-3 w-3" /> Selfie subida
                        </Badge>
                      ) : (
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            capture="user"
                            className="hidden"
                            onChange={(e) => handleUpload("selfie", e)}
                          />
                          <Button asChild variant="outline" disabled={uploading === "selfie"}>
                            <span>
                              {uploading === "selfie" ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Upload className="mr-2 h-4 w-4" />
                              )}
                              Subir selfie
                            </span>
                          </Button>
                        </label>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                        Atrás
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={handleSubmitForReview}
                        disabled={!canSubmit || submitting}
                      >
                        {submitting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ShieldCheck className="mr-2 h-4 w-4" />
                        )}
                        Enviar verificación
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle2 className="h-12 w-12 text-success" />
                </div>
                <h2 className="text-headline mb-3">¡Verificación Completada!</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Tu cuenta ha sido verificada. Ahora puedes disfrutar de todas las funciones premium de ALAMEXA.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate("/account")}>Ir a Mi Cuenta</Button>
                  <Button variant="outline" onClick={() => navigate("/marketplace")}>
                    Explorar Marketplace
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Card */}
          <Card className="mt-8 border-border/20 bg-muted/20">
            <CardContent className="flex items-start gap-4 p-6">
              <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">¿Por qué verificar tu identidad?</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Mayor confianza en tus trueques e intercambios</li>
                  <li>Acceso a funciones premium y límites más altos</li>
                  <li>Badge de verificación visible en tu perfil</li>
                  <li>Protección contra fraudes y disputas</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* Reusable upload field */
function UploadField({
  label,
  description,
  uploaded,
  uploading,
  onChange,
}: {
  label: string;
  description: string;
  uploaded: boolean;
  uploading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border/30 p-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted/30">
        {uploaded ? (
          <CheckCircle2 className="h-6 w-6 text-success" />
        ) : (
          <FileText className="h-6 w-6 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>
      <label className="cursor-pointer shrink-0">
        <input
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={onChange}
        />
        <Button asChild size="sm" variant={uploaded ? "outline" : "default"} disabled={uploading}>
          <span>
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : uploaded ? (
              "Cambiar"
            ) : (
              <>
                <Upload className="mr-1 h-3 w-3" /> Subir
              </>
            )}
          </span>
        </Button>
      </label>
    </div>
  );
}

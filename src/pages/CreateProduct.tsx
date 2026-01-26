import { useState, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useProducts, PRODUCT_CATEGORIES, PRODUCT_CONDITIONS, TRADE_TYPES } from "@/hooks/useProducts";
import { useMediaUpload, type UploadedMedia } from "@/hooks/useMediaUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X, Loader2, ImagePlus, Video, Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CreateProduct = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createProduct } = useProducts();
  const { uploadMultiple, uploading, progress } = useMediaUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    condition: "",
    price: "",
    original_price: "",
    location: "",
    trade_type: "both",
    trade_preferences: "",
  });

  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 10 - uploadedMedia.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    
    const results = await uploadMultiple(filesToUpload);
    setUploadedMedia(prev => [...prev, ...results]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeMedia = (index: number) => {
    setUploadedMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa el título y categoría.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    const imageUrls = uploadedMedia
      .filter(m => m.type === 'image')
      .map(m => m.url);

    const product = await createProduct({
      title: formData.title,
      description: formData.description || undefined,
      category: formData.category,
      subcategory: formData.subcategory || undefined,
      condition: formData.condition || undefined,
      price: formData.price ? parseFloat(formData.price) : undefined,
      original_price: formData.original_price ? parseFloat(formData.original_price) : undefined,
      location: formData.location || undefined,
      trade_type: formData.trade_type,
      trade_preferences: formData.trade_preferences || undefined,
      images: imageUrls.length > 0 ? imageUrls : undefined,
    });

    setLoading(false);

    if (product) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container-alamexa max-w-2xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>

          <Card className="bg-card/50 border-border/30">
            <CardHeader>
              <CardTitle className="text-foreground">Publicar Producto</CardTitle>
              <CardDescription>
                Comparte lo que tienes para truequear con la comunidad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    placeholder="¿Qué estás ofreciendo?"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="bg-muted/30"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe tu producto en detalle: estado, características, por qué lo intercambias..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={4}
                    className="bg-muted/30"
                  />
                </div>

                {/* Category & Condition */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Categoría *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleChange("category", value)}
                    >
                      <SelectTrigger className="bg-muted/30">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.icon} {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Condición</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) => handleChange("condition", value)}
                    >
                      <SelectTrigger className="bg-muted/30">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_CONDITIONS.map((cond) => (
                          <SelectItem key={cond.value} value={cond.value}>
                            {cond.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Trade Type */}
                <div className="space-y-2">
                  <Label>Tipo de intercambio</Label>
                  <Select
                    value={formData.trade_type}
                    onValueChange={(value) => handleChange("trade_type", value)}
                  >
                    <SelectTrigger className="bg-muted/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TRADE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price (if selling) */}
                {(formData.trade_type === 'venta' || formData.trade_type === 'both') && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Precio (MXN)</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => handleChange("price", e.target.value)}
                        className="bg-muted/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="original_price">Precio Original (opcional)</Label>
                      <Input
                        id="original_price"
                        type="number"
                        placeholder="0.00"
                        value={formData.original_price}
                        onChange={(e) => handleChange("original_price", e.target.value)}
                        className="bg-muted/30"
                      />
                    </div>
                  </div>
                )}

                {/* Trade Preferences */}
                <div className="space-y-2">
                  <Label htmlFor="trade_preferences">¿Qué te interesa recibir a cambio?</Label>
                  <Input
                    id="trade_preferences"
                    placeholder="Ej: Electrónicos, ropa, libros..."
                    value={formData.trade_preferences}
                    onChange={(e) => handleChange("trade_preferences", e.target.value)}
                    className="bg-muted/30"
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input
                    id="location"
                    placeholder="Ciudad, Estado"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className="bg-muted/30"
                  />
                </div>

                {/* Media Upload */}
                <div className="space-y-4">
                  <Label>Fotos y Videos (hasta 10 archivos)</Label>
                  
                  {/* Upload area */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*,audio/*"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <div className="flex justify-center gap-4 mb-4">
                      <ImagePlus className="h-8 w-8 text-muted-foreground" />
                      <Video className="h-8 w-8 text-muted-foreground" />
                      <Mic className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      Haz clic o arrastra archivos aquí
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Imágenes, videos o audio (máx. 50MB cada uno)
                    </p>
                  </div>

                  {/* Upload progress */}
                  {uploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subiendo...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  )}
                  
                  {/* Uploaded files preview */}
                  {uploadedMedia.length > 0 && (
                    <div className="grid grid-cols-4 gap-3">
                      {uploadedMedia.map((media, index) => (
                        <div
                          key={index}
                          className="relative group aspect-square rounded-lg overflow-hidden border border-border/30 bg-muted"
                        >
                          {media.type === 'image' ? (
                            <img
                              src={media.url}
                              alt={media.name}
                              className="w-full h-full object-cover"
                            />
                          ) : media.type === 'video' ? (
                            <video
                              src={media.url}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Mic className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeMedia(index)}
                            className="absolute top-1 right-1 p-1 bg-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3 text-destructive-foreground" />
                          </button>
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 text-[10px] bg-background/80 rounded capitalize">
                            {media.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="hero"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Publicando...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Publicar Producto
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateProduct;

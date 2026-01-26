import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface UploadedMedia {
  url: string;
  type: 'image' | 'video' | 'audio';
  name: string;
  size: number;
}

export function useMediaUpload() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File): Promise<UploadedMedia | null> => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Debes iniciar sesión para subir archivos.',
        variant: 'destructive',
      });
      return null;
    }

    // Validate file size (50MB max)
    if (file.size > 52428800) {
      toast({
        title: 'Archivo muy grande',
        description: 'El archivo no puede superar 50MB.',
        variant: 'destructive',
      });
      return null;
    }

    // Determine media type
    let mediaType: 'image' | 'video' | 'audio';
    if (file.type.startsWith('image/')) {
      mediaType = 'image';
    } else if (file.type.startsWith('video/')) {
      mediaType = 'video';
    } else if (file.type.startsWith('audio/')) {
      mediaType = 'audio';
    } else {
      toast({
        title: 'Tipo no soportado',
        description: 'Solo se permiten imágenes, videos y audio.',
        variant: 'destructive',
      });
      return null;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('product-media')
        .getPublicUrl(data.path);

      setProgress(100);

      return {
        url: urlData.publicUrl,
        type: mediaType,
        name: file.name,
        size: file.size,
      };
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Error al subir',
        description: 'No se pudo subir el archivo. Intenta de nuevo.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadMultiple = async (files: File[]): Promise<UploadedMedia[]> => {
    const results: UploadedMedia[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress(Math.round((i / files.length) * 100));
      
      const result = await uploadFile(file);
      if (result) {
        results.push(result);
      }
    }
    
    setProgress(100);
    return results;
  };

  const deleteFile = async (url: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Extract path from URL
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/product-media/');
      if (pathParts.length < 2) return false;
      
      const filePath = pathParts[1];

      const { error } = await supabase.storage
        .from('product-media')
        .remove([filePath]);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Error al eliminar',
        description: 'No se pudo eliminar el archivo.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    uploadFile,
    uploadMultiple,
    deleteFile,
    uploading,
    progress,
  };
}

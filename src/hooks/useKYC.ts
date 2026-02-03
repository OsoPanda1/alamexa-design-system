import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type VerificationLevel = 'none' | 'basic' | 'verified' | 'premium';
export type DocumentType = 'ine' | 'passport' | 'license' | 'cedula';

export interface KYCVerification {
  id: string;
  user_id: string;
  verification_level: VerificationLevel;
  full_name: string | null;
  date_of_birth: string | null;
  nationality: string | null;
  document_type: DocumentType | null;
  document_number: string | null;
  document_front_url: string | null;
  document_back_url: string | null;
  selfie_url: string | null;
  address_proof_url: string | null;
  verified_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useKYC() {
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [verification, setVerification] = useState<KYCVerification | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchVerification = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('kyc_verifications')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setVerification(data as KYCVerification | null);
    } catch (error) {
      console.error('Error fetching KYC:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerification();
  }, [user]);

  const startVerification = async (data: {
    fullName: string;
    dateOfBirth: string;
    nationality: string;
    documentType: DocumentType;
    documentNumber: string;
  }) => {
    if (!user) return null;

    try {
      const { data: kyc, error } = await supabase
        .from('kyc_verifications')
        .upsert({
          user_id: user.id,
          full_name: data.fullName,
          date_of_birth: data.dateOfBirth,
          nationality: data.nationality,
          document_type: data.documentType,
          document_number: data.documentNumber,
          verification_level: 'basic',
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Verificación iniciada',
        description: 'Ahora sube los documentos requeridos',
      });

      await fetchVerification();
      return kyc as KYCVerification;
    } catch (error) {
      console.error('Error starting KYC:', error);
      toast({
        title: 'Error',
        description: 'No se pudo iniciar la verificación',
        variant: 'destructive',
      });
      return null;
    }
  };

  const uploadDocument = async (
    type: 'document_front' | 'document_back' | 'selfie' | 'address_proof',
    file: File
  ) => {
    if (!user || !verification) return false;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${type}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-media')
        .getPublicUrl(fileName);

      const updateField = `${type}_url`;
      const { error } = await supabase
        .from('kyc_verifications')
        .update({ [updateField]: publicUrl })
        .eq('id', verification.id);

      if (error) throw error;

      toast({
        title: 'Documento subido',
        description: 'El documento se ha guardado correctamente',
      });

      await fetchVerification();
      return true;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Error',
        description: 'No se pudo subir el documento',
        variant: 'destructive',
      });
      return false;
    }
  };

  const submitForReview = async () => {
    if (!user || !verification) return false;

    // Check all required documents are uploaded
    if (!verification.document_front_url || !verification.selfie_url) {
      toast({
        title: 'Documentos faltantes',
        description: 'Por favor sube todos los documentos requeridos',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('kyc_verifications')
        .update({ verification_level: 'verified' })
        .eq('id', verification.id);

      if (error) throw error;

      // Update profile
      await supabase
        .from('profiles')
        .update({
          is_verified: true,
          kyc_level: 'verified',
        })
        .eq('user_id', user.id);

      toast({
        title: '¡Verificación completada!',
        description: 'Tu cuenta ha sido verificada exitosamente',
      });

      await fetchVerification();
      await refreshProfile();
      return true;
    } catch (error) {
      console.error('Error submitting for review:', error);
      return false;
    }
  };

  const isVerified = verification?.verification_level === 'verified' || verification?.verification_level === 'premium';
  const isPending = verification?.verification_level === 'basic';
  const canSubmit = verification && verification.document_front_url && verification.selfie_url;

  return {
    verification,
    loading,
    isVerified,
    isPending,
    canSubmit,
    startVerification,
    uploadDocument,
    submitForReview,
    refetch: fetchVerification,
  };
}

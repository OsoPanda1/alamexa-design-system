import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface FederationStatus {
  federated: boolean;
  local_user_id: string;
  global_subject_id: string | null;
  issuer: string;
  linked_at: string | null;
}

export function useFederation() {
  const { user } = useAuth();
  const [status, setStatus] = useState<FederationStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: link } = await supabase
        .from('federation_links')
        .select('*')
        .eq('local_user_id', user.id)
        .maybeSingle();

      setStatus({
        federated: !!(link as any)?.global_subject_id,
        local_user_id: user.id,
        global_subject_id: (link as any)?.global_subject_id || null,
        issuer: 'alamexa',
        linked_at: (link as any)?.linked_at || null,
      });
    } catch (error) {
      console.error('Federation status error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [user]);

  return { status, loading, refetch: fetchStatus };
}

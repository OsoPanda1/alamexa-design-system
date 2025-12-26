import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/config/routes';

export function useUserRole(): { role: UserRole; loading: boolean } {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<UserRole>('guest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      if (authLoading) return;
      
      if (!user) {
        setRole('guest');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user role:', error);
          setRole('user'); // Default to user if error
        } else if (data) {
          setRole(data.role as UserRole);
        } else {
          setRole('user'); // Default to user if no role found
        }
      } catch (err) {
        console.error('Error in fetchRole:', err);
        setRole('user');
      } finally {
        setLoading(false);
      }
    }

    fetchRole();
  }, [user, authLoading]);

  return { role, loading: loading || authLoading };
}

export function useIsAdmin(): boolean {
  const { role, loading } = useUserRole();
  return !loading && role === 'admin';
}

export function useIsModerator(): boolean {
  const { role, loading } = useUserRole();
  return !loading && (role === 'admin' || role === 'moderator');
}
